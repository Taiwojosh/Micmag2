import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sun,
  Sunset,
  Moon,
  Sparkles,
  RotateCcw,
  Eye,
  Layers,
  Check,
  Undo2,
  Redo2,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import type { RoomTypeId, SurfaceKey, LightingMode, FinishType } from '../../data/showroomData';
import { SURFACES } from '../../data/showroomData';
import { findClosestSandtexColor } from '../../utils/colorTheory';

interface RoomCanvasProps {
  roomType: RoomTypeId;
  colors: Record<SurfaceKey, string>;
  activeSurface: SurfaceKey;
  onSelectSurface: (surface: SurfaceKey) => void;
  lighting: LightingMode;
  onLightingChange: (lighting: LightingMode) => void;
  finish: FinishType;
  onFinishChange: (finish: FinishType) => void;
  onReset: () => void;
  onRandomize: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

export default function RoomCanvas({
  roomType,
  colors,
  activeSurface,
  onSelectSurface,
  lighting,
  onLightingChange,
  finish,
  onFinishChange,
  onReset,
  onRandomize,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
}: RoomCanvasProps) {
  const [hoveredSurface, setHoveredSurface] = useState<SurfaceKey | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Lighting overlay styling & atmospheric filters
  const lightingOverlayStyles: Record<
    LightingMode,
    { filter: string; ambientColor: string; opacity: number; beamOpacity: number }
  > = {
    daylight: {
      filter: 'brightness(1.03) contrast(1.02) saturate(1.02)',
      ambientColor: 'rgba(255, 255, 255, 0.06)',
      opacity: 0.25,
      beamOpacity: 0.35,
    },
    warm: {
      filter: 'sepia(0.22) saturate(1.25) brightness(0.96) contrast(1.04)',
      ambientColor: 'rgba(234, 108, 0, 0.18)',
      opacity: 0.45,
      beamOpacity: 0.55,
    },
    cool: {
      filter: 'hue-rotate(6deg) contrast(1.08) brightness(0.92) saturate(0.95)',
      ambientColor: 'rgba(26, 44, 91, 0.28)',
      opacity: 0.4,
      beamOpacity: 0.25,
    },
  };

  const currentColorFor = (surface: SurfaceKey) => {
    if (showOriginal) {
      return '#e2e8f0'; // Neutral unpainted architectural plaster
    }
    return colors[surface];
  };

  const getSurfaceClass = (surface: SurfaceKey) => {
    const isActive = activeSurface === surface;
    const isHovered = hoveredSurface === surface;
    return `transition-all duration-300 cursor-pointer ${
      isActive
        ? 'stroke-[#f0d898] stroke-[3.5] drop-shadow-[0_0_12px_rgba(201,168,76,0.9)]'
        : isHovered
        ? 'stroke-white/90 stroke-[2.5] drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]'
        : 'stroke-transparent'
    }`;
  };

  return (
    <div
      className={`relative flex flex-col w-full bg-[#070d1a] rounded-3xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-300 ${
        isFullscreen ? 'fixed inset-3 md:inset-6 z-50 rounded-2xl max-w-none shadow-[0_0_80px_rgba(0,0,0,0.9)]' : ''
      }`}
    >
      {/* ── Top Architectural Controls Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-[#0a1122]/95 backdrop-blur-xl border-b border-white/10 z-20">
        {/* Surface Quick-Target indicator */}
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-semibold text-white/50 uppercase tracking-widest hidden sm:inline">
            Active Surface:
          </span>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 shadow-inner">
            <span
              className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm transition-colors duration-300"
              style={{ backgroundColor: colors[activeSurface] }}
            />
            <span className="text-xs font-bold text-white tracking-wide">
              {SURFACES.find((s) => s.key === activeSurface)?.label}
            </span>
            <span className="text-[11px] text-amber-300 font-mono hidden md:inline">
              ({findClosestSandtexColor(colors[activeSurface]).name})
            </span>
          </div>
        </div>

        {/* Action Pills: Lighting, Finish, Undo/Redo */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Undo / Redo */}
          {onUndo && (
            <div className="flex items-center bg-black/50 p-1 rounded-xl border border-white/10 shadow-sm">
              <button
                onClick={onUndo}
                disabled={!canUndo}
                title="Undo color change (Ctrl+Z)"
                className="p-1.5 rounded-lg text-white/70 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed transition-all"
              >
                <Undo2 size={13} />
              </button>
              <button
                onClick={onRedo}
                disabled={!canRedo}
                title="Redo color change (Ctrl+Y)"
                className="p-1.5 rounded-lg text-white/70 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed transition-all"
              >
                <Redo2 size={13} />
              </button>
            </div>
          )}

          {/* Lighting Mode Selector */}
          <div className="flex items-center bg-black/50 p-1 rounded-xl border border-white/10 shadow-sm">
            <button
              onClick={() => onLightingChange('daylight')}
              title="Daylight (5500K Clean White)"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                lighting === 'daylight'
                  ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-sm font-semibold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Sun size={13} />
              <span className="hidden md:inline">Day</span>
            </button>
            <button
              onClick={() => onLightingChange('warm')}
              title="Golden Hour / Warm Glow (3000K)"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                lighting === 'warm'
                  ? 'bg-orange-500/25 text-orange-300 border border-orange-500/40 shadow-sm font-semibold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Sunset size={13} />
              <span className="hidden md:inline">Sunset</span>
            </button>
            <button
              onClick={() => onLightingChange('cool')}
              title="Evening Twilight / Architectural LED (4000K)"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                lighting === 'cool'
                  ? 'bg-blue-500/25 text-blue-300 border border-blue-500/40 shadow-sm font-semibold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Moon size={13} />
              <span className="hidden md:inline">Twilight</span>
            </button>
          </div>

          {/* Finish Selector */}
          <div className="hidden sm:flex items-center bg-black/50 p-1 rounded-xl border border-white/10 shadow-sm">
            <Layers size={13} className="text-white/40 ml-1.5 mr-0.5" />
            {(['matt', 'silk', 'textured', 'gloss'] as FinishType[]).map((f) => (
              <button
                key={f}
                onClick={() => onFinishChange(f)}
                className={`px-2.5 py-1 rounded-lg text-xs capitalize transition-all ${
                  finish === f
                    ? 'bg-white/20 text-white font-bold border border-white/30 shadow-sm'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Compare Before/After Toggle */}
          <button
            onClick={() => setShowOriginal(!showOriginal)}
            title="Toggle Unpainted vs Custom Paint"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              showOriginal
                ? 'bg-red-500/20 text-red-300 border-red-500/50'
                : 'bg-white/5 text-white/70 border-white/15 hover:bg-white/10'
            }`}
          >
            <Eye size={13} />
            <span className="hidden sm:inline">{showOriginal ? 'Raw Plaster' : 'Compare'}</span>
          </button>

          {/* Randomize / Inspire */}
          <button
            onClick={onRandomize}
            title="Randomize Designer Color Harmony"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/40 hover:bg-amber-500/25 transition-all shadow-sm"
          >
            <Sparkles size={13} />
            <span className="hidden md:inline">Inspire</span>
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            title="Reset Room Colors"
            className="p-1.5 rounded-xl text-white/50 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            <RotateCcw size={14} />
          </button>

          {/* Fullscreen Expand */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
            className="p-1.5 rounded-xl text-white/50 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all hidden md:flex"
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* ── Interactive Photorealistic SVG Room Scene ── */}
      <div
        className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[350px] max-h-[640px] overflow-hidden flex items-center justify-center select-none bg-[#050914]"
        style={{ filter: lightingOverlayStyles[lighting].filter }}
      >
        {/* Real-time paint finish texture overlays */}
        {finish === 'textured' && (
          <div
            className="absolute inset-0 pointer-events-none z-10 opacity-35 mix-blend-multiply transition-opacity duration-500"
            style={{
              backgroundImage: `radial-gradient(#ffffff 0.8px, transparent 0.8px), radial-gradient(#000000 0.8px, transparent 0.8px)`,
              backgroundSize: '10px 10px',
              backgroundPosition: '0 0, 5px 5px',
            }}
          />
        )}

        {finish === 'silk' && (
          <div
            className="absolute inset-0 pointer-events-none z-10 opacity-25 mix-blend-overlay transition-opacity duration-500"
            style={{
              background: 'linear-gradient(125deg, rgba(255,255,255,0.4) 0%, transparent 40%, rgba(255,255,255,0.15) 80%)',
            }}
          />
        )}

        {finish === 'gloss' && (
          <div
            className="absolute inset-0 pointer-events-none z-10 opacity-30 mix-blend-soft-light transition-opacity duration-500"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 35%, rgba(255,255,255,0.3) 70%, transparent 100%)',
            }}
          />
        )}

        {/* Ambient lighting color wash */}
        <div
          className="absolute inset-0 pointer-events-none transition-colors duration-700 z-10"
          style={{
            backgroundColor: lightingOverlayStyles[lighting].ambientColor,
            opacity: lightingOverlayStyles[lighting].opacity,
          }}
        />

        {/* Interactive Architectural Vector Scene */}
        <svg
          viewBox="0 0 1000 650"
          className="w-full h-full object-cover transition-transform duration-700"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Ambient Occlusion Corner Gradients */}
            <linearGradient id="aoLeftWall" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#000000" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
            </linearGradient>

            <linearGradient id="aoRightWall" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#000000" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
            </linearGradient>

            <linearGradient id="aoCeiling" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.35" />
              <stop offset="40%" stopColor="#000000" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
            </linearGradient>

            <linearGradient id="coveGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fff8db" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>

            {/* Volumetric Window Sunlight Stream */}
            <linearGradient id="sunbeamVolumetric" x1="0%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#fff7d6" stopOpacity="0.38" />
              <stop offset="50%" stopColor="#ffe8a3" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* Architectural Wood Parquet Floor */}
            <linearGradient id="hardwoodParquet" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2c221b" />
              <stop offset="40%" stopColor="#231a14" />
              <stop offset="100%" stopColor="#120d0a" />
            </linearGradient>

            {/* Polished Marble Floor */}
            <linearGradient id="polishedMarble" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="50%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* Soft Shadow Filters */}
            <filter id="archShadow" x="-20%" y="-20%" width="140%" height="150%">
              <feDropShadow dx="0" dy="16" stdDeviation="12" floodOpacity="0.55" floodColor="#000000" />
            </filter>

            <filter id="softGlowSpot" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="14" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="ambientLightCone" x="-50%" y="-20%" width="200%" height="180%">
              <feGaussianBlur stdDeviation="24" />
            </filter>
          </defs>

          {/* ═══════════════════════════════════════════════════════════════════
              ROOM TYPE 1: MODERN LUXURY LIVING ROOM
             ═══════════════════════════════════════════════════════════════════ */}
          {roomType === 'living-room' && (
            <g id="scene-living-room">
              {/* Ceiling with Architectural Recessed Cove */}
              <polygon
                points="0,0 1000,0 860,110 140,110"
                fill={currentColorFor('ceiling')}
                className={getSurfaceClass('ceiling')}
                onClick={() => onSelectSurface('ceiling')}
                onMouseEnter={() => setHoveredSurface('ceiling')}
                onMouseLeave={() => setHoveredSurface(null)}
              />
              <polygon points="0,0 1000,0 860,110 140,110" fill="url(#aoCeiling)" pointerEvents="none" />

              {/* Recessed Cove Light Glow */}
              <polygon points="140,110 860,110 840,130 160,130" fill="url(#coveGlow)" pointerEvents="none" />

              {/* Downlight Spotlights */}
              <g id="ceiling-spotlights" pointerEvents="none">
                <circle cx="320" cy="55" r="4.5" fill="#ffffff" filter="url(#softGlowSpot)" />
                <ellipse cx="320" cy="220" rx="140" ry="120" fill="#fff7db" opacity="0.12" filter="url(#ambientLightCone)" />

                <circle cx="500" cy="55" r="4.5" fill="#ffffff" filter="url(#softGlowSpot)" />
                <ellipse cx="500" cy="230" rx="150" ry="120" fill="#fff7db" opacity="0.14" filter="url(#ambientLightCone)" />

                <circle cx="680" cy="55" r="4.5" fill="#ffffff" filter="url(#softGlowSpot)" />
                <ellipse cx="680" cy="220" rx="140" ry="120" fill="#fff7db" opacity="0.12" filter="url(#ambientLightCone)" />
              </g>

              {/* Left Main Wall */}
              <polygon
                points="0,0 140,110 140,510 0,650"
                fill={currentColorFor('mainWall')}
                className={getSurfaceClass('mainWall')}
                onClick={() => onSelectSurface('mainWall')}
                onMouseEnter={() => setHoveredSurface('mainWall')}
                onMouseLeave={() => setHoveredSurface(null)}
              />
              <polygon points="0,0 140,110 140,510 0,650" fill="url(#aoLeftWall)" pointerEvents="none" />

              {/* Right Main Wall */}
              <polygon
                points="1000,0 860,110 860,510 1000,650"
                fill={currentColorFor('mainWall')}
                className={getSurfaceClass('mainWall')}
                onClick={() => onSelectSurface('mainWall')}
                onMouseEnter={() => setHoveredSurface('mainWall')}
                onMouseLeave={() => setHoveredSurface(null)}
              />
              <polygon points="1000,0 860,110 860,510 1000,650" fill="url(#aoRightWall)" pointerEvents="none" />

              {/* Center Accent Feature Wall */}
              <polygon
                points="140,110 860,110 860,510 140,510"
                fill={currentColorFor('accentWall')}
                className={getSurfaceClass('accentWall')}
                onClick={() => onSelectSurface('accentWall')}
                onMouseEnter={() => setHoveredSurface('accentWall')}
                onMouseLeave={() => setHoveredSurface(null)}
              />

              {/* Floor Surface */}
              <polygon points="0,650 140,510 860,510 1000,650" fill="url(#hardwoodParquet)" />

              {/* Floor Parquet Plank Reflection Lines */}
              <line x1="220" y1="510" x2="160" y2="650" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
              <line x1="380" y1="510" x2="350" y2="650" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
              <line x1="500" y1="510" x2="500" y2="650" stroke="rgba(255,255,255,0.07)" strokeWidth="2" />
              <line x1="620" y1="510" x2="650" y2="650" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
              <line x1="780" y1="510" x2="840" y2="650" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />

              {/* Left Floor-to-Ceiling Window with Horizon Sky & Sunlight */}
              <g id="panoramic-window">
                <polygon points="15,115 115,165 115,445 15,505" fill="#081426" />
                {/* Sky & Tree Garden View */}
                <polygon points="20,125 110,172 110,438 20,495" fill="linear-gradient(180deg, #1e3a8a 0%, #38bdf8 60%, #15803d 100%)" opacity="0.85" />
                <polygon
                  points="15,115 115,165 115,445 15,505"
                  fill="none"
                  stroke={currentColorFor('trim')}
                  strokeWidth="8"
                  strokeLinejoin="round"
                  className={getSurfaceClass('trim')}
                  onClick={() => onSelectSurface('trim')}
                />
                {/* Window Mullions */}
                <line x1="65" y1="140" x2="65" y2="475" stroke={currentColorFor('trim')} strokeWidth="4" />
                <line x1="15" y1="310" x2="115" y2="305" stroke={currentColorFor('trim')} strokeWidth="4" />
              </g>

              {/* Volumetric Sunlight Shaft from Window onto Floor */}
              <polygon
                points="115,170 115,445 680,620 420,645"
                fill="url(#sunbeamVolumetric)"
                pointerEvents="none"
                style={{ mixBlendMode: 'screen', opacity: lightingOverlayStyles[lighting].beamOpacity }}
              />

              {/* Luxury Woven Designer Area Rug */}
              <polygon
                points="210,530 790,530 890,640 110,640"
                fill="#1e2233"
                stroke="rgba(201,168,76,0.3)"
                strokeWidth="2"
                filter="url(#archShadow)"
              />
              <polygon points="230,540 770,540 860,630 140,630" fill="#292e44" opacity="0.85" />

              {/* Crown Molding & Baseboard Trims */}
              <polyline
                points="0,0 140,110 860,110 1000,0"
                fill="none"
                stroke={currentColorFor('trim')}
                strokeWidth="10"
                strokeLinejoin="round"
                className={getSurfaceClass('trim')}
                onClick={() => onSelectSurface('trim')}
                onMouseEnter={() => setHoveredSurface('trim')}
                onMouseLeave={() => setHoveredSurface(null)}
              />
              <polyline
                points="0,650 140,510 860,510 1000,650"
                fill="none"
                stroke={currentColorFor('trim')}
                strokeWidth="12"
                strokeLinejoin="round"
                className={getSurfaceClass('trim')}
                onClick={() => onSelectSurface('trim')}
                onMouseEnter={() => setHoveredSurface('trim')}
                onMouseLeave={() => setHoveredSurface(null)}
              />

              {/* Minimalist Gallery Artwork on Feature Wall */}
              <g id="gallery-art-panel" filter="url(#archShadow)">
                <rect
                  x="350"
                  y="150"
                  width="300"
                  height="170"
                  rx="6"
                  fill="#0b101d"
                  stroke={currentColorFor('accents')}
                  strokeWidth="8"
                  className={getSurfaceClass('accents')}
                  onClick={() => onSelectSurface('accents')}
                  onMouseEnter={() => setHoveredSurface('accents')}
                  onMouseLeave={() => setHoveredSurface(null)}
                />
                {/* Modern Geometric Art composition */}
                <circle cx="500" cy="235" r="48" fill={currentColorFor('accents')} opacity="0.4" />
                <path d="M 380 270 Q 500 170 620 270" stroke={currentColorFor('accents')} strokeWidth="4" fill="none" />
                <line x1="420" y1="200" x2="580" y2="200" stroke="#f0d898" strokeWidth="2" opacity="0.7" />
              </g>

              {/* Floating Architectural Media Console */}
              <g id="floating-credenza" filter="url(#archShadow)">
                <rect x="290" y="390" width="420" height="70" rx="6" fill="#18130f" stroke="#c9a84c" strokeWidth="1.5" />
                <rect x="300" y="398" width="130" height="54" rx="3" fill="#201a14" />
                <rect x="435" y="398" width="130" height="54" rx="3" fill="#201a14" />
                <rect x="570" y="398" width="130" height="54" rx="3" fill="#201a14" />
                {/* Console Sculptural Decor */}
                <ellipse cx="340" cy="380" rx="14" ry="10" fill="#fdf8f0" stroke="#c9a84c" strokeWidth="1.5" />
                <rect x="640" y="365" width="40" height="25" rx="3" fill="#1e293b" stroke="#f0d898" strokeWidth="1.5" />
              </g>

              {/* Designer Lounge Armchair */}
              <g id="designer-armchair" filter="url(#archShadow)">
                <ellipse cx="760" cy="560" rx="75" ry="32" fill="#0c0908" opacity="0.4" />
                <path
                  d="M 690 440 Q 770 420 830 450 Q 840 520 820 560 Q 750 570 680 550 Z"
                  fill="#1b2138"
                  stroke={currentColorFor('accents')}
                  strokeWidth="4"
                  className={getSurfaceClass('accents')}
                  onClick={() => onSelectSurface('accents')}
                />
                <ellipse cx="755" cy="520" rx="45" ry="20" fill="#262f4f" />
                {/* Brass Chair Legs */}
                <line x1="700" y1="550" x2="690" y2="585" stroke="#c9a84c" strokeWidth="4" strokeLinecap="round" />
                <line x1="810" y1="555" x2="825" y2="590" stroke="#c9a84c" strokeWidth="4" strokeLinecap="round" />
              </g>

              {/* Potted Fiddle Leaf Fig Plant */}
              <g id="indoor-plant" filter="url(#archShadow)">
                <ellipse cx="160" cy="535" rx="24" ry="12" fill="#0c0908" opacity="0.5" />
                <polygon points="142,535 178,535 172,580 148,580" fill="#fdf8f0" stroke="#c9a84c" strokeWidth="2" />
                <path d="M 160 535 Q 120 440 95 405 Q 145 425 160 535" fill="#2d6a4f" />
                <path d="M 160 535 Q 195 420 205 375 Q 170 420 160 535" fill="#1b4332" />
                <path d="M 160 535 Q 140 390 155 330 Q 180 400 160 535" fill="#40916c" />
                <path d="M 160 535 Q 175 450 185 410 Q 155 450 160 535" fill="#52b788" />
              </g>
            </g>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              ROOM TYPE 2: MASTER BEDROOM SUITE
             ═══════════════════════════════════════════════════════════════════ */}
          {roomType === 'master-bedroom' && (
            <g id="scene-master-bedroom">
              {/* Ceiling */}
              <polygon
                points="0,0 1000,0 850,115 150,115"
                fill={currentColorFor('ceiling')}
                className={getSurfaceClass('ceiling')}
                onClick={() => onSelectSurface('ceiling')}
                onMouseEnter={() => setHoveredSurface('ceiling')}
                onMouseLeave={() => setHoveredSurface(null)}
              />
              <polygon points="0,0 1000,0 850,115 150,115" fill="url(#aoCeiling)" pointerEvents="none" />

              {/* Left Wall */}
              <polygon
                points="0,0 150,115 150,515 0,650"
                fill={currentColorFor('mainWall')}
                className={getSurfaceClass('mainWall')}
                onClick={() => onSelectSurface('mainWall')}
                onMouseEnter={() => setHoveredSurface('mainWall')}
                onMouseLeave={() => setHoveredSurface(null)}
              />
              <polygon points="0,0 150,115 150,515 0,650" fill="url(#aoLeftWall)" pointerEvents="none" />

              {/* Right Wall */}
              <polygon
                points="1000,0 850,115 850,515 1000,650"
                fill={currentColorFor('mainWall')}
                className={getSurfaceClass('mainWall')}
                onClick={() => onSelectSurface('mainWall')}
                onMouseEnter={() => setHoveredSurface('mainWall')}
                onMouseLeave={() => setHoveredSurface(null)}
              />
              <polygon points="1000,0 850,115 850,515 1000,650" fill="url(#aoRightWall)" pointerEvents="none" />

              {/* Center Feature Wall */}
              <polygon
                points="150,115 850,115 850,515 150,515"
                fill={currentColorFor('accentWall')}
                className={getSurfaceClass('accentWall')}
                onClick={() => onSelectSurface('accentWall')}
                onMouseEnter={() => setHoveredSurface('accentWall')}
                onMouseLeave={() => setHoveredSurface(null)}
              />

              {/* Hardwood Chevron Floor */}
              <polygon points="0,650 150,515 850,515 1000,650" fill="url(#hardwoodParquet)" />

              {/* Trims */}
              <polyline
                points="0,0 150,115 850,115 1000,0"
                fill="none"
                stroke={currentColorFor('trim')}
                strokeWidth="10"
                className={getSurfaceClass('trim')}
                onClick={() => onSelectSurface('trim')}
              />
              <polyline
                points="0,650 150,515 850,515 1000,650"
                fill="none"
                stroke={currentColorFor('trim')}
                strokeWidth="12"
                className={getSurfaceClass('trim')}
                onClick={() => onSelectSurface('trim')}
              />

              {/* Architectural Vertical Wood Slats Backing */}
              <g opacity="0.18">
                {[...Array(18)].map((_, i) => (
                  <rect key={i} x={250 + i * 28} y="125" width="10" height="340" fill="#ffffff" />
                ))}
              </g>

              {/* Padded Luxury Headboard Wall Panel */}
              <rect
                x="240"
                y="240"
                width="520"
                height="210"
                rx="18"
                fill="#161c2c"
                stroke={currentColorFor('accents')}
                strokeWidth="4"
                className={getSurfaceClass('accents')}
                onClick={() => onSelectSurface('accents')}
                filter="url(#archShadow)"
              />

              {/* Luxury Platform Bed with Mattress & Duvet */}
              <polygon points="220,420 780,420 850,590 150,590" fill="#242c44" filter="url(#archShadow)" />

              {/* Folded Designer Quilt / Runner */}
              <polygon
                points="230,470 770,470 840,590 160,590"
                fill={currentColorFor('accents')}
                className={getSurfaceClass('accents')}
                onClick={() => onSelectSurface('accents')}
                onMouseEnter={() => setHoveredSurface('accents')}
                onMouseLeave={() => setHoveredSurface(null)}
              />

              {/* Pillows */}
              <rect x="270" y="370" width="110" height="65" rx="12" fill="#fafaf9" stroke="#e2e8f0" strokeWidth="2" />
              <rect x="400" y="370" width="110" height="65" rx="12" fill="#fafaf9" stroke="#e2e8f0" strokeWidth="2" />
              <rect x="530" y="370" width="110" height="65" rx="12" fill="#fafaf9" stroke="#e2e8f0" strokeWidth="2" />
              {/* Velvet Accent Cushions */}
              <rect x="340" y="400" width="70" height="50" rx="8" fill={currentColorFor('accents')} opacity="0.9" />
              <rect x="500" y="400" width="70" height="50" rx="8" fill={currentColorFor('accents')} opacity="0.9" />

              {/* Floating Walnut Nightstands */}
              <rect x="160" y="430" width="75" height="35" rx="5" fill="#1a1410" stroke="#c9a84c" strokeWidth="1.5" filter="url(#archShadow)" />
              <rect x="765" y="430" width="75" height="35" rx="5" fill="#1a1410" stroke="#c9a84c" strokeWidth="1.5" filter="url(#archShadow)" />

              {/* Suspended Brass Bedside Pendant Lamps */}
              <g id="bedside-pendants">
                <line x1="195" y1="115" x2="195" y2="330" stroke="#c9a84c" strokeWidth="2" />
                <circle cx="195" cy="340" r="14" fill="#fffbe8" stroke="#c9a84c" strokeWidth="3" filter="url(#softGlowSpot)" />
                <ellipse cx="195" cy="430" rx="70" ry="50" fill="#fff5cc" opacity="0.16" filter="url(#ambientLightCone)" />

                <line x1="800" y1="115" x2="800" y2="330" stroke="#c9a84c" strokeWidth="2" />
                <circle cx="800" cy="340" r="14" fill="#fffbe8" stroke="#c9a84c" strokeWidth="3" filter="url(#softGlowSpot)" />
                <ellipse cx="800" cy="430" rx="70" ry="50" fill="#fff5cc" opacity="0.16" filter="url(#ambientLightCone)" />
              </g>
            </g>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              ROOM TYPE 3: DINING & KITCHEN AREA
             ═══════════════════════════════════════════════════════════════════ */}
          {roomType === 'dining-kitchen' && (
            <g id="scene-dining-kitchen">
              <polygon
                points="0,0 1000,0 840,110 160,110"
                fill={currentColorFor('ceiling')}
                className={getSurfaceClass('ceiling')}
                onClick={() => onSelectSurface('ceiling')}
              />
              <polygon points="0,0 1000,0 840,110 160,110" fill="url(#aoCeiling)" pointerEvents="none" />

              <polygon
                points="0,0 160,110 160,515 0,650"
                fill={currentColorFor('mainWall')}
                className={getSurfaceClass('mainWall')}
                onClick={() => onSelectSurface('mainWall')}
              />
              <polygon points="0,0 160,110 160,515 0,650" fill="url(#aoLeftWall)" pointerEvents="none" />

              <polygon
                points="1000,0 840,110 840,515 1000,650"
                fill={currentColorFor('mainWall')}
                className={getSurfaceClass('mainWall')}
                onClick={() => onSelectSurface('mainWall')}
              />
              <polygon points="1000,0 840,110 840,515 1000,650" fill="url(#aoRightWall)" pointerEvents="none" />

              <polygon
                points="160,110 840,110 840,515 160,515"
                fill={currentColorFor('accentWall')}
                className={getSurfaceClass('accentWall')}
                onClick={() => onSelectSurface('accentWall')}
              />

              <polygon points="0,650 160,515 840,515 1000,650" fill="url(#polishedMarble)" />

              <polyline
                points="0,0 160,110 840,110 1000,0"
                fill="none"
                stroke={currentColorFor('trim')}
                strokeWidth="10"
                className={getSurfaceClass('trim')}
                onClick={() => onSelectSurface('trim')}
              />
              <polyline
                points="0,650 160,515 840,515 1000,650"
                fill="none"
                stroke={currentColorFor('trim')}
                strokeWidth="12"
                className={getSurfaceClass('trim')}
                onClick={() => onSelectSurface('trim')}
              />

              {/* Upper Kitchen Wall Cabinetry with Glass Lighting */}
              <g id="kitchen-upper-cabinets" filter="url(#archShadow)">
                <rect x="200" y="130" width="600" height="90" rx="4" fill="#0d1424" stroke="#c9a84c" strokeWidth="1.5" />
                <line x1="350" y1="130" x2="350" y2="220" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                <line x1="500" y1="130" x2="500" y2="220" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                <line x1="650" y1="130" x2="650" y2="220" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                {/* Under-cabinet LED Strip Glow */}
                <rect x="200" y="218" width="600" height="4" fill="#fff5cc" filter="url(#softGlowSpot)" />
              </g>

              {/* Marble Slab Backsplash */}
              <rect x="200" y="222" width="600" height="120" fill="#1a2233" stroke="rgba(255,255,255,0.1)" />

              {/* Waterfall Quartz Island Counter */}
              <polygon
                points="240,410 760,410 840,550 160,550"
                fill="#f8fafc"
                stroke="#c9a84c"
                strokeWidth="3"
                filter="url(#archShadow)"
              />
              <polygon points="160,550 240,410 240,520 160,610" fill="#cbd5e1" />
              <polygon points="760,410 840,550 840,610 760,520" fill="#94a3b8" />

              {/* Counter Barstools */}
              <g id="kitchen-barstools">
                <rect
                  x="300"
                  y="350"
                  width="70"
                  height="80"
                  rx="10"
                  fill={currentColorFor('accents')}
                  className={getSurfaceClass('accents')}
                  onClick={() => onSelectSurface('accents')}
                  filter="url(#archShadow)"
                />
                <rect
                  x="465"
                  y="350"
                  width="70"
                  height="80"
                  rx="10"
                  fill={currentColorFor('accents')}
                  className={getSurfaceClass('accents')}
                  onClick={() => onSelectSurface('accents')}
                  filter="url(#archShadow)"
                />
                <rect
                  x="630"
                  y="350"
                  width="70"
                  height="80"
                  rx="10"
                  fill={currentColorFor('accents')}
                  className={getSurfaceClass('accents')}
                  onClick={() => onSelectSurface('accents')}
                  filter="url(#archShadow)"
                />
              </g>

              {/* Trio of Scandinavian Dome Pendants */}
              <g id="dining-pendants">
                <line x1="370" y1="110" x2="370" y2="230" stroke="#c9a84c" strokeWidth="2" />
                <path d="M 340 260 Q 370 230 400 260 Z" fill="#0f172a" stroke="#c9a84c" strokeWidth="2" />
                <circle cx="370" cy="265" r="7" fill="#fffbe8" filter="url(#softGlowSpot)" />

                <line x1="500" y1="110" x2="500" y2="210" stroke="#c9a84c" strokeWidth="2" />
                <path d="M 470 240 Q 500 210 530 240 Z" fill="#0f172a" stroke="#c9a84c" strokeWidth="2" />
                <circle cx="500" cy="245" r="7" fill="#fffbe8" filter="url(#softGlowSpot)" />

                <line x1="630" y1="110" x2="630" y2="230" stroke="#c9a84c" strokeWidth="2" />
                <path d="M 600 260 Q 630 230 660 260 Z" fill="#0f172a" stroke="#c9a84c" strokeWidth="2" />
                <circle cx="630" cy="265" r="7" fill="#fffbe8" filter="url(#softGlowSpot)" />
              </g>
            </g>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              ROOM TYPE 4: EXTERIOR DUPLEX FACADE
             ═══════════════════════════════════════════════════════════════════ */}
          {roomType === 'exterior-facade' && (
            <g id="scene-exterior-facade">
              {/* Sky Background Gradient */}
              <rect x="0" y="0" width="1000" height="650" fill="linear-gradient(180deg, #0b1528 0%, #1e3a8a 50%, #38bdf8 100%)" />

              {/* Modern Cantilevered Roof & Soffit */}
              <polygon
                points="100,80 900,80 960,135 40,135"
                fill={currentColorFor('ceiling')}
                className={getSurfaceClass('ceiling')}
                onClick={() => onSelectSurface('ceiling')}
              />
              <line x1="40" y1="135" x2="960" y2="135" stroke={currentColorFor('trim')} strokeWidth="10" />

              {/* Main Exterior Building Mass */}
              <rect
                x="120"
                y="135"
                width="760"
                height="430"
                fill={currentColorFor('mainWall')}
                className={getSurfaceClass('mainWall')}
                onClick={() => onSelectSurface('mainWall')}
              />

              {/* Textured Architectural Stone Accent Column / Tower */}
              <rect
                x="430"
                y="135"
                width="180"
                height="430"
                fill={currentColorFor('accentWall')}
                className={getSurfaceClass('accentWall')}
                onClick={() => onSelectSurface('accentWall')}
                filter="url(#archShadow)"
              />

              {/* Ground & Landscaped Forecourt */}
              <rect x="0" y="565" width="1000" height="85" fill="#111827" />
              <line x1="0" y1="565" x2="1000" y2="565" stroke={currentColorFor('trim')} strokeWidth="12" />

              {/* Upper Left Panoramic Glass Window */}
              <rect
                x="180"
                y="190"
                width="190"
                height="125"
                fill="#070f1e"
                stroke={currentColorFor('trim')}
                strokeWidth="10"
                className={getSurfaceClass('trim')}
                onClick={() => onSelectSurface('trim')}
              />
              <line x1="275" y1="190" x2="275" y2="315" stroke={currentColorFor('trim')} strokeWidth="6" />

              {/* Upper Right Picture Window */}
              <rect
                x="650"
                y="190"
                width="190"
                height="125"
                fill="#070f1e"
                stroke={currentColorFor('trim')}
                strokeWidth="10"
                className={getSurfaceClass('trim')}
                onClick={() => onSelectSurface('trim')}
              />
              <line x1="745" y1="190" x2="745" y2="315" stroke={currentColorFor('trim')} strokeWidth="6" />

              {/* Grand Pivot Front Entrance Door */}
              <rect
                x="465"
                y="355"
                width="110"
                height="210"
                fill="#17120e"
                stroke={currentColorFor('accents')}
                strokeWidth="6"
                className={getSurfaceClass('accents')}
                onClick={() => onSelectSurface('accents')}
              />
              {/* Glass Door Sidelight & Brushed Gold Handle */}
              <rect x="480" y="375" width="20" height="170" fill="rgba(255,255,255,0.12)" />
              <line x1="555" y1="420" x2="555" y2="500" stroke="#f0d898" strokeWidth="6" strokeLinecap="round" />

              {/* Architectural Exterior Up/Down Sconces */}
              <circle cx="410" cy="380" r="11" fill="#fff4cc" filter="url(#softGlowSpot)" />
              <circle cx="630" cy="380" r="11" fill="#fff4cc" filter="url(#softGlowSpot)" />
            </g>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              ROOM TYPE 5: LUXURY BATHROOM SUITE
             ═══════════════════════════════════════════════════════════════════ */}
          {roomType === 'bathroom' && (
            <g id="scene-bathroom">
              <polygon
                points="0,0 1000,0 840,110 160,110"
                fill={currentColorFor('ceiling')}
                className={getSurfaceClass('ceiling')}
                onClick={() => onSelectSurface('ceiling')}
              />
              <polygon points="0,0 1000,0 840,110 160,110" fill="url(#aoCeiling)" pointerEvents="none" />

              <polygon
                points="0,0 160,110 160,515 0,650"
                fill={currentColorFor('mainWall')}
                className={getSurfaceClass('mainWall')}
                onClick={() => onSelectSurface('mainWall')}
              />
              <polygon points="0,0 160,110 160,515 0,650" fill="url(#aoLeftWall)" pointerEvents="none" />

              <polygon
                points="1000,0 840,110 840,515 1000,650"
                fill={currentColorFor('mainWall')}
                className={getSurfaceClass('mainWall')}
                onClick={() => onSelectSurface('mainWall')}
              />
              <polygon points="1000,0 840,110 840,515 1000,650" fill="url(#aoRightWall)" pointerEvents="none" />

              <polygon
                points="160,110 840,110 840,515 160,515"
                fill={currentColorFor('accentWall')}
                className={getSurfaceClass('accentWall')}
                onClick={() => onSelectSurface('accentWall')}
              />

              <polygon points="0,650 160,515 840,515 1000,650" fill="url(#polishedMarble)" />

              <polyline
                points="0,0 160,110 840,110 1000,0"
                fill="none"
                stroke={currentColorFor('trim')}
                strokeWidth="10"
                className={getSurfaceClass('trim')}
                onClick={() => onSelectSurface('trim')}
              />
              <polyline
                points="0,650 160,515 840,515 1000,650"
                fill="none"
                stroke={currentColorFor('trim')}
                strokeWidth="12"
                className={getSurfaceClass('trim')}
                onClick={() => onSelectSurface('trim')}
              />

              {/* Large Backlit LED Halo Vanity Mirror */}
              <circle cx="500" cy="260" r="100" fill="none" stroke="#ffffff" strokeWidth="8" filter="url(#softGlowSpot)" />
              <circle cx="500" cy="260" r="95" fill="#0d1424" stroke={currentColorFor('accents')} strokeWidth="4" />

              {/* Floating Oak/Quartz Vanity with Vessel Basin */}
              <g id="bathroom-vanity" filter="url(#archShadow)">
                <rect x="330" y="410" width="340" height="70" rx="8" fill="#182030" stroke="rgba(255,255,255,0.15)" />
                <ellipse cx="500" cy="405" rx="85" ry="26" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="3" />
                {/* Brushed Brass Mixer Faucet */}
                <path d="M 500 360 L 500 330 Q 500 310 515 310 L 525 315" fill="none" stroke={currentColorFor('accents')} strokeWidth="7" strokeLinecap="round" />
              </g>

              {/* Sculptural Freestanding Soaking Tub */}
              <g id="freestanding-tub" filter="url(#archShadow)">
                <ellipse cx="220" cy="505" rx="90" ry="38" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="4" />
                <path d="M 130 505 C 130 575 310 575 310 505" fill="#e2e8f0" />
                <ellipse cx="220" cy="505" rx="72" ry="26" fill="#0284c7" opacity="0.3" />
              </g>
            </g>
          )}
        </svg>

        {/* Floating Surface HUD chip on hover */}
        <AnimatePresence>
          {hoveredSurface && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 px-5 py-2.5 rounded-full bg-[#0d1629]/95 backdrop-blur-xl border border-white/20 text-white text-xs font-semibold shadow-2xl flex items-center gap-3 pointer-events-none"
            >
              <span
                className="w-4 h-4 rounded-full border border-white/50 shadow-inner"
                style={{ backgroundColor: colors[hoveredSurface] }}
              />
              <span>
                Click to paint{' '}
                <strong className="text-white">
                  {SURFACES.find((s) => s.key === hoveredSurface)?.label}
                </strong>{' '}
                •{' '}
                <span className="text-amber-300 font-bold">
                  {findClosestSandtexColor(colors[hoveredSurface]).name}
                </span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Surface Target Selectors (Footer Bar) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 p-3.5 bg-[#0a1122] border-t border-white/10">
        {SURFACES.map((surf) => {
          const isSelected = activeSurface === surf.key;
          const currentSwatch = findClosestSandtexColor(colors[surf.key]);
          return (
            <button
              key={surf.key}
              onClick={() => onSelectSurface(surf.key)}
              onMouseEnter={() => setHoveredSurface(surf.key)}
              onMouseLeave={() => setHoveredSurface(null)}
              className={`flex items-center gap-3 p-2.5 rounded-2xl border transition-all text-left ${
                isSelected
                  ? 'bg-white/15 border-amber-400 shadow-lg shadow-amber-500/10'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <div
                className="relative w-8 h-8 rounded-xl flex-shrink-0 border-2 shadow-sm transition-transform"
                style={{
                  backgroundColor: colors[surf.key],
                  borderColor: isSelected ? '#c9a84c' : 'rgba(255,255,255,0.3)',
                  transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                }}
              >
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold drop-shadow">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">{surf.label}</p>
                <p className="text-[10px] text-amber-300/90 font-medium truncate">{currentSwatch.name}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
