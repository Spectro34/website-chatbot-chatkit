# ChatKit Architecture Documentation

## System Overview

The ChatKit integration consists of three main components working together to provide AI-powered chat functionality that can be embedded into any website.

```
┌─────────────────┐    HTTP/HTTPS     ┌─────────────────┐    OpenAI API     ┌─────────────────┐
│   Frontend      │ ────────────────► │   Backend API   │ ────────────────► │   OpenAI GPT    │
│   Website       │                   │   (Node.js)     │                   │   (GPT-3.5)     │
└─────────────────┘                   └─────────────────┘                   └─────────────────┘
        │                                      │
        │                                      │
        ▼                                      ▼
┌─────────────────┐                   ┌─────────────────┐
│   Chat Widget   │                   │  Session Store  │
│   (JavaScript)  │                   │  (In-Memory)    │
└─────────────────┘                   └─────────────────┘
```

## Component Architecture

### 1. Frontend Chat Widget

**Technology**: Vanilla JavaScript, HTML5, CSS3  
**Purpose**: User interface for chat interactions  
**Location**: `sample-website/index.html`

#### Key Features:
- **Self-contained**: No external dependencies
- **Responsive**: Works on desktop, tablet, mobile
- **Pluggable**: Can be added to any website
- **Customizable**: Easy to style and modify

#### Core Functions:
```javascript
// Session management
async function createSession()

// UI controls
function toggleChat()
function openChat()
function closeChat()

// Message handling
function addMessage(sender, message, type)
async function sendMessage()

// Event handling
function handleKeyPress(event)
```

#### HTML Structure:
```html
<!-- Chat Toggle Button -->
<button class="chat-toggle" onclick="toggleChat()">💬</button>

<!-- Chat Panel -->
<div class="chat-panel" id="chatPanel">
    <div class="chat-header">
        <h3>AI Assistant</h3>
        <button onclick="closeChat()">×</button>
    </div>
    <div class="chat-messages" id="chatMessages"></div>
    <div class="chat-input-area">
        <input type="text" id="chatInput" placeholder="Type your message...">
        <button onclick="sendMessage()">Send</button>
    </div>
</div>
```

#### CSS Architecture:
```css
/* Base styles */
.chat-toggle { /* Floating action button */ }
.chat-panel { /* Chat container */ }
.chat-header { /* Header with title and close button */ }
.chat-messages { /* Scrollable message area */ }
.chat-input-area { /* Input controls */ }

/* Message styles */
.message { /* Base message styling */ }
.message.user { /* User message styling */ }
.message.bot { /* Bot message styling */ }

/* Responsive design */
@media (max-width: 480px) { /* Mobile adaptations */ }
```

### 2. Backend API Server

**Technology**: Node.js, Express.js, OpenAI JavaScript SDK  
**Purpose**: Handle chat requests and manage AI interactions  
**Location**: `backend/server.js`

#### Architecture:
```javascript
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Session storage (in production: Redis/Database)
const sessions = new Map();
```

#### API Endpoints:

##### Health Check
```javascript
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'ChatKit Backend is running' });
});
```

##### Create Session
```javascript
app.post('/api/create-session', async (req, res) => {
    const sessionId = generateSessionId();
    const session = {
        id: sessionId,
        createdAt: new Date(),
        messages: []
    };
    sessions.set(sessionId, session);
    res.json({ sessionId, message: 'Session created successfully' });
});
```

##### Chat Endpoint (Core AI Integration)
```javascript
app.post('/api/chat', async (req, res) => {
    const { sessionId, message } = req.body;
    
    // Get session and add user message
    let session = sessions.get(sessionId);
    session.messages.push({
        role: 'user',
        content: message,
        timestamp: new Date()
    });
    
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "You are a helpful AI assistant for a sample website..."
            },
            ...session.messages.slice(-10) // Last 10 messages for context
        ],
        max_tokens: 500,
        temperature: 0.7
    });
    
    const aiResponse = completion.choices[0].message.content;
    
    // Store AI response and return
    session.messages.push({
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
    });
    
    res.json({ sessionId, response: aiResponse, timestamp: new Date() });
});
```

#### Session Management:
```javascript
// Session structure
const session = {
    id: 'session_abc123_1234567890',
    createdAt: new Date(),
    messages: [
        {
            role: 'user',
            content: 'Hello',
            timestamp: new Date()
        },
        {
            role: 'assistant',
            content: 'Hi! How can I help you?',
            timestamp: new Date()
        }
    ]
};
```

### 3. OpenAI Integration

**Technology**: OpenAI JavaScript SDK  
**Purpose**: Provide AI-powered responses  
**Model**: GPT-3.5-turbo

#### Configuration:
```javascript
const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",        // AI model
    max_tokens: 500,               // Response length limit
    temperature: 0.7,              // Creativity level (0-1)
    messages: [...]                // Conversation context
});
```

#### System Prompt:
```javascript
{
    role: "system",
    content: "You are a helpful AI assistant for a sample website. Provide friendly, helpful responses to user questions about services, products, or general information."
}
```

#### Context Management:
- **Message History**: Last 10 messages maintained for context
- **Role-based Messages**: User messages as 'user', AI responses as 'assistant'
- **Timestamp Tracking**: Each message includes creation timestamp
- **Session Persistence**: Conversations persist until session deletion

## Data Flow

### 1. Initialization Flow
```
Page Load → Create Session → Backend API → Session ID → Frontend Ready
```

### 2. Message Flow
```
User Types Message
        ↓
Frontend: addMessage('You', message, 'user')
        ↓
Frontend: fetch('/api/chat', { sessionId, message })
        ↓
Backend: Add user message to session
        ↓
Backend: Call OpenAI API with context
        ↓
OpenAI: Generate response using GPT-3.5
        ↓
Backend: Store AI response in session
        ↓
Backend: Return response to frontend
        ↓
Frontend: addMessage('AI Assistant', response, 'bot')
```

### 3. Error Handling Flow
```
Error Occurs → Catch Block → Log Error → Return Error Message → Display to User
```

## Security Architecture

### 1. API Key Protection
```javascript
// Environment variable (never in code)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Secure storage
});
```

### 2. CORS Configuration
```javascript
app.use(cors({
    origin: ['https://your-website.com'],
    credentials: true
}));
```

### 3. Input Validation
```javascript
// Basic validation
if (!message || message.length > 1000) {
    return res.status(400).json({ error: 'Invalid message' });
}
```

### 4. Session Security
- **Unique Session IDs**: Randomly generated identifiers
- **No Sensitive Data**: Only conversation history stored
- **Automatic Cleanup**: Sessions can be deleted

## Performance Architecture

### 1. Frontend Optimizations
- **Lazy Loading**: Chat widget loads only when needed
- **Message Limiting**: UI shows only recent messages
- **Efficient DOM Updates**: Minimal re-rendering
- **CSS Animations**: Smooth transitions

### 2. Backend Optimizations
- **Context Window**: Only last 10 messages sent to OpenAI
- **Connection Pooling**: Express handles automatically
- **Memory Management**: Sessions stored in Map (production: Redis)

### 3. API Optimizations
- **Token Limits**: `max_tokens: 500` prevents long responses
- **Temperature Control**: `temperature: 0.7` balances creativity/consistency
- **Model Selection**: GPT-3.5-turbo for cost-effectiveness

## Scalability Architecture

### 1. Horizontal Scaling
```
Load Balancer → Multiple Backend Instances → Shared Session Store (Redis)
```

### 2. Database Integration
```javascript
// Production session storage
const redis = require('redis');
const client = redis.createClient();

// Store session
await client.setex(`session:${sessionId}`, 3600, JSON.stringify(session));

// Retrieve session
const sessionData = await client.get(`session:${sessionId}`);
```

### 3. CDN Integration
```html
<!-- Static assets served from CDN -->
<script src="https://cdn.your-domain.com/chatkit-widget.js"></script>
```

## Deployment Architecture

### 1. Development Environment
```
Local Machine → Backend (localhost:3001) → OpenAI API
             → Frontend (localhost:8080) → Backend API
```

### 2. Production Environment
```
User Browser → CDN → Frontend (Static Hosting)
            → Load Balancer → Backend (Cloud)
            → Database (Redis/PostgreSQL)
            → OpenAI API
```

### 3. Environment Configuration
```bash
# Development
NODE_ENV=development
OPENAI_API_KEY=sk-proj-...
PORT=3001

# Production
NODE_ENV=production
OPENAI_API_KEY=sk-proj-...
PORT=3001
CORS_ORIGIN=https://your-website.com
REDIS_URL=redis://your-redis-instance
```

## Monitoring and Logging

### 1. Application Logs
```javascript
console.log('ChatKit Backend: Session created:', sessionId);
console.error('ChatKit Backend: Error:', error);
```

### 2. Health Monitoring
```javascript
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date(),
        uptime: process.uptime()
    });
});
```

### 3. Error Tracking
```javascript
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
```

## Testing Architecture

### 1. Unit Tests
```javascript
// Test session creation
test('creates session successfully', async () => {
    const response = await request(app)
        .post('/api/create-session')
        .expect(200);
    
    expect(response.body.sessionId).toBeDefined();
});
```

### 2. Integration Tests
```javascript
// Test chat flow
test('handles complete chat flow', async () => {
    // Create session
    const sessionResponse = await createSession();
    
    // Send message
    const chatResponse = await sendMessage(sessionResponse.sessionId, 'Hello');
    
    expect(chatResponse.response).toBeDefined();
});
```

### 3. End-to-End Tests
```javascript
// Test frontend integration
test('chat widget works on website', async () => {
    await page.goto('http://localhost:8080');
    await page.click('.chat-toggle');
    await page.type('#chatInput', 'Hello');
    await page.click('.send-button');
    
    await expect(page.locator('.message.bot')).toBeVisible();
});
```

## Future Architecture Enhancements

### 1. Advanced Features
- **Streaming Responses**: Real-time message streaming
- **File Attachments**: Support for images/documents
- **Voice Interface**: Speech-to-text and text-to-speech
- **Multi-modal**: Image analysis and generation

### 2. Scalability Improvements
- **Microservices**: Split into smaller services
- **Event-driven**: Use message queues
- **Caching**: Redis for session and response caching
- **CDN**: Global content delivery

### 3. Security Enhancements
- **Rate Limiting**: Prevent API abuse
- **Authentication**: User authentication system
- **Encryption**: End-to-end message encryption
- **Audit Logging**: Comprehensive activity tracking

## Conclusion

This architecture provides a robust, scalable, and maintainable foundation for AI-powered chatbot integration. The modular design allows for easy customization, deployment, and scaling while maintaining security and performance standards.

The system is designed to be:
- **Modular**: Clear separation of concerns
- **Scalable**: Easy to extend and scale
- **Secure**: Proper API key management and input validation
- **Maintainable**: Clean code structure and documentation
- **Pluggable**: Easy integration into any website
