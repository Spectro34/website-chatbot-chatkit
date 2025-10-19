# 🏗️ Microservices Deployment Guide

## Overview

This guide covers deploying the ChatKit integration using a microservices architecture where the sample website and chatbot backend run in separate containers. This is the standard production approach for scalable, maintainable applications.

## 🏛️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Production Environment                   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │  Sample Website │    │  ChatBot Backend│                │
│  │   Container     │    │   Container     │                │
│  │                 │    │                 │                │
│  │  - Nginx        │    │  - Node.js API  │                │
│  │  - Static Files │    │  - OpenAI API   │                │
│  │  - Widget JS    │    │  - Security     │                │
│  │  - Port 8080    │    │  - Port 3001    │                │
│  └─────────────────┘    └─────────────────┘                │
│           │                       │                        │
│           └───────────┬───────────┘                        │
│                       │                                    │
│              ┌────────▼────────┐                           │
│              │  Docker Network │                           │
│              │  (chatbot-net)  │                           │
│              └─────────────────┘                           │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Deploy Microservices
```bash
./deploy.sh microservices
```

### What You Get
- **🌐 Sample Website**: http://localhost:8080 (Container 1)
- **🔧 ChatBot Backend**: http://localhost:3001 (Container 2)
- **📱 Widget Script**: http://localhost:8080/chatkit-widget.js
- **🧪 Test Page**: http://localhost:8080/test.html

## 📁 Project Structure

```
websitechatbot/
├── backend/                           # ChatBot Backend
│   ├── Dockerfile                    # Backend container
│   ├── server.js                     # Main API server
│   ├── security.js                   # Security management
│   └── package.json                  # Dependencies
├── sample-website/                    # Sample Website
│   ├── Dockerfile                    # Website container
│   ├── nginx.conf                    # Nginx configuration
│   ├── index.html                    # Main website
│   ├── chatkit-widget.js             # Widget script
│   └── test.html                     # Test page
├── docker-compose.microservices.yml  # Microservices orchestration
├── nginx-proxy.conf                  # Optional reverse proxy
└── deploy.sh                         # Deployment script
```

## 🔧 Container Details

### ChatBot Backend Container
- **Image**: Node.js 18 Alpine
- **Port**: 3001
- **Services**: 
  - OpenAI API integration
  - Session management
  - Security & rate limiting
  - Health checks

### Sample Website Container
- **Image**: Nginx Alpine
- **Port**: 8080
- **Services**:
  - Static file serving
  - Widget script hosting
  - CORS headers
  - Health checks

## 🛠️ Deployment Commands

### Basic Commands
```bash
# Deploy microservices
./deploy.sh microservices

# Stop all services
./deploy.sh stop

# Check status
./deploy.sh status

# View logs
docker compose -f docker-compose.microservices.yml logs -f
```

### Advanced Commands
```bash
# Build only
docker compose -f docker-compose.microservices.yml build

# Start in foreground
docker compose -f docker-compose.microservices.yml up

# Scale services
docker compose -f docker-compose.microservices.yml up --scale chatbot-backend=3

# View specific service logs
docker compose -f docker-compose.microservices.yml logs chatbot-backend
docker compose -f docker-compose.microservices.yml logs sample-website
```

## 🔌 Integration Examples

### Method 1: One-Line Integration
```html
<script 
    src="http://localhost:8080/chatkit-widget.js"
    data-backend-url="http://localhost:3001"
    data-widget-title="AI Assistant">
</script>
```

### Method 2: Manual Initialization
```html
<script src="http://localhost:8080/chatkit-widget.js"></script>
<script>
    ChatKit.init({
        backendUrl: 'http://localhost:3001',
        widgetTitle: 'AI Assistant',
        primaryColor: '#3498db'
    });
</script>
```

### Method 3: Production Integration
```html
<!-- Production URLs -->
<script 
    src="https://yourdomain.com/chatkit-widget.js"
    data-backend-url="https://api.yourdomain.com"
    data-widget-title="AI Assistant">
</script>
```

## 🌐 Production Deployment

### Option 1: Direct Container Deployment
```bash
# Deploy to your server
docker compose -f docker-compose.microservices.yml up -d

# Set up reverse proxy (nginx/apache)
# Point your domain to the containers
```

### Option 2: Cloud Platform Deployment

#### AWS ECS
```yaml
# task-definition.json
{
  "family": "chatbot-microservices",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "chatbot-backend",
      "image": "your-account.dkr.ecr.region.amazonaws.com/chatbot-backend:latest",
      "portMappings": [{"containerPort": 3001}],
      "environment": [{"name": "NODE_ENV", "value": "production"}]
    },
    {
      "name": "sample-website",
      "image": "your-account.dkr.ecr.region.amazonaws.com/sample-website:latest",
      "portMappings": [{"containerPort": 80}],
      "dependsOn": [{"containerName": "chatbot-backend", "condition": "HEALTHY"}]
    }
  ]
}
```

#### Google Cloud Run
```yaml
# cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/chatbot-backend', './backend']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/sample-website', './sample-website']
  - name: 'gcr.io/cloud-builders/gcloud'
    args: ['run', 'deploy', 'chatbot-backend', '--image', 'gcr.io/$PROJECT_ID/chatbot-backend', '--platform', 'managed']
  - name: 'gcr.io/cloud-builders/gcloud'
    args: ['run', 'deploy', 'sample-website', '--image', 'gcr.io/$PROJECT_ID/sample-website', '--platform', 'managed']
```

#### Kubernetes
```yaml
# k8s-microservices.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: chatbot-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: chatbot-backend
  template:
    metadata:
      labels:
        app: chatbot-backend
    spec:
      containers:
      - name: chatbot-backend
        image: your-registry/chatbot-backend:latest
        ports:
        - containerPort: 3001
        env:
        - name: NODE_ENV
          value: "production"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sample-website
spec:
  replicas: 2
  selector:
    matchLabels:
      app: sample-website
  template:
    metadata:
      labels:
        app: sample-website
    spec:
      containers:
      - name: sample-website
        image: your-registry/sample-website:latest
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: chatbot-backend-service
spec:
  selector:
    app: chatbot-backend
  ports:
  - port: 80
    targetPort: 3001
  type: LoadBalancer
---
apiVersion: v1
kind: Service
metadata:
  name: sample-website-service
spec:
  selector:
    app: sample-website
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

## 🔒 Security Features

### Container Security
- **Non-root users**: Both containers run as non-root users
- **Minimal images**: Alpine Linux base images
- **Security headers**: XSS protection, CORS, content type validation
- **Health checks**: Container health monitoring

### Network Security
- **Isolated network**: Containers communicate via Docker network
- **CORS protection**: Only allowed origins can access the API
- **Rate limiting**: Prevents abuse and DDoS attacks
- **Input sanitization**: XSS protection for all inputs

### API Security
- **API key protection**: Secure server-side API key handling
- **Session security**: Secure session ID generation
- **Request validation**: Input validation and sanitization
- **Error handling**: Secure error responses

## 📊 Monitoring and Health Checks

### Health Check Endpoints
```bash
# Backend health
curl http://localhost:3001/health

# Website health
curl http://localhost:8080/health

# Response examples
{"status":"OK","message":"ChatKit Backend is running"}
{"status":"healthy","timestamp":"2024-01-01T00:00:00.000Z"}
```

### Container Health Checks
```dockerfile
# Backend health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Website health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1
```

### Monitoring Commands
```bash
# View container status
docker compose -f docker-compose.microservices.yml ps

# View resource usage
docker stats

# View logs
docker compose -f docker-compose.microservices.yml logs -f

# View specific service logs
docker compose -f docker-compose.microservices.yml logs chatbot-backend
docker compose -f docker-compose.microservices.yml logs sample-website
```

## 🔧 Customization

### Environment Variables
```bash
# .env file
OPENAI_API_KEY=your_openai_api_key_here
ALLOWED_ORIGINS=http://localhost:8080,https://yourdomain.com
MAX_REQUESTS_PER_MINUTE=60
MAX_REQUESTS_PER_HOUR=1000
SESSION_MAX_AGE_HOURS=24
```

### Container Configuration
```yaml
# docker-compose.microservices.yml
services:
  chatbot-backend:
    environment:
      - NODE_ENV=production
      - PORT=3001
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    ports:
      - "3001:3001"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Scaling
```bash
# Scale backend service
docker compose -f docker-compose.microservices.yml up --scale chatbot-backend=3

# Scale website service
docker compose -f docker-compose.microservices.yml up --scale sample-website=2
```

## 🐛 Troubleshooting

### Common Issues

1. **Containers not starting**
   ```bash
   # Check logs
   docker compose -f docker-compose.microservices.yml logs
   
   # Check container status
   docker compose -f docker-compose.microservices.yml ps
   ```

2. **Port conflicts**
   ```bash
   # Check what's using the ports
   lsof -i :3001
   lsof -i :8080
   
   # Kill processes
   kill -9 $(lsof -ti :3001)
   kill -9 $(lsof -ti :8080)
   ```

3. **API connection issues**
   ```bash
   # Test backend
   curl http://localhost:3001/health
   
   # Test website
   curl http://localhost:8080/health
   ```

4. **Widget not loading**
   ```bash
   # Check widget script
   curl http://localhost:8080/chatkit-widget.js
   
   # Check CORS headers
   curl -H "Origin: http://localhost:8080" http://localhost:3001/health
   ```

### Debug Mode
```bash
# Enable debug logging
export DEBUG=chatkit:*

# Run in foreground
docker compose -f docker-compose.microservices.yml up

# View detailed logs
docker compose -f docker-compose.microservices.yml logs --tail=100 -f
```

## 📈 Performance Optimization

### Resource Limits
```yaml
# docker-compose.microservices.yml
services:
  chatbot-backend:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
```

### Caching
```nginx
# nginx.conf
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Load Balancing
```yaml
# Scale services
docker compose -f docker-compose.microservices.yml up --scale chatbot-backend=3 --scale sample-website=2
```

## 🎯 Best Practices

1. **Security**
   - Use non-root users in containers
   - Implement proper CORS policies
   - Rotate API keys regularly
   - Monitor for security events

2. **Performance**
   - Set resource limits
   - Use health checks
   - Implement caching
   - Monitor resource usage

3. **Reliability**
   - Use restart policies
   - Implement health checks
   - Set up monitoring
   - Plan for failures

4. **Maintenance**
   - Keep containers updated
   - Monitor logs
   - Regular backups
   - Test deployments

## 🚀 Next Steps

1. **Deploy locally**: `./deploy.sh microservices`
2. **Test integration**: Visit http://localhost:8080/test.html
3. **Customize**: Modify colors, messages, and behavior
4. **Deploy to production**: Choose your cloud platform
5. **Monitor**: Set up logging and monitoring
6. **Scale**: Add more replicas as needed

---

**Ready to deploy microservices?** Run `./deploy.sh microservices` and you'll have a production-ready setup in minutes! 🚀
