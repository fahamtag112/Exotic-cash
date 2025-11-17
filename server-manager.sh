#!/bin/bash

# ============================================
# EXOTIC CASH SERVER MANAGEMENT SCRIPT
# Permanent Solution for Server Issues
# ============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Constants
PROJECT_DIR="/root/Exotic-cash"
SERVER_PORT=5000
DB_NAME="exotic_cash_db"
DB_USER="postgres"

# ============================================
# HELPER FUNCTIONS
# ============================================

print_header() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# ============================================
# DIAGNOSTIC FUNCTIONS
# ============================================

check_postgresql() {
    print_header "Checking PostgreSQL Status"
    
    if sudo systemctl is-active --quiet postgresql; then
        print_success "PostgreSQL is running"
        return 0
    else
        print_error "PostgreSQL is NOT running"
        print_info "Starting PostgreSQL..."
        sudo systemctl start postgresql
        sleep 2
        
        if sudo systemctl is-active --quiet postgresql; then
            print_success "PostgreSQL started successfully"
            return 0
        else
            print_error "Failed to start PostgreSQL"
            return 1
        fi
    fi
}

check_database() {
    print_header "Checking Database Connection"
    
    if psql -U "$DB_USER" -d "$DB_NAME" -c "SELECT NOW();" >/dev/null 2>&1; then
        print_success "Database connection successful"
        return 0
    else
        print_error "Database connection failed"
        print_info "Attempting to create database..."
        
        if createdb "$DB_NAME" 2>/dev/null; then
            print_success "Database created successfully"
            
            if [ -f "$PROJECT_DIR/server/db/init.sql" ]; then
                print_info "Running database initialization script..."
                psql -U "$DB_USER" -d "$DB_NAME" -f "$PROJECT_DIR/server/db/init.sql"
                print_success "Database initialized"
                return 0
            fi
        else
            print_warning "Database may already exist or creation failed"
        fi
        return 1
    fi
}

check_port() {
    print_header "Checking Port $SERVER_PORT"
    
    if netstat -tuln | grep -q ":$SERVER_PORT "; then
        print_warning "Port $SERVER_PORT is already in use"
        PID=$(lsof -i :$SERVER_PORT | awk 'NR==2 {print $2}')
        print_warning "Process ID: $PID"
        return 1
    else
        print_success "Port $SERVER_PORT is available"
        return 0
    fi
}

check_server_health() {
    print_header "Checking Server Health"
    
    if response=$(curl -s http://localhost:$SERVER_PORT/api/health); then
        if echo "$response" | jq . >/dev/null 2>&1; then
            print_success "Server is responding"
            echo "$response" | jq .
            return 0
        fi
    fi
    
    print_error "Server is not responding"
    return 1
}

check_dependencies() {
    print_header "Checking Dependencies"
    
    cd "$PROJECT_DIR"
    
    if [ ! -d "node_modules" ]; then
        print_warning "node_modules not found"
        print_info "Installing dependencies..."
        npm install
        print_success "Dependencies installed"
    else
        print_success "Dependencies already installed"
    fi
}

# ============================================
# SERVER CONTROL FUNCTIONS
# ============================================

start_server() {
    print_header "Starting Server"
    
    # Check if server is already running
    if netstat -tuln | grep -q ":$SERVER_PORT "; then
        print_warning "Server is already running on port $SERVER_PORT"
        return 1
    fi
    
    # Run diagnostics first
    check_postgresql
    check_database
    check_dependencies
    
    print_info "Starting server..."
    cd "$PROJECT_DIR"
    npm run server:dev
}

stop_server() {
    print_header "Stopping Server"
    
    if PID=$(lsof -i :$SERVER_PORT | awk 'NR==2 {print $2}'); then
        print_info "Killing process $PID on port $SERVER_PORT"
        kill -9 "$PID" 2>/dev/null || true
        print_success "Server stopped"
    else
        print_warning "No server process found on port $SERVER_PORT"
    fi
}

restart_server() {
    print_header "Restarting Server"
    
    stop_server
    sleep 2
    start_server
}

# ============================================
# DIAGNOSTIC FUNCTIONS
# ============================================

run_full_diagnostics() {
    print_header "🔍 FULL SYSTEM DIAGNOSTICS"
    
    echo ""
    check_postgresql
    echo ""
    check_database
    echo ""
    check_port
    echo ""
    check_dependencies
    
    if netstat -tuln | grep -q ":$SERVER_PORT "; then
        echo ""
        check_server_health
    else
        print_warning "Server is not running"
    fi
    
    print_header "Diagnostic Summary"
    print_info "To start the server, run: $0 start"
    print_info "To check status, run: $0 status"
}

# ============================================
# STATUS FUNCTION
# ============================================

show_status() {
    print_header "Server Status"
    
    if netstat -tuln | grep -q ":$SERVER_PORT "; then
        print_success "Server is RUNNING on port $SERVER_PORT"
        PID=$(lsof -i :$SERVER_PORT | awk 'NR==2 {print $2}')
        print_info "Process ID: $PID"
        
        if check_server_health >/dev/null 2>&1; then
            print_success "Database connection is HEALTHY"
        else
            print_error "Database connection FAILED"
        fi
    else
        print_error "Server is NOT RUNNING"
    fi
    
    echo ""
    print_header "Quick Links"
    print_info "Health Check:  http://localhost:$SERVER_PORT/api/health"
    print_info "Pool Status:   http://localhost:$SERVER_PORT/api/pool-status"
    print_info "Server Stats:  http://localhost:$SERVER_PORT/api/stats"
}

# ============================================
# RESET FUNCTION
# ============================================

reset_all() {
    print_header "RESET ALL (Database & Server)"
    
    print_warning "This will:"
    print_warning "1. Stop the server"
    print_warning "2. Drop and recreate the database"
    print_warning "3. Restart the server"
    echo ""
    read -p "Continue? (yes/no): " -r
    
    if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        stop_server
        sleep 1
        
        print_info "Dropping database $DB_NAME..."
        dropdb -U "$DB_USER" "$DB_NAME" 2>/dev/null || true
        
        print_info "Creating fresh database..."
        createdb -U "$DB_USER" "$DB_NAME"
        
        print_info "Initializing database schema..."
        psql -U "$DB_USER" -d "$DB_NAME" -f "$PROJECT_DIR/server/db/init.sql"
        
        print_success "Database reset complete"
        sleep 2
        
        start_server
    else
        print_warning "Reset cancelled"
    fi
}

# ============================================
# MAIN SCRIPT
# ============================================

case "${1:-status}" in
    start)
        start_server
        ;;
    stop)
        stop_server
        ;;
    restart)
        restart_server
        ;;
    status)
        show_status
        ;;
    health)
        check_server_health
        ;;
    diagnose)
        run_full_diagnostics
        ;;
    reset)
        reset_all
        ;;
    *)
        print_header "Exotic Cash Server Manager"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  start        - Start the server with auto-reload"
        echo "  stop         - Stop the server"
        echo "  restart      - Restart the server"
        echo "  status       - Show server status"
        echo "  health       - Check server health"
        echo "  diagnose     - Run full system diagnostics"
        echo "  reset        - Reset database and restart server"
        echo ""
        echo "Examples:"
        echo "  $0 start"
        echo "  $0 stop"
        echo "  $0 diagnose"
        echo ""
        ;;
esac
