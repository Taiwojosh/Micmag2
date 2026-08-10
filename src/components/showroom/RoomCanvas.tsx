import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Sunset, Moon, Sparkles, RotateCcw, Eye, Layers, Check } from 'lucide-react';
import type { RoomTypeId, SurfaceKey, LightingMode, FinishType } from '../../data/showroomData';
import { SURFACES } from '../../data/showroomData';

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
}: RoomCanvasProps) {
  const [hoveredSurface, setHoveredSurface] = useState<SurfaceKey | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);

  // Lighting overlay styling
  const lightingOverlayStyles: Record<LightingMode, { filter: string; ambientColor: string; opacity: number }> = {
    daylight: {
      filter: 'brightness(1.02) contrast(1.02)',
      ambientColor: 'rgba(255, 255, 255, 0.05)',
      opacity: 0.2,
    },
    warm: {
      filter: 'sepia(0.18) saturate(1.15) brightness(0.98)',
      ambientColor: 'rgba(234, 108, 0, 0.15)',
      opacity: 0.4,
    },
    cool: {
      filter: 'hue-rotate(5deg) contrast(1.05) brightness(0.95)',
      ambientColor: 'rgba(26, 44, 91, 0.2)',
      opacity: 0.35,
    },
  };

  // Finish specular / texture styling
  const finishOverlayStyles: Record<FinishType, string> = {
    matt: 'opacity-0',
    silk: 'opacity-20 mix-blend-overlay',
    textured: 'opacity-40 mix-blend-multiply',
    gloss: 'opacity-35 mix-blend-hard-light',
  };

  const currentColorFor = (surface: SurfaceKey) => {
    if (showOriginal) {
      return '#e5e7eb'; // Neutral unpainted plaster comparison
    }
    return colors[surface];
  };

  const getSurfaceClass = (surface: SurfaceKey) => {
    const isActive = activeSurface === surface;
    const isHovered = hoveredSurface === surface;
    return `transition-all duration-300 cursor-pointer ${
      isActive ? 'stroke-amber-400 stroke-[3] drop-shadow-[0_0_8px_rgba(201,168,76,0.8)]' : ''
    } ${isHovered && !isActive ? 'stroke-white/80 stroke-[2]' : 'stroke-transparent'}`;
  };

  return (
    <div className="relative flex flex-col w-full bg-[#0a1122] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
      {/* ── Room Controls Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-[#0d1629]/90 backdrop-blur-md border-b border-white/10 z-20">
        {/* Surface Quick-Target indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-white/50 uppercase tracking-widest hidden sm:inline">
            Painting:
          </span>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20">
            <span
              className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-inner"
              style={{ backgroundColor: colors[activeSurface] }}
            />
            <span className="text-xs font-bold text-white tracking-wide">
              {SURFACES.find((s) => s.key === activeSurface)?.label}
            </span>
          </div>
        </div>

        {/* Action Pills: Lighting & Textures */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Lighting Mode Selector */}
          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => onLightingChange('daylight')}
              title="Daylight (5500K Clean White)"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                lighting === 'daylight'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Sun size={13} />
              <span className="hidden md:inline">Day</span>
            </button>
            <button
              onClick={() => onLightingChange('warm')}
              title="Golden Hour / Warm Glow (3000K)"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                lighting === 'warm'
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Sunset size={13} />
              <span className="hidden md:inline">Warm</span>
            </button>
            <button
              onClick={() => onLightingChange('cool')}
              title="Evening LED / Cool (4000K)"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                lighting === 'cool'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Moon size={13} />
              <span className="hidden md:inline">Cool</span>
            </button>
          </div>

          {/* Finish Selector */}
          <div className="hidden sm:flex items-center bg-black/40 p-1 rounded-xl border border-white/10">
            <Layers size={13} className="text-white/40 ml-1.5 mr-0.5" />
            {(['matt', 'silk', 'textured'] as FinishType[]).map((f) => (
              <button
                key={f}
                onClick={() => onFinishChange(f)}
                className={`px-2 py-1 rounded-lg text-xs capitalize transition-all ${
                  finish === f
                    ? 'bg-white/20 text-white font-bold border border-white/30'
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
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              showOriginal
                ? 'bg-red-500/20 text-red-300 border-red-500/40'
                : 'bg-white/5 text-white/70 border-white/15 hover:bg-white/10'
            }`}
          >
            <Eye size={13} />
            <span className="hidden sm:inline">{showOriginal ? 'Unpainted' : 'Compare'}</span>
          </button>

          {/* Randomize / Inspire */}
          <button
            onClick={onRandomize}
            title="Randomize Designer Harmony"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all"
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
        </div>
      </div>

      {/* ── Interactive SVG Room Scene ── */}
      <div
        className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[340px] max-h-[580px] overflow-hidden flex items-center justify-center select-none"
        style={{ filter: lightingOverlayStyles[lighting].filter }}
      >
        {/* Ambient room texture */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${finishOverlayStyles[finish]}`}
          style={{
            backgroundImage:
              finish === 'textured'
                ? `radial-gradient(#ffffff 1px, transparent 1px), radial-gradient(#000000 1px, transparent 1px)`
                : `linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%)`,
            backgroundSize: finish === 'textured' ? '12px 12px' : 'auto',
          }}
        />

        {/* Ambient lighting color wash */}
        <div
          className="absolute inset-0 pointer-events-none transition-colors duration-700"
          style={{
            backgroundColor: lightingOverlayStyles[lighting].ambientColor,
            opacity: lightingOverlayStyles[lighting].opacity,
          }}
        />

        {/* Interactive Vector Room Illustrations */}
        <svg
          viewBox="0 0 1000 650"
          className="w-full h-full object-cover transition-transform duration-700"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Ambient gradients */}
            <linearGradient id="wallLightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
              <stop offset="60%" stopColor="#000000" stopOpacity="0" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
            </linearGradient>

            <linearGradient id="windowLightGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
            </linearGradient>

            <linearGradient id="ceilingGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
            </linearGradient>

            <linearGradient id="floorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2a1f18" />
              <stop offset="100%" stopColor="#150f0c" />
            </linearGradient>

            {/* Subtle shadow filter */}
            <filter id="furnitureShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="12" stdDeviation="10" floodOpacity="0.45" floodColor="#000000" />
            </filter>

            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="15" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ═══════════════════════════════════════════════════════════════════
              ROOM TYPE 1: MODERN LIVING ROOM
             ═══════════════════════════════════════════════════════════════════ */}
          {roomType === 'living-room' && (
            <g id="scene-living-room">
              {/* Ceiling */}
              <polygon
                points="0,0 1000,0 860,110 140,110"
                fill={currentColorFor('ceiling')}
                className={getSurfaceClass('ceiling')}
                onClick={() => onSelectSurface('ceiling')}
                onMouseEnter={() => setHoveredSurface('ceiling')}
                onMouseLeave={() => setHoveredSurface(null)}
              />
              <polygon points="0,0 1000,0 860,110 140,110" fill="url(#ceilingGrad)" pointerEvents="none" />

              {/* Ceiling recessed light cones */}
              <circle cx="300" cy="55" r="5" fill="#ffffff" filter="url(#softGlow)" />
              <circle cx="500" cy="55" r="5" fill="#ffffff" filter="url(#softGlow)" />
              <circle cx="700" cy="55" r="5" fill="#ffffff" filter="url(#softGlow)" />

              {/* Left Main Wall */}
              <polygon
                points="0,0 140,110 140,510 0,650"
                fill={currentColorFor('mainWall')}
                className={getSurfaceClass('mainWall')}
                onClick={() => onSelectSurface('mainWall')}
                onMouseEnter={() => setHoveredSurface('mainWall')}
                onMouseLeave={() => setHoveredSurface(null)}
              />
              <polygon points="0,0 140,110 140,510 0,650" fill="url(#wallLightGrad)" pointerEvents="none" />

              {/* Right Main Wall */}
              <polygon
                points="1000,0 860,110 860,510 1000,650"
                fill={currentColorFor('mainWall')}
                className={getSurfaceClass('mainWall')}
                onClick={() => onSelectSurface('mainWall')}
                onMouseEnter={() => setHoveredSurface('mainWall')}
                onMouseLeave={() => setHoveredSurface(null)}
              />
              <polygon points="1000,0 860,110 860,510 1000,650" fill="url(#wallLightGrad)" pointerEvents="none" />

              {/* Center Accent Feature Wall */}
              <polygon
                points="140,110 860,110 860,510 140,510"
                fill={currentColorFor('accentWall')}
                className={getSurfaceClass('accentWall')}
                onClick={() => onSelectSurface('accentWall')}
                onMouseEnter={() => setHoveredSurface('accentWall')}
                onMouseLeave={() => setHoveredSurface(null)}
              />

              {/* Floor */}
              <polygon points="0,650 140,510 860,510 1000,650" fill="url(#floorGrad)" />
              {/* Floor Wood Planks / Reflection Lines */}
              <line x1="250" y1="510" x2="200" y2="650" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
              <line x1="400" y1="510" x2="380" y2="650" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
              <line x1="600" y1="510" x2="620" y2="650" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
              <line x1="750" y1="510" x2="800" y2="650" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />

              {/* Large Luxury Rug */}
              <polygon
                points="220,530 780,530 880,640 120,640"
                fill="#24283b"
                opacity="0.9"
                stroke="rgba(255,255,255,0.1)"
              />

              {/* Baseboard Trim & Cornice */}
              {/* Ceiling Cornice Trim */}
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
              {/* Baseboard Skirting Trim */}
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

              {/* Large Modern Left Window */}
              <g id="window-frame">
                <polygon points="20,130 110,180 110,430 20,490" fill="#0d1f3d" opacity="0.9" />
                <polygon points="20,130 110,180 110,430 20,490" fill="url(#windowLightGrad)" />
                <polygon
                  points="20,130 110,180 110,430 20,490"
                  fill="none"
                  stroke={currentColorFor('trim')}
                  strokeWidth="6"
                  className={getSurfaceClass('trim')}
                  onClick={() => onSelectSurface('trim')}
                />
                {/* Window Mullions */}
                <line x1="65" y1="155" x2="65" y2="460" stroke={currentColorFor('trim')} strokeWidth="4" />
                <line x1="20" y1="310" x2="110" y2="305" stroke={currentColorFor('trim')} strokeWidth="4" />
              </g>

              {/* Accent Feature Wall Artwork Panel */}
              <g id="accent-art-panel" filter="url(#furnitureShadow)">
                <rect
                  x="360"
                  y="160"
                  width="280"
                  height="160"
                  rx="6"
                  fill="#0b0f19"
                  stroke={currentColorFor('accents')}
                  strokeWidth="8"
                  className={getSurfaceClass('accents')}
                  onClick={() => onSelectSurface('accents')}
                  onMouseEnter={() => setHoveredSurface('accents')}
                  onMouseLeave={() => setHoveredSurface(null)}
                />
                {/* Abstract gold/geo art strokes */}
                <circle cx="500" cy="240" r="45" fill={currentColorFor('accents')} opacity="0.35" />
                <path d="M 400 270 Q 500 180 600 270" stroke={currentColorFor('accents')} strokeWidth="4" fill="none" />
                <line x1="430" y1="210" x2="570" y2="210" stroke="#ffffff" strokeWidth="2" opacity="0.5" />
              </g>

              {/* Modern Low-Profile Floating Credenza */}
              <rect x="300" y="380" width="400" height="40" rx="4" fill="#181310" stroke="#33241b" strokeWidth="2" filter="url(#furnitureShadow)" />
              <line x1="320" y1="400" x2="680" y2="400" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

              {/* Modern Luxury Italian Sofa */}
              <g id="sofa-group" filter="url(#furnitureShadow)">
                {/* Sofa Backrest */}
                <rect x="260" y="410" width="480" height="90" rx="20" fill="#1c2030" stroke="rgba(255,255,255,0.1)" />
                {/* Sofa Cushions / Pillows (Accents) */}
                <rect
                  x="300"
                  y="435"
                  width="70"
                  height="50"
                  rx="10"
                  fill={currentColorFor('accents')}
                  opacity="0.9"
                  className={getSurfaceClass('accents')}
                  onClick={() => onSelectSurface('accents')}
                  onMouseEnter={() => setHoveredSurface('accents')}
                  onMouseLeave={() => setHoveredSurface(null)}
                />
                <rect
                  x="630"
                  y="435"
                  width="70"
                  height="50"
                  rx="10"
                  fill={currentColorFor('accents')}
                  opacity="0.9"
                  className={getSurfaceClass('accents')}
                  onClick={() => onSelectSurface('accents')}
                  onMouseEnter={() => setHoveredSurface('accents')}
                  onMouseLeave={() => setHoveredSurface(null)}
                />
                {/* Sofa Base / Seat */}
                <rect x="230" y="470" width="540" height="95" rx="24" fill="#252b42" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                {/* Sofa Armrests */}
                <rect x="205" y="450" width="50" height="110" rx="16" fill="#1e2336" />
                <rect x="745" y="450" width="50" height="110" rx="16" fill="#1e2336" />
                {/* Modern Brass Sofa Legs */}
                <line x1="240" y1="565" x2="235" y2="585" stroke="#c9a84c" strokeWidth="6" strokeLinecap="round" />
                <line x1="760" y1="565" x2="765" y2="585" stroke="#c9a84c" strokeWidth="6" strokeLinecap="round" />
              </g>

              {/* Contemporary Arc Floor Lamp */}
              <g id="floor-lamp" filter="url(#furnitureShadow)">
                <path d="M 850 540 Q 880 260 760 180" fill="none" stroke="#c9a84c" strokeWidth="4" strokeLinecap="round" />
                <ellipse cx="760" cy="180" rx="28" ry="14" fill="#1a1a1a" stroke="#c9a84c" strokeWidth="2" />
                <polygon points="735,185 785,185 820,310 700,310" fill="#fff9eb" opacity="0.12" />
                <circle cx="850" cy="540" r="18" fill="#1a1a1a" stroke="#c9a84c" strokeWidth="3" />
              </g>

              {/* Architectural Indoor Fiddle Leaf Fig Plant */}
              <g id="indoor-plant">
                <ellipse cx="150" cy="530" rx="22" ry="10" fill="#1a120b" />
                <polygon points="135,530 165,530 160,575 140,575" fill="#fdf8f0" stroke="#c9a84c" strokeWidth="2" />
                {/* Green Leaves */}
                <path d="M 150 530 Q 120 450 100 420 Q 140 440 150 530" fill="#386641" />
                <path d="M 150 530 Q 180 430 190 390 Q 160 430 150 530" fill="#2d5a35" />
                <path d="M 150 530 Q 130 400 145 350 Q 165 410 150 530" fill="#4f772d" />
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
                points="0,0 1000,0 850,120 150,120"
                fill={currentColorFor('ceiling')}
                className={getSurfaceClass('ceiling')}
                onClick={() => onSelectSurface('ceiling')}
                onMouseEnter={() => setHoveredSurface('ceiling')}
                onMouseLeave={() => setHoveredSurface(null)}
              />
              <polygon points="0,0 1000,0 850,120 150,120" fill="url(#ceilingGrad)" pointerEvents="none" />

              {/* Left Main Side Wall */}
              <polygon
                points="0,0 150,120 150,520 0,650"
                fill={currentColorFor('mainWall')}
                className={getSurfaceClass('mainWall')}
                onClick={() => onSelectSurface('mainWall')}
                onMouseEnter={() => setHoveredSurface('mainWall')}
                onMouseLeave={() => setHoveredSurface(null)}
              />
              {/* Right Main Side Wall */}
              <polygon
                points="1000,0 850,120 850,520 1000,650"
                fill={currentColorFor('mainWall')}
                className={getSurfaceClass('mainWall')}
                onClick={() => onSelectSurface('mainWall')}
                onMouseEnter={() => setHoveredSurface('mainWall')}
                onMouseLeave={() => setHoveredSurface(null)}
              />

              {/* Headboard Center Accent Wall */}
              <polygon
                points="150,120 850,120 850,520 150,520"
                fill={currentColorFor('accentWall')}
                className={getSurfaceClass('accentWall')}
                onClick={() => onSelectSurface('accentWall')}
                onMouseEnter={() => setHoveredSurface('accentWall')}
                onMouseLeave={() => setHoveredSurface(null)}
              />

              {/* Floor */}
              <polygon points="0,650 150,520 850,520 1000,650" fill="#141118" />

              {/* Trims */}
              <polyline
                points="0,0 150,120 850,120 1000,0"
                fill="none"
                stroke={currentColorFor('trim')}
                strokeWidth="10"
                className={getSurfaceClass('trim')}
                onClick={() => onSelectSurface('trim')}
              />
              <polyline
                points="0,650 150,520 850,520 1000,650"
                fill="none"
                stroke={currentColorFor('trim')}
                strokeWidth="12"
                className={getSurfaceClass('trim')}
                onClick={() => onSelectSurface('trim')}
              />

              {/* Architectural Wood Slats Behind Bed */}
              <g opacity="0.25">
                {[...Array(14)].map((_, i) => (
                  <rect key={i} x={300 + i * 28} y="130" width="8" height="320" fill="#ffffff" />
                ))}
              </g>

              {/* Giant Luxury Upholstered Headboard */}
              <rect
                x="260"
                y="260"
                width="480"
                height="190"
                rx="16"
                fill="#1f2438"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="2"
                filter="url(#furnitureShadow)"
              />

              {/* King Size Bed Frame */}
              <polygon points="240,430 760,430 830,590 170,590" fill="#2d334d" filter="url(#furnitureShadow)" />

              {/* Bed Duvet / Linen (Accents) */}
              <polygon
                points="250,470 750,470 820,590 180,590"
                fill={currentColorFor('accents')}
                className={getSurfaceClass('accents')}
                onClick={() => onSelectSurface('accents')}
                onMouseEnter={() => setHoveredSurface('accents')}
                onMouseLeave={() => setHoveredSurface(null)}
              />

              {/* Pillows */}
              <rect x="290" y="380" width="100" height="60" rx="10" fill="#ffffff" opacity="0.9" />
              <rect x="410" y="380" width="100" height="60" rx="10" fill="#ffffff" opacity="0.9" />
              <rect x="530" y="380" width="100" height="60" rx="10" fill="#ffffff" opacity="0.9" />

              {/* Bedside Floating Tables */}
              <rect x="180" y="440" width="70" height="30" rx="4" fill="#181310" stroke="#c9a84c" strokeWidth="1" />
              <rect x="750" y="440" width="70" height="30" rx="4" fill="#181310" stroke="#c9a84c" strokeWidth="1" />

              {/* Hanging Brass Bedside Pendants */}
              <line x1="215" y1="120" x2="215" y2="340" stroke="#c9a84c" strokeWidth="2" />
              <circle cx="215" cy="350" r="16" fill="#fff8e7" stroke="#c9a84c" strokeWidth="3" filter="url(#softGlow)" />
              <line x1="785" y1="120" x2="785" y2="340" stroke="#c9a84c" strokeWidth="2" />
              <circle cx="785" cy="350" r="16" fill="#fff8e7" stroke="#c9a84c" strokeWidth="3" filter="url(#softGlow)" />
            </g>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              ROOM TYPE 3: DINING & KITCHEN AREA
             ═══════════════════════════════════════════════════════════════════ */}
          {roomType === 'dining-kitchen' && (
            <g id="scene-dining-kitchen">
              {/* Ceiling */}
              <polygon
                points="0,0 1000,0 840,110 160,110"
                fill={currentColorFor('ceiling')}
                className={getSurfaceClass('ceiling')}
                onClick={() => onSelectSurface('ceiling')}
              />

              {/* Left Wall */}
              <polygon
                points="0,0 160,110 160,520 0,650"
                fill={currentColorFor('mainWall')}
                className={getSurfaceClass('mainWall')}
                onClick={() => onSelectSurface('mainWall')}
              />
              {/* Right Wall / Kitchen Pantry Side */}
              <polygon
                points="1000,0 840,110 840,520 1000,650"
                fill={currentColorFor('mainWall')}
                className={getSurfaceClass('mainWall')}
                onClick={() => onSelectSurface('mainWall')}
              />

              {/* Center Feature Dining Backdrop */}
              <polygon
                points="160,110 840,110 840,520 160,520"
                fill={currentColorFor('accentWall')}
                className={getSurfaceClass('accentWall')}
                onClick={() => onSelectSurface('accentWall')}
              />

              {/* Floor */}
              <polygon points="0,650 160,520 840,520 1000,650" fill="#1b1816" />

              {/* Trims */}
              <polyline
                points="0,0 160,110 840,110 1000,0"
                fill="none"
                stroke={currentColorFor('trim')}
                strokeWidth="10"
                className={getSurfaceClass('trim')}
                onClick={() => onSelectSurface('trim')}
              />
              <polyline
                points="0,650 160,520 840,520 1000,650"
                fill="none"
                stroke={currentColorFor('trim')}
                strokeWidth="12"
                className={getSurfaceClass('trim')}
                onClick={() => onSelectSurface('trim')}
              />

              {/* Modern Dining Table */}
              <polygon points="260,420 740,420 820,540 180,540" fill="#251a14" stroke="#c9a84c" strokeWidth="2" filter="url(#furnitureShadow)" />
              <line x1="220" y1="540" x2="220" y2="610" stroke="#110d0a" strokeWidth="12" />
              <line x1="780" y1="540" x2="780" y2="610" stroke="#110d0a" strokeWidth="12" />

              {/* Dining Chairs with Accents */}
              <rect
                x="310"
                y="340"
                width="60"
                height="90"
                rx="10"
                fill={currentColorFor('accents')}
                className={getSurfaceClass('accents')}
                onClick={() => onSelectSurface('accents')}
              />
              <rect
                x="470"
                y="340"
                width="60"
                height="90"
                rx="10"
                fill={currentColorFor('accents')}
                className={getSurfaceClass('accents')}
                onClick={() => onSelectSurface('accents')}
              />
              <rect
                x="630"
                y="340"
                width="60"
                height="90"
                rx="10"
                fill={currentColorFor('accents')}
                className={getSurfaceClass('accents')}
                onClick={() => onSelectSurface('accents')}
              />

              {/* Statement Trio Pendant Chandelier */}
              <line x1="380" y1="110" x2="380" y2="230" stroke="#c9a84c" strokeWidth="2" />
              <polygon points="360,260 400,260 410,230 350,230" fill="#181310" stroke="#c9a84c" strokeWidth="2" />
              <circle cx="380" cy="265" r="8" fill="#fffbe8" filter="url(#softGlow)" />

              <line x1="500" y1="110" x2="500" y2="200" stroke="#c9a84c" strokeWidth="2" />
              <polygon points="480,230 520,230 530,200 470,200" fill="#181310" stroke="#c9a84c" strokeWidth="2" />
              <circle cx="500" cy="235" r="8" fill="#fffbe8" filter="url(#softGlow)" />

              <line x1="620" y1="110" x2="620" y2="240" stroke="#c9a84c" strokeWidth="2" />
              <polygon points="600,270 640,270 650,240 590,240" fill="#181310" stroke="#c9a84c" strokeWidth="2" />
              <circle cx="620" cy="275" r="8" fill="#fffbe8" filter="url(#softGlow)" />
            </g>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              ROOM TYPE 4: EXTERIOR DUPLEX FACADE
             ═══════════════════════════════════════════════════════════════════ */}
          {roomType === 'exterior-facade' && (
            <g id="scene-exterior-facade">
              {/* Sky Background */}
              <rect x="0" y="0" width="1000" height="650" fill="#162035" />

              {/* Roof Eaves / Overhang (Ceiling) */}
              <polygon
                points="120,90 880,90 940,140 60,140"
                fill={currentColorFor('ceiling')}
                className={getSurfaceClass('ceiling')}
                onClick={() => onSelectSurface('ceiling')}
              />
              <line x1="60" y1="140" x2="940" y2="140" stroke={currentColorFor('trim')} strokeWidth="8" />

              {/* Main Exterior Stucco Facade */}
              <rect
                x="140"
                y="140"
                width="720"
                height="420"
                fill={currentColorFor('mainWall')}
                className={getSurfaceClass('mainWall')}
                onClick={() => onSelectSurface('mainWall')}
              />

              {/* Accent Feature Columns / Portico Cladding */}
              <rect
                x="440"
                y="140"
                width="160"
                height="420"
                fill={currentColorFor('accentWall')}
                className={getSurfaceClass('accentWall')}
                onClick={() => onSelectSurface('accentWall')}
                filter="url(#furnitureShadow)"
              />

              {/* Foundation Plinth (Ground) */}
              <rect x="0" y="560" width="1000" height="90" fill="#181c24" />
              <line x1="0" y1="560" x2="1000" y2="560" stroke={currentColorFor('trim')} strokeWidth="10" />

              {/* Architectural Windows with Trim */}
              {/* Upper Left Window */}
              <rect
                x="200"
                y="190"
                width="160"
                height="110"
                fill="#091324"
                stroke={currentColorFor('trim')}
                strokeWidth="10"
                className={getSurfaceClass('trim')}
                onClick={() => onSelectSurface('trim')}
              />
              <line x1="280" y1="190" x2="280" y2="300" stroke={currentColorFor('trim')} strokeWidth="6" />

              {/* Upper Right Window */}
              <rect
                x="660"
                y="190"
                width="160"
                height="110"
                fill="#091324"
                stroke={currentColorFor('trim')}
                strokeWidth="10"
                className={getSurfaceClass('trim')}
                onClick={() => onSelectSurface('trim')}
              />
              <line x1="740" y1="190" x2="740" y2="300" stroke={currentColorFor('trim')} strokeWidth="6" />

              {/* Grand Entrance Door (Accents) */}
              <rect
                x="470"
                y="360"
                width="100"
                height="200"
                fill="#15120e"
                stroke={currentColorFor('accents')}
                strokeWidth="6"
                className={getSurfaceClass('accents')}
                onClick={() => onSelectSurface('accents')}
              />
              <rect x="490" y="380" width="60" height="80" fill="rgba(255,255,255,0.08)" />
              {/* Long Brass Door Handle */}
              <line x1="555" y1="430" x2="555" y2="490" stroke="#c9a84c" strokeWidth="6" strokeLinecap="round" />

              {/* Outdoor Sconce Lights */}
              <circle cx="430" cy="380" r="10" fill="#fff0c2" filter="url(#softGlow)" />
              <circle cx="610" cy="380" r="10" fill="#fff0c2" filter="url(#softGlow)" />
            </g>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              ROOM TYPE 5: LUXURY BATHROOM SUITE
             ═══════════════════════════════════════════════════════════════════ */}
          {roomType === 'bathroom' && (
            <g id="scene-bathroom">
              {/* Ceiling */}
              <polygon
                points="0,0 1000,0 840,110 160,110"
                fill={currentColorFor('ceiling')}
                className={getSurfaceClass('ceiling')}
                onClick={() => onSelectSurface('ceiling')}
              />

              {/* Left Dry Wall */}
              <polygon
                points="0,0 160,110 160,520 0,650"
                fill={currentColorFor('mainWall')}
                className={getSurfaceClass('mainWall')}
                onClick={() => onSelectSurface('mainWall')}
              />
              {/* Right Wall */}
              <polygon
                points="1000,0 840,110 840,520 1000,650"
                fill={currentColorFor('mainWall')}
                className={getSurfaceClass('mainWall')}
                onClick={() => onSelectSurface('mainWall')}
              />

              {/* Center Wet Vanity Feature Wall */}
              <polygon
                points="160,110 840,110 840,520 160,520"
                fill={currentColorFor('accentWall')}
                className={getSurfaceClass('accentWall')}
                onClick={() => onSelectSurface('accentWall')}
              />

              {/* Floor */}
              <polygon points="0,650 160,520 840,520 1000,650" fill="#121822" />

              {/* Base Trims */}
              <polyline
                points="0,0 160,110 840,110 1000,0"
                fill="none"
                stroke={currentColorFor('trim')}
                strokeWidth="10"
                className={getSurfaceClass('trim')}
                onClick={() => onSelectSurface('trim')}
              />
              <polyline
                points="0,650 160,520 840,520 1000,650"
                fill="none"
                stroke={currentColorFor('trim')}
                strokeWidth="12"
                className={getSurfaceClass('trim')}
                onClick={() => onSelectSurface('trim')}
              />

              {/* Backlit Circular Mirror (Accents) */}
              <circle cx="500" cy="270" r="95" fill="none" stroke="#ffffff" strokeWidth="8" filter="url(#softGlow)" />
              <circle cx="500" cy="270" r="90" fill="#111c2e" stroke={currentColorFor('accents')} strokeWidth="4" />

              {/* Modern Floating Vanity with Basin */}
              <rect x="340" y="420" width="320" height="60" rx="8" fill="#1e2738" stroke="rgba(255,255,255,0.15)" filter="url(#furnitureShadow)" />
              {/* Ceramic Basin */}
              <ellipse cx="500" cy="415" rx="80" ry="25" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="3" />
              {/* European Brushed Gold Tap (Accents) */}
              <path d="M 500 370 L 500 340 Q 500 320 515 320 L 525 325" fill="none" stroke={currentColorFor('accents')} strokeWidth="6" strokeLinecap="round" />

              {/* Freestanding Bathtub on Left */}
              <g id="freestanding-tub" filter="url(#furnitureShadow)">
                <ellipse cx="220" cy="510" rx="85" ry="35" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="3" />
                <path d="M 135 510 C 135 570 305 570 305 510" fill="#e2e8f0" />
              </g>
            </g>
          )}
        </svg>

        {/* Floating click prompt on hover */}
        <AnimatePresence>
          {hoveredSurface && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-xl flex items-center gap-2 pointer-events-none"
            >
              <span
                className="w-3 h-3 rounded-full border border-white/40"
                style={{ backgroundColor: colors[hoveredSurface] }}
              />
              <span>Click to select {SURFACES.find((s) => s.key === hoveredSurface)?.label}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Surface Target Selectors (Footer Bar) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-3 bg-[#0d1629] border-t border-white/10">
        {SURFACES.map((surf) => {
          const isSelected = activeSurface === surf.key;
          return (
            <button
              key={surf.key}
              onClick={() => onSelectSurface(surf.key)}
              onMouseEnter={() => setHoveredSurface(surf.key)}
              onMouseLeave={() => setHoveredSurface(null)}
              className={`flex items-center gap-2.5 p-2.5 rounded-2xl border transition-all text-left ${
                isSelected
                  ? 'bg-white/15 border-amber-400/80 shadow-lg shadow-amber-500/10'
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
                <p className="text-[10px] text-white/50 truncate">{surf.recommendedFinish}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
