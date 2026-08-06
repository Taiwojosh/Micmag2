import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, MessageCircle, Package } from 'lucide-react';
import { openWhatsApp } from '../../utils/whatsapp';
import type { ShowroomProduct } from './ShowroomCard';

export interface BasketItem {
  product: ShowroomProduct;
  color?: string;
  quantity: number;
}

interface ShowroomBasketProps {
  items: BasketItem[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (productId: string) => void;
  onClearAll: () => void;
}

const PHONE = '2347052940445';

function buildWhatsAppMessage(items: BasketItem[]): string {
  const lines = items.map((item) => {
    const color = item.color ? ` | Color: ${item.color}` : '';
    return `• ${item.product.name}${color} × ${item.quantity}`;
  });
  return (
    `Hello Micmag! 👋\n\nI'm interested in the following products from your Digital Showroom:\n\n` +
    lines.join('\n') +
    `\n\nCould you please provide pricing and availability? Thank you.`
  );
}

export default function ShowroomBasket({ items, isOpen, onClose, onRemove, onClearAll }: ShowroomBasketProps) {
  const total = items.reduce((acc, i) => acc + i.quantity, 0);

  const handleInquire = () => {
    if (items.length === 0) return;
    openWhatsApp(PHONE, buildWhatsAppMessage(items));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm z-50 flex flex-col"
            style={{ background: '#0d1526', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)' }}>
                  <ShoppingBag size={16} style={{ color: '#c9a84c' }} />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">Inquiry Basket</h3>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {total} item{total !== 1 ? 's' : ''} selected
                  </p>
                </div>
              </div>
              <button
                id="showroom-basket-close"
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-white/10"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <Package size={28} style={{ color: 'rgba(255,255,255,0.2)' }} />
                  </div>
                  <div>
                    <p className="text-white/50 text-sm font-medium mb-1">Your basket is empty</p>
                    <p className="text-white/30 text-xs">Add products from the showroom floor</p>
                  </div>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-3 p-3 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      {/* Image */}
                      <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0"
                        style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          onError={(e) => { (e.target as HTMLImageElement).src = item.product.fallback; }}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-semibold leading-snug line-clamp-2 mb-1">
                          {item.product.name}
                        </p>
                        {item.color && (
                          <div className="flex items-center gap-1.5 mb-1">
                            <div className="w-3 h-3 rounded-full border border-white/20"
                              style={{ background: '#c9a84c' }} />
                            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{item.color}</span>
                          </div>
                        )}
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Qty: {item.quantity}</p>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => onRemove(item.product.id)}
                        className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg transition-colors hover:bg-red-500/20"
                        style={{ color: 'rgba(255,255,255,0.3)' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t space-y-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              {items.length > 0 && (
                <button
                  onClick={onClearAll}
                  className="w-full text-xs text-center transition-colors hover:text-red-400"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                >
                  Clear all items
                </button>
              )}
              <button
                id="showroom-basket-inquire"
                onClick={handleInquire}
                disabled={items.length === 0}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #25d366, #128c7e)', color: '#fff' }}
              >
                <MessageCircle size={16} />
                Send WhatsApp Inquiry
              </button>
              <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
                Our team responds within 30 minutes
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
