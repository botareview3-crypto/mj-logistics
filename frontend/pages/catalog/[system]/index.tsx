import React from 'react';
import { useRouter } from 'next/router';
import { Disc, Gauge, Sliders, Flame, Zap, Thermometer, Sparkles, Wrench, ShieldCheck, ChevronRight, Package } from 'lucide-react';
import { useApp } from '../../../lib/AppContext';
import { getCategoryById } from '../../../lib/data/categories';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { CATEGORY_ROOTS } from '../../../lib/data/categories';

const iconMap: Record<string, React.ElementType> = { Disc, Gauge, Sliders, Flame, Zap, Thermometer, Sparkles, Wrench, ShieldCheck };

export default function SystemCategoryPage() {
  const router = useRouter();
  const systemId = router.query.system as string;
  const { navigate } = useApp();

  if (!systemId) return null;

  const catInfo = getCategoryById(systemId);

  if (!catInfo.system) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-slate-800">System Category Not Found</h2>
        <button type="button" onClick={() => navigate('/catalog')} className="px-4 py-2 bg-[#0077C7] text-white rounded-lg text-sm font-bold">Return to Catalog</button>
      </div>
    );
  }

  const { system, root } = catInfo;
  const IconComponent = iconMap[system.iconName] || Disc;

  return (
    <div className="space-y-8 pb-12">
      <Breadcrumbs items={[{ label: root?.name || 'Catalog', path: '/catalog' }, { label: system.name }]} />

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 text-[#0077C7] border border-sky-100 flex items-center justify-center shrink-0 shadow-xs"><IconComponent className="w-7 h-7" /></div>
          <div className="space-y-1">
            <div className="text-xs font-bold text-[#0077C7] uppercase tracking-wider">{root?.name}</div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{system.name}</h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">{system.description}</p>
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-right shrink-0 w-full md:w-auto">
          <span className="text-xs text-slate-400 block font-medium">Subsystems</span>
          <span className="text-xl font-extrabold text-slate-900">{system.subsystems.length} Assemblies</span>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2"><Package className="w-4 h-4 text-[#0077C7]" /><span>Select Sub-Assembly / Part Component</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {system.subsystems.map(sub => (
            <button key={sub.id} type="button" onClick={() => navigate(`/catalog/${system.id}/${sub.id}`)} className="bg-white rounded-xl border border-slate-200 hover:border-[#0077C7] hover:shadow-md transition-all p-5 text-left flex flex-col justify-between space-y-3 cursor-pointer group">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0077C7] transition-colors">{sub.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{sub.description}</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-sky-100 text-slate-500 group-hover:text-[#0077C7] flex items-center justify-center shrink-0 transition-colors"><ChevronRight className="w-4 h-4" /></div>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-sm">✓ OE & Aftermarket in stock</span>
                <span className="text-slate-400 font-mono">{sub.itemCount} items</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function getStaticPaths() {
  return {
    paths: CATEGORY_ROOTS.flatMap(root => root.systems.map(system => ({ params: { system: system.id } }))),
    fallback: false,
  };
}

export function getStaticProps() {
  return { props: {} };
}
