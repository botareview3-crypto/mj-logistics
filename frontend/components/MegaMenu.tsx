import React from 'react';
import { Disc, Gauge, Sliders, Flame, Zap, Thermometer, Sparkles, Wrench, ShieldCheck, ArrowRight, X, Package } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { CATEGORY_ROOTS } from '../lib/data/categories';

const iconMap: Record<string, React.ElementType> = { Disc, Gauge, Sliders, Flame, Zap, Thermometer, Sparkles, Wrench, ShieldCheck };

export const MegaMenu: React.FC = () => {
  const { isMegaMenuOpen, setIsMegaMenuOpen, navigate } = useApp();
  if (!isMegaMenuOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150" onClick={() => setIsMegaMenuOpen(false)} />
      <div className="fixed top-16 sm:top-20 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-2xl animate-in slide-in-from-top-3 duration-200 max-h-[82vh] overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2"><Package className="w-5 h-5 text-[#0077C7]" /><span>Full Spare Parts & Accessories Catalog</span></h2>
              <p className="text-xs text-slate-500 mt-0.5">Browse through all automotive categories, systems, and maintenance sub-assemblies.</p>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => { navigate('/catalog'); setIsMegaMenuOpen(false); }} className="text-xs font-bold text-[#0077C7] hover:text-[#0060A1] flex items-center gap-1 cursor-pointer"><span>View Complete Index</span><ArrowRight className="w-3.5 h-3.5" /></button>
              <button type="button" onClick={() => setIsMegaMenuOpen(false)} className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Car Parts */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              <span className="px-2 py-0.5 bg-sky-100 text-[#0077C7] rounded-sm font-extrabold">Root 1</span><span>Car Mechanical & Electrical Parts</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {CATEGORY_ROOTS[0].systems.map(system => {
                const IconComponent = iconMap[system.iconName] || Disc;
                return (
                  <div key={system.id} className="space-y-2.5">
                    <button type="button" onClick={() => { navigate(`/catalog/${system.id}`); setIsMegaMenuOpen(false); }} className="group flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-[#0077C7] transition-colors text-left cursor-pointer w-full">
                      <div className="w-6 h-6 rounded-md bg-slate-100 group-hover:bg-sky-100 text-[#0077C7] flex items-center justify-center shrink-0"><IconComponent className="w-3.5 h-3.5" /></div>
                      <span className="truncate border-b border-transparent group-hover:border-[#0077C7]">{system.name}</span>
                    </button>
                    <ul className="space-y-1.5 pl-8 border-l border-slate-100">
                      {system.subsystems.map(sub => (
                        <li key={sub.id}><button type="button" onClick={() => { navigate(`/catalog/${system.id}/${sub.id}`); setIsMegaMenuOpen(false); }} className="text-xs text-slate-600 hover:text-[#0077C7] hover:translate-x-0.5 transition-all text-left block w-full truncate cursor-pointer py-0.5">{sub.name}</button></li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Accessories */}
          <div className="pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-sm font-extrabold">Root 2</span><span>Accessories & Garage Equipment</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {CATEGORY_ROOTS[1].systems.map(system => {
                const IconComponent = iconMap[system.iconName] || Wrench;
                return (
                  <div key={system.id} className="space-y-2.5 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/60">
                    <button type="button" onClick={() => { navigate(`/catalog/${system.id}`); setIsMegaMenuOpen(false); }} className="group flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-[#0077C7] transition-colors text-left cursor-pointer w-full">
                      <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center shrink-0"><IconComponent className="w-3.5 h-3.5" /></div>
                      <span className="truncate">{system.name}</span>
                    </button>
                    <ul className="space-y-1.5 pl-8">
                      {system.subsystems.map(sub => (
                        <li key={sub.id}><button type="button" onClick={() => { navigate(`/catalog/${system.id}/${sub.id}`); setIsMegaMenuOpen(false); }} className="text-xs text-slate-600 hover:text-[#0077C7] transition-colors text-left block w-full truncate cursor-pointer">{sub.name}</button></li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
