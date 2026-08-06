import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Eye, Droplets, Ruler, Tag } from 'lucide-react';

export interface ShowroomProduct {
  id: string;
  name: string;
  desc: string;
  tag: string;
  coverage?: string;
  image: string;
  fallback: string;
  brand: 'sandtex' | 'caplux' | 'bathroom';
}

interface ShowroomCardProps {
  product: ShowroomProduct;
  index: number;
  onAddToBasket: (product: ShowroomProduct) => void;
  onViewDetail: (product: ShowroomProduct) => void;
}

const BRAND_CONFIG = {
  sandtex: {
    chip: 'Sandtex',
    chipBg: 'rgba(234,108,0,0.12)',
    chipColor: '#ea6c00',
    chipBorder: 'rgba(234,108,0,0.25)',
    glow: 'rgba(234,108,0,0.15)',
    accent: '#ea6c00',
  },
  caplux: {
    chip: 'Caplux',
    chipBg: 'rgba(59,130,246,0.12)',
    chipColor: '#60a5fa',
    chipBorder: 'rgba(59,130,246,0.25)',
    glow: 'rgba(59,130,246,0.15)',
    accent: '#3b82f6',
  },
  bathroom: {
    chip: 'Micmag Fittings',
    chipBg: 'rgba(16,185,129,0.12)',
    chipColor: '#34d399',
    chipBorder: 'rgba(16,185,129,0.25)',
    glow: 'rgba(16,185,129,0.15)',
    accent: '#10b981',
  },
};

export default function ShowroomCard({ product, index, onAddToBasket, onViewDetail }: ShowroomCardProps) {
  const [imgSrc, setImgSrc] = useState(product.image);
  const [isHovered, setIsHovered] = useState(false);
  const cfg = BRAND_CONFIG[product.brand];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative rounded-2xl overflow-hidden group"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: isHovered ? `0 24px 60px ${cfg.glow}` : '0 4px 20px rgba(0,0,0,0.3)',
        transition: 'box-shadow 0.4s ease, transform 0.3s ease',
        transform: isHovered ? 'translateY(-6px) perspective(1000px) rotateX(1deg)' : 'none',
      }}
    >
      {/* Image area */}
      <div className="relative h-52 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <img
          src={imgSrc}
          alt={product.name}
          onError={() => setImgSrc(product.fallback)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay on hover */}
        <div
          className="absolute inset-0 flex items-center justify-center gap-3 transition-opacity duration-300"
          style={{ background: 'rgba(0,0,0,0.55)', opacity: isHovered ? 1 : 0 }}
        >
          <button
            id={`showroom-view-${product.id}`}
            onClick={() => onViewDetail(product)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white border border-white/30 hover:bg-white/20 transition-colors"
          >
            <Eye size={14} /> View
          </button>
          <button
            id={`showroom-add-${product.id}`}
            onClick={() => onAddToBasket(product)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors"
            style={{ background: cfg.accent, color: '#fff' }}
          >
            <ShoppingBag size={14} /> Inquire
          </button>
        </div>

        {/* Brand chip */}
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{ background: cfg.chipBg, color: cfg.chipColor, border: `1px solid ${cfg.chipBorder}`, backdropFilter: 'blur(8px)' }}
        >
          {cfg.chip}
        </div>

        {/* Coverage badge */}
        {product.coverage && (
          <div
            className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ background: 'rgba(0,0,0,0.6)', color: '#c9a84c', backdropFilter: 'blur(8px)' }}
          >
            <Ruler size={10} /> {product.coverage}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Tag */}
        <div className="flex items-center gap-1.5 mb-2">
          <Tag size={11} style={{ color: cfg.chipColor }} />
          <span className="text-xs uppercase tracking-wider" style={{ color: cfg.chipColor }}>{product.tag}</span>
        </div>

        {/* Name */}
        <h3 className="font-semibold text-white text-base leading-snug mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Desc */}
        <p className="text-xs leading-relaxed mb-4 line-clamp-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {product.desc}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onAddToBasket(product)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200"
            style={{ background: cfg.chipBg, color: cfg.chipColor, border: `1px solid ${cfg.chipBorder}` }}
          >
            <ShoppingBag size={13} /> Add to Inquiry
          </button>
          <button
            onClick={() => onViewDetail(product)}
            className="px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 hover:bg-white/10"
            style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' }}
          >
            <Eye size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
