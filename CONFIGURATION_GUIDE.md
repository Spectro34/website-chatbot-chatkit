# ⚙️ ChatKit Configuration Guide

Complete guide for configuring ChatKit with OpenAI API keys, Ollama setup, and containerized deployment.

## 📋 Quick Configuration Checklist

- [ ] Copy `env.example` to `.env` in main project
- [ ] Add your OpenAI API key to `.env`
- [ ] Copy `env.example` to `ollama-setup/.env`
- [ ] Configure Ollama model in `ollama-setup/.env`
- [ ] Set allowed origins for your domain
- [ ] Configure rate limiting for your needs
- [ ] Test the configuration

## 🔑 API Key Configuration

### OpenAI API Key Setup

#### 1. Get Your OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-proj-`)

#### 2. Configure in Main Project
```bash
# Copy environment template
cp env.example .env

# Edit configuration
nano .env
```

**Add your OpenAI API key:**
```bash
# OpenAI API Configuration
OPENAI_API_KEY=sk-proj-your-actual-api-key-here

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

#### 3. Security Best Practices
```bash
# Never commit .env files to git
echo ".env" >> .gitignore
echo "ollama-setup/.env" >> .gitignore

# Use strong, unique API keys
OPENAI_API_KEY=sk-proj-1234567890abcdef...

# Restrict allowed origins
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## 🧠 Ollama Configuration

### Ollama Setup and Model Configuration

#### 1. Configure Ollama Model
```bash
# Navigate to Ollama setup
cd ollama-setup

# Copy environment template
cp env.example .env

# Edit Ollama configuration
nano .env
```

**Choose your model:**
```bash
# Ollama Model Configuration
OLLAMA_MODEL=llama2        # Default model (3.8GB, 8GB+ RAM)
# OLLAMA_MODEL=mistral     # Alternative model (4.1GB, 8GB+ RAM)
# OLLAMA_MODEL=codellama   # Code-focused model (3.8GB, 8GB+ RAM)
# OLLAMA_MODEL=llama2:13b  # Higher quality (7.3GB, 16GB+ RAM)
# OLLAMA_MODEL=llama2:70b  # Best quality (40GB, 64GB+ RAM)
```

#### 2. Model Comparison
| Model | Size | RAM | Speed | Quality | Best For |
|-------|------|-----|-------|---------|----------|
| `llama2` | 3.8GB | 8GB+ | Medium | Good | General purpose |
| `mistral` | 4.1GB | 8GB+ | Fast | Good | Quick responses |
| `codellama` | 3.8GB | 8GB+ | Medium | Good | Code assistance |
| `llama2:13b` | 7.3GB | 16GB+ | Slow | Better | Higher quality |
| `llama2:70b` | 40GB | 64GB+ | Very Slow | Best | Maximum quality |

#### 3. Start Ollama with Your Model
```bash
# Start Ollama and pull your configured model
./setup.sh start

# Or manually pull a specific model
./setup.sh pull
```

## 🐳 Container Configuration

### Docker Compose Environment Variables

The containers automatically use environment variables from your `.env` file:

```yaml
# docker-compose.microservices-ollama.yml
services:
  chatbot-backend:
    environment:
      # OpenAI Configuration
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      
      # Ollama Configuration
      - OLLAMA_BASE_URL=http://ollama-server:11434
      - OLLAMA_MODEL=llama2:latest
      - OLLAMA_API_KEY=ollama
      
      # Server Configuration
      - PORT=${PORT:-3001}
      - NODE_ENV=${NODE_ENV:-production}
      
      # Security Configuration
      - ALLOWED_ORIGINS=${ALLOWED_ORIGINS}
      - RATE_LIMIT_REQUESTS_PER_MINUTE=${MAX_REQUESTS_PER_MINUTE:-60}
      - RATE_LIMIT_REQUESTS_PER_HOUR=${MAX_REQUESTS_PER_HOUR:-1000}
      
      # Session Configuration
      - SESSION_MAX_AGE_HOURS=${SESSION_MAX_AGE_HOURS:-24}
```

### Container Environment Mapping

| Environment Variable | Container Usage | Default Value |
|---------------------|-----------------|---------------|
| `OPENAI_API_KEY` | OpenAI API fallback | Required |
| `OLLAMA_BASE_URL` | Ollama server URL | `http://ollama-server:11434` |
| `OLLAMA_MODEL` | Ollama model name | `llama2:latest` |
| `PORT` | Backend server port | `3001` |
| `NODE_ENV` | Node.js environment | `production` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:8080` |
| `MAX_REQUESTS_PER_MINUTE` | Rate limiting | `60` |
| `MAX_REQUESTS_PER_HOUR` | Rate limiting | `1000` |

## 🔧 Advanced Configuration

### Custom Model Configuration

#### Using Different Ollama Models
```bash
# In ollama-setup/.env
OLLAMA_MODEL=mistral

# Start with new model
cd ollama-setup
./setup.sh restart
```

#### Using Custom Ollama Server
```bash
# In main project .env
OLLAMA_BASE_URL=http://your-custom-ollama-server:11434
OLLAMA_MODEL=your-custom-model
```

### Security Configuration

#### Rate Limiting
```bash
# Adjust rate limits based on your needs
MAX_REQUESTS_PER_MINUTE=60    # Per IP per minute
MAX_REQUESTS_PER_HOUR=1000    # Per IP per hour
RATE_LIMIT_BURST=10           # Burst requests allowed
```

#### CORS Configuration
```bash
# Allow specific domains
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com,https://app.yourdomain.com

# Allow all origins (NOT recommended for production)
ALLOWED_ORIGINS=*
```

#### Session Configuration
```bash
# Session timeout
SESSION_MAX_AGE_HOURS=24

# Session secret (generate a strong secret)
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# API key hash salt
API_KEY_HASH_SALT=your-salt-for-api-key-hashing-change-this-in-production
```

### Production Configuration

#### Environment-Specific Settings
```bash
# Development
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:8080,http://localhost:3000
MAX_REQUESTS_PER_MINUTE=120

# Staging
NODE_ENV=staging
ALLOWED_ORIGINS=https://staging.yourdomain.com
MAX_REQUESTS_PER_MINUTE=60

# Production
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
MAX_REQUESTS_PER_MINUTE=60
```

#### SSL/TLS Configuration
```bash
# For HTTPS deployment
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## 🧪 Testing Configuration

### Verify Configuration

#### 1. Test OpenAI API Key
```bash
# Test OpenAI connection
curl -X POST http://localhost:3001/health
```

#### 2. Test Ollama Connection
```bash
# Test Ollama connection
curl http://localhost:11434/api/tags
```

#### 3. Test ChatBot API
```bash
# Create session
curl -X POST http://localhost:3001/api/create-session

# Send test message
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"your-session-id","message":"Hello!"}'
```

### Configuration Validation

#### Check Environment Variables
```bash
# Check main project configuration
cat .env

# Check Ollama configuration
cat ollama-setup/.env

# Check container environment
docker exec chatbot-backend-ollama env | grep -E "(OPENAI|OLLAMA|PORT|NODE_ENV)"
```

#### Check Container Status
```bash
# Check all containers
docker ps

# Check container logs
docker logs chatbot-backend-ollama
docker logs ollama-server
```

## 🚨 Troubleshooting Configuration

### Common Issues

#### OpenAI API Key Issues
```bash
# Error: OpenAI API key not configured
# Solution: Add OPENAI_API_KEY to .env file

# Error: Invalid API key
# Solution: Check API key format (starts with sk-proj-)

# Error: API key expired
# Solution: Generate new API key from OpenAI platform
```

#### Ollama Configuration Issues
```bash
# Error: Ollama not available
# Solution: Start Ollama container
cd ollama-setup && ./setup.sh start

# Error: Model not found
# Solution: Pull the model
cd ollama-setup && ./setup.sh pull

# Error: Connection refused
# Solution: Check Ollama container status
docker ps | grep ollama
```

#### Container Environment Issues
```bash
# Error: Environment variable not set
# Solution: Check .env file and restart containers

# Error: CORS blocked
# Solution: Add your domain to ALLOWED_ORIGINS

# Error: Rate limit exceeded
# Solution: Adjust rate limiting settings
```

### Configuration Debugging

#### Enable Debug Logging
```bash
# Add to .env
NODE_ENV=development
DEBUG=chatkit:*

# Restart containers
docker compose -f docker-compose.microservices-ollama.yml restart
```

#### Check Container Environment
```bash
# Check backend environment
docker exec chatbot-backend-ollama printenv | grep -E "(OPENAI|OLLAMA|PORT|NODE_ENV)"

# Check Ollama environment
docker exec ollama-server printenv | grep OLLAMA
```

## 📚 Configuration Examples

### Complete Production Configuration

#### Main Project (.env)
```bash
# OpenAI API Configuration
OPENAI_API_KEY=sk-proj-your-production-api-key-here

# Server Configuration
NODE_ENV=production
PORT=3001

# Security Configuration
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
MAX_REQUESTS_PER_MINUTE=60
MAX_REQUESTS_PER_HOUR=1000
SESSION_MAX_AGE_HOURS=24

# Security Secrets (generate strong secrets)
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
API_KEY_HASH_SALT=your-salt-for-api-key-hashing-change-this-in-production
```

#### Ollama Setup (ollama-setup/.env)
```bash
# Ollama Model Configuration
OLLAMA_MODEL=llama2:latest
```

### Development Configuration

#### Main Project (.env)
```bash
# OpenAI API Configuration
OPENAI_API_KEY=sk-proj-your-development-api-key-here

# Server Configuration
NODE_ENV=development
PORT=3001

# Security Configuration
ALLOWED_ORIGINS=http://localhost:8080,http://localhost:3000
MAX_REQUESTS_PER_MINUTE=120
MAX_REQUESTS_PER_HOUR=2000
SESSION_MAX_AGE_HOURS=24
```

#### Ollama Setup (ollama-setup/.env)
```bash
# Ollama Model Configuration (smaller model for development)
OLLAMA_MODEL=llama2
```

## 🎯 Next Steps

1. **Configure your environment** using the examples above
2. **Test the configuration** using the verification steps
3. **Deploy the containers** using the deployment guide
4. **Monitor the logs** to ensure everything is working
5. **Adjust settings** based on your specific needs

For more information, see:
- **[README.md](README.md)** - Quick start guide
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Deployment instructions
- **[ARCHITECTURE_DOCUMENTATION.md](ARCHITECTURE_DOCUMENTATION.md)** - Technical details
