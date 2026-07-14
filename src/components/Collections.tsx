import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Skeleton from './Skeleton';
import { Palette, X, Flame, Shield, Droplet, Timer, BookOpen, AlertCircle, MessageSquare, Lock } from 'lucide-react';
import ProductCard from './ProductCard';
import { CAPLUX_PRODUCTS } from '../data/capluxProducts';
import { PAINT_PRODUCTS, FITTINGS_PRODUCTS } from '../data/productsData';
import ProductDetailModal from './ProductDetailModal';
import TrustPill from './TrustPill';
import { useLocation, Link } from 'react-router-dom';
import { openWhatsApp } from '../utils/whatsapp';

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
      staggerChildren: 0.08
    }
  }
};

const fadeInUpVariant = {
  initial: { opacity: 0, y: 35 },
  animate: { opacity: 1, y: 0, transition: springTransition }
};

export default function Collections() {
  const location = useLocation();
  const isCollectionsPage = location.pathname === '/collections';
  const [loading, setLoading] = useState(true);
  const [activeTds, setActiveTds] = useState<any | null>(null);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    activeItem: any | null;
    type: 'product' | 'service';
  }>({
    isOpen: false,
    activeItem: null,
    type: 'product',
  });

  const handleSelectProductForQuote = (productName: string, brand: 'sandtex' | 'micmag' | 'caplux') => {
    const inquiryType = brand === 'sandtex' ? 'SANDTEX Paints' : brand === 'caplux' ? 'Caplux Surface Prep' : 'CAPLUX Paints & Primers';
    const customMessage = brand === 'caplux'
      ? `Hello! I would like to receive pricing and detailed specifications representing "${productName}" from your Caplux Surface Prep catalog. Please consult with me on availability and schedules.`
      : `Hello! I would like to receive pricing and detailed specifications representing "${productName}". Please consult with me on availability and schedules.`;

    // Dispatch custom event to auto-populate LeadForm
    window.dispatchEvent(new CustomEvent('applyPaintEstimate', {
      detail: {
        inquiryType,
        message: customMessage
      }
    }));

    // Scroll to lead form smoothly
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWhatsAppInquiry = (productName: string, brand: 'sandtex' | 'micmag' | 'caplux') => {
    const brandName = brand === 'sandtex' ? 'Sandtex Paint Division' : brand === 'caplux' ? 'Caplux Surface Prep' : 'MICMAG Specialty Division';
    const text = `Hello, I was browsing your premium catalog and would like to inquire about specifications and pricing for: "${productName}" under the ${brandName} catalog.`;
    openWhatsApp('2347052940445', text);
  };
  const [catalogFilter, setCatalogFilter] = useState<'all' | 'sandtex' | 'caplux' | 'micmag'>('all');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 850);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="products" className="py-24 px-5 md:px-[5%] bg-brand-cream/60 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto">

        {/* Dynamic Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={springTransition}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14"
        >
          <div className="lg:col-span-7 space-y-3 text-left">

            <h2 className="font-serif text-3xl sm:text-4xl md:text-[2.6rem] leading-[1.18] font-black text-brand-charcoal">
              Finishes & Fits Engineered <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow via-brand-red to-amber-600">
                To Impress. To Last.
              </span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pt-4 text-left">
          </div>
        </motion.div>

        {/* Dynamic User Interest Gateway Switcher */}
        <div className="flex flex-col lg:flex-row justify-start items-stretch lg:items-center gap-3.5 mb-14 border-b border-neutral-200/80 pb-6">
          {isCollectionsPage && (
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-mid text-left lg:pr-2.5 self-center">
              Narrow Your Interest:
            </span>
          )}
          <div
            className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-2.5 w-full no-scrollbar pb-3 lg:pb-0 -mx-5 px-5 lg:mx-0 lg:px-0 scroll-smooth snap-x snap-mandatory"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <button
              onClick={() => setCatalogFilter('all')}
              className={`flex-shrink-0 whitespace-nowrap snap-center min-w-[130px] lg:min-w-0 lg:w-full px-4 py-3.5 text-[10.5px] font-sans font-bold uppercase transition-all duration-300 cursor-pointer text-center ${catalogFilter === 'all'
                  ? 'bg-neutral-900 border border-neutral-900 text-[#f4efe5] shadow-md scale-102 font-black'
                  : 'bg-white border border-neutral-200 text-brand-mid hover:text-brand-charcoal hover:border-neutral-400 shadow-sm'
                }`}
              style={{ borderRadius: '25px' }}
            >
              All Products
            </button>
            <button
              onClick={() => { setCatalogFilter('sandtex'); }}
              className={`flex-shrink-0 whitespace-nowrap snap-center min-w-[130px] lg:min-w-0 lg:w-full px-4 py-3.5 text-[10.5px] font-sans font-bold uppercase transition-all duration-300 cursor-pointer text-center ${catalogFilter === 'sandtex'
                  ? 'bg-sandtex-red border border-sandtex-red text-white shadow-md scale-102 font-black'
                  : 'bg-white border border-neutral-200 text-brand-mid hover:text-sandtex-red hover:border-sandtex-red shadow-sm'
                }`}
              style={{ borderRadius: '25px' }}
            >
              Sandtex Paints
            </button>
            <button
              onClick={() => { setCatalogFilter('caplux'); }}
              className={`flex-shrink-0 whitespace-nowrap snap-center min-w-[130px] lg:min-w-0 lg:w-full px-4 py-3.5 text-[10.5px] font-sans font-bold uppercase transition-all duration-300 cursor-pointer text-center ${catalogFilter === 'caplux'
                  ? 'bg-sandtex-orange border border-sandtex-orange text-white shadow-md scale-102 font-black'
                  : 'bg-white border border-neutral-200 text-brand-mid hover:text-sandtex-orange hover:border-sandtex-orange shadow-sm'
                }`}
              style={{ borderRadius: '25px' }}
            >
              Caplux Surface Prep
            </button>
            <button
              onClick={() => { setCatalogFilter('micmag'); }}
              className={`flex-shrink-0 whitespace-nowrap snap-center min-w-[130px] lg:min-w-0 lg:w-full px-4 py-3.5 text-[10.5px] font-sans font-bold uppercase transition-all duration-300 cursor-pointer text-center ${catalogFilter === 'micmag'
                  ? 'bg-micmag-blue border border-micmag-blue text-white shadow-md scale-102 font-black'
                  : 'bg-white border border-neutral-200 text-brand-mid hover:text-micmag-blue hover:border-micmag-blue shadow-sm'
                }`}
              style={{ borderRadius: '25px', borderWidth: '1.701754px' }}
            >
              Specialty & Prep
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Helper segment indicators */}

          {catalogFilter === 'caplux' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-10 bg-amber-50/60 border border-amber-100 rounded-[4px] p-4 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600 inline-block animate-pulse" />
                  Currently Viewing: CAPLUX Professional Surface Preparation
                </h4>

              </div>
              <a
                href="#contact"
                className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-mono font-bold uppercase tracking-wider py-2 px-4 rounded-[2px] transition-colors inline-block text-center whitespace-nowrap"
              >
                Inquire Prep Products
              </a>
            </motion.div>
          )}

          {catalogFilter === 'micmag' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-10 bg-amber-50 border border-amber-100 rounded-[4px] p-4 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600 inline-block animate-pulse" />
                  Currently Viewing: Premium Sanitary & Fittings Collection (Luxury European Brands)
                </h4>

              </div>
              <a
                href="#contact"
                className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-mono font-bold uppercase tracking-wider py-2 px-4 rounded-[2px] transition-colors inline-block text-center whitespace-nowrap"
              >
                Inquire Design Specs
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SANDTEX Paints Subsection */}
        {(catalogFilter === 'all' || catalogFilter === 'sandtex') && (
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-neutral-200">
              <h3 className="font-serif text-2xl font-extrabold text-brand-charcoal flex items-center gap-2">
                Premium SANDTEX Coatings
              </h3>

            </div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {loading
                ? Array.from({ length: isCollectionsPage ? 6 : (catalogFilter === 'all' ? 1 : 3) }).map((_, i) => (
                  <div key={i} className="bg-white rounded-[4px] p-8 border border-neutral-200 shadow-sm space-y-4">
                    <Skeleton className="w-10 h-10" />
                    <Skeleton className="w-3/4 h-6" />
                    <Skeleton className="w-full h-16" />
                  </div>
                ))
                : (isCollectionsPage ? PAINT_PRODUCTS : PAINT_PRODUCTS.slice(0, catalogFilter === 'all' ? 1 : 3)).map((p, idx) => (
                  <ProductCard
                    key={idx}
                    product={p}
                    brand="sandtex"
                    onWhatsApp={(name) => handleWhatsAppInquiry(name, 'sandtex')}
                    onQuote={(name) => handleSelectProductForQuote(name, 'sandtex')}
                    onViewTDS={(product) => setActiveTds({ ...product, brand: 'sandtex' })}
                    onViewDetails={(product) => setModalState({ isOpen: true, activeItem: product, type: 'product' })}
                  />
                ))}
            </motion.div>
          </div>
        )}

        {/* CAPLUX Surface Prep Subsection */}
        {(catalogFilter === 'all' || catalogFilter === 'caplux') && (
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-neutral-200">
              <h3 className="font-serif text-2xl font-extrabold text-brand-charcoal flex items-center gap-2">
                🛠️ CAPLUX Surface Preparation
              </h3>

            </div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {loading
                ? Array.from({ length: isCollectionsPage ? 9 : (catalogFilter === 'all' ? 1 : 3) }).map((_, i) => (
                  <div key={i} className="bg-white rounded-[4px] p-8 border border-neutral-200 shadow-sm space-y-4">
                    <Skeleton className="w-10 h-10" />
                    <Skeleton className="w-3/4 h-6" />
                    <Skeleton className="w-full h-16" />
                  </div>
                ))
                : (isCollectionsPage ? CAPLUX_PRODUCTS : CAPLUX_PRODUCTS.slice(0, catalogFilter === 'all' ? 1 : 3)).map((p, idx) => (
                  <ProductCard
                    key={idx}
                    product={p}
                    brand="caplux"
                    onWhatsApp={(name) => handleWhatsAppInquiry(name, 'caplux')}
                    onQuote={(name) => handleSelectProductForQuote(name, 'caplux')}
                    onViewTDS={(product) => setActiveTds({ ...product, brand: 'caplux' })}
                    onViewDetails={(product) => setModalState({ isOpen: true, activeItem: product, type: 'product' })}
                  />
                ))}
            </motion.div>
          </div>
        )}

        {/* Specialty & Prep Subsection */}
        {(catalogFilter === 'all' || catalogFilter === 'micmag') && (
          <div>
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-neutral-200">
              <h3 className="font-serif text-2xl font-extrabold text-brand-charcoal flex items-center gap-2">
                🎨 Specialty & Prep Coatings
              </h3>

            </div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {loading
                ? Array.from({ length: isCollectionsPage ? 4 : (catalogFilter === 'all' ? 1 : 3) }).map((_, i) => (
                  <div key={i} className="bg-brand-charcoal rounded-[4px] p-8 shadow-sm space-y-4">
                    <Skeleton className="w-10 h-10 bg-white/20" />
                    <Skeleton className="w-3/4 h-6 bg-white/20" />
                    <Skeleton className="w-full h-16 bg-white/20" />
                  </div>
                ))
                : (isCollectionsPage ? FITTINGS_PRODUCTS : FITTINGS_PRODUCTS.slice(0, catalogFilter === 'all' ? 1 : 3)).map((f, idx) => (
                  <ProductCard
                    key={idx}
                    product={f}
                    brand="micmag"
                    onWhatsApp={(name) => handleWhatsAppInquiry(name, 'micmag')}
                    onQuote={(name) => handleSelectProductForQuote(name, 'micmag')}
                    onViewTDS={(product) => setActiveTds({ ...product, brand: 'micmag' })}
                    onViewDetails={(product) => setModalState({ isOpen: true, activeItem: product, type: 'product' })}
                  />
                ))}
            </motion.div>

            {!isCollectionsPage && (
              <div className="flex justify-center mt-12">
                <Link
                  to="/collections"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-brand-charcoal text-brand-charcoal text-xs font-black tracking-[0.15em] uppercase hover:bg-brand-charcoal hover:text-white transition-all duration-300 shadow-md cursor-pointer bg-white"
                >
                  Explore Full Paint & Coatings Catalogue →
                </Link>
              </div>
            )}

            {/* Coating & Color Services (Section 5 page-by-page summary + Section 1a type cards) */}
            <div className="mt-16">
              <div className="flex items-center justify-between mb-8 pb-3 border-b border-neutral-200">
                <h3 className="font-serif text-2xl font-extrabold text-brand-charcoal flex items-center gap-2">
                  🛠️ Coating & Color Services
                </h3>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* 1. Interior Design Card */}
                <div
                  onClick={() => setModalState({
                    isOpen: true,
                    activeItem: {
                      name: "Architectural Color Consultation",
                      scope: "Full Color Scheme & Coating Specification",
                      tag: "MIC-SRV-01",
                      desc: "Curate elegant paint concepts with expert color consulting, customized texture boards, and premium paint specifications.",
                      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800",
                      fallback: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800"
                    },
                    type: 'service'
                  })}
                  className="bg-white border-2 border-brand-charcoal rounded-2xl p-5 shadow-[4px_4px_0px_0px_#1a6b3c] transition-all duration-150 hover:shadow-[6px_6px_0px_0px_#1a6b3c] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-[2px_2px_0px_0px_#1a6b3c] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer text-left flex flex-col justify-between h-full relative"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border-2 border-brand-charcoal font-mono text-[9px] font-black tracking-widest uppercase bg-micmag-green text-white">
                        MICMAG SERVICE
                      </span>
                      <span className="font-mono text-[10px] text-[#78716c] font-black uppercase">
                        MIC-SRV-01
                      </span>
                    </div>

                    <div className="relative h-48 w-full border-2 border-brand-charcoal rounded-xl overflow-hidden bg-white mb-4">
                      <img
                        src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800"
                        alt="Interior Design Consultation"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h4 className="font-display text-lg font-black text-brand-charcoal leading-tight mb-2">
                      Architectural Color Consultation
                    </h4>
                    <p className="text-xs text-[#78716c] leading-relaxed mb-4">
                      Curate elegant paint concepts with expert color consulting, customized texture boards, and premium paint specifications.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 mt-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalState({
                          isOpen: true,
                          activeItem: {
                            name: "Architectural Color Consultation",
                            scope: "Full Color Scheme & Coating Specification",
                            tag: "MIC-SRV-01",
                            desc: "Curate elegant paint concepts with expert color consulting, customized texture boards, and premium paint specifications.",
                            image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800",
                            fallback: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800"
                          },
                          type: 'service'
                        });
                      }}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-transparent text-brand-charcoal border-2 border-brand-charcoal shadow-[2px_2px_0px_0px_var(--color-brand-charcoal)] font-sans text-xs font-semibold transition-all hover:bg-neutral-50 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_var(--color-brand-charcoal)] cursor-pointer"
                    >
                      <span>View Details</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const text = "Hello! I am interested in booking an Architectural Color Consultation with your team.";
                        openWhatsApp('2347052940445', text);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-white bg-micmag-green border-2 border-brand-charcoal shadow-[2px_2px_0px_0px_var(--color-brand-charcoal)] font-sans text-xs font-bold transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_var(--color-brand-charcoal)] cursor-pointer"
                    >
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white shrink-0" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      <span>Enquire on WhatsApp</span>
                    </button>
                  </div>
                </div>

                {/* 2. Coming Soon (Carpentry) Card (Section 1f coming soon card with lock icon) */}
                <div
                  className="bg-white border-2 border-dashed border-[#a8a29e] rounded-2xl p-5 opacity-70 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.08)] text-left flex flex-col justify-between h-full relative"
                >
                  <div className="absolute top-4 right-4 text-[#a8a29e]">
                    <Lock className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border-2 border-[#a8a29e] font-mono text-[9px] font-black tracking-widest uppercase bg-[#f5f5f4] text-[#78716c]">
                        COMING SOON
                      </span>
                    </div>

                    <div className="relative h-48 w-full border-2 border-dashed border-[#a8a29e] rounded-xl overflow-hidden bg-neutral-50 mb-4 flex items-center justify-center">
                      <img
                        src="https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800"
                        alt="Coming Soon Carpentry"
                        className="w-full h-full object-cover filter grayscale opacity-60"
                      />
                    </div>

                    <h4 className="font-display text-lg font-black text-[#a8a29e] leading-tight mb-2">
                      Substrate Testing & Inspection
                    </h4>
                    <p className="text-xs text-[#78716c] leading-relaxed mb-4">
                      Technical moisture analysis, substrate checking, and custom formulation recommendations for complex structures. (Launching Q4 2026)
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 mt-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const text = "Hello! I am interested in registering interest for your custom Substrate Testing & Inspection services when they launch.";
                        openWhatsApp('2347052940445', text);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-transparent border-2 border-dashed border-[#a8a29e] text-[#78716c] hover:bg-neutral-50 transition-all font-sans text-xs font-bold cursor-pointer"
                    >
                      <span>Register Interest</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Technical Specifications Sheet (TDS) Modal Overlay */}
        <AnimatePresence>
          {activeTds && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-lg overflow-hidden"
              onClick={() => setActiveTds(null)}
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="bg-white text-brand-charcoal w-full h-full flex flex-col shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Premium technical header */}
                <div className="bg-neutral-900 text-[#f4efe5] px-6 py-5 border-b border-neutral-800 flex-shrink-0">
                  <div className="max-w-4xl mx-auto flex justify-between items-center w-full">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-micmag-red font-extrabold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-micmag-red animate-pulse" />
                        Official Technical Data Sheet (TDS)
                      </span>
                      <h3 className="font-serif text-lg md:text-2xl font-bold tracking-tight mt-1">{activeTds.tdsSpec?.title}</h3>
                    </div>
                    <button
                      onClick={() => setActiveTds(null)}
                      className="text-neutral-400 hover:text-white p-2.5 rounded-full hover:bg-neutral-850 transition-colors cursor-pointer ml-4"
                    >
                      <X className="w-5.5 h-5.5" />
                    </button>
                  </div>
                </div>

                {/* Scrollable Content Pane */}
                <div className="flex-1 overflow-y-auto">
                  <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-8 font-sans leading-relaxed text-[13.5px] text-neutral-800">

                    {/* Short meta description */}
                    <div className="bg-red-50/40 rounded-[4px] border border-red-100 p-5 shadow-sm">
                      <p className="font-serif italic text-brand-charcoal text-[0.94rem] leading-relaxed">
                        "{activeTds.tdsSpec?.description}"
                      </p>
                    </div>

                    {/* 2-Column Specs Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">

                      {/* Left Column: Basic Spec Table */}
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-xs font-mono font-black uppercase tracking-wider text-brand-charcoal pb-1.5 border-b border-neutral-200 flex items-center gap-1.5 mb-3.5">
                            <BookOpen className="w-4 h-4 text-micmag-red" /> Product Specifications
                          </h4>
                          <div className="space-y-2.5 font-mono text-[11px]">
                            <div className="flex justify-between py-1.5 border-b border-neutral-100">
                              <span className="text-neutral-500">PACK SIZE:</span>
                              <span className="font-bold text-brand-charcoal">{activeTds.tdsSpec?.packSize}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-neutral-100">
                              <span className="text-neutral-500">FINISH LOOK:</span>
                              <span className="font-bold text-brand-charcoal">{activeTds.tdsSpec?.finish}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-neutral-100">
                              <span className="text-neutral-500">VOLUME SOLIDS:</span>
                              <span className="font-bold text-brand-charcoal">{activeTds.tdsSpec?.volumeSolids || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-neutral-100">
                              <span className="text-neutral-500">PIGMENT TYPE:</span>
                              <span className="font-bold text-brand-charcoal text-right truncate max-w-[200px]" title={activeTds.tdsSpec?.composition?.pigment}>
                                {activeTds.tdsSpec?.composition?.pigment}
                              </span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-neutral-100">
                              <span className="text-neutral-500">RESIN BINDER:</span>
                              <span className="font-bold text-brand-charcoal text-right truncate max-w-[200px]" title={activeTds.tdsSpec?.composition?.binder}>
                                {activeTds.tdsSpec?.composition?.binder}
                              </span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-neutral-100">
                              <span className="text-neutral-500">SOLVENT:</span>
                              <span className="font-bold text-brand-charcoal">{activeTds.tdsSpec?.composition?.solvent}</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2">
                          <h4 className="text-xs font-mono font-black uppercase tracking-wider text-brand-charcoal pb-1.5 border-b border-neutral-200 flex items-center gap-1.5 mb-3.5">
                            <Shield className="w-4 h-4 text-micmag-red" /> Key Performance Benefits
                          </h4>
                          <ul className="space-y-2 text-neutral-700 list-none pl-0">
                            {activeTds.tdsSpec?.keyBenefits?.map((benefit: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2.5">
                                <span className="text-micmag-red text-sm leading-none mt-0.5">✓</span>
                                <span className="text-[12.5px] md:text-[13px]">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Right Column: Drying & Application */}
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-xs font-mono font-black uppercase tracking-wider text-brand-charcoal pb-1.5 border-b border-neutral-200 flex items-center gap-1.5 mb-3.5">
                            <Timer className="w-4 h-4 text-micmag-red" /> Drying & Film Properties
                          </h4>
                          <div className="space-y-2.5 font-mono text-[11px]">
                            <div className="flex justify-between py-1.5 border-b border-neutral-100">
                              <span className="text-neutral-500">TOUCH DRY TIME:</span>
                              <span className="font-bold text-brand-charcoal">{activeTds.tdsSpec?.dryingInfo?.touchDry}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-neutral-100">
                              <span className="text-neutral-500">HARD RECOAT DRY:</span>
                              <span className="font-bold text-brand-charcoal">{activeTds.tdsSpec?.dryingInfo?.hardDry}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-neutral-100">
                              <span className="text-neutral-500">RECOMMENDED COATS:</span>
                              <span className="font-bold text-brand-charcoal">{activeTds.tdsSpec?.dryingInfo?.opacity}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-mono font-black uppercase tracking-wider text-brand-charcoal pb-1.5 border-b border-neutral-200 flex items-center gap-1.5 mb-3">
                            🌱 Architectural Intended Uses
                          </h4>
                          <ul className="space-y-2 pl-0 pr-1 list-none text-neutral-700">
                            {activeTds.tdsSpec?.typicalUses?.map((use: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2.5">
                                <span className="w-2 h-2 rounded-full bg-micmag-red inline-block mt-1.5 flex-shrink-0" />
                                <span className="text-[12.5px] leading-relaxed">{use}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-xs font-mono font-black uppercase tracking-wider text-brand-charcoal pb-1.5 border-b border-neutral-200 flex items-center gap-1.5 mb-2.5">
                            📏 Theoretical Material Spread
                          </h4>
                          <p className="text-[11.5px] leading-relaxed text-neutral-600 bg-neutral-50 border border-neutral-100 p-3.5 rounded-[3px] font-mono">
                            {activeTds.tdsSpec?.theoreticalCoverage}
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* Thinning instructions panel */}
                    {activeTds.tdsSpec?.thinning && (
                      <div className="border border-neutral-200 rounded-[4px] overflow-hidden shadow-sm">
                        <div className="bg-neutral-50 px-5 py-3 border-b border-neutral-200 font-mono text-[11.5px] font-bold text-brand-charcoal">
                          ⚙️ Technical Thinning & Mixing Directions (SOP Standard)
                        </div>
                        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-6 text-neutral-700 text-[12.5px]">
                          <div>
                            <span className="font-bold block text-[10.5px] font-mono text-neutral-500 mb-1 uppercase">Brush or Roller:</span>
                            <p className="leading-relaxed">{activeTds.tdsSpec.thinning.brushRoller}</p>
                          </div>
                          <div>
                            <span className="font-bold block text-[10.5px] font-mono text-neutral-500 mb-1 uppercase">Conventional Spray:</span>
                            <p className="leading-relaxed">{activeTds.tdsSpec.thinning.spray || 'Not recommended.'}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Safety and Support */}
                    <div className="bg-neutral-950 text-neutral-300 p-5 rounded-[4px] space-y-2.5 text-[11.5px] font-mono border border-neutral-850">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-micmag-red flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold uppercase text-[10px] tracking-widest text-neutral-400">Project Storage Safety & Transport Info:</span>
                          <p className="text-neutral-300 font-sans text-[12px] leading-relaxed mt-1">
                            {activeTds.tdsSpec?.safetyStorage?.storage}
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Footer trigger quote / action on whatsapp */}
                <div className="bg-neutral-100 border-t border-neutral-200 px-6 py-5 flex-shrink-0">
                  <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between w-full">
                    <span className="text-[10px] text-brand-mid font-mono tracking-wider">SOP TECHNICAL DOCUMENT ID: SOP/TECH/001/APPNDX03</span>
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => {
                          handleWhatsAppInquiry(activeTds.name, activeTds.brand || 'sandtex');
                          setActiveTds(null);
                        }}
                        className="bg-[#25D366] hover:bg-[#20b855] text-white text-[11.5px] font-mono font-bold py-2.5 px-5 rounded-[4px] flex items-center gap-1.5 transition-all shadow hover:shadow-md cursor-pointer justify-center"
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white shrink-0" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        <span>Consult on WhatsApp</span>
                      </button>
                      <button
                        onClick={() => {
                          handleSelectProductForQuote(activeTds.name, activeTds.brand || 'sandtex');
                          setActiveTds(null);
                        }}
                        className="bg-brand-charcoal hover:bg-neutral-800 text-white text-[11.5px] font-mono font-bold py-2.5 px-5 rounded-[4px] flex items-center gap-1 transition-all shadow hover:shadow-md cursor-pointer justify-center"
                      >
                        <span>📋 Close & Get Quote</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {modalState.isOpen && (
            <ProductDetailModal
              isOpen={modalState.isOpen}
              onClose={() => setModalState({ isOpen: false, activeItem: null, type: 'product' })}
              type={modalState.type}
              item={modalState.activeItem}
            />
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
