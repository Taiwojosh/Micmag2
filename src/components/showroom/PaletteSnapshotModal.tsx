import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, MessageCircle, Sparkles, Check, Printer } from 'lucide-react';
import { SURFACES, type SurfaceKey, type RoomType, type LightingMode, type FinishType } from '../../data/showroomData';
import { findClosestSandtexColor } from '../../utils/colorTheory';
import { openWhatsApp } from '../../utils/whatsapp';

interface PaletteSnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: RoomType;
  colors: Record<SurfaceKey, string>;
  lighting: LightingMode;
  finish: FinishType;
}

export default function PaletteSnapshotModal({
  isOpen,
  onClose,
  room,
  colors,
  lighting,
  finish,
}: PaletteSnapshotModalProps) {
  if (!isOpen) return null;

  const handleWhatsAppShare = () => {
    const lines = SURFACES.map((s) => {
      const swatch = findClosestSandtexColor(colors[s.key]);
      return `• ${s.label}: ${swatch.name} (${swatch.code} | ${colors[s.key]}) - ${s.recommendedFinish}`;
    });

    const text =
      `🎨 *Micmag Official Digital Showroom — Custom Specification Card*\n\n` +
      `🏛️ *Space:* ${room.name}\n` +
      `☀️ *Lighting:* ${lighting.toUpperCase()}\n` +
      `✨ *Finish:* ${finish.toUpperCase()}\n\n` +
      `*Color Palette Specification:*\n` +
      lines.join('\n') +
      `\n\n*Recommended Prep:* Caplux Alkali Resisting Primer & Screeding Filler\n\n` +
      `Please provide an official supply quotation and schedule on-site measurement.`;

    openWhatsApp('2347052940445', text);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Sheet */}
        <motion.div
          initial={{ scale: 0.92, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.92, y: 20, opacity: 0 }}
          className="relative w-full max-w-2xl bg-[#0d1629] border border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl z-10 text-white my-8"
        >
          {/* Top Gold Accent Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#09101f] border-b border-white/10">
            <div className="flex items-center gap-3">
              <img src="./Logo.png" alt="Micmag" className="h-9 w-auto" />
              <div>
                <h3 className="text-base font-serif font-bold text-white tracking-wide">
                  Architectural Paint Specification Card
                </h3>
                <p className="text-xs text-amber-400/90 font-mono">Micmag Homes & Fittings • Sandtex Systems</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Printable Spec Card Area */}
          <div className="p-6 space-y-6 bg-[#0a1122]">
            {/* Meta header */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div>
                <span className="text-[10px] uppercase font-bold text-white/50 tracking-widest block">
                  Project Space
                </span>
                <h4 className="text-lg font-bold text-white font-serif">{room.name}</h4>
                <p className="text-xs text-white/60">{room.subtitle}</p>
              </div>
              <div className="flex gap-4 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-white/40 block">LIGHTING</span>
                  <span className="font-bold text-amber-300 capitalize">{lighting} Mode</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/40 block">FINISH</span>
                  <span className="font-bold text-amber-300 capitalize">{finish} Sheen</span>
                </div>
              </div>
            </div>

            {/* 5 Surface Swatch Blocks */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-white/60 uppercase tracking-widest block">
                Formulated Surface Recipe (60-30-10)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SURFACES.map((surf) => {
                  const hex = colors[surf.key];
                  const swatch = findClosestSandtexColor(hex);
                  return (
                    <div
                      key={surf.key}
                      className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#0d1629] border border-white/10 shadow-sm"
                    >
                      {/* Swatch chip */}
                      <div
                        className="w-12 h-12 rounded-xl flex-shrink-0 border border-white/20 shadow-md flex items-center justify-center text-white"
                        style={{ backgroundColor: hex }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                            {surf.label}
                          </span>
                          <span className="text-[10px] font-mono text-white/40">{swatch.code}</span>
                        </div>
                        <h5 className="text-xs font-bold text-white truncate">{swatch.name}</h5>
                        <p className="text-[10px] text-white/50 font-mono truncate">{hex.toUpperCase()} • {surf.recommendedFinish}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Prep & Application Recommendation */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <Sparkles size={14} />
                <span>Certified Application Guarantee</span>
              </div>
              <p className="text-white/70 leading-relaxed text-[11.5px]">
                To guarantee 10+ year fade-resistance and zero paint flaking, Micmag certifies the use of{' '}
                <strong>Caplux Alkali Resisting Primer</strong> on raw plaster prior to applying 2 coats of{' '}
                <strong>Sandtex Topcoats</strong>.
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center gap-3 p-5 bg-[#09101f] border-t border-white/10">
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold uppercase tracking-wider text-white transition-all"
            >
              <Printer size={15} />
              Print / Save Spec Card
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="w-full flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest text-white shadow-lg transition-all hover:brightness-110"
              style={{ background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)' }}
            >
              <MessageCircle size={16} />
              Send Spec Card to Micmag WhatsApp
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
