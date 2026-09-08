import React from 'react';
import { Disc, CircleDot, Gauge, Sliders, Flame, Zap, Thermometer, Sparkles, Wrench, ShieldCheck, ChevronRight, Package } from 'lucide-react';
import { useApp } from '../../lib/AppContext';
import { CATEGORY_ROOTS } from '../../lib/data/categories';
import { Breadcrumbs } from '../../components/Breadcrumbs';

const iconMap: Record<string, React.ElementType> = { Disc, CircleDot, Gauge, Sliders, Flame, Zap, Thermometer, Sparkles, Wrench, ShieldCheck, Package };

// Alternating visual treatment per root — cycles if there are more roots
// than presets defined, so a newly added root always renders sensibly.
const ROOT_STYLES = [
  { labelColor: 'text-sky-600', iconBg: 'bg-sky-50', iconText: 'text-[#0077C7]', hoverBorder: 'hover:border-[#0077C7]', chipHover: 'hover:bg-sky-50 hover:text-[#0077C7] hover:border-sky-200', linkColor: 'text-[#0077C7] hover:text-[#0060A1]', unit: 'Parts available', cta: 'View System', fallbackIcon: Disc },
  { labelColor: 'text-amber-600', iconBg: 'bg-amber-50', iconText: 'text-amber-700', hoverBorder: 'hover:border-amber-400', chipHover: 'hover:bg-amber-50 hover:text-amber-800 hover:border-amber-200', linkColor: 'text-amber-700 hover:text-amber-800', unit: 'Items available', cta: 'View Equipment', fallbackIcon: Wrench },
  { labelColor: 'text-emerald-600', iconBg: 'bg-emerald-50', iconText: 'text-emerald-700', hoverBorder: 'hover:border-emerald-400', chipHover: 'hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200', linkColor: 'text-emerald-700 hover:text-emerald-800', unit: 'Items available', cta: 'View Shop', fallbackIcon: Package },
];

export default function CatalogIndexPage() {
  const { navigate } = useApp();

  return (
    <div className="space-y-8 pb-12">
      <Breadcrumbs items={[{ label: 'Catalog Index' }]} />

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-sky-100 text-[#0077C7] text-xs font-bold uppercase tracking-wider"><Package className="w-3.5 h-3.5" /><span>Full Product Hierarchy</span></div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Everything We Carry</h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl">Browse every shop, category, and sub-category across the full catalog.</p>
      </div>

      {CATEGORY_ROOTS.map((root, idx) => {
        const style = ROOT_STYLES[idx % ROOT_STYLES.length];
        return (
          <section key={root.id} className={idx === 0 ? 'space-y-4' : 'space-y-4 pt-4'}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div><span className={`text-xs font-extrabold uppercase tracking-wider ${style.labelColor}`}>Root Category {idx + 1}</span><h2 className="text-xl font-black text-slate-900">{root.name}</h2></div>
              <span className="text-xs text-slate-400 font-medium">{root.systems.length} Major Systems</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {root.systems.map(system => {
                const IconComponent = iconMap[system.iconName] || style.fallbackIcon;
                return (
                  <div key={system.id} className={`bg-white rounded-xl border border-slate-200 shadow-xs ${style.hoverBorder} transition-all p-5 flex flex-col justify-between space-y-4`}>
                    <div>
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl ${style.iconBg} ${style.iconText} flex items-center justify-center shrink-0`}><IconComponent className="w-5 h-5" /></div>
                        <div>
                          <button type="button" onClick={() => navigate(`/catalog/${system.id}`)} className="text-base font-bold text-slate-900 hover:text-[#0077C7] transition-colors text-left cursor-pointer">{system.name}</button>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{system.description}</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                        {system.subsystems.map(sub => (
                          <button key={sub.id} type="button" onClick={() => navigate(`/catalog/${system.id}/${sub.id}`)} className={`px-2.5 py-1 text-xs bg-slate-50 ${style.chipHover} text-slate-700 rounded-md border border-slate-200 transition-colors cursor-pointer text-left`}>{sub.name}</button>
                        ))}
                      </div>
                    </div>
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-medium">{system.subsystems.reduce((t, s) => t + s.itemCount, 0).toLocaleString()} {style.unit}</span>
                      <button type="button" onClick={() => navigate(`/catalog/${system.id}`)} className={`text-xs font-bold ${style.linkColor} flex items-center gap-1 cursor-pointer`}><span>{style.cta}</span><ChevronRight className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
