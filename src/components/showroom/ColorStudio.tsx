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
} from 'lucide-react';
import {
  SANDTEX_PALETTE,
  DESIGNER_HARMONIES,
  SURFACES,
  type SwatchColor,
  type ColorHarmony,
  type SurfaceKey,
} from '../../data/showroomData';
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
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
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
      `• *Main Wall:* ${colors.mainWall} (${findClosestSandtexColor(colors.mainWall).name})\n` +
      `• *Accent Feature Wall:* ${colors.accentWall} (${findClosestSandtexColor(colors.accentWall).name})\n` +
      `• *Ceiling:* ${colors.ceiling} (${findClosestSandtexColor(colors.ceiling).name})\n` +
      `• *Trim & Mouldings:* ${colors.trim} (${findClosestSandtexColor(colors.trim).name})\n` +
      `• *Accents:* ${colors.accents}\n\n` +
      `📌 *Selected Topcoat:* ${activeSwatch.name} (${activeSwatch.code}) for ${activeInfo?.label}\n` +
      `• Recommended Finish: ${activeInfo?.recommendedFinish}\n\n` +
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
            <span className="hidden sm:inline">Sandtex</span> Colors
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
            <span className="hidden sm:inline">Designer</span> Mixes
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
            Mixer
          </button>
          <button
            onClick={() => setTab('saved')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
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
                    onClick={() =>
                      onApplyHarmony({
                        id: key,
                        name: h.name,
                        tagline: 'Scientific Color Harmony',
                        description: '',
                        mainWall: h.mainWall,
                        accentWall: h.accentWall,
                        ceiling: h.ceiling,
                        trim: h.trim,
                        accents: h.accents,
                        tags: [],
                      })
                    }
                    className="flex flex-col p-2.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 hover:border-amber-400/50 text-left transition-all group"
                  >
                    <span className="text-xs font-bold text-white group-hover:text-amber-300 truncate">
                      {h.name}
                    </span>
                    <div className="flex gap-1.5 mt-2 h-4 w-full rounded overflow-hidden">
                      <div className="flex-1" style={{ backgroundColor: h.mainWall }} title="Main Wall" />
                      <div className="flex-1" style={{ backgroundColor: h.accentWall }} title="Accent Wall" />
                      <div className="flex-1" style={{ backgroundColor: h.ceiling }} title="Ceiling" />
                      <div className="flex-1" style={{ backgroundColor: h.trim }} title="Trim" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Curated Pre-set Themes */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-white/60 uppercase tracking-widest block">
                Curated Nigerian Luxury Palettes
              </span>

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

                  {/* 4-part Color Strip */}
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-black/30 border border-white/5">
                    <div className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full h-6 rounded-lg border border-white/20"
                        style={{ backgroundColor: harmony.mainWall }}
                      />
                      <span className="text-[9px] text-white/40 mt-1">Main (60%)</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full h-6 rounded-lg border border-white/20"
                        style={{ backgroundColor: harmony.accentWall }}
                      />
                      <span className="text-[9px] text-white/40 mt-1">Accent (30%)</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full h-6 rounded-lg border border-white/20"
                        style={{ backgroundColor: harmony.ceiling }}
                      />
                      <span className="text-[9px] text-white/40 mt-1">Ceiling</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full h-6 rounded-lg border border-white/20"
                        style={{ backgroundColor: harmony.trim }}
                      />
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

              {/* Closest Sandtex Match Badge */}
              <div className="p-3 rounded-xl bg-black/30 border border-white/10 flex items-center justify-between text-xs">
                <span className="text-white/60">Closest Sandtex Standard:</span>
                <span className="font-bold text-amber-300">
                  {findClosestSandtexColor(colors[activeSurface]).name}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SAVED RECIPES */}
        {tab === 'saved' && (
          <div className="space-y-4">
            {/* Save current recipe box */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <label className="text-xs font-bold text-white/70 block">Save Current Room Colors</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={`e.g. ${roomName} Scheme A`}
                  value={recipeNameInput}
                  onChange={(e) => setRecipeNameInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={handleSaveRecipe}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-black hover:bg-amber-400 transition-all flex items-center gap-1.5"
                >
                  <BookmarkCheck size={14} /> Save
                </button>
              </div>
              {showSaveToast && (
                <p className="text-xs text-emerald-400 font-semibold animate-pulse">
                  ✓ Recipe saved to your collection!
                </p>
              )}
            </div>

            {/* Saved list */}
            {savedRecipes.length === 0 ? (
              <div className="p-8 text-center text-white/40 text-xs">
                <Bookmark size={24} className="mx-auto mb-2 opacity-30" />
                <p>No saved recipes yet. Design your room and save it for future reference!</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {savedRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    onClick={() => {
                      onApplyHarmony({
                        id: recipe.id,
                        name: recipe.name,
                        tagline: recipe.roomName,
                        description: '',
                        mainWall: recipe.colors.mainWall,
                        accentWall: recipe.colors.accentWall,
                        ceiling: recipe.colors.ceiling,
                        trim: recipe.colors.trim,
                        accents: recipe.colors.accents,
                        tags: [],
                      });
                    }}
                    className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs font-bold text-white truncate">{recipe.name}</h5>
                        <span className="text-[10px] text-white/40">{recipe.date}</span>
                      </div>
                      {/* Swatches preview */}
                      <div className="flex gap-1.5 mt-2 h-4 w-32 rounded overflow-hidden border border-white/10">
                        <div className="flex-1" style={{ backgroundColor: recipe.colors.mainWall }} />
                        <div className="flex-1" style={{ backgroundColor: recipe.colors.accentWall }} />
                        <div className="flex-1" style={{ backgroundColor: recipe.colors.ceiling }} />
                        <div className="flex-1" style={{ backgroundColor: recipe.colors.trim }} />
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDeleteRecipe(recipe.id, e)}
                      className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete recipe"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
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

            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenSnapshot}
                title="Export Specification Card"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-amber-300 font-semibold transition-all"
              >
                <FileText size={14} />
              </button>
              <button
                onClick={onOpenCalculator}
                title="Paint Calculator"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-amber-300 font-semibold transition-all"
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
