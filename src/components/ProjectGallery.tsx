import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Skeleton from './Skeleton';
import { ArrowRight, LayoutGrid, Calendar, MapPin } from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';

const PROJECTS = [
  { id: 1, title: 'Caplux High-Gloss Office', category: 'CAPLUX Specialty', date: '2026-05-15', location: 'Banana Island, Lagos', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800' },
  { id: 2, title: 'The Penthouse Residence Lounge', category: 'Consultancy', date: '2026-03-20', location: 'Ikoyi High-Rise', url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800' },
  { id: 3, title: 'Apex Executive Headquarters', category: 'SANDTEX Paints', date: '2026-02-05', location: 'Eko Atlantic City', url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=800' },
];

const CATEGORIES = ['All', 'SANDTEX Paints', 'CAPLUX Specialty', 'Consultancy'];

const springTransition = {
  type: "spring",
  stiffness: 80,
  damping: 18,
  mass: 1
};

export default function ProjectGallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [loading, setLoading] = useState(true);

  const handleSelectProjectForQuote = (projectTitle: string, projectLocation: string, category: string) => {
    const inquiryType = category === 'CAPLUX Specialty' ? 'CAPLUX Paints & Primers' : category === 'SANDTEX Paints' ? 'SANDTEX Paints' : 'Both Paint Systems';
    const customMessage = `Hello! I would like to receive pricing and detailed specifications to replicate the style of: "${projectTitle}" from ${projectLocation}. Please consult with me on availability and schedules.`;
    
    // Dispatch custom event to auto-populate LeadForm
    window.dispatchEvent(new CustomEvent('applyPaintEstimate', {
      detail: {
        inquiryType,
        message: customMessage
      }
    }));

    // Scroll to lead form smoothly
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleProjectWhatsAppInquiry = (projectTitle: string, projectLocation: string) => {
    const text = `Hello! I am looking at your outstanding project: "${projectTitle}" in ${projectLocation} and would like to receive technical specs and material costs to replicate this configuration.`;
    openWhatsApp('2347052940445', text);
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const processedProjects = (activeCategory === 'All' 
    ? [...PROJECTS] 
    : PROJECTS.filter(p => p.category === activeCategory)
  ).sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  return (
    <section id="gallery" className="py-24 px-5 md:px-[5%] bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-micmag-red text-xs font-bold tracking-[0.2em] uppercase mb-3 flex items-center gap-1.5"
          >
            <LayoutGrid className="w-4 h-4 text-micmag-red animate-spin-slow" /> What You Will Get
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={springTransition}
            className="font-serif text-3xl sm:text-4xl md:text-[2.6rem] leading-[1.12] font-black text-brand-charcoal mb-4 text-left"
          >
            Premium Transformations
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-xs md:text-sm leading-relaxed text-brand-mid font-light max-w-3xl mb-8 text-left"
          >
            Explore our portfolio of completed projects and design blueprints. See our durable <strong className="font-semibold text-brand-charcoal">Sandtex paint</strong> finishes on structures across Nigeria, and preview high-end <strong className="font-semibold text-brand-charcoal">Micmag fittings</strong> and luxury bathroom layouts at our Gbagada-Oworo studio.
          </motion.p>

          {/* Filters Bar with layout animation */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={springTransition}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-neutral-50 p-4 rounded-[6px] border border-neutral-200"
          >
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => {
                const isActive = activeCategory === category;
                return (
                  <motion.button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    className="px-4 py-2 rounded-[4px] text-xs font-bold uppercase tracking-wider cursor-pointer relative overflow-hidden"
                    style={{
                      color: isActive ? '#fff' : '#0c0d10',
                      backgroundColor: isActive ? '#0c0d10' : '#fff',
                      border: isActive ? 'none' : '1px solid #e5e7eb'
                    }}
                  >
                    {isActive && (
                      <motion.span 
                        layoutId="activeCategoryBg"
                        className="absolute inset-0 bg-brand-charcoal -z-10"
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      />
                    )}
                    {category}
                  </motion.button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-brand-mid uppercase">Sort Timeline:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                className="text-xs border-neutral-300 border rounded-[4px] px-3.5 py-1.5 bg-white text-brand-charcoal focus:ring-1 focus:ring-brand-red focus:border-brand-red cursor-pointer font-bold"
              >
                <option value="newest">Latest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </motion.div>
        </div>

        {/* Dynamic masonry style grid with AnimatePresence & Layout physics */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="group relative rounded-[6px] shadow-sm border border-neutral-200 p-4 bg-white space-y-4">
                <Skeleton className="w-full h-80 rounded-[4px]" />
                <div className="space-y-2">
                  <Skeleton className="w-1/3 h-3" />
                  <Skeleton className="w-2/3 h-5" />
                </div>
              </div>
            ))
          ) : (
            <AnimatePresence mode="popLayout">
              {processedProjects.map((project) => (
                <motion.div 
                  key={project.id} 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ y: -6, shadow: "0px 15px 40px rgba(0,0,0,0.15)" }}
                  transition={springTransition}
                  className="group relative overflow-hidden rounded-[6px] border border-neutral-200 bg-white p-3.5 shadow-sm hover:border-brand-charcoal flex flex-col justify-between text-left"
                >
                  <div className="relative w-full h-80 overflow-hidden rounded-[4px]">
                    <motion.img
                      src={project.url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.4 }}
                    />
                    
                    <div className="absolute top-3 right-3 bg-white/95 text-brand-charcoal px-2.5 py-1 rounded-[2px] text-[9px] font-mono font-bold uppercase tracking-wide border border-neutral-200">
                      {project.category}
                    </div>
                  </div>

                  <div className="pt-4 pb-1 pl-1 space-y-1.5 text-left">
                    <h3 className="text-[1.15rem] font-serif font-black text-brand-charcoal group-hover:text-micmag-red transition-colors duration-200">
                      {project.title}
                    </h3>
                    
                    <div className="flex gap-2 pt-2 relative z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProjectWhatsAppInquiry(project.title, project.location);
                        }}
                        className="w-full bg-[#25D366]/10 hover:bg-[#25D366] hover:text-white text-[#25D366] text-[10px] font-mono font-bold py-2 px-2 rounded-[2px] transition-all duration-300 text-center flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current shrink-0" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        <span>WhatsApp Inquiry</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </section>
  );
}
