import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { X, Check, Minus, Plus, Download } from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';
import SmoothImage from './SmoothImage';
import { 
  SANDTEX_COLORS, 
  SANDTEX_COLOR_GROUPS, 
  SandtexColorGroup, 
  SandtexColor 
} from '../data/sandtexColors';

// ─── Color Swatch Interface ──────────────────────────────────────────────────

export interface ColorSwatch {
  name: string;
  hex: string;
  group?: SandtexColorGroup | string;
  code?: string;
}

export const PALETTE: ColorSwatch[] = [
  ...SANDTEX_COLORS.map(c => ({
    name: c.name,
    hex: c.hex,
    group: c.group,
    code: c.code,
  })),
  { name: 'Custom (Specify via WhatsApp)', hex: 'custom' },
];

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OrderLineItem {
  productId: string;
  productName: string;
  brand: string;
  color: ColorSwatch | null;
  size: '4L' | '20L';
  quantity: number;
}

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'product' | 'service';
  item: any;
  brand?: 'sandtex' | 'caplux' | 'micmag';
  productId?: string;
  onAddToOrder?: (lineItem: OrderLineItem) => void;
}

// ─── Modal Component ──────────────────────────────────────────────────────────

export default function ProductDetailModal({
  isOpen,
  onClose,
  type,
  item,
  brand,
  productId,
  onAddToOrder,
}: ProductDetailModalProps) {
  const [activeColorGroup, setActiveColorGroup] = useState<SandtexColorGroup>('Blues');
  const [selectedColour, setSelectedColour] = useState<ColorSwatch | null>(PALETTE[0]);
  const [selectedSize, setSelectedSize] = useState<'4L' | '20L'>('20L');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [colorSearch, setColorSearch] = useState('');

  const isSandtexOrCaplux = brand === 'sandtex' || brand === 'caplux';
  const isPaint = brand === 'sandtex';

  // Reset on item change
  useEffect(() => {
    setSelectedColour(isPaint ? PALETTE[0] : null);
    setActiveColorGroup('Blues');
    setSelectedSize('20L');
    setQuantity(1);
    setAdded(false);
    setColorSearch('');
  }, [item, isPaint]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Filter colors: if searching, search all 120; otherwise show active group's 20 shades
  const displayedColors = useMemo(() => {
    if (colorSearch.trim()) {
      const q = colorSearch.toLowerCase().trim();
      return SANDTEX_COLORS.filter(
        c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
      );
    }
    return SANDTEX_COLORS.filter(c => c.group === activeColorGroup);
  }, [colorSearch, activeColorGroup]);

  if (!isOpen || !item) return null;

  const handleAddToOrder = () => {
    if (!onAddToOrder) return;
    onAddToOrder({
      productId: productId || item.name,
      productName: item.name,
      brand: brand || 'sandtex',
      color: isPaint ? selectedColour : null,
      size: selectedSize,
      quantity,
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  const handleConsultWhatsApp = () => {
    const text = isPaint && selectedColour
      ? `Hello! I would like to consult on *${item.name}* (Colour: ${selectedColour.name}, Size: ${selectedSize}) from your website.`
      : `Hello! I would like to consult on *${item.name}* from your website.`;
    openWhatsApp('2347052940445', text);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-charcoal/80 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative bg-white border-2 border-brand-charcoal rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-[8px_8px_0px_0px_var(--color-brand-charcoal)] overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b-2 border-brand-charcoal bg-brand-cream/50">
          <div>
            <span className="font-mono text-[9px] font-black uppercase tracking-widest text-brand-red">
              {item.tag || (type === 'service' ? 'Service Spec' : 'Product TDS Spec')}
            </span>
            <h2 className="font-serif text-lg font-black text-brand-charcoal leading-tight">
              {item.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="border-2 border-brand-charcoal rounded-xl p-1.5 hover:bg-neutral-50 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-brand-charcoal" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-left no-scrollbar">
          {/* Main Visual */}
          <div className="relative h-44 rounded-2xl overflow-hidden border-2 border-brand-charcoal bg-brand-cream/20 flex items-center justify-center p-2">
            <SmoothImage
              src={item.image}
              fallback={item.fallback}
              alt={item.name}
              className="w-full h-full object-contain mix-blend-multiply"
            />
            {item.coverage && (
              <span className="absolute bottom-2.5 right-2.5 bg-brand-charcoal text-white font-mono text-[9px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                Yield: {item.coverage}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-neutral-600 leading-relaxed font-sans">
            {item.desc}
          </p>

          {/* ── 2-Tier Color Selector for Sandtex Paints ── */}
          {isPaint && (
            <div className="space-y-3 pt-2 border-t border-neutral-100">
              <div className="flex items-center justify-between">
                <div>
                  <span className="block font-mono text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                    Select Colour Group & Shade
                  </span>
                  {selectedColour && selectedColour.hex !== 'custom' && (
                    <span className="text-[11px] font-mono font-bold text-brand-charcoal flex items-center gap-1.5 mt-0.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-xs"
                        style={{ backgroundColor: selectedColour.hex }}
                      />
                      {selectedColour.name}
                      {selectedColour.code && (
                        <span className="text-neutral-400 font-normal">({selectedColour.code})</span>
                      )}
                    </span>
                  )}
                </div>

                <a
                  href="/Sandtex_Colour_Chart.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  download="Sandtex_Colour_Chart_Micmag.pdf"
                  className="text-[10px] font-mono text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md border border-amber-200"
                >
                  <Download className="w-3 h-3" /> PDF Chart
                </a>
              </div>

              {/* Tier 1: The 6 Main Color Groups */}
              <div className="grid grid-cols-3 gap-1.5">
                {SANDTEX_COLOR_GROUPS.map((grp) => {
                  const isGrpSelected = !colorSearch && activeColorGroup === grp.group;
                  return (
                    <button
                      key={grp.group}
                      type="button"
                      onClick={() => {
                        setActiveColorGroup(grp.group);
                        setColorSearch('');
                      }}
                      className={`flex items-center gap-2 p-1.5 sm:p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        isGrpSelected
                          ? 'border-brand-charcoal bg-amber-50/80 shadow-xs ring-1 ring-brand-charcoal'
                          : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/20 shadow-xs"
                        style={{ backgroundColor: grp.sampleHex }}
                      />
                      <div className="truncate">
                        <span className="text-[10px] font-bold text-brand-charcoal block leading-tight truncate">
                          {grp.label}
                        </span>
                        <span className="text-[8px] font-mono text-neutral-400">
                          {grp.count} shades
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Fast Search Input */}
              <input
                type="text"
                placeholder="Search shades by name (e.g. Lekki Red, Navy Blue)..."
                value={colorSearch}
                onChange={(e) => setColorSearch(e.target.value)}
                className="w-full px-3 py-1.5 text-[11px] font-mono border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-brand-charcoal transition-colors"
              />

              {/* Tier 2: The 20 Shades Grid */}
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mb-1.5">
                  <span>
                    {colorSearch ? `Search results (${displayedColors.length})` : `${activeColorGroup} Family (${displayedColors.length} shades)`}
                  </span>
                  <span className="text-[9px] text-neutral-400">Click to choose shade</span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {displayedColors.map((color) => {
                    const isSelected = selectedColour?.name === color.name;
                    return (
                      <button
                        key={color.code}
                        type="button"
                        onClick={() => setSelectedColour(color)}
                        title={`${color.name} (${color.code})`}
                        className={`relative p-1.5 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-brand-charcoal bg-amber-50 shadow-xs ring-1 ring-brand-charcoal'
                            : 'border-neutral-200 bg-white hover:border-neutral-400'
                        }`}
                      >
                        <div
                          className="w-full h-7 rounded-lg border border-black/15 mb-1 relative"
                          style={{ backgroundColor: color.hex }}
                        >
                          {isSelected && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-brand-charcoal drop-shadow" strokeWidth={3} />
                            </span>
                          )}
                        </div>
                        <span className="text-[9.5px] font-bold text-brand-charcoal truncate w-full leading-tight">
                          {color.name}
                        </span>
                      </button>
                    );
                  })}

                  {/* Custom Option */}
                  <button
                    type="button"
                    onClick={() => setSelectedColour({ name: 'Custom (Specify via WhatsApp)', hex: 'custom' })}
                    title="Request a custom mixed tint"
                    className={`p-1.5 rounded-xl border text-[9px] font-mono font-bold flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                      selectedColour?.hex === 'custom'
                        ? 'border-brand-charcoal bg-amber-100 text-brand-charcoal ring-1 ring-brand-charcoal'
                        : 'border-neutral-200 text-neutral-500 hover:border-neutral-400 bg-neutral-50'
                    }`}
                  >
                    <span className="text-sm mb-0.5">✦</span>
                    <span className="leading-tight">Custom Shade</span>
                  </button>
                </div>
              </div>

              {selectedColour?.hex === 'custom' && (
                <p className="text-[10px] text-neutral-500 font-light bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  We'll contact you via WhatsApp to confirm your exact custom tint reference or sample tile.
                </p>
              )}
            </div>
          )}

          {/* Size Selector — Sandtex & Caplux Paints */}
          {isSandtexOrCaplux && (
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <span className="block font-mono text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                Select Drum / Pack Size
              </span>
              <div className="grid grid-cols-2 gap-2">
                {(['20L', '4L'] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 px-3 rounded-xl border-2 font-mono text-xs font-bold transition-all cursor-pointer text-center ${
                      selectedSize === size
                        ? 'border-brand-charcoal bg-brand-charcoal text-white shadow-sm'
                        : 'border-neutral-200 text-neutral-600 hover:border-neutral-400 bg-neutral-50'
                    }`}
                  >
                    {size === '20L' ? '20 Litre Drum' : '4 Litre Gallon'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="space-y-2 pt-2 border-t border-neutral-100">
            <span className="block font-mono text-[10px] font-black text-neutral-500 uppercase tracking-widest">
              Quantity
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 border-2 border-brand-charcoal rounded-xl flex items-center justify-center text-brand-charcoal hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center font-mono text-base font-black text-brand-charcoal">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 border-2 border-brand-charcoal rounded-xl flex items-center justify-center text-brand-charcoal hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs text-neutral-400 font-mono ml-1">
                {isSandtexOrCaplux ? `x ${selectedSize} tin(s)` : 'unit(s)'}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 bg-brand-cream/40 border-t-2 border-brand-charcoal flex flex-col sm:flex-row gap-2.5">
          {onAddToOrder && (
            <button
              type="button"
              onClick={handleAddToOrder}
              disabled={added}
              className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-wider border-2 border-brand-charcoal flex items-center justify-center gap-2 transition-all shadow-[2px_2px_0px_0px_var(--color-brand-charcoal)] cursor-pointer ${
                added
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-brand-charcoal text-white hover:bg-black'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" /> Added to Order!
                </>
              ) : (
                'Add to Technical Cart'
              )}
            </button>
          )}

          <button
            type="button"
            onClick={handleConsultWhatsApp}
            className="flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-wider border-2 border-brand-charcoal flex items-center justify-center gap-2 bg-[#25D366] text-white hover:bg-[#20ba59] transition-all shadow-[2px_2px_0px_0px_var(--color-brand-charcoal)] cursor-pointer"
          >
            Direct WhatsApp Order
          </button>
        </div>
      </motion.div>
    </div>
  );
}
