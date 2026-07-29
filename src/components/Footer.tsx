import React, { useState } from 'react';
import { Send, ShieldCheck, Heart, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#1a1a1a] text-[#fdfbf7] border-t border-[#1a1a1a]/20 mt-16 pt-16 pb-12 font-sans">
      <div className="max-w-[1280px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/15">
          {/* Brand & Newsletter (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <h3 className="serif-display text-3xl font-bold italic tracking-tight text-[#fdfbf7]">
              Curation <span className="text-[#8b4513] font-normal">&</span> Atelier
            </h3>
            <p className="text-xs text-[#d8d3c9] leading-relaxed max-w-sm">
              An architectural fashion publication and boutique house dedicated to pure lines, Grade-A cashmere, and zero-dye natural fibers. Tailored with Italian precision in Florence and London.
            </p>

            {/* Newsletter Form */}
            <div className="pt-2">
              <p className="ui-mono text-[#8b4513] mb-2 font-bold">
                Join The Private Gazette:
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs text-[#fdfbf7] bg-[#8b4513]/20 p-3 rounded border border-[#8b4513]/40 ui-mono">
                  <CheckCircle2 className="w-4 h-4 text-[#8b4513]" />
                  <span>Welcome to the Editorial Atelier Circle.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    required
                    placeholder="Enter your VIP email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-white/10 border border-white/20 rounded px-3.5 py-2.5 text-xs text-[#fdfbf7] placeholder-white/50 focus:outline-none focus:border-[#8b4513]"
                  />
                  <button
                    type="submit"
                    className="bg-[#8b4513] hover:bg-[#a65317] text-white px-4 py-2.5 rounded ui-mono text-[10px] font-bold transition-colors flex items-center justify-center"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Ateliers & Boutiques (3 cols) */}
          <div className="md:col-span-3 space-y-3 text-xs text-[#d8d3c9]">
            <p className="ui-mono text-[#8b4513] font-bold mb-2">
              Global Ateliers
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#8b4513]" />
              <span>Florence — Via de&apos; Tornabuoni 14</span>
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#8b4513]" />
              <span>London — 42 Bond Street, Mayfair</span>
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#8b4513]" />
              <span>Milan — Via Montenapoleone 8</span>
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#8b4513]" />
              <span>Tokyo — Ginza Six Tower, Floor 4</span>
            </p>
          </div>

          {/* Client Care & Guarantees (4 cols) */}
          <div className="md:col-span-4 space-y-3 text-xs text-[#d8d3c9]">
            <p className="ui-mono text-[#8b4513] font-bold mb-2">
              Atelier Services
            </p>
            <ul className="space-y-2">
              <li>• Complimentary Custom Alteration Vouchers</li>
              <li>• Private Concierge & AI Style Consultations</li>
              <li>• Worldwide Express DHL/FedEx Courier Shipping</li>
              <li>• 30-Day Hassle-Free Returns & Garment Preservation</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#918c83] ui-mono gap-4">
          <p>© 2026 Curation & Atelier Ltd. Issue 26 — Vol. 08.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Sustainability Report</span>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hover:text-[#8b4513] text-white/50 cursor-pointer flex items-center gap-1 transition-colors"
                title="Atelier Admin & Management Login"
              >
                <span>Staff Portal</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
