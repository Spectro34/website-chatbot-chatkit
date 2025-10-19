# 🤖 Ollama Integration Guide

## Overview

This guide shows you how to integrate ChatKit with **Ollama** - a local LLM server that runs on your own infrastructure. This gives you complete control over your AI model and data privacy.

## 🚀 Quick Start with Ollama

### Prerequisites

1. **Install Ollama**
   ```bash
   # macOS
   brew install ollama
   
   # Linux
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Windows
   # Download from https://ollama.ai/download
   ```

2. **Start Ollama Server**
   ```bash
   ollama serve
   ```

3. **Pull a Model**
   ```bash
   # Popular models (choose one)
   ollama pull llama2        # 3.8GB - Good balance
   ollama pull codellama     # 3.8GB - Code-focused
   ollama pull mistral       # 4.1GB - Fast and efficient
   ollama pull llama2:13b    # 7.3GB - More capable
   ollama pull llama2:70b    # 40GB - Most capable (requires 64GB+ RAM)
   ```

### Deploy ChatKit with Ollama

1. **Copy Environment File**
   ```bash
   cp backend/env.ollama.example backend/.env
   ```

2. **Edit Configuration**
   ```bash
   # Edit backend/.env
   OLLAMA_BASE_URL=http://localhost:11434
   OLLAMA_MODEL=llama2  # Change to your preferred model
   ```

3. **Start ChatKit Backend**
   ```bash
   cd backend
   npm run start:ollama
   ```

4. **Start Frontend**
   ```bash
   # In another terminal
   cd sample-website
   python3 -m http.server 8080
   ```

5. **Test Integration**
   - Visit: http://localhost:8080/test.html
   - Try the chatbot!

## 🔧 Configuration Options

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama server URL |
| `OLLAMA_MODEL` | `llama2` | Model name to use |
| `OLLAMA_API_KEY` | `ollama` | API key (usually not needed) |
| `PORT` | `3001` | ChatKit backend port |

### Available Models

| Model | Size | RAM Required | Best For |
|-------|------|--------------|----------|
| `llama2` | 3.8GB | 8GB+ | General purpose |
| `codellama` | 3.8GB | 8GB+ | Code assistance |
| `mistral` | 4.1GB | 8GB+ | Fast responses |
| `llama2:13b` | 7.3GB | 16GB+ | Better quality |
| `llama2:70b` | 40GB | 64GB+ | Best quality |

## 🐳 Docker Deployment with Ollama

### Option 1: Ollama + ChatKit in Separate Containers

```yaml
# docker-compose.ollama.yml
version: '3.8'
services:
  ollama:
    image: ollama/ollama:latest
    container_name: ollama-server
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    restart: unless-stopped

  chatkit-backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.ollama
    container_name: chatkit-backend-ollama
    env_file:
      - .env.ollama
    ports:
      - "3001:3001"
    depends_on:
      - ollama
    restart: unless-stopped

  sample-website:
    image: nginx:alpine
    container_name: sample-website
    volumes:
      - ./sample-website:/usr/share/nginx/html
      - ./chatkit-widget.js:/usr/share/nginx/html/chatkit-widget.js
    ports:
      - "8080:80"
    depends_on:
      - chatkit-backend
    restart: unless-stopped

volumes:
  ollama_data:
```

### Option 2: All-in-One Container

```dockerfile
# Dockerfile.ollama-complete
FROM ubuntu:22.04

# Install Ollama
RUN curl -fsSL https://ollama.ai/install.sh | sh

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Copy ChatKit backend
COPY backend/ /app/backend/
WORKDIR /app/backend
RUN npm install

# Expose ports
EXPOSE 3001 11434

# Start both services
CMD ["sh", "-c", "ollama serve & npm run start:ollama"]
```

## 🔒 Security Considerations

### Data Privacy
- ✅ **Complete Privacy**: All data stays on your infrastructure
- ✅ **No External Calls**: No data sent to external APIs
- ✅ **Local Processing**: Everything runs locally

### Network Security
- ✅ **Internal Communication**: Ollama and ChatKit communicate internally
- ✅ **CORS Protection**: Configured for your domains
- ✅ **Rate Limiting**: Built-in protection against abuse

### Model Security
- ✅ **Model Verification**: ChatKit validates model availability
- ✅ **Error Handling**: Graceful fallbacks if model unavailable
- ✅ **Resource Monitoring**: Built-in health checks

## 🚀 Performance Optimization

### Model Selection
```bash
# For development (faster)
ollama pull mistral

# For production (better quality)
ollama pull llama2:13b

# For maximum capability (if you have the resources)
ollama pull llama2:70b
```

### Resource Management
```bash
# Monitor Ollama resources
ollama ps

# Stop unused models to free memory
ollama stop llama2

# Set Ollama to use specific GPU
OLLAMA_GPU_LAYERS=32 ollama serve
```

### Caching
- ChatKit includes session management
- Conversation history is maintained
- Models are cached in memory by Ollama

## 🔧 Troubleshooting

### Common Issues

#### 1. Ollama Not Starting
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Start Ollama manually
ollama serve

# Check logs
ollama logs
```

#### 2. Model Not Found
```bash
# List available models
ollama list

# Pull the model
ollama pull llama2

# Verify model is available
ollama show llama2
```

#### 3. Out of Memory
```bash
# Use a smaller model
ollama pull mistral

# Or reduce model size
ollama pull llama2:7b  # Instead of 13b
```

#### 4. Slow Responses
```bash
# Use GPU acceleration
OLLAMA_GPU_LAYERS=32 ollama serve

# Or use a faster model
ollama pull mistral
```

### Health Checks

```bash
# Check Ollama health
curl http://localhost:11434/api/tags

# Check ChatKit health
curl http://localhost:3001/health

# Check integration
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test","message":"Hello"}'
```

## 📊 Monitoring

### Ollama Metrics
```bash
# Monitor model usage
ollama ps

# Check model details
ollama show llama2

# Monitor system resources
htop  # or top
```

### ChatKit Metrics
- Built-in health check: `http://localhost:3001/health`
- Session management and cleanup
- Rate limiting and security logs

## 🌐 Production Deployment

### Cloud Deployment
1. **AWS EC2**: Deploy Ollama + ChatKit on EC2 instance
2. **Google Cloud**: Use Compute Engine with GPU support
3. **Azure**: Deploy on Virtual Machines with GPU
4. **Kubernetes**: Use Ollama operator + ChatKit pods

### Scaling
- **Horizontal**: Multiple ChatKit instances behind load balancer
- **Vertical**: Larger instances with more powerful models
- **Caching**: Redis for session storage
- **CDN**: Static assets served from CDN

## 🎯 Integration Examples

### Basic Integration
```html
<script 
    src="http://localhost:8080/chatkit-widget.js"
    data-backend-url="http://localhost:3001"
    data-widget-title="AI Assistant (Ollama)">
</script>
```

### Advanced Integration
```javascript
ChatKit.init({
    backendUrl: 'http://localhost:3001',
    widgetTitle: 'Local AI Assistant',
    welcomeMessage: 'Hi! I\'m running on your local Ollama server.',
    primaryColor: '#2c3e50',
    position: 'bottom-right',
    theme: 'dark'
});
```

## 🔄 Migration from OpenAI

### Step 1: Install Ollama
```bash
brew install ollama
ollama serve
ollama pull llama2
```

### Step 2: Update Environment
```bash
# Change from OpenAI to Ollama
# OLLAMA_BASE_URL=http://localhost:11434
# OLLAMA_MODEL=llama2
```

### Step 3: Switch Backend
```bash
# Stop OpenAI backend
# Start Ollama backend
npm run start:ollama
```

### Step 4: Test
- Same frontend code works unchanged
- Same API endpoints
- Same widget integration

## 🎉 Benefits of Ollama Integration

### ✅ Advantages
- **Complete Privacy**: No data leaves your infrastructure
- **Cost Control**: No per-token charges
- **Custom Models**: Use any compatible model
- **Offline Capability**: Works without internet
- **Customization**: Fine-tune models for your use case

### ⚠️ Considerations
- **Resource Requirements**: Needs significant RAM/GPU
- **Model Quality**: May not match latest commercial models
- **Maintenance**: You manage the infrastructure
- **Updates**: Manual model updates required

## 📚 Additional Resources

- [Ollama Documentation](https://ollama.ai/docs)
- [Model Library](https://ollama.ai/library)
- [Performance Tuning](https://ollama.ai/docs/performance)
- [Docker Deployment](https://ollama.ai/docs/docker)

---

**Ready to deploy with Ollama?** 🚀

1. Install Ollama: `brew install ollama`
2. Start server: `ollama serve`
3. Pull model: `ollama pull llama2`
4. Deploy ChatKit: `npm run start:ollama`
5. Test: Visit http://localhost:8080/test.html

Your AI chatbot is now running completely on your own infrastructure! 🎉
