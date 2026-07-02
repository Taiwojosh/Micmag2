import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { openWhatsApp } from '../utils/whatsapp';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Compass, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  ArrowUpRight, 
  Activity,
  PhoneCall,
  ChevronRight,
  MessageSquare
} from 'lucide-react';

const BRANCHES = [
  { 
    id: 'oworonshoki', 
    name: 'Oworonshoki Headquarters', 
    node: 'Headquarters Depot', 
    address: '12 Oduduwa road (Oworo road) car wash bus stop, Oworonshoki, Lagos', 
    openingHours: 'Mon-Fri: 8:00 AM - 5:00 PM, Sat: 9:00 AM - 3:00 PM', 
    phone: '+234 705 294 0445',
    tag: 'Main Store & Consult Desk',
    services: ['Architectural Color Consulting', 'Bespoke Textured Finishes Display', 'Professional Custom Tinting', 'On-Site Technical Inspections'],
    coordinates: '6.5543° N, 3.3972° E',
    lat: 6.5542592,
    lng: 3.3972302,
    customGoogleMapsUrl: 'https://www.google.com/maps/dir//SANDTEX+Paints-Gbagada-Oworo,+Anthony,+MarylandIkoyi,Lekki,+Iyanaworo+12+Oduduwa+road+Oworo+road+By+Akewusola+street+Ifako,+Gbagada,+Lagos/@6.5209062,3.3517324,13z/data=!4m8!4m7!1m0!1m5!1m1!1s0x103b8dfde48be55f:0xc4e217eac09c6c35!2m2!1d3.3972302!2d6.5542592?entry=ttu',
    accentColor: '#d32f2f',
    micmagActive: true
  },
  { 
    id: 'sangotedo', 
    name: 'Sangotedo Island Store', 
    node: 'Lekki Island Store', 
    address: 'KM 46, Lekki-Epe expressway, opposite hot bread, sangotedo Lagos', 
    openingHours: 'Mon-Fri: 8:00 AM - 5:00 PM, Sat: 9:00 AM - 3:00 PM', 
    phone: '+234 810 714 4064',
    tag: 'Paint & Texture Depot',
    services: ['Sandtex Climate-Resilient Textures', 'Caplux Screeding Fillers', 'Professional Color Cards', 'Local Contractor Pickup'],
    coordinates: '6.4746° N, 3.6315° E',
    lat: 6.4746,
    lng: 3.6315,
    accentColor: '#0d9488',
    micmagActive: false
  },
  { 
    id: 'alakija', 
    name: 'Alakija Trade Store', 
    node: 'Alakija Core Store', 
    address: 'Merkato plaza, Alakija Festac, Lagos-Badagry expressway, Lagos', 
    openingHours: 'Mon-Fri: 8:00 AM - 5:00 PM, Sat: 9:00 AM - 3:00 PM', 
    phone: '+234 706 792 4965',
    tag: 'Direct Contractor Store',
    services: ['Bulk Sandtex Sourcing Store', 'Caplux Surface Prep Primers', 'Site Logistics & Direct Delivery', 'Wholesale Trade Pricing'],
    coordinates: '6.4522° N, 3.2084° E',
    lat: 6.4522,
    lng: 3.2084,
    accentColor: '#d97706',
    micmagActive: false
  },
  { 
    id: 'ikorodu', 
    name: 'Ikorodu Mainland Store', 
    node: 'Ikorodu Store', 
    address: 'Lawret Plaza, Itamaga Roundabout, Ikorodu', 
    openingHours: 'Mon-Fri: 8:00 AM - 5:00 PM, Sat: 9:00 AM - 3:00 PM', 
    phone: '+234 805 696 5188',
    tag: 'Direct Trade Outlet',
    services: ['Sandtex High-Build Finishes', 'Caplux Premium Undercoats', 'Fast Stock Collection Desk', 'Technical Specifications Consult'],
    coordinates: '6.6186° N, 3.5049° E',
    lat: 6.6186,
    lng: 3.5049,
    accentColor: '#4f46e5',
    micmagActive: false
  },
  {
    id: 'ogombo',
    name: 'Ogbombo Store',
    node: 'Ajah Outlet',
    address: 'Ogbombo Road, off New Lagos Coastal Road, Abraham Adesanya, Ajah, Lagos',
    openingHours: 'Mon-Fri: 8:00 AM - 5:00 PM, Sat: 9:00 AM - 3:00 PM',
    phone: '+234 809 423 4865',
    tag: 'Lekki-Ajah Point',
    services: ['SANDTEX Paint Custom Tinting', 'Caplux Wall Putty Ready Supply', 'Fast Site Logistics Support', 'Professional Color Card Boards'],
    coordinates: '6.4621° N, 3.5822° E',
    lat: 6.4621,
    lng: 3.5822,
    accentColor: '#10b981',
    micmagActive: false
  },
  {
    id: 'bojije',
    name: 'Bojije Store',
    node: 'Ibeju-Lekki Outlet',
    address: 'Bojije Bus Stop, Lekki-Epe Expressway, Ibeju-Lekki, Lagos',
    openingHours: 'Mon-Fri: 8:00 AM - 5:00 PM, Sat: 9:00 AM - 3:00 PM',
    phone: '+234 706 792 4965',
    tag: 'Contractor Volume Depot',
    services: ['Direct Masonry Primer Sourcing', 'Heavy Climate-Proof Stocking', 'Caplux High-Bond Basecoats', 'Express Site Deliveries'],
    coordinates: '6.4789° N, 3.7122° E',
    lat: 6.4789,
    lng: 3.7122,
    accentColor: '#f59e0b',
    micmagActive: false
  }
];

const springTransition = {
  type: "spring",
  stiffness: 80,
  damping: 18,
  mass: 1
};

export default function ServiceLocations() {
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0]);
  const [activeTab, setActiveTab] = useState<'all' | 'island' | 'mainland'>('all');

  // Filter logic
  const filteredBranches = BRANCHES.filter(b => {
    if (activeTab === 'island') {
      return b.id === 'sangotedo' || b.id === 'ogombo' || b.id === 'bojije';
    }
    if (activeTab === 'mainland') {
      return b.id === 'oworonshoki' || b.id === 'alakija' || b.id === 'ikorodu';
    }
    return true;
  });

  return (
    <section id="service-locations" className="py-24 px-5 md:px-[5%] text-white relative overflow-hidden border-b border-black bg-[#9f2a2a]">
      {/* Decorative Matrix/Radar Background Ring */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-red/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute left-[10%] bottom-0 w-80 h-80 bg-[#FF6B00]/5 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 text-left">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-[#e3e3ea] text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-white animate-spin-slow" /> Our Local Outlets
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-[2.6rem] leading-[1.12] font-black text-white">
              Lagos Outlets <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#d32f2f] to-[#FF6B00]">
                & Physical Branches
              </span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:pb-1">
          </div>
        </div>

        {/* Toggling Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-10 pb-4 border-b border-neutral-800">
          <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 font-bold shrink-0">Regions:</span>
          <div className="flex bg-[#1a1b20] p-1 rounded border border-neutral-800 w-full sm:w-auto overflow-x-auto scrollbar-none gap-1 sm:gap-0">
            <button 
              onClick={() => { setActiveTab('all'); if (!filteredBranches.some(b => b.id === selectedBranch.id)) setSelectedBranch(BRANCHES[0]); }}
              className={`whitespace-nowrap px-3.5 py-2 text-[11px] font-bold uppercase rounded-[2px] tracking-wider cursor-pointer transition-colors ${activeTab === 'all' ? 'bg-[#d32f2f] text-white shadow-md' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
            >
              All Branches ({BRANCHES.length})
            </button>
            <button 
              onClick={() => { setActiveTab('island'); setSelectedBranch(BRANCHES.find(b => b.id === 'sangotedo')!); }}
              className={`whitespace-nowrap px-3.5 py-2 text-[11px] font-bold uppercase rounded-[2px] tracking-wider cursor-pointer transition-colors ${activeTab === 'island' ? 'bg-[#d32f2f] text-white shadow-md' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
            >
              Island Branches
            </button>
            <button 
              onClick={() => { setActiveTab('mainland'); setSelectedBranch(BRANCHES.find(b => b.id === 'oworonshoki')!); }}
              className={`whitespace-nowrap px-3.5 py-2 text-[11px] font-bold uppercase rounded-[2px] tracking-wider cursor-pointer transition-colors ${activeTab === 'mainland' ? 'bg-[#d32f2f] text-white shadow-md' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
            >
              Mainland Branches
            </button>
          </div>
        </div>

        {/* Dynamic Dual-Frame Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Frame: Premium Cards list (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredBranches.map((branch) => {
                const isSelected = selectedBranch.id === branch.id;
                return (
                  <motion.div
                    key={branch.id}
                    layoutId={`branch-card-${branch.id}`}
                    onClick={() => setSelectedBranch(branch)}
                    whileHover={{ scale: 1.01 }}
                    className={`p-6 rounded-[19px] border transition-all duration-300 text-left cursor-pointer flex flex-col justify-between relative group overflow-hidden ${
                      isSelected 
                        ? 'bg-white text-zinc-900 border-white shadow-xl' 
                        : 'bg-[#15161b] text-white border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="space-y-2 pr-12">
                      <h4 className="font-serif text-[1.15rem] leading-snug font-black">
                        {branch.name}
                      </h4>
                      <p className={`text-[11.5px] leading-relaxed font-light ${isSelected ? 'text-zinc-600' : 'text-neutral-400 line-clamp-2'}`}>
                        {branch.address}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-neutral-200/50 flex items-center justify-between text-[10px] font-mono">
                      <span className={`flex items-center gap-1 font-bold ${isSelected ? 'text-zinc-700' : 'text-neutral-400'}`}>
                        <Clock className="w-3.5 h-3.5" /> Open: 8am-5pm
                      </span>
                      <span className="text-[#d32f2f] font-extrabold uppercase tracking-wide flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-200">
                        {isSelected ? 'Selected' : 'View Branch'} <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-300 ${isSelected ? 'rotate-90 text-brand-red' : ''}`} />
                      </span>
                    </div>

                    {/* Mobile-only inline details */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ height: 0, opacity: 0, marginTop: 0 }}
                          animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                          exit={{ height: 0, opacity: 0, marginTop: 0 }}
                          transition={{ duration: 0.3 }}
                          className="lg:hidden space-y-4 border-t border-neutral-200 pt-4 overflow-hidden text-zinc-900"
                        >
                          {/* Sourcing notice */}
                          <div className="border border-neutral-150 rounded bg-neutral-50 p-4 space-y-1 text-left">
                            {branch.micmagActive ? (
                              <>
                                <div className="flex items-center gap-2 text-amber-600 font-mono text-[9px] uppercase font-bold tracking-wider">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                  <span>Active Showroom</span>
                                </div>
                                <p className="text-[11px] text-zinc-600 leading-normal font-light">
                                  Our full-scale design showroom and premium color consults are <strong>fully active here</strong> as a pilot concept showroom.
                                </p>
                              </>
                            ) : (
                              <>
                                <div className="flex items-center gap-2 text-zinc-500 font-mono text-[9px] uppercase font-bold tracking-wider">
                                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                                  <span>Express Coatings Depot</span>
                                </div>
                                <p className="text-[11px] text-zinc-500 leading-normal font-light">
                                  This branch operates as an express depot for premium <strong>Sandtex</strong> paints and <strong>Caplux</strong> surface preparation formulations. Showrooms open late 2026.
                                </p>
                              </>
                            )}
                          </div>

                          {/* Map iframe */}
                          <div className="w-full h-44 rounded overflow-hidden border border-neutral-200 shadow-md relative">
                            <iframe
                              title={`${branch.name} Mobile Map`}
                              src={`https://maps.google.com/maps?q=${branch.lat},${branch.lng}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                              className="w-full h-full grayscale-[10%] contrast-[105%] opacity-90"
                              style={{ border: 0 }}
                              allowFullScreen
                              loading="lazy"
                            />
                            <div className="absolute top-2 right-2 bg-neutral-950/85 backdrop-blur px-2.5 py-1 rounded text-[9px] font-mono font-bold uppercase tracking-wider text-neutral-300 border border-neutral-800 flex items-center gap-1">
                              <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" /> Live View
                            </div>
                          </div>

                          {/* Action Hub Connections */}
                          <div className="flex flex-col gap-2 pt-2">
                            <div className="grid grid-cols-2 gap-2">
                              <a 
                                href={`tel:${branch.phone}`}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-[#15161b] hover:bg-neutral-800 text-white text-center p-3.5 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 font-mono"
                              >
                                <Phone className="w-3.5 h-3.5 text-white" /> Call
                              </a>
                              
                              <a 
                                href={'customGoogleMapsUrl' in branch && branch.customGoogleMapsUrl ? (branch.customGoogleMapsUrl as string) : `https://www.google.com/maps/dir/?api=1&destination=${branch.lat},${branch.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="bg-neutral-100 hover:bg-neutral-200 text-zinc-900 border border-neutral-200 text-center p-3.5 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 font-mono"
                              >
                                <MapPin className="w-3.5 h-3.5 text-[#d32f2f]" /> Route
                              </a>
                            </div>

                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                const text = `Hello Micmag team! I want to visit your ${branch.name} to inspect SANDTEX paints and CAPLUX surface preparation preps.`;
                                openWhatsApp(branch.phone, text);
                              }}
                              className="w-full bg-[#25d366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 font-mono cursor-pointer"
                            >
                              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white shrink-0" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                              </svg>
                              <span>Book Appointment</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Bottom visual indicator border bar */}
                    <div 
                      className="absolute bottom-0 left-0 h-1 transition-all duration-300" 
                      style={{ 
                        backgroundColor: branch.accentColor,
                        width: isSelected ? '100%' : '0%'
                      }}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Frame: Branch Details Panel (5 Cols) */}
          <div className="hidden lg:block lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedBranch.id}
                initial={{ opacity: 0, scale: 0.97, x: 15 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.97, x: -15 }}
                transition={springTransition}
                className="bg-[#15161b] border border-neutral-800 rounded-[16px] p-6 md:p-8 space-y-6 text-left shadow-2xl relative overflow-hidden flex flex-col justify-between h-full"
              >
                {/* Visual Accent Top Bar */}
                <div 
                  className="absolute top-0 inset-x-0 h-1.5 transition-colors duration-500" 
                  style={{ backgroundColor: selectedBranch.accentColor }}
                />

                {/* Branch Coordinates & Info block */}
                <div className="bg-[#1b1c22] p-4 rounded border border-neutral-800 space-y-2 relative overflow-hidden">
                  <div className="absolute right-4 top-4 text-[9px] text-brand-yellow font-mono font-bold uppercase tracking-wider bg-brand-yellow/10 border border-brand-yellow/20 px-2.5 py-1 rounded inline-flex items-center gap-1.5 shadow-inner">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse" /> Open Now
                  </div>
                  
                  <span className="text-[9px] font-mono text-neutral-500 font-bold block uppercase tracking-wider">Branch Location Coordinates</span>

                  
                  {/* Decorative line */}
                  <div className="h-[2px] w-full bg-gradient-to-r from-brand-yellow via-[#d32f2f] to-amber-500/10 rounded mt-3" />
                </div>

                {/* Premium Google Map Iframe Integration */}
                <div className="w-full h-48 rounded overflow-hidden border border-neutral-800 shadow-md relative group">
                  <iframe
                    title={`${selectedBranch.name} Google Map`}
                    src={`https://maps.google.com/maps?q=${selectedBranch.lat},${selectedBranch.lng}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                    className="w-full h-full grayscale-[10%] contrast-[105%] opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 pointer-events-auto"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2 bg-neutral-950/80 backdrop-blur px-2.5 py-1 rounded text-[9.5px] font-mono font-bold uppercase tracking-wider text-neutral-300 border border-neutral-850 flex items-center gap-1.5 pointer-events-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    Live View
                  </div>
                </div>

                {/* Middle details block */}
                <div className="space-y-4 p-0">
                  <div>
                    <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase block mb-1">
                      BRANCH OVERVIEW
                    </span>
                    <h3 className="font-serif text-2xl font-black text-white leading-snug">
                       {selectedBranch.name}
                    </h3>
                    <p className="text-[11px] text-zinc-400 font-bold tracking-wide uppercase font-mono mt-1">
                      {selectedBranch.node}
                    </p>
                  </div>

                  {/* Complete parameters list (address) */}
                  <div className="space-y-3 pt-2 text-[12.5px] text-neutral-300 leading-relaxed font-light">
                    <p className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#d32f2f] shrink-0 mt-1" />
                      <span>{selectedBranch.address}</span>
                    </p>
                    <p className="flex items-center gap-2.5 font-bold text-neutral-200 font-mono">
                      <Clock className="w-4 h-4 text-brand-yellow shrink-0" />
                      <span>{selectedBranch.openingHours}</span>
                    </p>
                  </div>


                </div>

                {/* Direct Action Hub Connections */}
                <div className="pt-4 border-t border-neutral-800 flex flex-col gap-2.5">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.a 
                      href={`tel:${selectedBranch.phone}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-white hover:bg-neutral-100 text-[#0c0d10] text-center p-3.5 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow font-bold"
                      style={{ borderRadius: '20px', borderWidth: '1px' }}
                    >
                      <PhoneCall className="w-4 h-4 text-[#d32f2f]" /> Call Branch
                    </motion.a>
                    
                    <motion.a 
                      href={'customGoogleMapsUrl' in selectedBranch && selectedBranch.customGoogleMapsUrl ? (selectedBranch.customGoogleMapsUrl as string) : `https://www.google.com/maps/dir/?api=1&destination=${selectedBranch.lat},${selectedBranch.lng}&query=${encodeURIComponent(selectedBranch.name + ', ' + selectedBranch.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-neutral-800 hover:bg-neutral-750 text-white border border-neutral-700 text-center p-3.5 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 font-bold"
                      style={{ borderRadius: '20px' }}
                    >
                      <MapPin className="w-4 h-4 text-[#d32f2f]" /> Get Directions
                    </motion.a>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const text = `Hello Micmag team! I want to visit your ${selectedBranch.name} to inspect SANDTEX paints and CAPLUX surface preparation preps.`;
                      openWhatsApp(selectedBranch.phone, text);
                    }}
                    className="w-full bg-[#25d366] hover:bg-[#20ba5a] text-white p-3.5 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer font-bold"
                    style={{ borderRadius: '20px' }}
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white shrink-0" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span>Book Appointment</span>
                  </motion.button>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}

