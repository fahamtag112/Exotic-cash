# 🚀 Exotic Cash - Complete Setup Guide

## System Overview

This is a **Role-Based Authentication System** that automatically detects user credentials and routes them to appropriate dashboards:
- **Admin Credentials** → Admin Dashboard
- **User Credentials** → User Dashboard

## ✅ What's Already Setup

### ✓ Database
- PostgreSQL database `exotic_cash_db` created
- `users` table with admin/user roles
- Test users already inserted with bcrypt hashed passwords
- Indexes created for fast lookups

### ✓ Backend Server
- Express.js API running on port 5000
- Authentication endpoints implemented
- JWT token generation and verification
- CORS enabled for frontend communication

### ✓ Frontend Application
- React + TypeScript + Vite
- Login page with credential input
- Admin Dashboard with stats and controls
- User Dashboard with account features
- Role-based routing implemented
- Beautiful purple color scheme

## 📍 Running the Application

### Prerequisites Check
```bash
# Verify Node.js
node --version  # Should be 16+

# Verify npm
npm --version

# Verify PostgreSQL
sudo -u postgres psql -c "SELECT 1;"
```

### Start Backend (Terminal 1)
```bash
cd /root/Exotic-cash
npx tsx server/index.ts
```

You should see:
```
🚀 Server is running on http://localhost:5000
📊 Database: exotic_cash_db
```

### Start Frontend (Terminal 2)
```bash
cd /root/Exotic-cash
npm run dev
```

You should see:
```
VITE v7.2.2  ready in 276 ms
➜  Local:   http://localhost:5173/
```

### Open Browser
Navigate to: http://localhost:5173

## 🔐 Login Credentials

### Admin Account
```
AdminId: Admin112
Password: Admin@112
```
**Automatically routes to → Admin Dashboard**

### User Account
```
AdminId: User001
Password: User@123
```
**Automatically routes to → User Dashboard**

## 🎯 Complete Authentication Flow

```
1. User visits http://localhost:5173
   ↓
2. Sees Login page with form
   ↓
3. Enters AdminId and Password
   ↓
4. Frontend sends POST to http://localhost:5000/api/auth/login
   ↓
5. Backend queries PostgreSQL users table
   ↓
6. Verifies password with bcrypt
   ↓
7. Detects user role (admin or user)
   ↓
8. Generates JWT token
   ↓
9. Returns token + user info to frontend
   ↓
10. Frontend stores token and user in localStorage
   ↓
11. System detects role and redirects:
    - If admin → /admin-dashboard
    - If user → /user-dashboard
   ↓
12. Dashboard page verifies role access
   ↓
13. Shows appropriate dashboard interface
```

## 📊 Admin Dashboard Features

When logging in with Admin credentials:

```
🎛️ Admin Dashboard
├── 📊 Overview Section
│   ├── Total Users: 1250
│   ├── Transactions: 8456
│   ├── Total Revenue: $125,450
│   └── Active Users: 892
├── 👥 Navigation Sidebar
│   ├── Dashboard
│   ├── Users Management
│   ├── Transactions
│   ├── Settings
│   ├── Analytics
│   └── Security
└── 📋 Recent Activities Table
    └── User actions, timestamps, status
```

## 💰 User Dashboard Features

When logging in with User credentials:

```
💰 My Dashboard
├── 💳 Account Balance Card
│   ├── Balance: $5,240.50
│   ├── Last Transaction: 2 hours ago
│   └── Action Buttons: Deposit, Withdraw, Transfer
├── 📊 Account Overview
│   ├── Total Transactions: 145
│   ├── Account Age: 2 years
│   ├── Status: Active
│   └── Verification: ✓ Verified
├── 📋 Recent Transactions
│   └── Transaction history with amounts
└── 💾 Sidebar
    ├── Account Information
    └── Security Tips
```

## 🛠️ Technology Details

### Backend Stack
- **Express.js**: REST API server
- **TypeScript**: Type-safe code
- **PostgreSQL**: Relational database
- **bcryptjs**: Password hashing (10 rounds)
- **jsonwebtoken**: JWT token creation
- **CORS**: Enable cross-origin requests

### Frontend Stack
- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Fast build tool
- **React Router**: Page navigation
- **CSS3**: Beautiful purple theme

### Database Schema
```sql
users table:
├── id (PRIMARY KEY)
├── admin_id (UNIQUE)
├── password_hash
├── role (admin | user)
├── full_name
├── email
├── created_at
├── updated_at
└── is_active

Indexes:
├── idx_users_admin_id
└── idx_users_role
```

## 🔑 API Reference

### Login Endpoint
```
POST /api/auth/login
Content-Type: application/json

Request:
{
  "admin_id": "Admin112",
  "password": "Admin@112"
}

Response (Success):
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

Response (Failure):
{
  "message": "Invalid credentials"
}
```

### Register Endpoint
```
POST /api/auth/register
Content-Type: application/json

Request:
{
  "admin_id": "NewUser",
  "password": "Password@123",
  "full_name": "New User",
  "email": "newuser@example.com",
  "role": "user"
}
```

### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>
```

## 🎨 Design Elements

### Color Palette
```
Primary Purple: #6d28d9
Secondary Purple: #a855f7
Accent Purple: #d946ef
Light Background: #f5f3ff to #faf5ff
```

### UI Components
- Login form with validation
- Gradient buttons with hover effects
- Responsive grid layouts
- Data tables with sorting
- Statistics cards
- Navigation sidebars
- Authentication guards

## 🐛 Troubleshooting

### Issue: Backend won't start
```bash
# Solution 1: Check if port 5000 is in use
lsof -i :5000

# Solution 2: Kill process on port 5000
kill -9 $(lsof -t -i :5000)

# Solution 3: Verify database connection
sudo -u postgres psql -d exotic_cash_db -c "SELECT * FROM users;"
```

### Issue: Frontend shows blank page
```bash
# Solution: Clear browser cache and refresh
# Ctrl+Shift+Delete (Windows/Linux)
# Cmd+Shift+Delete (Mac)
```

### Issue: "Connection error" on login
```bash
# Ensure backend is running on port 5000
curl http://localhost:5000/api/health

# If not responding:
cd /root/Exotic-cash
npx tsx server/index.ts
```

### Issue: PostgreSQL password error
```bash
# If you need to reset postgres user password:
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'newpassword';"

# Then update .env file with new password
```

## 📝 File Locations

```
/root/Exotic-cash/
├── .env                    ← Environment variables
├── server/index.ts         ← Backend entry point
├── src/App.tsx            ← Frontend router
├── src/pages/Login.tsx    ← Login page
├── src/pages/AdminDashboard.tsx
├── src/pages/UserDashboard.tsx
└── README.md              ← Full documentation
```

## ✨ Next Steps (Optional Enhancements)

1. **Add more users via API**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"admin_id":"NewUser","password":"Pass@123","full_name":"New User","email":"new@example.com","role":"user"}'
   ```

2. **Add more features to dashboards**
   - Real data integration
   - Chart.js for graphs
   - More admin controls
   - User profile editing

3. **Deploy to production**
   - Set environment variables properly
   - Use strong JWT_SECRET
   - Enable HTTPS
   - Setup reverse proxy (Nginx)

## 📞 Support

For issues or questions:
1. Check the README.md
2. Review API endpoint documentation
3. Check browser console for errors
4. Check server logs for issues

---

## ✅ Verification Checklist

- [x] PostgreSQL database created
- [x] Users table with test data
- [x] Backend server running on port 5000
- [x] Frontend server running on port 5173
- [x] Login page accessible
- [x] Admin credentials work
- [x] User credentials work
- [x] Admin dashboard shows correctly
- [x] User dashboard shows correctly
- [x] Logout functionality works
- [x] Role-based routing works
- [x] JWT authentication implemented
- [x] Password hashing with bcrypt
- [x] API endpoints documented
- [x] CSS styling with purple theme

**All systems operational! 🚀**
