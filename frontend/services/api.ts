export type User = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  wishlist?: string[];
  cart?: any[];
};

export type ShippingAddress = {
  fullName: string;
  address: string;
  city: string;
  zip: string;
};

export type Order = {
  id: number;
  user_id: number;
  items: string;
  total: number;
  shipping_address: string;
  status: string;
  created_at: number;
  delivery_date?: number | null;
};

const json = async (res: Response) => {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

// Get API base URL from environment, default to localhost
const API_BASE_URL = ((import.meta as any).env?.API_URL || 'http://localhost:4100').replace(/\/$/, '');

const safeFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  try {
    // If input is a relative path, prepend the API base URL
    const url = typeof input === 'string' && input.startsWith('/')
      ? `${API_BASE_URL}${input}`
      : input;
    return await fetch(url, init);
  } catch (err: any) {
    // Network errors (e.g., backend offline) typically show as TypeError 'Failed to fetch'.
    throw new Error('Unable to reach backend API. Make sure the server is running (npm run dev).');
  }
};

export async function checkHealth() {
  const res = await safeFetch('/api/health');
  if (!res.ok) throw new Error('Backend node offline');
  return (await json(res));
}

export async function sendRegisterOtp(name: string, email: string) {
  const res = await safeFetch('/api/register/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email }),
  });
  if (!res.ok) throw new Error((await json(res))?.message || 'Failed to send OTP');
  return (await json(res));
}

export async function register(name: string, email: string, password: string, otp: string, adminKey?: string) {
  const res = await safeFetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, email, password, otp, adminKey }),
  });
  if (!res.ok) throw new Error((await json(res))?.message || 'Registration failed');
  return (await json(res)) as { user: User };
}

export async function login(email: string, password: string, adminKey?: string) {
  const res = await safeFetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password, adminKey }),
  });
  if (!res.ok) throw new Error((await json(res))?.message || 'Login failed');
  return (await json(res)) as { user: User };
}

export async function logout() {
  await fetch('/api/logout', {
    method: 'POST',
    credentials: 'include',
  });
}

export async function getMe() {
  const res = await safeFetch('/api/me', {
    credentials: 'include',
  });
  if (res.status >= 500) {
    throw new Error('Backend server error');
  }
  if (!res.ok) return null;
  return (await json(res)) as { user: User };
}

export async function updateProfile(name: string, email: string) {
  const res = await safeFetch('/api/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, email }),
  });
  if (!res.ok) throw new Error((await json(res))?.message || 'Profile update failed');
  return (await json(res)) as { user: User };
}

export async function fetchOrders() {
  const res = await safeFetch('/api/orders', { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch orders');
  return (await json(res)) as { orders: Order[] };
}

export async function createOrder(payload: { items: any[]; total: number; shippingAddress: any; deliveryDate?: string; discount?: number }) {
  const res = await safeFetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const detailedMessage = errorData.error ? `${errorData.message}: ${errorData.error}` : (errorData.message || 'Failed to create order');
    throw new Error(detailedMessage);
  }
  return (await json(res)) as { order: Order };
}

export async function fetchAdminUsers() {
  const res = await fetch('/api/admin/users', { credentials: 'include' });
  if (!res.ok) throw new Error('Not authorized');
  return (await json(res)) as { users: User[] };
}

export async function fetchAdminOrders() {
  const res = await safeFetch('/api/admin/orders', { credentials: 'include' });
  if (!res.ok) throw new Error('Not authorized');
  return (await json(res)) as { orders: Order[] };
}

export async function changeUserRole(userId: number, role: 'admin' | 'customer') {
  const res = await fetch(`/api/admin/users/${userId}/role`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ role }),
  });
  if (!res.ok) throw new Error('Failed to update user role');
  return (await json(res)) as { success: boolean };
}

export async function fetchAuditLogs() {
  const res = await fetch('/api/admin/audit', { credentials: 'include' });
  if (!res.ok) throw new Error('Not authorized');
  return (await json(res)) as { logs: any[] };
}

export async function fetchSessionLogs() {
  const res = await fetch('/api/admin/sessions', { credentials: 'include' });
  if (!res.ok) throw new Error('Not authorized');
  return (await json(res)) as { sessions: any[] };
}

export async function updateOrderStatus(orderId: string, status: string) {
  const res = await fetch(`/api/admin/orders/${orderId}/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update order status');
  return (await json(res)) as { success: boolean, deliveryDate: number | null };
}

export async function forgotPassword(email: string) {
  const res = await safeFetch('/api/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error((await json(res))?.message || 'Failed to send OTP');
  return (await json(res));
}

export async function verifyOtp(email: string, otp: string) {
  const res = await safeFetch('/api/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });
  if (!res.ok) throw new Error((await json(res))?.message || 'Verification failed');
  return (await json(res));
}

export async function resetPassword(email: string, otp: string, newPassword: string) {
  const res = await safeFetch('/api/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp, newPassword }),
  });
  if (!res.ok) throw new Error((await json(res))?.message || 'Reset failed');
  return (await json(res));
}
export async function askChatBot(message: string, history: any[]) {
  const res = await safeFetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  });
  if (!res.ok) throw new Error((await json(res))?.message || 'Chat node offline');
  return (await json(res)) as { text: string };
}

export async function sendSupportInquiry(name: string, email: string, message: string) {
  const res = await safeFetch('/api/support/inquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message }),
  });
  if (!res.ok) throw new Error((await json(res))?.message || 'Support node offline');
  return (await json(res)) as { success: boolean, message: string };
}

export async function syncData(wishlist?: string[], cart?: any[]) {
  const res = await fetch('/api/sync', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ wishlist, cart }),
  });
  if (!res.ok) throw new Error('Synchronization failed');
  return (await json(res));
}
