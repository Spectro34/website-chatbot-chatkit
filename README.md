# Website Chatbot with OpenAI ChatKit

A complete, production-ready AI chatbot solution that can be easily integrated into any website with just one line of code.

## 🚀 Quick Start

### Option 1: One-Command Deployment (Recommended)
```bash
git clone https://github.com/yourusername/websitechatbot.git
cd websitechatbot
cp env.example .env
# Edit .env with your OpenAI API key

# Deploy with one command
./deploy.sh
```

### Option 2: Microservices Deployment (Production)
```bash
git clone https://github.com/yourusername/websitechatbot.git
cd websitechatbot
cp env.example .env
# Edit .env with your OpenAI API key

# Deploy microservices (separate containers)
./deploy.sh microservices
```

### Option 3: Local Development
```bash
git clone https://github.com/yourusername/websitechatbot.git
cd websitechatbot
npm run setup

# Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your OpenAI API key

# Start the application
npm start
# In another terminal: cd sample-website && python3 -m http.server 8080
```

### Option 3: One-Line Integration
**Add AI chat to any website in 3 steps:**

1. **Deploy Backend**: `cd backend && npm install && vercel --prod`
2. **Add Widget**: `<script src="https://your-domain.com/chatkit-widget.js"></script>`
3. **Done!** Your website now has AI-powered chat

## 📁 Project Structure

```
websitechatbot/
├── backend/                         # Node.js API server
│   ├── server.js                   # Main backend application
│   ├── security.js                 # Security management
│   ├── health.js                   # Health check endpoint
│   ├── Dockerfile                  # Backend container
│   └── package.json                # Dependencies
├── sample-website/                  # Demo website
│   ├── index.html                  # Working chatbot demo
│   └── styles.css                  # Demo styling
├── examples/                        # Integration examples
│   ├── basic-integration.html      # One-line integration
│   └── advanced-integration.html   # Advanced customization
├── chatkit-app/                     # Official ChatKit React app
│   ├── app/                        # React components
│   ├── components/                 # ChatKit components
│   └── package.json               # Dependencies
├── chatkit-widget.js               # Universal widget script
├── docker-compose.yml              # Container orchestration
├── nginx.conf                      # Frontend server config
├── env.example                     # Environment template
├── containerized-deployment-guide.md # Docker deployment guide
├── GETTING_STARTED_KIT.md          # Quick integration guide
├── ARCHITECTURE_DOCUMENTATION.md   # Technical architecture
└── README.md                       # This file
```

## ✨ Features

- 🤖 **AI-Powered**: OpenAI GPT-3.5 integration
- 🔌 **Pluggable**: Add to any website with one line
- 📱 **Responsive**: Works on all devices
- 🎨 **Customizable**: Match your brand
- 🔒 **Secure**: API key protection, rate limiting, CORS
- ⚡ **Real-time**: Instant responses
- 💾 **Session Management**: Conversation context
- 🌐 **Universal**: Works with any website
- 🐳 **Containerized**: Docker deployment ready
- 🚀 **Production-Ready**: Health checks, monitoring, scaling

## 🎯 Live Demo

**Docker Deployment:**
- **Website**: http://localhost:8080
- **Backend API**: http://localhost:3001
- **Widget Script**: http://localhost:8080/chatkit-widget.js

**Integration Examples:**
- **Basic Integration**: http://localhost:8080/examples/basic-integration.html
- **Advanced Integration**: http://localhost:8080/examples/advanced-integration.html
- **Status**: ✅ Fully functional with your OpenAI API key

## 📚 Documentation

### For Quick Integration
- **[Getting Started Kit](GETTING_STARTED_KIT.md)** - 3-step integration guide
- **[Plug & Play Guide](PLUG_AND_PLAY_GUIDE.md)** - Complete integration guide
- **[Microservices Deployment](MICROSERVICES_DEPLOYMENT.md)** - Production microservices setup
- **[Containerized Deployment Guide](containerized-deployment-guide.md)** - Docker deployment and scaling
- **One-line integration** for any website
- **Customization options** and examples

### For Technical Details
- **[Architecture Documentation](ARCHITECTURE_DOCUMENTATION.md)** - Complete technical overview
- **[Security Guide](SECURITY_GUIDE.md)** - Comprehensive security documentation
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Production deployment instructions
- **System architecture** and data flow
- **Security and performance** considerations

## 🔧 Current Setup

### Backend (Running on port 3001)
```bash
✅ Node.js Express server
✅ OpenAI API integration
✅ Session management
✅ CORS enabled
✅ Your API key configured
```

### Frontend (Running on port 8080)
```bash
✅ Working chatbot demo
✅ Mobile responsive
✅ Real-time messaging
✅ Error handling
```

## 🚀 Integration Examples

### WordPress
```php
// Add to functions.php
function add_chatbot() {
    echo '<script src="https://your-domain.com/chatkit-widget.js"></script>';
}
add_action('wp_footer', 'add_chatbot');
```

### React App
```jsx
useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://your-domain.com/chatkit-widget.js';
    document.body.appendChild(script);
}, []);
```

### Any HTML Website
```html
<!DOCTYPE html>
<html>
<head><title>My Website</title></head>
<body>
    <h1>Welcome to My Site</h1>
    <!-- Your content -->
    
    <!-- Add AI chatbot with one line -->
    <script src="https://your-domain.com/chatkit-widget.js"></script>
</body>
</html>
```

## 🎨 Customization

### Colors & Branding
```css
.chatkit-toggle {
    background: #your-brand-color !important;
}
```

### Position & Size
```css
.chatkit-toggle {
    bottom: 30px;
    left: 20px; /* Left side instead of right */
}

.chatkit-panel {
    width: 400px;
    height: 600px;
}
```

### AI Personality
```javascript
// In backend/server.js
{
    role: "system",
    content: "You are a helpful assistant for [Your Company]. [Your instructions]"
}
```

## 🔒 Security Features

- ✅ **API Key Protection**: Secure environment storage, never exposed to frontend
- ✅ **Input Sanitization**: XSS protection and content filtering
- ✅ **Rate Limiting**: 60 requests/minute, 1000 requests/hour per IP
- ✅ **CORS Security**: Configurable origin validation
- ✅ **Session Security**: Cryptographically secure session IDs
- ✅ **Security Headers**: Complete set of security headers
- ✅ **Audit Logging**: Comprehensive security event logging
- ✅ **Auto Cleanup**: Inactive sessions removed after 24h

## 📱 Mobile Support

- ✅ **Responsive Design**: Adapts to all screen sizes
- ✅ **Touch Friendly**: Optimized for mobile interaction
- ✅ **Full Screen**: Mobile-optimized chat experience
- ✅ **Cross Platform**: Works on iOS, Android, desktop

## 🚀 Deployment Options

### Vercel (Recommended)
```bash
cd backend
vercel --prod
```

### Heroku
```bash
git init
heroku create your-chatbot-backend
git push heroku main
```

### AWS/DigitalOcean
- Deploy Node.js app
- Set environment variables
- Configure domain and SSL

## 🧪 Testing

### Local Testing
```bash
# Backend
cd backend && npm start

# Frontend
cd sample-website && python3 -m http.server 8080

# Test
open http://localhost:8080
```

### Production Testing
1. Deploy backend to cloud
2. Update widget with production URL
3. Test on your website
4. Verify mobile responsiveness

## 🛠️ Troubleshooting

### Common Issues

**Widget not appearing?**
- Check browser console for errors
- Verify script path is correct
- Ensure backend is running

**Chat not responding?**
- Check backend URL in widget
- Verify OpenAI API key
- Check network requests in dev tools

**Styling conflicts?**
- Use CSS specificity or !important
- Check for conflicting styles

### Debug Steps
1. Open browser developer tools
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Verify backend is running: `curl http://localhost:3001/health`

## 📈 Performance

- ⚡ **Fast Loading**: Optimized JavaScript
- 🎯 **Efficient API**: Only necessary data sent
- 💾 **Smart Caching**: Session management
- 📱 **Mobile Optimized**: Responsive design

## 🔮 Future Enhancements

- **Streaming Responses**: Real-time message streaming
- **File Attachments**: Support for images/documents
- **Voice Interface**: Speech-to-text integration
- **Multi-language**: Automatic language detection
- **Analytics**: Usage tracking and insights

## 📞 Support

- **Documentation**: See the detailed guides above
- **Issues**: Check browser console for errors
- **Backend**: Verify API endpoints are working
- **OpenAI**: Check API key and usage limits

## 🎉 Success!

You now have a complete AI chatbot solution that can be integrated into any website with just one line of code. The system is:

- ✅ **Production Ready**: Secure, scalable, and reliable
- ✅ **Easy to Use**: One-line integration
- ✅ **Fully Customizable**: Match your brand
- ✅ **Mobile Friendly**: Works on all devices
- ✅ **AI Powered**: Intelligent responses with OpenAI GPT

**Ready to launch your AI-powered customer support! 🚀**
