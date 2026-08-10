import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Palette,
  Sparkles,
  SlidersHorizontal,
  Search,
  Check,
  Info,
  MessageCircle,
  Calculator,
  Plus,
  Layers,
} from 'lucide-react';
import {
  SANDTEX_PALETTE,
  DESIGNER_HARMONIES,
  SURFACES,
  type SwatchColor,
  type ColorHarmony,
  type SurfaceKey,
} from '../../data/showroomData';
import { openWhatsApp } from '../../utils/whatsapp';

interface ColorStudioProps {
  activeSurface: SurfaceKey;
  onSelectSurface: (surface: SurfaceKey) => void;
  colors: Record<SurfaceKey, string>;
  onApplyColor: (surface: SurfaceKey, hex: string) => void;
  onApplyHarmony: (harmony: ColorHarmony) => void;
  roomName: string;
  onOpenCalculator: () => void;
}

type TabMode = 'swatches' | 'harmonies' | 'mixer';

export default function ColorStudio({
  activeSurface,
  onSelectSurface,
  colors,
  onApplyColor,
  onApplyHarmony,
  roomName,
  onOpenCalculator,
}: ColorStudioProps) {
  const [tab, setTab] = useState<TabMode>('swatches');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customHex, setCustomHex] = useState<string>(colors[activeSurface]);
  const [brightnessOffset, setBrightnessOffset] = useState<number>(0);

  // Find active swatch metadata
  const currentActiveHex = colors[activeSurface].toLowerCase();
  const activeSwatch = useMemo(() => {
    return (
      SANDTEX_PALETTE.find((s) => s.hex.toLowerCase() === currentActiveHex) || {
        id: 'custom',
        name: 'Custom Mixed Shade',
        hex: colors[activeSurface],
        category: 'neutral' as const,
        code: 'STX-CUSTOM',
        productLine: 'Sandtex Custom Mix',
        desc: 'Custom formulated designer tone ready for on-site batch mixing.',
      }
    );
  }, [currentActiveHex, colors, activeSurface]);

  // Filter swatches
  const filteredSwatches = useMemo(() => {
    return SANDTEX_PALETTE.filter((s) => {
      const matchCat = categoryFilter === 'all' || s.category === categoryFilter;
      const matchSearch =
        searchQuery.trim() === '' ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [categoryFilter, searchQuery]);

  // Handle custom tint slider
  const handleBrightnessChange = (val: number) => {
    setBrightnessOffset(val);
    // Simple hex brightness shift
    try {
      const num = parseInt(customHex.replace('#', ''), 16);
      let r = (num >> 16) + val;
      let g = ((num >> 8) & 0x00ff) + val;
      let b = (num & 0x0000ff) + val;
      r = Math.min(255, Math.max(0, r));
      g = Math.min(255, Math.max(0, g));
      b = Math.min(255, Math.max(0, b));
      const newHex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      onApplyColor(activeSurface, newHex);
    } catch {
      // fallback
    }
  };

  const handleWhatsAppInquiry = () => {
    const activeInfo = SURFACES.find((s) => s.key === activeSurface);
    const text =
      `🎨 *Micmag Digital Showroom — Paint Inquiry*\n\n` +
      `Hello Micmag! I am customizing colors for my *${roomName}*:\n\n` +
      `• *Main Wall:* ${colors.mainWall}\n` +
      `• *Accent Feature Wall:* ${colors.accentWall}\n` +
      `• *Ceiling:* ${colors.ceiling}\n` +
      `• *Trim & Mouldings:* ${colors.trim}\n` +
      `• *Accents:* ${colors.accents}\n\n` +
      `📌 *Currently Selected Paint:* ${activeSwatch.name} (${activeSwatch.code}) for ${activeInfo?.label}\n` +
      `• Product: ${activeSwatch.productLine}\n\n` +
      `Could you please confirm availability and provide a direct quote for supply/application?`;

    openWhatsApp('2347052940445', text);
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1629] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
      {/* ── Studio Navigation Tabs ── */}
      <div className="flex items-center justify-between p-2 bg-[#09101f] border-b border-white/10">
        <div className="flex gap-1 p-1 bg-black/40 rounded-2xl w-full">
          <button
            onClick={() => setTab('swatches')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              tab === 'swatches'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Palette size={14} />
            <span>Sandtex Colors</span>
          </button>
          <button
            onClick={() => setTab('harmonies')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              tab === 'harmonies'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Sparkles size={14} />
            <span>Designer Mixes</span>
          </button>
          <button
            onClick={() => setTab('mixer')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              tab === 'mixer'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <SlidersHorizontal size={14} />
            <span>Color Mixer</span>
          </button>
        </div>
      </div>

      {/* ── Tab Content Body ── */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar">
        {/* TAB 1: CURATED SWATCHES */}
        {tab === 'swatches' && (
          <div className="space-y-4">
            {/* Search and Category Filter */}
            <div className="space-y-2.5">
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Search colors by name, code or mood..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400/70"
                />
              </div>

              {/* Category Pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {[
                  { id: 'all', label: 'All (28)' },
                  { id: 'earth', label: 'Warm Earth' },
                  { id: 'green', label: 'Botanical Greens' },
                  { id: 'blue', label: 'Coastal Blues' },
                  { id: 'neutral', label: 'Whites & Creams' },
                  { id: 'grey', label: 'Architectural Greys' },
                  { id: 'spice', label: 'Luxury Spices' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      categoryFilter === cat.id
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'bg-white/5 text-white/50 hover:text-white/80'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Swatches Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
              {filteredSwatches.map((swatch) => {
                const isSelected = colors[activeSurface].toLowerCase() === swatch.hex.toLowerCase();
                return (
                  <motion.button
                    key={swatch.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onApplyColor(activeSurface, swatch.hex)}
                    className={`group relative flex flex-col items-center p-2 rounded-2xl border transition-all text-center ${
                      isSelected
                        ? 'bg-white/15 border-amber-400 shadow-md shadow-amber-500/20'
                        : 'bg-white/5 border-white/10 hover:border-white/25'
                    }`}
                  >
                    {/* Circle Swatch */}
                    <div
                      className="relative w-11 h-11 rounded-xl shadow-inner border border-white/20 mb-1.5 transition-transform group-hover:scale-105"
                      style={{ backgroundColor: swatch.hex }}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center text-white drop-shadow">
                          <Check size={14} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    {/* Name & Code */}
                    <span className="text-[11px] font-bold text-white truncate w-full">{swatch.name}</span>
                    <span className="text-[9px] text-white/40 font-mono uppercase">{swatch.code}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: DESIGNER MIXES / HARMONIES */}
        {tab === 'harmonies' && (
          <div className="space-y-4">
            <p className="text-xs text-white/60 leading-relaxed">
              Curated 60-30-10 interior designer mixtures combining dominant wall, accent feature, ceiling, and trim.
            </p>

            <div className="space-y-3">
              {DESIGNER_HARMONIES.map((harmony) => (
                <motion.div
                  key={harmony.id}
                  whileHover={{ y: -2 }}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div>
                      <h4 className="text-sm font-bold text-white font-serif">{harmony.name}</h4>
                      <p className="text-xs text-amber-300/90 font-medium">{harmony.tagline}</p>
                    </div>
                    <button
                      onClick={() => onApplyHarmony(harmony)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-black hover:bg-amber-400 transition-all flex items-center gap-1 shadow-sm"
                    >
                      <Sparkles size={12} /> Apply Mix
                    </button>
                  </div>

                  <p className="text-xs text-white/50 leading-relaxed mb-3">{harmony.description}</p>

                  {/* 5-part Color Strip */}
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-black/30 border border-white/5">
                    <div className="flex-1 flex flex-col items-center">
                      <div className="w-full h-6 rounded-lg border border-white/20" style={{ backgroundColor: harmony.mainWall }} />
                      <span className="text-[9px] text-white/40 mt-1">Main (60%)</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div className="w-full h-6 rounded-lg border border-white/20" style={{ backgroundColor: harmony.accentWall }} />
                      <span className="text-[9px] text-white/40 mt-1">Accent (30%)</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div className="w-full h-6 rounded-lg border border-white/20" style={{ backgroundColor: harmony.ceiling }} />
                      <span className="text-[9px] text-white/40 mt-1">Ceiling</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div className="w-full h-6 rounded-lg border border-white/20" style={{ backgroundColor: harmony.trim }} />
                      <span className="text-[9px] text-white/40 mt-1">Trim (10%)</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: COLOR MIXER */}
        {tab === 'mixer' && (
          <div className="space-y-4">
            <p className="text-xs text-white/60 leading-relaxed">
              Mix custom shades, adjust brightness, or paste an exact architect hex code for on-site matching.
            </p>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              {/* Color input + Hex field */}
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={colors[activeSurface]}
                  onChange={(e) => {
                    setCustomHex(e.target.value);
                    onApplyColor(activeSurface, e.target.value);
                  }}
                  className="w-14 h-14 rounded-2xl border-2 border-white/20 cursor-pointer bg-transparent"
                />
                <div className="flex-1">
                  <label className="text-[10px] text-white/50 uppercase tracking-widest font-mono block mb-1">
                    Hex Color Code
                  </label>
                  <input
                    type="text"
                    value={colors[activeSurface]}
                    onChange={(e) => onApplyColor(activeSurface, e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-sm font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Tint / Brightness slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-white/70">
                  <span>Tone / Lightness Shift</span>
                  <span className="font-mono">{brightnessOffset > 0 ? `+${brightnessOffset}` : brightnessOffset}</span>
                </div>
                <input
                  type="range"
                  min="-60"
                  max="60"
                  value={brightnessOffset}
                  onChange={(e) => handleBrightnessChange(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Active Paint Specification Card ── */}
        <div className="p-4 rounded-2xl bg-[#09101f] border border-amber-500/20 shadow-lg space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl border border-white/30 shadow-inner flex-shrink-0"
                style={{ backgroundColor: activeSwatch.hex }}
              />
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  {SURFACES.find((s) => s.key === activeSurface)?.label} Spec
                </span>
                <h4 className="text-sm font-bold text-white leading-tight">{activeSwatch.name}</h4>
                <p className="text-[10px] text-white/50 font-mono">{activeSwatch.code}</p>
              </div>
            </div>

            <button
              onClick={onOpenCalculator}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-amber-300 font-semibold transition-all"
            >
              <Calculator size={13} />
              <span>Yield Calc</span>
            </button>
          </div>

          <p className="text-xs text-white/60 leading-relaxed">{activeSwatch.desc}</p>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10 text-[11px]">
            <div>
              <span className="text-white/40 block text-[10px]">Product Line</span>
              <span className="font-semibold text-white truncate block">{activeSwatch.productLine}</span>
            </div>
            <div>
              <span className="text-white/40 block text-[10px]">Recommended Primer</span>
              <span className="font-semibold text-white truncate block">Caplux Alkali Primer</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Direct WhatsApp Action Footer ── */}
      <div className="p-4 bg-[#09101f] border-t border-white/10 space-y-2">
        <button
          onClick={handleWhatsAppInquiry}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest text-white shadow-lg transition-all hover:brightness-110 active:scale-[0.99]"
          style={{ background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)' }}
        >
          <MessageCircle size={16} />
          Inquire Palette on WhatsApp
        </button>
      </div>
    </div>
  );
}
