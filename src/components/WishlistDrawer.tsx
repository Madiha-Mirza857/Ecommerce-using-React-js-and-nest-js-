import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product, color: string, size: string) => void;
  onClearWishlist: () => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveFromWishlist,
  onAddToCart,
  onClearWishlist
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#fdfbf7] shadow-2xl flex flex-col justify-between border-l border-[#1a1a1a]/20">
          {/* Header */}
          <div className="p-6 border-b border-[#1a1a1a]/15 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#8b4513] fill-current" />
              <h2 className="serif-display text-2xl font-bold text-[#1a1a1a]">
                Saved Pieces ({items.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white rounded-full transition-colors border border-[#1a1a1a]/15"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List of Wishlist items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 text-[#6c7a71] space-y-3">
                <Heart className="w-12 h-12 mx-auto stroke-1 text-[#8b4513]/40" />
                <p className="serif-display text-lg font-bold text-[#1a1a1a]">Your Wishlist is empty.</p>
                <p className="ui-mono text-xs">Tap the heart icon on any garment to curate your personal dream capsule.</p>
              </div>
            ) : (
              items.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 bg-[#f7f4ee] rounded-lg border border-[#1a1a1a]/15 items-center justify-between"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-16 h-20 object-cover rounded bg-[#f5f2eb]"
                  />

                  <div className="flex-1 overflow-hidden">
                    <h3 className="serif-display text-sm font-bold text-[#1a1a1a] line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-[#6c7a71] line-clamp-1">{product.subtitle}</p>
                    <p className="ui-mono text-xs font-bold text-[#8b4513] mt-1">${product.price}</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        onAddToCart(product, product.colors[0]?.name || '', product.sizes[0] || 'M');
                        onRemoveFromWishlist(product);
                      }}
                      className="p-2 bg-[#1a1a1a] hover:bg-[#8b4513] text-white rounded transition-colors shadow-2xs"
                      title="Move to Bag"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onRemoveFromWishlist(product)}
                      className="p-2 text-[#6c7a71] hover:text-[#ba1a1a] rounded hover:bg-[#f5f2eb]"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Clear & Close Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#1a1a1a]/15 bg-[#fdfbf7] flex justify-between gap-4">
              <button
                onClick={onClearWishlist}
                className="ui-mono text-xs text-[#ba1a1a] font-bold hover:underline"
              >
                Clear Wishlist
              </button>
              <button
                onClick={onClose}
                className="bg-[#1a1a1a] hover:bg-[#8b4513] text-white ui-mono text-xs font-bold px-6 py-3 rounded transition-colors"
              >
                Continue Browsing
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
