#!/bin/bash

# ChatKit Deployment Script
# Easy deployment with local and containerized options

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if port is in use
port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

# Function to kill process on port
kill_port() {
    if port_in_use $1; then
        print_warning "Port $1 is in use. Attempting to free it..."
        lsof -ti :$1 | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
}

# Function to check environment setup
check_environment() {
    print_status "Checking environment setup..."
    
    # Check if .env exists
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating from template..."
        cp env.example .env
        print_warning "Please edit .env file with your OpenAI API key before continuing."
        print_warning "Press Enter when ready, or Ctrl+C to exit and configure .env first."
        read -r
    fi
    
    # Check if API key is set
    if grep -q "your_openai_api_key_here" .env; then
        print_error "OpenAI API key not configured in .env file!"
        print_warning "Please edit .env file and set your OPENAI_API_KEY"
        exit 1
    fi
    
    print_success "Environment setup complete!"
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing backend dependencies..."
    cd backend
    if [ ! -d "node_modules" ]; then
        npm install
    else
        print_status "Dependencies already installed"
    fi
    cd ..
    print_success "Dependencies installed!"
}

# Function to start local development
start_local() {
    print_status "Starting local development environment..."
    
    # Kill any existing processes on our ports
    kill_port 3001
    kill_port 8080
    
    # Start backend
    print_status "Starting backend server on port 3001..."
    cd backend
    npm start &
    BACKEND_PID=$!
    cd ..
    
    # Wait for backend to start
    print_status "Waiting for backend to start..."
    sleep 5
    
    # Check if backend is running
    if curl -s http://localhost:3001/health > /dev/null; then
        print_success "Backend is running on http://localhost:3001"
    else
        print_error "Backend failed to start!"
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
    
    # Start frontend
    print_status "Starting frontend server on port 8080..."
    cd sample-website
    python3 -m http.server 8080 &
    FRONTEND_PID=$!
    cd ..
    
    # Wait for frontend to start
    sleep 2
    
    print_success "Frontend is running on http://localhost:8080"
    
    # Create a simple test page
    create_test_page
    
    print_success "Local deployment complete!"
    print_status "Access your chatbot at:"
    echo "  🌐 Main Website: http://localhost:8080"
    echo "  🔧 Backend API: http://localhost:3001"
    echo "  📱 Widget Script: http://localhost:8080/chatkit-widget.js"
    echo "  🧪 Test Page: http://localhost:8080/test.html"
    echo ""
    print_status "Press Ctrl+C to stop all services"
    
    # Wait for user to stop
    wait
}

# Function to start Docker deployment
start_docker() {
    print_status "Starting Docker deployment..."
    
    # Check if Docker is running
    if ! command_exists docker; then
        print_error "Docker is not installed or not running!"
        print_warning "Please install Docker Desktop and try again."
        exit 1
    fi
    
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker daemon is not running!"
        print_warning "Please start Docker Desktop and try again."
        exit 1
    fi
    
    # Kill any existing containers
    print_status "Stopping existing containers..."
    docker compose down 2>/dev/null || true
    docker compose -f docker-compose.microservices.yml down 2>/dev/null || true
    
    # Build and start containers
    print_status "Building and starting containers..."
    docker compose up --build -d
    
    # Wait for services to start
    print_status "Waiting for services to start..."
    sleep 10
    
    # Check if services are running
    if curl -s http://localhost:3001/health > /dev/null; then
        print_success "Backend container is running on http://localhost:3001"
    else
        print_error "Backend container failed to start!"
        docker compose logs backend
        exit 1
    fi
    
    if curl -s http://localhost:8080 > /dev/null; then
        print_success "Frontend container is running on http://localhost:8080"
    else
        print_error "Frontend container failed to start!"
        docker compose logs frontend
        exit 1
    fi
    
    # Create a simple test page
    create_test_page
    
    print_success "Docker deployment complete!"
    print_status "Access your chatbot at:"
    echo "  🌐 Main Website: http://localhost:8080"
    echo "  🔧 Backend API: http://localhost:3001"
    echo "  📱 Widget Script: http://localhost:8080/chatkit-widget.js"
    echo "  🧪 Test Page: http://localhost:8080/test.html"
    echo ""
    print_status "To stop: docker compose down"
    print_status "To view logs: docker compose logs -f"
}

    # Function to start local development with Ollama support
    start_ollama() {
        print_status "Starting ChatKit with Ollama support..."

        # Kill any existing processes
        kill_port 3001
        kill_port 8080

        # Start ChatKit backend with Ollama support (falls back to OpenAI)
        print_status "Starting ChatKit backend with Ollama support..."
        (cd backend && npm run start:ollama) &
        BACKEND_PID=$!
        sleep 5

        # Check if backend started
        if curl -s http://localhost:3001/health >/dev/null; then
            print_success "Backend is running on http://localhost:3001"
        else
            print_error "Backend failed to start!"
            kill $BACKEND_PID 2>/dev/null
            exit 1
        fi

        # Start frontend
        print_status "Starting frontend server on port 8080..."
        (cd sample-website && python3 -m http.server 8080) &
        FRONTEND_PID=$!
        sleep 2

        # Check if frontend started
        if curl -s http://localhost:8080 >/dev/null; then
            print_success "Frontend is running on http://localhost:8080"
        else
            print_error "Frontend failed to start!"
            kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
            exit 1
        fi

        # Create a simple test page
        create_test_page

        print_success "ChatKit with Ollama support complete!"
        print_status "Access your chatbot at:"
        echo "  🌐 Main Website: http://localhost:8080"
        echo "  🔧 Backend API: http://localhost:3001"
        echo "  📱 Widget Script: http://localhost:8080/chatkit-widget.js"
        echo "  🧪 Test Page: http://localhost:8080/test.html"
        echo ""
        print_status "🤖 Ollama Integration:"
        echo "  - If Ollama is running: Uses local LLM (private)"
        echo "  - If Ollama not available: Falls back to OpenAI"
        echo "  - To use Ollama: See ollama-setup/README.md for setup"
        echo ""
        print_status "Press Ctrl+C to stop all services"

        # Wait for user to stop
        wait
    }

    # Function to start microservices deployment with external Ollama
    start_microservices_ollama() {
        print_status "Starting microservices deployment with containerized Ollama..."

        # Check if Docker is running
        if ! command_exists docker; then
            print_error "Docker is not installed or not running!"
            print_warning "Please install Docker Desktop and try again."
            exit 1
        fi

        if ! docker info >/dev/null 2>&1; then
            print_error "Docker daemon is not running!"
            print_warning "Please start Docker Desktop and try again."
            exit 1
        fi

        # Check if Ollama container is running
        print_status "Checking Ollama container..."
        if ! docker ps | grep -q "ollama-server"; then
            print_warning "Ollama container not detected!"
            print_warning "Please start Ollama container first:"
            print_warning "  cd ollama-setup && ./setup.sh start"
            read -p "Continue anyway? (y/N): " continue_anyway
            if [[ ! $continue_anyway =~ ^[Yy]$ ]]; then
                print_error "Deployment cancelled. Please start your Ollama container first."
                exit 1
            fi
        else
            print_success "Ollama container detected and running"
        fi

        # Kill any existing containers
        print_status "Stopping existing containers..."
        docker compose down 2>/dev/null || true
        docker compose -f docker-compose.microservices.yml down 2>/dev/null || true
        docker compose -f docker-compose.microservices-ollama.yml down 2>/dev/null || true

        # Connect Ollama to the chatbot network if not already connected
        print_status "Setting up container networking..."
        if ! docker network ls | grep -q "websitechatbot_chatbot-network"; then
            docker network create websitechatbot_chatbot-network 2>/dev/null || true
        fi
        
        # Connect Ollama container to the network
        docker network connect websitechatbot_chatbot-network ollama-server 2>/dev/null || true

        # Build and start microservices
        print_status "Building and starting microservices with containerized Ollama..."
        docker compose -f docker-compose.microservices-ollama.yml up --build -d

        # Wait for services to start
        print_status "Waiting for microservices to start..."
        sleep 15

        # Check if services are running
        if curl -s http://localhost:3001/health >/dev/null; then
            print_success "ChatBot Backend is running on http://localhost:3001"
        else
            print_error "ChatBot Backend failed to start!"
            docker compose -f docker-compose.microservices-ollama.yml logs chatbot-backend
            exit 1
        fi

        if curl -s http://localhost:8080 >/dev/null; then
            print_success "Sample Website is running on http://localhost:8080"
        else
            print_error "Sample Website failed to start!"
            docker compose -f docker-compose.microservices-ollama.yml logs sample-website
            exit 1
        fi

        # Create a simple test page
        create_test_page

        print_success "Microservices deployment with containerized Ollama complete!"
        print_status "Access your services at:"
        echo "  🌐 Sample Website: http://localhost:8080"
        echo "  🔧 ChatBot Backend: http://localhost:3001"
        echo "  🤖 Containerized Ollama: http://localhost:11434"
        echo "  📱 Widget Script: http://localhost:8080/chatkit-widget.js"
        echo "  🧪 Test Page: http://localhost:8080/test.html"
        echo ""
        print_status "Architecture:"
        echo "  📦 Sample Website Container (Port 8080)"
        echo "  🤖 ChatBot Backend Container (Port 3001)"
        echo "  🧠 Containerized Ollama (Port 11434) - Separate container"
        echo "  🌐 All containers communicate via Docker network"
        echo ""
        print_status "Container Status:"
        docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        echo ""
        print_status "To stop: docker compose -f docker-compose.microservices-ollama.yml down"
        print_status "To view logs: docker compose -f docker-compose.microservices-ollama.yml logs -f"
    }

    # Function to start microservices deployment
    start_microservices() {
    print_status "Starting microservices deployment..."
    
    # Check if Docker is running
    if ! command_exists docker; then
        print_error "Docker is not installed or not running!"
        print_warning "Please install Docker Desktop and try again."
        exit 1
    fi
    
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker daemon is not running!"
        print_warning "Please start Docker Desktop and try again."
        exit 1
    fi
    
    # Kill any existing containers
    print_status "Stopping existing containers..."
    docker compose down 2>/dev/null || true
    docker compose -f docker-compose.microservices.yml down 2>/dev/null || true
    
    # Build and start microservices
    print_status "Building and starting microservices..."
    docker compose -f docker-compose.microservices.yml up --build -d
    
    # Wait for services to start
    print_status "Waiting for microservices to start..."
    sleep 15
    
    # Check if services are running
    if curl -s http://localhost:3001/health > /dev/null; then
        print_success "ChatBot Backend is running on http://localhost:3001"
    else
        print_error "ChatBot Backend failed to start!"
        docker compose -f docker-compose.microservices.yml logs chatbot-backend
        exit 1
    fi
    
    if curl -s http://localhost:8080/health > /dev/null; then
        print_success "Sample Website is running on http://localhost:8080"
    else
        print_error "Sample Website failed to start!"
        docker compose -f docker-compose.microservices.yml logs sample-website
        exit 1
    fi
    
    # Create a simple test page
    create_test_page
    
    print_success "Microservices deployment complete!"
    print_status "Access your services at:"
    echo "  🌐 Sample Website: http://localhost:8080"
    echo "  🔧 ChatBot Backend: http://localhost:3001"
    echo "  📱 Widget Script: http://localhost:8080/chatkit-widget.js"
    echo "  🧪 Test Page: http://localhost:8080/test.html"
    echo ""
    print_status "Architecture:"
    echo "  📦 Sample Website Container (Port 8080)"
    echo "  🤖 ChatBot Backend Container (Port 3001)"
    echo "  🌐 Both containers communicate via Docker network"
    echo ""
    print_status "To stop: docker compose -f docker-compose.microservices.yml down"
    print_status "To view logs: docker compose -f docker-compose.microservices.yml logs -f"
}

# Function to create a test page
create_test_page() {
    print_status "Creating test page..."
    
    cat > sample-website/test.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ChatKit Test Page</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }
        .test-section {
            margin: 20px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
            border-left: 4px solid #3498db;
        }
        .test-section h3 {
            margin-top: 0;
            color: #495057;
        }
        .status {
            padding: 10px;
            border-radius: 5px;
            margin: 10px 0;
            font-weight: bold;
        }
        .status.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .status.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            background: #3498db;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 5px;
            transition: background 0.3s;
        }
        .btn:hover {
            background: #2980b9;
        }
        .integration-code {
            background: #2d3748;
            color: #e2e8f0;
            padding: 15px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            overflow-x: auto;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧪 ChatKit Test Page</h1>
        
        <div class="test-section">
            <h3>✅ Deployment Status</h3>
            <div id="status" class="status success">Checking services...</div>
            <p>This page tests the ChatKit integration and shows you how to add it to any website.</p>
        </div>
        
        <div class="test-section">
            <h3>🔧 Backend API Test</h3>
            <button class="btn" onclick="testBackend()">Test Backend API</button>
            <div id="backend-status"></div>
        </div>
        
        <div class="test-section">
            <h3>📱 Widget Integration Test</h3>
            <button class="btn" onclick="testWidget()">Test Widget Loading</button>
            <div id="widget-status"></div>
        </div>
        
        <div class="test-section">
            <h3>🚀 How to Add to Your Website</h3>
            <p><strong>Option 1: One-line integration</strong></p>
            <div class="integration-code">
&lt;script 
    src="http://localhost:8080/chatkit-widget.js"
    data-backend-url="http://localhost:3001"
    data-widget-title="AI Assistant"
    data-primary-color="#3498db"&gt;
&lt;/script&gt;
            </div>
            
            <p><strong>Option 2: Manual initialization</strong></p>
            <div class="integration-code">
&lt;script src="http://localhost:8080/chatkit-widget.js"&gt;&lt;/script&gt;
&lt;script&gt;
    ChatKit.init({
        backendUrl: 'http://localhost:3001',
        widgetTitle: 'My AI Assistant',
        primaryColor: '#e74c3c'
    });
&lt;/script&gt;
            </div>
        </div>
        
        <div class="test-section">
            <h3>🔗 Quick Links</h3>
            <a href="http://localhost:8080" class="btn">Main Website</a>
            <a href="http://localhost:8080/examples/basic-integration.html" class="btn">Basic Integration</a>
            <a href="http://localhost:8080/examples/advanced-integration.html" class="btn">Advanced Integration</a>
            <a href="http://localhost:3001/health" class="btn">Backend Health</a>
        </div>
    </div>

    <script>
        // Test backend API
        async function testBackend() {
            const statusDiv = document.getElementById('backend-status');
            try {
                const response = await fetch('http://localhost:3001/health');
                if (response.ok) {
                    const data = await response.json();
                    statusDiv.innerHTML = '<div class="status success">✅ Backend API is working! Status: ' + data.status + '</div>';
                } else {
                    statusDiv.innerHTML = '<div class="status error">❌ Backend API returned error: ' + response.status + '</div>';
                }
            } catch (error) {
                statusDiv.innerHTML = '<div class="status error">❌ Backend API test failed: ' + error.message + '</div>';
            }
        }
        
        // Test widget loading
        function testWidget() {
            const statusDiv = document.getElementById('widget-status');
            if (typeof window.ChatKit !== 'undefined') {
                statusDiv.innerHTML = '<div class="status success">✅ ChatKit widget is loaded and ready!</div>';
            } else {
                statusDiv.innerHTML = '<div class="status error">❌ ChatKit widget not loaded. Check console for errors.</div>';
            }
        }
        
        // Load ChatKit widget
        const script = document.createElement('script');
        script.src = 'http://localhost:8080/chatkit-widget.js';
        script.onload = () => {
            document.getElementById('status').innerHTML = '<div class="status success">✅ All services are running! ChatKit is ready to use.</div>';
            testWidget();
        };
        script.onerror = () => {
            document.getElementById('status').innerHTML = '<div class="status error">❌ Failed to load ChatKit widget. Check if services are running.</div>';
        };
        document.head.appendChild(script);
        
        // Auto-test backend on load
        window.addEventListener('load', () => {
            testBackend();
        });
    </script>
</body>
</html>
EOF
    
    print_success "Test page created at sample-website/test.html"
}

# Function to show help
show_help() {
    echo "ChatKit Deployment Script"
    echo ""
    echo "Usage: ./deploy.sh [OPTION]"
    echo ""
    echo "Options:"
    echo "  local         Start local development environment"
    echo "  docker        Start Docker containerized deployment"
    echo "  microservices         Start microservices deployment (separate containers)"
    echo "  microservices-ollama  Start microservices with external Ollama"
    echo "  ollama                Start local development with Ollama support"
    echo "  stop          Stop all running services"
    echo "  status        Check status of running services"
    echo "  help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./deploy.sh local         # Start local development"
    echo "  ./deploy.sh docker        # Start Docker deployment"
    echo "  ./deploy.sh microservices         # Start microservices deployment"
    echo "  ./deploy.sh microservices-ollama  # Start microservices with external Ollama"
    echo "  ./deploy.sh ollama                # Start Ollama deployment"
    echo "  ./deploy.sh stop          # Stop all services"
    echo "  ./deploy.sh status        # Check service status"
    echo ""
    echo "Deployment Types:"
    echo "  local         - Fast development, both services in one process"
    echo "  docker        - Single container with both services"
    echo "  microservices         - Separate containers (production-like)"
    echo "  microservices-ollama  - Separate containers + external Ollama LLM"
    echo "  ollama                - Local development with optional Ollama support"
}

# Function to stop services
stop_services() {
    print_status "Stopping all services..."
    
    # Stop Docker containers
    if command_exists docker && docker info >/dev/null 2>&1; then
        docker compose down 2>/dev/null || true
        docker compose -f docker-compose.microservices.yml down 2>/dev/null || true
        print_success "Docker containers stopped"
    fi
    
    # Kill local processes
    kill_port 3001
    kill_port 8080
    
    print_success "All services stopped!"
}

# Function to check status
check_status() {
    print_status "Checking service status..."
    
    # Check backend
    if curl -s http://localhost:3001/health > /dev/null 2>&1; then
        print_success "Backend API: Running on http://localhost:3001"
    else
        print_warning "Backend API: Not running"
    fi
    
    # Check frontend
    if curl -s http://localhost:8080 > /dev/null 2>&1; then
        print_success "Frontend: Running on http://localhost:8080"
    else
        print_warning "Frontend: Not running"
    fi
    
    # Check Docker containers
    if command_exists docker && docker info >/dev/null 2>&1; then
        if docker compose ps | grep -q "Up"; then
            print_success "Docker containers: Running"
            docker compose ps
        else
            print_warning "Docker containers: Not running"
        fi
    fi
}

# Main script logic
case "${1:-}" in
    "local")
        check_environment
        install_dependencies
        start_local
        ;;
    "docker")
        check_environment
        start_docker
        ;;
        "microservices")
            check_environment
            start_microservices
            ;;
        "microservices-ollama")
            check_environment
            start_microservices_ollama
            ;;
        "ollama")
            check_environment
            start_ollama
            ;;
        "stop")
            stop_services
            ;;
        "status")
            check_status
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        "")
            print_status "ChatKit Deployment Script"
            echo ""
            echo "Choose deployment method:"
            echo "1) Local development (faster, for development)"
            echo "2) Docker deployment (single container)"
            echo "3) Microservices deployment (separate containers)"
            echo "4) Microservices with external Ollama (separate containers + external LLM)"
            echo "5) Local development with Ollama (optional local LLM)"
            echo "6) Show help"
            echo ""
            read -p "Enter your choice (1-6): " choice

            case $choice in
                1)
                    check_environment
                    install_dependencies
                    start_local
                    ;;
                2)
                    check_environment
                    start_docker
                    ;;
                3)
                    check_environment
                    start_microservices
                    ;;
                4)
                    check_environment
                    start_microservices_ollama
                    ;;
                5)
                    check_environment
                    start_ollama
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
        print_error "Unknown option: $1"
        show_help
        exit 1
        ;;
esac
