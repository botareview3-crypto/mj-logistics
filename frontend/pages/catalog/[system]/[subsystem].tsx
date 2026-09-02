import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Car, Grid, List, SlidersHorizontal, RotateCcw, CheckCircle2, Package } from 'lucide-react';
import { useApp } from '../../../lib/AppContext';
import { getCategoryById } from '../../../lib/data/categories';
import { PARTS_DATABASE } from '../../../lib/data/parts';
import { FilterState } from '../../../lib/types';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { FilterSidebar } from '../../../components/FilterSidebar';
import { ProductCard } from '../../../components/ProductCard';
import { CATEGORY_ROOTS } from '../../../lib/data/categories';

export default function SubsystemPage() {
  const router = useRouter();
  const systemId = router.query.system as string;
  const subsystemId = router.query.subsystem as string;
  const { activeVehicle, setActiveVehicle, openSelectorModal, isPartCompatibleWithActiveVehicle, navigate } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const catInfo = getCategoryById(systemId, subsystemId);
  const { root, system, subsystem } = catInfo;

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '', partTypes: [], brands: [], positions: [],
    minPrice: 0, maxPrice: 500,
    onlyFitsVehicle: Boolean(activeVehicle), onlyInStock: false, sortBy: 'popularity',
  });

  React.useEffect(() => {
    if (activeVehicle) setFilters(prev => ({ ...prev, onlyFitsVehicle: true }));
  }, [activeVehicle?.id]);

  const baseParts = useMemo(() => {
    if (!systemId || !subsystemId) return [];
    return PARTS_DATABASE.filter(part => part.systemId === systemId && part.subsystemId === subsystemId);
  }, [systemId, subsystemId]);

  const filteredParts = useMemo(() => {
    return baseParts.filter(part => {
      if (filters.onlyFitsVehicle && activeVehicle) { if (!isPartCompatibleWithActiveVehicle(part)) return false; }
      if (filters.partTypes.length > 0 && part.partType && !filters.partTypes.includes(part.partType)) return false;
      if (filters.brands.length > 0 && !filters.brands.includes(part.brand)) return false;
      if (filters.positions.length > 0 && part.position && !filters.positions.includes(part.position)) return false;
      if (part.price < filters.minPrice || part.price > filters.maxPrice) return false;
      if (filters.onlyInStock && part.stockCount <= 0) return false;
      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        case 'name-asc': return a.name.localeCompare(b.name);
        default: return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0) || b.reviewCount - a.reviewCount;
      }
    });
  }, [baseParts, filters, activeVehicle, isPartCompatibleWithActiveVehicle]);

  const handleResetFilters = () => setFilters({ searchQuery: '', partTypes: [], brands: [], positions: [], minPrice: 0, maxPrice: 500, onlyFitsVehicle: Boolean(activeVehicle), onlyInStock: false, sortBy: 'popularity' });

  if (!systemId) return null;

  return (
    <div className="space-y-6 pb-12">
      <Breadcrumbs items={[{ label: root?.name || 'Catalog', path: '/catalog' }, { label: system?.name || systemId, path: `/catalog/${systemId}` }, { label: subsystem?.name || subsystemId }]} />

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{subsystem?.name || 'Parts Catalog'}</h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl">{subsystem?.description || 'Browse guaranteed OE-specification replacement parts.'}</p>
      </div>

      {/* Vehicle banner */}
      {activeVehicle ? (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center shrink-0"><CheckCircle2 className="w-5 h-5 text-emerald-600" /></div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Fitment Guaranteed for:</div>
              <div className="text-sm font-black text-slate-900">{activeVehicle.year} {activeVehicle.make} {activeVehicle.model} ({activeVehicle.engine})</div>
              <div className="text-[11px] text-slate-600 font-mono">{activeVehicle.regNumber ? `Plate: ${activeVehicle.regNumber} • ` : ''}Engine Code: {activeVehicle.engineCode || 'OE'}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button type="button" onClick={() => openSelectorModal('vin')} className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-lg border border-slate-300 transition-colors cursor-pointer">Change Vehicle</button>
            <button type="button" onClick={() => setActiveVehicle(null)} className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs rounded-lg border border-rose-200 transition-colors cursor-pointer">Clear Filter</button>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-sky-50 to-slate-50 border border-sky-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0077C7] text-white flex items-center justify-center shrink-0 shadow-xs"><Car className="w-5 h-5" /></div>
            <div><h3 className="text-xs sm:text-sm font-bold text-slate-900">Not sure which part fits your vehicle?</h3><p className="text-xs text-slate-600 mt-0.5">Select your vehicle to see compatible parts in this category.</p></div>
          </div>
          <button type="button" onClick={() => openSelectorModal('vin')} className="px-4 py-2 bg-[#0077C7] hover:bg-[#0060A1] text-white font-bold text-xs rounded-lg shadow-xs transition-colors cursor-pointer shrink-0">Select Vehicle Now</button>
        </div>
      )}

      {/* Main layout */}
      <div className="flex flex-col md:flex-row items-start gap-6">
        <FilterSidebar availableParts={baseParts} filters={filters} onFilterChange={setFilters} isOpenMobile={isMobileFilterOpen} onCloseMobile={() => setIsMobileFilterOpen(false)} />

        <div className="flex-1 w-full space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setIsMobileFilterOpen(true)} className="md:hidden px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg border border-slate-300 flex items-center gap-1.5 cursor-pointer"><SlidersHorizontal className="w-3.5 h-3.5" /><span>Filters</span></button>
              <span className="text-xs font-semibold text-slate-700">Showing <strong className="text-slate-900 font-black">{filteredParts.length}</strong> {filteredParts.length === 1 ? 'part' : 'parts'}</span>
              {filters.onlyFitsVehicle && activeVehicle && <span className="hidden sm:inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-sm">✓ Verified Compatible Only</span>}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="hidden sm:inline font-medium">Sort by:</span>
                <select value={filters.sortBy} onChange={e => setFilters({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })} className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0077C7] cursor-pointer">
                  <option value="popularity">Most Popular</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="name-asc">Brand / Name (A-Z)</option>
                </select>
              </div>
              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden p-0.5 bg-slate-50">
                <button type="button" onClick={() => setViewMode('grid')} className={`p-1.5 rounded-sm transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-white text-[#0077C7] shadow-xs' : 'text-slate-400 hover:text-slate-700'}`}><Grid className="w-4 h-4" /></button>
                <button type="button" onClick={() => setViewMode('list')} className={`p-1.5 rounded-sm transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-white text-[#0077C7] shadow-xs' : 'text-slate-400 hover:text-slate-700'}`}><List className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          {filteredParts.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-3'}>
              {filteredParts.map(part => <ProductCard key={part.id} part={part} viewMode={viewMode} />)}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto"><Package className="w-6 h-6" /></div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">No parts match your current filters</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">{filters.onlyFitsVehicle && activeVehicle ? `No ${subsystem?.name || 'parts'} found matching ${activeVehicle.make} ${activeVehicle.model}. Try disabling the vehicle filter.` : 'Try resetting your price or brand filters to see more parts.'}</p>
              </div>
              <button type="button" onClick={handleResetFilters} className="px-4 py-2 bg-[#0077C7] hover:bg-[#0060A1] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"><RotateCcw className="w-3.5 h-3.5" /><span>Reset All Filters</span></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function getStaticPaths() {
  return {
    paths: CATEGORY_ROOTS.flatMap(root => root.systems.flatMap(system => system.subsystems.map(subsystem => ({ params: { system: system.id, subsystem: subsystem.id } })))),
    fallback: false,
  };
}

export function getStaticProps() {
  return { props: {} };
}
