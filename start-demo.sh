#!/bin/bash

# ChatKit Demo Startup Script
echo "🚀 Starting ChatKit Demo..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if OpenAI API key is set
if [ -z "$OPENAI_API_KEY" ]; then
    echo "⚠️  OPENAI_API_KEY environment variable not set."
    echo "   Please set your OpenAI API key:"
    echo "   export OPENAI_API_KEY='your-api-key-here'"
    echo ""
    echo "   Or edit the .env files in backend/ and chatkit-app/ directories"
    echo ""
fi

# Function to start backend
start_backend() {
    echo "🔧 Starting backend server..."
    cd backend
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing backend dependencies..."
        npm install
    fi
    npm start &
    BACKEND_PID=$!
    cd ..
    echo "✅ Backend started (PID: $BACKEND_PID)"
}

# Function to start ChatKit app
start_chatkit() {
    echo "🎨 Starting ChatKit app..."
    cd chatkit-app
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing ChatKit dependencies..."
        npm install
    fi
    npm run dev &
    CHATKIT_PID=$!
    cd ..
    echo "✅ ChatKit app started (PID: $CHATKIT_PID)"
}

# Start services
start_backend
sleep 2
start_chatkit

echo ""
echo "🎉 Demo is starting up!"
echo ""
echo "📱 Services running:"
echo "   • Backend API: http://localhost:3001"
echo "   • ChatKit App: http://localhost:3000"
echo "   • Sample Website: Open sample-website/chatkit-with-backend.html"
echo ""
echo "🔧 To stop all services, press Ctrl+C"
echo ""

# Wait for user to stop
trap 'echo ""; echo "🛑 Stopping services..."; kill $BACKEND_PID $CHATKIT_PID 2>/dev/null; echo "✅ Services stopped"; exit 0' INT

# Keep script running
wait
