import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Award, ShieldCheck, MapPin, ExternalLink } from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer 
        className="text-[#a1a1aa] pt-20 pb-12 px-5 md:px-[5%] border-t border-neutral-900 relative overflow-hidden bg-[#820000]"
        style={{ borderRadius: '30px 30px 0 0' }}
      >
        
        {/* Decorative horizontal color bands at the top of the footer (signature paint theme detail) */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex">
          <span className="flex-1 bg-[#d32f2f]" />
          <span className="flex-1 bg-[#FF6B00]" />
          <span className="flex-1 bg-brand-blue" />
          <span className="flex-1 bg-[#FF6B00]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Main Footer Columns */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 pb-16 border-b border-neutral-800/80 mb-10">
            
            {/* Column 1: Brand Identity */}
            <div className="md:col-span-4 space-y-5">
              <div className="flex items-center gap-2">
                <img src="./Logo.png" alt="Micmag Logo" className="h-10 w-auto bg-white p-1 rounded" />
                <div className="flex flex-col text-left">
                  <span className="text-sm font-serif font-black text-white tracking-widest uppercase">MICMAG</span>
                  <span className="text-[8px] font-mono font-bold text-[#d32f2f] uppercase tracking-widest">Homes & Fittings</span>
                </div>
              </div>
              
              <p className="text-[12.5px] leading-relaxed text-neutral-400 font-light max-w-sm">
                Micmag Homes & Fittings is Lagos' leading dealer of genuine architectural materials. From the climate-resilience of <strong>SANDTEX</strong> paints, to the high-integrity <strong>CAPLUX</strong> surface preparation preps and industrial primers, we are committed to uncompromising physical quality.
              </p>

              {/* Verified Badge */}
              <div className="inline-flex items-center gap-2 bg-neutral-900/60 border border-neutral-800 p-2 px-3 rounded text-[11px] text-brand-yellow font-mono">
                <ShieldCheck className="w-4 h-4 text-brand-yellow" /> Authentic Sourcing Guarantee
              </div>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="md:col-span-3">
              <h4 className="text-[11px] font-mono font-extrabold tracking-[0.18em] uppercase text-white mb-6">
                Quick Directory
              </h4>
              <ul className="list-none m-0 p-0 flex flex-col gap-3.5 text-xs text-left">
                <li>
                  <Link to="/" className="hover:text-white transition duration-200">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/collections" className="hover:text-white transition duration-200">
                    E-Commerce Products
                  </Link>
                </li>
                <li>
                  <Link to="/team" className="hover:text-white transition duration-200">
                    Technical & leadership Team
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition duration-200">
                    Contact HQ &amp; Regional Desks
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact Directory */}
            <div className="md:col-span-5 space-y-6">
              <h4 className="text-[11px] font-mono font-extrabold tracking-[0.18em] uppercase text-white">
                Direct Sales Desks
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-left">
                
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold block">
                    Sales Management
                  </span>
                  <a href="mailto:micmaghomesfittings@gmail.com" className="text-white hover:underline block truncate flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-neutral-600" /> micmaghomesfittings@gmail.com
                  </a>
                  <a href="mailto:kosimicmag@gmail.com" className="hover:underline text-neutral-300 block truncate leading-relaxed">
                    kosimicmag@gmail.com
                  </a>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold block">
                    Technical Desk
                  </span>
                  <a href="mailto:ajike_remalia@yahoo.com" className="text-white hover:underline block truncate flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-neutral-600" /> ajike_remalia@yahoo.com
                  </a>
                  <a href="tel:+2347052940445" className="text-white hover:underline block truncate flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-neutral-600" /> +234 705 294 0445 (HQ)
                  </a>
                  <span className="text-[10px] text-neutral-500 block">
                    Mon - Sat: 8:00 AM - 6:00 PM
                  </span>
                </div>

              </div>

              {/* Physical Address Footnote */}
              <div className="pt-2 border-t border-neutral-800/60 text-[11px] text-neutral-400 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#d32f2f] mt-0.5 flex-shrink-0" />
                <p>Offices in Oworonshoki (HQ), Sangotedo, Alakija, Ikorodu, Ogbombo, and Bogije. Nationwide container site drops directly coordinated daily.</p>
              </div>

            </div>

          </div>

          {/* Bottom Copyright desk */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-[11px] text-neutral-500 font-mono">
            <span>&copy; {currentYear} Micmag Homes & Fittings. RC Registered Authorized Dealer.</span>
          </div>

        </div>
      </footer>

      {/* Floating WhatsApp Action Button */}
      <button
        onClick={() => openWhatsApp('2347052940445')}
        className="fixed bottom-8 right-8 z-[90] bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-400/40 cursor-pointer"
        title="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </button>
    </>
  );
}
