import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Palette, Truck, Leaf, Sparkles } from 'lucide-react';

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Prestige Quality',
    mono: '01 / MATERIAL INTEGRITY',
    desc: 'Curating premium architectural coatings and high-performance primers to guarantee lasting structural elegance.',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-red-50/50',
    textColor: 'text-brand-red'
  },
  {
    icon: Palette,
    title: 'Architectural Artistry',
    mono: '02 / DESIGN EXCELLENCE',
    desc: 'Synthesizing color science and luxury textures to elevate luxury spaces into bespoke, editorial environments.',
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-50/50',
    textColor: 'text-amber-800'
  },
  {
    icon: Truck,
    title: 'Nationwide Trust',
    mono: '03 / LOGISTIC PRECISION',
    desc: 'Streamlining site deliveries and on-site technical support to ensure seamless architectural execution.',
    color: 'from-neutral-700 to-neutral-900',
    bgColor: 'bg-neutral-50/50',
    textColor: 'text-brand-charcoal'
  },
  {
    icon: Leaf,
    title: 'Eco-Stewardship',
    mono: '04 / SUSTAINABLE HORIZON',
    desc: 'Preserving interior environments with low-odor, eco-friendly bespoke finishes for healthy, refined spaces.',
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50/50',
    textColor: 'text-emerald-700'
  }
];

const springTransition = {
  type: "spring",
  stiffness: 70,
  damping: 17,
  mass: 0.9
};

export default function CoreValues() {
  return (
    <section id="core-values" className="py-24 px-5 md:px-[5%] border-b border-neutral-200 relative overflow-hidden" style={{ backgroundColor: '#dfe7ff' }}>
      {/* Subtle decorative background grids or assets */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none select-none" 
        style={{ 
          backgroundImage: 'radial-gradient(var(--color-brand-red) 1px, transparent 1px)', 
          backgroundSize: '24px 24px' 
        }} 
      />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-brand-red text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-red animate-pulse" /> Our Core Foundations
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-[2.6rem] leading-[1.15] font-black text-brand-charcoal" style={{ color: '#000082' }}>
            The Values That Bind Our Craft
          </h2>
          <p className="text-xs sm:text-sm md:text-base leading-relaxed text-brand-mid font-light" style={{ color: '#000082' }}>
            Behind every layer of premium Sandtex paint and Caplux protective primers lies an unyielding commitment to performance, design prestige, and client trust.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {VALUES.map((val, idx) => {
            const Icon = val.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ ...springTransition, delay: idx * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-white border-2 border-brand-charcoal rounded-2xl p-8 shadow-[4px_4px_0px_0px_#000082] hover:shadow-[6px_6px_0px_0px_#000082] hover:-translate-y-[2px] transition-all duration-200 flex flex-col sm:flex-row gap-6 items-start relative overflow-hidden group"
              >
                {/* Accent bar that grows on hover */}
                <div className={`absolute top-0 left-0 bottom-0 w-[3px] bg-gradient-to-b ${val.color} transition-all duration-300 group-hover:w-[5px]`} />
                
                {/* Icon wrapper */}
                <div className={`p-4 rounded-full ${val.bgColor} ${val.textColor} border border-neutral-100/50 flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="w-6 h-6" />
                </div>

                <div className="space-y-2.5 text-left">
                  <span className="text-[9px] font-mono font-bold tracking-widest text-brand-mid uppercase block">
                    {val.mono}
                  </span>
                  <h3 className="font-serif text-lg font-black text-brand-charcoal tracking-tight group-hover:text-brand-red transition-colors duration-300" style={{ color: '#000082' }}>
                    {val.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] leading-relaxed text-brand-mid font-light" style={{ color: '#000082' }}>
                    {val.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
