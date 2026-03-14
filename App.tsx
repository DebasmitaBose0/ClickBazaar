import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import { 
  ShoppingCart, 
  User as UserIcon, 
  Search, 
  Package, 
  LayoutDashboard, 
  LogOut, 
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  Box,
  Users,
  CreditCard,
  Plus, 
  Trash2,
  X,
  Menu,
  CheckCircle,
  Truck,
  Eye,
  Sparkles,
  Check,
  Bell,
  AlertTriangle,
  Filter,
  Phone,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Gift,
  Zap,
  Tag,
  Heart,
  ShieldCheck,
  Headphones,
  Award,
  Star,
  Quote,
  ArrowRight,
  ArrowLeft,
  Settings,
  MapPin,
  Clock,
  Download,
  Printer,
  Calendar,
  ShoppingBag,
  Smartphone,
  Watch,
  Gamepad2,
  Shirt,
  CreditCard as PaymentIcon,
  FileText,
  Shield,
  Infinity,
  Gem,
  Coffee,
  LifeBuoy,
  BarChart3,
  ExternalLink,
  History,
  Activity,
  Timer,
  UserPlus,
  LogIn,
  Radar,
  Info,
  Scale,
  Lock,
  Mail,
  Percent,
  MessageSquare,
  Minus
} from 'lucide-react';
import { 
  Category, 
  Product, 
  User, 
  UserRole, 
  AppState, 
  CartItem, 
  Order, 
  OrderStatus,
  LoginSession
} from './types';
import { INITIAL_PRODUCTS, INITIAL_USERS } from './constants';
import { getProductDescription } from './services/geminiService';
import Lenis from 'lenis';
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useReducedMotion } from 'framer-motion';

// --- Advanced Feature Components ---

const DataVisGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-20 px-6 max-w-7xl mx-auto">
    {[
      { icon: <Activity className="w-8 h-8" />, label: "Live Traffic", value: "2.4k", detail: "Active Sessions", color: "text-blue-800" },
      { icon: <Radar className="w-8 h-8" />, label: "Fulfillment", value: "98.2%", detail: "Success Rate", color: "text-green-800" },
      { icon: <Zap className="w-8 h-8" />, label: "Response", value: "45ms", detail: "Server Latency", color: "text-amber-800" }
    ].map((item, i) => (
      <div key={i} className="bg-white/40 backdrop-blur-md p-8 rounded-[32px] border border-amber-200 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
        <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity ${item.color}`}>
          {item.icon}
        </div>
        <div className={`${item.color} mb-6`}>{item.icon}</div>
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{item.label}</div>
        <div className="text-4xl font-black text-blue-900 tracking-tighter mb-2">{item.value}</div>
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{item.detail}</div>
      </div>
    ))}
  </div>
);

// --- UI Utility Components ---

export const SiteLoader = ({ message = "Click Bazaar" }: { message?: string }) => {
  const content = (
    <div className="fixed inset-0 z-[99999] bg-amber-50 flex flex-col items-center justify-center overflow-hidden font-['Comic_Sans_MS',_cursive]">
      <style>{`
      .loader-stage { position: relative; width: 350px; height: 400px; display: flex; flex-direction: column; opacity: 0; animation: stage-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      @keyframes stage-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      
      .main-basket { position: relative; margin: 0 auto; z-index: 20; animation: float-basket 3s ease-in-out infinite; }
      @keyframes float-basket { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-20px) rotate(3deg); } }
      
      .basket-glow { position: absolute; inset: -30px; background: radial-gradient(circle, rgba(30,64,175,0.2) 0%, transparent 70%); border-radius: 50%; filter: blur(20px); animation: pulse-glow 3s ease-in-out infinite; }
      @keyframes pulse-glow { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.3); } }

      .conveyor-belt { position: absolute; top: -160px; left: 50%; transform: translateX(-50%); width: 80px; height: 350px; z-index: 10; }
      .falling-item { position: absolute; top: 0; left: 50%; transform: translateX(-50%); opacity: 0; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.1)); }
      
      .item-anim { animation: drop-into-bag 3.2s cubic-bezier(0.45, 0, 0.55, 1) infinite; }
      .i-1 { animation-delay: 0s; }
      .i-2 { animation-delay: 0.8s; }
      .i-3 { animation-delay: 1.6s; }
      .i-4 { animation-delay: 2.4s; }

      @keyframes drop-into-bag {
        0% { transform: translate(-50%, -60px) scale(0) rotate(-45deg); opacity: 0; }
        10% { transform: translate(-50%, 0) scale(1.2) rotate(0deg); opacity: 1; }
        40% { transform: translate(-50%, 180px) scale(1) rotate(15deg); opacity: 1; }
        50% { transform: translate(-50%, 200px) scale(0); opacity: 0; filter: blur(8px); }
        100% { transform: translate(-50%, 200px) scale(0); opacity: 0; }
      }

      .impact-waves { position: absolute; top: 200px; left: 50%; transform: translateX(-50%); width: 140px; height: 50px; }
      .wave { position: absolute; inset: 0; border: 3px solid #1e40af; border-radius: 50%; opacity: 0; animation: wave-emit 3.2s linear infinite; }
      .w-1 { animation-delay: 0.5s; }
      .w-2 { animation-delay: 1.3s; }
      .w-3 { animation-delay: 2.1s; }
      .w-4 { animation-delay: 2.9s; }

      @keyframes wave-emit {
        0% { transform: scale(0.1); opacity: 0; }
        5% { opacity: 0.6; }
        35% { transform: scale(1.8); opacity: 0; }
        100% { opacity: 0; }
      }

      .text-reveal { margin-top: 30px; position: relative; overflow: hidden; height: 50px; }
      .text-slide { animation: slide-up-text 10s steps(4) infinite; }
      @keyframes slide-up-text { from { transform: translateY(0); } to { transform: translateY(-200px); } }
      .text-line { height: 50px; display: flex; align-items: center; justify-content: center; font-weight: 950; color: #1e40af; text-transform: uppercase; letter-spacing: 0.15em; font-size: 0.85rem; }

      .stadium-track { width: 160px; height: 4px; background: #e2e8f0; border-radius: 20px; margin: 25px auto 0; overflow: hidden; }
      .stadium-fill { height: 100%; width: 45%; background: linear-gradient(90deg, #1e40af, #166534, #92400e); border-radius: 20px; animation: progress-infinite 1.8s ease-in-out infinite; }
      @keyframes progress-infinite { 0% { transform: translateX(-150%); } 100% { transform: translateX(250%); } }
      `}</style>
      
      <div className="loader-stage">
        <div className="conveyor-belt">
          <div className="falling-item item-anim i-1 text-blue-800"><Smartphone size={40} strokeWidth={1} /></div>
          <div className="falling-item item-anim i-2 text-green-800"><Watch size={40} strokeWidth={1} /></div>
          <div className="falling-item item-anim i-3 text-amber-800"><Gamepad2 size={40} strokeWidth={1} /></div>
          <div className="falling-item item-anim i-4 text-blue-600"><Shirt size={40} strokeWidth={1} /></div>
        </div>

        <div className="main-basket">
          <div className="basket-glow"></div>
          <div className="p-12 bg-white/40 backdrop-blur-xl rounded-[4rem] shadow-[0_40px_80px_-20px_rgba(30,64,175,0.2)] border border-white/60 relative">
            <ShoppingBag size={100} className="text-blue-800" strokeWidth={0.75} />
          </div>
          <div className="impact-waves">
            <div className="wave w-1"></div>
            <div className="wave w-2"></div>
            <div className="wave w-3"></div>
            <div className="wave w-4"></div>
          </div>
        </div>

        <div className="mt-10 text-center px-4">
          <h2 className="text-4xl font-black text-blue-900 tracking-tighter mb-2 scale-110">
            {message}
          </h2>
          
          <div className="text-reveal">
            <div className="text-slide">
              <div className="text-line">Bagging Curated Drops</div>
              <div className="text-line">Syncing Archival Node</div>
              <div className="text-line">Polishing Interface</div>
              <div className="text-line">Ready for Dispatch</div>
            </div>
          </div>

          <div className="stadium-track">
            <div className="stadium-fill"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return content;
  return ReactDOM.createPortal(content, document.body);
};

export const CartLoader = () => {
  const el = (
    <div className="fixed inset-0 z-[99998] bg-amber-50/80 backdrop-blur-xl flex items-center justify-center">
      <div className="w-16 h-16 border-[6px] border-blue-100 border-t-blue-800 rounded-full animate-spin"></div>
    </div>
  );
  if (typeof document === 'undefined') return el;
  return ReactDOM.createPortal(el, document.body);
};

const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = "bg-blue-600" }) => (
  <span className={`${color} text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest px-2 md:px-3 py-1 rounded-full shadow-sm whitespace-nowrap inline-flex items-center justify-center`}>
    {children}
  </span>
);

const useScrollReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('heading-visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
};

const SectionHeader: React.FC<{ title: React.ReactNode; subtitle: string; centered?: boolean }> = ({ title, subtitle, centered }) => {
  const revealRef = useScrollReveal();
  return (
    <div ref={revealRef} className={`${centered ? 'text-center' : 'text-left'} mb-8 md:mb-12 px-2 heading-animate`}>
      <h4 className="text-blue-800 font-black uppercase text-[10px] md:text-[11px] tracking-[0.3em] mb-3 md:mb-4 heading-subtitle">{subtitle}</h4>
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1] md:leading-[1.1] text-blue-800 heading-gradient-text">
        {title}
      </h2>
    </div>
  );
};

const ScrollReveal: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const ref = useScrollReveal();
  return <div ref={ref} className={`heading-animate ${className}`}>{children}</div>;
};

const ScrollRevealSmall: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const ref = useScrollReveal();
  return <div ref={ref} className={`sub-heading-reveal ${className}`}>{children}</div>;
};

const ScrollRevealFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const ref = useScrollReveal();
  return <div ref={ref} className={`footer-heading-reveal ${className}`}>{children}</div>;
};

// --- Hero Slider Component ---

const FeatureGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 max-w-7xl mx-auto px-6 py-16 md:py-24 border-b border-amber-200">
    {[
      { icon: <Truck className="w-8 h-8 text-blue-800" />, title: "Rapid Node Delivery", desc: "Automated logistics ensuring arrival within 24-48 hours across the grid." },
      { icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />, title: "Secure Protocol", desc: "End-to-end encrypted transactions with authenticated archival verification." },
      { icon: <Sparkles className="w-8 h-8 text-amber-500" />, title: "Curated Selection", desc: "Hand-picked drops from global artisans with strict quality telemetry." }
    ].map((f, i) => (
      <ScrollRevealSmall key={i} className="flex flex-col items-center text-center p-8 md:p-12 bg-amber-50 rounded-[40px] border border-slate-50 shadow-sm hover:shadow-xl transition-all duration-500 group">
        <div className="mb-6 p-5 bg-amber-50 rounded-[32px] group-hover:scale-110 transition-transform duration-500">{f.icon}</div>
        <h3 className="text-xl md:text-2xl font-black text-blue-900 tracking-tight mb-4">{f.title}</h3>
        <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed italic">"{f.desc}"</p>
      </ScrollRevealSmall>
    ))}
  </div>
);

const CategoryCurations = ({ onNavigate }: any) => {
  const categories = [
    { name: Category.Fashion, image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=80", count: "12 Drops" },
    { name: Category.Electronics, image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80", count: "08 Drops" },
    { name: Category.Home, image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80", count: "15 Drops" }
  ];

  return (
    <div className="py-20 md:py-32 bg-amber-50 border-t border-amber-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal className="mb-12 md:mb-20 text-center">
          <Badge color="bg-red-700">Curated Archives</Badge>
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[1] md:leading-[0.9] mt-6 bg-gradient-to-br from-slate-950 via-slate-800 to-red-700 bg-clip-text text-transparent heading-gradient-text">
            Shop by <span className="italic">Medium.</span>
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {categories.map((cat, i) => (
            <div 
              key={i} 
              onClick={() => onNavigate('shop', cat.name)}
              className="relative aspect-[4/5] rounded-[48px] overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-700"
            >
              <img src={cat.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-10 md:p-14">
                <span className="text-white/60 text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] mb-3">{cat.count}</span>
                <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-6">{cat.name}</h3>
                <div className="flex items-center gap-3 text-white font-black text-[10px] md:text-[11px] uppercase tracking-widest bg-amber-50/10 backdrop-blur-md w-fit px-6 py-3 rounded-full border border-white/20 group-hover:bg-amber-50 group-hover:text-blue-900 transition-all duration-500">
                  Explore <ChevronRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const HERO_IMAGES = [
  "/images/hero1.jpg",
  "/images/hero3.jpg",
  "/images/hero4.png"
];

const HeroSlider: React.FC<{ onExplore: () => void }> = ({ onExplore }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 1000], [0, 300]);
  const textY = useTransform(scrollY, [0, 1000], [0, -120]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[75vh] md:h-[85vh] w-full overflow-hidden bg-slate-950">
      {/* 3D Floating Elements Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            y: [0, -40, 0], 
            rotate: [0, 10, 0],
            scale: [1, 1.1, 1] 
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ 
            y: [0, 60, 0], 
            rotate: [0, -15, 0],
            scale: [1, 1.2, 1] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 -right-20 w-[500px] h-[500px] bg-red-700/10 rounded-full blur-[120px]" 
        />
      </div>

      {HERO_IMAGES.map((img, idx) => (
        <motion.div
          key={img}
          className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out transform ${
            idx === currentIndex ? 'opacity-50 scale-105' : 'opacity-0 scale-100'
          }`}
        >
          <img src={img} className="w-full h-full object-cover" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
        </motion.div>
      ))}

      <motion.div 
        style={{ y: textY }}
        className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center items-start"
      >
        <div className="max-w-3xl animate-fadeIn">
          <Badge color="bg-blue-600">Premium Curations 2026</Badge>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[1] md:leading-[0.9] mt-6 md:mt-8 mb-8 md:mb-10 text-blue-900 drop-shadow-[0_10px_10px_rgba(0,0,0,0.1)]" style={{ fontFamily: '"Comic Sans MS", cursive, sans-serif', fontWeight: 950 }}>
            <span className="block">Elevate Your <br /><span className="italic text-blue-800">Lifestyle.</span></span>
          </h1>
          <p className="text-white text-base md:text-xl font-medium mb-10 md:mb-12 max-w-lg leading-relaxed">
            Discover a hand-picked collection of world-class essentials designed for those who settle for nothing but the best.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={onExplore}
              className="bg-amber-50 text-blue-900 px-8 md:px-10 py-4 md:py-5 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all transform active:scale-95 shadow-2xl flex items-center gap-3 group"
            >
              Shop Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="flex gap-3 mt-10 md:mt-12">
            {HERO_IMAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1 transition-all duration-500 rounded-full ${
                  idx === currentIndex ? 'w-8 md:w-12 bg-blue-600' : 'w-3 md:w-4 bg-amber-50/20 hover:bg-amber-50/40'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main Application Logic ---

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loginSessions, setLoginSessions] = useState<LoginSession[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const lenisRef = useRef<Lenis | null>(null);
  
  // Logic to scroll to top when category or page changes
  const scrollToTop = useCallback(() => {
    // Both standard scroll and Lenis scroll
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, []);

  useEffect(() => {
    // Use a multi-stage scroll attempt to combat layout shifts
    scrollToTop();
    const t1 = setTimeout(scrollToTop, 50);
    const t2 = setTimeout(scrollToTop, 150);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [selectedCategory, currentPage, scrollToTop]);

  const [search, setSearch] = useState('');
  const [shopSort, setShopSort] = useState<'Popular' | 'PriceLowHigh' | 'PriceHighLow'>('Popular');
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [isAdminMobileOpen, setIsAdminMobileOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [showScrollArrow, setShowScrollArrow] = useState<'up' | 'down' | null>('down');
  const reviewsScrollRef = useRef<HTMLDivElement>(null);
  const bestSellersRef = useRef<HTMLDivElement>(null);
  const newArrivalsRef = useRef<HTMLDivElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  // Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.5,
      infinite: false,
    });
    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
      lenisRef.current = null;
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Initial Load Animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 6000); // Extended to 6 seconds to give the premium animation breathing room
    return () => clearTimeout(timer);
  }, []);

  // Persistence Logic
  useEffect(() => {
    const data = localStorage.getItem('cb_state_final_v1');
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.users) {
        const currentUsers = [...parsed.users];
        if (!currentUsers.find(u => u.email === INITIAL_USERS[0].email)) {
          currentUsers.push(INITIAL_USERS[0]);
        }
        setUsers(currentUsers);
      }
      if (parsed.orders) setOrders(parsed.orders);
      if (parsed.loginSessions) setLoginSessions(parsed.loginSessions);
      if (parsed.wishlist) setWishlist(parsed.wishlist);
    } else {
      setUsers(INITIAL_USERS);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cb_state_final_v1', JSON.stringify({ users, orders, loginSessions, wishlist }));
  }, [users, orders, loginSessions, wishlist]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!categoryMenuRef.current) return;
      if (!categoryMenuRef.current.contains(event.target as Node)) {
        setIsCategoryMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCategoryMenuOpen(false);
        setQuickView(null);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      
      // Near top: show down arrow only
      if (scrollY < 100) {
        setShowScrollArrow('down');
      } 
      // Near bottom: show up arrow only
      else if (scrollY + windowHeight > fullHeight - 150) {
        setShowScrollArrow('up');
      } 
      // Middle: show both (or prefer one, user asked for vice versa logic)
      else {
        setShowScrollArrow(null); // We'll show both in a container or handle logic inside UI
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = useCallback((p: string, category: Category | 'All' = 'All') => {
    setIsCategoryMenuOpen(false);
    setSelectedCategory(category);
    setCurrentPage(p);
    scrollToTop();
  }, [scrollToTop]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSignup = (name: string, email: string, pass: string) => {
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      showToast("Identity already exists in archive.");
      return;
    }
    const newUser: User = {
      id: `USR-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      name,
      email: email.toLowerCase(),
      role: email.includes('admin@clickbazaar') ? UserRole.Admin : UserRole.Customer,
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    showToast("Registration successful. Proceed to Login.");
    setCurrentPage('login');
  };

  const handleLogin = (email: string, pass: string) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      const session: LoginSession = {
        id: `SES-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        timestamp: new Date().toISOString()
      };
      setLoginSessions(prev => [session, ...prev]);
      showToast(`Authenticated as ${user.name}`);
      if (user.role === UserRole.Admin) {
        setCurrentPage('admin-dashboard');
      } else {
        setCurrentPage('home');
      }
    } else {
      showToast("Invalid credentials.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('home');
    showToast("Session terminated.");
  };

  const addToCart = (id: string, quantity: number = 1) => {
    setIsProcessing(true);
    setTimeout(() => {
      setCart(prev => {
        const exists = prev.find(i => i.productId === id);
        if (exists) return prev.map(i => i.productId === id ? { ...i, quantity: i.quantity + quantity } : i);
        return [...prev, { productId: id, quantity }];
      });
      setIsProcessing(false);
      showToast("Added to bag");
    }, 800);
  };

  const removeFromCart = (id: string, all: boolean = false) => {
    setCart(prev => {
      const item = prev.find(i => i.productId === id);
      if (item && item.quantity > 1 && !all) {
        return prev.map(i => i.productId === id ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.productId !== id);
    });
  };

  const completeOrder = (shipping: any) => {
    if (!currentUser) {
      showToast("Please login to complete purchase.");
      setCurrentPage('login');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      const items = cart.map(c => {
        const p = products.find(prod => prod.id === c.productId)!;
        return { ...c, priceAtPurchase: p.price, name: p.name };
      });
      const total = items.reduce((a, b) => a + (b.priceAtPurchase * b.quantity), 0);
      const order: Order = {
        id: `CB-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        userId: currentUser.id,
        items,
        total,
        status: OrderStatus.Placed,
        shippingAddress: shipping,
        createdAt: new Date().toISOString()
      };
      setOrders(prev => [order, ...prev]);
      setLastOrder(order);
      setCart([]);
      setIsProcessing(false);
      setCurrentPage('order-success');
    }, 2000);
  };

  const navCategories = useMemo<Array<{ name: Category; count: number }>>(() => {
    const counts: Partial<Record<Category, number>> = {};
    products.forEach(product => {
      counts[product.category] = (counts[product.category] ?? 0) + 1;
    });
    return Object.values(Category)
      .filter((category): category is Category => (counts[category] ?? 0) > 0)
      .sort((a, b) => (counts[b] ?? 0) - (counts[a] ?? 0))
      .map(category => ({ name: category, count: counts[category] ?? 0 }));
  }, [products]);

  const featuredNavCategories = useMemo(() => navCategories.slice(0, 4), [navCategories]);

  const filteredProducts = useMemo(() => {
    let list = products.filter(p => selectedCategory === 'All' || p.category === selectedCategory);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (shopSort === 'PriceLowHigh') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (shopSort === 'PriceHighLow') {
      list = [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [products, selectedCategory, search, shopSort]);

  const handleCategoryMenuMouseEnter = () => {
    if (window.innerWidth >= 1024) {
      setIsCategoryMenuOpen(true);
    }
  };

  const handleCategoryMenuMouseLeave = () => {
    if (window.innerWidth >= 1024) {
      setIsCategoryMenuOpen(false);
    }
  };

  if (currentPage === 'admin-dashboard') {
    return (
      <>
        {loading && <SiteLoader />}
        {isProcessing && <CartLoader />}
        <AdminDashboard 
          users={users} 
          orders={orders} 
          sessions={loginSessions} 
          products={products}
          setProducts={setProducts}
          onLogout={handleLogout} 
          onNavigate={handleNavigate} 
          isMobileOpen={isAdminMobileOpen}
          setIsMobileOpen={setIsAdminMobileOpen}
        />
      </>
    );
  }

  return (
    <>
      {loading && <SiteLoader />}
      {isProcessing && <CartLoader />}
      <div className="min-h-screen flex flex-col selection:bg-blue-600 selection:text-white bg-[#fafafa]">
        <div className="bg-slate-950 text-white py-2 overflow-hidden whitespace-nowrap border-b border-slate-900 no-print">
          <div className="flex animate-ticker gap-12 md:gap-16 font-black text-[8px] md:text-[9px] uppercase tracking-[0.2em] px-4">
            <span>Complimentary International Shipping on Orders Over ₹5,000</span>
            <span>New Limited Drop: The Midnight Collection</span>
            <span>Elite Member Access Now Open</span>
            <span>Complimentary International Shipping on Orders Over ₹5,000</span>
          </div>
        </div>
        <nav className="sticky top-0 z-50 glass border-b border-amber-200 no-print">
          <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigate('home')}>
                <div className="bg-slate-950 p-1 md:p-1.5 rounded-lg"><ShoppingCart className="w-4 h-4 md:w-5 md:h-5 text-white" /></div>
                <span className="text-lg md:text-xl tracking-tighter text-blue-900 uppercase clickbazaar-brand">Click Bazaar</span>
              </div>
            </div>
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
               <div className="relative w-full group">
                 <input 
                   type="text" placeholder="Search curated catalog..." value={search} onChange={e => setSearch(e.target.value)}
                   className="w-full bg-slate-100 border-none rounded-full px-6 py-2.5 pr-12 focus:ring-2 focus:ring-blue-800 outline-none font-bold text-blue-900 transition-all text-sm"
                 />
                 <Search className="absolute right-5 top-2.5 w-4 h-4 text-slate-400" />
               </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <div
                className="relative"
                ref={categoryMenuRef}
                onMouseEnter={handleCategoryMenuMouseEnter}
                onMouseLeave={handleCategoryMenuMouseLeave}
              >
                <button
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      setIsCategoryMenuOpen(prev => !prev);
                    } else {
                      setIsCategoryMenuOpen(true);
                    }
                  }}
                  className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full border transition-all ${isCategoryMenuOpen ? 'border-slate-300 bg-slate-900 text-white shadow-lg' : 'border-slate-200 bg-amber-50 hover:bg-amber-50 text-green-700'}`}
                  aria-label="Open categories"
                  aria-expanded={isCategoryMenuOpen}
                >
                  <span className="hidden md:inline text-[9px] md:text-[10px] font-black uppercase tracking-widest">Categories</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {isCategoryMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-[min(88vw,420px)] bg-amber-50 border border-slate-200 rounded-3xl shadow-2xl p-4 md:p-5 z-[80] animate-fadeIn bg-amber-50">
                    <div className="mb-4 pb-4 border-b border-amber-200">
                      <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Shop By Category</p>
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-base md:text-lg font-black tracking-tight text-blue-900">Curated Catalog Menu</p>
                        <button
                          onClick={() => handleNavigate('shop', 'All')}
                          className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-colors ${currentPage === 'shop' && selectedCategory === 'All' ? 'bg-slate-950 text-white' : 'bg-slate-100 text-green-700 hover:bg-slate-200'}`}
                        >
                          View All
                        </button>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Featured</p>
                      <div className="flex flex-wrap gap-2">
                        {featuredNavCategories.map(category => (
                          <button
                            key={`featured-${category.name}`}
                            onClick={() => handleNavigate('shop', category.name)}
                            className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-colors ${currentPage === 'shop' && selectedCategory === category.name ? 'bg-slate-950 text-white' : 'bg-slate-100 text-green-700 hover:bg-slate-200'}`}
                          >
                            {category.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="max-h-72 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {navCategories.map(category => (
                        <button
                          key={category.name}
                          onClick={() => handleNavigate('shop', category.name)}
                          className={`text-left px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-between ${currentPage === 'shop' && selectedCategory === category.name ? 'bg-slate-950 text-white' : 'text-green-700 hover:bg-slate-100'}`}
                        >
                          <span>{category.name}</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full ${currentPage === 'shop' && selectedCategory === category.name ? 'bg-amber-50/20 text-white' : 'bg-slate-200 text-green-700'}`}>{category.count}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button 
                onClick={() => handleNavigate('tracking')} 
                className="relative p-2 md:p-2.5 hover:bg-amber-50 rounded-full transition-all text-slate-500 group"
                title="Live Tracking"
              >
                <Truck className="w-5 h-5" />
                {orders.filter(o => o.userId === currentUser?.id).length > 0 && (
                  <span className="absolute top-1 right-1 bg-blue-600 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                    !
                  </span>
                )}
              </button>
              <button onClick={() => handleNavigate('wishlist')} className="relative p-2 md:p-2.5 hover:bg-amber-50 rounded-full transition-all text-slate-500">
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && <span className="absolute top-1 right-1 bg-red-600 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">{wishlist.length}</span>}
              </button>
              <button onClick={() => handleNavigate('cart')} className="relative p-2 md:p-2.5 hover:bg-amber-50 rounded-full transition-all text-slate-500">
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && <span className="absolute top-1 right-1 bg-blue-600 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">{cart.length}</span>}
              </button>
              <div className="h-6 w-px bg-slate-200 mx-1 md:mx-2"></div>
              {currentUser ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 md:gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-amber-50 transition-all">
                    <span className="hidden lg:block text-[11px] font-black uppercase tracking-widest text-green-700">{currentUser.name.split(' ')[0]}</span>
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-slate-950 flex items-center justify-center text-white text-[10px] md:text-xs font-black uppercase">{currentUser.name[0]}</div>
                  </button>
                  <div className="group-hover-visible absolute right-0 top-full mt-2 w-48 bg-amber-50 rounded-2xl shadow-2xl border border-amber-200 p-2 z-[70]">
                    {currentUser.role === UserRole.Admin ? (
                      <button onClick={() => setCurrentPage('admin-dashboard')} className="w-full text-left px-4 py-2 hover:bg-amber-50 rounded-lg text-xs font-bold flex items-center gap-3"><LayoutDashboard className="w-4 h-4" /> Control Panel</button>
                    ) : (
                      <>
                        <button onClick={() => handleNavigate('profile')} className="w-full text-left px-4 py-2 hover:bg-amber-50 rounded-lg text-xs font-bold flex items-center gap-3"><UserIcon className="w-4 h-4" /> Profile</button>
                        <button onClick={() => handleNavigate('orders')} className="w-full text-left px-4 py-2 hover:bg-amber-50 rounded-lg text-xs font-bold flex items-center gap-3"><Package className="w-4 h-4" /> My Orders</button>
                      </>
                    )}
                    <div className="h-px bg-slate-100 my-1 mx-2"></div>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-amber-50 rounded-lg text-xs font-bold flex items-center gap-3 text-red-600"><LogOut className="w-4 h-4" /> Logout</button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-1 md:gap-2">
                  <button onClick={() => setCurrentPage('login')} className="bg-slate-100 text-blue-900 px-3 md:px-6 py-2 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">In</button>
                  <button onClick={() => setCurrentPage('signup')} className="bg-slate-950 text-white px-3 md:px-6 py-2 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl">Up</button>
                </div>
              )}
            </div>
          </div>
        </nav>
        <main className="flex-1">
          {currentPage === 'home' && (
            <div className="animate-fadeIn bg-amber-50">
              <HeroSlider onExplore={() => handleNavigate('shop')} />
              <FeatureGrid />
              <DataVisGrid />
              {/* Flash Deals Section */}
              <div className="py-16 md:py-24 bg-amber-50 border-b border-amber-200 overflow-hidden relative">
                 <div className="absolute top-0 right-0 p-40 bg-red-600/5 rounded-full blur-[100px]"></div>
                 <div className="max-w-7xl mx-auto px-6 relative z-10">
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
                     <ScrollReveal>
                       <Badge color="bg-red-600">Accelerated Savings</Badge>
                       <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[1] md:leading-[0.9] mt-4 text-blue-800 heading-gradient-text">
                         Flash <span className="italic">Deals.</span>
                       </h2>
                     </ScrollReveal>
                     <div className="flex gap-4">
                        <div className="bg-rose-50 text-rose-600 px-6 md:px-8 py-3 md:py-4 rounded-[20px] md:rounded-[24px] border border-rose-100 font-black text-xs md:text-sm uppercase tracking-widest flex items-center gap-3 shadow-sm">
                          <Zap className="w-4 h-4 md:w-5 md:h-5 fill-current animate-pulse" /> 
                          <div className="flex gap-2 md:gap-3 items-center">
                             <div className="flex flex-col items-center"><span>04</span><span className="text-[7px] md:text-[8px] opacity-60">Hrs</span></div>
                             <span className="opacity-40">:</span>
                             <div className="flex flex-col items-center"><span>22</span><span className="text-[7px] md:text-[8px] opacity-60">Min</span></div>
                             <span className="opacity-40">:</span>
                             <div className="flex flex-col items-center"><span>15</span><span className="text-[7px] md:text-[8px] opacity-60">Sec</span></div>
                          </div>
                        </div>
                     </div>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                      {products.filter(p => p.isLimitedOffer).slice(0, 4).map(p => (
                        <ProductCard key={p.id} product={p} onAdd={() => addToCart(p.id)} onQuick={() => setQuickView(p)} isWish={wishlist.includes(p.id)} onWish={() => {}} />
                      ))}
                   </div>
                 </div>
              </div>
              {/* Best Sellers */}
              <div ref={bestSellersRef} className="py-16 md:py-24 max-w-7xl mx-auto px-6">
                <ScrollReveal className="mb-8 md:mb-12 px-2">
                  <span className="inline-block bg-[#ef4444] text-white font-black uppercase text-[10px] md:text-[11px] tracking-[0.3em] px-5 py-2.5 rounded-[100px] mb-6 md:mb-8 shadow-[0_4px_20px_rgba(239,68,68,0.3)]">Most Coveted</span>
                  <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[1] md:leading-[0.9] text-blue-800 heading-gradient-text">
                    <span className="block">Archival <br /><span className="italic">Favorites.</span></span>
                  </h2>
                </ScrollReveal>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                  {products.filter(p => p.isBestSeller).slice(0, 8).map(p => (
                    <ProductCard key={p.id} product={p} onAdd={() => addToCart(p.id)} onQuick={() => setQuickView(p)} isWish={wishlist.includes(p.id)} onWish={() => {}} />
                  ))}
                </div>
              </div>
              <CategoryCurations onNavigate={handleNavigate} />
              {/* Testimonials */}
              <div className="bg-slate-950 py-12 md:py-20 text-white overflow-hidden relative group/reviews">
                 <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
                 <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <ScrollReveal className="text-center max-w-2xl mx-auto mb-6 md:mb-8">
                       <h4 className="text-blue-800 font-black uppercase text-[8px] tracking-[0.4em] mb-1 heading-subtitle">Curator Voice</h4>
                       <h2 className="text-2xl md:text-3xl font-black tracking-tighter leading-[1.1] bg-gradient-to-br from-red-100 via-white to-blue-100 bg-clip-text text-transparent heading-gradient-text">Verified Archival Reviews</h2>
                    </ScrollReveal>
                    <div className="relative group/reviews">
                      {/* Navigation Arrows */}
                      <button 
                        onClick={() => reviewsScrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-20 w-10 h-10 md:w-12 md:h-12 bg-amber-50/5 hover:bg-amber-50/10 border border-white/10 rounded-full flex items-center justify-center backdrop-blur-md transition-all opacity-0 group-hover/reviews:opacity-100 hover:scale-110 active:scale-95 shadow-lg group-hover/reviews:translate-x-0"
                      >
                        <ChevronLeft className="text-white" size={20} />
                      </button>
                      <button 
                        onClick={() => reviewsScrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-20 w-10 h-10 md:w-12 md:h-12 bg-amber-50/5 hover:bg-amber-50/10 border border-white/10 rounded-full flex items-center justify-center backdrop-blur-md transition-all opacity-0 group-hover/reviews:opacity-100 hover:scale-110 active:scale-95 shadow-lg group-hover/reviews:translate-x-0"
                      >
                        <ChevronRight className="text-white" size={20} />
                      </button>

                      <div 
                        ref={reviewsScrollRef}
                        className="overflow-x-auto custom-scrollbar no-scrollbar scroll-smooth"
                      >
                         <div className="flex gap-4 md:gap-6 min-w-max px-4">
                            {[
                            { name: "Julian Vance", text: "The Selvedge Denim is unparalleled. Click Bazaar truly understands archival quality and fabric weight.", role: "Fashion Curator", rating: 5, date: "MAR 2024", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop" },
                            { name: "Sophia Chen", text: "Exceptional logistics node. My Arctic Humidifier arrived in its perfect state within a mere 24 hours.", role: "Interior Designer", rating: 5, date: "FEB 2024", avatar: "data:image/jpeg;base64,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" },
                            { name: "Marcus Thorne", text: "The Chrono Series watch is a masterpiece of automated kinetic movement. Highly recommended for enthusiasts.", role: "Timepiece Collector", rating: 4, date: "JAN 2024", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&auto=format&fit=crop" },
                            { name: "Elena Rossi", text: "The Nebula X-Phone's titanium build is a marvel. Service was seamless and efficient. A new standard.", role: "Tech Analyst", rating: 5, date: "DEC 2023", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&h=200&auto=format&fit=crop" },
                            { name: "David Kim", text: "Best-in-class curated essentials. The linen collection is perfect for modern archival wardrobes.", role: "Lifestyle Blogger", rating: 5, date: "NOV 2023", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&auto=format&fit=crop" }
                          ].map((rev, i) => (
                            <div key={i} className="group relative w-[280px] md:w-[320px] h-[260px] md:h-[280px]">
                               {/* Decorative Glass Background */}
                               <div className="absolute inset-0 bg-amber-50/[0.04] border border-white/10 rounded-[28px] backdrop-blur-3xl transform transition-all duration-500 ease-out shadow-lg shadow-red-500/5"></div>
                               
                               <div className="relative h-full p-6 flex flex-col">
                                  <div className="flex justify-between items-start mb-4">
                                     <div className="flex gap-1">
                                        {[...Array(5)].map((_, star) => (
                                           <Star key={star} size={10} className={`${star < rev.rating ? 'text-blue-400 fill-blue-400' : 'text-white/10'}`} />
                                        ))}
                                     </div>
                                     <span className="text-[7px] font-black tracking-[0.2em] text-white/30 uppercase">{rev.date}</span>
                                  </div>

                                  <div className="relative mb-auto">
                                     <Quote className="absolute -top-3 -left-3 w-6 h-6 text-blue-800/5" />
                                     <p className="text-xs md:text-sm font-bold leading-snug text-slate-100 tracking-tight whitespace-normal group-hover:text-white transition-colors">
                                        "{rev.text}"
                                     </p>
                                  </div>

                                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-3">
                                     <div className="min-w-0">
                                        <h4 className="font-black text-[11px] md:text-xs tracking-tighter text-white truncate">{rev.name}</h4>
                                        <div className="flex flex-col">
                                           <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest truncate">{rev.role}</span>
                                           <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1"><ShieldCheck size={8} className="text-emerald-500" /> VERIFIED</span>
                                        </div>
                                     </div>
                                  </div>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
            </div>
            <div ref={newArrivalsRef} className="bg-amber-50 py-16 md:py-24 border-y border-amber-200">
                 <div className="max-w-7xl mx-auto px-6">
                   <ScrollReveal className="mb-8 md:mb-12 px-2 text-center md:text-left">
                     <div className="inline-flex items-center px-4 py-1.5 bg-blue-600 rounded-full mb-4 group hover:bg-red-700 transition-colors duration-300 shadow-sm">
                        <h4 className="text-white font-black uppercase text-[9px] md:text-[10px] tracking-[0.3em] heading-subtitle leading-none">The Latest Archival Drops</h4>
                     </div>
                     <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[1] md:leading-[0.9] text-blue-800 heading-gradient-text">
                       <span className="block">New <br /><span className="italic">Arrivals.</span></span>
                     </h2>
                   </ScrollReveal>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                      {products.filter(p => p.isNewArrival).map(p => (
                        <ProductCard key={p.id} product={p} onAdd={() => addToCart(p.id)} onQuick={() => setQuickView(p)} isWish={wishlist.includes(p.id)} onWish={() => {}} />
                      ))}
                   </div>
                 </div>
              </div>
            </div>
          )}
          {currentPage === 'shop' && (
            <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 animate-fadeIn bg-amber-50">
              <div className="relative overflow-hidden rounded-[40px] md:rounded-[60px] bg-gradient-to-br from-red-950 via-slate-900 to-blue-900 text-white p-10 md:p-14 mb-12">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.28),transparent_54%)]"></div>
                <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                  <div>
                    <p className="text-[11px] md:text-[12px] font-black uppercase tracking-widest text-red-200 mb-3">Catalog</p>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                      {selectedCategory === 'All' ? (
                        <span>All Collections</span>
                      ) : (
                        <span className="inline-flex items-center gap-3">
                          <span>{selectedCategory}</span>
                          <span className="text-[13px] md:text-sm bg-amber-50/15 px-3 py-1 rounded-full tracking-widest">{filteredProducts.length} items</span>
                        </span>
                      )}
                    </h2>
                    <p className="mt-4 text-sm md:text-base text-red-100 max-w-xl">Browse curated products with premium filters, quick previews, and fast checkout—designed for modern e-commerce experience.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                    <div className="flex items-center gap-2 bg-amber-50/10 border border-white/20 rounded-full px-3 py-2">
                      <span className="text-[10px] md:text-[11px] uppercase tracking-widest text-white/80">Sort:</span>
                      <select
                        value={shopSort}
                        onChange={e => setShopSort(e.target.value as any)}
                        className="appearance-none bg-slate-950/70 border border-white/20 text-white text-sm font-black tracking-wide px-3 py-2 rounded-full outline-none shadow-sm"
                      >
                        <option value="Popular">Popular</option>
                        <option value="PriceLowHigh">Price: Low to High</option>
                        <option value="PriceHighLow">Price: High to Low</option>
                      </select>
                    </div>
                    <button
                      onClick={() => setSelectedCategory('All')}
                      className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-blue-900 bg-amber-50 px-4 py-2 rounded-full hover:bg-amber-50/90 transition"
                    >
                      View All
                    </button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(p => (
                    <ProductCard key={p.id} product={p} onAdd={() => addToCart(p.id)} onQuick={() => setQuickView(p)} isWish={wishlist.includes(p.id)} onWish={() => {}} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-24 bg-amber-50 rounded-[40px] border border-amber-200">
                    <h3 className="text-2xl md:text-3xl font-black text-blue-900 mb-4">No results found</h3>
                    <p className="text-sm md:text-base text-slate-500 mb-8">Try adjusting your filters or search term to find what you’re looking for.</p>
                    <button onClick={() => { setSelectedCategory('All'); setSearch(''); }} className="bg-slate-950 text-white px-10 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition">Reset Filter</button>
                  </div>
                )}
              </div>
            </div>
          )}
          {currentPage === 'login' && <AuthView mode="login" onAuth={handleLogin} onToggle={() => setCurrentPage('signup')} />}
          {currentPage === 'signup' && <AuthView mode="signup" onAuth={handleSignup} onToggle={() => setCurrentPage('login')} />}
          {currentPage === 'cart' && <CartPage cart={cart} products={products} onRemove={removeFromCart} onAdd={addToCart} onCheckout={() => setCurrentPage('checkout')} onNavigate={handleNavigate} />}
          {currentPage === 'checkout' && <CheckoutPage cart={cart} products={products} onComplete={completeOrder} onBack={() => setCurrentPage('cart')} onAdd={addToCart} onRemove={removeFromCart} />}
          {currentPage === 'order-success' && <OrderSuccessPage order={lastOrder} onNavigate={handleNavigate} />}
          {currentPage === 'profile' && currentUser && <ProfilePage user={currentUser} orders={orders} onNavigate={handleNavigate} />}
          {currentPage === 'orders' && currentUser && <OrdersPage orders={orders.filter(o => o.userId === currentUser.id)} onNavigate={handleNavigate} />}
          {currentPage === 'tracking' && <LiveTrackingView orders={orders.filter(o => o.userId === currentUser?.id)} onNavigate={handleNavigate} />}
          {currentPage === 'support' && <SupportPage onNavigate={handleNavigate} />}
          {currentPage === 'privacy' && <PrivacyPage onNavigate={handleNavigate} />}
          {currentPage === 'terms' && <TermsPage onNavigate={handleNavigate} />}
          {currentPage === 'legal' && <LegalPage onNavigate={handleNavigate} />}
          {currentPage === 'wishlist' && (
            <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 animate-fadeIn bg-amber-50">
              <SectionHeader title="Your Wishlist" subtitle="Saved Pieces" />
              {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                  {products.filter(p => wishlist.includes(p.id)).map(p => (
                    <ProductCard key={p.id} product={p} onAdd={() => addToCart(p.id)} onQuick={() => setQuickView(p)} isWish={true} onWish={() => setWishlist(w => w.filter(id => id !== p.id))} />
                  ))}
                </div>
              ) : (
                <div className="py-32 md:py-40 text-center bg-amber-50 rounded-[40px] md:rounded-[48px] border-2 border-dashed border-amber-200 flex flex-col items-center px-6">
                  <Heart className="w-12 h-12 md:w-16 md:h-16 text-slate-200 mb-6" />
                  <h3 className="text-xl md:text-2xl font-black text-blue-900 mb-4 tracking-tighter page-sub-heading-animate">Your wishlist is empty</h3>
                  <button onClick={() => handleNavigate('shop')} className="bg-slate-950 text-white px-8 md:px-10 py-3 md:py-4 rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-widest">Explore Collections</button>
                </div>
              )}
            </div>
          )}
        </main>
        <Footer onNavigate={handleNavigate} />
        {quickView && <QuickViewModal product={quickView} onClose={() => setQuickView(null)} onAdd={addToCart} isWish={wishlist.includes(quickView.id)} />}
        
        {/* Dynamic Scroll Navigator */}
        <div className="fixed bottom-10 right-10 z-[90] pointer-events-none">
          {showScrollArrow === 'down' && (
            <div 
              className="bg-amber-50/80 backdrop-blur-md p-4 rounded-full border border-amber-200 shadow-xl pointer-events-auto cursor-pointer group transition-all hover:scale-110 active:scale-95"
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
            >
              <ChevronDown className="w-6 h-6 text-blue-800 group-hover:scale-110 transition-transform" />
            </div>
          )}
          {showScrollArrow === 'up' && (
            <div 
              className="bg-amber-50/80 backdrop-blur-md p-4 rounded-full border border-amber-200 shadow-xl pointer-events-auto cursor-pointer group transition-all hover:scale-110 active:scale-95"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <ChevronUp className="w-6 h-6 text-blue-800 group-hover:scale-110 transition-transform" />
            </div>
          )}
        </div>

        {toast && (
          <div className="fixed bottom-6 md:bottom-10 right-6 md:right-10 z-[100] animate-fadeIn bg-amber-50">
             <div className="bg-slate-950 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl shadow-2xl flex items-center gap-3 md:gap-4 border border-slate-800">
               <div className="bg-blue-600 p-1 md:p-1.5 rounded-lg"><Check className="w-3 h-3 md:w-4 md:h-4" /></div>
               <span className="font-black text-[8px] md:text-[10px] uppercase tracking-widest">{toast}</span>
             </div>
          </div>
        )}
      </div>
    </>
  );
}

const OrderSuccessPage = ({ order, onNavigate }: { order: Order | null; onNavigate: (p: string) => void }) => {
  if (!order) return null;
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 md:py-40 text-center animate-fadeIn bg-amber-50">
      <div className="bg-amber-50 p-10 md:p-20 rounded-[50px] md:rounded-[80px] border border-amber-200 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-amber-500"></div>
        <div className="w-20 h-20 md:w-28 md:h-28 bg-amber-500 text-white rounded-[30px] md:rounded-[40px] flex items-center justify-center mx-auto mb-10 md:mb-12 shadow-2xl animate-bounce">
          <CheckCircle className="w-10 h-10 md:w-14 md:h-14" />
        </div>
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1] md:leading-[1.1] mb-6 text-blue-800 heading-gradient-text" style={{backgroundSize: '200% 200%', animation: 'headingGradientShift 6s ease-in-out infinite'}}><span className="block">Deployment<br /><span className="italic">Successful.</span></span></h2>
        <p className="text-slate-500 font-medium mb-10 md:mb-12 max-w-md mx-auto leading-relaxed">Your archival acquisition has been authenticated and initialized. Tracking telemetry is now active for Node {order.id}.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => onNavigate('shop')} className="bg-slate-950 text-white px-10 md:px-12 py-4 md:py-5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-3">Continue Exploring</button>
        </div>
      </div>
    </div>
  );
};

const ProfilePage = ({ user, orders, onNavigate }: { user: User; orders: Order[]; onNavigate: (p: string) => void }) => {
  const stats = useMemo(() => ({
    count: orders.length,
    total: orders.reduce((a, b) => a + b.total, 0)
  }), [orders]);
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 animate-fadeIn bg-amber-50">
      <SectionHeader title="Curator Profile" subtitle="Identity Node" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-16">
        <div className="bg-amber-50 p-10 md:p-14 rounded-[40px] md:rounded-[60px] shadow-sm border border-amber-200 text-center flex flex-col items-center">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-[32px] md:rounded-[48px] bg-slate-950 text-white flex items-center justify-center text-4xl md:text-5xl font-black mb-8 shadow-2xl">{user.name[0]}</div>
          <h3 className="text-2xl md:text-3xl font-black text-blue-900 tracking-tighter mb-2 page-sub-heading-animate">{user.name}</h3>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-10">{user.email}</p>
          <div className="w-full space-y-4">
             <div className="p-6 bg-amber-50 rounded-[24px] border border-amber-200 flex justify-between items-center text-left">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Value</span>
                <span className="text-lg font-black text-blue-900">₹{stats.total.toLocaleString()}</span>
             </div>
             <div className="p-6 bg-amber-50 rounded-[24px] border border-amber-200 flex justify-between items-center text-left">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Acquisitions</span>
                <span className="text-lg font-black text-blue-900">{stats.count}</span>
             </div>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-slate-950 text-white p-10 md:p-16 rounded-[40px] md:rounded-[60px] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/20 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1] md:leading-[0.9] mb-8 md:mb-10 bg-gradient-to-br from-red-100 via-white to-blue-100 bg-clip-text text-transparent heading-gradient-text" style={{backgroundSize: '200% 200%', animation: 'headingGradientShift 6s ease-in-out infinite'}}><span className="block">Archival<br /><span className="italic">Preferences.</span></span></h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Default Currency</label>
                    <div className="p-4 bg-amber-50/5 rounded-2xl border border-white/10 font-black text-sm">INR - Indian Rupee</div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Fulfillment Priority</label>
                    <div className="p-4 bg-amber-50/5 rounded-2xl border border-white/10 font-black text-sm">Archival Elite Standard</div>
                 </div>
              </div>
           </div>
           <div className="flex gap-4">
              <button onClick={() => onNavigate('orders')} className="flex-1 bg-amber-50 p-8 rounded-[32px] border border-amber-200 shadow-sm hover:border-blue-500 transition-all text-left group">
                 <Package className="w-8 h-8 text-blue-800 mb-6 group-hover:scale-110 transition-transform" />
                 <h4 className="font-black text-blue-900 uppercase text-xs tracking-widest mb-2 page-sub-heading-animate">Order Ledger</h4>
                 <p className="text-slate-400 text-[11px] font-medium leading-relaxed">Access full acquisition history and fulfillment documentation.</p>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

const OrdersPage = ({ orders, onNavigate }: { orders: Order[]; onNavigate: (p: string) => void }) => (
  <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 animate-fadeIn bg-amber-50">
    <SectionHeader title="Purchase Archive" subtitle="Acquisition Ledger" />
    {orders.length > 0 ? (
      <div className="space-y-8 md:space-y-10">
        {orders.map(order => (
          <div key={order.id} className="bg-amber-50 p-8 md:p-12 rounded-[40px] md:rounded-[50px] border border-amber-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-8 group hover:shadow-xl transition-all duration-500">
            <div className="flex items-center gap-6 md:gap-10">
               <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-50 rounded-[24px] flex items-center justify-center text-slate-200 group-hover:bg-blue-600 group-hover:text-white transition-all"><Package className="w-8 h-8" /></div>
               <div>
                  <div className="flex items-center gap-3 mb-2">
                     <span className="text-[10px] font-black text-blue-800 uppercase tracking-widest">{order.id}</span>
                     <Badge color="bg-amber-500">{order.status}</Badge>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-blue-900 tracking-tight card-heading-animate">Archival Batch Deployment</h3>
                  <p className="text-slate-400 text-xs md:text-sm font-medium mt-1">Acquired on {new Date(order.createdAt).toLocaleDateString()}</p>
               </div>
            </div>
            <div className="flex flex-row md:flex-col justify-between items-center md:items-end w-full md:w-auto mt-6 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 border-slate-50 gap-4">
               <span className="text-2xl md:text-3xl font-black text-blue-900 tracking-tighter">₹{order.total.toLocaleString()}</span>
               <button onClick={() => onNavigate('shop')} className="px-6 md:px-8 py-2.5 md:py-3 bg-slate-950 text-white rounded-full font-black text-[9px] uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-3">Details <ArrowRight className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="py-24 md:py-40 text-center bg-amber-50 rounded-[40px] md:rounded-[60px] border-2 border-dashed border-amber-200 flex flex-col items-center px-6">
         <Package className="w-16 h-16 text-slate-100 mb-8" />
         <h3 className="text-2xl font-black text-blue-900 mb-4 page-sub-heading-animate">No acquisitions found</h3>
         <button onClick={() => onNavigate('shop')} className="bg-slate-950 text-white px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest">Initiate Discovery</button>
      </div>
    )}
  </div>
);

const QuickViewModal = ({ product, onClose, onAdd, isWish }: any) => (
  <div 
    className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-950/60 backdrop-blur-xl animate-fadeIn bg-amber-50 cursor-pointer"
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div className="bg-amber-50 w-full max-w-4xl rounded-[40px] md:rounded-[50px] overflow-hidden shadow-2xl relative animate-scaleIn border border-amber-200 flex flex-col md:flex-row h-full max-h-[80vh] md:max-h-[75vh] cursor-default">
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 md:top-6 md:right-6 p-2 md:p-3 bg-amber-50/80 backdrop-blur-md rounded-xl hover:bg-red-600 hover:text-white transition-all z-20 shadow-lg border border-amber-200 group"
      >
        <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
      </button>
      <div className="w-full md:w-1/2 relative bg-amber-50 overflow-hidden h-48 md:h-auto">
        <img src={product.image} className="w-full h-full object-cover" alt="" />
        {product.discount && <div className="absolute top-4 left-4 md:top-8 md:left-8 bg-red-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg shrink-0">-{product.discount}% UNLOCKED</div>}
      </div>
      <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col overflow-y-auto">
        <div className="flex gap-4 mb-4 md:mb-6">
           <Badge>{product.category}</Badge>
           {product.isNewArrival && <Badge color="bg-orange-500">NEW ARRIVAL</Badge>}
        </div>
        <h2 className="text-2xl md:text-4xl font-black text-blue-900 tracking-tighter mb-3 md:mb-4 modal-heading-animate">{product.name}</h2>
        <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8">
           <span className="text-2xl md:text-3xl font-black text-blue-800 tracking-tighter">₹{product.price.toLocaleString()}</span>
           <div className="w-px h-6 bg-slate-200" />
           <div className="flex items-center gap-2 text-orange-500 font-black text-base md:text-lg"><Star className="w-5 h-5 fill-current" /> {product.rating}</div>
        </div>
        <p className="text-slate-500 font-medium leading-relaxed mb-6 text-sm md:text-base border-l-4 border-amber-200 pl-6 italic">"{product.description}"</p>
        <div className="space-y-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
            <div className="flex items-center gap-2 text-blue-800">
               <Users className="w-4 h-4 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest text-blue-800">12 Viewing now</span>
            </div>
            <div className="w-px h-3 bg-blue-200" />
            <div className="flex items-center gap-2 text-emerald-600">
               <TrendingUp className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800">High Demand</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-orange-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating ?? 4.5) ? 'fill-current' : 'text-slate-200'}`} />
              ))}
            </div>
            <span className="text-xs font-black tracking-widest text-slate-500">{product.rating?.toFixed(1)} / 5</span>
            <span className="text-[10px] font-semibold text-slate-400">(Based on 142 reviews)</span>
          </div>
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Top Reviews</h4>
            {[
              { user: 'Avery', comment: 'Beautiful quality, exactly as described. Worth every penny.', rating: 5 },
              { user: 'Jordan', comment: 'Superb craftsmanship but shipping took a little longer.', rating: 4 },
              { user: 'Riley', comment: 'Looks amazing in person! Will buy again.', rating: 5 }
            ].map((rev, i) => (
              <div key={i} className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-green-700">{rev.user}</span>
                  <div className="flex items-center gap-1 text-orange-500">
                    {Array.from({ length: 5 }).map((_, star) => (
                      <Star key={star} className={`w-3 h-3 ${star < rev.rating ? 'fill-current' : 'text-slate-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-amber-200">
           <div className="flex gap-3">
              <button onClick={() => { onAdd(product.id); onClose(); }} className="flex-1 bg-slate-950 text-white py-4 md:py-5 rounded-2xl md:rounded-[32px] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl flex items-center justify-center gap-3 group active:scale-95">
                Add to Bag <ShoppingCart className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
              </button>
              <button className="w-14 items-center justify-center border-2 border-amber-200 rounded-2xl md:rounded-[32px] hover:border-rose-500 hover:text-red-600 transition-all bg-amber-50 hidden md:flex active:scale-90 shadow-sm"><Heart className="w-5 h-5" /></button>
           </div>
           <button className="w-full bg-blue-600 text-white py-4 rounded-xl md:rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2 group active:scale-95">
             <Zap className="w-3.5 h-3.5 fill-current" /> Initialize Instant Checkout
           </button>
           <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Complimentary Express Delivery Included</p>
        </div>
      </div>
    </div>
  </div>
);

// --- Informational Pages Components ---

const SupportPage = ({ onNavigate }: any) => (
    <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 animate-fadeIn bg-amber-50">
        <SectionHeader title="Support Center" subtitle="Assistance Hub" centered />
        <div className="space-y-8 md:space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="bg-amber-50 p-8 md:p-10 rounded-[30px] md:rounded-[40px] shadow-sm border border-amber-200">
                    <Mail className="w-8 h-8 md:w-10 md:h-10 text-blue-800 mb-6" />
                    <h3 className="text-lg md:text-xl font-black mb-2 page-sub-heading-animate">Digital Inquiry</h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">Reach out via support@clickbazaar.com for standard assistance within 4 hours.</p>
                </div>
            </div>
            <div className="bg-slate-950 text-white p-8 md:p-12 rounded-[40px] md:rounded-[60px] shadow-2xl">
                <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1] md:leading-[0.9] mb-8 bg-gradient-to-br from-red-100 via-white to-blue-100 bg-clip-text text-transparent heading-gradient-text" style={{backgroundSize: '200% 200%', animation: 'headingGradientShift 6s ease-in-out infinite'}}><span className="block">Frequently<br /><span className="italic">Asked.</span></span></h3>
                <div className="space-y-6">
                    <details className="group cursor-pointer">
                        <summary className="font-black text-sm uppercase tracking-widest list-none flex justify-between items-center group-open:text-blue-800">How do I track my shipment? <ChevronDown className="w-4 h-4" /></summary>
                        <p className="mt-4 text-slate-400 text-sm leading-relaxed">Log into your account and navigate to the 'Live Tracking' node for real-time telemetry of your acquisition.</p>
                    </details>
                    <div className="h-px bg-slate-800" />
                    <details className="group cursor-pointer">
                        <summary className="font-black text-sm uppercase tracking-widest list-none flex justify-between items-center group-open:text-blue-800">What is the return policy? <ChevronDown className="w-4 h-4" /></summary>
                        <p className="mt-4 text-slate-400 text-sm leading-relaxed">We offer a 30-day elite return window for all archival pieces in their original authenticated state.</p>
                    </details>
                </div>
            </div>
        </div>
    </div>
);

const PrivacyPage = ({ onNavigate }: any) => (
    <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 animate-fadeIn bg-amber-50">
        <SectionHeader title="Privacy Node" subtitle="Data Security" centered />
        <div className="bg-amber-50 p-8 md:p-16 rounded-[40px] md:rounded-[60px] shadow-sm border border-amber-200 text-green-700 font-medium leading-loose text-sm md:text-base">
            <Lock className="w-12 h-12 md:w-16 md:h-16 text-blue-800 mb-8 md:mb-10" />
            <h3 className="text-xl md:text-2xl font-black text-blue-900 mb-6 page-sub-heading-animate">Your Security, Our Priority</h3>
            <p className="mb-8">At <span className="clickbazaar-brand">Click Bazaar</span>, we employ military-grade encryption to protect your identity and transaction history. Every piece of telemetry collected is used solely to enhance your curated experience and ensure logistical precision.</p>
            <ul className="space-y-4 mb-10">
                <li className="flex gap-4 items-start"><Check className="w-5 h-5 text-blue-800 shrink-0 mt-1" /> No third-party data brokerage of individual identities.</li>
                <li className="flex gap-4 items-start"><Check className="w-5 h-5 text-blue-800 shrink-0 mt-1" /> End-to-end encrypted transaction ledger.</li>
                <li className="flex gap-4 items-start"><Check className="w-5 h-5 text-blue-800 shrink-0 mt-1" /> Real-time monitoring of account access nodes.</li>
            </ul>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Version 2025.1.0 ARCHIVE</p>
        </div>
    </div>
);

const TermsPage = ({ onNavigate }: any) => (
    <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 animate-fadeIn bg-amber-50">
        <SectionHeader title="Terms of Use" subtitle="User Protocol" centered />
        <div className="bg-amber-50 p-8 md:p-16 rounded-[40px] md:rounded-[60px] border border-slate-200">
            <h3 className="text-lg md:text-xl font-black text-blue-900 mb-8 uppercase tracking-widest page-sub-heading-animate">General protocols</h3>
            <div className="space-y-8 text-slate-500 text-sm leading-relaxed">
                <p>By accessing the <span className="clickbazaar-brand">Click Bazaar</span> network, you agree to the protocols defined in our archival agreement. Our services are provided to authenticated curators only.</p>
                <div className="bg-amber-50 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-amber-200">
                    <h4 className="font-black text-blue-900 mb-4 text-[10px] md:text-xs uppercase tracking-widest card-heading-animate">1. Registration</h4>
                    <p>Curators must provide valid legal identity identifiers. Multiple account creation for speculative acquisition is strictly prohibited within the ecosystem.</p>
                </div>
                <div className="bg-amber-50 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-amber-200">
                    <h4 className="font-black text-blue-900 mb-4 text-[10px] md:text-xs uppercase tracking-widest card-heading-animate">2. Fulfillment</h4>
                    <p>All logistical estimations are subject to global freight telemetry. <span className="clickbazaar-brand">Click Bazaar</span> ensures priority handling for all Elite acquisitions.</p>
                </div>
            </div>
        </div>
    </div>
);

const LegalPage = ({ onNavigate }: any) => (
    <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 animate-fadeIn bg-amber-50">
        <SectionHeader title="Legal Archive" subtitle="Regulatory Node" centered />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="bg-amber-50 p-10 md:p-12 rounded-[40px] md:rounded-[50px] shadow-sm border border-amber-200">
                <Scale className="w-10 h-10 md:w-12 md:h-12 text-blue-800 mb-8" />
                <h3 className="text-xl md:text-2xl font-black text-blue-900 mb-4 tracking-tighter page-sub-heading-animate">Compliance</h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-8 text-sm">Full adherence to international e-commerce regulations and archival standards. Our legal node is continuously audited for transparency.</p>
                <Badge color="bg-slate-950">Verified</Badge>
            </div>
            <div className="bg-amber-50 p-10 md:p-12 rounded-[40px] md:rounded-[50px] shadow-sm border border-amber-200">
                <ShieldCheck className="w-10 h-10 md:w-12 md:h-12 text-blue-800 mb-8" />
                <h3 className="text-xl md:text-2xl font-black text-blue-900 mb-4 tracking-tighter page-sub-heading-animate">Intellectual Property</h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-8 text-sm">All curated content, archival descriptions, and telemetry interfaces are proprietary assets of <span className="clickbazaar-brand">Click Bazaar</span> Global Archive.</p>
                <Badge color="bg-slate-950">Protected</Badge>
            </div>
        </div>
    </div>
);

// --- Live Tracking View Component ---

const LiveTrackingView = ({ orders, onNavigate }: { orders: Order[], onNavigate: (p: string) => void }) => {
  const latestOrder = orders.length > 0 ? orders[0] : null;
  if (!latestOrder) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 md:py-40 animate-fadeIn bg-amber-50 text-center flex flex-col items-center">
        <Radar className="w-16 h-16 md:w-24 md:h-24 text-slate-200 mb-10 animate-pulse" />
        <h2 className="text-2xl md:text-3xl font-black text-blue-900 tracking-tighter mb-4 page-sub-heading-animate">No active shipments detected</h2>
        <p className="text-slate-400 mb-10 max-w-sm text-sm md:text-base">Initiate an archival acquisition to activate live tracking telemetry and monitor your fulfillment in real-time.</p>
        <button onClick={() => onNavigate('shop')} className="bg-slate-950 text-white px-10 md:px-12 py-4 md:py-5 rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-colors shadow-2xl">Shop Collections</button>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 animate-fadeIn bg-amber-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-8">
        <ScrollReveal>
           <h4 className="text-blue-800 font-black uppercase text-[10px] md:text-[11px] tracking-[0.4em] mb-4 heading-subtitle">Logistics Node</h4>
           <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[1] md:leading-[0.9] text-blue-800 heading-gradient-text" style={{backgroundSize: '200% 200%', animation: 'headingGradientShift 6s ease-in-out infinite'}}>
             <span className="block">Live<br /><span className="italic">Telemetry.</span></span>
           </h1>
        </ScrollReveal>
        <div className="flex gap-4">
           <div className="bg-amber-50 px-6 md:px-8 py-4 md:py-5 rounded-[24px] md:rounded-[28px] border border-amber-200 shadow-sm flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-amber-500 animate-ping"></div>
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">Node Online</span>
           </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-16">
        <div className="lg:col-span-2 bg-amber-50 rounded-[40px] md:rounded-[60px] border border-amber-200 shadow-2xl overflow-hidden p-8 md:p-16 relative">
           <div className="flex flex-col md:flex-row justify-between items-start mb-12 md:mb-16 gap-6">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-800 tracking-widest block mb-1">Archive ID: {latestOrder.id}</span>
                <h3 className="text-2xl md:text-3xl font-black text-blue-900 tracking-tighter card-heading-animate">In Transit - Hub Departure</h3>
              </div>
              <Badge color="bg-orange-500">Accelerated Fulfillment</Badge>
           </div>
           <div className="space-y-10 md:space-y-12 relative">
             <div className="absolute left-[20px] md:left-[22px] top-4 bottom-4 w-1 bg-amber-50"></div>
             {[
               { status: 'Arrived at Destination Hub', detail: 'Local sorting facility, Mumbai', time: 'Expected Today', active: false },
               { status: 'Departed Global Sorting Node', detail: 'International Air Hub', time: '08:45 AM', active: true },
               { status: 'Package Processed', detail: <><span className="clickbazaar-brand">Click Bazaar</span> Fulfillment Center</>, time: 'Yesterday, 04:20 PM', active: false },
               { status: 'Order Authenticated', detail: 'System Validation Complete', time: 'Yesterday, 02:15 PM', active: false },
             ].map((step, i) => (
               <div key={i} className="flex gap-6 md:gap-10 relative z-10">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-[16px] md:rounded-[20px] flex items-center justify-center shrink-0 transition-all duration-500 ${step.active ? 'bg-blue-600 text-white shadow-2xl shadow-blue-200' : 'bg-amber-50 border-2 border-amber-200 text-slate-200'}`}>
                    {step.active ? <Truck className="w-5 h-5" /> : <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-current" />}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-black text-base md:text-lg tracking-tight card-heading-animate ${step.active ? 'text-blue-900' : 'text-slate-400'}`}>{step.status}</h4>
                    <p className="text-xs md:text-sm font-medium text-slate-400 mt-1">{step.detail}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-300">{step.time}</span>
                  </div>
               </div>
             ))}
           </div>
        </div>
        <div className="space-y-8 md:space-y-12">
           <div className="bg-slate-950 text-white p-8 md:p-12 rounded-[36px] md:rounded-[50px] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <h4 className="text-3xl md:text-5xl font-black tracking-tighter leading-[1] md:leading-[0.9] mb-8 bg-gradient-to-br from-red-100 via-white to-blue-100 bg-clip-text text-transparent heading-gradient-text" style={{backgroundSize: '200% 200%', animation: 'headingGradientShift 6s ease-in-out infinite'}}><span className="block">Courier<br /><span className="italic">Profile.</span></span></h4>
              <div className="flex items-center gap-5 md:gap-6 mb-10">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-[20px] md:rounded-[24px] bg-amber-50/5 flex items-center justify-center border border-white/10 shadow-inner"><UserIcon className="w-6 h-6 md:w-8 md:h-8 text-blue-800" /></div>
                <div>
                  <p className="font-black text-base md:text-lg">Vikram S.</p>
                  <p className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Elite Logistics Handler</p>
                </div>
              </div>
              <button className="w-full bg-blue-600 py-4 md:py-5 rounded-[20px] md:rounded-[24px] font-black text-[10px] uppercase tracking-widest hover:bg-amber-50 hover:text-blue-900 transition-all shadow-xl">Contact Node</button>
           </div>
           <div className="bg-amber-50 border border-amber-200 p-8 md:p-12 rounded-[36px] md:rounded-[50px] shadow-sm">
              <h4 className="text-3xl md:text-5xl font-black tracking-tighter leading-[1] md:leading-[0.9] mb-8 text-blue-800 heading-gradient-text" style={{backgroundSize: '200% 200%', animation: 'headingGradientShift 6s ease-in-out infinite'}}><span className="block">Terminal<br /><span className="italic">Destination.</span></span></h4>
              <div className="flex gap-4 md:gap-5">
                 <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-blue-50 flex items-center justify-center shrink-0"><MapPin className="w-5 h-5 md:w-6 md:h-6 text-blue-800" /></div>
                 <p className="text-xs md:text-sm font-medium text-slate-500 leading-relaxed pt-1">
                   <span className="text-blue-900 font-black text-[10px] uppercase block mb-1">Consignee</span>
                   {latestOrder.shippingAddress.fullName}<br />
                   {latestOrder.shippingAddress.address}<br />
                   {latestOrder.shippingAddress.city}, {latestOrder.shippingAddress.zip}
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Footer Component ---

const Footer = ({ onNavigate }: { onNavigate: (p: string, cat?: Category) => void }) => (
  <footer className="bg-slate-950 text-white py-20 md:py-24 border-t border-slate-900 no-print">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-24">
      <div className="col-span-1">
        <div className="flex items-center gap-2 mb-8 md:mb-10 cursor-pointer" onClick={() => onNavigate('home')}>
          <div className="bg-blue-600 p-1.5 rounded-lg"><ShoppingCart className="w-6 h-6" /></div>
          <span className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase clickbazaar-brand">Click Bazaar</span>
        </div>
        <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-sm mb-10 md:mb-12">Defining digital excellence through curated aesthetics, global archival fulfillment, and advanced archival telemetry.</p>
        <div className="flex gap-4">
           <button onClick={() => onNavigate('support')} className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-amber-50/5 flex items-center justify-center hover:bg-blue-600 transition-colors border border-white/5"><HelpCircle className="w-5 h-5" /></button>
           <button onClick={() => onNavigate('legal')} className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-amber-50/5 flex items-center justify-center hover:bg-blue-600 transition-colors border border-white/5"><Info className="w-5 h-5" /></button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-1 gap-12 md:gap-16">
        <div>
          <ScrollRevealFooter>
            <h4 className="font-black text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-slate-400 mb-8 md:mb-12">Customer Command</h4>
          </ScrollRevealFooter>
          <ul className="space-y-4 md:space-y-6">
            <li><button onClick={() => onNavigate('tracking')} className="text-[10px] md:text-xs font-black text-slate-500 hover:text-white transition-all uppercase tracking-widest flex items-center gap-3"><Radar className="w-4 h-4" /> Live Tracking</button></li>
            <li><button onClick={() => onNavigate('orders')} className="text-[10px] md:text-xs font-black text-slate-500 hover:text-white transition-all uppercase tracking-widest flex items-center gap-3"><Package className="w-4 h-4" /> Purchase Archive</button></li>
            <li><button onClick={() => onNavigate('profile')} className="text-[10px] md:text-xs font-black text-slate-500 hover:text-white transition-all uppercase tracking-widest flex items-center gap-3"><UserIcon className="w-4 h-4" /> Account Profile</button></li>
            <li><button onClick={() => onNavigate('wishlist')} className="text-[10px] md:text-xs font-black text-slate-500 hover:text-white transition-all uppercase tracking-widest flex items-center gap-3"><Heart className="w-4 h-4" /> Saved Pieces</button></li>
          </ul>
        </div>
        <div className="md:hidden">
          <ScrollRevealFooter>
            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400 mb-8">Support</h4>
          </ScrollRevealFooter>
          <ul className="space-y-4">
             <li><button onClick={() => onNavigate('support')} className="text-[10px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-widest">Support Center</button></li>
             <li><button onClick={() => onNavigate('legal')} className="text-[10px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-widest">Legal Archive</button></li>
          </ul>
        </div>
      </div>
      <div className="hidden lg:block">
        <ScrollRevealFooter>
          <h4 className="font-black text-[11px] uppercase tracking-[0.3em] text-slate-400 mb-12">Archives & Info</h4>
        </ScrollRevealFooter>
        <ul className="space-y-6">
          <li><button onClick={() => onNavigate('support')} className="text-xs font-black text-slate-500 hover:text-white transition-all uppercase tracking-widest">Support Center</button></li>
          <li><button onClick={() => onNavigate('legal')} className="text-xs font-black text-slate-500 hover:text-white transition-all uppercase tracking-widest">Legal Archive</button></li>
          <li><button onClick={() => onNavigate('privacy')} className="text-xs font-black text-slate-500 hover:text-white transition-all uppercase tracking-widest">Privacy Protocols</button></li>
          <li><button onClick={() => onNavigate('terms')} className="text-xs font-black text-slate-500 hover:text-white transition-all uppercase tracking-widest">Terms of Use</button></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 mt-20 md:mt-24 pt-10 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-8">
      <p className="text-[9px] md:text-[10px] font-black text-slate-700 uppercase tracking-widest text-center"><span className="clickbazaar-brand">© 2025 CLICK BAZAAR</span> GLOBAL ARCHIVE. ARCHITECTED FOR ELITE COMMERCE.</p>
      <div className="flex items-center gap-6 md:gap-10 text-[8px] md:text-[9px] font-black text-slate-700 uppercase tracking-[0.2em]">
        <span>ISO 9001 COMPLIANT</span>
        <span>AES-256 ENCRYPTED</span>
      </div>
    </div>
  </footer>
);

// --- Admin Components ---

const AdminDashboard = ({ users, orders, sessions, products, setProducts, onLogout, onNavigate, isMobileOpen, setIsMobileOpen }: any) => {
  const [activeTab, setActiveTab] = useState('telemetry');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const userStats = useMemo(() => {
    if (!selectedUser) return null;
    const userOrders = orders.filter((o: any) => o.userId === selectedUser.id);
    const userSessions = sessions.filter((s: any) => s.userId === selectedUser.id);
    return {
      totalOrders: userOrders.length,
      totalSpend: userOrders.reduce((a: number, b: any) => a + b.total, 0),
      sessionCount: userSessions.length,
      lastActive: userSessions[0]?.timestamp || null,
      orders: userOrders,
      sessions: userSessions
    };
  }, [selectedUser, orders, sessions]);
  return (
    <div className="min-h-screen flex bg-[#f8f9fc] animate-fadeIn bg-amber-50 flex-col md:flex-row">
      <div className="md:hidden bg-slate-950 text-white p-4 flex justify-between items-center sticky top-0 z-[60]">
         <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-blue-800" />
            <span className="font-black uppercase tracking-tighter">ARCHIVE</span>
         </div>
         <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 bg-slate-900 rounded-lg">
           {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
         </button>
      </div>
      <aside className={`w-72 bg-slate-950 text-white flex-col sticky top-0 h-screen shadow-2xl z-50 md:flex ${isMobileOpen ? 'fixed inset-0 w-full flex' : 'hidden md:flex'}`}>
        <div className="p-10 mb-8 hidden md:block">
           <div className="flex items-center gap-2 mb-2">
             <div className="bg-blue-600 p-1 rounded-lg"><LayoutDashboard className="w-5 h-5" /></div>
             <span className="text-xl font-black uppercase tracking-tighter">ARCHIVE</span>
           </div>
           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Command Center</p>
        </div>
        <nav className="flex-1 px-6 space-y-2 mt-12 md:mt-0">
           {[
             { id: 'telemetry', label: 'Telemetry Logs', icon: Activity },
             { id: 'identities', label: 'User Registry', icon: Users },
             { id: 'ledger', label: 'Order Ledger', icon: CreditCard },
             { id: 'products', label: 'Product Archive', icon: Box }
           ].map(tab => (
             <button 
               key={tab.id} onClick={() => { setActiveTab(tab.id); setSelectedUser(null); setIsMobileOpen(false); }}
               className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black text-[11px] uppercase tracking-widest ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/20' : 'text-slate-500 hover:text-white hover:bg-slate-900'}`}
             >
               <tab.icon className="w-5 h-5" /> {tab.label}
             </button>
           ))}
        </nav>
        <div className="p-8 border-t border-slate-900 space-y-4">
           <button onClick={() => onNavigate('home')} className="w-full text-left px-6 py-3 font-black text-[10px] uppercase tracking-widest text-slate-500 hover:text-white flex items-center gap-4"><ExternalLink className="w-4 h-4" /> Storefront</button>
           <button onClick={onLogout} className="w-full text-left px-6 py-3 font-black text-[10px] uppercase tracking-widest text-red-600 hover:bg-red-600/10 rounded-xl flex items-center gap-4"><LogOut className="w-4 h-4" /> Terminate</button>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-12 overflow-y-auto relative custom-scrollbar">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 md:mb-16 gap-6">
          <div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[1] md:leading-[0.9] capitalize text-blue-800 heading-gradient-text" style={{backgroundSize: '200% 200%', animation: 'headingGradientShift 6s ease-in-out infinite'}}><span className="block">{activeTab}<br /><span className="italic">Interface.</span></span></h1>
            <p className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest mt-2">Real-time system diagnostics</p>
          </div>
          <div className="flex gap-4">
             <div className="bg-amber-50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-amber-200 flex items-center gap-3 md:gap-4 shadow-sm">
                <div className="bg-blue-100 p-1.5 md:p-2 rounded-lg md:rounded-xl text-blue-800"><Timer className="w-4 h-4 md:w-5 md:h-5" /></div>
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">{sessions.length} Active Interactions</span>
             </div>
          </div>
        </div>
        <div className="overflow-x-auto bg-amber-50 rounded-[32px] md:rounded-[48px] border border-slate-50 shadow-sm">
          {activeTab === 'telemetry' && (
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="px-6 md:px-10 py-6 md:py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">User Identity</th>
                  <th className="px-6 md:px-10 py-6 md:py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Node Access Point</th>
                  <th className="px-6 md:px-10 py-6 md:py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Session ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sessions.map((s: any) => (
                  <tr key={s.id} className="hover:bg-amber-50 transition-colors">
                    <td className="px-6 md:px-10 py-4 md:py-6">
                       <div className="flex items-center gap-3 md:gap-4">
                         <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-950 text-white flex items-center justify-center font-black text-[10px] md:text-xs uppercase">{s.userName[0]}</div>
                         <div>
                            <p className="font-black text-blue-900 text-xs md:text-sm">{s.userName}</p>
                            <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest">{s.userEmail}</span>
                         </div>
                       </div>
                    </td>
                    <td className="px-6 md:px-10 py-4 md:py-6 text-[10px] md:text-[11px] font-black text-slate-500">
                      {new Date(s.timestamp).toLocaleDateString()} @ {new Date(s.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-6 md:px-10 py-4 md:py-6 font-mono text-[9px] md:text-[10px] font-bold text-blue-800">{s.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {activeTab === 'identities' && (
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="px-6 md:px-10 py-6 md:py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Registrant</th>
                  <th className="px-6 md:px-10 py-6 md:py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
                  <th className="px-6 md:px-10 py-6 md:py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-6 md:px-10 py-6 md:py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((u: User) => (
                  <tr key={u.id} className="hover:bg-amber-50 transition-colors group">
                    <td className="px-6 md:px-10 py-4 md:py-6">
                      <p className="font-black text-blue-900 text-xs md:text-sm">{u.name}</p>
                      <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase">{u.email}</p>
                    </td>
                    <td className="px-6 md:px-10 py-4 md:py-6"><Badge color={u.role === UserRole.Admin ? "bg-slate-950" : "bg-blue-600"}>{u.role}</Badge></td>
                    <td className="px-6 md:px-10 py-4 md:py-6"><span className="text-[10px] font-bold text-blue-800 uppercase tracking-widest">Active</span></td>
                    <td className="px-6 md:px-10 py-4 md:py-6">
                       <button 
                        onClick={() => setSelectedUser(u)} 
                        className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-slate-100 group-hover:bg-blue-600 group-hover:text-white rounded-lg md:rounded-xl transition-all font-black text-[9px] md:text-[10px] uppercase tracking-widest whitespace-nowrap"
                       >
                         <Eye className="w-4 h-4" /> Full Profile
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {activeTab === 'ledger' && (
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="px-6 md:px-10 py-6 md:py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Trans ID</th>
                  <th className="px-6 md:px-10 py-6 md:py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Timestamp</th>
                  <th className="px-6 md:px-10 py-6 md:py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Total Investment</th>
                  <th className="px-6 md:px-10 py-6 md:py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.map((o: any) => (
                  <tr key={o.id} className="hover:bg-amber-50 transition-colors">
                    <td className="px-6 md:px-10 py-4 md:py-6 font-mono font-bold text-[10px] md:text-xs text-blue-800">{o.id}</td>
                    <td className="px-6 md:px-10 py-4 md:py-6 text-[9px] md:text-[10px] font-bold text-slate-400 uppercase">
                      {new Date(o.createdAt).toLocaleDateString()} @ {new Date(o.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="px-6 md:px-10 py-4 md:py-6 font-black text-xs md:text-sm text-blue-900">₹{o.total.toLocaleString()}</td>
                    <td className="px-6 md:px-10 py-4 md:py-6"><Badge color="bg-amber-500">{o.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {activeTab === 'products' && (
            <div className="p-6 md:p-10">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-blue-900 uppercase tracking-tight">Product Management Node</h2>
                <Badge color="bg-blue-600">Total: {products.length}</Badge>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {products.map((product: Product) => (
                  <div key={product.id} className="bg-amber-50 rounded-[32px] p-8 border border-amber-200 flex gap-8 group hover:bg-amber-50 hover:shadow-xl transition-all">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden shrink-0 bg-amber-50 shadow-inner">
                      <img src={product.image} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-black text-blue-900 text-lg leading-tight">{product.name}</h3>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{product.category}</span>
                        </div>
                        <span className="font-black text-blue-800">₹{product.price.toLocaleString()}</span>
                      </div>
                      <p className="text-slate-400 text-[10px] font-medium leading-relaxed italic line-clamp-3">
                        {product.description || "No archival telemetry provided."}
                      </p>
                      <div className="pt-2 flex gap-3">
                        <button 
                          onClick={async (e) => {
                            const btn = e.currentTarget;
                            btn.classList.add('animate-pulse', 'bg-blue-600', 'text-white');
                            const newDesc = await getProductDescription(product.name, product.category);
                            if (newDesc) {
                              setProducts((prevItems: Product[]) => prevItems.map(p => p.id === product.id ? { ...p, description: newDesc } : p));
                            }
                            btn.classList.remove('animate-pulse', 'bg-blue-600', 'text-white');
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-slate-200 rounded-xl font-black text-[9px] uppercase tracking-widest hover:border-blue-600 hover:text-blue-800 transition-all shadow-sm"
                        >
                          <Sparkles className="w-3.5 h-3.5" /> AI Architecture
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
        {selectedUser && userStats && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-950/60 backdrop-blur-xl animate-fadeIn bg-amber-50">
              <div className="bg-amber-50 w-full max-w-5xl rounded-[40px] md:rounded-[60px] overflow-hidden shadow-2xl relative animate-scaleIn border border-amber-200 flex flex-col h-full max-h-[90vh]">
                 <button onClick={() => setSelectedUser(null)} className="absolute top-6 right-6 md:top-10 md:right-10 p-3 md:p-5 bg-amber-50 rounded-2xl md:rounded-3xl hover:bg-red-600 hover:text-white transition-all z-10"><X className="w-6 h-6" /></button>
                 <div className="flex flex-col md:flex-row h-full overflow-hidden">
                    <div className="md:w-1/3 bg-amber-50 p-8 md:p-12 flex flex-col items-center text-center border-r border-amber-200 overflow-y-auto shrink-0">
                       <div className="w-24 h-24 md:w-32 md:h-32 rounded-[32px] md:rounded-[48px] bg-slate-950 text-white flex items-center justify-center text-4xl md:text-5xl font-black mb-8 shadow-2xl rotate-3 shrink-0">{selectedUser.name[0]}</div>
                       <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1] md:leading-[0.9] mb-3 text-blue-800 heading-gradient-text" style={{backgroundSize: '200% 200%', animation: 'headingGradientShift 6s ease-in-out infinite'}}>{selectedUser.name}</h2>
                       <p className="text-slate-400 font-bold uppercase text-[9px] md:text-[10px] tracking-widest mb-8 md:mb-10 px-4 py-2 bg-amber-50 rounded-full border border-amber-200 truncate w-full">{selectedUser.email}</p>
                       <div className="w-full space-y-4">
                          <div className="p-5 md:p-6 bg-amber-50 rounded-[24px] md:rounded-[32px] border border-amber-200 flex flex-col items-center shadow-sm">
                             <span className="text-[8px] md:text-[9px] font-black text-blue-800 uppercase tracking-widest mb-1">Lifetime Acquisition</span>
                             <span className="text-xl md:text-2xl font-black text-blue-900">₹{userStats.totalSpend.toLocaleString()}</span>
                          </div>
                          <div className="p-5 md:p-6 bg-amber-50 rounded-[24px] md:rounded-[32px] border border-amber-200 flex flex-col items-center shadow-sm">
                             <span className="text-[8px] md:text-[9px] font-black text-blue-800 uppercase tracking-widest mb-1">Archival Hits</span>
                             <span className="text-xl md:text-2xl font-black text-blue-900">{userStats.sessionCount}</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex-1 p-8 md:p-16 overflow-y-auto custom-scrollbar">
                       <div className="grid grid-cols-1 gap-12 md:gap-16">
                          <div>
                             <h4 className="font-black text-[10px] md:text-xs uppercase tracking-[0.3em] text-blue-800 mb-6 md:mb-8 flex items-center gap-3 card-heading-animate">
                               <Activity className="w-4 h-4 md:w-5 md:h-5" /> Interaction Telemetry
                             </h4>
                             <div className="space-y-3 md:space-y-4">
                                {userStats.sessions.map((s: any) => (
                                  <div key={s.id} className="p-4 md:p-6 bg-amber-50 rounded-2xl md:rounded-[28px] flex justify-between items-center border border-amber-200">
                                     <div>
                                        <p className="text-[10px] md:text-[11px] font-black text-blue-900">System Access Node: {s.id}</p>
                                        <p className="text-[8px] md:text-[10px] font-bold text-slate-400 mt-1">
                                          {new Date(s.timestamp).toLocaleDateString()} @ {new Date(s.timestamp).toLocaleTimeString()}
                                        </p>
                                     </div>
                                     <Badge color="bg-blue-600/10 !text-blue-800 border border-blue-100">AUTH</Badge>
                                  </div>
                                ))}
                             </div>
                          </div>
                          <div>
                             <h4 className="font-black text-[10px] md:text-xs uppercase tracking-[0.3em] text-blue-800 mb-6 md:mb-8 flex items-center gap-3 card-heading-animate">
                               <CreditCard className="w-4 h-4 md:w-5 md:h-5" /> Ledger History
                             </h4>
                             <div className="space-y-4 md:space-y-6">
                                {userStats.orders.map((o: any) => (
                                  <div key={o.id} className="p-6 md:p-8 bg-amber-50 rounded-[28px] md:rounded-[36px] flex justify-between items-center border border-amber-200 group">
                                     <div>
                                        <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                                           <span className="text-[9px] md:text-[10px] font-black text-blue-800 tracking-widest uppercase">{o.id}</span>
                                           <Badge color="bg-amber-500/10 !text-green-600 text-[8px]">{o.status}</Badge>
                                        </div>
                                        <p className="text-[9px] md:text-[10px] font-bold text-slate-500">
                                          {new Date(o.createdAt).toLocaleDateString()} @ {new Date(o.createdAt).toLocaleTimeString()}
                                        </p>
                                     </div>
                                     <div className="text-right">
                                        <span className="text-xl md:text-2xl font-black text-blue-900 tracking-tighter">₹{o.total.toLocaleString()}</span>
                                     </div>
                                  </div>
                                ))}
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}
      </main>
    </div>
  );
};

// --- Auth Views ---

const AuthView = ({ mode, onAuth, onToggle }: { mode: 'login' | 'signup', onAuth: any, onToggle: () => void }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signup') onAuth(name, email, pass);
    else onAuth(email, pass);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 md:px-6 py-12 md:py-24 bg-[#f8f9fc] relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-700/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-[1100px] flex flex-col md:flex-row bg-amber-50 rounded-[40px] md:rounded-[60px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] border border-white relative z-10 overflow-hidden">
        
        {/* Visual Side Panel */}
        <div className="hidden md:flex md:w-5/12 bg-slate-950 p-12 lg:p-16 flex-col justify-between relative text-white">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-10 shadow-lg shadow-red-500/20">
              <Infinity className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-4xl lg:text-5xl font-black tracking-tighter leading-[1.1] mb-6">
              Empowering your <br />
              <span className="text-blue-800 italic">archival journey.</span>
            </h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs">
              Access the world's most curated collection of premium tech, fashion, and everyday essentials.
            </p>
          </div>

          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-amber-50/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <Shield className="w-4 h-4 text-blue-400 group-hover:text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Military Grade Encryption</span>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-amber-50/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                 <Zap className="w-4 h-4 text-blue-400 group-hover:text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Instant Node Authentication</span>
            </div>
          </div>
        </div>

        {/* Content Side */}
        <div className="w-full md:w-7/12 p-8 md:p-16 lg:p-20 flex flex-col items-center">
          <div className="w-full max-w-md">
            <div className="flex flex-col items-center md:items-start text-center md:text-left mb-10 md:mb-12">
               <div className="md:hidden bg-slate-950 w-16 h-16 rounded-[24px] flex items-center justify-center mb-6 text-white shadow-xl rotate-12">
                  {mode === 'login' ? <LogIn className="w-8 h-8" /> : <UserPlus className="w-8 h-8" />}
               </div>
               <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1] md:leading-[0.9] text-blue-900 mb-4">
                 {mode === 'login' ? 'Welcome Back.' : 'Join the Collective.'}
               </h2>
               <p className="text-slate-500 text-sm font-medium">
                 {mode === 'login' ? 'Initialize your session to continue browsing.' : 'Create your decentralized identity node.'}
               </p>
            </div>

            {mode === 'login' && (
               <div className="bg-amber-50 p-5 rounded-[28px] border border-amber-200 mb-10 group hover:border-blue-200 transition-all">
                 <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center text-blue-800">
                       <ShieldCheck className="w-4 h-4" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Master Admin Entry</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <span className="text-xs font-black text-blue-900 block">admin@clickbazaar.com</span>
                       <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Login Identity</span>
                    </div>
                    <div className="space-y-1">
                       <span className="text-xs font-black text-blue-900 block">admin123</span>
                       <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Secret Password</span>
                    </div>
                 </div>
               </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
              {mode === 'signup' && (
                <div className="group">
                  <div className={`flex items-center gap-4 bg-amber-50 border-2 rounded-[24px] px-6 py-4 transition-all ${focusedField === 'name' ? 'bg-amber-50 border-blue-600 ring-4 ring-blue-50' : 'border-transparent'}`}>
                    <UserIcon className={`w-5 h-5 transition-colors ${focusedField === 'name' ? 'text-blue-800' : 'text-slate-400'}`} />
                    <div className="flex-1">
                       <label className={`text-[8px] font-black uppercase tracking-widest block mb-0.5 transition-colors ${focusedField === 'name' ? 'text-blue-800' : 'text-slate-400'}`}>Legal Name</label>
                       <input required type="text" placeholder="John Doe" value={name} onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)} onChange={e => setName(e.target.value)} className="w-full bg-transparent border-none outline-none font-black text-sm text-blue-900 p-0 placeholder:text-slate-300" />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="group">
                <div className={`flex items-center gap-4 bg-amber-50 border-2 rounded-[24px] px-6 py-4 transition-all ${focusedField === 'email' ? 'bg-amber-50 border-blue-600 ring-4 ring-blue-50' : 'border-transparent'}`}>
                  <Mail className={`w-5 h-5 transition-colors ${focusedField === 'email' ? 'text-blue-800' : 'text-slate-400'}`} />
                  <div className="flex-1">
                     <label className={`text-[8px] font-black uppercase tracking-widest block mb-0.5 transition-colors ${focusedField === 'email' ? 'text-blue-800' : 'text-slate-400'}`}>Email Address</label>
                     <input required type="email" placeholder="archive@node.com" value={email} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} onChange={e => setEmail(e.target.value)} className="w-full bg-transparent border-none outline-none font-black text-sm text-blue-900 p-0 placeholder:text-slate-300" />
                  </div>
                </div>
              </div>

              <div className="group">
                <div className={`flex items-center gap-4 bg-amber-50 border-2 rounded-[24px] px-6 py-4 transition-all ${focusedField === 'pass' ? 'bg-amber-50 border-blue-600 ring-4 ring-blue-50' : 'border-transparent'}`}>
                  <Lock className={`w-5 h-5 transition-colors ${focusedField === 'pass' ? 'text-blue-800' : 'text-slate-400'}`} />
                  <div className="flex-1">
                     <label className={`text-[8px] font-black uppercase tracking-widest block mb-0.5 transition-colors ${focusedField === 'pass' ? 'text-blue-800' : 'text-slate-400'}`}>Security Password</label>
                     <input required type="password" placeholder="••••••••" value={pass} onFocus={() => setFocusedField('pass')} onBlur={() => setFocusedField(null)} onChange={e => setPass(e.target.value)} className="w-full bg-transparent border-none outline-none font-black text-sm text-blue-900 p-0 placeholder:text-slate-300" />
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white h-16 md:h-18 rounded-[24px] md:rounded-[32px] font-black text-base md:text-lg hover:bg-slate-950 transition-all shadow-xl shadow-red-500/20 active:scale-95 flex items-center justify-center gap-3 group mt-4">
                 {mode === 'login' ? 'Authenticate Access' : 'Register Identity'}
                 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-12 text-center">
               <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">Network Protocols</p>
               <button onClick={onToggle} className="text-blue-900 font-black text-[11px] md:text-xs uppercase tracking-[0.2em] hover:text-blue-800 transition-colors flex items-center gap-3 mx-auto">
                 <div className="w-6 h-px bg-slate-200"></div>
                 {mode === 'login' ? 'Create New Collective Account' : 'Return to Identity Access'}
                 <div className="w-6 h-px bg-slate-200"></div>
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Product Card Component ---

const ProductCard: React.FC<{product: Product; onAdd: () => void; onQuick: () => void; isWish: boolean; onWish: () => void;}> = ({ product, onAdd, onQuick, isWish, onWish }) => {
  return (
    <div 
      className="premium-card group bg-amber-50 rounded-[32px] md:rounded-[48px] overflow-hidden flex flex-col border border-slate-50 shadow-sm relative transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] h-full"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-amber-50">
        <img src={product.image} className="w-full h-full object-cover transition-transform duration-[1s] ease-out" alt={product.name} />
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 lg:group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 md:gap-5 backdrop-blur-[2px]">
          <button onClick={onQuick} className="bg-amber-50 p-4 md:p-5 rounded-[20px] md:rounded-[24px] text-blue-900 shadow-xl transition-all duration-300 hover:bg-blue-600 hover:text-white"><Eye className="w-5 h-5 md:w-6 md:h-6" /></button>
          <button onClick={onAdd} className="bg-amber-50 p-4 md:p-5 rounded-[20px] md:rounded-[24px] text-blue-900 shadow-xl transition-all duration-300 hover:bg-blue-600 hover:text-white"><Plus className="w-5 h-5 md:w-6 md:h-6" /></button>
        </div>
        {/* Mobile-only action indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center lg:hidden gap-3 pointer-events-none px-4 opacity-70">
          <button className="bg-amber-50/80 p-2 rounded-lg pointer-events-auto" onClick={onQuick}><Eye className="w-4 h-4" /></button>
          <button className="bg-amber-50/80 p-2 rounded-lg pointer-events-auto" onClick={onAdd}><Plus className="w-4 h-4" /></button>
        </div>
        {product.discount && (
          <div style={{ transform: "translateZ(50px)" }} className="absolute top-6 md:top-8 left-6 md:left-8 flex flex-col gap-2 md:gap-3">
            <div className="bg-red-600 text-white text-[8px] md:text-[10px] font-black px-3 md:px-4 py-1 md:py-1.5 rounded-full shadow-lg">-{product.discount}%</div>
            {product.isLimitedOffer && <div className="bg-slate-950 text-white text-[8px] md:text-[10px] font-black px-3 md:px-4 py-1 md:py-1.5 rounded-full shadow-lg">FLASH</div>}
          </div>
        )}
        <button style={{ transform: "translateZ(50px)" }} onClick={onWish} className={`absolute top-6 md:top-8 right-6 md:right-8 p-3 md:p-4 rounded-[20px] md:rounded-[24px] backdrop-blur-xl transition-all duration-300 shadow-xl ${isWish ? 'bg-red-600 text-white scale-110' : 'bg-amber-50/80 text-slate-400 hover:text-red-600'}`}>
          <Heart className={`w-4 h-4 md:w-5 md:h-5 ${isWish ? 'fill-current' : ''}`} />
        </button>
      </div>
      <div style={{ transform: "translateZ(50px)" }} className="p-6 md:p-10 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2 md:mb-3">
          <h3 className="text-lg md:text-xl font-black text-blue-900 tracking-tight leading-tight group-hover:text-blue-800 transition-colors card-heading-animate">{product.name}</h3>
          <div className="text-right shrink-0">
            <span className="text-base md:text-xl font-black text-blue-800 tracking-tighter block">₹{product.price.toLocaleString('en-IN')}</span>
            {product.discount && <span className="text-[9px] md:text-[11px] font-bold text-slate-300 line-through">₹{(Math.round(product.price / (1 - product.discount/100))).toLocaleString()}</span>}
          </div>
        </div>
        <p className="text-slate-400 text-[10px] md:text-xs font-medium line-clamp-2 italic mb-6 md:mb-10 flex-1 leading-relaxed">"{product.description}"</p>
        <div className="pt-6 md:pt-8 border-t border-slate-50 flex justify-between items-center">
          <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 truncate mr-2">{product.category}</span>
          <div className="flex items-center gap-1 px-2 md:px-3 py-0.5 md:py-1 bg-orange-50 rounded-full text-orange-500 font-black text-[8px] md:text-[10px]"><Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" /> {product.rating || '4.5'}</div>
        </div>
      </div>
    </div>
  );
};

// --- Cart and Checkout Support Components ---

const CartPage = ({ cart, products, onRemove, onAdd, onCheckout, onNavigate }: any) => {
  const items = cart.map((c: any) => ({ ...c, product: products.find((p: any) => p.id === c.productId)! }));
  const total = items.reduce((a: number, b: any) => a + (b.product.price * b.quantity), 0);
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 animate-fadeIn bg-amber-50">
      <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[1] md:leading-[0.9] mb-12 md:mb-20 text-blue-800 heading-gradient-text" style={{backgroundSize: '200% 200%', animation: 'headingGradientShift 6s ease-in-out infinite'}}>
        Curated <span className="italic">Bag</span>
      </h2>
      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24">
          <div className="lg:col-span-2 space-y-8 md:space-y-10">
            {items.map((item: any) => (
              <div key={item.productId} className="flex flex-col sm:flex-row gap-8 md:gap-12 bg-amber-50 p-8 md:p-12 rounded-[40px] md:rounded-[60px] border border-slate-50 shadow-sm relative group hover:shadow-xl transition-all duration-500">
                <div className="w-full sm:w-48 h-48 rounded-[32px] md:rounded-[40px] overflow-hidden bg-amber-50 shrink-0"><img src={item.product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" /></div>
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div className="flex justify-between items-start">
                    <div>
                       <Badge color="bg-blue-600/10 !text-blue-800 mb-3">{item.product.category}</Badge>
                       <h3 className="text-2xl md:text-3xl font-black text-blue-900 tracking-tight leading-tight card-heading-animate">{item.product.name}</h3>
                    </div>
                    <button onClick={() => onRemove(item.productId, true)} className="p-3 md:p-4 bg-rose-50 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl transition-all shadow-sm"><Trash2 className="w-5 h-5 md:w-6 md:h-6" /></button>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-8 md:pt-10 border-t border-slate-50 gap-6 sm:gap-0">
                    <span className="font-black text-xl md:text-2xl text-blue-900 tracking-tighter">₹{item.product.price.toLocaleString()}</span>
                    <div className="flex items-center gap-4 bg-amber-50 px-4 md:px-5 py-2 md:py-3 rounded-full border border-amber-200">
                       <button onClick={() => onRemove(item.productId)} className="w-8 h-8 flex items-center justify-center bg-amber-50 rounded-full shadow-sm hover:bg-rose-50 text-slate-400 hover:text-red-600 transition-colors"><ChevronDown className="w-4 h-4" /></button>
                       <div className="flex flex-col items-center min-w-[32px]">
                         <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Qty</span>
                         <span className="text-base md:text-lg font-black text-blue-900 leading-none">{item.quantity}</span>
                       </div>
                       <button onClick={() => onAdd(item.productId)} className="w-8 h-8 flex items-center justify-center bg-amber-50 rounded-full shadow-sm hover:bg-blue-50 text-slate-400 hover:text-red-600 transition-colors"><ChevronUp className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-slate-950 p-8 md:p-16 rounded-[40px] md:rounded-[70px] text-white shadow-2xl h-fit sticky top-28 overflow-hidden relative">
             <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
             <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1] md:leading-[0.9] mb-10 md:mb-12 bg-gradient-to-br from-red-100 via-white to-blue-100 bg-clip-text text-transparent heading-gradient-text" style={{backgroundSize: '200% 200%', animation: 'headingGradientShift 6s ease-in-out infinite'}}><span className="block"><span className="italic">Summary.</span></span></h3>
             <div className="space-y-4 md:space-y-6 mb-10 md:mb-12">
                <div className="flex justify-between items-center text-slate-400 text-xs md:text-sm font-bold uppercase tracking-widest">
                   <span>Archival Value</span><span>₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400 text-xs md:text-sm font-bold uppercase tracking-widest">
                   <span>Node Status</span><span className="text-blue-800">PRIORITY</span>
                </div>
             </div>
             <div className="flex justify-between items-center py-8 md:py-12 font-black text-4xl md:text-5xl text-blue-800 tracking-tighter border-y border-white/10">
               <span>Total</span><span>₹{total.toLocaleString()}</span>
             </div>
             <button onClick={onCheckout} className="w-full bg-blue-600 text-white py-6 md:py-8 rounded-[28px] md:rounded-[40px] font-black text-lg md:text-xl hover:bg-amber-50 hover:text-blue-900 transition-all shadow-2xl uppercase tracking-widest mt-10 md:mt-12 flex items-center justify-center gap-4 group">Finalize Node <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform" /></button>
          </div>
        </div>
      ) : (
        <div className="py-24 md:py-40 text-center bg-amber-50 rounded-[40px] md:rounded-[70px] border-2 border-dashed border-amber-200 flex flex-col items-center px-6">
           <ShoppingCart className="w-16 h-16 md:w-24 md:h-24 text-slate-100 mb-8 md:mb-10" />
           <h3 className="text-3xl md:text-4xl font-black text-blue-900 mb-4 md:mb-6 tracking-tighter page-sub-heading-animate">Your Archive is Empty</h3>
           <p className="text-slate-400 mb-10 md:mb-12 max-w-sm font-medium text-sm md:text-base">Begin your premium acquisition journey by exploring our world-class collections.</p>
           <button onClick={() => onNavigate('shop')} className="bg-slate-950 text-white px-10 md:px-14 py-4 md:py-6 rounded-full font-black text-[9px] md:text-[11px] uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-2xl">Explore Collections</button>
        </div>
      )}
    </div>
  );
};

const CheckoutPage = ({ cart, products, onComplete, onBack, onAdd, onRemove }: any) => {
  const [shipping, setShipping] = useState({ fullName: '', address: '', city: '', zip: '' });
  const items = cart.map((c: any) => ({ ...c, product: products.find((p: any) => p.id === c.productId)! }));
  const total = items.reduce((a: number, b: any) => a + (b.product.price * b.quantity), 0);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(shipping);
  };
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 animate-fadeIn bg-amber-50">
      <button onClick={onBack} className="flex items-center gap-2 font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-slate-400 hover:text-blue-900 mb-10 md:mb-12 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Return to Bag
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
        <div>
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[1] md:leading-[0.9] mb-10 md:mb-12 text-blue-800 heading-gradient-text" style={{backgroundSize: '200% 200%', animation: 'headingGradientShift 6s ease-in-out infinite'}}>
            <span className="block">Shipping<br /><span className="italic">Node.</span></span>
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            <div className="space-y-2">
              <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                required
                value={shipping.fullName}
                onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                className="w-full bg-amber-50 border border-amber-200 px-6 md:px-8 py-5 md:py-6 rounded-[24px] md:rounded-[32px] text-blue-900 font-black focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm md:text-base outline-none"
                placeholder="Ex. John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Archival Location (Address)</label>
              <input 
                required
                value={shipping.address}
                onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                className="w-full bg-amber-50 border border-amber-200 px-6 md:px-8 py-5 md:py-6 rounded-[24px] md:rounded-[32px] text-blue-900 font-black focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm md:text-base outline-none"
                placeholder="Ex. 73 Premium District"
              />
            </div>
            <div className="grid grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City Node</label>
                <input 
                  required
                  value={shipping.city}
                  onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                  className="w-full bg-amber-50 border border-amber-200 px-6 md:px-8 py-4 md:py-5 rounded-[22px] md:rounded-[28px] text-blue-900 font-black focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm outline-none"
                  placeholder="Ex. Metro City"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Postcode</label>
                <input 
                  required
                  value={shipping.zip}
                  onChange={(e) => setShipping({ ...shipping, zip: e.target.value })}
                  className="w-full bg-amber-50 border border-amber-200 px-6 md:px-8 py-4 md:py-5 rounded-[22px] md:rounded-[28px] text-blue-900 font-black focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm outline-none"
                  placeholder="Ex. 10101"
                />
              </div>
            </div>
            <button type="submit" className="w-full bg-slate-950 text-white py-6 md:py-8 rounded-[28px] md:rounded-[40px] font-black text-lg md:text-xl hover:bg-blue-600 transition-all shadow-2xl uppercase tracking-widest mt-6 md:mt-8">
              Initialize Deployment
            </button>
          </form>
        </div>
        <div>
           <div className="bg-amber-50 p-8 md:p-12 rounded-[40px] md:rounded-[60px] border border-amber-200">
              <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1] md:leading-[0.9] mb-8 md:mb-10 border-b border-slate-200 pb-6 text-blue-800 heading-gradient-text" style={{backgroundSize: '200% 200%', animation: 'headingGradientShift 6s ease-in-out infinite'}}><span className="block">Acquisition<br /><span className="italic">Pool.</span></span></h3>
              <div className="space-y-6 md:space-y-8 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {items.length === 0 ? (
                  <div className="py-12 text-center bg-amber-50 rounded-3xl border-2 border-dashed border-amber-200 flex flex-col items-center px-6">
                    <Package className="w-12 h-12 text-slate-100 mb-6" />
                    <h3 className="text-xl font-black text-blue-900">Your pool is empty</h3>
                  </div>
                ) : items.map((item: any) => (
                  <div key={item.product.id} className="group flex justify-between items-center bg-amber-50 p-5 md:p-6 rounded-[32px] border border-amber-200 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-4 md:gap-6">
                      <div className="relative">
                        <img 
                          src={item.product.image} 
                          className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-2xl group-hover:scale-105 transition-transform" 
                          alt="" 
                        />
                        <span className="absolute -top-2 -right-2 w-7 h-7 bg-slate-950 text-white rounded-full flex items-center justify-center font-black text-[10px] border-2 border-white shadow-lg">{item.quantity}</span>
                      </div>
                      <div>
                        <p className="font-black text-xs md:text-sm text-blue-900 leading-tight group-hover:text-blue-800 transition-colors uppercase tracking-tight line-clamp-1">{item.product.name}</p>
                        <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase mt-1 tracking-widest">{item.product.category}</p>
                        <div className="flex items-center gap-3 mt-3 bg-amber-50 p-1 rounded-full w-fit border border-amber-200">
                          <button 
                            onClick={() => onRemove(item.product.id)}
                            className="w-6 h-6 flex items-center justify-center bg-amber-50 rounded-full text-blue-900 hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-[9px] font-black text-blue-900 min-w-[18px] text-center">{item.quantity}</span>
                          <button 
                            onClick={() => onAdd(item.product.id)}
                            className="w-6 h-6 flex items-center justify-center bg-amber-50 rounded-full text-blue-900 hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <div className="bg-blue-600 text-white px-3 py-1.5 rounded-xl shadow-lg border border-blue-500">
                        <p className="font-black text-[11px] md:text-[13px] tracking-tight">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                      </div>
                      <button 
                        onClick={() => onRemove(item.product.id, true)} 
                        className="text-[8px] font-black text-red-600 uppercase tracking-widest hover:underline opacity-0 group-hover:opacity-100 transition-opacity pr-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-800">Shipping Progress</span>
                  <span className="text-[10px] font-black text-blue-800 italic">{total >= 50000 ? 'Free Shipping Active' : `Add ₹${(50000 - total).toLocaleString()} for Free Express Delivery`}</span>
                </div>
                <div className="h-2 w-full bg-blue-100 rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-blue-600 transition-all duration-1000 ease-out" 
                     style={{ width: `${Math.min((total / 50000) * 100, 100)}%` }}
                   />
                </div>
                <div className="flex justify-between mt-2">
                   <span className="text-[8px] font-bold text-slate-400">₹0</span>
                   <span className="text-[8px] font-bold text-slate-400">₹50,000</span>
                </div>
              </div>

              <div className="mt-10 md:mt-12 pt-8 md:pt-10 border-t-2 border-dashed border-slate-200">
                 <div className="flex justify-between items-center font-black text-2xl md:text-3xl text-blue-900 tracking-tighter mb-4">
                   <span>Final Value</span>
                   <span className="text-blue-800">₹{total.toLocaleString()}</span>
                 </div>
                 <div className="flex items-center gap-3 p-4 bg-slate-100 rounded-2xl border border-slate-200/50">
                    <ShieldCheck className="w-5 h-5 text-blue-800" />
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Secured by ClickBazaar Archival Protocol</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};