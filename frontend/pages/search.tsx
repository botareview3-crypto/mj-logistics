import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Search, Grid, List, SlidersHorizontal, RotateCcw, Package, Car } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../lib/AppContext';
import { PARTS_DATABASE } from '../lib/data/parts';
import { FilterState } from '../lib/types';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FilterSidebar } from '../components/FilterSidebar';
import { ProductCard } from '../components/ProductCard';
import { SPRINGS } from '../lib/springs';

export default function SearchResultsPage() {
  const router = useRouter();
  const query  = (router.query.q as string) || '';
  const { activeVehicle, openSelectorModal, isPartCompatibleWithActiveVehicle, navigate } = useApp();

  const [viewMode,           setViewMode]           = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [refineQuery,        setRefineQuery]        = useState('');
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: query, partTypes: [], brands: [], positions: [],
    minPrice: 0, maxPrice: 500,
    onlyFitsVehicle: Boolean(activeVehicle), onlyInStock: false, sortBy: 'popularity',
  });

  React.useEffect(() => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
    setRefineQuery('');
  }, [query]);

  const handleRefineSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (refineQuery.trim()) navigate(`/search?q=${encodeURIComponent(refineQuery.trim())}`);
  };

  const baseMatched = useMemo(() => {
    if (!query.trim()) return PARTS_DATABASE;
    const q = query.toLowerCase().trim();
    return PARTS_DATABASE.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      (p.partType?.toLowerCase().includes(q)) ||
      p.oemNumbers.some(o => o.toLowerCase().includes(q)) ||
      p.fitsVehicles.some(v => v.make.toLowerCase().includes(q) || v.model.toLowerCase().includes(q))
    );
  }, [query]);

  const vehicleFiltered = useMemo(() => {
    if (!(filters.onlyFitsVehicle && activeVehicle)) return baseMatched;
    return baseMatched.filter(p => isPartCompatibleWithActiveVehicle(p));
  }, [baseMatched, filters.onlyFitsVehicle, activeVehicle, isPartCompatibleWithActiveVehicle]);

  const filtered = useMemo(() => {
    return baseMatched.filter(part => {
      if (filters.onlyFitsVehicle && activeVehicle && !isPartCompatibleWithActiveVehicle(part)) return false;
      if (filters.partTypes.length > 0 && part.partType && !filters.partTypes.includes(part.partType)) return false;
      if (filters.brands.length > 0 && !filters.brands.includes(part.brand)) return false;
      if (filters.positions.length > 0 && part.position && !filters.positions.includes(part.position)) return false;
      if (part.price < filters.minPrice || part.price > filters.maxPrice) return false;
      if (filters.onlyInStock && part.stockCount <= 0) return false;
      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':  return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'rating':     return b.rating - a.rating;
        case 'name-asc':   return a.name.localeCompare(b.name);
        default:           return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      }
    });
  }, [baseMatched, filters, activeVehicle, isPartCompatibleWithActiveVehicle]);

  const resetFilters = () => setFilters({
    searchQuery: query, partTypes: [], brands: [], positions: [],
    minPrice: 0, maxPrice: 500,
    onlyFitsVehicle: Boolean(activeVehicle), onlyInStock: false, sortBy: 'popularity',
  });

  return (
    <div className="space-y-6 pb-16">
      <Breadcrumbs items={[{ label: 'Search', path: '/search' }, { label: `"${query}"` }]} />

      {/* ── Hero search banner ────────────────────────────────────── */}
      <section className="relative rounded-3xl overflow-hidden">
        {/* Background */}
        <img
          src="/homepage/auto-parts-istock.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1f3c]/95 via-[#0d1f3c]/80 to-[#0d1f3c]/50" />

        <div className="relative px-7 py-10 sm:px-10 sm:py-12">
          {/* Result count pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-white/70 text-[11px] font-semibold mb-4 uppercase tracking-wider">
            <Search className="w-3 h-3" />
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            {activeVehicle && filters.onlyFitsVehicle && (
              <span className="text-emerald-300">· {activeVehicle.make} {activeVehicle.model}</span>
            )}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-1 leading-tight">
            {query ? (
              <>Results for <span className="italic font-light opacity-80">"{query}"</span></>
            ) : (
              'All Parts'
            )}
          </h1>
          <p className="text-white/50 text-[13px] mb-7">
            Search by name, OEM number, brand, or vehicle make / model.
          </p>

          {/* Refine search + vehicle selector */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <form onSubmit={handleRefineSearch} className="flex-1 flex items-center bg-white/95 rounded-xl overflow-hidden shadow-lg">
              <input
                type="text"
                value={refineQuery}
                onChange={e => setRefineQuery(e.target.value)}
                placeholder={query ? `Refine "${query}"…` : 'Search parts, brands, OEM numbers…'}
                className="flex-1 pl-5 pr-3 py-3 text-sm text-[#0d1f3c] bg-transparent outline-none border-none ring-0 placeholder-slate-400 focus:outline-none"
                style={{ boxShadow: 'none' }}
              />
              <motion.button
                type="submit"
                aria-label="Search"
                className="w-9 h-9 mr-2 rounded-full bg-[#0d1f3c] hover:bg-[#1a3560] text-white flex items-center justify-center cursor-pointer shrink-0 transition-colors"
                whileTap={{ scale: 0.88 }}
                transition={SPRINGS.micro}
              >
                <Search className="w-3.5 h-3.5" />
              </motion.button>
            </form>

            <motion.button
              type="button"
              onClick={() => openSelectorModal('cascading')}
              className="flex items-center gap-2.5 px-5 py-3 bg-white/10 border border-white/25 backdrop-blur-sm rounded-xl text-white text-sm font-medium cursor-pointer hover:bg-white/20 transition-colors shrink-0"
              whileTap={{ scale: 0.97 }}
              transition={SPRINGS.micro}
            >
              <Car className="w-4 h-4 text-white/60 shrink-0" />
              <div className="text-left">
                <span className="block text-[10px] text-white/45 uppercase leading-none mb-0.5" style={{ letterSpacing: '0.08em' }}>Fitment</span>
                <span className="font-semibold leading-none text-[13px]">
                  {activeVehicle ? `${activeVehicle.make} ${activeVehicle.model}` : 'Select vehicle'}
                </span>
              </div>
            </motion.button>
          </div>
        </div>
      </section>

      {/* ── Two-column layout ─────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-start gap-6">
        <FilterSidebar
          availableParts={vehicleFiltered}
          filters={filters}
          onFilterChange={setFilters}
          isOpenMobile={isMobileFilterOpen}
          onCloseMobile={() => setIsMobileFilterOpen(false)}
        />

        <div className="flex-1 w-full space-y-4">
          {/* Sort / view bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <motion.button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className="md:hidden flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0d1f3c] font-semibold text-xs rounded-xl border border-slate-200 cursor-pointer transition-colors"
                whileTap={{ scale: 0.97 }}
                transition={SPRINGS.micro}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
              </motion.button>
              <span className="text-xs font-semibold text-slate-600">{filtered.length} products</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="hidden sm:inline font-medium">Sort:</span>
                <select
                  value={filters.sortBy}
                  onChange={e => setFilters({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#0d1f3c] focus:outline-none focus:ring-2 focus:ring-[#1e4d8c] cursor-pointer"
                >
                  <option value="popularity">Most Popular</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="name-asc">Name A–Z</option>
                </select>
              </div>

              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 p-0.5">
                <motion.button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-white text-[#1e4d8c] shadow-sm' : 'text-slate-400'}`}
                  aria-label="Grid view"
                  whileTap={{ scale: 0.88 }}
                  transition={SPRINGS.micro}
                >
                  <Grid className="w-4 h-4" />
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-white text-[#1e4d8c] shadow-sm' : 'text-slate-400'}`}
                  aria-label="List view"
                  whileTap={{ scale: 0.88 }}
                  transition={SPRINGS.micro}
                >
                  <List className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Results */}
          {filtered.length > 0 ? (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                : 'space-y-3'
            }>
              {filtered.map(part => (
                <ProductCard key={part.id} part={part} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center mx-auto">
                <Package className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-[#0d1f3c]">No parts found</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                  Try a different search term, remove filters, or browse by category.
                </p>
              </div>
              <motion.button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#0d1f3c] hover:bg-[#1a3560] text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer"
                whileTap={{ scale: 0.97 }}
                transition={SPRINGS.micro}
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
