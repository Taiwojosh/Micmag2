import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, Layers, ShoppingBag, Plus, Minus, Send, Check, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';

interface PaintModel {
  name: string;
  subtitle: string;
  brand: 'sandtex' | 'caplux';
  hasColor: boolean;
  sizes: string[];
  defaultSize: string;
}

const PAINT_MODELS: PaintModel[] = [
  // Sandtex
  { name: 'Sandtex VME', subtitle: 'Vinyl Matt Emulsion (Interior & Exterior)', brand: 'sandtex', hasColor: true, sizes: ['20 Liters', '4 Liters'], defaultSize: '20 Liters' },
  { name: 'Sandtex Select VME', subtitle: 'Vinyl Matt Emulsion (Ready-Mix)', brand: 'sandtex', hasColor: true, sizes: ['20 Liters'], defaultSize: '20 Liters' },
  { name: 'Sandtex Satin', subtitle: 'Interior Semi-Gloss', brand: 'sandtex', hasColor: true, sizes: ['20 Liters', '4 Liters'], defaultSize: '20 Liters' },
  { name: 'Sandtex Matt', subtitle: 'Smooth & Tough Exterior Emulsion', brand: 'sandtex', hasColor: true, sizes: ['20 Liters'], defaultSize: '20 Liters' },
  { name: 'Sandtex Trade Smooth', subtitle: 'Professional Elite Masonry', brand: 'sandtex', hasColor: true, sizes: ['20 Liters'], defaultSize: '20 Liters' },
  { name: 'Sandtex Finebuild', subtitle: 'Textured Primer Build', brand: 'sandtex', hasColor: false, sizes: ['20 Liters'], defaultSize: '20 Liters' },
  { name: 'Sandtex Gloss', subtitle: 'Polyurethane Enamel for Wood & Metal', brand: 'sandtex', hasColor: true, sizes: ['4 Liters'], defaultSize: '4 Liters' },
  // Caplux
  { name: 'Screeding Filler', subtitle: 'Acrylic base coat for wall smoothing', brand: 'caplux', hasColor: false, sizes: ['20 Liters'], defaultSize: '20 Liters' },
  { name: 'Alkali Resisting Primer', subtitle: 'Anti-alkaline salt barrier base coat', brand: 'caplux', hasColor: false, sizes: ['4 Liters'], defaultSize: '4 Liters' },
  { name: 'Red Oxide Anti-Rust Primer', subtitle: 'Corrosion inhibitor for metals', brand: 'caplux', hasColor: false, sizes: ['4 Liters'], defaultSize: '4 Liters' },
  { name: 'Plaster Primer', subtitle: 'High-adhesion stabilizer for raw plasters', brand: 'caplux', hasColor: false, sizes: ['20 Liters'], defaultSize: '20 Liters' },
  { name: 'Stabilizing Solution Sealer', subtitle: 'Penetrating stabilizer for chalky surfaces', brand: 'caplux', hasColor: false, sizes: ['4 Liters'], defaultSize: '4 Liters' },
  { name: 'Undercoat', subtitle: 'High-opacity intermediate layer', brand: 'caplux', hasColor: false, sizes: ['4 Liters'], defaultSize: '4 Liters' },
  { name: 'Biocidal Wash', subtitle: 'Fungal & algae growth sterilizer', brand: 'caplux', hasColor: false, sizes: ['4 Liters'], defaultSize: '4 Liters' },
];

interface ColorOption {
  name: string;
  hex: string;
  description: string;
}

const COLOR_PALETTE: ColorOption[] = [
  { name: 'Sunset Rust', hex: '#B71C1C', description: 'Bold, rich earthy terracotta tone' },
  { name: 'Warm Ivory', hex: '#EAE1CE', description: 'Soft, diffused light off-white warmth' },
  { name: 'Terracotta Soil', hex: '#C5543D', description: 'Natural warmth inspired by classic clay' },
  { name: 'Ocean Breeze', hex: '#D4E6F1', description: 'Cool, serene coastal blue-gray whisper' },
  { name: 'Charcoal Matt', hex: '#2B2E33', description: 'Deep, contemporary dark graphite accent' },
  { name: 'Alabaster White', hex: '#FBFBF9', description: 'Pure, crisp architectural light reflector' },
  { name: 'Olive Canopy', hex: '#556B2F', description: 'Muted forest green with soft olive undertones' },
  { name: 'Classic Cream', hex: '#FDF5E6', description: 'Timeless luxury cream for ambient spaces' },
  { name: 'Sage Garden', hex: '#9CAF88', description: 'Elegant, soothing modern botanical green' },
  { name: 'Steel Blue', hex: '#4682B4', description: 'Balanced metallic blue for clean modern trims' },
];

export default function WhatsAppOrderBuilder() {
  const [selectedBrand, setSelectedBrand] = useState<'all' | 'sandtex' | 'caplux'>('all');
  const [selectedModel, setSelectedModel] = useState<PaintModel>(PAINT_MODELS[0]);
  const [selectedColor, setSelectedColor] = useState<ColorOption>(COLOR_PALETTE[1]); // Warm Ivory
  const [selectedSize, setSelectedSize] = useState<string>(PAINT_MODELS[0].defaultSize);
  const [quantity, setQuantity] = useState<number>(5);
  const [customNotes, setCustomNotes] = useState<string>('');
  const [prefilledMessage, setPrefilledMessage] = useState<string>('');
  const [showPayload, setShowPayload] = useState<boolean>(false);

  // Update selected model if filter changes and current model is filtered out
  useEffect(() => {
    if (selectedBrand !== 'all' && selectedModel.brand !== selectedBrand) {
      const firstAvailable = PAINT_MODELS.find(m => m.brand === selectedBrand);
      if (firstAvailable) {
        setSelectedModel(firstAvailable);
        setSelectedSize(firstAvailable.defaultSize);
      }
    }
  }, [selectedBrand]);

  // Sync size when model changes
  useEffect(() => {
    setSelectedSize(selectedModel.defaultSize);
  }, [selectedModel]);

  // Build dynamic text message
  useEffect(() => {
    const brandName = selectedModel.brand === 'sandtex' ? 'Sandtex Premium' : 'Caplux Professional';
    const colorPart = selectedModel.hasColor
      ? `\n🎨 Selected Colour: ${selectedColor.name} (${selectedColor.hex})`
      : `\n🛠️ Finish Option: Factory-Standard Base (Primer/Sealer/Putty)`;

    const notesPart = customNotes.trim() ? `\n📝 Project Notes: ${customNotes.trim()}` : '';

    const text = `Hello Micmag team! I want to place a paint order using your Bespoke WhatsApp Order Builder:

📦 Paint Range: ${brandName} Series
🏷️ Product Model: ${selectedModel.name}
📐 Pack Size: ${selectedSize}
🔢 Quantity: ${quantity} units${colorPart}${notesPart}

Please assign a formulation expert to verify my order, confirm availability, and provide invoice / transit options to my site. Thank you!`;

    setPrefilledMessage(text);
  }, [selectedModel, selectedColor, selectedSize, quantity, customNotes]);

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleWhatsAppRedirect = () => {
    openWhatsApp('2347052940445', prefilledMessage);
  };

  const handleReset = () => {
    setSelectedBrand('all');
    setSelectedModel(PAINT_MODELS[0]);
    setSelectedColor(COLOR_PALETTE[1]);
    setSelectedSize(PAINT_MODELS[0].defaultSize);
    setQuantity(5);
    setCustomNotes('');
  };

  const filteredModels = selectedBrand === 'all'
    ? PAINT_MODELS
    : PAINT_MODELS.filter(m => m.brand === selectedBrand);

  return (
    <section
      id="whatsapp-order"
      className="py-12 md:py-16 px-5 md:px-[6%] bg-[#FAF9F6] border-b border-neutral-200 scroll-mt-20 relative overflow-hidden"
    >
      {/* Immersive Architectural Background Accents */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#efedea_1px,transparent_1px),linear-gradient(to_bottom,#efedea_1px,transparent_1px)] [background-size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">

        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-12 space-y-3">
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-brand-charcoal tracking-tight leading-tight">
            Bespoke Paint Order Builder
          </h2>
          <p className="text-xs sm:text-sm text-[#57534e] font-light max-w-2xl mx-auto leading-relaxed">
            Configure your custom paint formulation below. We will instantly compile your specifications into a live WhatsApp dispatch ticket for our formulation desk.
          </p>
        </div>

        {/* Builder Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* LEFT: Configuration Panel */}
          <div className="lg:col-span-7 bg-white rounded-3xl border-4 border-brand-charcoal shadow-[8px_8px_0px_0px_var(--color-brand-red-deep)] p-6 sm:p-8 space-y-8">

            {/* Step 1 & 2 Combined: Select Paint Formulation */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label className="text-[10px] sm:text-xs font-mono font-black uppercase tracking-widest text-[#78716c] flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-brand-red" /> 1. Select Paint Formulation
                </label>

                {/* Brand filter tabs */}
                <div className="flex bg-neutral-100 p-1 rounded-xl border border-neutral-200 self-start sm:self-auto">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'sandtex', label: 'Sandtex' },
                    { id: 'caplux', label: 'Caplux' }
                  ].map(brand => (
                    <button
                      key={brand.id}
                      onClick={() => setSelectedBrand(brand.id as any)}
                      className={`px-3 py-1.5 text-[10px] font-bold rounded-lg cursor-pointer transition-all ${selectedBrand === brand.id
                        ? 'bg-brand-charcoal text-white shadow-sm'
                        : 'text-[#57534e] hover:text-brand-charcoal'
                        }`}
                    >
                      {brand.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product selection grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-1 border-2 border-brand-charcoal/25 rounded-2xl p-4 bg-[#FAF9F6] scrollbar-thin scrollbar-thumb-neutral-300">
                {filteredModels.map(model => (
                  <button
                    key={model.name}
                    onClick={() => setSelectedModel(model)}
                    className={`p-4 text-left border-2 rounded-xl transition-all cursor-pointer flex flex-col justify-between h-full min-h-[92px] ${selectedModel.name === model.name
                      ? 'border-brand-red bg-white shadow-sm ring-1 ring-brand-red/30'
                      : 'border-neutral-200 hover:border-brand-charcoal bg-white'
                      }`}
                  >
                    <div className="space-y-1">
                      <div className="text-xs sm:text-sm font-bold text-brand-charcoal">{model.name}</div>
                      {model.subtitle && <div className="text-[10px] text-[#78716c] font-light leading-snug">{model.subtitle}</div>}
                    </div>
                    <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-neutral-400 mt-2">
                      Sizes: {model.sizes.join(' / ')}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Steps 3, 4 & 5 Combined: Options Configurator Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-neutral-200">

              {/* Color Tint Column */}
              <div className="space-y-3">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#78716c] block">
                  2. Color Tint
                </label>

                {selectedModel.hasColor ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 bg-neutral-50 p-2 rounded-xl border border-neutral-200 justify-between">
                      <span className="text-[11px] font-bold text-brand-charcoal truncate">{selectedColor.name}</span>
                      <div className="w-3.5 h-3.5 rounded-full border border-neutral-300 shrink-0" style={{ backgroundColor: selectedColor.hex }} />
                    </div>

                    <div className="grid grid-cols-5 gap-1.5 p-2 bg-[#FAF9F6] border border-neutral-200 rounded-xl">
                      {COLOR_PALETTE.map(color => {
                        const isSelected = selectedColor.name === color.name;
                        return (
                          <button
                            key={color.name}
                            onClick={() => setSelectedColor(color)}
                            title={`${color.name} - ${color.description}`}
                            className={`relative aspect-square rounded-full border overflow-hidden flex items-center justify-center cursor-pointer hover:scale-105 transition-all ${isSelected ? 'border-brand-charcoal ring-1 ring-neutral-400' : 'border-neutral-300'
                              }`}
                            style={{ backgroundColor: color.hex }}
                          >
                            {isSelected && (
                              <div className="bg-white p-0.5 rounded-full shadow-md text-neutral-900 z-10">
                                <Check className="w-2 h-2 stroke-[4] text-brand-red" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50/50 border border-amber-200 text-amber-900 rounded-xl text-center flex flex-col justify-center h-[96px]">
                    <span className="text-[10px] font-bold uppercase">Standard Base</span>
                    <span className="text-[9px] text-amber-800/80 leading-normal font-light mt-1">No custom tint needed</span>
                  </div>
                )}
              </div>

              {/* Pack Size Column */}
              <div className="space-y-3">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#78716c] block">
                  3. Pack Size
                </label>
                <div className="flex flex-col gap-2">
                  {selectedModel.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-full py-2.5 px-3 rounded-xl text-[11px] font-mono font-bold border-2 text-center cursor-pointer transition-all ${selectedSize === size
                        ? 'bg-brand-charcoal text-white border-brand-charcoal shadow-sm'
                        : 'bg-white text-brand-charcoal border-neutral-200 hover:border-neutral-400'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                  {selectedModel.sizes.length === 1 && (
                    <div className="py-2.5 text-center text-[10px] text-neutral-400 font-mono italic">
                      No other sizes
                    </div>
                  )}
                </div>
              </div>

              {/* Batch Quantity Column */}
              <div className="space-y-3">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#78716c] block">
                  4. Quantity
                </label>
                <div className="flex items-center gap-1.5 w-full">
                  <button
                    onClick={handleDecrement}
                    className="p-2.5 border border-neutral-300 rounded-xl bg-white text-brand-charcoal hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex-1 text-center py-2 px-2 border border-neutral-300 bg-neutral-50 text-xs font-bold font-mono rounded-xl">
                    {quantity} <span className="text-[9px] text-neutral-400 font-normal">PCS</span>
                  </div>

                  <button
                    onClick={handleIncrement}
                    className="p-2.5 border border-neutral-300 rounded-xl bg-white text-brand-charcoal hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* Additional Project Notes */}
            <div className="space-y-2.5 pt-4 border-t border-neutral-200">
              <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#78716c] block">
                5. Special Project Instructions (Optional)
              </label>
              <textarea
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="e.g. Include matching undercoats, request delivery to Lekki, or request professional site painters..."
                rows={2}
                className="w-full text-xs sm:text-sm p-3 border-2 border-neutral-200 rounded-xl focus:border-brand-charcoal focus:ring-0 outline-none transition-all font-sans bg-[#FAF9F6] placeholder-neutral-400 focus:bg-white"
              />
            </div>

          </div>

          {/* RIGHT: Specification Sheet & Live Preview */}
          <div className="lg:col-span-5 space-y-6">

            {/* Spec Card */}
            <div className="bg-brand-charcoal rounded-3xl border-4 border-brand-charcoal text-white p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden shadow-[8px_8px_0px_0px_var(--color-brand-red-deep)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/15 rounded-full filter blur-2xl" />

              <div className="flex justify-between items-start border-b border-neutral-800 pb-4">
                <div>
                  <h3 className="text-[9px] font-mono text-brand-red font-bold uppercase tracking-widest">Digital Dispatch Specs</h3>
                  <h4 className="font-serif text-lg font-bold text-neutral-100">Live Order Ticket</h4>
                </div>
                <button
                  onClick={handleReset}
                  title="Reset form specs"
                  className="p-2 text-neutral-400 hover:text-white rounded-xl bg-neutral-900 border border-neutral-800 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Specification fields */}
              <div className="space-y-3.5 text-xs font-mono">
                <div className="flex justify-between border-b border-neutral-800/60 pb-2.5">
                  <span className="text-neutral-400 uppercase tracking-wider text-[9px]">Product:</span>
                  <span className="font-sans font-bold text-neutral-100 text-right max-w-[220px]">{selectedModel.name}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-800/60 pb-2.5">
                  <span className="text-neutral-400 uppercase tracking-wider text-[9px]">Collection:</span>
                  <span className="font-bold text-brand-red">
                    {selectedModel.brand === 'sandtex' ? 'SANDTEX PREMIUM' : 'CAPLUX PREP'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-neutral-800/60 pb-2.5">
                  <span className="text-neutral-400 uppercase tracking-wider text-[9px]">Sizing:</span>
                  <span className="font-bold text-neutral-200">{selectedSize}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-800/60 pb-2.5">
                  <span className="text-neutral-400 uppercase tracking-wider text-[9px]">Quantity:</span>
                  <span className="font-bold text-emerald-400">{quantity} Unit(s)</span>
                </div>

                {selectedModel.hasColor ? (
                  <div className="flex justify-between border-b border-neutral-800/60 pb-2.5 items-center">
                    <span className="text-neutral-400 uppercase tracking-wider text-[9px]">Color:</span>
                    <div className="flex items-center gap-2 bg-neutral-900/80 py-1 px-2.5 rounded-full border border-neutral-800">
                      <div className="w-3 h-3 rounded-full border border-neutral-700 shrink-0" style={{ backgroundColor: selectedColor.hex }} />
                      <span className="font-sans font-bold text-white text-[10px]">{selectedColor.name}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between border-b border-neutral-800/60 pb-2.5">
                    <span className="text-neutral-400 uppercase tracking-wider text-[9px]">Color:</span>
                    <span className="text-neutral-500 italic text-[10px]">Factory Base White</span>
                  </div>
                )}
              </div>

              {/* Optional Collapsed raw preview toggle */}
              <div className="pt-2 border-t border-neutral-800/60">
                <button
                  onClick={() => setShowPayload(!showPayload)}
                  className="text-[9px] font-mono text-neutral-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {showPayload ? '[-]' : '[+]'} View Raw WhatsApp Message
                </button>

                {showPayload && (
                  <div className="mt-2.5 w-full bg-black/40 p-3 border border-neutral-800 rounded-xl text-[9px] font-mono text-neutral-300 whitespace-pre-wrap max-h-[100px] overflow-y-auto leading-normal scrollbar-thin scrollbar-thumb-neutral-800">
                    {prefilledMessage}
                  </div>
                )}
              </div>

              {/* Primary Action Button */}
              <button
                onClick={handleWhatsAppRedirect}
                className="w-full bg-[#25D366] hover:bg-[#1ebe57] active:scale-98 text-white p-4.5 rounded-2xl text-xs sm:text-sm font-mono font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 cursor-pointer shadow-lg hover:shadow-emerald-500/20 border-2 border-emerald-500"
              >
                <svg viewBox="0 0 24 24" className="w-5.5 h-5.5 fill-white shrink-0" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>Dispatch Order via WhatsApp</span>
              </button>
            </div>

            {/* Quality Seals card */}
            <div className="bg-white border-4 border-brand-charcoal rounded-3xl p-6 space-y-4 shadow-[6px_6px_0px_0px_var(--color-brand-red-deep)]">
              <h5 className="text-[10px] sm:text-xs font-mono font-black uppercase tracking-widest text-[#78716c]">Order Protection Assurances</h5>
              <div className="space-y-4">
                <div className="flex gap-3.5 items-start">
                  <div className="p-1.5 bg-emerald-50 rounded-lg border border-emerald-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>
                  <p className="text-[11px] sm:text-xs leading-relaxed text-[#57534e]">
                    <strong className="text-brand-charcoal">Genuine Product Seal:</strong> Every Product of Sandtex and Caplux is sourced directly from Chemical & Allied Products Plc (CAP Plc) to safeguard your structures.
                  </p>
                </div>
                <div className="flex gap-3.5 items-start">
                  <div className="p-1.5 bg-amber-50 rounded-lg border border-amber-200">
                    <Truck className="w-4 h-4 text-brand-red shrink-0" />
                  </div>
                  <p className="text-[11px] sm:text-xs leading-relaxed text-[#57534e]">
                    <strong className="text-brand-charcoal">National Deliveries:</strong> Secure on-site courier transit options are fully calculated and assigned to your invoice based on exact GPS delivery coordinates.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
