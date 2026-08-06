import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ChevronDown } from 'lucide-react';

interface ShowroomHeroProps {
  onEnter: () => void;
}

export default function ShowroomHero({ onEnter }: ShowroomHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: { x: number; y: number; r: number; dx: number; dy: number; alpha: number; color: string }[] = [];
    const colors = ['#c9a84c', '#1a2c5b', '#8b1a1a', '#ffffff'];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.6 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animId: number;
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      }
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    }

    draw();
    const handleResize = () => {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #1a2c5b 40%, #0d1526 70%, #1a0808 100%)' }}
    >
      {/* Animated canvas particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.5 }}
      />

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139,26,26,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(26,44,91,0.3) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex justify-center mb-8"
        >
          <img src="./Logo.png" alt="Micmag" className="h-20 w-auto drop-shadow-2xl" />
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border"
          style={{ background: 'rgba(201,168,76,0.1)', borderColor: 'rgba(201,168,76,0.35)', color: '#f0d898' }}
        >
          <Sparkles size={14} />
          <span className="text-xs font-semibold uppercase tracking-widest">Digital Showroom</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: 'easeOut' }}
          className="font-serif text-white leading-tight mb-6"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', textShadow: '0 2px 40px rgba(0,0,0,0.5)' }}
        >
          Experience Spaces
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #c9a84c, #f0d898, #c9a84c)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Reimagined
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-lg mb-10 max-w-2xl mx-auto leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.65)' }}
        >
          Explore our complete collection of premium Sandtex paints, Caplux surface systems,
          and luxury European bathroom fittings — all curated for the discerning Nigerian home.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            id="showroom-enter-btn"
            onClick={onEnter}
            className="group relative px-10 py-4 rounded-full font-semibold text-sm uppercase tracking-widest transition-all duration-300 overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #c9a84c, #a0762e)', color: '#0a0f1e', boxShadow: '0 0 30px rgba(201,168,76,0.35)' }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Enter Showroom
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </span>
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'linear-gradient(135deg, #f0d898, #c9a84c)' }} />
          </button>

          <a
            href="https://wa.me/2347052940445"
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-4 rounded-full font-semibold text-sm uppercase tracking-widest border transition-all duration-300 hover:bg-white/10"
            style={{ borderColor: 'rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.8)' }}
          >
            Talk to Us
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex justify-center gap-12 mt-16"
        >
          {[
            { value: '20+', label: 'Products' },
            { value: '3', label: 'Divisions' },
            { value: '120+', label: 'Paint Colors' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold font-serif" style={{ color: '#c9a84c' }}>{stat.value}</div>
              <div className="text-xs uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        style={{ color: 'rgba(255,255,255,0.3)' }}
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <ChevronDown size={24} />
        </motion.div>
      </motion.div>
    </section>
  );
}
