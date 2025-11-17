# Quick Reference Guide - Real-Time Investment System

## Current Status
- ✅ Backend: Running on `http://localhost:5000`
- ✅ Frontend: Built and ready
- ✅ Database: Connected to `exotic_cash_db`
- ✅ API: All 6 investment plans accessible

## Test Credentials

### User Account
```
Username: User001
Password: User@123
Role: User
```

### Admin Account
```
Username: Admin112
Password: Admin@112
Role: Admin
```

## Available Investment Plans

| # | Plan | Min | Max | Daily ROI |
|---|------|-----|-----|-----------|
| 1 | Starter | $100 | $999 | 2.5% |
| 2 | Silver | $1,000 | $4,999 | 3.5% |
| 3 | Gold | $5,000 | $9,999 | 4.5% |
| 4 | Platinum | $10,000 | $49,999 | 5.5% |
| 5 | Diamond | $50,000 | $100,000 | 6.5% |
| 6 | Ultimate | $100,001 | $1M | 7.5% |

## Key API Endpoints

### Public
- `GET /api/investments/plans` → Get all investment plans

### User (Authenticated)
- `GET /api/investments/user-balance` → Check balance
- `POST /api/investments/deposit-request` → Submit deposit
- `GET /api/investments/my-deposits` → View deposits
- `GET /api/investments/notifications` → Get notifications

### Admin (Authenticated + Admin Role)
- `GET /api/investments/pending-requests` → View pending deposits
- `POST /api/investments/approve-deposit` → Approve deposit
- `POST /api/investments/reject-deposit` → Reject deposit

## Component Routes (To Add)

These components need to be integrated into the app routing:

```typescript
// Investment Plans - User views plans
<Route path="/investments/plans" element={<InvestmentPlans />} />

// Deposit History - User's past requests
<Route path="/user/my-deposits" element={<DepositHistory />} />

// Admin Pending Requests
<Route path="/admin/pending-requests" element={<AdminPendingRequests />} />

// Notifications
<Route path="/notifications" element={<NotificationCenter />} />

// UserInvestments (To Create)
<Route path="/user/investments" element={<UserInvestments />} />
```

## Terminal Commands

### Start Backend
```bash
cd /root/Exotic-cash
npx tsx server/index.ts
# Runs on http://localhost:5000
```

### Build Frontend
```bash
cd /root/Exotic-cash
npm run build
# Creates dist/ folder, takes ~4 seconds
```

### Clean Build
```bash
cd /root/Exotic-cash
rm -rf dist .tsbuildinfo
npm run build
```

### Test API Endpoint
```bash
# Get investment plans
curl http://localhost:5000/api/investments/plans | jq .

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"admin_id":"User001","password":"User@123"}' | jq .
```

## Database Operations

### View Users
```bash
psql -U postgres -d exotic_cash_db -c "SELECT id, admin_id, role, full_name FROM users LIMIT 10;"
```

### View Investment Plans
```bash
psql -U postgres -d exotic_cash_db -c "SELECT * FROM investment_plans ORDER BY daily_roi DESC;"
```

### View Deposit Requests
```bash
psql -U postgres -d exotic_cash_db -c "SELECT * FROM deposit_requests ORDER BY requested_at DESC LIMIT 10;"
```

## Workflow Examples

### Example 1: Complete Deposit Request
1. User logs in with User001/User@123
2. Goes to Investment Plans
3. Selects "Starter Plan" (2.5% ROI)
4. Enters $500 deposit
5. Sees preview: Daily return: $12.50, Monthly: $375
6. Clicks "Submit Deposit Request"
7. System creates deposit_requests record
8. Admin notification created
9. User can view in "My Deposits" with status "Pending"

### Example 2: Admin Approval
1. Admin logs in with Admin112/Admin@112
2. Goes to "Pending Requests"
3. Sees User001's $500 deposit
4. Clicks "Review"
5. Adds note: "KYC verified"
6. Clicks "Approve & Process"
7. Database updates with approved_at timestamp
8. User gets notification in notification center
9. User's available balance increases by $500

## Real-Time Update Intervals

- Notifications: **15 seconds**
- Deposit History: **30 seconds**
- Pending Requests: **20 seconds**
- User Balance: On-demand API call

## Files to Create Next

### UserInvestments Component
- Path: `src/pages/UserInvestments.tsx`
- Show active investments with details
- Display daily ROI calculation
- Show total earnings per investment
- Monthly projection
- Investment status and end date
- CSS: `src/styles/UserInvestments.css`

### Dashboard Integration
- Add links in `src/pages/UserDashboard.tsx`
- Add links in `src/pages/AdminDashboard.tsx`
- Update routing in main app file

## Troubleshooting

### Backend not starting?
```bash
# Kill any existing processes
pkill -9 node tsx
# Clean rebuild
rm -rf dist .tsbuildinfo
npm run build
# Start fresh
npx tsx server/index.ts
```

### API returning errors?
```bash
# Check logs
tail -100 /tmp/backend.log

# Verify database connection
psql -U postgres -d exotic_cash_db -c "SELECT 1;"
```

### Frontend not updating?
```bash
# Clear cache and rebuild
rm -rf dist node_modules/.vite
npm run build

# Hard refresh in browser: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
```

## Performance Tips

- API calls use 15-30 second intervals to avoid hammering server
- Frontend components use React's useState for efficient re-renders
- CSS classes use modern features (grid, flexbox)
- Images/icons are emojis (no external files needed)

## Security Notes

- All endpoints protected by JWT token check
- Admin routes verified with verifyAdmin middleware
- User can only access own data (filtered by user_id)
- Passwords hashed with bcryptjs
- Sensitive operations require confirmation dialogs

---

**Last Updated**: November 16, 2025  
**Status**: ✅ Production Ready for Testing
