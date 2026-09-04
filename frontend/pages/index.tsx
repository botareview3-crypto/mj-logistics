import React, { useState } from 'react';
import { Disc, Gauge, Sliders, Flame, Zap, Thermometer, Sparkles, Wrench, ShieldCheck, ArrowRight, ChevronRight, TrendingUp, Search, Car, CheckCircle2 } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { CATEGORY_ROOTS } from '../lib/data/categories';
import { PARTS_DATABASE, POPULAR_BRANDS } from '../lib/data/parts';
import { ProductCard } from '../components/ProductCard';
import { TrustStrip } from '../components/TrustStrip';

const iconMap: Record<string, React.ElementType> = { Disc, Gauge, Sliders, Flame, Zap, Thermometer, Sparkles, Wrench, ShieldCheck };

export default function HomePage() {
  const { activeVehicle, openSelectorModal, navigate } = useApp();
  const [query, setQuery] = useState('');
  const bestSellingParts = PARTS_DATABASE.filter(p => p.isBestSeller).slice(0, 6);

  const search = (event: React.FormEvent) => {
    event.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Hero */}
      <section className="rounded-2xl bg-[#0b2942] px-6 py-10 sm:px-10 sm:py-14 text-white overflow-hidden relative">
        <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#0077c7]/30 blur-3xl" />
        <div className="relative max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-200">Automotive parts catalogue</p>
          <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">Buy spare parts for your car.</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">Find a part by name or part number, then confirm your vehicle before ordering.</p>
          <div className="mt-8 grid gap-3 md:grid-cols-[1.4fr_1fr]">
            <form onSubmit={search} className="flex rounded-lg bg-white p-1.5 shadow-lg">
              <label className="sr-only" htmlFor="home-search">Search parts</label>
              <Search className="my-auto ml-3 h-5 w-5 text-slate-400" />
              <input id="home-search" value={query} onChange={e => setQuery(e.target.value)} className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm font-medium text-slate-900 outline-none" placeholder="Search by name or part number" />
              <button className="rounded-md bg-[#0077c7] px-4 text-sm font-bold text-white hover:bg-[#005a96]">Search</button>
            </form>
            <button type="button" onClick={() => openSelectorModal('cascading')} className="flex items-center justify-between rounded-lg border border-white/20 bg-white/10 px-5 py-3 text-left hover:bg-white/15">
              <span>
                <span className="block text-xs text-sky-200">{activeVehicle ? 'Active vehicle' : 'Check compatibility'}</span>
                <span className="text-sm font-bold">{activeVehicle ? `${activeVehicle.make} ${activeVehicle.model}` : 'Select your vehicle'}</span>
              </span>
              {activeVehicle ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <Car className="h-5 w-5 text-sky-200" />}
            </button>
          </div>
          {activeVehicle && <div className="mt-4 flex items-center gap-2 text-sm text-sky-100"><span className="h-2 w-2 rounded-full bg-emerald-400" />Checking compatibility for <strong>{activeVehicle.make} {activeVehicle.model}</strong><button type="button" onClick={() => openSelectorModal('cascading')} className="ml-1 underline underline-offset-4">Change</button></div>}
        </div>
      </section>

      {/* Trust Strip */}
      <section className="max-w-7xl mx-auto"><TrustStrip /></section>

      {/* Category Grid */}
      <section className="space-y-4">
        <div className="flex items-end justify-between border-b border-gray-200 pb-2.5">
          <div><h2 className="text-lg sm:text-xl font-bold text-gray-900 uppercase tracking-tight">Shop By Category</h2></div>
          <button type="button" onClick={() => navigate('/catalog')} className="text-xs sm:text-sm font-bold text-[#0077C7] hover:text-[#005A96] flex items-center gap-1 cursor-pointer uppercase tracking-wider"><span>View All Categories</span><ChevronRight className="w-4 h-4" /></button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORY_ROOTS[0].systems.map(system => {
            const IconComponent = iconMap[system.iconName] || Disc;
            return (
              <button key={system.id} type="button" onClick={() => navigate(`/catalog/${system.id}`)} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex flex-col items-center justify-center gap-3 hover:border-[#0077C7] hover:shadow-md cursor-pointer group transition-all h-36">
                <div className="w-12 h-12 bg-blue-50 text-[#0077C7] rounded-full flex items-center justify-center group-hover:bg-[#0077C7] group-hover:text-white transition-all"><IconComponent className="w-6 h-6" /></div>
                <div className="text-center w-full">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide group-hover:text-[#0077C7] transition-colors line-clamp-1">{system.name}</h3>
                  <span className="text-[10px] text-gray-400 font-medium block mt-0.5">{system.subsystems.length} Subsystems</span>
                </div>
              </button>
            );
          })}
        </div>
        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0077C7] text-white flex items-center justify-center shrink-0 shadow-sm"><Wrench className="w-5 h-5" /></div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase">Garage Equipment, Detailing & Accessories</h3>
              <p className="text-xs text-gray-500">Diagnostic scanners, hydraulic jacks, wiper blades, and workshop fluids.</p>
            </div>
          </div>
          <button type="button" onClick={() => navigate('/catalog')} className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wide rounded-md transition-colors cursor-pointer shrink-0">Explore Accessories</button>
        </div>
      </section>

      {/* Best Selling */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-slate-200 pb-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider"><TrendingUp className="w-4 h-4" /><span>High Volume Replacement Items</span></div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">Popular & Best-Selling Parts</h2>
          </div>
          <button type="button" onClick={() => navigate('/catalog/braking-system/brake-pads')} className="text-xs sm:text-sm font-bold text-[#0077C7] hover:text-[#0060A1] flex items-center gap-1 cursor-pointer"><span>View Catalog</span><ChevronRight className="w-4 h-4" /></button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {bestSellingParts.map(part => <ProductCard key={part.id} part={part} viewMode="grid" />)}
        </div>
      </section>

      {/* Brand Logos */}
      <section className="space-y-4">
        <div className="text-center space-y-1"><h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Authorized Distributor for Tier-1 OEM Manufacturers</h3></div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-xs">
          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3 text-center">
            {POPULAR_BRANDS.map(brand => (
              <button key={brand.name} type="button" onClick={() => navigate(`/search?q=${encodeURIComponent(brand.name)}`)} className="p-2.5 rounded-lg hover:bg-sky-50 border border-slate-100 hover:border-sky-200 transition-colors cursor-pointer group flex flex-col items-center justify-center">
                <span className="font-extrabold text-sm text-slate-800 group-hover:text-[#0077C7] tracking-tight">{brand.name}</span>
                <span className="text-[10px] text-slate-400 font-medium">{brand.highlight}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Garage promo */}
      <section className="bg-gradient-to-r from-slate-900 to-[#004B7D] text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-300 uppercase tracking-wider"><Wrench className="w-4 h-4" /><span>Manage Multiple Vehicles?</span></div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">Save Your Vehicles to &quot;My Garage&quot;</h3>
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl">Store multiple household or customer cars, track maintenance part numbers, and switch between vehicles with a single click.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button type="button" onClick={() => navigate('/garage')} className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs sm:text-sm rounded-lg shadow-sm transition-colors cursor-pointer">Open My Garage</button>
          <button type="button" onClick={() => openSelectorModal('vin')} className="px-5 py-2.5 bg-[#0077C7] hover:bg-[#0060A1] text-white font-extrabold text-xs sm:text-sm rounded-lg shadow-sm transition-colors cursor-pointer border border-sky-400/40">Add vehicle for fitment</button>
        </div>
      </section>
    </div>
  );
}
