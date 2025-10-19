# 🤖 Ollama Setup (Separate Project)

This is a simple, standalone Ollama setup that can be used by the ChatKit project.

## 🚀 Quick Start

### Option 1: One-Command Setup
```bash
cd ollama-setup
./setup.sh
```

### Option 2: Manual Setup
```bash
cd ollama-setup

# Copy environment file
cp env.example .env

# Edit model configuration
nano .env

# Start Ollama
docker compose up -d

# Pull your model
docker exec ollama-server ollama pull llama2
```

## 🔧 Configuration

### Edit `.env` file to change model:
```bash
# Available models (uncomment one):
OLLAMA_MODEL=llama2        # 3.8GB - Good balance
# OLLAMA_MODEL=mistral     # 4.1GB - Fast and efficient  
# OLLAMA_MODEL=codellama   # 3.8GB - Code-focused
# OLLAMA_MODEL=llama2:13b  # 7.3GB - Better quality
# OLLAMA_MODEL=llama2:70b  # 40GB - Best quality (needs 64GB+ RAM)
```

## 🛠️ Commands

```bash
./setup.sh start     # Start Ollama and pull model
./setup.sh stop      # Stop Ollama
./setup.sh restart   # Restart Ollama
./setup.sh status    # Show status
./setup.sh pull      # Pull model only
./setup.sh list      # List available models
./setup.sh help      # Show help
```

## 📊 Model Comparison

| Model | Size | RAM | Speed | Quality | Best For |
|-------|------|-----|-------|---------|----------|
| `llama2` | 3.8GB | 8GB+ | Medium | Good | General purpose |
| `mistral` | 4.1GB | 8GB+ | Fast | Good | Quick responses |
| `codellama` | 3.8GB | 8GB+ | Medium | Good | Code assistance |
| `llama2:13b` | 7.3GB | 16GB+ | Slow | Better | Higher quality |
| `llama2:70b` | 40GB | 64GB+ | Very Slow | Best | Maximum quality |

## 🔍 Troubleshooting

### Check if Ollama is running
```bash
curl http://localhost:11434/api/tags
```

### View logs
```bash
docker compose logs ollama
```

### Restart if needed
```bash
./setup.sh restart
```

## 🎯 Usage with ChatKit

Once Ollama is running, you can use it with ChatKit:

```bash
# In the main ChatKit project
./deploy.sh microservices-ollama
```

The ChatKit will automatically connect to your Ollama instance at `localhost:11434`.

## 🎉 Benefits

- ✅ **Separate Project**: Independent from ChatKit
- ✅ **Easy Management**: Simple commands to manage Ollama
- ✅ **Model Control**: Easy model switching via .env
- ✅ **Resource Isolation**: Dedicated container for LLM
- ✅ **Reusable**: Can be used by multiple projects
