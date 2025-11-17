#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════
# Exotic Cash - GitHub Push Setup & Deploy Script
# ═══════════════════════════════════════════════════════════════════════════

clear

echo "╔═════════════════════════════════════════════════════════════════════════╗"
echo "║                                                                         ║"
echo "║          Exotic Cash - GitHub Repository Setup & Push                  ║"
echo "║                                                                         ║"
echo "╚═════════════════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed${NC}"
    exit 1
fi

# Verify we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Not in Exotic-cash directory${NC}"
    echo "Please run: cd /root/Exotic-cash"
    exit 1
fi

cd /root/Exotic-cash

# ═════════════════════════════════════════════════════════════════════════════
# STEP 1: Verify branch is main
# ═════════════════════════════════════════════════════════════════════════════

echo -e "${BLUE}[1/5]${NC} Checking git status..."
echo ""

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${YELLOW}⚠️  Current branch is '$CURRENT_BRANCH', renaming to 'main'...${NC}"
    git branch -m "$CURRENT_BRANCH" main
    echo -e "${GREEN}✅ Branch renamed to 'main'${NC}"
else
    echo -e "${GREEN}✅ Branch is already 'main'${NC}"
fi

echo ""
git log --oneline -1
echo ""

# ═════════════════════════════════════════════════════════════════════════════
# STEP 2: Get GitHub credentials
# ═════════════════════════════════════════════════════════════════════════════

echo -e "${BLUE}[2/5]${NC} GitHub Credentials"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

read -p "Enter your GitHub username: " github_username

if [ -z "$github_username" ]; then
    echo -e "${RED}❌ GitHub username cannot be empty${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Authentication Methods:${NC}"
echo "1) HTTPS with Personal Access Token (Easier)"
echo "2) SSH (More Secure)"
echo ""
read -p "Choose (1 or 2): " auth_method

if [ "$auth_method" != "1" ] && [ "$auth_method" != "2" ]; then
    echo -e "${RED}❌ Invalid choice${NC}"
    exit 1
fi

# ═════════════════════════════════════════════════════════════════════════════
# STEP 3: Setup authentication
# ═════════════════════════════════════════════════════════════════════════════

echo ""
echo -e "${BLUE}[3/5]${NC} Setting up authentication..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$auth_method" = "1" ]; then
    # HTTPS Method
    echo -e "${YELLOW}Instructions for Personal Access Token:${NC}"
    echo "1. Go to: https://github.com/settings/tokens"
    echo "2. Click: 'Generate new token (classic)'"
    echo "3. Name: exotic-cash-push"
    echo "4. Scopes: repo, write:repo_hook"
    echo "5. Copy the token"
    echo ""
    read -sp "Paste your Personal Access Token: " github_token
    echo ""
    
    if [ -z "$github_token" ]; then
        echo -e "${RED}❌ Token cannot be empty${NC}"
        exit 1
    fi
    
    # Remove existing remote if it exists
    git remote remove origin 2>/dev/null
    
    # Add HTTPS remote
    git remote add origin "https://${github_username}:${github_token}@github.com/${github_username}/exotic-cash.git"
    echo -e "${GREEN}✅ HTTPS remote configured${NC}"
    
else
    # SSH Method
    echo -e "${YELLOW}Instructions for SSH:${NC}"
    echo "1. Make sure your SSH key is added to GitHub"
    echo "2. Go to: https://github.com/settings/keys"
    echo "3. SSH key should be: ~/.ssh/id_rsa.pub"
    echo ""
    
    # Check if SSH key exists
    if [ ! -f ~/.ssh/id_rsa ]; then
        read -p "SSH key not found. Generate it? (y/n): " generate_ssh
        if [ "$generate_ssh" = "y" ]; then
            ssh-keygen -t rsa -b 4096 -N "" -f ~/.ssh/id_rsa -C "exotic-cash"
            echo -e "${GREEN}✅ SSH key generated${NC}"
        else
            echo -e "${YELLOW}⚠️  Please generate SSH key and add it to GitHub${NC}"
            exit 1
        fi
    fi
    
    # Remove existing remote if it exists
    git remote remove origin 2>/dev/null
    
    # Add SSH remote
    git remote add origin "git@github.com:${github_username}/exotic-cash.git"
    echo -e "${GREEN}✅ SSH remote configured${NC}"
fi

# ═════════════════════════════════════════════════════════════════════════════
# STEP 4: Verify remote setup
# ═════════════════════════════════════════════════════════════════════════════

echo ""
echo -e "${BLUE}[4/5]${NC} Verifying remote configuration..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

git remote -v
echo ""
echo -e "${GREEN}✅ Remote origin configured${NC}"

# ═════════════════════════════════════════════════════════════════════════════
# STEP 5: Push to GitHub
# ═════════════════════════════════════════════════════════════════════════════

echo ""
echo -e "${BLUE}[5/5]${NC} Pushing to GitHub..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}Repository: https://github.com/${github_username}/exotic-cash${NC}"
echo "Branch: main"
echo "Files: 120"
echo ""

if git push -u origin main; then
    echo ""
    echo "╔═════════════════════════════════════════════════════════════════════════╗"
    echo "║                                                                         ║"
    echo -e "║${GREEN}                  ✅ SUCCESS! PUSHED TO GITHUB! ✅${NC}                   ║"
    echo "║                                                                         ║"
    echo "╚═════════════════════════════════════════════════════════════════════════╝"
    echo ""
    echo -e "${GREEN}Repository Details:${NC}"
    echo "  URL: https://github.com/${github_username}/exotic-cash"
    echo "  Branch: main"
    echo "  Files: 120"
    echo "  Status: ✅ LIVE on GitHub"
    echo ""
    echo -e "${BLUE}Next Steps:${NC}"
    echo "  1. Visit your repository: https://github.com/${github_username}/exotic-cash"
    echo "  2. Verify all files are there"
    echo "  3. Add topics: investment, fintech, react, nodejs"
    echo "  4. Share the repository link"
    echo ""
    
else
    echo ""
    echo -e "${RED}❌ Push failed!${NC}"
    echo ""
    echo -e "${YELLOW}Troubleshooting:${NC}"
    echo "  • Check GitHub username is correct"
    echo "  • HTTPS: Verify Personal Access Token is valid"
    echo "  • SSH: Verify SSH key is added to GitHub"
    echo "  • Make sure repository 'exotic-cash' exists on GitHub"
    echo ""
    exit 1
fi

# ═════════════════════════════════════════════════════════════════════════════
# Summary
# ═════════════════════════════════════════════════════════════════════════════

echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}✅ All Done!${NC}"
echo ""
echo "Your Exotic Cash repository is now on GitHub:"
echo "  https://github.com/${github_username}/exotic-cash"
echo ""
echo "Share this link with your team! 🎉"
echo ""
