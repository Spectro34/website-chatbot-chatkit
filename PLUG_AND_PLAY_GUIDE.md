# 🔌 Plug & Play Integration Guide

## Add AI Chat to Any Website in 30 Seconds!

### 🚀 Quick Start

1. **Deploy ChatKit** (one command):
   ```bash
   ./deploy.sh local    # For development
   ./deploy.sh docker   # For production-like setup
   ```

2. **Add to your website** (one line):
   ```html
   <script src="http://localhost:8080/chatkit-widget.js" data-backend-url="http://localhost:3001"></script>
   ```

3. **Done!** Your website now has AI-powered chat! 🎉

---

## 📋 Integration Methods

### Method 1: One-Line Integration (Easiest)

Add this single line to your HTML:

```html
<script 
    src="http://localhost:8080/chatkit-widget.js"
    data-backend-url="http://localhost:3001"
    data-widget-title="AI Assistant"
    data-primary-color="#3498db">
</script>
```

### Method 2: Manual Initialization (More Control)

```html
<script src="http://localhost:8080/chatkit-widget.js"></script>
<script>
    ChatKit.init({
        backendUrl: 'http://localhost:3001',
        widgetTitle: 'My AI Assistant',
        welcomeMessage: 'Hello! How can I help you?',
        primaryColor: '#e74c3c',
        position: 'bottom-left'
    });
</script>
```

### Method 3: Framework Integration

#### React
```jsx
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'http://localhost:8080/chatkit-widget.js';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.ChatKit.init({
        backendUrl: 'http://localhost:3001',
        widgetTitle: 'AI Assistant'
      });
    };

    return () => {
      window.ChatKit?.destroy();
    };
  }, []);

  return <div>Your app content</div>;
}
```

#### Vue
```vue
<template>
  <div id="app">
    <!-- Your app content -->
  </div>
</template>

<script>
export default {
  mounted() {
    const script = document.createElement('script');
    script.src = 'http://localhost:8080/chatkit-widget.js';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.ChatKit.init({
        backendUrl: 'http://localhost:3001',
        widgetTitle: 'AI Assistant'
      });
    };
  },
  beforeDestroy() {
    window.ChatKit?.destroy();
  }
}
</script>
```

#### Angular
```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<div>Your app content</div>'
})
export class AppComponent implements OnInit, OnDestroy {
  ngOnInit() {
    const script = document.createElement('script');
    script.src = 'http://localhost:8080/chatkit-widget.js';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.ChatKit.init({
        backendUrl: 'http://localhost:3001',
        widgetTitle: 'AI Assistant'
      });
    };
  }

  ngOnDestroy() {
    window.ChatKit?.destroy();
  }
}
```

---

## 🎨 Customization Options

### Widget Appearance
```javascript
ChatKit.init({
    // Basic Configuration
    backendUrl: 'http://localhost:3001',
    widgetTitle: 'AI Assistant',
    welcomeMessage: 'Hello! How can I help you?',
    placeholderText: 'Type your message...',
    
    // Visual Customization
    primaryColor: '#3498db',        // Button and header color
    position: 'bottom-right',       // bottom-right, bottom-left, top-right, top-left
    theme: 'light',                 // light, dark
    
    // Button Customization
    toggleButtonText: '💬',         // Chat button text/emoji
});
```

### Advanced Configuration
```javascript
ChatKit.init({
    backendUrl: 'http://localhost:3001',
    widgetTitle: 'Customer Support',
    welcomeMessage: 'Hi! I\'m here to help with any questions.',
    primaryColor: '#e74c3c',
    position: 'bottom-left',
    theme: 'dark',
    toggleButtonText: '🆘',
    
    // API Configuration
    maxRetries: 3,
    retryDelay: 1000,
    
    // UI Configuration
    maxMessages: 50,
    sessionTimeout: 24 * 60 * 60 * 1000  // 24 hours
});
```

---

## 🔧 API Methods

Control the widget programmatically:

```javascript
// Initialize
ChatKit.init(config);

// Open chat
ChatKit.open();

// Close chat
ChatKit.close();

// Destroy widget
ChatKit.destroy();

// Update configuration
ChatKit.updateConfig(newConfig);
```

---

## 🌐 Production Deployment

### Update URLs for Production

Replace localhost URLs with your production domain:

```html
<!-- Development -->
<script src="http://localhost:8080/chatkit-widget.js" data-backend-url="http://localhost:3001"></script>

<!-- Production -->
<script src="https://yourdomain.com/chatkit-widget.js" data-backend-url="https://yourdomain.com/api"></script>
```

### Environment Configuration

```javascript
// Production configuration
const isProduction = window.location.hostname !== 'localhost';
const backendUrl = isProduction ? 'https://yourdomain.com/api' : 'http://localhost:3001';
const widgetUrl = isProduction ? 'https://yourdomain.com/chatkit-widget.js' : 'http://localhost:8080/chatkit-widget.js';

// Load widget
const script = document.createElement('script');
script.src = widgetUrl;
script.async = true;
document.head.appendChild(script);

script.onload = () => {
    ChatKit.init({
        backendUrl: backendUrl,
        widgetTitle: 'AI Assistant'
    });
};
```

---

## 🛠️ Deployment Options

### Option 1: Local Development
```bash
./deploy.sh local
```
- **Best for**: Development and testing
- **URLs**: http://localhost:8080, http://localhost:3001
- **Features**: Hot reload, easy debugging

### Option 2: Docker Deployment
```bash
./deploy.sh docker
```
- **Best for**: Production-like testing
- **URLs**: http://localhost:8080, http://localhost:3001
- **Features**: Isolated environment, production-ready

### Option 3: Cloud Deployment
```bash
# Deploy to Vercel, Heroku, AWS, etc.
# See containerized-deployment-guide.md for details
```

---

## 🧪 Testing Your Integration

### Test Page
Visit http://localhost:8080/test.html to:
- ✅ Test backend API connectivity
- ✅ Test widget loading
- ✅ See integration examples
- ✅ Copy integration code

### Manual Testing
```javascript
// Test in browser console
console.log('ChatKit available:', typeof window.ChatKit);

// Test API
fetch('http://localhost:3001/health')
  .then(r => r.json())
  .then(console.log);

// Test widget
ChatKit.open();
```

---

## 🔒 Security Features

The ChatKit integration includes built-in security:

- **API Key Protection**: Secure server-side API key handling
- **Rate Limiting**: Prevents abuse (60 requests/minute, 1000/hour)
- **CORS Protection**: Only allowed origins can access the API
- **Input Sanitization**: XSS protection for all user inputs
- **Session Security**: Secure session ID generation and validation
- **HTTPS Ready**: Works with SSL certificates

---

## 🆘 Troubleshooting

### Common Issues

1. **Widget not loading**
   ```javascript
   // Check if script loaded
   console.log('ChatKit available:', typeof window.ChatKit);
   ```

2. **API connection failed**
   ```bash
   # Check if backend is running
   curl http://localhost:3001/health
   ```

3. **CORS errors**
   ```bash
   # Check allowed origins in .env
   cat .env | grep ALLOWED_ORIGINS
   ```

4. **Port conflicts**
   ```bash
   # Check what's using the ports
   lsof -i :3001
   lsof -i :8080
   ```

### Debug Mode

Enable debug logging:
```javascript
// Add to your page
localStorage.setItem('chatkit-debug', 'true');
```

---

## 📚 Examples

### E-commerce Website
```html
<script src="http://localhost:8080/chatkit-widget.js"></script>
<script>
    ChatKit.init({
        backendUrl: 'http://localhost:3001',
        widgetTitle: 'Shopping Assistant',
        welcomeMessage: 'Hi! I can help you find products, answer questions, or assist with orders.',
        primaryColor: '#ff6b6b',
        position: 'bottom-right'
    });
</script>
```

### Support Website
```html
<script src="http://localhost:8080/chatkit-widget.js"></script>
<script>
    ChatKit.init({
        backendUrl: 'http://localhost:3001',
        widgetTitle: 'Support Bot',
        welcomeMessage: 'Hello! I\'m here to help with technical support and questions.',
        primaryColor: '#4ecdc4',
        position: 'bottom-left',
        theme: 'dark'
    });
</script>
```

### Corporate Website
```html
<script src="http://localhost:8080/chatkit-widget.js"></script>
<script>
    ChatKit.init({
        backendUrl: 'http://localhost:3001',
        widgetTitle: 'AI Assistant',
        welcomeMessage: 'Welcome! How can I assist you today?',
        primaryColor: '#2c3e50',
        position: 'bottom-right'
    });
</script>
```

---

## 🎯 Next Steps

1. **Test locally**: Run `./deploy.sh local` and visit http://localhost:8080/test.html
2. **Customize**: Modify colors, position, and messages to match your brand
3. **Deploy**: Choose your deployment method (local, Docker, or cloud)
4. **Integrate**: Add the widget to your website using one of the methods above
5. **Monitor**: Use the test page to verify everything is working

---

**Ready to add AI chat to your website?** Start with `./deploy.sh` and you'll be up and running in 30 seconds! 🚀
