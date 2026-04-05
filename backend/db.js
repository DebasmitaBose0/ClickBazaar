import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, 'db.sqlite');

let cachedDb = null;

export async function getDb() {
  if (cachedDb) return cachedDb;

  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database,
  });
  cachedDb = db;

  // Ensure schema exists
  await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'customer',
        membership_tier TEXT DEFAULT 'None',
        wishlist TEXT DEFAULT '[]',
        cart TEXT DEFAULT '[]',
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        items TEXT NOT NULL,
        total INTEGER NOT NULL,
        shipping_address TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at INTEGER NOT NULL,
        delivery_date INTEGER,
        FOREIGN KEY(user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        ip TEXT,
        user_agent TEXT,
        success INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        action TEXT NOT NULL,
        details TEXT,
        created_at INTEGER NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id)
      );
    `);

  // --- Dynamic Schema Migration Node ---
  const tableColumns = {
    users: ['membership_tier', 'wishlist', 'cart'],
    orders: ['delivery_date', 'status'],
    sessions: ['success'],
    audit_logs: ['details']
  };

  // --- Critical ID Type Alignment ---
  try {
    const ordersInfo = await db.all('PRAGMA table_info(orders)');
    const idCol = ordersInfo.find(c => c.name === 'id');
    if (idCol && idCol.type === 'INTEGER') {
      console.warn('[RECOVERY] Legacy Order ID detected. Aligning with modern TEXT architecture...');
      await db.run('DROP TABLE IF EXISTS orders');
      await db.run(`
          CREATE TABLE orders (
            id TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            items TEXT NOT NULL,
            total INTEGER NOT NULL,
            shipping_address TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending',
            created_at INTEGER NOT NULL,
            delivery_date INTEGER,
            FOREIGN KEY(user_id) REFERENCES users(id)
          )
        `);
      console.log('[RECOVERY] Order schema successfully synchronized.');
    }
  } catch (e) {
    console.warn('[ARCHIVE] Table check failed, proceeding to standard migration:', e.message);
  }

  for (const [table, cols] of Object.entries(tableColumns)) {
    const columns = await db.all(`PRAGMA table_info(${table})`);
    const columnNames = columns.map(c => c.name);
    for (const col of cols) {
      if (!columnNames.includes(col)) {
        let type = 'TEXT';
        let def = "''";
        if (col === 'delivery_date') { type = 'INTEGER'; def = 'NULL'; }
        if (col === 'success') { type = 'INTEGER'; def = '1'; }
        if (col === 'status') { type = 'TEXT'; def = "'pending'"; }

        try {
          await db.run(`ALTER TABLE ${table} ADD COLUMN ${col} ${type} DEFAULT ${def}`);
          console.log(`[ARCHIVE] Migrated ${table} node: Added ${col} attribute.`);
        } catch (e) {
          console.warn(`[ARCHIVE] Migration skipped for ${table}.${col}:`, e.message);
        }
      }
    }
  }

  // --- SEED DATA ON FIRST INITIALIZATION ---
  await seedDatabase(db);

  return db;
}

async function seedDatabase(db) {
  try {
    // Check if products table exists and has data
    let existingProducts = null;
    try {
      existingProducts = await db.get('SELECT COUNT(*) as count FROM products');
    } catch (err) {
      // Table doesn't exist, will create it below
    }

    // Only seed if products table doesn't exist or is empty
    if (!existingProducts || existingProducts.count === 0) {
      console.log('[SEED] Creating products table...');

      // Create products table
      await db.exec(`
        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          price INTEGER NOT NULL,
          description TEXT,
          image TEXT,
          stock INTEGER DEFAULT 0,
          rating REAL DEFAULT 4.5,
          isBestSeller INTEGER DEFAULT 0,
          isNewArrival INTEGER DEFAULT 0,
          isLimitedOffer INTEGER DEFAULT 0,
          discount INTEGER DEFAULT 0,
          created_at INTEGER NOT NULL
        );
      `);

      console.log('[SEED] Inserting seed products...');

      // Sample products - 5 items per category with MULTIPLE local images
      const sampleProducts = [
        // Fashion (5 items)
        { id: 'P1-1', name: "Allen Solly Men's Slim Fit Blazer", category: 'Fashion', price: 5999, description: 'Sharp tailored blazer in premium stretch fabric for formal occasions.', images: ['/images/items/Allen_Solly_Men\'s_Slim_Fit_Blazer_1.webp', '/images/items/Allen_Solly_Men\'s_Slim_Fit_Blazer_2.webp'], stock: 45, rating: 4.8, isBestSeller: 1, isLimitedOffer: 1, discount: 10 },
        { id: 'P1-2', name: "BIBA Women's Silk Blend Saree", category: 'Fashion', price: 4499, description: 'Elegant silk-blend saree with intricate embroidery and rich drape.', images: ['/images/items/BIBA_Women\'s_Silk_Blend_Saree_1.jpg', '/images/items/BIBA_Women\'s_Silk_Blend_Saree_2.jpg'], stock: 20, rating: 4.7, isNewArrival: 1, isLimitedOffer: 1, discount: 5 },
        { id: 'P1-3', name: 'H&M Oversized Hoodie', category: 'Fashion', price: 1999, description: 'Soft cotton-blend hoodie in a relaxed oversized fit for everyday comfort.', images: ['/images/items/H&M_Oversized_Hoodie_1.png', '/images/items/H&M_Oversized_Hoodie_2.png'], stock: 30, rating: 4.5, isLimitedOffer: 1, discount: 0 },
        { id: 'P1-4', name: "Levi's 511 Slim Fit Jeans", category: 'Fashion', price: 3499, description: 'Classic slim fit jeans with comfortable stretch fabric and perfect fade.', images: ['/images/items/Levi\'s_511_Slim_Fit_Jeans_1.webp', '/images/items/Levi\'s_511_Slim_Fit_Jeans_2.webp'], stock: 50, rating: 4.6, isNewArrival: 1, discount: 8 },
        { id: 'P1-5', name: 'ZARA Faux Leather Jacket', category: 'Fashion', price: 6999, description: 'Trendy faux leather jacket with modern cut and premium finish.', images: ['/images/items/ZARA_Faux_Leather_Jacket_1.jpg', '/images/items/ZARA_Faux_Leather_Jacket_2.jpg'], stock: 25, rating: 4.7, isNewArrival: 1, isLimitedOffer: 1, discount: 12 },

        // Electronics (5 items)
        { id: 'P2-1', name: 'Sony Bravia 55-inch 4K Ultra HD Smart LED TV', category: 'Electronics', price: 79990, description: 'Stunning 4K Bravia XR processor with Dolby Vision and Google TV built-in.', images: ['/images/items/Sony_Bravia_55-inch_4K_Ultra_HD_Smart_LED_TV_1.jpg', '/images/items/Sony_Bravia_55-inch_4K_Ultra_HD_Smart_LED_TV_2.jpeg', '/images/items/Sony_Bravia_55-inch_4K_Ultra_HD_Smart_LED_TV_3.webp'], stock: 12, rating: 4.9, isBestSeller: 1, isLimitedOffer: 1, discount: 15 },
        { id: 'P2-2', name: 'Apple MacBook Air M2', category: 'Electronics', price: 114900, description: 'Apple M2 chip, 8GB RAM, 256GB SSD — ultra-thin and remarkably fast.', images: ['/images/items/Apple_MacBook_Air_M2_1.jpeg', '/images/items/Apple_MacBook_Air_M2_2.jpg'], stock: 20, rating: 4.9, isBestSeller: 1, isNewArrival: 1, isLimitedOffer: 1, discount: 5 },
        { id: 'P2-3', name: 'Amazon Echo Dot (5th Gen)', category: 'Electronics', price: 2999, description: 'Compact smart speaker with Alexa voice control and great sound quality.', images: ['/images/items/Amazon_Echo_Dot_(5th_Gen)_1.jpg', '/images/items/Amazon_Echo_Dot_(5th_Gen)_2.jpg'], stock: 35, rating: 4.4, isLimitedOffer: 1, discount: 20 },
        { id: 'P2-4', name: 'Philips Hue Smart LED Lights', category: 'Electronics', price: 9999, description: '16 million color options, voice control compatible, energy efficient.', images: ['/images/items/Philips_Hue_Smart_LED_Lights_1.jpg', '/images/items/Philips_Hue_Smart_LED_Lights_2.webp'], stock: 18, rating: 4.8, isNewArrival: 1, discount: 10 },
        { id: 'P2-5', name: 'Prestige Kitchen Appliance Combo', category: 'Electronics', price: 15999, description: 'Complete kitchen solution with cooktop and mixer-grinder combo.', images: ['/images/items/Prestige_Kitchen_Appliance_Combo_1.webp', '/images/items/Prestige_Kitchen_Appliance_Combo_2.jpg'], stock: 14, rating: 4.7, isBestSeller: 1, isLimitedOffer: 1, discount: 8 },

        // Mobile (5 items)
        { id: 'P6-1', name: 'Apple iPhone 15 Pro Max', category: 'Mobile', price: 159900, description: 'Titanium design, A17 Pro chip, 48MP camera system, and Action Button.', images: ['/images/items/Apple_iPhone_15_Pro_Max.jpg', '/images/items/Applei-Phone-15-Pro-Max.jpg'], stock: 15, rating: 5.0, isBestSeller: 1, isNewArrival: 1, isLimitedOffer: 1, discount: 4 },
        { id: 'P6-2', name: 'Samsung Galaxy S24 Ultra', category: 'Mobile', price: 129999, description: 'Integrated S Pen, 200MP camera, Galaxy AI features on a titanium frame.', images: ['/images/items/Samsung_Galaxy_S24_Ultra.png', '/images/items/Samsung_Galaxy_S24_Ultra_1.webp', '/images/items/Samsung_Galaxy_S24_Ultra_2.webp'], stock: 20, rating: 4.7, isLimitedOffer: 1, discount: 5 },
        { id: 'P6-5', name: 'ASUS ROG Phone 8', category: 'Mobile', price: 89999, description: 'Snapdragon 8 Gen 3, 165Hz AMOLED display, 6000mAh gaming-grade battery.', images: ['/images/items/ASUS_ROG_Phone_8_1.png', '/images/items/ASUS_ROG_Phone_8_2.webp'], stock: 12, rating: 4.8, isBestSeller: 1, isNewArrival: 1, discount: 8 },
        { id: 'P6-3', name: 'OnePlus 12 5G', category: 'Mobile', price: 64999, description: 'Fast 5G connectivity, 120Hz AMOLED display, 50MP camera.', images: ['/images/items/OnePlus_12_5G_1.webp', '/images/items/OnePlus_12_5G_2.jpg'], stock: 28, rating: 4.5, isNewArrival: 1, discount: 10 },
        { id: 'P6-4', name: 'Redmi Note 13 Pro+', category: 'Mobile', price: 24999, description: 'Budget flagship with great camera and AMOLED display.', images: ['/images/items/Redmi_Note_13_Pro+_1.jpg', '/images/items/Redmi_Note_13_Pro+_2.jpg'], stock: 40, rating: 4.4, isNewArrival: 1, discount: 12 },

        // Home & Living (5 items)
        { id: 'P3-1', name: 'IKEA Ribba Wall Frame Set', category: 'Home', price: 1999, description: 'Elegant wall frame set for your perfect gallery arrangement.', images: ['/images/items/IKEA_Ribba_Wall_Frame_Set_1.jpg', '/images/items/IKEA_Ribba_Wall_Frame_Set_2.jpg'], stock: 55, rating: 4.5, isLimitedOffer: 1, discount: 5 },
        { id: 'P3-2', name: 'Bombay Dyeing Premium Bedsheet Set', category: 'Home', price: 2999, description: 'Premium cotton bedsheets with beautiful prints and perfect comfort.', images: ['/images/items/Bombay_Dyeing_Premium_Bedsheet_Set_1.jpg', '/images/items/Bombay_Dyeing_Premium_Bedsheet_Set_2.jpg'], stock: 38, rating: 4.6, isBestSeller: 1, isNewArrival: 1, discount: 15 },
        { id: 'P3-3', name: 'Urban Ladder Fabric Sofa Set', category: 'Home', price: 34999, description: 'Modern design sofa with premium fabric and comfortable seating.', images: ['/images/items/Urban_Ladder_Fabric_Sofa_Set_1.png', '/images/items/Urban_Ladder_Fabric_Sofa_Set_2.png'], stock: 8, rating: 4.8, isNewArrival: 1, discount: 10 },
        { id: 'P3-4', name: 'JBL Charge 5 Bluetooth Speaker', category: 'Home', price: 10999, description: 'Waterproof portable speaker with impressive bass and 20-hour battery.', images: ['/images/items/JBL_Charge_5_Bluetooth_Speaker_1.jpg', '/images/items/JBL_Charge_5_Bluetooth_Speaker_2.webp'], stock: 22, rating: 4.7, isBestSeller: 1, discount: 8 },
        { id: 'P3-5', name: 'Skybags Casual Backpack', category: 'Home', price: 2799, description: 'Durable casual backpack perfect for travel and everyday use.', images: ['/images/items/Skybags_Casual_Backpack_1.webp', '/images/items/Skybags_Casual_Backpack_2.webp', '/images/items/Skybags_Casual_Backpack_3.webp'], stock: 45, rating: 4.4, discount: 20 },

        // Beauty & Wellness (5 items)
        { id: 'P5-1', name: 'Mamaearth Skin Care Kit', category: 'Beauty', price: 1299, description: 'Natural ingredients, toxin-free formulas for radiant, healthy skin.', images: ['/images/items/Mamaearth_Skin_Care_Kit_1.png', '/images/items/Mamaearth_Skin_Care_Kit_2.png'], stock: 55, rating: 4.7, isBestSeller: 1, discount: 5 },
        { id: 'P5-2', name: "L'Oréal Paris Revitalift Hyaluronic Acid Serum", category: 'Beauty', price: 799, description: 'Advanced serum with hyaluronic acid for deep hydration and glow.', images: ['/images/items/L\'Oréal_Paris_Revitalift_Hyaluronic_Acid_Serum_1.png', '/images/items/L\'Oréal_Paris_Revitalift_Hyaluronic_Acid_Serum_2.jpg'], stock: 42, rating: 4.5, discount: 10 },
        { id: 'P5-3', name: 'Maybelline SuperStay Matte Ink Lipstick', category: 'Beauty', price: 449, description: 'Long-lasting matte lipstick in stunning colors with comfortable wear.', images: ['/images/items/Maybelline_New_York_Super_Stay_Matte_Ink_Lipstick_1.webp', '/images/items/Maybelline_New_York_Super_Stay_Matte_Ink_Lipstick_2.webp', '/images/items/Maybelline_New_York_Super_Stay_Matte_Ink_Lipstick_3.webp'], stock: 65, rating: 4.6, discount: 15 },
        { id: 'P5-4', name: 'Neutrogena Ultra Sheer Sunscreen SPF 50+', category: 'Beauty', price: 599, description: 'Lightweight broad-spectrum protection for all skin types.', images: ['/images/items/Neutrogena_Ultra_Sheer_Sunscreen_SPF_50+_1.webp', '/images/items/Neutrogena_Ultra_Sheer_Sunscreen_SPF_50+_2.jpg', '/images/items/Neutrogena_Ultra_Sheer_Sunscreen_SPF_50+_3.webp'], stock: 48, rating: 4.8, isNewArrival: 1, discount: 5 },
        { id: 'P5-5', name: 'Minimalist 10% Vitamin C Serum', category: 'Beauty', price: 649, description: 'Brightening vitamin C serum for a radiant complexion.', images: ['/images/items/Minimalist_10%_Vitamin_C_Serum_1.jpg', '/images/items/Minimalist_10%_Vitamin_C_Serum_2.webp'], stock: 38, rating: 4.7, discount: 8 },

        // Grocery (5 items)
        { id: 'P4-1', name: 'Daawat Rozana Basmati Rice', category: 'Grocery', price: 500, description: 'Long-grain basmati rice with a natural fragrance, aged to perfection.', images: ['/images/items/Daawat_Rozana_Basmati_Rice.jpg', '/images/items/Daawat_Rozana_Basmati_Rice.webp'], stock: 100, rating: 4.9, discount: 0 },
        { id: 'P4-2', name: 'Aashirvaad Whole Wheat Atta', category: 'Grocery', price: 350, description: 'Premium whole wheat flour made from selected grains for perfect chapatis.', images: ['/images/items/Aashirvaad_Whole_Wheat_Atta.jpg', '/images/items/Aashirvaad_Whole_Wheat_Atta.webp'], stock: 120, rating: 4.8, discount: 5 },
        { id: 'P4-3', name: 'Figaro Extra Virgin Olive Oil', category: 'Grocery', price: 899, description: 'Premium extra virgin olive oil for cooking and salads.', images: ['/images/items/Figaro_Extra_Virgin_Olive_Oil.jpg', '/images/items/Figaro_Extra_Virgin_Olive_Oil_Usage.jpg'], stock: 35, rating: 4.7, isBestSeller: 1, discount: 10 },
        { id: 'P4-4', name: 'Patanjali Honey', category: 'Grocery', price: 399, description: 'Pure natural honey with multiple health benefits.', images: ['/images/items/Patanjali_Honey.webp', '/images/items/Patanjali_Honey_Usage.webp'], stock: 60, rating: 4.6, isNewArrival: 1, discount: 8 },
        { id: 'P4-5', name: 'Nutraj Signature Dry Fruits Mix', category: 'Grocery', price: 649, description: 'Premium mix of almonds, walnuts, cashews and raisins.', images: ['/images/items/Nutraj_Signature_Dry_Fruits_Mix.webp', '/images/items/Nutraj_Signature_Dry_Fruits_Mix_Usage.webp'], stock: 45, rating: 4.8, isNewArrival: 1, discount: 12 },

        // Accessories (5 items)
        { id: 'P7-1', name: 'Ray-Ban Aviator Classic Sunglasses', category: 'Accessories', price: 7999, description: 'Iconic aviator design with premium quality lenses and frame.', images: ['/images/items/Ray-Ban_Aviator_Classic_Sunglasses_1.png', '/images/items/Ray-Ban_Aviator_Classic_Sunglasses_2.webp', '/images/items/Ray-Ban_Aviator_Classic_Sunglasses_3.webp'], stock: 28, rating: 4.9, isBestSeller: 1, discount: 10 },
        { id: 'P7-2', name: 'Fossil Men\'s Grant Chronograph Watch', category: 'Accessories', price: 8999, description: 'Classic chronograph watch with leather strap and reliable movement.', images: ['/images/items/Fossil_Men\'s_Grant_Chronograph_Watch_1.webp', '/images/items/Fossil_Men\'s_Grant_Chronograph_Watch_2.webp'], stock: 18, rating: 4.7, discount: 15 },
        { id: 'P7-3', name: 'Apple Watch Series 9', category: 'Accessories', price: 41900, description: 'Advanced smartwatch with health monitoring and fitness tracking.', images: ['/images/items/Apple_Watch_Series_9_1.webp', '/images/items/Apple_Watch_Series_9_2.jpg'], stock: 12, rating: 4.8, isNewArrival: 1, discount: 5 },
        { id: 'P7-4', name: 'WildHorn Leather Wallet', category: 'Accessories', price: 1599, description: 'Premium leather wallet with multiple compartments and RFID protection.', images: ['/images/items/WildHorn_Leather_Wallet_1.jpg', '/images/items/WildHorn_Leather_Wallet_2.webp', '/images/items/WildHorn_Leather_Wallet_3.jpg'], stock: 50, rating: 4.5, discount: 12 },
        { id: 'P7-5', name: 'Tanishq Minimal Gold Pendant', category: 'Accessories', price: 24999, description: 'Elegant 22k gold pendant with contemporary minimal design.', images: ['/images/items/Tanishq_Minimal_Gold_Pendant_1.webp', '/images/items/Tanishq_Minimal_Gold_Pendant_2.webp'], stock: 10, rating: 4.9, isBestSeller: 1, discount: 3 },
      ];

      for (const product of sampleProducts) {
        await db.run(
          `INSERT INTO products (id, name, category, price, description, image, stock, rating, isBestSeller, isNewArrival, isLimitedOffer, discount, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          product.id,
          product.name,
          product.category,
          product.price,
          product.description,
          JSON.stringify(product.images || [product.image]),
          product.stock,
          product.rating,
          product.isBestSeller || 0,
          product.isNewArrival || 0,
          product.isLimitedOffer || 0,
          product.discount,
          Date.now()
        );
      }

      console.log(`[SEED] ✅ Seeded ${sampleProducts.length} products successfully`);
    }
  } catch (err) {
    console.warn('[SEED] Could not seed database:', err.message);
  }
}