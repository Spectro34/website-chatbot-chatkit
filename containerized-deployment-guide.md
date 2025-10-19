# 🐳 Containerized Deployment Guide

## Overview

This guide covers deploying the ChatKit integration using Docker containers, making it easy to deploy anywhere and attach to any website with just a few lines of code.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Your Website  │    │  ChatKit Widget │    │  ChatKit Backend│
│                 │    │   (JavaScript)  │    │   (Docker)      │
│  <script src=   │───▶│                 │───▶│                 │
│   widget.js>    │    │  - UI/UX        │    │  - OpenAI API   │
│                 │    │  - Session Mgmt │    │  - Security     │
│  <div id=       │    │  - Message Flow │    │  - Rate Limiting│
│   chat-widget>  │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone https://github.com/yourusername/websitechatbot.git
cd websitechatbot
cp env.example .env
```

### 2. Configure Environment

Edit `.env` file:

```env
# Required
OPENAI_API_KEY=your_openai_api_key_here

# Optional - customize for your domain
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 3. Deploy with Docker Compose

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### 4. Test the Deployment

- **Backend API**: http://localhost:3001/health
- **Frontend Demo**: http://localhost:8080
- **Widget Script**: http://localhost:8080/chatkit-widget.js

## 🔧 Individual Container Deployment

### Backend Only

```bash
# Build backend container
cd backend
docker build -t chatkit-backend .

# Run backend container
docker run -d \
  --name chatkit-backend \
  -p 3001:3001 \
  -e OPENAI_API_KEY=your_api_key \
  -e ALLOWED_ORIGINS=https://yourdomain.com \
  chatkit-backend
```

### Frontend Only (Nginx)

```bash
# Build frontend container
docker run -d \
  --name chatkit-frontend \
  -p 8080:80 \
  -v $(pwd)/sample-website:/usr/share/nginx/html:ro \
  nginx:alpine
```

## 🌐 Integration with Any Website

### Method 1: Direct Script Include

Add this to your website's HTML:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Your Website</title>
</head>
<body>
    <!-- Your website content -->
    
    <!-- ChatKit Widget -->
    <script 
        src="https://yourdomain.com/chatkit-widget.js"
        data-backend-url="https://yourdomain.com/api"
        data-widget-title="AI Assistant"
        data-welcome-message="Hello! How can I help you today?"
        data-primary-color="#3498db"
        data-position="bottom-right">
    </script>
</body>
</html>
```

### Method 2: Manual Initialization

```html
<!DOCTYPE html>
<html>
<head>
    <title>Your Website</title>
    <script src="https://yourdomain.com/chatkit-widget.js"></script>
</head>
<body>
    <!-- Your website content -->
    
    <script>
        // Initialize ChatKit with custom configuration
        ChatKit.init({
            backendUrl: 'https://yourdomain.com/api',
            widgetTitle: 'Customer Support',
            welcomeMessage: 'Hi! I\'m here to help with any questions.',
            primaryColor: '#e74c3c',
            position: 'bottom-left',
            theme: 'dark'
        });
    </script>
</body>
</html>
```

### Method 3: React/Vue/Angular Integration

#### React Example

```jsx
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Load ChatKit script
    const script = document.createElement('script');
    script.src = 'https://yourdomain.com/chatkit-widget.js';
    script.async = true;
    document.head.appendChild(script);

    // Initialize when loaded
    script.onload = () => {
      window.ChatKit.init({
        backendUrl: 'https://yourdomain.com/api',
        widgetTitle: 'AI Assistant',
        primaryColor: '#3498db'
      });
    };

    return () => {
      // Cleanup
      window.ChatKit?.destroy();
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="App">
      {/* Your app content */}
    </div>
  );
}
```

#### Vue Example

```vue
<template>
  <div id="app">
    <!-- Your app content -->
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    // Load and initialize ChatKit
    const script = document.createElement('script');
    script.src = 'https://yourdomain.com/chatkit-widget.js';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.ChatKit.init({
        backendUrl: 'https://yourdomain.com/api',
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

## 🔒 Security Configuration

### Environment Variables

```env
# Required
OPENAI_API_KEY=sk-proj-...

# Security
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
MAX_REQUESTS_PER_MINUTE=60
MAX_REQUESTS_PER_HOUR=1000
SESSION_MAX_AGE_HOURS=24

# Production
NODE_ENV=production
```

### CORS Configuration

The backend automatically handles CORS based on `ALLOWED_ORIGINS`:

```javascript
// Only these origins can access the API
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
```

### Rate Limiting

```javascript
// Per IP address limits
MAX_REQUESTS_PER_MINUTE=60   // 60 requests per minute
MAX_REQUESTS_PER_HOUR=1000   // 1000 requests per hour
```

## 🚀 Production Deployment

### AWS ECS/Fargate

```yaml
# task-definition.json
{
  "family": "chatkit-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "chatkit-backend",
      "image": "your-account.dkr.ecr.region.amazonaws.com/chatkit-backend:latest",
      "portMappings": [
        {
          "containerPort": 3001,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "OPENAI_API_KEY",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:openai-api-key"
        }
      ]
    }
  ]
}
```

### Google Cloud Run

```yaml
# cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/chatkit-backend', './backend']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/chatkit-backend']
  - name: 'gcr.io/cloud-builders/gcloud'
    args: 
      - 'run'
      - 'deploy'
      - 'chatkit-backend'
      - '--image'
      - 'gcr.io/$PROJECT_ID/chatkit-backend'
      - '--platform'
      - 'managed'
      - '--region'
      - 'us-central1'
      - '--allow-unauthenticated'
      - '--set-env-vars'
      - 'NODE_ENV=production'
      - '--set-secrets'
      - 'OPENAI_API_KEY=openai-api-key:latest'
```

### Azure Container Instances

```bash
# Create resource group
az group create --name chatkit-rg --location eastus

# Deploy container
az container create \
  --resource-group chatkit-rg \
  --name chatkit-backend \
  --image your-registry.azurecr.io/chatkit-backend:latest \
  --ports 3001 \
  --environment-variables NODE_ENV=production \
  --secure-environment-variables OPENAI_API_KEY=your_api_key
```

### Kubernetes

```yaml
# k8s-deployment.yaml
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
        image: your-registry/chatkit-backend:latest
        ports:
        - containerPort: 3001
        env:
        - name: NODE_ENV
          value: "production"
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: chatkit-secrets
              key: openai-api-key
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: chatkit-backend-service
spec:
  selector:
    app: chatkit-backend
  ports:
  - port: 80
    targetPort: 3001
  type: LoadBalancer
```

## 📊 Monitoring and Health Checks

### Health Check Endpoint

```bash
# Check if backend is healthy
curl http://yourdomain.com/api/health

# Response: {"status": "healthy", "timestamp": "2024-01-01T00:00:00.000Z"}
```

### Docker Health Check

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"
```

### Monitoring with Prometheus

```javascript
// Add to server.js
const prometheus = require('prom-client');

const register = new prometheus.Registry();
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

// Add metrics endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(register.metrics());
});
```

## 🔧 Customization

### Widget Styling

```javascript
// Customize widget appearance
ChatKit.init({
  backendUrl: 'https://yourdomain.com/api',
  primaryColor: '#e74c3c',        // Button and header color
  position: 'bottom-left',        // Widget position
  widgetTitle: 'Support Bot',     // Header title
  welcomeMessage: 'Hi there!',    // First message
  theme: 'dark'                   // light or dark theme
});
```

### Backend Configuration

```javascript
// Customize backend behavior
const config = {
  maxTokens: 500,                 // Max response length
  temperature: 0.7,              // Response creativity
  model: 'gpt-3.5-turbo',        // OpenAI model
  maxMessages: 20,               // Max conversation history
  sessionTimeout: 24 * 60 * 60 * 1000  // 24 hours
};
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   ```bash
   # Check ALLOWED_ORIGINS environment variable
   echo $ALLOWED_ORIGINS
   ```

2. **API Key Issues**
   ```bash
   # Verify API key format
   curl -H "Authorization: Bearer $OPENAI_API_KEY" \
        https://api.openai.com/v1/models
   ```

3. **Container Won't Start**
   ```bash
   # Check container logs
   docker logs chatkit-backend
   
   # Check environment variables
   docker exec chatkit-backend env
   ```

4. **Widget Not Loading**
   ```javascript
   // Check browser console for errors
   console.log('ChatKit available:', typeof window.ChatKit);
   ```

### Debug Mode

```bash
# Enable debug logging
docker run -e DEBUG=chatkit:* chatkit-backend
```

## 📈 Scaling

### Horizontal Scaling

```yaml
# docker-compose.yml with multiple replicas
version: '3.8'
services:
  chatkit-backend:
    image: chatkit-backend:latest
    deploy:
      replicas: 3
    environment:
      - NODE_ENV=production
    ports:
      - "3001-3003:3001"
```

### Load Balancer Configuration

```nginx
# nginx.conf for load balancing
upstream chatkit_backend {
    server chatkit-backend-1:3001;
    server chatkit-backend-2:3001;
    server chatkit-backend-3:3001;
}

server {
    location /api/ {
        proxy_pass http://chatkit_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🎯 Best Practices

1. **Security**
   - Use HTTPS in production
   - Rotate API keys regularly
   - Implement proper CORS policies
   - Monitor for abuse

2. **Performance**
   - Use CDN for widget script
   - Implement caching strategies
   - Monitor response times
   - Set up alerts

3. **Reliability**
   - Use health checks
   - Implement retry logic
   - Set up monitoring
   - Plan for failures

4. **Maintenance**
   - Keep containers updated
   - Monitor resource usage
   - Log important events
   - Regular backups

## 📞 Support

For issues and questions:

- **GitHub Issues**: [Create an issue](https://github.com/yourusername/websitechatbot/issues)
- **Documentation**: [Full docs](https://github.com/yourusername/websitechatbot/blob/main/README.md)
- **Examples**: [Integration examples](https://github.com/yourusername/websitechatbot/tree/main/examples)

---

**Ready to deploy?** Start with the [Quick Start](#-quick-start) section above! 🚀
