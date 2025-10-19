# 🤖 ChatKit - Containerized AI Chatbot

A production-ready, containerized AI chatbot that can be easily integrated into any website. Features local LLM support via Ollama with automatic OpenAI fallback.

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Git

### 1. Clone and Setup
```bash
git clone https://github.com/yourusername/websitechatbot.git
cd websitechatbot
```

### 2. Configure Environment Variables
```bash
# Copy environment template
cp env.example .env

# Edit configuration
nano .env
```

**Required Configuration:**
```bash
# OpenAI API Key (for fallback)
OPENAI_API_KEY=sk-proj-your-openai-api-key-here

# Server Configuration
NODE_ENV=production
PORT=3001

# Security Configuration
ALLOWED_ORIGINS=http://localhost:8080,https://yourdomain.com

# Rate Limiting
MAX_REQUESTS_PER_MINUTE=60
MAX_REQUESTS_PER_HOUR=1000
```

### 3. Deploy with Containerized Ollama (Recommended)
```bash
# Start Ollama container
cd ollama-setup
./setup.sh start
cd ..

# Deploy ChatKit with Ollama
./deploy.sh microservices-ollama
```

### 4. Access Your ChatBot
- **Website**: http://localhost:8080
- **API**: http://localhost:3001
- **Integration Example**: http://localhost:8080/examples/any-website-integration.html

## 🏗️ Architecture

### Three-Container Setup
- **🧠 Ollama Container**: Local LLM inference (llama2)
- **🌐 Website Container**: Sample website with ChatKit widget
- **🤖 ChatBot Container**: Backend API with Ollama integration

### Container Communication
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Website       │    │   ChatBot       │    │   Ollama        │
│   (Port 8080)   │◄──►│   (Port 3001)   │◄──►│   (Port 11434)  │
│   Nginx + UI    │    │   Node.js API   │    │   LLM Engine    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## ⚙️ Configuration

### Environment Variables

#### For Containerized Deployment
```bash
# Copy environment template
cp env.example .env

# Edit with your settings
nano .env
```

**Required Variables:**
```bash
# OpenAI API Key (for fallback when Ollama is unavailable)
OPENAI_API_KEY=sk-proj-your-openai-api-key-here

# Server Configuration
NODE_ENV=production
PORT=3001

# Security Configuration
ALLOWED_ORIGINS=http://localhost:8080,https://yourdomain.com

# Rate Limiting
MAX_REQUESTS_PER_MINUTE=60
MAX_REQUESTS_PER_HOUR=1000

# Session Configuration
SESSION_MAX_AGE_HOURS=24
```

#### For Ollama Setup
```bash
# Navigate to Ollama setup
cd ollama-setup

# Copy environment template
cp env.example .env

# Edit Ollama configuration
nano .env
```

**Ollama Variables:**
```bash
# Ollama Model Configuration
OLLAMA_MODEL=llama2        # Default model
# OLLAMA_MODEL=mistral     # Alternative model
# OLLAMA_MODEL=codellama   # Code-focused model
```

### Container Configuration

#### Docker Compose Environment
The containers automatically use environment variables from `.env`:

```yaml
# docker-compose.microservices-ollama.yml
services:
  chatbot-backend:
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - OLLAMA_BASE_URL=http://ollama-server:11434
      - OLLAMA_MODEL=llama2:latest
      - ALLOWED_ORIGINS=${ALLOWED_ORIGINS}
```

#### Security Best Practices
```bash
# Never commit .env files to git
echo ".env" >> .gitignore

# Use strong, unique API keys
OPENAI_API_KEY=sk-proj-1234567890abcdef...

# Restrict allowed origins
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Set appropriate rate limits
MAX_REQUESTS_PER_MINUTE=60
MAX_REQUESTS_PER_HOUR=1000
```

## 🔧 Deployment Options

### Option 1: Kubernetes with Helm Chart (Recommended for Production)
```bash
# Add Helm repository
helm repo add chatkit https://yourusername.github.io/websitechatbot
helm repo update

# Deploy with Ollama + OpenAI fallback
helm install chatkit chatkit/chatkit -f examples/values-hybrid.yaml

# Deploy with custom website
helm install chatkit chatkit/chatkit -f examples/values-custom-website.yaml
```
- **Production-ready**: Auto-scaling, monitoring, security
- **Flexible**: Choose Ollama-only, OpenAI-only, or hybrid
- **Customizable**: Deploy your own website with ChatKit integrated
- **Enterprise**: RBAC, network policies, persistent storage

### Option 2: Docker Compose (Development/Testing)
```bash
# Containerized Ollama (Recommended)
./deploy.sh microservices-ollama

# OpenAI Only
./deploy.sh microservices

# Local Development
./deploy.sh ollama
```
- **Quick setup**: Perfect for development and testing
- **Local deployment**: Runs on your machine
- **Easy configuration**: Simple environment variables

## 🌐 Website Integration

### One-Line Integration
```html
<script src="http://localhost:8080/chatkit-widget.js"></script>
<script>
  ChatKit.init({
    apiUrl: 'http://localhost:3001',
    position: 'bottom-right'
  });
</script>
```

### Advanced Integration
```html
<script src="http://localhost:8080/chatkit-widget.js"></script>
<script>
  ChatKit.init({
    apiUrl: 'http://localhost:3001',
    position: 'bottom-right',
    theme: 'dark',
    welcomeMessage: 'Hello! How can I help you?',
    placeholder: 'Type your message...',
    onMessage: function(message) {
      console.log('User sent:', message);
    }
  });
</script>
```

## 🎨 Customization

### Chat Interface Design
- **Position**: `bottom-right`, `bottom-left`, `top-right`, `top-left`
- **Theme**: `light`, `dark`, `auto`
- **Colors**: Custom CSS variables
- **Size**: Responsive design
- **Animation**: Smooth transitions

### Backend Configuration
- **Model**: Change Ollama model in `ollama-setup/.env`
- **API**: Modify endpoints in `backend/server-ollama.js`
- **Security**: Configure in `backend/security.js`
- **Rate Limiting**: Adjust in environment variables

## 📚 Documentation

- **[Configuration Guide](CONFIGURATION_GUIDE.md)** - Complete setup and configuration
- **[Architecture Guide](ARCHITECTURE_DOCUMENTATION.md)** - Technical details
- **[Security Guide](SECURITY_GUIDE.md)** - Security features
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Production deployment
- **[Helm Chart](helm/README.md)** - Kubernetes deployment with Helm
- **[Ollama Setup](ollama-setup/README.md)** - Local LLM setup

## 🛠️ Development

### Project Structure
```
websitechatbot/
├── backend/                 # ChatBot API
├── sample-website/         # Demo website
├── ollama-setup/          # Ollama container setup
├── examples/              # Integration examples
├── chatkit-widget.js      # Universal widget
└── deploy.sh             # Deployment script
```

### Key Files
- `chatkit-widget.js` - Universal JavaScript widget
- `backend/server-ollama.js` - Ollama-compatible backend
- `docker-compose.microservices-ollama.yml` - Container orchestration
- `ollama-setup/setup.sh` - Ollama management

## 🔒 Security Features

- ✅ API key protection
- ✅ Rate limiting
- ✅ Input sanitization
- ✅ CORS protection
- ✅ Session management
- ✅ Security headers

## 🚀 Production Ready

- ✅ Containerized deployment
- ✅ Health checks
- ✅ Logging
- ✅ Error handling
- ✅ Scalable architecture
- ✅ Easy integration

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/websitechatbot/issues)
- **Documentation**: See docs/ folder
- **Examples**: See examples/ folder