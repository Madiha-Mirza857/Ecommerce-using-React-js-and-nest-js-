import { Product } from '../types';

export const MOCK_PRODUCTS: Product[] = [
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
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Onyx Charcoal', hex: '#262626' },
      { name: 'Emerald Moss', hex: '#006c49' },
      { name: 'Oatmeal Beige', hex: '#D2C8BC' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Cut with precision architectural lines, this heavyweight overcoat balances structure and unyielding comfort. Spun from 100% Mongolian Grade-A cashmere with horn buttons and silk cupro lining.',
    details: [
      'Peak lapels with hand-stitched collar stand',
      'Welt breast pocket and deep interior welt pockets',
      'Full hand-finished silk cupro lining',
      'Made in Florence, Italy'
    ],
    composition: '100% Grade-A Mongolian Cashmere | Lining: 100% Cupro',
    careInstructions: 'Specialist dry clean only. Store on padded cedar coat hanger.',
    rating: 4.9,
    reviewsCount: 38,
    inStock: true,
    isNewArrival: true,
    isBestseller: true,
    sustainabilityBadge: '100% Traceable Cashmere',
    relatedProductIds: ['prod-2', 'prod-5', 'prod-7']
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
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Pitch Black', hex: '#111827' },
      { name: 'Slate Grey', hex: '#4B5563' },
      { name: 'Earthy Taupe', hex: '#8B7D6B' }
    ],
    sizes: ['28', '30', '32', '34', '36'],
    description: 'An anchor piece for the contemporary wardrobe. Engineered from crisp virgin wool weave with twin front pleats and an extended waist tab for clean lines without a belt.',
    details: [
      'Twin forward pleats with crisp press fold',
      'Side waist adjusters with brushed nickel buckles',
      'Unfinished hem for bespoke length adjustment'
    ],
    composition: '100% Super 130s Virgin Wool',
    careInstructions: 'Dry clean only. Steam gently between wears.',
    rating: 4.8,
    reviewsCount: 24,
    inStock: true,
    isNewArrival: true,
    sustainabilityBadge: 'ZQRX Certified Wool',
    relatedProductIds: ['prod-1', 'prod-3']
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
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Signature Emerald', hex: '#10b981' },
      { name: 'Midnight Navy', hex: '#0F172A' },
      { name: 'Champagne Silk', hex: '#F3E5AB' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Draped effortlessly along the body, the Linear Silk Dress showcases fluid elegance. Hand-cut on the bias from heavyweight silk habotai, finished with delicate rolled hems.',
    details: [
      'Asymmetric shoulder drape with concealed side zip',
      'Self-lined bodice for maximum opacity',
      'Floor-sweeping column silhouette'
    ],
    composition: '100% Mulberry Silk',
    careInstructions: 'Dry clean only. Do not wash or wring.',
    rating: 5.0,
    reviewsCount: 19,
    inStock: true,
    isBestseller: true,
    sustainabilityBadge: 'Zero Chemical Dyes',
    relatedProductIds: ['prod-6', 'prod-8']
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
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Ivory Cream', hex: '#F5F5F0' },
      { name: 'Charcoal Dust', hex: '#374151' },
      { name: 'Forest Shadow', hex: '#064E3B' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Immensely plush and insulating without weight. Knitted in a 3-gauge fisherman rib from un-dyed baby alpaca fibers sourced directly from high-altitude Peruvian cooperatives.',
    details: [
      'Structured mock neckline with reinforced ribbed cuffs',
      'Dropped shoulder seam for relaxed layering',
      'Naturally hypoallergenic & breathable'
    ],
    composition: '85% Baby Alpaca, 15% Organic Merino Wool',
    careInstructions: 'Hand wash cold with wool detergent. Dry flat in shade.',
    rating: 4.7,
    reviewsCount: 31,
    inStock: true,
    isNewArrival: true,
    sustainabilityBadge: 'Fair Trade Certified',
    relatedProductIds: ['prod-1', 'prod-2']
  },
  {
    id: 'prod-5',
    name: 'Minimalist Calfskin Chelsea Boot',
    subtitle: 'Sculpted Goodyear-welted ankle boot with subtle green heel pull',
    price: 790,
    category: 'Footwear',
    tags: ['Footwear', 'Leather', 'Essential'],
    images: [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Polished Black', hex: '#0A0A0A' },
      { name: 'Cognac Brown', hex: '#78350F' }
    ],
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
    description: 'Handcrafted in Marche, Italy using vegetable-tanned French calfskin. The silhouette features a clean, elongated toe box and custom emerald grosgrain tab.',
    details: [
      'Goodyear welt construction for lifetime resoling',
      'Tone-on-tone elastic side gussets',
      'Vibram half-rubber tread sole for wet surface grip'
    ],
    composition: '100% Full-Grain Calfskin | Sole: Leather & Vibram Rubber',
    careInstructions: 'Clean with damp cloth and nourish with natural leather balm.',
    rating: 4.9,
    reviewsCount: 42,
    inStock: true,
    isBestseller: true,
    sustainabilityBadge: 'Vegetable Tanned Leather',
    relatedProductIds: ['prod-1', 'prod-2', 'prod-6']
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
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Jet Black', hex: '#18181B' },
      { name: 'Olive Emerald', hex: '#047857' },
      { name: 'Warm Saddle', hex: '#B45309' }
    ],
    sizes: ['One Size'],
    description: 'An architectural staple. Features a magnetic clasp disguised as a clean metal bar, opening to a suede-lined double interior compartment with card slots.',
    details: [
      'Adjustable leather shoulder strap with 5 drop lengths',
      'Custom gold-plated brushed brass hardware',
      'Interior zip compartment & card slot'
    ],
    composition: 'Exterior: 100% Italian Nappa | Lining: 100% Calf Suede',
    careInstructions: 'Avoid direct sunlight and humidity. Store in provided dust bag.',
    rating: 4.9,
    reviewsCount: 56,
    inStock: true,
    isBestseller: true,
    sustainabilityBadge: 'LWG Gold Certified Tannery',
    relatedProductIds: ['prod-3', 'prod-8']
  },
  {
    id: 'prod-7',
    name: 'Geometric Acetate Sunglasses',
    subtitle: 'Beveled Japanese acetate frames with 100% UV emerald-tinted lenses',
    price: 360,
    category: 'Accessories',
    tags: ['Eyewear', 'Minimal', 'Summer/Winter'],
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Dark Tortoise', hex: '#3F200A' },
      { name: 'Black Amber', hex: '#1C1917' }
    ],
    sizes: ['One Size'],
    description: 'Hand-cut in Sabae, Japan. Features custom 7-barrel hinges, subtle linear titanium pins, and Anti-reflective emerald lens coating.',
    details: [
      'Takiron organic cotton-based cellulose acetate',
      'Category 3 UV400 protection filter lenses',
      'Includes handcrafted leather folding hard case'
    ],
    composition: '100% Japanese Cotton Acetate & Titanium Hardware',
    careInstructions: 'Clean lenses with microfiber cloth provided.',
    rating: 4.8,
    reviewsCount: 18,
    inStock: true,
    isNewArrival: false,
    relatedProductIds: ['prod-1', 'prod-6']
  },
  {
    id: 'prod-8',
    name: 'Structured Trench Trenchcoat',
    subtitle: 'Water-repellent gabardine cotton with storm flap and horn buckles',
    price: 1450,
    category: 'Outerwear',
    tags: ['Trench', 'Rainwear', 'Heritage'],
    images: [
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Classic Khaki', hex: '#C2B280' },
      { name: 'Dark Obsidian', hex: '#0F172A' }
    ],
    sizes: ['S', 'M', 'L'],
    description: 'A modern reinterpretation of military trench coat heritage. Crafted from dense 400g Egyptian cotton gabardine with natural weather resistance and a removable wool liner.',
    details: [
      'Double-breasted storm closure with neck latch',
      'D-ring webbed belt with buffalo horn buckle',
      'Detachable insulating wool interior vest'
    ],
    composition: 'Outer: 100% Organic Gabardine Cotton | Liner: 100% Merino Wool',
    careInstructions: 'Dry clean only.',
    rating: 4.9,
    reviewsCount: 29,
    inStock: true,
    isNewArrival: true,
    sustainabilityBadge: 'GOTS Organic Cotton',
    relatedProductIds: ['prod-2', 'prod-5']
  }
];

export const MOCK_LOOKBOOK: {
  id: string;
  title: string;
  season: string;
  heroImage: string;
  description: string;
  hotspots: { x: number; y: number; productId: string; productName: string; price: number }[];
}[] = [
  {
    id: 'look-1',
    title: 'The Monolithic Silhouette',
    season: 'Autumn / Winter Capsule',
    heroImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
    description: 'An exploration of architectural proportion and tactile depth. Pairing Mongolian Cashmere overcoats with high-waisted pleated wool tailoring.',
    hotspots: [
      { x: 35, y: 30, productId: 'prod-1', productName: 'Architectural Cashmere Overcoat', price: 1850 },
      { x: 45, y: 65, productId: 'prod-2', productName: 'Monolithic Wool Pleated Trousers', price: 680 },
      { x: 60, y: 85, productId: 'prod-5', productName: 'Minimalist Calfskin Chelsea Boot', price: 790 }
    ]
  },
  {
    id: 'look-2',
    title: 'Fluidity & Form',
    season: 'Eveningwear & Gala',
    heroImage: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1200&auto=format&fit=crop',
    description: 'Bias-cut mulberry silk draped effortlessly, complemented by structured Italian leather and clean geometric optics.',
    hotspots: [
      { x: 50, y: 40, productId: 'prod-3', productName: 'Linear Silk Habotai Dress', price: 1250 },
      { x: 70, y: 55, productId: 'prod-6', productName: 'Linear Box Crossbody Bag', price: 920 }
    ]
  }
];

export const MOCK_STORIES = [
  {
    id: 'story-1',
    title: 'Architectural Tailoring: The Modern Uniform',
    subtitle: 'Inside the Florence atelier defining the shape of quiet luxury for 2026',
    author: 'Elena Vance | Fashion Director',
    readTime: '4 min read',
    date: 'July 2026',
    coverImage: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=1200&auto=format&fit=crop',
    excerpt: 'True luxury lies in the unseen details: hand-padded lapels, zero-waste cashmere scouring, and proportions engineered to move with natural grace.',
    contentParagraphs: [
      'In an era dominated by rapid fashion cycles, Luxe & Linear turns back toward the timeless power of pure architectural cut. Every shoulder seam is calculated with sub-millimeter precision to achieve a gentle drape without stiff padding.',
      'Our master tailors in Florence utilize Grade-A Mongolian cashmere that undergoes a traditional 12-stage mountain water washing process, preserving the fiber’s natural lanolin and inherent luster.',
      'When worn, the silhouette creates a powerful linear frame—a subtle nod to modernist architecture and serene urban sanctuaries.'
    ],
    featuredProductIds: ['prod-1', 'prod-2', 'prod-5']
  },
  {
    id: 'story-2',
    title: 'The Art of Un-dyed Alpaca',
    subtitle: 'Sustaining Peruvian high-altitude weaving traditions',
    author: 'Marcus Vance | Sustainability Lead',
    readTime: '3 min read',
    date: 'June 2026',
    coverImage: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1200&auto=format&fit=crop',
    excerpt: 'Discover how working directly with indigenous alpaca herders produces tactile knits with zero synthetic dyes and unmatched thermal purity.',
    contentParagraphs: [
      'High in the Andes, alpaca fleeces exhibit over 22 natural shades ranging from icy ivory to rich obsidian black. By selecting fleeces directly by raw shade, we eliminate chemical dyeing entirely.',
      'The result is a knitwear collection that is gentler on sensitive skin, infinitely softer, and completely biodegradable at the end of its decades-long lifecycle.'
    ],
    featuredProductIds: ['prod-4', 'prod-7']
  }
];
