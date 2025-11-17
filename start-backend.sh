#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Starting Exotic Cash Backend Server${NC}"
echo "========================================"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⏳ Installing dependencies...${NC}"
    npm install
fi

# Check .env file
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env file not found${NC}"
    exit 1
fi

echo -e "${YELLOW}📝 Environment: $(grep NODE_ENV .env | cut -d '=' -f2)${NC}"
echo -e "${YELLOW}📊 Database: $(grep DB_NAME .env | cut -d '=' -f2)${NC}"
echo -e "${YELLOW}🔌 Port: $(grep PORT .env | cut -d '=' -f2)${NC}"
echo ""
echo -e "${GREEN}✓ Starting server...${NC}"
echo "========================================"

# Start the backend server
npx tsx server/index.ts
