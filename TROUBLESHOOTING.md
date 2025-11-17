# 🔧 TROUBLESHOOTING GUIDE

## ❌ "Connection error. Please check if the server is running."

This error appears when the frontend cannot connect to the backend API.

### ✅ Solution Steps

#### **Step 1: Verify Backend is Running**

```bash
# Check if backend process is running
lsof -i :5000
```

**Expected Output:**
```
COMMAND   PID  USER FD  TYPE DEVICE SIZE/OFF NODE NAME
node    12345  root 37u IPv6 ...    0t0  TCP *:5000 (LISTEN)
```

**If NOT running:**
```bash
cd /root/Exotic-cash
npx tsx server/index.ts
```

#### **Step 2: Verify Frontend is Running**

```bash
# Check if frontend is running
lsof -i :5173
```

**Expected Output:**
```
COMMAND  PID  USER FD  TYPE DEVICE SIZE/OFF NODE NAME
node    54321  root  39u IPv6 ...  0t0  TCP *:5173 (LISTEN)
```

**If NOT running:**
```bash
cd /root/Exotic-cash
npm run dev
```

#### **Step 3: Test Backend API**

```bash
# Test health endpoint
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{"message":"Server is running"}
```

#### **Step 4: Test Login Endpoint**

```bash
# Test login with admin credentials
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"admin_id":"Admin112","password":"Admin@112"}'
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "admin_id": "Admin112",
    "role": "admin",
    "full_name": "Administrator",
    "email": "admin@exoticcash.com"
  },
  "message": "Admin login successful"
}
```

---

## 🔴 Common Issues & Fixes

### Issue 1: Port 5000 Already in Use

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Fix:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or kill all node processes
killall node

# Restart backend
cd /root/Exotic-cash
npx tsx server/index.ts
```

---

### Issue 2: Port 5173 Already in Use

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::5173
```

**Fix:**
```bash
# Kill process on port 5173
lsof -i :5173 | grep node | awk '{print $2}' | xargs kill -9

# Restart frontend
cd /root/Exotic-cash
npm run dev
```

---

### Issue 3: Database Connection Error

**Error Message:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Causes & Solutions:**

1. **PostgreSQL not running**
   ```bash
   # Check status
   sudo systemctl status postgresql
   
   # Start if not running
   sudo systemctl start postgresql
   ```

2. **Database doesn't exist**
   ```bash
   # Create database
   sudo -u postgres psql << 'EOF'
   CREATE DATABASE exotic_cash_db;
   EOF
   ```

3. **Users table doesn't exist**
   ```bash
   # Recreate tables
   sudo -u postgres psql exotic_cash_db << 'EOF'
   CREATE TYPE user_role AS ENUM ('admin', 'user');
   
   CREATE TABLE users (
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
   
   CREATE INDEX idx_users_admin_id ON users(admin_id);
   CREATE INDEX idx_users_role ON users(role);
   
   INSERT INTO users (admin_id, password_hash, role, full_name, email) VALUES
   ('Admin112', '$2b$10$qRVRHYu0j.gBmVsyB76wwuffzqLhFp4mm8ewq0lZmaZ9HEr6mNFyu', 'admin', 'Administrator', 'admin@exoticcash.com'),
   ('User001', '$2b$10$Iux02YjVKb2jVrtqKq5kEucfKja83xDxuD1NKruULWI/T1AY3kWeu', 'user', 'John Doe', 'john@exoticcash.com');
   EOF
   ```

---

### Issue 4: Frontend Shows Blank Page

**Causes & Solutions:**

1. **Browser cache issue**
   - Press `Ctrl+Shift+Delete` (Windows/Linux) or `Cmd+Shift+Delete` (Mac)
   - Clear all cache
   - Reload page

2. **Frontend build issue**
   ```bash
   # Rebuild frontend
   cd /root/Exotic-cash
   npm run build
   npm run dev
   ```

3. **Check browser console for errors**
   - Press `F12` to open Developer Tools
   - Go to Console tab
   - Look for red error messages

---

### Issue 5: Login Button Not Working

**Causes & Solutions:**

1. **Backend not responding**
   ```bash
   # Check backend is running
   curl http://localhost:5000/api/health
   ```

2. **CORS issue**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000
   - These should work together

3. **Check Network tab**
   - Press `F12` in browser
   - Go to Network tab
   - Click login button
   - Look for failed requests
   - Check the response for error message

---

### Issue 6: Invalid Credentials

**Make sure you're using correct credentials:**

```
Admin Login:
├─ AdminId: Admin112
└─ Password: Admin@112

User Login:
├─ AdminId: User001
└─ Password: User@123
```

---

### Issue 7: TypeError: Cannot read property 'token'

**Cause:** Login failed, no token returned

**Fix:**
1. Verify backend is running
2. Check database has users
3. Verify credentials are correct
4. Check browser console for specific error

---

## 🚀 Quick Restart Guide

### Complete System Restart

**Terminal 1 - Backend:**
```bash
cd /root/Exotic-cash

# Kill old process if exists
killall node 2>/dev/null

# Start fresh backend
npx tsx server/index.ts
```

**Terminal 2 - Frontend:**
```bash
cd /root/Exotic-cash
npm run dev
```

**Browser:**
```
http://localhost:5173
```

---

## 📋 Verification Checklist

- [ ] Backend running on port 5000
  ```bash
  lsof -i :5000
  ```

- [ ] Frontend running on port 5173
  ```bash
  lsof -i :5173
  ```

- [ ] PostgreSQL running
  ```bash
  sudo systemctl status postgresql
  ```

- [ ] Database exists
  ```bash
  sudo -u postgres psql -l
  ```

- [ ] Users table exists
  ```bash
  sudo -u postgres psql -d exotic_cash_db -c "SELECT * FROM users;"
  ```

- [ ] Backend API responding
  ```bash
  curl http://localhost:5000/api/health
  ```

- [ ] Login endpoint working
  ```bash
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"admin_id":"Admin112","password":"Admin@112"}'
  ```

- [ ] Frontend page loads
  ```
  http://localhost:5173
  ```

---

## 🆘 Emergency Restart

If everything is broken, try this:

```bash
# Kill everything
killall node 2>/dev/null
killall npm 2>/dev/null

# Wait
sleep 2

# Start fresh
cd /root/Exotic-cash

# Terminal 1
npx tsx server/index.ts

# Terminal 2 (new terminal)
npm run dev

# Open browser
# http://localhost:5173
```

---

## 📞 Still Having Issues?

### Gather Debug Info

```bash
# 1. Check port status
lsof -i :5000
lsof -i :5173

# 2. Check PostgreSQL
sudo systemctl status postgresql

# 3. Check database
sudo -u postgres psql -d exotic_cash_db -c "SELECT COUNT(*) FROM users;"

# 4. Check backend logs
# Look at the terminal running: npx tsx server/index.ts

# 5. Check frontend console
# Press F12 in browser → Console tab
```

### Contact Points

- **Backend Server**: http://localhost:5000/api/health
- **Frontend App**: http://localhost:5173
- **Database**: localhost:5432 (exotic_cash_db)

---

## ✅ After Fix Verification

Once fixed, verify with:

```bash
# Test complete flow
1. Open http://localhost:5173 in browser
2. Login with Admin112 / Admin@112
3. Should redirect to Admin Dashboard
4. Check URL is now: http://localhost:5173/admin-dashboard
5. Logout and try User001 / User@123
6. Should redirect to User Dashboard
7. Check URL is now: http://localhost:5173/user-dashboard
```

---

**Problem Solved! 🎉**
