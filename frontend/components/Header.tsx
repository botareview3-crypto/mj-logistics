import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, User, Car, ChevronDown, Menu, X, Wrench, ChevronRight } from 'lucide-react';
import { useApp } from '../lib/AppContext';

const CATALOG_ITEMS = [
  { label: 'Braking System',        href: '/catalog/braking-system' },
  { label: 'Engine & Transmission', href: '/catalog/engine-transmission' },
  { label: 'Suspension & Steering', href: '/catalog/suspension-steering' },
  { label: 'Electrical & Lighting', href: '/catalog/electrical-lighting' },
  { label: 'Exhaust System',        href: '/catalog/exhaust-system' },
  { label: 'Tires & Wheels',        href: '/catalog/tires-wheels' },
  { label: 'Car Care & Detailing',  href: '/catalog/car-care-detailing' },
  { label: 'Tools & Workshop',      href: '/catalog/tools-workshop' },
  { label: 'Office Supplies',       href: '/catalog/office-stationery' },
  { label: 'Business Equipment',    href: '/catalog/business-equipment' },
  { label: 'Cooling & Heating',     href: '/catalog/cooling-heating' },
];

export const Header: React.FC = () => {
  const { navigate, currentUser, cartCount, activeVehicle, openSelectorModal } = useApp();
  const [searchQuery, setSearchQuery]     = useState('');
  const [scrolled, setScrolled]           = useState(false);
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [vehicleMenuOpen, setVehicleMenuOpen] = useState(false);
  const [catalogOpen, setCatalogOpen]     = useState(false);

  const vehicleRef = useRef<HTMLDivElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (vehicleRef.current && !vehicleRef.current.contains(e.target as Node)) {
        setVehicleMenuOpen(false);
      }
      if (catalogRef.current && !catalogRef.current.contains(e.target as Node)) {
        setCatalogOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const vehicleLabel = activeVehicle
    ? `${activeVehicle.make} ${activeVehicle.model}`
    : 'Select Vehicle';

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white shadow-md border-b border-slate-200'
          : 'bg-white border-b border-slate-100'
      }`}
    >
      {/* ── Main bar ────────────────────────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 h-[64px]">

          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 shrink-0 cursor-pointer group"
            aria-label="MJ Logistics — home"
          >
            <div className="w-8 h-8 bg-[#0d1f3c] rounded-lg flex items-center justify-center">
              <Wrench className="w-4 h-4 text-white -rotate-12" />
            </div>
            <div className="hidden sm:block leading-none">
              <span className="font-display text-[18px] font-bold text-[#0d1f3c] block">MJ</span>
              <span className="font-display text-[10px] font-medium text-slate-500 uppercase tracking-widest">Logistics</span>
            </div>
          </button>

          {/* Catalog dropdown button */}
          <div ref={catalogRef} className="relative hidden lg:block shrink-0">
            <button
              type="button"
              onClick={() => setCatalogOpen(p => !p)}
              className="flex items-center gap-1.5 px-4 h-10 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-[#0d1f3c] hover:border-[#0d1f3c] transition-all cursor-pointer whitespace-nowrap"
            >
              Catalog
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${catalogOpen ? 'rotate-180' : ''}`} />
            </button>

            {catalogOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-xl py-2 z-50 animate-fade-in-down">
                {CATALOG_ITEMS.map(item => (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => { navigate(item.href); setCatalogOpen(false); }}
                    className="w-full text-left px-4 py-2 text-[13px] text-slate-700 hover:bg-slate-50 hover:text-[#0d1f3c] transition-colors cursor-pointer flex items-center justify-between group"
                  >
                    {item.label}
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#0d1f3c] transition-colors" />
                  </button>
                ))}
                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button
                    type="button"
                    onClick={() => { navigate('/catalog'); setCatalogOpen(false); }}
                    className="w-full text-left px-4 py-2 text-[13px] font-bold text-[#0d1f3c] hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    View All Categories →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search parts, brands, OEM numbers…"
              className="w-full h-10 pl-4 pr-10 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0d1f3c] transition-colors"
              aria-label="Search parts"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0d1f3c] transition-colors cursor-pointer"
              aria-label="Submit search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Vehicle selector */}
          <div ref={vehicleRef} className="relative hidden md:block shrink-0">
            <button
              type="button"
              onClick={() => {
                if (activeVehicle) setVehicleMenuOpen(p => !p);
                else openSelectorModal?.();
              }}
              className={`
                flex items-center gap-2 px-4 h-10 rounded-xl border text-sm font-medium transition-all cursor-pointer whitespace-nowrap
                ${activeVehicle
                  ? 'bg-[#0d1f3c] text-white border-[#0d1f3c] hover:bg-[#1a3560]'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-[#0d1f3c]'}
              `}
            >
              <Car className="w-4 h-4 shrink-0" />
              <span className="max-w-[130px] truncate">{vehicleLabel}</span>
              {activeVehicle && (
                <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${vehicleMenuOpen ? 'rotate-180' : ''}`} />
              )}
            </button>

            {vehicleMenuOpen && activeVehicle && (
              <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-xl border border-slate-200 shadow-xl py-2 z-50 animate-fade-in-down">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Active vehicle</p>
                  <p className="text-sm font-semibold text-[#0d1f3c] mt-0.5">{activeVehicle.make} {activeVehicle.model}</p>
                  {activeVehicle.year && <p className="text-[12px] text-slate-500">{activeVehicle.year}</p>}
                </div>
                <button type="button" onClick={() => { navigate('/garage'); setVehicleMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">My Garage</button>
                <button type="button" onClick={() => { openSelectorModal?.(); setVehicleMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">Change vehicle</button>
              </div>
            )}
          </div>

          {/* Sign In — desktop, next to vehicle */}
          <button
            type="button"
            onClick={() => navigate(currentUser ? '/account' : '/signin')}
            className="hidden md:flex items-center gap-1.5 px-3 h-10 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-600 hover:border-[#0d1f3c] hover:text-[#0d1f3c] transition-all cursor-pointer shrink-0"
          >
            <User className="w-4 h-4" />
            {currentUser ? 'Account' : 'Sign In'}
          </button>

          {/* Cart */}
          <button
            type="button"
            onClick={() => navigate('/cart')}
            className="relative p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-[#0d1f3c] hover:text-white hover:border-[#0d1f3c] transition-all cursor-pointer shrink-0"
            aria-label={`Cart (${cartCount} items)`}
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#e8a020] text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(p => !p)}
            className="md:hidden p-2 text-slate-600 cursor-pointer shrink-0"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ─────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 animate-fade-in-down">
          <div className="max-w-[1200px] mx-auto px-4 py-4 space-y-3">
            {/* Vehicle selector */}
            <button
              type="button"
              onClick={() => { openSelectorModal?.(); setMobileOpen(false); }}
              className="w-full flex items-center gap-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 cursor-pointer"
            >
              <Car className="w-4 h-4" />
              {vehicleLabel}
            </button>

            {/* Sign in row */}
            <button
              type="button"
              onClick={() => { navigate(currentUser ? '/account' : '/signin'); setMobileOpen(false); }}
              className="w-full flex items-center gap-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 cursor-pointer"
            >
              <User className="w-4 h-4" />
              {currentUser ? 'My Account' : 'Sign In'}
            </button>

            {/* Catalog links */}
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 pt-1">Catalog</p>
              <div className="grid grid-cols-2 gap-1.5">
                {CATALOG_ITEMS.map(item => (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => { navigate(item.href); setMobileOpen(false); }}
                    className="px-3 py-2.5 bg-slate-50 rounded-lg text-[12px] text-slate-700 hover:bg-slate-100 text-left cursor-pointer font-medium"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => { navigate('/cart'); setMobileOpen(false); }} className="flex-1 px-4 py-2.5 bg-[#0d1f3c] text-white text-sm font-semibold rounded-xl cursor-pointer">Cart {cartCount > 0 ? `(${cartCount})` : ''}</button>
              <button type="button" onClick={() => { navigate('/garage'); setMobileOpen(false); }} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer">My Garage</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
