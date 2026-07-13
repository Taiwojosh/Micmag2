import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, PhoneCall, ChevronDown, Award, ShoppingBag, Sparkles, ShieldCheck, Users, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

// ─── Dropdown config ────────────────────────────────────────────────────────

const ABOUT_ITEMS = [
  {
    href: '/#about',
    label: 'Our Legacy & Brand',
    desc: 'MICMAG\'s premium partnership roots across West Africa.',
    icon: Award,
    color: { bg: 'bg-red-50', text: 'text-brand-red', hover: 'group-hover/item:bg-brand-red group-hover/item:text-white', border: 'border-red-100/40', hoverText: 'group-hover/item:text-brand-red' },
  },
  {
    href: '/#core-values',
    label: 'Our Core Values',
    desc: 'Material integrity, design artistry, and nationwide trust.',
    icon: ShieldCheck,
    color: { bg: 'bg-blue-50', text: 'text-blue-600', hover: 'group-hover/item:bg-blue-600 group-hover/item:text-white', border: 'border-blue-100/40', hoverText: 'group-hover/item:text-blue-700' },
  },
  {
    href: '/specifications',
    label: 'CAP Plc Specifications',
    desc: 'Certified paint data sheets & builder yield calculators.',
    icon: Sparkles,
    badge: true,
    color: { bg: 'bg-amber-50', text: 'text-amber-700', hover: 'group-hover/item:bg-amber-600 group-hover/item:text-white', border: 'border-amber-100/40', hoverText: 'group-hover/item:text-amber-800' },
  },
];

const CONTACT_ITEMS = [
  {
    href: '/contact',
    label: 'Contact HQ',
    desc: 'Reach our Lagos stores by phone, WhatsApp, or in person.',
    icon: MessageSquare,
    color: { bg: 'bg-emerald-50', text: 'text-emerald-600', hover: 'group-hover/item:bg-emerald-600 group-hover/item:text-white', border: 'border-emerald-100/40', hoverText: 'group-hover/item:text-emerald-700' },
  },
  {
    href: '/team',
    label: 'Our Team',
    desc: 'Meet our paint specialists, designers, and project coordinators.',
    icon: Users,
    color: { bg: 'bg-purple-50', text: 'text-purple-600', hover: 'group-hover/item:bg-purple-600 group-hover/item:text-white', border: 'border-purple-100/40', hoverText: 'group-hover/item:text-purple-700' },
  },
];

// ─── Dropdown Panel ──────────────────────────────────────────────────────────

interface DropdownItem {
  href: string;
  label: string;
  desc: string;
  icon: React.ElementType;
  badge?: boolean;
  color: { bg: string; text: string; hover: string; border: string; hoverText: string };
}

function DropdownPanel({
  items,
  onClose,
  onLinkClick,
}: {
  items: DropdownItem[];
  onClose: () => void;
  onLinkClick: (href: string, e: React.MouseEvent) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.97 }}
      transition={{ duration: 0.16, ease: 'easeOut' }}
      className="absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 w-72 bg-white shadow-2xl border border-neutral-200/80 rounded-xl overflow-hidden z-[120] text-left"
    >
      {/* Top accent bar */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#d32f2f] via-[#b45309] to-[#ea6c00]" />

      <div className="p-3 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={(e) => {
                onClose();
                onLinkClick(item.href, e);
              }}
              className="group/item flex items-start gap-3 p-2.5 rounded-lg hover:bg-neutral-50 transition-all duration-150 cursor-pointer"
            >
              <span className={`flex-shrink-0 p-2 ${item.color.bg} ${item.color.text} rounded-lg border ${item.color.border} transition-all duration-200 ${item.color.hover} mt-0.5`}>
                <Icon className="w-3.5 h-3.5" />
              </span>
              <div className="flex-1 min-w-0">
                <span className={`flex items-center gap-1.5 text-[11.5px] font-black text-[#1c1917] ${item.color.hoverText} transition-colors font-sans`}>
                  {item.label}
                  {item.badge && <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                </span>
                <p className="text-[10px] text-[#78716c] font-light leading-relaxed mt-0.5">{item.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Main Header ─────────────────────────────────────────────────────────────

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'about' | 'contact' | null>(null);
  const dropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = (name: 'about' | 'contact') => {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
    setOpenDropdown(name);
  };

  const scheduleClose = () => {
    dropdownTimer.current = setTimeout(() => setOpenDropdown(null), 160);
  };

  const closeDropdown = () => {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
    setOpenDropdown(null);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  const handleLinkClick = (href: string, e: React.MouseEvent) => {
    const isHomePage = window.location.pathname === '/';
    
    // Check if the link is a homepage hash link
    if (isHomePage && href.startsWith('/#')) {
      e.preventDefault();
      const targetHash = href.substring(1); // e.g. '#about'
      const hashIdMap: Record<string, string> = {
        '#about': 'about',
        '#core-values': 'core-values',
        '#locations': 'service-locations',
      };
      const targetId = hashIdMap[targetHash];
      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) {
          const offset = el.getBoundingClientRect().top + window.scrollY - 145;
          window.scrollTo({ top: offset, behavior: 'smooth' });
          // Update URL hash without causing standard jumpy scroll behavior
          window.history.pushState(null, '', href);
        }
      }
    } else if (isHomePage && href === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.pushState(null, '', '/');
    }
  };

  // Simple flat nav links (no dropdown)
  const flatLinks: { name: string; href: string }[] = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/collections' },
    { name: 'Locations', href: '/#locations' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] flex flex-col w-full font-sans">
      <motion.nav
        id="navbar"
        className={`w-full transition-all duration-500 relative ${
          scrolled ? 'shadow-md border-b border-neutral-200/50' : 'shadow-sm border-b border-white/20'
        }`}
        style={{
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(250, 249, 245, 0.8)',
          borderRadius: '18px',
          margin: '5px',
          width: 'calc(100% - 10px)',
          paddingTop: '6px',
          paddingBottom: '6px',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        {/* Animated background orbs - warm brand accents */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.12] z-0" style={{ borderRadius: '18px' }}>
          <motion.div
            animate={{ x: [-15, 30, -25, -15], y: [-10, 15, -5, -10], scale: [0.95, 1.2, 0.85, 0.95] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-12 left-[15%] w-40 h-40 rounded-full bg-[#d32f2f] filter blur-[40px]"
          />
          <motion.div
            animate={{ x: [25, -20, 15, 25], y: [10, -15, 5, 10], scale: [1.05, 0.85, 1.15, 1.05] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-16 left-1/2 w-44 h-44 rounded-full bg-amber-500 filter blur-[45px]"
          />
          <motion.div
            animate={{ x: [-20, 15, -10, -20], y: [5, -12, 10, 5], scale: [0.9, 1.1, 0.95, 0.9] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-0 right-[20%] w-36 h-36 rounded-full bg-amber-600 filter blur-[35px]"
          />
        </div>

        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-white/40 z-0 pointer-events-none" style={{ borderRadius: '18px' }} />

        <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <img src="./Logo.png" alt="Micmag Logo" className="transition-transform duration-300 group-hover:scale-105" style={{ width: '55px', height: '49px' }} />
            <div className="flex flex-col text-left">
              <span className="text-[23px] font-serif font-black tracking-[0.14em] uppercase leading-none" style={{ color: '#1c1917' }}>MICMAG</span>
              <span className="text-[8.5px] font-sans font-bold text-[#d32f2f] uppercase tracking-widest mt-0.5 opacity-90">Homes & Fittings</span>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <ul className="hidden lg:flex items-center gap-7 xl:gap-9 list-none m-0 p-0 h-10">

            {/* Flat links */}
            {flatLinks.map((link) => (
              <li key={link.name} className="relative h-full flex items-center">
                <div className="relative group/link py-1 flex items-center">
                  <Link
                    to={link.href}
                    onClick={(e) => handleLinkClick(link.href, e)}
                    className="text-[11px] xl:text-[0.79rem] font-bold tracking-[0.12em] uppercase transition-colors duration-300 hover:text-[#d32f2f]"
                    style={{ color: '#1c1917' }}
                  >
                    {link.name}
                  </Link>
                  <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-gradient-to-r from-amber-600 via-orange-500 to-[#d32f2f] transition-all duration-300 group-hover/link:w-full" />
                </div>
              </li>
            ))}

            {/* About dropdown */}
            <li
              className="relative h-full flex items-center"
              onMouseEnter={() => openMenu('about')}
              onMouseLeave={scheduleClose}
            >
              <div className="relative group/link py-1 flex items-center gap-1 cursor-pointer">
                <Link
                  to="/#about"
                  onClick={(e) => handleLinkClick('/#about', e)}
                  className="text-[11px] xl:text-[0.79rem] font-bold tracking-[0.12em] uppercase transition-colors duration-300 hover:text-[#d32f2f]"
                  style={{ color: '#1c1917' }}
                >
                  About
                </Link>
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${openDropdown === 'about' ? 'rotate-180 text-[#d32f2f]' : 'text-neutral-400'}`} />
                <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-gradient-to-r from-amber-600 via-orange-500 to-[#d32f2f] transition-all duration-300 group-hover/link:w-full" />
              </div>

              <AnimatePresence>
                {openDropdown === 'about' && (
                  <div onMouseEnter={() => openMenu('about')} onMouseLeave={scheduleClose}>
                    <DropdownPanel items={ABOUT_ITEMS} onClose={closeDropdown} onLinkClick={handleLinkClick} />
                  </div>
                )}
              </AnimatePresence>
            </li>

            {/* Contact dropdown */}
            <li
              className="relative h-full flex items-center"
              onMouseEnter={() => openMenu('contact')}
              onMouseLeave={scheduleClose}
            >
              <div className="relative group/link py-1 flex items-center gap-1 cursor-pointer">
                <Link
                  to="/contact"
                  onClick={(e) => handleLinkClick('/contact', e)}
                  className="text-[11px] xl:text-[0.79rem] font-bold tracking-[0.12em] uppercase transition-colors duration-300 hover:text-[#d32f2f]"
                  style={{ color: '#1c1917' }}
                >
                  Contact
                </Link>
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${openDropdown === 'contact' ? 'rotate-180 text-[#d32f2f]' : 'text-neutral-400'}`} />
                <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-gradient-to-r from-amber-600 via-orange-500 to-[#d32f2f] transition-all duration-300 group-hover/link:w-full" />
              </div>

              <AnimatePresence>
                {openDropdown === 'contact' && (
                  <div onMouseEnter={() => openMenu('contact')} onMouseLeave={scheduleClose}>
                    <DropdownPanel items={CONTACT_ITEMS} onClose={closeDropdown} onLinkClick={handleLinkClick} />
                  </div>
                )}
              </AnimatePresence>
            </li>

          </ul>

          {/* ── Desktop CTA ── */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:+2347052940445"
              className="flex items-center gap-1.5 text-[11px] font-bold uppercase hover:text-[#d32f2f] transition-colors duration-200"
              style={{ color: '#1c1917' }}
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#d32f2f]" />
              <span className="hidden xl:inline tracking-wider">Call Us</span>
            </a>

            <Link
              to="/order"
              className="flex items-center gap-1.5 rounded-[10px] font-bold tracking-[0.1em] uppercase transition-all duration-300 shadow-sm hover:shadow-md hover:brightness-110 px-3 py-1.5"
              style={{ backgroundColor: '#d32f2f', color: '#ffffff', fontSize: '10px' }}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Order Swatch
            </Link>
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            className="lg:hidden p-2 relative z-[110] text-brand-charcoal hover:bg-neutral-100 active:bg-neutral-200 transition-colors rounded"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* ── Mobile slide-over ── */}
          <AnimatePresence>
            {isMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }}
                  onClick={closeMenu}
                  className="fixed inset-0 z-[101] bg-black lg:hidden"
                />

                <motion.div
                  initial={{ opacity: 0, x: '100%' }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                  className="lg:hidden fixed inset-y-0 right-0 z-[105] w-full max-w-[320px] h-screen shadow-2xl pt-24 px-6 flex flex-col justify-between pb-8"
                  style={{ 
                    borderRadius: '20px 0 0 20px', 
                    backgroundColor: 'rgba(253, 253, 251, 0.97)', 
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderLeft: '1px solid rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <div className="space-y-1 text-left">

                    {/* Home */}
                    <Link to="/" onClick={(e) => { closeMenu(); handleLinkClick('/', e); }}
                      className="flex items-center justify-between py-3 border-b border-neutral-200 text-sm font-black tracking-[0.08em] uppercase text-[#1c1917] hover:text-[#d32f2f] transition-colors">
                      <span>Home</span><span className="text-neutral-400 text-xs">→</span>
                    </Link>

                    {/* Products */}
                    <Link to="/collections" onClick={closeMenu}
                      className="flex items-center justify-between py-3 border-b border-neutral-200 text-sm font-black tracking-[0.08em] uppercase text-[#1c1917] hover:text-[#d32f2f] transition-colors">
                      <span>Products</span><span className="text-neutral-400 text-xs">→</span>
                    </Link>

                    {/* Locations */}
                    <Link to="/#locations" onClick={(e) => { closeMenu(); handleLinkClick('/#locations', e); }}
                      className="flex items-center justify-between py-3 border-b border-neutral-200 text-sm font-black tracking-[0.08em] uppercase text-[#1c1917] hover:text-[#d32f2f] transition-colors">
                      <span>Locations</span><span className="text-neutral-400 text-xs">→</span>
                    </Link>

                    {/* About section */}
                    <div className="py-2 border-b border-neutral-200">
                      <Link to="/#about" onClick={(e) => { closeMenu(); handleLinkClick('/#about', e); }}
                        className="flex items-center justify-between text-sm font-black tracking-[0.08em] uppercase text-[#1c1917] hover:text-[#d32f2f] transition-colors pb-2">
                        <span>About</span>
                      </Link>
                      <div className="pl-3 border-l-2 border-[#1c1917]/10 space-y-0.5">
                        {ABOUT_ITEMS.map(item => (
                          <Link key={item.href} to={item.href} onClick={(e) => { closeMenu(); handleLinkClick(item.href, e); }}
                            className="flex items-center gap-2 py-1.5 text-[11px] font-bold uppercase text-[#1c1917]/70 hover:text-[#d32f2f] tracking-wider transition-colors">
                            <item.icon className="w-3 h-3 flex-shrink-0" />
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Contact section */}
                    <div className="py-2">
                      <Link to="/contact" onClick={closeMenu}
                        className="flex items-center justify-between text-sm font-black tracking-[0.08em] uppercase text-[#1c1917] hover:text-[#d32f2f] transition-colors pb-2">
                        <span>Contact</span>
                      </Link>
                      <div className="pl-3 border-l-2 border-[#1c1917]/10 space-y-0.5">
                        {CONTACT_ITEMS.map(item => (
                          <Link key={item.href} to={item.href} onClick={closeMenu}
                            className="flex items-center gap-2 py-1.5 text-[11px] font-bold uppercase text-[#1c1917]/70 hover:text-[#d32f2f] tracking-wider transition-colors">
                            <item.icon className="w-3 h-3 flex-shrink-0" />
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Mobile footer */}
                  <div className="space-y-3">
                    <div className="border-t border-neutral-200 pt-4 text-left">
                      <div className="text-[10px] font-mono uppercase text-[#1c1917]/60 tracking-wider">Direct line</div>
                      <a href="tel:+2347052940445" className="text-sm font-black text-[#1c1917] hover:text-[#d32f2f] transition-colors inline-block mt-0.5">
                        +234 (0) 705 294 0445
                      </a>
                    </div>
                    <Link
                      to="/order"
                      onClick={closeMenu}
                      className="w-full text-center py-3 rounded-xl text-xs font-black tracking-[0.14em] uppercase transition-all duration-300 shadow-md block hover:brightness-105"
                      style={{ backgroundColor: '#d32f2f', color: '#ffffff' }}
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
