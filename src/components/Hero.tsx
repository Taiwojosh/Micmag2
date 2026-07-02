import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Paintbrush, ShieldCheck, ChevronRight, ChevronLeft, Droplet, Layers, Check, Sparkles } from 'lucide-react';

const FLAGSHIP_COLORS = [
  {
    name: "Sandtex Majestic Orange",
    hex: "#FF6B00",
    description: "Vibrant and authentic sandtex orange tone, engineered with premium weather-protection.",
    themeClass: "from-[#FF6B00]/20 to-neutral-950/10",
  },
  {
    name: "Sunset Marigold",
    hex: "#F95700",
    description: "Rich high-vibrancy architectural marigold. Premium UV block shields fading under intense tropical sun.",
    themeClass: "from-orange-600/20 to-red-950/10",
  },
  {
    name: "Lekki Terracotta",
    hex: "#B8442E",
    description: "Deep luxury clay-tone paint, built to withstand aggressive coastal humidity with majestic elegance.",
    themeClass: "from-red-600/20 to-neutral-950/10",
  },
  {
    name: "Kano Crimson Cream",
    hex: "#D32F2F",
    description: "Pure intense premium crimson. Special moisture-shielding protection for prestigious estates.",
    themeClass: "from-red-700/20 to-neutral-950/10",
  },
  {
    name: "Eko Alabaster Satin",
    hex: "#C5A880",
    description: "Sophisticated premium sand-stone gold, standard finish for modern Lekki developments.",
    themeClass: "from-amber-600/20 to-neutral-950/10",
  }
];

const SANDTEX_SLIDES = [
  {
    name: "Luxury Living Room",
    tag: "Interior Velvet Finish",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800",
    description: "Elegant modern living room coated with our premium Sandtex Velvet.",
    color: "#d32f2f"
  },
  {
    name: "Modern Kitchen Layout",
    tag: "Stain-Resistant Matt",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800",
    description: "Pristine white kitchen walls protected by Sandtex wipeable matt.",
    color: "#ea6c00"
  },
  {
    name: "Serene Bedroom Space",
    tag: "Calming Satin Finish",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=800",
    description: "Restful ambiance achieved with Sandtex Premium Satin tones.",
    color: "#b45309"
  },
  {
    name: "Sandtex Premium Satin",
    tag: "Interior & Exterior Semi-Gloss",
    image: "./satin1.png",
    description: "Elite washable emulsion for luxury spaces",
    color: "#ea6c00"
  },
  {
    name: "Sandtex Select VME",
    tag: "Interior & Exterior Matt",
    image: "./Sandtex select VME.png",
    description: "Ready-mix premium wall & ceiling finish with high yield",
    color: "#d32f2f"
  },
  {
    name: "Sandtex Smooth & Tough Matt",
    tag: "Ultimate Exterior Shield",
    image: "./Sandtex MATT.png",
    description: "Anti-fungal weather preservation for aggressive coastal rain",
    color: "#ea6c00"
  },
  {
    name: "Sandtex Trade Smooth",
    tag: "Professional Elite Masonry",
    image: "./Sandtex Trade Smooth.png",
    description: "Tremendous yield exterior paint favored by top developers",
    color: "#b45309"
  },
  {
    name: "Sandtex Classic VME",
    tag: "Interior Contract Classic",
    image: "./Sandtex VME.png",
    description: "Standard grade vinyl matt with superior opacity",
    color: "#ea6c00"
  },
  {
    name: "Sandtex FineBuild",
    tag: "Textured Primer Build",
    image: "./Sandtex FineBuild.png",
    description: "Bridges hairline cracks & stabilizes porous walls",
    color: "#78716c"
  },
  {
    name: "Sandtex Brilliant Gloss",
    tag: "Multi-surface Gloss Enamel",
    image: "./Sandtex GLOSS.png",
    description: "Heavy-duty lead-free polyurethane gloss for metals & wood",
    color: "#ea6c00"
  }
];

const MICMAG_SLIDES = [
  {
    name: "Premium Interior Walls",
    tag: "Decorative Matt Finish",
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800",
    description: "Ultra-smooth high-opacity Matt emulsions for luxury interiors.",
    color: "#1e3a5f"
  },
  {
    name: "Heavy-Duty Exterior Shield",
    tag: "Sandtex Smooth & Textured",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800",
    description: "Weather-locked polymer exterior paints resisting coastal Lagos rain and heat.",
    color: "#1a6b3c"
  },
  {
    name: "Caplux Industrial Primers",
    tag: "Alkaline Primers & Sealers",
    image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=800",
    description: "High-adhesion acrylic primers to lock salts and prevent coating peeling.",
    color: "#1e3a5f"
  },
  {
    name: "Custom Color Tinting",
    tag: "Precision Formulas",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800",
    description: "Computerized automatic paint tinting to match any design shade.",
    color: "#b45309"
  },
  {
    name: "Architectural Texture Boards",
    tag: "Trowel & Roller Finishes",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800",
    description: "Plaster texture patterns, stucco effect coat, and premium exterior cladding look.",
    color: "#1a6b3c"
  },
  {
    name: "Anti-Corrosive Metal Coatings",
    tag: "Gloss & Red Oxide Primers",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800",
    description: "Protective gloss enamels shielding wood, steel gates, and burglar bars.",
    color: "#78716c"
  }
];

// Spring transitions for professional high-end movements
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

const HERO_VIDEOS = [
  "./a_video_for_the_landing_page_o.mp4",
  "./A_video_of_a_Nigerian_middle_a.mp4"
];

export default function Hero() {
  const [videoIndex, setVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [slideIndex, setSlideIndex] = useState(0);
  const [isHoveringSlides, setIsHoveringSlides] = useState(false);

  const currentSlides = [...MICMAG_SLIDES, ...SANDTEX_SLIDES];
  const currentIndex = slideIndex;
  const currentSlideItem = currentSlides[currentIndex];
  const isPaintImage = currentSlideItem.image.includes('.png') || currentSlideItem.name.includes('Sandtex');

  // Auto-cycle slideshows
  useEffect(() => {
    if (isHoveringSlides) return;

    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % currentSlides.length);
    }, 4500); // cycle every 4.5 seconds

    return () => clearInterval(interval);
  }, [isHoveringSlides, currentSlides.length]);

  const handlePrevSlide = () => {
    setSlideIndex((prev) => (prev - 1 + currentSlides.length) % currentSlides.length);
  };

  const handleNextSlide = () => {
    setSlideIndex((prev) => (prev + 1) % currentSlides.length);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch((err) => {
        console.warn("Video autoPlay failed or was interrupted:", err);
      });
    }
  }, [videoIndex]);

  const handleVideoEnded = () => {
    setVideoIndex((prevIndex) => (prevIndex + 1) % HERO_VIDEOS.length);
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-[100svh] md:min-h-[92vh] flex items-center pt-24 md:pt-32 pb-16 md:pb-24 px-5 md:px-[5%] overflow-hidden bg-[#faf9f5] border-b border-neutral-200"
    >
      {/* Background Video (Seamlessly loops through custom playlist) */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnded}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-75 object-center md:object-[right_top]"
      >
        <source src={HERO_VIDEOS[videoIndex]} type="video/mp4" />
      </video>

      {/* Background Overlay to ensure readability and match aesthetic */}
      <div className="absolute inset-0 bg-[#faf9f5]/50 pointer-events-none z-0" />

      {/* Structural Architectural background patterns - Animated scale */}
      <motion.div 
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-[radial-gradient(#0c0d10_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-[0.05] pointer-events-none" 
      />
      
      {/* Blocky decorative accent with smooth sliding animation on entrance */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 0.22 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute -left-12 top-0 w-24 h-full bg-[#fcd34d] transform -skew-x-12 pointer-events-none" 
      />

      {/* Dynamic Glowing Paint Backdrop Blobs */}
      <motion.div 
        key="unified-hero-glow"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.1, opacity: 0.24 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="absolute -right-32 -top-32 w-[650px] h-[650px] rounded-full filter blur-[110px] bg-gradient-to-br from-amber-600/20 to-neutral-900/10 pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.15, 0.95, 1], 
          x: [0, 20, -10, 0],
          y: [0, -20, 15, 0] 
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-5 left-[5%] w-[380px] h-[380px] bg-amber-500/10 rounded-full filter blur-[90px] pointer-events-none" 
      />

      <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-10 items-center z-10 mt-8 md:mt-0">
        
        {/* Left Column: Premium Pitch Header Copy */}
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="lg:col-span-7 flex flex-col items-start text-left space-y-6"
        >
          
          {/* Vibrant Authorized Partner Tag with slide-down/fade-in */}
          <motion.div 
            variants={fadeUpVariant}
            className="inline-flex items-center gap-2 text-[#f4efe5] px-4 py-2 rounded-[15px] shadow-lg border border-neutral-800"
            style={{ backgroundColor: '#242d48' }}
          >
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="text-[8px] font-serif font-bold uppercase tracking-widest" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
              AUTHORIZED SANDTEX® DISTRIBUTOR
            </span>
          </motion.div>

          <motion.h1 
            variants={fadeUpVariant}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-[1.04] font-black text-brand-charcoal tracking-tight"
          >
            Prestige Interiors. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-500 to-indigo-600">
              Uncompromising Craft.
            </span>
          </motion.h1>

          <motion.p 
            variants={fadeUpVariant}
            className="text-xs sm:text-sm md:text-[15px] leading-relaxed text-brand-mid font-light max-w-2xl"
          >
            Welcome to <strong>Micmag Homes & Fittings</strong>, the ultimate destination for premium architectural finishes and substrate preservation. We offer the heavy-duty, climate-proof durability of genuine <strong>Sandtex® paints</strong> combined with high-integrity <strong>Caplux® industrial primers</strong> and custom textured finishes engineered to withstand Nigeria's tropical humidity and coastal salts.
          </motion.p>




          {/* CTAs with beautiful dynamic bounce animations */}
          <motion.div 
            variants={fadeUpVariant}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2"
          >
            <motion.div
              whileHover={{ scale: 1.05, translateY: -3 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Link
                to="/contact"
                style={{ 
                  backgroundColor: '#dde0ff',
                  borderStyle: 'none'
                }}
                className="w-full sm:w-[225px] h-[46px] sm:h-[48px] text-[10px] sm:text-[11px] inline-flex items-center justify-center gap-2 rounded-[60px] font-bold tracking-[0.15em] uppercase transition-all duration-300 shadow-lg cursor-pointer hover:bg-brand-charcoal hover:text-white border-none group"
              >
                <span className="!text-[#000082] group-hover:!text-white" style={{ paddingLeft: '19px' }}>Consultation</span>
                <ChevronRight className="w-4 h-4 flex-shrink-0 !text-[#000082] group-hover:!text-white" />
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, translateY: -3 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Link
                to="/collections"
                style={{ borderStyle: 'none' }}
                className="w-full sm:w-[225px] h-[46px] sm:h-[48px] text-[10px] sm:text-[11px] inline-flex items-center justify-center text-brand-charcoal rounded-[60px] font-bold tracking-[0.15em] uppercase hover:bg-brand-charcoal hover:text-white transition-colors duration-300 shadow-sm cursor-pointer bg-white border-none group"
              >
                <span className="!text-[#000082] group-hover:!text-white">Catalogue</span>
              </Link>
            </motion.div>
          </motion.div>
          
        </motion.div>

        {/* Right Column: Original Container with Premium Frame and Interactive Tint Overlay */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotate: 3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 45, damping: 15, delay: 0.25 }}
          className="lg:col-span-5 relative flex justify-center mt-8 lg:mt-0 xl:pl-4"
        >
          
          {/* Background Decorative Blocks - Animated sliding hover feel */}
          <motion.div 
            animate={{ 
              x: [0, 8, -5, 0],
              y: [0, -8, 5, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 border-2 border-brand-charcoal/10 rounded-[8px] transform translate-x-4 translate-y-4 pointer-events-none" 
          />
          
          <div 
            onMouseEnter={() => setIsHoveringSlides(true)}
            onMouseLeave={() => setIsHoveringSlides(false)}
            className="relative w-full max-w-[420px] aspect-square md:aspect-[4/5] bg-white p-4 rounded-[6px] shadow-2xl border border-neutral-300"
          >
            
            {/* Elegant brand accent border */}
            <div className="absolute top-0 inset-x-0 h-2.5 rounded-t-[6px] transition-colors duration-300 bg-amber-600" />

            <div className="relative w-full h-full overflow-hidden rounded-[3px] bg-neutral-50 flex items-center justify-center border border-neutral-200">
              <motion.img
                key={`unified-${currentIndex}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                src={currentSlideItem.image}
                alt={`${currentSlideItem.name} - ${currentSlideItem.description}`}
                className={`w-full h-full ${
                  isPaintImage ? 'p-6 object-contain bg-white' : 'object-cover'
                }`}
                referrerPolicy="no-referrer"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.4 }}
              />

              {/* Navigation Arrows */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handlePrevSlide();
                }}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-brand-charcoal border border-neutral-200 shadow-md flex items-center justify-center z-30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4.5 h-4.5 text-brand-charcoal" />
              </button>
              
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNextSlide();
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-brand-charcoal border border-neutral-200 shadow-md flex items-center justify-center z-30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4.5 h-4.5 text-brand-charcoal" />
              </button>

              {/* Indicator dots right above detail card */}
              <div className="absolute bottom-[76px] inset-x-0 flex justify-center gap-1.5 z-20">
                {currentSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSlideIndex(idx);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      currentIndex === idx 
                        ? 'bg-amber-600 w-4.5' 
                        : 'bg-neutral-300/80 hover:bg-neutral-400'
                    }`}
                  />
                ))}
              </div>

              {/* Sleek architectural descriptive overlay */}
              <div className="absolute bottom-0 inset-x-0 bg-[#1c1917]/95 backdrop-blur text-white p-3 border-t border-neutral-800 text-left z-20 select-none rounded-[14px]">
                <div className="flex items-center justify-between">
                  <span className={`text-[8.5px] font-mono font-black uppercase tracking-wider px-1.5 py-0.5 rounded text-white ${
                    isPaintImage ? 'bg-[#ea6c00]/90' : 'bg-[#1a6b3c]/90'
                  }`}>
                    {currentSlideItem.tag}
                  </span>
                  <span className="text-[9px] font-mono font-bold text-neutral-400">
                    {currentIndex + 1} / {currentSlides.length}
                  </span>
                </div>
                <h4 className="text-[12px] font-black tracking-wide uppercase mt-1.5 leading-none font-sans text-white truncate" style={{ color: '#ffffff' }}>
                  {currentSlideItem.name}
                </h4>
                <p className="text-[9.5px] text-neutral-300 mt-1 leading-tight line-clamp-1 font-sans" style={{ color: '#ffffff' }}>
                  {currentSlideItem.description}
                </p>
              </div>

            </div>
            


          </div>
        </motion.div>
      </div>
    </section>
  );
}
