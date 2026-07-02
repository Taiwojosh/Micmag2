import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, ShieldCheck, Sun, Layers, Milestone, CheckCircle2 } from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';

const TEXTURE_FINISHES = [
  {
    id: 'structured-stucco',
    name: 'Structured Stucco Finish',
    subtitle: 'Rugged high-build polymer aggregate plaster',
    description: 'A heavily rustic, weather-receptive polymer aggregate plaster engineered for high-impact exterior architectural facades. It expands and contracts dynamically across seasonal climate shifts, remaining highly breathable and completely immunity-proof against algae bloom.',
    cssTexture: 'radial-gradient(ellipse at center, rgba(0,0,0,0.18) 2px, transparent 3px), radial-gradient(circle at 20% 50%, rgba(255,255,255,0.22) 1.5px, transparent 2px)',
    cssBackgroundSize: '10px 10px',
    shadowOpacity: 'opacity-90',
    specularSheen: 0.04,
    roughness: 0.98,
    colorHex: '#B71C1C', // Sunset Rust
    magnifiedStyle: {
      backgroundImage: 'radial-gradient(circle at center, #781d1d 20%, transparent 25%), radial-gradient(circle at center, #ea4c4c 30%, transparent 35%)',
      backgroundSize: '20px 20px',
      backgroundColor: '#9e1b1b',
      boxShadow: 'inset 0 0 35px rgba(0,0,0,0.45)'
    }
  },
  {
    id: 'smooth-matt',
    name: 'Smooth Matt Coating',
    subtitle: 'Wipeable interior premium modern vinyl emulsion',
    description: 'An elegant premium interior vinyl emulsion (modeled after Sandtex VME) spreading with extreme flat warmth. Specially formulated fine pigment particles absorb and diffuse incoming daylight uniformly, concealing wall rendering micro-cracks and providing a velvety, touch-inviting interior canvas.',
    cssTexture: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.06) 1px, transparent 0)',
    cssBackgroundSize: '3px 3px',
    shadowOpacity: 'opacity-15',
    specularSheen: 0.08,
    roughness: 0.85,
    colorHex: '#EAE1CE', // Warm Ivory
    magnifiedStyle: {
      backgroundImage: 'none',
      backgroundColor: '#DCD1B8',
      border: '1px solid rgba(0,0,0,0.08)'
    }
  },
  {
    id: 'textured-matt',
    name: 'Textured Matt (Smooth & Tough)',
    subtitle: 'Legendary quartz sand exterior climate shield',
    description: 'A highly robust, weatherproof sand-blend exterior finish. Infused with professional-grade natural quartz aggregates to form an active mechanical barrier that bridges cracks, resists coastal wind-driven precipitation, and provides superior long-term wall longevity.',
    cssTexture: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 1.5px, transparent 2px)',
    cssBackgroundSize: '6px 6px',
    shadowOpacity: 'opacity-80',
    specularSheen: 0.06,
    roughness: 0.90,
    colorHex: '#C5543D', // Terracotta soil
    magnifiedStyle: {
      backgroundImage: 'radial-gradient(circle at center, #8a3623 15%, transparent 20%), radial-gradient(circle at center, #e06d56 25%, transparent 30%)',
      backgroundSize: '14px 14px',
      backgroundColor: '#a3402c'
    }
  },
  {
    id: 'glazed-glass',
    name: 'Glazed Glass & Vitreous Gloss',
    subtitle: 'Brilliant non-yellowing high-reflection finish',
    description: 'A majestic mirrored enamel coat mirroring the premium double-glazed gloss of high-end architectural metal imports. Contains zero hazardous lead elements, curing into a hard-wearing shield that resists moisture, steam grease, and thermal expansion.',
    cssTexture: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 45%, rgba(0,0,0,0.12) 100%)',
    cssBackgroundSize: '100% 100%',
    shadowOpacity: 'opacity-25',
    specularSheen: 0.95,
    roughness: 0.10,
    colorHex: '#0D9488', // Victoria Teal
    magnifiedStyle: {
      backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.7) 0%, transparent 60%)',
      backgroundSize: '100% 100%',
      backgroundColor: '#0F766E',
      boxShadow: 'inset 0 0 50px rgba(0,0,0,0.35)'
    }
  }
];

const springTransition = {
  type: "spring",
  stiffness: 70,
  damping: 17,
  mass: 0.9
};

export default function TextureSection() {
  const [selectedFinish, setSelectedFinish] = useState(TEXTURE_FINISHES[0]);
  const [isHovered, setIsHovered] = useState(false);
  const [loupePos, setLoupePos] = useState({ x: 0, y: 0 });
  const [lightOffset, setLightOffset] = useState({ x: 50, y: 50 }); // Solar angle slider coords
  const wallContainerRef = useRef<HTMLDivElement>(null);

  // Loupe tracking handle
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!wallContainerRef.current) return;
    const rect = wallContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setLoupePos({ x, y });

    // Simulate real solar specular response based on position
    const percentX = Math.round((x / rect.width) * 100);
    const percentY = Math.round((y / rect.height) * 100);
    setLightOffset({ x: percentX, y: percentY });
  };

  return (
    <section className="py-24 px-5 md:px-[5%] bg-[#F5F4F0] border-b border-neutral-200 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(#e8e3d9_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.45] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Dynamic header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -45 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={springTransition}
            className="lg:col-span-12 xl:col-span-7 space-y-4 text-left"
          >
            <span className="text-[#d32f2f] text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#d32f2f]" /> Premium Finish Standards
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-[2.6rem] font-black text-brand-charcoal leading-tight">
              A Paint Finish Isn't Just Color. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d32f2f] via-amber-600 to-indigo-600 font-serif">
                It Protects Your Investment.
              </span>
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-[#52525b] font-light max-w-2xl text-left">
              Original Sandtex paints feature thick protective layers and specialized mineral grains that safeguard Nigerian homes against seaside salt sprays, moisture, and intense tropical sunlight. Choose a paint option below and see how it feels.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 45 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={springTransition}
            className="lg:col-span-12 xl:col-span-5 lg:pl-10 hidden lg:block"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white border border-neutral-200 p-6 rounded-[6px] flex items-center gap-4 shadow"
            >
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 text-xl font-bold border border-amber-100 shadow-inner">
                ✓
              </div>
              <div className="space-y-0.5 text-left">
                <h4 className="text-xs font-mono font-extrabold uppercase tracking-wider text-brand-charcoal">Weather-Resistant Formulation</h4>
                <p className="text-[11.5px] text-[#71717a] font-light leading-relaxed">Crafted to protect your walls from severe Lagos humidity and tropical rainfall.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Tactile Interactive Visual Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Interactive Rendering Canvas Panel (7 Cols) */}
          <div className="lg:col-span-12 xl:col-span-7 flex flex-col justify-between">
            
            <div className="space-y-3 mb-4 text-left">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="text-[10px] font-mono font-bold text-brand-charcoal uppercase tracking-wider flex items-center gap-1.5 bg-white border border-neutral-200 px-3 py-1 rounded-[2px] shadow-sm">
                  <Eye className="w-3.5 h-3.5 text-[#d32f2f]" /> Paint Texture Preview
                </span>
                
                <span className="text-[11px] text-[#71717a] font-medium font-mono">
                  Move your mouse over the wall to view the textured finish up close
                </span>
              </div>
            </div>

            {/* Central Paint Simulator Canvas with Animated BG */}
            <motion.div 
              id="paint_texture_canvas"
              ref={wallContainerRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={springTransition}
              className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-[6px] border-[12px] border-white shadow-2xl overflow-hidden cursor-crosshair transition-all duration-300 ease-out"
              style={{ backgroundColor: selectedFinish.colorHex }}
            >
              
              {/* Textured Pattern Layer */}
              <div 
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${selectedFinish.shadowOpacity}`}
                style={{
                  backgroundImage: selectedFinish.cssTexture,
                  backgroundSize: selectedFinish.cssBackgroundSize,
                }}
              />

              {/* Dynamic light gradient simulation (following mouse to represent specular reflection) */}
              <div 
                className="absolute inset-0 mix-blend-overlay pointer-events-none"
                style={{
                  background: `radial-gradient(circle at ${lightOffset.x}% ${lightOffset.y}%, rgba(255,255,255,${selectedFinish.specularSheen}) 0%, transparent 60%)`,
                }}
              />

              {/* High-quality vector interior molding & shadow detail (represents room context) */}
              <div className="absolute top-0 inset-x-0 h-8 bg-black/15 shadow-inner pointer-events-none" />
                           {/* Dynamic Overlay Box (Animate presence inside paint wall canvas) */}
              <motion.div 
                key={selectedFinish.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm p-4 rounded-[4px] shadow-lg max-w-[200px] border border-neutral-200 pointer-events-none text-left"
              >
                <span className="text-[8px] font-mono font-bold text-brand-red uppercase tracking-widest block mb-1">
                  FINISH DETAILS
                </span>
                <p className="text-xs font-serif font-black text-brand-charcoal line-clamp-1">
                  {selectedFinish.name}
                </p>
                <div className="mt-2 text-[9px] text-brand-mid font-mono leading-snug">
                  <div>Matt Level: <strong>{selectedFinish.roughness * 100}%</strong></div>
                  <div>Sunlight Protection: <strong>{Math.round((1 - selectedFinish.specularSheen) * 100)}%</strong></div>
                </div>
              </motion.div>

              {/* Magnifying Loupe Window (Shows macro mineral structures) */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    className="absolute w-44 h-44 rounded-full border-[4px] border-white shadow-2xl overflow-hidden pointer-events-none z-30 transition-transform duration-75 select-none"
                    style={{
                      left: `${loupePos.x - 88}px`,
                      top: `${loupePos.y - 88}px`,
                    }}
                  >
                    {/* Magnified Macro Content */}
                    <div 
                      className="w-full h-full flex flex-col items-center justify-center relative"
                      style={selectedFinish.magnifiedStyle}
                    >
                      {/* Sand Particles overlay inside loupe for the textured finish */}
                      {selectedFinish.id === 'textured-matt' && (
                        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(rgba(0,0,0,0.6)_1.5px,transparent_1.5px)] [background-size:6px_6px]" />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/30" />
                      
                      {/* Inner Loupe HUD crosshair representing laboratory microscope precision */}
                      <div className="absolute w-6 h-6 border-t border-b border-white/40" />
                      <div className="absolute h-6 w-6 border-l border-r border-white/40" />
                      
                      {/* Loupe label */}
                      <div className="absolute bottom-2 bg-brand-charcoal/90 text-white text-[8px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-[2px]" style={{ fontSize: '8px' }}>
                        Close-Up View
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>

            {/* Bottom info row */}
            <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-brand-mid">
              <span className="flex items-center gap-1 font-bold">
                <Sun className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" /> Premium Sunlight & UV Protection
              </span>
              <span className="font-bold">Resists Mold, Algae & Moisture</span>
            </div>

          </div>

          {/* Configuration & Explanation details (5 Cols) */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col justify-between space-y-8 text-left">
            
            {/* Selection tab chips */}
            <div className="space-y-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#d32f2f] bg-red-50 px-3 py-1.5 rounded-[2px] inline-block border border-red-100">
                Choose Surface Finish
              </span>
              <h3 className="font-serif text-2xl font-black text-brand-charcoal">
                Explore Our Signature Finishes
              </h3>
              <p className="text-xs font-light text-brand-mid leading-relaxed text-left">
                Select a paint finish below, then move your mouse over the preview wall on the left to see the texture detailed close-up.
              </p>

              {/* Vertical list of finishes - Staggered selection */}
              <div className="space-y-3.5 pt-2">
                {TEXTURE_FINISHES.map((finish) => {
                  const isActive = selectedFinish.id === finish.id;
                  return (
                    <motion.button
                      key={finish.id}
                      onClick={() => setSelectedFinish(finish)}
                      whileHover={{ 
                        scale: 1.03, 
                        x: 6,
                        y: -3,
                        boxShadow: isActive 
                          ? '0 12px 24px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06)' 
                          : '0 8px 16px rgba(0,0,0,0.08)'
                      }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full text-left p-4 rounded-xl border relative overflow-hidden transition-all duration-300 flex items-start gap-4 cursor-pointer group ${
                        isActive
                          ? 'bg-white border-neutral-900 ring-1 ring-neutral-900/5'
                          : 'bg-white hover:bg-neutral-50/70 border-neutral-200'
                      }`}
                      style={{
                        borderColor: isActive ? '#111827' : '#e5e7eb',
                        boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
                      }}
                    >
                      {/* Subtly rendering the actual CSS texture overlay in the background of each preview swatch container */}
                      <div 
                        className="absolute inset-0 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-300 pointer-events-none"
                        style={{ 
                          backgroundImage: finish.cssTexture,
                          backgroundSize: finish.cssBackgroundSize
                        }} 
                      />
                      <div 
                        className="w-10 h-10 rounded-full border border-black/10 flex-shrink-0 flex items-center justify-center text-white text-sm font-bold shadow-inner"
                        style={{ backgroundColor: finish.colorHex }}
                      >
                        {isActive && <CheckCircle2 className="w-5 h-5 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)] text-white" />}
                      </div>

                      <div className="space-y-1 text-left">
                        <div className="font-serif text-[0.93rem] font-bold text-brand-charcoal flex items-center gap-1.5">
                          {finish.name}
                          {!isActive && <span className="text-[9px] text-[#d32f2f] opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-mono font-bold">View Details &rarr;</span>}
                        </div>
                        <p className="text-[10px] text-brand-mid font-bold tracking-wide uppercase font-mono">
                          {finish.subtitle}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Explanation box based on state selection - Smooth dynamic opacity swap */}
            <motion.div 
              key={selectedFinish.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="bg-white border border-neutral-200 p-6 rounded-[4px] space-y-3 text-left shadow-sm"
            >
              <h4 className="text-xs font-mono font-extrabold uppercase tracking-wider text-brand-charcoal flex items-center gap-1.5">
                <Milestone className="w-4 h-4 text-[#d32f2f]" /> Technical Specification Guide
              </h4>
              <p className="text-xs font-light text-[#52525b] leading-relaxed">
                {selectedFinish.description}
              </p>
              
              <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-[10px] font-mono">
                <span className="text-[#71717a] font-bold uppercase">Ideal Application:</span>
                <span className="font-extrabold text-[#d32f2f] uppercase">
                  {selectedFinish.id === 'textured-matt' ? 'Exterior Facades' : selectedFinish.id === 'satin-sheen' ? 'Kitchens / Corridors' : 'Bedrooms & Living Areas'}
                </span>
              </div>
            </motion.div>

            {/* Grand Conversion Trigger */}
            <div className="bg-gradient-to-r from-neutral-900 to-brand-charcoal text-white p-5 rounded-[4px] border border-neutral-800 shadow-lg space-y-3 relative overflow-hidden mt-4">
              <div className="absolute right-0 bottom-0 w-32 h-32 bg-brand-red/15 rounded-full filter blur-[30px] pointer-events-none" />
              <div className="space-y-1 relative z-10">
                <h4 className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#d32f2f] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d32f2f] animate-pulse" /> Request Real Swatch Sample
                </h4>
                <p className="text-[11px] text-neutral-400 font-light leading-relaxed">
                  Would you like to review physical paint cards or luxury textures live on your construction site before confirming project formulation?
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 pt-1.5 relative z-10">
                <button
                  type="button"
                  onClick={() => {
                    const text = `Hello! I am viewing your Fine Sand Textured/Satin finishes page and would like to request a physical swatch sample card for the "${selectedFinish.name}" finish.`;
                    openWhatsApp('2347052940445', text);
                  }}
                  className="flex-1 bg-[#25D366] hover:bg-[#1ebd59] text-white text-[10px] font-mono font-bold uppercase tracking-wider py-2.5 px-3 rounded-[2px] transition-all duration-200 text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white shrink-0" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>WhatsApp Sample</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const msg = `Hello, I am inspecting your signature texture finish: "${selectedFinish.name}". I would like to schedule a site appraisal or receive a physical sample to review texture density and color compatibility.`;
                    window.dispatchEvent(new CustomEvent('applyPaintEstimate', {
                      detail: {
                        inquiryType: 'SANDTEX Paints',
                        message: msg
                      }
                    }));
                    const contactSection = document.getElementById('contact');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="flex-1 bg-white hover:bg-neutral-100 text-brand-charcoal text-[10px] font-mono font-bold uppercase tracking-wider py-2.5 px-3 rounded-[2px] transition-all duration-200 text-center flex items-center justify-center gap-1 cursor-pointer shadow-sm border border-neutral-200"
                >
                  📋 Consult Advisor
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
