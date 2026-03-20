import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { GoogleGenAI } from '@google/genai';
import { getDb } from './db.js';

// Use a non-conflicting default port (4100) to avoid collisions with other local services.
const PORT = process.env.PORT || 4100;
const JWT_SECRET = process.env.JWT_SECRET || 'click-bazaar-secret';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const genai = GOOGLE_API_KEY ? new GoogleGenAI({ apiKey: GOOGLE_API_KEY }) : null;

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());

const createToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
};

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Missing auth token' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

app.post('/api/register', async (req, res) => {
  const { name, email, password, adminKey } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const db = await getDb();
  const existing = await db.get('SELECT * FROM users WHERE email = ?', email.toLowerCase());
  if (existing) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const isAdminEmail = email.toLowerCase() === (process.env.ADMIN_EMAIL || 'admin@clickbazaar.com');
  if (isAdminEmail) {
    const expected = process.env.ADMIN_KEY || 'admin-secret';
    if (adminKey !== expected) {
      return res.status(403).json({ message: 'Invalid admin key' });
    }
  }

  const password_hash = await bcrypt.hash(password, 10);
  const now = Date.now();
  const role = isAdminEmail ? 'admin' : 'customer';

  const result = await db.run(
    'INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)',
    name,
    email.toLowerCase(),
    password_hash,
    role,
    now
  );

  const user = { id: result.lastID, name, email, role };
  const token = createToken(user);
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
    'register',
    JSON.stringify({ email, role }),
    now
  );

  res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
  res.json({ user });
});

app.post('/api/login', async (req, res) => {
  const { email, password, adminKey } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });

  const db = await getDb();
  const user = await db.get('SELECT * FROM users WHERE email = ?', email.toLowerCase());
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  if (user.role === 'admin') {
    const expected = process.env.ADMIN_KEY || 'admin-secret';
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

  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
});

app.get('/api/me', authMiddleware, async (req, res) => {
  const db = await getDb();
  const user = await db.get('SELECT id, name, email, role FROM users WHERE id = ?', req.user.id);
  res.json({ user });
});

app.get('/api/orders', authMiddleware, async (req, res) => {
  const db = await getDb();
  if (req.user.role === 'admin') {
    const orders = await db.all('SELECT * FROM orders ORDER BY created_at DESC');
    return res.json({ orders });
  }

  const orders = await db.all('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', req.user.id);
  res.json({ orders });
});

app.post('/api/orders', authMiddleware, async (req, res) => {
  const { items, total, shippingAddress, deliveryDate } = req.body;
  if (!items || !total || !shippingAddress) {
    return res.status(400).json({ message: 'Missing order information' });
  }

  const db = await getDb();
  const now = Date.now();
  const result = await db.run(
    'INSERT INTO orders (user_id, items, total, shipping_address, status, created_at, delivery_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
    req.user.id,
    JSON.stringify(items),
    total,
    JSON.stringify(shippingAddress),
    'processing',
    now,
    deliveryDate ? new Date(deliveryDate).getTime() : null
  );

  const order = await db.get('SELECT * FROM orders WHERE id = ?', result.lastID);
  res.json({ order });
});

app.get('/api/admin/users', authMiddleware, adminOnly, async (req, res) => {
  const db = await getDb();
  const users = await db.all('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
  res.json({ users });
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

app.get('/api/admin/audit', authMiddleware, adminOnly, async (req, res) => {
  const db = await getDb();
  const logs = await db.all('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 500');
  res.json({ logs });
});

app.get('/api/admin/sessions', authMiddleware, adminOnly, async (req, res) => {
  const db = await getDb();
  const sessions = await db.all('SELECT * FROM sessions ORDER BY created_at DESC LIMIT 500');
  res.json({ sessions });
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

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
