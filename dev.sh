#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Barreiro 360 Development Environment${NC}"
echo ""
echo -e "${GREEN}Starting both frontend and backend servers...${NC}"
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${BLUE}📦 Installing Wrangler...${NC}"
    npm install -g wrangler
fi

echo -e "${GREEN}✓ Starting Cloudflare Worker backend on port 8081${NC}"
echo -e "${GREEN}✓ Starting Vite frontend on port 8080${NC}"
echo ""
echo -e "${BLUE}Open your browser at: http://localhost:8080${NC}"
echo -e "${BLUE}Backend API: http://localhost:8081${NC}"
echo ""
echo -e "${BLUE}To stop: Press Ctrl+C${NC}"
echo ""

# Run both processes concurrently
npm run dev:backend &
BACKEND_PID=$!

sleep 3

npm run dev &
FRONTEND_PID=$!

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${BLUE}🛑 Stopping servers...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    wait $BACKEND_PID 2>/dev/null
    wait $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✓ Servers stopped${NC}"
    exit 0
}

# Trap Ctrl+C and cleanup
trap cleanup SIGINT

# Keep script running
wait
