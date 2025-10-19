# 🎨 ChatKit Integration & Customization Guide

Complete guide for integrating ChatKit into any website and customizing the chat interface.

## 🚀 Quick Integration

### Basic Integration (1 Line)
```html
<script src="http://localhost:8080/chatkit-widget.js"></script>
<script>ChatKit.init();</script>
```

### Standard Integration
```html
<script src="http://localhost:8080/chatkit-widget.js"></script>
<script>
  ChatKit.init({
    apiUrl: 'http://localhost:3001',
    position: 'bottom-right'
  });
</script>
```

## ⚙️ Configuration Options

### Core Settings
```javascript
ChatKit.init({
  // Required
  apiUrl: 'http://localhost:3001',        // Backend API URL
  
  // Optional
  position: 'bottom-right',               // Widget position
  theme: 'light',                        // Color theme
  welcomeMessage: 'Hello! How can I help?', // Welcome message
  placeholder: 'Type your message...',    // Input placeholder
  
  // Advanced
  autoOpen: false,                       // Auto-open chat
  showWelcomeMessage: true,              // Show welcome message
  enableTyping: true,                    // Show typing indicator
  enableSound: false,                    // Play notification sounds
  maxMessages: 50,                       // Max messages in history
  
  // Callbacks
  onOpen: function() { console.log('Chat opened'); },
  onClose: function() { console.log('Chat closed'); },
  onMessage: function(message) { console.log('Message:', message); },
  onError: function(error) { console.log('Error:', error); }
});
```

## 🎨 Visual Customization

### CSS Variables
```css
:root {
  /* Colors */
  --chatkit-primary: #007bff;
  --chatkit-secondary: #6c757d;
  --chatkit-success: #28a745;
  --chatkit-danger: #dc3545;
  --chatkit-warning: #ffc107;
  --chatkit-info: #17a2b8;
  
  /* Background */
  --chatkit-bg-primary: #ffffff;
  --chatkit-bg-secondary: #f8f9fa;
  --chatkit-bg-dark: #343a40;
  
  /* Text */
  --chatkit-text-primary: #212529;
  --chatkit-text-secondary: #6c757d;
  --chatkit-text-light: #ffffff;
  
  /* Borders */
  --chatkit-border: #dee2e6;
  --chatkit-border-radius: 8px;
  
  /* Shadows */
  --chatkit-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  --chatkit-shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.15);
  
  /* Sizing */
  --chatkit-width: 350px;
  --chatkit-height: 500px;
  --chatkit-button-size: 60px;
  
  /* Spacing */
  --chatkit-padding: 16px;
  --chatkit-margin: 16px;
  --chatkit-gap: 8px;
}
```

### Custom Themes
```javascript
// Dark Theme
ChatKit.init({
  theme: 'dark',
  customCSS: `
    .chatkit-widget {
      --chatkit-bg-primary: #2d3748;
      --chatkit-bg-secondary: #4a5568;
      --chatkit-text-primary: #ffffff;
      --chatkit-text-secondary: #a0aec0;
    }
  `
});

// Custom Brand Theme
ChatKit.init({
  theme: 'custom',
  customCSS: `
    .chatkit-widget {
      --chatkit-primary: #e53e3e;
      --chatkit-bg-primary: #f7fafc;
      --chatkit-border-radius: 12px;
      --chatkit-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
  `
});
```

## 🔧 Advanced Customization

### Custom Message Templates
```javascript
ChatKit.init({
  messageTemplates: {
    user: (message) => `
      <div class="message user-message">
        <div class="message-content">${message}</div>
        <div class="message-time">${new Date().toLocaleTimeString()}</div>
      </div>
    `,
    assistant: (message) => `
      <div class="message assistant-message">
        <div class="message-avatar">🤖</div>
        <div class="message-content">${message}</div>
        <div class="message-time">${new Date().toLocaleTimeString()}</div>
      </div>
    `
  }
});
```

### Custom Widget Button
```javascript
ChatKit.init({
  customButton: {
    html: '<div class="my-custom-button">💬 Chat with us</div>',
    position: 'bottom-left',
    styles: `
      .my-custom-button {
        background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        transition: transform 0.3s ease;
      }
      .my-custom-button:hover {
        transform: translateY(-2px);
      }
    `
  }
});
```

### Custom Input Field
```javascript
ChatKit.init({
  customInput: {
    placeholder: 'Ask me anything...',
    maxLength: 500,
    enableEmoji: true,
    enableFileUpload: true,
    fileTypes: ['image/*', 'application/pdf'],
    maxFileSize: '10MB'
  }
});
```

## 🌐 Multi-Language Support

### Language Configuration
```javascript
ChatKit.init({
  language: 'en',
  translations: {
    en: {
      welcomeMessage: 'Hello! How can I help you?',
      placeholder: 'Type your message...',
      sendButton: 'Send',
      closeButton: 'Close',
      errorMessage: 'Sorry, something went wrong. Please try again.'
    },
    es: {
      welcomeMessage: '¡Hola! ¿Cómo puedo ayudarte?',
      placeholder: 'Escribe tu mensaje...',
      sendButton: 'Enviar',
      closeButton: 'Cerrar',
      errorMessage: 'Lo siento, algo salió mal. Por favor intenta de nuevo.'
    },
    fr: {
      welcomeMessage: 'Bonjour! Comment puis-je vous aider?',
      placeholder: 'Tapez votre message...',
      sendButton: 'Envoyer',
      closeButton: 'Fermer',
      errorMessage: 'Désolé, quelque chose s\'est mal passé. Veuillez réessayer.'
    }
  }
});
```

## 🔌 API Integration

### Custom API Endpoints
```javascript
ChatKit.init({
  apiUrl: 'http://localhost:3001',
  endpoints: {
    chat: '/api/chat',
    session: '/api/create-session',
    health: '/health'
  },
  headers: {
    'Authorization': 'Bearer your-token',
    'X-Custom-Header': 'your-value'
  }
});
```

### Webhook Integration
```javascript
ChatKit.init({
  webhooks: {
    onMessage: 'https://your-site.com/webhook/message',
    onSession: 'https://your-site.com/webhook/session',
    onError: 'https://your-site.com/webhook/error'
  }
});
```

## 📱 Mobile Optimization

### Responsive Design
```javascript
ChatKit.init({
  responsive: {
    mobile: {
      width: '100vw',
      height: '100vh',
      position: 'fullscreen'
    },
    tablet: {
      width: '400px',
      height: '600px',
      position: 'bottom-right'
    },
    desktop: {
      width: '350px',
      height: '500px',
      position: 'bottom-right'
    }
  }
});
```

### Touch Gestures
```javascript
ChatKit.init({
  gestures: {
    swipeToClose: true,
    pullToRefresh: true,
    doubleTapToMaximize: true
  }
});
```

## 🎯 Analytics & Tracking

### Event Tracking
```javascript
ChatKit.init({
  analytics: {
    enabled: true,
    provider: 'google', // 'google', 'mixpanel', 'custom'
    trackingId: 'GA-XXXXXXXXX',
    events: {
      chatOpened: 'chat_opened',
      messageSent: 'message_sent',
      messageReceived: 'message_received',
      chatClosed: 'chat_closed'
    }
  }
});
```

### Custom Analytics
```javascript
ChatKit.init({
  onMessage: function(message) {
    // Track message sent
    gtag('event', 'message_sent', {
      'message_length': message.length,
      'timestamp': Date.now()
    });
  },
  onOpen: function() {
    // Track chat opened
    gtag('event', 'chat_opened', {
      'timestamp': Date.now()
    });
  }
});
```

## 🔒 Security Configuration

### Content Security Policy
```javascript
ChatKit.init({
  security: {
    csp: {
      enabled: true,
      nonce: 'your-random-nonce',
      reportUri: '/csp-report'
    },
    sanitizeInput: true,
    maxMessageLength: 1000,
    allowedOrigins: ['https://yourdomain.com']
  }
});
```

### Authentication
```javascript
ChatKit.init({
  auth: {
    required: true,
    provider: 'jwt', // 'jwt', 'oauth', 'custom'
    token: 'your-jwt-token',
    refreshToken: 'your-refresh-token',
    onTokenExpired: function() {
      // Handle token refresh
      return fetch('/api/refresh-token').then(r => r.json());
    }
  }
});
```

## 🧪 Testing & Debugging

### Debug Mode
```javascript
ChatKit.init({
  debug: true,
  logLevel: 'verbose', // 'error', 'warn', 'info', 'verbose'
  onError: function(error) {
    console.error('ChatKit Error:', error);
    // Send to error tracking service
  }
});
```

### Testing Configuration
```javascript
ChatKit.init({
  testMode: true,
  mockResponses: true,
  testData: {
    messages: [
      { role: 'assistant', content: 'Hello! This is a test message.' }
    ]
  }
});
```

## 📦 Build & Deployment

### Production Build
```javascript
// Production configuration
ChatKit.init({
  apiUrl: 'https://your-api.com',
  minified: true,
  cacheBust: true,
  version: '1.0.0'
});
```

### CDN Integration
```html
<!-- Use CDN version -->
<script src="https://cdn.yoursite.com/chatkit-widget.js"></script>
<script>
  ChatKit.init({
    apiUrl: 'https://your-api.com',
    cdn: true
  });
</script>
```

## 🎉 Complete Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Website with ChatKit</title>
  <style>
    :root {
      --chatkit-primary: #007bff;
      --chatkit-bg-primary: #ffffff;
      --chatkit-border-radius: 12px;
    }
  </style>
</head>
<body>
  <h1>Welcome to My Website</h1>
  <p>This is a sample website with ChatKit integration.</p>
  
  <script src="http://localhost:8080/chatkit-widget.js"></script>
  <script>
    ChatKit.init({
      apiUrl: 'http://localhost:3001',
      position: 'bottom-right',
      theme: 'light',
      welcomeMessage: 'Hello! How can I help you today?',
      placeholder: 'Type your message...',
      autoOpen: false,
      enableTyping: true,
      enableSound: false,
      maxMessages: 50,
      responsive: {
        mobile: { width: '100vw', height: '100vh' },
        desktop: { width: '350px', height: '500px' }
      },
      onOpen: function() {
        console.log('Chat opened');
      },
      onMessage: function(message) {
        console.log('User message:', message);
      },
      onError: function(error) {
        console.error('ChatKit error:', error);
      }
    });
  </script>
</body>
</html>
```

## 🚀 Next Steps

1. **Choose your integration method** (basic, standard, or advanced)
2. **Customize the appearance** using CSS variables
3. **Configure the backend** for your specific needs
4. **Test thoroughly** in different environments
5. **Deploy to production** with proper security settings

For more examples, see the `examples/` folder in the project.
