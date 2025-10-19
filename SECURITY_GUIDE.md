# Security Guide for ChatKit Integration

## 🔒 Security Overview

This ChatKit integration implements enterprise-grade security measures to protect your API keys, user data, and system integrity.

## 🛡️ Security Features Implemented

### 1. API Key Protection
- ✅ **Secure Storage**: API keys are never stored in plain text
- ✅ **Environment Variables**: Keys stored in secure environment files
- ✅ **Validation**: API key format validation before use
- ✅ **Hashing**: API keys are hashed for verification
- ✅ **No Frontend Exposure**: Keys never sent to client-side

### 2. Input Validation & Sanitization
- ✅ **Message Sanitization**: All user input is sanitized
- ✅ **XSS Protection**: HTML and script injection prevention
- ✅ **Length Limits**: Message length restrictions (1000 chars)
- ✅ **Format Validation**: Session ID format validation
- ✅ **Content Filtering**: Dangerous content removal

### 3. Rate Limiting
- ✅ **Per-IP Limits**: 60 requests per minute per IP
- ✅ **Hourly Limits**: 1000 requests per hour per IP
- ✅ **Automatic Cleanup**: Old rate limit data removed
- ✅ **Graceful Handling**: Proper error responses for limits

### 4. CORS Security
- ✅ **Origin Validation**: Only allowed origins can access API
- ✅ **Configurable Origins**: Environment-based origin control
- ✅ **Security Logging**: Blocked requests are logged
- ✅ **Production Ready**: Separate configs for dev/prod

### 5. Session Security
- ✅ **Secure Session IDs**: Cryptographically secure generation
- ✅ **Session Validation**: Format and existence validation
- ✅ **Automatic Cleanup**: Inactive sessions removed after 24h
- ✅ **IP Tracking**: Session creation tied to IP address
- ✅ **Activity Monitoring**: Last activity timestamp tracking

### 6. Security Headers
- ✅ **X-Content-Type-Options**: Prevents MIME sniffing
- ✅ **X-Frame-Options**: Prevents clickjacking
- ✅ **X-XSS-Protection**: Browser XSS protection
- ✅ **Strict-Transport-Security**: HTTPS enforcement
- ✅ **Content-Security-Policy**: Script and style restrictions

### 7. Error Handling
- ✅ **Secure Error Messages**: No sensitive data in errors
- ✅ **Security Logging**: All security events logged
- ✅ **Graceful Failures**: System continues on non-critical errors
- ✅ **Input Validation**: All inputs validated before processing

## 🔧 Security Configuration

### Environment Variables

```bash
# Required - Your OpenAI API key
OPENAI_API_KEY=sk-proj-your-key-here

# Security - Allowed origins (comma-separated)
ALLOWED_ORIGINS=https://your-website.com,https://www.your-website.com

# Rate Limiting (optional)
MAX_REQUESTS_PER_MINUTE=60
MAX_REQUESTS_PER_HOUR=1000

# Session Management
SESSION_MAX_AGE_HOURS=24
```

### Production Security Checklist

- [ ] **API Key Security**
  - [ ] Store API key in environment variables only
  - [ ] Never commit API keys to version control
  - [ ] Use different keys for dev/staging/production
  - [ ] Rotate API keys regularly

- [ ] **CORS Configuration**
  - [ ] Set specific allowed origins (no wildcards)
  - [ ] Remove localhost origins in production
  - [ ] Use HTTPS origins only

- [ ] **Rate Limiting**
  - [ ] Adjust limits based on expected traffic
  - [ ] Monitor rate limit violations
  - [ ] Implement IP-based blocking for abuse

- [ ] **Session Management**
  - [ ] Use Redis for session storage in production
  - [ ] Implement session encryption
  - [ ] Set appropriate session timeouts

- [ ] **Monitoring & Logging**
  - [ ] Enable security event logging
  - [ ] Monitor for suspicious activity
  - [ ] Set up alerts for security violations

## 🚨 Security Best Practices

### 1. API Key Management
```bash
# ✅ Good - Environment variable
OPENAI_API_KEY=sk-proj-abc123...

# ❌ Bad - Hardcoded in code
const apiKey = "sk-proj-abc123...";

# ❌ Bad - In frontend
localStorage.setItem('apiKey', 'sk-proj-abc123...');
```

### 2. Input Validation
```javascript
// ✅ Good - Sanitized input
const sanitizedMessage = security.sanitizeInput(userInput);

// ❌ Bad - Direct use
const response = await openai.chat.completions.create({
  messages: [{ role: 'user', content: userInput }]
});
```

### 3. CORS Configuration
```javascript
// ✅ Good - Specific origins
const allowedOrigins = ['https://your-website.com'];

// ❌ Bad - Wildcard
const allowedOrigins = ['*'];

// ❌ Bad - No validation
app.use(cors());
```

### 4. Error Handling
```javascript
// ✅ Good - Generic error message
res.status(500).json({ error: 'Internal server error' });

// ❌ Bad - Exposing details
res.status(500).json({ error: error.stack });
```

## 🔍 Security Monitoring

### Security Events Logged
- `API_KEY_VALIDATION` - API key validation attempts
- `SESSION_CREATED` - New session creation
- `SESSION_CLEANUP` - Session cleanup events
- `RATE_LIMIT_EXCEEDED` - Rate limit violations
- `CORS_BLOCKED` - CORS policy violations
- `INVALID_SESSION_ID` - Invalid session attempts
- `CHAT_MESSAGE_PROCESSED` - Successful message processing
- `CHAT_ERROR` - Chat processing errors

### Monitoring Commands
```bash
# Check security logs
grep "SECURITY" backend/logs/app.log

# Monitor rate limiting
grep "RATE_LIMIT_EXCEEDED" backend/logs/app.log

# Check CORS violations
grep "CORS_BLOCKED" backend/logs/app.log
```

## 🛠️ Security Testing

### 1. API Key Security Test
```bash
# Test API key validation
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test","message":"hello"}'
```

### 2. Rate Limiting Test
```bash
# Test rate limiting (run multiple times quickly)
for i in {1..70}; do
  curl -X POST http://localhost:3001/api/chat \
    -H "Content-Type: application/json" \
    -d '{"sessionId":"test","message":"test"}'
done
```

### 3. Input Validation Test
```bash
# Test XSS protection
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test","message":"<script>alert(\"xss\")</script>"}'
```

### 4. CORS Test
```bash
# Test CORS from different origin
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -H "Origin: https://malicious-site.com" \
  -d '{"sessionId":"test","message":"hello"}'
```

## 🚀 Production Deployment Security

### 1. Environment Security
```bash
# Use secure environment variable management
export OPENAI_API_KEY="sk-proj-your-key"
export ALLOWED_ORIGINS="https://your-website.com"
export NODE_ENV="production"
```

### 2. Server Security
```bash
# Use HTTPS only
# Set up SSL certificates
# Configure firewall rules
# Enable security headers
```

### 3. Database Security (for production)
```javascript
// Use encrypted Redis for sessions
const redis = require('redis');
const client = redis.createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD
});
```

### 4. Monitoring Setup
```bash
# Set up security monitoring
# Configure alerts for security events
# Monitor API usage and costs
# Track suspicious activity
```

## 🔐 Additional Security Recommendations

### 1. API Key Rotation
- Rotate OpenAI API keys monthly
- Use different keys for different environments
- Monitor API usage for anomalies

### 2. Network Security
- Use HTTPS everywhere
- Implement IP whitelisting if needed
- Set up DDoS protection

### 3. Data Protection
- Encrypt sensitive data at rest
- Use secure session storage
- Implement data retention policies

### 4. Compliance
- Follow GDPR guidelines for EU users
- Implement data deletion capabilities
- Maintain audit logs

## 📞 Security Incident Response

### 1. Immediate Actions
- Revoke compromised API keys
- Block suspicious IP addresses
- Review security logs
- Update security configurations

### 2. Investigation
- Analyze security event logs
- Identify attack vectors
- Assess data exposure
- Document findings

### 3. Recovery
- Implement additional security measures
- Update security policies
- Notify affected users if necessary
- Conduct security review

## ✅ Security Checklist

- [ ] API keys stored securely in environment variables
- [ ] CORS configured with specific allowed origins
- [ ] Rate limiting implemented and tested
- [ ] Input validation and sanitization active
- [ ] Security headers configured
- [ ] Session management secure
- [ ] Error handling doesn't expose sensitive data
- [ ] Security logging enabled
- [ ] HTTPS enforced in production
- [ ] Regular security monitoring in place

## 🎯 Conclusion

This ChatKit integration implements comprehensive security measures to protect your system and users. The security features are designed to be:

- **Defense in Depth**: Multiple layers of protection
- **Zero Trust**: Validate everything, trust nothing
- **Secure by Default**: Safe configurations out of the box
- **Production Ready**: Enterprise-grade security features

By following this security guide and implementing the recommended practices, your ChatKit integration will be secure and ready for production use.
