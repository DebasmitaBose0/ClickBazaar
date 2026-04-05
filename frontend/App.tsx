import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
// Finalizing professional receipt telemetry via global window context
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
  Copy,
  FileText,
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
  Shield,
  Send,
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
  Key,
  Mail,
  Percent,
  MessageSquare,
  Minus,
  Twitter,
  Instagram,
  Github,
  Layers,
  Globe,
  Database,
  Loader2,
  Leaf,
  EyeOff,
  Infinity as InfinityIcon
} from 'lucide-react';
import {
  Category,
  UserRole,
  OrderStatus
} from './types';
import type {
  Product,
  User,
  AppState,
  CartItem,
  Order,
  OrderItem,
  LoginSession,
} from './types';

// ✨ Keyboard Accessibility Helper
const handleKeyboardClick = (event: React.KeyboardEvent, callback: () => void) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    callback();
  }
};

import { INITIAL_PRODUCTS, INITIAL_USERS } from './constants';
import { getProductDescription } from './services/geminiService';
import * as api from './services/api';
import Lenis from 'lenis';
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useReducedMotion } from 'framer-motion';

// Utility function to format dates as dd/mm/yyyy
const formatDate = (date: string | Date | number): string => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const WaveText = ({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) => {
  const letters = Array.from(text);
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: delay }
    }
  };
  const child: any = {
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 10, stiffness: 100 }
    },
    hidden: {
      opacity: 0,
      y: 40,
      transition: { type: "spring", damping: 10, stiffness: 100 }
    }
  };
  return (
    <motion.h2
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.5 }}
      className={`flex flex-wrap justify-center ${className}`}
    >
      {letters.map((letter, index) => (
        <motion.span variants={child} key={index} className="inline-block">
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.h2>
  );
};

const ScrollUnderline = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      style={{ scaleX }}
      className="absolute bottom-0 left-0 w-full h-[1.5px] bg-red-600 origin-center"
    />
  );
};

// --- Advanced Feature Components ---

const ScrollStyles = () => (
  <style>{`
    .heading-animate {
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .heading-visible {
      opacity: 1;
      transform: translateY(0);
    }
    @keyframes headingGradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .heading-gradient-text {
      background-size: 200% 200%;
    }
    .nav-link {
      position: relative;
      font-weight: 700;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #1e293b;
      transition: color 0.3s;
    }
    .nav-link::after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      bottom: -4px;
      left: 0;
      background-color: #2563eb;
      transition: width 0.3s;
    }
    .nav-link:hover {
      color: #2563eb;
    }
    .nav-link:hover::after {
      width: 100%;
    }
    .icon-hover-animate svg {
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .icon-hover-animate:hover svg {
      transform: scale(1.3) translateY(-4px);
    }
    .nav-link-icon-hover:hover .icon-wrapper {
      transform: scale(1.4) translateY(-3px);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .nav-link-icon-hover .icon-wrapper {
      transition: all 0.3s ease;
    }
    .icon-pop-up:hover {
      transform: scale(1.3) translateY(-2px);
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    @keyframes heroColorShift {
      0% { background-position: 0% 50%; filter: hue-rotate(0deg); }
      50% { background-position: 100% 50%; filter: hue-rotate(180deg); }
      100% { background-position: 0% 50%; filter: hue-rotate(360deg); }
    }
    .hero-dynamic-gradient {
      background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab, #ff3e3e, #ffaa00, #ffff00, #00ff00, #00ffff, #0000ff, #8b00ff, #ff00ff, #ff1493, #00ced1, #adff2f, #ff4500, #7cfc00, #00fa9a, #1e90ff, #ff6347) !important;
      background-size: 400% 400% !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      background-clip: text !important;
      color: transparent !important;
      animation: heroColorShift 15s ease infinite !important;
      display: inline-block !important;
      width: 100% !important;
      line-height: 1.4 !important;
      overflow: visible !important;
    }
  `}</style>
);

const DataVisGrid = () => null;

// --- UI Utility Components ---

export const SiteLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [minDisplayDone, setMinDisplayDone] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Ensure loader displays for minimum 2.5 seconds on first visit
  useEffect(() => {
    const timer = setTimeout(() => setMinDisplayDone(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Ensure video plays on load
  useEffect(() => {
    if (videoRef.current && !isMobile) {
      videoRef.current.play().catch(err => console.log('Autoplay prevented:', err));
    }
  }, [isMobile]);

  const handleLoaderComplete = () => {
    if (!minDisplayDone) return; // Don't complete until minimum time has passed
    setIsExiting(true);
    setTimeout(onComplete, 800);
  };

  return (
    <div className={`fixed inset-0 z-[99999] bg-slate-950 flex flex-col items-center justify-center overflow-hidden font-sans transition-opacity duration-1000 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      {!isMobile ? (
        <video
          ref={videoRef}
          src="/Loader.mp4"
          className="w-full h-full object-cover scale-[1.1] object-[center_65%] brightness-105 contrast-125"
          autoPlay
          muted
          playsInline
          onEnded={() => {
            handleLoaderComplete();
          }}
          onError={(e) => {
            console.error('Loader video failed to load:', e);
            handleLoaderComplete();
          }}
        />
      ) : (
        <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-950 px-6 overflow-hidden">
          {/* Cinematic Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 10, repeat: Infinity as any, ease: 'easeInOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.15)_0%,transparent_60%)]"
            />
            <motion.div
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{ duration: 20, repeat: Infinity as any, ease: 'linear' }}
              className="absolute top-0 bottom-0 w-full bg-gradient-to-r from-transparent via-blue-900/5 to-transparent -skew-x-12"
            />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="w-24 h-24 mb-8 relative flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-blue-600/20 blur-2xl rounded-full"></div>
              <div className="relative bg-white border border-white/10 w-full h-full rounded-[30px] flex items-center justify-center shadow-2xl overflow-hidden">
                <img src="/Favicon.png" className="w-12 h-12 object-contain animate-pulse" alt="ClickBazaar Logo" />
              </div>
            </motion.div>

            <div className="overflow-hidden mb-4">
              <motion.h1
                initial={{ y: 60 }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl font-black italic tracking-tighter uppercase bg-gradient-to-r from-orange-500 via-amber-500 to-green-600 bg-clip-text text-transparent text-center"
              >
                Click Bazaar
              </motion.h1>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col items-center gap-4"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 animate-pulse text-center">Opening Catalog...</p>
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i: number) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [0.8, 1.2, 0.8],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity as any,
                      delay: i * 0.3,
                      ease: 'easeInOut'
                    }}
                    className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          </div>

          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3, duration: 1 }}
            onClick={() => { setIsExiting(true); setTimeout(onComplete, 800); }}
            className="absolute bottom-20 px-8 py-3 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-blue-600/50 transition-all active:scale-95 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-blue-600/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            <span className="relative z-10 flex items-center gap-3">Get Started <Plus className="w-4 h-4" /></span>
          </motion.button>
        </div>
      )}
    </div>
  );
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

const SectionHeader: React.FC<{ title: React.ReactNode; subtitle: string; centered?: boolean }> = ({ title, subtitle, centered = true }) => {
  const revealRef = useScrollReveal();
  return (
    <div ref={revealRef} className={`${centered ? 'text-center flex flex-col items-center' : 'text-left flex flex-col items-start'} mb-6 md:mb-8 px-4 heading-animate`}>
      <div className="bg-blue-50 px-6 py-2 rounded-full mb-3 border border-blue-100 shadow-sm animate-fadeIn">
        <span className="text-[10px] md:text-xs font-black text-blue-600 uppercase tracking-[0.3em]">{subtitle}</span>
      </div>
      <div className="text-4xl md:text-6xl font-black text-blue-900 tracking-tighter mb-2 text-center">
        {typeof title === 'string' ? <WaveText text={title} className="text-4xl md:text-6xl" /> : title}
      </div>
      <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-transparent rounded-full opacity-40"></div>
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
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto px-6 py-10 md:py-14 border-b border-amber-200">
    {[
      { icon: <Truck className="w-8 h-8 text-blue-800" />, title: "Fast Delivery", desc: "Get your items within 24-48 hours with our priority shipping." },
      { icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />, title: "Secure Checkout", desc: "Shop with peace of mind using our highly secure payment systems." },
      { icon: <Sparkles className="w-8 h-8 text-amber-500" />, title: "Premium Selection", desc: "Hand-picked products from top categories for your daily lifestyle." }
    ].map((f, i) => (
      <ScrollRevealSmall key={i} className="flex flex-col items-center text-center p-6 md:p-8 bg-amber-50 rounded-[40px] border border-slate-50 shadow-sm hover:shadow-xl transition-all duration-500 group">
        <div className="mb-3 p-5 bg-amber-50 rounded-[32px] group-hover:scale-110 transition-transform duration-500">{f.icon}</div>
        <h3 className="text-xl md:text-2xl font-black text-blue-900 tracking-tight mb-2 text-center">{f.title}</h3>
        <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed italic text-center">"{f.desc}"</p>
      </ScrollRevealSmall>
    ))}
  </div>
);

const CategoryCurations = ({ onNavigate }: any) => {
  const categories = [
    { name: Category.Fashion, image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=80", count: "12 Items" },
    { name: Category.Electronics, image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80", count: "08 Items" },
    { name: Category.Mobile, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80", count: "06 Items" },
    { name: Category.Home, image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80", count: "15 Items" },
    { name: Category.Wellness, image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80", count: "04 Items" },
    { name: Category.Accessories, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80", count: "10 Items" }
  ];

  return (
    <div className="py-12 md:py-18 bg-amber-50 border-t border-amber-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal className="mb-8 md:mb-12 text-center">
          <Badge color="bg-red-700">Explore categories</Badge>
          <WaveText text="Shop by Category." className="text-4xl md:text-6xl font-black tracking-tighter leading-[1] md:leading-[0.9] mt-6 bg-gradient-to-br from-slate-950 via-slate-800 to-red-700 bg-clip-text text-transparent" />
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.map((cat, i) => (
            <div
              key={i}
              onClick={() => onNavigate('shop', cat.name)}
              onKeyDown={(e) => handleKeyboardClick(e, () => onNavigate('shop', cat.name))}
              tabIndex={0}
              role="button"
              aria-label={`Browse ${cat.name} category with ${cat.count}`}
              className="relative aspect-[4/5] rounded-[48px] overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-700 border-2 border-transparent hover:border-blue-600/20 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              <img src={cat.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end items-center p-8 md:p-10 text-center">
                <span className="text-white/60 text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] mb-3 text-center">{cat.count}</span>
                <WaveText text={cat.name} className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-3" />
                <div className="flex items-center gap-3 text-white font-black text-[10px] md:text-[11px] uppercase tracking-widest bg-amber-50/10 backdrop-blur-md w-fit px-6 py-3 rounded-full border border-white/20 group-hover:bg-amber-50 group-hover:text-blue-900 transition-all duration-500 shadow-xl">
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
  "/images/hero_image.png",
  "/images/hero1.png",
  "/images/hero2.png",
  "/images/hero3.png",
  "/images/hero4.png",
  "/images/hero5.png"
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
    <div className="relative w-full min-h-[90vh] md:min-h-[800px] overflow-hidden bg-slate-950">
      {/* 3D Floating Elements Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            y: [0, -40, 0],
            rotate: [0, 10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 15, repeat: Infinity as any, ease: "easeInOut" }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            y: [0, 60, 0],
            rotate: [0, -15, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity as any, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 -right-20 w-[500px] h-[500px] bg-red-700/10 rounded-full blur-[120px]"
        />
      </div>

      {HERO_IMAGES.map((img, idx) => (
        <motion.div
          key={img}
          className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out transform ${idx === currentIndex ? 'opacity-60 scale-105' : 'opacity-0 scale-100'
            }`}
        >
          <img src={img} className="w-full h-full object-cover" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20"></div>
        </motion.div>
      ))}

      <motion.div
        style={{ y: textY }}
        className="absolute inset-0 z-10 max-w-7xl mx-auto px-6 flex flex-col justify-end items-start text-left pb-32 md:pb-64"
      >
        <div className="max-w-3xl animate-fadeIn flex flex-col items-start overflow-visible">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-tight mb-4 md:mb-6">
            <span
              className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-rose-500 to-amber-500 heading-gradient-text-10s hero-text-glow py-4"
            >
              Elevate Your <span className="italic"> <br /> Lifestyle...</span>
            </span>
          </h1>
          <p className="text-white text-base md:text-xl font-medium mb-6 md:mb-8 max-w-lg leading-relaxed text-left">
            Explore our curated list of world-class products for your home and lifestyle.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-start">
            <button
              onClick={onExplore}
              className="bg-amber-50 text-blue-900 px-6 md:px-8 py-3 md:py-4 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all transform active:scale-95 shadow-2xl flex items-center gap-3 group"
            >
              Shop Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8 md:mt-10 pt-6 md:pt-8 border-t border-white/10 w-full">
            {[
              {
                icon: <Globe className="w-5 h-5 text-blue-500 group-hover:text-blue-400 transition-colors" />,
                title: "Global Shop",
                sub: "World Delivery"
              },
              {
                icon: <ShieldCheck className="w-5 h-5 text-emerald-500 group-hover:text-emerald-400 transition-colors" />,
                title: "Safe & Secure",
                sub: "Data Protected"
              },
              {
                icon: <Zap className="w-5 h-5 text-amber-500 group-hover:text-amber-400 transition-colors" />,
                title: "Fast Delivery",
                sub: "Quick Shipping"
              },
              {
                icon: <Layers className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />,
                title: "Smart System",
                sub: "Latest Tech"
              }
            ].map((item, i) => (
              <div key={i} className="group flex items-center gap-4 cursor-default transition-all duration-300">
                <div className="p-2.5 bg-white/5 rounded-xl group-hover:bg-white/10 transition-all duration-300 shadow-lg shadow-black/20 group-hover:scale-125 group-hover:-translate-y-2">
                  {item.icon}
                </div>
                <div className="flex flex-col">
                  <p className="text-[11px] font-black text-white tracking-widest leading-none group-hover:text-blue-400 transition-colors duration-300">{item.title}</p>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1.5 italic group-hover:text-slate-400 transition-colors duration-300">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ClickBot = ({ showToast, currentUser }: { showToast: (msg: string) => void; currentUser: User | null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ type: 'q' | 'a'; text: string; id: number }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const botRef = useRef<HTMLDivElement>(null);

  // Close chatbot when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (botRef.current && !botRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const userId = currentUser ? currentUser.id : 'guest';

  // Markdown-lite renderer for bot responses
  const renderFormattedLine = (line: string) => {
    // Basic regex for bold (**text**) and italic (*text*)
    const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-white font-black tracking-tight">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="text-blue-400 italic font-bold tracking-tight">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-3">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1"></div>;

          // Detect numbered lists (e.g. "1. Text")
          const listMatch = line.match(/^(\d+\.|-|\*)\s+(.*)$/);
          if (listMatch) {
            return (
              <div key={idx} className="flex gap-3 pl-1 leading-relaxed">
                <span className="text-blue-500 font-black shrink-0">{listMatch[1]}</span>
                <div className="flex-1">{renderFormattedLine(listMatch[2])}</div>
              </div>
            );
          }

          return <div key={idx} className="leading-relaxed">{renderFormattedLine(line)}</div>;
        })}
      </div>
    );
  };


  // Persistence: Load chat from storage when user changes or node mounts
  useEffect(() => {
    const key = `cb_chat_${userId}`;
    const saved = sessionStorage.getItem(key);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        setMessages([]);
      }
    } else if (currentUser) {
      // Welcome message for first-time session or empty history
      setMessages([{
        type: 'a',
        text: `Welcome, **${currentUser.name}**. I am ClickBot, your shopping assistant. How can I help you find the perfect items today?`,
        id: Date.now()
      }]);
    } else {
      setMessages([{
        type: 'a',
        text: `Welcome to ClickBazaar! I am ClickBot. Log in to track your orders and get personalized shopping help.`,
        id: Date.now()
      }]);
    }
  }, [userId, currentUser]);

  // Persistence: Sync to storage
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem(`cb_chat_${userId}`, JSON.stringify(messages));
    }
  }, [messages, userId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const qa = [
    { q: "What is ClickBazaar?", a: "**ClickBazaar** is a modern shopping website where you can find *high-quality* products and *safe delivery*." },
    { q: "How to Purchase?", a: "Pick items you like, **add them to your cart**, and go to the *checkout page* to buy." },
    { q: "How long is delivery?", a: "Most orders arrive in **3-5 days**. All orders receive priority shipping." },
    { q: "Is my data secure?", a: "Yes, your information is protected by *industry-standard encryption* for your safety." },
    { q: "Can I track my order?", a: "Yes, go to the **'Order Tracking'** page to see where your package is." },
    { q: "Are products authentic?", a: "Yes, **every item** is checked for quality before it is listed." },
    { q: "Can I return items?", a: "Yes, we offer a **30-day return policy** for *unused items*." },
    { q: "How can I pay?", a: "You can pay with **credit cards**, *UPI*, or through **bank transfers**." },
    { q: "Do you ship worldwide?", a: "Yes, we ship to over **190 countries** around the *world*." },
    { q: "How to get support?", a: "You can email us at **dbose272@gmail.com** or call *6289415265*." }
  ];

  const handleQuestion = (q: string, a: string) => {
    if (isTyping) return;
    const qId = Date.now();
    setMessages(prev => [...prev, { type: 'q', text: q, id: qId }]);

    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'a', text: a, id: qId + 1 }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleCustomQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;
    const qText = inputValue.trim();
    setInputValue('');
    const qId = Date.now();
    setMessages(prev => [...prev, { type: 'q', text: qText, id: qId }]);

    setIsTyping(true);
    try {
      const res = await api.askChatBot(qText, messages);
      setMessages(prev => [...prev, { type: 'a', text: res.text, id: qId + 1 }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { type: 'a', text: "Archive node timeout. Ensure your backend is running.", id: qId + 1 }]);
    }
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex flex-col items-start pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={botRef}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="w-[calc(100vw-32px)] md:w-[480px] h-[550px] md:h-[700px] max-h-[90vh] bg-slate-950 border border-blue-500/30 rounded-[32px] md:rounded-[48px] shadow-2xl pointer-events-auto overflow-hidden flex flex-col mb-4 md:mb-6"
            style={{ overscrollBehavior: 'contain' }}
            data-lenis-prevent
          >
            {/* Header */}
            <div className="p-8 bg-slate-900/50 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <img src="/images/chatbot.png" className="w-full h-full object-contain" alt="ClickBot" />
                </div>
                <div>
                  <h4 className="font-black text-xl text-white tracking-tighter">ClickBot</h4>
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Your Help Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <>
                    <button
                      onClick={() => {
                        const chatText = messages.map(m => `${m.type === 'q' ? 'User' : 'ClickBot'}: ${m.text}`).join('\n\n');
                        const blob = new Blob([chatText], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `ClickBazaar_Chat_${new Date().toISOString().slice(0, 10)}.txt`;
                        a.click();
                      }}
                      title="Export Chat"
                      className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setMessages([]);
                        sessionStorage.removeItem(`cb_chat_${userId}`);
                      }}
                      title="Delete Chat"
                      className="p-2 hover:bg-white/10 rounded-xl transition-colors text-red-500/50 hover:text-red-500"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                )}
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400" title="Close chat"><X className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Chat Body */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 md:space-y-4 custom-scrollbar min-h-[300px]" data-lenis-prevent>
              {messages.length === 0 ? (
                <div className="text-center py-12 md:py-20 opacity-50 px-6">
                  <div className="w-16 h-16 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-8 h-8 text-blue-500" />
                  </div>
                  <h5 className="font-black text-white text-base md:text-lg uppercase tracking-[0.2em] mb-3">Concierge Online</h5>
                  <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-widest leading-loose">Ask me about products, orders, shipping, or anything else!</p>
                </div>
              ) : (
                messages.map(m => (
                  <div key={m.id} className={`flex ${m.type === 'q' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] md:max-w-[80%] p-4 md:p-5 rounded-[20px] md:rounded-[24px] text-[11px] md:text-xs font-bold leading-relaxed shadow-sm relative group whitespace-pre-wrap ${m.type === 'q' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-900 text-slate-200 border border-white/5 rounded-tl-none'}`}>
                      {m.type === 'a' && (
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(m.text);
                            showToast("Copied to registry");
                          }}
                          className="absolute -right-8 md:-right-10 top-1 opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-lg transition-all text-slate-500 hover:text-white"
                          title="Copy Message"
                        >
                          <Copy className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </button>
                      )}
                      {m.type === 'a' ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          {renderMarkdown(m.text)}
                        </motion.div>
                      ) : m.text}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input & Predefined Nodes */}
            <div className="p-4 md:p-8 bg-slate-900/50 border-t border-white/5 space-y-4">
              <div className="flex flex-wrap gap-2 max-h-24 md:max-h-32 overflow-y-auto no-scrollbar">
                {qa.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuestion(item.q, item.a)}
                    disabled={isTyping}
                    className="px-3 md:px-4 py-2 bg-blue-600/5 hover:bg-blue-600/20 text-blue-400 hover:text-blue-300 rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest border border-blue-500/20 transition-all disabled:opacity-50"
                  >
                    {item.q}
                  </button>
                ))}
              </div>

              <form onSubmit={handleCustomQuestion} className="relative group/input flex items-end gap-3">
                <div className="relative flex-1">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleCustomQuestion(e as any);
                      }
                    }}
                    placeholder="Master Query..."
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 md:px-6 py-4 md:py-3.5 text-[11px] md:text-xs font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-600 transition-all shadow-2xl resize-none min-h-[56px] max-h-[150px] custom-scrollbar"
                    disabled={isTyping}
                    rows={1}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isTyping || !inputValue.trim()}
                  className="mb-1 w-11 h-11 md:w-12 md:h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg disabled:bg-slate-800 disabled:text-slate-600 transition-all hover:bg-blue-500 active:scale-95 flex-shrink-0"
                  title="Send message"
                >
                  <Send className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        animate={{
          y: [0, -6, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity as any,
          ease: "easeInOut"
        }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 md:w-16 md:h-16 bg-transparent flex items-center justify-center transition-all pointer-events-auto group relative p-1"
      >
        {isOpen ? <X className="w-6 h-6 text-white bg-slate-900 p-1.5 rounded-full border border-white/10" /> : (
          <img src="/images/chatbot.png" className="w-full h-full object-contain filter drop-shadow-[0_10px_10px_rgba(37,99,235,0.2)]" alt="ClickBot" />
        )}
      </motion.button>
    </div>
  );
};

export default function App() {
  const [loading, setLoading] = useState(() => {
    // Check sessionStorage: if loader hasn't been shown in this session, show it
    const shownInSession = sessionStorage.getItem('cb_loader_session_shown');
    if (!shownInSession) {
      return true; // Show loader on first visit and hard refresh
    }
    return false; // Don't show if already shown in this session
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loginSessions, setLoginSessions] = useState<LoginSession[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [backendOnline, setBackendOnline] = useState(true);
  const [showBackendModal, setShowBackendModal] = useState(false);
  const homeScrollMem = useRef<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [tickerMessageIndex, setTickerMessageIndex] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);

  // Ticker messages that rotate
  const tickerMessages = [
    'Secure Global Payments',
    'Premium Quality Guaranteed',
    'Free Express Delivery on All Orders'
  ];

  const showToast = (msg: string) => {
    // Clear any existing timeout
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
      toastTimeoutRef.current = null;
    }, 4000);
  };

  // Rotate ticker message every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerMessageIndex((prev) => (prev + 1) % tickerMessages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [tickerMessages.length]);

  // Cleanup toast timeout on unmount
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  // Logic to scroll to top when category or page changes
  const scrollToTop = useCallback((behavior: ScrollBehavior = 'instant') => {
    // Both standard scroll and Lenis scroll
    window.scrollTo({ top: 0, behavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: behavior === 'instant' });
    }
  }, []);

  // --- User Persistence Sync ---
  useEffect(() => {
    const saved = localStorage.getItem('clickbazaar_user_session');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        if (u && u.id) {
          setCurrentUser(u);
          // NEW: Initial recovery of wishlist/cart from local storage if state is empty
          const savedWishlist = localStorage.getItem(`cb_wishlist_${u.id}`);
          const savedCart = localStorage.getItem(`cb_cart_${u.id}`);
          if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
          if (savedCart) setCart(JSON.parse(savedCart));
        }
      } catch (e) { }
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('clickbazaar_user_session', JSON.stringify(currentUser));
      // NEW: Individual persistent storage for current user logic
      localStorage.setItem(`cb_wishlist_${currentUser.id}`, JSON.stringify(wishlist));
      localStorage.setItem(`cb_cart_${currentUser.id}`, JSON.stringify(cart));

      // Architectural Sync: Persist local state to backend archive node
      api.syncData(wishlist, cart).catch(err => console.error('[SYNC ERROR] cloud persistence failed', err));
    } else {
      localStorage.removeItem('clickbazaar_user_session');
    }
  }, [currentUser, wishlist, cart]);

  useEffect(() => {
    // Use positional memory for home restoration, otherwise scroll to top
    if (currentPage === 'home' && homeScrollMem.current > 0) {
      const pos = homeScrollMem.current;
      const restore = () => {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(pos, { immediate: true });
        }
        window.scrollTo({ top: pos, behavior: 'auto' });
      };
      restore();
      const t1 = setTimeout(restore, 100);
      const t2 = setTimeout(restore, 300);
      const t3 = setTimeout(restore, 600);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }

    scrollToTop();
    const t1 = setTimeout(scrollToTop, 50);
    const t2 = setTimeout(scrollToTop, 150);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [selectedCategory, currentPage, scrollToTop]);

  const [search, setSearch] = useState('');
  const [shopSort, setShopSort] = useState<'Alphabetical' | 'Popular' | 'PriceLowHigh' | 'PriceHighLow'>('Alphabetical');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [isAdminMobileOpen, setIsAdminMobileOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [authChoiceMode, setAuthChoiceMode] = useState<'login' | 'signup'>('login');
  const [showScrollArrow, setShowScrollArrow] = useState<'up' | 'down' | null>('down');
  const reviewsScrollRef = useRef<HTMLDivElement>(null);
  const scrollReviews = (direction: 'left' | 'right') => {
    if (reviewsScrollRef.current) {
      const scrollAmount = 400;
      reviewsScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  const bestSellersRef = useRef<HTMLDivElement>(null);
  const newArrivalsRef = useRef<HTMLDivElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Sorting outside click listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
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
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // User Session Management
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('clickbazaar_user_session', JSON.stringify(currentUser));
      // Sync local state to server
      api.syncData(wishlist, cart).catch(err => console.error('[SYNC ERROR]', err));

      // Fetch User History with fallback to localStorage
      api.fetchOrders()
        .then(res => {
          let fetchedOrders = res?.orders || [];

          // Fallback: Check localStorage if backend returned empty
          if (fetchedOrders.length === 0) {
            const data = localStorage.getItem('cb_state_final_v1');
            if (data) {
              try {
                const parsed = JSON.parse(data);
                if (parsed.userOrders && parsed.userOrders[currentUser.id]) {
                  fetchedOrders = parsed.userOrders[currentUser.id];
                  console.log(`[ORDER RECOVERY] Restored ${fetchedOrders.length} orders from localStorage for user ${currentUser.id}`);
                }
              } catch (e) {
                console.warn('[ORDER RECOVERY] Failed to parse localStorage:', e);
              }
            }
          }

          if (fetchedOrders && fetchedOrders.length > 0) {
            setOrders(fetchedOrders.map((o: any) => ({
              id: (o.id || '').toString(),
              userId: (o.userId || o.user_id || '').toString(),
              items: (() => {
                try {
                  const parsed = typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || []);
                  return (Array.isArray(parsed) ? parsed : []).map((item: any) => ({
                    productId: item.productId || '',
                    quantity: Number(item.quantity) || 0,
                    priceAtPurchase: Number(item.priceAtPurchase) || 0,
                    name: item.name || 'Unknown Item'
                  }));
                } catch { return []; }
              })(),
              total: Number(o.total) || 0,
              status: (o.status || OrderStatus.Placed) as OrderStatus,
              shippingAddress: (() => {
                try {
                  return typeof o.shippingAddress === 'string' ? JSON.parse(o.shippingAddress) : (o.shippingAddress || {});
                } catch { return {}; }
              })(),
              createdAt: o.createdAt || o.created_at ? new Date(o.createdAt || o.created_at).toISOString() : new Date().toISOString(),
              deliveryDate: o.deliveryDate || o.delivery_date ? new Date(o.deliveryDate || o.delivery_date).toISOString() : undefined,
            })));
          }
        })
        .catch(err => {
          console.error('[HISTORY ERROR]', err);
          showToast('Failed to fetch your order history.');
        });
    } else {
      localStorage.removeItem('clickbazaar_user_session');
    }
  }, [currentUser, wishlist, cart]);


  // Persistence Logic (Updated to support user-specific wishlists, carts, and orders)
  const [allWishlists, setAllWishlists] = useState<Record<string, string[]>>({});
  const [allCarts, setAllCarts] = useState<Record<string, CartItem[]>>({});
  const [allOrders, setAllOrders] = useState<Record<string, Order[]>>({});

  useEffect(() => {
    const data = localStorage.getItem('cb_state_final_v1');
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.users) setUsers(parsed.users);
      if (parsed.loginSessions) setLoginSessions(parsed.loginSessions);
      if (parsed.wishlists) setAllWishlists(parsed.wishlists);
      else if (parsed.wishlist) setWishlist(parsed.wishlist); // migration
      if (parsed.carts) setAllCarts(parsed.carts);
      if (parsed.userOrders) setAllOrders(parsed.userOrders);
      else if (parsed.orders) {
        // Migration: convert global orders to per-user storage
        const groupedOrders: Record<string, Order[]> = {};
        parsed.orders.forEach((o: Order) => {
          if (!groupedOrders[o.userId]) groupedOrders[o.userId] = [];
          groupedOrders[o.userId].push(o);
        });
        setAllOrders(groupedOrders);
      }
    } else {
      setUsers(INITIAL_USERS);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cb_state_final_v1', JSON.stringify({
      users,
      loginSessions,
      wishlists: currentUser ? { ...allWishlists, [currentUser.id]: wishlist } : allWishlists,
      carts: currentUser ? { ...allCarts, [currentUser.id]: cart } : allCarts,
      userOrders: currentUser ? { ...allOrders, [currentUser.id]: orders } : allOrders
    }));
  }, [users, orders, loginSessions, wishlist, allWishlists, cart, allCarts, currentUser, allOrders]);

  // Clear local state when user logs out
  useEffect(() => {
    if (!currentUser) {
      setWishlist([]);
      setCart([]);
      setOrders([]);
    }
  }, [currentUser]);

  // Restore session from backend if cookie might exist (suppressing noise on fresh boots)
  useEffect(() => {
    (async () => {
      // Check for existence of any cb-related state to hint if we should even attempt a ping
      const hasSession = localStorage.getItem('clickbazaar_user_session');
      if (!hasSession) return;

      try {
        const res = await api.getMe();
        if (res && res.user) {
          const user = {
            id: res.user.id.toString(),
            name: res.user.name,
            email: res.user.email,
            role: res.user.role === 'admin' ? UserRole.Admin : UserRole.Customer,
            createdAt: new Date().toISOString(),
          };
          // CRITICAL: Set wishlist and cart BEFORE currentUser to prevent sync race condition
          setWishlist(res.user.wishlist || []);
          setCart(res.user.cart || []);
          setCurrentUser(user);
          setCurrentPage(user.role === UserRole.Admin ? 'admin-dashboard' : 'home');
          showToast(`Welcome back, Curator ${user.name}`);
        }
      } catch (err: any) {
        showToast(err.message);
      }
    })();
  }, []);

  // Fetch products from backend API
  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('http://localhost:4100/api/products', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
          const backendProducts = await response.json();

          // If backend has products, use them; otherwise use hardcoded
          if (backendProducts && backendProducts.length > 0) {
            console.log(`[PRODUCTS] Loaded ${backendProducts.length} products from backend`);
            // Convert backend products to frontend Product type
            const convertedProducts: Product[] = backendProducts.map((p: any) => ({
              id: p.id,
              name: p.name,
              category: p.category as Category,
              price: p.price,
              description: p.description || '',
              image: p.image || '',
              images: p.images && p.images.length > 0 ? p.images : [p.image || ''],
              stock: p.stock || 0,
              rating: p.rating || 4.5,
              isBestSeller: !!p.isBestSeller,
              isNewArrival: !!p.isNewArrival,
              isLimitedOffer: !!p.isLimitedOffer,
              discount: p.discount || 0
            }));
            setProducts(convertedProducts);
          } else {
            console.log('[PRODUCTS] No backend products found, using defaults');
          }
        }
      } catch (err) {
        console.warn('[PRODUCTS] Failed to load from backend, using defaults:', err);
        // Already has INITIAL_PRODUCTS as default
      }
    })();
  }, []);

  // Modal Scroll Lock Synchronizer for App-level modals
  useEffect(() => {
    const isModalOpen = !!(quickView || isMobileNavOpen || showBackendModal);
    if (isModalOpen) {
      document.body.classList.add('overflow-hidden');
      if (lenisRef.current) lenisRef.current.stop();
    } else {
      document.body.classList.remove('overflow-hidden');
      if (lenisRef.current) lenisRef.current.start();
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [quickView, isMobileNavOpen, showBackendModal]);

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

  // Sync state with Window Hash for routing with proper auth validation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'home';

      // Auth Guard for protected pages via direct hash URL
      const protectedPages = ['profile', 'orders', 'tracking'];
      if (protectedPages.includes(hash) && !currentUser) {
        showToast("Access required: Please authenticate to continue.");
        setCurrentPage('home');
        window.location.hash = 'home';
        return;
      }

      // Admin only routes
      if (hash === 'admin-dashboard' && currentUser?.role !== UserRole.Admin) {
        showToast("Identity Verification: Admin credentials required.");
        setCurrentPage('home');
        window.location.hash = 'home';
        return;
      }

      // Valid page transition
      setCurrentPage(hash);
      setIsMobileNavOpen(false);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentUser]);

  useEffect(() => {
    if (window.location.hash.replace('#', '') !== currentPage) {
      window.location.hash = currentPage;
    }
  }, [currentPage]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCategoryMenuOpen(false);
        setQuickView(null);
        setIsMobileNavOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    // Prevent background scroll when any modal or mobile nav is open.
    const isModalOpen = isMobileNavOpen || !!quickView || (currentPage === 'auth-choice') || (currentPage === 'login') || !!selectedUser || loading;

    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '15px'; // Prevent layout shift
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '0px';
    }
    return () => { document.body.style.overflow = ''; document.body.style.paddingRight = '0px'; };
  }, [isMobileNavOpen, quickView, currentPage, selectedUser, loading]);

  useEffect(() => {
    let interval: number;
    const pingBackend = async () => {
      try {
        await api.checkHealth();
        setBackendOnline(true);
        setShowBackendModal(false);
      } catch (err) {
        setBackendOnline(false);
        setShowBackendModal(true);
      }
    };
    pingBackend();
    interval = window.setInterval(pingBackend, 10_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      if (currentPage === 'home') {
        homeScrollMem.current = scrollY;
      }

      // Near top: show down arrow only
      if (scrollY < 100) {
        setShowScrollArrow('down');
      }
      // Near bottom: show up arrow only
      else if (scrollY + windowHeight > fullHeight - 150) {
        setShowScrollArrow('up');
      }
      // Middle: show both
      else {
        setShowScrollArrow(null);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = useCallback((p: string, category: Category | 'All' = 'All') => {
    // Show navigation loading state
    setIsNavigating(true);

    // Close menus and modals
    setIsCategoryMenuOpen(false);
    setIsMobileNavOpen(false);

    // Auth Guard for protected pages
    if (p === 'admin-dashboard' && currentUser?.role !== UserRole.Admin) {
      showToast("Identity Verification: Admin credentials required.");
      setCurrentPage('admin-login');
      window.location.hash = 'admin-login';
      setIsNavigating(false);
      return;
    }

    const protectedPages = ['profile', 'orders', 'tracking'];
    if (protectedPages.includes(p) && !currentUser) {
      showToast("Access required: Please authenticate to continue.");
      setAuthChoiceMode('login');
      setCurrentPage('auth-choice');
      window.location.hash = 'auth-choice';
      setIsNavigating(false);
      return;
    }

    // Special handling for login/signup
    if (p === 'login') {
      setAuthChoiceMode('login');
      setCurrentPage('auth-choice');
      window.location.hash = 'auth-choice';
      setIsNavigating(false);
      return;
    }
    if (p === 'signup') {
      setAuthChoiceMode('signup');
      setCurrentPage('auth-choice');
      window.location.hash = 'auth-choice';
      setIsNavigating(false);
      return;
    }

    // Special handling for home - preserve scroll position
    if (p === 'home') {
      homeScrollMem.current = 0;
    } else if (currentPage === 'home') {
      homeScrollMem.current = window.scrollY;
    }

    // Set category for shop pages
    if (p === 'shop') {
      setSelectedCategory(category);
    }

    // Update page and hash
    setCurrentPage(p);
    window.location.hash = p;
    scrollToTop();

    // Reset navigation loading state after transition
    setTimeout(() => setIsNavigating(false), 300);
  }, [scrollToTop, currentUser, showToast]);


  const handleSignup = async (name: string, email: string, pass: string, otp: string, adminKey?: string) => {
    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Elite Password Strength Validation: Requires 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(pass)) {
      showToast('Check Failed: Password too weak. You need at least 8 characters, including 1 uppercase, 1 lowercase, 1 number, and 1 special character (@$!%*?&).');
      return;
    }

    // Admin verification happens on backend
    // No frontend email validation needed

    try {
      const { user } = await api.register(name, normalizedEmail, pass, otp, adminKey);
      setCurrentUser({
        id: (user.id || '').toString(),
        name: user.name,
        email: user.email,
        role: user.role === 'admin' ? UserRole.Admin : UserRole.Customer,
        createdAt: new Date().toISOString()
      });
      showToast(`Registered as ${user.name}`);
      setCurrentPage(user.role === 'admin' ? 'admin-dashboard' : 'home');
    } catch (err: any) {
      showToast(`Sign Up Failed: ${err.message}`);
    }
  };
  const handleLogin = async (email: string, pass: string, adminKey?: string) => {
    const normalizedEmail = email.toLowerCase().trim();

    try {
      const { user } = await api.login(normalizedEmail, pass, adminKey);
      const mappedUser: User = {
        id: (user.id || '').toString(),
        name: user.name,
        email: user.email,
        role: user.role === 'admin' ? UserRole.Admin : UserRole.Customer,
        createdAt: new Date().toISOString()
      };
      // CRITICAL: Set wishlist and cart BEFORE currentUser to prevent sync race condition
      setWishlist(user.wishlist || []);
      setCart(user.cart || []);
      setCurrentUser(mappedUser);
      const session: LoginSession = {
        id: `SES-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        userId: mappedUser.id,
        userName: mappedUser.name,
        userEmail: mappedUser.email,
        timestamp: new Date().toISOString()
      };
      setLoginSessions(prev => [session, ...prev]);

      try {
        const ordersRes = await api.fetchOrders();
        let fetchedOrders = ordersRes?.orders || [];

        // Fallback: Check localStorage for user-specific orders if backend returned empty
        if (fetchedOrders.length === 0) {
          const data = localStorage.getItem('cb_state_final_v1');
          if (data) {
            try {
              const parsed = JSON.parse(data);
              if (parsed.userOrders && parsed.userOrders[mappedUser.id]) {
                fetchedOrders = parsed.userOrders[mappedUser.id];
                console.log(`[ORDER RECOVERY] Restored ${fetchedOrders.length} orders from localStorage for user ${mappedUser.id}`);
              }
            } catch (e) {
              console.warn('[ORDER RECOVERY] Failed to parse localStorage:', e);
            }
          }
        }

        if (fetchedOrders.length > 0) {
          setOrders(fetchedOrders.map((o: any) => ({
            id: (o.id || '').toString(),
            userId: (o.userId || o.user_id || '').toString(),
            items: (() => {
              try {
                const parsed = typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || []);
                return (Array.isArray(parsed) ? parsed : []).map((item: any) => ({
                  productId: item.productId || '',
                  quantity: Number(item.quantity) || 0,
                  priceAtPurchase: Number(item.priceAtPurchase) || 0,
                  name: item.name || 'Unknown Item'
                }));
              } catch { return []; }
            })(),
            total: Number(o.total) || 0,
            status: (o.status || OrderStatus.Placed) as OrderStatus,
            shippingAddress: (() => {
              try {
                return typeof o.shippingAddress === 'string' ? JSON.parse(o.shippingAddress) : (o.shippingAddress || {});
              } catch { return {}; }
            })(),
            createdAt: o.createdAt || o.created_at ? new Date(o.createdAt || o.created_at).toISOString() : new Date().toISOString(),
            deliveryDate: o.deliveryDate || o.delivery_date ? new Date(o.deliveryDate || o.delivery_date).toISOString() : undefined,
          })));
        }
      } catch (err) {
        console.error('[LOGIN HISTORY ERROR]', err);
      }

      if (mappedUser.role === UserRole.Admin) {
        showToast("Admin login successful.");
        setCurrentPage('admin-dashboard');
      } else {
        showToast(`Success: Welcome, ${mappedUser.name}.`);
        setCurrentPage('home');
      }
    } catch (err: any) {
      showToast(`Authentication Failure: ${err.message}`);
    }
  };
  const handleLogout = async () => {
    try {
      await api.logout(); // Clean backend session/cookie
    } catch {
      // ignore
    }
    if (currentUser) {
      localStorage.removeItem(`cb_chat_${currentUser.id}`);
    }
    localStorage.removeItem('cb_chat_guest');

    setCurrentUser(null);
    setCurrentPage('home');
    setCart([]);
    setWishlist([]);
    setOrders([]);
    setIsMobileNavOpen(false);
    setIsAdminMobileOpen(false);
    window.location.hash = 'home';
    window.scrollTo(0, 0);
    showToast("Session ended.");
  };

  const addToCart = (id: string, quantity: number = 1) => {
    if (!currentUser) {
      showToast("Access Restricted: Please login to acquire items.");
      setAuthChoiceMode('login');
      setCurrentPage('auth-choice');
      window.location.hash = 'auth-choice';
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setCart(prev => {
        const exists = prev.find(i => i.productId === id);
        const next = exists ? prev.map(i => i.productId === id ? { ...i, quantity: i.quantity + quantity } : i) : [...prev, { productId: id, quantity }];
        return next;
      });
      setIsProcessing(false);
      showToast("Added to bag");
    }, 800);
  };

  const toggleWishlist = (id: string) => {
    if (!currentUser) {
      showToast("Access Restricted: Please login to save favorites.");
      setAuthChoiceMode('login');
      setCurrentPage('auth-choice');
      window.location.hash = 'auth-choice';
      return;
    }
    setWishlist(prev => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter(i => i !== id) : [...prev, id];
      showToast(exists ? "Removed from favorites" : "Saved to favorites");
      return next;
    });
  };

  const removeFromCart = (id: string, all: boolean = false) => {
    setCart(prev => {
      const item = prev.find(i => i.productId === id);
      let next;
      if (item && item.quantity > 1 && !all) {
        next = prev.map(i => i.productId === id ? { ...i, quantity: i.quantity - 1 } : i);
      } else {
        next = prev.filter(i => i.productId !== id);
      }
      return next;
    });
  };

  const completeOrder = async (shipping: any) => {
    if (!currentUser) {
      showToast('Please login to complete purchase.');
      setAuthChoiceMode('login');
      setCurrentPage('auth-choice');
      window.location.hash = 'auth-choice';
      return;
    }

    setIsProcessing(true);
    try {
      const items = cart.map(c => {
        const p = products.find(prod => prod.id === c.productId);
        if (!p) {
          console.error(`Product mismatch: ID ${c.productId} not found in database.`);
          throw new Error(`Inventory mismatch for product ID: ${c.productId}`);
        }
        // Standard Shipping Fee: Uniform 3.5% applied to all orders
        const tax = Math.round(p.price * c.quantity * 0.035);
        return { ...c, priceAtPurchase: p.price, name: p.name, tax };
      });
      const subTotal = items.reduce((a, b) => a + (b.priceAtPurchase * b.quantity), 0);
      const totalTax = items.reduce((a, b) => a + (b.tax || 0), 0);
      const total = Math.round(subTotal + totalTax);

      const { payment, ...shippingDetails } = shipping;
      const { order } = await api.createOrder({
        items,
        total,
        shippingAddress: shippingDetails,
      });

      const formattedOrder: Order = {
        id: order.id.toString(),
        userId: currentUser.id,
        items,
        total,
        status: order.status as OrderStatus,
        shippingAddress: shipping,
        createdAt: new Date(order.created_at).toISOString(),
      };

      setOrders(prev => [formattedOrder, ...prev]);
      setLastOrder(formattedOrder);
      setCart([]);
      setCurrentPage('order-success');
    } catch (error: any) {
      showToast(error.message || 'Failed to complete order');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateProfile = async (name: string, email: string) => {
    try {
      const { user } = await api.updateProfile(name, email);
      setCurrentUser((prev: User | null) => prev ? { ...prev, name: user.name, email: user.email } : null);
      showToast("Identity updated successfully.");
    } catch (err: any) {
      showToast(err.message);
    }
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

    // Sorting Logic
    if (shopSort === 'PriceLowHigh') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (shopSort === 'PriceHighLow') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (shopSort === 'Popular') {
      list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      // Default to alphabetical
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
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
        <ScrollStyles />
        {loading && <SiteLoader onComplete={() => { sessionStorage.setItem('cb_loader_session_shown', 'true'); setLoading(false); }} />}
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
          showToast={showToast}
        />
      </>
    );
  }

  if (currentPage === 'settings') {
    return (
      <>
        <ScrollStyles />
        {loading && <SiteLoader onComplete={() => { sessionStorage.setItem('cb_loader_session_shown', 'true'); setLoading(false); }} />}
        <div className="min-h-screen flex flex-col selection:bg-blue-600 selection:text-white bg-[#fafafa]">
          <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 md:h-20 flex items-center justify-between">
              <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => handleNavigate('home')}>
                <div className="bg-white p-2 rounded-xl group-hover:bg-blue-50 transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center">
                  <img src="/Favicon.png" className="w-5 h-5 object-contain" alt="ClickBazaar Logo" />
                </div>
                <span className="text-xl font-bold tracking-tight uppercase bg-gradient-to-r from-orange-500 via-amber-500 to-green-600 bg-clip-text text-transparent">Click Bazaar</span>
              </div>
            </div>
          </nav>
          <main className="flex-1">
            <SettingsPage user={currentUser!} onUpdate={handleUpdateProfile} onNavigate={handleNavigate} />
          </main>
          <Footer onNavigate={handleNavigate} isAdmin={currentUser?.role === UserRole.Admin} />
        </div>
      </>
    );
  }

  return (
    <>
      <ScrollStyles />
      {loading && <SiteLoader onComplete={() => { sessionStorage.setItem('cb_loader_session_shown', 'true'); setLoading(false); }} />}
      {isProcessing && <CartLoader />}
      <div className="min-h-screen flex flex-col selection:bg-blue-600 selection:text-white bg-[#fafafa]">
        <div className="bg-slate-900 text-white py-1.5 overflow-hidden border-b border-white/5 no-print relative h-8 flex items-center">
          <motion.div
            key={tickerMessageIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center w-full font-bold text-[7px] md:text-[8px] uppercase tracking-[0.25em] px-4 opacity-90"
          >
            {tickerMessages[tickerMessageIndex]}
          </motion.div>
        </div>
        <nav className="sticky top-0 z-50 bg-white/10 backdrop-blur-md border-b border-slate-200/5 no-print transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 h-14 md:h-16 flex items-center justify-between">
            {/* Left Section: Logo */}
            <div className="flex-1 flex items-center">
              <div
                className="flex items-center gap-2.5 cursor-pointer group"
                onClick={() => {
                  if (currentPage === 'home') {
                    scrollToTop('smooth');
                  } else {
                    handleNavigate('home');
                  }
                }}
                onKeyDown={(e) => handleKeyboardClick(e, () => {
                  if (currentPage === 'home') {
                    scrollToTop('smooth');
                  } else {
                    handleNavigate('home');
                  }
                })}
                tabIndex={0}
                role="button"
                aria-label="Go to home page"
              >
                <div className="bg-white p-2 rounded-xl group-hover:bg-blue-50 transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center">
                  <img src="/Favicon.png" className="w-5 h-5 object-contain" alt="ClickBazaar Logo" />
                </div>
                <span className="text-xl font-bold tracking-tight uppercase bg-gradient-to-r from-orange-500 via-amber-500 to-green-600 bg-clip-text text-transparent">Click Bazaar</span>
              </div>
            </div>

            {/* Center Section: Links */}
            <div className="hidden lg:flex items-center justify-center gap-10 text-sm flex-1">
              <div
                className="relative group py-2"
                onMouseEnter={handleCategoryMenuMouseEnter}
                onMouseLeave={handleCategoryMenuMouseLeave}
              >
                <button onClick={() => handleNavigate('shop')} className="nav-link flex items-center gap-1.5 font-bold">
                  Shop <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                </button>
                <AnimatePresence>
                  {isCategoryMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full -left-4 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-4"
                    >
                      <div className="grid gap-1">
                        {navCategories.map(cat => (
                          <button
                            key={cat.name}
                            onClick={() => handleNavigate('shop', cat.name)}
                            className="flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-slate-50 text-left transition-all group/item"
                          >
                            <span className="text-sm font-bold text-slate-700 group-hover/item:text-blue-600">{cat.name}</span>
                            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-400 group-hover/item:bg-blue-50 group-hover/item:text-blue-400">{cat.count}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button onClick={() => handleNavigate('about')} className="nav-link">About</button>
              <button onClick={() => handleNavigate('support')} className="nav-link">Support</button>
            </div>

            {/* Right Section */}
            <div className="flex-1 flex items-center justify-end gap-4">
              {currentPage === 'shop' && (
                <div className="hidden lg:block w-48 xl:w-64">
                  <div className="relative group">
                    <input
                      type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                      className="w-full bg-slate-100 border border-transparent focus:bg-white focus:ring-4 focus:ring-blue-600/5 rounded-full px-5 py-2 pr-10 outline-none font-bold text-slate-900 transition-all text-xs"
                    />
                    <Search className="absolute right-4 top-2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600" />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 md:gap-3">
                <button
                  onClick={() => { setIsMobileNavOpen(v => !v); setIsCategoryMenuOpen(false); }}
                  className="lg:hidden p-2 rounded-full bg-slate-100/80 hover:bg-slate-200 transition-all active:scale-95 icon-pop-soft"
                >
                  {isMobileNavOpen ? <X size={18} /> : <Menu size={18} />}
                </button>

                <button onClick={() => handleNavigate('wishlist')} className="p-2 rounded-full hover:bg-rose-50 transition-all active:scale-95 relative group icon-pop">
                  <Heart className={`w-5 h-5 transition-colors duration-300 ${wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : 'text-slate-600 group-hover:text-rose-500'}`} />
                  {wishlist.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border border-white animate-pulse"></span>}
                </button>

                <button
                  onClick={() => handleNavigate('cart')}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-600 relative transition-all active:scale-95 group icon-pop"
                >
                  <ShoppingBag className="w-5 h-5 group-hover:text-blue-600 transition-colors duration-300" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-bounce shadow-md">
                      {cart.reduce((a, b) => a + b.quantity, 0)}
                    </span>
                  )}
                </button>

                <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

                {currentUser ? (
                  <div className="relative group p-1">
                    <button
                      onClick={() => { if (window.innerWidth < 1024) setIsMobileNavOpen(true); }}
                      className="flex items-center gap-2 p-1.5 hover:bg-blue-50 rounded-2xl transition-all"
                    >
                      <div className="w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center text-white shadow-lg overflow-hidden group-hover:bg-blue-600 transition-colors">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                    </button>
                    <div className="absolute top-full right-0 w-56 bg-white rounded-3xl shadow-2xl border border-slate-100 py-3 opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
                      <div className="px-5 py-3 border-b border-slate-50 mb-2">
                        <p className="text-xs font-black text-slate-900">{currentUser.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{currentUser.email}</p>
                      </div>
                      {[
                        { icon: <UserIcon className="w-4 h-4" />, label: "Profile", action: () => handleNavigate('profile') },
                        { icon: <Package className="w-4 h-4" />, label: "My Orders", action: () => handleNavigate('orders') },
                        { icon: <Heart className="w-4 h-4" />, label: "Saved Items", action: () => handleNavigate('wishlist') },
                        { icon: <Settings className="w-4 h-4" />, label: "Settings", action: () => handleNavigate('settings') },
                        ...(currentUser.role === UserRole.Admin ? [{ icon: <LayoutDashboard className="w-4 h-4 text-red-600" />, label: "Admin Portal", action: () => handleNavigate('admin-dashboard') }] : [])
                      ].map((item, i) => (
                        <button key={i} onClick={item.action} className="w-full flex items-center gap-3 px-5 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-blue-600 text-[11px] font-black transition-all">
                          {item.icon} {item.label}
                        </button>
                      ))}
                      <div className="h-px bg-slate-50 my-2 mx-4"></div>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-2.5 text-red-600 hover:bg-red-50 text-[11px] font-black transition-all tracking-widest uppercase">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="hidden sm:flex items-center gap-1">
                    {!currentPage.includes('admin') && (
                      <>
                        <button onClick={() => handleNavigate('login')} className="px-4 py-2 text-[10px] font-black text-slate-600 hover:text-blue-600 uppercase tracking-widest transition-all">Login</button>
                        <button onClick={() => { setCurrentPage('signup'); window.location.hash = 'signup'; scrollToTop(); }} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">Sign Up</button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
        <AnimatePresence>
          {isMobileNavOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md"
            >
              <div className="max-w-md mx-auto h-full flex flex-col items-center justify-center p-8 relative text-center gap-8" data-lenis-prevent>
                <button
                  onClick={() => setIsMobileNavOpen(false)}
                  className="absolute top-8 right-8 p-3 rounded-full bg-slate-100 hover:bg-slate-200 transition-all icon-pop cursor-pointer active:scale-90"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>

                <div
                  className="flex flex-col items-center gap-4 cursor-pointer"
                  onClick={() => {
                    setIsMobileNavOpen(false);
                    if (currentPage === 'home') {
                      scrollToTop();
                    } else {
                      handleNavigate('home');
                    }
                  }}
                  onKeyDown={(e) => handleKeyboardClick(e, () => {
                    setIsMobileNavOpen(false);
                    if (currentPage === 'home') {
                      scrollToTop();
                    } else {
                      handleNavigate('home');
                    }
                  })}
                  tabIndex={0}
                  role="button"
                  aria-label="Go to home page"
                >
                  <div className="bg-white p-4 rounded-3xl shadow-2xl shadow-blue-500/20 icon-pop border border-slate-100 flex items-center justify-center overflow-hidden">
                    <img src="/Favicon.png" className="w-10 h-10 object-contain" alt="ClickBazaar Logo" />
                  </div>
                  <span className="text-2xl font-black tracking-tighter uppercase bg-gradient-to-r from-orange-500 via-amber-500 to-green-600 bg-clip-text text-transparent">Click Bazaar</span>
                </div>

                {currentPage === 'shop' && (
                  <div className="w-full">
                    <div className="relative">
                      <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search products..."
                        className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 text-center"
                      />
                      <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                )}

                <div className="flex flex-col items-center space-y-6 text-xl font-black uppercase tracking-[0.2em]">
                  <button onClick={() => { setIsMobileNavOpen(false); handleNavigate('shop'); }} className="hover:text-blue-600 transition-colors icon-pop-soft" onKeyDown={(e) => e.key === 'Enter' && (() => { setIsMobileNavOpen(false); handleNavigate('shop'); })()}>Shop</button>
                  <button onClick={() => { setIsMobileNavOpen(false); handleNavigate('about'); }} className="hover:text-blue-600 transition-colors icon-pop-soft" onKeyDown={(e) => e.key === 'Enter' && (() => { setIsMobileNavOpen(false); handleNavigate('about'); })()}>About</button>
                  <button onClick={() => { setIsMobileNavOpen(false); handleNavigate('support'); }} className="hover:text-blue-600 transition-colors icon-pop-soft" onKeyDown={(e) => e.key === 'Enter' && (() => { setIsMobileNavOpen(false); handleNavigate('support'); })()}>Support</button>
                </div>

                <motion.div
                  initial={{ x: 0 }}
                  animate={{ x: 0 }}
                  className="flex items-center gap-8 justify-center"
                >
                  {[
                    { icon: <Heart className="w-7 h-7 text-rose-500" />, label: "Collection", key: 'wishlist', count: wishlist.length, color: 'hover:bg-rose-50' },
                    { icon: <ShoppingCart className="w-7 h-7 text-blue-600" />, label: "Cart", key: 'cart', count: cart.length, color: 'hover:bg-blue-50' }
                  ].map((item, idx) => (
                    <motion.button
                      key={item.key}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                      className={`flex flex-col items-center gap-3 group/item icon-pop relative p-6 rounded-[32px] ${item.color} transition-all border border-transparent hover:border-slate-100`}
                      onClick={() => { setIsMobileNavOpen(false); handleNavigate(item.key); }}
                    >
                      <div className="relative">
                        {item.icon}
                        {item.count > 0 && (
                          <span className="absolute -top-4 -right-4 bg-slate-900 text-white text-[10px] font-black w-7 h-7 flex items-center justify-center rounded-full border-2 border-white shadow-xl animate-scaleIn">
                            {item.count}
                          </span>
                        )}
                      </div>
                      <span className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover/item:text-slate-900 transition-colors">{item.label}</span>
                    </motion.button>
                  ))}
                </motion.div>

                <div className="w-full">
                  {currentUser ? (
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg">{currentUser.name.charAt(0).toUpperCase()}</div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-900 uppercase tracking-widest">{currentUser.name}</p>
                          <p className="text-[9px] text-slate-400 font-bold">{currentUser.email}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {[
                          { icon: <UserIcon size={14} />, label: "Profile", key: 'profile' },
                          { icon: <Package size={14} />, label: "Orders", key: 'orders' },
                          { icon: <Settings size={14} />, label: "Settings", key: 'settings' },
                          { icon: <LayoutDashboard size={14} />, label: "Admin", key: 'admin-dashboard', hide: currentUser.role !== UserRole.Admin }
                        ].filter(i => !i.hide).map(link => (
                          <button
                            key={link.key}
                            onClick={() => { setIsMobileNavOpen(false); handleNavigate(link.key); }}
                            className="flex items-center gap-2 p-3 bg-white border border-slate-100 rounded-xl text-[10px] font-black text-slate-600 hover:text-blue-600 transition-all active:scale-95"
                          >
                            {link.icon} {link.label}
                          </button>
                        ))}
                      </div>
                      <button onClick={handleLogout} className="w-full px-6 py-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all active:scale-95">Sign Out</button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 w-full max-w-[240px] mx-auto">
                      <button onClick={() => { setIsMobileNavOpen(false); handleNavigate('login'); }} className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-700 hover:border-blue-600 transition-all icon-pop-soft">Log In</button>
                      <button onClick={() => { setIsMobileNavOpen(false); setCurrentPage('signup'); window.location.hash = 'signup'; scrollToTop(); }} className="w-full px-6 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 icon-pop">Sign Up</button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <main className="flex-1 relative">
          {/* Navigation Loading Overlay */}
          <AnimatePresence>
            {isNavigating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 bg-white/40 backdrop-blur-sm z-[200] flex items-center justify-center pointer-events-none"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-12 h-12 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                  <span className="text-sm font-black text-slate-700 tracking-widest uppercase">Loading...</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          {currentPage === 'home' && (
            <div className="animate-fadeIn bg-white">
              <HeroSlider onExplore={() => handleNavigate('shop')} />
              <FeatureGrid />
              <DataVisGrid />
              {/* Flash Deals Section */}
              <div className="py-8 md:py-12 lg:py-16 bg-amber-50/50 border-b border-amber-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-40 bg-blue-600/5 rounded-full blur-[100px]"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                  <div className="flex flex-col items-center mb-8 md:mb-12 lg:mb-16 gap-4 md:gap-6 text-center">
                    <ScrollReveal className="flex flex-col items-center">
                      <Badge color="bg-blue-600">Limited Time Offers</Badge>
                      <WaveText
                        text="Flash Deals"
                        className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight leading-tight mt-2 sm:mt-4 text-slate-900"
                      />
                    </ScrollReveal>
                    <div className="flex gap-3 sm:gap-4 justify-center">
                      <div className="bg-blue-50 text-blue-600 px-6 md:px-8 py-3 md:py-4 rounded-3xl border border-blue-100 font-bold text-xs md:text-sm uppercase tracking-widest flex items-center gap-3 shadow-sm">
                        <Zap className="w-4 h-4 md:w-5 md:h-5 fill-current animate-pulse" />
                        <FlashTimer userId={currentUser?.id} />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-10">
                    {products.filter(p => p.isLimitedOffer).sort((a, b) => a.name.localeCompare(b.name)).slice(0, 8).map(p => (
                      <ProductCard key={p.id} product={p} onAdd={() => addToCart(p.id)} onQuick={() => setQuickView(p)} isWish={wishlist.includes(p.id)} onWish={() => toggleWishlist(p.id)} />
                    ))}
                  </div>
                </div>
              </div>
              {/* Best Sellers */}
              <div ref={bestSellersRef} className="py-8 md:py-12 lg:py-16 bg-amber-50/50">
                <ScrollReveal className="mb-3 sm:mb-4 md:mb-6 px-2 flex flex-col items-center">
                  <span className="inline-block bg-blue-600 text-white font-bold uppercase text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.2em] px-4 sm:px-5 py-1.5 sm:py-2 rounded-full mb-4 md:mb-8 shadow-lg shadow-blue-500/20">Explore Products</span>
                  <WaveText
                    text="Best Sellers"
                    className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight leading-tight text-slate-900"
                  />
                </ScrollReveal>
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-10 text-left">
                    {products.filter(p => p.isBestSeller).sort((a, b) => a.name.localeCompare(b.name)).slice(0, 8).map(p => (
                      <ProductCard key={p.id} product={p} onAdd={() => addToCart(p.id)} onQuick={() => setQuickView(p)} isWish={wishlist.includes(p.id)} onWish={() => toggleWishlist(p.id)} />
                    ))}
                  </div>
                </div>
              </div>
              {/* CategoryCurations removed */}
              {/* Testimonials */}
              <div className="bg-slate-950 py-16 md:py-20 lg:py-32 text-white overflow-hidden relative group/reviews">
                <div className="absolute inset-0 opacity-20 pointer-events-none dotted-bg-48px"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                  <div className="flex flex-col items-center mb-10 md:mb-16 text-center">
                    <div className="inline-flex items-center gap-2 px-5 sm:px-6 py-1.5 sm:py-2 bg-blue-600/10 rounded-full mb-6 md:mb-8 border border-blue-500/20 backdrop-blur-md">
                      <Star className="w-4 h-4 text-blue-500 fill-blue-500 animate-pulse" />
                      <span className="text-blue-500 font-black uppercase text-[10px] tracking-[0.4em]">Customer Voice</span>
                      <Star className="w-4 h-4 text-blue-500 fill-blue-500 animate-pulse" />
                    </div>
                    <WaveText
                      text="Verified Customer Reviews"
                      className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[0.9] silver-lower-gradient mb-4 md:mb-8"
                    />
                    <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-transparent rounded-full opacity-60"></div>
                  </div>

                  <div className="relative">
                    {/* Left Arrow */}
                    <button
                      onClick={() => {
                        const container = document.querySelector('[data-reviews-scroll]');
                        if (container) container.scrollBy({ left: -400, behavior: 'smooth' });
                      }}
                      onKeyDown={(e) => handleKeyboardClick(e, () => {
                        const container = document.querySelector('[data-reviews-scroll]');
                        if (container) container.scrollBy({ left: -400, behavior: 'smooth' });
                      })}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-20 hidden lg:flex items-center justify-center w-10 h-10 rounded-full bg-blue-600/20 backdrop-blur-md border border-blue-500/30 hover:bg-blue-600/40 transition-all group/arrow focus:outline-none focus:ring-2 focus:ring-blue-600"
                      title="Scroll reviews left"
                      aria-label="Scroll reviews left"
                    >
                      <ChevronLeft className="w-5 h-5 text-blue-400 group-hover/arrow:text-blue-300 transition-colors" />
                    </button>

                    <div className="w-full overflow-x-auto overflow-y-visible scrollbar-hide" data-reviews-scroll>
                      <div className="flex gap-4 md:gap-6 pb-2 min-w-max">
                        {[
                          { name: "Julian Vance", text: "The Selvedge Denim is amazing. Click Bazaar has really great quality and good materials.", role: "Fashion Designer", rating: 5, date: "MAR 15 2026", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop" },
                          { name: "Sophia Chen", text: "Great shipping! My Arctic Humidifier came in perfect condition in just 24 hours.", role: "Interior Designer", rating: 5, date: "FEB 28 2026", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&h=200&auto=format&fit=crop" },
                          { name: "Marcus Thorne", text: "The Chrono Series watch is a masterpiece of kinetic movement. Highly recommended for enthusiasts.", role: "Timepiece Collector", rating: 5, date: "FEB 10 2026", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&auto=format&fit=crop" },
                          { name: "Elena Vasquez", text: "Impeccable customer service! They handled my order inquiry with professionalism and speed. Highly impressed.", role: "Brand Strategist", rating: 5, date: "JAN 20 2026", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&h=200&auto=format&fit=crop" },
                          { name: "David Kumar", text: "The packaging is as premium as the products. Every purchase feels like opening a gift from a luxury brand.", role: "Product Designer", rating: 5, date: "JAN 12 2026", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&h=200&auto=format&fit=crop" },
                          { name: "Amara Okonkwo", text: "Best online shopping experience I've had. The attention to detail and quality is unmatched in this category.", role: "Quality Auditor", rating: 5, date: "DEC 28 2025", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=200&h=200&auto=format&fit=crop" },
                          { name: "Lucas Torres", text: "Fast shipping, authentic products, and transparent pricing. This is how e-commerce should be done.", role: "Supply Chain Expert", rating: 5, date: "DEC 14 2025", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&auto=format&fit=crop" },
                          { name: "Priya Sharma", text: "Discovered some amazing products here that I couldn't find anywhere else. Highly recommend to all.", role: "Lifestyle Curator", rating: 5, date: "DEC 05 2025", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop" }
                        ].map((rev, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.8 }}
                            className="group relative bg-white/[0.03] border border-white/10 rounded-2xl p-4 md:p-5 backdrop-blur-3xl shadow-lg transition-all duration-500 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/20 flex flex-col items-center text-center flex-shrink-0 w-72 md:w-80"
                            onTouchStart={(e) => {
                              const container = document.querySelector('[data-reviews-scroll]');
                              if (container) {
                                const startX = e.touches[0].clientX;
                                const startScroll = container.scrollLeft;
                                const handleTouchMove = (moveEvent: Event) => {
                                  const touchEvent = moveEvent as TouchEvent;
                                  const diff = startX - touchEvent.touches[0].clientX;
                                  container.scrollLeft = startScroll + diff;
                                };
                                const handleTouchEnd = () => {
                                  container.removeEventListener('touchmove', handleTouchMove as EventListener);
                                  container.removeEventListener('touchend', handleTouchEnd as EventListener);
                                };
                                container.addEventListener('touchmove', handleTouchMove as EventListener);
                                container.addEventListener('touchend', handleTouchEnd as EventListener);
                              }
                            }}
                          >
                            <div className="absolute top-0 right-0 p-2 md:p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                              <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-500" />
                            </div>

                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-blue-600/10 flex items-center justify-center mb-2 md:mb-3 border border-blue-500/20">
                              <Quote className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                            </div>

                            <div className="flex gap-1 mb-2 md:mb-3">
                              {[...Array(5)].map((_, star) => (
                                <Star key={star} size={10} className={`${star < rev.rating ? 'text-blue-500 fill-blue-500' : 'text-white/10'}`} />
                              ))}
                            </div>

                            <p className="text-[11px] md:text-xs font-bold leading-tight text-slate-100 tracking-tight italic mb-3 md:mb-4 group-hover:text-white transition-colors line-clamp-2">
                              "{rev.text}"
                            </p>

                            <div className="mt-auto">
                              <h4 className="font-black text-xs md:text-sm tracking-tighter text-white mb-0.5 uppercase">{rev.name}</h4>
                              <div className="flex flex-col items-center gap-1">
                                <span className="text-[7px] md:text-[8px] font-black text-blue-500 uppercase tracking-[0.2em]">{rev.role}</span>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[6px] md:text-[7px] font-black text-white/30 uppercase tracking-widest">{rev.date}</span>
                                  <span className="w-0.5 h-0.5 bg-white/10 rounded-full"></span>
                                  <span className="text-[6px] md:text-[7px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-0.5">
                                    <Shield size={6} /> VERIFIED
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Right Arrow */}
                    <button
                      onClick={() => {
                        const container = document.querySelector('[data-reviews-scroll]');
                        if (container) container.scrollBy({ left: 400, behavior: 'smooth' });
                      }}
                      onKeyDown={(e) => handleKeyboardClick(e, () => {
                        const container = document.querySelector('[data-reviews-scroll]');
                        if (container) container.scrollBy({ left: 400, behavior: 'smooth' });
                      })}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-20 hidden lg:flex items-center justify-center w-10 h-10 rounded-full bg-blue-600/20 backdrop-blur-md border border-blue-500/30 hover:bg-blue-600/40 transition-all group/arrow focus:outline-none focus:ring-2 focus:ring-blue-600"
                      title="Scroll reviews right"
                      aria-label="Scroll reviews right"
                    >
                      <ChevronRight className="w-5 h-5 text-blue-400 group-hover/arrow:text-blue-300 transition-colors" />
                    </button>
                  </div>
                </div>
              </div>

              <div ref={newArrivalsRef} className="bg-amber-50/50 py-8 md:py-12 lg:py-16 border-y border-amber-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                  <ScrollReveal className="mb-3 sm:mb-4 md:mb-6 px-2 text-center flex flex-col items-center">
                    <div className="inline-flex items-center px-3 sm:px-4 py-1 sm:py-1.5 bg-blue-600 rounded-full mb-3 sm:mb-4 group hover:bg-blue-700 transition-colors duration-300 shadow-lg shadow-blue-500/20">
                      <h4 className="text-white font-bold uppercase text-[7px] sm:text-[8px] md:text-[9px] tracking-[0.3em] leading-none text-center">Recent Drops</h4>
                    </div>
                    <div className="text-center">
                      <WaveText text="Fresh Arrivals" className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight leading-tight text-slate-900" />
                    </div>
                  </ScrollReveal>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-10">
                    {products.filter(p => p.isNewArrival).sort((a, b) => a.name.localeCompare(b.name)).slice(0, 12).map(p => (
                      <ProductCard key={p.id} product={p} onAdd={() => addToCart(p.id)} onQuick={() => setQuickView(p)} isWish={wishlist.includes(p.id)} onWish={() => toggleWishlist(p.id)} />
                    ))}
                  </div>
                </div>
              </div>

              {/* FAQ Section removed from Home */}
            </div>
          )}
          {currentPage === 'shop' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 animate-fadeIn bg-amber-50">
              <div className="relative rounded-[28px] sm:rounded-[40px] md:rounded-[60px] bg-gradient-to-br from-red-950 via-slate-900 to-blue-900 text-white p-5 sm:p-8 md:p-10 mb-6 md:mb-8 shadow-2xl">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.28),transparent_54%)]"></div>
                <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                  <div>
                    <p className="text-[10px] md:text-[12px] font-black uppercase tracking-widest text-red-200 mb-2 md:mb-3">Catalog</p>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                      {selectedCategory === 'All' ? (
                        <span>All Collections</span>
                      ) : (
                        <span className="inline-flex items-center gap-3">
                          <span>{selectedCategory}</span>
                          <span className="text-[13px] md:text-sm bg-amber-50/15 px-3 py-1 rounded-full tracking-widest">{filteredProducts.length} items</span>
                        </span>
                      )}
                    </h2>
                    <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-red-100 max-w-xl">Browse curated products with premium filters, quick previews, and fast checkout—designed for modern e-commerce experience.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {['Grocery', 'Fashion', 'Mobile', 'Electronics', 'Beauty', 'Home', 'Gadgets', 'Accessories'].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat as any)}
                          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-950/40 text-slate-300 hover:bg-slate-900 hover:text-white border border-white/10'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    <div className="relative" ref={sortRef}>
                      <button
                        onClick={() => setIsSortOpen(!isSortOpen)}
                        className="flex items-center gap-3 bg-slate-950/70 border border-white/10 rounded-full px-5 py-2.5 text-white transition-all hover:bg-slate-900 active:scale-95 shadow-lg backdrop-blur-md"
                      >
                        <span className="text-[10px] md:text-[11px] uppercase tracking-widest text-white/60 font-black">Sort:</span>
                        <span className="text-[12px] font-black tracking-wide">
                          {shopSort === 'PriceLowHigh' ? 'Price: Low-High' :
                            shopSort === 'PriceHighLow' ? 'Price: High-Low' :
                              shopSort}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-blue-400 transition-transform duration-500 ease-out ${isSortOpen ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {isSortOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 15, scale: 0.9, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: 10, scale: 0.95, filter: 'blur(5px)' }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute top-full right-0 mt-3 w-52 bg-slate-950 border border-white/10 rounded-[28px] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] z-[60] overflow-hidden backdrop-blur-2xl"
                          >
                            <div className="p-2 space-y-1">
                              {[
                                { id: 'Alphabetical', label: 'Alphabetical' },
                                { id: 'Popular', label: 'Popularity' },
                                { id: 'PriceLowHigh', label: 'Price: Low to High' },
                                { id: 'PriceHighLow', label: 'Price: High to Low' }
                              ].map((option) => (
                                <button
                                  key={option.id}
                                  onClick={() => { setShopSort(option.id as any); setIsSortOpen(false); }}
                                  className={`w-full text-left px-5 py-4 text-[11px] font-black uppercase tracking-widest transition-all rounded-[20px] ${shopSort === option.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(p => (
                    <ProductCard key={p.id} product={p} onAdd={() => addToCart(p.id)} onQuick={() => setQuickView(p)} isWish={wishlist.includes(p.id)} onWish={() => toggleWishlist(p.id)} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-24 bg-amber-50 rounded-[40px] border border-amber-200">
                    <h3 className="text-2xl md:text-3xl font-black text-blue-900 mb-4">No results found</h3>
                    <p className="text-sm md:text-base text-slate-500 mb-8">Try adjusting your filters or search term to find what you’re looking for.</p>
                    <button onClick={() => { setSelectedCategory('All'); setSearch(''); }} className="bg-slate-950 text-white px-8 sm:px-10 py-2 sm:py-3 rounded-full font-black text-[9px] sm:text-[10px] uppercase tracking-widest hover:bg-blue-600 transition">Reset Filter</button>
                  </div>
                )}
              </div>
            </div>
          )}
          {currentPage === 'auth-choice' && (
            <AuthChoiceView
              mode={authChoiceMode}
              onSelect={(role) => {
                if (role === 'admin') setCurrentPage('admin-login');
                else setCurrentPage(authChoiceMode);
              }}
              onBack={() => setCurrentPage('home')}
            />
          )}
          {currentPage === 'admin-login' && (
            <AuthView
              mode="login"
              admin
              onAuth={handleLogin}
              onToggle={() => setCurrentPage('admin-signup')}
              handleNavigate={handleNavigate}
              showToast={showToast}
              handleLogin={handleLogin}
            />
          )}
          {currentPage === 'admin-signup' && (
            <AuthView
              mode="signup"
              admin
              onAuth={handleSignup}
              onToggle={() => setCurrentPage('admin-login')}
              handleNavigate={handleNavigate}
              showToast={showToast}
              handleLogin={handleLogin}
            />
          )}
          {currentPage === 'login' && <AuthView mode="login" onAuth={handleLogin} onToggle={() => { setAuthChoiceMode('signup'); setCurrentPage('auth-choice'); }} handleNavigate={handleNavigate} showToast={showToast} handleLogin={handleLogin} />}
          {currentPage === 'signup' && <AuthView mode="signup" onAuth={handleSignup} onToggle={() => { setCurrentPage('login'); window.location.hash = 'login'; scrollToTop(); }} handleNavigate={handleNavigate} showToast={showToast} handleLogin={handleLogin} />}
          {currentPage === 'cart' && <CartPage cart={cart} products={products} onRemove={removeFromCart} onAdd={addToCart} onCheckout={() => setCurrentPage('checkout')} onNavigate={handleNavigate} />}
          {currentPage === 'checkout' && <CheckoutPage cart={cart} products={products} onComplete={completeOrder} onAdd={addToCart} onRemove={removeFromCart} user={currentUser} showToast={showToast} isProcessing={isProcessing} />}
          {currentPage === 'order-success' && <OrderSuccessPage order={lastOrder} onNavigate={handleNavigate} products={products} />}
          {currentPage === 'profile' && currentUser && <ProfilePage user={currentUser} orders={orders} wishlist={wishlist} products={products} onNavigate={handleNavigate} onLogout={handleLogout} />}
          {currentPage === 'orders' && currentUser && <OrdersPage orders={orders.filter(o => o.userId === currentUser.id)} products={products} onNavigate={handleNavigate} />}
          {currentPage === 'tracking' && <LiveTrackingView orders={orders.filter(o => o.userId === currentUser?.id)} onNavigate={handleNavigate} />}
          {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}
          {currentPage === 'support' && <SupportPage onNavigate={handleNavigate} showToast={showToast} />}

          {currentPage === 'privacy' && <PrivacyPage onNavigate={handleNavigate} />}
          {currentPage === 'terms' && <TermsPage onNavigate={handleNavigate} />}
          {currentPage === 'legal' && <LegalPage onNavigate={handleNavigate} />}
          {currentPage === 'sustainability' && <SustainabilityPage onNavigate={handleNavigate} />}
          {currentPage === 'careers' && <CareersPage onNavigate={handleNavigate} />}
          {currentPage === 'faqs' && <FAQsPage onNavigate={handleNavigate} />}
          {currentPage === 'wishlist' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 animate-fadeIn bg-amber-50">
              <SectionHeader title="Your Wishlist" subtitle="Saved Pieces" />
              {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                  {products.filter(p => wishlist.includes(p.id)).map(p => (
                    <ProductCard key={p.id} product={p} onAdd={() => addToCart(p.id)} onQuick={() => setQuickView(p)} isWish={true} onWish={() => toggleWishlist(p.id)} />
                  ))}
                </div>
              ) : (
                <div className="py-20 sm:py-24 md:py-32 lg:py-40 text-center bg-amber-50 rounded-[28px] sm:rounded-[40px] md:rounded-[48px] border-2 border-dashed border-amber-200 flex flex-col items-center px-4 sm:px-6">
                  <Heart className="w-12 h-12 md:w-16 md:h-16 text-slate-200 mb-6" />
                  <h3 className="text-xl md:text-2xl font-black text-blue-900 mb-4 tracking-tighter page-sub-heading-animate">Your wishlist is empty</h3>
                  <button onClick={() => handleNavigate('shop')} className="bg-slate-950 text-white px-8 md:px-10 py-3 md:py-4 rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-widest">Explore Collections</button>
                </div>
              )}
            </div>
          )}
        </main>
        <Footer onNavigate={handleNavigate} isAdmin={currentUser?.role === UserRole.Admin} />
        {quickView && <QuickViewModal product={quickView} onClose={() => setQuickView(null)} onAdd={addToCart} isWish={wishlist.includes(quickView.id)} onWish={() => toggleWishlist(quickView.id)} />}

        {/* Dynamic Scroll Navigator */}
        <div className="fixed bottom-6 right-6 z-[90] pointer-events-none">
          {showScrollArrow === 'down' && (
            <div
              className="bg-amber-50/80 backdrop-blur-md p-3 rounded-xl border border-amber-200 shadow-xl pointer-events-auto cursor-pointer group transition-all hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-600"
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
              onKeyDown={(e) => handleKeyboardClick(e, () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }))}
              tabIndex={0}
              role="button"
              aria-label="Scroll down to bottom"
            >
              <ChevronDown className="w-5 h-5 text-blue-800 group-hover:scale-110 transition-transform" />
            </div>
          )}
          {showScrollArrow === 'up' && (
            <div
              className="bg-amber-50/80 backdrop-blur-md p-3 rounded-xl border border-amber-200 shadow-xl pointer-events-auto cursor-pointer group transition-all hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-600"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              onKeyDown={(e) => handleKeyboardClick(e, () => window.scrollTo({ top: 0, behavior: 'smooth' }))}
              tabIndex={0}
              role="button"
              aria-label="Scroll up to top"
            >
              <ChevronUp className="w-5 h-5 text-blue-800 group-hover:scale-110 transition-transform" />
            </div>
          )}
        </div>

        {toast && (
          <div
            className="fixed bottom-6 md:bottom-12 left-4 right-4 md:left-auto md:right-12 z-[100000] animate-fadeIn pointer-events-auto"
            onMouseEnter={() => {
              // Pause the auto-dismiss timer on hover
              if (toastTimeoutRef.current) {
                clearTimeout(toastTimeoutRef.current);
                toastTimeoutRef.current = null;
              }
            }}
            onMouseLeave={() => {
              // Resume the auto-dismiss timer on mouse leave
              toastTimeoutRef.current = setTimeout(() => {
                setToast(null);
                toastTimeoutRef.current = null;
              }, 4000);
            }}
          >
            <div className="bg-slate-950/95 text-white px-4 md:px-10 py-3 md:py-5 rounded-full shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] flex items-center gap-2 md:gap-5 border border-white/20 backdrop-blur-3xl transition-all">
              <div className="bg-blue-600 p-1 md:p-2 rounded-xl flex-shrink-0 animate-pulse shadow-lg"><Check className="w-3 h-3 md:w-5 md:h-5 text-white" /></div>
              <span className="font-black text-[8px] md:text-[11px] uppercase tracking-[0.15em] md:tracking-[0.25em] md:whitespace-nowrap leading-none mb-[1px] flex-1">{toast}</span>
              <button
                onClick={() => {
                  setToast(null);
                  if (toastTimeoutRef.current) {
                    clearTimeout(toastTimeoutRef.current);
                    toastTimeoutRef.current = null;
                  }
                }}
                className="p-1 md:p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0 text-slate-400 hover:text-white"
                title="Close notification"
              >
                <X className="w-3 h-3 md:w-4 md:h-4" />
              </button>
            </div>
          </div>
        )}

        <ClickBot showToast={showToast} currentUser={currentUser} />

        {showBackendModal && !backendOnline && (
          <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/80 backdrop-blur-lg p-4 cursor-pointer"
            onClick={(e) => e.target === e.currentTarget && setShowBackendModal(false)}
          >
            <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-200 cursor-default" data-lenis-prevent>
              <h3 className="text-xl font-black text-slate-900 mb-4">Backend Offline</h3>
              <p className="text-sm text-slate-600 mb-6">
                The application cannot reach the backend API. This usually means the backend server is not running.
                Please start it using the command below and then retry.
              </p>
              <div className="bg-slate-100 rounded-xl p-4 mb-6">
                <code className="text-[11px] font-mono text-slate-800">npm run dev</code>
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowBackendModal(false)} className="px-4 py-2 rounded-full bg-slate-200 font-bold text-slate-800 hover:bg-slate-300 transition">Dismiss</button>
                <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition">Retry</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const OrderSuccessPage = ({ order, onNavigate, products }: { order: Order | null; onNavigate: (p: string) => void; products: Product[] }) => {
  if (!order) return null;

  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(() => {
    setDownloading(true);
    const detailedItems = order.items.map((item: any) => {
      const p = products.find(x => x.id === item.productId);
      return { ...item, name: p?.name || item.name || 'Unknown Element', priceAtPurchase: item.priceAtPurchase || p?.price || 0 };
    });
    (window as any).generateProfessionalReceipt?.(order, { name: order.shippingAddress.fullName, email: order.shippingAddress.email } as any, detailedItems);
    setTimeout(() => setDownloading(false), 2000);
  }, [order, products]);
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24 animate-fadeIn bg-amber-50">
      <div className="bg-amber-50 p-8 md:p-14 rounded-[40px] md:rounded-[60px] border border-amber-200 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-500"></div>
        <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-500 text-white rounded-[24px] md:rounded-[32px] flex items-center justify-center mx-auto mb-8 md:mb-10 shadow-2xl animate-bounce">
          <CheckCircle className="w-8 h-8 md:w-10 md:h-10" />
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight mb-5 text-blue-800 text-center">
          Order Successful
        </h2>
        <p className="text-slate-500 font-medium mb-8 md:mb-10 max-w-sm mx-auto leading-relaxed text-xs md:text-sm">Your order has been confirmed. Tracking is now active for order #{order.id.slice(0, 8)}.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={handleDownload} disabled={downloading} className="bg-blue-600 text-white px-8 md:px-10 py-3.5 md:py-4 rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-slate-950 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-50">
            {downloading ? (
              <><Loader2 className="w-3 h-3 animate-spin" /> Processing...</>
            ) : (
              <><Download className="w-4 h-4" /> Download Receipt</>
            )}
          </button>
          <button onClick={() => onNavigate('shop')} className="bg-slate-950 text-white px-8 md:px-10 py-3.5 md:py-4 rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-3">Continue Exploring</button>
        </div>
      </div>
    </div>
  );
};

const ProfilePage = ({ user, orders, wishlist, products, onNavigate, onLogout }: { user: User; orders: Order[]; wishlist: string[]; products: Product[]; onNavigate: (p: string) => void; onLogout: () => void }) => {
  const userOrders = orders.filter(o => o.userId === user.id);
  const recentOrders = userOrders.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 animate-fadeIn bg-amber-50">
      <div className="flex-1 p-4 md:p-8" data-lenis-prevent>
        <SectionHeader title="User Profile" subtitle="Account Node" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mt-8">
          {/* Left Column: Details */}
          <div className="space-y-8 lg:col-span-1">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-600 rounded-[24px] flex items-center justify-center text-white shadow-xl">
                <UserIcon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Account User</p>
                <h2 className="text-2xl font-black text-blue-900 tracking-tighter">{user.name}</h2>
              </div>
            </div>

            <div className="p-8 bg-white rounded-[32px] border border-amber-200 space-y-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-50 text-blue-800 rounded-xl border border-amber-100 flex items-center justify-center">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                  <p className="font-bold text-blue-900 text-sm">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-50 text-blue-800 rounded-xl border border-amber-100 flex items-center justify-center">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Joined On</p>
                  <p className="font-bold text-blue-900 text-sm">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </div>

            <button onClick={onLogout} className="w-full bg-red-600 text-white h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg flex items-center justify-center gap-3">
              Logout <LogOut size={16} />
            </button>
          </div>

          {/* Right Column: History & Stats */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-slate-900 text-white p-8 rounded-[32px] relative overflow-hidden group">
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-2">Total Purchases</p>
                  <h4 className="text-4xl font-black italic tracking-tighter">{userOrders.length}</h4>
                </div>
                <Box size={24} className="absolute right-8 top-8 text-blue-400 opacity-20" />
              </div>

              <div className="p-8 bg-white rounded-[32px] border border-amber-200 shadow-sm flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Account Status: Active</span>
              </div>
            </div>

            <div className="p-8 bg-white rounded-[40px] border border-amber-200 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Recent Activity</h4>
                <button onClick={() => onNavigate('orders')} className="text-[9px] font-black uppercase text-blue-600 hover:underline">View All</button>
              </div>

              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-900 shadow-sm">
                          <Package size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-blue-900">Order #{order.id.slice(0, 8)}</p>
                          <p className="text-[9px] text-slate-400 font-bold">{formatDate(order.createdAt)}</p>
                        </div>
                      </div>
                      <Badge color="bg-emerald-500">{order.status}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest italic">No orders found yet</p>
                  <button onClick={() => onNavigate('shop')} className="mt-4 text-[10px] font-black text-blue-600 uppercase tracking-widest">Start Shopping</button>
                </div>
              )}
            </div>

            <div className="p-8 bg-white rounded-[40px] border border-amber-200 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Saved Favorites</h4>
                <button onClick={() => onNavigate('wishlist')} className="text-[9px] font-black uppercase text-rose-600 hover:underline">View All</button>
              </div>

              {wishlist.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {products.filter(p => wishlist.includes(p.id)).slice(0, 6).map(p => (
                    <div key={p.id} className="group cursor-pointer" onClick={() => onNavigate('shop')}>
                      <div className="relative overflow-hidden rounded-2xl bg-amber-50 border border-amber-100 group-hover:border-rose-300 transition-all h-32">
                        <img src={p.image || '/images/items/default.png'} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                          <Heart className="w-5 h-5 text-rose-500 opacity-0 group-hover:opacity-100 transition-all" fill="currentColor" />
                        </div>
                      </div>
                      <p className="text-[9px] font-bold text-blue-900 mt-2 line-clamp-2">{p.name}</p>
                      <p className="text-[8px] text-slate-500 font-bold">₹{p.price}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Heart className="w-8 h-8 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest italic">No saved favorites yet</p>
                  <button onClick={() => onNavigate('shop')} className="mt-4 text-[10px] font-black text-rose-600 uppercase tracking-widest">Browse & Save</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsPage = ({ user, onUpdate, onNavigate }: { user: User; onUpdate: (name: string, email: string) => Promise<void>; onNavigate: (p: string) => void }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onUpdate(name, email);
    setSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 animate-fadeIn bg-amber-50">
      <SectionHeader title="Account Settings" subtitle="Personal Details" />
      <div className="bg-amber-50 p-8 md:p-12 rounded-[40px] border border-amber-200 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 text-blue-100 opacity-20 pointer-events-none">
          <Settings size={120} className="animate-spin-slow" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-8 max-w-xl">
          <div className="space-y-3">
            <label htmlFor="registration-name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors"><UserIcon className="w-5 h-5" /></div>
              <input
                id="registration-name"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e as any);
                  }
                }}
                className="w-full bg-white border-2 border-slate-100 rounded-[24px] py-4 pl-14 pr-6 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-slate-700 shadow-sm"
              />
            </div>
          </div>
          <div className="space-y-3">
            <label htmlFor="registration-email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors"><Mail className="w-5 h-5" /></div>
              <input
                id="registration-email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e as any);
                  }
                }}
                className="w-full bg-white border-2 border-slate-100 rounded-[24px] py-4 pl-14 pr-6 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-slate-700 shadow-sm"
              />
            </div>
          </div>
          <div className="pt-6 flex flex-col md:flex-row gap-4">
            <button
              type="submit" disabled={saving}
              className="px-8 py-4 bg-slate-950 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {saving ? 'Updating...' : 'Save Changes'} <Zap className="w-4 h-4" />
            </button>
            <button
              type="button" onClick={() => onNavigate('profile')}
              className="px-8 py-4 bg-white border border-slate-200 text-slate-500 rounded-full font-black text-[10px] uppercase tracking-widest hover:text-blue-600 transition-all active:scale-95"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const OrdersPage = ({ orders, products, onNavigate }: { orders: Order[]; products: Product[]; onNavigate: (p: string) => void }) => (
  <div className="max-w-7xl mx-auto px-6 py-10 md:py-16 animate-fadeIn bg-amber-50">
    <SectionHeader title="Your Orders" subtitle="View your past purchases" />
    {orders.length > 0 ? (
      <div className="space-y-8 md:space-y-10">
        {orders.map(order => (
          <div key={order.id} className="bg-amber-50 p-8 md:p-12 rounded-[40px] md:rounded-[50px] border border-amber-200 shadow-sm transition-all duration-500 hover:shadow-xl group">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="flex items-center gap-6 md:gap-10">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-50 rounded-[24px] border border-amber-200 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all"><Package className="w-8 h-8" /></div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-black text-blue-800 uppercase tracking-widest font-mono">#{order.id.slice(0, 12)}</span>
                    <Badge color="bg-amber-500">{order.status}</Badge>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-blue-900 tracking-tight">Order {order.status === OrderStatus.Delivered ? 'Complete' : 'Active'}</h3>
                  <p className="text-slate-400 text-[10px] md:text-xs font-medium mt-1 uppercase tracking-widest">Ordered on {formatDate(order.createdAt)}</p>
                  {order.status === OrderStatus.Delivered && order.deliveryDate && (
                    <div className="mt-3 flex items-center gap-2 text-green-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <p className="text-[10px] md:text-xs font-black uppercase tracking-wider">
                        Successfully delivered at {new Date(order.deliveryDate).toLocaleTimeString()} on {formatDate(order.deliveryDate)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-row md:flex-col justify-between items-center md:items-end w-full md:w-auto mt-6 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 border-slate-50 gap-4">
                <span className="text-2xl md:text-3xl font-black text-blue-800 tracking-tighter">₹{order.total.toLocaleString()}</span>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const detailedItems = order.items.map((item: any) => {
                        const p = products.find(x => x.id === item.productId);
                        return { ...item, name: p?.name || item.name || 'Unknown Element', priceAtPurchase: item.priceAtPurchase || p?.price || 0 };
                      });
                      (window as any).generateProfessionalReceipt?.(order, { name: order.shippingAddress.fullName, email: order.shippingAddress.email } as any, detailedItems);
                    }}
                    className="px-6 md:px-8 py-2.5 md:py-3 bg-blue-600 text-white rounded-full font-black text-[9px] uppercase tracking-widest hover:bg-slate-950 transition-all flex items-center gap-3 shadow-lg"><FileText className="w-4 h-4" /> Receipt</button>
                  <button onClick={() => onNavigate('tracking')} className="px-6 md:px-8 py-2.5 md:py-3 border border-slate-200 text-slate-500 rounded-full font-black text-[9px] uppercase tracking-widest hover:text-blue-600 hover:border-blue-600 transition-all flex items-center gap-3">Live Status <ArrowRight className="w-4 h-4" /></button>
                </div>
              </div>
            </div>

            {/* Real Details Section */}
            <div className="mt-6 pt-6 border-t border-amber-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Items Ordered</h4>
                <div className="space-y-4">
                  {order.items.slice(0, 3).map((item: OrderItem, idx: number) => {
                    const p = products.find(x => x.id === item.productId);
                    return (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl border border-amber-200 overflow-hidden shrink-0 p-1">
                          <img src={p?.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100'} className="w-full h-full object-cover rounded-lg" alt="" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-black text-blue-900 uppercase truncate">{p?.name || item.name}</p>
                          <p className="text-[9px] font-bold text-slate-400">QTY {item.quantity} × <span className="text-blue-600">₹{(item.priceAtPurchase || p?.price || 0).toLocaleString()}</span></p>
                        </div>
                      </div>
                    );
                  })}
                  {order.items.length > 3 && <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">+ {order.items.length - 3} More Items</p>}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shipping Address</h4>
                <div className="p-5 bg-white/50 border border-amber-100 rounded-2xl space-y-2">
                  <p className="text-xs font-black text-blue-900 group-hover:text-blue-800 transition-colors uppercase tracking-tight">{order.shippingAddress.fullName}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed">{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.zip}</p>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tracking Info</h4>
                <div className="p-5 bg-white/50 border border-amber-100 rounded-2xl relative overflow-hidden">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Current Status: {order.status}</span>
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 mt-2">Shipping from: India Hub</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="py-24 md:py-40 text-center bg-amber-50 rounded-[40px] md:rounded-[60px] border-2 border-dashed border-amber-200 flex flex-col items-center px-6">
        <Package className="w-16 h-16 text-slate-100 mb-8" />
        <h3 className="text-2xl font-black text-blue-900 mb-4 page-sub-heading-animate">No orders found</h3>
        <button onClick={() => onNavigate('shop')} className="bg-slate-950 text-white px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest">Initiate Discovery</button>
      </div>
    )}
  </div>
);

const QuickViewModal = ({ product, onClose, onAdd, isWish, onWish }: any) => {
  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const [imgIndex, setImgIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIndex(i => (i === 0 ? images.length - 1 : i - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIndex(i => (i === images.length - 1 ? 0 : i + 1));
  };

  return (
    <>
      {lightbox && (
        <ImageLightbox
          src={images[imgIndex]}
          alt={product.name}
          images={images}
          imgIndex={imgIndex}
          setImgIndex={setImgIndex}
          onClose={() => setLightbox(false)}
        />
      )}
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn cursor-pointer"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div
          className="bg-amber-50 w-full max-w-4xl rounded-[40px] md:rounded-[50px] overflow-hidden shadow-2xl relative animate-scaleIn border border-amber-200 flex flex-col md:flex-row h-full max-h-[80vh] md:max-h-[75vh] cursor-default overscroll-contain"
          data-lenis-prevent
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 md:top-6 md:right-6 p-2 md:p-3 bg-white/90 backdrop-blur-xl rounded-xl hover:bg-red-600 hover:text-white transition-all z-[60] shadow-xl border border-amber-200 group object-cover"
            title="Close product details"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          </button>
          <div className="w-full md:w-1/2 relative bg-amber-50 overflow-hidden h-48 md:h-auto group/carousel">
            <img src={images[imgIndex]} className="w-full h-full object-contain transition-all duration-500 cursor-zoom-in" alt="" onClick={() => setLightbox(true)} />
            {images.length > 1 && (
              <div className="z-20">
                <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 rounded-xl shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-blue-600 hover:text-white pointer-events-auto" title="Previous image">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 rounded-xl shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-blue-600 hover:text-white pointer-events-auto" title="Next image">
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                  {images.map((_: unknown, idx: number) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-all duration-300 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600 ${idx === imgIndex ? 'bg-blue-600 w-6' : 'bg-white/90 hover:bg-blue-400'}`}
                      onClick={(e) => { e.stopPropagation(); setImgIndex(idx); }}
                      onKeyDown={(e) => { handleKeyboardClick(e, () => { setImgIndex(idx); }); e.stopPropagation(); }}
                      tabIndex={0}
                      role="button"
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
            {product.discount && <div className="absolute top-4 left-4 md:top-8 md:left-8 bg-red-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg shrink-0 z-50">-{product.discount}% UNLOCKED</div>}
          </div>
          <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col overflow-y-auto" data-lenis-prevent>
            <div className="flex gap-4 mb-4 md:mb-6">
              <Badge>{product.category}</Badge>
              {product.isNewArrival && <Badge color="bg-orange-500">NEW ARRIVAL</Badge>}
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-blue-900 tracking-tighter mb-3 md:mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="flex flex-col items-start gap-1">
                <span className="text-2xl md:text-3xl font-black text-blue-800 tracking-tighter">₹{product.price.toLocaleString()}</span>
                {product.discount > 0 && (
                  <span className="text-xs md:text-sm font-black text-black line-through">
                    ₹{Math.round(product.price / (1 - product.discount / 100)).toLocaleString()}
                  </span>
                )}
              </div>
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
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Customer Reviews</h4>
                {(() => {
                  const reviewsPool = [
                    { user: 'Maya K.', comment: 'The material quality is excellent. Really great item.', rating: 5 },
                    { user: 'Ethan J.', comment: 'Really well made. Arrived on time!', rating: 5 },
                    { user: 'Sasha V.', comment: 'Great style. Looks amazing and high quality.', rating: 4 },
                    { user: 'Liam W.', comment: 'Shipping took a bit longer, but the product is perfect.', rating: 4 },
                    { user: 'Sofia R.', comment: 'Exquisite detail! A significant addition to my collection.', rating: 5 },
                    { user: 'Noah B.', comment: 'The interface for this item is smooth. Highly recommended.', rating: 5 },
                    { user: 'Zara L.', comment: 'A bit pricier than standard nodes, but worth the premium.', rating: 4 },
                    { user: 'Oliver D.', comment: 'Technically superior to previous releases. 5 stars.', rating: 5 }
                  ];
                  // Use product.name as a seed for stable "randomness"
                  const seed = product.name.length;
                  const productReviews = [
                    reviewsPool[seed % reviewsPool.length],
                    reviewsPool[(seed + 3) % reviewsPool.length],
                    reviewsPool[(seed + 7) % reviewsPool.length]
                  ];
                  return productReviews.map((rev, i) => (
                    <div key={i} className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-blue-900">{rev.user}</span>
                        <div className="flex items-center gap-1 text-orange-500">
                          {Array.from({ length: 5 }).map((_, star) => (
                            <Star key={star} className={`w-2.5 h-2.5 ${star < rev.rating ? 'fill-current' : 'text-slate-200'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed italic">"{rev.comment}"</p>
                    </div>
                  ));
                })()}
              </div>
            </div>
            <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-amber-200">
              <div className="flex gap-3">
                <button onClick={() => { onAdd(product.id); onClose(); }} className="flex-1 bg-slate-950 text-white py-4 md:py-5 rounded-2xl md:rounded-[32px] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl flex items-center justify-center gap-3 group active:scale-95">
                  Add to Bag <ShoppingCart className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                </button>
                <button onClick={() => onWish(product.id)} className={`w-14 items-center justify-center border-2 rounded-2xl md:rounded-[32px] transition-all hidden md:flex active:scale-90 shadow-sm ${isWish ? 'bg-red-600 border-red-600 text-white' : 'border-amber-200 bg-amber-50 hover:border-rose-500 hover:text-red-600'}`} title={isWish ? "Remove from wishlist" : "Add to wishlist"}>
                  <Heart className={`w-5 h-5 ${isWish ? 'fill-current' : ''}`} />
                </button>
              </div>
              <button className="w-full bg-blue-600 text-white py-4 rounded-xl md:rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2 group active:scale-95">
                <Zap className="w-3.5 h-3.5 fill-current" /> Checkout Now
              </button>
              <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Complimentary Express Delivery Included</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// --- Informational Pages Components ---

const AboutPage = ({ onNavigate }: any) => (
  <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 animate-fadeIn bg-amber-50">
    <SectionHeader title="Why We're Different" subtitle="Quality & Service" centered />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center mb-24">
      <div className="space-y-8">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1] text-blue-900 heading-gradient-text-6s">
          Defining the <br /><span className="italic italic-text-premium">Future of Prime</span>
        </h2>
        <div className="space-y-6">
          <p className="text-slate-500 font-medium leading-loose text-sm md:text-base border-l-4 border-amber-200 pl-8">
            Founded on a singular principle: that e-commerce should not just be a transaction, but an archival experience. We bridge the gap between world-class aesthetics and military-grade logistical precision.
          </p>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-6 md:p-8 bg-white rounded-[32px] border border-slate-100 shadow-xl relative overflow-hidden group hover:border-blue-600 transition-all duration-500"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-blue-600/10 transition-colors"></div>
            <p className="text-slate-500 font-medium leading-relaxed text-sm md:text-base relative z-10">
              Established in 2026, <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-green-600 bg-clip-text text-transparent font-black">Click Bazaar</span> was designed by
              <motion.a
                href="https://github.com/DebasmitaBose0" target="_blank" rel="noopener noreferrer"
                className="mx-1 px-2 py-0.5 rounded-lg bg-blue-50 text-blue-600 font-black hover:bg-blue-600 hover:text-white transition-all duration-300 inline-block shadow-sm"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Debasmita Bose
              </motion.a>
              and contributed by
              <motion.a
                href="https://github.com/KGFCH2" target="_blank" rel="noopener noreferrer"
                className="mx-1 px-2 py-0.5 rounded-lg bg-red-50 text-red-600 font-black hover:bg-red-600 hover:text-white transition-all duration-300 inline-block shadow-sm"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Babin Bid
              </motion.a>.
            </p>
          </motion.div>
        </div>
      </div>
      <div className="bg-slate-950 p-1 rounded-[50px] md:rounded-[70px] shadow-2xl relative overflow-hidden group">
        <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80" className="w-full h-auto rounded-[48px] md:rounded-[68px] opacity-80 group-hover:scale-105 transition-transform duration-700" alt="Boutique Interior" />
        <div className="absolute inset-0 bg-blue-900/20 backdrop-blur-[2px]"></div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
      {[
        { icon: Award, title: "Curated Excellence", text: "Every item in our archive undergoes a 27-point authentication and quality check." },
        { icon: Zap, title: "Fulfillment Velocity", text: "Our global logistical node network ensures priority delivery for all acquisitions." },
        { icon: ShieldCheck, title: "Archival Security", text: "Your transaction history and identity are protected by AES-256 end-to-end encryption." }
      ].map((item, idx) => (
        <div key={idx} className="bg-amber-50 p-10 rounded-[40px] border border-amber-200 shadow-sm hover:shadow-xl transition-all group hover:-translate-y-2 duration-500">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl border-2 border-amber-100 flex items-center justify-center text-blue-800 mb-8 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
            <item.icon className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black text-blue-900 mb-4 tracking-tight">{item.title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed">{item.text}</p>
        </div>
      ))}
    </div>
  </div>
);

const SupportPage = ({ onNavigate, showToast }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('All fields are required.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.sendSupportInquiry(name, email, message);
      showToast(res.message);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      showToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-24 animate-fadeIn bg-amber-50">
      <SectionHeader title="Help Center" subtitle="Support Portal" centered />

      <div className="flex flex-col lg:flex-row gap-12 md:gap-20">
        <div className="lg:w-2/5 space-y-10 md:space-y-12">
          <div className="sticky top-28">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight text-blue-900 mb-8">
              Expert <span className="italic hero-text-glow">Guidance</span>
            </h2>
            <p className="text-slate-500 font-medium text-base md:text-lg leading-relaxed mb-12 max-w-sm">
              Our archival specialists are ready to assist with your logistical inquiries and acquisition needs.
            </p>

            <div className="grid grid-cols-1 gap-6">
              {[
                { icon: <Mail className="w-5 h-5" />, label: "Email Node", val: "dbose272@gmail.com", href: "mailto:dbose272@gmail.com" },
                { icon: <Phone className="w-5 h-5" />, label: "Voice Channel", val: "+91 6289415265", href: "tel:6289415265" }
              ].map((item, i) => (
                <a key={i} href={item.href} className="flex items-center gap-6 p-6 bg-white rounded-[32px] border border-amber-200 hover:border-blue-500 transition-all group shadow-sm hover:shadow-xl hover:-translate-y-1 duration-500">
                  <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-6 group-hover:scale-110 transition-all duration-500">{item.icon}</div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{item.label}</p>
                    <p className="font-black text-blue-900 text-sm md:text-base flex items-center gap-2">
                      {item.val}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:w-3/5">
          <div className="bg-white rounded-[60px] p-8 md:p-16 border border-slate-100 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.05)] relative overflow-hidden group/form">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover/form:bg-blue-600/10 transition-colors duration-700"></div>
            <div className="flex items-center justify-between mb-12 relative z-10">
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Inquiry Protocol</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">Submit your secure inquiry below</p>
              </div>
              <div className="w-12 h-12 bg-slate-950 text-white rounded-2xl flex items-center justify-center group-hover/form:scale-110 group-hover/form:rotate-12 transition-all duration-500"><Zap className="w-5 h-5" /></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Identity Name</label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e as any);
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 px-8 py-5 rounded-[24px] text-slate-900 font-bold focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all outline-none"
                    placeholder="Full Name"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email Node</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e as any);
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 px-8 py-5 rounded-[24px] text-slate-900 font-bold focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all outline-none"
                    placeholder="archive@node.com"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Inquiry Details</label>
                <textarea
                  required
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      e.preventDefault();
                      handleSubmit(e as any);
                    }
                  }}
                  rows={6}
                  className="w-full bg-slate-50 border border-slate-200 px-8 py-6 rounded-[32px] text-slate-900 font-bold focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all outline-none resize-none"
                  placeholder="Describe your logistical requirement..."
                ></textarea>
              </div>

              <button
                disabled={loading}
                className="w-full bg-slate-950 text-white py-6 md:py-8 rounded-[32px] md:rounded-[40px] font-black text-sm md:text-base uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-2xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4 group"
              >
                {loading ? (
                  <><Loader2 className="w-3 h-3 animate-spin" /> Transmitting...</>
                ) : (
                  <><Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> Transmit Inquiry</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const PrivacyPage = ({ onNavigate }: any) => (
  <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 animate-fadeIn bg-amber-50">
    <SectionHeader title="Privacy Policy" subtitle="Data Security" centered />
    <div className="bg-amber-50 p-10 md:p-16 rounded-[50px] md:rounded-[70px] shadow-sm border border-amber-200 leading-loose text-sm md:text-base mb-12">
      <Lock className="w-14 h-14 text-blue-800 mb-10" />
      <h3 className="text-2xl font-black text-blue-900 mb-8 tracking-tighter">Your Security, Our Foundation</h3>
      <div className="space-y-8 text-slate-500 font-medium">
        <p>At <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-green-600 bg-clip-text text-transparent font-black">Click Bazaar</span>, we employ military-grade encryption to protect your identity and transaction history. Data is not a commodity to us; it is a sacred trust between us and our customers.</p>
        <div className="space-y-6">
          {[
            { title: "Zero Brokerage Policy", text: "We strictly prohibit the sale or exchange of user data with third-party advertising entities." },
            { title: "AES-256 Encryption", text: "All transaction logs and personal identifiers are encrypted at rest using industry-standard protocols." },
            { title: "Limited Data Collection", text: "We only collect data points necessary for order delivery and shipping updates." }
          ].map((item, i) => (
            <div key={i} className="flex gap-6 items-start p-8 bg-white border border-amber-100 rounded-[32px] group hover:border-blue-600 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-blue-900 mb-2 group-hover:text-blue-600 transition-colors">{item.title}</h4>
                <p className="text-xs leading-relaxed">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-8 border-t border-amber-200 pt-6">Version 1.2.0 | CLICK <span className="text-red-600">BAZAAR</span> SECURITY TEAM</p>
    </div>
  </div>
);

const TermsPage = ({ onNavigate }: any) => (
  <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 animate-fadeIn bg-amber-50">
    <SectionHeader title="Terms of Use" subtitle="User Rules" centered />
    <div className="bg-amber-50 p-10 md:p-16 rounded-[50px] shadow-sm border border-amber-200 text-slate-500 font-medium text-sm leading-loose">
      <h3 className="text-xl font-black text-blue-900 mb-10 uppercase tracking-widest">General Usage Protocols</h3>
      <p className="mb-10 text-slate-600">By accessing the <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-green-600 bg-clip-text text-transparent font-black">Click Bazaar</span> network, you agree to the rules defined in this shopping agreement. These terms ensure the integrity of our curated ecosystem.</p>
      <div className="space-y-12">
        {[
          { id: "1", title: "Identity Verification", text: "Users must maintain a single, authenticated account. Suspicious activity or account duplication may result in temporary account restriction." },
          { id: "2", title: "Acquisition Finality", text: "Once a product enters the 'In-Transit' status, shipping processes cannot be halted. Return requests can only be made after delivery." },
          { id: "3", title: "Fulfillment Priority", text: "Click Bazaar reserves the right to manage order priority during high-volume new drops to ensure systemic stability." }
        ].map((item) => (
          <div key={item.id} className="border-l-4 border-amber-200 pl-8 py-2 space-y-4 group hover:border-blue-600 hover:bg-white/50 hover:pl-10 transition-all duration-500 rounded-r-3xl">
            <h4 className="font-black text-blue-900 uppercase text-xs tracking-widest group-hover:text-blue-600 transition-colors">{item.id}. {item.title}</h4>
            <p className="group-hover:text-slate-800 transition-colors">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const LegalPage = ({ onNavigate }: any) => (
  <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 animate-fadeIn bg-amber-50">
    <SectionHeader title="Legal Info" subtitle="Rules & Policies" centered />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="bg-amber-50 p-12 rounded-[50px] border border-amber-200 group hover:bg-slate-950 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl">
        <div className="w-12 h-12 bg-amber-50 rounded-2xl border-2 border-amber-100 flex items-center justify-center text-blue-800 mb-10 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
          <Scale className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-black text-blue-900 mb-6 tracking-tighter group-hover:text-white">Compliance Node</h3>
        <p className="text-slate-500 font-medium leading-loose mb-10 text-sm group-hover:text-slate-400">Full adherence to international e-commerce regulations and shipping standards. Our legal team is continuously audited for transparency and regulatory alignment.</p>
        <Badge color="bg-blue-600">Global Verified</Badge>
      </div>
      <div className="bg-amber-50 p-12 rounded-[50px] border border-amber-200 group hover:bg-slate-950 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl">
        <div className="w-12 h-12 bg-amber-50 rounded-2xl border-2 border-amber-100 flex items-center justify-center text-blue-800 mb-10 group-hover:bg-red-600 group-hover:text-white group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-black text-blue-900 mb-6 tracking-tighter group-hover:text-white">Proprietary Rights</h3>
        <p className="text-slate-500 font-medium leading-loose mb-10 text-sm group-hover:text-slate-400">All curated content, descriptions, and telemetry interfaces are protected proprietary assets of the <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-green-600 bg-clip-text text-transparent font-black">Click Bazaar</span> Collective Architecture.</p>
        <Badge color="bg-red-600">IP Protected</Badge>
      </div>
    </div>
  </div>
);

const SustainabilityPage = ({ onNavigate }: any) => (
  <div className="max-w-4xl mx-auto px-6 py-10 md:py-16 animate-fadeIn bg-amber-50">
    <SectionHeader title="Sustainability" subtitle="Earth First" centered />
    <div className="bg-amber-50 p-10 md:p-16 rounded-[50px] border border-amber-200 group/sust overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover/sust:bg-emerald-600/10 transition-colors duration-1000"></div>
      <div className="flex items-center gap-6 mb-10 relative z-10">
        <div className="w-16 h-16 bg-emerald-100 rounded-3xl flex items-center justify-center text-emerald-600 group-hover/sust:scale-110 group-hover/sust:rotate-12 transition-all duration-500 shadow-sm border border-emerald-200/50">
          <Zap className="w-8 h-8" />
        </div>
        <h3 className="text-2xl md:text-3xl font-black text-blue-900 tracking-tighter">Carbon-Neutral Fulfillment</h3>
      </div>
      <div className="space-y-8 text-slate-500 font-medium leading-loose relative z-10">
        <p>At <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-green-600 bg-clip-text text-transparent font-black">Click Bazaar</span>, we recognize that logistical excellence must not come at a cost to our terrestrial archive. Our sustainability node manages active carbon-offsetting protocols for every 100km of freight telemetry.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 relative z-10">
          <div className="p-8 bg-white/80 backdrop-blur-sm rounded-[32px] border border-amber-100 group/item hover:border-emerald-500 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover/item:bg-emerald-600 group-hover/item:text-white group-hover/item:rotate-12 group-hover/item:scale-110 transition-all duration-500 shadow-sm border border-emerald-100">
              <Leaf className="w-6 h-6" />
            </div>
            <h4 className="font-black text-blue-900 uppercase text-xs tracking-widest mb-4 group-hover/item:text-emerald-600 transition-colors">Biodegradable Packing</h4>
            <p className="text-xs leading-relaxed text-slate-500 group-hover/item:text-slate-700 transition-colors">Our archival boxes are 100% compostable, utilizing innovative mushroom-based cushioning and water-activated sealing nodes.</p>
          </div>
          <div className="p-8 bg-white/80 backdrop-blur-sm rounded-[32px] border border-amber-100 group/item hover:border-emerald-500 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover/item:bg-emerald-600 group-hover/item:text-white group-hover/item:rotate-12 group-hover/item:scale-110 transition-all duration-500 shadow-sm border border-emerald-100">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="font-black text-blue-900 uppercase text-xs tracking-widest mb-4 group-hover/item:text-emerald-600 transition-colors">Electric Fleet Node</h4>
            <p className="text-xs leading-relaxed text-slate-500 group-hover/item:text-slate-700 transition-colors">By 2026, 85% of our last-mile delivery nodes will be powered by authenticated renewable energy sources.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
const CareersPage = ({ onNavigate }: any) => (
  <div className="max-w-4xl mx-auto px-6 py-10 md:py-16 animate-fadeIn bg-amber-50">
    <SectionHeader title="Careers" subtitle="Join the Collective" centered />
    <div className="bg-slate-950 text-white p-12 md:p-20 rounded-[50px] md:rounded-[70px] shadow-2xl relative overflow-hidden mb-12 group/careers">
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -ml-20 -mt-20 group-hover/careers:bg-blue-600/20 transition-colors duration-1000"></div>
      <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1] mb-8 bg-gradient-to-br from-red-100 via-white to-blue-100 bg-clip-text text-transparent heading-gradient-text-6s">Architect the <span className="italic italic-text-premium">Future of Commerce</span></h3>
      <p className="text-slate-400 font-medium leading-loose text-sm md:text-base max-w-2xl mb-12 relative z-10">We are seeking elite designers, logistics architects, and security experts to join our global archival team. Are you ready to initialize your identity within <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-green-600 bg-clip-text text-transparent font-black">Click Bazaar</span>?</p>
      <div className="space-y-4 relative z-10">
        {[
          { title: "Senior Logistics Architect", node: "SF-01" },
          { title: "Archival UI/UX Strategist", node: "REMOTE" },
          { title: "Protocol Security Engineer", node: "DE-04" }
        ].map((job, i) => (
          <div key={i} className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-3xl group hover:bg-white/10 hover:border-blue-500/50 hover:scale-[1.02] hover:-translate-x-1 transition-all duration-500 cursor-pointer shadow-lg">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-12 transition-all duration-500"><TrendingUp size={20} /></div>
              <div>
                <h4 className="font-black text-lg group-hover:text-blue-400 transition-colors">{job.title}</h4>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">NODE {job.node}</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-600 transition-all duration-500">
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const FAQsPage = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const questions = [
    { q: "How do I track my order?", a: "Go to the 'Live Tracking' section in the footer or your profile to see the current status of your package from our global hub." },
    { q: "What payment methods are accepted?", a: "We accept all major Credit/Debit cards, UPI, and Net Banking securely." },
    { q: "Are the products authentic?", a: "Yes, every item in ClickBazaar is curated and verified for quality before being listed." },
    { q: "What is the shipping fee?", a: "A fixed 3.5% fee is applied to all orders to ensure priority processing and secure fulfillment." },
    { q: "Can I cancel my order?", a: "Orders can be cancelled within 1 hour of placement before they transition to 'Packed' status." },
    { q: "How long does delivery take?", a: "Domestic orders arrive in 24-48 hours. International shipping typically takes 3-7 days." },
    { q: "What is the return policy?", a: "You can return unused items in original packaging within 30 days of delivery." },
    { q: "How secure is my data?", a: "We use advanced end-to-end AES-256 encryption to ensure your identity and transaction data remain private." }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 animate-fadeIn bg-amber-50">
      <SectionHeader title="Frequently Asked" subtitle="Questions & Answers" centered />
      <div className="space-y-4 md:space-y-6">
        {questions.map((item, i) => (
          <div key={i} className={`bg-white rounded-[32px] md:rounded-[40px] border transition-all duration-500 overflow-hidden ${activeIndex === i ? 'border-blue-600 shadow-xl shadow-blue-500/10' : 'border-amber-200 shadow-sm hover:border-amber-300'}`}>
            <button
              onClick={() => setActiveIndex(activeIndex === i ? null : i)}
              className="w-full px-8 md:px-10 py-6 md:py-8 flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-4 md:gap-6">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${activeIndex === i ? 'bg-blue-600 text-white rotate-12' : 'bg-amber-100 text-blue-600 group-hover:scale-110'}`}>
                  <span className="font-black text-xs md:text-sm">Q{i + 1}</span>
                </div>
                <h4 className={`text-sm md:text-base font-black tracking-tight transition-colors ${activeIndex === i ? 'text-blue-600' : 'text-slate-900'}`}>{item.q}</h4>
              </div>
              <div className={`p-2 rounded-xl transition-all duration-500 ${activeIndex === i ? 'bg-blue-50 text-blue-600 rotate-180' : 'bg-slate-50 text-slate-400'}`}>
                <ChevronDown className="w-5 h-5" />
              </div>
            </button>
            <AnimatePresence>
              {activeIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="px-8 md:px-10 pb-8 md:pb-10 pt-2 border-t border-slate-50">
                    <div className="pl-14 md:pl-16 border-l-4 border-blue-100 italic">
                      <p className="text-slate-500 font-medium text-xs md:text-sm leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Live Tracking View Component ---

const LiveTrackingView = ({ orders, onNavigate }: { orders: Order[], onNavigate: (p: string) => void }) => {
  const activeOrders = orders.filter(o => o.status !== OrderStatus.Delivered);

  if (activeOrders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 animate-fadeIn bg-amber-50 text-center flex flex-col items-center">
        <Radar className="w-16 h-16 md:w-24 md:h-24 text-slate-200 mb-10 animate-pulse" />
        <h2 className="text-2xl md:text-3xl font-black text-blue-900 tracking-tighter mb-4 page-sub-heading-animate">No active shipments detected</h2>
        <p className="text-slate-400 mb-10 max-w-sm text-sm md:text-base">Initiate an archival acquisition to activate live tracking telemetry and monitor your fulfillment in real-time.</p>
        <button onClick={() => onNavigate('shop')} className="bg-slate-950 text-white px-10 md:px-12 py-4 md:py-5 rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-colors shadow-2xl">Shop Collections</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 md:py-16 animate-fadeIn bg-amber-50">
      <SectionHeader
        title={<WaveText text="Live Tracking" className="text-5xl md:text-8xl font-black text-blue-900 tracking-tighter" />}
        subtitle="Shipping Info"
      />
      <div className="flex justify-center mb-12">
        <div className="bg-amber-50 px-6 md:px-8 py-4 md:py-5 rounded-[24px] md:rounded-[28px] border border-amber-200 shadow-sm flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-amber-500 animate-ping"></div>
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">{activeOrders.length} Active Nodes detected</span>
        </div>
      </div>

      <div className="space-y-16">
        {activeOrders.map((order, idx) => {
          const orderTime = new Date(order.createdAt);
          const arrivalDate = new Date(orderTime.getTime() + 3 * 24 * 60 * 60 * 1000); // T+3 Days

          return (
            <div key={order.id} className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-16 border-b border-amber-100 pb-16 last:border-0">
              <div className="lg:col-span-2 bg-amber-50 rounded-[40px] md:rounded-[60px] border border-amber-200 shadow-2xl overflow-hidden p-8 md:p-16 relative">
                <div className="flex flex-col md:flex-row justify-between items-start mb-12 md:mb-16 gap-6">
                  <div>
                    <span className="text-[10px] font-black uppercase text-blue-800 tracking-widest block mb-1 font-mono">Archive ID: #{order.id.slice(0, 12)}</span>
                    <h3 className="text-2xl md:text-3xl font-black text-blue-900 tracking-tighter card-heading-animate">
                      {idx === 0 ? 'Primary Acquisition' : `Acquisition node ${idx + 1}`} - Hub Departure
                    </h3>
                  </div>
                  <Badge color="bg-orange-500">Accelerated Fulfillment</Badge>
                </div>
                <div className="space-y-10 md:space-y-12 relative">
                  <div className="absolute left-[20px] md:left-[22px] top-4 bottom-4 w-1 bg-blue-100/30"></div>
                  {[
                    { status: 'Delivery Initialized', detail: <><span className="clickbazaar-brand">Central Gateway,</span> {order.shippingAddress.city}</>, time: `ETA ${formatDate(arrivalDate)}`, active: false },
                    { status: 'Logistical Deployment', detail: 'Global Archival Network', time: 'In Transit', active: true },
                    { status: 'Package Processed', detail: <><span className="clickbazaar-brand">Click Bazaar</span> Fulfillment Center</>, time: orderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), active: false },
                    { status: 'Acquisition Authenticated', detail: 'System Validation Complete', time: formatDate(orderTime), active: false },
                  ].map((step, i) => (
                    <div key={i} className="flex gap-6 md:gap-10 relative z-10">
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-[16px] md:rounded-[20px] flex items-center justify-center shrink-0 transition-all duration-500 ${step.active ? 'bg-blue-600 text-white shadow-2xl shadow-blue-200' : 'bg-white border-2 border-amber-100 text-slate-200'}`}>
                        {step.active ? <Truck className="w-5 h-5" /> : <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-current" />}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-black text-base md:text-lg tracking-tight card-heading-animate ${step.active ? 'text-blue-900' : 'text-slate-400'}`}>{step.status}</h4>
                        <p className="text-xs md:text-sm font-medium text-slate-400 mt-1 uppercase tracking-widest">{step.detail}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">{step.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-8 md:space-y-12">
                <div className="bg-amber-50 border border-amber-200 p-8 md:p-12 rounded-[36px] md:rounded-[50px] shadow-sm">
                  <h4 className="text-3xl md:text-5xl font-black tracking-tighter leading-[1] md:leading-[0.9] mb-8 text-blue-800 heading-gradient-text-6s"><span className="block">Shopping <span className="italic">Made Easy</span></span></h4>
                  <div className="flex gap-4 md:gap-5">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-blue-50 flex items-center justify-center shrink-0"><MapPin className="w-5 h-5 md:w-6 md:h-6 text-blue-800" /></div>
                    <p className="text-xs md:text-sm font-medium text-slate-500 leading-relaxed pt-1">
                      <span className="text-blue-900 font-black text-[10px] uppercase block mb-1">Consignee</span>
                      <span className="font-black text-blue-900">{order.shippingAddress.fullName}</span><br />
                      {order.shippingAddress.address}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.zip}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Receipt Utility Node ---
(window as any).generateProfessionalReceipt = (order: Order, user: User, cartItems: any[]) => {
  const { jsPDF } = (window as any).jspdf || {};
  if (!jsPDF) {
    console.error("Archival PDF Node offline. jspdf not found on window.");
    return;
  }
  const doc = new jsPDF();
  // Calculations
  const subTotal = cartItems.reduce((a, b) => a + (b.priceAtPurchase * b.quantity), 0);
  const taxItems = cartItems.map(item => {
    // Standard Archival Fee: 3.5% for all deployment elements
    const tax = Math.round(item.priceAtPurchase * item.quantity * 0.035);
    return { ...item, tax };
  });
  const totalTax = taxItems.reduce((a, b) => a + b.tax, 0);
  const finalTotal = subTotal + totalTax;

  // Generate a truly unique, alphanumeric Order ID if not present
  const rawId = order.id ? order.id.toString() : Math.random().toString(36).substring(2, 10).toUpperCase();
  const orderId = rawId.startsWith('ORD-') || rawId.startsWith('CBX-') ? rawId : `ORD-${rawId}-${Date.now().toString(36).toUpperCase()}`;
  const userName = user?.name || order.shippingAddress.fullName || 'Curator';

  // --- PDF Header ---
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 40, 'F');

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22); // Reduced slightly to prevent potential overlap
  doc.setTextColor(255, 255, 255);
  doc.text("CLICKBAZAAR", 20, 25);

  doc.setFontSize(9);
  doc.setTextColor(59, 130, 246); // blue-500
  doc.text("GLOBAL ARCHIVE 2026", 20, 32);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11); // Reduced from 14 to prevent overlap with logo
  doc.text(`ID: ${orderId}`, 190, 25, { align: 'right' });

  // --- Info Section ---
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9);
  doc.text("AUTHENTICATOR (USER)", 20, 55);
  doc.setFontSize(11);
  doc.text(userName.toUpperCase().substring(0, 30), 20, 62); // Clamped length
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text((user?.email || "curator@clickbazaar.arch").substring(0, 40), 20, 67);

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9);
  doc.text("DEPLOYMENT DESTINATION", 120, 55);
  doc.setFontSize(11);
  doc.text(order.shippingAddress.fullName.toUpperCase().substring(0, 30), 120, 62);
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`${order.shippingAddress.address}`.substring(0, 45), 120, 67);
  doc.text(`${order.shippingAddress.city} - ${order.shippingAddress.zip}`, 120, 72);

  // --- Table Body ---
  const tableData = taxItems.map(item => [
    item.name,
    item.quantity.toString(),
    `INR ${item.priceAtPurchase.toLocaleString()}`,
    `INR ${(item.priceAtPurchase * item.quantity).toLocaleString()}`
  ]);

  (doc as any).autoTable({
    startY: 85,
    head: [['Archival Element', 'Quantity', 'Base price', 'Subtotal']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: {
      fontSize: 9,
      font: 'helvetica',
      cellPadding: 4,
      overflow: 'linebreak' // Ensures no overlapping in cells
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { halign: 'center' },
      2: { halign: 'right' },
      3: { halign: 'right' }
    }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;

  // --- Totals ---
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text("SUBTOTAL: INR " + subTotal.toLocaleString(), 105, finalY, { align: 'center' });

  doc.text(`ORDER TAX (${subTotal === 0 ? 0 : 3.5}%): INR ${totalTax.toLocaleString()}`, 105, finalY + 7, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(`TOTAL PRICE: INR ${finalTotal.toLocaleString()}`, 105, finalY + 18, { align: 'center' });

  // --- Footer ---
  doc.setDrawColor(226, 232, 240);
  doc.line(20, 275, 190, 275);

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("THIS IS A SYSTEM GENERATED ORDER RECEIPT. SECURELY GENERATED END-TO-END.", 105, 282, { align: 'center' });
  doc.text("© 2026 ClickBazaar Global Store | Support: dbose272@gmail.com", 105, 287, { align: 'center' });

  // --- Save PDF ---
  const safeName = userName.replace(/[^a-z0-9]/gi, '_');
  const safeOrderId = orderId.replace(/[^a-z0-9-]/gi, '_');
  const fileName = `ClickBazaar_${safeName}_${safeOrderId}.pdf`;
  doc.save(fileName);
};


const FlashTimer = ({ userId }: { userId?: string }) => {
  const [timeLeft, setTimeLeft] = useState(28800); // 8 Hours in seconds

  useEffect(() => {
    if (!userId) return;
    const key = `clickbazaar_flash_timer_${userId}`;
    const saved = localStorage.getItem(key);

    let initial = saved ? parseInt(saved) : 28800;
    setTimeLeft(initial);

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev > 0 ? prev - 1 : 0;
        localStorage.setItem(key, next.toString());
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [userId]);

  const h = Math.floor(timeLeft / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="flex gap-2 md:gap-3 items-center">
      <div className="flex flex-col items-center"><span>{pad(h)}</span><span className="text-[7px] md:text-[8px] opacity-60">Hrs</span></div>
      <span className="opacity-40">:</span>
      <div className="flex flex-col items-center"><span>{pad(m)}</span><span className="text-[7px] md:text-[8px] opacity-60">Min</span></div>
      <span className="opacity-40">:</span>
      <div className="flex flex-col items-center"><span>{pad(s)}</span><span className="text-[7px] md:text-[8px] opacity-60">Sec</span></div>
    </div>
  );
};

// --- Footer Component ---
const Footer = ({ onNavigate, isAdmin }: { onNavigate: (p: string, cat?: Category) => void, isAdmin: boolean }) => (
  <footer className="bg-slate-950 text-white py-16 md:py-24 border-t border-slate-900 no-print">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-24">
      <div className="col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
        <div className="flex items-center gap-2.5 mb-6 md:mb-10 cursor-pointer group" onClick={() => onNavigate('home')}>
          <div className="bg-white p-2 rounded-xl group-hover:bg-blue-50 transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center">
            <img src="/Favicon.png" className="w-6 h-6 object-contain" alt="ClickBazaar Logo" />
          </div>
          <span className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase bg-gradient-to-r from-orange-500 via-amber-500 to-green-600 bg-clip-text text-transparent">Click Bazaar</span>
        </div>
        <p className="text-slate-500 font-medium text-xs leading-relaxed max-w-sm mb-8 md:mb-12">Defining digital excellence through curated aesthetics, global archival fulfillment, and advanced archival telemetry.</p>
        <div className="flex flex-col items-center md:items-start gap-6">
          <div className="flex justify-center md:justify-start gap-4 mb-8 md:mb-0 w-full">
            <a href="https://github.com/DebasmitaBose0" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-500 hover:scale-125 transition-all group shadow-xl" title="Visit Debasmita Bose's GitHub">
              <Github size={16} className="group-hover:rotate-12 transition-transform" />
            </a>
            <a href="https://github.com/KGFCH2" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-600 hover:border-red-500 hover:scale-125 transition-all group shadow-xl" title="Visit KGFCH2's GitHub">
              <Github size={16} className="group-hover:-rotate-12 transition-transform" />
            </a>
          </div>
          <div className="space-y-3">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Tactical Credits</p>
            <div className="space-y-3">
              <motion.div
                className="flex items-center gap-3 group/credit"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover/credit:scale-150 transition-transform"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Designed by <motion.a
                    href="https://github.com/DebasmitaBose0" target="_blank" rel="noopener noreferrer"
                    className="text-white hover:text-blue-400 transition-colors px-2 py-1 bg-white/5 rounded-md border border-white/10 hover:border-blue-500/50"
                    whileHover={{ x: 5 }}
                  >Debasmita Bose</motion.a>
                </p>
              </motion.div>
              <motion.div
                className="flex items-center gap-3 group/credit"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 group-hover/credit:scale-150 transition-transform"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Contributed by <motion.a
                    href="https://github.com/KGFCH2" target="_blank" rel="noopener noreferrer"
                    className="text-white hover:text-red-400 transition-colors px-2 py-1 bg-white/5 rounded-md border border-white/10 hover:border-red-500/50"
                    whileHover={{ x: 5 }}
                  >Babin Bid</motion.a>
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <ScrollRevealFooter>
          <h4 className="font-black text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-slate-400 mb-8 md:mb-12 hover:text-blue-500 transition-colors cursor-default text-center md:text-left">Customer Command</h4>
        </ScrollRevealFooter>
        <ul className="space-y-4 md:space-y-6 flex flex-col items-start md:items-start group/footer">
          <li><button onClick={() => onNavigate('tracking')} className="text-[10px] md:text-xs font-black text-slate-500 hover:text-amber-400 transition-all uppercase tracking-widest flex items-center gap-3 icon-pop group whitespace-nowrap overflow-hidden max-w-full"><Radar className="w-4 h-4 text-slate-500 group-hover:text-amber-500 shrink-0" /> Live Tracking</button></li>
          <li><button onClick={() => onNavigate('orders')} className="text-[10px] md:text-xs font-black text-slate-500 hover:text-blue-400 transition-all uppercase tracking-widest flex items-center gap-3 icon-pop group whitespace-nowrap"><Package className="w-4 h-4 text-slate-500 group-hover:text-blue-500" /> My Orders</button></li>
          <li><button onClick={() => onNavigate('profile')} className="text-[10px] md:text-xs font-black text-slate-500 hover:text-slate-300 transition-all uppercase tracking-widest flex items-center gap-3 icon-pop group whitespace-nowrap"><UserIcon className="w-4 h-4 text-slate-500 group-hover:text-slate-300" /> Account Profile</button></li>
          <li><button onClick={() => onNavigate('wishlist')} className="text-[10px] md:text-xs font-black text-slate-500 hover:text-rose-400 transition-all uppercase tracking-widest flex items-center gap-3 icon-pop group whitespace-nowrap"><Heart className="w-4 h-4 text-slate-500 group-hover:text-rose-500" /> Saved Pieces</button></li>
          <li><button onClick={() => {
            if (isAdmin) onNavigate('admin-dashboard');
            else onNavigate('admin-login');
          }} className="text-[10px] md:text-xs font-black text-red-600 hover:text-red-400 transition-all uppercase tracking-widest flex items-center gap-3 icon-pop group whitespace-nowrap"><LayoutDashboard className="w-4 h-4 text-red-600/50 group-hover:text-red-500" /> Admin Dashboard</button></li>
        </ul>
      </div>
      <div className="md:ml-auto md:text-left">
        <ScrollRevealFooter>
          <h4 className="font-black text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-slate-400 mb-8 md:mb-12 hover:text-blue-500 transition-colors cursor-default text-center md:text-left">Archives & Info</h4>
        </ScrollRevealFooter>
        <ul className="space-y-6 flex flex-col items-start md:items-start group/footer-info">
          <li><button onClick={() => onNavigate('about')} className="text-[10px] md:text-xs font-black text-slate-500 hover:text-indigo-400 transition-all uppercase tracking-widest flex items-center gap-3 icon-pop group whitespace-nowrap"><Info className="w-4 h-4 text-slate-500 group-hover:text-indigo-500" /> About Us</button></li>
          <li><button onClick={() => onNavigate('support')} className="text-[10px] md:text-xs font-black text-slate-500 hover:text-sky-400 transition-all uppercase tracking-widest flex items-center gap-3 icon-pop group whitespace-nowrap"><Headphones className="w-4 h-4 text-slate-500 group-hover:text-sky-500" /> Support Center</button></li>
          <li><button onClick={() => onNavigate('faqs')} className="text-[10px] md:text-xs font-black text-slate-500 hover:text-amber-400 transition-all uppercase tracking-widest flex items-center gap-3 icon-pop group whitespace-nowrap"><HelpCircle className="w-4 h-4 text-slate-500 group-hover:text-amber-500" /> FAQs</button></li>
          <li><button onClick={() => onNavigate('sustainability')} className="text-[10px] md:text-xs font-black text-slate-500 hover:text-emerald-400 transition-all uppercase tracking-widest flex items-center gap-3 icon-pop group whitespace-nowrap"><Globe className="w-4 h-4 text-slate-500 group-hover:text-emerald-500" /> Sustainability</button></li>
          <li><button onClick={() => onNavigate('legal')} className="text-[10px] md:text-xs font-black text-slate-500 hover:text-violet-400 transition-all uppercase tracking-widest flex items-center gap-3 icon-pop group whitespace-nowrap"><Scale className="w-4 h-4 text-slate-500 group-hover:text-violet-500" /> Legal Info</button></li>
          <li><button onClick={() => onNavigate('privacy')} className="text-[10px] md:text-xs font-black text-slate-500 hover:text-cyan-400 transition-all uppercase tracking-widest flex items-center gap-3 icon-pop group whitespace-nowrap"><Shield className="w-4 h-4 text-slate-500 group-hover:text-cyan-500" /> Privacy Policy</button></li>
          <li><button onClick={() => onNavigate('terms')} className="text-[10px] md:text-xs font-black text-slate-500 hover:text-pink-400 transition-all uppercase tracking-widest flex items-center gap-3 icon-pop group whitespace-nowrap"><FileText className="w-4 h-4 text-slate-500 group-hover:text-pink-500" /> Terms of Use</button></li>
        </ul>
      </div>
      <div className="col-span-full mt-20 pt-20 border-t border-white/10 flex flex-col items-center">
        <div className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-[0.3em] text-center">
          © 2026 CLICK <span className="underline decoration-red-500 underline-offset-2">BAZAAR</span> GLOBAL ARCHIVE
        </div>
      </div>
    </div>
  </footer>
);

// --- Admin Components ---

const AdminDashboard = ({ users, orders, sessions: initialSessions, products, setProducts, onLogout, onNavigate, isMobileOpen, setIsMobileOpen, showToast }: any) => {
  const [activeTab, setActiveTab] = useState('activity');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Modal Scroll Lock for Admin User Details
  useEffect(() => {
    if (selectedUser) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [selectedUser]);

  const [adminUsers, setAdminUsers] = useState<User[]>(users);
  const [adminOrders, setAdminOrders] = useState<Order[]>(orders);
  const [adminSessions, setAdminSessions] = useState<any[]>(initialSessions);
  const [userFilter, setUserFilter] = useState('');
  const [orderFilter, setOrderFilter] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'All' | 'Placed' | 'Packed' | 'Shipped' | 'Delivered'>('All');
  const [loadingAdminData, setLoadingAdminData] = useState(false);

  const handleBackToStorefront = useCallback(() => {
    setIsMobileOpen(false);
    onNavigate('home');
  }, [onNavigate, setIsMobileOpen]);

  const userStats = useMemo(() => {
    if (!selectedUser) return null;
    const userOrders = adminOrders.filter((o: any) => o.userId === selectedUser.id);
    const userSessions = adminSessions.filter((s: any) => s.userId === selectedUser.id);
    return {
      totalOrders: userOrders.length,
      totalSpend: userOrders.reduce((a: number, b: any) => a + b.total, 0),
      sessionCount: userSessions.length,
      lastActive: userSessions[0]?.created_at || null,
      orders: userOrders,
      sessions: userSessions
    };
  }, [selectedUser, adminOrders, adminSessions]);

  useEffect(() => {
    (async () => {
      setLoadingAdminData(true);
      try {
        const usersRes = await api.fetchAdminUsers();
        const ordersRes = await api.fetchAdminOrders();
        const sessionsRes = await api.fetchSessionLogs();

        setAdminUsers(usersRes.users.map((u: any) => ({
          ...u,
          id: (u.id || '').toString(),
          createdAt: u.created_at || u.createdAt ? new Date(u.created_at || u.createdAt).toISOString() : new Date().toISOString()
        })));
        setAdminOrders(ordersRes.orders.map((o: any) => ({
          ...o,
          id: (o.id || '').toString(),
          userId: (o.user_id || o.userId || '').toString(),
          createdAt: o.created_at || o.createdAt ? new Date(o.created_at || o.createdAt).toISOString() : new Date().toISOString(),
          deliveryDate: o.delivery_date || o.deliveryDate ? new Date(o.delivery_date || o.deliveryDate).toISOString() : undefined,
          items: typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || [])
        })));
        setAdminSessions(sessionsRes.sessions.map((s: any) => ({
          ...s,
          id: (s.id || '').toString(),
          userId: (s.user_id || s.userId || '').toString(),
        })));
      } catch (err) {
        console.error('Failed to load admin records', err);
      }
      setLoadingAdminData(false);
    })();
  }, []);

  const filteredUsers = useMemo(() => {
    const q = userFilter.trim().toLowerCase();
    return adminUsers.filter(u => {
      if (!q) return true;
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    });
  }, [adminUsers, userFilter]);

  const filteredOrders = useMemo(() => {
    const q = orderFilter.trim().toLowerCase();
    return adminOrders.filter(o => {
      const matchText = !q || (o.id || '').toString().toLowerCase().includes(q) || (o.userId || '').toString().toLowerCase().includes(q);
      const matchStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
      return matchText && matchStatus;
    });
  }, [adminOrders, orderFilter, orderStatusFilter]);

  return (
    <div className="min-h-screen flex bg-amber-50 animate-fadeIn flex-col md:flex-row">
      <div className="md:hidden bg-slate-950 text-white p-4 flex justify-between items-center sticky top-0 z-[60]">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-blue-800" />
          <span className="font-black uppercase tracking-tighter">DASHBOARD</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 bg-slate-900 rounded-lg">
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      <aside className={`w-72 bg-slate-950 text-white flex-col sticky top-0 h-screen shadow-2xl z-50 md:flex ${isMobileOpen ? 'fixed inset-0 w-full flex' : 'hidden md:flex'}`}>
        <div className="p-10 mb-8 hidden md:block">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-blue-600 p-1 rounded-lg"><LayoutDashboard className="w-5 h-5" /></div>
            <span className="text-xl font-black uppercase tracking-tighter">DASHBOARD</span>
          </div>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Admin Dashboard</p>
        </div>
        <div className={`p-6 mb-8 md:hidden ${isMobileOpen ? 'block' : 'hidden'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1 rounded-lg"><LayoutDashboard className="w-5 h-5" /></div>
              <span className="text-xl font-black uppercase tracking-tighter">DASHBOARD</span>
            </div>
            <button onClick={() => setIsMobileOpen(false)} className="p-2 bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors" aria-label="Close navigation menu">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2">Admin Dashboard</p>
        </div>
        <nav className="flex-1 px-6 space-y-2 mt-12 md:mt-0">
          {[
            { id: 'activity', label: 'Activity Logs', icon: Activity },
            { id: 'users', label: 'User Management', icon: Users },
            { id: 'orders', label: 'Order History', icon: CreditCard },
            { id: 'products', label: 'Products', icon: Box }
          ].map(tab => (
            <button
              key={tab.id} onClick={() => { setActiveTab(tab.id); setSelectedUser(null); setIsMobileOpen(false); }}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black text-[11px] uppercase tracking-widest icon-hover-animate ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/20' : 'text-slate-500 hover:text-white hover:bg-slate-900'}`}
            >
              <tab.icon className="w-5 h-5" /> {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-8 border-t border-slate-900 space-y-4">
          <button onClick={onLogout} className="w-full text-left px-6 py-3 font-black text-[10px] uppercase tracking-widest text-red-600 hover:bg-red-600/10 rounded-xl flex items-center gap-4"><LogOut className="w-4 h-4" /> Logout</button>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-12 overflow-y-auto relative custom-scrollbar" data-lenis-prevent>
        <div className="flex flex-col items-center mb-12 md:mb-16 gap-6">
          <div className="flex flex-col items-center gap-6">
            <div className="text-center">
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter capitalize text-blue-800 heading-gradient-text-6s mb-3 whitespace-nowrap">
                {activeTab === 'activity' ? 'Activity' : activeTab === 'users' ? 'Users' : activeTab === 'orders' ? 'Orders' : activeTab === 'products' ? 'Products' : activeTab} Section
              </h1>
              <p className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest">Real-time system activity</p>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="bg-amber-50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-amber-200 flex items-center gap-3 md:gap-4 shadow-sm">
              <div className="bg-blue-100 p-1.5 md:p-2 rounded-lg md:rounded-xl text-blue-800"><Timer className="w-4 h-4 md:w-5 md:h-5" /></div>
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">{adminSessions.length} Recent Visits</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto bg-amber-50 rounded-[32px] md:rounded-[48px] border border-slate-50 shadow-sm">
          {activeTab === 'activity' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-full md:min-w-[900px]">
                <thead>
                  <tr className="border-b border-slate-50 bg-amber-100/30">
                    <th className="px-6 md:px-10 py-6 md:py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">User Details</th>
                    <th className="px-6 md:px-10 py-6 md:py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">IP Address</th>
                    <th className="px-6 md:px-10 py-6 md:py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-6 md:px-10 py-6 md:py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Access Time</th>
                    <th className="px-6 md:px-10 py-6 md:py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Device</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {adminSessions && adminSessions.length > 0 ? adminSessions.map((s: any) => {
                    const isSuccessful = s.success === 1 || s.success === true;
                    const userAgent = s.user_agent || 'Unknown';
                    const isMobile = /mobile|android|iphone|ipad/i.test(userAgent);
                    const isChrome = /chrome/i.test(userAgent);
                    const isFirefox = /firefox/i.test(userAgent);
                    const isSafari = /safari/i.test(userAgent) && !/chrome/i.test(userAgent);
                    const isEdge = /edg/i.test(userAgent);

                    let browser = 'Unknown';
                    if (isChrome) browser = 'Chrome';
                    else if (isFirefox) browser = 'Firefox';
                    else if (isSafari) browser = 'Safari';
                    else if (isEdge) browser = 'Edge';

                    const deviceType = isMobile ? 'Mobile' : 'Desktop';

                    return (
                      <tr key={s.id} className="hover:bg-amber-50 transition-colors">
                        <td className="px-6 md:px-10 py-4 md:py-6">
                          <div className="flex items-center gap-3 md:gap-4">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-950 text-white flex items-center justify-center font-black text-[10px] md:text-xs uppercase">{(s.userName || 'U')[0]}</div>
                            <div>
                              <p className="font-black text-blue-900 text-xs md:text-sm">{s.userName}</p>
                              <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest">{s.userEmail}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 md:px-10 py-4 md:py-6">
                          <code className="text-[9px] md:text-[10px] font-bold bg-slate-100 px-2 py-1 rounded text-slate-700">{s.ip || 'N/A'}</code>
                        </td>
                        <td className="px-6 md:px-10 py-4 md:py-6">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isSuccessful ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            <span className={`w-2 h-2 rounded-full ${isSuccessful ? 'bg-green-600 animate-pulse' : 'bg-red-600'}`}></span>
                            {isSuccessful ? '✓ Success' : '✕ Failed'}
                          </span>
                        </td>
                        <td className="px-6 md:px-10 py-4 md:py-6 text-[10px] md:text-[11px] font-black text-slate-500">
                          <div className="flex flex-col gap-1">
                            <span>{formatDate(s.created_at)}</span>
                            <span className="text-[8px] text-slate-400">{new Date(s.created_at).toLocaleTimeString()}</span>
                          </div>
                        </td>
                        <td className="px-6 md:px-10 py-4 md:py-6 text-[9px] md:text-[10px] font-bold text-slate-600">
                          <span className="inline-flex items-center gap-2">
                            <span className="bg-slate-100 px-2 py-1 rounded">{browser}</span>
                            <span className="text-slate-400">•</span>
                            <span className="bg-slate-100 px-2 py-1 rounded">{deviceType}</span>
                          </span>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={5} className="px-6 md:px-10 py-8 text-center text-slate-500 text-sm">
                        No login sessions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === 'users' && (
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <input
                    value={userFilter}
                    onChange={e => setUserFilter(e.target.value)}
                    placeholder="Search users..."
                    className="w-full md:w-80 bg-white border border-slate-200 rounded-full px-4 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    onClick={() => {
                      const csv = [
                        ['Name', 'Email', 'Role', 'Created At'],
                        ...filteredUsers.map(u => [u.name, u.email, u.role, u.createdAt]),
                      ];
                      const blob = new Blob([csv.map(r => r.map(c => `\"${String(c).replace(/\"/g, '""')}\"`).join(',')).join('\n')], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'users.csv';
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-colors"
                  >
                    Export CSV
                  </button>
                </div>
                <div className="text-xs text-slate-500">{loadingAdminData ? 'Refreshing...' : `Loaded ${filteredUsers.length} users`}</div>
              </div>
              <table className="w-full text-left min-w-full md:min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="px-6 md:px-10 py-6 md:py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">User Details</th>
                    <th className="px-6 md:px-10 py-6 md:py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
                    <th className="px-6 md:px-10 py-6 md:py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-6 md:px-10 py-6 md:py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredUsers.map((u: User) => (
                    <tr key={u.id} className="hover:bg-amber-50 transition-colors group">
                      <td className="px-6 md:px-10 py-4 md:py-6">
                        <p className="font-black text-blue-900 text-xs md:text-sm">{u.name}</p>
                        <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase">{u.email}</p>
                      </td>
                      <td className="px-6 md:px-10 py-4 md:py-6"><Badge color={u.role === UserRole.Admin ? "bg-slate-950" : "bg-blue-600"}>{u.role}</Badge></td>
                      <td className="px-6 md:px-10 py-4 md:py-6"><span className="text-[10px] font-bold text-blue-800 uppercase tracking-widest">Active</span></td>
                      <td className="px-6 md:px-10 py-4 md:py-6">
                        <button
                          onMouseEnter={() => { }}
                          onMouseLeave={() => { }}
                          onClick={() => setSelectedUser(u)}
                          className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-lg md:rounded-xl transition-all font-black text-[9px] md:text-[10px] uppercase tracking-widest whitespace-nowrap"
                        >
                          <Eye className="w-4 h-4" /> Full Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === 'orders' && (
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                  <input
                    value={orderFilter}
                    onChange={e => setOrderFilter(e.target.value)}
                    placeholder="Search orders..."
                    className="w-full md:w-80 bg-white border border-slate-200 rounded-full px-4 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <select
                    value={orderStatusFilter}
                    onChange={e => setOrderStatusFilter(e.target.value as any)}
                    className="w-full md:w-56 bg-white border border-slate-200 rounded-full px-4 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    title="Filter orders by status"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Placed">Placed</option>
                    <option value="Packed">Packed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">{loadingAdminData ? 'Refreshing...' : `Showing ${filteredOrders.length} orders`}</span>
                  <button
                    onClick={() => {
                      const csv = [
                        ['Order ID', 'User ID', 'Total', 'Status', 'Created At', 'Delivery Date'],
                        ...filteredOrders.map(o => [
                          o.id,
                          o.userId,
                          o.total,
                          o.status,
                          o.createdAt,
                          o.deliveryDate ? formatDate(o.deliveryDate) : '',
                        ]),
                      ];
                      const blob = new Blob([csv.map(r => r.map(c => `\"${String(c).replace(/\"/g, '""')}\"`).join(',')).join('\n')], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'orders.csv';
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-colors"
                  >
                    Export CSV
                  </button>
                </div>
              </div>

              <table className="w-full text-left min-w-full md:min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="px-6 md:px-10 py-6 md:py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Customer</th>
                    <th className="px-6 md:px-10 py-6 md:py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Timestamp</th>
                    <th className="px-6 md:px-10 py-6 md:py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Total Price</th>
                    <th className="px-6 md:px-10 py-6 md:py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Items Count</th>
                    <th className="px-6 md:px-10 py-6 md:py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredOrders.map((o: any) => {
                    const user = adminUsers.find(u => u.id === o.userId);
                    return (
                      <tr key={o.id} className="hover:bg-amber-50 transition-colors">
                        <td className="px-6 md:px-10 py-4 md:py-6">
                          <p className="font-black text-blue-900 text-[10px] md:text-sm uppercase tracking-tight">{o.userName || user?.name || 'Unknown User'}</p>
                          <span className="text-[8px] md:text-[9px] font-bold text-slate-400">{o.userEmail || user?.email || 'N/A'}</span>
                        </td>
                        <td className="px-6 md:px-10 py-4 md:py-6 text-[9px] md:text-[10px] font-bold text-slate-400 uppercase">
                          {formatDate(o.createdAt)} @ {new Date(o.createdAt).toLocaleTimeString()}
                        </td>
                        <td className="px-6 md:px-10 py-4 md:py-6 font-black text-xs md:text-sm text-blue-900">₹{o.total.toLocaleString()}</td>
                        <td className="px-6 md:px-10 py-4 md:py-6 text-[10px] font-bold text-slate-500">{Array.isArray(o.items) ? o.items.length : 0} Item{(Array.isArray(o.items) ? o.items.length : 0) !== 1 ? 's' : ''}</td>
                        <td className="px-6 md:px-10 py-4 md:py-6">
                          <select
                            value={o.status}
                            onChange={async (e) => {
                              try {
                                const newStatus = e.target.value;
                                const res = await api.updateOrderStatus(o.id, newStatus);
                                if (res.success) {
                                  setAdminOrders(prev => prev.map(ord =>
                                    ord.id === o.id ? {
                                      ...ord,
                                      status: newStatus as any,
                                      deliveryDate: res.deliveryDate ? new Date(res.deliveryDate).toISOString() : undefined
                                    } : ord
                                  ));
                                  showToast("Order status updated");
                                }
                              } catch (err) {
                                showToast("Failed to update status");
                              }
                            }}
                            className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border-2 transition-all cursor-pointer focus:outline-none ${o.status === 'Delivered' ? 'bg-green-100 border-green-200 text-green-800' :
                              o.status === 'Shipped' ? 'bg-blue-100 border-blue-200 text-blue-800' :
                                'bg-amber-100 border-amber-200 text-amber-800'
                              }`}
                            title="Change order status"
                          >
                            <option value="Placed">Placed</option>
                            <option value="Packed">Packed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === 'products' && (
            <div className="p-6 md:p-10">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-blue-900 uppercase tracking-tight text-center flex-1">Product Management</h2>
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
                      <p className="text-slate-600 text-[10px] font-semibold leading-relaxed line-clamp-4">
                        {product.description || "Premium quality product with excellent features and durability."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
        {selectedUser && userStats && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-10 bg-slate-950/80 backdrop-blur-md animate-fadeIn transition-all duration-300 cursor-pointer"
            onClick={(e) => e.target === e.currentTarget && setSelectedUser(null)}
          >
            <div
              className="bg-amber-50 w-full max-w-5xl rounded-[32px] md:rounded-[48px] overflow-hidden shadow-2xl relative animate-scaleIn border border-amber-200 flex flex-col h-fit max-h-[95vh] lg:max-h-[85vh] overscroll-contain cursor-default"
              data-lenis-prevent
            >
              <button onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 md:top-6 md:right-6 p-1.5 md:p-2 bg-amber-50 rounded-lg md:rounded-xl hover:bg-red-600 hover:text-white transition-all z-10" title="Close user details"><X className="w-4 h-4 md:w-5 md:h-5" /></button>
              <div className="flex flex-col md:flex-row h-full overflow-hidden">
                <div className="md:w-1/3 bg-amber-50 p-6 md:p-8 flex flex-col items-center text-center border-r border-amber-200 overflow-y-auto shrink-0" data-lenis-prevent>
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-[28px] md:rounded-[36px] bg-slate-950 text-white flex items-center justify-center text-3xl md:text-4xl font-black mb-6 shadow-2xl shrink-0 transition-transform duration-500 hover:scale-105">{selectedUser.name[0]}</div>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-[1] md:leading-[0.9] mb-2 text-blue-800 heading-gradient-text-6s">{selectedUser.name}</h2>
                  <p className="text-slate-400 font-bold uppercase text-[8px] md:text-[9px] tracking-widest mb-6 md:mb-8 px-4 py-1.5 bg-amber-50 rounded-full border border-amber-200 truncate w-full">{selectedUser.email}</p>
                  <div className="w-full grid grid-cols-2 gap-3 md:flex md:flex-col md:gap-4">
                    <div className="p-4 bg-amber-50 rounded-[20px] md:rounded-[28px] border border-amber-200 flex flex-col items-center shadow-sm">
                      <span className="text-[7px] font-black text-blue-800 uppercase tracking-widest mb-0.5">Total Spent</span>
                      <span className="text-base md:text-xl font-black text-blue-900">₹{userStats.totalSpend.toLocaleString()}</span>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-[20px] md:rounded-[28px] border border-amber-200 flex flex-col items-center shadow-sm">
                      <span className="text-[7px] font-black text-blue-800 uppercase tracking-widest mb-0.5">Visits</span>
                      <span className="text-base md:text-xl font-black text-blue-900">{userStats.sessionCount}</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto custom-scrollbar" data-lenis-prevent>
                  <div className="grid grid-cols-1 gap-12 md:gap-16">
                    <div>
                      <h4 className="font-black text-[10px] md:text-xs uppercase tracking-[0.3em] text-blue-800 mb-6 md:mb-8 flex items-center justify-center gap-3 card-heading-animate">
                        <Activity className="w-4 h-4 md:w-5 md:h-5" /> Activity History
                      </h4>
                      <div className="space-y-3 md:space-y-4">
                        {userStats.sessions.map((s: any) => (
                          <div key={s.id} className="p-3 md:p-4 bg-amber-50 rounded-xl md:rounded-2xl flex justify-between items-center border border-amber-200">
                            <div>
                              <p className="text-[9px] md:text-[10px] font-black text-blue-900">Session ID: {s.id.slice(-8).toUpperCase()}</p>
                              <p className="text-[7px] md:text-[8px] font-bold text-slate-400 mt-0.5">
                                {formatDate(s.timestamp)} @ {new Date(s.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                            <Badge color="bg-blue-600/10 !text-blue-800 border border-blue-50 text-[7px] py-0.5 px-2">AUTH</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-black text-[10px] md:text-xs uppercase tracking-[0.3em] text-blue-800 mb-6 md:mb-8 flex items-center justify-center gap-3 card-heading-animate">
                        <CreditCard className="w-4 h-4 md:w-5 md:h-5" /> Purchase History
                      </h4>
                      <div className="space-y-4 md:space-y-6">
                        {userStats.orders.map((o: any) => (
                          <div key={o.id} className="p-5 md:p-6 bg-amber-50 rounded-2xl md:rounded-[32px] flex justify-between items-center border border-amber-200 group">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[8px] md:text-[9px] font-black text-blue-800 tracking-widest uppercase">#{o.id.slice(0, 10)}</span>
                                <Badge color="bg-amber-500/10 !text-green-600 text-[7px]">{o.status}</Badge>
                              </div>
                              <p className="text-[7px] md:text-[8px] font-bold text-slate-500">
                                {formatDate(o.createdAt)} @ {new Date(o.createdAt).toLocaleTimeString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-lg md:text-xl font-black text-blue-900 tracking-tighter">₹{o.total.toLocaleString()}</span>
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

const AuthChoiceView = ({ mode, onSelect, onBack }: { mode: 'login' | 'signup', onSelect: (r: 'user' | 'admin') => void, onBack: () => void }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] p-6 lg:p-12 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(37,99,235,0.08)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(220,38,38,0.05)_0%,transparent_50%)]"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[1000px] relative z-10"
      >
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="w-24 h-24 bg-white p-4 rounded-[28px] flex items-center justify-center mx-auto mb-8 shadow-2xl relative"
          >
            <div className="absolute inset-0 bg-blue-600/10 blur-xl rounded-full"></div>
            <img src="/Favicon.png" className="w-12 h-12 object-contain relative z-10" alt="ClickBazaar Logo" />
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-4">Welcome</h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] md:text-[12px] tracking-[0.4em]">Please choose your account type for {mode}</p>
        </div>

        <div className={`grid ${mode === 'signup' ? 'md:grid-cols-1' : 'md:grid-cols-2'} gap-6 md:gap-10`}>
          <motion.button
            whileHover={{ y: -10, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('user')}
            className="group relative bg-white border border-slate-200 p-10 md:p-14 rounded-[48px] text-center transition-all duration-500 shadow-xl hover:shadow-[0_40px_80px_-15px_rgba(37,99,235,0.15)] overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mx-auto mb-10 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
              <UserIcon className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Regular<br />User</h3>
            <p className="text-sm font-medium text-slate-500 leading-relaxed mb-10">Use this to shop, track your orders, and manage your personal profile.</p>
            <div className="inline-flex items-center gap-3 px-8 py-3 bg-slate-100 rounded-full text-xs font-black text-slate-900 uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white transition-all">
              {mode === 'login' ? 'User Login' : 'User Sign Up'} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>
          {mode === 'login' && (
            <motion.button
              whileHover={{ y: -10, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect('admin')}
              className="group relative bg-slate-950 border border-transparent p-10 md:p-14 rounded-[48px] text-center transition-all duration-500 shadow-xl hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.4)] overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-10 group-hover:bg-red-600 group-hover:text-white transition-all duration-500">
                <Shield className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Admin<br />Manager</h3>
              <p className="text-sm font-medium text-slate-400 leading-relaxed mb-10">Restricted access for managing products, viewing site data, and orders.</p>
              <div className="inline-flex items-center gap-3 px-8 py-3 bg-white/10 rounded-full text-xs font-black text-white uppercase tracking-widest group-hover:bg-red-600 transition-all border border-white/10 group-hover:border-red-600">
                Admin Login <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          )}
        </div>

        <div className="flex justify-center mt-8 md:mt-10">
          <button onClick={() => { onBack(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-3 text-slate-400 hover:text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] transition-all">
            <div className="w-12 h-px bg-slate-200"></div>
            Go Back to Home
            <div className="w-12 h-px bg-slate-200"></div>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Auth Views ---

const AuthView = ({ mode, onAuth, onToggle, admin, onBack, handleNavigate, showToast, handleLogin }: { mode: 'login' | 'signup', onAuth: any, onToggle: () => void, admin?: boolean, onBack?: () => void, handleNavigate?: any, showToast: (m: string) => void, handleLogin: any }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [signupStep, setSignupStep] = useState(1);
  const [signupOtp, setSignupOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState(1);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPass, setNewPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showAdminKey, setShowAdminKey] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      onAuth(email, pass, adminKey);
    } else if (mode === 'signup') {
      if (signupStep === 1) {
        if (!name || !email || !pass) {
          showToast('Missing required fields.');
          return;
        }

        // ✅ Validate password strength BEFORE sending OTP
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
        if (!passwordRegex.test(pass)) {
          showToast('Security Check Failed: Password must have 8+ characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character (@$!%*?&).');
          return;
        }

        setLoading(true);
        try {
          await api.sendRegisterOtp(name, email);
          setSignupStep(2);
          showToast('Verification code sent to your email.');
        } catch (err: any) {
          // Handle duplicate email error
          if (err.message?.includes('already registered') || err.message?.includes('Email already')) {
            showToast('This email is already registered. Please Log In instead.');
            setSignupStep(1);
            // Switch to login mode if onToggle is available and we're in signup
            if (mode === 'signup' && onToggle) {
              setTimeout(() => onToggle(), 500);
            }
          } else {
            showToast(err.message || 'Connection failed.');
          }
        } finally {
          setLoading(false);
        }
      } else {
        if (!signupOtp) {
          showToast('Verification code required.');
          return;
        }
        onAuth(name, email, pass, signupOtp, adminKey);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-16 bg-[#f8f9fc] relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-700/5 rounded-full blur-[120px] animate-pulse-delay-2s"></div>

      <div className="w-full max-w-[850px] flex flex-col md:flex-row bg-amber-50 rounded-[32px] md:rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] border border-white relative z-10 overflow-hidden">

        {/* Visual Side Panel */}
        <div className={`hidden md:flex md:w-[35%] p-8 lg:p-10 flex-col justify-between relative text-white ${admin ? 'bg-red-950' : 'bg-slate-950'}`}>

          <div className="absolute inset-0 opacity-20 dotted-bg-32px"></div>

          <div className="relative z-10">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-8 shadow-lg ${admin ? 'bg-red-600 shadow-red-500/20' : 'bg-blue-600 shadow-blue-500/20'}`}>
              {admin ? <Shield className="w-5 h-5 text-white" /> : <InfinityIcon className="w-5 h-5 text-white" />}
            </div>
            <h3 className="text-2xl lg:text-3xl font-black tracking-tighter leading-tight mb-4">
              {admin ? 'Admin Login' : (mode === 'signup' ? 'Create Account' : 'Sign In')}
            </h3>
            <p className="text-slate-400 text-[10px] font-medium leading-relaxed max-w-xs">
              {admin ? 'Enter your special admin keys to manage the site.' : (mode === 'signup' ? 'Join our community and start shopping today.' : 'Login to your account to shop and track your orders easily.')}
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3 group">
              <div className={`w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center transition-colors ${admin ? 'bg-red-600/10 group-hover:bg-red-600' : 'bg-blue-600/10 group-hover:bg-blue-600'}`}>
                {admin ? <Lock className="w-3.5 h-3.5 text-red-400 group-hover:text-white" /> : <Shield className="w-3.5 h-3.5 text-blue-400 group-hover:text-white" />}
              </div>
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-300">
                {admin ? 'Admin Access' : (mode === 'signup' ? 'Identity Verified' : 'Secure Login')}
              </span>
            </div>
          </div>
        </div>

        {/* Content Side */}
        <div className="w-full md:w-[65%] p-5 sm:p-7 md:p-10 lg:p-12 flex flex-col items-center">
          <div className="w-full max-w-md">
            <div className="flex flex-col items-center md:items-start text-center md:text-left mb-6 md:mb-8">
              <div className="flex items-center justify-center w-full md:w-auto mb-4 md:mb-0">
                <div className={`md:hidden bg-white p-3 w-14 h-14 rounded-[20px] flex items-center justify-center shadow-2xl`}>
                  <img src="/Favicon.png" className="w-8 h-8 object-contain" alt="ClickBazaar" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter leading-[0.9] text-blue-900 mb-2">
                {admin ? 'Admin Gateway' : (mode === 'login' ? 'Welcome' : (signupStep === 1 ? 'Join Us' : 'Confirm Identity'))}
              </h2>
              <p className="text-slate-500 text-xs font-medium">
                {admin
                  ? 'Authenticated access for predefined administration nodes only.'
                  : (mode === 'login'
                    ? 'Log in to continue browsing.'
                    : (signupStep === 1 ? 'Create your secure account.' : 'Verifying your code...'))}
              </p>
            </div>

            {admin && mode === 'login' && (
              <div className="bg-amber-50 p-5 rounded-[28px] border border-amber-200 mb-10 group hover:border-blue-200 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center text-blue-800">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin Credentials</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-black text-blue-900 block">dbose272@gmail.com</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Admin Identifier</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-black text-blue-900 block">DEBBIN27</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Security Pass Key</span>
                  </div>
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div className="bg-blue-50/50 p-3.5 rounded-2xl border border-blue-100 mb-5 group cursor-default">
                <p className="text-[9px] font-black text-blue-800 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <ShieldCheck size={12} className="animate-pulse" /> Security Protocols
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[8.5px] font-black uppercase tracking-tighter">
                  <div className={`flex items-center gap-2 ${pass.length >= 8 ? "text-emerald-600" : "text-slate-400 opacity-60"}`}>
                    <div className={`w-0.5 h-0.5 rounded-full ${pass.length >= 8 ? "bg-emerald-500" : "bg-slate-300"}`} /> 8+ Characters
                  </div>
                  <div className={`flex items-center gap-2 ${/[A-Z]/.test(pass) ? "text-emerald-600" : "text-slate-400 opacity-60"}`}>
                    <div className={`w-0.5 h-0.5 rounded-full ${/[A-Z]/.test(pass) ? "bg-emerald-500" : "bg-slate-300"}`} /> Uppercase Character
                  </div>
                  <div className={`flex items-center gap-2 ${/\d/.test(pass) ? "text-emerald-600" : "text-slate-400 opacity-60"}`}>
                    <div className={`w-0.5 h-0.5 rounded-full ${/\d/.test(pass) ? "bg-emerald-500" : "bg-slate-300"}`} /> Numeric Field
                  </div>
                  <div className={`flex items-center gap-2 ${/[@$!%*?&]/.test(pass) ? "text-emerald-600" : "text-slate-400 opacity-60"}`}>
                    <div className={`w-0.5 h-0.5 rounded-full ${/[@$!%*?&]/.test(pass) ? "bg-emerald-500" : "bg-slate-300"}`} /> Special Auth
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
              {mode === 'signup' && signupStep === 1 && (
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

              {signupStep === 1 && (
                <div className="group">
                  <div className={`flex items-center gap-4 bg-amber-50 border-2 rounded-[24px] px-6 py-4 transition-all ${focusedField === 'email' ? 'bg-amber-50 border-blue-600 ring-4 ring-blue-50' : 'border-transparent'}`}>
                    <Mail className={`w-5 h-5 transition-colors ${focusedField === 'email' ? 'text-blue-800' : 'text-slate-400'}`} />
                    <div className="flex-1">
                      <label className={`text-[8px] font-black uppercase tracking-widest block mb-0.5 transition-colors ${focusedField === 'email' ? 'text-blue-800' : 'text-slate-400'}`}>Email Address</label>
                      <input required type="email" placeholder="user@example.com" value={email} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} onChange={e => setEmail(e.target.value.toLowerCase())} className="w-full bg-transparent border-none outline-none font-black text-sm text-blue-900 p-0 placeholder:text-slate-300" />
                    </div>
                  </div>
                </div>
              )}

              {signupStep === 1 && (
                <div className="group">
                  <div className={`flex items-center gap-4 bg-amber-50 border-2 rounded-[24px] px-6 py-4 transition-all ${focusedField === 'pass' ? 'bg-amber-50 border-blue-600 ring-4 ring-blue-50' : 'border-transparent'}`}>
                    <Lock className={`w-5 h-5 transition-colors ${focusedField === 'pass' ? 'text-blue-800' : 'text-slate-400'}`} />
                    <div className="flex-1">
                      <label className={`text-[8px] font-black uppercase tracking-widest block mb-0.5 transition-colors ${focusedField === 'pass' ? 'text-blue-800' : 'text-slate-400'}`}>Security Password</label>
                      <input required type={showPass ? "text" : "password"} placeholder="••••••••" value={pass} onFocus={() => setFocusedField('pass')} onBlur={() => setFocusedField(null)} onChange={e => setPass(e.target.value)} className="w-full bg-transparent border-none outline-none font-black text-sm text-blue-900 p-0 placeholder:text-slate-300" />
                    </div>
                    <button type="button" onClick={() => setShowPass(!showPass)} className="p-2 hover:bg-white/50 rounded-xl transition-all text-slate-400 hover:text-blue-600">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {mode === 'signup' && signupStep === 2 && (
                <div className="group animate-fadeIn">
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-800 mb-6 text-center">Verify 6-Digit Code</p>
                  <div className="bg-white border-2 border-blue-600/20 rounded-[32px] p-8 shadow-inner">
                    <input
                      required
                      type="text"
                      maxLength={6}
                      placeholder="000000"
                      value={signupOtp}
                      onChange={e => setSignupOtp(e.target.value)}
                      className="w-full text-center tracking-[1.2em] text-3xl font-black bg-transparent outline-none text-blue-950 placeholder:text-slate-100"
                    />
                  </div>
                  <p className="text-sm font-bold text-slate-600 text-center mt-4">Code sent to: {email}</p>
                </div>
              )}

              {admin && mode === 'login' && (
                <div className="group">
                  <div className={`flex items-center gap-3.5 bg-amber-50 border-2 rounded-[20px] px-5 py-3 transition-all ${focusedField === 'adminKey' ? 'bg-amber-50 border-blue-600 ring-4 ring-blue-50' : 'border-transparent'}`}>
                    <Key className={`w-5 h-5 transition-colors ${focusedField === 'adminKey' ? 'text-blue-800' : 'text-slate-400'}`} />
                    <div className="flex-1">
                      <label className={`text-[8px] font-black uppercase tracking-widest block mb-0.5 transition-colors ${focusedField === 'adminKey' ? 'text-blue-800' : 'text-slate-400'}`}>Admin Portal Key</label>
                      <input type={showAdminKey ? "text" : "password"} placeholder="••••••••" value={adminKey} onFocus={() => setFocusedField('adminKey')} onBlur={() => setFocusedField(null)} onChange={e => setAdminKey(e.target.value)} className="w-full bg-transparent border-none outline-none font-black text-sm text-blue-900 p-0 placeholder:text-slate-300" />
                    </div>
                    <button type="button" onClick={() => setShowAdminKey(!showAdminKey)} className="p-2 hover:bg-white/50 rounded-xl transition-all text-slate-400 hover:text-blue-600">
                      {showAdminKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white h-12 sm:h-14 md:h-16 rounded-[16px] sm:rounded-[20px] md:rounded-[24px] font-black text-xs sm:text-sm md:text-base hover:bg-slate-950 transition-all shadow-xl shadow-red-500/20 active:scale-95 flex items-center justify-center gap-2 sm:gap-3 group mt-4 disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin w-3 h-3" /> : (
                  mode === 'login' ? 'Authenticate Access' : (signupStep === 1 ? 'Send Code' : 'Sign Up')
                )}
                {!loading && <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <div className="mt-6 sm:mt-8 flex flex-col items-center gap-3 sm:gap-4">
              {mode === 'login' && !admin && (
                <button onClick={() => setShowRecovery(true)} className="text-[10px] font-black text-blue-600 hover:text-slate-950 uppercase tracking-widest transition-all">Forgot your password?</button>
              )}
              {!admin && (
                <button onClick={onToggle} className="text-[11px] font-black text-slate-400 hover:text-blue-900 transition-all uppercase tracking-widest leading-loose">
                  {mode === 'login' ? "New to ClickBazaar?" : "Back to Login"}
                </button>
              )}
            </div>

            {showRecovery && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
                <div className="bg-amber-50 w-full max-w-md rounded-[40px] p-10 border border-amber-200 shadow-2xl relative">
                  <button onClick={() => { setShowRecovery(false); setRecoveryStep(1); }} className="absolute top-6 right-6 p-2 hover:bg-red-500 hover:text-white rounded-lg transition-colors" title="Close recovery form"><X size={20} /></button>
                  <h3 className="text-2xl font-black text-blue-900 mb-6 tracking-tight">Account Recovery</h3>

                  {recoveryStep === 1 && (
                    <div className="space-y-6">
                      <p className="text-sm font-medium text-slate-500">Enter your authenticated email to receive a secure recovery code.</p>
                      <input type="email" value={recoveryEmail} onChange={e => setRecoveryEmail(e.target.value.toLowerCase())} placeholder="Email" className="w-full bg-white border border-amber-200 rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-blue-600 outline-none" />
                      <button disabled={loading} onClick={async () => {
                        setLoading(true);
                        try {
                          await api.forgotPassword(recoveryEmail);
                          setRecoveryStep(2);
                          showToast("Recovery code sent. Please check your email.");
                        } catch (err: any) {
                          showToast(err.message || "Failed to send recovery code.");
                        } finally {
                          setLoading(false);
                        }
                      }} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2">
                        {loading ? <Loader2 className="animate-spin w-3 h-3" /> : "Send 6-Digit Code"}
                      </button>
                    </div>
                  )}

                  {recoveryStep === 2 && (
                    <div className="space-y-6">
                      <p className="text-base font-medium text-slate-600">Security Check: Enter the 6-digit code sent to {recoveryEmail}.</p>
                      <input type="text" maxLength={6} value={recoveryCode} onChange={e => setRecoveryCode(e.target.value)} placeholder="000000" className="w-full text-center tracking-[1em] text-2xl bg-white border border-amber-200 rounded-2xl px-6 py-4 font-black focus:ring-2 focus:ring-blue-600 outline-none" />
                      <button disabled={loading} onClick={async () => {
                        setLoading(true);
                        try {
                          await api.verifyOtp(recoveryEmail, recoveryCode);
                          setRecoveryStep(3);
                        } catch (err: any) {
                          showToast("Invalid verification code.");
                        } finally {
                          setLoading(false);
                        }
                      }} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2">
                        {loading ? <Loader2 className="animate-spin w-3 h-3" /> : "Verify Code"}
                      </button>
                    </div>
                  )}

                  {recoveryStep === 3 && (
                    <div className="space-y-6">
                      <p className="text-sm font-medium text-slate-500">Choose a new password for your account.</p>
                      <div className="relative group">
                        <input type={showNewPass ? "text" : "password"} value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="New Password" className="w-full bg-white border border-amber-200 rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-blue-600 outline-none pr-14" />
                        <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-blue-600">
                          {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <button disabled={loading} onClick={async () => {
                        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
                        if (!passwordRegex.test(newPass)) {
                          showToast('Check Failed: Password too weak. You need at least 8 characters, including 1 uppercase, 1 lowercase, 1 number, and 1 special character (@$!%*?&).');
                          return;
                        }
                        setLoading(true);
                        try {
                          await api.resetPassword(recoveryEmail, recoveryCode, newPass);
                          showToast("Password reset successfully. Logging you in...");
                          setShowRecovery(false);
                          setRecoveryStep(1);
                          await handleLogin(recoveryEmail, newPass);
                        } catch (err: any) {
                          showToast("Failed to reset password.");
                        } finally {
                          setLoading(false);
                        }
                      }} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2">
                        {loading ? <Loader2 className="animate-spin w-3 h-3" /> : "Reset Password"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
            {admin && (
              <p className="text-xs text-amber-700 font-bold mb-3 mt-4 text-center">Admin access only — use the designated admin credentials.</p>
            )}

            {!admin && (
              <button onClick={onToggle} className="text-blue-900 font-black text-[11px] md:text-xs uppercase tracking-[0.2em] hover:text-blue-800 transition-colors flex items-center gap-3 mx-auto mt-6">
                <div className="w-6 h-px bg-slate-200"></div>
                {mode === 'login' ? "I don't have an account" : "I already have an account"}
                <div className="w-6 h-px bg-slate-200"></div>
              </button>
            )}

            <button onClick={() => handleNavigate?.('home')} className="mt-6 text-slate-300 hover:text-blue-600 font-black text-[9px] uppercase tracking-widest transition-all w-full text-center">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Image Lightbox Component ---

const ImageLightbox = ({ src, alt, onClose, images, imgIndex, setImgIndex }: { src: string; alt: string; onClose: () => void; images?: string[]; imgIndex?: number; setImgIndex?: (i: number) => void; }) => {
  const allImages = images && images.length > 0 ? images : [src];
  const currentIdx = imgIndex ?? 0;

  React.useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && setImgIndex) setImgIndex(currentIdx === allImages.length - 1 ? 0 : currentIdx + 1);
      if (e.key === 'ArrowLeft' && setImgIndex) setImgIndex(currentIdx === 0 ? allImages.length - 1 : currentIdx - 1);
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [onClose, currentIdx, allImages.length, setImgIndex]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-6 md:right-6 z-[210] p-3 bg-white/10 hover:bg-red-600 text-white rounded-2xl transition-all duration-300 hover:scale-110 active:scale-95 shadow-2xl border border-white/20 backdrop-blur-md group"
        title="Close lightbox"
      >
        <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* Image Counter */}
      {allImages.length > 1 && (
        <div className="absolute top-4 left-4 md:top-6 md:left-6 z-[210] bg-black/50 text-white text-xs font-black px-4 py-2 rounded-full backdrop-blur-md border border-white/20">
          {currentIdx + 1} / {allImages.length}
        </div>
      )}

      {/* Main Image */}
      <div className="relative max-w-[92vw] max-h-[88vh] flex items-center justify-center">
        <img
          src={allImages[currentIdx]}
          alt={alt}
          className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl select-none animate-scale-in-200ms"
        />
      </div>

      {/* Prev/Next buttons (if multi-image) */}
      {allImages.length > 1 && setImgIndex && (
        <>
          <button
            onClick={() => setImgIndex(currentIdx === 0 ? allImages.length - 1 : currentIdx - 1)}
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-[210] p-3 md:p-4 bg-white/10 hover:bg-white/30 text-white rounded-2xl transition-all duration-300 border border-white/20 backdrop-blur-md hover:scale-110 active:scale-95"
            title="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => setImgIndex(currentIdx === allImages.length - 1 ? 0 : currentIdx + 1)}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-[210] p-3 md:p-4 bg-white/10 hover:bg-white/30 text-white rounded-2xl transition-all duration-300 border border-white/20 backdrop-blur-md hover:scale-110 active:scale-95"
            title="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {allImages.length > 1 && setImgIndex && (
        <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2 z-[210]">
          {allImages.map((_, idx) => (
            <div
              key={idx}
              onClick={() => setImgIndex(idx)}
              className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${idx === currentIdx ? 'bg-white w-8' : 'bg-white/40 w-2 hover:bg-white/70'}`}
            />
          ))}
        </div>
      )}

      {/* Thumbnail strip */}
      {allImages.length > 1 && setImgIndex && (
        <div className="absolute bottom-14 left-0 right-0 flex justify-center gap-3 z-[210] px-4">
          {allImages.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setImgIndex(idx)}
              className={`w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300 ${idx === currentIdx ? 'border-white scale-110 shadow-xl' : 'border-white/30 opacity-60 hover:opacity-100'}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Product Card Component ---

const ProductCard: React.FC<{ product: Product; onAdd: () => void; onQuick: () => void; isWish: boolean; onWish: () => void; }> = ({ product, onAdd, onQuick, isWish, onWish }) => {
  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const [imgIndex, setImgIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIndex(i => (i === 0 ? images.length - 1 : i - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIndex(i => (i === images.length - 1 ? 0 : i + 1));
  };

  return (
    <>
      {lightbox && (
        <ImageLightbox
          src={images[imgIndex]}
          alt={product.name}
          images={images}
          imgIndex={imgIndex}
          setImgIndex={setImgIndex}
          onClose={() => setLightbox(false)}
        />
      )}
      <div
        className="premium-card group bg-amber-50 rounded-[32px] md:rounded-[48px] overflow-hidden flex flex-col border border-slate-50 shadow-sm relative transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] h-full"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-white group/carousel">
          <img
            src={images[imgIndex]}
            className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
            alt={product.name}
          />
          {images.length > 1 && (
            <div className="z-20">
              <button onClick={handlePrev} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-xl shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-blue-600 hover:text-white pointer-events-auto" title="Previous product image">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-xl shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-blue-600 hover:text-white pointer-events-auto" title="Next product image">
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                {images.map((_: string, idx: number) => (
                  <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${idx === imgIndex ? 'bg-blue-600 w-4' : 'bg-slate-300/80 w-1.5 hover:bg-blue-400'}`} onClick={(e) => { e.stopPropagation(); setImgIndex(idx); }} />
                ))}
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-slate-950/40 opacity-0 lg:group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 md:gap-5 backdrop-blur-[2px] pointer-events-none">
            <button onClick={(e) => { e.stopPropagation(); onQuick(); }} className="bg-amber-50 p-3 md:p-4 rounded-[18px] md:rounded-[22px] text-blue-900 shadow-xl transition-all duration-300 hover:bg-blue-600 hover:text-white icon-pop pointer-events-auto" title="Quick view product"><Eye className="w-5 h-5" /></button>
            <button onClick={(e) => { e.stopPropagation(); onAdd(); }} className="bg-amber-50 p-3 md:p-4 rounded-[18px] md:rounded-[22px] text-blue-900 shadow-xl transition-all duration-300 hover:bg-blue-600 hover:text-white icon-pop pointer-events-auto" title="Add to cart"><Plus className="w-5 h-5" /></button>
          </div>
          {/* Mobile-only action indicators */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center lg:hidden gap-3 pointer-events-none px-4 opacity-70">
            <button className="bg-amber-50/80 p-2 rounded-lg pointer-events-auto" onClick={onQuick} title="Quick view product"><Eye className="w-4 h-4" /></button>
            <button className="bg-amber-50/80 p-2 rounded-lg pointer-events-auto" onClick={onAdd} title="Add to cart"><Plus className="w-4 h-4" /></button>
          </div>
          {product.discount && (
            <div className="perspective-3d absolute top-6 md:top-8 left-6 md:left-8 flex flex-col gap-2 md:gap-3">
              <div className="bg-red-600 text-white text-[8px] md:text-[10px] font-black px-3 md:px-4 py-1 md:py-1.5 rounded-full shadow-lg">-{product.discount}%</div>
              {product.isLimitedOffer && <div className="bg-slate-950 text-white text-[8px] md:text-[10px] font-black px-3 md:px-4 py-1 md:py-1.5 rounded-full shadow-lg">FLASH</div>}
            </div>
          )}
          <button onClick={(e) => { e.stopPropagation(); onWish(); }} className={`absolute top-6 md:top-8 right-6 md:right-8 p-3 md:p-4 rounded-[20px] md:rounded-[24px] backdrop-blur-xl transition-all duration-300 shadow-xl hover:scale-110 active:scale-90 perspective-3d ${isWish ? 'bg-red-600 text-white' : 'bg-amber-50/80 text-slate-400 hover:text-red-600'}`} title={isWish ? "Remove from wishlist" : "Add to wishlist"}>
            <Heart className={`w-4 h-4 md:w-5 md:h-5 ${isWish ? 'fill-current' : ''}`} />
          </button>
        </div>
        <div className="perspective-3d p-4 md:p-6 lg:p-8 flex flex-col flex-1">
          <h3 className="text-lg md:text-xl font-black text-blue-900 tracking-tight leading-tight group-hover:text-blue-800 transition-colors card-heading-animate mb-4">{product.name}</h3>

          <div className="flex flex-col items-start gap-1 mb-6">
            <span className="text-base md:text-xl font-black text-blue-800 tracking-tighter">₹{product.price.toLocaleString('en-IN')}</span>
            {product.discount && product.discount > 0 && (
              <span className="text-[10px] md:text-xs font-black text-black line-through">
                ₹{Math.round(product.price / (1 - product.discount / 100)).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <p className="text-slate-400 text-[10px] md:text-xs font-medium line-clamp-2 italic mb-6 md:mb-10 flex-1 leading-relaxed">"{product.description}"</p>
          <div className="pt-6 md:pt-8 border-t border-slate-50 flex justify-between items-center">
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 truncate mr-2">{product.category}</span>
            <div className="flex items-center gap-1 px-2 md:px-3 py-0.5 md:py-1 bg-orange-50 rounded-full text-orange-500 font-black text-[8px] md:text-[10px]"><Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" /> {product.rating || '4.5'}</div>
          </div>
        </div>
      </div>
    </>
  );
};

// --- Cart and Checkout Support Components ---

const CartPage = ({ cart, products, onRemove, onAdd, onCheckout, onNavigate }: any) => {
  const items = cart.map((c: any) => ({ ...c, product: products.find((p: any) => p.id === c.productId)! }));
  const total = items.reduce((a: number, b: any) => a + (b.product.price * b.quantity), 0);
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 md:py-16 animate-fadeIn bg-amber-50">
      <SectionHeader title="Your Shopping Bag" subtitle="Review your selected items" />
      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            {items.map((item: any) => (
              <div key={item.productId} className="flex flex-col sm:flex-row gap-6 md:gap-8 bg-amber-50 p-6 md:p-8 rounded-[32px] md:rounded-[48px] border border-slate-50 shadow-sm relative group hover:shadow-xl transition-all duration-500">
                <div className="w-full sm:w-40 h-40 rounded-[28px] md:rounded-[36px] overflow-hidden bg-amber-50 shrink-0"><img src={item.product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" /></div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge color="bg-blue-600/10 !text-blue-800 mb-2">{item.product.category}</Badge>
                      <h3 className="text-xl md:text-2xl font-black text-blue-900 tracking-tight leading-tight card-heading-animate">{item.product.name}</h3>
                    </div>
                    <button onClick={() => onRemove(item.productId, true)} className="p-2.5 md:p-3 bg-rose-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm" title="Remove from cart"><Trash2 className="w-5 h-5" /></button>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-6 md:pt-8 border-t border-slate-50 gap-4 sm:gap-0">
                    <span className="font-black text-lg md:text-xl text-blue-800 tracking-tighter">₹{item.product.price.toLocaleString()}</span>
                    <div className="flex items-center gap-3 bg-amber-50 px-3.5 md:px-4 py-1.5 md:py-2 rounded-full border border-amber-200">
                      <button onClick={() => onRemove(item.productId)} className="w-7 h-7 flex items-center justify-center bg-amber-50 rounded-full shadow-sm hover:bg-rose-50 text-slate-400 hover:text-red-600 transition-colors" title="Decrease quantity"><ChevronDown className="w-3 h-3" /></button>
                      <div className="flex flex-col items-center min-w-[28px]">
                        <span className="text-[7px] font-black uppercase text-slate-400 tracking-widest leading-none mb-0.5">Qty</span>
                        <span className="text-sm md:text-base font-black text-blue-900 leading-none">{item.quantity}</span>
                      </div>
                      <button onClick={() => onAdd(item.productId)} className="w-7 h-7 flex items-center justify-center bg-amber-50 rounded-full shadow-sm hover:bg-blue-50 text-slate-400 hover:text-red-600 transition-colors" title="Increase quantity"><ChevronUp className="w-3 h-3" /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-5 bg-slate-950 p-7 md:p-10 rounded-[32px] md:rounded-[56px] text-white shadow-2xl h-fit sticky top-28 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <h3 className="text-3xl md:text-5xl font-black tracking-tighter leading-[1] md:leading-[0.9] mb-8 md:mb-10 bg-gradient-to-br from-red-100 via-white to-blue-100 bg-clip-text text-transparent heading-gradient-text-6s"><span className="block"><span className="italic">Summary</span></span></h3>
            <div className="space-y-3.5 md:space-y-4 mb-8 md:mb-10">
              <div className="flex justify-between items-center text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                <span>Order Value</span><span>₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                <span>Shipping Status</span><span className="text-blue-500 font-black">PRIORITY</span>
              </div>
            </div>
            <div className="flex justify-between items-center py-6 md:py-10 font-black text-3xl md:text-4xl text-white tracking-tighter border-y border-white/10 group">
              <span className="group-hover:text-blue-400 transition-colors">Total</span><span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">₹{total.toLocaleString()}</span>
            </div>
            <button onClick={onCheckout} className="w-full bg-blue-600 text-white py-5 md:py-6 rounded-[24px] md:rounded-[32px] font-black text-base md:text-lg hover:bg-amber-50 hover:text-blue-900 transition-all shadow-2xl uppercase tracking-widest mt-8 md:mt-10 flex items-center justify-center gap-4 group">Place Order <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" /></button>
          </div>
        </div>
      ) : (
        <div className="py-12 md:py-16 text-center bg-amber-50 rounded-[40px] border-2 border-dashed border-amber-200 flex flex-col items-center px-6">
          <div className="bg-blue-600/5 p-6 rounded-[32px] mb-6 animate-float">
            <ShoppingBag className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-2xl md:text-4xl font-black text-blue-900 mb-2 tracking-tighter">Your Cart is Empty</h3>
          <p className="text-slate-400 mb-6 max-w-xs font-medium text-xs italic">Start your shopping journey by exploring our collections.</p>
          <button onClick={() => onNavigate('shop')} className="bg-slate-950 text-white px-8 py-3.5 rounded-full font-black text-[9px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl active:scale-95">Explore Collections</button>
        </div>
      )}
    </div>
  );
};

const CheckoutPage = ({ cart, products, onComplete, onAdd, onRemove, user, showToast, isProcessing }: any) => {
  const [shipping, setShipping] = useState({ fullName: '', email: '', address: '', city: '', zip: '' });
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI' | 'NetBanking'>('COD');
  const [paymentData, setPaymentData] = useState({ upiId: '', bankName: '', accountNo: '', ifsc: '' });
  const items = cart.map((c: any) => {
    const p = products.find((prod: any) => prod.id === c.productId)!;
    const price = Number(p.price || 0);
    // Standard Shipping Fee: Fixed 3.5% application across all orders
    const tax = Math.round(price * c.quantity * 0.035);
    return { ...c, product: p, tax };
  });
  const subTotal = items.reduce((a: number, b: any) => a + (b.product.price * b.quantity), 0);
  const totalTax = items.reduce((a: number, b: any) => a + b.tax, 0);
  const total = subTotal + totalTax;
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (progressRef.current) {
      const width = Math.min((total / 50000) * 100, 100);
      progressRef.current.style.setProperty('--progress-width', `${width}%`);
    }
  }, [total]);

  useEffect(() => {
    if (user) {
      setShipping(prev => ({ ...prev, fullName: user.name, email: user.email }));
    }
  }, [user]);

  const validatePayment = () => {
    if (paymentMethod === 'UPI') {
      const upiRegex = /^[\w.-]+@[\w.-]+$/;
      if (!upiRegex.test(paymentData.upiId)) {
        showToast('Invalid UPI ID Format. Must be username@bankname');
        return false;
      }
    } else if (paymentMethod === 'NetBanking') {
      if (!paymentData.bankName || paymentData.accountNo.length < 9 || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(paymentData.ifsc)) {
        showToast('Invalid Net Banking Details. Ensure IFSC follows standard format (e.g., HDFC0001234) and Account No is 9+ digits.');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePayment()) return;
    onComplete({ ...shipping, payment: { method: paymentMethod, ...paymentData } });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 md:py-16 animate-fadeIn bg-amber-50">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-12">
          <div>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[1] md:leading-[0.9] mb-6 md:mb-8 text-blue-800 heading-gradient-text-6s">
              <span className="block">Order <span className="italic">Checkout</span></span>
            </h2>
            <div className="space-y-6 md:space-y-8">
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
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <input
                  required
                  type="email"
                  value={shipping.email}
                  onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                  className="w-full bg-amber-50 border border-amber-200 px-6 md:px-8 py-5 md:py-6 rounded-[24px] md:rounded-[32px] text-blue-900 font-black focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm md:text-base outline-none"
                  placeholder="user@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Shipping Address</label>
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
                  <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City</label>
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
            </div>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-100 shadow-xl">
            <h3 className="text-2xl font-black text-blue-900 mb-6 uppercase tracking-tighter">Payment Method</h3>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { id: 'COD', label: 'CASH', sub: 'On Delivery', icon: <Package size={16} /> },
                { id: 'UPI', label: 'UPI', sub: 'Fast Transfer', icon: <Zap size={16} /> },
                { id: 'NetBanking', label: 'BANK', sub: 'Net Banking', icon: <Database size={16} /> }
              ].map(method => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`flex flex-col items-center justify-center p-5 rounded-[24px] border-2 transition-all ${paymentMethod === method.id ? 'bg-blue-600 border-blue-600 text-white shadow-xl' : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'}`}
                >
                  {method.icon}
                  <span className="text-[10px] font-black mt-2">{method.label}</span>
                  <span className={`text-[7px] font-bold uppercase transition-colors ${paymentMethod === method.id ? 'text-blue-100' : 'text-slate-400'}`}>{method.sub}</span>
                </button>
              ))}
            </div>

            <div className="space-y-6">
              {paymentMethod === 'UPI' && (
                <div className="space-y-2 animate-fadeIn">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">UPI ID</label>
                  <input
                    required
                    value={paymentData.upiId}
                    onChange={(e) => setPaymentData({ ...paymentData, upiId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-blue-900 font-black focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm"
                    placeholder="Ex. user@okaxis"
                  />
                </div>
              )}
              {paymentMethod === 'NetBanking' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Bank Name</label>
                    <input
                      required
                      value={paymentData.bankName}
                      onChange={(e) => setPaymentData({ ...paymentData, bankName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-blue-900 font-black focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm"
                      placeholder="HDFC Bank"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">IFSC Code</label>
                    <input
                      required
                      value={paymentData.ifsc}
                      onChange={(e) => setPaymentData({ ...paymentData, ifsc: e.target.value.toUpperCase() })}
                      className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-blue-900 font-black focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm uppercase"
                      placeholder="HDFC000XXXX"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Number</label>
                    <input
                      required
                      type="password"
                      value={paymentData.accountNo}
                      onChange={(e) => setPaymentData({ ...paymentData, accountNo: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-blue-900 font-black focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm"
                      placeholder="••••••••••••"
                    />
                  </div>
                </div>
              )}
              {paymentMethod === 'COD' && (
                <div className="p-6 bg-slate-100 rounded-3xl border-2 border-dashed border-slate-200 text-center animate-fadeIn">
                  <Truck className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Payment: Cash on delivery</p>
                </div>
              )}
            </div>
          </div>
          <button disabled={isProcessing} type="submit" className="w-full bg-slate-950 text-white py-6 md:py-8 rounded-[28px] md:rounded-[40px] font-black text-lg md:text-xl hover:bg-blue-600 transition-all shadow-2xl uppercase tracking-widest flex items-center justify-center gap-3">
            {isProcessing ? <Loader2 className="animate-spin w-3 h-3" /> : "Place Order"}
          </button>
        </form>
        <div>
          <div className="bg-amber-50 p-8 md:p-12 rounded-[40px] md:rounded-[60px] border border-amber-200 sticky top-28">
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1] md:leading-[0.9] mb-8 md:mb-10 border-b border-slate-200 pb-6 text-blue-800 heading-gradient-text-6s"><span className="block">Shopping<br /><span className="italic">Bag</span></span></h3>
            <div className="space-y-6 md:space-y-8 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {items.length === 0 ? (
                <div className="py-12 text-center bg-amber-50 rounded-3xl border-2 border-dashed border-amber-200 flex flex-col items-center px-6">
                  <Package className="w-12 h-12 text-slate-100 mb-6" />
                  <h3 className="text-xl font-black text-blue-900">Your cart is empty</h3>
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
                          title="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-[9px] font-black text-blue-900 min-w-[18px] text-center">{item.quantity}</span>
                        <button
                          onClick={() => onAdd(item.product.id)}
                          className="w-6 h-6 flex items-center justify-center bg-amber-50 rounded-full text-blue-900 hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
                          title="Increase quantity"
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

            <div className="mt-6 p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Order Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-bold text-slate-700">
                  <span>Subtotal</span>
                  <span>₹{subTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-700">
                  <span>Order Tax ({subTotal === 0 ? 0 : 3.5}%)</span>
                  <span>₹{totalTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-700">
                  <span>Shipping</span>
                  <span className="text-slate-500">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-sm font-black text-blue-900 border-t border-slate-200 pt-3">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-black uppercase tracking-widest text-blue-800">Shipping Progress</span>
                <span className="text-sm font-black text-blue-800 italic">{total >= 50000 ? 'Free Shipping Active' : `Add ₹${(50000 - total).toLocaleString()} for Free Fast Shipping`}</span>
              </div>
              <div className="h-2 w-full bg-blue-100 rounded-full overflow-hidden">
                <div
                  ref={progressRef}
                  className="h-full bg-blue-600 transition-all duration-1000 ease-out shipping-progress-bar"
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[8px] font-bold text-slate-400">₹0</span>
                <span className="text-[8px] font-bold text-slate-400">₹50,000</span>
              </div>
            </div>

            <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t-2 border-dashed border-slate-200">
              <div className="flex justify-between items-center font-black text-2xl md:text-3xl text-blue-800 tracking-tighter mb-4">
                <span>Total Price</span>
                <span className="text-blue-800">₹{total.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-100 rounded-2xl border border-slate-200/50">
                <ShieldCheck className="w-5 h-5 text-blue-800" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Secured by ClickBazaar Safe Payment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};