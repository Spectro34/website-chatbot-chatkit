# 🤖 Containerized Ollama Setup Guide

## Overview

This guide shows you how to set up Ollama as a separate containerized service that ChatKit can connect to. This approach keeps Ollama completely separate from the ChatKit project and ensures maximum pluggability.

## 🚀 Quick Setup

### Step 1: Deploy Ollama Container

Create a simple `docker-compose.yml` for your Ollama service:

```yaml
version: '3.8'
services:
  ollama:
    image: ollama/ollama:latest
    container_name: ollama-server
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    environment:
      - OLLAMA_HOST=0.0.0.0
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:11434/api/tags"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 20s

volumes:
  ollama_data:
```

### Step 2: Start Ollama

```bash
# Start Ollama container
docker compose up -d

# Pull a model (choose one)
docker exec ollama-server ollama pull llama2        # 3.8GB - Good balance
docker exec ollama-server ollama pull mistral       # 4.1GB - Fast and efficient
docker exec ollama-server ollama pull codellama     # 3.8GB - Code-focused

# Verify it's working
curl http://localhost:11434/api/tags
```

### Step 3: Deploy ChatKit with External Ollama

```bash
# In your ChatKit project
./deploy.sh microservices-ollama
```

## 🔧 Configuration Options

### Environment Variables

You can customize the Ollama connection:

```bash
# Set custom Ollama URL (if not on localhost:11434)
export OLLAMA_BASE_URL=http://your-ollama-server:11434

# Set custom model
export OLLAMA_MODEL=mistral

# Deploy ChatKit
./deploy.sh microservices-ollama
```

### Docker Network Setup

If you want both services on the same Docker network:

```yaml
# In your Ollama docker-compose.yml
networks:
  default:
    name: shared-network
    external: true
```

```yaml
# In ChatKit's docker-compose.microservices-ollama.yml
networks:
  chatbot-network:
    external: true
    name: shared-network
```

## 📊 Available Models

| Model | Size | RAM | Speed | Quality | Best For |
|-------|------|-----|-------|---------|----------|
| `llama2` | 3.8GB | 8GB+ | Medium | Good | General purpose |
| `mistral` | 4.1GB | 8GB+ | Fast | Good | Quick responses |
| `codellama` | 3.8GB | 8GB+ | Medium | Good | Code assistance |
| `llama2:13b` | 7.3GB | 16GB+ | Slow | Better | Higher quality |
| `llama2:70b` | 40GB | 64GB+ | Very Slow | Best | Maximum quality |

## 🛠️ Management Commands

### Ollama Management

```bash
# List available models
docker exec ollama-server ollama list

# Pull a new model
docker exec ollama-server ollama pull mistral

# Remove a model
docker exec ollama-server ollama rm llama2

# Check Ollama status
docker exec ollama-server ollama ps

# View Ollama logs
docker logs ollama-server
```

### ChatKit Management

```bash
# Deploy ChatKit with external Ollama
./deploy.sh microservices-ollama

# Check ChatKit status
./deploy.sh status

# View ChatKit logs
docker compose -f docker-compose.microservices-ollama.yml logs -f

# Stop ChatKit
docker compose -f docker-compose.microservices-ollama.yml down
```

## 🔍 Troubleshooting

### Ollama Not Accessible

```bash
# Check if Ollama is running
docker ps | grep ollama

# Check Ollama logs
docker logs ollama-server

# Test Ollama API
curl http://localhost:11434/api/tags

# Restart Ollama
docker restart ollama-server
```

### ChatKit Can't Connect

```bash
# Check if ChatKit can reach Ollama
docker exec chatbot-backend-ollama curl http://host.docker.internal:11434/api/tags

# Check ChatKit logs
docker compose -f docker-compose.microservices-ollama.yml logs chatbot-backend

# Verify environment variables
docker exec chatbot-backend-ollama env | grep OLLAMA
```

### Model Not Found

```bash
# Check available models in Ollama
docker exec ollama-server ollama list

# Pull the required model
docker exec ollama-server ollama pull llama2

# Verify model is available
curl http://localhost:11434/api/tags
```

## 🚀 Production Deployment

### Separate Servers

```bash
# On Ollama server
docker run -d --name ollama-server -p 11434:11434 -v ollama_data:/root/.ollama ollama/ollama

# On ChatKit server
export OLLAMA_BASE_URL=http://ollama-server-ip:11434
./deploy.sh microservices-ollama
```

### Kubernetes

```yaml
# ollama-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ollama
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ollama
  template:
    metadata:
      labels:
        app: ollama
    spec:
      containers:
      - name: ollama
        image: ollama/ollama:latest
        ports:
        - containerPort: 11434
        env:
        - name: OLLAMA_HOST
          value: "0.0.0.0"
        volumeMounts:
        - name: ollama-data
          mountPath: /root/.ollama
      volumes:
      - name: ollama-data
        persistentVolumeClaim:
          claimName: ollama-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: ollama-service
spec:
  selector:
    app: ollama
  ports:
  - port: 11434
    targetPort: 11434
  type: LoadBalancer
```

## 💡 Best Practices

### Resource Management

```bash
# Monitor Ollama resource usage
docker stats ollama-server

# Set memory limits
docker run -d --name ollama-server --memory=8g --cpus=4 -p 11434:11434 ollama/ollama
```

### Security

```bash
# Use custom network
docker network create ollama-network

# Run Ollama on custom network
docker run -d --name ollama-server --network ollama-network -p 11434:11434 ollama/ollama

# Connect ChatKit to same network
docker network connect ollama-network chatbot-backend-ollama
```

### Backup

```bash
# Backup Ollama models
docker run --rm -v ollama_data:/data -v $(pwd):/backup alpine tar czf /backup/ollama-backup.tar.gz -C /data .

# Restore Ollama models
docker run --rm -v ollama_data:/data -v $(pwd):/backup alpine tar xzf /backup/ollama-backup.tar.gz -C /data
```

## 🎉 Summary

**External Ollama Setup:**

1. ✅ **Deploy Ollama** as separate container
2. ✅ **Pull models** you want to use
3. ✅ **Deploy ChatKit** with `./deploy.sh microservices-ollama`
4. ✅ **Enjoy** complete privacy with local LLM

**Benefits:**
- ✅ **Complete Separation**: Ollama and ChatKit are independent
- ✅ **Easy Management**: Update models without touching ChatKit
- ✅ **Resource Control**: Dedicated resources for LLM
- ✅ **Scalability**: Scale Ollama and ChatKit independently
- ✅ **Privacy**: All data stays on your infrastructure

**Ready to deploy!** 🚀
