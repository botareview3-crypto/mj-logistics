import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Search, Grid, List, SlidersHorizontal, RotateCcw, Package } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { PARTS_DATABASE } from '../lib/data/parts';
import { FilterState } from '../lib/types';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FilterSidebar } from '../components/FilterSidebar';
import { ProductCard } from '../components/ProductCard';

export default function SearchResultsPage() {
  const router = useRouter();
  const query = (router.query.q as string) || '';
  const { activeVehicle, isPartCompatibleWithActiveVehicle } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: query, partTypes: [], brands: [], positions: [],
    minPrice: 0, maxPrice: 500,
    onlyFitsVehicle: Boolean(activeVehicle), onlyInStock: false, sortBy: 'popularity',
  });

  React.useEffect(() => { setFilters(prev => ({ ...prev, searchQuery: query })); }, [query]);

  const baseMatchedParts = useMemo(() => {
    if (!query.trim()) return PARTS_DATABASE;
    const q = query.toLowerCase().trim();
    return PARTS_DATABASE.filter(part =>
      part.name.toLowerCase().includes(q) ||
      part.brand.toLowerCase().includes(q) ||
      part.sku.toLowerCase().includes(q) ||
      (part.partType?.toLowerCase().includes(q)) ||
      (part.category?.toLowerCase().includes(q)) ||
      part.oemNumbers.some(oem => oem.toLowerCase().includes(q)) ||
      part.fitsVehicles.some(v => v.make.toLowerCase().includes(q) || v.model.toLowerCase().includes(q))
    );
  }, [query]);

  const filteredParts = useMemo(() => {
    return baseMatchedParts.filter(part => {
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
        default: return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      }
    });
  }, [baseMatchedParts, filters, activeVehicle, isPartCompatibleWithActiveVehicle]);

  const handleResetFilters = () => setFilters({ searchQuery: query, partTypes: [], brands: [], positions: [], minPrice: 0, maxPrice: 500, onlyFitsVehicle: Boolean(activeVehicle), onlyInStock: false, sortBy: 'popularity' });

  return (
    <div className="space-y-6 pb-12">
      <Breadcrumbs items={[{ label: 'Search Results', path: '/search' }, { label: `"${query}"` }]} />
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0077C7] uppercase tracking-wider"><Search className="w-3.5 h-3.5" /><span>Catalog Search Results</span></div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Results for &quot;{query || 'All Parts'}&quot;</h1>
        <p className="text-xs text-slate-500">Found <strong>{filteredParts.length}</strong> matching automotive replacement parts across all categories.</p>
      </div>

      <div className="flex flex-col md:flex-row items-start gap-6">
        <FilterSidebar availableParts={baseMatchedParts} filters={filters} onFilterChange={setFilters} isOpenMobile={isMobileFilterOpen} onCloseMobile={() => setIsMobileFilterOpen(false)} />
        <div className="flex-1 w-full space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setIsMobileFilterOpen(true)} className="md:hidden px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg border border-slate-300 flex items-center gap-1.5 cursor-pointer"><SlidersHorizontal className="w-3.5 h-3.5" /><span>Filters</span></button>
              <span className="text-xs font-semibold text-slate-700">{filteredParts.length} Products</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="hidden sm:inline font-medium">Sort by:</span>
                <select value={filters.sortBy} onChange={e => setFilters({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })} className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0077C7] cursor-pointer">
                  <option value="popularity">Relevance & Best Seller</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="name-asc">Brand / Name (A-Z)</option>
                </select>
              </div>
              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden p-0.5 bg-slate-50">
                <button type="button" onClick={() => setViewMode('grid')} className={`p-1.5 rounded-sm transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-white text-[#0077C7] shadow-xs' : 'text-slate-400'}`}><Grid className="w-4 h-4" /></button>
                <button type="button" onClick={() => setViewMode('list')} className={`p-1.5 rounded-sm transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-white text-[#0077C7] shadow-xs' : 'text-slate-400'}`}><List className="w-4 h-4" /></button>
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
                <h3 className="text-base font-bold text-slate-900">No parts found for &quot;{query}&quot;</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">Try checking for spelling errors, searching by OEM number, or clearing active facet filters.</p>
              </div>
              <button type="button" onClick={handleResetFilters} className="px-4 py-2 bg-[#0077C7] hover:bg-[#0060A1] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"><RotateCcw className="w-3.5 h-3.5" /><span>Reset Filters</span></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

