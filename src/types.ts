export type Category = string;

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  productCount?: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
  token?: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  category: Category;
  tags: string[];
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  description: string;
  details: string[];
  composition: string;
  careInstructions: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  sustainabilityBadge?: string;
  relatedProductIds?: string[];
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  image: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  address: string;
  city: string;
  country: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: string;
  giftWrap: boolean;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface LookbookLook {
  id: string;
  title: string;
  season: string;
  heroImage: string;
  description: string;
  hotspots: {
    x: number;
    y: number;
    productId: string;
    productName: string;
    price: number;
  }[];
}

export interface EditorialStory {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  readTime: string;
  date: string;
  coverImage: string;
  excerpt: string;
  contentParagraphs: string[];
  featuredProductIds: string[];
}

export interface StylistQuery {
  occasion: string;
  preference: string;
  notes: string;
}

export interface FilterState {
  category: Category;
  searchQuery: string;
  maxPrice: number;
  colorFilter: string | null;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
  onlyInStock: boolean;
  onlyNewArrivals: boolean;
}

