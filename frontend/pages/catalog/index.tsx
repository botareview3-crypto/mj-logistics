import React from 'react';
import { Disc, CircleDot, Gauge, Sliders, Flame, Zap, Thermometer, Sparkles, Wrench, ShieldCheck, ChevronRight, Package } from 'lucide-react';
import { useApp } from '../../lib/AppContext';
import { CATEGORY_ROOTS } from '../../lib/data/categories';
import { Breadcrumbs } from '../../components/Breadcrumbs';

const iconMap: Record<string, React.ElementType> = { Disc, CircleDot, Gauge, Sliders, Flame, Zap, Thermometer, Sparkles, Wrench, ShieldCheck, Package };

// Alternating visual treatment per root — cycles if there are more roots
// than presets defined, so a newly added root always renders sensibly.
const ROOT_STYLES = [
  { labelColor: 'text-[#0077C7]', iconBg: 'bg-sky-50', iconText: 'text-[#0077C7]', hoverBorder: 'hover:border-[#0077C7]', chipHover: 'hover:bg-sky-50 hover:text-[#0077C7] hover:border-sky-200', linkColor: 'text-[#0077C7] hover:text-[#0060A1]', unit: 'Parts available', cta: 'View System', fallbackIcon: Disc },
  { labelColor: 'text-[#1769aa]', iconBg: 'bg-blue-50', iconText: 'text-[#1769aa]', hoverBorder: 'hover:border-[#1769aa]', chipHover: 'hover:bg-blue-50 hover:text-[#1769aa] hover:border-blue-200', linkColor: 'text-[#1769aa] hover:text-[#0b4f86]', unit: 'Items available', cta: 'View Equipment', fallbackIcon: Wrench },
  { labelColor: 'text-[#315f91]', iconBg: 'bg-indigo-50', iconText: 'text-[#315f91]', hoverBorder: 'hover:border-[#315f91]', chipHover: 'hover:bg-indigo-50 hover:text-[#315f91] hover:border-indigo-200', linkColor: 'text-[#315f91] hover:text-[#24486e]', unit: 'Items available', cta: 'View Shop', fallbackIcon: Package },
];

export default function CatalogIndexPage() {
  const { navigate } = useApp();

  return (
    <div className="space-y-8 pb-12">
      <Breadcrumbs items={[{ label: 'Catalog Index' }]} />

      <div className="relative overflow-hidden rounded-3xl bg-[#071a33] p-7 text-white shadow-xl sm:p-10">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#1689d8]/30 blur-3xl" />
        <div className="relative space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/30 bg-sky-300/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-sky-200"><Package className="w-3.5 h-3.5" /><span>Full Product Hierarchy</span></div>
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">Find the system behind the solution.</h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">Browse automotive, industrial, and equipment categories through a clear path from system to compatible part.</p>
        </div>
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
