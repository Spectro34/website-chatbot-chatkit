const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');
const SecurityManager = require('./security');
const healthRouter = require('./health');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize security manager
const security = new SecurityManager();

// Ollama configuration
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama2';
const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY || 'ollama'; // Ollama doesn't require API key by default

// OpenAI fallback configuration
let openai;
try {
  const apiKey = security.initializeApiKey(process.env.OPENAI_API_KEY);
  openai = new OpenAI({ apiKey });
} catch (error) {
  console.warn('⚠️ OpenAI API key not configured - Ollama will be required');
}

// Validate Ollama connection (optional)
async function validateOllamaConnection() {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Ollama connection validated');
      console.log(`📋 Available models: ${data.models?.map(m => m.name).join(', ') || 'None'}`);
      return true;
    } else {
      throw new Error(`Ollama API returned status: ${response.status}`);
    }
  } catch (error) {
    console.warn('⚠️ Ollama not available, falling back to OpenAI');
    console.warn(`💡 To use Ollama: Install with 'brew install ollama' and run 'ollama serve'`);
    console.warn(`💡 Then pull a model: 'ollama pull llama2'`);
    return false;
  }
}

// Security middleware
app.use((req, res, next) => {
  // Add security headers
  Object.entries(security.getSecurityHeaders()).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  next();
});

// CORS configuration with security
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:8080', 'http://localhost:3000'];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      security.logSecurityEvent('CORS_BLOCKED', { origin, ip: req.ip });
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting middleware
app.use((req, res, next) => {
  const clientId = req.ip || 'unknown';
  const rateLimit = security.checkRateLimit(clientId);
  
  if (!rateLimit.allowed) {
    security.logSecurityEvent('RATE_LIMIT_EXCEEDED', {
      clientId,
      reason: rateLimit.reason,
      retryAfter: rateLimit.retryAfter
    });
    
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: rateLimit.reason,
      retryAfter: rateLimit.retryAfter
    });
  }
  
  next();
});

// In-memory session storage (in production, use Redis or database)
const sessions = new Map();

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ChatKit Backend with Ollama is running',
    provider: 'Ollama',
    model: OLLAMA_MODEL,
    baseUrl: OLLAMA_BASE_URL
  });
});

// Health check for Docker
app.use('/api', healthRouter);

// Create new chat session
app.post('/api/create-session', async (req, res) => {
  try {
    const sessionId = security.generateSecureSessionId();
    const session = {
      id: sessionId,
      createdAt: new Date(),
      lastActivity: new Date(),
      messages: [],
      ip: req.ip
    };
    
    sessions.set(sessionId, session);
    
    security.logSecurityEvent('SESSION_CREATED', { 
      sessionId, 
      ip: req.ip 
    });
    
    res.json({
      sessionId,
      message: 'Session created successfully'
    });
    
  } catch (error) {
    security.logSecurityEvent('SESSION_CREATION_ERROR', { 
      error: error.message, 
      ip: req.ip 
    });
    
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Send message to ChatKit with Ollama
app.post('/api/chat', async (req, res) => {
  try {
    const { sessionId, message } = req.body;
    
    // Input validation
    if (!sessionId || !message) {
      return res.status(400).json({ error: 'Session ID and message are required' });
    }

    // Validate session ID format
    if (!security.validateSessionId(sessionId)) {
      security.logSecurityEvent('INVALID_SESSION_ID', { sessionId, ip: req.ip });
      return res.status(400).json({ error: 'Invalid session ID format' });
    }

    // Sanitize input
    const sanitizedMessage = security.sanitizeInput(message);
    if (!sanitizedMessage) {
      return res.status(400).json({ error: 'Invalid message content' });
    }
    
    // Get or create session
    let session = sessions.get(sessionId);
    if (!session) {
      session = {
        id: sessionId,
        createdAt: new Date(),
        messages: [],
        lastActivity: new Date()
      };
      sessions.set(sessionId, session);
    }

    // Update last activity
    session.lastActivity = new Date();
    
    // Add user message to session
    session.messages.push({
      role: 'user',
      content: sanitizedMessage,
      timestamp: new Date()
    });

    // Limit conversation history for security and performance
    const maxMessages = 20;
    if (session.messages.length > maxMessages) {
      session.messages = session.messages.slice(-maxMessages);
    }
    
    // Prepare messages for Ollama (convert to Ollama format)
    const systemMessage = {
      role: "system",
      content: "You are a helpful AI assistant for a sample website. Provide friendly, helpful responses to user questions about services, products, or general information. Keep responses concise and professional."
    };
    
    const conversationMessages = [
      systemMessage,
      ...session.messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];
    
    let aiResponse;
    
    // Try Ollama first, fallback to OpenAI
    try {
      const ollamaResponse = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(OLLAMA_API_KEY && { 'Authorization': `Bearer ${OLLAMA_API_KEY}` })
        },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          messages: conversationMessages,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 500
          }
        })
      });
      
      if (ollamaResponse.ok) {
        const ollamaData = await ollamaResponse.json();
        aiResponse = ollamaData.message?.content || 'Sorry, I could not generate a response.';
      } else {
        throw new Error(`Ollama API error: ${ollamaResponse.status}`);
      }
    } catch (ollamaError) {
      // Fallback to OpenAI if available
      if (openai) {
        console.log('🔄 Ollama unavailable, using OpenAI fallback');
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: conversationMessages,
          max_tokens: 500,
          temperature: 0.7,
          presence_penalty: 0.1,
          frequency_penalty: 0.1
        });
        aiResponse = completion.choices[0].message.content;
      } else {
        throw new Error('Neither Ollama nor OpenAI is available. Please configure at least one.');
      }
    }
    
    // Sanitize AI response
    const sanitizedResponse = security.sanitizeInput(aiResponse);
    
    // Add AI response to session
    session.messages.push({
      role: 'assistant',
      content: sanitizedResponse,
      timestamp: new Date()
    });

    // Log successful interaction
    security.logSecurityEvent('CHAT_MESSAGE_PROCESSED', { 
      sessionId, 
      messageLength: sanitizedMessage.length,
      ip: req.ip 
    });
    
    res.json({
      sessionId,
      response: sanitizedResponse,
      timestamp: new Date()
    });
    
  } catch (error) {
    security.logSecurityEvent('CHAT_ERROR', { 
      error: error.message, 
      ip: req.ip 
    });
    
    console.error('Error processing chat message:', error);
    res.status(500).json({ 
      error: 'Failed to process message',
      message: 'An error occurred while processing your request'
    });
  }
});

// Get session messages
app.get('/api/session/:sessionId/messages', (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (!security.validateSessionId(sessionId)) {
      return res.status(400).json({ error: 'Invalid session ID format' });
    }
    
    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json({
      sessionId,
      messages: session.messages,
      createdAt: session.createdAt,
      lastActivity: session.lastActivity
    });
    
  } catch (error) {
    console.error('Error getting session messages:', error);
    res.status(500).json({ error: 'Failed to get session messages' });
  }
});

// Cleanup old sessions
function cleanupSessions() {
  const now = new Date();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours
  
  for (const [sessionId, session] of sessions.entries()) {
    if (now - session.lastActivity > maxAge) {
      sessions.delete(sessionId);
      security.logSecurityEvent('SESSION_CLEANUP', { sessionId });
    }
  }
}

// Run cleanup every hour
setInterval(cleanupSessions, 60 * 60 * 1000);

// Start server
async function startServer() {
  try {
    // Check if Ollama is available (optional)
    const isOllamaConnected = await validateOllamaConnection();
    
    app.listen(PORT, () => {
      console.log('🚀 ChatKit Backend running on port', PORT);
      console.log('📡 Health check:', `http://localhost:${PORT}/health`);
      console.log('💬 Chat endpoint:', `http://localhost:${PORT}/api/chat`);
      
      if (isOllamaConnected) {
        console.log('🤖 Using Ollama Model:', OLLAMA_MODEL);
        console.log('🔗 Ollama URL:', OLLAMA_BASE_URL);
      } else {
        console.log('⚠️ Ollama not available - using OpenAI fallback');
        console.log('💡 To use Ollama: Install with "brew install ollama" and run "ollama serve"');
      }
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down ChatKit Backend...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down ChatKit Backend...');
  process.exit(0);
});

// Start the server
startServer();
