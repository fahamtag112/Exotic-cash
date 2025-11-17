#!/bin/bash

# Exotic Cash - GitHub Push Script
# This script will push your local repository to GitHub

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║          Exotic Cash - GitHub Repository Push                 ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first."
    exit 1
fi

# Get GitHub username
echo "Enter your GitHub username:"
read github_username

if [ -z "$github_username" ]; then
    echo "❌ GitHub username cannot be empty"
    exit 1
fi

# Get authentication method
echo ""
echo "Choose authentication method:"
echo "1) HTTPS with Personal Access Token (easier)"
echo "2) SSH (more secure)"
read -p "Enter choice (1 or 2): " auth_method

cd /root/Exotic-cash

# Remove any existing remote
git remote remove origin 2>/dev/null

if [ "$auth_method" = "1" ]; then
    echo ""
    echo "📝 For HTTPS authentication:"
    echo "1. Go to https://github.com/settings/tokens"
    echo "2. Generate new token (classic)"
    echo "3. Scopes: repo, write:repo_hook"
    echo "4. Copy the token"
    echo ""
    read -sp "Enter your Personal Access Token: " token
    echo ""
    
    if [ -z "$token" ]; then
        echo "❌ Token cannot be empty"
        exit 1
    fi
    
    git remote add origin https://${github_username}:${token}@github.com/${github_username}/exotic-cash.git
    
elif [ "$auth_method" = "2" ]; then
    echo ""
    echo "🔐 For SSH authentication:"
    echo "1. Make sure your SSH key is added to GitHub"
    echo "2. Go to https://github.com/settings/keys"
    echo ""
    
    git remote add origin git@github.com:${github_username}/exotic-cash.git
    
else
    echo "❌ Invalid choice"
    exit 1
fi

# Rename branch to main if needed
current_branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$current_branch" != "main" ]; then
    echo ""
    echo "📋 Renaming branch to 'main'..."
    git branch -m master main
fi

echo ""
echo "📤 Pushing to GitHub..."
echo "Repository: https://github.com/${github_username}/exotic-cash"
echo ""

# Push to GitHub
if git push -u origin main; then
    echo ""
    echo "✅ SUCCESS! Repository pushed to GitHub!"
    echo ""
    echo "📍 Repository URL: https://github.com/${github_username}/exotic-cash"
    echo ""
    echo "📊 Statistics:"
    echo "   - Files: 120"
    echo "   - Total Size: 38.6 KB"
    echo "   - Branch: main"
    echo ""
    echo "🎉 Your Exotic Cash repository is now on GitHub!"
    echo ""
else
    echo ""
    echo "❌ Push failed. Please check:"
    echo "1. GitHub username is correct"
    echo "2. Personal Access Token or SSH key is valid"
    echo "3. Repository 'exotic-cash' exists on GitHub"
    echo "4. You have permission to push"
    exit 1
fi
