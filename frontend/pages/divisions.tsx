import React, { useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowUpRight, Box, ClipboardList, Truck } from 'lucide-react';
import { useScrollFx } from '../lib/fx';
import { ScrubText } from '../components/fx/SplitText';
import { PageHero } from '../components/fx/PageHero';
import { Wrap, SectionHead } from '../components/ui';

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
  { title: 'Oil & gas exploration in Liberia, seeking investors', href: '/oil-gas', image: '/images/homepage/industrial.webp' },
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

      <section className="bg-white py-20 sm:py-28">
        <Wrap>
          <div className="border-t border-ink py-4"><p className="tag tag-dot">01 / What we do</p></div>
          <ScrubText
            className="t-lead mt-8 max-w-[34ch] font-display font-semibold"
            text="We support everyday operating needs and specialist requirements — so the right part, supply or material arrives *where* *it’s* *needed,* without the run-around."
          />
        </Wrap>
      </section>

      <section className="bg-ink py-20 text-white sm:py-28">
        <Wrap>
          <SectionHead no="02" label="How we work" dark title={'One operation, *three steps.*'} />
          <div className="grid border-t border-white/30 md:grid-cols-3">
            {HOW_WE_WORK.map(({ title, text, icon: Icon, image }, i) => (
              <article key={title} data-reveal data-delay={String(i * 0.08)} className="border-b border-white/30 py-8 md:border-b-0 md:pr-8 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:pl-8">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  <span className="absolute left-0 top-0 bg-signal px-3 py-1.5 tag text-ink">0{i + 1}</span>
                </div>
                <Icon className="mt-6 h-6 w-6 text-signal" strokeWidth={1.8} />
                <h3 className="mt-4 text-[28px] text-white">{title}</h3>
                <p className="mt-3 text-[17px] leading-7 text-white/85">{text}</p>
              </article>
            ))}
          </div>
        </Wrap>
      </section>

      <section className="bg-paper py-20 sm:py-28">
        <Wrap>
          <SectionHead no="03" label="What we handle" title={'Supply that keeps business *moving.*'} />
          <ul className="border-t border-ink">
            {DIVISIONS.map((d, i) => (
              <li key={d.href} data-reveal className="border-b border-ink">
                <Link href={d.href} className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 py-5 transition-colors hover:bg-signal sm:gap-8 sm:px-3">
                  <span className="tag w-8 text-ink/55 group-hover:text-ink">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-display text-[clamp(1.25rem,2.2vw,1.9rem)] font-bold leading-tight tracking-tight">{d.title}</span>
                  <span className="flex items-center gap-4">
                    <img src={d.image} alt="" loading="lazy" className="hidden h-14 w-24 object-cover sm:block" />
                    <ArrowUpRight className="h-6 w-6" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Wrap>
      </section>
    </div>
  );
}
