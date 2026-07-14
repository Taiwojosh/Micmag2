import React from 'react';
import { motion } from 'motion/react';
import { Award } from 'lucide-react';

const HIGHLIGHT_CARDS = [
  {
    title: 'Curated Designer Palettes',
    desc: 'Exquisite custom-tinted color collections and luxury Matt finishes engineered to preserve deep pigment rich tones and resist tropical weathering.',
  },
  {
    title: 'Architectural Coatings & Primers',
    desc: 'Meticulously formulated high-grade anti-alkaline primers and protective sealers ensuring pristine substrate preparation for high-integrity plaster and paint finishes.',
  }
];

const springTransition = {
  type: "spring",
  stiffness: 70,
  damping: 17,
  mass: 0.9
};

export default function About() {
  return (
    <section id="about" className="pt-[100px] pb-0 px-5 md:px-[5%] bg-[#FDFDFB] border-b border-neutral-200 relative overflow-hidden">
      {/* Dynamic Ambient Background Animation using Micmag Logo Colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-15">
        {/* Micmag Logo Red (#d32f2f) Orb */}
        <motion.div
          animate={{
            x: [0, 90, -50, 0],
            y: [0, -70, 60, 0],
            scale: [1, 1.25, 0.9, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full bg-micmag-red filter blur-[120px]"
        />

        {/* Micmag Logo Blue (#1e3a5f) Orb */}
        <motion.div
          animate={{
            x: [0, -80, 70, 0],
            y: [0, 90, -60, 0],
            scale: [1, 0.85, 1.15, 1],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 -right-24 w-[450px] h-[450px] rounded-full bg-[#1e3a5f] filter blur-[120px]"
        />

        {/* Micmag Logo Green (#1a6b3c) Orb */}
        <motion.div
          animate={{
            x: [0, 60, -70, 0],
            y: [0, 80, -90, 0],
            scale: [1, 1.15, 0.8, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-32 left-1/4 w-[500px] h-[500px] rounded-full bg-micmag-green filter blur-[120px]"
        />
      </div>

      {/* Decorative vertical paint drip element in background - animated */}
      <motion.div
        initial={{ height: 0 }}
        whileInView={{ height: '100%' }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-red via-brand-yellow to-amber-400 opacity-80"
      />

      <div className="max-w-7xl mx-auto">

        {/* About Main Intro & Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-20">

          {/* Left Column: Vision Copy Grid */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={springTransition}
            className="lg:col-span-7 flex flex-col justify-center space-y-6"
          >
            <h2 className="font-serif text-3xl sm:text-4xl md:text-[2.6rem] leading-[1.12] font-black text-brand-charcoal">
              Exquisite Decorative Finishes & Legendary Paint Coatings
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-brand-mid font-light text-left">
              As an Official Sandtex Partner, Micmag merges exquisite interior design aesthetics with legendary coating technology. We specialize in  architectural color consulting, high-end textured plasters, luxury Matt emulsions, and precision automated tinting services—offering architects, interior designers, and premium property developers a flawless synthesis of visual elegance and weatherproofing engineering.
            </p>

          </motion.div>

          {/* Right Column: Premium guarantee specs card with visible rounded borders & deep shadows */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={springTransition}
            whileHover={{ y: -8, rotate: -0.5 }}
            className="lg:col-span-12 xl:col-span-5 flex justify-center relative w-full"
          >
            <div className="absolute -inset-2 bg-gradient-to-tr from-micmag-red/10 to-amber-500/15 rounded-2xl filter blur-lg opacity-60" />
            <div className="relative w-full bg-white border-2 border-brand-charcoal rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_0px_var(--color-brand-red-deep)] space-y-6 text-left">
              <span className="text-[10px] font-mono tracking-widest text-micmag-red uppercase font-bold block bg-red-50 py-1 px-2.5 rounded border border-red-100 w-max">
                Material Integrity
              </span>
              <h3 className="font-serif text-xl font-black text-brand-charcoal">
                Engineered Performance
              </h3>
              <div className="space-y-4">
                {HIGHLIGHT_CARDS.map((card, i) => (
                  <div key={i} className="border-l-4 border-micmag-red pl-4 space-y-1.5">
                    <h4 className="font-sans font-bold text-xs sm:text-sm text-neutral-800 uppercase tracking-wider">{card.title}</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed font-light">{card.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>



      </div>
    </section>
  );
}
