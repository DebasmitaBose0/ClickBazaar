# 🗺️ ClickBazaar User Guide

Welcome to **ClickBazaar** - A secure, easy-to-use e-commerce platform for shopping and managing orders.

---

## 🚀 Getting Started

### ⚙️ Setup (First Time)

1. **Install All Dependencies**

   ```bash
   npm run install-all
   ```

2. **Configure Backend**

   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your Gmail app password
   ```

3. **Start the Application**

   **Option A: One Command (Easiest - Monorepo)**

   ```bash
   npm run dev
   # Runs both frontend and backend simultaneously
   ```

   **Option B: Separate Terminals**

   Terminal 1 (Backend):

   ```bash
   cd backend
   npm run dev
   ```

   Terminal 2 (Frontend):

   ```bash
   cd frontend
   npm run dev
   ```

4. **Open Your Browser**

   - Frontend: <http://localhost:5173>  
   - Backend: <http://localhost:4100>
   - **Database**: Auto-created at `backend/db.sqlite` with 35 seeded products across 7 categories
   - **Products**: Frontend fetches from `/api/products` endpoint

---

## 👤 User Features

### 📝 Create Account (Sign Up)

1. Click **"Sign Up"** button
2. Enter your **Full Name**
3. Enter your **Email Address** (must be unique)
4. Create a **Secure Password** (must have):
   - At least 8 characters
   - 1 uppercase letter (A-Z)
   - 1 lowercase letter (a-z)
   - 1 number (0-9)
   - 1 special character (@$!%*?&)
5. Click **"Send Verification Code"**
6. Check your email for the **6-digit code**
7. Enter the code in the app
8. ✅ Account created! You're logged in.

**Important:** If you try to sign up with an email that's already registered, you'll see a message to **Log In instead**.

### 🔓 Log In

1. Click **"Log In"** button
2. Enter your **Email**
3. Enter your **Password**
4. Click **"Sign In"**
5. ✅ Logged in successfully

### 🔑 Forgot Password

1. On the login page, click **"Forgot Password?"**
2. Enter your **Email Address**
3. Click **"Send Reset Code"**
4. Check your email for the **recovery code**
5. Enter the code back in the app
6. Enter your **new password** (same strength requirements)
7. Click **"Reset Password"**
8. ✅ Password updated! Log in with new password

### 👤 Update Profile

1. Click on your **name/avatar** (top right)
2. Click **"Edit Profile"**
3. Update your information
4. Click **"Save Changes"**
5. ✅ Profile updated

---

## 🛒 Shopping Features

### 🏪 Browse Products

1. Go to **Shop** section
2. View all available items
3. Click on any item to see details
4. Read the **AI-generated description** (written by AI)
5. See **AI recommendations** for similar items

### ❤️ Save to Wishlist

1. Click the **heart icon** on any product
2. Product saved to your **Wishlist**
3. View wishlist from your profile

### 🛒 Add to Cart

1. Click **"Add to Cart"** button
2. Select **quantity** if needed
3. ✅ Added to cart
4. Click **cart icon** to view items
5. Review and adjust quantities
6. Click **"Place Order"** to checkout

### 📦 Place Order

1. Click **cart icon** (top right)
2. Review items and quantities
3. Click **"Place Order"**
4. ✅ Order placed!
5. View your order in **Orders** section

### 📋 View Orders

1. Click on your **name/avatar** (top right)
2. Click **"My Orders"**
3. See all your orders with:
   - Order ID
   - Items purchased
   - Order date
   - Current status (Pending / Processing / Shipped / Delivered)

---

## 💬 Get Help

### 📞 Chat with ClickBot

1. Click **"Help"** or the **chat icon**
2. Ask any question about:
   - How to shop
   - Product information
   - Order status
   - General help
3. **ClickBot** (AI Assistant) will respond instantly
4. AI is trained to help you shop

### 📧 Send Support Ticket

1. Click **"Help"** → **"Support"**
2. Fill in your information:
   - **Name**
   - **Email**
   - **Message**
3. Click **"Send Message"**
4. ✅ Message sent!
5. Admin will respond to your email

---

## 👨‍💼 Admin Features

### 🔑 Admin Login

**Admin Email:** `dbose272@gmail.com`  
**Admin Key:** `DEBBIN27`

1. Click **"Log In"**
2. Check the **"Admin"** checkbox
3. Enter **Admin Email**
4. Enter your **Admin Key**
5. Enter **Password**
6. ✅ Logged in as Admin

### 📊 Admin Dashboard

1. After logging in as admin, click **"Admin Dashboard"**
2. See overview of:
   - All users on platform
   - All orders placed
   - System activity logs
   - Active user sessions

### 👥 Manage Users

1. Go to **Admin Dashboard** → **Users**
2. View all registered users
3. See user details:
   - Name
   - Email
   - Account creation date
   - User type (Customer/Admin)
4. Click on user to change their role

### 📦 Manage Orders

1. Go to **Admin Dashboard** → **Orders**
2. View all orders from all customers
3. See order details:
   - Customer name
   - Items ordered
   - Order total
   - Current status
4. Click order to update status:
   - Pending → Processing
   - Processing → Shipped
   - Shipped → Delivered

### 📁 View Audit Logs

1. Go to **Admin Dashboard** → **Audit Logs**
2. See all changes:
   - User login times
   - Order placements
   - Admin role changes
   - When changes were made

### 💻 Monitor Sessions

1. Go to **Admin Dashboard** → **Active Sessions**
2. See who's currently logged in
3. See when they logged in

---

## 🔐 Security Tips

✅ **DO:**  

- Use strong passwords with mixed characters
- Keep your password private
- Log out on shared computers
- Check your email for suspicious activity
- Use "Forgot Password" if you think someone knows your password

❌ **DON'T:**  

- Share your password with anyone
- Use the same password on other websites
- Write your password in emails or messages
- Log in on unsecured WiFi for sensitive actions
- Leave your browser open on shared devices

---

## ⚙️ Environment Variables (For Development)

**Backend `.env` file:**

```env
# Server Config
PORT=4100
NODE_ENV=development

# Security
JWT_SECRET=your-secret-key
ADMIN_EMAIL=dbose272@gmail.com
ADMIN_KEY=DEBBIN27

# AI Services (Optional, for ChatBot)
GOOGLE_API_KEY=your-google-api-key
GROQ_API_KEY=your-groq-api-key

# Email (Gmail SMTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
REPLY_EMAIL=your-email@gmail.com
```

**How to get Gmail App Password:**

1. Go to <https://myaccount.google.com/apppasswords>
2. Select "Mail" and "Windows Computer"
3. Copy the 16-character password
4. Paste into `.env` as `EMAIL_PASSWORD`

---

## 🎨 Using the Platform

### 📱 Mobile

- All features work on phones and tablets
- Touches work instead of clicks
- Notifications appear in center of screen

### 💻 Desktop

- Full interface with all options visible
- Keyboard shortcuts available
- Larger product images

### 🌓 Theme

- Auto-detects your device's dark/light mode
- Works in both light and dark themes

---

## ❓ FAQ

**Q: What if I forget my password?**  
A: Click "Forgot Password?" on login page. You'll get an email with a reset code.

**Q: Can two people use the same email?**  
A: No, each email is unique. If you try to sign up with an existing email, you'll be told to log in instead.

**Q: How long do OTP codes last?**  
A: 10 minutes. If it expires, you can request a new one.

**Q: Can I delete my account?**  
A: Currently, you can't self-delete. Contact admin support for account removal.

**Q: How do I become an admin?**  
A: Only existing admins can create new admin accounts. Contact the platform owner.

**Q: Is my password encrypted?**  
A: Yes! Passwords are encrypted using industry-standard Bcrypt before being stored.

---

### 🔗 Quick Links

[🏠 Back to README](./README.md) | [📐 Architecture](./ARCHITECTURE.md) | [📜 Instructions](./INSTRUCTIONS.md) | [⚖️ License](./LICENSE)

---

© 2026 ClickBazaar. Made simple, made secure.

Access the advanced command dashboard with these authenticated credentials:

- **Email**: `your_admin_email_here`
- **Pass**: `your_admin_key_here` (Supply as 'Admin Key' during registration/login)

For support-related inquiries, contact the archival node at:

- **📧 Support Email**: `your_support_email_here`
- **📞 Direct Phone**: `your_phone_number_here`

---

**ClickBazaar: 2026 Global Archive**  
Designed by [DEBASMITA BOSE](https://github.com/DebasmitaBose0) | Contributed by [BABIN BID](https://github.com/KGFCH2)  
*Built for visual excellence, archival integrity, and modular scale.* 🏛️✨
