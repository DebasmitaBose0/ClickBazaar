# 🎨 ClickBazaar Frontend

Modern React + TypeScript frontend for **ClickBazaar** e-commerce platform. Features secure authentication, responsive design, AI-powered chat assistant, and beautiful UX.

---

## ✨ Key Features

### 🛍️ Shopping Experience

- **Product Catalog** - Browse 10+ auto-seeded products fetched from backend API
- **API-Driven** - Products loaded from `http://localhost:4100/api/products` on app startup
- **Fallback Support** - If backend offline, uses hardcoded INITIAL_PRODUCTS
- **Shopping Cart** - Add/remove items, persistent storage via localStorage
- **Wishlist** - Save favorites for later, persistent across sessions (user-specific keys)
- **Order Management** - View orders, track status, order history
- **Search & Filter** - Find products easily

### 🔐 Authentication & Security

- **Secure Sign Up** - OTP verification via email (prevents duplicates)
- **Smart Login** - JWT token authentication
- **Strong Passwords** - 8+ chars, uppercase, lowercase, number, special char required
- **Password Recovery** - Reset via email OTP
- **Session Management** - Auto-logout on inactivity

### 📧 Email Features with Icons

- **Registration OTP** - 6-digit code with mail icon & clock icon (10-min expiry)
- **Password Recovery** - Reset forgot passwords with security icon & unlock icon
- **Support Tickets** - Send inquiries, admin gets notified with user, date/time, message & check icons

### 🤖 AI Assistant

- **ClickBot Chat** - Real-time AI shopping assistant
- **Smart Responses** - Powered by Google Gemini & Groq
- **Product Info** - Ask questions about items, orders, shipping

### 👨‍💼 Admin Dashboard

- **User Management** - View/edit all users, change roles
- **Order Management** - Update order statuses, track all orders
- **Audit Logs** - View system activity & changes
- **Session Monitoring** - See active user sessions

### 🎨 Modern UI/UX

- **Responsive Design** - Mobile, tablet, desktop optimized
- **Simple Language** - No jargon, easy to understand
- **Dark/Light Theme** - Adapts to device settings
- **Smooth Animations** - Framer Motion transitions, scrolling effects
- **Toast Notifications** - Bottom-left positioned on mobile, bottom-right on desktop, click-outside to dismiss
- **Mobile-Optimized** - Center content, responsive gaps, better touch targets

---

## 🏗️ Tech Stack

| Technology | Purpose |
| ----------- | --------- |
| **React 19** | Component framework |
| **TypeScript** | Type safety & better DX |
| **Vite** | Fast build tool + dev server |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Smooth animations |
| **Lucide Icons** | Premium icon set |
| **Recharts** | Data visualization |
| **Axios** | HTTP client for API calls |

---

## 📂 Project Structure

| File/Folder | Purpose |
| ------------- | ---------- |
| `App.tsx` | Main component with useEffect to fetch products from backend API on mount |
| `services/api.ts` | API client that fetches products from `/api/products` endpoint |
| `types.ts` | TypeScript type definitions |
| `constants.tsx` | Product catalog & static data (fallback INITIAL_PRODUCTS) |
| `index.css` | Global styles |
| `vite.config.ts` | Build configuration |
| `public/` | Static assets, images |

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Proxy

The `vite.config.ts` already proxies API calls to `http://localhost:4100`

### 3. Start Development Server

```bash
npm run dev
# Frontend runs on http://localhost:5173
# Automatically proxies /api calls to backend
```

### 4. Build for Production

```bash
npm run build
# Creates optimized build in /dist folder
```

---

## 🔐 Authentication Flow

```text
User Signs Up
    ↓
Enter email → Check if duplicate (NO = proceed, YES = show error)
    ↓
Send OTP to email
    ↓
User enters 6-digit code
    ↓
Create account with strong password
    ↓
Login & receive JWT token (7 days)
    ↓
Access protected pages (Profile, Orders, Admin)
```

---

## 🛍️ User Pages

### Home

- Product catalog with AI-generated descriptions
- Category filters
- Wishlist management
- Featured products

### Shopping Cart

- View cart items
- Add/remove/adjust quantities
- Shipping progress bar (free at ₹50,000)
- Order summary

### Checkout

- Shipping address form
- Payment method selection:
  - Cash on Delivery (COD)
  - UPI
  - Net Banking
- Order confirmation

### Profile

- View account info
- Order history
- Settings & preferences
- Logout

### Support

- Send support tickets
- AI chat assistant
- FAQ section
- Contact info

### Admin Dashboard (Admin-only)

- User management
- Order management
- Audit logs
- Session monitoring

---

## 🔍 Component Highlights

### Password Validation (Frontend)

```text
Requirements: 8+ characters
✓ At least 1 uppercase letter
✓ At least 1 lowercase letter
✓ At least 1 number
✓ At least 1 special character (@$!%*?&)
```

Shows real-time validation feedback during signup & password reset.

### Duplicate Email Prevention

```text
User tries to signup with existing email
    ↓
Frontend validates
    ↓
Backend also validates
    ↓
Error: "Email already registered. Please Log In instead"
```

### Shopping Progress Bar

- Tracks order value toward free shipping threshold (₹50,000)
- Visual indicator with smooth animation
- Shows remaining amount needed

### Notifications

- **Mobile**: Centered messages (bottom-middle)
- **Desktop**: Lower-right corner
- Auto-dismiss after 3-4 seconds
- Success, error, and info variants

---

## 🎨 Styling

**Tailwind CSS** with custom configuration:

- Blue color scheme (#0066CC primary)
- Amber/orange accents
- Responsive breakpoints (mobile-first)
- Custom animations (fadeIn, slideUp, etc.)
- Rounded corners (rounded-3xl for large, rounded-xl for buttons)

---

## 🔗 API Integration

All API calls go through `services/api.ts`:

```typescript
// Examples
await apiClient.post('/api/register/send-otp', { email })
await apiClient.post('/api/register', { email, password, otp })
await apiClient.post('/api/login', { email, password })
await apiClient.post('/api/support/inquiry', { message })
await apiClient.post('/api/chat', { message }) // AI chat
```

---

## 🛠️ Development Tips

### Hot Module Reload

Vite enables instant updates without page reload during development.

### TypeScript Checking

```bash
# Check types
npx tsc --noEmit
```

### Console Debugging

- Open DevTools (F12)
- Check Console for API responses
- Check Network tab for failed requests

### API Proxy Issues?

- Verify backend running on `http://localhost:4100`
- Check `vite.config.ts` proxy configuration
- Restart dev server if backend restarted

---

## 📱 Responsive Breakpoints

| Screen | Size | Optimized For |
| -------- | ------ | --------------- |
| Mobile | <640px | Phones (single column) |
| Tablet | 640-1024px | Tablets (2 columns) |
| Desktop | >1024px | Large screens (3+ columns) |

---

## 🔗 Related Documentation

- [Backend README](../backend/README.md) - API server details
- [INSTRUCTIONS.md](../INSTRUCTIONS.md) - Full setup guide
- [ARCHITECTURE.md](../ARCHITECTURE.md) - System design
- [Root README](../README.md) - Project overview

---

© 2026 ClickBazaar. Developed by [DEBASMITA BOSE](https://github.com/DebasmitaBose0) & [BABIN BID](https://github.com/KGFCH2)
> For full functionality (API & Auth), ensure the **Backend** is also running (use `npm run dev` from the project root).

---

### 🔗 Quick Links

[🏠 Back to Root](../README.md) | [📐 Architecture Blueprint](../ARCHITECTURE.md) | [📜 Master Instructions](../INSTRUCTIONS.md)

---

© 2026 CLICK BAZAAR GLOBAL ARCHIVE. DESIGNED BY [DEBASMITA BOSE](https://github.com/DebasmitaBose0) | CONTRIBUTED BY [BABIN BID](https://github.com/KGFCH2). 🏛️✨
