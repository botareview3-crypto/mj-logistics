import React, { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, RotateCcw, Search, Sliders, Car, X } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { FilterState, Part } from '../lib/types';

interface FilterSidebarProps {
  availableParts: Part[];
  filters: FilterState;
  onFilterChange: (f: FilterState) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ availableParts, filters, onFilterChange, isOpenMobile = false, onCloseMobile }) => {
  const { activeVehicle, openSelectorModal } = useApp();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [brandSearch, setBrandSearch] = useState('');

  const toggle = (s: string) => setCollapsed(p => ({ ...p, [s]: !p[s] }));

  const partTypeCounts: Record<string, number> = {};
  const brandCounts: Record<string, number> = {};
  const positionCounts: Record<string, number> = {};
  availableParts.forEach(p => {
    if (p.partType) partTypeCounts[p.partType] = (partTypeCounts[p.partType] || 0) + 1;
    if (p.brand) brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
    if (p.position) positionCounts[p.position] = (positionCounts[p.position] || 0) + 1;
  });

  const activeFilterCount = filters.partTypes.length + filters.brands.length + filters.positions.length + (filters.onlyInStock ? 1 : 0) + (filters.minPrice > 0 || filters.maxPrice < 500 ? 1 : 0);

  const handleReset = () => onFilterChange({ searchQuery: '', partTypes: [], brands: [], positions: [], minPrice: 0, maxPrice: 500, onlyFitsVehicle: Boolean(activeVehicle), onlyInStock: false, sortBy: filters.sortBy });
  const toggleArr = (key: 'partTypes' | 'brands' | 'positions', val: string) => {
    const arr = filters[key] as string[];
    onFilterChange({ ...filters, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] });
  };

  const filteredBrands = Object.keys(brandCounts).filter(b => b.toLowerCase().includes(brandSearch.toLowerCase()));

  const content = (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#0077C7]" />
          <h3 className="font-bold text-slate-900 text-sm">Filter Parts</h3>
          {activeFilterCount > 0 && <span className="px-1.5 py-0.5 bg-[#0077C7] text-white text-[10px] font-bold rounded-full">{activeFilterCount}</span>}
        </div>
        {activeFilterCount > 0 && <button type="button" onClick={handleReset} className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"><RotateCcw className="w-3 h-3" /><span>Reset</span></button>}
      </div>

      {/* Vehicle fitment */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5"><Car className="w-3.5 h-3.5 text-[#0077C7]" />Vehicle Fitment</span>
        {activeVehicle ? (
          <label className="flex items-start gap-2.5 cursor-pointer mt-1 pt-1 border-t border-slate-200/80">
            <input type="checkbox" checked={filters.onlyFitsVehicle} onChange={e => onFilterChange({ ...filters, onlyFitsVehicle: e.target.checked })} className="mt-0.5 rounded-sm text-[#0077C7] focus:ring-[#0077C7] cursor-pointer" />
            <div className="text-xs"><span className="font-bold text-slate-900 block leading-tight">Only parts that fit my:</span><span className="text-emerald-700 font-bold block mt-0.5">✓ {activeVehicle.make} {activeVehicle.model} ({activeVehicle.engine.split(' ')[0]})</span></div>
          </label>
        ) : (
          <div className="text-xs text-slate-600 space-y-2 pt-1">
            <p className="text-[11px] leading-tight text-slate-500">Select your vehicle to filter compatible parts.</p>
            <button type="button" onClick={() => openSelectorModal('vin')} className="w-full py-1.5 px-2 bg-[#0077C7] hover:bg-[#0060A1] text-white font-bold text-xs rounded-md flex items-center justify-center gap-1 cursor-pointer transition-colors"><Car className="w-3.5 h-3.5" /><span>Select Vehicle</span></button>
          </div>
        )}
      </div>

      {/* Part Type */}
      {Object.keys(partTypeCounts).length > 0 && (
        <div className="border-b border-slate-200 pb-3">
          <button type="button" onClick={() => toggle('partTypes')} className="w-full flex items-center justify-between text-xs font-bold text-slate-900 py-1 cursor-pointer">
            <span>Part Type</span>{collapsed.partTypes ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronUp className="w-3.5 h-3.5 text-slate-400" />}
          </button>
          {!collapsed.partTypes && <div className="space-y-1.5 mt-2">
            {Object.entries(partTypeCounts).map(([type, count]) => (
              <label key={type} className="flex items-center justify-between text-xs text-slate-700 hover:text-slate-900 cursor-pointer py-0.5 group">
                <div className="flex items-center gap-2"><input type="checkbox" checked={filters.partTypes.includes(type)} onChange={() => toggleArr('partTypes', type)} className="rounded-sm text-[#0077C7] focus:ring-[#0077C7] cursor-pointer" /><span className="group-hover:text-[#0077C7] transition-colors">{type}</span></div>
                <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 rounded-xs">{count}</span>
              </label>
            ))}
          </div>}
        </div>
      )}

      {/* Position */}
      {Object.keys(positionCounts).length > 0 && (
        <div className="border-b border-slate-200 pb-3">
          <button type="button" onClick={() => toggle('positions')} className="w-full flex items-center justify-between text-xs font-bold text-slate-900 py-1 cursor-pointer">
            <span>Fitting Position</span>{collapsed.positions ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronUp className="w-3.5 h-3.5 text-slate-400" />}
          </button>
          {!collapsed.positions && <div className="space-y-1.5 mt-2">
            {Object.entries(positionCounts).map(([pos, count]) => (
              <label key={pos} className="flex items-center justify-between text-xs text-slate-700 cursor-pointer py-0.5 group">
                <div className="flex items-center gap-2"><input type="checkbox" checked={filters.positions.includes(pos)} onChange={() => toggleArr('positions', pos)} className="rounded-sm text-[#0077C7] focus:ring-[#0077C7] cursor-pointer" /><span className="group-hover:text-[#0077C7] transition-colors">{pos}</span></div>
                <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 rounded-xs">{count}</span>
              </label>
            ))}
          </div>}
        </div>
      )}

      {/* Brand */}
      {Object.keys(brandCounts).length > 0 && (
        <div className="border-b border-slate-200 pb-3">
          <button type="button" onClick={() => toggle('brands')} className="w-full flex items-center justify-between text-xs font-bold text-slate-900 py-1 cursor-pointer">
            <span>Brand</span>{collapsed.brands ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronUp className="w-3.5 h-3.5 text-slate-400" />}
          </button>
          {!collapsed.brands && <div className="mt-2 space-y-2">
            {Object.keys(brandCounts).length > 4 && (
              <div className="relative">
                <input type="text" value={brandSearch} onChange={e => setBrandSearch(e.target.value)} placeholder="Search brands..." className="w-full pl-7 pr-2 py-1 text-[11px] bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0077C7]" />
                <Search className="w-3 h-3 text-slate-400 absolute left-2 top-2" />
              </div>
            )}
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {filteredBrands.map(brand => (
                <label key={brand} className="flex items-center justify-between text-xs text-slate-700 cursor-pointer py-0.5 group">
                  <div className="flex items-center gap-2"><input type="checkbox" checked={filters.brands.includes(brand)} onChange={() => toggleArr('brands', brand)} className="rounded-sm text-[#0077C7] focus:ring-[#0077C7] cursor-pointer" /><span className="group-hover:text-[#0077C7] transition-colors font-medium">{brand}</span></div>
                  <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 rounded-xs">{brandCounts[brand]}</span>
                </label>
              ))}
            </div>
          </div>}
        </div>
      )}

      {/* Price */}
      <div className="border-b border-slate-200 pb-3">
        <button type="button" onClick={() => toggle('price')} className="w-full flex items-center justify-between text-xs font-bold text-slate-900 py-1 cursor-pointer">
          <span>Price Range ($)</span>{collapsed.price ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronUp className="w-3.5 h-3.5 text-slate-400" />}
        </button>
        {!collapsed.price && <div className="mt-2 space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1"><span className="text-[10px] text-slate-400 block">Min ($)</span><input type="number" min="0" max={filters.maxPrice} value={filters.minPrice} onChange={e => onFilterChange({ ...filters, minPrice: Number(e.target.value) || 0 })} className="w-full px-2 py-1 text-xs border border-slate-300 rounded-md bg-slate-50 focus:bg-white" /></div>
            <span className="text-slate-400 mt-3">—</span>
            <div className="flex-1"><span className="text-[10px] text-slate-400 block">Max ($)</span><input type="number" min={filters.minPrice} max="1000" value={filters.maxPrice} onChange={e => onFilterChange({ ...filters, maxPrice: Number(e.target.value) || 500 })} className="w-full px-2 py-1 text-xs border border-slate-300 rounded-md bg-slate-50 focus:bg-white" /></div>
          </div>
          <input type="range" min="0" max="250" step="5" value={filters.maxPrice} onChange={e => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })} className="w-full accent-[#0077C7] cursor-pointer" />
        </div>}
      </div>

      {/* Stock */}
      <div>
        <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
          <input type="checkbox" checked={filters.onlyInStock} onChange={e => onFilterChange({ ...filters, onlyInStock: e.target.checked })} className="rounded-sm text-[#0077C7] focus:ring-[#0077C7] cursor-pointer" />
          <span>In Stock Only (Ready to Ship)</span>
        </label>
      </div>
    </div>
  );

  if (isOpenMobile) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/60 backdrop-blur-xs md:hidden animate-in fade-in duration-150">
        <div className="bg-white rounded-t-2xl max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2"><Sliders className="w-4 h-4 text-[#0077C7]" /><h3 className="font-bold text-slate-900 text-sm">Filter Results</h3></div>
            <button type="button" onClick={onCloseMobile} className="p-1 rounded-md text-slate-400 hover:text-slate-700 cursor-pointer"><X className="w-5 h-5" /></button>
          </div>
          <div className="p-4 overflow-y-auto flex-1">{content}</div>
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <button type="button" onClick={onCloseMobile} className="w-full py-2.5 bg-[#0077C7] hover:bg-[#0060A1] text-white font-bold text-sm rounded-lg shadow-sm cursor-pointer">Apply Filters</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <aside className="hidden md:block w-64 shrink-0 bg-white p-4 rounded-xl border border-slate-200 shadow-xs self-start sticky top-24">
      {content}
    </aside>
  );
};
