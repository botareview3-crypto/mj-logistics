import React from 'react';
import Head from 'next/head';
import { motion } from 'motion/react';
import { ArrowUpRight, Award, RotateCcw, Truck, Gem, Sparkles } from 'lucide-react';
import { useApp } from '../lib/AppContext';

// The corporate landing page for MJ Logistics Enterprise — the parent brand
// over two divisions (the auto/industrial parts marketplace at /shop, and
// MJ Mining at /mining). Public, no sign-in required: see pages/shop.tsx for
// where the old "/" shopping homepage moved to, and pages/_app.tsx for the
// header/footer swap that makes this page use <SiteHeader>/<SiteFooter>
// instead of the shop's chrome.

const heroContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const heroItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
};

const STATS = [
  { value: '2', label: 'Business divisions' },
  { value: '13', label: 'Vehicle makes supported' },
  { value: '3', label: 'Marketplace categories' },
  { value: '2-Year', label: 'Warranty coverage' },
];

export default function LandingPage() {
  const { navigate } = useApp();

  return (
    <div>
      <Head>
        <title>MJ Logistics Enterprise | Parts marketplace &amp; MJ Mining</title>
        <meta name="description" content="MJ Logistics Enterprise runs a verified auto and industrial parts marketplace and MJ Mining, a diamond and gold operation. Browse freely — sign in only when you're ready to buy." />
      </Head>

      {/* ---------- Hero ---------- */}
      <section className="relative bg-[#0B1220] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '56px 56px' }} />
        <div className="absolute -left-32 -top-40 h-[30rem] w-[30rem] rounded-full bg-[#0077C7]/25 blur-[110px] pointer-events-none" />
        <div className="absolute -right-24 bottom-0 h-[26rem] w-[26rem] rounded-full bg-[#D4AF37]/20 blur-[110px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <motion.div variants={heroContainer} initial="hidden" animate="show">
            <motion.h1 variants={heroItem} className="max-w-3xl text-4xl sm:text-6xl lg:text-[4.5rem] font-extrabold tracking-tight text-white leading-[1.05]">
              The parts and materials that keep industries moving.
            </motion.h1>
            <motion.p variants={heroItem} className="mt-6 max-w-xl text-base sm:text-lg text-slate-300 leading-relaxed">
              MJ Logistics Enterprise runs two specialized divisions: a verified auto and industrial parts marketplace, and MJ Mining, our diamond and gold operation built on responsible sourcing.
            </motion.p>
            <motion.div variants={heroItem} className="mt-10 flex flex-wrap items-center gap-4">
              <button type="button" onClick={() => navigate('/shop')} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-[#0B1220] font-bold text-sm sm:text-base hover:bg-slate-100 transition-colors cursor-pointer">
                <span>Explore the Marketplace</span><ArrowUpRight className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => navigate('/mining')} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/25 text-white font-bold text-sm sm:text-base hover:bg-white/10 transition-colors cursor-pointer">
                <span>Visit MJ Mining</span>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ---------- Divisions ---------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 max-w-xl">Two divisions. One standard of care.</h2>
        <p className="mt-4 max-w-2xl text-slate-600 leading-relaxed">Whichever side of the business brought you here, you're free to look around. No account is needed until you're ready to check out.</p>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
          {/* Parts panel */}
          <div className="lg:col-span-3 rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 flex flex-col">
            <h3 className="text-2xl font-extrabold text-slate-900">Auto &amp; Industrial Parts</h3>
            <p className="mt-3 text-slate-600 leading-relaxed max-w-md">A vehicle-first parts catalogue spanning car parts, workshop accessories, and business equipment — filtered to what actually fits before you order.</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {['Car Parts', 'Accessories', 'Stationery & Equipment'].map(tag => (
                <span key={tag} className="px-3 py-1.5 rounded-full bg-sky-50 text-[#0077C7] text-xs font-bold border border-sky-100">{tag}</span>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-3 gap-4">
              {[
                { Icon: Award, title: '2-Year Warranty' },
                { Icon: RotateCcw, title: '30-Day Returns' },
                { Icon: Truck, title: 'Fast Delivery' },
              ].map(({ Icon, title }) => (
                <div key={title} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-[#0077C7] shrink-0" />
                  <span className="text-xs font-semibold text-slate-700 leading-tight">{title}</span>
                </div>
              ))}
            </div>

            <button type="button" onClick={() => navigate('/shop')} className="mt-8 self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0077C7] hover:bg-[#0060A1] text-white font-bold text-sm transition-colors cursor-pointer">
              <span>Explore the Marketplace</span><ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mining panel */}
          <div className="lg:col-span-2 rounded-2xl bg-[#0B1220] p-8 sm:p-10 text-white relative overflow-hidden flex flex-col">
            <div className="absolute -right-16 -bottom-16 h-56 w-56 rounded-full bg-[#D4AF37]/20 blur-[80px] pointer-events-none" />
            <div className="relative flex flex-col h-full">
              <h3 className="text-2xl font-extrabold">MJ Mining</h3>
              <p className="mt-3 text-slate-300 leading-relaxed">Diamond and gold extraction built on responsible operating standards and transparent sourcing.</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {[{ label: 'Diamonds', Icon: Gem }, { label: 'Gold', Icon: Sparkles }].map(({ label, Icon }) => (
                  <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-[#D4AF37] text-xs font-bold border border-white/10">
                    <Icon className="w-3.5 h-3.5" /><span>{label}</span>
                  </span>
                ))}
              </div>

              <button type="button" onClick={() => navigate('/mining')} className="mt-auto pt-8 self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-colors cursor-pointer">
                <span>Visit MJ Mining</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Stats ---------- */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">MJ Logistics Enterprise, at a glance</h2>
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map(stat => (
              <div key={stat.label}>
                <p className="text-3xl sm:text-4xl font-extrabold text-[#0077C7]">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- About ---------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">Built on precision and responsibility.</h2>
          </div>
          <div className="lg:col-span-7 space-y-5 text-base sm:text-lg text-slate-600 leading-relaxed">
            <p>Every part in our marketplace is checked against real vehicle fitment data before it ships, and every order carries warranty and return protection. It's the same care we bring to MJ Mining's operations, where responsible extraction and transparent sourcing come first.</p>
            <p>You're free to browse everything on this site without an account — the catalogue, fitment checks, and MJ Mining's story are all open. We only ask you to sign in when you're ready to complete a purchase.</p>
          </div>
        </div>
      </section>

      {/* ---------- Final CTA ---------- */}
      <section className="bg-[#0077C7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white max-w-md">Ready to find what you need?</h2>
          <div className="flex flex-wrap gap-4 shrink-0">
            <button type="button" onClick={() => navigate('/shop')} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#0077C7] font-bold text-sm hover:bg-slate-100 transition-colors cursor-pointer">
              <span>Explore the Marketplace</span><ArrowUpRight className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => navigate('/mining')} className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/40 text-white font-bold text-sm hover:bg-white/10 transition-colors cursor-pointer">
              <span>Visit MJ Mining</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
