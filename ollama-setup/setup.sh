#!/bin/bash

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print status messages
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Function to print success messages
print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Function to print warning messages
print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Function to print error messages
print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker is not running!"
        print_warning "Please start Docker Desktop and try again."
        exit 1
    fi
}

# Function to start Ollama
start_ollama() {
    print_status "Starting Ollama server..."
    
    # Copy environment file if it doesn't exist
    if [ ! -f .env ]; then
        print_status "Creating .env file from example..."
        cp env.example .env
        print_warning "Please edit .env file to configure your model"
    fi
    
    # Start Ollama container
    docker compose up -d
    
    # Wait for Ollama to start
    print_status "Waiting for Ollama to start..."
    sleep 10
    
    # Check if Ollama is running
    if curl -s http://localhost:11434/api/tags >/dev/null 2>&1; then
        print_success "Ollama is running on http://localhost:11434"
    else
        print_error "Ollama failed to start!"
        docker compose logs ollama
        exit 1
    fi
}

# Function to pull model
pull_model() {
    # Read model from .env file
    if [ -f .env ]; then
        source .env
        MODEL=${OLLAMA_MODEL:-llama2}
    else
        MODEL=llama2
    fi
    
    print_status "Pulling model: $MODEL"
    print_warning "This may take several minutes depending on model size..."
    
    docker exec ollama-server ollama pull $MODEL
    
    if [ $? -eq 0 ]; then
        print_success "Model $MODEL pulled successfully!"
    else
        print_error "Failed to pull model $MODEL"
        exit 1
    fi
}

# Function to list models
list_models() {
    print_status "Available models in Ollama:"
    docker exec ollama-server ollama list
}

# Function to stop Ollama
stop_ollama() {
    print_status "Stopping Ollama server..."
    docker compose down
    print_success "Ollama stopped!"
}

# Function to show status
show_status() {
    print_status "Ollama Status:"
    if curl -s http://localhost:11434/api/tags >/dev/null 2>&1; then
        print_success "✅ Ollama is running on http://localhost:11434"
        list_models
    else
        print_warning "❌ Ollama is not running"
    fi
}

# Function to show help
show_help() {
    echo "Ollama Setup Script"
    echo ""
    echo "Usage: ./setup.sh [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start     Start Ollama server and pull model"
    echo "  stop      Stop Ollama server"
    echo "  restart   Restart Ollama server"
    echo "  status    Show Ollama status"
    echo "  pull      Pull configured model"
    echo "  list      List available models"
    echo "  help      Show this help message"
    echo ""
    echo "Configuration:"
    echo "  Edit .env file to change model:"
    echo "  OLLAMA_MODEL=llama2  # Change to your preferred model"
    echo ""
    echo "Examples:"
    echo "  ./setup.sh start     # Start with default model"
    echo "  ./setup.sh pull      # Pull model after changing .env"
    echo "  ./setup.sh status    # Check if running"
}

# Main script logic
case "${1:-}" in
    "start")
        check_docker
        start_ollama
        pull_model
        show_status
        ;;
    "stop")
        stop_ollama
        ;;
    "restart")
        stop_ollama
        sleep 2
        check_docker
        start_ollama
        pull_model
        show_status
        ;;
    "status")
        show_status
        ;;
    "pull")
        check_docker
        pull_model
        show_status
        ;;
    "list")
        check_docker
        list_models
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    "")
        print_status "Ollama Setup Script"
        echo ""
        echo "Choose an option:"
        echo "1) Start Ollama (with model pull)"
        echo "2) Stop Ollama"
        echo "3) Show status"
        echo "4) Pull model only"
        echo "5) List models"
        echo "6) Show help"
        echo ""
        read -p "Enter your choice (1-6): " choice

        case $choice in
            1)
                check_docker
                start_ollama
                pull_model
                show_status
                ;;
            2)
                stop_ollama
                ;;
            3)
                show_status
                ;;
            4)
                check_docker
                pull_model
                show_status
                ;;
            5)
                check_docker
                list_models
                ;;
            6)
                show_help
                ;;
            *)
                print_error "Invalid choice!"
                exit 1
                ;;
        esac
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
