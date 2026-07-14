import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../utils/usePageMeta';
import WhatsAppOrderBuilder from '../components/WhatsAppOrderBuilder';

export default function OrderPage() {
  usePageMeta({
    title: 'Order Paint Swatches & Samples',
    description:
      'Build a bespoke Sandtex or Caplux paint order via WhatsApp. ' +
      'Select your product, finish, and litre quantity — we dispatch samples nationwide.',
    ogTitle: 'Order Sandtex Paint Swatches | Micmag Homes & Fittings',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-screen bg-brand-cream pt-28 pb-16 px-5 md:px-[5%]"
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

        {/* Main WhatsApp Order Builder Component */}
        <div className="bg-white rounded-[6px] border border-neutral-200/80 shadow-sm overflow-hidden">
          <WhatsAppOrderBuilder />
        </div>
      </div>
    </motion.div>
  );
}
