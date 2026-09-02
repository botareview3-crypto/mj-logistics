import React from 'react';
import { Disc, Gauge, Sliders, Flame, Zap, Thermometer, Sparkles, Wrench, ShieldCheck, ChevronRight, Package } from 'lucide-react';
import { useApp } from '../../lib/AppContext';
import { CATEGORY_ROOTS } from '../../lib/data/categories';
import { Breadcrumbs } from '../../components/Breadcrumbs';

const iconMap: Record<string, React.ElementType> = { Disc, Gauge, Sliders, Flame, Zap, Thermometer, Sparkles, Wrench, ShieldCheck };

export default function CatalogIndexPage() {
  const { navigate } = useApp();

  return (
    <div className="space-y-8 pb-12">
      <Breadcrumbs items={[{ label: 'Catalog Index' }]} />

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-sky-100 text-[#0077C7] text-xs font-bold uppercase tracking-wider"><Package className="w-3.5 h-3.5" /><span>Full Product Hierarchy</span></div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">All Auto Parts & Accessories Categories</h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl">Browse through all mechanical assemblies, electrical modules, engine servicing components, and workshop garage supplies.</p>
      </div>

      {/* Root 1: Car Parts */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div><span className="text-xs font-extrabold uppercase tracking-wider text-sky-600">Root Category 1</span><h2 className="text-xl font-black text-slate-900">{CATEGORY_ROOTS[0].name}</h2></div>
          <span className="text-xs text-slate-400 font-medium">{CATEGORY_ROOTS[0].systems.length} Major Systems</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORY_ROOTS[0].systems.map(system => {
            const IconComponent = iconMap[system.iconName] || Disc;
            return (
              <div key={system.id} className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-[#0077C7] transition-all p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0077C7] flex items-center justify-center shrink-0"><IconComponent className="w-5 h-5" /></div>
                    <div>
                      <button type="button" onClick={() => navigate(`/catalog/${system.id}`)} className="text-base font-bold text-slate-900 hover:text-[#0077C7] transition-colors text-left cursor-pointer">{system.name}</button>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{system.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {system.subsystems.map(sub => (
                      <button key={sub.id} type="button" onClick={() => navigate(`/catalog/${system.id}/${sub.id}`)} className="px-2.5 py-1 text-xs bg-slate-50 hover:bg-sky-50 hover:text-[#0077C7] hover:border-sky-200 text-slate-700 rounded-md border border-slate-200 transition-colors cursor-pointer text-left">{sub.name}</button>
                    ))}
                  </div>
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">{system.subsystems.reduce((t, s) => t + s.itemCount, 0).toLocaleString()} Parts available</span>
                  <button type="button" onClick={() => navigate(`/catalog/${system.id}`)} className="text-xs font-bold text-[#0077C7] hover:text-[#0060A1] flex items-center gap-1 cursor-pointer"><span>View System</span><ChevronRight className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Root 2: Accessories */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div><span className="text-xs font-extrabold uppercase tracking-wider text-amber-600">Root Category 2</span><h2 className="text-xl font-black text-slate-900">{CATEGORY_ROOTS[1].name}</h2></div>
          <span className="text-xs text-slate-400 font-medium">{CATEGORY_ROOTS[1].systems.length} Major Systems</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATEGORY_ROOTS[1].systems.map(system => {
            const IconComponent = iconMap[system.iconName] || Wrench;
            return (
              <div key={system.id} className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-amber-400 transition-all p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0"><IconComponent className="w-5 h-5" /></div>
                    <div>
                      <button type="button" onClick={() => navigate(`/catalog/${system.id}`)} className="text-base font-bold text-slate-900 hover:text-[#0077C7] transition-colors text-left cursor-pointer">{system.name}</button>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{system.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {system.subsystems.map(sub => (
                      <button key={sub.id} type="button" onClick={() => navigate(`/catalog/${system.id}/${sub.id}`)} className="px-2.5 py-1 text-xs bg-slate-50 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-200 text-slate-700 rounded-md border border-slate-200 transition-colors cursor-pointer text-left">{sub.name}</button>
                    ))}
                  </div>
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">{system.subsystems.reduce((t, s) => t + s.itemCount, 0).toLocaleString()} Items available</span>
                  <button type="button" onClick={() => navigate(`/catalog/${system.id}`)} className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"><span>View Equipment</span><ChevronRight className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
