import React from 'react';
import Head from 'next/head';
import { ArrowRight, PenLine, FileText, Briefcase, FolderOpen, Printer, Monitor, Mail, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../lib/AppContext';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { SPRINGS } from '../lib/springs';

/* ─── Category data ──────────────────────────────────────────────────────── */
const STATIONERY_CATEGORIES = [
  {
    id: 'writing',
    icon: PenLine,
    title: 'Pens & Writing',
    desc: 'Ballpoint, gel, rollerball and fountain pens. Markers, highlighters and correction tools for every workspace.',
    items: ['Ballpoint Pens', 'Gel Pens', 'Markers & Highlighters', 'Correction Fluid & Tape', 'Mechanical Pencils'],
    color: 'from-blue-50 to-indigo-50',
    accent: '#1e4d8c',
  },
  {
    id: 'paper',
    icon: FileText,
    title: 'Paper & Notebooks',
    desc: 'Premium notebooks, journals, A4 reams, sticky notes, and specialty paper for print and writing.',
    items: ['A4 & A5 Notebooks', 'Hardcover Journals', 'Sticky Notes', 'A4 Copy Paper Reams', 'Graph & Ruled Pads'],
    color: 'from-amber-50 to-yellow-50',
    accent: '#b45309',
  },
  {
    id: 'office',
    icon: Briefcase,
    title: 'Office Supplies',
    desc: 'Staplers, scissors, tape dispensers, binding materials, and all the essentials to keep an office running.',
    items: ['Staplers & Staples', 'Scissors & Cutters', 'Tape & Dispensers', 'Rubber Bands & Clips', 'Rulers & Geometry Sets'],
    color: 'from-emerald-50 to-teal-50',
    accent: '#065f46',
  },
  {
    id: 'filing',
    icon: FolderOpen,
    title: 'Filing & Storage',
    desc: 'Lever arch files, suspension files, document wallets, and desk organisers to keep paperwork under control.',
    items: ['Lever Arch Files', 'Suspension Files', 'Document Wallets', 'Magazine Files', 'Desk Organisers'],
    color: 'from-orange-50 to-red-50',
    accent: '#9a3412',
  },
  {
    id: 'printing',
    icon: Printer,
    title: 'Printing & Ink',
    desc: 'Compatible ink cartridges, toner, photo paper, and laminating pouches for home and office printers.',
    items: ['Ink Cartridges', 'Laser Toner', 'Photo Paper', 'Laminating Pouches', 'Label Tape'],
    color: 'from-violet-50 to-purple-50',
    accent: '#5b21b6',
  },
  {
    id: 'desk',
    icon: Monitor,
    title: 'Desk Accessories',
    desc: 'Pen holders, letter trays, mouse pads, desk mats, and everything that turns a desk into a productive space.',
    items: ['Pen & Pencil Holders', 'Letter Trays', 'Desk Mats', 'Whiteboard Markers & Erasers', 'Presentation Folders'],
    color: 'from-slate-50 to-gray-100',
    accent: '#0d1f3c',
  },
];

/* ─── Stats ──────────────────────────────────────────────────────────────── */
const STATS = [
  { value: '500+', label: 'Products in stock' },
  { value: '48h',  label: 'Delivery nationwide' },
  { value: '50+',  label: 'Trusted brands' },
  { value: 'Bulk', label: 'Order discounts' },
];

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function StationeryPage() {
  const { navigate } = useApp();

  return (
    <div className="bg-[#f5f4ef] text-[#0d1f3c] overflow-hidden">
      <Head>
        <title>Stationery | MJ Logistics Enterprise</title>
        <meta
          name="description"
          content="Quality stationery and office supplies — pens, paper, filing, printing and desk accessories delivered fast across the region."
        />
      </Head>

      <SiteHeader />

      <main>
        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section className="relative bg-[#0d1f3c] text-white overflow-hidden" style={{ minHeight: '480px' }}>
          {/* Decorative background circles */}
          <div className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute top-1/2 -left-16 w-[300px] h-[300px] rounded-full bg-white/3 pointer-events-none" />

          <div className="max-w-[1200px] mx-auto px-6 lg:px-10 pt-36 pb-20 relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
              <div className="max-w-2xl">
                <p className="font-display text-[11px] font-bold uppercase tracking-[0.35em] text-white/50 mb-4">
                  A division of MJ Logistics Enterprise
                </p>
                <h1 className="font-display text-5xl sm:text-7xl font-bold leading-[.95] mb-6">
                  Everything for<br />
                  <span className="italic font-normal" style={{ fontFamily: "'Chopin Trial', serif" }}>
                    your workspace.
                  </span>
                </h1>
                <p className="text-white/70 text-[15px] leading-relaxed max-w-lg">
                  From a single pen to a full office fit-out — MJ Logistics supplies genuine stationery
                  and office essentials with reliable delivery and competitive pricing.
                </p>
              </div>

              {/* Hero image */}
              <div className="flex items-center justify-center lg:justify-end shrink-0">
                <motion.img
                  src="/categories/pen-paper.webp"
                  alt="Stationery essentials"
                  className="w-48 h-48 lg:w-56 lg:h-56 object-contain drop-shadow-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
                />
              </div>
            </div>

            {/* CTA row */}
            <div className="flex flex-wrap gap-3 mt-10">
              <motion.button
                type="button"
                onClick={() => navigate('/contact')}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white text-[#0d1f3c] font-bold text-[14px] rounded-xl hover:bg-white/90 transition-colors cursor-pointer shadow-lg"
                whileTap={{ scale: 0.97 }}
                transition={SPRINGS.micro}
              >
                Request a Quote
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button
                type="button"
                onClick={() => {
                  document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 border border-white/30 text-white font-bold text-[14px] rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                whileTap={{ scale: 0.97 }}
                transition={SPRINGS.micro}
              >
                Browse Products
              </motion.button>
            </div>
          </div>
        </section>

        {/* ── STATS STRIP ──────────────────────────────────────────────── */}
        <section className="bg-white border-b border-slate-100">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-3xl font-bold text-[#0d1f3c]">{s.value}</p>
                  <p className="text-[12px] text-slate-500 mt-1 uppercase tracking-[0.1em] font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CATEGORY GRID ────────────────────────────────────────────── */}
        <section id="categories" className="py-20">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
            <div className="mb-12">
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-2">What we supply</p>
              <h2 className="font-display text-4xl font-bold text-[#0d1f3c]">Our Stationery Range</h2>
              <p className="mt-3 text-slate-500 text-[14px] max-w-xl leading-relaxed">
                Sourced from trusted suppliers, our full range covers everything from everyday writing instruments to bulk office consumables.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {STATIONERY_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <motion.div
                    key={cat.id}
                    id={cat.id}
                    className={`relative bg-gradient-to-br ${cat.color} rounded-2xl p-6 flex flex-col border border-white/60 group`}
                    whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(13,31,60,0.10)' }}
                    transition={SPRINGS.default}
                  >
                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 shrink-0"
                      style={{ backgroundColor: `${cat.accent}18` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: cat.accent }} strokeWidth={1.8} />
                    </div>

                    <h3 className="font-display text-[18px] font-bold text-[#0d1f3c] mb-2">{cat.title}</h3>
                    <p className="text-[13px] text-slate-500 leading-relaxed mb-4 flex-1">{cat.desc}</p>

                    {/* Item list */}
                    <ul className="space-y-1.5 mb-5">
                      {cat.items.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-[12px] text-slate-600">
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: cat.accent }}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <motion.button
                      type="button"
                      onClick={() => navigate('/contact')}
                      className="inline-flex items-center gap-1.5 text-[12px] font-bold cursor-pointer transition-opacity"
                      style={{ color: cat.accent }}
                      whileTap={{ scale: 0.97 }}
                      transition={SPRINGS.micro}
                    >
                      Enquire <ChevronRight className="w-3.5 h-3.5" />
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── BULK ORDERS BANNER ───────────────────────────────────────── */}
        <section className="py-16 bg-white">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
            <div className="rounded-3xl bg-gradient-to-br from-[#0d1f3c] to-[#1a3560] p-8 sm:p-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8 overflow-hidden relative">
              <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative max-w-xl">
                <p className="font-display text-[11px] font-bold uppercase tracking-[0.3em] text-white/50 mb-3">Bulk & Business Orders</p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white leading-[1.1] mb-4">
                  Need to stock an office?<br />
                  <span className="italic font-normal" style={{ fontFamily: "'Chopin Trial', serif" }}>
                    We've got you covered.
                  </span>
                </h2>
                <p className="text-white/70 text-[14px] leading-relaxed">
                  MJ Logistics handles bulk stationery orders for businesses, schools, and government
                  institutions. Competitive rates, reliable delivery, and a single point of contact.
                </p>
              </div>
              <div className="relative flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                <motion.button
                  type="button"
                  onClick={() => navigate('/contact')}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white text-[#0d1f3c] font-bold text-[14px] rounded-xl hover:bg-white/90 transition-colors cursor-pointer"
                  whileTap={{ scale: 0.97 }}
                  transition={SPRINGS.micro}
                >
                  Contact our team <ArrowRight className="w-4 h-4" />
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => navigate('/')}
                  className="inline-flex items-center gap-2 text-white/60 text-[13px] font-medium cursor-pointer hover:text-white transition-colors"
                  whileTap={{ scale: 0.97 }}
                  transition={SPRINGS.micro}
                >
                  Back to home
                </motion.button>
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTACT STRIP ────────────────────────────────────────────── */}
        <section className="bg-[#f5f4ef] py-16">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10 text-center">
            <p className="font-display text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-3">Get in touch</p>
            <h2 className="font-display text-3xl font-bold text-[#0d1f3c] mb-4">Can't find what you need?</h2>
            <p className="text-slate-500 text-[14px] max-w-md mx-auto mb-8 leading-relaxed">
              Our team can source specific stationery products. Just let us know what you're looking for.
            </p>
            <motion.button
              type="button"
              onClick={() => navigate('/contact')}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#0d1f3c] text-white font-bold text-[14px] rounded-xl hover:bg-[#1a3560] transition-colors cursor-pointer"
              whileTap={{ scale: 0.97 }}
              transition={SPRINGS.micro}
            >
              <Mail className="w-4 h-4" />
              Send an enquiry
            </motion.button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
