#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🗄️  Exotic Cash - Database Setup${NC}"
echo "===================================="

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ PostgreSQL found${NC}"

# Get database credentials from .env or use defaults
DB_USER=${DB_USER:-postgres}
DB_PASSWORD=${DB_PASSWORD:-postgres}
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-exotic_cash_db}

echo -e "${YELLOW}📝 Using database credentials:${NC}"
echo "   User: $DB_USER"
echo "   Host: $DB_HOST:$DB_PORT"
echo "   Database: $DB_NAME"

# Create database and run init script
echo -e "${BLUE}⏳ Creating database and tables...${NC}"

PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -p $DB_PORT << EOF
-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS $DB_NAME;

-- Connect to the database
\c $DB_NAME;

-- Create ENUM type for user roles
CREATE TYPE IF NOT EXISTS user_role AS ENUM ('admin', 'user');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  admin_id VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  full_name VARCHAR(255),
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_admin_id ON users(admin_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Delete existing test users to avoid conflicts
DELETE FROM users WHERE admin_id IN ('Admin112', 'User001');

-- Insert sample data with proper bcrypt hashes
INSERT INTO users (admin_id, password_hash, role, full_name, email) VALUES
('Admin112', '\$2b\$10\$qRVRHYu0j.gBmVsyB76wwuffzqLhFp4mm8ewq0lZmaZ9HEr6mNFyu', 'admin', 'Administrator', 'admin@exoticcash.com'),
('User001', '\$2b\$10\$Iux02YjVKb2jVrtqKq5kEucfKja83xDxuD1NKruULWI/T1AY3kWeu', 'user', 'John Doe', 'john@exoticcash.com');

EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database setup completed successfully!${NC}"
    echo ""
    echo -e "${YELLOW}📋 Test Credentials:${NC}"
    echo "   Admin Account:"
    echo "   └─ AdminId: Admin112"
    echo "   └─ Password: Admin@112"
    echo ""
    echo "   User Account:"
    echo "   └─ AdminId: User001"
    echo "   └─ Password: User@123"
else
    echo -e "${RED}❌ Database setup failed${NC}"
    exit 1
fi
