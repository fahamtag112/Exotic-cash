# 🚀 Server Startup Guide - Permanent Solution

## Quick Start (Production Ready)

### Step 1: Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your database credentials
nano .env
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Ensure PostgreSQL is Running
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL if not running
sudo systemctl start postgresql

# Verify connection
psql -U postgres -d exotic_cash_db -c "SELECT NOW();"
```

### Step 4: Initialize Database (First time only)
```bash
# Create database if it doesn't exist
createdb exotic_cash_db

# Run SQL schema
psql -U postgres -d exotic_cash_db -f server/db/init.sql
```

### Step 5: Start the Server

**Development Mode (with auto-reload):**
```bash
npm run server:dev
```

**Production Mode:**
```bash
npm run build
npm run start
```

**Simple Server (no auto-reload):**
```bash
npm run server
```

## Verification

### ✅ Check Server Health
```bash
curl http://localhost:5000/api/health
```

Expected Response:
```json
{
  "success": true,
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-11-17T10:30:00.000Z",
  "pool": {
    "total_connections": 5,
    "idle_connections": 5,
    "waiting_queries": 0,
    "timestamp": "2025-11-17T10:30:00.000Z"
  }
}
```

### ✅ Check Pool Status
```bash
curl http://localhost:5000/api/pool-status
```

## Troubleshooting

### Issue: Connection Refused (Error ECONNREFUSED)
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql

# Enable auto-start (optional)
sudo systemctl enable postgresql
```

### Issue: Database Not Found
```bash
# List all databases
psql -U postgres -l

# Create the database
createdb exotic_cash_db

# Verify creation
psql -U postgres -d exotic_cash_db -c "SELECT NOW();"
```

### Issue: Authentication Failed
```bash
# Edit .env and verify:
# - DB_USER=postgres (or your username)
# - DB_PASSWORD=postgres (or your password)
# - DB_HOST=localhost
# - DB_PORT=5432
```

### Issue: Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process (replace PID with actual number)
kill -9 <PID>

# Or change PORT in .env
PORT=5001
```

### Issue: Server Crashes or Unresponsive
```bash
# Check server logs
npm run server:dev

# Check database pool status
curl http://localhost:5000/api/pool-status

# Check pool configuration in server/db/connection.ts
```

## Database Configuration Reference

### Connection Pool Settings
- **max**: 20 connections (can handle 20 concurrent requests)
- **min**: 5 connections (keeps 5 ready)
- **idleTimeoutMillis**: 30000 (closes idle after 30 seconds)
- **connectionTimeoutMillis**: 5000 (5 second timeout)
- **statement_timeout**: 30000 (30 second query timeout)

### Increase Performance
For high traffic, increase pool size in `server/db/connection.ts`:
```typescript
max: 50,  // Increase from 20
min: 10,  // Increase from 5
```

## Production Deployment

### 1. Using PM2 (Recommended)
```bash
# Install PM2 globally
npm install -g pm2

# Start server with PM2
pm2 start "npm run start" --name "exotic-cash-server"

# View logs
pm2 logs exotic-cash-server

# Restart on reboot
pm2 startup
pm2 save
```

### 2. Using Systemd
Create `/etc/systemd/system/exotic-cash.service`:
```ini
[Unit]
Description=Exotic Cash Investment Platform
After=network.target postgresql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/exotic-cash
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Then enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable exotic-cash
sudo systemctl start exotic-cash
```

### 3. Using Docker (Optional)
See `Dockerfile` in project root for containerized deployment.

## Monitoring & Health Checks

### Check Server Status Every 60 Seconds
```bash
watch -n 60 'curl -s http://localhost:5000/api/health | jq .'
```

### Monitor Database Connections
```bash
# Watch pool status
watch -n 5 'curl -s http://localhost:5000/api/pool-status | jq .'

# Or query PostgreSQL directly
psql -U postgres -d exotic_cash_db -c "SELECT * FROM pg_stat_activity;"
```

## Permanent Solution Summary

✅ **Fixed Issues:**
1. Added npm scripts for easy server startup
2. Improved environment configuration
3. Enhanced error handling and graceful shutdown
4. Proper database connection pooling
5. Health check endpoints
6. Comprehensive logging
7. Timeout and retry mechanisms

✅ **Commands Available:**
- `npm run server` - Start server (no auto-reload)
- `npm run server:dev` - Start with auto-reload on changes
- `npm run build` - Build frontend + compile TypeScript
- `npm run start` - Production start
- `npm run dev` - Frontend dev server

✅ **What's Configured:**
- Automatic connection pooling
- Graceful shutdown handling
- Proper error middleware
- Health monitoring endpoints
- Request logging
- Database health checks

## Quick Reference

| Task | Command |
|------|---------|
| Start dev server | `npm run server:dev` |
| Start production | `npm run start` |
| Check health | `curl http://localhost:5000/api/health` |
| Check pool status | `curl http://localhost:5000/api/pool-status` |
| View logs | `npm run server:dev` (see console) |
| Restart database | `sudo systemctl restart postgresql` |
| Check DB connection | `psql -U postgres -d exotic_cash_db -c "SELECT NOW();"` |

---

**Last Updated:** November 17, 2025  
**Platform:** Exotic Cash Investment Platform  
**Status:** ✅ Production Ready
