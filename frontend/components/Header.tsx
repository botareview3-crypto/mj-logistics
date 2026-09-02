import React, { useState, useRef, useEffect } from 'react';
import { Car, Search, ShoppingCart, ChevronDown, X, Menu, Phone, ShieldCheck, Truck, RotateCcw, Wrench, CheckCircle2, User, ArrowRight } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { MegaMenu } from './MegaMenu';
import { PARTS_DATABASE } from '../lib/data/parts';

export const Header: React.FC = () => {
  const { activeVehicle, setActiveVehicle, cartCount, openSelectorModal, isMegaMenuOpen, setIsMegaMenuOpen, navigate, currentPath } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) setIsSearchFocused(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim().length > 1
    ? PARTS_DATABASE.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase()) || p.oemNumbers.some(oem => oem.toLowerCase().includes(searchQuery.toLowerCase()))).slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchFocused(false);
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        {/* Top Utility Strip */}
        <div className="bg-[#005A96] text-white/90 text-[11px] sm:text-xs py-1.5 px-4 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto whitespace-nowrap">
              <span className="flex items-center gap-1.5 text-white font-medium"><ShieldCheck className="w-3.5 h-3.5 text-[#69b9ef] shrink-0" /><span>Check fitment before you buy</span></span>
              <span className="hidden md:flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-sky-200 shrink-0" /><span>Reliable delivery updates</span></span>
              <span className="hidden lg:flex items-center gap-1.5"><RotateCcw className="w-3.5 h-3.5 text-sky-200 shrink-0" /><span>30-day returns</span></span>
            </div>

          </div>
        </div>

        {/* Main Header Bar */}
        <div className="bg-[#0077C7] text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between gap-3 sm:gap-5">
              {/* Logo */}
              <div className="flex items-center gap-3 shrink-0">
                <button type="button" onClick={() => navigate('/')} className="flex items-center gap-2.5 text-left cursor-pointer group">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-md flex items-center justify-center text-[#0077C7] shadow-sm"><Wrench className="w-5 h-5 transform -rotate-12" /></div>
                  <span className="text-white font-bold text-lg sm:text-xl tracking-tight uppercase">MJ <span className="text-sky-200">Logistics</span></span>
                </button>
                <button type="button" onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)} className={`hidden md:flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all cursor-pointer ${isMegaMenuOpen ? 'bg-white/20 text-white ring-1 ring-white/30' : 'text-white hover:bg-white/10'}`}>
                  <Menu className="w-4 h-4" /><span>Catalog</span><ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Search */}
              <div ref={searchContainerRef} className="flex-1 max-w-2xl relative mx-1 sm:mx-2">
                <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                  <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onFocus={() => setIsSearchFocused(true)} placeholder="Search by name or part number" aria-label="Search by name or part number" className="w-full bg-white h-10 px-4 pl-10 pr-20 rounded-md shadow-inner text-xs sm:text-sm text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005A96] font-medium transition-all" />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                  {searchQuery && <button type="button" onClick={() => setSearchQuery('')} className="absolute right-14 sm:right-16 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"><X className="w-3.5 h-3.5" /></button>}
                  <button type="submit" className="absolute right-1 sm:right-1.5 px-3 py-1.5 bg-[#0077C7] hover:bg-[#005A96] text-white text-xs font-bold rounded uppercase tracking-wider transition-colors cursor-pointer shrink-0">Search</button>
                </form>

                {/* Suggestions dropdown */}
                {isSearchFocused && searchQuery.trim().length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden text-xs sm:text-sm animate-in fade-in-50 duration-150 text-slate-900">
                    <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-slate-500 font-semibold text-[11px]"><span>Suggested Products & Parts</span><span>Press Enter for all results</span></div>
                    {searchResults.length > 0 ? (
                      <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                        {searchResults.map(part => (
                          <button key={part.id} type="button" onClick={() => { setIsSearchFocused(false); setSearchQuery(''); navigate(`/parts/${part.id}`); }} className="w-full p-2.5 flex items-center justify-between hover:bg-sky-50 text-left transition-colors cursor-pointer group">
                            <div className="flex items-center gap-2.5">
                              <img src={part.images[0]} alt={part.name} className="w-10 h-10 object-cover rounded-md border border-slate-200 bg-white shrink-0" />
                              <div><div className="font-semibold text-slate-900 group-hover:text-[#0077C7] line-clamp-1">{part.name}</div><div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5"><span className="font-bold text-slate-700">{part.brand}</span><span>•</span><span className="font-mono text-slate-500">SKU: {part.sku}</span></div></div>
                            </div>
                            <div className="text-right shrink-0 ml-2"><div className="font-extrabold text-[#0077C7]">${part.price.toFixed(2)}</div></div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-slate-500 text-xs">No direct part matches for &quot;{searchQuery}&quot;. Press search to query full catalog.</div>
                    )}
                    <div className="p-2.5 bg-slate-50 border-t border-slate-100">
                      <button type="button" onClick={() => { setIsSearchFocused(false); navigate(`/search?q=${encodeURIComponent(searchQuery)}`); }} className="text-xs font-bold text-[#0077C7] hover:underline flex items-center gap-1">
                        <span>View all search results for &quot;{searchQuery}&quot;</span><ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Vehicle pill */}
              <div className="relative hidden md:block shrink-0">
                {activeVehicle ? (
                  <div className="h-10 bg-white/10 border border-white/20 rounded-full flex items-center px-3.5 gap-2 text-white cursor-pointer hover:bg-white/20 transition-all">
                    <button type="button" onClick={() => openSelectorModal('vin')} className="flex items-center gap-2 text-left cursor-pointer">
                      <div className="w-5 h-5 bg-[#22C55E] rounded-full flex items-center justify-center shrink-0"><CheckCircle2 className="w-3.5 h-3.5 text-white" /></div>
                      <div className="flex flex-col leading-tight max-w-[150px] truncate"><span className="text-[9px] uppercase font-bold text-white/80 tracking-wider">Active Vehicle</span><span className="text-xs font-bold text-white truncate">{activeVehicle.make} {activeVehicle.model}</span></div>
                      <ChevronDown className="w-3.5 h-3.5 text-white/80 ml-0.5" />
                    </button>
                    <button type="button" onClick={() => setActiveVehicle(null)} className="text-white/60 hover:text-rose-200 p-0.5 transition-colors cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ) : (
                  <button type="button" onClick={() => openSelectorModal('vin')} className="h-10 bg-white/10 border border-white/20 rounded-full flex items-center px-4 gap-2 text-white cursor-pointer hover:bg-white/20 transition-all font-semibold text-xs">
                    <Car className="w-4 h-4 text-sky-200" /><span>Select vehicle</span><ChevronDown className="w-3.5 h-3.5 text-white/70" />
                  </button>
                )}
              </div>

              {/* Right icons */}
              <div className="flex items-center gap-3 text-white shrink-0">
                <button type="button" onClick={() => navigate('/account')} className={`p-2 rounded-lg text-white hover:bg-white/10 transition-colors cursor-pointer relative ${currentPath === '/account' ? 'bg-white/20' : ''}`}>
                  <User className="w-5 h-5" />
                </button>
                <button type="button" onClick={() => navigate('/cart')} className={`p-2 rounded-lg text-white hover:bg-white/10 transition-colors cursor-pointer relative ${currentPath === '/cart' ? 'bg-white/20' : ''}`}>
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-xs">{cartCount}</span>}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile vehicle bar */}
        <div className="md:hidden bg-[#005A96] text-white px-4 py-2 flex items-center justify-between border-t border-white/10 text-xs">
          <div className="flex items-center gap-2"><Car className="w-4 h-4 text-sky-200" />{activeVehicle ? <span className="font-semibold truncate">Fitment: <strong className="text-white font-bold">{activeVehicle.make} {activeVehicle.model}</strong></span> : <span className="text-white/80">No vehicle selected</span>}</div>
          <button type="button" onClick={() => openSelectorModal('vin')} className="px-2.5 py-1 bg-white text-[#0077C7] rounded text-[11px] font-bold shrink-0 cursor-pointer uppercase tracking-wider">{activeVehicle ? 'Change' : 'Select vehicle'}</button>
        </div>

        <MegaMenu />
      </header>
    </>
  );
};
