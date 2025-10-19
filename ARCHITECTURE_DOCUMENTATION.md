# 🏗️ ChatKit Architecture Documentation

Comprehensive technical documentation for the ChatKit containerized AI chatbot system.

## 📋 Table of Contents

- [System Overview](#system-overview)
- [Container Architecture](#container-architecture)
- [Component Breakdown](#component-breakdown)
- [Data Flow](#data-flow)
- [Security Architecture](#security-architecture)
- [Deployment Architecture](#deployment-architecture)
- [Scalability & Performance](#scalability--performance)
- [Monitoring & Logging](#monitoring--logging)

## 🎯 System Overview

ChatKit is a production-ready, containerized AI chatbot system designed for easy integration into any website. It features a microservices architecture with three main components:

- **🧠 Ollama Container**: Local LLM inference engine
- **🌐 Website Container**: Frontend with ChatKit widget
- **🤖 ChatBot Container**: Backend API with AI integration

### Key Features
- ✅ **Containerized Deployment**: Docker-based microservices
- ✅ **Local LLM Support**: Ollama integration with OpenAI fallback
- ✅ **Universal Integration**: Works with any website
- ✅ **Production Ready**: Security, monitoring, and scalability
- ✅ **Easy Customization**: Flexible configuration and theming

## 🐳 Container Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                        Docker Network                          │
│                    (websitechatbot_chatbot-network)            │
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐ │
│  │   Website       │    │   ChatBot       │    │   Ollama    │ │
│  │   Container     │◄──►│   Container     │◄──►│   Container │ │
│  │                 │    │                 │    │             │ │
│  │ • Nginx         │    │ • Node.js API   │    │ • LLM Engine│ │
│  │ • Static Files  │    │ • Session Mgmt  │    │ • llama2    │ │
│  │ • ChatKit Widget│    │ • Security      │    │ • API Server│ │
│  │ • Port 8080     │    │ • Port 3001     │    │ • Port 11434│ │
│  └─────────────────┘    └─────────────────┘    └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Container Details

#### 1. Website Container (`sample-website-ollama`)
```yaml
Image: websitechatbot-sample-website
Base: nginx:alpine
Port: 8080
Purpose: Frontend and ChatKit widget serving
```

**Components:**
- **Nginx**: Web server and reverse proxy
- **Static Files**: HTML, CSS, JavaScript
- **ChatKit Widget**: Universal JavaScript widget
- **Integration Examples**: Demo pages

#### 2. ChatBot Container (`chatbot-backend-ollama`)
```yaml
Image: websitechatbot-chatbot-backend
Base: node:18-alpine
Port: 3001
Purpose: Backend API and AI integration
```

**Components:**
- **Express.js**: Web framework
- **Session Management**: User session handling
- **Security Manager**: Authentication and protection
- **Ollama Integration**: Local LLM communication
- **OpenAI Fallback**: Cloud AI backup

#### 3. Ollama Container (`ollama-server`)
```yaml
Image: ollama/ollama:latest
Port: 11434
Purpose: Local LLM inference
```

**Components:**
- **Ollama Server**: LLM serving engine
- **Model Storage**: Local model files
- **API Server**: HTTP API for inference
- **Model**: llama2:latest (configurable)

## 🔧 Component Breakdown

### Frontend Components

#### ChatKit Widget (`chatkit-widget.js`)
```javascript
// Core widget functionality
class ChatKit {
  constructor(config) {
    this.config = config;
    this.sessionId = null;
    this.isOpen = false;
  }
  
  init() { /* Initialize widget */ }
  open() { /* Open chat interface */ }
  close() { /* Close chat interface */ }
  sendMessage(message) { /* Send user message */ }
  receiveMessage(message) { /* Display AI response */ }
}
```

**Features:**
- Universal JavaScript widget
- Responsive design
- Customizable themes
- Event callbacks
- Multi-language support

#### Sample Website (`sample-website/`)
```
sample-website/
├── index.html              # Main demo page
├── styles.css              # Styling
├── nginx.conf              # Nginx configuration
├── Dockerfile              # Container build
└── examples/               # Integration examples
    └── any-website-integration.html
```

### Backend Components

#### API Server (`backend/server-ollama.js`)
```javascript
// Main server file
const express = require('express');
const SecurityManager = require('./security');
const app = express();

// Middleware
app.use(security.middleware());
app.use(cors(corsOptions));
app.use(rateLimit());

// Routes
app.post('/api/create-session', createSession);
app.post('/api/chat', handleChat);
app.get('/api/session/:id/messages', getMessages);
```

**Key Features:**
- RESTful API design
- Session management
- Rate limiting
- Input sanitization
- Error handling

#### Security Manager (`backend/security.js`)
```javascript
class SecurityManager {
  initializeApiKey(key) { /* Validate API key */ }
  checkRateLimit(clientId) { /* Rate limiting */ }
  sanitizeInput(input) { /* Input sanitization */ }
  generateSecureSessionId() { /* Session ID generation */ }
  getSecurityHeaders() { /* Security headers */ }
}
```

**Security Features:**
- API key validation
- Rate limiting (per IP, per session)
- Input sanitization (XSS prevention)
- CORS protection
- Security headers
- Session security

#### Health Check (`backend/health.js`)
```javascript
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});
```

### Ollama Integration

#### Model Configuration
```bash
# Environment variables
OLLAMA_BASE_URL=http://ollama-server:11434
OLLAMA_MODEL=llama2:latest
OLLAMA_API_KEY=ollama
```

#### API Communication
```javascript
// Ollama API call
const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: OLLAMA_MODEL,
    messages: conversationMessages,
    stream: false,
    options: { temperature: 0.7 }
  })
});
```

## 🔄 Data Flow

### 1. User Interaction Flow
```
User Input → ChatKit Widget → Backend API → Ollama/OpenAI → Response → Widget
```

### 2. Session Management Flow
```
1. User opens chat
2. Widget calls /api/create-session
3. Backend generates secure session ID
4. Session stored in memory with metadata
5. All subsequent messages use session ID
6. Session expires after 24 hours
```

### 3. Message Processing Flow
```
1. User types message
2. Widget validates input
3. Message sent to /api/chat with session ID
4. Backend validates session and sanitizes input
5. Message added to conversation history
6. Backend calls Ollama API
7. If Ollama fails, fallback to OpenAI
8. Response sanitized and returned
9. Widget displays response
10. Message added to UI history
```

### 4. Error Handling Flow
```
Error Occurs → Log Error → Check Error Type → 
├─ Network Error → Retry with backoff
├─ API Error → Return user-friendly message
├─ Security Error → Block request
└─ System Error → Fallback to OpenAI
```

## 🔒 Security Architecture

### Security Layers

#### 1. Network Security
- **Docker Network**: Isolated container communication
- **CORS**: Cross-origin request protection
- **Rate Limiting**: Request throttling per IP/session
- **Input Validation**: Request sanitization

#### 2. Application Security
- **API Key Protection**: Secure key management
- **Session Security**: Secure session handling
- **Input Sanitization**: XSS prevention
- **Output Encoding**: Response sanitization

#### 3. Container Security
- **Non-root User**: Containers run as non-root
- **Minimal Images**: Alpine Linux base images
- **Security Headers**: HTTP security headers
- **Resource Limits**: Memory and CPU limits

### Security Headers
```javascript
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000',
  'Content-Security-Policy': "default-src 'self'",
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};
```

## 🚀 Deployment Architecture

### Docker Compose Configuration
```yaml
# docker-compose.microservices-ollama.yml
services:
  chatbot-backend:
    build: ./backend
    command: ["node", "server-ollama.js"]
    environment:
      - OLLAMA_BASE_URL=http://ollama-server:11434
      - OLLAMA_MODEL=llama2:latest
    ports: ["3001:3001"]
    networks: [chatbot-network]
    
  sample-website:
    build: ./sample-website
    ports: ["8080:80"]
    networks: [chatbot-network]
    depends_on: [chatbot-backend]

networks:
  chatbot-network:
    external: true
    name: websitechatbot_chatbot-network
```

### Deployment Options

#### 1. Local Development
```bash
./deploy.sh ollama
```
- Single container with hot reload
- Optional Ollama support
- Development-friendly

#### 2. Microservices (Production)
```bash
./deploy.sh microservices-ollama
```
- Three separate containers
- Production-ready configuration
- Scalable architecture

#### 3. Cloud Deployment
- **AWS**: ECS, EKS, or EC2
- **Google Cloud**: GKE or Cloud Run
- **Azure**: Container Instances or AKS
- **DigitalOcean**: App Platform or Droplets

## 📊 Scalability & Performance

### Performance Metrics
- **Response Time**: < 2s for OpenAI, < 10s for Ollama
- **Throughput**: 100+ concurrent users
- **Memory Usage**: < 512MB per container
- **CPU Usage**: < 50% under normal load

### Scaling Strategies

#### Horizontal Scaling
```yaml
# Scale ChatBot backend
docker service scale chatbot-backend=3

# Load balancer configuration
nginx:
  upstream backend {
    server chatbot-backend-1:3001;
    server chatbot-backend-2:3001;
    server chatbot-backend-3:3001;
  }
```

#### Vertical Scaling
```yaml
# Resource limits
deploy:
  resources:
    limits:
      memory: 1G
      cpus: '0.5'
    reservations:
      memory: 256M
      cpus: '0.25'
```

### Caching Strategy
- **Session Cache**: In-memory session storage
- **Response Cache**: Redis for frequent responses
- **Static Assets**: CDN for widget files
- **Model Cache**: Ollama model persistence

## 📈 Monitoring & Logging

### Health Checks
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 20s
```

### Logging Strategy
```javascript
// Structured logging
const logger = {
  info: (message, meta) => console.log(JSON.stringify({
    level: 'info',
    message,
    timestamp: new Date().toISOString(),
    ...meta
  })),
  error: (message, meta) => console.error(JSON.stringify({
    level: 'error',
    message,
    timestamp: new Date().toISOString(),
    ...meta
  }))
};
```

### Metrics Collection
- **Request Count**: Total API requests
- **Response Time**: Average response time
- **Error Rate**: Error percentage
- **Memory Usage**: Container memory usage
- **CPU Usage**: Container CPU usage

### Monitoring Tools
- **Prometheus**: Metrics collection
- **Grafana**: Metrics visualization
- **ELK Stack**: Log aggregation
- **Docker Stats**: Container monitoring

## 🔧 Configuration Management

### Environment Variables
```bash
# Backend Configuration
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=http://localhost:8080

# Ollama Configuration
OLLAMA_BASE_URL=http://ollama-server:11434
OLLAMA_MODEL=llama2:latest
OLLAMA_API_KEY=ollama

# Security Configuration
RATE_LIMIT_REQUESTS_PER_MINUTE=60
RATE_LIMIT_REQUESTS_PER_HOUR=1000
SESSION_SECRET=your-super-secret-session-key
API_KEY_HASH_SALT=your-salt-for-api-key-hashing

# OpenAI Fallback
OPENAI_API_KEY=your-openai-api-key
```

### Configuration Files
- **docker-compose.yml**: Container orchestration
- **Dockerfile**: Container build instructions
- **nginx.conf**: Web server configuration
- **.env**: Environment variables
- **package.json**: Node.js dependencies

## 🧪 Testing Strategy

### Unit Tests
```javascript
// Backend API tests
describe('Chat API', () => {
  test('should create session', async () => {
    const response = await request(app)
      .post('/api/create-session')
      .expect(200);
    expect(response.body.sessionId).toBeDefined();
  });
});
```

### Integration Tests
```javascript
// End-to-end tests
describe('ChatKit Integration', () => {
  test('should handle complete chat flow', async () => {
    // Test widget initialization
    // Test message sending
    // Test response receiving
  });
});
```

### Load Tests
```bash
# Load testing with Artillery
artillery run load-test.yml
```

## 🚀 Future Enhancements

### Planned Features
- **Multi-model Support**: Support for multiple LLM providers
- **Advanced Analytics**: User behavior tracking
- **A/B Testing**: Message variation testing
- **Voice Integration**: Speech-to-text and text-to-speech
- **File Upload**: Document and image processing
- **Multi-language**: Real-time translation

### Architecture Improvements
- **Service Mesh**: Istio for advanced networking
- **Message Queue**: Redis/RabbitMQ for async processing
- **Database**: PostgreSQL for persistent storage
- **Caching**: Redis for response caching
- **CDN**: Global content delivery

## 📚 Related Documentation

- **[README.md](README.md)** - Quick start guide
- **[CHATKIT_INTEGRATION_GUIDE.md](CHATKIT_INTEGRATION_GUIDE.md)** - Integration guide
- **[SECURITY_GUIDE.md](SECURITY_GUIDE.md)** - Security details
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Deployment guide
- **[ollama-setup/README.md](ollama-setup/README.md)** - Ollama setup

---

*This architecture documentation is maintained alongside the codebase and reflects the current containerized microservices implementation.*