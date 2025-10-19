# 🔌 ChatKit Pluggability Guide

## Overview

ChatKit is designed for **maximum pluggability** - it can be integrated with **any Ollama container** and **any website** with minimal configuration.

## 🧠 Pluggability with ANY Ollama Container

### Environment Variables for Ollama Connection

The ChatBot backend connects to Ollama using these environment variables:

```bash
# Required: Point to your Ollama instance
OLLAMA_BASE_URL=http://your-ollama-server:11434

# Required: Specify the model to use
OLLAMA_MODEL=llama2:latest

# Optional: API key (if your Ollama requires authentication)
OLLAMA_API_KEY=your-api-key

# Optional: Fallback to OpenAI if Ollama is unavailable
OPENAI_API_KEY=your-openai-key
```

### Supported Ollama Deployments

✅ **Docker Containers** (any port)
```bash
docker run -d -p 11434:11434 ollama/ollama
```

✅ **Local Installation**
```bash
ollama serve
```

✅ **Cloud Deployments**
```bash
# AWS, GCP, Azure, etc.
OLLAMA_BASE_URL=https://your-ollama-instance.com
```

✅ **Kubernetes Clusters**
```bash
OLLAMA_BASE_URL=http://ollama-service:11434
```

### Example: Connect to Different Ollama Instances

**Local Ollama:**
```bash
docker run -d --name chatbot \
  -e OLLAMA_BASE_URL=http://localhost:11434 \
  -e OLLAMA_MODEL=llama2 \
  -p 3001:3001 \
  websitechatbot-chatbot-backend \
  node server-ollama.js
```

**Remote Ollama Server:**
```bash
docker run -d --name chatbot \
  -e OLLAMA_BASE_URL=http://192.168.1.100:11434 \
  -e OLLAMA_MODEL=mistral \
  -p 3001:3001 \
  websitechatbot-chatbot-backend \
  node server-ollama.js
```

**Cloud Ollama (with authentication):**
```bash
docker run -d --name chatbot \
  -e OLLAMA_BASE_URL=https://ollama.yourdomain.com \
  -e OLLAMA_MODEL=codellama \
  -e OLLAMA_API_KEY=your-secret-key \
  -p 3001:3001 \
  websitechatbot-chatbot-backend \
  node server-ollama.js
```

## 🌐 Pluggability with ANY Website

### Universal Widget Integration

The ChatKit widget is a **single JavaScript file** that works with any website:

```html
<!-- Add this to any HTML page -->
<script src="https://yourdomain.com/chatkit-widget.js"></script>
<script>
    ChatKit.init({
        backendUrl: 'https://your-backend.com',
        // Customize appearance and behavior
    });
</script>
```

### Supported Website Types

✅ **Static HTML** (like this demo)
✅ **WordPress** (add to theme or plugin)
✅ **React/Vue/Angular** (component integration)
✅ **Shopify** (theme customization)
✅ **Squarespace** (custom code injection)
✅ **Wix** (HTML embed)
✅ **Custom PHP/Node.js** (any backend)

### Integration Examples

#### WordPress Integration
```php
// Add to functions.php or a plugin
function add_chatkit_widget() {
    ?>
    <script src="https://yourdomain.com/chatkit-widget.js"></script>
    <script>
        ChatKit.init({
            backendUrl: 'https://api.yourdomain.com',
            widgetTitle: 'Customer Support',
            theme: 'light'
        });
    </script>
    <?php
}
add_action('wp_footer', 'add_chatkit_widget');
```

#### React Integration
```jsx
import { useEffect } from 'react';

function App() {
    useEffect(() => {
        // Load ChatKit widget
        const script = document.createElement('script');
        script.src = 'https://yourdomain.com/chatkit-widget.js';
        script.onload = () => {
            window.ChatKit.init({
                backendUrl: 'https://api.yourdomain.com',
                widgetTitle: 'AI Assistant',
                theme: 'dark'
            });
        };
        document.head.appendChild(script);
    }, []);

    return <div>Your React App</div>;
}
```

#### Shopify Integration
```liquid
<!-- Add to theme.liquid before </body> -->
<script src="https://yourdomain.com/chatkit-widget.js"></script>
<script>
    ChatKit.init({
        backendUrl: 'https://api.yourdomain.com',
        widgetTitle: 'Shopping Assistant',
        welcomeMessage: 'Hi! I can help you find products and answer questions.',
        primaryColor: '{{ settings.primary_color }}'
    });
</script>
```

## 🚀 Production Deployment Examples

### Example 1: E-commerce Website
```bash
# Deploy ChatBot backend
docker run -d --name chatbot-backend \
  -e OLLAMA_BASE_URL=http://ollama-server:11434 \
  -e OLLAMA_MODEL=llama3.1:latest \
  -e ALLOWED_ORIGINS=https://mystore.com,https://www.mystore.com \
  -p 3001:3001 \
  websitechatbot-chatbot-backend \
  node server-ollama.js

# Add to website
<script src="https://cdn.mystore.com/chatkit-widget.js"></script>
<script>
    ChatKit.init({
        backendUrl: 'https://api.mystore.com',
        widgetTitle: 'Shopping Assistant',
        welcomeMessage: 'Hi! I can help you find products and answer questions about our store.',
        theme: 'light',
        primaryColor: '#ff6b35'
    });
</script>
```

### Example 2: Corporate Website
```bash
# Deploy with custom model
docker run -d --name chatbot-backend \
  -e OLLAMA_BASE_URL=http://internal-ollama:11434 \
  -e OLLAMA_MODEL=codellama:latest \
  -e ALLOWED_ORIGINS=https://company.com \
  -p 3001:3001 \
  websitechatbot-chatbot-backend \
  node server-ollama.js

# Add to corporate site
<script src="https://cdn.company.com/chatkit-widget.js"></script>
<script>
    ChatKit.init({
        backendUrl: 'https://api.company.com',
        widgetTitle: 'Technical Support',
        welcomeMessage: 'Hello! I can help with technical questions and documentation.',
        theme: 'dark',
        primaryColor: '#2c3e50'
    });
</script>
```

## 🔧 Configuration Options

### Backend Configuration
```bash
# Ollama Settings
OLLAMA_BASE_URL=http://your-ollama:11434
OLLAMA_MODEL=your-model-name
OLLAMA_API_KEY=optional-api-key

# Security Settings
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
RATE_LIMIT_REQUESTS_PER_MINUTE=60
RATE_LIMIT_REQUESTS_PER_HOUR=1000

# Fallback Settings
OPENAI_API_KEY=your-openai-key  # Optional fallback
```

### Widget Configuration
```javascript
ChatKit.init({
    // Required
    backendUrl: 'https://your-backend.com',
    
    // Appearance
    widgetTitle: 'AI Assistant',
    welcomeMessage: 'Hello! How can I help?',
    placeholderText: 'Type your message...',
    toggleButtonText: '💬',
    
    // Positioning
    position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
    
    // Theming
    theme: 'light', // light, dark
    primaryColor: '#3498db',
    
    // Custom CSS
    customCSS: `
        .chatkit-widget { border-radius: 15px; }
        .chatkit-messages { font-size: 14px; }
    `,
    
    // Behavior
    autoOpen: false,
    showTypingIndicator: true,
    enableSound: true
});
```

## 🛡️ Security Considerations

### CORS Configuration
```bash
# Allow specific domains
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Allow all domains (not recommended for production)
ALLOWED_ORIGINS=*
```

### Rate Limiting
```bash
# Per-minute limits
RATE_LIMIT_REQUESTS_PER_MINUTE=60

# Per-hour limits  
RATE_LIMIT_REQUESTS_PER_HOUR=1000

# Burst protection
RATE_LIMIT_BURST=10
```

### API Key Security
```bash
# Use environment variables, never hardcode
OPENAI_API_KEY=${OPENAI_API_KEY}
OLLAMA_API_KEY=${OLLAMA_API_KEY}
```

## 📊 Monitoring and Health Checks

### Health Check Endpoints
```bash
# Backend health
curl http://your-backend:3001/health

# Ollama health
curl http://your-ollama:11434/api/tags
```

### Logging
```bash
# View backend logs
docker logs chatbot-backend

# View Ollama logs
docker logs ollama-server
```

## 🎯 Best Practices

1. **Use Environment Variables**: Never hardcode URLs or API keys
2. **Configure CORS Properly**: Only allow trusted domains
3. **Set Rate Limits**: Prevent abuse and ensure fair usage
4. **Monitor Performance**: Check logs and health endpoints
5. **Test Fallbacks**: Ensure OpenAI fallback works if Ollama is down
6. **Customize Appearance**: Match your website's design
7. **Use HTTPS**: Always use secure connections in production

## 🔄 Migration and Updates

### Updating the Backend
```bash
# Pull latest image
docker pull websitechatbot-chatbot-backend:latest

# Restart with new image
docker stop chatbot-backend
docker rm chatbot-backend
# Run new container with same configuration
```

### Updating the Widget
```html
<!-- Just update the script URL -->
<script src="https://yourdomain.com/chatkit-widget.js?v=2.0"></script>
```

This pluggability design ensures that ChatKit can be integrated into **any** environment with **any** Ollama setup and **any** website technology stack.
