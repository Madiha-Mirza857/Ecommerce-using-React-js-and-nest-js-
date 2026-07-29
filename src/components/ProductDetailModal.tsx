import React, { useState } from 'react';
import { X, Heart, ShoppingBag, ShieldCheck, Truck, RotateCcw, Star, Check, Sparkles, Ruler } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, color: string, size: string) => void;
  isInWishlist: boolean;
  onToggleWishlist: (product: Product) => void;
  allProducts: Product[];
  onSelectRelatedProduct: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isInWishlist,
  onToggleWishlist,
  allProducts,
  onSelectRelatedProduct
}) => {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const relatedProducts = allProducts.filter(p =>
    product.relatedProductIds?.includes(p.id) || (p.category === product.category && p.id !== product.id)
  ).slice(0, 3);

  const handleAdd = () => {
    onAddToCart(product, selectedColor, selectedSize);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative bg-[#fdfbf7] rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#1a1a1a]/20 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 bg-[#fdfbf7] hover:bg-[#1a1a1a] text-[#1a1a1a] hover:text-[#fdfbf7] rounded-full transition-colors border border-[#1a1a1a]/20"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10">
          {/* Left Column: Gallery */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative aspect-[4/5] bg-[#f5f2eb] rounded-lg overflow-hidden border border-[#1a1a1a]/10">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />

              {product.sustainabilityBadge && (
                <div className="absolute bottom-4 left-4 bg-[#fdfbf7]/95 px-3 py-1.5 rounded text-xs ui-mono text-[#8b4513] shadow-xs border border-[#1a1a1a]/20">
                  🌿 {product.sustainabilityBadge}
                </div>
              )}
            </div>

            {/* Thumbnail Row */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 aspect-square rounded overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-[#8b4513] scale-105 shadow-2xs'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Specs & Ordering */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category & Badge */}
              <div className="flex items-center justify-between ui-mono text-[#8b4513] font-bold mb-2">
                <span>{product.category}</span>
                <div className="flex items-center gap-1.5 text-[#1a1a1a]">
                  <Star className="w-4 h-4 fill-[#8b4513] text-[#8b4513]" />
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-[#6c7a71]">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="serif-display text-3xl md:text-4xl font-bold text-[#1a1a1a] tracking-tight mb-2">
                {product.name}
              </h2>

              {/* Subtitle */}
              <p className="text-sm text-[#5a5853] mb-4 font-normal">
                {product.subtitle}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="serif-display text-3xl font-bold text-[#1a1a1a]">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-[#6c7a71] line-through">
                    ${product.originalPrice}
                  </span>
                )}
                <span className="ui-mono text-xs text-[#8b4513] font-bold bg-[#8b4513]/10 px-2.5 py-1 rounded">
                  Tax included
                </span>
              </div>

              <hr className="border-[#1a1a1a]/10 my-6" />

              {/* Color Selection */}
              <div className="mb-6">
                <label className="block ui-mono text-xs text-[#1a1a1a] font-bold mb-2.5">
                  Color: <span className="text-[#8b4513]">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`relative w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                        selectedColor === color.name
                          ? 'border-[#8b4513] ring-2 ring-[#8b4513]/30 scale-110'
                          : 'border-black/20 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {selectedColor === color.name && (
                        <Check className="w-4 h-4 text-white drop-shadow-sm" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <label className="ui-mono text-xs text-[#1a1a1a] font-bold">
                    Size: <span className="text-[#8b4513]">{selectedSize}</span>
                  </label>
                  <button
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="ui-mono text-xs text-[#8b4513] hover:underline flex items-center gap-1 font-bold"
                  >
                    <Ruler className="w-3.5 h-3.5" /> Size Guide
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 text-xs font-bold ui-mono rounded border transition-all ${
                        selectedSize === size
                          ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-2xs'
                          : 'bg-[#f7f4ee] text-[#1a1a1a] border-[#1a1a1a]/15 hover:border-[#8b4513]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {/* Size Guide Info Overlay */}
                {showSizeGuide && (
                  <div className="mt-3 p-3 bg-[#f7f4ee] rounded border border-[#1a1a1a]/15 text-xs text-[#1a1a1a] space-y-1">
                    <p className="font-bold ui-mono">Tailored Fit Guide:</p>
                    <p>• XS: Chest 34-36&quot; | S: 36-38&quot; | M: 38-40&quot; | L: 40-42&quot; | XL: 42-44&quot;</p>
                    <p className="text-[#6c7a71]">Complimentary alteration voucher included with every outerwear purchase.</p>
                  </div>
                )}
              </div>

              {/* Description & Composition */}
              <div className="space-y-3 mb-8 text-xs text-[#5a5853]">
                <p className="leading-relaxed">{product.description}</p>
                <div className="bg-[#f7f4ee] p-3.5 rounded border border-[#1a1a1a]/15 space-y-1.5">
                  <p className="ui-mono font-bold text-[#1a1a1a]">Composition & Care:</p>
                  <p>• {product.composition}</p>
                  <p>• {product.careInstructions}</p>
                </div>
              </div>
            </div>

            {/* Actions & Buttons */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={handleAdd}
                  disabled={addedAnimation}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-lg ui-mono font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md ${
                    addedAnimation
                      ? 'bg-[#8b4513] text-white scale-105'
                      : 'bg-[#1a1a1a] hover:bg-[#8b4513] text-white hover:shadow-lg active:scale-95'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Added to Shopping Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>Add to Bag — ${product.price}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`p-4 rounded-lg border transition-colors ${
                    isInWishlist
                      ? 'bg-[#8b4513] border-[#8b4513] text-white'
                      : 'bg-[#f7f4ee] border-[#1a1a1a]/15 text-[#1a1a1a] hover:text-[#8b4513] hover:border-[#8b4513]'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Delivery Guarantees */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#1a1a1a]/10 text-[11px] text-[#6c7a71] ui-mono">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#8b4513]" />
                  <span>Complimentary Courier</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-[#8b4513]" />
                  <span>30-Day Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Style With / Complete Outfit Section */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-[#1a1a1a]/15 bg-[#f7f4ee] p-6 md:p-8 rounded-b-xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-[#8b4513]" />
              <h3 className="ui-mono text-xs font-bold text-[#1a1a1a]">
                Style With / Complete Outfit
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectRelatedProduct(rel)}
                  className="bg-[#fdfbf7] p-3 rounded-lg border border-[#1a1a1a]/15 hover:border-[#8b4513] cursor-pointer transition-all flex items-center gap-3 group shadow-2xs"
                >
                  <img src={rel.images[0]} alt={rel.name} className="w-14 h-16 object-cover rounded bg-[#f5f2eb]" />
                  <div className="flex-1 overflow-hidden">
                    <p className="serif-display text-sm font-bold text-[#1a1a1a] group-hover:text-[#8b4513] truncate">
                      {rel.name}
                    </p>
                    <p className="text-[11px] text-[#6c7a71] truncate">{rel.subtitle}</p>
                    <p className="ui-mono text-xs font-bold text-[#8b4513] mt-0.5">${rel.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
