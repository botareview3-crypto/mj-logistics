import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, User, Car, ChevronDown, Menu, X, Wrench } from 'lucide-react';
import { useApp } from '../lib/AppContext';

export const Header: React.FC = () => {
  const { navigate, currentUser, cartCount, activeVehicle, openSelectorModal } = useApp();
  const [searchQuery, setSearchQuery]   = useState('');
  const [scrolled, setScrolled]         = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [vehicleMenuOpen, setVehicleMenuOpen] = useState(false);
  const vehicleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (vehicleRef.current && !vehicleRef.current.contains(e.target as Node)) {
        setVehicleMenuOpen(false);
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
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="bg-[#0d1f3c] text-white text-xs py-2">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 text-white/70">
            <span>📦 Free shipping over €75</span>
            <span className="hidden sm:inline">✓ Guaranteed fitment</span>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => navigate(currentUser ? '/account' : '/signin')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1">
              <User className="w-3 h-3" /> {currentUser ? 'Account' : 'Sign In'}
            </button>
            <button type="button" onClick={() => navigate('/garage')} className="hover:text-white transition-colors cursor-pointer hidden sm:block">
              My Garage
            </button>
          </div>
        </div>
      </div>

      {/* ── Main bar ────────────────────────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center gap-4 h-[64px]">

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

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search parts, brands, OEM numbers…"
              className="w-full h-10 pl-4 pr-12 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e4d8c] focus:border-transparent transition-all"
              aria-label="Search parts"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0d1f3c] transition-colors cursor-pointer"
              aria-label="Submit search"
            >
              <Search className="w-4.5 h-4.5" />
            </button>
          </form>

          {/* Vehicle selector */}
          <div ref={vehicleRef} className="relative hidden md:block">
            <button
              type="button"
              onClick={() => {
                if (activeVehicle) setVehicleMenuOpen(p => !p);
                else openSelectorModal?.();
              }}
              className={`
                flex items-center gap-2 px-4 h-10 rounded-xl border text-sm font-medium transition-all cursor-pointer
                ${activeVehicle
                  ? 'bg-[#0d1f3c] text-white border-[#0d1f3c] hover:bg-[#1a3560]'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-[#0d1f3c]'
                }
              `}
            >
              <Car className="w-4 h-4 shrink-0" />
              <span className="max-w-[140px] truncate">{vehicleLabel}</span>
              {activeVehicle && <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${vehicleMenuOpen ? 'rotate-180' : ''}`} />}
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

          {/* Cart */}
          <button
            type="button"
            onClick={() => navigate('/cart')}
            className="relative p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-[#0d1f3c] hover:text-white hover:border-[#0d1f3c] transition-all cursor-pointer"
            aria-label={`Cart (${cartCount} items)`}
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-[#e8a020] text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(p => !p)}
            className="md:hidden p-2 text-slate-600 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Category nav strip ──────────────────────────────────────────── */}
      <div className="hidden lg:block border-t border-slate-100 bg-[#f8f9fa]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center gap-1 h-10 overflow-x-auto scrollbar-none">
            {[
              { label: 'Braking System',       href: '/catalog/braking-system' },
              { label: 'Engine & Transmission', href: '/catalog/engine-transmission' },
              { label: 'Suspension',            href: '/catalog/suspension-steering' },
              { label: 'Electrical',            href: '/catalog/electrical-lighting' },
              { label: 'Exhaust',               href: '/catalog/exhaust-system' },
              { label: 'Tires & Wheels',        href: '/catalog/tires-wheels' },
              { label: 'Car Care',              href: '/catalog/car-care-detailing' },
              { label: 'Tools',                 href: '/catalog/tools-workshop' },
              { label: 'Office Supplies',       href: '/catalog/office-stationery' },
            ].map(item => (
              <button
                key={item.href}
                type="button"
                onClick={() => navigate(item.href)}
                className="shrink-0 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-[#0d1f3c] hover:bg-white rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile menu ─────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 animate-fade-in-down">
          <div className="max-w-[1200px] mx-auto px-6 py-4 space-y-3">
            <button
              type="button"
              onClick={() => { openSelectorModal?.(); setMobileOpen(false); }}
              className="w-full flex items-center gap-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 cursor-pointer"
            >
              <Car className="w-4 h-4" />
              {vehicleLabel}
            </button>

            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                { label: 'My Garage', href: '/garage' },
                { label: 'Catalog',   href: '/catalog' },
                { label: 'Shop',      href: '/shop' },
                { label: 'Search',    href: '/search' },
                { label: 'Account',   href: currentUser ? '/account' : '/signin' },
                { label: 'Cart',      href: '/cart' },
              ].map(link => (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => { navigate(link.href); setMobileOpen(false); }}
                  className="px-4 py-2.5 bg-slate-50 rounded-lg text-slate-700 hover:bg-slate-100 text-left cursor-pointer font-medium"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
