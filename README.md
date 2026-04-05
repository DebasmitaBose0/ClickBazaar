# 🛍️ ClickBazaar (v1.2.0 - 2026)

**ClickBazaar** is a premium, full-stack e-commerce application designed for seamless shopping. It combines a modern React-based frontend with a robust Node.js/SQLite backend, featuring AI-powered shopping assistance (**ClickBot**).

---

## 🚀 Key Features

### 🛒 E-Commerce Core

- **Shopping Cart & Wishlist** - Add items, save favorites, persistent storage across sessions
- **Order Management** - Place orders, track status, view order history
- **Product Catalog** - Browse 35 seeded products across 7 categories (fetched from backend API)
- **Auto-Seeding** - Database automatically creates and seeds 35 products across 7 categories on first run
- **API-Driven** - Frontend fetches products from `/api/products` endpoint with fallback support

### 🔐 Security & Authentication

- **Smart Sign Up** - OTP-verified registration via Gmail (prevents duplicate accounts)
- **Secure Login** - JWT token-based authentication (7-day expiring tokens)
- **Strong Passwords** - 8+ chars, uppercase, lowercase, number, special character required
- **Role-Based Access** - Admin & Customer tiers with different permissions
- **Bcrypt Hashing** - Industry-standard password encryption

### 📧 Email System (3 Features with Icons)

- **Registration OTP** - 6-digit code sent to verify new accounts (Mail icon + Clock icon)
- **Password Recovery** - Reset forgotten passwords with email verification (Security icon + Unlock icon)
- **Support Tickets** - Send support messages, admin gets email notifications (User icon + Calendar/Clock icons + Check icons)
- All emails powered by **Gmail SMTP** with professional HTML5 templates and inline SVG icons

### 💬 AI Chat Assistant

- **ClickBot** - Real-time AI chat for shopping help
- **Smart Responses** - Powered by Google Gemini or Groq
- **Product Info** - Ask questions about items, orders, shipping

### 👨‍💼 Admin Dashboard

- **User Management** - View all users, change roles
- **Order Management** - Update statuses, track all orders
- **Audit Logs** - View system activity and changes
- **Session Monitoring** - See active user sessions

### 🎨 Modern UI/UX

- **Mobile-Friendly** - Responsive design for phones, tablets, desktop
- **Simple Language** - No technical jargon, easy to understand
- **Smooth Animations** - Framer Motion transitions, Lenis smooth scrolling
- **Dark/Light Theme** - Adapts to device settings
- **Centered Notifications** - Clear messages in the middle of screen (mobile)

---

## ⚙️ Technology Stack

| Layer | Technology |
| ------- | ----------- |
| **Frontend** | React, TypeScript, Tailwind CSS, Vite |
| **Backend** | Node.js, Express.js |
| **Database** | SQLite3 |
| **Authentication** | JWT, Bcryptjs |
| **Email** | Gmail SMTP (Nodemailer) |
| **AI** | Google Gemini, Groq |
| **Security** | Helmet.js, CORS |

---

## 🔧 Getting Started

### 1. Prerequisites

- Node.js (v18+)
- npm or yarn

### 2. Setup Environment

```bash
# Backend Configuration
cd backend
cp .env.example .env
# Edit .env and add your Gmail app password
```

### 3. Install & Run (Single Command)

```bash
# From root directory - Install all dependencies
npm run install-all

# Start both frontend and backend simultaneously
npm run dev
```

**Or Run Separately:**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173`

**Database & Products:**

- SQLite database auto-created at `backend/db.sqlite` (first run only)
- 10 sample products auto-seeded on first backend startup
- Frontend fetches products from `http://localhost:4100/api/products`

---

## 📋 API Endpoints

**Authentication**  

- `POST /api/register/send-otp` - Send registration OTP
- `POST /api/register` - Complete registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `POST /api/forgot-password` - Password recovery
- `POST /api/reset-password` - Set new password

**User**  

- `GET /api/me` - Get current user profile
- `PUT /api/profile` - Update profile
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order

**Admin** (Admin only)

- `GET /api/admin/users` - List all users
- `GET /api/admin/orders` - List all orders
- `POST /api/admin/users/:id/role` - Change user role
- `GET /api/admin/audit` - View audit logs

**Support**  

- `POST /api/support/inquiry` - Send support message

**AI**  

- `POST /api/chat` - Chat with ClickBot
- `POST /api/genai/description` - Generate product descriptions
- `POST /api/genai/recommendations` - Get recommendations

---

## 🔑 Environment Variables

```env
# Server
PORT=4100
NODE_ENV=development

# Security
JWT_SECRET=your-secret-key
ADMIN_EMAIL=dbose272@gmail.com
ADMIN_KEY=DEBBIN27

# AI Services
GOOGLE_API_KEY=your-google-api-key
GROQ_API_KEY=your-groq-api-key

# Email (Gmail SMTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
REPLY_EMAIL=your-email@gmail.com
```

**Note:** Get Gmail App Password from [Google Account Settings](https://myaccount.google.com/apppasswords)

---

## 📖 Documentation

- [📐 Architecture](./ARCHITECTURE.md) - System design and data flow
- [📜 Instructions](./INSTRUCTIONS.md) - Detailed setup guide
- [🗺️ User Guide](./USER_GUIDE.md) - How to use the app

---

## 🛡️ Security Features

✅ OTP email verification for signup  
✅ Strong password enforcement  
✅ Duplicate email prevention  
✅ JWT token authentication  
✅ Bcrypt password hashing  
✅ Role-based access control  
✅ Admin-only endpoints  
✅ Helmet security headers  
✅ CORS protection  
✅ Session tracking & audit logs  

---

© 2026 ClickBazaar. Built with ❤️ by developers who care about security.
