# 🎛️ Exotic Cash - Role-Based Authentication System

A full-stack TypeScript application featuring a cross-system with role-based credential detection and automatic dashboard routing.

## 🌟 Features

### Authentication System
- **Smart Credential Detection**: Automatically detects admin vs user credentials
- **JWT Token-based Authentication**: Secure token generation and validation
- **Role-Based Access Control**: Admin and User roles with separate dashboards
- **PostgreSQL Integration**: Secure credential storage with bcrypt hashing

### Admin Dashboard
- 📊 System statistics and overview
- 👥 User management
- 💳 Transaction monitoring
- 📈 Analytics and reporting
- 🔐 Security controls

### User Dashboard
- 💰 Account balance display
- 📋 Transaction history
- 💸 Money transfer options
- ⚙️ Account settings
- 🔒 Security tips

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **React Router** for navigation
- **CSS3** with Purple gradient theme

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **PostgreSQL** for data persistence
- **bcryptjs** for password hashing
- **JWT** for authentication

## 📋 Prerequisites

- Node.js 16+ and npm
- PostgreSQL 12+
- Git

## 🚀 Quick Start

### 1. Database Setup

```bash
# Create database and insert test users
sudo -u postgres psql << 'EOF'
CREATE DATABASE exotic_cash_db;
EOF

sudo -u postgres psql exotic_cash_db << 'EOF'
-- Create ENUM type for user roles
CREATE TYPE user_role AS ENUM ('admin', 'user');

-- Create users table
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

-- Create indexes
CREATE INDEX idx_users_admin_id ON users(admin_id);
CREATE INDEX idx_users_role ON users(role);

-- Insert sample data
INSERT INTO users (admin_id, password_hash, role, full_name, email) VALUES
('Admin112', '$2b$10$qRVRHYu0j.gBmVsyB76wwuffzqLhFp4mm8ewq0lZmaZ9HEr6mNFyu', 'admin', 'Administrator', 'admin@exoticcash.com'),
('User001', '$2b$10$Iux02YjVKb2jVrtqKq5kEucfKja83xDxuD1NKruULWI/T1AY3kWeu', 'user', 'John Doe', 'john@exoticcash.com');
EOF
```

### 2. Start Backend Server (Terminal 1)

```bash
cd /root/Exotic-cash
npx tsx server/index.ts
```

Expected output:
```
🚀 Server is running on http://localhost:5000
📊 Database: exotic_cash_db
```

### 3. Start Frontend Server (Terminal 2)

```bash
cd /root/Exotic-cash
npm run dev
```

Expected output:
```
VITE v7.2.2  ready in 276 ms
➜  Local:   http://localhost:5173/
```

### 4. Access Application

Open your browser and navigate to:
```
http://localhost:5173
```

## 🔑 Test Credentials

### Admin Account
- **AdminId**: `Admin112`
- **Password**: `Admin@112`
- **Role**: Admin
- **Dashboard**: Admin Dashboard with full system controls

### User Account
- **AdminId**: `User001`
- **Password**: `User@123`
- **Role**: User
- **Dashboard**: User Dashboard with personal finance features

## 📁 Project Structure

```
/root/Exotic-cash/
├── server/                      # Backend Express server
│   ├── index.ts                # Main server entry point
│   ├── db/
│   │   └── connection.ts       # PostgreSQL connection
│   ├── routes/
│   │   └── auth.ts             # Authentication endpoints
│   └── middleware/
│       └── auth.ts             # JWT verification middleware
├── src/                         # Frontend React app
│   ├── pages/
│   │   ├── Login.tsx           # Login/Register page
│   │   ├── Index.tsx           # Home page
│   │   ├── AdminDashboard.tsx  # Admin dashboard
│   │   └── UserDashboard.tsx   # User dashboard
│   ├── styles/
│   │   ├── Login.css
│   │   ├── Index.css
│   │   ├── AdminDashboard.css
│   │   └── UserDashboard.css
│   └── App.tsx                 # Main app with routing
├── .env                         # Environment variables
├── package.json                # Dependencies
└── tsconfig.json              # TypeScript configuration
```

## 🔌 API Endpoints

### Authentication

#### Login (POST /api/auth/login)
```json
{
  "admin_id": "Admin112",
  "password": "Admin@112"
}
```

Response:
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

## 🎨 Color Scheme

The application uses a beautiful purple gradient theme:
- **Primary Purple**: `#6d28d9`
- **Secondary Purple**: `#a855f7`
- **Accent Purple**: `#d946ef`

## 🔐 Security Features

✅ **Bcrypt Password Hashing**: Passwords hashed with 10 rounds  
✅ **JWT Authentication**: Secure token-based sessions  
✅ **Role-Based Access Control**: Different permissions per role  
✅ **CORS Protection**: Cross-origin request handling  
✅ **Input Validation**: Server-side validation  

## 🧪 Authentication Flow

1. User enters AdminId and Password on login page
2. Frontend sends credentials to backend `/api/auth/login`
3. Backend verifies credentials against PostgreSQL
4. Backend detects user role (admin or user)
5. Backend returns JWT token and user info
6. Frontend stores token and user data in localStorage
7. Frontend redirects to appropriate dashboard based on role
8. Dashboard pages verify role before rendering

## 📝 Environment Variables

```env
PORT=5000
NODE_ENV=development

DB_USER=postgres
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=5432
DB_NAME=exotic_cash_db

JWT_SECRET=your-secret-key-change-in-production-12345
```

## 🐛 Troubleshooting

### Backend won't start
```bash
lsof -i :5000  # Check if port 5000 is in use
sudo systemctl status postgresql  # Check PostgreSQL status
```

### Frontend won't compile
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Database connection error
```bash
sudo -u postgres psql -l  # List all databases
```

---

**Happy Coding! 🚀**
