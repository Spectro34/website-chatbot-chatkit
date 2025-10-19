# 🚀 ChatKit Deployment Guide

Complete guide for deploying ChatKit in various environments.

## 📋 Quick Reference

| Environment | Command | Description |
|-------------|---------|-------------|
| **Local Development** | `./deploy.sh ollama` | Local development with optional Ollama |
| **Microservices** | `./deploy.sh microservices-ollama` | Production-ready containerized setup |
| **OpenAI Only** | `./deploy.sh microservices` | Cloud-only deployment |

## 🏠 Local Development

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- Git

### Quick Start
```bash
# Clone repository
git clone https://github.com/yourusername/websitechatbot.git
cd websitechatbot

# Configure environment variables
cp env.example .env
nano .env  # Add your OpenAI API key

# Start with Ollama support
./deploy.sh ollama

# Or start with OpenAI only
./deploy.sh microservices
```

### Development Features
- ✅ Hot reload enabled
- ✅ Debug logging
- ✅ Optional Ollama support
- ✅ Local file watching

## 🐳 Containerized Deployment

### Option 1: With Containerized Ollama (Recommended)

#### Step 1: Setup Ollama
```bash
cd ollama-setup
./setup.sh start
cd ..
```

#### Step 2: Deploy ChatKit
```bash
./deploy.sh microservices-ollama
```

#### Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Website       │    │   ChatBot       │    │   Ollama        │
│   (Port 8080)   │◄──►│   (Port 3001)   │◄──►│   (Port 11434)  │
│   Nginx + UI    │    │   Node.js API   │    │   LLM Engine    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Option 2: OpenAI Only

```bash
# Set OpenAI API key
export OPENAI_API_KEY=your-api-key

# Deploy with OpenAI
./deploy.sh microservices
```

## ☁️ Cloud Deployment

### AWS Deployment

#### Using ECS
```bash
# Build and push images
docker build -t your-account.dkr.ecr.region.amazonaws.com/chatkit-backend ./backend
docker build -t your-account.dkr.ecr.region.amazonaws.com/chatkit-frontend ./sample-website

# Push to ECR
aws ecr get-login-password --region region | docker login --username AWS --password-stdin your-account.dkr.ecr.region.amazonaws.com
docker push your-account.dkr.ecr.region.amazonaws.com/chatkit-backend
docker push your-account.dkr.ecr.region.amazonaws.com/chatkit-frontend

# Deploy with ECS
aws ecs create-service --cluster your-cluster --service-name chatkit --task-definition chatkit-task
```

#### Using EKS
```yaml
# kubernetes-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: chatkit-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: chatkit-backend
  template:
    metadata:
      labels:
        app: chatkit-backend
    spec:
      containers:
      - name: chatkit-backend
        image: your-account.dkr.ecr.region.amazonaws.com/chatkit-backend
        ports:
        - containerPort: 3001
        env:
        - name: OLLAMA_BASE_URL
          value: "http://ollama-service:11434"
        - name: OLLAMA_MODEL
          value: "llama2:latest"
```

### Google Cloud Platform

#### Using Cloud Run
```bash
# Build and deploy
gcloud builds submit --tag gcr.io/your-project/chatkit-backend ./backend
gcloud builds submit --tag gcr.io/your-project/chatkit-frontend ./sample-website

# Deploy to Cloud Run
gcloud run deploy chatkit-backend --image gcr.io/your-project/chatkit-backend --platform managed --region us-central1 --allow-unauthenticated
gcloud run deploy chatkit-frontend --image gcr.io/your-project/chatkit-frontend --platform managed --region us-central1 --allow-unauthenticated
```

#### Using GKE
```bash
# Create cluster
gcloud container clusters create chatkit-cluster --num-nodes=3 --zone=us-central1-a

# Deploy application
kubectl apply -f kubernetes-deployment.yaml
```

### Azure Deployment

#### Using Container Instances
```bash
# Deploy to Azure Container Instances
az container create \
  --resource-group myResourceGroup \
  --name chatkit-backend \
  --image your-registry.azurecr.io/chatkit-backend \
  --dns-name-label chatkit-backend \
  --ports 3001
```

#### Using AKS
```bash
# Create AKS cluster
az aks create --resource-group myResourceGroup --name chatkit-cluster --node-count 3 --enable-addons monitoring

# Deploy application
kubectl apply -f kubernetes-deployment.yaml
```

## ⚙️ Configuration

### Step-by-Step Configuration

#### 1. Main Project Configuration
```bash
# Copy environment template
cp env.example .env

# Edit configuration
nano .env
```

**Required Configuration:**
```bash
# OpenAI API Key (REQUIRED for fallback)
OPENAI_API_KEY=sk-proj-your-openai-api-key-here

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

#### 2. Ollama Configuration
```bash
# Navigate to Ollama setup
cd ollama-setup

# Copy environment template
cp env.example .env

# Edit Ollama configuration
nano .env
```

**Ollama Configuration:**
```bash
# Ollama Model Configuration
OLLAMA_MODEL=llama2        # Default model (3.8GB)
# OLLAMA_MODEL=mistral     # Alternative model (4.1GB)
# OLLAMA_MODEL=codellama   # Code-focused model (3.8GB)
# OLLAMA_MODEL=llama2:13b  # Higher quality (7.3GB, needs 16GB+ RAM)
```

#### 3. Container Environment Variables

The containers automatically use environment variables from your `.env` file:

```yaml
# docker-compose.microservices-ollama.yml
services:
  chatbot-backend:
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - OLLAMA_BASE_URL=http://ollama-server:11434
      - OLLAMA_MODEL=llama2:latest
      - ALLOWED_ORIGINS=${ALLOWED_ORIGINS}
      - PORT=${PORT:-3001}
      - NODE_ENV=${NODE_ENV:-production}
```

#### 4. Security Configuration

**API Key Security:**
```bash
# Never commit .env files to git
echo ".env" >> .gitignore
echo "ollama-setup/.env" >> .gitignore

# Use strong, unique API keys
OPENAI_API_KEY=sk-proj-1234567890abcdef...

# Restrict allowed origins
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

**Rate Limiting:**
```bash
# Set appropriate rate limits
MAX_REQUESTS_PER_MINUTE=60
MAX_REQUESTS_PER_HOUR=1000
```

**Session Security:**
```bash
# Session configuration
SESSION_MAX_AGE_HOURS=24
```

### Environment Variables

#### Backend Configuration
```bash
# Server Configuration
PORT=3001
NODE_ENV=production

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:8080,https://yourdomain.com

# Rate Limiting
RATE_LIMIT_REQUESTS_PER_MINUTE=60
RATE_LIMIT_REQUESTS_PER_HOUR=1000
RATE_LIMIT_BURST=10

# Security
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
API_KEY_HASH_SALT=your-salt-for-api-key-hashing-change-this-in-production

# Ollama Configuration
OLLAMA_BASE_URL=http://ollama-server:11434
OLLAMA_MODEL=llama2:latest
OLLAMA_API_KEY=ollama

# OpenAI Fallback
OPENAI_API_KEY=your-openai-api-key
```

#### Frontend Configuration
```bash
# Widget Configuration
CHATKIT_API_URL=https://your-api.com
CHATKIT_THEME=light
CHATKIT_POSITION=bottom-right
```

### Docker Compose Configuration

#### Production Configuration
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  chatbot-backend:
    image: your-registry/chatkit-backend:latest
    environment:
      - NODE_ENV=production
      - PORT=3001
      - OLLAMA_BASE_URL=http://ollama-server:11434
      - OLLAMA_MODEL=llama2:latest
    ports:
      - "3001:3001"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  sample-website:
    image: your-registry/chatkit-frontend:latest
    ports:
      - "8080:80"
    restart: unless-stopped
    depends_on:
      - chatbot-backend
```

## 🔒 Security Configuration

### SSL/TLS Setup
```nginx
# nginx.conf
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/ssl/certs/yourdomain.com.crt;
    ssl_certificate_key /etc/ssl/private/yourdomain.com.key;
    
    location / {
        proxy_pass http://chatkit-frontend;
    }
    
    location /api/ {
        proxy_pass http://chatkit-backend;
    }
}
```

### Security Headers
```javascript
// Security middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000');
  next();
});
```

## 📊 Monitoring & Logging

### Health Checks
```bash
# Check backend health
curl http://localhost:3001/health

# Check frontend health
curl http://localhost:8080

# Check Ollama health
curl http://localhost:11434/api/tags
```

### Logging Configuration
```javascript
// Structured logging
const logger = {
  info: (message, meta) => console.log(JSON.stringify({
    level: 'info',
    message,
    timestamp: new Date().toISOString(),
    service: 'chatkit-backend',
    ...meta
  }))
};
```

### Monitoring Setup
```yaml
# Prometheus configuration
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'chatkit-backend'
    static_configs:
      - targets: ['chatkit-backend:3001']
    metrics_path: '/metrics'
    scrape_interval: 5s
```

## 🚀 Scaling

### Horizontal Scaling
```bash
# Scale ChatBot backend
docker service scale chatbot-backend=3

# Scale with Docker Swarm
docker service create --name chatbot-backend --replicas 3 your-registry/chatkit-backend
```

### Load Balancer Configuration
```nginx
# nginx load balancer
upstream backend {
    server chatbot-backend-1:3001;
    server chatbot-backend-2:3001;
    server chatbot-backend-3:3001;
}

server {
    location /api/ {
        proxy_pass http://backend;
    }
}
```

## 🔧 Troubleshooting

### Common Issues

#### Container Won't Start
```bash
# Check logs
docker logs chatbot-backend-ollama

# Check container status
docker ps -a

# Restart container
docker restart chatbot-backend-ollama
```

#### API Connection Issues
```bash
# Test API connectivity
curl -X POST http://localhost:3001/api/create-session

# Check network connectivity
docker network ls
docker network inspect websitechatbot_chatbot-network
```

#### Ollama Connection Issues
```bash
# Check Ollama status
curl http://localhost:11434/api/tags

# Check Ollama logs
docker logs ollama-server

# Restart Ollama
cd ollama-setup && ./setup.sh restart
```

### Performance Issues

#### High Memory Usage
```bash
# Check memory usage
docker stats

# Increase memory limits
docker run --memory=1g your-image
```

#### Slow Response Times
```bash
# Check response times
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3001/health

# Monitor with htop
htop
```

## 📚 Additional Resources

- **[Architecture Documentation](ARCHITECTURE_DOCUMENTATION.md)** - Technical details
- **[Security Guide](SECURITY_GUIDE.md)** - Security configuration
- **[ChatKit Integration Guide](CHATKIT_INTEGRATION_GUIDE.md)** - Integration details
- **[Ollama Setup](ollama-setup/README.md)** - Ollama configuration

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/websitechatbot/issues)
- **Documentation**: See docs/ folder
- **Examples**: See examples/ folder

---

*This deployment guide covers the most common deployment scenarios. For specific cloud provider details, consult their official documentation.*