# 🚀 API Quick Reference Guide

## System Status
- ✅ **Build:** Clean (3.40s)
- ✅ **Backend:** Running on port 5000
- ✅ **Database:** Connected
- ✅ **All APIs:** Working

---

## 🔐 Login

```bash
# User Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"admin_id":"User001","password":"User@123"}'

# Admin Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"admin_id":"Admin112","password":"Admin@112"}'
```

**Response:** `{ "token": "jwt_token", "user": {...} }`

---

## 💰 Investment Endpoints

### Get All Plans
```bash
curl http://localhost:5000/api/investments/plans
```

### Get User Balance (Protected)
```bash
TOKEN="your_jwt_token"
curl http://localhost:5000/api/investments/user-balance \
  -H "Authorization: Bearer $TOKEN"
```

### Request Deposit (Protected)
```bash
TOKEN="your_jwt_token"
curl -X POST http://localhost:5000/api/investments/deposit-request \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":500,"paymentMethod":"Bank Transfer"}'
```

### Get My Deposits (Protected)
```bash
TOKEN="your_jwt_token"
curl http://localhost:5000/api/investments/my-deposits \
  -H "Authorization: Bearer $TOKEN"
```

### Create Investment (Protected)
```bash
TOKEN="your_jwt_token"
curl -X POST http://localhost:5000/api/investments/invest \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"planId":1,"amount":100}'
```

### Get My Investments (Protected)
```bash
TOKEN="your_jwt_token"
curl http://localhost:5000/api/investments/my-investments \
  -H "Authorization: Bearer $TOKEN"
```

### Get Notifications (Protected)
```bash
TOKEN="your_jwt_token"
curl http://localhost:5000/api/investments/notifications \
  -H "Authorization: Bearer $TOKEN"
```

---

## ⚙️ Admin Endpoints

### Get Pending Requests (Admin Only)
```bash
ADMIN_TOKEN="admin_jwt_token"
curl http://localhost:5000/api/investments/pending-requests \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Approve Deposit (Admin Only)
```bash
ADMIN_TOKEN="admin_jwt_token"
curl -X POST http://localhost:5000/api/investments/approve-deposit \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"depositId":1}'
```

---

## 🏥 Health Check

```bash
# System Health
curl http://localhost:5000/api/health

# Connection Pool Status
curl http://localhost:5000/api/pool-status
```

---

## 📊 Investment Plans

| ID | Plan | Min | Max | Daily ROI |
|----|------|-----|-----|-----------|
| 1 | Starter | $100 | $999 | 2.5% |
| 2 | Silver | $1,000 | $4,999 | 3.5% |
| 3 | Gold | $5,000 | $9,999 | 4.5% |
| 4 | Platinum | $10,000 | $49,999 | 5.5% |
| 5 | Diamond | $50,000 | $100,000 | 6.5% |
| 6 | Ultimate | $100,001 | $1,000,000 | 7.5% |

---

## 👥 Test Accounts

**User Account:**
- ID: `User001`
- Password: `User@123`
- Role: `user`

**Admin Account:**
- ID: `Admin112`
- Password: `Admin@112`
- Role: `admin`

---

## 🔄 Complete Workflow

1. **Login** → Get JWT token
2. **View Plans** → GET /api/investments/plans
3. **Check Balance** → GET /api/investments/user-balance
4. **Request Deposit** → POST /api/investments/deposit-request
5. **[Admin] Approve** → POST /api/investments/approve-deposit
6. **Check Notifications** → GET /api/investments/notifications
7. **Verify Balance** → GET /api/investments/user-balance
8. **Create Investment** → POST /api/investments/invest
9. **View Investments** → GET /api/investments/my-investments
10. **Track Earnings** → GET /api/investments/daily-returns

---

## 📈 Response Examples

### Investment Plans Response
```json
{
  "success": true,
  "plans": [
    {
      "id": 6,
      "name": "Ultimate Plan",
      "min_amount": "100001.00",
      "max_amount": "1000000.00",
      "daily_roi": "7.50",
      "description": "Maximum returns..."
    }
  ]
}
```

### User Balance Response
```json
{
  "success": true,
  "balance": {
    "user_id": 2,
    "total_deposit": "0.00",
    "available_balance": "0.00",
    "invested_amount": "0.00",
    "total_earnings": "0.00"
  }
}
```

### Health Check Response
```json
{
  "success": true,
  "status": "healthy",
  "database": "connected",
  "pool": {
    "total_connections": 1,
    "idle_connections": 1,
    "waiting_queries": 0
  }
}
```

---

## 🔐 HTTP Status Codes

- `200` - Success
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error
- `503` - Service Unavailable (database down)

---

## 🛠️ Troubleshooting

**Issue:** 503 Service Unavailable
- **Cause:** Database connection issue
- **Fix:** Check database status, restart backend

**Issue:** 401 Unauthorized
- **Cause:** Missing or invalid JWT token
- **Fix:** Login again to get fresh token

**Issue:** 403 Forbidden
- **Cause:** Trying to access admin endpoint with user role
- **Fix:** Login with admin credentials

**Issue:** 400 Bad Request
- **Cause:** Invalid input data
- **Fix:** Check request body format and values

---

## 📞 Support

For detailed information, see:
- `/SYSTEM_API_VERIFICATION.md` - Complete verification report
- `/ARCHITECTURE.md` - System architecture
- `/SETUP_GUIDE.md` - Setup instructions

---

**Last Updated:** November 17, 2025  
**Status:** ✅ Production Ready
