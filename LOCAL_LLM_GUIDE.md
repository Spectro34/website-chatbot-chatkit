# 🤖 Local LLM Integration Guide

## Overview

ChatKit supports **optional** local LLM integration using Ollama. This allows you to run AI models locally on your own infrastructure for complete privacy and control.

## 🚀 Quick Setup

### Option 1: Use as-is (Recommended)
```bash
# Just run with Ollama support - it will fallback to OpenAI if Ollama isn't available
./deploy.sh ollama
```

**That's it!** The system will:
- ✅ Use Ollama if it's running locally
- ✅ Fall back to OpenAI if Ollama isn't available
- ✅ Work exactly the same way regardless

### Option 2: Install Ollama for Local LLM
```bash
# Install Ollama (optional)
brew install ollama  # macOS
# or curl -fsSL https://ollama.ai/install.sh | sh  # Linux

# Start Ollama
ollama serve

# Pull a model (choose one)
ollama pull llama2        # 3.8GB - Good balance
ollama pull mistral       # 4.1GB - Fast and efficient
ollama pull codellama     # 3.8GB - Code-focused

# Run ChatKit (will now use local LLM)
./deploy.sh ollama
```

## 🔧 How It Works

### Automatic Fallback System
1. **Ollama Available**: Uses your local LLM (private, no external calls)
2. **Ollama Not Available**: Falls back to OpenAI (requires API key)
3. **Neither Available**: Shows helpful error message

### Environment Configuration
The system automatically detects what's available:

```bash
# If you have OpenAI API key in .env
OPENAI_API_KEY=sk-your-key-here

# Ollama will be used if running, otherwise OpenAI
# No additional configuration needed!
```

## 🎯 Benefits

### With Ollama (Local LLM)
- ✅ **Complete Privacy**: No data leaves your machine
- ✅ **No API Costs**: No per-token charges
- ✅ **Offline Capable**: Works without internet
- ✅ **Custom Models**: Use any compatible model
- ✅ **Full Control**: Your infrastructure, your rules

### Without Ollama (OpenAI Fallback)
- ✅ **No Setup Required**: Works out of the box
- ✅ **Latest Models**: Access to newest OpenAI models
- ✅ **High Quality**: Excellent response quality
- ✅ **Reliable**: Cloud-based reliability

## 📊 Model Comparison

| Model | Size | RAM | Speed | Quality | Best For |
|-------|------|-----|-------|---------|----------|
| `llama2` | 3.8GB | 8GB+ | Medium | Good | General purpose |
| `mistral` | 4.1GB | 8GB+ | Fast | Good | Quick responses |
| `codellama` | 3.8GB | 8GB+ | Medium | Good | Code assistance |
| `llama2:13b` | 7.3GB | 16GB+ | Slow | Better | Higher quality |
| `gpt-3.5-turbo` | Cloud | N/A | Fast | Excellent | Production use |

## 🛠️ Advanced Configuration

### Custom Ollama Settings
```bash
# Set custom Ollama URL
export OLLAMA_BASE_URL=http://localhost:11434

# Set custom model
export OLLAMA_MODEL=mistral

# Run ChatKit
./deploy.sh ollama
```

### Environment Variables
```bash
# backend/.env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2
OPENAI_API_KEY=sk-your-key-here  # Fallback
```

## 🔍 Troubleshooting

### Ollama Not Working
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Start Ollama
ollama serve

# Check available models
ollama list

# Pull a model
ollama pull llama2
```

### OpenAI Fallback Not Working
```bash
# Check API key
echo $OPENAI_API_KEY

# Or check .env file
cat backend/.env | grep OPENAI_API_KEY
```

### Both Not Working
```bash
# Check what's available
./deploy.sh ollama

# Look for error messages in the output
# The system will tell you exactly what's missing
```

## 🚀 Production Deployment

### With Ollama
```bash
# Deploy with local LLM
./deploy.sh ollama

# Your chatbot now runs completely locally
# No external API calls, complete privacy
```

### Without Ollama
```bash
# Deploy with OpenAI
./deploy.sh local

# Your chatbot uses OpenAI API
# Requires internet and API key
```

## 💡 Tips

### For Development
- Use `./deploy.sh ollama` for privacy
- Use `./deploy.sh local` for speed

### For Production
- Use Ollama for complete privacy
- Use OpenAI for reliability and quality

### For Testing
- Both options work identically
- Same API, same frontend, same integration

## 🎉 Summary

**Ollama integration is completely optional!**

- ✅ **No setup required** - works with just OpenAI
- ✅ **Easy to add** - install Ollama when you want local LLM
- ✅ **Automatic fallback** - always works regardless
- ✅ **Same interface** - no code changes needed
- ✅ **Complete privacy** - when using Ollama

**Start with OpenAI, add Ollama later if you want local LLM support!**
