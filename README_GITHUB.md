# Exotic Cash Investment Platform 🚀

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node.js](https://img.shields.io/badge/Node.js-18+-success)
![React](https://img.shields.io/badge/React-18+-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-336791)

A comprehensive **full-stack investment management platform** with real-time earnings tracking, admin approval workflows, and role-based dashboards. Built with React, TypeScript, Express, and PostgreSQL.

## ✨ Features

### 🎯 User Features
- 📊 **Real-time Investment Dashboard** - Track active investments with live earnings
- 💎 **6 Investment Plans** - Starter (2.5% ROI) to Ultimate (7.5% ROI) daily returns
- 💰 **Deposit Management** - Request deposits with automatic admin approval workflow
- 📈 **Earnings Tracking** - View daily earnings, projections, and total returns
- 🔔 **Real-time Notifications** - Get instant updates on approvals and earnings
- 📱 **Responsive Design** - Seamless experience on desktop, tablet, and mobile

### 👨‍💼 Admin Features
- ✅ **Deposit Approval System** - Review and approve/reject user deposit requests
- 👥 **User Management** - View all users, manage accounts, track status
- 💳 **Transaction History** - Complete audit trail of all transactions
- 📊 **Analytics Dashboard** - System-wide statistics and insights
- 🔐 **Security Controls** - Monitor suspicious activities and system health

### 🔒 Security
- ✅ **JWT Authentication** - Secure token-based sessions
- ✅ **Password Hashing** - bcrypt with salting
- ✅ **Role-Based Access Control** - Admin vs User permissions
- ✅ **SQL Injection Prevention** - Parameterized queries
- ✅ **XSS Protection** - Input sanitization
- ✅ **Connection Pooling** - Secure database connections

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool (3.59s build time) |
| **React Router** | Client-side routing |
| **CSS3** | Styling with animations |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | Runtime |
| **Express** | Web framework |
| **TypeScript** | Type safety |
| **PostgreSQL** | Database |
| **JWT** | Authentication |

## 📦 Project Structure

```
exotic-cash/
├── src/                          # React frontend
│   ├── components/              # Reusable components
│   ├── pages/                   # Page components
│   │   ├── InvestmentPlans.tsx
│   │   ├── UserDashboard.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminPendingRequests.tsx
│   │   ├── UserInvestments.tsx
│   │   ├── NotificationCenter.tsx
│   │   └── ...
│   ├── styles/                  # CSS modules
│   ├── services/                # API services
│   ├── context/                 # React context
│   └── App.tsx                  # Main app
│
├── server/                       # Node.js backend
│   ├── routes/
│   │   ├── investments.ts       # Investment API (14+ endpoints)
│   │   ├── auth.ts              # Authentication
│   │   ├── admin.ts             # Admin operations
│   │   └── ...
│   ├── db/
│   │   ├── complete-schema.sql  # Full database schema
│   │   ├── connection.ts        # Connection pooling
│   │   └── ...
│   ├── middleware/              # Auth middleware
│   ├── utils/                   # Helper services
│   └── index.ts                 # Express server
│
├── package.json                  # Dependencies
├── tsconfig.json                # TypeScript config
├── vite.config.ts               # Vite config
└── README.md                    # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

```bash
# 1. Clone repository
git clone https://github.com/yourusername/exotic-cash.git
cd exotic-cash

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your database credentials

# 4. Setup database
npm run setup-db

# 5. Start development servers
npm run dev              # Frontend (http://localhost:5173)
npm run server          # Backend (http://localhost:5000)
```

### Build for Production

```bash
# Build frontend
npm run build

# Build output in /dist/
# Ready for deployment!
```

## 📊 API Documentation

### Authentication
```bash
POST /api/auth/login
POST /api/auth/register
GET /api/auth/profile
```

### Investment Management
```bash
GET /api/investments/plans           # Get all 6 plans
GET /api/investments/my-deposits     # User's deposits
POST /api/investments/request-deposit
GET /api/investments/pending-requests # Admin: pending
POST /api/investments/approve-deposit # Admin: approve
GET /api/investments/my-investments   # User's active investments
GET /api/investments/notifications    # Real-time updates
GET /api/investments/user-balance     # User's balance
```

### Admin Operations
```bash
GET /api/admin/users                 # All users
GET /api/admin/transactions          # All transactions
GET /api/admin/analytics             # System analytics
```

## 🧪 Test Accounts

| Role | Username | Password |
|------|----------|----------|
| User | `User001` | `User@123` |
| Admin | `Admin112` | `Admin@112` |

## 📈 Performance

- **Build Time**: 3.59 seconds
- **Bundle Size**: 185.62 KB (gzipped)
  - JS: 168.90 KB (gzipped)
  - CSS: 16.72 KB (gzipped)
- **API Response Time**: 10-95ms
- **Page Load Time**: ~500ms
- **Database Queries**: < 100ms

## 🌐 Deployment

### Frontend Deployment
```bash
# Build production bundle
npm run build

# Copy dist/ to your web server
sudo cp -r dist/* /var/www/your-domain.com/
```

### Backend Deployment

**Option 1: PM2 (Recommended)**
```bash
pm2 start "npx tsx server/index.ts" --name "exotic-cash-api"
pm2 save && pm2 startup
```

**Option 2: Systemd Service**
```bash
sudo systemctl start exotic-cash
sudo systemctl enable exotic-cash
```

**Option 3: Docker**
```bash
docker run -d -p 5000:5000 exotic-cash-api
```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## 📚 Documentation

- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Complete deployment guide
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [API_QUICK_REFERENCE.md](./API_QUICK_REFERENCE.md) - API endpoints
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Development setup

## 🔄 Real-time Features

The platform includes real-time updates for:
- ✅ Deposit approvals
- ✅ Investment earnings
- ✅ Balance updates
- ✅ Notifications
- ✅ System alerts

Polling interval: 10-30 seconds (configurable)

## 🐛 Known Issues

None currently. Please report any issues in the [Issues](https://github.com/yourusername/exotic-cash/issues) tab.

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Exotic Cash Development Team**

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: dev@exotic-cash.com

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite for blazing fast builds
- PostgreSQL for reliable data storage
- Express.js for minimal web framework

## 📞 Support

For support, email support@exotic-cash.com or create an [issue](https://github.com/yourusername/exotic-cash/issues).

---

**⭐ If you find this project useful, please star it!**

Made with ❤️ by Exotic Cash Team
