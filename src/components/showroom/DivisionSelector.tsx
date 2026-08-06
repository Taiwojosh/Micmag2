import React from 'react';
import { motion } from 'motion/react';
import { Paintbrush2, Layers3, Bath } from 'lucide-react';

export type Division = 'sandtex' | 'caplux' | 'bathroom';

interface DivisionSelectorProps {
  active: Division;
  onChange: (div: Division) => void;
}

const DIVISIONS: {
  id: Division;
  label: string;
  subtitle: string;
  icon: React.ElementType;
  count: number;
  gradient: string;
  accent: string;
  textAccent: string;
  bg: string;
}[] = [
  {
    id: 'sandtex',
    label: 'Paint Studio',
    subtitle: 'Sandtex Premium Paints',
    icon: Paintbrush2,
    count: 7,
    gradient: 'linear-gradient(135deg, #ea6c00 0%, #b45309 50%, #78350f 100%)',
    accent: '#ea6c00',
    textAccent: '#fde68a',
    bg: 'rgba(234,108,0,0.08)',
  },
  {
    id: 'caplux',
    label: 'Prep Lab',
    subtitle: 'Caplux Surface Systems',
    icon: Layers3,
    count: 7,
    gradient: 'linear-gradient(135deg, #1a2c5b 0%, #253d7a 50%, #0d1a3a 100%)',
    accent: '#3b82f6',
    textAccent: '#93c5fd',
    bg: 'rgba(59,130,246,0.08)',
  },
  {
    id: 'bathroom',
    label: 'Bathroom Suite',
    subtitle: 'Luxury European Fittings',
    icon: Bath,
    count: 7,
    gradient: 'linear-gradient(135deg, #134e4a 0%, #0f766e 50%, #064e3b 100%)',
    accent: '#10b981',
    textAccent: '#6ee7b7',
    bg: 'rgba(16,185,129,0.08)',
  },
];

export default function DivisionSelector({ active, onChange }: DivisionSelectorProps) {
  return (
    <section className="py-16 px-6" style={{ background: '#0d1526' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#c9a84c' }}>
            Choose Your Room
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-white">
            Explore Our Divisions
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DIVISIONS.map((div, i) => {
            const Icon = div.icon;
            const isActive = active === div.id;
            return (
              <motion.button
                key={div.id}
                id={`showroom-div-${div.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onChange(div.id)}
                className="relative text-left rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
                style={{
                  background: isActive ? div.gradient : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isActive ? div.accent : 'rgba(255,255,255,0.08)'}`,
                  boxShadow: isActive ? `0 20px 60px ${div.accent}33` : 'none',
                }}
              >
                {/* Background glow when active */}
                {isActive && (
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'rgba(0,0,0,0.2)' }} />
                )}

                <div className="relative p-8">
                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                    style={{
                      background: isActive ? 'rgba(255,255,255,0.2)' : div.bg,
                      border: `1px solid ${isActive ? 'rgba(255,255,255,0.3)' : div.accent + '33'}`,
                    }}
                  >
                    <Icon size={26} style={{ color: isActive ? '#fff' : div.accent }} />
                  </div>

                  {/* Text */}
                  <h3 className="font-serif text-xl font-bold mb-1"
                    style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.85)' }}>
                    {div.label}
                  </h3>
                  <p className="text-sm mb-4"
                    style={{ color: isActive ? div.textAccent : 'rgba(255,255,255,0.45)' }}>
                    {div.subtitle}
                  </p>

                  {/* Product count badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: isActive ? 'rgba(255,255,255,0.2)' : div.bg,
                      color: isActive ? '#fff' : div.accent,
                      border: `1px solid ${isActive ? 'rgba(255,255,255,0.3)' : div.accent + '44'}`,
                    }}>
                    {div.count} Products
                  </div>

                  {/* Active indicator arrow */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="absolute top-6 right-6 text-white/60 text-lg"
                    >
                      ✦
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
