import React from 'react';
import { motion } from 'motion/react';
import { PhoneCall, CheckCircle2, MessageSquare, ArrowRight, ShieldCheck, Gem } from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';

export default function DynamicCTA() {
  const handleApplyEstimate = () => {
    const inquiryType = 'Sandtex Paints & Premium Coatings';
    const message = 'Hello, I would like to schedule a professional consultation representing Sandtex paint coatings, Caplux industrial primers, custom texture finishes, or technical substrate inspections for my real estate project.';

    // Dispatch custom event to auto-populate LeadForm
    window.dispatchEvent(new CustomEvent('applyPaintEstimate', {
      detail: { inquiryType, message }
    }));

    // Scroll smoothly to contact/lead form
    const leadFormElement = document.getElementById('contact');
    if (leadFormElement) {
      leadFormElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWhatsAppInstant = () => {
    const text = 'Hello! I am on your digital catalog platform and would like an immediate quote or technical product specifications for Sandtex Paints, Caplux Primers, or Premium Textures.';
    openWhatsApp('2347052940445', text);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0a0b0d] relative overflow-hidden text-left border-y border-neutral-900">
      {/* Background Animated Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none animated-gradient-bg opacity-[0.16]" />

      <div className="absolute top-0 left-0 w-64 h-64 bg-neutral-900/40 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Brand Value Proposition Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-850/80 border border-neutral-700/50 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-mono text-neutral-300 font-extrabold uppercase tracking-widest">
                MICMAG TURNKEY SPECIFICATIONS
              </span>
            </div>

            <div className="space-y-4">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                Create Extraordinary Spaces. <br />
                <span className="text-amber-500">Built to Last, Designed to Impress.</span>
              </h2>
              <p className="text-neutral-400 font-light text-sm sm:text-base leading-relaxed max-w-xl">
                Whether shielding your structure with heavy-duty, climate-proof Sandtex polymer coatings or specifying premium Caplux protective primers and textured architectural finishes, we ensure uncompromising quality.
              </p>
            </div>

            {/* Core Warranty / Procurement Trust Marks */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-neutral-800">
              <div className="space-y-1">
                <span className="text-xs font-mono text-neutral-400 font-bold uppercase block tracking-wider">
                  Origin Authenticity
                </span>
                <span className="text-xs font-black text-white flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-yellow" /> Genuine Warranty
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono text-neutral-400 font-bold uppercase block tracking-wider">
                  National Transit
                </span>
                <span className="text-xs font-black text-white flex items-center gap-1 font-mono">
                  🚚 Site Delivery
                </span>
              </div>
              <div className="hidden md:block space-y-1">
                <span className="text-xs font-mono text-neutral-400 font-bold uppercase block tracking-wider">
                  Client Support Call
                </span>
                <a href="tel:+2347052940445" className="text-xs font-black text-white hover:text-brand-red transition-colors flex items-center gap-1 font-mono">
                  ☎️ 0705 294 0445
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Conversion Action Frame */}
          <div className="lg:col-span-5 w-full">
            <div className="glass-premium-dark rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <Gem className="w-5 h-5 text-neutral-700 font-light" />
              </div>

              <div className="space-y-1.5">
                <h3 className="font-serif text-lg font-black text-white">
                  Immediate Portfolio Planning
                </h3>
                <p className="text-[11px] text-neutral-400 font-light leading-relaxed">
                  Connect direct with our commercial execution team to estimate exact product sizing, project timeline scope, and custom fittings specifications.
                </p>
              </div>

              <div className="space-y-3">
                {/* Active Dynamic CTA Primary Action */}
                <button
                  type="button"
                  onClick={handleApplyEstimate}
                  className="w-full text-center text-white py-3.5 rounded-[3px] text-xs font-mono font-extrabold uppercase tracking-[0.14em] bg-amber-600 hover:bg-amber-700 transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer border-none"
                >
                  <span>📋 Request Project Consultation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Instant WhatsApp Live Connection */}
                <button
                  type="button"
                  onClick={handleWhatsAppInstant}
                  className="w-full text-center bg-[#25D366] hover:bg-[#1ebd59] text-white py-3.5 rounded-[3px] text-xs font-mono font-extrabold uppercase tracking-[0.14em] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md border-none"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white shrink-0" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>Connect via WhatsApp</span>
                </button>
              </div>

              <div className="bg-neutral-950 p-3 rounded-[3px] border border-neutral-850/50 text-center">
                <span className="text-[9.5px] font-mono tracking-widest text-[#25D366] font-bold uppercase block animate-pulse">
                  ⚡ 5-Minute Professional Response Rate
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
