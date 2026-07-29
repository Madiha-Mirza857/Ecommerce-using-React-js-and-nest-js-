import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Compass } from 'lucide-react';

interface HeroBannerProps {
  onExploreClick: () => void;
  onStylistClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExploreClick, onStylistClick }) => {
  return (
    <section className="relative overflow-hidden bg-[#1a1a1a] text-[#fdfbf7] rounded-none md:rounded-2xl mx-0 md:mx-8 my-4 border editorial-border shadow-md">
      {/* Background Image Overlay with editorial contrast gradient */}
      <div className="absolute inset-0 z-0 opacity-35 mix-blend-luminosity bg-cover bg-center transition-transform duration-1000 scale-105 hover:scale-100"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop')`
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#1a1a1a] via-[#1a1a1a]/85 to-transparent" />

      {/* Content Layer */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 py-16 md:py-24 flex flex-col items-start justify-center">
        {/* Editorial Feature Badge */}
        <div className="inline-flex items-center gap-2 bg-[#8b4513]/30 border border-[#8b4513]/50 text-[#fdfbf7] px-3.5 py-1.5 rounded-none ui-mono font-bold mb-6 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#8b4513]" />
          <span>Feature Story — Vol. 26 / Ref. 012-A</span>
        </div>

        {/* Headline */}
        <h2 className="serif-display text-4xl sm:text-5xl md:text-7xl leading-[0.92] tracking-tight text-[#fdfbf7] max-w-3xl mb-8">
          The New <br />
          <span className="italic font-normal text-[#e5dcd3]">Minimalism</span>
        </h2>

        {/* Body Description */}
        <p className="text-[#d8d3c9] text-base md:text-lg max-w-xl font-normal leading-relaxed mb-8">
          Exploring the intersection of functional structure and pure emotion. Featuring double-breasted cashmere, raw alpaca knits, and zero-dye natural fibers crafted in Florence and London.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={onExploreClick}
            className="flex items-center gap-2 bg-[#8b4513] hover:bg-[#a65317] text-white font-semibold text-xs ui-mono px-7 py-4 transition-all duration-300 shadow-md hover:-translate-y-0.5 active:scale-95"
          >
            <span>Explore The Index</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onStylistClick}
            className="flex items-center gap-2 bg-[#fdfbf7]/10 hover:bg-[#fdfbf7]/20 border border-[#fdfbf7]/30 text-[#fdfbf7] font-medium text-xs ui-mono px-7 py-4 backdrop-blur-md transition-all duration-300 active:scale-95"
          >
            <Compass className="w-4 h-4 text-[#8b4513]" />
            <span>Consult AI Stylist</span>
          </button>
        </div>

        {/* Trust & Craft Indicators */}
        <div className="mt-12 pt-8 border-t border-[#fdfbf7]/15 grid grid-cols-2 sm:grid-cols-3 gap-6 ui-mono text-[#c5beb3] w-full max-w-2xl">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#8b4513]" />
            <span>Traceable Wool</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#8b4513] font-bold">•</span>
            <span>Atelier Hand-Crafted</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[#8b4513] font-bold">•</span>
            <span>Worldwide Courier</span>
          </div>
        </div>
      </div>
    </section>
  );
};
