# ChatKit Getting Started Kit 🚀

## Quick Start - 3 Steps to Add AI Chat to Any Website

### Step 1: Deploy the Backend
```bash
# Clone or download the backend
cd backend
npm install

# Set your OpenAI API key
echo "OPENAI_API_KEY=sk-proj-your-key-here" > .env

# Deploy to Vercel (recommended)
npm i -g vercel
vercel --prod

# Or deploy to Heroku
git init
heroku create your-chatbot-backend
git add .
git commit -m "Deploy chatbot backend"
git push heroku main
```

### Step 2: Add Chat Widget to Your Website
Add this single line to any website's HTML:

```html
<!-- Add before closing </body> tag -->
<script src="https://your-domain.com/chatkit-widget.js"></script>
```

### Step 3: Configure the Widget
Update the backend URL in the widget file:

```javascript
const CONFIG = {
    backendUrl: 'https://your-backend.vercel.app', // Your deployed backend
    sessionId: null
};
```

**That's it! Your website now has AI-powered chat! 🎉**

## What You Get

✅ **AI-Powered Responses** - Powered by OpenAI GPT  
✅ **Session Management** - Remembers conversation context  
✅ **Mobile Responsive** - Works on all devices  
✅ **Easy Integration** - One line of code  
✅ **Customizable** - Match your brand  
✅ **Production Ready** - Secure and scalable  

## Integration Examples

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
// Add to your main component
useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://your-domain.com/chatkit-widget.js';
    document.body.appendChild(script);
}, []);
```

### Static HTML
```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
</head>
<body>
    <h1>Welcome to My Site</h1>
    <p>Your content here...</p>
    
    <!-- Chatbot automatically appears -->
    <script src="https://your-domain.com/chatkit-widget.js"></script>
</body>
</html>
```

### E-commerce (Shopify, WooCommerce, etc.)
```html
<!-- Add to theme footer -->
<script src="https://your-domain.com/chatkit-widget.js"></script>
```

## Customization Options

### 1. Change Colors
```css
/* Override in your CSS */
.chatkit-toggle {
    background: #your-brand-color !important;
}

.chatkit-header {
    background: #your-brand-color !important;
}
```

### 2. Change Position
```css
.chatkit-toggle {
    bottom: 30px;
    left: 20px; /* Left side instead of right */
}
```

### 3. Change Size
```css
.chatkit-panel {
    width: 400px;
    height: 600px;
}
```

### 4. Custom Welcome Message
```javascript
// In the widget file, change:
addMessage('Your Company Assistant', 'Welcome! How can we help?', 'bot');
```

## Backend Configuration

### Environment Variables
```bash
# Required
OPENAI_API_KEY=sk-proj-your-key-here

# Optional
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://your-website.com
```

### Custom AI Personality
```javascript
// In backend/server.js, modify the system prompt:
{
    role: "system",
    content: "You are a helpful assistant for [Your Company]. [Your specific instructions]"
}
```

## Deployment Options

### Option 1: Vercel (Recommended)
- Free tier available
- Automatic HTTPS
- Global CDN
- Easy deployment

### Option 2: Heroku
- Easy deployment
- Free tier available
- Good for testing

### Option 3: AWS/DigitalOcean
- Full control
- Scalable
- Production ready

## Testing Your Integration

### 1. Local Testing
```bash
# Start backend
cd backend && npm start

# Test with any website
# Add widget script to any HTML file
# Open in browser and test chat
```

### 2. Production Testing
1. Deploy backend to cloud
2. Update widget with production URL
3. Test on your website
4. Verify mobile responsiveness

## Troubleshooting

### Common Issues:

**Widget not appearing?**
- Check browser console for errors
- Verify script path is correct
- Ensure backend is running

**Chat not responding?**
- Check backend URL in widget
- Verify OpenAI API key
- Check network requests in browser dev tools

**Styling conflicts?**
- Use CSS specificity or !important
- Check for conflicting styles
- Test on different browsers

## Support

- **Documentation**: See ARCHITECTURE_DOCUMENTATION.md
- **Issues**: Check browser console for errors
- **Backend**: Verify API endpoints are working
- **OpenAI**: Check API key and usage limits

## Next Steps

1. **Deploy Backend** - Get your API online
2. **Add Widget** - One line to any website
3. **Customize** - Match your brand
4. **Test** - Verify everything works
5. **Go Live** - Launch your AI chatbot!

## Success! 🎉

You now have a fully functional AI chatbot that can be added to any website with just one line of code. The chatbot will:

- Provide intelligent responses using OpenAI GPT
- Remember conversation context
- Work on all devices
- Scale automatically
- Integrate seamlessly with any website

**Ready to launch your AI-powered customer support!**
