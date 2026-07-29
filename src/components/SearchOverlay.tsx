import React, { useState } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');

  const popularTags = ['Cashmere Overcoat', 'Silk Habotai', 'Chelsea Boots', 'Alpaca Knit', 'Trenchcoat'];

  const filtered = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-[#fdfbf7]/98 backdrop-blur-md animate-in fade-in duration-200 flex flex-col">
      {/* Search Header */}
      <div className="max-w-[1280px] mx-auto w-full px-6 py-6 border-b border-[#1a1a1a]/15 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-2xl">
          <Search className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-[#8b4513]" />
          <input
            type="text"
            autoFocus
            placeholder="Search Vol. 26 Index (e.g. Cashmere, Boots, Silk...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-14 pr-10 py-4 bg-[#f7f4ee] border border-[#1a1a1a]/15 rounded text-base text-[#1a1a1a] placeholder-[#5a5853] focus:outline-none focus:border-[#8b4513] shadow-2xs serif-display"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6c7a71] hover:text-[#1a1a1a]"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="p-3 text-[#1a1a1a] hover:text-[#8b4513] rounded-full hover:bg-[#1a1a1a]/5 transition-colors border border-[#1a1a1a]/15"
          aria-label="Close search"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Popular Suggestions or Live Results */}
      <div className="max-w-[1280px] mx-auto w-full px-6 py-8 flex-1 overflow-y-auto">
        {!query.trim() ? (
          <div className="space-y-6">
            <div>
              <p className="ui-mono text-xs font-bold text-[#8b4513] mb-3">
                Trending Search Index
              </p>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="bg-[#f7f4ee] hover:bg-[#8b4513] text-[#1a1a1a] hover:text-white px-4 py-2 rounded ui-mono text-xs font-bold border border-[#1a1a1a]/15 transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="ui-mono text-xs font-bold text-[#8b4513] mb-3">
                Curated New Arrivals
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {products.filter((p) => p.isNewArrival).slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectProduct(p);
                      onClose();
                    }}
                    className="bg-[#f7f4ee] p-3 rounded-lg border border-[#1a1a1a]/15 hover:border-[#8b4513] cursor-pointer transition-all flex items-center gap-3 group shadow-2xs"
                  >
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-12 h-16 object-cover rounded bg-[#f5f2eb]"
                    />
                    <div>
                      <p className="serif-display text-sm font-bold text-[#1a1a1a] group-hover:text-[#8b4513] line-clamp-1">
                        {p.name}
                      </p>
                      <p className="ui-mono text-xs text-[#8b4513] font-bold">${p.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p className="ui-mono text-xs font-bold text-[#8b4513] mb-4">
              Found {filtered.length} Matching Garments:
            </p>

            {filtered.length === 0 ? (
              <p className="ui-mono text-sm text-[#5a5853] py-8">
                No garments found matching &quot;{query}&quot;. Try terms like cashmere, silk, or boots.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filtered.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectProduct(p);
                      onClose();
                    }}
                    className="bg-[#f7f4ee] p-3 rounded-lg border border-[#1a1a1a]/15 hover:border-[#8b4513] cursor-pointer transition-all flex items-center gap-3 group shadow-2xs"
                  >
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-14 h-18 object-cover rounded bg-[#f5f2eb]"
                    />
                    <div className="flex-1 overflow-hidden">
                      <p className="serif-display text-sm font-bold text-[#1a1a1a] group-hover:text-[#8b4513] truncate">
                        {p.name}
                      </p>
                      <p className="ui-mono text-[11px] text-[#5a5853] truncate">{p.category}</p>
                      <p className="ui-mono text-xs font-bold text-[#8b4513] mt-0.5">${p.price}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#8b4513] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
