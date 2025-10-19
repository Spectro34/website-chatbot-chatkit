# 🚀 Quick Start Guide

## Deploy ChatKit in 30 Seconds!

### Option 1: One-Command Deployment
```bash
./deploy.sh
```

### Option 2: Choose Your Method
```bash
# Local Development (faster, for testing)
./deploy.sh local

# Microservices Deployment (production-like, separate containers)
./deploy.sh microservices

# Single Container Deployment
./deploy.sh docker
```

## 🎯 What You Get

After running the deployment script, you'll have:

- **🌐 Website**: http://localhost:8080
- **🔧 Backend API**: http://localhost:3001  
- **📱 Widget Script**: http://localhost:8080/chatkit-widget.js
- **🧪 Test Page**: http://localhost:8080/test.html

## 🔌 Add to Any Website

### Method 1: One-Line Integration
```html
<script 
    src="http://localhost:8080/chatkit-widget.js"
    data-backend-url="http://localhost:3001"
    data-widget-title="AI Assistant"
    data-primary-color="#3498db">
</script>
```

### Method 2: Manual Initialization
```html
<script src="http://localhost:8080/chatkit-widget.js"></script>
<script>
    ChatKit.init({
        backendUrl: 'http://localhost:3001',
        widgetTitle: 'My AI Assistant',
        primaryColor: '#e74c3c',
        position: 'bottom-left'
    });
</script>
```

## 🛠️ Commands

```bash
./deploy.sh local         # Start local development
./deploy.sh microservices # Start microservices deployment (recommended)
./deploy.sh docker        # Start single container deployment
./deploy.sh stop          # Stop all services
./deploy.sh status        # Check service status
./deploy.sh help          # Show help
```

## 🔧 Configuration

1. **Edit `.env` file** with your OpenAI API key
2. **Run deployment script**
3. **Test at** http://localhost:8080/test.html

## 🎨 Customization

The widget supports full customization:

```javascript
ChatKit.init({
    backendUrl: 'http://localhost:3001',
    widgetTitle: 'Customer Support',
    welcomeMessage: 'Hi! How can I help you?',
    primaryColor: '#e74c3c',
    position: 'bottom-left',  // bottom-right, top-left, top-right
    theme: 'dark'             // light, dark
});
```

## 🚀 Production Deployment

For production, update the URLs in your integration:

```html
<script 
    src="https://yourdomain.com/chatkit-widget.js"
    data-backend-url="https://yourdomain.com/api"
    data-widget-title="AI Assistant">
</script>
```

## 🆘 Troubleshooting

- **Port conflicts**: The script automatically handles port conflicts
- **API key issues**: Make sure your `.env` file has a valid OpenAI API key
- **Docker issues**: Ensure Docker Desktop is running
- **Service status**: Run `./deploy.sh status` to check

## 📚 More Documentation

- [Containerized Deployment Guide](containerized-deployment-guide.md)
- [Getting Started Kit](GETTING_STARTED_KIT.md)
- [Architecture Documentation](ARCHITECTURE_DOCUMENTATION.md)

---

**Ready to start?** Run `./deploy.sh` and choose your deployment method! 🎉
