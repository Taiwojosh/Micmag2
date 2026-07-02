import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Lock, ChevronRight, HelpCircle } from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';

// Color Swatch type definition
interface ColorSwatch {
  name: string;
  hex: string;
}

const PALETTE: ColorSwatch[] = [
  { name: 'Brilliant White', hex: '#FAF9F6' },
  { name: 'Sandtex Majestic Orange', hex: '#EA6C00' },
  { name: 'Sunset Marigold', hex: '#F95700' },
  { name: 'Lekki Terracotta', hex: '#B8442E' },
  { name: 'Kano Crimson', hex: '#D32F2F' },
  { name: 'Eko Alabaster', hex: '#C5A880' },
  { name: 'Lagoon Turquoise', hex: '#007A87' },
  { name: 'Charcoal Grey', hex: '#2A2A2A' },
];

interface RelatedProduct {
  id: string;
  name: string;
  image: string;
  fallback: string;
}

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'product' | 'service';
  item: any; // Can be a product item or service item
  onSwapItem?: (newItem: any, type: 'product' | 'service') => void;
}

export default function ProductDetailModal({
  isOpen,
  onClose,
  type,
  item,
  onSwapItem
}: ProductDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColour, setSelectedColour] = useState<ColorSwatch | null>(null);
  const [modalRegion, setModalRegion] = useState<string>('');
  const [accordionOpen, setAccordionOpen] = useState(false);

  // Hardcoded related products list for horizontal scroll strip
  const relatedProducts: RelatedProduct[] = [
    {
      id: 'vme',
      name: 'Sandtex VME (Vinyl Matt Emulsion) 20L/4L',
      image: './Sandtex VME.png',
      fallback: 'https://images.unsplash.com/photo-1590487988256-9ed24133863e?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'select-vme',
      name: 'Sandtex Select VME 20L',
      image: './Sandtex select VME.png',
      fallback: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'satin',
      name: 'Sandtex Satin 20L/4L',
      image: './satin1.png',
      fallback: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800'
    }
  ];

  // Disable/enable body scroll on open/close
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Sync state if item changes
  useEffect(() => {
    setActiveImageIndex(0);
    setAccordionOpen(false);
    
    // Set default color if paint
    const isPaint = type === 'product' && item && (item.tag?.toLowerCase().includes('paint') || item.tag?.toLowerCase().includes('classic') || item.tag?.toLowerCase().includes('emulsion') || item.tag?.toLowerCase().includes('interior') || item.tag?.toLowerCase().includes('matt'));
    if (isPaint) {
      setSelectedColour(PALETTE[0]);
    } else {
      setSelectedColour(null);
    }
  }, [item, type]);

  if (!isOpen || !item) return null;

  const isPaint = type === 'product' && (item.tag?.toLowerCase().includes('paint') || item.tag?.toLowerCase().includes('classic') || item.tag?.toLowerCase().includes('emulsion') || item.tag?.toLowerCase().includes('interior') || item.tag?.toLowerCase().includes('matt'));
  const isSanitary = type === 'product' && !isPaint;

  // Image Source Handling
  const images = [item.image || item.fallback, item.fallback];

  const handleWhatsAppInquiry = () => {
    if (!modalRegion) return;

    let text = '';
    if (type === 'product') {
      text = `Hello MICMAG! 👋

My name is *Visitor*.

I'd like to enquire about:
• *Product:* ${item.name}
• *Code:* ${item.tag || 'N/A'}
• *Variant:* ${item.coverage ? `${item.coverage} Coverage` : 'To be confirmed'}
${selectedColour ? `• *Colour:* ${selectedColour.name} (${selectedColour.hex})` : ''}
• *My Location:* ${modalRegion}

Please get in touch to confirm availability and pricing. Thank you!`;
    } else {
      text = `Hello MICMAG! 👋

I'm interested in your *${item.name}* service.
• *Scope:* ${item.scope || item.tag || 'Interior Consultation'}
• *My Location:* ${modalRegion}

I'd love to book a consultation at your earliest convenience. Thank you!`;
    }

    openWhatsApp('2347052940445', text);
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-end md:items-center justify-center p-0 md:p-6" id="product-detail-modal-root">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 180 }}
        className="relative bg-white w-full max-w-5xl h-[85vh] md:h-[80vh] flex flex-col rounded-t-3xl md:rounded-2xl border-t-4 md:border-4 border-[#1c1917] overflow-hidden shadow-[8px_8px_0px_0px_#1e3a5f] z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b-2 border-[#1c1917]">
          <div className="flex items-center gap-2">
            {/* Brand Badge */}
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border-2 border-[#1c1917] font-mono text-[9px] font-black tracking-widest uppercase text-white ${
              isPaint ? 'bg-[#ea6c00]' : type === 'service' ? 'bg-[#1a6b3c]' : 'bg-[#1e3a5f]'
            }`}>
              {isPaint ? 'Sandtex' : type === 'service' ? 'MICMAG SERVICE' : 'MICMAG SPECIALTY'}
            </span>
            <span className="font-mono text-[11px] text-[#78716c] tracking-tight">
              {item.tag || 'STX-001'}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="border-2 border-[#1c1917] hover:bg-[#f5f5f4] rounded-xl p-1.5 shadow-[2px_2px_0px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#1c1917] transition-all"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 text-[#1c1917] font-black" />
          </button>
        </div>

        {/* Modal Body (Horizontally Scrollable container) */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 md:p-8 whitespace-nowrap scrollbar-thin scrollbar-thumb-neutral-300">
          <div className="flex flex-row h-full gap-8 items-stretch whitespace-normal">
            
            {/* PANEL 1: MEDIA & CUSTOMIZATION */}
            <div className="flex-shrink-0 w-[290px] sm:w-[350px] md:w-[380px] h-full flex flex-col gap-4 overflow-y-auto pr-4 border-r-2 border-dashed border-neutral-200">
              <span className="block font-mono text-[9.5px] font-black text-brand-red uppercase tracking-widest">
                01 &bull; VISUALS & SURFACE PREVIEW
              </span>
              
              {/* Main Image Frame with Neo-Brutalist Frame */}
              <div className="relative aspect-[4/3] bg-[#f5f5f4] border-2 border-[#1c1917] rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_#1c1917] flex-shrink-0">
                <img 
                  src={images[activeImageIndex]} 
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = item.fallback;
                  }}
                  referrerPolicy="no-referrer"
                />

                {/* Simulated dynamic interior Wall colour swatch preview */}
                {selectedColour && (
                  <div className="absolute bottom-3 right-3 bg-white border-2 border-[#1c1917] p-2 rounded-xl flex items-center gap-2 shadow-[2px_2px_0px_0px_#1c1917]">
                    <div className="text-[9px] font-mono font-black text-[#78716c] uppercase leading-none">
                      PREVIEW
                    </div>
                    <div 
                      className="h-5 w-12 rounded-md border border-[#1c1917] transition-colors duration-300"
                      style={{ backgroundColor: selectedColour.hex }}
                    />
                  </div>
                )}
              </div>

              {/* Thumbnails strip */}
              <div className="flex items-center gap-2.5 flex-shrink-0">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-12 w-12 rounded-xl border-2 transition-all duration-150 flex-shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-[#1a6b3c] shadow-[2px_2px_0px_0px_#1a6b3c]'
                        : 'border-[#1c1917] hover:border-black opacity-75 hover:opacity-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.12)]'
                    }`}
                  >
                    <img src={img} alt="Thumb" className="w-full h-full object-cover rounded-lg" onError={(e) => e.currentTarget.src = item.fallback} />
                  </button>
                ))}
              </div>

              {/* Interactive Color Swatch Section for Sandtex Paints */}
              {isPaint && (
                <div className="bg-[#FAF9F5] border-2 border-[#1c1917] rounded-2xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.06)] flex-shrink-0">
                  <span className="block font-mono text-[9px] font-black text-[#ea6c00] uppercase tracking-widest mb-2">
                    CHOOSE SURFACE COLOUR
                  </span>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {PALETTE.map((color) => {
                      const isSelected = selectedColour?.name === color.name;
                      return (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColour(color)}
                          className="relative h-8 w-full rounded-lg border-2 border-[#1c1917] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.12)] transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer"
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                          aria-pressed={isSelected}
                        >
                          {isSelected && (
                            <span className="absolute inset-[-4px] rounded-[10px] border-2 border-[#1c1917] pointer-events-none flex items-center justify-center">
                              <span className="w-1 h-1 bg-[#1c1917] rounded-full" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  
                  {selectedColour && (
                    <div className="mt-3 font-mono text-[10px] text-[#78716c] font-black leading-none uppercase">
                      Selected: <span className="text-[#1c1917]">{selectedColour.name}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

              {/* PANEL 2: SPECIFICATIONS & DESCRIPTION */}
            <div className="flex-shrink-0 w-[290px] sm:w-[350px] md:w-[380px] h-full flex flex-col gap-4 overflow-y-auto pr-4 border-r-2 border-dashed border-neutral-200">
              <span className="block font-mono text-[9.5px] font-black text-brand-red uppercase tracking-widest">
                02 &bull; OVERVIEW & DETAILS
              </span>

              <div>
                <h2 className="font-display font-black text-xl text-[#1c1917] tracking-tight leading-tight">
                  {item.name}
                </h2>
                <p className="font-sans text-xs text-[#78716c] mt-1">
                  {type === 'service' ? item.scope || 'Interior Design Consultation' : item.tag || 'STX-001'}
                </p>
              </div>

              {/* Description */}
              <div className="font-sans text-xs md:text-sm text-[#1c1917] leading-relaxed">
                {type === 'service' ? (
                  <span>
                    Our interior specialists work with you to define a cohesive direction for your space — from color palette and material selection to furniture layout and finishing priorities. Whether you're furnishing a new build or refreshing an existing home, we start with your brief and build from there.
                  </span>
                ) : (
                  <span>
                    {item.desc || 'Engineered with elite polymer resins optimized specifically for Nigerian weather patterns. Rejects coastal salt-spray degradation and provides continuous defense against extreme humidity, guaranteeing rich aesthetic retention.'}
                  </span>
                )}
              </div>

              {/* Service inclusions */}
              {type === 'service' && (
                <div className="space-y-2 mt-2">
                  <span className="block font-mono text-[9px] font-black text-[#1a6b3c] uppercase tracking-widest">
                    WHAT IS INCLUDED IN SERVICE
                  </span>
                  <ul className="space-y-1.5">
                    <li className="flex items-start gap-2 font-sans text-xs text-[#1c1917]">
                      <Check className="w-3.5 h-3.5 text-[#1a6b3c] flex-shrink-0 mt-0.5" />
                      <span>Initial consultation call (30 mins) with lead designers</span>
                    </li>
                    <li className="flex items-start gap-2 font-sans text-xs text-[#1c1917]">
                      <Check className="w-3.5 h-3.5 text-[#1a6b3c] flex-shrink-0 mt-0.5" />
                      <span>Site visitation & physical room assessment across Lagos</span>
                    </li>
                    <li className="flex items-start gap-2 font-sans text-xs text-[#1c1917]">
                      <Check className="w-3.5 h-3.5 text-[#1a6b3c] flex-shrink-0 mt-0.5" />
                      <span>Bespoke color palette proposal (3 distinct options)</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* PANEL 3: INSTRUCTIONS & RELATED ITEMS */}
            <div className="flex-shrink-0 w-[290px] sm:w-[350px] md:w-[380px] h-full flex flex-col gap-4 overflow-y-auto pr-4">
              <span className="block font-mono text-[9.5px] font-black text-brand-red uppercase tracking-widest">
                03 &bull; INSTRUCTIONS & EXTRA ITEMS
              </span>

              {/* Typical timeline for Services */}
              {type === 'service' && (
                <div className="space-y-2">
                  <span className="block font-mono text-[9px] font-black text-[#1a6b3c] uppercase tracking-widest">
                    TYPICAL SERVICE TIMELINE
                  </span>
                  <div className="relative border-l-2 border-[#e7e5e4] pl-4 ml-2 space-y-3 text-left">
                    <div>
                      <div className="absolute left-[-6px] w-2 h-2 rounded-full bg-[#1a6b3c] border border-[#1c1917]" />
                      <span className="block font-mono text-[8px] text-[#78716c] uppercase">Day 1</span>
                      <span className="font-sans text-xs font-bold text-[#1c1917]">Initial WhatsApp consultation & briefing</span>
                    </div>
                    <div>
                      <div className="absolute left-[-6px] w-2 h-2 rounded-full bg-[#1a6b3c] border border-[#1c1917]" />
                      <span className="block font-mono text-[8px] text-[#78716c] uppercase">Day 2-3</span>
                      <span className="font-sans text-xs font-bold text-[#1c1917]">Site visit + physical measurements</span>
                    </div>
                    <div>
                      <div className="absolute left-[-6px] w-2 h-2 rounded-full bg-[#1a6b3c] border border-[#1c1917]" />
                      <span className="block font-mono text-[8px] text-[#78716c] uppercase">Day 4-7</span>
                      <span className="font-sans text-xs font-bold text-[#1c1917]">Proposal design & rendering</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Related Products strip */}
              {type === 'product' && (
                <div className="space-y-2 flex-shrink-0">
                  <span className="block font-mono text-[9px] font-black text-[#78716c] uppercase tracking-widest">
                    YOU MIGHT ALSO NEED
                  </span>
                  <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                    {relatedProducts.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          if (onSwapItem) {
                            onSwapItem(p, 'product');
                          }
                        }}
                        className="flex-shrink-0 w-28 bg-white border-2 border-[#1c1917] rounded-xl p-1.5 text-left hover:shadow-[2px_2px_0px_0px_#ea6c00] transition-all cursor-pointer shadow-[1px_1px_0px_0px_rgba(0,0,0,0.08)]"
                      >
                        <img src={p.image} alt={p.name} className="w-full h-12 object-contain bg-[#f5f5f4] rounded-lg border border-[#e7e5e4] p-1" onError={(e) => e.currentTarget.src = p.fallback} />
                        <span className="block font-sans font-extrabold text-[9px] text-[#1c1917] mt-1 truncate leading-tight">
                          {p.name}
                        </span>
                        <span className="block font-mono text-[7px] text-[#78716c] font-black uppercase">
                          VIEW DETAILS &rarr;
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Sticky Conversion Footer */}
        <div className="sticky bottom-0 bg-white border-t-2 border-[#1c1917] p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="text-left">
            <span className="block font-mono text-[9px] text-[#78716c] font-black uppercase tracking-wider">
              ENQUIRING ABOUT:
            </span>
            <span className="block font-sans font-black text-xs text-[#1c1917]">
              {item.name} {selectedColour ? `• ${selectedColour.name}` : ''} {modalRegion ? `• Deliver to ${modalRegion}` : ''}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Region Selector */}
            <select
              value={modalRegion}
              onChange={(e) => setModalRegion(e.target.value)}
              className="border-2 border-[#1c1917] rounded-xl px-3 py-2 text-xs font-mono font-bold bg-white text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]"
              aria-label="Select delivery region"
            >
              <option value="">Select Location *</option>
              <option value="Lagos Mainland">Lagos Mainland</option>
              <option value="Lagos Island">Lagos Island</option>
              <option value="Abuja FCT">Abuja FCT</option>
              <option value="Port Harcourt">Port Harcourt</option>
              <option value="Other Nigeria State">Other State</option>
            </select>

            {/* Submit Enquiry on WhatsApp */}
            <button
              onClick={handleWhatsAppInquiry}
              disabled={!modalRegion}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-sans text-xs font-black uppercase border-2 border-[#1c1917] text-white shadow-[3px_3px_0px_0px_#1c1917] transition-all duration-150 ${
                modalRegion
                  ? `${isPaint ? 'bg-[#ea6c00] hover:shadow-[5px_5px_0px_0px_#1c1917] hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[1px] active:translate-y-[1px]' : 'bg-[#1a6b3c] hover:shadow-[5px_5px_0px_0px_#1c1917] hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[1px] active:translate-y-[1px]'} cursor-pointer`
                  : 'bg-neutral-300 border-neutral-400 text-neutral-500 shadow-none opacity-50 cursor-not-allowed'
              }`}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white shrink-0" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>Send Enquiry on WhatsApp</span>
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
