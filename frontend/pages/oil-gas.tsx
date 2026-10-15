import React, { useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight, Fuel, Truck, Wrench } from 'lucide-react';
import { useScrollFx } from '../lib/fx';
import { scrollToTarget } from '../lib/useLenis';
import { SplitText, ScrubText } from '../components/fx/SplitText';
import { PageHero } from '../components/fx/PageHero';

/* Oil & gas division added per management feedback (2026-10-15). Keep copy
   neutral — no invented stats, locations, licences or claims — until
   management confirms the exact scope of the business. The ids are the
   #anchors used by the header menu. Photos reuse existing site images until
   dedicated oil & gas photography is supplied (swap the `image` paths). */
const OFFER = [
  {
    id: 'supply', icon: Fuel, title: 'Oil & gas supply', image: '/images/homepage/industrial.webp',
    alt: 'Industrial plant and storage tanks',
    text: 'We source products and materials for the oil and gas sector, matched to the requirements of each client.',
  },
  {
    id: 'equipment', icon: Wrench, title: 'Equipment & spares', image: '/images/homepage/detail.webp',
    alt: 'Heavy engine components laid out',
    text: 'We supply the equipment, parts and consumables that keep oil and gas operations running, sourced to order.',
  },
  {
    id: 'logistics', icon: Truck, title: 'Freight & delivery', image: '/images/site/containers.webp',
    alt: 'Stacked shipping containers at a port',
    text: 'Freight, documentation, clearance and delivery are handled through the same network that moves every MJ Logistics order.',
  },
];

export default function OilGasPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  useScrollFx(pageRef);

  return (
    <div ref={pageRef} className="overflow-x-clip bg-paper">
      <Head>
        <title>Oil &amp; Gas — MJ Logistics Enterprise</title>
        <meta name="description" content="Oil and gas supply, equipment and logistics support from MJ Logistics Enterprise." />
      </Head>

      <PageHero
        eyebrow="Oil & gas"
        title={'Energy supply, *sourced and delivered.*'}
        intro="MJ Logistics Enterprise is expanding into oil and gas. Tell us what your operation needs and we will source it, clear it and deliver it."
        actions={<>
          <Link href="/contact" className="btn btn-signal">Request a quote <ArrowUpRight className="btn-arrow h-4 w-4" /></Link>
          <button type="button" onClick={() => scrollToTarget('#offer', -80)} className="btn btn-ghost-dark">What we offer <ArrowDownRight className="h-4 w-4" /></button>
        </>}
        image="/images/site/containers.webp"
        imageAlt="Stacked shipping containers at a port"
      />

      {/* ── STATEMENT ────────────────────────────────────────────────────── */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 sm:px-8 lg:grid-cols-[220px_1fr]">
          <p className="eyebrow text-sage">Oil &amp; gas</p>
          <ScrubText
            className="t-lead max-w-[34ch] font-display font-medium"
            text="Oil and gas is our newest division. We bring the same sourcing, clearance and delivery discipline to the sector — so what you need arrives *where* *it’s* *needed.*"
          />
        </div>
      </section>

      {/* ── OFFER ────────────────────────────────────────────────────────── */}
      <section id="offer" className="scroll-mt-24 bg-white pb-24 sm:pb-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="mb-12">
            <p className="eyebrow mb-4 text-sage">What we offer</p>
            <SplitText className="t-xl" text={'Supply, equipment *and logistics.*'} />
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {OFFER.map(({ id, icon: Icon, title, text, image, alt }, i) => (
              <article key={id} id={id} data-reveal data-delay={String(i * 0.08)} className="scroll-mt-28 overflow-hidden rounded-3xl border border-ink/10 bg-paper">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={image} alt={alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                </div>
                <div className="p-6 sm:p-8">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-signal/10 text-signal"><Icon className="h-6 w-6" /></span>
                  <h2 className="mt-6 text-[clamp(1.4rem,2vw,1.8rem)]">{title}</h2>
                  <p className="mt-3 text-[16px] leading-7 text-ink/65">{text}</p>
                  <Link href="/contact" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-forest hover:text-signal">
                    Request a quote <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-white px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="relative overflow-hidden rounded-3xl">
          <img src="/images/site/warehouse-racks.webp" alt="Warehouse racking stocked with palletised goods" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-forest/90 via-forest/70 to-forest/20" />
          <div className="relative grid gap-8 px-6 py-16 text-white sm:px-12 sm:py-24 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
            <SplitText className="t-xl" text={'Tell us what *you need.*'} />
            <div data-reveal className="flex flex-col gap-5 lg:items-end">
              <p className="max-w-sm text-[16px] leading-7 text-white/85 lg:text-right">
                Share your oil and gas requirement and we will point your enquiry to the right people.
              </p>
              <Link href="/contact" className="btn btn-signal">Request a quote <ArrowUpRight className="btn-arrow h-4 w-4" /></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
