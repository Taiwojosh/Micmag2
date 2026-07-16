import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ArrowUpRight } from 'lucide-react';

const FLAGSHIP_COLORS = [
  {
    name: "Midas Touch",
    hex: "#978F2C",
    description: "Vibrant and authentic sandtex orange tone.",
    themeClass: "from-[#978F2C]/20 to-neutral-950/10",
  },
  {
    name: "National Green",
    hex: "#1F5139",
    description: "Deep luxury clay-tone paint.",
    themeClass: "from-[#B8A593]/20 to-neutral-950/10",
  },
  {
    name: "Coconut",
    hex: "#534C49",
    description: "Pure intense premium crimson.",
    themeClass: "from-red-700/20 to-neutral-950/10",
  },
  {
    name: "Lagoon Blue",
    hex: "#37809C",
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

const HERO_BACKGROUND_MEDIA = [
  { type: 'video', src: './a_video_for_the_landing_page_o.mp4' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1600' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1600' },
  { type: 'video', src: './A_video_of_a_Nigerian_middle_a.mp4' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=1600' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1600' }
];

const SANDTEX_SLIDES = [
  { name: "Sandtex Satin 20L/4L", tag: "Interior & Exterior Semi-Gloss", image: "./satin1.png" },
  { name: "Sandtex Select VME 20L", tag: "Interior & Exterior Matt", image: "./Sandtex select VME.png" },
  { name: "Sandtex Matt 20L", tag: "Ultimate Exterior Shield", image: "./Sandtex MATT.png" },
  { name: "Sandtex Trade Smooth 20L", tag: "Professional Elite Masonry", image: "./Sandtex Trade Smooth.png" },
  { name: "Sandtex VME 20L/4L", tag: "Interior Contract Classic", image: "./Sandtex VME.png" },
  { name: "Sandtex Finebuild 20L", tag: "Textured Primer Build", image: "./Sandtex FineBuild.png" },
  { name: "Sandtex Gloss 4L", tag: "Multi-surface Gloss Enamel", image: "./Sandtex GLOSS.png" }
];

const MICMAG_SLIDES = [
  { name: "Premium Interior Walls", image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800" },
  { name: "Heavy-Duty Exterior Shield", image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800" },
  { name: "Caplux Industrial Primers", image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=800" },
  { name: "Custom Color Tinting", image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800" },
  { name: "Architectural Texture Boards", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800" },
  { name: "Anti-Corrosive Metal Coatings", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800" }
];

const springTransition = { type: "spring", stiffness: 75, damping: 18, mass: 0.8 };
const staggerContainer = { initial: {}, animate: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } };
const fadeUpVariant = { initial: { opacity: 0, y: 35 }, animate: { opacity: 1, y: 0, transition: springTransition } };

export default function Hero() {
  const [activeColor, setActiveColor] = useState<typeof FLAGSHIP_COLORS[0] | null>(null);

  // Background Slideshow State
  const [bgIndex, setBgIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentBg = HERO_BACKGROUND_MEDIA[bgIndex];

  // Grid Image Slideshow State
  const [slideIndex, setSlideIndex] = useState(0);
  const [isHoveringGrid, setIsHoveringGrid] = useState(false);

  // Auto-cycle grid images
  useEffect(() => {
    if (isHoveringGrid) return;
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % Math.max(MICMAG_SLIDES.length, SANDTEX_SLIDES.length));
    }, 4500);
    return () => clearInterval(interval);
  }, [isHoveringGrid]);

  // Background Media Transitions (Timer for images)
  useEffect(() => {
    if (currentBg.type === 'image') {
      const timer = setTimeout(() => {
        setBgIndex((prev) => (prev + 1) % HERO_BACKGROUND_MEDIA.length);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [bgIndex, currentBg.type]);

  // Video End Transitions
  const handleVideoEnded = () => {
    setBgIndex((prev) => (prev + 1) % HERO_BACKGROUND_MEDIA.length);
  };

  // Play video on mount or swap
  useEffect(() => {
    if (currentBg.type === 'video' && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch((err) => {
        console.warn("Video autoPlay failed:", err);
      });
    }
  }, [bgIndex, currentBg.type]);

  // Determine current slide items (wrap safely if arrays are different lengths)
  const currentMicmagSlide = MICMAG_SLIDES[slideIndex % MICMAG_SLIDES.length];
  const currentSandtexSlide = SANDTEX_SLIDES[slideIndex % SANDTEX_SLIDES.length];

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] md:min-h-[92vh] flex flex-col justify-center pt-24 md:pt-32 pb-32 md:pb-24 px-5 md:px-[5%] overflow-hidden bg-brand-cream border-b border-neutral-200 transition-colors duration-700"
    >
      {/* ── BACKGROUND MEDIA ── */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          key={currentBg.type === 'video' ? currentBg.src : 'inactive-video'}
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnded}
          onError={handleVideoEnded}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${currentBg.type === 'video' ? 'opacity-100' : 'opacity-0'
            }`}
        >
          {currentBg.type === 'video' && <source src={currentBg.src} type="video/mp4" />}
        </video>

        {HERO_BACKGROUND_MEDIA.map((media, idx) => (
          media.type === 'image' && (
            <img
              key={media.src}
              src={media.src}
              alt="Luxury Interior Spec"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${currentBg.type === 'image' && bgIndex === idx ? 'opacity-100' : 'opacity-0'
                }`}
            />
          )
        ))}
      </div>

      {/* ── FROSTED OVERLAY ── (Protects text readability while allowing cinematic background to show through) */}
      <div className="absolute inset-0 bg-brand-cream/85 md:bg-brand-cream/80 backdrop-blur-[2px] pointer-events-none z-0" />

      {/* Dynamic Background Tint based on active color */}
      <AnimatePresence>
        {activeColor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 pointer-events-none z-0"
            style={{ backgroundColor: activeColor.hex }}
          />
        )}
      </AnimatePresence>

      {/* Subtle Architectural Grid Pattern (overlaying the frosted glass) */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
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
            className="font-serif text-5xl sm:text-6xl lg:text-[72px] leading-[0.95] font-black text-brand-charcoal tracking-tight drop-shadow-sm"
          >
            Prestige <br />
            <span className="text-micmag-red italic font-light tracking-normal">Interiors.</span><br />
            Uncompromising <br />
            Craft.
          </motion.h1>

          {/* Description with Vertical Line Accent */}
          <motion.div variants={fadeUpVariant} className="flex gap-4 items-start max-w-xl">
            <div className="w-1 h-full min-h-[60px] bg-amber-600 shrink-0 mt-1" />
            <p className="text-sm sm:text-base leading-relaxed text-brand-charcoal/80 font-bold drop-shadow-sm">
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
              className="group h-12 inline-flex items-center justify-center gap-2 px-6 font-bold tracking-[0.15em] text-[11px] uppercase text-brand-charcoal border-b-2 border-brand-charcoal hover:border-brand-charcoal transition-colors duration-300 bg-white/20 backdrop-blur-sm"
            >
              View Catalogue <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Column: Asymmetrical Image Grid (Animated) */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          onMouseEnter={() => setIsHoveringGrid(true)}
          onMouseLeave={() => setIsHoveringGrid(false)}
          className="lg:col-span-6 relative h-[500px] sm:h-[600px] w-full mt-10 lg:mt-0 cursor-default"
        >
          {/* Main Arched Image (Interior shot cycling) */}
          <div className="absolute right-0 top-0 w-[80%] h-[90%] rounded-t-[200px] rounded-b-[40px] overflow-hidden shadow-2xl border-4 border-white bg-neutral-100">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentMicmagSlide.image}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                src={currentMicmagSlide.image}
                alt={currentMicmagSlide.name}
                className="w-full h-full object-cover transition-transform duration-700"
              />
            </AnimatePresence>
            <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10">
              <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full border border-white/20">
                {currentMicmagSlide.name}
              </span>
            </div>
          </div>

          {/* Accent Overlapping Square Image (Product bucket cycling) */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-[5%] bottom-[22%] w-[45%] aspect-square rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-white z-20 flex flex-col justify-center items-center p-4"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentSandtexSlide.image}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                src={currentSandtexSlide.image}
                alt={currentSandtexSlide.name}
                className="w-full h-[70%] object-contain mb-2"
              />
            </AnimatePresence>
            <div className="text-center w-full">
              <span className="block text-[8px] sm:text-[9px] font-bold text-brand-charcoal uppercase tracking-widest truncate">
                {currentSandtexSlide.name}
              </span>
              <span className="block text-[7px] sm:text-[8px] text-brand-charcoal/60 uppercase truncate">
                {currentSandtexSlide.tag}
              </span>
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
