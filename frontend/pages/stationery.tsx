import React, { useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight, Briefcase, FileText, FolderOpen, Monitor, PenLine, Printer } from 'lucide-react';
import { useScrollFx } from '../lib/fx';
import { scrollToTarget } from '../lib/useLenis';
import { SplitText } from '../components/fx/SplitText';
import { PageHero } from '../components/fx/PageHero';

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

      <PageHero
        eyebrow="A division of MJ Logistics Enterprise"
        title={'Everything for your *workspace.*'}
        intro="From a single pen to a full office fit-out — MJ Logistics supplies genuine stationery and office essentials with reliable delivery and competitive pricing."
        actions={<>
          <Link href="/contact" className="btn btn-signal">Request a quote <ArrowUpRight className="btn-arrow h-4 w-4" /></Link>
          <button type="button" onClick={() => scrollToTarget('#categories', -80)} className="btn btn-ghost-dark">Browse the range <ArrowDownRight className="h-4 w-4" /></button>
        </>}
        image="/homepage/office.webp"
        imageAlt="Notebook, pen, calculator and office supplies laid out on a desk"
      />

      {/* ── RANGE ────────────────────────────────────────────────────────── */}
      <section id="categories" className="scroll-mt-24 bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="mb-12 grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="eyebrow mb-4 text-sage">What we supply</p>
              <SplitText className="t-xl" text={'Our stationery *range.*'} />
            </div>
            <p data-reveal className="max-w-md text-[16px] leading-7 text-ink/65 lg:justify-self-end">
              Sourced from trusted suppliers, our range covers everything from everyday writing instruments
              to bulk office consumables.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {STATIONERY_CATEGORIES.map(({ id, icon: Icon, title, desc, items }, i) => (
              <article key={id} id={id} data-reveal data-delay={String((i % 3) * 0.06)} className="scroll-mt-28 flex flex-col rounded-3xl border border-ink/10 bg-paper p-7">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-signal/10 text-signal">
                  <Icon className="h-6 w-6" strokeWidth={1.8} />
                </span>
                <h3 className="mt-6 text-2xl">{title}</h3>
                <p className="mt-3 text-[15px] leading-7 text-ink/65">{desc}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {items.map(item => (
                    <li key={item} className="rounded-full border border-ink/10 bg-white px-3 py-1 text-xs text-ink/75">{item}</li>
                  ))}
                </ul>
                <Link href="/contact" className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-forest hover:text-signal">
                  Enquire <ArrowUpRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── BULK ORDERS ──────────────────────────────────────────────────── */}
      <section className="bg-white px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="rounded-3xl bg-forest px-6 py-14 text-white sm:px-12 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
            <div>
              <p className="eyebrow mb-4 text-mint">Bulk & business orders</p>
              <SplitText className="t-xl" text={'Need to stock an office? *We’ve got you covered.*'} />
            </div>
            <div data-reveal className="flex flex-col gap-5 lg:items-end">
              <p className="max-w-sm text-[16px] leading-7 text-white/80 lg:text-right">
                MJ Logistics handles bulk stationery orders for businesses, schools, and institutions — with a
                single point of contact.
              </p>
              <Link href="/contact" className="btn btn-signal">Contact our team <ArrowUpRight className="btn-arrow h-4 w-4" /></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
