import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sun,
  Sunset,
  Moon,
  Sparkles,
  RotateCcw,
  Maximize2,
  Minimize2,
  Undo2,
  Redo2,
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
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Lighting overlay styling & atmospheric filters — cinematic grade
  const lightingOverlayStyles: Record<
    LightingMode,
    { filter: string; opacity: number; blend: string }
  > = {
    day: {
      filter: 'brightness(1.04) contrast(1.02) saturate(1.05)',
      opacity: 0,
      blend: 'normal',
    },
    warm: {
      filter: 'sepia(0.28) saturate(1.35) brightness(1.02) contrast(1.06)',
      opacity: 0.28,
      blend: 'color-burn',
    },
    cool: {
      filter: 'hue-rotate(190deg) saturate(0.85) contrast(1.12) brightness(0.88)',
      opacity: 0.35,
      blend: 'multiply',
    },
  };

  const getSurfaceClass = (surface: SurfaceKey) => {
    const isSelected = activeSurface === surface;
    const isHovered = hoveredSurface === surface;
    return `cursor-pointer transition-all duration-300 ${
      isSelected
        ? 'stroke-[#c9a84c] stroke-[3px] filter drop-shadow-[0_0_8px_rgba(201,168,76,0.8)]'
        : isHovered
        ? 'stroke-white/80 stroke-[2px] filter brightness-110'
        : 'stroke-transparent hover:stroke-white/40 stroke-[1px]'
    }`;
  };

  const currentColorFor = (surface: SurfaceKey) => colors[surface] || '#ffffff';

  const roomNames: Record<RoomTypeId, string> = {
    'living-room': 'Modern Luxury Living Room',
    'master-bedroom': 'Master Bedroom Suite',
    'dining-kitchen': 'Dining & Kitchen Area',
    'exterior-facade': 'Exterior Duplex Facade',
    'bathroom': 'Luxury Bathroom Suite',
  };

  return (
    <div className={`relative w-full ${isFullscreen ? 'fixed inset-0 z-50 h-screen rounded-0' : 'h-[650px] rounded-2xl'} bg-[#0a0f1d] overflow-hidden shadow-2xl border border-white/10 select-none`}>
      
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        
        {/* Instant 0ms Badge + Scene Name */}
        <div className="flex items-center gap-2.5 px-4 py-2 bg-[#070b14]/80 backdrop-blur-xl border border-white/15 rounded-full shadow-lg pointer-events-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          <span className="text-xs font-bold text-white tracking-wider uppercase">Instant HD Engine</span>
          <span className="text-white/30">•</span>
          <span className="text-xs font-semibold text-amber-300">{roomNames[roomType]}</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          
          {/* Lighting Mode Selector */}
          <div className="flex items-center bg-[#070b14]/80 backdrop-blur-xl border border-white/15 rounded-full p-1 shadow-lg">
            <button
              onClick={() => onLightingChange('day')}
              className={`p-2 rounded-full transition-all ${lighting === 'day' ? 'bg-amber-400/20 text-amber-300 shadow' : 'text-white/60 hover:text-white'}`}
              title="Daylight"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => onLightingChange('warm')}
              className={`p-2 rounded-full transition-all ${lighting === 'warm' ? 'bg-orange-400/20 text-orange-300 shadow' : 'text-white/60 hover:text-white'}`}
              title="Warm Golden Hour"
            >
              <Sunset className="w-4 h-4" />
            </button>
            <button
              onClick={() => onLightingChange('cool')}
              className={`p-2 rounded-full transition-all ${lighting === 'cool' ? 'bg-cyan-400/20 text-cyan-300 shadow' : 'text-white/60 hover:text-white'}`}
              title="Cool Evening Light"
            >
              <Moon className="w-4 h-4" />
            </button>
          </div>

          {/* Finish Switcher */}
          <div className="flex items-center bg-[#070b14]/80 backdrop-blur-xl border border-white/15 rounded-full p-1 shadow-lg text-xs font-semibold text-white/80">
            {(['matte', 'silk', 'gloss'] as FinishType[]).map((f) => (
              <button
                key={f}
                onClick={() => onFinishChange(f)}
                className={`px-3 py-1.5 rounded-full capitalize transition-all ${
                  finish === f
                    ? 'bg-[#c9a84c] text-black shadow font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Undo / Redo */}
          {onUndo && (
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className={`p-2.5 rounded-full bg-[#070b14]/80 backdrop-blur-xl border border-white/15 shadow-lg transition-all ${canUndo ? 'text-white hover:bg-white/10' : 'text-white/20 cursor-not-allowed'}`}
              title="Undo"
            >
              <Undo2 className="w-4 h-4" />
            </button>
          )}
          {onRedo && (
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className={`p-2.5 rounded-full bg-[#070b14]/80 backdrop-blur-xl border border-white/15 shadow-lg transition-all ${canRedo ? 'text-white hover:bg-white/10' : 'text-white/20 cursor-not-allowed'}`}
              title="Redo"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          )}

          {/* Randomize */}
          <button
            onClick={onRandomize}
            className="p-2.5 rounded-full bg-[#070b14]/80 backdrop-blur-xl border border-white/15 text-white/80 hover:text-amber-300 hover:bg-white/10 shadow-lg transition-all"
            title="Randomize Harmonious Palette"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            className="p-2.5 rounded-full bg-[#070b14]/80 backdrop-blur-xl border border-white/15 text-white/80 hover:text-white hover:bg-white/10 shadow-lg transition-all"
            title="Reset Colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2.5 rounded-full bg-[#070b14]/80 backdrop-blur-xl border border-white/15 text-white/80 hover:text-white hover:bg-white/10 shadow-lg transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen View'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div 
        className="w-full h-full relative flex items-center justify-center"
        style={{ filter: lightingOverlayStyles[lighting].filter }}
      >
        <svg
          viewBox="0 0 1000 650"
          className="w-full h-full object-contain"
          style={{ maxHeight: isFullscreen ? '100vh' : '650px' }}
        >
          <defs>
            {/* Realistic Plaster Stucco Noise Texture */}
            <filter id="wallGrain" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise" />
              <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0.15 0" />
              <feBlend in="SourceGraphic" in2="noise" mode="soft-light" />
            </filter>

            <filter id="plasterTexture" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="4" result="noise" />
              <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0.22 0" />
              <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
            </filter>

            {/* Wood Grain Texture */}
            <filter id="woodGrain" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.04 0.9" numOctaves="2" result="noise" />
              <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0.2 0" />
              <feBlend in="SourceGraphic" in2="noise" mode="overlay" />
            </filter>

            {/* Marble Backsplash Veining */}
            <filter id="marbleVein" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.02 0.08" numOctaves="3" result="noise" />
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.25 0" />
              <feBlend in="SourceGraphic" in2="noise" mode="overlay" />
            </filter>

            {/* Realistic Contact Shadow */}
            <filter id="contactShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="blur" />
              <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0" />
            </filter>

            {/* Double-Pass Furniture Shadow */}
            <filter id="furnitureShadow" x="-25%" y="-25%" width="150%" height="150%">
              <feDropShadow dx="0" dy="18" stdDeviation="14" floodColor="#000000" floodOpacity="0.55" result="softShadow" />
              <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" in="softShadow" />
            </filter>

            {/* Ambient Occlusion Gradients */}
            <linearGradient id="aoCeiling" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.65" />
              <stop offset="25%" stopColor="#000000" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#000000" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="aoLeftWall" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.6" />
              <stop offset="35%" stopColor="#000000" stopOpacity="0.25" />
              <stop offset="70%" stopColor="#000000" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="aoRightWall" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.6" />
              <stop offset="35%" stopColor="#000000" stopOpacity="0.25" />
              <stop offset="70%" stopColor="#000000" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="aoWallVertical" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.45" />
              <stop offset="15%" stopColor="#000000" stopOpacity="0.1" />
              <stop offset="85%" stopColor="#000000" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.5" />
            </linearGradient>

            {/* Per-Surface Finish Sheen Gradients */}
            <linearGradient id="specularSheen" x1="0.2" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
              <stop offset="30%" stopColor="#ffffff" stopOpacity="0.08" />
              <stop offset="70%" stopColor="#ffffff" stopOpacity="0.0" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
            </linearGradient>

            <linearGradient id="glossHighlight" x1="0.1" y1="0" x2="0.9" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
              <stop offset="20%" stopColor="#ffffff" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.0" />
              <stop offset="80%" stopColor="#ffffff" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.35" />
            </linearGradient>

            {/* Floor Light Bounce Reflection */}
            <linearGradient id="floorReflection" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
              <stop offset="40%" stopColor="#ffffff" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* Natural Sunlight Beam */}
            <linearGradient id="sunbeamRay" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff8e7" stopOpacity="0.35" />
              <stop offset="40%" stopColor="#fff2cc" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#ffe699" stopOpacity="0" />
            </linearGradient>

            {/* Window Skies */}
            <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="60%" stopColor="#93c5fd" />
              <stop offset="100%" stopColor="#dbeafe" />
            </linearGradient>

            <linearGradient id="exteriorSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0b1528" />
              <stop offset="50%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>

            {/* Hardwood Parquet Pattern */}
            <pattern id="hardwoodParquet" width="160" height="80" patternUnits="userSpaceOnUse">
              <rect width="160" height="80" fill="#2b1f18" />
              <rect x="0" y="0" width="78" height="38" fill="#3d2c22" stroke="#1f1510" strokeWidth="1" />
              <rect x="80" y="0" width="78" height="38" fill="#4a3529" stroke="#1f1510" strokeWidth="1" />
              <rect x="0" y="40" width="78" height="38" fill="#35261d" stroke="#1f1510" strokeWidth="1" />
              <rect x="80" y="40" width="78" height="38" fill="#422f25" stroke="#1f1510" strokeWidth="1" />
            </pattern>

            {/* Polished Marble Pattern */}
            <pattern id="polishedMarble" width="200" height="200" patternUnits="userSpaceOnUse">
              <rect width="200" height="200" fill="#1e2533" />
              <path d="M 0 50 Q 80 120 200 40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
              <path d="M 30 200 Q 120 90 170 0" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2" />
            </pattern>

            {/* Tufted Headboard Pattern */}
            <pattern id="tuftedPattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 60 30 L 30 60 L 0 30 Z" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
              <circle cx="30" cy="30" r="3" fill="#0f172a" opacity="0.6" />
            </pattern>

            {/* Cinematic Radial Vignette */}
            <radialGradient id="vignette" cx="50%" cy="50%" r="50%">
              <stop offset="60%" stopColor="#000000" stopOpacity="0" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.45" />
            </radialGradient>

            {/* Soft Glow */}
            <filter id="softGlowSpot" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ═══════════════════════════════════════════════════════════════════
              ROOM TYPE 1: MODERN LUXURY LIVING ROOM
             ═══════════════════════════════════════════════════════════════════ */}
          {roomType === 'living-room' && (
            <g id="scene-living-room">
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

              {/* Left Wall (Panoramic Window) */}
              <polygon
                points="0,0 150,115 150,515 0,650"
                fill={currentColorFor('mainWall')}
                className={getSurfaceClass('mainWall')}
                onClick={() => onSelectSurface('mainWall')}
                onMouseEnter={() => setHoveredSurface('mainWall')}
                onMouseLeave={() => setHoveredSurface(null)}
              />
              <polygon points="0,0 150,115 150,515 0,650" fill="url(#aoLeftWall)" pointerEvents="none" />

              {/* Window Sky View */}
              <polygon points="20,140 135,185 135,465 20,530" fill="url(#skyGradient)" />
              {/* Window Panes & Frame */}
              <polygon
                points="20,140 135,185 135,465 20,530"
                fill="none"
                stroke={currentColorFor('trim')}
                strokeWidth="10"
                className={getSurfaceClass('trim')}
                onClick={() => onSelectSurface('trim')}
              />
              <line x1="80" y1="162" x2="80" y2="495" stroke={currentColorFor('trim')} strokeWidth="4" />
              <line x1="20" y1="335" x2="135" y2="325" stroke={currentColorFor('trim')} strokeWidth="4" />
              {/* Glass reflection sheen */}
              <polygon points="25,145 75,165 75,485 25,520" fill="url(#specularSheen)" pointerEvents="none" opacity="0.4" />

              {/* Sunlight Beam Casting Across Floor */}
              <polygon points="135,325 820,650 350,650 135,465" fill="url(#sunbeamRay)" pointerEvents="none" style={{ mixBlendMode: 'screen' }} />

              {/* Right Feature Accent Wall */}
              <polygon
                points="1000,0 850,115 850,515 1000,650"
                fill={currentColorFor('accentWall')}
                className={getSurfaceClass('accentWall')}
                onClick={() => onSelectSurface('accentWall')}
                onMouseEnter={() => setHoveredSurface('accentWall')}
                onMouseLeave={() => setHoveredSurface(null)}
              />
              <polygon points="1000,0 850,115 850,515 1000,650" fill="url(#aoRightWall)" pointerEvents="none" />

              {/* Center Main Wall */}
              <polygon
                points="150,115 850,115 850,515 150,515"
                fill={currentColorFor('mainWall')}
                className={getSurfaceClass('mainWall')}
                onClick={() => onSelectSurface('mainWall')}
                onMouseEnter={() => setHoveredSurface('mainWall')}
                onMouseLeave={() => setHoveredSurface(null)}
              />
              {/* Vertical AO */}
              <polygon points="150,115 850,115 850,515 150,515" fill="url(#aoWallVertical)" pointerEvents="none" opacity="0.6" />
              {/* Plaster Texture */}
              <polygon points="150,115 850,115 850,515 150,515" fill={currentColorFor('mainWall')} filter="url(#wallGrain)" pointerEvents="none" opacity="0.14" style={{ mixBlendMode: 'overlay' }} />
              
              {/* Per-Surface Finish Sheen */}
              {(finish === 'silk' || finish === 'gloss') && (
                <polygon points="150,115 850,115 850,515 150,515" fill={finish === 'gloss' ? 'url(#glossHighlight)' : 'url(#specularSheen)'} pointerEvents="none" />
              )}

              {/* Floor (Hardwood Parquet) */}
              <polygon points="0,650 150,515 850,515 1000,650" fill="url(#hardwoodParquet)" />
              <polygon points="0,650 150,515 850,515 1000,650" fill="url(#hardwoodParquet)" filter="url(#woodGrain)" pointerEvents="none" opacity="0.35" style={{ mixBlendMode: 'overlay' }} />
              {/* Floor reflection bounce */}
              <polygon points="150,515 850,515 890,555 110,555" fill="url(#floorReflection)" pointerEvents="none" style={{ mixBlendMode: 'screen' }} />

              {/* Architectural Trims */}
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

              {/* Modern Credenza (Main Wall) */}
              <g id="credenza" filter="url(#furnitureShadow)">
                <rect x="300" y="380" width="400" height="85" rx="6" fill="#171e2e" stroke="#c9a84c" strokeWidth="1.5" />
                <line x1="433" y1="380" x2="433" y2="465" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                <line x1="566" y1="380" x2="566" y2="465" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                <circle cx="420" cy="422" r="3" fill="#c9a84c" />
                <circle cx="553" cy="422" r="3" fill="#c9a84c" />
              </g>

              {/* Framed Wall Art */}
              <g id="wall-art" filter="url(#furnitureShadow)">
                <rect x="375" y="170" width="250" height="150" fill={currentColorFor('accentWall')} stroke="#c9a84c" strokeWidth="4" rx="3" />
                <circle cx="500" cy="245" r="35" fill="none" stroke="#f0d898" strokeWidth="2" opacity="0.6" />
                <line x1="420" y1="270" x2="580" y2="270" stroke="#f0d898" strokeWidth="1.5" opacity="0.6" />
              </g>

              {/* Sectional Luxury Sofa */}
              <g id="furniture-sofa" filter="url(#furnitureShadow)">
                <polygon
                  points="260,490 740,490 820,620 180,620"
                  fill={currentColorFor('accents')}
                  className={getSurfaceClass('accents')}
                  onClick={() => onSelectSurface('accents')}
                  onMouseEnter={() => setHoveredSurface('accents')}
                  onMouseLeave={() => setHoveredSurface(null)}
                />
                {/* Backrest */}
                <rect x="250" y="445" width="500" height="55" rx="10" fill={currentColorFor('accents')} stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
                {/* Velvet Throw Pillows */}
                <rect x="290" y="450" width="55" height="50" rx="8" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
                <rect x="655" y="450" width="55" height="50" rx="8" fill="#c9a84c" stroke="#b08d38" strokeWidth="1" />
              </g>

              {/* Round Coffee Table */}
              <g id="coffee-table" filter="url(#furnitureShadow)">
                <ellipse cx="500" cy="565" rx="100" ry="40" fill="#ffffff" stroke="#c9a84c" strokeWidth="3" />
                <ellipse cx="500" cy="565" rx="90" ry="34" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
              </g>

              {/* Fiddle Leaf Fig Plant */}
              <g id="indoor-plant">
                <ellipse cx="160" cy="570" rx="35" ry="12" fill="#000000" opacity="0.3" filter="url(#contactShadow)" />
                <polygon points="140,540 180,540 172,590 148,590" fill="#18202f" stroke="#c9a84c" strokeWidth="1.5" />
                <path d="M 160 540 Q 120 440 95 405 Q 145 425 160 540" fill="#2d6a4f" />
                <path d="M 160 540 Q 195 420 205 375 Q 170 420 160 540" fill="#1b4332" />
                <path d="M 160 540 Q 140 390 155 330 Q 180 400 160 540" fill="#40916c" />
                <path d="M 160 540 Q 175 450 185 410 Q 155 450 160 540" fill="#52b788" />
              </g>
            </g>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              ROOM TYPE 2: MASTER BEDROOM SUITE
             ═══════════════════════════════════════════════════════════════════ */}
          {roomType === 'master-bedroom' && (
            <g id="scene-master-bedroom">
              {/* Ceiling */}
              <polygon points="0,0 1000,0 850,115 150,115" fill={currentColorFor('ceiling')} className={getSurfaceClass('ceiling')} onClick={() => onSelectSurface('ceiling')} />
              <polygon points="0,0 1000,0 850,115 150,115" fill="url(#aoCeiling)" pointerEvents="none" />

              {/* Left Wall */}
              <polygon points="0,0 150,115 150,515 0,650" fill={currentColorFor('mainWall')} className={getSurfaceClass('mainWall')} onClick={() => onSelectSurface('mainWall')} />
              <polygon points="0,0 150,115 150,515 0,650" fill="url(#aoLeftWall)" pointerEvents="none" />

              {/* Right Wall */}
              <polygon points="1000,0 850,115 850,515 1000,650" fill={currentColorFor('mainWall')} className={getSurfaceClass('mainWall')} onClick={() => onSelectSurface('mainWall')} />
              <polygon points="1000,0 850,115 850,515 1000,650" fill="url(#aoRightWall)" pointerEvents="none" />

              {/* Center Feature Wall */}
              <polygon points="150,115 850,115 850,515 150,515" fill={currentColorFor('accentWall')} className={getSurfaceClass('accentWall')} onClick={() => onSelectSurface('accentWall')} />
              <polygon points="150,115 850,115 850,515 150,515" fill="url(#aoWallVertical)" pointerEvents="none" opacity="0.7" />
              <polygon points="150,115 850,115 850,515 150,515" fill={currentColorFor('accentWall')} filter="url(#wallGrain)" pointerEvents="none" opacity="0.15" style={{ mixBlendMode: 'overlay' }} />

              {/* Floor */}
              <polygon points="0,650 150,515 850,515 1000,650" fill="url(#hardwoodParquet)" />
              <polygon points="0,650 150,515 850,515 1000,650" fill="url(#hardwoodParquet)" filter="url(#woodGrain)" pointerEvents="none" opacity="0.35" style={{ mixBlendMode: 'overlay' }} />

              {/* Trims */}
              <polyline points="0,0 150,115 850,115 1000,0" fill="none" stroke={currentColorFor('trim')} strokeWidth="10" className={getSurfaceClass('trim')} onClick={() => onSelectSurface('trim')} />
              <polyline points="0,650 150,515 850,515 1000,650" fill="none" stroke={currentColorFor('trim')} strokeWidth="12" className={getSurfaceClass('trim')} onClick={() => onSelectSurface('trim')} />

              {/* Tufted Headboard Panel */}
              <rect x="240" y="240" width="520" height="210" rx="18" fill="#161c2c" stroke={currentColorFor('accents')} strokeWidth="4" className={getSurfaceClass('accents')} onClick={() => onSelectSurface('accents')} filter="url(#furnitureShadow)" />
              <rect x="240" y="240" width="520" height="210" rx="18" fill="url(#tuftedPattern)" pointerEvents="none" />

              {/* Platform Bed with Duvet */}
              <polygon points="220,420 780,420 850,590 150,590" fill="#242c44" filter="url(#furnitureShadow)" />
              <polygon points="230,470 770,470 840,590 160,590" fill={currentColorFor('accents')} className={getSurfaceClass('accents')} onClick={() => onSelectSurface('accents')} />

              {/* Pillows */}
              <rect x="270" y="370" width="110" height="65" rx="12" fill="#fafaf9" stroke="#e2e8f0" strokeWidth="2" />
              <rect x="400" y="370" width="110" height="65" rx="12" fill="#fafaf9" stroke="#e2e8f0" strokeWidth="2" />
              <rect x="530" y="370" width="110" height="65" rx="12" fill="#fafaf9" stroke="#e2e8f0" strokeWidth="2" />
              <rect x="340" y="400" width="70" height="50" rx="8" fill={currentColorFor('accents')} opacity="0.9" />
              <rect x="500" y="400" width="70" height="50" rx="8" fill={currentColorFor('accents')} opacity="0.9" />

              {/* Nightstands */}
              <rect x="160" y="430" width="75" height="35" rx="5" fill="#1a1410" stroke="#c9a84c" strokeWidth="1.5" filter="url(#furnitureShadow)" />
              <rect x="765" y="430" width="75" height="35" rx="5" fill="#1a1410" stroke="#c9a84c" strokeWidth="1.5" filter="url(#furnitureShadow)" />

              {/* Brass Pendant Lamps */}
              <g id="bedside-pendants">
                <line x1="195" y1="115" x2="195" y2="330" stroke="#c9a84c" strokeWidth="2" />
                <circle cx="195" cy="340" r="14" fill="#fffbe8" stroke="#c9a84c" strokeWidth="3" filter="url(#softGlowSpot)" />
                <line x1="800" y1="115" x2="800" y2="330" stroke="#c9a84c" strokeWidth="2" />
                <circle cx="800" cy="340" r="14" fill="#fffbe8" stroke="#c9a84c" strokeWidth="3" filter="url(#softGlowSpot)" />
              </g>
            </g>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              ROOM TYPE 3: DINING & KITCHEN AREA
             ═══════════════════════════════════════════════════════════════════ */}
          {roomType === 'dining-kitchen' && (
            <g id="scene-dining-kitchen">
              {/* Ceiling & Walls */}
              <polygon points="0,0 1000,0 840,110 160,110" fill={currentColorFor('ceiling')} className={getSurfaceClass('ceiling')} onClick={() => onSelectSurface('ceiling')} />
              <polygon points="0,0 160,110 160,515 0,650" fill={currentColorFor('mainWall')} className={getSurfaceClass('mainWall')} onClick={() => onSelectSurface('mainWall')} />
              <polygon points="1000,0 840,110 840,515 1000,650" fill={currentColorFor('mainWall')} className={getSurfaceClass('mainWall')} onClick={() => onSelectSurface('mainWall')} />
              
              {/* Accent Backsplash Wall */}
              <polygon points="160,110 840,110 840,515 160,515" fill={currentColorFor('accentWall')} className={getSurfaceClass('accentWall')} onClick={() => onSelectSurface('accentWall')} />
              
              {/* Marble Floor */}
              <polygon points="0,650 160,515 840,515 1000,650" fill="url(#polishedMarble)" />

              {/* Upper Cabinetry */}
              <g id="kitchen-upper-cabinets" filter="url(#furnitureShadow)">
                <rect x="200" y="130" width="600" height="90" rx="4" fill="#0d1424" stroke="#c9a84c" strokeWidth="1.5" />
                <rect x="200" y="218" width="600" height="4" fill="#fff5cc" filter="url(#softGlowSpot)" />
              </g>

              {/* Marble Backsplash */}
              <rect x="200" y="222" width="600" height="120" fill="#1a2233" stroke="rgba(255,255,255,0.1)" />
              <rect x="200" y="222" width="600" height="120" fill="#1a2233" filter="url(#marbleVein)" pointerEvents="none" opacity="0.3" style={{ mixBlendMode: 'overlay' }} />

              {/* Quartz Island Counter */}
              <polygon points="240,410 760,410 840,550 160,550" fill="#f8fafc" stroke="#c9a84c" strokeWidth="3" filter="url(#furnitureShadow)" />
              <polygon points="160,550 240,410 240,520 160,610" fill="#cbd5e1" />
              <polygon points="760,410 840,550 840,610 760,520" fill="#94a3b8" />

              {/* Barstools */}
              <g id="kitchen-barstools">
                <rect x="300" y="350" width="70" height="80" rx="10" fill={currentColorFor('accents')} className={getSurfaceClass('accents')} onClick={() => onSelectSurface('accents')} filter="url(#furnitureShadow)" />
                <rect x="465" y="350" width="70" height="80" rx="10" fill={currentColorFor('accents')} className={getSurfaceClass('accents')} onClick={() => onSelectSurface('accents')} filter="url(#furnitureShadow)" />
                <rect x="630" y="350" width="70" height="80" rx="10" fill={currentColorFor('accents')} className={getSurfaceClass('accents')} onClick={() => onSelectSurface('accents')} filter="url(#furnitureShadow)" />
              </g>

              {/* Dome Pendants */}
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
              {/* Sky */}
              <rect x="0" y="0" width="1000" height="650" fill="url(#exteriorSky)" />

              {/* Roof */}
              <polygon points="100,80 900,80 960,135 40,135" fill={currentColorFor('ceiling')} className={getSurfaceClass('ceiling')} onClick={() => onSelectSurface('ceiling')} />
              <line x1="40" y1="135" x2="960" y2="135" stroke={currentColorFor('trim')} strokeWidth="10" />

              {/* Main Building Mass */}
              <rect x="120" y="135" width="760" height="430" fill={currentColorFor('mainWall')} className={getSurfaceClass('mainWall')} onClick={() => onSelectSurface('mainWall')} />
              <rect x="120" y="135" width="760" height="430" fill={currentColorFor('mainWall')} filter="url(#plasterTexture)" pointerEvents="none" opacity="0.1" style={{ mixBlendMode: 'overlay' }} />

              {/* Stone Accent Tower */}
              <rect x="430" y="135" width="180" height="430" fill={currentColorFor('accentWall')} className={getSurfaceClass('accentWall')} onClick={() => onSelectSurface('accentWall')} filter="url(#furnitureShadow)" />

              {/* Ground Forecourt */}
              <rect x="0" y="565" width="1000" height="85" fill="#111827" />
              <line x1="0" y1="565" x2="1000" y2="565" stroke={currentColorFor('trim')} strokeWidth="12" />

              {/* Windows */}
              <rect x="180" y="190" width="190" height="125" fill="#070f1e" stroke={currentColorFor('trim')} strokeWidth="10" className={getSurfaceClass('trim')} onClick={() => onSelectSurface('trim')} />
              <rect x="650" y="190" width="190" height="125" fill="#070f1e" stroke={currentColorFor('trim')} strokeWidth="10" className={getSurfaceClass('trim')} onClick={() => onSelectSurface('trim')} />

              {/* Front Pivot Door */}
              <rect x="465" y="355" width="110" height="210" fill="#17120e" stroke={currentColorFor('accents')} strokeWidth="6" className={getSurfaceClass('accents')} onClick={() => onSelectSurface('accents')} />
              <line x1="555" y1="420" x2="555" y2="500" stroke="#f0d898" strokeWidth="6" strokeLinecap="round" />

              {/* Sconces */}
              <circle cx="410" cy="380" r="11" fill="#fff4cc" filter="url(#softGlowSpot)" />
              <circle cx="630" cy="380" r="11" fill="#fff4cc" filter="url(#softGlowSpot)" />
            </g>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              ROOM TYPE 5: LUXURY BATHROOM SUITE
             ═══════════════════════════════════════════════════════════════════ */}
          {roomType === 'bathroom' && (
            <g id="scene-bathroom">
              {/* Ceiling & Walls */}
              <polygon points="0,0 1000,0 840,110 160,110" fill={currentColorFor('ceiling')} className={getSurfaceClass('ceiling')} onClick={() => onSelectSurface('ceiling')} />
              <polygon points="0,0 160,110 160,515 0,650" fill={currentColorFor('mainWall')} className={getSurfaceClass('mainWall')} onClick={() => onSelectSurface('mainWall')} />
              <polygon points="1000,0 840,110 840,515 1000,650" fill={currentColorFor('mainWall')} className={getSurfaceClass('mainWall')} onClick={() => onSelectSurface('mainWall')} />
              
              {/* Feature Wall */}
              <polygon points="160,110 840,110 840,515 160,515" fill={currentColorFor('accentWall')} className={getSurfaceClass('accentWall')} onClick={() => onSelectSurface('accentWall')} />
              
              {/* Floor */}
              <polygon points="0,650 160,515 840,515 1000,650" fill="url(#polishedMarble)" />

              {/* Backlit Halo Mirror */}
              <circle cx="500" cy="260" r="100" fill="none" stroke="#ffffff" strokeWidth="8" filter="url(#softGlowSpot)" />
              <circle cx="500" cy="260" r="95" fill="#0d1424" stroke={currentColorFor('accents')} strokeWidth="4" />

              {/* Vanity & Basin */}
              <g id="bathroom-vanity" filter="url(#furnitureShadow)">
                <rect x="330" y="410" width="340" height="70" rx="8" fill="#182030" stroke="rgba(255,255,255,0.15)" />
                <ellipse cx="500" cy="405" rx="85" ry="26" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="3" />
                <path d="M 500 360 L 500 330 Q 500 310 515 310 L 525 315" fill="none" stroke={currentColorFor('accents')} strokeWidth="7" strokeLinecap="round" />
              </g>

              {/* Freestanding Soaking Tub */}
              <g id="freestanding-tub" filter="url(#furnitureShadow)">
                <ellipse cx="220" cy="505" rx="90" ry="38" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="4" />
                <path d="M 130 505 C 130 575 310 575 310 505" fill="#e2e8f0" />
                <ellipse cx="220" cy="505" rx="72" ry="26" fill="#0284c7" opacity="0.3" />
              </g>
            </g>
          )}

          {/* Global Cinematic Vignette */}
          <rect x="0" y="0" width="1000" height="650" fill="url(#vignette)" pointerEvents="none" />
        </svg>
      </div>

      {/* Floating Surface Hover HUD chip */}
      <AnimatePresence>
        {hoveredSurface && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 px-5 py-2.5 rounded-full bg-[#070b14]/95 backdrop-blur-xl border border-white/20 text-white text-xs font-semibold shadow-2xl flex items-center gap-3 pointer-events-none"
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
  );
}
