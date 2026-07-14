import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, ShoppingBag, MapPin, PhoneCall } from 'lucide-react';
import { usePageMeta } from '../utils/usePageMeta';

export default function NotFoundPage() {
  usePageMeta({
    title: 'Page Not Found',
    description: 'The page you are looking for does not exist. Return to Micmag Homes & Fittings homepage.',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-screen bg-brand-cream flex items-center justify-center px-5 py-28"
    >
      <div className="max-w-2xl w-full text-center">

        {/* Large 404 display */}
        <div className="relative mb-8 select-none">
          <span
            className="block font-serif font-black text-[120px] sm:text-[160px] leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-micmag-red via-brand-red-deep to-micmag-blue"
          >
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 sm:w-64 sm:h-64 bg-red-100/40 rounded-full blur-3xl" />
          </div>
        </div>

        {/* Brand badge */}
        <div className="inline-flex items-center gap-2 border-2 border-brand-charcoal px-4 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 rounded-full bg-micmag-red animate-pulse" />
          <span className="font-mono text-[10px] font-black uppercase tracking-widest text-brand-charcoal">
            MICMAG — Page Not Found
          </span>
        </div>

        {/* Heading */}
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-brand-charcoal mb-3 leading-tight">
          This page doesn't exist
        </h1>
        <p className="text-sm text-[#78716c] font-light leading-relaxed max-w-md mx-auto mb-10">
          The page you're looking for may have been moved, renamed, or never existed.
          Let us take you somewhere useful.
        </p>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left max-w-md mx-auto">
          <Link
            to="/"
            className="flex items-center gap-3 border-2 border-brand-charcoal rounded-xl p-4 hover:bg-brand-charcoal hover:text-white transition-all duration-200 group"
          >
            <Home className="w-5 h-5 text-micmag-red group-hover:text-white transition-colors flex-shrink-0" />
            <div>
              <span className="block font-sans font-black text-xs text-brand-charcoal group-hover:text-white uppercase tracking-wide transition-colors">Homepage</span>
              <span className="block font-mono text-[9px] text-[#78716c] group-hover:text-neutral-400 transition-colors">Return to main showroom</span>
            </div>
          </Link>

          <Link
            to="/collections"
            className="flex items-center gap-3 border-2 border-brand-charcoal rounded-xl p-4 hover:bg-brand-charcoal hover:text-white transition-all duration-200 group"
          >
            <ShoppingBag className="w-5 h-5 text-micmag-red group-hover:text-white transition-colors flex-shrink-0" />
            <div>
              <span className="block font-sans font-black text-xs text-brand-charcoal group-hover:text-white uppercase tracking-wide transition-colors">Products</span>
              <span className="block font-mono text-[9px] text-[#78716c] group-hover:text-neutral-400 transition-colors">Browse our full catalog</span>
            </div>
          </Link>

          <Link
            to="/locations"
            className="flex items-center gap-3 border-2 border-brand-charcoal rounded-xl p-4 hover:bg-brand-charcoal hover:text-white transition-all duration-200 group"
          >
            <MapPin className="w-5 h-5 text-micmag-red group-hover:text-white transition-colors flex-shrink-0" />
            <div>
              <span className="block font-sans font-black text-xs text-brand-charcoal group-hover:text-white uppercase tracking-wide transition-colors">Store Locations</span>
              <span className="block font-mono text-[9px] text-[#78716c] group-hover:text-neutral-400 transition-colors">Lagos stores & contacts</span>
            </div>
          </Link>

          <Link
            to="/contact"
            className="flex items-center gap-3 border-2 border-brand-charcoal rounded-xl p-4 hover:bg-brand-charcoal hover:text-white transition-all duration-200 group"
          >
            <PhoneCall className="w-5 h-5 text-micmag-red group-hover:text-white transition-colors flex-shrink-0" />
            <div>
              <span className="block font-sans font-black text-xs text-brand-charcoal group-hover:text-white uppercase tracking-wide transition-colors">Contact Us</span>
              <span className="block font-mono text-[9px] text-[#78716c] group-hover:text-neutral-400 transition-colors">Speak to our team</span>
            </div>
          </Link>
        </div>

        {/* Footer note */}
        <p className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest">
          Micmag Homes & Fittings · Lagos, Nigeria
        </p>
      </div>
    </motion.div>
  );
}
