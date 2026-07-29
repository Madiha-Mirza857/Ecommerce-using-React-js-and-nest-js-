import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure storage directories exist
const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer Storage Configuration for Local File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, 'product-' + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
});

// Seed Initial Database
function getInitialData() {
  return {
    users: [
      {
        id: 'u-admin-1',
        email: 'admin@atelier.com',
        password: 'admin123',
        name: 'Atelier Director (Admin)',
        role: 'admin',
      },
      {
        id: 'u-customer-1',
        email: 'customer@atelier.com',
        password: 'user123',
        name: 'Clara Vance',
        role: 'customer',
      },
    ],
    categories: [
      { id: 'cat-1', name: 'Outerwear', slug: 'outerwear', description: 'Architectural coats, trenchcoats, and jackets' },
      { id: 'cat-2', name: 'Knitwear', slug: 'knitwear', description: 'Heavyweight alpaca, cashmere, and merino knits' },
      { id: 'cat-3', name: 'Tailored Suits', slug: 'tailored-suits', description: 'Structured virgin wool pants and silk garments' },
      { id: 'cat-4', name: 'Footwear', slug: 'footwear', description: 'Goodyear welt boots and Italian leather footwear' },
      { id: 'cat-5', name: 'Leather Goods', slug: 'leather-goods', description: 'Handcrafted nappa leather bags and small accessories' },
      { id: 'cat-6', name: 'Accessories', slug: 'accessories', description: 'Japanese acetate eyewear and fine jewelry' },
    ],
    products: [
      {
        id: 'prod-1',
        name: 'Architectural Cashmere Overcoat',
        subtitle: 'Structured double-breasted silhouette in grade-A Mongolian cashmere',
        price: 1850,
        originalPrice: 2100,
        category: 'Outerwear',
        tags: ['Cashmere', 'Tailored', 'Winter Capsule', 'Bestseller'],
        images: [
          'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
        ],
        colors: [
          { name: 'Onyx Charcoal', hex: '#262626' },
          { name: 'Emerald Moss', hex: '#006c49' },
          { name: 'Oatmeal Beige', hex: '#D2C8BC' },
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        description: 'Cut with precision architectural lines, this heavyweight overcoat balances structure and unyielding comfort. Spun from 100% Mongolian Grade-A cashmere with horn buttons and silk cupro lining.',
        details: [
          'Peak lapels with hand-stitched collar stand',
          'Welt breast pocket and deep interior welt pockets',
          'Full hand-finished silk cupro lining',
          'Made in Florence, Italy',
        ],
        composition: '100% Grade-A Mongolian Cashmere | Lining: 100% Cupro',
        careInstructions: 'Specialist dry clean only. Store on padded cedar coat hanger.',
        rating: 4.9,
        reviewsCount: 38,
        inStock: true,
        isNewArrival: true,
        isBestseller: true,
        sustainabilityBadge: '100% Traceable Cashmere',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'prod-2',
        name: 'Monolithic Wool Pleated Trousers',
        subtitle: 'High-waisted wide leg tailoring with hand-pressed front creases',
        price: 680,
        category: 'Tailored Suits',
        tags: ['Wool', 'Minimalist', 'Workwear', 'New'],
        images: [
          'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop',
        ],
        colors: [
          { name: 'Pitch Black', hex: '#111827' },
          { name: 'Slate Grey', hex: '#4B5563' },
          { name: 'Earthy Taupe', hex: '#8B7D6B' },
        ],
        sizes: ['28', '30', '32', '34', '36'],
        description: 'An anchor piece for the contemporary wardrobe. Engineered from crisp virgin wool weave with twin front pleats and an extended waist tab for clean lines without a belt.',
        details: [
          'Twin forward pleats with crisp press fold',
          'Side waist adjusters with brushed nickel buckles',
          'Unfinished hem for bespoke length adjustment',
        ],
        composition: '100% Super 130s Virgin Wool',
        careInstructions: 'Dry clean only. Steam gently between wears.',
        rating: 4.8,
        reviewsCount: 24,
        inStock: true,
        isNewArrival: true,
        sustainabilityBadge: 'ZQRX Certified Wool',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'prod-3',
        name: 'Linear Silk Habotai Dress',
        subtitle: 'Asymmetric bias-cut evening dress with subtle emerald sheen',
        price: 1250,
        originalPrice: 1400,
        category: 'Tailored Suits',
        tags: ['Silk', 'Eveningwear', 'Editorial'],
        images: [
          'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop',
        ],
        colors: [
          { name: 'Signature Emerald', hex: '#8b4513' },
          { name: 'Midnight Navy', hex: '#0F172A' },
        ],
        sizes: ['XS', 'S', 'M', 'L'],
        description: 'Draped effortlessly along the body, the Linear Silk Dress showcases fluid elegance. Hand-cut on the bias from heavyweight silk habotai.',
        details: [
          'Asymmetric shoulder drape with concealed side zip',
          'Self-lined bodice for maximum opacity',
          'Floor-sweeping column silhouette',
        ],
        composition: '100% Mulberry Silk',
        careInstructions: 'Dry clean only.',
        rating: 5.0,
        reviewsCount: 19,
        inStock: true,
        isBestseller: true,
        sustainabilityBadge: 'Zero Chemical Dyes',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'prod-4',
        name: 'Chunky Ribbed Alpaca Knit',
        subtitle: 'Heavyweight mock-neck sweater spun from ethically sheared Peruvian alpaca',
        price: 540,
        category: 'Knitwear',
        tags: ['Alpaca', 'Knitwear', 'Cozy', 'New'],
        images: [
          'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop',
        ],
        colors: [
          { name: 'Ivory Cream', hex: '#F5F5F0' },
          { name: 'Charcoal Dust', hex: '#374151' },
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        description: 'Immensely plush and insulating without weight. Knitted in a 3-gauge fisherman rib from un-dyed baby alpaca fibers.',
        details: [
          'Structured mock neckline with reinforced ribbed cuffs',
          'Dropped shoulder seam for relaxed layering',
        ],
        composition: '85% Baby Alpaca, 15% Organic Merino Wool',
        careInstructions: 'Hand wash cold.',
        rating: 4.7,
        reviewsCount: 31,
        inStock: true,
        isNewArrival: true,
        sustainabilityBadge: 'Fair Trade Certified',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'prod-5',
        name: 'Minimalist Calfskin Chelsea Boot',
        subtitle: 'Sculpted Goodyear-welted ankle boot with subtle brown heel pull',
        price: 790,
        category: 'Footwear',
        tags: ['Footwear', 'Leather', 'Essential'],
        images: [
          'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=1000&auto=format&fit=crop',
        ],
        colors: [
          { name: 'Polished Black', hex: '#0A0A0A' },
          { name: 'Cognac Brown', hex: '#78350F' },
        ],
        sizes: ['39', '40', '41', '42', '43', '44'],
        description: 'Handcrafted in Marche, Italy using vegetable-tanned French calfskin.',
        details: [
          'Goodyear welt construction for lifetime resoling',
          'Tone-on-tone elastic side gussets',
        ],
        composition: '100% Full-Grain Calfskin',
        careInstructions: 'Clean with damp cloth.',
        rating: 4.9,
        reviewsCount: 42,
        inStock: true,
        isBestseller: true,
        sustainabilityBadge: 'Vegetable Tanned Leather',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'prod-6',
        name: 'Linear Box Crossbody Bag',
        subtitle: 'Structured box silhouette in smooth nappa leather with gold hardware',
        price: 920,
        category: 'Leather Goods',
        tags: ['Bag', 'Leather', 'Accessories', 'Iconic'],
        images: [
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
        ],
        colors: [
          { name: 'Jet Black', hex: '#18181B' },
          { name: 'Warm Saddle', hex: '#B45309' },
        ],
        sizes: ['One Size'],
        description: 'An architectural staple. Features a magnetic clasp disguised as a clean metal bar.',
        details: [
          'Adjustable leather shoulder strap',
          'Custom gold-plated hardware',
        ],
        composition: 'Exterior: 100% Italian Nappa | Lining: Suede',
        careInstructions: 'Store in provided dust bag.',
        rating: 4.9,
        reviewsCount: 56,
        inStock: true,
        isBestseller: true,
        sustainabilityBadge: 'LWG Gold Certified Tannery',
        createdAt: new Date().toISOString(),
      },
    ],
    orders: [
      {
        id: 'ord-2026-101',
        customerName: 'Clara Vance',
        customerEmail: 'customer@atelier.com',
        address: '142 Regent Street, Apt 4B',
        city: 'London',
        country: 'United Kingdom',
        items: [
          {
            productId: 'prod-1',
            productName: 'Architectural Cashmere Overcoat',
            image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop',
            price: 1850,
            quantity: 1,
            color: 'Onyx Charcoal',
            size: 'M',
          },
        ],
        subtotal: 1850,
        shippingFee: 0,
        discountAmount: 0,
        totalAmount: 1850,
        paymentMethod: 'card',
        giftWrap: true,
        status: 'Processing',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ],
  };
}

function readDb() {
  if (!fs.existsSync(DB_FILE)) {
    const initial = getInitialData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB, re-initializing:', err);
    const initial = getInitialData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
}

function writeDb(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Serve static uploaded files
  app.use('/uploads', express.static(UPLOADS_DIR));

  // Initialize DB
  readDb();

  // --- Gemini Client ---
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });
  };

  // --- REST API ENDPOINTS ---

  // 1. Image Upload Endpoint (Multer -> saves in /public/uploads)
  app.post('/api/upload', upload.array('images', 5), (req: any, res: any) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No image files uploaded.' });
      }
      const fileUrls = req.files.map((file: any) => `/uploads/${file.filename}`);
      res.json({
        message: 'Images uploaded successfully to local folder',
        urls: fileUrls,
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      res.status(500).json({ error: error?.message || 'File upload failed' });
    }
  });

  // 2. Authentication API (Email & Password)
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const db = readDb();
    const user = db.users.find(
      (u: any) => u.email.toLowerCase() === (email || '').toLowerCase() && u.password === password
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid email address or password.' });
    }

    const token = `token-${user.id}-${Date.now()}`;
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        token,
      },
    });
  });

  app.post('/api/auth/register', (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required.' });
    }

    const db = readDb();
    const existing = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const newUser = {
      id: `u-${Date.now()}`,
      email,
      password,
      name,
      role: 'customer',
    };

    db.users.push(newUser);
    writeDb(db);

    const token = `token-${newUser.id}-${Date.now()}`;
    res.json({
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        token,
      },
    });
  });

  // 3. Categories API (CRUD)
  app.get('/api/categories', (req, res) => {
    const db = readDb();
    // Calculate product counts for categories
    const categoriesWithCount = db.categories.map((c: any) => ({
      ...c,
      productCount: db.products.filter((p: any) => p.category === c.name).length,
    }));
    res.json(categoriesWithCount);
  });

  app.post('/api/categories', (req, res) => {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name is required' });

    const db = readDb();
    const newCategory = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      slug: name.trim().toLowerCase().replace(/\s+/g, '-'),
      description: description || '',
    };

    db.categories.push(newCategory);
    writeDb(db);
    res.status(201).json(newCategory);
  });

  app.put('/api/categories/:id', (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const db = readDb();
    const index = db.categories.findIndex((c: any) => c.id === id);

    if (index === -1) return res.status(404).json({ error: 'Category not found' });

    const oldName = db.categories[index].name;
    db.categories[index] = {
      ...db.categories[index],
      name: name ? name.trim() : db.categories[index].name,
      slug: name ? name.trim().toLowerCase().replace(/\s+/g, '-') : db.categories[index].slug,
      description: description !== undefined ? description : db.categories[index].description,
    };

    // Also update category name in existing products if changed
    if (name && name.trim() !== oldName) {
      db.products = db.products.map((p: any) =>
        p.category === oldName ? { ...p, category: name.trim() } : p
      );
    }

    writeDb(db);
    res.json(db.categories[index]);
  });

  app.delete('/api/categories/:id', (req, res) => {
    const { id } = req.params;
    const db = readDb();
    const cat = db.categories.find((c: any) => c.id === id);

    if (!cat) return res.status(404).json({ error: 'Category not found' });

    db.categories = db.categories.filter((c: any) => c.id !== id);
    writeDb(db);
    res.json({ message: 'Category deleted successfully', id });
  });

  // 4. Products API (CRUD)
  app.get('/api/products', (req, res) => {
    const db = readDb();
    res.json(db.products);
  });

  app.get('/api/products/:id', (req, res) => {
    const db = readDb();
    const product = db.products.find((p: any) => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  });

  app.post('/api/products', (req, res) => {
    const p = req.body;
    if (!p.name || !p.price || !p.category) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }

    const db = readDb();
    const newProduct = {
      id: `prod-${Date.now()}`,
      name: p.name,
      subtitle: p.subtitle || '',
      price: Number(p.price),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
      category: p.category,
      tags: Array.isArray(p.tags) ? p.tags : (p.tags || '').split(',').map((t: string) => t.trim()).filter(Boolean),
      images: Array.isArray(p.images) && p.images.length > 0 ? p.images : ['https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000'],
      colors: Array.isArray(p.colors) && p.colors.length > 0 ? p.colors : [{ name: 'Default', hex: '#1a1a1a' }],
      sizes: Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : ['S', 'M', 'L', 'XL'],
      description: p.description || '',
      details: Array.isArray(p.details) ? p.details : (p.details || '').split('\n').filter(Boolean),
      composition: p.composition || '100% Fine Fibers',
      careInstructions: p.careInstructions || 'Dry clean only',
      rating: 5.0,
      reviewsCount: 1,
      inStock: p.inStock !== false,
      isNewArrival: Boolean(p.isNewArrival),
      isBestseller: Boolean(p.isBestseller),
      sustainabilityBadge: p.sustainabilityBadge || 'Atelier Certified',
      createdAt: new Date().toISOString(),
    };

    db.products.unshift(newProduct);
    writeDb(db);
    res.status(201).json(newProduct);
  });

  app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const db = readDb();
    const index = db.products.findIndex((p: any) => p.id === id);

    if (index === -1) return res.status(404).json({ error: 'Product not found' });

    const updated = {
      ...db.products[index],
      ...req.body,
      price: req.body.price ? Number(req.body.price) : db.products[index].price,
      updatedAt: new Date().toISOString(),
    };

    db.products[index] = updated;
    writeDb(db);
    res.json(updated);
  });

  app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const db = readDb();
    const exists = db.products.some((p: any) => p.id === id);

    if (!exists) return res.status(404).json({ error: 'Product not found' });

    db.products = db.products.filter((p: any) => p.id !== id);
    writeDb(db);
    res.json({ message: 'Product deleted', id });
  });

  // 5. Orders API
  app.get('/api/orders', (req, res) => {
    const db = readDb();
    const email = req.query.email as string;
    if (email) {
      const userOrders = db.orders.filter(
        (o: any) => o.customerEmail.toLowerCase() === email.toLowerCase()
      );
      return res.json(userOrders);
    }
    res.json(db.orders);
  });

  app.post('/api/orders', (req, res) => {
    const orderData = req.body;
    if (!orderData.items || orderData.items.length === 0) {
      return res.status(400).json({ error: 'Order must contain items' });
    }

    const db = readDb();
    const newOrder = {
      id: `ord-2026-${Math.floor(100 + Math.random() * 900)}`,
      customerName: orderData.customerName || 'Guest Customer',
      customerEmail: orderData.customerEmail || 'customer@atelier.com',
      address: orderData.address || '',
      city: orderData.city || '',
      country: orderData.country || '',
      items: orderData.items,
      subtotal: Number(orderData.subtotal || 0),
      shippingFee: Number(orderData.shippingFee || 0),
      discountAmount: Number(orderData.discountAmount || 0),
      totalAmount: Number(orderData.totalAmount || 0),
      paymentMethod: orderData.paymentMethod || 'card',
      giftWrap: Boolean(orderData.giftWrap),
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    db.orders.unshift(newOrder);
    writeDb(db);
    res.status(201).json(newOrder);
  });

  app.put('/api/orders/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const db = readDb();
    const order = db.orders.find((o: any) => o.id === id);

    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.status = status;
    order.updatedAt = new Date().toISOString();
    writeDb(db);
    res.json(order);
  });

  // 6. AI Stylist Endpoint (Gemini)
  app.post('/api/stylist', async (req, res) => {
    try {
      const { prompt, occasion, preference } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          advice: 'Welcome to Curation & Atelier. To unlock personalized AI styling advice based on real-time fashion analysis, please configure your GEMINI_API_KEY in Settings > Secrets.',
          status: 'success',
        });
      }

      const systemInstruction = `You are the Executive AI Stylist for "Curation & Atelier", an ultra-premium editorial fashion house. Your tone is sophisticated, concise, and helpful. Suggest outfit pairings from our catalog.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `User request: ${prompt || 'Suggest an outfit for an upcoming autumn gallery opening.'} Occasion: ${occasion || 'Versatile Luxury'} Preference: ${preference || 'Minimalist Elegance'}`,
        config: { systemInstruction, temperature: 0.7 },
      });

      res.json({
        advice: response.text || 'Our editorial recommendation centers on clean architectural tailoring paired with rich tactile textures.',
        status: 'success',
      });
    } catch (error: any) {
      console.error('Gemini API error:', error);
      res.status(500).json({ error: error?.message || 'Error calling AI Stylist service' });
    }
  });

  // Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', brand: 'Curation & Atelier Full-Stack E-Commerce' });
  });

  // Vite middleware for dev / static for prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Curation & Atelier server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

