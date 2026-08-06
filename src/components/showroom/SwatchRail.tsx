import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Swatch {
  name: string;
  hex: string;
}

interface SwatchRailProps {
  selected: string | null;
  onSelect: (name: string) => void;
}

// Curated Sandtex-style color palette
export const SANDTEX_COLORS: Swatch[] = [
  { name: 'Brilliant White', hex: '#f8f9fa' },
  { name: 'Ivory Cream', hex: '#fffbeb' },
  { name: 'Warm Sand', hex: '#e8d5b7' },
  { name: 'Sahara Dust', hex: '#d4a96a' },
  { name: 'Terracotta', hex: '#c4622d' },
  { name: 'Burnt Sienna', hex: '#a0522d' },
  { name: 'Sunset Amber', hex: '#e07b39' },
  { name: 'Harvest Gold', hex: '#c9a84c' },
  { name: 'Lemon Zest', hex: '#f4d03f' },
  { name: 'Sage Mist', hex: '#b7c9a8' },
  { name: 'Forest Fern', hex: '#4a7c59' },
  { name: 'Emerald Isle', hex: '#1a6b3c' },
  { name: 'Tropical Leaf', hex: '#2d6a4f' },
  { name: 'Sky Haze', hex: '#b8d4e8' },
  { name: 'Ocean Mist', hex: '#7ba7bc' },
  { name: 'Midnight Blue', hex: '#1a2c5b' },
  { name: 'Cobalt Dusk', hex: '#2d4a8e' },
  { name: 'Slate Cloud', hex: '#8fa3b1' },
  { name: 'Storm Grey', hex: '#5a6472' },
  { name: 'Charcoal Noir', hex: '#2c2c2c' },
  { name: 'Blush Rose', hex: '#f4a0a0' },
  { name: 'Dusty Mauve', hex: '#c4919b' },
  { name: 'Crimson Spice', hex: '#8b1a1a' },
  { name: 'Lavender Hush', hex: '#b8a9c9' },
  { name: 'Plum Dusk', hex: '#6b4c7a' },
];

function isDark(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

export default function SwatchRail({ selected, onSelect }: SwatchRailProps) {
  const railRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    railRef.current?.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  const selectedSwatch = SANDTEX_COLORS.find((s) => s.name === selected);

  return (
    <div className="py-6">
      {/* Label */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: '#c9a84c' }}>
            Color Palette
          </p>
          <p className="text-sm text-white/60">
            {selected
              ? <span>Selected: <strong className="text-white">{selected}</strong></span>
              : 'Tap a swatch to preview color'}
          </p>
        </div>
        {selectedSwatch && (
          <motion.div
            key={selectedSwatch.hex}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-10 h-10 rounded-full border-2 border-white/30 shadow-lg"
            style={{ background: selectedSwatch.hex }}
          />
        )}
      </div>

      {/* Rail */}
      <div className="relative">
        <button
          id="swatch-scroll-left"
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
          style={{ background: 'rgba(13,21,38,0.9)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' }}
        >
          <ChevronLeft size={16} />
        </button>

        <div
          ref={railRef}
          className="flex gap-3 overflow-x-auto px-10 pb-2 no-scrollbar"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {SANDTEX_COLORS.map((swatch) => {
            const isSelected = selected === swatch.name;
            const dark = isDark(swatch.hex);
            return (
              <motion.button
                key={swatch.name}
                id={`swatch-${swatch.name.replace(/\s+/g, '-').toLowerCase()}`}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelect(swatch.name)}
                className="flex-shrink-0 flex flex-col items-center gap-1.5 group"
                style={{ scrollSnapAlign: 'start' }}
                title={swatch.name}
              >
                <div
                  className="w-10 h-10 rounded-full transition-all duration-200"
                  style={{
                    background: swatch.hex,
                    border: isSelected ? '3px solid #c9a84c' : '2px solid rgba(255,255,255,0.15)',
                    boxShadow: isSelected ? `0 0 0 2px rgba(201,168,76,0.4), 0 4px 12px rgba(0,0,0,0.4)` : '0 2px 8px rgba(0,0,0,0.3)',
                    transform: isSelected ? 'scale(1.2)' : undefined,
                  }}
                >
                  {isSelected && (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold"
                      style={{ color: dark ? '#fff' : '#000' }}>
                      ✓
                    </div>
                  )}
                </div>
                <span
                  className="text-[9px] text-center leading-tight max-w-[44px] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                >
                  {swatch.name}
                </span>
              </motion.button>
            );
          })}
        </div>

        <button
          id="swatch-scroll-right"
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
          style={{ background: 'rgba(13,21,38,0.9)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
