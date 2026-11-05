import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Download, 
  MessageCircle, 
  ExternalLink, 
  Check, 
  Sparkles, 
  X, 
  Eye, 
  ShieldCheck 
} from 'lucide-react';
import { 
  SANDTEX_COLORS, 
  SANDTEX_COLOR_GROUPS, 
  SandtexColorGroup, 
  SandtexColor 
} from '../data/sandtexColors';
import { openWhatsApp } from '../utils/whatsapp';

interface DigitalColorChartProps {
  onSelectColorForShowroom?: (hex: string, name: string) => void;
  className?: string;
  initialGroup?: SandtexColorGroup;
}

export default function DigitalColorChart({
  onSelectColorForShowroom,
  className = '',
  initialGroup = 'Blues',
}: DigitalColorChartProps) {
  const [selectedGroup, setSelectedGroup] = useState<SandtexColorGroup>(initialGroup);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeColor, setActiveColor] = useState<SandtexColor | null>(null);

  // Filter colors
  const displayedColors = useMemo(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return SANDTEX_COLORS.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.group.toLowerCase().includes(q)
      );
    }
    return SANDTEX_COLORS.filter((c) => c.group === selectedGroup);
  }, [searchQuery, selectedGroup]);

  // WhatsApp Order Link for a specific color
  const handleInquireColor = (color: SandtexColor) => {
    const text =
      `*MICMAG HOMES & FITTINGS — SANDTEX COLOUR ENQUIRY*\n` +
      `===================================\n\n` +
      `Hello! I am reviewing the Official Sandtex Colour Chart and would like to order / inquire about:\n\n` +
      `🎨 *Colour Name:* ${color.name}\n` +
      `📋 *Colour Code:* ${color.code}\n` +
      `📁 *Family Group:* ${color.group}\n` +
      `🪣 *Recommended Coating:* Sandtex Matt / Silk / FineBuild (20L / 4L)\n\n` +
      `Please confirm price per drum and availability for delivery/pickup. Thank you!`;
    openWhatsApp('2347052940445', text);
  };

  return (
    <div className={`bg-neutral-950 text-white rounded-3xl border border-white/10 overflow-hidden shadow-2xl ${className}`}>
      {/* ── Top Header Bar ── */}
      <div className="p-6 md:p-8 border-b border-white/10 bg-gradient-to-b from-neutral-900 to-neutral-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Official CAP Plc Factory Palette
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-white">
              Official Sandtex Colour Chart
            </h2>
            <p className="text-xs md:text-sm text-neutral-400 max-w-2xl font-light">
              Explore the exclusive 120 authentic Sandtex architectural shades in 6 distinct groups. Select a color family below to browse shades, or test in our 3D room visualizer.
            </p>
          </div>

          {/* Download PDF Action Button */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/Sandtex_Colour_Chart.pdf"
              download="Sandtex_Colour_Chart_Micmag.pdf"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-5 py-3 rounded-full text-xs uppercase tracking-wider transition-all duration-200 shadow-lg hover:scale-105 cursor-pointer shrink-0"
              title="Download full resolution PDF of official color chart"
            >
              <Download className="w-4 h-4 text-neutral-950" />
              <span>Download Colour Chart (PDF)</span>
            </a>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6 relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search all 120 colors by name (e.g. Lekki Red, Navy Blue)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/15 pl-10 pr-4 py-2.5 rounded-full text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── 2-Tier Color Navigation: The 6 Main Color Groups ── */}
      {!searchQuery && (
        <div className="p-4 md:p-6 bg-neutral-900/60 border-b border-white/10">
          <div className="text-left mb-3">
            <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-neutral-400">
              Step 1: Choose a Colour Group (20 shades each)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {SANDTEX_COLOR_GROUPS.map((grp) => {
              const isSelected = selectedGroup === grp.group;
              return (
                <button
                  key={grp.group}
                  onClick={() => {
                    setSelectedGroup(grp.group);
                    setActiveColor(null);
                  }}
                  className={`relative p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden group ${
                    isSelected
                      ? 'border-amber-400 bg-white/10 shadow-lg scale-[1.02] ring-1 ring-amber-400/50'
                      : 'border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/[0.08]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-serif text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {grp.label}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400 font-semibold bg-black/40 px-1.5 py-0.5 rounded">
                      {grp.count}
                    </span>
                  </div>

                  {/* Representative Color Bar */}
                  <div className="h-4 w-full rounded-md shadow-inner border border-white/20 mb-2 overflow-hidden" style={{ backgroundColor: grp.sampleHex }} />

                  <span className="text-[10px] text-neutral-400 leading-tight line-clamp-1 font-light">
                    {grp.desc}
                  </span>

                  {isSelected && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Active Group Sub-header & 20 Shades Grid ── */}
      <div className="p-6 md:p-8 text-left">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <span>{searchQuery ? `Search Results for "${searchQuery}"` : `${selectedGroup} Family`}</span>
              <span className="text-xs font-mono font-normal text-neutral-400">
                ({displayedColors.length} available shades)
              </span>
            </h3>
            <p className="text-xs text-neutral-400 font-light mt-0.5">
              Click any shade to preview details, apply to 3D room visualizer, or order on WhatsApp.
            </p>
          </div>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-amber-400 hover:underline cursor-pointer"
            >
              Reset to Groups
            </button>
          )}
        </div>

        {/* Shades Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-3">
          {displayedColors.map((color) => {
            const isSelected = activeColor?.name === color.name;
            return (
              <motion.button
                key={color.code}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveColor(color)}
                className={`flex flex-col items-center p-2 rounded-xl border transition-all text-center cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 bg-white/15 shadow-md shadow-amber-500/20 ring-2 ring-amber-400/40'
                    : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/[0.08]'
                }`}
              >
                {/* Color Swatch Tile */}
                <div
                  className="w-full aspect-square rounded-lg shadow-inner border border-white/20 mb-2 relative transition-transform"
                  style={{ backgroundColor: color.hex }}
                >
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center text-white drop-shadow">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </div>

                <span className="text-[11px] font-bold text-white truncate w-full leading-tight">
                  {color.name}
                </span>
                <span className="text-[9px] font-mono text-neutral-400 mt-0.5">
                  {color.code}
                </span>
              </motion.button>
            );
          })}
        </div>

        {displayedColors.length === 0 && (
          <div className="py-12 text-center text-neutral-400">
            <p className="text-sm">No Sandtex colors found matching "{searchQuery}".</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-3 text-xs text-amber-400 font-bold underline"
            >
              Clear search and view all colors
            </button>
          </div>
        )}
      </div>

      {/* ── Active Swatch Detail Tray (Modal / Drawer) ── */}
      <AnimatePresence>
        {activeColor && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="border-t border-white/15 bg-neutral-900/90 backdrop-blur-md p-6 md:p-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 text-left">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 md:w-20 md:h-20 rounded-2xl shadow-2xl border-2 border-white/30 shrink-0"
                  style={{ backgroundColor: activeColor.hex }}
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {activeColor.group} Family
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {activeColor.code} • {activeColor.hex}
                    </span>
                  </div>
                  <h4 className="font-serif text-xl md:text-2xl font-bold text-white">
                    {activeColor.name}
                  </h4>
                  <p className="text-xs text-neutral-400 font-light mt-0.5 max-w-lg">
                    {activeColor.desc || `Official Sandtex ${activeColor.name} paint formulation.`}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                {onSelectColorForShowroom && (
                  <button
                    onClick={() => {
                      onSelectColorForShowroom(activeColor.hex, activeColor.name);
                    }}
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-full text-xs uppercase tracking-wider border border-white/20 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Apply in 3D Studio</span>
                  </button>
                )}

                <button
                  onClick={() => handleInquireColor(activeColor)}
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold px-5 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all duration-200 shadow-lg cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order "{activeColor.name}" on WhatsApp</span>
                </button>

                <button
                  onClick={() => setActiveColor(null)}
                  className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Authenticity Notice Footer ── */}
      <div className="px-6 py-4 bg-neutral-950 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-400 font-light text-left">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          100% Genuine CAP Plc Sandtex Formulations guaranteed. Mixed to exact computerized codes.
        </span>
        <span className="font-mono text-[10px]">
          120 Factory Standard Colors Available
        </span>
      </div>
    </div>
  );
}

