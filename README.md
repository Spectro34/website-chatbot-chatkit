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

### 2. Deploy with Containerized Ollama (Recommended)
```bash
# Start Ollama container
cd ollama-setup
./setup.sh start
cd ..

# Deploy ChatKit with Ollama
./deploy.sh microservices-ollama
```

### 3. Access Your ChatBot
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

## 🔧 Deployment Options

### Option 1: Containerized Ollama (Recommended)
```bash
./deploy.sh microservices-ollama
```
- Uses local Ollama container
- No external API costs
- Complete privacy

### Option 2: OpenAI Only
```bash
./deploy.sh microservices
```
- Uses OpenAI API
- Requires API key
- Faster responses

### Option 3: Local Development
```bash
./deploy.sh ollama
```
- Local development mode
- Optional Ollama support
- Hot reload enabled

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

- **[Architecture Guide](ARCHITECTURE_DOCUMENTATION.md)** - Technical details
- **[Security Guide](SECURITY_GUIDE.md)** - Security features
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Production deployment
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