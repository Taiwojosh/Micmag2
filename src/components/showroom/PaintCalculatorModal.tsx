import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calculator, MessageCircle, Sparkles, Check, ArrowRight } from 'lucide-react';
import { openWhatsApp } from '../../utils/whatsapp';

interface PaintCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedColorName: string;
  roomName: string;
}

export default function PaintCalculatorModal({
  isOpen,
  onClose,
  selectedColorName,
  roomName,
}: PaintCalculatorModalProps) {
  // Inputs (in meters)
  const [length, setLength] = useState<number>(5);
  const [width, setWidth] = useState<number>(4);
  const [height, setHeight] = useState<number>(3);
  const [doors, setDoors] = useState<number>(1);
  const [windows, setWindows] = useState<number>(2);
  const [coats, setCoats] = useState<number>(2);

  // Calculations
  // Total wall perimeter * height
  const grossWallArea = 2 * (length + width) * height;
  const openingsArea = doors * 1.8 + windows * 1.5; // ~1.8m2 per door, ~1.5m2 per window
  const netWallArea = Math.max(10, Math.round(grossWallArea - openingsArea));

  // Coverage: Sandtex delivers ~11 m2 per liter per coat
  const COVERAGE_PER_LITER = 11;
  const litersNeeded = Math.ceil((netWallArea * coats) / COVERAGE_PER_LITER);
  const buckets4L = Math.ceil(litersNeeded / 4);
  const drums20L = Math.floor(litersNeeded / 20);
  const remaining4L = Math.ceil((litersNeeded % 20) / 4);

  const handleWhatsAppOrder = () => {
    const text =
      `📐 *Micmag Paint Yield & Estimation Request*\n\n` +
      `• *Room:* ${roomName}\n` +
      `• *Selected Color:* ${selectedColorName}\n` +
      `• *Room Dimensions:* ${length}m × ${width}m × ${height}m (Net Area: ~${netWallArea} m²)\n` +
      `• *Coats Planned:* ${coats} Coats\n` +
      `• *Estimated Sandtex Paint:* ~${litersNeeded} Litres (${drums20L > 0 ? `${drums20L} × 20L Drum + ` : ''}${remaining4L} × 4L Buckets)\n` +
      `• *Recommended Prep:* Caplux Alkali Resisting Primer\n\n` +
      `Could you please verify the stock and send an official invoice/quote?`;

    openWhatsApp('2347052940445', text);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 20, opacity: 0 }}
          className="relative w-full max-w-lg bg-[#0d1629] border border-white/15 rounded-3xl overflow-hidden shadow-2xl z-10 text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#09101f]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Calculator size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold font-serif text-white">Paint Yield & Area Calculator</h3>
                <p className="text-xs text-white/50">{roomName} • {selectedColorName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form Body */}
          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto no-scrollbar">
            {/* Dimensions Inputs */}
            <div>
              <label className="text-xs font-semibold text-white/70 uppercase tracking-wider block mb-3">
                Room Dimensions (Meters)
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] text-white/40 block mb-1">Length (m)</span>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    step="0.5"
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-sm font-semibold text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-white/40 block mb-1">Width (m)</span>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    step="0.5"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-sm font-semibold text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-white/40 block mb-1">Height (m)</span>
                  <input
                    type="number"
                    min="2"
                    max="10"
                    step="0.2"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-sm font-semibold text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Deductions: Doors & Windows */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <span className="text-[11px] text-white/60 block mb-1">Doors (count)</span>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={doors}
                  onChange={(e) => setDoors(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-sm font-semibold text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <span className="text-[11px] text-white/60 block mb-1">Windows (count)</span>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={windows}
                  onChange={(e) => setWindows(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-sm font-semibold text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Coats */}
            <div>
              <span className="text-[11px] text-white/60 block mb-1.5">Number of Coats</span>
              <div className="flex gap-2">
                {[1, 2, 3].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCoats(c)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      coats === c
                        ? 'bg-amber-500 text-black shadow-md'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {c} {c === 1 ? 'Coat' : 'Coats'} {c === 2 && '★ (Standard)'}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Calculation Summary Box ── */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-amber-200/80">Net Paintable Wall Area:</span>
                <span className="text-sm font-bold text-white font-mono">{netWallArea} m²</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-amber-500/20">
                <span className="text-xs text-amber-200/80">Required Sandtex Paint:</span>
                <span className="text-lg font-black text-amber-300 font-mono">~{litersNeeded} Litres</span>
              </div>

              <div className="text-[11px] text-white/60 pt-1">
                Suggested Packaging: <strong className="text-white">
                  {drums20L > 0 ? `${drums20L} × 20L Drum + ` : ''}
                  {remaining4L} × 4L Bucket{remaining4L !== 1 ? 's' : ''}
                </strong>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-5 bg-[#09101f] border-t border-white/10">
            <button
              onClick={handleWhatsAppOrder}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest text-white shadow-lg transition-all hover:brightness-110"
              style={{ background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)' }}
            >
              <MessageCircle size={16} />
              Send Estimate to Micmag WhatsApp
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
