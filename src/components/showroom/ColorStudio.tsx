import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Palette,
  Sparkles,
  SlidersHorizontal,
  Search,
  Check,
  MessageCircle,
  Calculator,
  Bookmark,
  BookmarkCheck,
  Trash2,
  Share2,
  FileText,
  Layers,
  Wand2,
  Download,
} from 'lucide-react';
import {
  SANDTEX_PALETTE,
  DESIGNER_HARMONIES,
  SURFACES,
  type SwatchColor,
  type ColorHarmony,
  type SurfaceKey,
} from '../../data/showroomData';
import { 
  SANDTEX_COLOR_GROUPS, 
  SandtexColorGroup, 
  SANDTEX_COLORS 
} from '../../data/sandtexColors';
import { generateHarmoniesFromBase, findClosestSandtexColor } from '../../utils/colorTheory';
import { openWhatsApp } from '../../utils/whatsapp';

interface SavedRecipe {
  id: string;
  name: string;
  roomName: string;
  date: string;
  colors: Record<SurfaceKey, string>;
}

interface ColorStudioProps {
  activeSurface: SurfaceKey;
  onSelectSurface: (surface: SurfaceKey) => void;
  colors: Record<SurfaceKey, string>;
  onApplyColor: (surface: SurfaceKey, hex: string) => void;
  onApplyHarmony: (harmony: ColorHarmony) => void;
  roomName: string;
  onOpenCalculator: () => void;
  onOpenSnapshot: () => void;
}

type TabMode = 'swatches' | 'harmonies' | 'mixer' | 'saved';

export default function ColorStudio({
  activeSurface,
  onSelectSurface,
  colors,
  onApplyColor,
  onApplyHarmony,
  roomName,
  onOpenCalculator,
  onOpenSnapshot,
}: ColorStudioProps) {
  const [tab, setTab] = useState<TabMode>('swatches');
  const [selectedGroup, setSelectedGroup] = useState<SandtexColorGroup>('Blues');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customHex, setCustomHex] = useState<string>(colors[activeSurface]);
  const [brightnessOffset, setBrightnessOffset] = useState<number>(0);
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [recipeNameInput, setRecipeNameInput] = useState<string>('');
  const [showSaveToast, setShowSaveToast] = useState(false);

  // Load saved recipes from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('micmag_saved_recipes');
      if (stored) {
        setSavedRecipes(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save recipe
  const handleSaveRecipe = () => {
    const name = recipeNameInput.trim() || `${roomName} Design ${savedRecipes.length + 1}`;
    const newRecipe: SavedRecipe = {
      id: `recipe-${Date.now()}`,
      name,
      roomName,
      date: new Date().toLocaleDateString(),
      colors: { ...colors },
    };
    const updated = [newRecipe, ...savedRecipes];
    setSavedRecipes(updated);
    try {
      localStorage.setItem('micmag_saved_recipes', JSON.stringify(updated));
    } catch {
      // ignore
    }
    setRecipeNameInput('');
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 2500);
  };

  const handleDeleteRecipe = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedRecipes.filter((r) => r.id !== id);
    setSavedRecipes(updated);
    try {
      localStorage.setItem('micmag_saved_recipes', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Find active swatch metadata
  const currentActiveHex = colors[activeSurface].toLowerCase();
  const activeSwatch = useMemo(() => {
    return (
      SANDTEX_PALETTE.find((s) => s.hex.toLowerCase() === currentActiveHex) ||
      findClosestSandtexColor(colors[activeSurface])
    );
  }, [currentActiveHex, colors, activeSurface]);

  // Generated dynamic color theory harmonies based on the currently selected paint color
  const dynamicHarmonies = useMemo(() => {
    return generateHarmoniesFromBase(colors[activeSurface]);
  }, [colors, activeSurface]);

  // Filter swatches: 2-tier interaction
  // If searching: search across all 120 colors; otherwise show the 20 shades of the selected group
  const filteredSwatches = useMemo(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return SANDTEX_PALETTE.filter((s) => {
        return (
          s.name.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
        );
      });
    }
    return SANDTEX_PALETTE.filter((s) => s.category === selectedGroup);
  }, [selectedGroup, searchQuery]);

  // Handle custom tint slider
  const handleBrightnessChange = (val: number) => {
    setBrightnessOffset(val);
    try {
      const num = parseInt(customHex.replace('#', ''), 16);
      let r = (num >> 16) + val;
      let g = ((num >> 8) & 0x00ff) + val;
      let b = (num & 0x0000ff) + val;
      r = Math.min(255, Math.max(0, r));
      g = Math.min(255, Math.max(0, g));
      b = Math.min(255, Math.max(0, b));
      const adjusted = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      onApplyColor(activeSurface, adjusted);
    } catch {
      // fallback
    }
  };

  // Inquire active palette on WhatsApp
  const handleWhatsAppInquiry = () => {
    const activeInfo = SURFACES.find((s) => s.key === activeSurface);
    const text =
      `*MICMAG DIGITAL SHOWROOM SPECIFICATION*\n` +
      `===================================\n` +
      `Room Type: ${roomName}\n\n` +
      `🎨 *Paint Palette Spec:*\n` +
      `• Main Wall: ${findClosestSandtexColor(colors.mainWall).name} (${colors.mainWall})\n` +
      `• Accent Feature: ${findClosestSandtexColor(colors.accentWall).name} (${colors.accentWall})\n` +
      `• Ceiling: ${findClosestSandtexColor(colors.ceiling).name} (${colors.ceiling})\n` +
      `• Mouldings/Trim: ${findClosestSandtexColor(colors.trim).name} (${colors.trim})\n\n` +
      `📋 *Active Focus:* ${activeSwatch.name} (${activeSwatch.code}) for ${activeInfo?.label}\n` +
      `  Recommended Finish: ${activeInfo?.recommendedFinish}\n\n` +
      `Could you please confirm availability and provide a direct quote for supply/application?`;

    openWhatsApp('2347052940445', text);
  };

  return (
    <div className="bg-[#0b1329] border border-white/10 rounded-3xl overflow-hidden flex flex-col h-full shadow-2xl text-left select-none">
      {/* ── Studio Tabs Header ── */}
      <div className="flex items-center justify-between p-2 bg-[#09101f] border-b border-white/10">
        <div className="flex gap-1 p-1 bg-black/40 rounded-2xl w-full">
          <button
            onClick={() => setTab('swatches')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === 'swatches'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Palette size={14} />
            <span className="hidden sm:inline">Sandtex</span> Colors
          </button>
          <button
            onClick={() => setTab('harmonies')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === 'harmonies'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Sparkles size={14} />
            <span className="hidden sm:inline">Designer</span> Mixes
          </button>
          <button
            onClick={() => setTab('mixer')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === 'mixer'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <SlidersHorizontal size={14} />
            Mixer
          </button>
          <button
            onClick={() => setTab('saved')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all relative cursor-pointer ${
              tab === 'saved'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Bookmark size={14} />
            <span>Saved</span>
            {savedRecipes.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-black text-[9px] font-bold flex items-center justify-center">
                {savedRecipes.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Tab Content Body ── */}
      <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-5 no-scrollbar">
        {/* TAB 1: CURATED SWATCHES (2-Tier Official Sandtex Palette) */}
        {tab === 'swatches' && (
          <div className="space-y-4">
            {/* Search and PDF Download Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Search 120 colors (e.g. Lekki Red, Navy Blue)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400/70"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Download PDF Quick Action */}
              <a
                href="/Sandtex_Colour_Chart.pdf"
                download="Sandtex_Colour_Chart_Micmag.pdf"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-[11px] font-bold tracking-wide transition-colors whitespace-nowrap cursor-pointer shrink-0"
                title="Download the full official Sandtex Colour Chart PDF"
              >
                <Download size={13} />
                <span>PDF Chart</span>
              </a>
            </div>

            {/* ── TIER 1: The 6 Main Color Groups ── */}
            {!searchQuery && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block font-semibold">
                  Step 1: Choose Colour Group
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {SANDTEX_COLOR_GROUPS.map((grp) => {
                    const isSelected = selectedGroup === grp.group;
                    return (
                      <button
                        key={grp.group}
                        onClick={() => setSelectedGroup(grp.group)}
                        className={`p-2 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm ring-1 ring-amber-400/50'
                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
                        }`}
                      >
                        <div
                          className="w-4 h-4 rounded-full border border-white/20 mb-1 shadow-sm"
                          style={{ backgroundColor: grp.sampleHex }}
                        />
                        <span className="text-[11px] font-bold truncate w-full leading-tight">
                          {grp.label}
                        </span>
                        <span className="text-[9px] text-white/40 font-mono">
                          {grp.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── TIER 2: The 20 Shades Grid ── */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] text-white/60">
                <span className="font-semibold text-white">
                  {searchQuery ? `Search Results (${filteredSwatches.length})` : `${selectedGroup} Shades (${filteredSwatches.length})`}
                </span>
                <span className="text-[10px] text-white/40 font-light">Click to apply to {SURFACES.find(s => s.key === activeSurface)?.label}</span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-[280px] overflow-y-auto pr-1">
                {filteredSwatches.map((swatch) => {
                  const isSelected = colors[activeSurface].toLowerCase() === swatch.hex.toLowerCase();
                  return (
                    <motion.button
                      key={swatch.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onApplyColor(activeSurface, swatch.hex)}
                      className={`group relative flex flex-col items-center p-2 rounded-xl border transition-all text-center cursor-pointer ${
                        isSelected
                          ? 'bg-white/20 border-amber-400 shadow-md shadow-amber-500/20 ring-1 ring-amber-400'
                          : 'bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/10'
                      }`}
                    >
                      {/* Swatch Square */}
                      <div
                        className="relative w-full aspect-square rounded-lg shadow-inner border border-white/20 mb-1.5 transition-transform"
                        style={{ backgroundColor: swatch.hex }}
                      >
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center text-white drop-shadow">
                            <Check size={14} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                      {/* Name & Code */}
                      <span className="text-[10.5px] font-bold text-white truncate w-full leading-tight">
                        {swatch.name}
                      </span>
                      <span className="text-[8.5px] text-white/40 font-mono uppercase mt-0.5">
                        {swatch.code}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {filteredSwatches.length === 0 && (
                <div className="py-8 text-center text-white/40 text-xs">
                  No Sandtex colors found matching "{searchQuery}".
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: DESIGNER MIXES & COLOR HARMONY ENGINE */}
        {tab === 'harmonies' && (
          <div className="space-y-5">
            {/* Dynamic Generated Harmonies from Active Swatch */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                <Wand2 size={14} />
                <span>Color Science Harmonies for {activeSwatch.name}</span>
              </div>
              <p className="text-[11.5px] text-white/60">
                Mathematically balanced combinations calculated from your active color:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {Object.entries(dynamicHarmonies).map(([key, h]) => (
                  <button
                    key={key}
                    onClick={() => {
                      onApplyColor('mainWall', h.mainWall);
                      onApplyColor('accentWall', h.accentWall);
                      onApplyColor('ceiling', h.ceiling);
                      onApplyColor('trim', h.trim);
                      onApplyColor('accents', h.accents);
                    }}
                    className="p-3 rounded-xl bg-black/40 border border-white/10 hover:border-amber-400 text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white group-hover:text-amber-300 capitalize">
                        {key} Scheme
                      </span>
                      <span className="text-[9px] font-mono text-amber-400/80 uppercase">Apply All</span>
                    </div>
                    {/* Harmony Swatches Preview */}
                    <div className="flex gap-1 h-3 rounded overflow-hidden border border-white/10">
                      <div className="flex-1" style={{ backgroundColor: h.mainWall }} />
                      <div className="flex-1" style={{ backgroundColor: h.accentWall }} />
                      <div className="flex-1" style={{ backgroundColor: h.ceiling }} />
                      <div className="flex-1" style={{ backgroundColor: h.trim }} />
                      <div className="flex-1" style={{ backgroundColor: h.accents }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Curated Nigerian Palettes */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block font-semibold">
                Curated Nigerian Luxury Palettes
              </span>

              {DESIGNER_HARMONIES.map((harmony) => (
                <motion.div
                  key={harmony.id}
                  whileHover={{ scale: 1.01 }}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/60 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-serif text-sm font-bold text-white">{harmony.name}</h4>
                      <p className="text-[11px] text-amber-400 font-medium">{harmony.tagline}</p>
                    </div>
                    <button
                      onClick={() => onApplyHarmony(harmony)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0"
                    >
                      Apply Palette
                    </button>
                  </div>

                  <p className="text-xs text-white/60 leading-relaxed">{harmony.description}</p>

                  {/* 5-Color Swatch Preview Bar */}
                  <div className="grid grid-cols-5 gap-1.5 h-6 rounded-lg overflow-hidden border border-white/10">
                    <div style={{ backgroundColor: harmony.mainWall }} title="Main Wall" />
                    <div style={{ backgroundColor: harmony.accentWall }} title="Accent Wall" />
                    <div style={{ backgroundColor: harmony.ceiling }} title="Ceiling" />
                    <div style={{ backgroundColor: harmony.trim }} title="Trim" />
                    <div style={{ backgroundColor: harmony.accents }} title="Accents" />
                  </div>

                  {/* Tags */}
                  <div className="flex gap-1.5">
                    {harmony.tags.map((t) => (
                      <span key={t} className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-white/60">
                        #{t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOM TINT MIXER */}
        {tab === 'mixer' && (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Tone Adjustment</h4>
                  <p className="text-xs text-white/50">Tune saturation and brightness of your active paint</p>
                </div>
                <div
                  className="w-8 h-8 rounded-xl border border-white/20 shadow-inner"
                  style={{ backgroundColor: colors[activeSurface] }}
                />
              </div>

              {/* Tint / Shade Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-white/70">
                  <span>Deep / Shade</span>
                  <span className="font-mono text-amber-400">
                    {brightnessOffset > 0 ? `+${brightnessOffset}` : brightnessOffset}
                  </span>
                  <span>Light / Tint</span>
                </div>
                <input
                  type="range"
                  min="-60"
                  max="60"
                  value={brightnessOffset}
                  onChange={(e) => handleBrightnessChange(parseInt(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Reset to Original Swatch */}
              <button
                onClick={() => {
                  setBrightnessOffset(0);
                  onApplyColor(activeSurface, activeSwatch.hex);
                }}
                className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white/70 transition-all cursor-pointer"
              >
                Reset to Authentic Swatch ({activeSwatch.hex})
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: SAVED CLIENT PALETTES */}
        {tab === 'saved' && (
          <div className="space-y-4">
            {/* Save Current Recipe Input */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block font-semibold">
                Save Current 5-Color Scheme
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Scheme name (e.g. Master Bedroom Option A)..."
                  value={recipeNameInput}
                  onChange={(e) => setRecipeNameInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={handleSaveRecipe}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all cursor-pointer shrink-0"
                >
                  Save
                </button>
              </div>
              {showSaveToast && (
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <BookmarkCheck size={13} /> Scheme saved successfully!
                </span>
              )}
            </div>

            {/* List Saved Recipes */}
            <div className="space-y-2.5">
              {savedRecipes.length === 0 ? (
                <div className="py-8 text-center text-white/40 text-xs">
                  No schemes saved yet. Mix your colors and save your favorites above!
                </div>
              ) : (
                savedRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    onClick={() => {
                      Object.entries(recipe.colors).forEach(([surface, hex]) => {
                        onApplyColor(surface as SurfaceKey, hex);
                      });
                    }}
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-amber-300">
                          {recipe.name}
                        </h4>
                        <span className="text-[10px] text-white/40 font-mono">
                          {recipe.roomName} • {recipe.date}
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleDeleteRecipe(recipe.id, e)}
                        className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-white/5 transition-all"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Swatches preview */}
                    <div className="flex gap-1.5 mt-2 h-4 w-32 rounded overflow-hidden border border-white/10">
                      <div className="flex-1" style={{ backgroundColor: recipe.colors.mainWall }} />
                      <div className="flex-1" style={{ backgroundColor: recipe.colors.accentWall }} />
                      <div className="flex-1" style={{ backgroundColor: recipe.colors.ceiling }} />
                      <div className="flex-1" style={{ backgroundColor: recipe.colors.trim }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── Active Swatch Quick Info Bar ── */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 text-left">
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
                <p className="text-[10px] text-white/50 font-mono">{activeSwatch.code} • {activeSwatch.category} Family</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenSnapshot}
                title="Export Specification Card"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-amber-300 font-semibold transition-all cursor-pointer"
              >
                <FileText size={14} />
              </button>
              <button
                onClick={onOpenCalculator}
                title="Paint Calculator"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-amber-300 font-semibold transition-all cursor-pointer"
              >
                <Calculator size={13} />
                <span className="hidden sm:inline">Calc</span>
              </button>
            </div>
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
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest text-white shadow-lg transition-all hover:brightness-110 active:scale-[0.99] cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)' }}
        >
          <MessageCircle size={16} />
          Inquire Palette on WhatsApp
        </button>
      </div>
    </div>
  );
}
