import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, Award, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import SandtexAdvantage from '../components/SandtexAdvantage';

export default function CapSpecificationsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-screen bg-[#FAF9F5] pt-28 pb-16 px-5 md:px-[5%]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Navigation Breadcrumbs Bar */}
        <div className="flex items-center justify-between border-b border-neutral-200/60 pb-5 mb-8 text-left">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-brand-mid hover:text-brand-red transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Return to Showroom Hub</span>
          </Link>
          
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-neutral-400">
            <span>SHOWROOM</span>
            <span>/</span>
            <span>CAP PLC SPECIFICATIONS</span>
          </div>
        </div>

        {/* Feature Hero Banner */}
        <div className="bg-[#101114] text-white rounded-[6px] border border-neutral-800 p-8 md:p-12 mb-12 relative overflow-hidden text-left">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-brand-yellow/10 to-transparent pointer-events-none" />
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-brand-yellow/5 rounded-full filter blur-3xl pointer-events-none" />
          
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-[#FF6B00]/10 border border-[#FF6B00]/25 text-brand-yellow px-3 py-1 rounded-[3px] text-[10px] font-mono font-black uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" /> Authenticated Builder Program
            </div>
            
            <h1 className="font-serif text-3xl sm:text-4xl md:text-[2.8rem] leading-[1.12] font-black text-white">
              Official CAP Plc <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow to-orange-500">
                Technical Specifications
              </span>
            </h1>
            
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed max-w-2xl">
              Engineered by Chemical and Allied Products (CAP) Plc, Nigeria's premier coatings brand. This dedicated specifications console hosts certified structural paint application procedures, interactive yield calculators, and builder codes.
            </p>
          </div>
        </div>

        {/* Render main SandtexAdvantage system components inside */}
        <div className="bg-white rounded-[6px] border border-neutral-200/80 shadow-sm overflow-hidden">
          <SandtexAdvantage />
        </div>
        
        {/* Quality Footnote block */}
        <div className="mt-8 bg-neutral-100 border border-neutral-200 rounded-[4px] p-6 text-left grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-1.5">
            <h4 className="text-xs font-black text-brand-charcoal uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#d32f2f]" /> Architectural Verification Seal
            </h4>
            <p className="text-[11px] text-brand-mid font-light leading-relaxed">
              These guidelines conform to official CAP Plc curriculum requirements for large-scale developments. Ensure dry-cure substrate readings are fully documented prior to requesting color formulations.
            </p>
          </div>
          <div className="text-right flex justify-end">
            <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200/50 px-3.5 py-1.5 rounded inline-flex items-center gap-1.5 uppercase">
              <CheckCircle className="w-3.5 h-3.5" /> Approved Standards
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
