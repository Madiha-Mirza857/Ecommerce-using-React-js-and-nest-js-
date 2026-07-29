import React from 'react';
import { ShoppingBag, Heart, Search, Sparkles, Menu, X, Shield, User as UserIcon, Package, LogOut } from 'lucide-react';
import { Category, CategoryItem, User } from '../types';

interface HeaderProps {
  activeCategory: Category;
  onSelectCategory: (cat: Category) => void;
  categoriesList: CategoryItem[];
  cartCount: number;
  wishlistCount: number;
  currentUser: User | null;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenStylist: () => void;
  onOpenLookbook: () => void;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  onOpenCustomerOrders: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  categoriesList,
  cartCount,
  wishlistCount,
  currentUser,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenStylist,
  onOpenLookbook,
  onOpenAuth,
  onOpenAdmin,
  onOpenCustomerOrders,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const categoryNames = ['All', ...categoriesList.map((c) => c.name)];

  return (
    <header className="sticky top-0 z-40 bg-[#fdfbf7]/95 backdrop-blur-md border-b border-[#1a1a1a]/15 transition-all duration-200">
      {/* Top Banner Notice - Auth & Store Status Bar */}
      <div className="bg-[#1a1a1a] text-[#fdfbf7] py-2 px-4 text-center ui-mono text-xs flex flex-wrap items-center justify-between max-w-[1280px] mx-auto gap-2">
        <span className="hidden sm:inline text-[#8b4513] font-bold">Vol. 26 / Atelier Full-Stack Platform</span>
        <span className="font-semibold tracking-wider">Complimentary Express Courier Shipping & Custom Fitting</span>

        {/* User Account Bar */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-white/90">
                {currentUser.name} ({currentUser.role.toUpperCase()})
              </span>
              {currentUser.role === 'admin' ? (
                <button
                  onClick={onOpenAdmin}
                  className="bg-[#8b4513] hover:bg-white hover:text-[#1a1a1a] text-white px-2.5 py-0.5 rounded text-[10px] font-bold transition-all flex items-center gap-1 shadow-2xs"
                >
                  <Shield className="w-3 h-3 text-amber-300" />
                  <span>Admin Panel</span>
                </button>
              ) : (
                <button
                  onClick={onOpenCustomerOrders}
                  className="bg-[#8b4513] hover:bg-white hover:text-[#1a1a1a] text-white px-2.5 py-0.5 rounded text-[10px] font-bold transition-all flex items-center gap-1"
                >
                  <Package className="w-3 h-3" />
                  <span>My Orders</span>
                </button>
              )}
              <button
                onClick={onLogout}
                className="text-white/70 hover:text-white p-1"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="bg-[#8b4513] hover:bg-white hover:text-[#1a1a1a] text-white px-2.5 py-0.5 rounded text-[10px] font-bold transition-all flex items-center gap-1"
            >
              <UserIcon className="w-3 h-3" />
              <span>Sign In / Account</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Left: Mobile Menu Trigger + Lookbook Link */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#1a1a1a] hover:text-[#8b4513] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <button
            onClick={onOpenLookbook}
            className="hidden lg:flex items-center gap-1.5 ui-mono text-[#1a1a1a] hover:text-[#8b4513] transition-colors font-bold"
          >
            <span>FW/26 Lookbook</span>
          </button>
        </div>

        {/* Center Logo */}
        <div className="text-center cursor-pointer group" onClick={() => onSelectCategory('All')}>
          <h1 className="text-3xl md:text-4xl serif-display italic font-bold tracking-tight text-[#1a1a1a]">
            Curation <span className="text-[#8b4513] font-normal">&</span> Atelier
          </h1>
          <p className="ui-mono text-[9px] text-[#8b4513] -mt-1 font-bold">
            Florence & London — Issue 26
          </p>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* AI Stylist Button */}
          <button
            onClick={onOpenStylist}
            className="flex items-center gap-2 bg-[#8b4513] hover:bg-[#1a1a1a] text-[#ffffff] px-3.5 md:px-4 py-2 rounded-lg transition-all duration-300 text-xs font-semibold whitespace-nowrap shadow-xs group"
            title="Launch AI Personal Stylist Concierge"
          >
            <Sparkles className="w-3.5 h-3.5 text-white/90 group-hover:text-white transition-colors" />
            <span className="hidden sm:inline ui-mono text-[10px] text-white">AI Concierge</span>
          </button>

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-2 text-[#1a1a1a] hover:text-[#8b4513] transition-colors rounded-lg hover:bg-[#f5f2eb]"
            aria-label="Search Collection"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist Trigger */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2 text-[#1a1a1a] hover:text-[#8b4513] transition-colors rounded-lg hover:bg-[#f5f2eb]"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#8b4513] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#8b4513] text-[#fdfbf7] px-3.5 py-2 rounded-lg transition-all duration-300 text-xs font-semibold"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden md:inline ui-mono text-[10px]">Bag</span>
            {cartCount > 0 && (
              <span className="bg-[#8b4513] md:bg-[#fdfbf7] text-white md:text-[#1a1a1a] font-bold text-[10px] rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Category Navigation Bar (Desktop) */}
      <nav className="hidden lg:block border-t border-[#1a1a1a]/10 bg-[#fdfbf7]">
        <div className="max-w-[1280px] mx-auto px-8 flex items-center justify-center gap-8 py-2.5 overflow-x-auto scrollbar-none">
          {categoryNames.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`ui-mono text-[10px] transition-all duration-200 relative py-1 whitespace-nowrap ${
                  isActive ? 'text-[#8b4513] font-bold border-b-2 border-[#8b4513]' : 'text-[#1a1a1a]/70 hover:text-[#1a1a1a]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#fdfbf7] border-b border-[#1a1a1a]/15 px-6 py-5 space-y-4">
          <div className="flex flex-col space-y-3">
            <span className="ui-mono text-[#8b4513] font-bold">Categories</span>
            {categoryNames.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory(cat);
                  setMobileMenuOpen(false);
                }}
                className={`text-left text-sm font-medium py-1.5 transition-colors ${
                  activeCategory === cat ? 'text-[#8b4513] font-bold pl-2 border-l-2 border-[#8b4513]' : 'text-[#1a1a1a]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-[#1a1a1a]/10 flex flex-col space-y-3 ui-mono text-[#1a1a1a]">
            <button
              onClick={() => {
                onOpenLookbook();
                setMobileMenuOpen(false);
              }}
              className="text-left hover:text-[#8b4513]"
            >
              Interactive FW/26 Lookbook
            </button>
            <button
              onClick={() => {
                onOpenStylist();
                setMobileMenuOpen(false);
              }}
              className="text-left text-[#8b4513] flex items-center gap-2 font-bold"
            >
              <Sparkles className="w-4 h-4" /> AI Personal Stylist
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
