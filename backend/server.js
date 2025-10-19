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

// Validate and initialize API key securely
let openai;
try {
  const apiKey = security.initializeApiKey(process.env.OPENAI_API_KEY);
  openai = new OpenAI({ apiKey });
} catch (error) {
  console.error('❌ Security Error:', error.message);
  process.exit(1);
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
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // In production, specify allowed origins
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

// Body parsing with size limits
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

// Store conversation sessions (in production, use a proper database)
const sessions = new Map();

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'ChatKit Backend is running' });
});

// Health check for Docker
app.use('/api', healthRouter);

// Create a new chat session
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
    
    // Log session creation
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

// Send message to ChatKit
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
    
    // Call OpenAI API with enhanced security
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant for a sample website. Provide friendly, helpful responses to user questions about services, products, or general information. Keep responses concise and professional."
        },
        ...session.messages.slice(-10).map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ],
      max_tokens: 500,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });
    
    const aiResponse = completion.choices[0].message.content;
    
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
    const session = sessions.get(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json({
      sessionId,
      messages: session.messages
    });
  } catch (error) {
    console.error('Error getting session messages:', error);
    res.status(500).json({ error: 'Failed to get session messages' });
  }
});

// Delete session
app.delete('/api/session/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const deleted = sessions.delete(sessionId);
    
    if (deleted) {
      res.json({ message: 'Session deleted successfully' });
    } else {
      res.status(404).json({ error: 'Session not found' });
    }
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

// Session cleanup function (run every hour)
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ChatKit Backend running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/chat`);
});

module.exports = app;
