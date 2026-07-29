import React, { useState, useEffect, useMemo } from 'react';
import { MOCK_PRODUCTS, MOCK_STORIES } from './data/mockProducts';
import { Product, Category, CartItem, FilterState, EditorialStory, CategoryItem, User, Order } from './types';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { LookbookSection } from './components/LookbookSection';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AiStylistModal } from './components/AiStylistModal';
import { EditorialStoryModal } from './components/EditorialStoryModal';
import { CheckoutModal } from './components/CheckoutModal';
import { SearchOverlay } from './components/SearchOverlay';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { CustomerOrdersModal } from './components/CustomerOrdersModal';
import { Footer } from './components/Footer';
import { SlidersHorizontal, ArrowUpDown, RotateCcw, Shield } from 'lucide-react';

export default function App() {
  // Navigation & Category state
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [productsList, setProductsList] = useState<Product[]>(MOCK_PRODUCTS);
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>([]);
  const [ordersList, setOrdersList] = useState<Order[]>([]);

  // User Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('atelier_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    searchQuery: '',
    maxPrice: 2500,
    colorFilter: null,
    sortBy: 'featured',
    onlyInStock: false,
    onlyNewArrivals: false,
  });

  // Shopping Bag & Wishlist state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);

  // Modal / Overlay Open states
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [stylistOpen, setStylistOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [customerOrdersOpen, setCustomerOrdersOpen] = useState(false);

  // Auth Modal Context
  const [authRequiredRole, setAuthRequiredRole] = useState<'admin' | 'customer' | null>(null);
  const [authPromptMessage, setAuthPromptMessage] = useState<string | null>(null);
  const [pendingCheckout, setPendingCheckout] = useState(false);

  // Selected Detail Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedStory, setSelectedStory] = useState<EditorialStory | null>(null);

  // Fetch live products & categories on load
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchOrders();

    // Check if user navigated to /admin or ?admin=true
    const path = window.location.pathname.toLowerCase();
    const search = window.location.search.toLowerCase();
    const hash = window.location.hash.toLowerCase();

    if (path.includes('/admin') || search.includes('admin') || hash.includes('admin')) {
      if (currentUser && currentUser.role === 'admin') {
        setAdminOpen(true);
      } else {
        setAuthRequiredRole('admin');
        setAuthPromptMessage('Admin Portal Access: Enter email & password (admin@atelier.com / admin123) to access Admin Dashboard.');
        setAuthModalOpen(true);
      }
    }
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrdersList(data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setProductsList(data);
          // Prepopulate cart with first real item
          if (cartItems.length === 0 && data[0]) {
            setCartItems([
              {
                product: data[0],
                selectedColor: data[0].colors[0]?.name || 'Default',
                selectedSize: data[0].sizes[0] || 'M',
                quantity: 1,
              },
            ]);
            setWishlistProducts([data[1] || data[0]]);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching live products:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategoriesList(data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleOpenAdmin = () => {
    if (currentUser && currentUser.role === 'admin') {
      setAdminOpen(true);
    } else {
      setAuthRequiredRole('admin');
      setAuthPromptMessage('Admin Access Required: Enter email & password (admin@atelier.com / admin123) to access Admin Dashboard.');
      setAuthModalOpen(true);
    }
  };

  const handleOpenAuth = () => {
    setAuthRequiredRole('customer');
    setAuthPromptMessage(null);
    setAuthModalOpen(true);
  };

  const handleProceedToCheckout = () => {
    setCartOpen(false);
    if (currentUser) {
      setCheckoutOpen(true);
    } else {
      setPendingCheckout(true);
      setAuthRequiredRole('customer');
      setAuthPromptMessage('Customer Login Required: Sign in or create an account before proceeding to payment.');
      setAuthModalOpen(true);
    }
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('atelier_user', JSON.stringify(user));
    setAuthModalOpen(false);
    setAuthRequiredRole(null);
    setAuthPromptMessage(null);

    if (user.role === 'admin') {
      setAdminOpen(true);
    } else if (pendingCheckout) {
      setPendingCheckout(false);
      setCheckoutOpen(true);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('atelier_user');
    setAdminOpen(false);
    setCustomerOrdersOpen(false);
  };

  // Handle Category selection
  const handleSelectCategory = (cat: Category) => {
    setActiveCategory(cat);
    setFilters((prev) => ({ ...prev, category: cat }));
  };

  // Add to Bag handler
  const handleAddToCart = (product: Product, color: string, size: string) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === color &&
          item.selectedSize === size
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [
        ...prev,
        {
          product,
          selectedColor: color || product.colors[0]?.name || 'Default',
          selectedSize: size || product.sizes[0] || 'M',
          quantity: 1,
        },
      ];
    });
  };

  // Update quantity in bag
  const handleUpdateQuantity = (productId: string, color: string, size: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (
            item.product.id === productId &&
            item.selectedColor === color &&
            item.selectedSize === size
          ) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Remove item from bag
  const handleRemoveFromCart = (productId: string, color: string, size: string) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedColor === color &&
            item.selectedSize === size
          )
      )
    );
  };

  // Toggle Wishlist
  const handleToggleWishlist = (product: Product) => {
    setWishlistProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  // Filtered & Sorted Products calculation
  const filteredProducts = useMemo(() => {
    return productsList
      .filter((product) => {
        if (filters.category !== 'All' && product.category !== filters.category) {
          return false;
        }
        if (product.price > filters.maxPrice) {
          return false;
        }
        if (filters.colorFilter && !product.colors.some((c) => c.name === filters.colorFilter)) {
          return false;
        }
        if (filters.onlyNewArrivals && !product.isNewArrival) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-low') return a.price - b.price;
        if (filters.sortBy === 'price-high') return b.price - a.price;
        if (filters.sortBy === 'rating') return b.rating - a.rating;
        if (filters.sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        return 0;
      });
  }, [productsList, filters]);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#1a1a1a] flex flex-col font-sans selection:bg-[#8b4513] selection:text-white">
      {/* Sticky Header */}
      <Header
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        categoriesList={categoriesList}
        cartCount={totalCartCount}
        wishlistCount={wishlistProducts.length}
        currentUser={currentUser}
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenStylist={() => setStylistOpen(true)}
        onOpenLookbook={() => {
          const lookbookElem = document.getElementById('lookbook-section');
          lookbookElem?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenAuth={handleOpenAuth}
        onOpenAdmin={handleOpenAdmin}
        onOpenCustomerOrders={() => setCustomerOrdersOpen(true)}
        onLogout={handleLogout}
      />

      {/* Hero Editorial Campaign Banner */}
      <HeroBanner
        onExploreClick={() => {
          const catalogElem = document.getElementById('catalog-section');
          catalogElem?.scrollIntoView({ behavior: 'smooth' });
        }}
        onStylistClick={() => setStylistOpen(true)}
      />

      {/* Main Catalog & Filter Section */}
      <main id="catalog-section" className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 flex-1 w-full">
        {/* Section Title & Filter Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#1a1a1a]/15">
          <div>
            <div className="ui-mono text-[#8b4513] mb-1 font-bold">The Index</div>
            <h2 className="serif-display text-3xl md:text-5xl font-bold tracking-tight text-[#1a1a1a]">
              {filters.category === 'All' ? 'Curated Collection' : filters.category}
            </h2>
            <p className="ui-mono text-[#6c7a71] mt-1">
              Ref. Index — Showing {filteredProducts.length} Atelier Pieces
            </p>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Price Slider */}
            <div className="flex items-center gap-2 bg-[#f7f4ee] border border-[#1a1a1a]/15 px-3.5 py-2 rounded-lg">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#8b4513]" />
              <span className="ui-mono font-bold text-[#1a1a1a]">Max: ${filters.maxPrice}</span>
              <input
                type="range"
                min="300"
                max="2500"
                step="50"
                value={filters.maxPrice}
                onChange={(e) => setFilters((p) => ({ ...p, maxPrice: Number(e.target.value) }))}
                className="w-20 accent-[#8b4513] cursor-pointer"
              />
            </div>

            {/* New Arrivals Toggle Pill */}
            <button
              onClick={() => setFilters((p) => ({ ...p, onlyNewArrivals: !p.onlyNewArrivals }))}
              className={`px-3.5 py-2 rounded-lg ui-mono font-bold border transition-all ${
                filters.onlyNewArrivals
                  ? 'bg-[#8b4513] text-white border-[#8b4513] shadow-2xs'
                  : 'bg-[#f7f4ee] text-[#1a1a1a] border-[#1a1a1a]/15 hover:border-[#8b4513]'
              }`}
            >
              New Arrivals
            </button>

            {/* Reset Filters */}
            {(filters.category !== 'All' || filters.maxPrice < 2500 || filters.onlyNewArrivals || filters.colorFilter) && (
              <button
                onClick={() =>
                  setFilters({
                    category: 'All',
                    searchQuery: '',
                    maxPrice: 2500,
                    colorFilter: null,
                    sortBy: 'featured',
                    onlyInStock: false,
                    onlyNewArrivals: false,
                  })
                }
                className="p-2 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-lg transition-colors"
                title="Reset Filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            {/* Sort Select */}
            <div className="flex items-center gap-1.5 bg-[#f7f4ee] border border-[#1a1a1a]/15 px-3 py-2 rounded-lg">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#8b4513]" />
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters((p) => ({ ...p, sortBy: e.target.value as any }))}
                className="bg-transparent ui-mono font-bold text-[#1a1a1a] focus:outline-none cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#f7f4ee] rounded-xl border border-[#1a1a1a]/15 space-y-3">
            <p className="serif-display text-xl font-bold text-[#1a1a1a]">
              No garments found matching current criteria.
            </p>
            <p className="ui-mono text-[#6c7a71]">Adjust your filters to view pieces in the Vol. 26 Index.</p>
            <button
              onClick={() => handleSelectCategory('All')}
              className="bg-[#8b4513] text-white ui-mono font-bold px-6 py-3 rounded-lg hover:bg-[#1a1a1a] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isInWishlist={wishlistProducts.some((p) => p.id === product.id)}
                onToggleWishlist={handleToggleWishlist}
                onQuickView={(p) => setSelectedProduct(p)}
                onQuickAdd={(p) => handleAddToCart(p, p.colors[0]?.name || '', p.sizes[0] || 'M')}
              />
            ))}
          </div>
        )}
      </main>

      {/* Interactive Lookbook Section */}
      <div id="lookbook-section">
        <LookbookSection
          onQuickViewProduct={(p) => setSelectedProduct(p)}
          onAddToCart={handleAddToCart}
        />
      </div>

      {/* Editorial Journal Stories */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-8 my-16 w-full">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#1a1a1a]/15">
          <div>
            <div className="ui-mono text-[#8b4513] mb-1 font-bold">
              <span>Vol. 26 Editorial / Issue 08</span>
            </div>
            <h2 className="serif-display text-3xl md:text-5xl font-bold tracking-tight text-[#1a1a1a]">
              Craft & Origin Stories
            </h2>
          </div>
        </div>

        {/* Stories Grid + Quote Banner */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_STORIES.map((story) => (
              <div
                key={story.id}
                onClick={() => setSelectedStory(story)}
                className="group bg-[#f7f4ee] rounded-xl p-6 border border-[#1a1a1a]/15 hover:border-[#8b4513] cursor-pointer transition-all duration-300 shadow-2xs hover:shadow-sm flex flex-col justify-between"
              >
                <div className="aspect-[16/9] rounded-lg overflow-hidden mb-4 bg-[#1a1a1a] border border-[#1a1a1a]/10">
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between ui-mono text-[#8b4513] mb-2 font-bold">
                    <span>{story.author}</span>
                    <span>{story.readTime}</span>
                  </div>
                  <h3 className="serif-display text-2xl font-bold text-[#1a1a1a] group-hover:text-[#8b4513] transition-colors mb-2">
                    {story.title}
                  </h3>
                  <p className="text-xs text-[#5a5853] leading-relaxed line-clamp-2">
                    {story.excerpt}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1a1a1a]/10 flex items-center gap-2 ui-mono text-[#8b4513] font-bold">
                  <span>Read Editorial Feature</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            ))}
          </div>

          {/* Editorial Quote Box */}
          <div className="md:col-span-4 bg-[#8b4513] text-white p-8 rounded-xl flex flex-col justify-between border border-[#1a1a1a]/20 shadow-md">
            <div>
              <div className="ui-mono text-white/70 mb-6">Editorial Wisdom</div>
              <p className="serif-display italic text-3xl leading-snug mb-6 text-[#fdfbf7]">
                &quot;Design is not what it looks like and feels like. Design is how it works.&quot;
              </p>
            </div>
            <div className="pt-6 border-t border-white/20">
              <p className="ui-mono text-xs text-white/90">— Collected Wisdom / Vol. 26</p>
              <p className="text-xs text-white/70 mt-2 font-serif italic">
                A testament to pure architectural lines, zero-dye natural fibers, and enduring sartorial craftsmanship.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer onOpenAdmin={handleOpenAdmin} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        requiredRole={authRequiredRole}
        promptMessage={authPromptMessage}
      />

      {/* Admin Dashboard Drawer */}
      <AdminDashboard
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        products={productsList}
        categories={categoriesList}
        categoriesList={categoriesList}
        orders={ordersList}
        onRefreshData={() => {
          fetchProducts();
          fetchCategories();
          fetchOrders();
        }}
        onRefreshProducts={fetchProducts}
        onRefreshCategories={fetchCategories}
      />

      {/* Customer Orders Modal */}
      <CustomerOrdersModal
        isOpen={customerOrdersOpen}
        onClose={() => setCustomerOrdersOpen(false)}
        currentUser={currentUser}
      />

      {/* Modals & Overlays */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        isInWishlist={selectedProduct ? wishlistProducts.some((p) => p.id === selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        allProducts={productsList}
        onSelectRelatedProduct={(rel) => setSelectedProduct(rel)}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        items={wishlistProducts}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onClearWishlist={() => setWishlistProducts([])}
      />

      <AiStylistModal
        isOpen={stylistOpen}
        onClose={() => setStylistOpen(false)}
        products={productsList}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      <EditorialStoryModal
        story={selectedStory}
        onClose={() => setSelectedStory(null)}
        products={productsList}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cartItems}
        currentUser={currentUser}
        onOrderComplete={() => setCartItems([])}
        onOrderPlaced={() => fetchOrders()}
      />

      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        products={productsList}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />
    </div>
  );
}
