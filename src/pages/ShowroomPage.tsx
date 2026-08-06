import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, X, Phone, MessageCircle, Sparkles, ExternalLink } from 'lucide-react';

import ShowroomHero from '../components/showroom/ShowroomHero';
import DivisionSelector, { Division } from '../components/showroom/DivisionSelector';
import ShowroomCard, { ShowroomProduct } from '../components/showroom/ShowroomCard';
import SwatchRail from '../components/showroom/SwatchRail';
import ShowroomBasket, { BasketItem } from '../components/showroom/ShowroomBasket';

import { PAINT_PRODUCTS } from '../data/productsData';
import { FITTINGS_PRODUCTS } from '../data/productsData';
import { CAPLUX_PRODUCTS } from '../data/capluxProducts';
import { usePageMeta } from '../utils/usePageMeta';

// ── Build unified product lists ──────────────────────────────────────────────

const SANDTEX_SHOWROOM: ShowroomProduct[] = PAINT_PRODUCTS.map((p, i) => ({
  id: `sandtex-${i}`,
  name: p.name,
  desc: p.desc,
  tag: p.tag,
  coverage: p.coverage,
  image: p.image,
  fallback: p.fallback,
  brand: 'sandtex',
}));

const CAPLUX_SHOWROOM: ShowroomProduct[] = CAPLUX_PRODUCTS.map((p, i) => ({
  id: `caplux-${i}`,
  name: p.name,
  desc: p.desc,
  tag: p.tag,
  coverage: p.coverage,
  image: p.image,
  fallback: p.fallback,
  brand: 'caplux',
}));

const BATHROOM_SHOWROOM: ShowroomProduct[] = FITTINGS_PRODUCTS.map((p, i) => ({
  id: `bathroom-${i}`,
  name: p.name,
  desc: p.desc,
  tag: p.tag,
  image: p.image,
  fallback: p.fallback,
  brand: 'bathroom',
}));

const DIVISION_PRODUCTS: Record<Division, ShowroomProduct[]> = {
  sandtex: SANDTEX_SHOWROOM,
  caplux: CAPLUX_SHOWROOM,
  bathroom: BATHROOM_SHOWROOM,
};

const DIVISION_LABELS: Record<Division, string> = {
  sandtex: 'Paint Studio — Sandtex Premium Paints',
  caplux: 'Prep Lab — Caplux Surface Systems',
  bathroom: 'Bathroom Suite — Luxury European Fittings',
};

const DIVISION_ACCENT: Record<Division, string> = {
  sandtex: '#ea6c00',
  caplux: '#3b82f6',
  bathroom: '#10b981',
};

// ── Detail Modal ──────────────────────────────────────────────────────────────

interface DetailModalProps {
  product: ShowroomProduct | null;
  onClose: () => void;
  onAddToBasket: (product: ShowroomProduct) => void;
}

function DetailModal({ product, onClose, onAddToBasket }: DetailModalProps) {
  const [imgSrc, setImgSrc] = useState(product?.image ?? '');
  if (!product) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl rounded-2xl overflow-hidden"
          style={{ background: '#0d1526', border: '1px solid rgba(255,255,255,0.1)', maxHeight: '90vh', overflowY: 'auto' }}
        >
          {/* Image */}
          <div className="relative h-64">
            <img
              src={imgSrc}
              alt={product.name}
              onError={() => setImgSrc(product.fallback)}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0d1526 0%, transparent 50%)' }} />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              style={{ background: 'rgba(0,0,0,0.5)', color: '#fff' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: DIVISION_ACCENT[product.brand] }}>
                  {product.tag}
                </p>
                <h2 className="font-serif text-2xl text-white leading-snug">{product.name}</h2>
              </div>
              {product.coverage && (
                <div className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold"
                  style={{ background: 'rgba(201,168,76,0.12)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.25)' }}>
                  {product.coverage} coverage
                </div>
              )}
            </div>
            <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {product.desc}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { onAddToBasket(product); onClose(); }}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #c9a84c, #a0762e)' }}
              >
                <ShoppingBag size={15} /> Add to Inquiry Basket
              </button>
              <a
                href={`https://wa.me/2347052940445?text=${encodeURIComponent(`Hi Micmag! I'd like to know more about: ${product.name}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-colors"
                style={{ background: 'rgba(37,211,102,0.12)', color: '#25d366', border: '1px solid rgba(37,211,102,0.25)' }}
              >
                <MessageCircle size={15} /> Ask
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ShowroomPage() {
  usePageMeta({
    title: 'Digital Showroom',
    description: "Explore Micmag's premium Sandtex paints, Caplux surface systems, and luxury European bathroom fittings in our interactive digital showroom.",
    ogTitle: 'Micmag Digital Showroom — Premium Paints & Luxury Fittings',
  });


  const [heroVisible, setHeroVisible] = useState(true);
  const [activeDivision, setActiveDivision] = useState<Division>('sandtex');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [isBasketOpen, setIsBasketOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<ShowroomProduct | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const floorRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleEnter = useCallback(() => {
    setHeroVisible(false);
    setTimeout(() => floorRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, []);

  const handleAddToBasket = useCallback((product: ShowroomProduct) => {
    setBasket((prev) => {
      const existing = prev.find((i) => i.product.id === product.id && i.color === (selectedColor ?? undefined));
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id && i.color === (selectedColor ?? undefined)
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, color: selectedColor ?? undefined, quantity: 1 }];
    });
    showToast(`"${product.name.split(' ').slice(0, 3).join(' ')}" added to basket`);
  }, [selectedColor]);

  const handleRemove = useCallback((productId: string) => {
    setBasket((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const handleDivisionChange = (div: Division) => {
    setActiveDivision(div);
    setSelectedColor(null);
  };

  const products = DIVISION_PRODUCTS[activeDivision];
  const basketCount = basket.reduce((a, i) => a + i.quantity, 0);

  return (
    <div style={{ background: '#080e1c', minHeight: '100vh' }}>

      {/* Hero */}
      <AnimatePresence>
        {heroVisible && (
          <motion.div exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }}>
            <ShowroomHero onEnter={handleEnter} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Showroom Floor */}
      <div ref={floorRef}>
        {/* Division Selector */}
        <DivisionSelector active={activeDivision} onChange={handleDivisionChange} />

        {/* Floor Section */}
        <section className="py-16 px-6" style={{ background: '#080e1c' }}>
          <div className="max-w-7xl mx-auto">

            {/* Floor header */}
            <motion.div
              key={activeDivision}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1.5"
                  style={{ color: DIVISION_ACCENT[activeDivision] }}>
                  Showroom Floor
                </p>
                <h2 className="font-serif text-2xl md:text-3xl text-white">
                  {DIVISION_LABELS[activeDivision]}
                </h2>
                <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {products.length} products available
                </p>
              </div>

              {/* Basket FAB */}
              <button
                id="showroom-basket-fab"
                onClick={() => setIsBasketOpen(true)}
                className="relative flex items-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105"
                style={{
                  background: 'rgba(201,168,76,0.1)',
                  border: '1px solid rgba(201,168,76,0.3)',
                  color: '#c9a84c',
                }}
              >
                <ShoppingBag size={16} />
                Inquiry Basket
                {basketCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ background: '#c9a84c' }}>
                    {basketCount}
                  </span>
                )}
              </button>
            </motion.div>

            {/* Color Swatches (Sandtex only) */}
            <AnimatePresence mode="wait">
              {activeDivision === 'sandtex' && (
                <motion.div
                  key="swatches"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-10 rounded-2xl p-5 overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <SwatchRail selected={selectedColor} onSelect={setSelectedColor} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Product Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDivision}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {products.map((product, i) => (
                  <ShowroomCard
                    key={product.id}
                    product={product}
                    index={i}
                    onAddToBasket={handleAddToBasket}
                    onViewDetail={setDetailProduct}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* CTA Band */}
        <section className="py-20 px-6" style={{ background: 'linear-gradient(135deg, #1a2c5b 0%, #0d1526 50%, #1a0808 100%)' }}>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border"
                style={{ background: 'rgba(201,168,76,0.1)', borderColor: 'rgba(201,168,76,0.3)', color: '#f0d898' }}>
                <Sparkles size={13} />
                <span className="text-xs font-semibold uppercase tracking-widest">Request a Site Visit</span>
              </div>

              <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
                Ready to Transform Your Space?
              </h2>
              <p className="text-lg mb-10 max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Our specialists will visit your site, assess your needs, and provide a tailored quote — completely free.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/2347052940445?text=Hi%20Micmag!%20I%27d%20like%20to%20book%20a%20free%20site%20visit."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-sm uppercase tracking-widest transition-all duration-200 hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #25d366, #128c7e)', color: '#fff', boxShadow: '0 8px 30px rgba(37,211,102,0.3)' }}
                >
                  <MessageCircle size={16} /> Book Site Visit on WhatsApp
                </a>
                <a
                  href="tel:+2347052940445"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-sm uppercase tracking-widest border transition-all duration-200 hover:bg-white/10"
                  style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)' }}
                >
                  <Phone size={16} /> Call 07052940445
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-6 left-1/2 z-50 px-5 py-3 rounded-xl text-sm font-semibold text-white shadow-xl"
            style={{ background: 'rgba(201,168,76,0.95)', backdropFilter: 'blur(8px)' }}
          >
            ✓ {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      {detailProduct && (
        <DetailModal
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
          onAddToBasket={handleAddToBasket}
        />
      )}

      {/* Basket */}
      <ShowroomBasket
        items={basket}
        isOpen={isBasketOpen}
        onClose={() => setIsBasketOpen(false)}
        onRemove={handleRemove}
        onClearAll={() => setBasket([])}
      />
    </div>
  );
}
