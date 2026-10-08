import React, { useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowUpRight, Box, ClipboardList, Truck } from 'lucide-react';
import { useScrollFx } from '../lib/fx';
import { SplitText, ScrubText } from '../components/fx/SplitText';
import { PageHero } from '../components/fx/PageHero';

const HOW_WE_WORK = [
  { title: 'Sourcing', icon: ClipboardList, image: '/images/homepage/industrial.webp',
    text: 'We buy direct from manufacturers and verified suppliers, so pricing and part authenticity are traceable.' },
  { title: 'Import & clearance', icon: Box, image: '/images/site/containers.webp',
    text: 'Freight booking, documentation, and customs are handled in-house. Clients do not chase brokers.' },
  { title: 'Delivery', icon: Truck, image: '/images/site/forklift.webp',
    text: 'Delivery and fulfilment connect suppliers with the places where materials are needed.' },
];

const DIVISIONS = [
  { title: 'Automotive & heavy-equipment parts', href: '/shop', image: '/images/homepage/detail.webp' },
  { title: 'Stationery & office supplies', href: '/stationery', image: '/homepage/office.webp' },
  { title: 'Mining inputs & support services', href: '/mining', image: '/images/mining/hero.webp' },
  { title: 'Solar energy system and equipment supply', href: '/solar', image: '/images/site/solar-panels.webp' },
  { title: 'Space logistics, laboratory equipment supply and services', href: '/services#space-logistics-laboratory', image: '/images/site/laboratory.webp' },
  { title: 'Consultancy for supply chain management and project management', href: '/services#consultancy', image: '/images/site/consultancy.webp' },
];

export default function DivisionsPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  useScrollFx(pageRef);

  return (
    <div ref={pageRef} className="overflow-x-clip bg-paper">
      <Head>
        <title>About MJ Logistics Enterprise</title>
        <meta name="description" content="Learn what MJ Logistics Enterprise does and how we source, import, warehouse, and deliver for businesses." />
      </Head>

      <PageHero
        eyebrow="About MJ Logistics"
        title={'One partner from source to *site.*'}
        intro="MJ Logistics Enterprise helps businesses source, move, and manage the parts, equipment, and materials they need. We bring practical services together so clients have one clear place to start."
        actions={<Link href="/contact" className="btn btn-signal">Talk to our team <ArrowUpRight className="btn-arrow h-4 w-4" /></Link>}
        image="/images/site/warehouse-racks.webp"
        imageAlt="Warehouse racking stocked with palletised goods"
      />

      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 sm:px-8 lg:grid-cols-[220px_1fr]">
          <p className="eyebrow text-sage">What we do</p>
          <ScrubText
            className="t-lead max-w-[34ch] font-display font-medium"
            text="We support everyday operating needs and specialist requirements — so the right part, supply or material arrives *where* *it’s* *needed,* without the run-around."
          />
        </div>
      </section>

      <section className="bg-white pb-24 sm:pb-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="mb-12">
            <p className="eyebrow mb-4 text-sage">How we work</p>
            <SplitText className="t-xl" text={'One operation, *three steps.*'} />
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {HOW_WE_WORK.map(({ title, text, icon: Icon, image }, i) => (
              <article key={title} data-reveal data-delay={String(i * 0.08)} className="overflow-hidden rounded-3xl border border-ink/10 bg-paper">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink">0{i + 1}</span>
                </div>
                <div className="p-7">
                  <Icon className="h-6 w-6 text-signal" strokeWidth={1.8} />
                  <h3 className="mt-5 text-2xl">{title}</h3>
                  <p className="mt-3 text-[15px] leading-7 text-ink/65">{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-24 sm:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="mb-12">
            <p className="eyebrow mb-4 text-sage">What we handle</p>
            <SplitText className="t-xl" text={'Supply that keeps business *moving.*'} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DIVISIONS.map((d, i) => (
              <Link
                key={d.href}
                href={d.href}
                data-reveal
                data-delay={String((i % 3) * 0.06)}
                className="group flex items-center gap-4 rounded-2xl border border-ink/10 bg-white p-3 pr-5 transition-colors hover:border-forest"
              >
                <span className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl">
                  <img src={d.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                </span>
                <span className="flex-1 text-[16px] font-semibold leading-snug">{d.title}</span>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-ink/40 transition-colors group-hover:text-signal" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
