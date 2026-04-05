// Load environment variables FIRST (before any other imports)
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the backend directory
dotenv.config({ path: path.join(__dirname, '.env') });

console.log(`[ENV] Loaded .env from: ${path.join(__dirname, '.env')}`);

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { GoogleGenAI } from '@google/genai';
import { Groq } from 'groq-sdk';
import helmet from 'helmet';
import { getDb } from './db.js';
import supportRouter from './support.js';
import { sendRegistrationOTP, sendPasswordRecoveryOTP, initEmailService } from './emailServiceSMTP.js';

// Reinitialize email service NOW that dotenv.config() has run
initEmailService();

const DEFAULT_LOGO = "https://cdn-icons-png.flaticon.com/128/3649/3649531.png"; // Fallback URL if local fails in email
const BRAND_LOGO = "/Favicon.png"; // Relative for frontend, intended to be base/Favicon.png in emails if possible.

// Use a non-conflicting default port (4100)
const PORT = process.env.PORT || 4100;
const JWT_SECRET = process.env.JWT_SECRET || 'click-bazaar-secret';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const genai = GOOGLE_API_KEY ? new GoogleGenAI({ apiKey: GOOGLE_API_KEY }) : null;
const groq = GROQ_API_KEY ? new Groq({ apiKey: GROQ_API_KEY }) : null;

// OTP Storage (In-memory for archival simulation)
const otpStore = new Map(); // email -> { code, expires }
const regOtpStore = new Map(); // email -> { code, expires }


const SYSTEM_PROMPT = `You are ClickBot, the AI Assistant for ClickBazaar. 
Your tone is professional, helpful, and friendly. 
Always use simple and easy English. Avoid technical words like 'Archival', 'Infrastructure', 'Logistics Node', or 'Telemetry'. 
Use simple terms like 'Order', 'Shipping', 'Customer', 'Account', and 'Purchase'.
The current year is 2026. 
You assist users with shopping, tracking orders, and general inquiries.
Keep responses short and very easy to understand.
If you can't answer a question, tell the user to email support at dbose272@gmail.com.
Do not say you are an AI from Google or Groq; you are the ClickBazaar AI assistant.`;

const app = express();

app.use(helmet({
  contentSecurityPolicy: false, // For easier dev proxy
}));
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use('/api/support', supportRouter);

// --- Predefined Admin Seeding Protocol ---
const initializeAdmin = async () => {
  const db = await getDb();
  const adminEmail = (process.env.ADMIN_EMAIL || 'dbose272@gmail.com').toLowerCase();
  const adminPass = process.env.ADMIN_PASS || 'DEBBIN27';
  const hash = await bcrypt.hash(adminPass, 10);

  const existing = await db.get('SELECT * FROM users WHERE email = ?', adminEmail);
  if (!existing) {
    await db.run(
      'INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)',
      'Global Admin',
      adminEmail,
      hash,
      'admin',
      Date.now()
    );
    console.log('[ARCHIVE] Admin account ready.');
  } else if (existing.role !== 'admin' || !(await bcrypt.compare(adminPass, existing.password_hash))) {
    // Synchronize existing node with established credentials
    await db.run(
      'UPDATE users SET password_hash = ?, role = ? WHERE email = ?',
      hash,
      'admin',
      adminEmail
    );
    console.log('[ARCHIVE] Admin account updated.');
  }
};
initializeAdmin();

const createToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
};

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Missing auth token' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    console.warn('[AUTH ERROR] JWT Verification Failed:', err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'System Online', time: Date.now() });
});

// Test endpoint to verify email service
app.post('/api/health/test-email', async (req, res) => {
  const { testEmail } = req.body;
  if (!testEmail) {
    return res.status(400).json({ message: 'testEmail parameter required' });
  }

  console.log(`[TEST_EMAIL] Testing email service for: ${testEmail}`);
  try {
    const result = await sendRegistrationOTP(testEmail, 'Test User', '123456');
    console.log(`[TEST_EMAIL] Result:`, result);
    res.json({
      success: true,
      message: 'Test email sent!',
      details: result,
      checkLogs: 'Check the server console for detailed logs'
    });
  } catch (err) {
    console.error('[TEST_EMAIL_ERROR]', err);
    res.status(500).json({
      success: false,
      message: 'Test email failed!',
      error: err.message,
      code: err.code
    });
  }
});

// Email diagnostics endpoint
app.get('/api/health/email-diagnostics', (req, res) => {
  const diag = {
    timestamp: new Date().toISOString(),
    emailService: 'SMTP (Gmail)',
    environment: {
      EMAIL_USER: process.env.EMAIL_USER || 'dbose272@gmail.com',
      EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? '✅ SET' : '❌ NOT SET',
      ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'dbose272@gmail.com',
      NODE_ENV: process.env.NODE_ENV || 'not set'
    },
    suggestion: process.env.EMAIL_PASSWORD
      ? '✅ SMTP email service is configured and ready'
      : '⚠️  EMAIL_PASSWORD is missing! Add to .env file for email functionality'
  };
  res.json(diag);
});

// Get all products from database
app.get('/api/products', async (req, res) => {
  try {
    const db = await getDb();
    const products = await db.all('SELECT * FROM products');

    if (!products || products.length === 0) {
      console.log('[PRODUCTS] No products found in database');
      return res.json([]);
    }

    // Parse images field from JSON string to array
    const parsedProducts = products.map(product => {
      try {
        const images = typeof product.image === 'string' && product.image.startsWith('[')
          ? JSON.parse(product.image)
          : [product.image];
        return { ...product, images, image: images[0] };
      } catch (e) {
        return { ...product, images: [product.image] };
      }
    });

    console.log(`[PRODUCTS] Retrieved ${products.length} products from database`);
    res.json(parsedProducts);
  } catch (err) {
    console.error('[PRODUCTS_ERROR]', err);
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
});

app.post('/api/register/send-otp', async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) return res.status(400).json({ message: 'Missing email or name' });

  // Update: Allow any user to sign up, but admin is special
  const adminEmail = process.env.ADMIN_EMAIL || 'dbose272@gmail.com';

  // ✅ Check if email is already registered BEFORE sending OTP
  const db = await getDb();
  const existing = await db.get('SELECT id FROM users WHERE email = ?', email.toLowerCase());
  if (existing) {
    return res.status(409).json({ message: 'Email already registered. Please Log In instead.' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 10 * 60 * 1000;
  regOtpStore.set(email.toLowerCase(), { otp, expires });

  console.log(`[SIGNUP] Sending OTP to ${email}`);
  console.log(`[SIGNUP] OTP: ${otp} (expires in 10 minutes)`);

  try {
    const result = await sendRegistrationOTP(email, name, otp);
    console.log(`[SIGNUP] ✅ OTP sent successfully to ${email}`);
    console.log(`[SIGNUP] Result:`, result);
    res.json({
      message: 'Verification code sent',
      success: true,
      email: email
    });
  } catch (err) {
    console.error('[SIGNUP_ERROR] Failed to send registration OTP:', err.message);
    console.error('[SIGNUP_ERROR] Full error:', err);
    // Still return success for UX, but log the error for debugging
    console.warn('[SIGNUP_FALLBACK] Returning success response despite email error');
    res.json({
      message: 'Verification code sent',
      success: true,
      email: email,
      note: 'Email service encountered an issue - check server logs'
    });
  }
});

app.post('/api/register', async (req, res) => {
  let { name, email, password, adminKey, otp } = req.body;
  if (!name || !email || !password || !otp) {
    return res.status(400).json({ message: 'Missing required fields or verification code' });
  }
  email = email.toLowerCase().trim();

  // ✅ Validate password strength BEFORE processing
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: 'Password too weak. Must have: 8+ characters, uppercase letter, lowercase letter, number, and special character (@$!%*?&)'
    });
  }

  // Verify OTP
  const stored = regOtpStore.get(email);
  if (!stored || String(stored.otp) !== String(otp) || Date.now() > stored.expires) {
    return res.status(401).json({ message: 'Invalid or expired confirmation code' });
  }

  const db = await getDb();
  const existing = await db.get('SELECT * FROM users WHERE email = ?', email);
  if (existing) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const isAdminEmail = email === (process.env.ADMIN_EMAIL || 'dbose272@gmail.com');
  if (isAdminEmail) {
    const expected = process.env.ADMIN_KEY || 'DEBBIN27';
    if (adminKey !== expected) {
      return res.status(403).json({ message: 'Invalid admin key' });
    }
  }

  const password_hash = await bcrypt.hash(password, 10);
  const now = Date.now();
  const role = isAdminEmail ? 'admin' : 'customer';

  const result = await db.run(
    'INSERT INTO users (name, email, password_hash, role, membership_tier, created_at, wishlist, cart) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    name,
    email,
    password_hash,
    role,
    'None',
    now,
    '[]',
    '[]'
  );

  const user = { id: result.lastID, name: name, email: email, role, membership_tier: 'None', wishlist: [], cart: [] };
  const token = createToken(user);

  regOtpStore.delete(email); // Clean up

  await db.run(
    'INSERT INTO sessions (user_id, ip, user_agent, success, created_at) VALUES (?, ?, ?, ?, ?)',
    user.id,
    req.ip,
    req.headers['user-agent'] || '',
    1,
    now
  );

  res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
  res.json({ user });
});

app.post('/api/login', async (req, res) => {
  let { email, password, adminKey } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });
  email = email.toLowerCase().trim();

  // Update: Any user can attempt to login, but system restricts based on role
  const db = await getDb();
  const user = await db.get('SELECT * FROM users WHERE email = ?', email.toLowerCase());
  if (!user) {
    // ✅ SECURITY: Return generic "Invalid credentials" to prevent user enumeration
    // Don't reveal whether email exists or not
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if (user.role === 'admin') {
    const expected = process.env.ADMIN_KEY || 'DEBBIN27';
    if (adminKey !== expected) {
      await db.run(
        'INSERT INTO sessions (user_id, ip, user_agent, success, created_at) VALUES (?, ?, ?, ?, ?)',
        user.id,
        req.ip,
        req.headers['user-agent'] || '',
        0,
        Date.now()
      );
      return res.status(401).json({ message: 'Invalid admin key' });
    }
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    await db.run(
      'INSERT INTO sessions (user_id, ip, user_agent, success, created_at) VALUES (?, ?, ?, ?, ?)',
      user.id,
      req.ip,
      req.headers['user-agent'] || '',
      0,
      Date.now()
    );
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = createToken(user);
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });

  const now = Date.now();
  await db.run(
    'INSERT INTO sessions (user_id, ip, user_agent, success, created_at) VALUES (?, ?, ?, ?, ?)',
    user.id,
    req.ip,
    req.headers['user-agent'] || '',
    1,
    now
  );

  await db.run(
    'INSERT INTO audit_logs (user_id, action, details, created_at) VALUES (?, ?, ?, ?)',
    user.id,
    'login',
    JSON.stringify({ success: true, ip: req.ip }),
    now
  );

  res.json({
    user: {
      id: user.id || user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      membership_tier: user.membership_tier,
      wishlist: Array.isArray(user.wishlist) ? user.wishlist : JSON.parse(user.wishlist || '[]'),
      cart: Array.isArray(user.cart) ? user.cart : JSON.parse(user.cart || '[]')
    }
  });
});

app.put('/api/sync', authMiddleware, async (req, res) => {
  const { wishlist, cart } = req.body;
  if (wishlist === undefined && cart === undefined) return res.status(400).json({ message: 'Missing sync payload' });

  if (!req.user || !req.user.id) {
    console.error('[SYNC ERROR] Missing user identity in sync request.');
    return res.status(401).json({ message: 'Unauthorized sync attempt' });
  }

  try {
    const db = await getDb();
    if (wishlist !== undefined) {
      await db.run('UPDATE users SET wishlist = ? WHERE id = ?', JSON.stringify(wishlist), req.user.id);
      console.log(`[WISHLIST SYNC] Updated wishlist for user ${req.user.id}:`, wishlist);
    }
    if (cart !== undefined) {
      await db.run('UPDATE users SET cart = ? WHERE id = ?', JSON.stringify(cart), req.user.id);
    }
    res.json({ success: true, message: 'Identity nodes synchronized with cloud archive.' });
  } catch (err) {
    console.error('[SYNC ERROR] Archival update failed:', err);
    res.status(500).json({ message: 'Synchronization protocol failed.', error: err.message });
  }
});

app.post('/api/chat', async (req, res) => {
  const { message, history = [] } = req.body;
  if (!message) return res.status(400).json({ message: 'Missing message node' });

  try {
    let responseText = '';

    if (groq) {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...history.map(m => ({ role: m.type === 'q' ? 'user' : 'assistant', content: m.text })),
          { role: 'user', content: message }
        ],
        model: 'llama-3.3-70b-versatile',
      });
      responseText = completion.choices[0]?.message?.content || "Archive node timeout. Please retry.";
    } else if (genai) {
      const model = genai.getGenerativeModel({ model: "gemini-1.5-flash" });
      const chat = model.startChat({
        history: [
          { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
          { role: 'model', parts: [{ text: "Acknowledged. ClickBot online. System ready for archival inquiry." }] },
          ...history.map(m => ({
            role: m.type === 'q' ? 'user' : 'model',
            parts: [{ text: m.text }]
          }))
        ]
      });
      const result = await chat.sendMessage(message);
      responseText = result.response.text();
    } else {
      responseText = "AI Archival Engine offline. (Please provide GROQ_API_KEY or GOOGLE_API_KEY in server environment to activate).";
    }

    res.json({ text: responseText });
  } catch (err) {
    console.error('Chat archival error:', err);
    res.status(500).json({ message: 'Logical node failure in AI engine.' });
  }
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
});

// --- Password Recovery Protocols ---

app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Missing email identity' });

  const db = await getDb();
  const user = await db.get('SELECT id FROM users WHERE email = ?', email.toLowerCase());

  // Only send password reset code to registered emails
  if (!user) {
    return res.status(404).json({ message: 'No account found with this email address. Please check your email or sign up for a new account.' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 10 * 60 * 1000;
  otpStore.set(email.toLowerCase(), { otp, expires });

  try {
    await sendPasswordRecoveryOTP(email, otp);
    res.json({ message: 'Password reset code sent to your email. Please check your inbox.' });
  } catch (err) {
    console.error('[RECOVERY_ERROR] Failed to send recovery OTP:', err);
    res.status(500).json({ message: 'Failed to send password reset email. Please try again later.' });
  }
});

app.post('/api/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const stored = otpStore.get(email?.toLowerCase());

  if (!stored || String(stored.otp) !== String(otp) || Date.now() > stored.expires) {
    return res.status(401).json({ message: 'Invalid or expired OTP sequence' });
  }

  res.json({ success: true, message: 'Code verified' });
});

app.post('/api/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const stored = otpStore.get(email?.toLowerCase());

  if (!stored || String(stored.otp) !== String(otp) || Date.now() > stored.expires) {
    return res.status(401).json({ message: 'Invalid verification code' });
  }

  // ✅ Validate new password strength
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      message: 'Password too weak. Must have: 8+ characters, uppercase letter, lowercase letter, number, and special character (@$!%*?&)'
    });
  }

  const db = await getDb();
  const password_hash = await bcrypt.hash(newPassword, 10);
  await db.run('UPDATE users SET password_hash = ? WHERE email = ?', password_hash, email.toLowerCase());

  otpStore.delete(email.toLowerCase());

  const user = await db.get('SELECT id FROM users WHERE email = ?', email.toLowerCase());
  if (user) {
    await db.run(
      'INSERT INTO audit_logs (user_id, action, details, created_at) VALUES (?, ?, ?, ?)',
      user.id,
      'password_reset',
      JSON.stringify({ email: email.toLowerCase() }),
      Date.now()
    );
  }

  res.json({ success: true, message: 'Security password re-initialized' });
});

app.put('/api/profile', authMiddleware, async (req, res) => {
  let { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: 'Missing identity fields' });
  }
  email = email.toLowerCase().trim();

  try {
    const db = await getDb();

    // Check if new email is taken by another user
    if (email.toLowerCase() !== req.user.email.toLowerCase()) {
      const existing = await db.get('SELECT id FROM users WHERE email = ?', email.toLowerCase());
      if (existing) {
        return res.status(409).json({ message: 'Email sequence already in use' });
      }
    }

    await db.run(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      name,
      email.toLowerCase(),
      req.user.id
    );

    const user = await db.get('SELECT id, name, email, role FROM users WHERE id = ?', req.user.id);

    // Log audit
    await db.run(
      'INSERT INTO audit_logs (user_id, action, details, created_at) VALUES (?, ?, ?, ?)',
      user.id,
      'profile_update',
      JSON.stringify({ name, email }),
      Date.now()
    );

    res.json({ user });
  } catch (error) {
    console.error('API /api/profile error:', error);
    res.status(500).json({ message: 'Identity reconfiguration failed', error: error.message });
  }
});

app.get('/api/me', authMiddleware, async (req, res) => {
  try {
    const db = await getDb();
    const user = await db.get('SELECT id, name, email, role, membership_tier, wishlist, cart FROM users WHERE id = ?', req.user.id);
    if (!user) return res.status(404).json({ message: 'Identity not found' });

    res.json({
      user: {
        ...user,
        wishlist: Array.isArray(user.wishlist) ? user.wishlist : JSON.parse(user.wishlist || '[]'),
        cart: Array.isArray(user.cart) ? user.cart : JSON.parse(user.cart || '[]')
      }
    });
  } catch (error) {
    console.error('API /api/me CRITICAL FAILURE:', error);
    res.status(500).json({ message: 'Internal server error', error: error.stack });
  }
});

app.get('/api/orders', authMiddleware, async (req, res) => {
  try {
    const db = await getDb();
    if (req.user.role === 'admin') {
      const orders = await db.all('SELECT id, user_id AS userId, items, total, shipping_address AS shippingAddress, status, created_at AS createdAt, delivery_date AS deliveryDate FROM orders ORDER BY created_at DESC');
      return res.json({ orders });
    }

    const orders = await db.all('SELECT id, user_id AS userId, items, total, shipping_address AS shippingAddress, status, created_at AS createdAt, delivery_date AS deliveryDate FROM orders WHERE user_id = ? ORDER BY created_at DESC', req.user.id);
    res.json({ orders });
  } catch (error) {
    console.error('API /api/orders error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.post('/api/orders', authMiddleware, async (req, res) => {
  const { items, total, shippingAddress, deliveryDate } = req.body;
  if (!items || !total || !shippingAddress) {
    console.warn('Incomplete Order Data Node:', { items: !!items, total: !!total, shippingAddress: !!shippingAddress });
    return res.status(400).json({ message: 'Missing order information. Ensure items, total, and address are present.' });
  }

  try {
    const db = await getDb();
    const now = Date.now();
    const generatedId = `CBX-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    // Explicit Type Safeguard Node: Cast all inputs to primitives for SQLite compatibility
    const safeUserId = Number(req.user?.id);
    if (isNaN(safeUserId) || safeUserId <= 0) {
      console.error('[ORDER ERROR] Invalid User ID in session:', { userId: req.user?.id, user: req.user });
      return res.status(401).json({ message: 'Authentication Failure', error: `Your account ID (${req.user?.id}) is invalid in the active session.` });
    }

    const safeTotal = Math.round(Number(total || 0));
    const safeItems = String(JSON.stringify(items || []));
    const safeAddress = String(JSON.stringify(shippingAddress || {}));
    const safeCreatedAt = Number(now);
    let safeDeliveryDate = null;

    if (deliveryDate) {
      const parsed = new Date(deliveryDate).getTime();
      if (!isNaN(parsed)) safeDeliveryDate = Number(parsed);
    }

    // Standard Order Execution Node: Optimized for high-fidelity persistence
    await db.run(
      'INSERT INTO orders (id, user_id, items, total, shipping_address, status, created_at, delivery_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      generatedId,
      safeUserId,
      safeItems,
      safeTotal,
      safeAddress,
      'Placed',
      safeCreatedAt,
      safeDeliveryDate
    );

    const order = await db.get('SELECT * FROM orders WHERE id = ?', generatedId);
    if (!order) {
      throw new Error('Order verification failed: Archive node did not persist the new record.');
    }

    order.items = JSON.parse(order.items);
    order.shipping_address = JSON.parse(order.shipping_address);
    res.json({ order });
  } catch (error) {
    console.error('API /api/orders CRITICAL POST failure:', error);
    try {
      const db = await getDb();
      const info = await db.all('PRAGMA table_info(orders)');
      console.error('[DATABASE_SCHEMA_LOG] Orders Schema:', JSON.stringify(info, null, 2));
    } catch (e) {
      console.error('[DATABASE_SCHEMA_LOG] Schema fetch failed:', e);
    }
    res.status(500).json({ message: 'Could not create order', error: error.message, stack: error.stack });
  }
});

app.get('/api/admin/users', authMiddleware, adminOnly, async (req, res) => {
  const db = await getDb();
  const users = await db.all('SELECT id, name, email, role, membership_tier, created_at FROM users ORDER BY created_at DESC');
  res.json({ users });
});

app.get('/api/admin/orders', authMiddleware, adminOnly, async (req, res) => {
  try {
    const db = await getDb();
    const orders = await db.all(`
      SELECT 
        o.id, 
        o.user_id AS userId, 
        u.name as userName,
        u.email as userEmail,
        o.items, 
        o.total, 
        o.shipping_address AS shippingAddress, 
        o.status, 
        o.created_at AS createdAt, 
        o.delivery_date AS deliveryDate 
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    res.json({ orders });
  } catch (error) {
    console.error('API /api/admin/orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

app.post('/api/admin/users/:id/role', authMiddleware, adminOnly, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!['admin', 'customer'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  const db = await getDb();
  const user = await db.get('SELECT * FROM users WHERE id = ?', id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  await db.run('UPDATE users SET role = ? WHERE id = ?', role, id);
  const now = Date.now();
  await db.run(
    'INSERT INTO audit_logs (user_id, action, details, created_at) VALUES (?, ?, ?, ?)',
    req.user.id,
    'role_change',
    JSON.stringify({ targetUserId: id, oldRole: user.role, newRole: role }),
    now
  );
  res.json({ success: true });
});

app.post('/api/admin/orders/:id/status', authMiddleware, adminOnly, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const db = await getDb();
  const now = Date.now();

  if (status === 'Delivered') {
    await db.run('UPDATE orders SET status = ?, delivery_date = ? WHERE id = ?', status, now, id);
  } else {
    await db.run('UPDATE orders SET status = ? WHERE id = ?', status, id);
  }

  res.json({ success: true, deliveryDate: status === 'Delivered' ? now : null });
});

app.get('/api/admin/audit', authMiddleware, adminOnly, async (req, res) => {
  const db = await getDb();
  const logs = await db.all('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 500');
  res.json({ logs });
});

app.get('/api/admin/sessions', authMiddleware, adminOnly, async (req, res) => {
  try {
    const db = await getDb();
    const sessions = await db.all(`
      SELECT s.*, u.name as userName, u.email as userEmail 
      FROM sessions s 
      JOIN users u ON s.user_id = u.id 
      ORDER BY s.created_at DESC 
      LIMIT 500
    `);
    res.json({ sessions });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sessions archive' });
  }
});

// Proxy endpoint for AI (Gemini) calls; keeps the API key on the server.
app.post('/api/genai/description', async (req, res) => {
  if (!genai) {
    return res.status(503).json({ message: 'GenAI API key not configured on the server.' });
  }

  const { productName, category } = req.body || {};
  if (!productName || !category) {
    return res.status(400).json({ message: 'Missing productName or category' });
  }

  try {
    const response = await genai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a compelling, professional e-commerce product description for a ${productName} in the ${category} category. \n          Focus on high-end quality, unique benefits, and customer satisfaction. Keep the tone sophisticated and the length under 80 words.`,
    });
    res.json({ description: response.text || '' });
  } catch (error) {
    console.error('GenAI error:', error);
    res.status(500).json({ message: 'GenAI request failed' });
  }
});

app.post('/api/genai/recommendations', async (req, res) => {
  if (!genai) {
    return res.status(503).json({ message: 'GenAI API key not configured on the server.' });
  }

  const { cartItems } = req.body || {};
  if (!Array.isArray(cartItems)) {
    return res.status(400).json({ message: 'Missing cartItems array' });
  }

  try {
    const response = await genai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on a shopping cart containing these items: ${cartItems.join(', ')}, suggest 3 related or complementary product categories or specific items that an e-commerce customer might like. Return only a plain list separated by commas.`,
    });

    const text = response.text || '';
    const recommendations = text
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    res.json({ recommendations });
  } catch (error) {
    console.error('GenAI error:', error);
    res.status(500).json({ message: 'GenAI request failed' });
  }
});

// Global Error Handler to prevents process crashes
app.use((err, req, res, next) => {
  console.error('Unhandled express error:', err);
  res.status(500).json({
    message: 'A fatal server error occurred',
    error: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
