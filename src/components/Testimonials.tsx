import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Quote, ShieldCheck, BadgeCheck, Compass, Paintbrush, Star } from 'lucide-react';
import { useBrand } from '../BrandContext';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  feedback: string;
  rating: number;
  metric: string;
  project: string;
}

const SANDTEX_TESTIMONIALS: Testimonial[] = [
  {
    id: 's1',
    name: "Engr. Toyin Babalola",
    role: "Principal Contractor, Peakway Developers",
    location: "Lagos, Nigeria",
    feedback: "Our coastal developments face punishing humidity and salt spray. Switching to Sandtex Smooth Matt was the best decision we made; five years later, the facades are as immaculate, weather-tight, and chalk-free as day one.",
    rating: 5,
    metric: "5+ Years Zero Maintenance",
    project: "Coastal Estate, Lekki"
  },
  {
    id: 's2',
    name: "Princess Fatima Y.",
    role: "Lead Designer, Elite Habitations",
    location: "Ikoyi, Lagos",
    feedback: "In Nigeria's harsh tropical climate, cheap paint is a frustrating annual expense. We specified Sandtex textured premium finish for our residential towers, and even under constant blazing sun, the deep color has kept its stunning richness.",
    rating: 5,
    metric: "Guaranteed UV Shielding",
    project: "Luxury Private Mansion"
  },
  {
    id: 's3',
    name: "Arch. Chidi Okonji",
    role: "Senior Partner, Okonji Associates",
    location: "Abuja, FCT",
    feedback: "The coverage and genuine resin polymer content in Sandtex coatings are simply unmatched in West commerce. There is no thinning, no fading, just absolute architectural perfection that honors our original schemes.",
    rating: 5,
    metric: "100% Pure Polymer Resin",
    project: "Commercial Plaza"
  }
];

const MICMAG_TESTIMONIALS: Testimonial[] = [
  {
    id: 'm1',
    name: "Dr. Adeola K.",
    role: "Managing Director, Preeminent Hospitality",
    location: "Victoria Island, Lagos",
    feedback: "We sat down for a custom architectural coatings consultation at Micmag's Oworonshoki HQ. Their comprehensive proposal for weather-resistant exterior finishes and premium custom tinting is outstanding. We are highly anticipating utilizing their premium systems for our upcoming boutique suites soon!",
    rating: 5,
    metric: "Coatings Consultation",
    project: "Boutique Suites Project"
  },
  {
    id: 'm2',
    name: "Funke Adesina",
    role: "Private Developer & Landowner",
    location: "Banana Island, Lagos",
    feedback: "Micmag's specialized textured coatings and premium acrylic paint systems look absolutely outstanding. Their color-matching consultancy at the Oworonshoki showroom helped us map the complete architectural color scheme for our upcoming private residence.",
    rating: 5,
    metric: "Premium Color Schemes",
    project: "Banana Island Villa Finish"
  },
  {
    id: 'm3',
    name: "Mr. Emeka Nnamdi",
    role: "Commercial Real Estate Developer",
    location: "Port Harcourt",
    feedback: "Visiting their physical color showroom and seeing the actual painted textured boards of premium coatings was incredible. High-integrity substrate preparation and primer support is crucial, and Micmag's precision paint specifications are exactly what we need.",
    rating: 5,
    metric: "Precision Specifications",
    project: "Premium Townhouse Project"
  }
];

export default function Testimonials() {
  const ALL_TESTIMONIALS = [...SANDTEX_TESTIMONIALS, ...MICMAG_TESTIMONIALS];
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % ALL_TESTIMONIALS.length);
  const prev = () => setIndex((prev) => (prev - 1 + ALL_TESTIMONIALS.length) % ALL_TESTIMONIALS.length);

  // Auto scroll rotation
  useEffect(() => {
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, [index]);

  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 bg-neutral-50/70 border-t border-neutral-200/40 relative overflow-hidden">
      {/* Decorative ambient blurred backgrounds */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-100/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-50/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6" style={{ marginBottom: '65px', marginLeft: '130px' }}>
          <div className="text-left max-w-xl">
            <span className="text-brand-red text-xs font-mono font-bold tracking-[0.2em] uppercase mb-3 block">
              Verified Social Proof
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] leading-tight font-black text-brand-charcoal tracking-tight">
              Honest Experiences. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-charcoal to-brand-mid">
                Impeccable Finishes.
              </span>
            </h2>
          </div>
        </div>

        {/* Master Balanced Container - Centered and spacious */}
        <div className="max-w-4xl mx-auto relative">
          
          {/* Shifting animated gradient glow behind testimonials card */}
          <div className="absolute -inset-6 rounded-3xl filter blur-3xl opacity-20 animated-gradient-bg pointer-events-none" />

          {/* Testimonial Main Carousel Card - Impeccably Structured */}
          <div className="w-full flex flex-col justify-between glass-premium rounded-2xl p-6 sm:p-10 lg:p-12 shadow-2xl relative min-h-[420px]">
            
            {/* Top Row with decorative brand asset symbol and verified status */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-100/80">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-neutral-900 text-white rounded-[2px]">
                  <Quote className="w-4 h-4 text-white" />
                </span>
                <span className="text-[9.5px] font-mono font-bold tracking-widest text-amber-600 bg-amber-50 px-2.5 py-1 rounded inline-flex items-center gap-1">
                  <BadgeCheck className="w-3.5 h-3.5" /> VERIFIED EXPERIENCE
                </span>
              </div>
              
              <span className="text-[10px] font-mono text-neutral-400">
                Story {index + 1} of {ALL_TESTIMONIALS.length}
              </span>
            </div>

            {/* Testimonial Active Display Area inside elegant layout */}
            <div className="flex-1 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={ALL_TESTIMONIALS[index].id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="space-y-6"
                >
                  <p className="font-serif text-lg sm:text-xl lg:text-2xl text-brand-charcoal leading-relaxed font-medium italic text-left" style={{ color: '#000082' }}>
                    " {ALL_TESTIMONIALS[index].feedback} "
                  </p>

                  <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-dashed border-neutral-100 mt-6 pb-2">
                    <div className="text-left">
                      <h4 className="font-serif font-black text-brand-charcoal text-base">
                        {ALL_TESTIMONIALS[index].name}
                      </h4>
                      <p className="text-[11px] text-brand-mid font-medium tracking-wide mt-0.5">
                        {ALL_TESTIMONIALS[index].role} &bull; <span className="text-neutral-400">{ALL_TESTIMONIALS[index].location}</span>
                      </p>
                    </div>

                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Interactive Carousel Operations Navigation */}
            <div className="mt-8 pt-4 border-t border-neutral-100 flex items-center justify-between">
              {/* Pagination Dots */}
              <div className="flex items-center gap-2">
                {ALL_TESTIMONIALS.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      index === idx
                        ? 'w-6 bg-amber-600'
                        : 'w-2 bg-neutral-200 hover:bg-neutral-300'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Action Navigation Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prev}
                  className="p-2.5 bg-neutral-50 hover:bg-neutral-100 active:scale-95 border border-neutral-200/80 rounded-[4px] text-brand-charcoal transition-all cursor-pointer"
                  aria-label="Previous Testimonial"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={next}
                  className="p-2.5 bg-neutral-50 hover:bg-neutral-100 active:scale-95 border border-neutral-200/80 rounded-[4px] text-brand-charcoal transition-all cursor-pointer"
                  aria-label="Next Testimonial"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
