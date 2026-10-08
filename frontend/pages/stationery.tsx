import React, { useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight, Briefcase, FileText, FolderOpen, Monitor, PenLine, Printer } from 'lucide-react';
import { useScrollFx } from '../lib/fx';
import { scrollToTarget } from '../lib/useLenis';
import { SplitText } from '../components/fx/SplitText';
import { Magnetic } from '../components/fx/Magnetic';
import { Marquee } from '../components/fx/Marquee';
import { LogoMark } from '../components/fx/Logo';

/* ─── Category data ──────────────────────────────────────────────────────── */
const STATIONERY_CATEGORIES = [
  {
    id: 'writing', icon: PenLine, title: 'Pens & Writing',
    desc: 'Ballpoint, gel, rollerball and fountain pens. Markers, highlighters and correction tools for every workspace.',
    items: ['Ballpoint Pens', 'Gel Pens', 'Markers & Highlighters', 'Correction Fluid & Tape', 'Mechanical Pencils'],
  },
  {
    id: 'paper', icon: FileText, title: 'Paper & Notebooks',
    desc: 'Premium notebooks, journals, A4 reams, sticky notes, and specialty paper for print and writing.',
    items: ['A4 & A5 Notebooks', 'Hardcover Journals', 'Sticky Notes', 'A4 Copy Paper Reams', 'Graph & Ruled Pads'],
  },
  {
    id: 'office', icon: Briefcase, title: 'Office Supplies',
    desc: 'Staplers, scissors, tape dispensers, binding materials, and all the essentials to keep an office running.',
    items: ['Staplers & Staples', 'Scissors & Cutters', 'Tape & Dispensers', 'Rubber Bands & Clips', 'Rulers & Geometry Sets'],
  },
  {
    id: 'filing', icon: FolderOpen, title: 'Filing & Storage',
    desc: 'Lever arch files, suspension files, document wallets, and desk organisers to keep paperwork under control.',
    items: ['Lever Arch Files', 'Suspension Files', 'Document Wallets', 'Magazine Files', 'Desk Organisers'],
  },
  {
    id: 'printing', icon: Printer, title: 'Printing & Ink',
    desc: 'Compatible ink cartridges, toner, photo paper, and laminating pouches for home and office printers.',
    items: ['Ink Cartridges', 'Laser Toner', 'Photo Paper', 'Laminating Pouches', 'Label Tape'],
  },
  {
    id: 'desk', icon: Monitor, title: 'Desk Accessories',
    desc: 'Pen holders, letter trays, mouse pads, desk mats, and everything that turns a desk into a productive space.',
    items: ['Pen & Pencil Holders', 'Letter Trays', 'Desk Mats', 'Whiteboard Markers & Erasers', 'Presentation Folders'],
  },
];

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function StationeryPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  useScrollFx(pageRef);

  return (
    <div ref={pageRef} className="overflow-x-clip bg-paper">
      <Head>
        <title>Stationery & Office | MJ Logistics Enterprise</title>
        <meta name="description" content="Quality stationery and office supplies — pens, paper, filing, printing and desk accessories, supplied by MJ Logistics Enterprise." />
      </Head>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section data-hero="dark" className="grain relative overflow-hidden bg-ink pb-20 pt-40 text-paper sm:pt-48">
        <div className="mx-auto grid max-w-[1440px] gap-14 px-5 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
          <div>
            <p data-reveal data-intro="0.05" className="eyebrow mb-8 flex items-center gap-3 text-mint">
              <span className="h-px w-10 bg-signal" /> A division of MJ Logistics Enterprise
            </p>
            <SplitText as="h1" intro={0.1} className="t-hero font-extrabold" text={'Everything for\nyour *workspace.*'} />
            <p data-reveal data-intro="0.5" className="mt-8 max-w-lg text-[17px] leading-8 text-paper/70">
              From a single pen to a full office fit-out — MJ Logistics supplies genuine stationery and
              office essentials with reliable delivery and competitive pricing.
            </p>
            <div data-reveal data-intro="0.65" className="mt-10 flex flex-wrap gap-3">
              <Magnetic>
                <Link href="/contact" className="btn btn-signal">Request a quote <ArrowUpRight className="btn-arrow h-4 w-4" /></Link>
              </Magnetic>
              <button type="button" onClick={() => scrollToTarget('#categories', -80)} className="btn btn-ghost">
                Browse the range <ArrowDownRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div data-clip data-intro="0.3" className="relative aspect-[4/3] overflow-hidden rounded-[28px]">
            <img src="/homepage/office.webp" alt="Notebook, pen, calculator and office supplies laid out on a desk" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────────────────────── */}
      <section className="bg-signal py-5 text-white">
        <Marquee speed={34}>
          {['Pens & writing', 'Paper & notebooks', 'Filing', 'Printing & ink', 'Desk accessories', 'Bulk orders'].map(t => (
            <span key={t} className="font-display flex items-center gap-8 pr-8 text-2xl font-extrabold uppercase tracking-tight sm:text-3xl">
              {t}<LogoMark tone="ink" className="h-7 w-7" />
            </span>
          ))}
        </Marquee>
      </section>

      {/* ── RANGE ────────────────────────────────────────────────────────── */}
      <section id="categories" className="bg-paper py-24 sm:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow mb-5 text-sage">What we supply</p>
              <SplitText className="t-xl font-extrabold" text={'Our stationery\n*range.*'} />
            </div>
            <p data-reveal className="max-w-md text-[16px] leading-7 text-ink/65">
              Sourced from trusted suppliers, our range covers everything from everyday writing instruments
              to bulk office consumables.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STATIONERY_CATEGORIES.map(({ id, icon: Icon, title, desc, items }, i) => (
              <article
                key={id}
                id={id}
                data-reveal
                data-delay={String((i % 3) * 0.08)}
                className="group relative flex flex-col overflow-hidden rounded-[28px] bg-white p-7 sm:p-8"
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-forest transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-y-100" />
                <div className="relative flex flex-1 flex-col transition-colors duration-500 group-hover:text-paper">
                  <div className="flex items-start justify-between">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-signal/10 text-signal transition-colors duration-500 group-hover:bg-signal group-hover:text-white">
                      <Icon className="h-6 w-6" strokeWidth={1.8} />
                    </span>
                    <span className="font-display text-xs font-semibold opacity-40">0{i + 1}</span>
                  </div>
                  <h3 className="mt-10 text-2xl">{title}</h3>
                  <p className="mt-3 text-[15px] leading-7 opacity-70">{desc}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {items.map(item => (
                      <li key={item} className="rounded-full border px-3 py-1 text-xs opacity-80" style={{ borderColor: 'color-mix(in srgb, currentColor 18%, transparent)' }}>{item}</li>
                    ))}
                  </ul>
                  <Link href="/contact" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-signal">
                    Enquire <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── BULK ORDERS ──────────────────────────────────────────────────── */}
      <section className="bg-paper px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="grain relative overflow-hidden rounded-[32px] bg-forest px-6 py-16 text-paper sm:px-12 sm:py-24">
          <LogoMark tone="light" className="animate-spin-slow pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] opacity-[.06]" />
          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
            <div>
              <p className="eyebrow mb-5 text-mint/70">Bulk & business orders</p>
              <SplitText className="t-xl font-extrabold" text={'Need to stock an office?\n*We’ve got you covered.*'} />
            </div>
            <div data-reveal className="flex flex-col gap-5 lg:items-end">
              <p className="max-w-sm text-[16px] leading-7 text-paper/75 lg:text-right">
                MJ Logistics handles bulk stationery orders for businesses, schools, and institutions — with a
                single point of contact.
              </p>
              <Magnetic>
                <Link href="/contact" className="btn btn-signal">Contact our team <ArrowUpRight className="btn-arrow h-4 w-4" /></Link>
              </Magnetic>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
