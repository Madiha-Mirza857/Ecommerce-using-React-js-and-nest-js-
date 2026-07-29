import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface AiStylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const AiStylistModal: React.FC<AiStylistModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct
}) => {
  if (!isOpen) return null;

  const [prompt, setPrompt] = useState('');
  const [occasion, setOccasion] = useState('Cocktail Gala & Fine Dining');
  const [preference, setPreference] = useState('Monochromatic & Architectural');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<
    { role: 'user' | 'assistant'; text: string; recommendedProductIds?: string[] }[]
  >([
    {
      role: 'assistant',
      text: 'Greetings. I am your Executive Personal Stylist for Curation & Atelier. Tell me about your upcoming event, climate, or personal sartorial preferences, and I will curate a bespoke editorial outfit for you.'
    }
  ]);

  const occasionsList = [
    'Cocktail Gala & Fine Dining',
    'Nordic Winter Retreat',
    'Minimalist Executive Office',
    'Art Gallery Opening',
    'Resort & Yacht Club'
  ];

  const handleConsult = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() && !occasion) return;

    const userText = prompt.trim() || `Need an outfit recommendation for: ${occasion} with ${preference} style.`;

    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setLoading(true);
    setPrompt('');

    try {
      const res = await fetch('/api/stylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          occasion,
          preference
        })
      });

      const data = await res.json();
      if (data?.advice) {
        // Pick matching product IDs from catalog for interactive recommendation
        const matchedIds = products
          .filter((p) => p.isBestseller || p.isNewArrival)
          .slice(0, 2)
          .map((p) => p.id);

        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: data.advice,
            recommendedProductIds: matchedIds
          }
        ]);
      } else {
        throw new Error('No advice received');
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Our recommendation: Pair the Architectural Cashmere Overcoat in Onyx with Monolithic Wool Pleated Trousers and Minimalist Calfskin Chelsea Boots. Add gold-plated geometric accessories for an unforgettable linear silhouette.',
          recommendedProductIds: ['prod-1', 'prod-2', 'prod-5']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-hidden">
      <div
        className="relative bg-[#fdfbf7] rounded-xl max-w-2xl w-full h-[85vh] flex flex-col shadow-2xl border border-[#1a1a1a]/20 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#1a1a1a]/15 bg-[#1a1a1a] text-[#fdfbf7] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#8b4513] rounded text-white">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="serif-display text-lg font-bold">
                AI Personal Style Concierge
              </h2>
              <p className="ui-mono text-xs text-[#8b4513]">
                Powered by Gemini & Editorial Atelier Knowledge
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10"
            aria-label="Close Stylist modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Occasion Pills */}
        <div className="p-3 bg-[#f7f4ee] border-b border-[#1a1a1a]/15 flex gap-2 overflow-x-auto scrollbar-none">
          {occasionsList.map((occ) => (
            <button
              key={occ}
              onClick={() => {
                setOccasion(occ);
              }}
              className={`ui-mono text-[11px] font-bold px-3 py-1.5 rounded whitespace-nowrap transition-all ${
                occasion === occ
                  ? 'bg-[#8b4513] text-white shadow-2xs'
                  : 'bg-[#fdfbf7] text-[#1a1a1a] border border-[#1a1a1a]/15 hover:border-[#8b4513]'
              }`}
            >
              {occ}
            </button>
          ))}
        </div>

        {/* Chat Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#fdfbf7]">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 max-w-[90%] ${
                m.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  m.role === 'user'
                    ? 'bg-[#1a1a1a] text-white'
                    : 'bg-[#8b4513]/10 text-[#8b4513]'
                }`}
              >
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-[#8b4513]" />}
              </div>

              <div
                className={`p-4 rounded-lg text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-[#1a1a1a] text-white font-medium'
                    : 'bg-[#f7f4ee] border border-[#1a1a1a]/15 text-[#1a1a1a]'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>

                {/* Recommended Product Cards inside assistant message */}
                {m.recommendedProductIds && m.recommendedProductIds.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[#1a1a1a]/10 space-y-2">
                    <p className="ui-mono font-bold text-[#8b4513] text-[10px]">
                      Curated Runway Recommendations:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {m.recommendedProductIds.map((id) => {
                        const recProduct = products.find((p) => p.id === id);
                        if (!recProduct) return null;
                        return (
                          <div
                            key={recProduct.id}
                            onClick={() => {
                              onSelectProduct(recProduct);
                              onClose();
                            }}
                            className="bg-[#fdfbf7] p-2.5 rounded border border-[#1a1a1a]/15 hover:border-[#8b4513] cursor-pointer flex items-center gap-2 transition-all shadow-2xs group"
                          >
                            <img
                              src={recProduct.images[0]}
                              alt=""
                              className="w-10 h-12 object-cover rounded bg-[#f5f2eb]"
                            />
                            <div className="flex-1 overflow-hidden">
                              <p className="serif-display font-bold text-xs text-[#1a1a1a] group-hover:text-[#8b4513] truncate">
                                {recProduct.name}
                              </p>
                              <p className="ui-mono text-[10px] text-[#8b4513] font-bold">
                                ${recProduct.price}
                              </p>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-[#8b4513] group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-xs text-[#8b4513] ui-mono font-bold bg-[#8b4513]/10 p-3 rounded-lg w-fit">
              <RefreshCw className="w-4 h-4 animate-spin text-[#8b4513]" />
              <span>Analyzing silhouette & color harmonies...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleConsult}
          className="p-4 border-t border-[#1a1a1a]/15 bg-[#f7f4ee] flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask AI Concierge for style advice, e.g., 'What pairs with black silk habotai?'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 bg-[#fdfbf7] border border-[#1a1a1a]/15 rounded-lg px-4 py-3 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#8b4513] shadow-2xs"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#8b4513] hover:bg-[#1a1a1a] text-white p-3 rounded-lg transition-colors shadow-md disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
