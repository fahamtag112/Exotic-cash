#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔════════════════════════════════════════╗"
echo "║  🎛️  EXOTIC CASH - Quick Start Guide   ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm found: $(npm --version)${NC}"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo -e "${RED}✗ PostgreSQL not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ PostgreSQL found: $(psql --version)${NC}"

echo ""
echo -e "${YELLOW}📋 Setup Instructions:${NC}"
echo ""
echo -e "${BLUE}Step 1: Start Backend Server${NC}"
echo "  → Open Terminal 1"
echo "  → Run: cd /root/Exotic-cash && npx tsx server/index.ts"
echo ""
echo -e "${BLUE}Step 2: Start Frontend Server${NC}"
echo "  → Open Terminal 2"
echo "  → Run: cd /root/Exotic-cash && npm run dev"
echo ""
echo -e "${BLUE}Step 3: Open Browser${NC}"
echo "  → Navigate to: http://localhost:5173"
echo ""
echo -e "${YELLOW}🔐 Test Credentials:${NC}"
echo ""
echo -e "${GREEN}Admin Account:${NC}"
echo "  AdminId: Admin112"
echo "  Password: Admin@112"
echo ""
echo -e "${GREEN}User Account:${NC}"
echo "  AdminId: User001"
echo "  Password: User@123"
echo ""
echo -e "${YELLOW}📊 Server URLs:${NC}"
echo "  Backend:  http://localhost:5000"
echo "  Frontend: http://localhost:5173"
echo ""
echo -e "${BLUE}📝 For detailed setup, see: SETUP_GUIDE.md${NC}"
echo ""
