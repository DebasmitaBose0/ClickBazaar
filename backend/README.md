# 🛠️ ClickBazaar Backend API Server

High-performance Node.js/Express API server for **ClickBazaar** e-commerce platform. Handles authentication, payments, email notifications, AI integration, and order management.

---

## ✨ Core Features

- **🔐 Secure Authentication**: JWT tokens (7-day expiry) with Bcrypt password hashing
- **📧 Email System (3 Features with SVG Icons)**:
  - **Registration OTP**: 6-digit verification codes with mail & clock icons
  - **Password Recovery**: OTP-based password reset with security & unlock icons
  - **Support Tickets**: Admin notifications with user, calendar, clock & check icons
  - All powered by **Gmail SMTP** with professional HTML5 templates
- **🛡️ Duplicate Email Prevention**: Prevents multiple accounts with same email
- **💪 Password Strength Validation**: Enforces 8+ chars, uppercase, lowercase, number, special char
- **📦 SQLite Database**: Fast, reliable local persistence with auto-schema initialization
- **🤖 AI Integration**: Google Gemini & Groq for product descriptions and AI chat
- **📊 Admin Dashboard**: User management, order tracking, audit logs
- **🔍 Audit Logging**: Complete system activity tracking

---

## 🏗️ Tech Stack

- **🚀 Node.js + Express**: Scalable REST API framework
- **🗄️ SQLite**: Embedded relational database
- **🛡️ Bcryptjs**: Industry-standard password security (10 salt rounds)
- **🔑 JWT**: JSON Web Token authentication (7-day expiry)
- **📧 Nodemailer**: Email delivery via Gmail SMTP
- **🧠 Google GenAI SDK**: Product descriptions & AI chat
- **🏎️ Groq SDK**: Ultra-fast AI responses
- **🎯 Helmet.js**: Security headers protection

---

## 📂 File Structure

| File | Purpose |
| ------ | ---------- |
| `index.js` | Main API routes, authentication, products endpoint, business logic |
| `emailServiceSMTP.js` | Gmail SMTP email handler (OTP, password recovery, support) with SVG icons |
| `db.js` | Database initialization with seedDatabase() function (auto-creates products table & inserts 10 items) |
| `support.js` | Support ticket email sender |
| `db.sqlite` | SQLite database file (auto-created on first run) |
| `.env` | Environment variables (API keys, email config, secrets) |
| `package.json` | Dependencies: express, bcryptjs, jsonwebtoken, nodemailer, sqlite |

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Email (Gmail SMTP)

Create `.env` file (or copy from `.env.example`):

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
REPLY_EMAIL=your-email@gmail.com
JWT_SECRET=your-32-char-secret-key
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_KEY=secret-admin-key
GOOGLE_API_KEY=optional-for-AI-features
GROQ_API_KEY=optional-for-AI-features
```

> **Gmail Setup**: [Generate App Password](https://support.google.com/accounts/answer/185833) (requires 2FA)

### 3. Start Server

```bash
npm run dev
# Server runs on http://localhost:4100
# Database auto-created on first run
# Products table auto-seeded with 10 sample items
```

**Auto-Seeding System:**

- On first startup: Creates products table & inserts 10 electronics/fashion items
- No re-seeding on subsequent restarts (idempotent)
- Console logs: `[SEED] Creating products table...` → `[SEED] ✅ Seeded 10 products successfully`

---

## 🌐 API Endpoints Summary

**Product Endpoints:**

- `GET /api/products` - Get all products from database (returns array of 10+ seeded items)

**Auth Endpoints:**

- `POST /api/register/send-otp` - Send signup OTP
- `POST /api/register` - Create account
- `POST /api/login` - User login
- `POST /api/forgot-password` - Send password recovery OTP
- `POST /api/reset-password` - Reset password with OTP

**Protected User Endpoints:**

- `GET /api/users/me` - Get current user
- `GET /api/users/orders` - Get user orders

**Admin Endpoints (Admin-only):**

- `GET /api/admin/users` - List all users
- `GET /api/admin/orders` - List all orders
- `GET /api/admin/audit` - View audit logs

**Support & AI:**

- `POST /api/support/inquiry` - Submit support ticket
- `POST /api/chat` - Chat with AI
- `POST /api/genai/description` - Generate product description

---

## 📧 Email Features

### Feature 1: Registration OTP

- Automatically sent when user signs up
- 6-digit random code
- 10-minute expiration
- User must verify before account activated

### Feature 2: Password Recovery

- User initiates from login page
- OTP sent to registered email
- User verifies + sets new password
- Must have email on file (no SMS backup)

### Feature 3: Support Tickets

- Users submit support inquiries
- Admin receives email notification instantly
- Email includes: user info (with user icon), message section, date & time (with calendar/clock icons)
- Recommended actions shown with green check icons
- Admin can respond via dashboard

---

## 🔐 Security Implementation

| Feature | Implementation |
| --------- | ----------------- |
| **Password Hashing** | Bcryptjs (10 salt rounds) |
| **Session Tokens** | JWT (7-day expiry, HTTP-only) |
| **Password Strength** | 8+ chars, 1 upper, 1 lower, 1 number, 1 special |
| **Email Uniqueness** | Checked before OTP sent |
| **SQL Injection** | Parameterized queries throughout |
| **CORS** | Configured for frontend domain |
| **Security Headers** | Helmet.js protection |
| **Role-Based Access** | Admin vs Customer permissions |

---

## 💾 Database Schema

**Users Table:**

```text
id | email | name | password_hash | role | created_at
```

**OTPs Table:**

```text
id | email | otp | expires_at | created_at
```

**Orders Table:**

```text
id | user_id | items | total | status | created_at
```

**Audit Logs Table:**

```text
id | user_id | action | details | timestamp
```

---

## 🛠️ Development

### Run with Auto-Reload

```bash
npm run dev
# Uses nodemon to restart on file changes
```

### View Logs

```bash
# Email sending logs appear in console
# Database logs show during schema creation
# API request logs show request/response details
```

### Database Management

```bash
# View database (requires sqlite3 CLI)
sqlite3 db.sqlite

# Backup
cp db.sqlite db.sqlite.backup

# Reset (delete and let app recreate)
rm db.sqlite && npm run dev
```

---

## 🔧 Troubleshooting

**Email not sending?**

- Verify Gmail 2FA enabled
- Check EMAIL_USER and EMAIL_PASSWORD in .env
- Confirm app-specific password (not main password)
- Check backend logs for errors

**Port 4100 already in use?**

```bash
# Windows
netstat -ano | findstr :4100
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :4100
kill -9 <PID>
```

**Database locked?**

```bash
# Kill backend, delete db.sqlite, restart
rm db.sqlite
npm run dev
```

---

## 🔗 Related Documentation

- [Root README](../README.md) - Project overview
- [INSTRUCTIONS.md](../INSTRUCTIONS.md) - Complete setup guide
- [ARCHITECTURE.md](../ARCHITECTURE.md) - System design
- [Frontend README](../frontend/README.md) - Frontend details

---

© 2026 ClickBazaar. Developed by [DEBASMITA BOSE](https://github.com/DebasmitaBose0) & [BABIN BID](https://github.com/KGFCH2)

---

### 🔗 Quick Links

[🏠 Back to Root](../README.md) | [📐 Architecture Blueprint](../ARCHITECTURE.md) | [📜 Master Instructions](../INSTRUCTIONS.md)

---

© 2026 CLICK BAZAAR GLOBAL ARCHIVE. DESIGNED BY [DEBASMITA BOSE](https://github.com/DebasmitaBose0) | CONTRIBUTED BY [BABIN BID](https://github.com/KGFCH2). 🏛️✨
