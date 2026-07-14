import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ArrowUpRight, PaintBucket } from 'lucide-react';

const FLAGSHIP_COLORS = [
  {
    name: "Sandtex Majestic Orange",
    hex: "#FF6B00",
    description: "Vibrant and authentic sandtex orange tone.",
    themeClass: "from-[#FF6B00]/20 to-neutral-950/10",
  },
  {
    name: "Lekki Terracotta",
    hex: "#B8442E",
    description: "Deep luxury clay-tone paint.",
    themeClass: "from-red-600/20 to-neutral-950/10",
  },
  {
    name: "Kano Crimson Cream",
    hex: "#D32F2F",
    description: "Pure intense premium crimson.",
    themeClass: "from-red-700/20 to-neutral-950/10",
  },
  {
    name: "Eko Alabaster Satin",
    hex: "#C5A880",
    description: "Sophisticated premium sand-stone gold.",
    themeClass: "from-amber-600/20 to-neutral-950/10",
  },
  {
    name: "Classic Charcoal",
    hex: "#1C1917",
    description: "Sleek and modern dark neutral.",
    themeClass: "from-neutral-800/20 to-neutral-950/10",
  }
];

const springTransition = {
  type: "spring",
  stiffness: 75,
  damping: 18,
  mass: 0.8
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

const fadeUpVariant = {
  initial: { opacity: 0, y: 35 },
  animate: { opacity: 1, y: 0, transition: springTransition }
};

export default function Hero() {
  const [activeColor, setActiveColor] = useState<typeof FLAGSHIP_COLORS[0] | null>(null);

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] md:min-h-[92vh] flex flex-col justify-center pt-24 md:pt-32 pb-32 md:pb-24 px-5 md:px-[5%] overflow-hidden bg-brand-cream border-b border-neutral-200 transition-colors duration-700"
    >
      {/* Dynamic Background Tint based on active color */}
      <AnimatePresence>
        {activeColor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundColor: activeColor.hex }}
          />
        )}
      </AnimatePresence>

      {/* Subtle Architectural Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#1c1917 1px, transparent 1px), linear-gradient(90deg, #1c1917 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center z-10 flex-grow">
        
        {/* Left Column: Editorial Typography */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="lg:col-span-6 flex flex-col items-start text-left space-y-8"
        >
          {/* Partner Badge */}
          <motion.div
            variants={fadeUpVariant}
            className="inline-flex items-center gap-2 text-[#f4efe5] px-4 py-2 rounded-full shadow-sm border border-neutral-800"
            style={{ backgroundColor: '#1c1917' }}
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-micmag-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-micmag-red"></span>
            </span>
            <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em]">
              Official Sandtex Partner
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUpVariant}
            className="font-serif text-5xl sm:text-6xl lg:text-[72px] leading-[0.95] font-black text-brand-charcoal tracking-tight"
          >
            Prestige <br />
            <span className="text-micmag-red italic font-light tracking-normal">Interiors.</span><br />
            Uncompromising <br />
            Craft.
          </motion.h1>

          {/* Description with Vertical Line Accent */}
          <motion.div variants={fadeUpVariant} className="flex gap-4 items-start max-w-xl">
            <div className="w-1 h-full min-h-[60px] bg-amber-600 shrink-0 mt-1" />
            <p className="text-sm sm:text-base leading-relaxed text-brand-charcoal/80 font-light">
              Welcome to <strong>Micmag Homes & Fittings</strong>. We supply heavy-duty, climate-proof <strong>Sandtex paints</strong> and high-integrity <strong>Caplux primers</strong> engineered for Nigeria's tropical humidity and coastal salts.
            </p>
          </motion.div>

          {/* Elegant CTAs */}
          <motion.div
            variants={fadeUpVariant}
            className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto pt-4"
          >
            <Link
              to="/contact"
              className="group relative h-12 inline-flex items-center justify-center gap-3 rounded-none bg-micmag-red text-white px-8 font-bold tracking-[0.15em] text-[11px] uppercase overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                Book Consultation <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-[#a32222] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out" />
            </Link>

            <Link
              to="/collections"
              className="group h-12 inline-flex items-center justify-center gap-2 px-6 font-bold tracking-[0.15em] text-[11px] uppercase text-brand-charcoal border-b-2 border-brand-charcoal/20 hover:border-brand-charcoal transition-colors duration-300"
            >
              View Catalogue <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Column: Asymmetrical Image Grid */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="lg:col-span-6 relative h-[500px] sm:h-[600px] w-full mt-10 lg:mt-0"
        >
          {/* Main Arched Image */}
          <div className="absolute right-0 top-0 w-[80%] h-[90%] rounded-t-[200px] rounded-b-[40px] overflow-hidden shadow-2xl border-4 border-white">
            <img 
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800" 
              alt="Luxury Interior" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Accent Overlapping Square Image */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-[5%] bottom-[15%] w-[45%] aspect-square rounded-2xl overflow-hidden shadow-xl border-4 border-white z-20"
          >
            <img 
              src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=600" 
              alt="Detailed Texture" 
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Floating Paint Bucket Accent */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.8 }}
            className="absolute right-[10%] bottom-[5%] bg-white p-3 rounded-full shadow-lg z-30"
          >
            <div className="bg-micmag-red w-12 h-12 rounded-full flex items-center justify-center">
              <PaintBucket className="w-5 h-5 text-white" />
            </div>
          </motion.div>
        </motion.div>

      </div>

      {/* Floating Interactive Color Bar */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="absolute bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-neutral-200 py-4 px-5 md:px-[5%] z-20 flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <div className="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal/60 flex items-center gap-2">
          <span>Signature Palettes</span>
          <div className="w-8 h-px bg-brand-charcoal/20" />
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar max-w-full pb-2 md:pb-0">
          {FLAGSHIP_COLORS.map((color) => (
            <button
              key={color.name}
              onMouseEnter={() => setActiveColor(color)}
              onMouseLeave={() => setActiveColor(null)}
              className="group relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-all shrink-0 cursor-pointer"
            >
              <span 
                className="w-4 h-4 rounded-full shadow-inner border border-black/10 transition-transform group-hover:scale-110"
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-[10px] font-medium text-brand-charcoal group-hover:text-black transition-colors">
                {color.name}
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
