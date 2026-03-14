import { Category, Product, User, UserRole } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  // --- FASHION (5 ITEMS) ---
  {
    id: 'P1',
    name: 'Selvedge Archival Denim',
    category: Category.Fashion,
    price: 4999,
    description: 'Heavyweight organic cotton denim, crafted for longevity and personal character.',
    image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=800&q=80',
    stock: 45, rating: 4.8, isBestSeller: true, isNewArrival: false, discount: 10
  },
  {
    id: 'P1-2',
    name: 'Merino Wool Cardigan',
    category: Category.Fashion,
    price: 3499,
    description: 'Fine-knit merino wool for climate-controlled layering.',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
    stock: 20, rating: 4.7, isBestSeller: false, isNewArrival: true, discount: 5
  },
  {
    id: 'P1-3',
    name: 'Linen Utility Shirt',
    category: Category.Fashion,
    price: 2899,
    description: 'Breathable European linen with reinforced archival stitching.',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    stock: 30, rating: 4.5, isBestSeller: false, isNewArrival: false, discount: 0
  },
  {
    id: 'P1-4',
    name: 'Ocular Trench Coat',
    category: Category.Fashion,
    price: 8999,
    description: 'Water-resistant gabardine with modular internal storage.',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
    stock: 15, rating: 4.9, isBestSeller: true, isNewArrival: true, discount: 15
  },
  {
    id: 'P1-5',
    name: 'Raw Indigo Jacket',
    category: Category.Fashion,
    price: 5499,
    description: 'Unwashed indigo dyed jacket that fades uniquely over time.',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    stock: 25, rating: 4.6, isBestSeller: false, isNewArrival: false, discount: 8
  },

  // --- ELECTRONICS (5 ITEMS) ---
  {
    id: 'P2',
    name: 'Chrono Series 01',
    category: Category.Electronics,
    price: 12499,
    description: 'Automated kinetic movement housed in surgical-grade steel.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    stock: 12, rating: 4.9, isBestSeller: true, isNewArrival: false, isLimitedOffer: true, discount: 15
  },
  {
    id: 'P2-2',
    name: 'Sonic ANC Headphones',
    category: Category.Electronics,
    price: 15999,
    description: 'Hybrid noise cancellation with studio-grade archival sound stage.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    stock: 40, rating: 4.8, isBestSeller: true, isNewArrival: true, discount: 10
  },
  {
    id: 'P2-3',
    name: 'Quantum Lens Camera',
    category: Category.Electronics,
    price: 85999,
    description: 'Mirrorless tech with vintage color science processing.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    stock: 8, rating: 5.0, isBestSeller: false, isNewArrival: true, discount: 5
  },
  {
    id: 'P2-4',
    name: 'Pulse Audio Streamer',
    category: Category.Electronics,
    price: 7499,
    description: 'High-fidelity audio streaming with minimalist industrial design.',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    stock: 50, rating: 4.6, isBestSeller: false, isNewArrival: false, discount: 0
  },
  {
    id: 'P2-5',
    name: 'Solar Power Array',
    category: Category.Electronics,
    price: 4599,
    description: 'Foldable monocrystalline panels for archival energy independence.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq-RHMq0eO2Eh6RD6bl6K44OUcrXj4XNGmDg&s',
    stock: 35, rating: 4.4, isBestSeller: false, isNewArrival: false, discount: 20
  },

  // --- HOME (5 ITEMS) ---
  {
    id: 'P3',
    name: 'Arctic Humidifier',
    category: Category.Home,
    price: 3299,
    description: 'Ultrasonic moisture diffusion with archival pine scent compatibility.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4ZHtNnHe0ynq4IVvLnwgw5ogkQUFE5Q1g8w&s=10',
    stock: 28, rating: 4.6, isBestSeller: false, isNewArrival: true, discount: 5
  },
  {
    id: 'P3-2',
    name: 'Abstract Clay Vessel',
    category: Category.Home,
    price: 1899,
    description: 'Hand-thrown stoneware with reactive matte glaze finish.',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
    stock: 15, rating: 4.9, isBestSeller: true, isNewArrival: false, discount: 0
  },
  {
    id: 'P3-3',
    name: 'Concrete Desk Lamp',
    category: Category.Home,
    price: 4299,
    description: 'Brutalist aesthetic with adjustable warm-dim LED technology.',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    stock: 12, rating: 4.7, isBestSeller: false, isNewArrival: true, discount: 10
  },
  {
    id: 'P3-4',
    name: 'Waffle Linen Throw',
    category: Category.Home,
    price: 2499,
    description: 'Stone-washed Belgian linen for breathable comfort.',
    image: 'https://xcdn.next.co.uk/common/items/default/default/itemimages/3_4Ratio/product/lge/Q84088s.jpg?im=Resize,width=750',
    stock: 40, rating: 4.5, isBestSeller: false, isNewArrival: false, discount: 5
  },
  {
    id: 'P3-5',
    name: 'Aromatic Diffuser Kit',
    category: Category.Home,
    price: 1299,
    description: 'Signature archival scents: Cedar, Smoke, and Moss.',
    image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=800&q=80',
    stock: 60, rating: 4.8, isBestSeller: true, isNewArrival: false, discount: 0
  },

  // --- MOBILE (5 ITEMS) ---
  {
    id: 'P6',
    name: 'Nebula X-Phone',
    category: Category.Mobile,
    price: 74999,
    description: 'Titanium build with advanced neural processing.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    stock: 15, rating: 5.0, isBestSeller: true, isNewArrival: true, isLimitedOffer: false, discount: 4
  },
  {
    id: 'P6-2',
    name: 'Vertex 12 Pro',
    category: Category.Mobile,
    price: 68999,
    description: 'Carbon-fiber frame with liquid-cooled processor.',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    stock: 20, rating: 4.7, isBestSeller: false, isNewArrival: false, discount: 5
  },
  {
    id: 'P6-3',
    name: 'Fold X-Legacy',
    category: Category.Mobile,
    price: 89999,
    description: 'Durable hinge tech with seamless archival transition.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    stock: 10, rating: 4.8, isBestSeller: true, isNewArrival: true, discount: 10
  },
  {
    id: 'P6-4',
    name: 'Neon Mini 5G',
    category: Category.Mobile,
    price: 35999,
    description: 'Compact power with ultra-bright display node.',
    image: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&w=800&q=80',
    stock: 35, rating: 4.5, isBestSeller: false, isNewArrival: false, discount: 0
  },
  {
    id: 'P6-5',
    name: 'Titan Desk Dock',
    category: Category.Mobile,
    price: 5499,
    description: 'Magnetic charging with industrial steel finish.',
    image: 'https://elementcontract.com/wp-content/uploads/2022/04/titan-pro-t32-main.jpg',
    stock: 50, rating: 4.6, isBestSeller: false, isNewArrival: false, discount: 5
  },

  // --- ACCESSORIES (5 ITEMS) ---
  {
    id: 'P7',
    name: 'Archival Canvas Tote',
    category: Category.Accessories,
    price: 1299,
    description: 'Reinforced 24oz canvas for daily utility and understated elegance.',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    stock: 100, rating: 4.4, isBestSeller: false, isNewArrival: false, discount: 0
  },
  {
    id: 'P7-2',
    name: 'Shell Wallet 02',
    category: Category.Accessories,
    price: 4500,
    description: 'Minimalist aluminum sleeve with RFID shielding.',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    stock: 60, rating: 4.8, isBestSeller: true, isNewArrival: true, discount: 10
  },
  {
    id: 'P7-3',
    name: 'Brass Key Clip',
    category: Category.Accessories,
    price: 899,
    description: 'Solid brass hardware with hand-stitched leather pull.',
    image: 'https://images.unsplash.com/photo-1606240217272-9b2f671f65ca?auto=format&fit=crop&w=800&q=80',
    stock: 150, rating: 4.5, isBestSeller: false, isNewArrival: false, discount: 0
  },
  {
    id: 'P7-4',
    name: 'Wool Laptop Sleeve',
    category: Category.Accessories,
    price: 2200,
    description: 'Natural felt protection with vegetable-tanned accents.',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    stock: 45, rating: 4.6, isBestSeller: false, isNewArrival: true, discount: 5
  },
  {
    id: 'P7-5',
    name: 'Titanium Pen 01',
    category: Category.Accessories,
    price: 5999,
    description: 'Precision machined body with archival pressurized ink.',
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80',
    stock: 25, rating: 4.9, isBestSeller: true, isNewArrival: false, discount: 0
  },

  // --- GADGETS (5 ITEMS) ---
  {
    id: 'P8',
    name: 'Graphene Smart Watch',
    category: Category.Gadgets,
    price: 18999,
    description: 'Biometric tracking with revolutionary 30-day battery life.',
    image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQoVBB9Kp6Hd9UPbQQoNTqk6bKo1KrArZm7Xd1X4Lls26ofrjveP5yj9YArA8edgA8AT8RavyS6h7OIbaJiBcUSbdyxn0oIndwKdPSsFUVvGzskArq76pJT',
    stock: 40, rating: 4.7, isBestSeller: true, isNewArrival: false, isLimitedOffer: true, discount: 12
  },
  {
    id: 'P8-2',
    name: 'Retro Game Terminal',
    category: Category.Gadgets,
    price: 8499,
    description: 'Handheld emulator with high-refresh OLED panel.',
    image: 'https://images.unsplash.com/photo-1592155931584-901ac15763e3?auto=format&fit=crop&w=800&q=80',
    stock: 30, rating: 4.6, isBestSeller: false, isNewArrival: true, discount: 5
  },
  {
    id: 'P8-3',
    name: 'Smart Drone Unit',
    category: Category.Gadgets,
    price: 42999,
    description: 'Autonomous flight paths with 4K archival footage capability.',
    image: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=800&q=80',
    stock: 12, rating: 4.8, isBestSeller: true, isNewArrival: true, discount: 0
  },
  {
    id: 'P8-4',
    name: 'E-Ink Reader Pro',
    category: Category.Gadgets,
    price: 15499,
    description: 'Zero eyestrain display with modular dictionary nodes.',
    image: 'https://images.unsplash.com/photo-1560415755-bd80d06eda60?auto=format&fit=crop&w=800&q=80',
    stock: 50, rating: 4.7, isBestSeller: false, isNewArrival: false, discount: 10
  },
  {
    id: 'P8-5',
    name: 'Mechanical Macro Pad',
    category: Category.Gadgets,
    price: 3999,
    description: 'Customizable keys with clear housing and RGB telemetry.',
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80',
    stock: 40, rating: 4.5, isBestSeller: false, isNewArrival: false, discount: 0
  },

  // --- BEAUTY (5 ITEMS) ---
  {
    id: 'P5-1',
    name: 'Ocean Mineral Serum',
    category: Category.Beauty,
    price: 2499,
    description: 'Deep hydration with sustainably sourced sea botanicals.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    stock: 55, rating: 4.7, isBestSeller: true, isNewArrival: false, discount: 5
  },
  {
    id: 'P5-2',
    name: 'Botanical Night Oil',
    category: Category.Beauty,
    price: 3200,
    description: 'Repairing blend of archival florals and essential lipids.',
    image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=800&q=80',
    stock: 30, rating: 4.9, isBestSeller: false, isNewArrival: true, discount: 0
  },
  {
    id: 'P5-3',
    name: 'Charcoal Detox Mask',
    category: Category.Beauty,
    price: 1599,
    description: 'Active carbon complex for deep archival pore cleansing.',
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=800&q=80',
    stock: 80, rating: 4.5, isBestSeller: false, isNewArrival: false, discount: 10
  },
  {
    id: 'P5-4',
    name: 'Vitamin C Glow Kit',
    category: Category.Beauty,
    price: 4599,
    description: 'Brightening regimen for skin revitalization.',
    image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=800&q=80',
    stock: 25, rating: 4.8, isBestSeller: true, isNewArrival: true, discount: 15
  },
  {
    id: 'P5-5',
    name: 'Matte Clay Pomade',
    category: Category.Beauty,
    price: 999,
    description: 'Strong hold hair styling with natural matte finish.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsS4mtL8dm8oQjPDn1gp3tcoq9uvQWUsKYDQ&s',
    stock: 100, rating: 4.4, isBestSeller: false, isNewArrival: false, discount: 0
  },

  // --- GROCERY (5 ITEMS) ---
  {
    id: 'P4-1',
    name: 'Artisan Roast Coffee',
    category: Category.Grocery,
    price: 899,
    description: 'Single-origin beans with notes of dark chocolate and smoke.',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
    stock: 60, rating: 4.9, isBestSeller: true, isNewArrival: false, discount: 5
  },
  {
    id: 'P4-2',
    name: 'Organic Honeycomb',
    category: Category.Grocery,
    price: 1200,
    description: 'Wildflower honey direct from archival forest hives.',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    stock: 40, rating: 4.8, isBestSeller: false, isNewArrival: true, discount: 0
  },
  {
    id: 'P4-3',
    name: 'Aged Balsamic Glaze',
    category: Category.Grocery,
    price: 1599,
    description: '12-year oak barrel-aged vinegar with rich viscosity.',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    stock: 25, rating: 4.7, isBestSeller: false, isNewArrival: false, discount: 10
  },
  {
    id: 'P4-4',
    name: 'Smoked Sea Salt',
    category: Category.Grocery,
    price: 499,
    description: 'Cold-smoked over hickory wood for artisanal seasoning.',
    image: '/images/smoked-sea-salt.jpg',
    stock: 150, rating: 4.6, isBestSeller: false, isNewArrival: false, discount: 0
  },
  {
    id: 'P4-5',
    name: 'Cold Pressed Olive Oil',
    category: Category.Grocery,
    price: 1899,
    description: 'Premium extra virgin oil with peppery archival finish.',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    stock: 45, rating: 4.9, isBestSeller: true, isNewArrival: true, discount: 0
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'ADM-001',
    name: 'System Administrator',
    email: 'admin@clickbazaar.com',
    role: UserRole.Admin,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'USR-001',
    name: 'Test Curator',
    email: 'curator@example.com',
    role: UserRole.Customer,
    createdAt: '2025-01-05T12:00:00Z'
  }
];