import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, Layers, ShoppingBag, Plus, Minus, Send, Check, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';

interface PaintModel {
  name: string;
  brand: 'sandtex' | 'caplux';
  hasColor: boolean;
  sizes: string[];
  defaultSize: string;
}

const PAINT_MODELS: PaintModel[] = [
  // Sandtex
  { name: 'Sandtex VME (Vinyl Matt Emulsion) 20L/4L', brand: 'sandtex', hasColor: true, sizes: ['20 Liters', '4 Liters'], defaultSize: '20 Liters' },
  { name: 'Sandtex Select VME 20L', brand: 'sandtex', hasColor: true, sizes: ['20 Liters'], defaultSize: '20 Liters' },
  { name: 'Sandtex Satin 20L/4L', brand: 'sandtex', hasColor: true, sizes: ['20 Liters', '4 Liters'], defaultSize: '20 Liters' },
  { name: 'Sandtex Trade Smooth 20L', brand: 'sandtex', hasColor: true, sizes: ['20 Liters', '5 Liters'], defaultSize: '20 Liters' },
  { name: 'Sandtex Gloss 4L', brand: 'sandtex', hasColor: true, sizes: ['4 Liters', '1 Liter'], defaultSize: '4 Liters' },
  // Caplux
  { name: 'Caplux Premium Acrylic Putty 20kg', brand: 'caplux', hasColor: false, sizes: ['20 kg Bag'], defaultSize: '20 kg Bag' },
  { name: 'Caplux Alkali Resisting Primer 20L', brand: 'caplux', hasColor: false, sizes: ['20 Liters'], defaultSize: '20 Liters' },
  { name: 'Caplux Red Oxide Anti-Rust Primer 4L', brand: 'caplux', hasColor: false, sizes: ['4 Liters'], defaultSize: '4 Liters' },
  { name: 'Caplux Gypsum (POP) Primer 20L', brand: 'caplux', hasColor: false, sizes: ['20 Liters'], defaultSize: '20 Liters' },
  { name: 'Caplux Solvent Stabilizing Sealer 20L', brand: 'caplux', hasColor: false, sizes: ['20 Liters'], defaultSize: '20 Liters' },
  { name: 'Caplux Eco-Base Undercoat 20L', brand: 'caplux', hasColor: false, sizes: ['20 Liters'], defaultSize: '20 Liters' },
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
      className="py-24 md:py-32 px-5 md:px-[6%] bg-[#FAF9F6] border-b border-neutral-200 scroll-mt-20 relative overflow-hidden min-h-screen flex flex-col justify-center"
    >
      {/* Immersive Architectural Background Accents */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#efedea_1px,transparent_1px),linear-gradient(to_bottom,#efedea_1px,transparent_1px)] [background-size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-amber-500/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-brand-red/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-20 space-y-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white border-2 border-[#1c1917] text-[#1c1917] rounded-full shadow-[2px_2px_0px_0px_#1c1917]">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-emerald-600 shrink-0" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span className="text-[10px] sm:text-xs font-mono font-black uppercase tracking-widest text-[#1c1917]">FORMULATION DISPATCH SYSTEM &bull; ONLINE</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1c1917] tracking-tight leading-[1.08] lg:-mt-2">
            Bespoke Paint Order Builder
          </h2>
          <div className="w-16 h-1 bg-brand-red mx-auto rounded" />
          <p className="text-sm md:text-lg text-[#57534e] font-light max-w-2xl mx-auto leading-relaxed">
            Configure your technical paint formulations dynamically. Your customized specs, precise color codes, and volume quantities are compiled instantly into a live dispatch ticket ready for direct liaison with our formulation desk.
          </p>
        </div>

        {/* Builder Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT: Configuration Panel */}
          <div className="lg:col-span-7 bg-white rounded-3xl border-4 border-[#1c1917] shadow-[8px_8px_0px_0px_#1c1917] p-6 sm:p-10 space-y-8">
            
            {/* Step 1: Filter by Paint Brand */}
            <div className="space-y-4">
              <label className="text-[10px] sm:text-xs font-mono font-black uppercase tracking-widest text-[#78716c] flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-red" /> Step 1: Select Brand Group
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'all', label: 'All Coatings' },
                  { id: 'sandtex', label: 'Sandtex Premium' },
                  { id: 'caplux', label: 'Caplux Prep' }
                ].map(brand => (
                  <button
                    key={brand.id}
                    onClick={() => setSelectedBrand(brand.id as any)}
                    className={`py-3 px-2 sm:px-4 text-xs font-mono font-bold border-2 transition-all cursor-pointer text-center rounded-xl ${
                      selectedBrand === brand.id
                        ? 'bg-[#1c1917] text-white border-[#1c1917] shadow-[3px_3px_0px_0px_#ea6c00]'
                        : 'bg-white text-[#1c1917] border-[#1c1917] hover:bg-neutral-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.06)]'
                    }`}
                  >
                    {brand.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Choose Paint Model */}
            <div className="space-y-4">
              <label className="text-[10px] sm:text-xs font-mono font-black uppercase tracking-widest text-[#78716c] flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#ea6c00]" /> Step 2: Select Paint Formulation
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[260px] overflow-y-auto pr-1 border-2 border-[#1c1917] rounded-xl p-3 bg-white scrollbar-thin scrollbar-thumb-neutral-200">
                {filteredModels.map(model => (
                  <button
                    key={model.name}
                    onClick={() => setSelectedModel(model)}
                    className={`p-4 text-left border-2 rounded-xl transition-all cursor-pointer flex flex-col gap-1.5 shadow-sm hover:translate-y-[-1px] ${
                      selectedModel.name === model.name
                        ? 'border-brand-red bg-[#d32f2f]/5 shadow-sm shadow-red-100/50'
                        : 'border-[#1c1917]/20 hover:border-[#1c1917] bg-white'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-bold text-[#1c1917]">{model.name}</span>
                    <span className="text-[9.5px] font-mono font-black uppercase tracking-widest text-[#78716c]">
                      {model.brand === 'sandtex' ? 'Sandtex Premium' : 'Caplux Prep'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Color Picker (Conditionally Rendered) */}
            <AnimatePresence mode="wait">
              {selectedModel.hasColor ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] sm:text-xs font-mono font-black uppercase tracking-widest text-[#78716c] flex items-center gap-2">
                      <Palette className="w-4 h-4 text-brand-red" /> Step 3: Select Color Tint
                    </label>
                    <span className="text-xs font-mono font-bold text-white bg-brand-red px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_#1c1917] border-2 border-[#1c1917]">
                      🎨 {selectedColor.name}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5 p-4 bg-white border-2 border-[#1c1917] rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,0.05)]">
                    {COLOR_PALETTE.map(color => {
                      const isSelected = selectedColor.name === color.name;
                      return (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(color)}
                          title={`${color.name} - ${color.description}`}
                          className={`relative aspect-square rounded-full border-2 overflow-hidden flex items-center justify-center group cursor-pointer hover:scale-110 active:scale-95 transition-all ${
                            isSelected ? 'border-brand-red ring-2 ring-red-200' : 'border-neutral-300'
                          }`}
                          style={{ backgroundColor: color.hex }}
                        >
                          <span className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                          {isSelected && (
                            <div className="bg-white p-0.5 rounded-full shadow-md text-neutral-900 z-10 animate-scaleIn">
                              <Check className="w-2.5 h-2.5 stroke-[4] text-brand-red" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-[#57534e] font-light leading-relaxed">
                    💡 Selected shade: <span className="font-bold text-[#1c1917]">{selectedColor.name}</span> — {selectedColor.description}. Our formulation machine mixes this exactly to the CAP Plc color index.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 bg-amber-50 border-2 border-amber-200 text-amber-900 rounded-2xl flex gap-3.5 items-start"
                >
                  <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider">Standard Base Paint</h4>
                    <p className="text-[11px] leading-relaxed font-light">
                      This product is factory-formulated as a high-density white putty, bonding sealer, or anti-corrosive primer coating. It does not require custom tinting.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 4: Sizing & Volume */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-neutral-200">
              
              {/* Sizing selection */}
              <div className="space-y-3">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#78716c]">
                  Step 4: Pack Size
                </label>
                <div className="flex gap-2">
                  {selectedModel.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`flex-1 py-3 px-3 rounded-xl text-xs font-mono font-bold border-2 text-center cursor-pointer transition-all ${
                        selectedSize === size
                          ? 'bg-[#1c1917] text-white border-[#1c1917] shadow-[2px_2px_0px_0px_#ea6c00]'
                          : 'bg-white text-[#1c1917] border-[#1c1917]/20 hover:border-[#1c1917] hover:bg-neutral-50 shadow-[1px_1px_0px_0px_rgba(0,0,0,0.04)]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity incrementer */}
              <div className="space-y-3">
                <label className="text-[10px] sm:text-xs font-mono font-black uppercase tracking-widest text-[#78716c] block">
                  Step 5: Batch Quantity
                </label>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleDecrement}
                    className="p-3 border-2 border-[#1c1917] rounded-xl bg-white text-[#1c1917] hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer shadow-[2px_2px_0px_0px_#1c1917]"
                  >
                    <Minus className="w-4 h-4 stroke-[2.5]" />
                  </button>
                  <div className="flex-1 text-center py-2.5 px-4 border-2 border-[#1c1917] bg-[#FAF9F6] text-sm font-black font-mono rounded-xl shadow-[inner_1px_1px_3px_rgba(0,0,0,0.1)]">
                    {quantity} <span className="text-[10px] text-neutral-400 font-normal">UNIT(S)</span>
                  </div>
                  <button
                    onClick={handleIncrement}
                    className="p-3 border-2 border-[#1c1917] rounded-xl bg-white text-[#1c1917] hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer shadow-[2px_2px_0px_0px_#1c1917]"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>

            </div>

            {/* Additional Project Notes */}
            <div className="space-y-3">
              <label className="text-[10px] sm:text-xs font-mono font-black uppercase tracking-widest text-[#78716c] block">
                Step 6: Custom Delivery / Project Guidelines (Optional)
              </label>
              <textarea
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="e.g. Please supply matching screeding aggregates, delivery needed in Ikeja, or requests for professional site painters..."
                rows={2}
                className="w-full text-xs sm:text-sm p-4 border-2 border-[#1c1917]/20 rounded-xl focus:border-[#1c1917] focus:ring-0 outline-none transition-all font-sans bg-[#FAF9F6] placeholder-neutral-400 focus:bg-white"
              />
            </div>

          </div>

          {/* RIGHT: Specification Sheet & Live Preview */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Spec Card */}
            <div className="bg-[#1c1917] rounded-3xl border-4 border-[#1c1917] text-white p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden shadow-[8px_8px_0px_0px_#1c1917]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ea6c00]/15 rounded-full filter blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-red/10 rounded-full filter blur-2xl" />
              
              <div className="flex justify-between items-start border-b border-neutral-800 pb-5">
                <div>
                  <h3 className="text-[10px] font-mono text-brand-red font-black uppercase tracking-widest">Digital Dispatch Specs</h3>
                  <h4 className="font-serif text-xl font-extrabold text-neutral-100">Live Order Ticket</h4>
                </div>
                <button 
                  onClick={handleReset}
                  title="Reset form specs"
                  className="p-2.5 text-neutral-400 hover:text-white rounded-xl bg-neutral-900 border-2 border-neutral-850 hover:border-brand-red transition-all cursor-pointer hover:scale-105 active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Specification fields */}
              <div className="space-y-3.5 text-xs font-mono">
                <div className="flex justify-between border-b border-neutral-800/60 pb-2.5">
                  <span className="text-neutral-400 uppercase tracking-wider text-[10px]">Product:</span>
                  <span className="font-sans font-bold text-neutral-100 text-right max-w-[220px]">{selectedModel.name}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-800/60 pb-2.5">
                  <span className="text-neutral-400 uppercase tracking-wider text-[10px]">Collection:</span>
                  <span className="font-bold text-brand-red">
                    {selectedModel.brand === 'sandtex' ? 'SANDTEX PREMIUM' : 'CAPLUX PREP'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-neutral-800/60 pb-2.5">
                  <span className="text-neutral-400 uppercase tracking-wider text-[10px]">Sizing:</span>
                  <span className="font-bold text-neutral-200">{selectedSize}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-800/60 pb-2.5">
                  <span className="text-neutral-400 uppercase tracking-wider text-[10px]">Quantity:</span>
                  <span className="font-bold text-emerald-400">{quantity} Unit(s)</span>
                </div>
                
                {selectedModel.hasColor ? (
                  <div className="flex justify-between border-b border-neutral-800/60 pb-2.5 items-center">
                    <span className="text-neutral-400 uppercase tracking-wider text-[10px]">Tint Option:</span>
                    <div className="flex items-center gap-2 bg-neutral-900/80 py-1 px-2.5 rounded-full border border-neutral-800">
                      <div className="w-3 h-3 rounded-full border border-neutral-700 shrink-0" style={{ backgroundColor: selectedColor.hex }} />
                      <span className="font-sans font-bold text-white text-[11px]">{selectedColor.name}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between border-b border-neutral-800/60 pb-2.5">
                    <span className="text-neutral-400 uppercase tracking-wider text-[10px]">Tint Option:</span>
                    <span className="text-neutral-500 italic text-[11px]">Factory Base White</span>
                  </div>
                )}
              </div>

              {/* Textbox prefilled preview */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-mono font-black uppercase tracking-widest text-[#78716c] block">
                  Encrypted Message Payload
                </label>
                <div className="w-full bg-black/60 p-4 border-2 border-neutral-850 rounded-2xl text-[11px] font-mono text-neutral-300 whitespace-pre-wrap max-h-[140px] overflow-y-auto leading-relaxed scrollbar-thin scrollbar-thumb-neutral-800">
                  {prefilledMessage}
                </div>
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
            <div className="bg-white border-4 border-[#1c1917] rounded-3xl p-6 space-y-4 shadow-[6px_6px_0px_0px_#1c1917]">
              <h5 className="text-[10px] sm:text-xs font-mono font-black uppercase tracking-widest text-[#78716c]">Order Protection Assurances</h5>
              <div className="space-y-4">
                <div className="flex gap-3.5 items-start">
                  <div className="p-1.5 bg-emerald-50 rounded-lg border border-emerald-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>
                  <p className="text-[11px] sm:text-xs leading-relaxed text-[#57534e]">
                    <strong className="text-[#1c1917]">Genuine Product Seal:</strong> Every tin of Sandtex and Caplux is sourced directly from Chemical & Allied Products Plc (CAP Plc) to safeguard your structures.
                  </p>
                </div>
                <div className="flex gap-3.5 items-start">
                  <div className="p-1.5 bg-amber-50 rounded-lg border border-amber-200">
                    <Truck className="w-4 h-4 text-[#ea6c00] shrink-0" />
                  </div>
                  <p className="text-[11px] sm:text-xs leading-relaxed text-[#57534e]">
                    <strong className="text-[#1c1917]">National Deliveries:</strong> Secure on-site courier transit options are fully calculated and assigned to your invoice based on exact GPS delivery coordinates.
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
