import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Tag, Check } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, color: string, size: string, delta: number) => void;
  onRemoveItem: (productId: string, color: string, size: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 250;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = subtotal - discountAmount;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'LUXE10') {
      setDiscountPercent(10);
      setPromoApplied(true);
    } else if (promoCode.trim().toUpperCase() === 'ATELIER20') {
      setDiscountPercent(20);
      setPromoApplied(true);
    } else {
      alert('Invalid promo code. Try "LUXE10" for 10% off!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#fdfbf7] shadow-2xl flex flex-col justify-between border-l border-[#1a1a1a]/20">
          {/* Header */}
          <div className="p-6 border-b border-[#1a1a1a]/15 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#8b4513]" />
              <h2 className="serif-display text-2xl font-bold text-[#1a1a1a]">
                Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white rounded-full transition-colors border border-[#1a1a1a]/15"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-[#f7f4ee] px-6 py-3 border-b border-[#1a1a1a]/15">
            <div className="flex justify-between text-xs ui-mono font-bold text-[#1a1a1a] mb-1.5">
              <span>
                {amountNeededForFreeShipping === 0
                  ? '🎉 Complimentary Courier Unlocked!'
                  : `Add $${amountNeededForFreeShipping.toFixed(0)} for Free Shipping`}
              </span>
              <span className="text-[#8b4513]">{progressToFreeShipping.toFixed(0)}%</span>
            </div>
            <div className="w-full h-2 bg-[#1a1a1a]/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#8b4513] transition-all duration-500 rounded-full"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 text-[#6c7a71] space-y-3">
                <ShoppingBag className="w-12 h-12 mx-auto stroke-1 text-[#8b4513]/50" />
                <p className="serif-display text-lg font-bold text-[#1a1a1a]">Your bag is empty.</p>
                <p className="ui-mono text-xs">Explore our Vol. 26 Index to discover timeless garments.</p>
              </div>
            ) : (
              items.map((item, index) => (
                <div
                  key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}-${index}`}
                  className="flex gap-4 p-3 bg-[#f7f4ee] rounded-lg border border-[#1a1a1a]/15"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover rounded bg-[#f5f2eb]"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="serif-display text-sm font-bold text-[#1a1a1a] line-clamp-1">
                          {item.product.name}
                        </h3>
                        <button
                          onClick={() => onRemoveItem(item.product.id, item.selectedColor, item.selectedSize)}
                          className="text-[#6c7a71] hover:text-[#ba1a1a] p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="ui-mono text-[11px] text-[#6c7a71] mt-1 space-y-0.5">
                        <p>Color: <span className="font-bold text-[#1a1a1a]">{item.selectedColor}</span></p>
                        <p>Size: <span className="font-bold text-[#1a1a1a]">{item.selectedSize}</span></p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1a1a1a]/10">
                      <div className="flex items-center border border-[#1a1a1a]/20 bg-[#fdfbf7] rounded overflow-hidden">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.selectedColor, item.selectedSize, -1)}
                          className="p-1 hover:bg-[#1a1a1a] hover:text-white transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold ui-mono text-[#1a1a1a]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.selectedColor, item.selectedSize, 1)}
                          className="p-1 hover:bg-[#1a1a1a] hover:text-white transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="ui-mono text-xs font-bold text-[#8b4513]">
                        ${(item.product.price * item.quantity).toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#1a1a1a]/15 bg-[#fdfbf7] space-y-4">
              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8b4513]" />
                  <input
                    type="text"
                    placeholder="Promo Code (LUXE10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-[#f7f4ee] border border-[#1a1a1a]/15 rounded text-xs ui-mono font-bold text-[#1a1a1a] focus:outline-none focus:border-[#8b4513]"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#1a1a1a] hover:bg-[#8b4513] text-white px-4 py-2 rounded ui-mono text-xs font-bold transition-colors"
                >
                  Apply
                </button>
              </form>

              {promoApplied && (
                <div className="flex items-center justify-between text-xs text-[#8b4513] bg-[#8b4513]/10 px-3 py-1.5 rounded ui-mono font-bold">
                  <span>Code Applied ({discountPercent}% Off)</span>
                  <span>-${discountAmount.toFixed(0)}</span>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#5a5853] ui-mono">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#1a1a1a]">${subtotal.toFixed(0)}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-[#8b4513]">
                    <span>Atelier Discount</span>
                    <span>-${discountAmount.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Courier Shipping</span>
                  <span className="font-bold text-[#8b4513]">
                    {amountNeededForFreeShipping === 0 ? 'FREE' : '$25'}
                  </span>
                </div>
                <hr className="border-[#1a1a1a]/10 my-2" />
                <div className="flex justify-between text-sm font-bold text-[#1a1a1a]">
                  <span>Total</span>
                  <span className="text-[#8b4513]">${finalTotal.toFixed(0)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full bg-[#8b4513] hover:bg-[#1a1a1a] text-white py-4 rounded-lg ui-mono font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#6c7a71] ui-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8b4513]" />
                <span>256-Bit Encrypted Secure Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
