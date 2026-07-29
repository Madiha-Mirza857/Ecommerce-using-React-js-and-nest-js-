import React, { useEffect, useState } from 'react';
import { X, Package, Clock, CheckCircle2, Truck, AlertCircle } from 'lucide-react';
import { Order, User } from '../types';

interface CustomerOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
}

export const CustomerOrdersModal: React.FC<CustomerOrdersModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && currentUser) {
      fetchUserOrders();
    }
  }, [isOpen, currentUser]);

  const fetchUserOrders = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?email=${encodeURIComponent(currentUser.email)}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Error fetching customer orders:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Processing':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative bg-[#fdfbf7] rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-[#1a1a1a]/20 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-[#1a1a1a] text-[#fdfbf7] flex items-center justify-between border-b border-[#1a1a1a]/20">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#8b4513]" />
            <h2 className="serif-display text-xl font-bold">My Atelier Order History</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#fdfbf7]/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          {!currentUser ? (
            <p className="ui-mono text-xs text-[#5a5853] text-center py-8">
              Please sign in to view your orders.
            </p>
          ) : loading ? (
            <p className="ui-mono text-xs text-[#5a5853] text-center py-8">Loading your orders...</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <Package className="w-10 h-10 text-[#8b4513]/40 mx-auto" />
              <p className="serif-display text-lg font-bold text-[#1a1a1a]">No Orders Placed Yet</p>
              <p className="ui-mono text-xs text-[#5a5853]">
                Your recent purchases and delivery updates will appear here.
              </p>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-[#f7f4ee] border border-[#1a1a1a]/15 rounded-lg p-4 space-y-3 shadow-2xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1a1a1a]/10 pb-2">
                  <div>
                    <span className="serif-display text-base font-bold text-[#1a1a1a]">{ord.id}</span>
                    <p className="ui-mono text-[10px] text-[#5a5853]">
                      Placed on {new Date(ord.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`ui-mono text-[10px] font-bold px-2.5 py-1 rounded-full border ${getStatusBadge(
                      ord.status
                    )}`}
                  >
                    Status: {ord.status}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs ui-mono bg-[#fdfbf7] p-2.5 rounded border border-[#1a1a1a]/10">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.productName} className="w-10 h-12 object-cover rounded" />
                        <div>
                          <p className="serif-display text-sm font-bold text-[#1a1a1a]">{item.productName}</p>
                          <p className="text-[10px] text-[#5a5853]">
                            Color: {item.color} | Size: {item.size} x{item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-[#8b4513]">${item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-xs ui-mono pt-2 border-t border-[#1a1a1a]/10">
                  <span className="text-[#5a5853]">Delivery to {ord.city}, {ord.country}</span>
                  <span className="font-bold text-[#1a1a1a] text-sm">Total: ${ord.totalAmount}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
