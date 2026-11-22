import React, { useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight, Briefcase, FileText, FolderOpen, Monitor, PenLine, Printer } from 'lucide-react';
import { useScrollFx } from '../lib/fx';
import { scrollToTarget } from '../lib/useLenis';
import { Wrap, SectionHead, CtaBand } from '../components/ui';
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
        eyebrow="Stationery & Office"
        title={'Everything for your *workspace.*'}
        intro="From a single pen to a full office fit-out — MJ Logistics supplies genuine stationery and office essentials with reliable delivery and competitive pricing."
        actions={<>
          <Link href="/contact" className="btn btn-signal">Request a quote <ArrowUpRight className="btn-arrow h-4 w-4" /></Link>
          <button type="button" onClick={() => scrollToTarget('#categories', -80)} className="btn btn-ghost-dark">Browse the range <ArrowDownRight className="h-4 w-4" /></button>
        </>}
        image="/homepage/office.webp"
        imageAlt="Notebook, pen, calculator and office supplies laid out on a desk"
      />

      <section id="categories" className="scroll-mt-24 bg-white py-20 sm:py-28">
        <Wrap>
          <SectionHead
            no="01" label="The range" title={'Our stationery *range.*'}
            intro="Sourced from trusted suppliers, our range covers everything from everyday writing instruments to bulk office consumables."
          />
          <div className="grid border-l border-t border-ink sm:grid-cols-2 lg:grid-cols-3">
            {STATIONERY_CATEGORIES.map(({ id, icon: Icon, title, desc, items }, i) => (
              <article key={id} id={id} data-reveal data-delay={String((i % 3) * 0.06)} className="scroll-mt-28 flex flex-col border-b border-r border-ink bg-white p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <span className="tag text-ink/55">{String(i + 1).padStart(2, '0')}</span>
                  <span className="grid h-12 w-12 place-items-center bg-signal text-ink"><Icon className="h-6 w-6" strokeWidth={1.8} /></span>
                </div>
                <h3 className="mt-8 text-[28px]">{title}</h3>
                <p className="mt-3 text-[17px] leading-7 text-ink/80">{desc}</p>
                <ul className="mt-5 border-t border-ink/25">
                  {items.map(item => (
                    <li key={item} className="border-b border-ink/15 py-2 text-[16px] text-ink/85">{item}</li>
                  ))}
                </ul>
                <Link href="/contact" className="link-arrow mt-auto self-start pt-6">Enquire <ArrowUpRight className="h-4 w-4" /></Link>
              </article>
            ))}
          </div>
        </Wrap>
      </section>

      <CtaBand
        title={'Need to stock an office? *We’ve got you covered.*'}
        text="MJ Logistics handles bulk stationery orders for businesses, schools, and institutions — with a single point of contact."
        primary={{ label: 'Contact our team', href: '/contact' }}
      />
    </div>
  );
}
