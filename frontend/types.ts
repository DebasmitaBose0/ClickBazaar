export enum Category {
  Grocery = 'Grocery',
  Fashion = 'Fashion',
  Mobile = 'Mobile',
  Electronics = 'Electronics',
  Beauty = 'Beauty',
  Home = 'Home',
  MensWear = "Men's Wear",
  MensWatches = "Men's Watches",
  WomensWear = "Women's Wear",
  WomensWatches = "Women's Watches",
  Shoes = 'Shoes',
  Luxury = 'Luxury',
  Wellness = 'Wellness',
  Gadgets = 'Gadgets',
  Accessories = 'Accessories',
  Gaming = 'Gaming',
  Collectors = 'Collectors'
}

export enum OrderStatus {
  Placed = 'Placed',
  Packed = 'Packed',
  Shipped = 'Shipped',
  Delivered = 'Delivered'
}

export enum UserRole {
  Customer = 'Customer',
  Admin = 'Admin'
}


export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface LoginSession {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  timestamp: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  stock: number;
  discount?: number;
  featured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isLimitedOffer?: boolean;
  rating?: number;
  images?: string[];
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export type OrderItem = CartItem & { priceAtPurchase: number; name: string };

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    zip: string;
  };
  createdAt: string;
  deliveryDate?: string;
}

export interface AppState {
  products: Product[];
  users: User[];
  orders: Order[];
  currentUser: User | null;
  cart: CartItem[];
  loginSessions: LoginSession[];
}