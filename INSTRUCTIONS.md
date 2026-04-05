# 📋 ClickBazaar Setup & Maintenance Guide

Complete instructions for setup, configuration, deployment, and maintenance of ClickBazaar e-commerce platform.

---

## ⚡ Quick Start (5 Minutes)

### Prerequisites

- Node.js 16+ and npm
- Gmail account with app-specific password
- (Optional) Google Gemini API key + Groq API key for AI features

### Run Everything (Monorepo Single Command)

```bash
# From root directory
npm run install-all  # Installs all frontend & backend dependencies
npm run dev          # Runs both frontend and backend concurrently
```

Then:

- **Frontend**: Open <http://localhost:5173>
- **Backend**: Running on <http://localhost:4100>
- **Database**: Auto-created at `backend/db.sqlite` with 35 seeded products across 7 categories
- **Products API**: Available at <http://localhost:4100/api/products>

---

## 📂 Project Structure

```text
ClickBazaar/
├── backend/                 # Node.js/Express API server
│   ├── index.js            # Main API routes & auth
│   ├── emailServiceSMTP.js # Gmail SMTP service (OTP, recovery, support)
│   ├── db.js               # SQLite database initialization
│   ├── support.js          # Email handler for support tickets
│   └── .env                # Environment secrets (not in git)
│
├── frontend/               # React + TypeScript + Tailwind UI
│   ├── App.tsx             # Main component (all pages/logic)
│   ├── services/api.ts     # Backend API client
│   ├── types.ts            # TypeScript interfaces
│   ├── vite.config.ts      # Build configuration
│   └── index.tsx           # App entry point
│
├── README.md               # Feature overview
├── ARCHITECTURE.md         # System design & flows
├── USER_GUIDE.md          # User-facing instructions
├── INSTRUCTIONS.md        # This setup guide
└── package.json           # Root workspace config
```

---

## 🔧 Detailed Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Email (Gmail SMTP)

#### Step A: Generate Gmail App Password

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Factor Authentication
3. Go to App passwords (appears after 2FA is enabled)
4. Select "Mail" and "Windows Computer" (or your device)
5. Copy the 16-character password
6. Remove spaces: `oeaz woqg mrvj xhqe` → `oeazwoqgmrvjxhqe`

#### Step B: Create `.env` file

```bash
# backend/.env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password (16 chars, no spaces)
REPLY_EMAIL=your-email@gmail.com
JWT_SECRET=generate-strong-secret-32-chars
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_KEY=secret-admin-verification-key
GOOGLE_API_KEY=optional-google-gemini-api-key
GROQ_API_KEY=optional-groq-api-key
```

#### Step C: Generate Secrets (optional)

```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# or use openssl
openssl rand -hex 32
```

### 3. Run Backend

```bash
npm run dev
# Server runs on http://localhost:4100
# Database: backend/db.sqlite auto-created on first run
- Products: 35 products across 7 categories auto-seeded on first backend startup
```

**Database Tables Auto-Created:**

- `users` - User accounts with password hashes
- `otps` - One-time passwords (6-digit, 10-min expiry)
- `orders` - Shopping cart + completed orders
- `audit_logs` - Admin actions log
- `products` - Electronic & fashion products (10 items auto-seeded)
- `sessions` - Active user sessions

**Auto-Seeding System:**

- On first backend startup, the system checks if products table exists
- If not, creates the products table and inserts 10 sample products
- Subsequent restarts do not re-seed (idempotent operation)
- Seeding logs appear in console: `[SEED] Creating products table...` etc.

---

## 🎨 Frontend Setup

### 1. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 2. Run Development Server

```bash
npm run dev
# App runs on http://localhost:5173
# Proxies API calls to backend on port 4100
```

---

## 🔐 Security Configuration Checklist

- [ ] Generate strong `JWT_SECRET` (min 32 chars)
- [ ] Change `ADMIN_KEY` to unique value
- [ ] Use Gmail app password (never main password)
- [ ] Never commit `.env` to git (add to `.gitignore`)
- [ ] Set password requirements: 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
- [ ] Enable HTTPS in production
- [ ] Set strong CORS origins (not `*`)
- [ ] Rate limit login attempts
- [ ] Implement database backups
- [ ] Monitor audit logs monthly
- [ ] Rotate API keys quarterly
- [ ] Review user permissions weekly
- [ ] Update dependencies monthly
- [ ] Enable SQL injection protection (parameterized queries - already done)
- [ ] Validate all user inputs on backend

---

## 📧 Email Features

### Feature 1: Registration OTP

- Sent when user initiates signup
- 6-digit random code
- Expires in 10 minutes
- User must verify before account created

### Feature 2: Password Recovery

- User enters email on login page
- System sends 6-digit OTP
- User verifies OTP and sets new password
- Email required for recovery (no SMS backup)

### Feature 3: Support Ticket Notification

- User submits support inquiry from chat
- Admin receives email notification
- Includes user info, message, timestamp
- Admin responds via email or dashboard

**All emails sent from**: `your-email@gmail.com` (configured in `.env`)

---

## 🌐 API Endpoints Reference

### Product Endpoints

| Method | Endpoint | Purpose |
| ------ | -------- | ------- |
| GET | `/api/products` | Get all products (auto-seeded on first run) |

### Authentication Endpoints

| Method | Endpoint | Purpose |
| ------ | -------- | ------- |
| POST | `/api/register/send-otp` | Send registration OTP |
| POST | `/api/register` | Create account |
| POST | `/api/login` | User login |
| POST | `/api/logout` | User logout |
| POST | `/api/forgot-password` | Send recovery OTP |
| POST | `/api/verify-otp` | Verify OTP code |
| POST | `/api/reset-password` | Reset password with OTP |

### User Endpoints (Protected)

| Method | Endpoint | Purpose |
| ------ | -------- | ------- |
| GET | `/api/users/me` | Get current user |
| PUT | `/api/users/profile` | Update profile |
| GET | `/api/users/orders` | Get user orders |

### Admin Endpoints (Protected + Admin-only)

| Method | Endpoint | Purpose |
| ------ | -------- | ------- |
| GET | `/api/admin/users` | List all users |
| PUT | `/api/admin/users/:id` | Edit user |
| DELETE | `/api/admin/users/:id` | Delete user |
| GET | `/api/admin/orders` | List all orders |
| GET | `/api/admin/audit` | View audit logs |
| GET | `/api/admin/sessions` | View active sessions |

### Support Endpoint

| Method | Endpoint | Purpose |
| ------ | -------- | ------- |
| POST | `/api/support/inquiry` | Submit support ticket |

### AI Endpoints

| Method | Endpoint | Purpose |
| ------ | -------- | ------- |
| POST | `/api/chat` | Chat with AI |
| POST | `/api/genai/description` | Generate product description |
| POST | `/api/genai/recommendations` | Get AI recommendations |

---

## 💾 Database Management

### View Database

```bash
# Install SQLite CLI
# Windows: choco install sqlite
# Mac: brew install sqlite3
# Linux: sudo apt install sqlite3

cd backend
sqlite3 db.sqlite

# View tables
.tables

# View users
SELECT id, email, role, created_at FROM users;

# View orders
SELECT * FROM orders;

# Exit
.quit
```

### Backup Database

```bash
# Backup
cp backend/db.sqlite backend/backups/db-$(date +%Y%m%d-%H%M%S).sqlite

# Restore
cp backend/backups/db-YYYYMMDD-HHMMSS.sqlite backend/db.sqlite
```

### Reset Database

```bash
# Delete and let app recreate
rm backend/db.sqlite

# Restart backend - tables auto-created
npm run dev
```

### Migrate to PostgreSQL (Production)

```bash
# Install PostgreSQL
# Windows: https://www.postgresql.org/download/windows/
# Mac: brew install postgresql
# Linux: sudo apt install postgresql

# Create database
createdb clickbazaar

# Update backend package.json
npm install pg

# Update backend/db.js connection string:
const connectionString = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/clickbazaar';
// ... adjust query syntax for PostgreSQL
```

---

## 🛠️ Development Workflow

### Run Both Services (Recommended)

```bash
# From root directory
npm run dev
# Both backend and frontend start in parallel
```

### Run Separately (Troubleshooting)

#### Terminal 1: Backend

```bash
cd backend
npm run dev
```

#### Terminal 2: Frontend

```bash
cd frontend
npm run dev
```

### Build for Production

```bash
# From root
npm run build-all

# Frontend: Creates /frontend/dist/
# Backend: Ready to run with Node.js
```

---

## 🔍 Troubleshooting

### Problem: "Email not sending"

#### Solution

1. Verify Gmail app password (16 chars, no spaces)
2. Check `.env` file has correct EMAIL_USER and EMAIL_PASSWORD
3. Ensure 2FA enabled on Google account
4. Check backend logs: `npm run dev` shows errors
5. Test manually: `curl -X POST http://localhost:4100/api/register/send-otp -d "..."`

### Problem: "Port 4100 already in use"

**Solution:**

```bash
# Linux/Mac - Find and kill process
lsof -i :4100
kill -9 <PID>

# Windows - Find and kill process
netstat -ano | findstr :4100
taskkill /PID <PID> /F
```

### Problem: "TypeScript errors in frontend"

**Solution:**

```bash
cd frontend
npm run dev
# Vite will show type errors
# Fix in App.tsx based on error messages
```

### Problem: "Database locked"

**Solution:**

```bash
# Kill backend process and restart
# If stuck, delete db.sqlite and restart
rm backend/db.sqlite
cd backend
npm run dev
```

### Problem: "CORS errors when calling backend"

1. Check backend is running on <http://localhost:4100>
2. Check frontend vite.config.ts has proxy configured
3. Verify backend index.js has cors enabled
4. Browser console should show actual CORS error message

---

## 📊 Maintenance Tasks

### Weekly

- [ ] Review audit logs: `/api/admin/audit`
- [ ] Check for failed logins/brute force attempts
- [ ] Verify email sending is working
- [ ] Monitor server logs

### Monthly

- [ ] Backup database: `cp db.sqlite backups/`
- [ ] Review user accounts
- [ ] Check disk space on server
- [ ] Test password recovery workflow
- [ ] Review support tickets

### Quarterly

- [ ] Rotate API keys (Google, Groq)
- [ ] Update npm dependencies: `npm update`
- [ ] Review security settings
- [ ] Test full deployment backup/restore

### Annually

- [ ] Review code for vulnerabilities
- [ ] Update Node.js version
- [ ] Migrate to new database if needed
- [ ] Conduct security audit

---

## 📞 Support & Contact

- **Issues**: Check [GitHub Issues](https://github.com/DebasmitaBose0/ClickBazaar/issues)
- **Email**: <dbose272@gmail.com>
- **Documentation**: See [USER_GUIDE.md](./USER_GUIDE.md) and [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 🔗 Quick Links

[🏠 Back to README](./README.md) | [📐 View Architecture](./ARCHITECTURE.md) | [🗺️ Master User Guide](./USER_GUIDE.md) | [⚖️ License](./LICENSE)

---

© 2026 ClickBazaar. Developed with ❤️ by [DEBASMITA BOSE](https://github.com/DebasmitaBose0) & [BABIN BID](https://github.com/KGFCH2)
