import React from 'react';
import { Heart, Eye, ShoppingBag, Star, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isInWishlist: boolean;
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isInWishlist,
  onToggleWishlist,
  onQuickView,
  onQuickAdd
}) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  return (
    <div
      className="group bg-[#fdfbf7] rounded-xl p-3 border border-[#1a1a1a]/15 hover:border-[#8b4513] shadow-2xs hover:shadow-sm transition-all duration-300 flex flex-col justify-between"
      onMouseEnter={() => {
        if (product.images.length > 1) setCurrentImageIndex(1);
      }}
      onMouseLeave={() => {
        setCurrentImageIndex(0);
      }}
    >
      {/* Image Container with 4:5 aspect ratio */}
      <div className="relative aspect-[4/5] bg-[#f5f2eb] rounded-lg overflow-hidden mb-3 border border-[#1a1a1a]/10">
        <img
          src={product.images[currentImageIndex] || product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.isNewArrival && (
            <span className="bg-[#1a1a1a] text-[#fdfbf7] ui-mono font-bold px-2 py-0.5 shadow-2xs">
              New
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-[#8b4513] text-white ui-mono font-bold px-2 py-0.5 shadow-2xs">
              Essential
            </span>
          )}
          {product.sustainabilityBadge && (
            <span className="hidden sm:inline-flex bg-[#fdfbf7]/90 text-[#8b4513] ui-mono px-2 py-0.5 border border-[#1a1a1a]/20">
              {product.sustainabilityBadge}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full transition-all duration-200 ${
            isInWishlist
              ? 'bg-[#8b4513] text-white shadow-md'
              : 'bg-[#fdfbf7]/80 hover:bg-[#fdfbf7] text-[#1a1a1a] hover:text-[#8b4513]'
          }`}
          aria-label="Wishlist toggle"
        >
          <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Action Overlay (Hover state) */}
        <div className="absolute inset-x-2 bottom-2 z-10 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => onQuickView(product)}
            className="flex-1 bg-[#fdfbf7]/95 hover:bg-[#fdfbf7] text-[#1a1a1a] font-bold ui-mono py-2 px-3 border border-[#1a1a1a]/20 shadow-md transition-all flex items-center justify-center gap-1.5 hover:text-[#8b4513]"
          >
            <Eye className="w-3.5 h-3.5 text-[#8b4513]" />
            <span>Quick View</span>
          </button>

          <button
            onClick={() => onQuickAdd(product)}
            className="bg-[#1a1a1a] hover:bg-[#8b4513] text-white p-2 border border-[#1a1a1a] shadow-md transition-colors"
            title="Quick Add to Bag"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Content */}
      <div className="flex-1 flex flex-col justify-between px-1">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between ui-mono text-[#8b4513] font-bold mb-1">
            <span>{product.category}</span>
            <div className="flex items-center gap-1 text-[#1a1a1a]">
              <Star className="w-3 h-3 fill-[#8b4513] text-[#8b4513]" />
              <span className="font-bold text-[10px]">{product.rating}</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="serif-display text-lg font-bold text-[#1a1a1a] hover:text-[#8b4513] transition-colors cursor-pointer line-clamp-1 mb-1"
          >
            {product.name}
          </h3>

          {/* Subtitle */}
          <p className="text-xs text-[#5a5853] line-clamp-1 mb-2 font-normal">
            {product.subtitle}
          </p>
        </div>

        {/* Footer: Color Swatches + Price */}
        <div className="pt-2 border-t border-[#1a1a1a]/10 flex items-center justify-between">
          {/* Color Dots */}
          <div className="flex items-center gap-1.5">
            {product.colors.slice(0, 3).map((color, idx) => (
              <span
                key={idx}
                className="w-3 h-3 rounded-full border border-black/20 shadow-2xs"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="ui-mono text-[#5a5853]">
                +{product.colors.length - 3}
              </span>
            )}
          </div>

          {/* Price */}
          <div className="text-right">
            {product.originalPrice && (
              <span className="text-xs text-[#5a5853] line-through mr-1.5">
                ${product.originalPrice}
              </span>
            )}
            <span className="text-sm font-bold text-[#1a1a1a] font-mono">
              ${product.price}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
