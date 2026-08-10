import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Sofa,
  BedDouble,
  Utensils,
  Home,
  Bath,
  Phone,
  MessageCircle,
  ShieldCheck,
  Award,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { usePageMeta } from '../utils/usePageMeta';
import { openWhatsApp } from '../utils/whatsapp';
import RoomCanvas from '../components/showroom/RoomCanvas';
import ColorStudio from '../components/showroom/ColorStudio';
import PaintCalculatorModal from '../components/showroom/PaintCalculatorModal';
import {
  ROOM_TYPES,
  DESIGNER_HARMONIES,
  SANDTEX_PALETTE,
  type RoomTypeId,
  type SurfaceKey,
  type LightingMode,
  type FinishType,
  type ColorHarmony,
} from '../data/showroomData';

export default function ShowroomPage() {
  usePageMeta({
    title: 'Digital Showroom & Room Visualizer | Test Sandtex Paints & Colors',
    description:
      "Select, test, and visualize Sandtex paint colors in your living room, bedroom, kitchen, exterior facade, and bathroom in Micmag's interactive 3D digital showroom.",
    ogTitle: 'Micmag Digital Showroom — Interactive Room Color Visualizer',
  });

  // Active room state
  const [activeRoomId, setActiveRoomId] = useState<RoomTypeId>('living-room');
  const activeRoom = ROOM_TYPES.find((r) => r.id === activeRoomId) || ROOM_TYPES[0];

  // Room surface colors
  const [colors, setColors] = useState<Record<SurfaceKey, string>>(activeRoom.defaultColors);
  const [activeSurface, setActiveSurface] = useState<SurfaceKey>('mainWall');

  // Lighting and Finish modes
  const [lighting, setLighting] = useState<LightingMode>('daylight');
  const [finish, setFinish] = useState<FinishType>('matt');

  // Calculator modal state
  const [isCalcOpen, setIsCalcOpen] = useState(false);

  // Switch Room Type
  const handleRoomChange = (roomId: RoomTypeId) => {
    setActiveRoomId(roomId);
    const room = ROOM_TYPES.find((r) => r.id === roomId);
    if (room) {
      setColors(room.defaultColors);
    }
  };

  // Apply single color to active surface
  const handleApplyColor = (surface: SurfaceKey, hex: string) => {
    setColors((prev) => ({
      ...prev,
      [surface]: hex,
    }));
  };

  // Apply full designer harmony (60-30-10)
  const handleApplyHarmony = (harmony: ColorHarmony) => {
    setColors({
      mainWall: harmony.mainWall,
      accentWall: harmony.accentWall,
      ceiling: harmony.ceiling,
      trim: harmony.trim,
      accents: harmony.accents,
    });
  };

  // Reset to room defaults
  const handleReset = () => {
    setColors(activeRoom.defaultColors);
  };

  // Randomize / Inspire
  const handleRandomize = () => {
    const randomHarmony = DESIGNER_HARMONIES[Math.floor(Math.random() * DESIGNER_HARMONIES.length)];
    handleApplyHarmony(randomHarmony);
  };

  // Active swatch name for calculator
  const activeSwatchName =
    SANDTEX_PALETTE.find((s) => s.hex.toLowerCase() === colors[activeSurface].toLowerCase())?.name ||
    'Custom Mixed Shade';

  return (
    <div className="min-h-screen bg-[#070c18] text-white pt-24 pb-20 selection:bg-amber-500/20 selection:text-amber-300 font-sans">
      {/* ── Top Hero & Intro ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center sm:text-left">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-3">
              <Sparkles size={13} />
              Interactive Digital Showroom
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Test Colors & Finishes in Your Space
            </h1>
            <p className="text-sm sm:text-base text-white/60 mt-2 max-w-2xl leading-relaxed">
              Experience authentic Sandtex paints and Caplux prep systems. Click any wall, trim, or ceiling surface to
              test colors, try designer palettes, and preview lighting.
            </p>
          </div>

          {/* Quick CTA button */}
          <div className="flex items-center gap-3 self-center sm:self-start lg:self-end">
            <button
              onClick={() =>
                openWhatsApp(
                  '2347052940445',
                  `Hi Micmag! I am testing colors in the Digital Showroom and would like to request a free physical color chart or on-site paint consultation.`
                )
              }
              className="flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #c9a84c 0%, #966e25 100%)' }}
            >
              <MessageCircle size={15} /> Request Free Color Chart
            </button>
          </div>
        </div>

        {/* ── Room Type Navigation Pills ── */}
        <div className="flex items-center gap-2.5 overflow-x-auto pt-6 pb-2 no-scrollbar">
          {ROOM_TYPES.map((room) => {
            const isSelected = activeRoomId === room.id;
            const Icon =
              room.id === 'living-room'
                ? Sofa
                : room.id === 'master-bedroom'
                ? BedDouble
                : room.id === 'dining-kitchen'
                ? Utensils
                : room.id === 'exterior-facade'
                ? Home
                : Bath;

            return (
              <button
                key={room.id}
                onClick={() => handleRoomChange(room.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border text-xs font-bold tracking-wide transition-all flex-shrink-0 ${
                  isSelected
                    ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/20 scale-[1.02]'
                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={16} />
                <span>{room.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Main Visualizer & Color Studio Workspace ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Main Column: Room Canvas */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            <RoomCanvas
              roomType={activeRoomId}
              colors={colors}
              activeSurface={activeSurface}
              onSelectSurface={setActiveSurface}
              lighting={lighting}
              onLightingChange={setLighting}
              finish={finish}
              onFinishChange={setFinish}
              onReset={handleReset}
              onRandomize={handleRandomize}
            />

            {/* Room Info & Tips */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/70">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
                  <Sparkles size={14} />
                </span>
                <span>
                  <strong>Tip:</strong> Click directly on any surface in the room above or select tabs in the color studio to paint.
                </span>
              </div>
              <button
                onClick={() => setIsCalcOpen(true)}
                className="text-amber-300 font-bold hover:underline flex-shrink-0"
              >
                Calculate Paint Needed →
              </button>
            </div>
          </div>

          {/* Right Column: Color Studio, Swatches & Mixer */}
          <div className="lg:col-span-5 xl:col-span-4 min-h-[580px] h-full">
            <ColorStudio
              activeSurface={activeSurface}
              onSelectSurface={setActiveSurface}
              colors={colors}
              onApplyColor={handleApplyColor}
              onApplyHarmony={handleApplyHarmony}
              roomName={activeRoom.name}
              onOpenCalculator={() => setIsCalcOpen(true)}
            />
          </div>
        </div>
      </section>

      {/* ── 3-Step Professional Painting Process ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
            The Micmag Quality Standard
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-white font-bold">
            The 3-Step Surface System for 10+ Year Durability
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden">
            <div className="text-3xl font-serif font-bold text-amber-400/40 mb-3">01</div>
            <h3 className="text-base font-bold text-white mb-2">Preparation & Priming</h3>
            <p className="text-xs text-white/60 leading-relaxed mb-4">
              Apply <strong>Caplux Alkali Resisting Primer</strong> or <strong>Plaster Primer</strong> to seal porous walls and eliminate efflorescence salts.
            </p>
            <span className="text-[11px] font-mono text-amber-300">Caplux Surface Systems</span>
          </div>

          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden">
            <div className="text-3xl font-serif font-bold text-amber-400/40 mb-3">02</div>
            <h3 className="text-base font-bold text-white mb-2">Screeding & Leveling</h3>
            <p className="text-xs text-white/60 leading-relaxed mb-4">
              Smooth surface imperfections using <strong>Caplux Screeding Filler</strong> for glass-smooth, crack-free finish before topcoats.
            </p>
            <span className="text-[11px] font-mono text-amber-300">Caplux Screeding System</span>
          </div>

          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden">
            <div className="text-3xl font-serif font-bold text-amber-400/40 mb-3">03</div>
            <h3 className="text-base font-bold text-white mb-2">Sandtex Luxury Topcoats</h3>
            <p className="text-xs text-white/60 leading-relaxed mb-4">
              Apply 2 coats of <strong>Sandtex Matt</strong>, <strong>Silk Vinyl</strong>, or <strong>FineBuild</strong> for vibrant, washable, long-lasting color.
            </p>
            <span className="text-[11px] font-mono text-amber-300">Sandtex Premium Paints</span>
          </div>
        </div>
      </section>

      {/* ── Consultation CTA Banner ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div
          className="rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden border border-amber-500/30"
          style={{
            background: 'linear-gradient(135deg, #101c38 0%, #0d1526 50%, #1a0808 100%)',
          }}
        >
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="font-serif text-2xl sm:text-4xl text-white font-bold">
              Need Professional Painting & On-Site Color Matching?
            </h2>
            <p className="text-sm text-white/70 leading-relaxed">
              Our certified paint specialists visit your residential or commercial site in Lagos and nationwide.
              We provide free surface diagnosis, exact paint estimation, and physical color swatches.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href="https://wa.me/2347052940445?text=Hi%20Micmag!%20I%20tested%20colors%20on%20your%20Digital%20Showroom%20and%20would%20like%20to%20book%20a%20site%20visit."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest text-white shadow-xl transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)' }}
              >
                <MessageCircle size={16} /> Book Site Visit on WhatsApp
              </a>
              <a
                href="tel:+2347052940445"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest border border-white/20 text-white hover:bg-white/10 transition-all"
              >
                <Phone size={16} /> Call +234 705 294 0445
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Paint Calculator Modal ── */}
      <PaintCalculatorModal
        isOpen={isCalcOpen}
        onClose={() => setIsCalcOpen(false)}
        selectedColorName={activeSwatchName}
        roomName={activeRoom.name}
      />
    </div>
  );
}
