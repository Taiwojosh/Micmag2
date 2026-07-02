import React from 'react';
import { motion } from "motion/react";
import { CheckCircle } from 'lucide-react';
import CompareSlider from './CompareSlider';

const caseStudies = [
  {
    title: 'Luxury Hotel Suite Renovation',
    description: 'Complete refurbishment of high-traffic hotel suites in Victoria Island, focusing on durability and aesthetic appeal.',
    outcome: 'Achieved a 40% increase in guest satisfaction scores within six months.',
    beforeUrl: 'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?auto=format&fit=crop&q=80&w=800',
    afterUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57738bc2?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Corporate HQ Lobby Overhaul',
    description: 'Specified and applied high-performance Sandtex textured coatings and premium primers for a premier corporate office lobby.',
    outcome: 'Completed project in accelerated 3-week timeline while maintaining premium standards.',
    beforeUrl: 'https://images.unsplash.com/photo-1596461404966-09c894877717?auto=format&fit=crop&q=80&w=800',
    afterUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Coastal Estate Protective Coating',
    description: 'Standardized anti-alkaline primers and weather-locked exterior polymer coatings for a newly constructed luxury apartment complex.',
    outcome: 'Seamless integration resulted in zero post-installation maintenance requests.',
    beforeUrl: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=800',
    afterUrl: 'https://images.unsplash.com/photo-1558002432-8419614a8169?auto=format&fit=crop&q=80&w=800'
  }
];

export default function CaseStudies() {
  return (
    <section id="case-studies" className="py-20 px-5 md:px-[5%] bg-brand-charcoal text-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <span className="text-brand-red text-xs font-semibold tracking-[0.15em] uppercase mb-4 block">
            Impact & Outcomes
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
            Case Studies
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {caseStudies.map((study, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
              className="border border-white/10 p-6 rounded-[4px] bg-white/5 h-full flex flex-col"
            >
              <div className="mb-6">
                <CompareSlider beforeUrl={study.beforeUrl} afterUrl={study.afterUrl} alt={study.title} />
              </div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white">
                  {study.title}
                </h3>
                <span className="text-[10px] bg-white/5 px-2 py-1 rounded flex items-center gap-1 text-white/70 border border-white/10 shrink-0 ml-2">
                  <CheckCircle size={10} className="text-brand-red" />
                  VERIFIED
                </span>
              </div>
              <p className="text-white/70 leading-relaxed mb-6 text-[0.95rem] flex-grow">
                {study.description}
              </p>
              <div className="border-t border-white/10 pt-6">
                <p className="text-sm font-semibold uppercase tracking-wider text-brand-red mb-2">
                  Key Outcome:
                </p>
                <p className="text-white font-medium italic">
                  {study.outcome}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
