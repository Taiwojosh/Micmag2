import React, { useState, useEffect } from 'react';
import { Menu, X, PhoneCall, ChevronDown, Award, ShoppingBag, Sparkles, Paintbrush, Compass, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isCollectionsHovered, setIsCollectionsHovered] = useState(false);
  const [dropdownTimer, setDropdownTimer] = useState<any>(null);

  const [isAboutHovered, setIsAboutHovered] = useState(false);
  const [aboutDropdownTimer, setAboutDropdownTimer] = useState<any>(null);

  const handleMouseEnter = () => {
    if (dropdownTimer) clearTimeout(dropdownTimer);
    setIsCollectionsHovered(true);
  };

  const handleMouseLeave = () => {
    const timer = setTimeout(() => {
      setIsCollectionsHovered(false);
    }, 150);
    setDropdownTimer(timer);
  };

  const handleAboutMouseEnter = () => {
    if (aboutDropdownTimer) clearTimeout(aboutDropdownTimer);
    setIsAboutHovered(true);
  };

  const handleAboutMouseLeave = () => {
    const timer = setTimeout(() => {
      setIsAboutHovered(false);
    }, 150);
    setAboutDropdownTimer(timer);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Products', href: '/collections' },
    { name: 'Locations', href: '/locations' },
    { name: 'Contact', href: '/contact' },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  const handleLinkClick = (href: string, e: React.MouseEvent) => {
    if (window.location.pathname === href) {
      e.preventDefault();
      const pathIdMap: Record<string, string> = {
        '/': 'navbar',
        '/about': 'about',
        '/core-values': 'core-values',
        '/locations': 'service-locations',
      };
      const targetId = pathIdMap[href];
      if (targetId) {
        const element = document.getElementById(targetId);
        if (element) {
          const headerOffset = 145;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;
          
          window.scrollTo({
            top: href === '/' ? 0 : offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    }
  };

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-[100] flex flex-col w-full font-sans"
      style={{ borderRadius: '20px' }}
    >
      {/* Main Premium Navbar */}
      <motion.nav
        id="navbar"
        className={`w-full transition-all duration-500 relative ${
          scrolled
            ? 'shadow-md border-b border-neutral-200/50'
            : 'border-b border-neutral-200/30 shadow-sm'
        }`}
        style={{
          backgroundColor: '#7598f3',
          borderRadius: '18px',
          borderWidth: '0px',
          borderColor: 'rgba(0, 0, 0, 0.05)',
          borderStyle: 'solid',
          paddingTop: '6px',
          paddingBottom: '6px',
          paddingRight: '2px',
          paddingLeft: '2px',
          marginLeft: '5px',
          marginRight: '5px',
          marginTop: '5px',
          marginBottom: '5px'
        }}
      >
        {/* Animated Brand Background Orbs inside Navbar (Micmag logo color palette: Red, Blue, Green) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.18] z-0" style={{ borderRadius: '18px' }}>
          {/* Micmag Logo Red (#d32f2f) Orb */}
          <motion.div
            animate={{
              x: [-15, 30, -25, -15],
              y: [-10, 15, -5, -10],
              scale: [0.95, 1.2, 0.85, 0.95],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-12 left-[15%] w-[160px] h-[160px] rounded-full bg-[#d32f2f] filter blur-[40px]"
          />
          {/* Micmag Logo Blue (#1e3a5f) Orb */}
          <motion.div
            animate={{
              x: [25, -20, 15, 25],
              y: [10, -15, 5, 10],
              scale: [1.05, 0.85, 1.15, 1.05],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -bottom-16 left-1/2 w-[180px] h-[180px] rounded-full bg-[#1e3a5f] filter blur-[45px]"
          />
          {/* Micmag Logo Green (#1a6b3c) Orb */}
          <motion.div
            animate={{
              x: [-20, 15, -10, -20],
              y: [5, -12, 10, 5],
              scale: [0.9, 1.1, 0.95, 0.9],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-0 right-[20%] w-[150px] h-[150px] rounded-full bg-[#1a6b3c] filter blur-[35px]"
          />
        </div>

        {/* Ambient Whitener/Softener overlay to maximize contrast and keep text legible */}
        <div className="absolute inset-0 bg-white/70 backdrop-blur-xl z-0 pointer-events-none" style={{ borderRadius: '18px' }} />

        <div 
          className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8"
          style={{ borderRadius: '20px' }}
        >
          {/* Brand Logo Unit */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img src="./Logo.png" alt="Micmag Logo" className="transition-transform duration-300 group-hover:scale-105" style={{ paddingTop: '-20px', width: '55.8194px', height: '49px' }} />
              <div className="flex flex-col text-left">
                <span className="text-[23px] font-serif font-black tracking-[0.14em] text-brand-charcoal uppercase leading-none" style={{ fontSize: '23px', color: '#000082' }}>MICMAG</span>
                <span className="text-[8.5px] font-sans font-bold text-[#d32f2f] uppercase tracking-widest mt-0.5 opacity-90" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Homes & Fittings</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Links - Hidden below lg screen width for exceptional space reservation */}
          <ul className="hidden lg:flex items-center gap-6 xl:gap-8 list-none m-0 p-0 h-10" style={{ marginLeft: '106px' }}>
            {navLinks.map((link) => {
              const isAbout = link.name === 'About';
              return (
                <li 
                  key={link.name} 
                  className="relative h-full flex items-center"
                  onMouseEnter={isAbout ? handleAboutMouseEnter : undefined}
                  onMouseLeave={isAbout ? handleAboutMouseLeave : undefined}
                >
                  <div className="relative group/link py-1 flex items-center">
                    <Link
                      to={link.href}
                      onClick={(e) => handleLinkClick(link.href, e)}
                      className="text-[11px] xl:text-[0.80rem] font-bold tracking-[0.12em] uppercase text-brand-charcoal hover:text-brand-red transition-colors duration-300 flex items-center gap-1.5"
                      style={{ color: '#000082' }}
                    >
                      <span style={{ textAlign: 'center', color: '#000082' }}>{link.name}</span>
                      {isAbout && (
                        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${
                          isAboutHovered ? 'rotate-180 text-brand-red' : 'text-neutral-400'
                        }`} />
                      )}
                    </Link>
                    {/* Sliding underline cursor on hover */}
                    <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-gradient-to-r from-red-500 via-emerald-500 to-blue-500 transition-all duration-300 group-hover/link:w-full" />
                  </div>

                  {isAbout && (
                    <AnimatePresence>
                      {isAboutHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 12, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                          className="absolute top-[100%] left-1/2 -translate-x-1/2 w-80 bg-white shadow-2xl border border-neutral-200/90 rounded-[4px] p-4.5 z-[120] text-left mt-1.5"
                        >
                          {/* Elegant Pointer Arrow */}
                          <div className="absolute top-[-5px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-t border-l border-neutral-200/90 rotate-45 z-[-1]" />
                          
                          {/* Top Highlight Indicator */}
                          <div className="absolute top-0 inset-x-0 h-[3px] rounded-t-[4px] bg-gradient-to-r from-brand-red via-amber-500 to-amber-600" />
                          
                          <div className="space-y-4 pt-1">
                            <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                              <span className="text-[9.5px] font-mono font-bold tracking-wider text-brand-mid uppercase">
                                Information Division
                              </span>
                              <span className="text-[8px] bg-neutral-100/80 text-neutral-600 px-2 py-0.5 rounded uppercase font-bold font-mono">
                                Official Pages
                              </span>
                            </div>

                            <Link
                              to="/about"
                              onClick={(e) => {
                                setIsAboutHovered(false);
                                handleLinkClick('/about', e);
                              }}
                              className="group/item flex items-start gap-3.5 p-2 rounded-[3px] hover:bg-neutral-50/70 transition-all duration-200 cursor-pointer text-left"
                            >
                              <span className="flex-shrink-0 p-2.5 bg-red-50 text-brand-red rounded-full border border-red-100/40 transition-colors duration-300 group-hover/item:bg-brand-red group-hover/item:text-white">
                                <Award className="w-4 h-4" />
                              </span>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-[11.5px] font-black text-brand-charcoal group-hover/item:text-brand-red transition-colors font-serif">
                                  Our Legacy & Brand
                                </h4>
                                <p className="text-[10px] text-brand-mid font-light leading-relaxed mt-0.5">
                                  Learn about MICMAG's uncompromising premium partnership roots across West Africa.
                                </p>
                              </div>
                            </Link>

                            <Link
                              to="/core-values"
                              onClick={(e) => {
                                setIsAboutHovered(false);
                                handleLinkClick('/core-values', e);
                              }}
                              className="group/item flex items-start gap-3.5 p-2 rounded-[3px] hover:bg-neutral-50/70 transition-all duration-200 cursor-pointer text-left"
                            >
                              <span className="flex-shrink-0 p-2.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100/40 transition-colors duration-300 group-hover/item:bg-blue-600 group-hover/item:text-white">
                                <ShieldCheck className="w-4 h-4" />
                              </span>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-[11.5px] font-black text-brand-charcoal group-hover/item:text-blue-700 transition-colors font-serif">
                                  Our Core Values
                                </h4>
                                <p className="text-[10px] text-brand-mid font-light leading-relaxed mt-0.5">
                                  Material integrity, architectural design artistry, nationwide trust, and eco-stewardship.
                                </p>
                              </div>
                            </Link>

                            <Link
                              to="/specifications"
                              onClick={() => {
                                setIsAboutHovered(false);
                              }}
                              className="group/item flex items-start gap-3.5 p-2 rounded-[3px] hover:bg-neutral-50/70 transition-all duration-200 cursor-pointer text-left"
                            >
                              <span className="flex-shrink-0 p-2.5 bg-amber-50 text-amber-700 rounded-full border border-amber-100/40 transition-colors duration-300 group-hover/item:bg-amber-600 group-hover/item:text-white">
                                <Sparkles className="w-4 h-4" />
                              </span>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-[11.5px] font-black text-brand-charcoal group-hover/item:text-amber-800 transition-colors flex items-center gap-1 font-serif">
                                  CAP Plc Specifications
                                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse" />
                                </h4>
                                <p className="text-[10px] text-brand-mid font-light leading-relaxed mt-0.5">
                                  Authentic material savings metrics, 5-Star S-P-P-U-T model, and builder curriculum.
                                </p>
                              </div>
                            </Link>

                            <Link
                              to="/team"
                              onClick={() => {
                                setIsAboutHovered(false);
                              }}
                              className="group/item flex items-start gap-3.5 p-2 rounded-[3px] hover:bg-neutral-50/70 transition-all duration-200 cursor-pointer text-left"
                            >
                              <span className="flex-shrink-0 p-2.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100/40 transition-colors duration-300 group-hover/item:bg-emerald-600 group-hover/item:text-white">
                                <Compass className="w-4 h-4" />
                              </span>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-[11.5px] font-black text-brand-charcoal group-hover/item:text-emerald-700 transition-colors font-serif">
                                  Our Executive Team
                                </h4>
                                <p className="text-[10px] text-brand-mid font-light leading-relaxed mt-0.5">
                                  Meet our interior design consultants, paint specialists, and project coordinators.
                                </p>
                              </div>
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}


                </li>
              );
            })}
          </ul>

          {/* Action Call & CTA Frame */}
          <div 
            className="hidden lg:flex items-center gap-4.5" 
            style={{ 
              width: '250.683px', 
              height: '30px',
              paddingRight: '0px',
              paddingLeft: '0px'
            }}
          >
            <a
              href="tel:+2347052940445"
              className="flex items-center gap-2 text-xs font-sans font-bold uppercase text-brand-charcoal hover:text-brand-red transition-colors duration-200"
            >
              <PhoneCall className="w-3.5 h-3.5 text-brand-red" style={{ marginLeft: '100px' }} />
            </a>
            
            <Link
              to="/order"
              onClick={(e) => handleLinkClick('/order', e)}
              className="rounded-[10px] font-bold tracking-[0.11em] uppercase transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-1 hover:brightness-110 p-0"
              style={{
                color: '#04066b',
                backgroundColor: '#c80000',
                borderRadius: '10px',
                borderWidth: '0px',
                width: '90px',
                height: '30px',
                marginLeft: '0px',
                paddingLeft: '11px',
                paddingRight: '9px',
                fontSize: '15px'
              }}
            >
              <ShoppingBag style={{ width: '30.24324px', height: '18px' }} className="text-white" /> 
              <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 'bold', fontSize: '8px', textAlign: 'center', color: '#ffffff' }}>Order Swatch</span>
            </Link>
          </div>

          {/* Tablet & Mobile Menu Toggle Button */}
          <button 
            className="lg:hidden p-2 relative z-[110] text-brand-charcoal hover:bg-neutral-100 active:bg-neutral-200 transition-colors rounded"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Mobile Menu Slide-Over Workspace */}
          <AnimatePresence>
            {isMenuOpen && (
              <>
                {/* Backdrop Layer */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                  onClick={closeMenu}
                  className="fixed inset-0 z-[101] bg-black bg-opacity-40 lg:hidden"
                />
                
                <motion.div
                  initial={{ opacity: 0, x: '100%' }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                  className="lg:hidden fixed inset-y-0 right-0 z-[105] w-full max-w-[340px] h-screen shadow-2xl pt-24 px-6 flex flex-col justify-between pb-8 border-l border-neutral-100"
                  style={{ borderRadius: '20px', backgroundColor: '#c9d3ff' }}
                >
                  <div className="space-y-6 text-left">




                    {/* Navigation Directives */}
                    <ul className="flex flex-col gap-1.5 list-none m-0 p-0">
                      {navLinks.map((link) => {
                        const isAbout = link.name === 'About';
                        return (
                          <li key={link.name} className="flex flex-col">
                            <Link
                              to={link.href}
                              onClick={(e) => {
                                closeMenu();
                                handleLinkClick(link.href, e);
                              }}
                              className="text-sm font-black tracking-[0.08em] uppercase text-brand-charcoal hover:text-brand-red flex items-center justify-between py-3 border-b border-neutral-100/70 transition-colors"
                            >
                              <span>{link.name}</span>
                              <span className="text-neutral-300 text-xs font-mono">&rarr;</span>
                            </Link>
                            
                            {isAbout && (
                              <div className="pl-4 border-l border-neutral-200 mt-1.5 mb-1.5 flex flex-col space-y-1">
                                <Link
                                  to="/core-values"
                                  onClick={(e) => {
                                    closeMenu();
                                    handleLinkClick('/core-values', e);
                                  }}
                                  className="text-[10px] sm:text-[11px] font-bold text-neutral-500 hover:text-brand-red uppercase py-2 tracking-wider flex items-center gap-1.5 text-left"
                                >
                                  Our Core Values
                                </Link>
                                <Link
                                  to="/specifications"
                                  onClick={() => {
                                    closeMenu();
                                  }}
                                  className="text-[10px] sm:text-[11px] font-bold text-neutral-500 hover:text-brand-red uppercase py-2 tracking-wider flex items-center gap-1.5 text-left"
                                >
                                  CAP Specifications <span className="text-[8.5px] text-[#d32f2f] font-mono">(Dedicated CSR)</span>
                                </Link>
                                <Link
                                  to="/team"
                                  onClick={() => {
                                    closeMenu();
                                  }}
                                  className="text-[10px] sm:text-[11px] font-bold text-neutral-500 hover:text-brand-red uppercase py-2 tracking-wider flex items-center gap-1.5 text-left"
                                >
                                  Our Executive Team
                                </Link>
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Mobile Footer Block */}
                  <div className="space-y-4">
                    <div className="border-t border-neutral-200 pt-5 text-left">
                      <div className="text-[10px] font-mono uppercase text-brand-mid tracking-wider">Direct Liaison Line:</div>
                      <a href="tel:+2347052940445" className="text-sm font-black text-brand-charcoal hover:text-brand-red transition-colors inline-block mt-0.5">
                        +234 (0) 705 294 0445
                      </a>
                    </div>
                    
                    <Link
                      to="/order"
                      onClick={(e) => {
                        closeMenu();
                        handleLinkClick('/order', e);
                      }}
                      className="w-full text-center py-3.5 rounded-[3px] text-xs font-black tracking-[0.14em] uppercase transition-all duration-300 shadow-md block cursor-pointer hover:brightness-105"
                      style={{
                        backgroundColor: 'var(--color-brand-red)',
                        color: 'var(--color-brand-text-on-primary)'
                      }}
                    >
                      Order Sample Swatches
                    </Link>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
    </header>
  );
}
