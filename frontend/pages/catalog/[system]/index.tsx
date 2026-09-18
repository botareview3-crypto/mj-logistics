import React from 'react';
import { useRouter } from 'next/router';
import {
  Disc, Gauge, Sliders, Flame, Zap, Thermometer,
  Sparkles, Wrench, ShieldCheck, ChevronRight, Package, ArrowRight,
} from 'lucide-react';
import { useApp } from '../../../lib/AppContext';
import { getCategoryById, CATEGORY_ROOTS } from '../../../lib/data/categories';
import { Breadcrumbs } from '../../../components/Breadcrumbs';

const iconMap: Record<string, React.ElementType> = {
  Disc, Gauge, Sliders, Flame, Zap, Thermometer,
  Sparkles, Wrench, ShieldCheck,
};

const CATEGORY_PRESENTATION: Record<string, {
  image: string;
  accent: string;
  eyebrow: string;
  availability: string;
}> = {
  'car-parts': {
    image: '/homepage/auto-parts-istock.jpg',
    accent: '#1e4d8c',
    eyebrow: 'Vehicle systems',
    availability: 'OE & aftermarket',
  },
  'stationery-equipment': {
    image: '/homepage/office.webp',
    accent: '#9b7430',
    eyebrow: 'Workplace essentials',
    availability: 'Business-ready supplies',
  },
};

export default function SystemCategoryPage() {
  const router   = useRouter();
  const systemId = router.query.system as string;
  const { navigate } = useApp();

  if (!systemId) return null;

  const { system, root } = getCategoryById(systemId);

  if (!system) {
    return (
      <div className="text-center py-20 space-y-4">
        <Package className="w-12 h-12 mx-auto text-slate-300" />
        <h2 className="font-display text-2xl font-bold text-[#0d1f3c]">Category Not Found</h2>
        <button
          type="button"
          onClick={() => navigate('/catalog')}
          className="px-5 py-2.5 bg-[#0d1f3c] text-white font-semibold rounded-xl cursor-pointer"
        >
          Back to Catalog
        </button>
      </div>
    );
  }

  const Icon        = iconMap[system.iconName] || Wrench;
  const totalItems  = system.subsystems.reduce((t, s) => t + s.itemCount, 0);
  const presentation = CATEGORY_PRESENTATION[root?.id || ''] || CATEGORY_PRESENTATION['car-parts'];
  const accentHoverClass = presentation.accent === '#9b7430'
    ? 'hover:border-[#9b7430] group-hover:text-[#9b7430] group-hover:bg-[#9b7430]'
    : 'hover:border-[#1e4d8c] group-hover:text-[#1e4d8c] group-hover:bg-[#1e4d8c]';

  return (
    <div className="space-y-8 pb-16">
      <Breadcrumbs items={[
        { label: root?.name || 'Catalog', path: '/catalog' },
        { label: system.name },
      ]} />

      {/* ── Hero banner ──────────────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden bg-[#0d1f3c]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url('${presentation.image}')` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1f3c] via-[#0d1f3c]/90 to-[#0d1f3c]/55" />
        <div className="relative p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div
            className="w-16 h-16 rounded-2xl border border-white/20 flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${presentation.accent}66` }}
          >
            <Icon className="w-8 h-8 text-white/80" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <p className="font-display text-[11px] font-bold uppercase tracking-[0.25em] mb-1" style={{ color: presentation.accent === '#9b7430' ? '#e4c781' : '#8fc5ff' }}>
              {presentation.eyebrow} · {root?.name}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight">
              {system.name}
            </h1>
            {system.description && (
              <p className="text-white/65 text-[14px] mt-2 max-w-2xl leading-relaxed">
                {system.description}
              </p>
            )}
          </div>
          <div className="bg-white/10 border border-white/15 rounded-2xl px-6 py-4 text-right shrink-0">
            <p className="text-[11px] text-white/50 uppercase tracking-wider font-semibold">Sub-assemblies</p>
            <p className="font-display text-3xl font-bold text-white mt-0.5">{system.subsystems.length}</p>
            <p className="text-[11px] text-white/50 mt-1">{totalItems.toLocaleString()} products</p>
          </div>
        </div>
      </div>

      {/* ── Sub-assembly grid ────────────────────────────────────── */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold text-[#0d1f3c] flex items-center gap-2">
          <Package className="w-5 h-5" style={{ color: presentation.accent }} />
          Explore {system.name}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {system.subsystems.map(sub => (
            <button
              key={sub.id}
              type="button"
              onClick={() => navigate(`/catalog/${system.id}/${sub.id}`)}
              className={`product-card bg-white rounded-2xl border border-slate-200 ${accentHoverClass} p-5 text-left flex flex-col gap-3 cursor-pointer group`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className={`font-display text-[16px] font-bold text-[#0d1f3c] ${accentHoverClass.split(' ')[1]} transition-colors leading-snug`}>
                    {sub.name}
                  </h3>
                  {sub.description && (
                    <p className="text-[12px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {sub.description}
                    </p>
                  )}
                </div>
                <div className={`w-9 h-9 rounded-xl bg-slate-100 ${accentHoverClass.split(' ')[2]} text-slate-400 group-hover:text-white flex items-center justify-center shrink-0 transition-all`}>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[12px]">
                <span className="inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full" style={{ color: presentation.accent, backgroundColor: `${presentation.accent}12` }}>
                ✓ {presentation.availability}
                </span>
                <span className="text-slate-400 font-mono">{sub.itemCount} items</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Back link ────────────────────────────────────────────── */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => navigate('/catalog')}
          className="flex items-center gap-1 text-[13px] font-semibold text-[#1e4d8c] hover:text-[#0d1f3c] transition-colors cursor-pointer"
        >
          <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          Back to all categories
        </button>
      </div>
    </div>
  );
}

export function getStaticPaths() {
  return {
    paths: CATEGORY_ROOTS.flatMap(root =>
      root.systems.map(system => ({ params: { system: system.id } }))
    ),
    fallback: false,
  };
}

export function getStaticProps() {
  return { props: {} };
}
