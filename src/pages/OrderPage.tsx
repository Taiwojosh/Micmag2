import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import WhatsAppOrderBuilder from '../components/WhatsAppOrderBuilder';

export default function OrderPage() {
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
            <span>BESPOKE PAINT ORDER</span>
          </div>
        </div>

        {/* Hero Header for Order */}
        <div className="bg-[#101114] text-white rounded-[6px] border border-neutral-800 p-8 md:p-12 mb-12 relative overflow-hidden text-left">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-brand-red/10 to-transparent pointer-events-none" />
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-brand-red/5 rounded-full filter blur-3xl pointer-events-none" />
          
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-brand-red/10 border border-brand-red/25 text-brand-red px-3 py-1 rounded-[3px] text-[10px] font-mono font-black uppercase tracking-wider">
              <ShoppingBag className="w-3.5 h-3.5 text-brand-red" /> Instant Sourcing & Verification
            </div>
            
            <h1 className="font-serif text-3xl sm:text-4xl md:text-[2.8rem] leading-[1.12] font-black text-white">
              Bespoke WhatsApp <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-brand-red">
                Paint Order Builder
              </span>
            </h1>
            
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed max-w-2xl">
              Select your luxury paint brand model, customize your specific color selection, size, and quantity, and immediately compile an automated prefilled WhatsApp inquiry directly to our formulation experts.
            </p>
          </div>
        </div>

        {/* Main WhatsApp Order Builder Component */}
        <div className="bg-white rounded-[6px] border border-neutral-200/80 shadow-sm overflow-hidden">
          <WhatsAppOrderBuilder />
        </div>
      </div>
    </motion.div>
  );
}
