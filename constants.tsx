import { Category, Product, User, UserRole } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Aged Basmati Reserve', description: '10-year aged long grain basmati for ultimate aroma.', price: 1899, category: Category.Grocery, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80', stock: 50, isBestSeller: true, rating: 4.8 },
  { id: 'p2', name: 'Raw Indigo Denim', description: 'Selvedge denim jacket with handcrafted copper rivets.', price: 7499, category: Category.MensWear, image: 'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?auto=format&fit=crop&w=800&q=80', stock: 25, isNewArrival: true, rating: 4.9 },
  { id: 'p3', name: 'Nebula X-Phone 15', description: 'Titanium chassis with the new A17 Bionic chip.', price: 134900, category: Category.Mobile, image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=800&q=80', stock: 12, isBestSeller: true, rating: 5.0 },
  { id: 'p4', name: 'Zen-Sonic Over-Ears', description: 'Active noise cancellation with 40h adaptive battery.', price: 24999, category: Category.Electronics, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', stock: 15, isLimitedOffer: true, discount: 15, rating: 4.7 },
  { id: 'p5', name: 'Cold-Pressed Gold', description: 'Extra virgin olive oil from Tuscan organic groves.', price: 2499, category: Category.Grocery, image: 'https://images.unsplash.com/photo-1474979266404-7eaacabc88c5?auto=format&fit=crop&w=800&q=80', stock: 40, rating: 4.5 },
  { id: 'p6', name: 'Chelsea Heritage Boot', description: 'Full-grain Italian calfskin with Goodyear welt.', price: 15999, category: Category.Shoes, image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80', stock: 20, isNewArrival: true, rating: 4.9 },
  { id: 'p7', name: 'Midnight Silk Wrap', description: 'Hand-dyed mulberry silk evening wrap dress.', price: 18499, category: Category.WomensWear, image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80', stock: 8, isLimitedOffer: true, rating: 4.8 },
  { id: 'p8', name: 'Chrono Series IX', description: 'Sapphire glass with automated kinetic movement.', price: 52999, category: Category.MensWatches, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', stock: 10, isNewArrival: true, rating: 4.7 },
  { id: 'p9', name: 'Arctic Humidifier', description: 'Ultrasonic cool mist for perfect sleep environments.', price: 5999, category: Category.Wellness, image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=800&q=80', stock: 30, isBestSeller: true, rating: 4.6 },
  { id: 'p10', name: 'Curved Vision Pro', description: '34-inch ultrawide OLED for immersive creative work.', price: 78999, category: Category.Gadgets, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80', stock: 5, isLimitedOffer: true, discount: 10, rating: 5.0 },
  { id: 'p11', name: 'Velvet Ottoman', description: 'Hand-tufted emerald green velvet for lounge accents.', price: 8999, category: Category.Home, image: 'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?auto=format&fit=crop&w=800&q=80', stock: 12, rating: 4.4 },
  { id: 'p12', name: 'Rose Quartz Elixir', description: 'Infused facial serum for natural radiance.', price: 3499, category: Category.Beauty, image: 'https://images.unsplash.com/photo-1570172619380-4107adda5fa7?auto=format&fit=crop&w=800&q=80', stock: 45, isNewArrival: true, rating: 4.7 },
  { id: 'p13', name: 'Onyx Leather Tote', description: 'Minimalist architecture with reinforced structure.', price: 12999, category: Category.Accessories, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80', stock: 14, rating: 4.8 },
  { id: 'p14', name: 'Bohemian Loom Rug', description: 'Natural fiber hand-woven rug with geometric motifs.', price: 14999, category: Category.Home, image: '/images/bohemian-loom-rug.jpg', stock: 6, isLimitedOffer: true, rating: 4.6 },
  { id: 'p15', name: 'Titanium Espresso Kit', description: 'Professional grade press for the discerning barista.', price: 9499, category: Category.Gadgets, image: 'https://images.unsplash.com/photo-1544787210-2827448b326c?auto=format&fit=crop&w=800&q=80', stock: 22, rating: 4.9 },
  { id: 'p16', name: 'Gourmet Truffle Salt', description: 'Imported black summer truffles with Mediterranean sea salt.', price: 1250, category: Category.Grocery, image: 'https://images.unsplash.com/photo-1516641396056-0ce60a85d49f?auto=format&fit=crop&w=800&q=80', stock: 100, rating: 4.9 },
  { id: 'p17', name: 'Nordic Wool Throw', description: 'Ethically sourced Icelandic wool for extreme warmth.', price: 6500, category: Category.Home, image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80', stock: 35, isNewArrival: true, rating: 4.7 },
  { id: 'p18', name: 'Stealth Gaming Keyboard', description: 'Low-profile mechanical keys with programmable RGB.', price: 12999, category: Category.Electronics, image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=80', stock: 18, isLimitedOffer: true, discount: 20, rating: 4.8 },
  { id: 'p19', name: 'Azure Chronograph', description: 'Sunray dial with stainless steel link bracelet.', price: 32000, category: Category.MensWatches, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80', stock: 9, featured: true, rating: 4.9 },
  { id: 'p20', name: 'Lumiere Face Oil', description: 'Cold-pressed botanical oils for a healthy glow.', price: 4200, category: Category.Beauty, image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=800&q=80', stock: 55, isBestSeller: true, rating: 4.8 }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'USR-ADMIN',
    name: 'Archivist Prime',
    email: 'admin@clickbazaar.com',
    role: UserRole.Admin,
    createdAt: new Date().toISOString()
  }
];