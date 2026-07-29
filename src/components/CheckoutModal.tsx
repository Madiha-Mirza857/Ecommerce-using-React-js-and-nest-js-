import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, CreditCard, Lock, Truck, Gift, ArrowRight } from 'lucide-react';
import { CartItem, User } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currentUser?: User | null;
  onOrderComplete: () => void;
  onOrderPlaced?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currentUser,
  onOrderComplete,
  onOrderPlaced,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [giftWrap, setGiftWrap] = useState(true);

  // Form states initialized with currentUser if logged in
  const [formData, setFormData] = useState({
    fullName: currentUser?.name || 'Clara Vance',
    email: currentUser?.email || 'customer@atelier.com',
    address: '74 Mayfair Square, Belgravia',
    city: 'London',
    country: 'United Kingdom',
    postalCode: 'SW1X 8AZ',
    paymentMethod: 'card'
  });

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        fullName: currentUser.name || prev.fullName,
        email: currentUser.email || prev.email,
      }));
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  const handleSubmitStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.fullName,
          customerEmail: formData.email,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          items: items.map((i) => ({
            productId: i.product.id,
            productName: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
            color: i.selectedColor,
            size: i.selectedSize,
            image: i.product.images[0] || '',
          })),
          subtotal: subtotal,
          totalAmount: subtotal,
          giftWrap: giftWrap,
          paymentMethod: formData.paymentMethod,
        }),
      });
    } catch (err) {
      console.error('Error recording order:', err);
    }
    setStep(3);
    onOrderComplete();
    if (onOrderPlaced) {
      onOrderPlaced();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative bg-[#fdfbf7] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#1a1a1a]/20 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#1a1a1a]/15 flex items-center justify-between bg-[#1a1a1a] text-[#fdfbf7]">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#8b4513]" />
            <h2 className="serif-display text-lg font-bold">
              Atelier Checkout — {step === 1 ? 'Shipping' : step === 2 ? 'Payment' : 'Order Confirmed'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#fdfbf7]/70 hover:text-[#fdfbf7] rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step progress indicator */}
        <div className="px-6 py-3 bg-[#f7f4ee] border-b border-[#1a1a1a]/15 flex justify-between ui-mono text-xs font-bold text-[#5a5853]">
          <span className={step >= 1 ? 'text-[#8b4513] font-bold' : ''}>1. Shipping</span>
          <span>→</span>
          <span className={step >= 2 ? 'text-[#8b4513] font-bold' : ''}>2. Payment</span>
          <span>→</span>
          <span className={step === 3 ? 'text-[#8b4513] font-bold' : ''}>3. Confirmation</span>
        </div>

        {/* Step 1: Shipping Details */}
        {step === 1 && (
          <form onSubmit={handleSubmitStep1} className="p-6 md:p-8 space-y-4">
            <h3 className="serif-display text-base font-bold text-[#1a1a1a]">
              Shipping Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs ui-mono">
              <div>
                <label className="block text-[#5a5853] font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full p-3 bg-[#f7f4ee] border border-[#1a1a1a]/15 rounded text-[#1a1a1a] focus:border-[#8b4513] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#5a5853] font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 bg-[#f7f4ee] border border-[#1a1a1a]/15 rounded text-[#1a1a1a] focus:border-[#8b4513] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[#5a5853] font-bold mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-3 bg-[#f7f4ee] border border-[#1a1a1a]/15 rounded text-[#1a1a1a] focus:border-[#8b4513] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#5a5853] font-bold mb-1">City</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-3 bg-[#f7f4ee] border border-[#1a1a1a]/15 rounded text-[#1a1a1a] focus:border-[#8b4513] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#5a5853] font-bold mb-1">Country</label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full p-3 bg-[#f7f4ee] border border-[#1a1a1a]/15 rounded text-[#1a1a1a] focus:border-[#8b4513] focus:outline-none"
                />
              </div>
            </div>

            {/* Gift Wrap Toggle */}
            <div className="pt-2 flex items-center justify-between bg-[#f7f4ee] p-4 rounded border border-[#1a1a1a]/15">
              <div className="flex items-center gap-2 text-xs ui-mono">
                <Gift className="w-4 h-4 text-[#8b4513]" />
                <span className="font-bold text-[#1a1a1a]">
                  Complimentary Atelier Gift Box & Ribbon
                </span>
              </div>
              <input
                type="checkbox"
                checked={giftWrap}
                onChange={(e) => setGiftWrap(e.target.checked)}
                className="w-4 h-4 accent-[#8b4513]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#8b4513] hover:bg-[#1a1a1a] text-white py-4 rounded ui-mono font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Continue to Payment (${subtotal.toFixed(0)})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <form onSubmit={handlePay} className="p-6 md:p-8 space-y-4">
            <h3 className="serif-display text-base font-bold text-[#1a1a1a]">
              Payment Method
            </h3>

            <div className="space-y-3">
              {[
                { id: 'card', name: 'Credit / Debit Card (Visa, Mastercard, Amex)', icon: CreditCard },
                { id: 'apple', name: 'Apple Pay / Google Pay', icon: Lock },
                { id: 'klarna', name: 'Klarna Luxury Pay in 4', icon: ShieldCheck }
              ].map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center justify-between p-4 rounded border cursor-pointer transition-all ${
                    formData.paymentMethod === method.id
                      ? 'border-[#8b4513] bg-[#8b4513]/5 shadow-2xs font-bold'
                      : 'border-[#1a1a1a]/15 hover:bg-[#f7f4ee]'
                  }`}
                >
                  <div className="flex items-center gap-3 text-xs ui-mono text-[#1a1a1a]">
                    <method.icon className="w-4 h-4 text-[#8b4513]" />
                    <span>{method.name}</span>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={formData.paymentMethod === method.id}
                    onChange={() => setFormData({ ...formData, paymentMethod: method.id })}
                    className="accent-[#8b4513]"
                  />
                </label>
              ))}
            </div>

            {formData.paymentMethod === 'card' && (
              <div className="p-4 bg-[#f7f4ee] rounded border border-[#1a1a1a]/15 space-y-3 text-xs ui-mono">
                <div>
                  <label className="block text-[#5a5853] font-bold mb-1">Card Number</label>
                  <input
                    type="text"
                    placeholder="•••• •••• •••• 4242"
                    defaultValue="4242 •••• •••• 4242"
                    className="w-full p-2.5 bg-[#fdfbf7] border border-[#1a1a1a]/15 rounded text-[#1a1a1a]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[#5a5853] font-bold mb-1">Expires</label>
                    <input
                      type="text"
                      placeholder="12/28"
                      defaultValue="12/28"
                      className="w-full p-2.5 bg-[#fdfbf7] border border-[#1a1a1a]/15 rounded text-[#1a1a1a]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#5a5853] font-bold mb-1">CVC</label>
                    <input
                      type="text"
                      placeholder="888"
                      defaultValue="888"
                      className="w-full p-2.5 bg-[#fdfbf7] border border-[#1a1a1a]/15 rounded text-[#1a1a1a]"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#8b4513] hover:bg-[#1a1a1a] text-white py-4 rounded ui-mono font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Authorize Payment (${subtotal.toFixed(0)})</span>
              <ShieldCheck className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Step 3: Order Confirmation */}
        {step === 3 && (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-[#8b4513]/10 text-[#8b4513] rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="serif-display text-3xl font-bold text-[#1a1a1a] tracking-tight">
                Order Confirmed #LL-2026-9842
              </h3>
              <p className="ui-mono text-xs text-[#5a5853] mt-2">
                Thank you, {formData.fullName}. A confirmation receipt and courier tracking link have been dispatched to {formData.email}.
              </p>
            </div>

            <div className="bg-[#f7f4ee] p-4 rounded border border-[#1a1a1a]/15 text-xs ui-mono text-left space-y-2">
              <p className="font-bold text-[#1a1a1a] border-b border-[#1a1a1a]/10 pb-2">
                Order Details Summary
              </p>
              <p>• <span className="text-[#5a5853]">Delivery Address:</span> {formData.address}, {formData.city}, {formData.country}</p>
              <p>• <span className="text-[#5a5853]">Estimated Arrival:</span> August 2, 2026 (Express Courier)</p>
              <p>• <span className="text-[#5a5853]">Packaging:</span> {giftWrap ? 'Atelier Ribbon & Cedar Pouch' : 'Standard Eco-Box'}</p>
            </div>

            <button
              onClick={onClose}
              className="bg-[#1a1a1a] hover:bg-[#8b4513] text-white px-8 py-3.5 rounded ui-mono font-bold text-xs transition-colors shadow-md uppercase tracking-wider"
            >
              Return to Catalog
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
