import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, X, ChevronRight, ChevronDown, Search, ShoppingCart, User, Phone } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { gsap } from '../lib/gsap';

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface SubCategory {
  label: string;
  href: string;
}

interface MegaSection {
  label: string;
  href: string;
  image?: string;
  imageAlt?: string;
  subcategories?: SubCategory[];
  defaultOpen?: boolean;
}

/* ─── Data ───────────────────────────────────────────────────────────────── */
const MEGA_SECTIONS: MegaSection[] = [
  {
    label: 'Auto Parts',
    href: '/catalog',
    image: '/categories/auto-parts.webp',
    imageAlt: 'Auto Parts — brake disc',
    subcategories: [
      { label: 'Braking System',         href: '/catalog/braking-system' },
      { label: 'Engine & Transmission',  href: '/catalog/engine-transmission' },
      { label: 'Suspension & Steering',  href: '/catalog/suspension-steering' },
      { label: 'Electrical & Lighting',  href: '/catalog/electrical-lighting' },
      { label: 'Cooling & Heating',      href: '/catalog/cooling-heating' },
      { label: 'Tires & Wheels',         href: '/catalog/tires-wheels' },
      { label: 'Exhaust System',         href: '/catalog/exhaust-system' },
    ],
    defaultOpen: true,
  },
  {
    label: 'Stationery',
    href: '/catalog/office-stationery',
    image: '/categories/pen-paper.webp',
    imageAlt: 'Office stationery',
    subcategories: [
      { label: 'Pens & Writing',         href: '/catalog/office-stationery#pens' },
      { label: 'Paper & Printing',       href: '/catalog/office-stationery#paper' },
      { label: 'Filing & Organisation',  href: '/catalog/office-stationery#filing' },
    ],
  },
  {
    label: 'MJ Mining',
    href: '/mining',
    image: '/homepage/diamond.webp',
    imageAlt: 'MJ Mining — diamonds & gold',
    subcategories: [
      { label: 'Diamond Sourcing',        href: '/mining#diamonds' },
      { label: 'Gold Sourcing',           href: '/mining#gold' },
      { label: 'Long-term Partnerships',  href: '/mining#partnerships' },
    ],
  },
];

const NAV_LINKS = [
  { label: 'About',   href: '/divisions' },
  { label: 'Contact', href: '/contact' },
];

/* ─── Component ──────────────────────────────────────────────────────────── */
export const SiteHeader: React.FC = () => {
  const { navigate, currentPath, currentUser, cartCount } = useApp();
  const [scrolled,       setScrolled]       = useState(false);
  const [megaOpen,       setMegaOpen]       = useState(false);
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [openSection,    setOpenSection]    = useState<number>(0);   // which accordion section
  const [mobileSection,  setMobileSection]  = useState<number>(-1);
  const [mobileProdOpen, setMobileProdOpen] = useState<boolean>(false);
  const [searchQuery,    setSearchQuery]    = useState('');
  const [searchVisible,  setSearchVisible]  = useState(false);

  const megaRef   = useRef<HTMLDivElement>(null);
  const navRef    = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  /* ── GSAP entrance animation (slides header down from top) ─── */
  useEffect(() => {
    if (!navRef.current) return;
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.1, clearProps: 'transform,opacity' }
    );
  }, []);

  /* scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* close mega on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* focus search input when revealed */
  useEffect(() => {
    if (searchVisible) searchRef.current?.focus();
  }, [searchVisible]);

  /* close mobile menu on route change */
  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
    setMobileProdOpen(false);
    setMobileSection(-1);
  }, [currentPath]);

  const go = useCallback((href: string) => {
    setMobileOpen(false);
    setMegaOpen(false);
    navigate(href);
  }, [navigate]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      go(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchVisible(false);
    }
  };

  /* header background: transparent when on hero page and not scrolled */
  const isHeroPage  = currentPath === '/';
  const isTransparent = isHeroPage && !scrolled && !megaOpen && !mobileOpen;

  const headerBase = isTransparent
    ? 'glass'
    : scrolled
      ? 'bg-white/95 shadow-md backdrop-blur-md border-b border-slate-200/60'
      : 'bg-white/90 backdrop-blur-sm border-b border-slate-200/40';

  const textColor  = isTransparent ? 'text-white' : 'text-[#0d1f3c]';
  const logoColor  = isTransparent ? 'text-white'  : 'text-[#0d1f3c]';
  const iconColor  = isTransparent ? 'text-white/80 hover:text-white' : 'text-slate-600 hover:text-[#0d1f3c]';

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBase}`}
      style={{ borderRadius: isTransparent ? '0 0 0 0' : undefined }}
    >
      {/* ── Main bar ─────────────────────────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-[68px]">

          {/* Logo */}
          <button
            type="button"
            onClick={() => go('/')}
            className={`flex flex-col leading-none cursor-pointer group shrink-0 ${logoColor}`}
            aria-label="MJ Logistics — home"
          >
            <span
              className="font-display text-[9px] font-bold uppercase opacity-70"
              style={{ letterSpacing: '0.35em', fontFamily: "'Chopin Trial', serif" }}
            >
              ENTERPRISE
            </span>
            <span
              className="font-display font-bold text-[20px] leading-none"
              style={{ fontFamily: "'Chopin Trial', serif", letterSpacing: '0.05em' }}
            >
              MJ Logistics
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2" aria-label="Main navigation">

            {/* Products & Services with mega dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => { setOpenSection(0); setMegaOpen(p => !p); }}
                onMouseEnter={() => { setOpenSection(0); setMegaOpen(true); }}
                aria-expanded={megaOpen}
                aria-haspopup="true"
                className={`
                  flex items-center gap-1.5 px-4 py-2 rounded-lg text-[15px] font-medium
                  transition-colors duration-150 cursor-pointer select-none
                  ${textColor}
                  ${megaOpen
                    ? (isTransparent ? 'bg-white/90' : 'bg-slate-100')
                    : 'hover:bg-white/90 lg:hover:bg-slate-100'}
                `}
              >
                <span className="font-display text-[16px]">Product and Services</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${megaOpen ? 'rotate-180' : ''}`}
                  strokeWidth={2}
                />
              </button>
            </div>

            {/* Other links */}
            {NAV_LINKS.map(link => (
              <button
                key={link.href}
                type="button"
                onClick={() => go(link.href)}
                className={`
                  px-4 py-2 rounded-lg text-[15px] font-medium font-display
                  transition-colors duration-150 cursor-pointer
                  hover:bg-white/90 lg:hover:bg-slate-100
                  ${textColor}
                  ${currentPath.startsWith(link.href) ? 'font-semibold' : ''}
                `}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right icons */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Search toggle */}
            <div className="relative">
              {searchVisible ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search parts…"
                    className="w-48 px-3 py-1.5 text-sm bg-white/90 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e4d8c] text-[#0d1f3c]"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchVisible(false)}
                    className="ml-1 p-1.5 cursor-pointer text-slate-400 hover:text-slate-700"
                    aria-label="Close search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchVisible(true)}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${iconColor}`}
                  aria-label="Open search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Account */}
            <button
              type="button"
              onClick={() => go(currentUser ? '/account' : '/signin')}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${iconColor}`}
              aria-label={currentUser ? 'My Account' : 'Sign In'}
            >
              <User className="w-5 h-5" />
            </button>

            {/* Cart */}
            <button
              type="button"
              onClick={() => go('/cart')}
              className={`relative p-2 rounded-lg transition-colors cursor-pointer ${iconColor}`}
              aria-label={`Cart (${cartCount} items)`}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#e8a020] text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(p => !p)}
            aria-expanded={mobileOpen}
            aria-label="Toggle menu"
            className={`lg:hidden p-2 rounded-lg cursor-pointer ${iconColor}`}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ── Mega Dropdown ─────────────────────────────────────────────────── */}
      {megaOpen && (
        <div
          ref={megaRef}
          className="hidden lg:block absolute left-1/2 -translate-x-1/2 mt-1"
          style={{ top: '100%', width: 'min(860px, calc(100vw - 48px))' }}
          onMouseLeave={() => setMegaOpen(false)}
          role="dialog"
          aria-label="Products & Services menu"
        >
          <div className="glass-dropdown rounded-2xl overflow-hidden animate-mega-drop">
            <div className="flex">
              {/* Sections accordion */}
              <div className="w-[220px] shrink-0 border-r border-white/30 py-4">
                {MEGA_SECTIONS.map((section, i) => (
                  <div key={section.label}>
                    <button
                      type="button"
                      onClick={() => { setOpenSection(i); go(section.href); setMegaOpen(false); }}
                      onMouseEnter={() => setOpenSection(i)}
                      className={`
                        w-full flex items-center justify-between px-5 py-3
                        text-[14px] font-semibold font-display transition-colors cursor-pointer
                        ${openSection === i
                          ? 'text-[#0d1f3c] bg-white/90'
                          : 'text-[#1a3560] hover:bg-white/70'}
                      `}
                    >
                      <span>{section.label}</span>
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 transition-transform duration-200 ${openSection === i ? 'rotate-90' : ''}`}
                        strokeWidth={2}
                      />
                    </button>
                  </div>
                ))}
              </div>

              {/* Subcategories panel */}
              <div className="flex-1 flex min-h-[260px]">
                {MEGA_SECTIONS[openSection] && (
                  <>
                    {/* Links list */}
                    <div className="flex-1 py-5 px-6">
                      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-3">
                        {MEGA_SECTIONS[openSection].label}
                      </p>
                      <ul className="space-y-1">
                        {MEGA_SECTIONS[openSection].subcategories?.map(sub => (
                          <li key={sub.label}>
                            <button
                              type="button"
                              onClick={() => go(sub.href)}
                              className="mega-sub-link w-full text-left text-[14px] font-medium text-[#0d1f3c] py-1.5 cursor-pointer"
                            >
                              {sub.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Product image */}
                    {MEGA_SECTIONS[openSection].image && (
                      <div className="w-[200px] shrink-0 flex flex-col items-center justify-center py-6 px-4 border-l border-white/25">
                        <div className="w-[140px] h-[140px] flex items-center justify-center">
                          <img
                            src={MEGA_SECTIONS[openSection].image}
                            alt={MEGA_SECTIONS[openSection].imageAlt}
                            className="max-w-full max-h-full object-contain drop-shadow-lg"
                            loading="lazy"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => go(MEGA_SECTIONS[openSection].href)}
                          className="mt-4 text-xs font-semibold text-[#0d1f3c] underline underline-offset-2 cursor-pointer hover:opacity-70 transition-opacity"
                        >
                          View all →
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Menu ───────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden glass-dark border-t border-white/10 animate-fade-in">
          <div className="max-w-[1200px] mx-auto px-6 py-4 space-y-1">

            {/* Mobile search */}
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search parts…"
                className="flex-1 px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button type="submit" className="px-4 py-2 bg-white/20 text-white text-sm rounded-lg cursor-pointer hover:bg-white/30 transition-colors">
                Go
              </button>
            </form>

            {/* Products & Services accordion */}
            <div className="border-b border-white/10">
              <button
                type="button"
                onClick={() => { setMobileProdOpen(p => !p); setMobileSection(-1); }}
                className="w-full flex items-center justify-between py-3 text-white font-display text-[16px] font-medium cursor-pointer"
              >
                <span>Product and Services</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileProdOpen ? 'rotate-180' : ''}`} />
              </button>

              {mobileProdOpen && (
                <div className="pl-4 pb-3 space-y-2 animate-fade-in">
                  {MEGA_SECTIONS.map((section, i) => (
                    <div key={section.label} className="border-b border-white/10 last:border-0">
                      <div className="flex items-center justify-between py-2.5">
                        <button
                          type="button"
                          onClick={() => { go(section.href); setMobileProdOpen(false); setMobileSection(-1); }}
                          className="flex-1 text-left text-white/85 font-display text-[15px] cursor-pointer hover:text-white transition-colors"
                        >
                          {section.label}
                        </button>
                        <button
                          type="button"
                          onClick={() => setMobileSection(prev => prev === i ? -1 : i)}
                          className="p-1 cursor-pointer"
                          aria-label={`Expand ${section.label}`}
                        >
                          <ChevronDown className={`w-3.5 h-3.5 text-white/60 transition-transform duration-200 ${mobileSection === i ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                      {mobileSection === i && (
                        <div className="pl-3 pb-2 space-y-0.5">
                          {section.subcategories?.map(sub => (
                            <button
                              key={`${section.label}-${sub.label}`}
                              type="button"
                              onClick={() => go(sub.href)}
                              className="block w-full text-left py-1.5 text-sm text-white/65 hover:text-white transition-colors cursor-pointer"
                            >
                              {sub.label}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => go(section.href)}
                            className="block w-full text-left py-1.5 text-xs font-bold text-white/50 hover:text-white transition-colors cursor-pointer"
                          >
                            View all {section.label} →
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {NAV_LINKS.map(link => (
              <button
                key={link.href}
                type="button"
                onClick={() => go(link.href)}
                className="w-full text-left py-3 border-b border-white/10 text-white font-display text-[16px] font-medium cursor-pointer"
              >
                {link.label}
              </button>
            ))}

            {/* Mobile utility row */}
            <div className="flex items-center gap-4 pt-3">
              <button type="button" onClick={() => go(currentUser ? '/account' : '/signin')} className="flex items-center gap-2 text-sm text-white/80 cursor-pointer hover:text-white">
                <User className="w-4 h-4" /> {currentUser ? 'Account' : 'Sign In'}
              </button>
              <button type="button" onClick={() => go('/cart')} className="flex items-center gap-2 text-sm text-white/80 cursor-pointer hover:text-white">
                <ShoppingCart className="w-4 h-4" /> Cart {cartCount > 0 && <span className="bg-[#e8a020] text-white text-xs px-1.5 py-0.5 rounded-full">{cartCount}</span>}
              </button>
              <div className="flex items-center gap-1.5 text-sm text-white/60 ml-auto">
                <Phone className="w-3.5 h-3.5" />
                <span>+251 XX XXX XXXX</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
