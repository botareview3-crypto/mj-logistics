import React, { useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowUpRight, Box, ClipboardList, Truck } from 'lucide-react';
import { useScrollFx } from '../lib/fx';
import { SplitText, ScrubText } from '../components/fx/SplitText';
import { Magnetic } from '../components/fx/Magnetic';

const HOW_WE_WORK = [
  { title: 'Sourcing', icon: ClipboardList, image: '/images/homepage/industrial.webp',
    text: 'We buy direct from manufacturers and verified suppliers, so pricing and part authenticity are traceable.' },
  { title: 'Import & clearance', icon: Box, image: '/images/site/containers.webp',
    text: 'Freight booking, documentation, and customs are handled in-house. Clients do not chase brokers.' },
  { title: 'Delivery', icon: Truck, image: '/images/site/forklift.webp',
    text: 'Delivery and fulfilment connect suppliers with the places where materials are needed.' },
];

const DIVISIONS = [
  { title: 'Automotive & heavy-equipment parts', href: '/shop',       image: '/images/homepage/detail.webp' },
  { title: 'Stationery & office supplies',       href: '/stationery', image: '/homepage/office.webp' },
  { title: 'Mining inputs & support services',   href: '/mining',     image: '/images/mining/hero.webp' },
  { title: 'Solar energy system and equipment supply', href: '/solar', image: '/images/site/solar-art.svg' },
  { title: 'Space logistics, laboratory equipment supply and services', href: '/services#space-logistics-laboratory', image: '/images/site/warehouse-racks.webp' },
  { title: 'Consultancy for supply chain management and project management', href: '/services#consultancy', image: '/images/homepage/industrial.webp' },
];

export default function DivisionsPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  useScrollFx(pageRef);

  return (
    <div ref={pageRef} className="overflow-x-clip bg-paper">
      <Head>
        <title>About MJ Logistics Enterprise</title>
        <meta name="description" content="Learn what MJ Logistics Enterprise does and how we source, import, warehouse, and deliver for businesses." />
      </Head>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section data-hero="dark" className="grain relative overflow-hidden bg-ink pb-16 pt-40 text-paper sm:pb-24 sm:pt-48">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <p data-reveal data-intro="0.05" className="eyebrow mb-8 flex items-center gap-3 text-mint">
            <span className="h-px w-10 bg-signal" /> About MJ Logistics
          </p>
          <SplitText as="h1" intro={0.1} className="t-hero max-w-[16ch] font-extrabold" text={'One partner from\nsource to *site.*'} />
          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <p data-reveal data-intro="0.5" className="max-w-xl text-[17px] leading-8 text-paper/75">
              MJ Logistics Enterprise helps businesses source, move, and manage the parts, equipment, and
              materials they need. We bring practical services together so clients have one clear place to start.
            </p>
            <div data-reveal data-intro="0.65">
              <Magnetic>
                <Link href="/contact" className="btn btn-signal">Talk to our team <ArrowUpRight className="btn-arrow h-4 w-4" /></Link>
              </Magnetic>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-16 max-w-[1440px] px-5 sm:px-8">
          <div data-clip data-intro="0.4" className="relative h-[52vh] min-h-[320px] overflow-hidden rounded-[28px]">
            <div className="absolute -inset-y-[12%] inset-x-0" data-parallax="0.08">
              <img src="/images/site/warehouse-racks.webp" alt="Warehouse racking stocked with palletised goods" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATEMENT ────────────────────────────────────────────────────── */}
      <section className="bg-paper py-24 sm:py-36">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 sm:px-8 lg:grid-cols-[220px_1fr]">
          <p className="eyebrow text-sage">What we do</p>
          <ScrubText
            className="t-lead max-w-[30ch] font-display font-semibold"
            text="We support everyday operating needs and specialist requirements — so the right part, supply or material arrives *where* *it’s* *needed,* without the run-around."
          />
        </div>
      </section>

      {/* ── HOW WE WORK ──────────────────────────────────────────────────── */}
      <section className="bg-paper pb-24 sm:pb-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="mb-14">
            <p className="eyebrow mb-5 text-sage">How we work</p>
            <SplitText className="t-xl font-extrabold" text={'One operation,\n*three steps.*'} />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {HOW_WE_WORK.map(({ title, text, icon: Icon, image }, i) => (
              <article key={title} data-reveal data-delay={String(i * 0.1)} className="group overflow-hidden rounded-[28px] bg-white">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-110" />
                  <span className="absolute left-5 top-5 rounded-full bg-paper px-3 py-1 font-display text-xs font-semibold text-ink">0{i + 1}</span>
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

      {/* ── WHAT WE HANDLE ───────────────────────────────────────────────── */}
      <section data-theme="dark" className="grain relative bg-forest py-24 text-paper sm:py-32">
        <div className="mx-auto grid max-w-[1440px] gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_.8fr] lg:items-center">
          <div>
            <p className="eyebrow mb-5 text-mint/70">What we handle</p>
            <SplitText className="t-xl font-extrabold" text={'Supply that keeps\nbusiness *moving.*'} />
            <ul className="mt-12 border-t border-paper/15">
              {DIVISIONS.map((d, i) => (
                <li key={d.href} data-reveal data-delay={String(i * 0.06)}>
                  <Link
                    href={d.href}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="group flex items-center justify-between gap-5 border-b border-paper/15 py-6"
                  >
                    <span className={`font-display text-[clamp(1.2rem,2vw,1.8rem)] font-semibold leading-tight transition-all duration-500 group-hover:translate-x-2 ${active === i ? 'text-signal' : ''}`}>
                      {d.title}
                    </span>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-paper/25 transition-all duration-500 group-hover:rotate-45 group-hover:border-signal group-hover:bg-signal">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal="scale" className="relative hidden aspect-[4/5] overflow-hidden rounded-[28px] lg:block">
            {DIVISIONS.map((d, i) => (
              <img
                key={d.href}
                src={d.image}
                alt=""
                loading="lazy"
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)] ${active === i ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
