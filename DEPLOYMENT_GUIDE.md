# 🚀 ChatKit Deployment Guide

## Overview

This guide shows you how to deploy ChatKit with different configurations, including optional Ollama support.

## 🏗️ Architecture Options

### 1. Local Development
- **Backend**: Node.js process
- **Frontend**: Python HTTP server
- **LLM**: OpenAI API (or optional Ollama)

### 2. Microservices (Production)
- **Backend**: Docker container
- **Frontend**: Docker container (Nginx)
- **LLM**: OpenAI API (or external Ollama)

## 🚀 Quick Deployment

### Option 1: Local Development
```bash
# Start with OpenAI
./deploy.sh local

# Start with optional Ollama support
./deploy.sh ollama
```

### Option 2: Microservices
```bash
# With OpenAI
./deploy.sh microservices

# With external Ollama
./deploy.sh microservices-ollama
```

## 🤖 Ollama Setup (Optional)

### Step 1: Set Up Ollama (Separate Project)
```bash
cd ollama-setup

# Quick setup
./setup.sh

# Or manual setup
cp env.example .env
# Edit .env to choose your model
docker compose up -d
docker exec ollama-server ollama pull llama2
```

### Step 2: Deploy ChatKit
```bash
# Local development with Ollama
./deploy.sh ollama

# Or microservices with external Ollama
./deploy.sh microservices-ollama
```

## 🔧 Configuration

### Environment Variables

#### For OpenAI (Default)
```bash
# backend/.env
OPENAI_API_KEY=sk-your-key-here
```

#### For Ollama
```bash
# ollama-setup/.env
OLLAMA_MODEL=llama2
```

### Model Selection

Edit `ollama-setup/.env` to choose your model:

```bash
# Available models (uncomment one):
OLLAMA_MODEL=llama2        # 3.8GB - Good balance
# OLLAMA_MODEL=mistral     # 4.1GB - Fast and efficient  
# OLLAMA_MODEL=codellama   # 3.8GB - Code-focused
# OLLAMA_MODEL=llama2:13b  # 7.3GB - Better quality
```

## 📊 Deployment Comparison

| Option | Backend | Frontend | LLM | Use Case |
|--------|---------|----------|-----|----------|
| `local` | Node.js | Python | OpenAI | Development |
| `ollama` | Node.js | Python | Ollama/OpenAI | Development + Privacy |
| `microservices` | Docker | Docker | OpenAI | Production |
| `microservices-ollama` | Docker | Docker | External Ollama | Production + Privacy |

## 🛠️ Management Commands

### ChatKit Management
```bash
./deploy.sh local              # Start local development
./deploy.sh microservices      # Start microservices
./deploy.sh stop               # Stop all services
./deploy.sh status             # Check status
```

### Ollama Management
```bash
cd ollama-setup
./setup.sh start              # Start Ollama
./setup.sh stop               # Stop Ollama
./setup.sh status             # Check status
./setup.sh pull               # Pull model
./setup.sh list               # List models
```

## 🔍 Troubleshooting

### ChatKit Issues
```bash
# Check if services are running
./deploy.sh status

# Check logs
docker compose logs -f

# Restart services
./deploy.sh stop
./deploy.sh microservices
```

### Ollama Issues
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Check Ollama logs
cd ollama-setup
docker compose logs ollama

# Restart Ollama
./setup.sh restart
```

### Connection Issues
```bash
# Test ChatKit backend
curl http://localhost:3001/health

# Test frontend
curl http://localhost:8080

# Test Ollama
curl http://localhost:11434/api/tags
```

## 🎯 Production Deployment

### With OpenAI
```bash
# Deploy microservices
./deploy.sh microservices

# Your chatbot is ready!
# Access at: http://localhost:8080
```

### With Ollama (Private)
```bash
# 1. Set up Ollama (separate server/container)
cd ollama-setup
./setup.sh start

# 2. Deploy ChatKit
./deploy.sh microservices-ollama

# Your private chatbot is ready!
# Access at: http://localhost:8080
```

## 🎉 Benefits

### With OpenAI
- ✅ **No Setup**: Works out of the box
- ✅ **Latest Models**: Access to newest OpenAI models
- ✅ **High Quality**: Excellent response quality
- ✅ **Reliable**: Cloud-based reliability

### With Ollama
- ✅ **Complete Privacy**: No data leaves your infrastructure
- ✅ **No API Costs**: No per-token charges
- ✅ **Offline Capable**: Works without internet
- ✅ **Custom Models**: Use any compatible model
- ✅ **Full Control**: Your infrastructure, your rules

## 📚 Additional Resources

- **[LOCAL_LLM_GUIDE.md](LOCAL_LLM_GUIDE.md)** - Detailed Ollama integration guide
- **[EXTERNAL_OLLAMA_SETUP.md](EXTERNAL_OLLAMA_SETUP.md)** - External Ollama setup
- **[ollama-setup/README.md](ollama-setup/README.md)** - Ollama setup project

---

**Ready to deploy!** Choose your preferred option and start building! 🚀