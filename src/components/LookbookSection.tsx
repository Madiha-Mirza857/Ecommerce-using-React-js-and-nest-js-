import React, { useState } from 'react';
import { MOCK_LOOKBOOK, MOCK_PRODUCTS } from '../data/mockProducts';
import { Product } from '../types';
import { Sparkles, ShoppingBag, Eye, ArrowRight, Layers } from 'lucide-react';

interface LookbookSectionProps {
  onQuickViewProduct: (product: Product) => void;
  onAddToCart: (product: Product, color: string, size: string) => void;
}

export const LookbookSection: React.FC<LookbookSectionProps> = ({
  onQuickViewProduct,
  onAddToCart
}) => {
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const activeLook = MOCK_LOOKBOOK[activeLookIndex];

  return (
    <section className="max-w-[1280px] mx-auto px-4 md:px-8 py-12 my-8 bg-[#fdfbf7]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#1a1a1a]/15">
        <div>
          <div className="ui-mono text-[#8b4513] mb-1 font-bold flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-[#8b4513]" />
            <span>Interactive Editorial Lookbook</span>
          </div>
          <h2 className="serif-display text-3xl md:text-5xl font-bold tracking-tight text-[#1a1a1a]">
            Shop The Runway — Vol. 26
          </h2>
        </div>

        {/* Look switcher tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {MOCK_LOOKBOOK.map((look, idx) => (
            <button
              key={look.id}
              onClick={() => setActiveLookIndex(idx)}
              className={`px-4 py-2 rounded-lg ui-mono font-bold whitespace-nowrap transition-all ${
                activeLookIndex === idx
                  ? 'bg-[#8b4513] text-white shadow-xs'
                  : 'bg-[#f7f4ee] text-[#1a1a1a] hover:bg-[#eae6dd] border border-[#1a1a1a]/15'
              }`}
            >
              Look 0{idx + 1}: {look.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-[#f7f4ee] rounded-xl p-6 md:p-8 border border-[#1a1a1a]/15">
        {/* Left: Interactive Canvas with Hotspots (8 cols) */}
        <div className="lg:col-span-7 relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/5] rounded-lg overflow-hidden shadow-sm bg-[#1a1a1a] border border-[#1a1a1a]/20">
          <img
            src={activeLook.heroImage}
            alt={activeLook.title}
            className="w-full h-full object-cover object-center"
          />

          {/* Hotspots */}
          {activeLook.hotspots.map((spot, idx) => {
            const product = MOCK_PRODUCTS.find(p => p.id === spot.productId);
            return (
              <div
                key={idx}
                className="absolute z-20 group"
                style={{ top: `${spot.y}%`, left: `${spot.x}%` }}
              >
                {/* Pulsing Hotspot Marker */}
                <button
                  onClick={() => product && onQuickViewProduct(product)}
                  className="relative w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8b4513] text-white flex items-center justify-center font-bold text-xs shadow-lg hover:scale-125 transition-transform"
                >
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8b4513] opacity-75" />
                  +
                </button>

                {/* Hotspot Hover Card Tooltip */}
                {product && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-10 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto bg-[#fdfbf7] p-3 rounded-lg shadow-xl border border-[#1a1a1a]/20 w-52 text-left z-30">
                    <img src={product.images[0]} alt="" className="w-full h-24 object-cover rounded mb-2" />
                    <p className="serif-display text-sm font-bold text-[#1a1a1a] line-clamp-1">{product.name}</p>
                    <p className="ui-mono text-[#8b4513] font-bold">${product.price}</p>
                    <button
                      onClick={() => onQuickViewProduct(product)}
                      className="mt-2 w-full text-center bg-[#1a1a1a] hover:bg-[#8b4513] text-white ui-mono py-1.5 rounded transition-colors flex items-center justify-center gap-1"
                    >
                      <span>View Specs</span>
                      <Eye className="w-3 h-3 text-[#8b4513]" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Outfit Breakdown & Direct Cart Adding (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <span className="ui-mono text-[#8b4513] font-bold">
              {activeLook.season} — Editorial Look 0{activeLookIndex + 1}
            </span>
            <h3 className="serif-display text-3xl font-bold text-[#1a1a1a] mt-1 mb-3">
              {activeLook.title}
            </h3>
            <p className="text-sm text-[#5a5853] leading-relaxed mb-6 font-normal">
              {activeLook.description}
            </p>

            <h4 className="ui-mono text-[#1a1a1a] font-bold mb-3">
              Featured Runway Garments ({activeLook.hotspots.length}):
            </h4>

            {/* List of items in look */}
            <div className="space-y-3">
              {activeLook.hotspots.map((spot, idx) => {
                const product = MOCK_PRODUCTS.find(p => p.id === spot.productId);
                if (!product) return null;

                return (
                  <div
                    key={idx}
                    className="bg-[#fdfbf7] p-3.5 rounded-lg border border-[#1a1a1a]/15 hover:border-[#8b4513] transition-all flex items-center justify-between gap-3 shadow-2xs group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-14 object-cover rounded bg-[#f5f2eb]"
                      />
                      <div>
                        <p className="serif-display text-sm font-bold text-[#1a1a1a] group-hover:text-[#8b4513] transition-colors line-clamp-1">
                          {product.name}
                        </p>
                        <p className="ui-mono text-[#8b4513] font-bold">${product.price}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onQuickViewProduct(product)}
                        className="p-2 text-[#1a1a1a] hover:text-[#8b4513] hover:bg-[#f5f2eb] rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onAddToCart(product, product.colors[0]?.name || '', product.sizes[0] || 'M')}
                        className="bg-[#1a1a1a] hover:bg-[#8b4513] text-white p-2 rounded transition-colors shadow-2xs"
                        title="Add to Bag"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#1a1a1a]/15">
            <p className="ui-mono text-[#6c7a71]">
              * Click any hotspot on the model image above to inspect individual hand-crafted pieces.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
