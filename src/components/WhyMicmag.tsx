import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Truck, MessageSquareCode, Zap, CheckCircle } from 'lucide-react';
import TrustPill from './TrustPill';

const REASONS = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-[#d32f2f]" />,
    title: '100% Genuine Certified Stock',
    desc: 'Every container of Sandtex paints and Caplux prep products is sourced directly from the manufacturer. Fully backed by standard guarantees and stored under secure conditions in Lagos.',
    badge: 'Authentic Warranty'
  },
  {
    icon: <Truck className="w-8 h-8 text-amber-600" />,
    title: 'Direct Site Delivery',
    desc: 'From high density projects to private properties across Nigeria. Your order arrives exactly when your project demands it.',
    badge: 'Direct Site Drop'
  },
  {
    icon: <MessageSquareCode className="w-8 h-8 text-amber-600" />,
    title: 'Architectural Color Consulting',
    desc: 'Our design experts sit down with you to curate bespoke interior color palettes, match physical textured boards, and select sophisticated high-end paint schemes.',
    badge: 'Design Curation'
  }
];

const springTransition = {
  type: "spring",
  stiffness: 70,
  damping: 17,
  mass: 0.9
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const cardVariant = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: springTransition }
};

export default function WhyMicmag() {
  return (
    <section id="why" className="py-24 px-5 md:px-[5%] bg-white border-b border-neutral-200 relative overflow-hidden">
      
      {/* Dynamic background accents - subtle animated floating */}
      <motion.div 
        animate={{ 
          scale: [1, 1.15, 1],
          x: [0, 30, 0],
          y: [0, -15, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-0 top-0 w-80 h-80 bg-red-100/35 rounded-full filter blur-3xl pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          x: [0, -20, 0],
          y: [0, 20, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[10%] bottom-0 w-96 h-96 bg-brand-yellow/10 rounded-full filter blur-3xl pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 text-left">
          <motion.div 
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={springTransition}
            className="lg:col-span-7 space-y-3"
          >
            <span className="text-[#d32f2f] text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#d32f2f] animate-pulse" /> Why Elite Builders Choose Us
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-[2.6rem] leading-[1.15] font-black text-brand-charcoal">
              Uncompromising Standards <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow via-[#d32f2f] to-amber-500">
                For Uncompromising Projects
              </span>
            </h2>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={springTransition}
            className="lg:col-span-12 xl:col-span-5"
          >
            <p className="text-xs md:text-sm leading-relaxed text-brand-mid font-light">
              We understand that material failure is not an option. Our sourcing, verification, and careful shipping ensure absolute quality of your materials.
            </p>
          </motion.div>
        </div>

        {/* Dynamic Reasons Grid - neo-brutalist credibility pillars (Section 1a) */}
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {REASONS.map((r, idx) => (
            <motion.div
              key={idx}
              variants={cardVariant}
              whileHover={{ y: -8 }}
              className="p-8 border-2 border-[#1c1917] rounded-2xl bg-white flex flex-col justify-between space-y-6 group text-left shadow-[4px_4px_0px_0px_#b45309] hover:shadow-[6px_6px_0px_0px_#b45309] transition-all duration-150"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 6 }}
                    className="p-3.5 bg-neutral-50 rounded-[4px] inline-block border-2 border-[#1c1917] group-hover:bg-neutral-100 transition-colors duration-350"
                  >
                    {r.icon}
                  </motion.div>
                  <span className="text-[9px] font-mono font-black uppercase tracking-widest text-[#1c1917] bg-neutral-100 border-2 border-[#1c1917] px-2.5 py-1 rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,0.12)]">
                    {r.badge}
                  </span>
                </div>
                
                <h3 className="text-lg font-black text-[#1c1917] font-display leading-tight">
                  {r.title}
                </h3>
                
                <p className="text-xs sm:text-[13px] leading-relaxed text-brand-mid font-light">
                  {r.desc}
                </p>
              </div>

              <div className="pt-3 border-t-2 border-dashed border-[#e7e5e4] flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase text-[#1c1917]">
                <CheckCircle className="w-4 h-4 text-[#d32f2f] flex-shrink-0" />
                <span>Credibility Pillar {idx + 1}</span>
              </div>

            </motion.div>
          ))}
        </motion.div>

        {/* Trust Pills Band (Section 1e + Section 5) */}
        <div className="flex flex-wrap justify-center items-center gap-4 mt-16">
          <TrustPill text="Official Sandtex® Partner" />
          <TrustPill text="Elite Caplux® Coatings Dealer" />
          <TrustPill text="Genuine CAP Warranty" />
        </div>

        {/* Trust block at bottom */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={springTransition}
          style={{ backgroundColor: '#000650' }}
          className="mt-16 text-white rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 border-2 border-[#1c1917] text-left shadow-[5px_5px_0px_0px_#d32f2f]"
        >
          <div className="space-y-2 text-left">
            <span className="text-[9px] font-mono tracking-widest text-[#d32f2f] uppercase font-bold block">
              Paint Samples Provided
            </span>
            <h4 className="font-serif text-xl sm:text-2xl font-bold">
              Want to see paint samples directly on your wall?
            </h4>
            <p className="text-xs text-neutral-300 font-light max-w-2xl">
              We can deliver physically tinted color sheets or small sample tins to your building site in Lagos so you can see the color before ordering bulk volumes.
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="w-full md:w-auto text-center"
          >
            <a
              href="/contact"
              className="block bg-white text-brand-charcoal font-bold text-xs uppercase tracking-wider py-4 px-8 rounded hover:bg-neutral-100 transition-colors duration-300 shadow-md whitespace-nowrap"
            >
              Request Free Samples &rarr;
            </a>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
