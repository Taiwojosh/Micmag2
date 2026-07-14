import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Check, Minus, Plus } from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';

// ─── Color Palette ───────────────────────────────────────────────────────────

interface ColorSwatch {
  name: string;
  hex: string;
}

const PALETTE: ColorSwatch[] = [
  // ── Reds ──
  { name: 'Dusky Pink', hex: '#BCA29A' },
  { name: 'Magnolia', hex: '#EEDACF' },
  { name: 'Lilac', hex: '#B2B2BC' },
  { name: 'Cinnabar', hex: '#9F4D45' },
  { name: 'Pale Vermillion', hex: '#B87E74' },
  { name: 'Russet', hex: '#7B5D54' },
  { name: 'Sienna', hex: '#845B42' },
  { name: 'Opriment', hex: '#89743C' },
  { name: 'Bamboo', hex: '#A57D59' },
  { name: 'Lekki Red', hex: '#CC252C' },
  { name: 'Rich Brown', hex: '#5D433B' },
  { name: 'Minium', hex: '#AE563D' },
  { name: 'Estrucan Red', hex: '#563E37' },
  { name: 'Coke Red', hex: '#A5232B' },
  { name: 'Rose', hex: '#B47E6F' },
  { name: 'Isabella', hex: '#D8CCCA' },
  { name: 'Cinnamon Spice', hex: '#893D2B' },
  { name: 'Strawberry', hex: '#D59092' },
  { name: 'Reef Red', hex: '#6C2929' },
  { name: 'Coral', hex: '#BE5341' },
  // ── Yellows ──
  { name: 'Apple White', hex: '#EEEBE0' },
  { name: 'Jasmine White', hex: '#EBE5D7' },
  { name: 'Warm Sun', hex: '#E4D8BC' },
  { name: 'Yellow Rose', hex: '#D9BE2B' },
  { name: 'Barley', hex: '#D2B485' },
  { name: 'Sun Yellow', hex: '#A89158' },
  { name: 'Mustard Maize', hex: '#635F47' },
  { name: 'Golden Yellow', hex: '#DBA220' },
  { name: 'Gentle Yellow', hex: '#EBDFC4' },
  { name: 'Butter Milk', hex: '#E3DAC1' },
  { name: 'Trade Yellow', hex: '#EBD021' },
  { name: 'Soft Yellow', hex: '#DED6B4' },
  { name: 'Primrose', hex: '#CECB8C' },
  { name: 'Espana', hex: '#CFB77F' },
  { name: 'Pale Daffodil', hex: '#CFBE76' },
  { name: 'Lantern Glow', hex: '#CBB33A' },
  { name: 'Candle Light', hex: '#E5B225' },
  { name: 'Heirloom', hex: '#B1AB77' },
  { name: 'Midas Touch', hex: '#978F2C' },
  { name: 'Constant', hex: '#CFD39C' },
  // ── Neutrals ──
  { name: 'Off White', hex: '#DDD6C3' },
  { name: 'Calabash', hex: '#B8A593' },
  { name: 'Silver Grey', hex: '#949391' },
  { name: 'Symphony', hex: '#CBB2A3' },
  { name: 'Pale Mushroom', hex: '#CBB5A4' },
  { name: 'Dove Grey', hex: '#7F8180' },
  { name: 'Midstone', hex: '#7B745F' },
  { name: 'Stone Grey', hex: '#67645F' },
  { name: 'Mid Grey', hex: '#4D5254' },
  { name: 'Pale Grey', hex: '#616665' },
  { name: 'Sierra', hex: '#796E6A' },
  { name: 'Hazel Brown', hex: '#8F7B6B' },
  { name: 'Dark Grey', hex: '#414A4E' },
  { name: 'Bone White', hex: '#EAE4DA' },
  { name: 'Dark Mushroom', hex: '#4E4B4A' },
  { name: 'Bitter Chocolate', hex: '#343233' },
  { name: 'Coconut', hex: '#534C49' },
  { name: 'Silver Lining', hex: '#B4B9B9' },
  { name: 'Flake Grey', hex: '#9CA09F' },
  { name: 'Cloud Burst', hex: '#8FA09E' },
  // ── Oranges ──
  { name: 'Rose Dawn', hex: '#EFE6DA' },
  { name: 'Table Linen', hex: '#E7DBCB' },
  { name: 'Beige', hex: '#A49383' },
  { name: 'Cameo', hex: '#907C69' },
  { name: 'Cream 3040', hex: '#DCC2A3' },
  { name: 'Peach', hex: '#CCA188' },
  { name: 'Rich Cream', hex: '#BA9E74' },
  { name: 'Light Cream', hex: '#A49383' },
  { name: 'Orange', hex: '#DF7935' },
  { name: 'Fruit Basket', hex: '#E68E64' },
  { name: 'Honey Locust', hex: '#DF9E7E' },
  { name: 'Orange Crush', hex: '#C53B21' },
  { name: 'Hot Toddy', hex: '#DD7A33' },
  { name: 'Spiced Peach', hex: '#D59882' },
  { name: 'Apple Blossom', hex: '#AD9286' },
  { name: 'Lemon Chiffon', hex: '#DCDCA2' },
  { name: 'Sugar Cookie', hex: '#E4DBCA' },
  { name: 'Titian Gold', hex: '#CCA752' },
  { name: 'Butterfly', hex: '#A09028' },
  { name: 'Shiloh', hex: '#C96A1E' },
  // ── Blues ──
  { name: 'Bloomy Aster', hex: '#CCD9E3' },
  { name: 'Mountain Air', hex: '#E5EBE2' },
  { name: 'Nursery Blue', hex: '#5A8F96' },
  { name: 'Lagoon Blue', hex: '#37809C' },
  { name: 'Azure Blue', hex: '#31435C' },
  { name: 'Mist Blue', hex: '#BDCCC2' },
  { name: 'Light Blue', hex: '#8DA698' },
  { name: 'Skye Blue', hex: '#598375' },
  { name: 'Babbling Brook', hex: '#98B9C4' },
  { name: 'Ocean Wave', hex: '#7A9CB0' },
  { name: 'Navy Blue', hex: '#243142' },
  { name: 'Solent Blue', hex: '#334954' },
  { name: 'Brillant Blue', hex: '#1D658C' },
  { name: 'Cold Morn', hex: '#B5B9BE' },
  { name: 'Scandinavian Sky', hex: '#6E8A9F' },
  { name: 'Water Front Blue', hex: '#96B0BD' },
  { name: 'Flattery', hex: '#487198' },
  { name: 'Opera Blue', hex: '#98ADB5' },
  { name: 'Pacific Blue', hex: '#416D82' },
  { name: 'Blue Blood', hex: '#14619A' },
  // ── Greens ──
  { name: 'Aspen Whispers', hex: '#CCD3BF' },
  { name: 'Icy Wind', hex: '#D2DBD2' },
  { name: 'Leaf Green', hex: '#526242' },
  { name: 'Spray Green', hex: '#8A8A77' },
  { name: 'Lovat Green', hex: '#5F664E' },
  { name: 'National Green', hex: '#1F5139' },
  { name: 'Peppermint', hex: '#A9C7B5' },
  { name: 'Sea Holly', hex: '#D2DBCA' },
  { name: 'Olive Drab', hex: '#394039' },
  { name: 'Chartreuse', hex: '#419232' },
  { name: 'Casuarina Lovat', hex: '#485043' },
  { name: 'Tropic Green', hex: '#659539' },
  { name: 'Spring Leaf', hex: '#81AB41' },
  { name: 'Placid View', hex: '#A5C481' },
  { name: 'Lime Spray', hex: '#D7DEC1' },
  { name: 'Citron', hex: '#CBD4A6' },
  { name: 'Water Green', hex: '#B4C7B3' },
  { name: 'Whimsical', hex: '#5F9B4D' },
  { name: 'Luiere', hex: '#91BE83' },
  { name: 'Meadow Brook', hex: '#B8CC9B' },
  // ── Special ──
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

// ─── Modal ────────────────────────────────────────────────────────────────────

export default function ProductDetailModal({
  isOpen,
  onClose,
  type,
  item,
  brand,
  productId,
  onAddToOrder,
}: ProductDetailModalProps) {
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
    setSelectedSize('20L');
    setQuantity(1);
    setAdded(false);
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
    }, 900);
  };

  const images = [item.image || item.fallback, item.fallback].filter(Boolean);

  return (
    <div className="fixed inset-0 z-[10000] flex items-end md:items-center justify-center p-0 md:p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 200 }}
        className="relative bg-white w-full max-w-2xl max-h-[92vh] md:max-h-[85vh] flex flex-col rounded-t-3xl md:rounded-2xl border-t-4 md:border-4 border-brand-charcoal overflow-hidden shadow-2xl z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-white border-b-2 border-brand-charcoal shrink-0">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md border-2 border-brand-charcoal font-mono text-[9px] font-black tracking-widest uppercase text-white ${
              brand === 'sandtex' ? 'bg-micmag-red' : brand === 'caplux' ? 'bg-amber-600' : 'bg-micmag-blue'
            }`}>
              {brand === 'sandtex' ? 'Sandtex' : brand === 'caplux' ? 'Caplux' : 'Micmag'}
            </span>
            <span className="font-mono text-[10px] text-neutral-400 tracking-tight">{item.tag || ''}</span>
          </div>
          <button
            onClick={onClose}
            className="border-2 border-brand-charcoal rounded-xl p-1.5 hover:bg-neutral-50 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-brand-charcoal" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* Product Image + Name */}
          <div className="flex gap-4 items-start">
            <div className="w-20 h-20 shrink-0 bg-neutral-50 border border-neutral-200 rounded-xl overflow-hidden flex items-center justify-center p-2">
              <img
                src={images[0]}
                alt={item.name}
                className="max-h-full max-w-full object-contain"
                onError={(e) => { e.currentTarget.src = item.fallback; }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-serif text-base font-black text-brand-charcoal leading-snug">{item.name}</h2>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed line-clamp-3">{item.desc}</p>
            </div>
          </div>

          {/* Size Selector — Sandtex & Caplux */}
          {isSandtexOrCaplux && (
            <div className="space-y-2">
              <span className="block font-mono text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                Select Size
              </span>
              <div className="flex gap-2.5">
                {(['4L', '20L'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-mono font-black border-2 transition-all cursor-pointer ${
                      selectedSize === size
                        ? 'bg-brand-charcoal text-white border-brand-charcoal shadow-sm'
                        : 'bg-white text-brand-charcoal border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selector — Sandtex & Caplux */}
          {isPaint && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="block font-mono text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                  Select Colour
                </span>
                {selectedColour && selectedColour.hex !== 'custom' && (
                  <span className="text-[10px] font-mono font-bold text-brand-charcoal">
                    {selectedColour.name}
                  </span>
                )}
              </div>

              {/* Color Search */}
              <input
                type="text"
                placeholder="Search colours… e.g. Navy Blue"
                value={colorSearch}
                onChange={(e) => setColorSearch(e.target.value)}
                className="w-full px-3 py-2 text-[11px] font-mono border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-brand-charcoal transition-colors"
              />

              <div className="grid grid-cols-8 gap-1.5 max-h-48 overflow-y-auto pr-1">
                {PALETTE.filter(c => c.name.toLowerCase().includes(colorSearch.toLowerCase())).map((color) => {
                  const isSelected = selectedColour?.name === color.name;
                  if (color.hex === 'custom') {
                    return (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColour(color)}
                        title={color.name}
                        className={`col-span-2 h-8 rounded-lg border-2 text-[8px] font-mono font-black uppercase tracking-wide transition-all cursor-pointer ${
                          isSelected ? 'border-brand-charcoal bg-neutral-100 text-brand-charcoal' : 'border-neutral-200 text-neutral-500 hover:border-neutral-400'
                        }`}
                      >
                        Custom ✦
                      </button>
                    );
                  }
                  return (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColour(color)}
                      title={color.name}
                      className={`relative h-8 rounded-lg border-2 transition-all cursor-pointer hover:scale-110 ${
                        isSelected ? 'border-brand-charcoal scale-110 shadow-md' : 'border-neutral-300 hover:border-neutral-500'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {isSelected && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <Check className="w-3 h-3 text-brand-charcoal drop-shadow-lg" strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedColour?.hex === 'custom' && (
                <p className="text-[10px] text-neutral-500 font-light bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  We'll contact you via WhatsApp to confirm your exact color code or reference.
                </p>
              )}
            </div>
          )}

          {/* Quantity Selector */}
          <div className="space-y-2">
            <span className="block font-mono text-[10px] font-black text-neutral-500 uppercase tracking-widest">
              Quantity
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-9 h-9 border-2 border-brand-charcoal rounded-xl flex items-center justify-center text-brand-charcoal hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center font-mono text-base font-black text-brand-charcoal">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-9 h-9 border-2 border-brand-charcoal rounded-xl flex items-center justify-center text-brand-charcoal hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs text-neutral-400 font-mono ml-1">
                {isSandtexOrCaplux ? `× ${selectedSize} tin(s)` : 'unit(s)'}
              </span>
            </div>
          </div>

          {/* Summary pill */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-[11px] font-mono text-neutral-600 leading-relaxed">
            <span className="font-black text-brand-charcoal">{item.name}</span>
            {isSandtexOrCaplux && <span> · {selectedSize}</span>}
            {isPaint && selectedColour && <span> · {selectedColour.name}</span>}
            <span> · {quantity} {quantity === 1 ? 'unit' : 'units'}</span>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="shrink-0 bg-white border-t-2 border-brand-charcoal px-5 py-4">
          <button
            onClick={handleAddToOrder}
            disabled={added}
            className={`w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-wider border-2 border-brand-charcoal flex items-center justify-center gap-2 transition-all shadow-[3px_3px_0px_0px_var(--color-brand-charcoal)] cursor-pointer ${
              added
                ? 'bg-micmag-green text-white border-micmag-green shadow-none translate-x-[1px] translate-y-[1px]'
                : 'bg-micmag-red text-white hover:shadow-[5px_5px_0px_0px_var(--color-brand-charcoal)] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]'
            }`}
          >
            {added ? (
              <><Check className="w-4 h-4" /> Added to Order!</>
            ) : (
              <><span>Add to Order</span></>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
