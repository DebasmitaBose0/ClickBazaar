import { Category, Product, User, UserRole } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  // --- FASHION (5 ITEMS) ---
  {
    id: 'P1-1',
    name: "Allen Solly Men's Slim Fit Blazer",
    category: Category.Fashion,
    price: 5999,
    description: "Sharp tailored blazer in premium stretch fabric for formal occasions.",
    image: "/images/items/Allen_Solly_Men's_Slim_Fit_Blazer_1.webp",
    images: ["/images/items/Allen_Solly_Men's_Slim_Fit_Blazer_1.webp", "/images/items/Allen_Solly_Men's_Slim_Fit_Blazer_2.webp"],
    stock: 45, rating: 4.8, isBestSeller: true, isNewArrival: false, discount: 10
  },
  {
    id: 'P1-2',
    name: "BIBA Women's Silk Blend Saree",
    category: Category.Fashion,
    price: 4499,
    description: "Elegant silk-blend saree with intricate embroidery and rich drape.",
    image: "/images/items/BIBA_Women's_Silk_Blend_Saree_1.jpg",
    images: ["/images/items/BIBA_Women's_Silk_Blend_Saree_1.jpg", "/images/items/BIBA_Women's_Silk_Blend_Saree_2.jpg"],
    stock: 20, rating: 4.7, isBestSeller: false, isNewArrival: true, isLimitedOffer: true, discount: 5
  },
  {
    id: 'P1-3',
    name: 'H&M Oversized Hoodie',
    category: Category.Fashion,
    price: 1999,
    description: 'Soft cotton-blend hoodie in a relaxed oversized fit for everyday comfort.',
    image: "/images/items/H&M_Oversized_Hoodie_1.png",
    images: ["/images/items/H&M_Oversized_Hoodie_1.png", "/images/items/H&M_Oversized_Hoodie_2.png"],
    stock: 30, rating: 4.5, isBestSeller: false, isNewArrival: false, isLimitedOffer: true, discount: 15
  },
  {
    id: 'P1-4',
    name: "Levi's 511 Slim Fit Jeans",
    category: Category.Fashion,
    price: 3499,
    description: 'Iconic slim-fit denim with superior stretch and reinforced stitching.',
    image: "/images/items/Levi's_511_Slim_Fit_Jeans_1.webp",
    images: ["/images/items/Levi's_511_Slim_Fit_Jeans_1.webp", "/images/items/Levi's_511_Slim_Fit_Jeans_2.webp", "/images/items/Levi's_511_Slim_Fit_Jeans.jpg"],
    stock: 15, rating: 4.9, isBestSeller: true, isNewArrival: false, discount: 15
  },
  {
    id: 'P1-5',
    name: 'ZARA Faux Leather Jacket',
    category: Category.Fashion,
    price: 4999,
    description: 'Sleek faux leather jacket with biker-inspired detailing and structured shoulders.',
    image: "/images/items/ZARA_Faux_Leather_Jacket_1.jpg",
    images: ["/images/items/ZARA_Faux_Leather_Jacket_1.jpg", "/images/items/ZARA_Faux_Leather_Jacket_2.jpg"],
    stock: 25, rating: 4.6, isBestSeller: false, isNewArrival: false, discount: 8
  },

  // --- ELECTRONICS (5 ITEMS) ---
  {
    id: 'P2-1',
    name: 'Sony Bravia 55-inch 4K Ultra HD Smart LED TV',
    category: Category.Electronics,
    price: 79990,
    description: 'Stunning 4K Bravia XR processor with Dolby Vision and Google TV built-in.',
    image: "/images/items/Sony_Bravia_55-inch_4K_Ultra_HD_Smart_LED_TV_1.jpg",
    images: ["/images/items/Sony_Bravia_55-inch_4K_Ultra_HD_Smart_LED_TV_1.jpg", "/images/items/Sony_Bravia_55-inch_4K_Ultra_HD_Smart_LED_TV_2.jpeg", "/images/items/Sony_Bravia_55-inch_4K_Ultra_HD_Smart_LED_TV_3.webp"],
    stock: 12, rating: 4.9, isBestSeller: true, isNewArrival: false, isLimitedOffer: true, discount: 15
  },
  {
    id: 'P2-2',
    name: 'Apple MacBook Air M2',
    category: Category.Electronics,
    price: 114900,
    description: 'Apple M2 chip, 8GB RAM, 256GB SSD — ultra-thin and remarkably fast.',
    image: "/images/items/Apple_MacBook_Air_M2_1.jpeg",
    images: ["/images/items/Apple_MacBook_Air_M2_1.jpeg", "/images/items/Apple_MacBook_Air_M2_2.jpg"],
    stock: 20, rating: 4.9, isBestSeller: true, isNewArrival: true, discount: 5
  },
  {
    id: 'P2-3',
    name: 'Bose QuietComfort 45 Headphones',
    category: Category.Electronics,
    price: 29900,
    description: 'World-class noise cancellation with high-fidelity audio and all-day comfort.',
    image: "/images/items/Bose_QuietComfort_45_Headphones_1.webp",
    images: ["/images/items/Bose_QuietComfort_45_Headphones_1.webp", "/images/items/Bose_QuietComfort_45_Headphones_2.jpg"],
    stock: 40, rating: 4.8, isBestSeller: false, isNewArrival: false, discount: 10
  },
  {
    id: 'P2-4',
    name: 'Apple iPad 10th Generation',
    category: Category.Electronics,
    price: 44900,
    description: '10.9-inch Liquid Retina display with A14 Bionic chip and 5G connectivity.',
    image: "/images/items/Apple_iPad_10th_Generation_1.jpg",
    images: ["/images/items/Apple_iPad_10th_Generation_1.jpg", "/images/items/Apple_iPad_10th_Generation_2.webp", "/images/items/Apple_iPad_10th_Generation_3.jpg"],
    stock: 18, rating: 4.8, isBestSeller: false, isNewArrival: true, isLimitedOffer: true, discount: 7
  },
  {
    id: 'P2-5',
    name: 'JBL Charge 5 Bluetooth Speaker',
    category: Category.Electronics,
    price: 14999,
    description: 'IP67 waterproof, 20hr playtime, built-in power bank feature for on-the-go.',
    image: "/images/items/JBL_Charge_5_Bluetooth_Speaker_1.jpg",
    images: ["/images/items/JBL_Charge_5_Bluetooth_Speaker_1.jpg", "/images/items/JBL_Charge_5_Bluetooth_Speaker_2.webp"],
    stock: 50, rating: 4.7, isBestSeller: false, isNewArrival: false, discount: 0
  },

  // --- MOBILE (5 ITEMS) ---
  {
    id: 'P6-1',
    name: 'Apple iPhone 15 Pro Max',
    category: Category.Mobile,
    price: 159900,
    description: 'Titanium design, A17 Pro chip, 48MP camera system, and Action Button.',
    image: "/images/items/Apple_iPhone_15_Pro_Max.jpg",
    images: ["/images/items/Apple_iPhone_15_Pro_Max.jpg", "/images/items/Applei-Phone-15-Pro-Max.jpg"],
    stock: 15, rating: 5.0, isBestSeller: true, isNewArrival: true, isLimitedOffer: false, discount: 4
  },
  {
    id: 'P6-2',
    name: 'Samsung Galaxy S24 Ultra',
    category: Category.Mobile,
    price: 129999,
    description: 'Integrated S Pen, 200MP camera, Galaxy AI features on a titanium frame.',
    image: "/images/items/Samsung_Galaxy_S24_Ultra_1.webp",
    images: ["/images/items/Samsung_Galaxy_S24_Ultra_1.webp", "/images/items/Samsung_Galaxy_S24_Ultra_2.webp", "/images/items/Samsung_Galaxy_S24_Ultra.png"],
    stock: 20, rating: 4.7, isBestSeller: false, isNewArrival: false, discount: 5
  },
  {
    id: 'P6-3',
    name: 'OnePlus 12 5G',
    category: Category.Mobile,
    price: 64999,
    description: 'Snapdragon 8 Gen 3, Hasselblad camera, and 100W SUPERVOOC charging.',
    image: "/images/items/OnePlus_12_5G_1.webp",
    images: ["/images/items/OnePlus_12_5G_1.webp", "/images/items/OnePlus_12_5G_2.jpg"],
    stock: 10, rating: 4.8, isBestSeller: true, isNewArrival: true, discount: 10
  },
  {
    id: 'P6-4',
    name: 'Redmi Note 13 Pro+',
    category: Category.Mobile,
    price: 31999,
    description: '200MP camera, 120W HyperCharge, Snapdragon 7s Gen 2 processor.',
    image: "/images/items/Redmi_Note_13_Pro+_1.jpg",
    images: ["/images/items/Redmi_Note_13_Pro+_1.jpg", "/images/items/Redmi_Note_13_Pro+_2.jpg"],
    stock: 35, rating: 4.5, isBestSeller: false, isNewArrival: false, discount: 0
  },
  {
    id: 'P6-5',
    name: 'ASUS ROG Phone 8',
    category: Category.Mobile,
    price: 89999,
    description: 'Snapdragon 8 Gen 3, 165Hz AMOLED display, 6000mAh gaming-grade battery.',
    image: "/images/items/ASUS_ROG_Phone_8_1.png",
    images: ["/images/items/ASUS_ROG_Phone_8_1.png", "/images/items/ASUS_ROG_Phone_8_2.webp"],
    stock: 12, rating: 4.8, isBestSeller: true, isNewArrival: true, discount: 8
  },

  // --- BEAUTY (5 ITEMS) ---
  {
    id: 'P5-1',
    name: 'Mamaearth Skin Care Kit',
    category: Category.Beauty,
    price: 1299,
    description: 'Natural ingredients, toxin-free formulas for radiant, healthy skin.',
    image: "/images/items/Mamaearth_Skin_Care_Kit_1.png",
    images: ["/images/items/Mamaearth_Skin_Care_Kit_1.png", "/images/items/Mamaearth_Skin_Care_Kit_2.png"],
    stock: 55, rating: 4.7, isBestSeller: true, isNewArrival: false, discount: 5
  },
  {
    id: 'P5-2',
    name: 'Minimalist 10% Vitamin C Serum',
    category: Category.Beauty,
    price: 699,
    description: 'Stable Vitamin C derivative for brightening and anti-oxidant skin protection.',
    image: "/images/items/Minimalist_10%_Vitamin_C_Serum_1.jpg",
    images: ["/images/items/Minimalist_10%_Vitamin_C_Serum_1.jpg", "/images/items/Minimalist_10%_Vitamin_C_Serum_2.webp"],
    stock: 80, rating: 4.6, isBestSeller: false, isNewArrival: true, discount: 0
  },
  {
    id: 'P5-3',
    name: 'Maybelline New York Super Stay Matte Ink Lipstick',
    category: Category.Beauty,
    price: 499,
    description: '16-hour long wear matte liquid lipstick in bold, rich shades.',
    image: "/images/items/Maybelline_New_York_Super_Stay_Matte_Ink_Lipstick_1.webp",
    images: ["/images/items/Maybelline_New_York_Super_Stay_Matte_Ink_Lipstick_1.webp", "/images/items/Maybelline_New_York_Super_Stay_Matte_Ink_Lipstick_2.webp", "/images/items/Maybelline_New_York_Super_Stay_Matte_Ink_Lipstick_3.webp"],
    stock: 100, rating: 4.5, isBestSeller: false, isNewArrival: false, discount: 10
  },
  {
    id: 'P5-4',
    name: 'Neutrogena Ultra Sheer Sunscreen SPF 50+',
    category: Category.Beauty,
    price: 499,
    description: 'Lightweight, non-greasy broad-spectrum UVA/UVB sun protection for daily use.',
    image: "/images/items/Neutrogena_Ultra_Sheer_Sunscreen_SPF_50+_1.webp",
    images: ["/images/items/Neutrogena_Ultra_Sheer_Sunscreen_SPF_50+_1.webp", "/images/items/Neutrogena_Ultra_Sheer_Sunscreen_SPF_50+_2.jpg", "/images/items/Neutrogena_Ultra_Sheer_Sunscreen_SPF_50+_3.webp"],
    stock: 120, rating: 4.8, isBestSeller: true, isNewArrival: true, discount: 12
  },
  {
    id: 'P5-5',
    name: "L'Oréal Paris Revitalift Hyaluronic Acid Serum",
    category: Category.Beauty,
    price: 999,
    description: 'Pure 1.5% hyaluronic acid for intense plumping and lasting hydration.',
    image: "/images/items/L'Oréal_Paris_Revitalift_Hyaluronic_Acid_Serum_1.png",
    images: ["/images/items/L'Oréal_Paris_Revitalift_Hyaluronic_Acid_Serum_1.png", "/images/items/L'Oréal_Paris_Revitalift_Hyaluronic_Acid_Serum_2.jpg"],
    stock: 60, rating: 4.9, isBestSeller: false, isNewArrival: false, discount: 0
  },

  // --- GROCERY (5 ITEMS) ---
  {
    id: 'P4-1',
    name: 'Daawat Rozana Basmati Rice',
    category: Category.Grocery,
    price: 500,
    description: 'Long-grain basmati rice with a natural fragrance, aged to perfection.',
    image: "/images/items/Daawat_Rozana_Basmati_Rice.jpg",
    images: ["/images/items/Daawat_Rozana_Basmati_Rice.jpg", "/images/items/Daawat_Rozana_Basmati_Rice.webp"],
    stock: 60, rating: 4.9, isBestSeller: true, isNewArrival: false, discount: 5
  },
  {
    id: 'P4-2',
    name: 'Figaro Extra Virgin Olive Oil',
    category: Category.Grocery,
    price: 1200,
    description: 'First cold-pressed Spanish olives, heart-healthy and rich in antioxidants.',
    image: "/images/items/Figaro_Extra_Virgin_Olive_Oil_Usage.jpg",
    images: ["/images/items/Figaro_Extra_Virgin_Olive_Oil_Usage.jpg", "/images/items/Figaro_Extra_Virgin_Olive_Oil.jpg"],
    stock: 45, rating: 4.8, isBestSeller: false, isNewArrival: true, discount: 0
  },
  {
    id: 'P4-3',
    name: 'Aashirvaad Whole Wheat Atta',
    category: Category.Grocery,
    price: 400,
    description: 'Stone-ground whole wheat flour, perfect for traditional rotis and bread.',
    image: "/images/items/Aashirvaad_Whole_Wheat_Atta.jpg",
    images: ["/images/items/Aashirvaad_Whole_Wheat_Atta.jpg", "/images/items/Aashirvaad_Whole_Wheat_Atta.webp"],
    stock: 80, rating: 4.7, isBestSeller: false, isNewArrival: false, discount: 0
  },
  {
    id: 'P4-4',
    name: 'Patanjali Honey',
    category: Category.Grocery,
    price: 300,
    description: 'Pure natural multi-flora honey with no added sugar or preservatives.',
    image: "/images/items/Patanjali_Honey_Usage.webp",
    images: ["/images/items/Patanjali_Honey_Usage.webp", "/images/items/Patanjali_Honey.webp"],
    stock: 150, rating: 4.6, isBestSeller: false, isNewArrival: false, discount: 0
  },
  {
    id: 'P4-5',
    name: 'Nutraj Signature Dry Fruits Mix',
    category: Category.Grocery,
    price: 1500,
    description: 'Premium mix of almonds, cashews, walnuts, and raisins for healthy snacking.',
    image: "/images/items/Nutraj_Signature_Dry_Fruits_Mix_Usage.webp",
    images: ["/images/items/Nutraj_Signature_Dry_Fruits_Mix_Usage.webp", "/images/items/Nutraj_Signature_Dry_Fruits_Mix.webp"],
    stock: 45, rating: 4.9, isBestSeller: true, isNewArrival: true, discount: 0
  },

  // --- HOME (5 ITEMS) ---
  {
    id: 'P3-1',
    name: 'Urban Ladder Fabric Sofa Set',
    category: Category.Home,
    price: 45999,
    description: 'Contemporary 3-seater fabric sofa with high-density foam cushions.',
    image: "/images/items/Urban_Ladder_Fabric_Sofa_Set_1.png",
    images: ["/images/items/Urban_Ladder_Fabric_Sofa_Set_1.png", "/images/items/Urban_Ladder_Fabric_Sofa_Set_2.png"],
    stock: 8, rating: 4.7, isBestSeller: true, isNewArrival: false, discount: 12
  },
  {
    id: 'P3-2',
    name: 'IKEA Ribba Wall Frame Set',
    category: Category.Home,
    price: 2499,
    description: 'Set of matching gallery frames for creating a curated wall display.',
    image: "/images/items/IKEA_Ribba_Wall_Frame_Set_1.jpg",
    images: ["/images/items/IKEA_Ribba_Wall_Frame_Set_1.jpg", "/images/items/IKEA_Ribba_Wall_Frame_Set_2.jpg"],
    stock: 40, rating: 4.6, isBestSeller: false, isNewArrival: true, discount: 0
  },
  {
    id: 'P3-3',
    name: 'Philips Hue Smart LED Lights',
    category: Category.Home,
    price: 4999,
    description: 'Voice-controlled smart bulbs with 16 million colors and scheduling.',
    image: "/images/items/Philips_Hue_Smart_LED_Lights_1.jpg",
    images: ["/images/items/Philips_Hue_Smart_LED_Lights_1.jpg", "/images/items/Philips_Hue_Smart_LED_Lights_2.webp"],
    stock: 55, rating: 4.8, isBestSeller: false, isNewArrival: false, isLimitedOffer: true, discount: 10
  },
  {
    id: 'P3-4',
    name: 'Prestige Kitchen Appliance Combo',
    category: Category.Home,
    price: 8999,
    description: 'Comprehensive kitchen combo including pressure cooker, mixer and induction.',
    image: "/images/items/Prestige_Kitchen_Appliance_Combo_1.webp",
    images: ["/images/items/Prestige_Kitchen_Appliance_Combo_1.webp", "/images/items/Prestige_Kitchen_Appliance_Combo_2.jpg"],
    stock: 22, rating: 4.7, isBestSeller: true, isNewArrival: true, discount: 5
  },
  {
    id: 'P3-5',
    name: 'Bombay Dyeing Premium Bedsheet Set',
    category: Category.Home,
    price: 1999,
    description: '100% cotton king-size bedsheet with 2 pillow covers, 300 thread count.',
    image: "/images/items/Bombay_Dyeing_Premium_Bedsheet_Set_1.jpg",
    images: ["/images/items/Bombay_Dyeing_Premium_Bedsheet_Set_1.jpg", "/images/items/Bombay_Dyeing_Premium_Bedsheet_Set_2.jpg"],
    stock: 70, rating: 4.5, isBestSeller: false, isNewArrival: false, discount: 0
  },

  // --- ACCESSORIES (6 ITEMS) ---
  {
    id: 'P7-1',
    name: "Ray-Ban Aviator Classic Sunglasses",
    category: Category.Accessories,
    price: 8499,
    description: 'Iconic gold-tone metal frame with polarized green crystal lenses.',
    image: "/images/items/Ray-Ban_Aviator_Classic_Sunglasses_1.png",
    images: ["/images/items/Ray-Ban_Aviator_Classic_Sunglasses_1.png", "/images/items/Ray-Ban_Aviator_Classic_Sunglasses_2.webp", "/images/items/Ray-Ban_Aviator_Classic_Sunglasses_3.webp"],
    stock: 30, rating: 4.9, isBestSeller: true, isNewArrival: false, discount: 7
  },
  {
    id: 'P7-2',
    name: "Fossil Men's Grant Chronograph Watch",
    category: Category.Accessories,
    price: 12995,
    description: 'Three-eye chronograph, stainless steel case, genuine leather strap.',
    image: "/images/items/Fossil_Men's_Grant_Chronograph_Watch_1.webp",
    images: ["/images/items/Fossil_Men's_Grant_Chronograph_Watch_1.webp", "/images/items/Fossil_Men's_Grant_Chronograph_Watch_2.webp"],
    stock: 20, rating: 4.8, isBestSeller: true, isNewArrival: true, isLimitedOffer: true, discount: 10
  },

  {
    id: 'P7-4',
    name: 'Skybags Casual Backpack',
    category: Category.Accessories,
    price: 1999,
    description: 'Spacious water-resistant backpack with laptop compartment and USB port.',
    image: "/images/items/Skybags_Casual_Backpack_1.webp",
    images: ["/images/items/Skybags_Casual_Backpack_1.webp", "/images/items/Skybags_Casual_Backpack_2.webp", "/images/items/Skybags_Casual_Backpack_3.webp"],
    stock: 80, rating: 4.4, isBestSeller: false, isNewArrival: true, discount: 0
  },
  {
    id: 'P7-5',
    name: 'WildHorn Leather Wallet',
    category: Category.Accessories,
    price: 1499,
    description: 'Genuine leather billfold wallet with RFID blocking and multiple card slots.',
    image: "/images/items/WildHorn_Leather_Wallet_1.jpg",
    images: ["/images/items/WildHorn_Leather_Wallet_1.jpg", "/images/items/WildHorn_Leather_Wallet_2.webp", "/images/items/WildHorn_Leather_Wallet_3.jpg"],
    stock: 60, rating: 4.6, isBestSeller: false, isNewArrival: false, discount: 0
  },
  {
    id: 'P7-6',
    name: 'Tanishq Minimal Gold Pendant',
    category: Category.Accessories,
    price: 14500,
    description: 'Delicate 18K gold pendant with minimalist design, perfect for daily elegance.',
    image: "/images/items/Tanishq_Minimal_Gold_Pendant_1.webp",
    images: ["/images/items/Tanishq_Minimal_Gold_Pendant_1.webp", "/images/items/Tanishq_Minimal_Gold_Pendant_2.webp"],
    stock: 15, rating: 4.9, isBestSeller: false, isNewArrival: true, isLimitedOffer: true, discount: 0
  },

  // --- GADGETS (5 ITEMS) ---
  {
    id: 'P8-1',
    name: 'Meta Quest 2 VR Headset',
    category: Category.Gadgets,
    price: 29999,
    description: 'All-in-one VR gaming with 128GB storage, hand tracking and premium audio.',
    image: "/images/items/Meta_Quest_2_VR_Headset_1.webp",
    images: ["/images/items/Meta_Quest_2_VR_Headset_1.webp", "/images/items/Meta_Quest_2_VR_Headset_2.jpg"],
    stock: 15, rating: 4.7, isBestSeller: true, isNewArrival: false, isLimitedOffer: true, discount: 12
  },
  {
    id: 'P8-2',
    name: 'Mi Power Bank 3i 20000mAh',
    category: Category.Gadgets,
    price: 1999,
    description: '18W fast charging, triple output ports, 20000mAh capacity for all devices.',
    image: "/images/items/Mi_Power_Bank_3i_20000mAh_1.jpg",
    images: ["/images/items/Mi_Power_Bank_3i_20000mAh_1.jpg", "/images/items/Mi_Power_Bank_3i_20000mAh_2.jpg"],
    stock: 100, rating: 4.6, isBestSeller: false, isNewArrival: false, discount: 5
  },
  {
    id: 'P8-3',
    name: 'boAt Airdopes 141',
    category: Category.Gadgets,
    price: 999,
    description: 'True wireless earbuds with ENx noise isolation, 42hr total playback.',
    image: "/images/items/boAt_Airdopes_141_1.jpg",
    images: ["/images/items/boAt_Airdopes_141_1.jpg", "/images/items/boAt_Airdopes_141_2.webp", "/images/items/boAt_Airdopes_141_3.webp"],
    stock: 200, rating: 4.4, isBestSeller: false, isNewArrival: true, discount: 0
  },
  {
    id: 'P8-4',
    name: 'Amazon Echo Dot (5th Gen)',
    category: Category.Gadgets,
    price: 5499,
    description: 'Smart speaker with Alexa, improved bass, motion detection and temperature sensor.',
    image: "/images/items/Amazon_Echo_Dot_(5th_Gen)_1.jpg",
    images: ["/images/items/Amazon_Echo_Dot_(5th_Gen)_1.jpg", "/images/items/Amazon_Echo_Dot_(5th_Gen)_2.jpg"],
    stock: 75, rating: 4.5, isBestSeller: true, isNewArrival: false, discount: 15
  },
  {
    id: 'P7-3-G',
    name: 'Apple watch Series 9',
    category: Category.Gadgets,
    price: 41900,
    description: 'Advanced health sensors, S9 chip, Double Tap gesture, Always-On Retina display.',
    image: "/images/items/Apple_Watch_Series_9_1.webp",
    images: ["/images/items/Apple_Watch_Series_9_1.webp", "/images/items/Apple_Watch_Series_9_2.jpg"],
    stock: 25, rating: 5.0, isBestSeller: true, isNewArrival: false, discount: 5
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