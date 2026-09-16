import React, { useState, useRef } from 'react';
import Head from 'next/head';
import {
  Search, Car, ChevronRight, TrendingUp, Wrench,
  Disc, Gauge, Sliders, Flame, Zap, Thermometer,
  Sparkles, ShieldCheck, CircleDot, Package,
} from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { CATEGORY_ROOTS } from '../lib/data/categories';
import { PARTS_DATABASE, POPULAR_BRANDS } from '../lib/data/parts';
import { ProductCard } from '../components/ProductCard';

const iconMap: Record<string, React.ElementType> = {
  Disc, CircleDot, Gauge, Sliders, Flame, Zap,
  Thermometer, Sparkles, Wrench, ShieldCheck, Package,
};

export default function ShopPage() {
  const { activeVehicle, openSelectorModal, navigate } = useApp();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const bestSellers = PARTS_DATABASE.filter(p => p.isBestSeller).slice(0, 8);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <>
      <Head>
        <title>Shop Auto Parts — MJ Logistics</title>
        <meta name="description" content="Vehicle-first automotive parts catalog. Search, filter by vehicle fitment, and order with confidence." />
      </Head>

      <div className="space-y-10 pb-16">

        {/* ── Hero search banner ────────────────────────────────────── */}
        <section className="relative rounded-3xl overflow-hidden min-h-[320px]">

          {/* Background image — the istock auto parts photo */}
          <img
            src="/homepage/auto-parts-istock.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Dark overlay so text is readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d1f3c]/92 via-[#0d1f3c]/75 to-[#0d1f3c]/40" />

          {/* Content */}
          <div className="relative px-8 py-12 sm:px-12 sm:py-14">
            {activeVehicle && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-300 text-xs font-semibold mb-5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                Filtering for: <strong>{activeVehicle.make} {activeVehicle.model} {activeVehicle.year}</strong>
                <button type="button" onClick={() => openSelectorModal('cascading')} className="ml-1 underline underline-offset-2 opacity-70 hover:opacity-100 cursor-pointer">Change</button>
              </div>
            )}

            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-3 leading-tight">
              Find Parts That Fit.<br />
              <span className="italic font-light opacity-75">Every Vehicle. Every System.</span>
            </h1>
            <p className="text-white/60 text-[15px] mb-8 max-w-lg leading-relaxed">
              Search by name, brand, or OEM number — confirm fitment for your vehicle before ordering.
            </p>

            {/* Search + vehicle row */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1 flex items-center bg-white/95 rounded-xl overflow-hidden shadow-lg">
                <Search className="w-4 h-4 text-slate-400 ml-4 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search by name, OEM number, or brand…"
                  className="flex-1 px-3 py-3.5 text-sm text-[#0d1f3c] bg-transparent outline-none border-none ring-0 focus:outline-none focus:ring-0 focus:border-none placeholder-slate-400"
                  aria-label="Search parts"
                  style={{ boxShadow: 'none' }}
                />
                <button
                  type="submit"
                  className="px-5 py-3.5 bg-[#0d1f3c] hover:bg-[#1a3560] text-white text-sm font-bold transition-colors cursor-pointer shrink-0"
                >
                  Search
                </button>
              </form>

              {/* Vehicle selector */}
              <button
                type="button"
                onClick={() => openSelectorModal('cascading')}
                className="flex items-center gap-2.5 px-5 py-3.5 bg-white/10 border border-white/25 backdrop-blur-sm rounded-xl text-white text-sm font-medium cursor-pointer hover:bg-white/20 transition-all shrink-0"
              >
                <Car className="w-4 h-4 text-white/70 shrink-0" />
                <div className="text-left">
                  <span className="block text-[10px] text-white/50 uppercase tracking-wider leading-none mb-0.5">Fitment check</span>
                  <span className="font-semibold leading-none">
                    {activeVehicle ? `${activeVehicle.make} ${activeVehicle.model}` : 'Select your vehicle'}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* ── Category grid ─────────────────────────────────────────── */}
        <section className="space-y-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-1">Browse by system</p>
              <h2 className="font-display text-2xl font-bold text-[#0d1f3c]">Shop by Category</h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/catalog')}
              className="hidden sm:flex items-center gap-1 text-[13px] font-semibold text-[#1e4d8c] hover:text-[#0d1f3c] transition-colors cursor-pointer"
            >
              All categories <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {CATEGORY_ROOTS[0].systems.map(system => {
              const Icon = iconMap[system.iconName] || Wrench;
              return (
                <button
                  key={system.id}
                  type="button"
                  onClick={() => navigate(`/catalog/${system.id}`)}
                  className="product-card bg-white rounded-2xl border border-slate-200 hover:border-[#1e4d8c] p-4 flex flex-col items-center justify-center gap-2.5 group cursor-pointer aspect-square"
                >
                  <div className="w-11 h-11 rounded-xl bg-slate-50 group-hover:bg-[#0d1f3c] text-[#1e4d8c] group-hover:text-white flex items-center justify-center transition-all">
                    <Icon className="w-5 h-5" strokeWidth={1.8} />
                  </div>
                  <span className="font-display text-[12px] font-semibold text-[#0d1f3c] group-hover:text-[#1e4d8c] text-center leading-tight line-clamp-2 transition-colors">
                    {system.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Other catalog roots */}
          {CATEGORY_ROOTS.slice(1).map(root => (
            <div
              key={root.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200 p-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0d1f3c] text-white flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-[16px] font-bold text-[#0d1f3c]">{root.name}</h3>
                  <p className="text-[12px] text-slate-500">{root.description}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate(`/catalog/${root.systems[0]?.id ?? ''}`)}
                className="px-5 py-2.5 bg-[#0d1f3c] hover:bg-[#1a3560] text-white text-[13px] font-semibold rounded-xl transition-colors cursor-pointer shrink-0 flex items-center gap-2"
              >
                Browse {root.name} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </section>

        {/* ── Best sellers ──────────────────────────────────────────── */}
        <section className="space-y-5">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#e8a020] mb-1">
                <TrendingUp className="w-3.5 h-3.5" /> High volume replacements
              </div>
              <h2 className="font-display text-2xl font-bold text-[#0d1f3c]">Best-Selling Parts</h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/catalog/braking-system')}
              className="hidden sm:flex items-center gap-1 text-[13px] font-semibold text-[#1e4d8c] hover:text-[#0d1f3c] cursor-pointer"
            >
              View catalog <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bestSellers.map(part => (
              <ProductCard key={part.id} part={part} viewMode="grid" />
            ))}
          </div>
        </section>

        {/* ── Brands strip ──────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
          <div className="text-center">
            <p className="font-display text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-2">Authorised distributor</p>
            <h2 className="font-display text-2xl font-bold text-[#0d1f3c]">Top Brands</h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-2">
            {POPULAR_BRANDS.map(brand => (
              <button
                key={brand.name}
                type="button"
                onClick={() => navigate(`/search?q=${encodeURIComponent(brand.name)}`)}
                className="p-3 rounded-xl border border-slate-100 hover:border-[#1e4d8c] hover:bg-slate-50 transition-all cursor-pointer flex flex-col items-center gap-0.5 group"
              >
                <span className="font-display font-bold text-[13px] text-[#0d1f3c] group-hover:text-[#1e4d8c] transition-colors">
                  {brand.name}
                </span>
                <span className="text-[10px] text-slate-400">{brand.highlight}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Garage promo ──────────────────────────────────────────── */}
        <section className="relative rounded-3xl overflow-hidden bg-[#0d1f3c] p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
          <div className="relative space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-white/50">
              <Wrench className="w-3.5 h-3.5" /> Multi-vehicle management
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white leading-snug">
              Save Your Vehicles to "My Garage"
            </h3>
            <p className="text-white/65 text-[14px] leading-relaxed">
              Store multiple cars, switch active vehicle in one click, and let every product page confirm fitment automatically.
            </p>
          </div>
          <div className="relative flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigate('/garage')}
              className="px-6 py-3 bg-white hover:bg-slate-100 text-[#0d1f3c] font-bold text-[13px] rounded-xl transition-colors cursor-pointer"
            >
              Open My Garage
            </button>
            <button
              type="button"
              onClick={() => openSelectorModal('vin')}
              className="px-6 py-3 bg-white/10 border border-white/25 text-white font-semibold text-[13px] rounded-xl cursor-pointer hover:bg-white/20 transition-all"
            >
              Add a vehicle
            </button>
          </div>
        </section>

      </div>
    </>
  );
}
