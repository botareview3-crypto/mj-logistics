import React, { useState } from 'react';
import {
  Disc, CircleDot, Gauge, Sliders, Flame, Zap,
  Thermometer, Sparkles, Wrench, ShieldCheck, ChevronRight,
  Package, Search,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../../lib/AppContext';
import { CATEGORY_ROOTS } from '../../lib/data/categories';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { SPRINGS } from '../../lib/springs';

const iconMap: Record<string, React.ElementType> = {
  Disc, CircleDot, Gauge, Sliders, Flame, Zap,
  Thermometer, Sparkles, Wrench, ShieldCheck, Package,
};

const ROOT_ACCENT: Record<number, string> = {
  0: '#1e4d8c',
  1: '#1a3560',
  2: '#243d6a',
};

export default function CatalogIndexPage() {
  const { navigate } = useApp();
  const [query, setQuery] = useState('');

  const filteredRoots = CATEGORY_ROOTS.map(root => ({
    ...root,
    systems: root.systems.filter(sys =>
      !query || sys.name.toLowerCase().includes(query.toLowerCase()) ||
      sys.subsystems.some(s => s.name.toLowerCase().includes(query.toLowerCase()))
    ),
  })).filter(root => root.systems.length > 0);

  return (
    <div className="space-y-10 pb-16">
      <Breadcrumbs items={[{ label: 'Catalog' }]} />

      {/* ── Hero banner ──────────────────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden bg-[#0d1f3c]">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('/aerial-view-container-cargo-ship-sea.webp')" }} />
        <div className="relative px-8 py-12 sm:px-12">
          <p className="font-display text-[11px] font-bold uppercase tracking-[0.3em] text-white/50 mb-3">
            Complete Product Catalog
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            Find the Right Part.<br />
            <span className="italic font-light">Every Time.</span>
          </h1>
          <p className="text-white/65 text-[15px] max-w-lg mb-8 leading-relaxed">
            Auto parts with vehicle fitment and workshop essentials — all in one place.
          </p>

          {/* Inline search */}
          <div className="relative max-w-md">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Filter systems…"
              className="w-full pl-5 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          </div>
        </div>
      </div>

      {/* ── Category roots ───────────────────────────────────────────── */}
      {filteredRoots.map((root, idx) => {
        const accent = ROOT_ACCENT[idx] ?? '#1e4d8c';
        return (
          <section key={root.id} className="space-y-5">
            {/* Section heading */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-1 h-7 rounded-full"
                  style={{ background: accent }}
                />
                <h2 className="font-display text-2xl font-bold text-[#0d1f3c]">{root.name}</h2>
              </div>
              <span className="text-xs text-slate-400 font-medium hidden sm:block">
                {root.systems.length} systems
              </span>
            </div>

            {/* System cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {root.systems.map(system => {
                const IconComponent = iconMap[system.iconName] || Wrench;
                const totalItems = system.subsystems.reduce((t, s) => t + s.itemCount, 0);
                return (
                  <motion.div
                    key={system.id}
                    className="product-card bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-4"
                    whileHover={{ y: -3, borderColor: accent, boxShadow: '0 16px 40px rgba(13,31,60,0.10)' }}
                    transition={SPRINGS.default}
                  >
                    {/* Header */}
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `${accent}18`, color: accent }}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => navigate(`/catalog/${system.id}`)}
                          className="font-display text-[16px] font-bold text-[#0d1f3c] hover:text-[#1e4d8c] transition-colors cursor-pointer text-left leading-tight"
                        >
                          {system.name}
                        </button>
                        {system.description && (
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{system.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Subcategory chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {system.subsystems.map(sub => (
                        <motion.button
                          key={sub.id}
                          type="button"
                          onClick={() => navigate(`/catalog/${system.id}/${sub.id}`)}
                          className="px-2.5 py-1 text-[11px] font-medium bg-slate-50 hover:bg-[#0d1f3c] hover:text-white text-slate-600 rounded-lg border border-slate-200 hover:border-[#0d1f3c] transition-colors cursor-pointer"
                          whileTap={{ scale: 0.96 }}
                          transition={SPRINGS.micro}
                        >
                          {sub.name}
                        </motion.button>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 mt-auto">
                      <span className="text-[11px] text-slate-400 font-medium">
                        {totalItems.toLocaleString()} items
                      </span>
                      <motion.button
                        type="button"
                        onClick={() => navigate(`/catalog/${system.id}`)}
                        className="flex items-center gap-1 text-xs font-bold transition-colors cursor-pointer"
                        style={{ color: accent }}
                        whileTap={{ scale: 0.97 }}
                        transition={SPRINGS.micro}
                      >
                        View all <ChevronRight className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        );
      })}

      {filteredRoots.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-display text-xl font-semibold">No systems match &ldquo;{query}&rdquo;</p>
          <button type="button" onClick={() => setQuery('')} className="mt-3 text-sm text-[#1e4d8c] underline cursor-pointer">Clear filter</button>
        </div>
      )}
    </div>
  );
}
