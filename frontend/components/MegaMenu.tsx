import React from 'react';
import { Disc, CircleDot, Gauge, Sliders, Flame, Zap, Thermometer, Sparkles, Wrench, ShieldCheck, ArrowRight, X, Package } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { CATEGORY_ROOTS } from '../lib/data/categories';

const iconMap: Record<string, React.ElementType> = { Disc, CircleDot, Gauge, Sliders, Flame, Zap, Thermometer, Sparkles, Wrench, ShieldCheck, Package };

// Alternating visual treatment per root section — cycles if there are more
// roots than presets defined here, so a new root always renders sensibly
// instead of needing a hardcoded block added for it.
const ROOT_STYLES = [
  { badgeBg: 'bg-sky-100', badgeText: 'text-[#0077C7]', iconBg: 'bg-slate-100 group-hover:bg-sky-100', iconText: 'text-[#0077C7]', cols: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6', cardBg: '', fallbackIcon: Disc },
  { badgeBg: 'bg-amber-100', badgeText: 'text-amber-800', iconBg: 'bg-amber-100', iconText: 'text-amber-800', cols: 'grid-cols-1 sm:grid-cols-3', cardBg: 'bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/60', fallbackIcon: Wrench },
  { badgeBg: 'bg-emerald-100', badgeText: 'text-emerald-800', iconBg: 'bg-emerald-100', iconText: 'text-emerald-800', cols: 'grid-cols-1 sm:grid-cols-3', cardBg: 'bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/60', fallbackIcon: Package },
];

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
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2"><Package className="w-5 h-5 text-[#0077C7]" /><span>Full Catalog</span></h2>
              <p className="text-xs text-slate-500 mt-0.5">Browse every category we carry, across all shops.</p>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => { navigate('/catalog'); setIsMegaMenuOpen(false); }} className="text-xs font-bold text-[#0077C7] hover:text-[#0060A1] flex items-center gap-1 cursor-pointer"><span>View Complete Index</span><ArrowRight className="w-3.5 h-3.5" /></button>
              <button type="button" onClick={() => setIsMegaMenuOpen(false)} className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
          </div>

          {CATEGORY_ROOTS.map((root, idx) => {
            const style = ROOT_STYLES[idx % ROOT_STYLES.length];
            return (
              <div key={root.id} className={idx === 0 ? 'mb-8' : 'pt-6 border-t border-slate-100 mb-8 last:mb-0'}>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  <span className={`px-2 py-0.5 ${style.badgeBg} ${style.badgeText} rounded-sm font-extrabold`}>Root {idx + 1}</span><span>{root.name}</span>
                </div>
                <div className={`grid ${style.cols} gap-6`}>
                  {root.systems.map(system => {
                    const IconComponent = iconMap[system.iconName] || style.fallbackIcon;
                    return (
                      <div key={system.id} className={`space-y-2.5 ${style.cardBg}`}>
                        <button type="button" onClick={() => { navigate(`/catalog/${system.id}`); setIsMegaMenuOpen(false); }} className="group flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-[#0077C7] transition-colors text-left cursor-pointer w-full">
                          <div className={`w-6 h-6 rounded-md ${style.iconBg} ${style.iconText} flex items-center justify-center shrink-0`}><IconComponent className="w-3.5 h-3.5" /></div>
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
            );
          })}
        </div>
      </div>
    </>
  );
};
