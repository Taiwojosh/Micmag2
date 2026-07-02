import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, ArrowUpRight, MessageSquare, Compass, ShieldCheck } from 'lucide-react';
import LeadForm from '../components/LeadForm';
import { usePageMeta } from '../utils/usePageMeta';

interface OfficeBranch {
  id: string;
  name: string;
  address: string;
  openingHours: string;
  phone: string;
  tag: string;
  customGoogleMapsUrl: string;
  services: string[];
}

const offices: OfficeBranch[] = [
  { 
    id: 'oworonshoki', 
    name: 'Oworonshoki (HQ)', 
    address: '12 Oduduwa road (Oworo road) car wash bus stop, Oworonshoki, Lagos', 
    openingHours: 'Mon-Fri: 8:00 AM - 5:00 PM, Sat: 9:00 AM - 3:00 PM', 
    phone: '+234 705 294 0445',
    tag: 'Main Store & Consult Desk',
    customGoogleMapsUrl: 'https://www.google.com/maps/dir//SANDTEX+Paints-Gbagada-Oworo,+Anthony,+MarylandIkoyi,Lekki,+Iyanaworo+12+Oduduwa+road+Oworo+road+By+Akewusola+street+Ifako,+Gbagada,+Lagos/@6.5209062,3.3517324,13z/data=!4m8!4m7!1m0!1m5!1m1!1s0x103b8dfde48be55f:0xc4e217eac09c6c35!2m2!1d3.3972302!2d6.5542592?entry=ttu',
    services: ['Architectural Color Consulting', 'Bespoke Textured Finishes Display', 'Professional Custom Tinting', 'On-Site Technical Inspections']
  },
  { 
    id: 'sangotedo', 
    name: 'Sangotedo Outlet', 
    address: 'KM 46, Lekki-Epe expressway, opposite hot bread, sangotedo Lagos', 
    openingHours: 'Mon-Fri: 8:00 AM - 5:00 PM, Sat: 9:00 AM - 3:00 PM', 
    phone: '+234 810 714 4064',
    tag: 'Paint & Texture Depot',
    customGoogleMapsUrl: 'https://www.google.com/maps',
    services: ['Climate-Resilient Textures', 'Caplux Screeding Fillers', 'Professional Color Cards']
  },
  { 
    id: 'alakija', 
    name: 'Alakija Trade Store', 
    address: 'Merkato plaza, Alakija Festac, Lagos-Badagry expressway, Lagos', 
    openingHours: 'Mon-Fri: 8:00 AM - 5:00 PM, Sat: 9:00 AM - 3:00 PM', 
    phone: '+234 706 792 4965',
    tag: 'Direct Contractor Store',
    customGoogleMapsUrl: 'https://www.google.com/maps',
    services: ['Bulk Sourcing Store', 'Caplux Primers', 'Site Logistics Delivery']
  },
  { 
    id: 'ikorodu', 
    name: 'Ikorodu Outlet', 
    address: 'Lawret Plaza, Itamaga Roundabout, Ikorodu', 
    openingHours: 'Mon-Fri: 8:00 AM - 5:00 PM, Sat: 9:00 AM - 3:00 PM', 
    phone: '+234 805 696 5188',
    tag: 'Direct Trade Outlet',
    customGoogleMapsUrl: 'https://www.google.com/maps',
    services: ['Sandtex High-Build Finishes', 'Caplux Undercoats', 'Fast Collection Desk']
  },
  {
    id: 'ogombo',
    name: 'Ogbombo Point',
    address: 'Ogbombo Road, off New Lagos Coastal Road, Abraham Adesanya, Ajah, Lagos',
    openingHours: 'Mon-Fri: 8:00 AM - 5:00 PM, Sat: 9:00 AM - 3:00 PM',
    phone: '+234 809 423 4865',
    tag: 'Lekki-Ajah Point',
    customGoogleMapsUrl: 'https://www.google.com/maps',
    services: ['Paint Custom Tinting', 'Caplux Wall Putty Ready Supply', 'Fast Site Logistics']
  },
  {
    id: 'bojije',
    name: 'Bojije Volume Depot',
    address: 'Bojije Bus Stop, Lekki-Epe Expressway, Ibeju-Lekki, Lagos',
    openingHours: 'Mon-Fri: 8:00 AM - 5:00 PM, Sat: 9:00 AM - 3:00 PM',
    phone: '+234 706 792 4965',
    tag: 'Contractor Volume Depot',
    customGoogleMapsUrl: 'https://www.google.com/maps',
    services: ['Direct Masonry Primer Sourcing', 'Heavy Climate-Proof Stocking', 'Caplux High-Bond Basecoats']
  }
];

const springTransition = { type: "spring", stiffness: 100, damping: 15 };

export default function ContactPage() {
  usePageMeta({
    title: 'Contact Us',
    description: 'Get in touch with Micmag Homes & Fittings. Visit our Lagos stores in Oworonshoki, Sangotedo, and Alakija, or reach us by phone and WhatsApp.',
    ogTitle: 'Contact Micmag Homes & Fittings | Lagos Paint & Fittings Stores',
  });
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pt-24 min-h-screen bg-[#F5F4F0]"
    >
      {/* Page Hero */}
      <div className="bg-[#000650] text-white py-20 px-5 md:px-[5%] relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-r from-[#000650] via-neutral-900 to-transparent opacity-80" />
        <div className="max-w-7xl mx-auto relative z-10 space-y-4 text-left">
          <span className="text-[#7598f3] text-xs font-bold tracking-[0.25em] uppercase flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#7598f3]" />
            Corporate Contact Hub
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Consult Our Technical Desk
          </h1>
          <p className="max-w-2xl text-neutral-300 text-sm sm:text-base leading-relaxed font-light">
            Have a project specification, commercial quotation request, or color-matching query? Connect directly with our experts at the Oworonshoki HQ or drop by any of our regional depots.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-[5%] py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Location Cards & General Inquiries */}
        <div className="lg:col-span-7 space-y-10 text-left">
          
          <div className="space-y-4">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-charcoal">
              Regional Outlets &amp; Logistics Hubs
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
              We operate multiple dedicated supply depots and consultation spaces across Lagos to guarantee prompt pick-ups and same-day delivery service.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {offices.map((office, idx) => (
              <motion.div
                key={office.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...springTransition, delay: idx * 0.05 }}
                className="bg-white border border-neutral-200 p-5 rounded-lg flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-neutral-400">
                      {office.tag}
                    </span>
                    <MapPin className="w-4 h-4 text-[#d32f2f] shrink-0" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-neutral-900 leading-tight">
                    {office.name}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed font-light">
                    {office.address}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>{office.openingHours}</span>
                  </div>
                  <a
                    href={`tel:${office.phone.replace(/\s+/g, '')}`}
                    className="flex items-center gap-2 text-xs font-bold text-brand-charcoal hover:text-[#000082] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 shrink-0 text-[#000082]" />
                    <span>{office.phone}</span>
                  </a>
                  
                  {office.id === 'oworonshoki' && (
                    <a
                      href={office.customGoogleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[#000082] hover:underline"
                    >
                      <span>Get Directions on Google Maps</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Core Support / Escrow Section */}
          <div className="bg-white border border-neutral-200 p-6 rounded-lg shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              <h3 className="font-bold text-neutral-900 text-sm uppercase tracking-wider">Technical Compliance Guarantee</h3>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed font-light">
              We strictly stock certified formulations matched directly to original manufacturer specifications (Sandtex Trade, Caplux Coatings). If you detect any formulation or packaging deviance, contact our technical oversight desk instantly at <a href="mailto:ajike_remalia@yahoo.com" className="font-bold hover:underline">ajike_remalia@yahoo.com</a>.
            </p>
          </div>

        </div>

        {/* Right Column: Lead Form */}
        <div className="lg:col-span-5 text-left">
          <div className="sticky top-28 space-y-6">
            <div className="bg-[#000650] text-white p-6 rounded-t-lg border-b border-neutral-800">
              <div className="flex items-center gap-2 text-xs text-[#7598f3] font-mono uppercase tracking-wider font-bold">
                <MessageSquare className="w-4 h-4" />
                <span>Immediate Inquiry Routing</span>
              </div>
              <h3 className="font-serif text-xl font-bold mt-2">Send a Message</h3>
              <p className="text-xs text-neutral-300 mt-1 font-light">
                Your message is routed instantly to the corresponding branch manager and monitored by our main Technical Desk.
              </p>
            </div>
            <div className="bg-white border-x border-b border-neutral-200 p-6 rounded-b-lg shadow-sm">
              <LeadForm />
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
