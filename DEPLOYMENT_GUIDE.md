# Deployment Guide for ChatKit Integration

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended - Free Tier Available)

#### Backend Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy backend
cd backend
vercel --prod

# Set environment variables
vercel env add OPENAI_API_KEY
vercel env add ALLOWED_ORIGINS
```

#### Frontend Deployment
```bash
# Deploy frontend (static files)
cd sample-website
vercel --prod
```

### Option 2: Heroku (Easy Setup)

#### Backend Deployment
```bash
# Install Heroku CLI
# Create Heroku app
heroku create your-chatbot-backend

# Set environment variables
heroku config:set OPENAI_API_KEY=sk-proj-your-key
heroku config:set ALLOWED_ORIGINS=https://your-website.com

# Deploy
git push heroku main
```

### Option 3: AWS (Production Scale)

#### Using AWS Elastic Beanstalk
```bash
# Install EB CLI
pip install awsebcli

# Initialize EB
eb init

# Create environment
eb create production

# Deploy
eb deploy
```

## 🔧 Environment Configuration

### Required Environment Variables

```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-your-openai-api-key-here

# Server Configuration
PORT=3001
NODE_ENV=production

# Security Configuration
ALLOWED_ORIGINS=https://your-website.com,https://www.your-website.com

# Optional Configuration
MAX_REQUESTS_PER_MINUTE=60
MAX_REQUESTS_PER_HOUR=1000
SESSION_MAX_AGE_HOURS=24
```

### Environment Setup by Platform

#### Vercel
```bash
# Set via CLI
vercel env add OPENAI_API_KEY production
vercel env add ALLOWED_ORIGINS production

# Or via dashboard
# Go to: https://vercel.com/dashboard
# Select your project → Settings → Environment Variables
```

#### Heroku
```bash
# Set via CLI
heroku config:set OPENAI_API_KEY=sk-proj-your-key
heroku config:set ALLOWED_ORIGINS=https://your-website.com

# Or via dashboard
# Go to: https://dashboard.heroku.com
# Select your app → Settings → Config Vars
```

#### AWS
```bash
# Set via EB CLI
eb setenv OPENAI_API_KEY=sk-proj-your-key
eb setenv ALLOWED_ORIGINS=https://your-website.com

# Or via AWS Console
# Go to: Elastic Beanstalk → Your Environment → Configuration
```

## 📱 Frontend Integration

### 1. Update Backend URL
```javascript
// In your website's JavaScript
const CONFIG = {
    backendUrl: 'https://your-backend.vercel.app', // Your deployed backend URL
    sessionId: null
};
```

### 2. Add Chat Widget
```html
<!-- Add to any website -->
<script src="https://your-domain.com/chatkit-widget.js"></script>
```

### 3. Customize Widget
```css
/* Override default styles */
.chatkit-toggle {
    background: #your-brand-color !important;
    bottom: 30px !important;
    right: 30px !important;
}
```

## 🔒 Security Checklist

### Pre-Deployment
- [ ] API key stored in environment variables
- [ ] CORS origins configured for production
- [ ] Rate limiting configured appropriately
- [ ] Security headers enabled
- [ ] HTTPS enforced

### Post-Deployment
- [ ] Test API endpoints
- [ ] Verify CORS configuration
- [ ] Test rate limiting
- [ ] Check security headers
- [ ] Monitor logs for errors

## 🧪 Testing Deployment

### 1. Health Check
```bash
curl https://your-backend.vercel.app/health
```

### 2. API Test
```bash
# Create session
curl -X POST https://your-backend.vercel.app/api/create-session \
  -H "Content-Type: application/json"

# Send message
curl -X POST https://your-backend.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test123","message":"Hello"}'
```

### 3. Frontend Test
```bash
# Test website with chat widget
open https://your-website.com
```

## 📊 Monitoring and Maintenance

### 1. Log Monitoring
```bash
# Vercel logs
vercel logs

# Heroku logs
heroku logs --tail

# AWS logs
eb logs
```

### 2. Performance Monitoring
- Monitor API response times
- Track error rates
- Monitor OpenAI API usage
- Check rate limiting effectiveness

### 3. Security Monitoring
- Monitor security event logs
- Check for suspicious activity
- Verify CORS violations
- Monitor rate limit violations

## 🔄 Updates and Maintenance

### 1. Code Updates
```bash
# Pull latest changes
git pull origin main

# Deploy updates
vercel --prod  # or heroku, eb deploy, etc.
```

### 2. Environment Updates
```bash
# Update environment variables
vercel env add NEW_VARIABLE production
# or
heroku config:set NEW_VARIABLE=value
```

### 3. Dependencies Updates
```bash
# Update backend dependencies
cd backend
npm update
npm audit fix

# Deploy updates
vercel --prod
```

## 🚨 Troubleshooting

### Common Issues

#### 1. CORS Errors
```bash
# Check ALLOWED_ORIGINS environment variable
echo $ALLOWED_ORIGINS

# Update if needed
vercel env add ALLOWED_ORIGINS production
```

#### 2. API Key Errors
```bash
# Verify API key is set
vercel env ls

# Test API key
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/models
```

#### 3. Rate Limiting Issues
```bash
# Check rate limit configuration
# Adjust MAX_REQUESTS_PER_MINUTE if needed
vercel env add MAX_REQUESTS_PER_MINUTE production
```

### Debug Commands

#### Vercel
```bash
# View logs
vercel logs

# Check environment
vercel env ls

# Debug locally
vercel dev
```

#### Heroku
```bash
# View logs
heroku logs --tail

# Check config
heroku config

# Debug locally
heroku local
```

#### AWS
```bash
# View logs
eb logs

# Check environment
eb status

# Debug locally
eb local run
```

## 📈 Scaling Considerations

### 1. High Traffic
- Use Redis for session storage
- Implement load balancing
- Use CDN for static assets
- Monitor OpenAI API limits

### 2. Global Deployment
- Deploy to multiple regions
- Use edge functions
- Implement geo-routing
- Monitor latency

### 3. Cost Optimization
- Monitor OpenAI API usage
- Implement caching
- Use appropriate instance sizes
- Set up billing alerts

## 🎯 Production Best Practices

### 1. Security
- Regular security audits
- API key rotation
- Monitor for vulnerabilities
- Keep dependencies updated

### 2. Performance
- Monitor response times
- Optimize database queries
- Use caching strategies
- Implement CDN

### 3. Reliability
- Set up health checks
- Implement circuit breakers
- Use monitoring tools
- Plan for disaster recovery

## 📞 Support

### Getting Help
- Check logs for error messages
- Review security guide
- Test with curl commands
- Monitor API usage

### Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Heroku Documentation](https://devcenter.heroku.com/)
- [AWS Elastic Beanstalk](https://docs.aws.amazon.com/elasticbeanstalk/)
- [OpenAI API Documentation](https://platform.openai.com/docs)

## ✅ Deployment Checklist

- [ ] Backend deployed successfully
- [ ] Environment variables configured
- [ ] CORS origins set correctly
- [ ] API key working
- [ ] Frontend integrated
- [ ] Security features enabled
- [ ] Monitoring set up
- [ ] Testing completed
- [ ] Documentation updated
- [ ] Team notified

## 🎉 Success!

Your ChatKit integration is now deployed and ready for production use! The system provides:

- ✅ **Secure AI Chat**: Powered by OpenAI GPT
- ✅ **Easy Integration**: One line of code
- ✅ **Production Ready**: Enterprise-grade security
- ✅ **Scalable**: Handles high traffic
- ✅ **Monitored**: Comprehensive logging
- ✅ **Maintained**: Easy updates and fixes

**Your AI-powered customer support is live! 🚀**
