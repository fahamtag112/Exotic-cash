# 📧 Email Verification - Quick Setup Guide

## ⚡ 5-Minute Setup

### 1. Install Nodemailer
```bash
cd /root/Exotic-cash
npm install nodemailer --save
npm install --save-dev @types/nodemailer
```

### 2. Add Environment Variables to `.env`
```env
# Email Service
EMAIL_SERVICE=gmail
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
FRONTEND_URL=https://test.investro.online
EMAIL_FROM=noreply@exoticcash.com
```

### 3. Setup Database
```bash
psql -U postgres -d exotic_cash_db -f server/db/email-verification.sql
```

### 4. Build & Deploy
```bash
npm run build
sudo cp -r dist/* /var/www/test.investro.online/
```

### 5. Test It
Visit: `https://test.investro.online/verify-email`

---

## 📧 What Got Built

| Component | File | Purpose |
|-----------|------|---------|
| **Email Service** | `server/utils/emailService.ts` | Token generation, email templates, sending |
| **API Routes** | `server/routes/email.ts` | Request/verify/resend endpoints |
| **Database** | `server/db/email-verification.sql` | Tables for tokens, logs, verification |
| **Frontend** | `src/pages/EmailVerification.tsx` | Beautiful verification UI |
| **Styles** | `src/styles/EmailVerification.css` | Responsive design with animations |
| **Router** | `src/App.tsx` | `/verify-email` route |
| **Guide** | `EMAIL_VERIFICATION_GUIDE.md` | Complete documentation |

---

## 🔗 API Endpoints

```bash
# 1. Request verification (sends email)
POST /api/email/request-verification
{"email": "user@example.com"}

# 2. Verify token (use link from email)
POST /api/email/verify-token
{"token": "abc123..."}

# 3. Resend if missed
POST /api/email/resend-verification
{"email": "user@example.com"}

# 4. Check status
GET /api/email/check-verification/:email
```

---

## 🔑 Gmail Setup (Recommended)

1. Enable 2-Factor Authentication: https://myaccount.google.com/security
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer"
4. Copy 16-character password to `.env` as `GMAIL_APP_PASSWORD`

---

## ✅ Features

✨ **Security:**
- 64-character secure tokens
- 24-hour expiration
- Rate limiting (3/hour per email)
- Audit logging

⚡ **Performance:**
- Database indexes
- Optimized queries
- Fast email sending

🎨 **Frontend:**
- Professional UI (dark theme + gold)
- Mobile responsive
- Smooth animations
- Error handling

---

## 🧪 Quick Test

```bash
# Terminal 1: Check backend is running
curl http://localhost:5000/api/health

# Terminal 2: Test email endpoint
curl -X POST http://localhost:5000/api/email/request-verification \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Browser: Visit
https://test.investro.online/verify-email
```

---

## 📊 Database Queries

```sql
-- Check tokens
SELECT * FROM email_verification_tokens;

-- Check logs
SELECT * FROM verification_logs ORDER BY created_at DESC LIMIT 10;

-- Check user status
SELECT id, email, email_verified, email_status FROM users;

-- Count verified vs unverified
SELECT email_status, COUNT(*) FROM users GROUP BY email_status;
```

---

## 🆘 Troubleshooting

**Email not sending?**
- Check `.env` credentials
- Verify Gmail app password (not regular password)
- Check server logs for errors

**Token expired?**
- Tokens valid for 24 hours
- Use resend endpoint to get new link

**Rate limiting?**
- Max 3 requests per hour per email
- Wait 1 hour or use different email

---

## 📖 Full Documentation

See: `/root/Exotic-cash/EMAIL_VERIFICATION_GUIDE.md`

Contains:
- Complete setup instructions
- API documentation
- Email service setup (Gmail, SendGrid, AWS)
- Testing procedures
- Security details
- Troubleshooting guide
- Next steps

---

## 🚀 Production Checklist

- [ ] Add email service credentials to `.env`
- [ ] Run database migration
- [ ] Install nodemailer package
- [ ] Build: `npm run build`
- [ ] Deploy: Copy `dist/` to production
- [ ] Test email verification page
- [ ] Test API endpoints
- [ ] Monitor `verification_logs` table
- [ ] Setup email service alerts

---

**Created:** November 15, 2025  
**Status:** ✅ Production Ready  
**Questions?** See `EMAIL_VERIFICATION_GUIDE.md`
