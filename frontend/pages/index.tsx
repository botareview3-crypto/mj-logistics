import React, { useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, FlaskConical, Layers, MessageCircle, Plus, Search, ShieldCheck, Workflow } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { gsap } from '../lib/gsap';
import { useScrollFx, useIsoLayoutEffect, prefersReducedMotion } from '../lib/fx';
import { CATEGORY_ROOTS } from '../lib/data/categories';
import { PARTS_DATABASE } from '../lib/data/parts';
import { SERVICES } from '../lib/data/services';
import { SplitText, ScrubText } from '../components/fx/SplitText';
import { Wrap, SectionHead, CtaBand } from '../components/ui';

/* ─── Content ───────────────────────────────────────────────────────────── */
const DIVISIONS = [
  {
    no: '01', name: 'Auto Parts', href: '/shop',
    image: '/images/homepage/detail.webp', alt: 'Engine block and components laid out',
    text: 'Genuine brakes, engine, suspension, electrical and tyre parts — matched to your vehicle before you buy.',
  },
  {
    no: '02', name: 'Stationery & Office', href: '/stationery',
    image: '/homepage/office.webp', alt: 'Notebook, pen and office supplies on a desk',
    text: 'Paper, writing, filing, printing and desk essentials for offices, schools and workshops.',
  },
  {
    no: '03', name: 'MJ Mining', href: '/mining',
    image: '/images/mining/gold.webp', alt: 'Gold nuggets held in an open hand',
    text: 'A patient, responsible approach to gold and diamond opportunity, built on local knowledge and lasting partnerships.',
  },
  {
    no: '04', name: 'Solar Energy', href: '/solar',
    image: '/images/site/solar-panels.webp', alt: 'Solar panels under a blue sky',
    text: 'Solar energy systems and equipment, supplied to order through the same trusted network.',
  },
  {
    no: '05', name: 'Oil & Gas', href: '/oil-gas',
    image: '/images/homepage/industrial.webp', alt: 'Industrial plant and storage tanks',
    text: 'Oil and gas exploration in Liberia, and we are looking for investors.',
  },
];

const SYSTEM_ART: Record<string, string> = {
  'braking-system': '/categories/brake-disc.webp',
  'engine-transmission': '/categories/engine.webp',
  'suspension-steering': '/categories/shock-absorber.webp',
  'electrical-lighting': '/categories/headlight.webp',
  'tires-wheels': '/categories/tire.webp',
  'exhaust-system': '/images/categories/exhaust.webp',
};

const GLANCE = [
  { value: `${PARTS_DATABASE.length.toLocaleString()}+`, label: 'auto parts in the catalogue' },
  { value: '5', label: 'divisions, one accountable partner' },
  { value: 'Fit checked', label: 'before you buy any auto part' },
  { value: 'Door to door', label: 'sourcing, import, stock and delivery' },
];

const SERVICE_ICONS = { FlaskConical, Workflow } as const;

const STEPS = [
  { no: '01', title: 'Source', image: '/images/homepage/industrial.webp',
    text: 'We buy direct from manufacturers and verified suppliers, so pricing and part authenticity are traceable.' },
  { no: '02', title: 'Import & clear', image: '/images/site/containers.webp',
    text: 'Freight booking, documentation and customs are handled in-house. You never have to chase a broker.' },
  { no: '03', title: 'Stock & stage', image: '/images/site/warehouse-racks.webp',
    text: 'Goods are received, checked and staged so every order leaves complete and correctly labelled.' },
  { no: '04', title: 'Deliver', image: '/images/site/forklift.webp',
    text: 'Delivery and fulfilment connect suppliers with the workshops, offices and sites where materials are needed.' },
];

const PRINCIPLE_ICONS = [ShieldCheck, Search, Layers, MessageCircle];

const PRINCIPLES = [
  { title: 'Genuine, traceable stock', text: 'Parts come from manufacturers and verified suppliers — no grey-market guesswork.' },
  { title: 'Fit checked first', text: 'Fitment, specifications and OEM numbers are shown before you decide.' },
  { title: 'One accountable team', text: 'Sourcing, import, stock and delivery under one roof, with one point of contact.' },
  { title: 'People who answer', text: 'When the catalogue isn’t enough, our team helps you find the right part or supply.' },
];

/* ─── Page ──────────────────────────────────────────────────────────────── */
export default function HomePage() {
  const { addToCart, showToast } = useApp();
  const pageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(0);

  useScrollFx(pageRef);

  const systems = useMemo(() => CATEGORY_ROOTS[0].systems
    .filter(s => SYSTEM_ART[s.id])
    .map(s => ({
      id: s.id,
      name: s.name.replace('Tires', 'Tyres'),
      count: s.subsystems.reduce((n, sub) => n + (sub.itemCount || 0), 0),
      art: SYSTEM_ART[s.id],
    })), []);

  const products = useMemo(
    () => PARTS_DATABASE.filter(p => p.images?.[0]?.startsWith('/images/parts') && p.inStock).slice(0, 8),
    [],
  );

  /* Hero video: pick a source per viewport after mount (the poster shows first). */
  useEffect(() => {
    const v = videoRef.current;
    if (!v || prefersReducedMotion()) return;
    v.src = window.matchMedia('(max-width: 767px)').matches ? '/logistics-mobile.mp4' : '/hero-video.mp4';
    v.play().catch(() => {});
  }, []);

  /* Hero scroll effect (scrubbed, fully reversible): the footage drifts down
     and zooms inside its frame while the headline block rises away. The copy
     never fades below 35%, so nothing can end up hidden. */
  useIsoLayoutEffect(() => {
    const root = pageRef.current;
    if (!root || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const scrub = { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: 0.4 };
      gsap.timeline({ scrollTrigger: scrub })
        .fromTo('[data-hero-media]', { yPercent: 0, scale: 1 }, { yPercent: 18, scale: 1.14, ease: 'none' }, 0)
        .fromTo('[data-hero-copy]', { yPercent: 0, opacity: 1 }, { yPercent: -10, opacity: 0.35, ease: 'none' }, 0);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="overflow-x-clip bg-paper">
      <Head>
        <title>MJ Logistics Enterprise — Parts that fit. Delivered fast.</title>
        <meta name="description" content="Genuine auto parts with verified fitment, workplace supplies, mining, solar energy, oil & gas and more — sourced, cleared and delivered by MJ Logistics Enterprise." />
      </Head>

      {/* ── 00 HERO: headline left, footage in a tall frame right ───────── */}
      <section data-hero className="border-b border-ink">
        <Wrap className="grid gap-10 pb-10 pt-8 sm:pt-10 lg:grid-cols-12 lg:gap-14 lg:pb-0">
          <div data-hero-copy className="flex flex-col lg:col-span-7 lg:pb-16">
            <div className="flex items-center justify-between border-t border-ink pt-4">
              <p data-reveal data-intro="0" className="tag tag-dot">MJ Logistics Enterprise</p>
              <p className="tag hidden text-ink/60 sm:block">Source / Import / Stock / Deliver</p>
            </div>
            <SplitText as="h1" intro={0.05} className="t-hero mt-10 lg:mt-16" text={'Parts that fit.\n*Delivered fast.*'} />
            <p data-reveal data-intro="0.3" className="mt-8 max-w-xl text-[19px] leading-8 text-ink/85">
              Genuine auto parts with verified fitment, workplace supplies, mining, solar energy and more —
              sourced, cleared and delivered by one partner.
            </p>
            <div data-reveal data-intro="0.4" className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/shop" className="btn btn-signal">Shop auto parts <ArrowUpRight className="btn-arrow h-4 w-4" /></Link>
              <Link href="/contact" className="btn btn-ghost-dark">Request a quote</Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative h-[420px] overflow-hidden bg-ink sm:h-[520px] lg:h-full lg:min-h-[640px]">
              <div data-hero-media className="absolute inset-0 will-change-transform">
                <video
                  ref={videoRef}
                  poster="/images/site/hero-poster.webp"
                  muted loop playsInline autoPlay preload="none"
                  className="h-full w-full object-cover"
                  aria-hidden="true"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-signal px-4 py-2.5 text-ink">
                <span className="tag">Port to workshop</span>
                <span className="tag">Monrovia</span>
              </div>
            </div>
          </div>
        </Wrap>
      </section>

      {/* ── AT A GLANCE: four ruled cells ───────────────────────────────── */}
      <section className="border-b border-ink bg-white">
        <Wrap>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-4">
            {GLANCE.map((g, i) => (
              <li key={g.label} className={`py-8 sm:px-6 sm:py-10 ${i > 0 ? 'border-t border-ink/20 sm:border-t-0 lg:border-l' : ''} ${i === 1 ? 'sm:border-l' : ''} ${i === 2 ? 'sm:border-t sm:border-ink/20 lg:border-t-0' : ''} ${i === 3 ? 'sm:border-l sm:border-t sm:border-ink/20 lg:border-t-0' : ''} ${i === 0 ? 'lg:pl-0' : ''}`}>
                <p className="tag text-ink/55">{String(i + 1).padStart(2, '0')}</p>
                <p className="mt-3 font-display text-[clamp(1.9rem,2.8vw,2.6rem)] font-bold leading-none tracking-tight">{g.value}</p>
                <p className="mt-3 text-[17px] leading-7 text-ink/80">{g.label}</p>
              </li>
            ))}
          </ul>
        </Wrap>
      </section>

      {/* ── 01 WHO WE ARE ───────────────────────────────────────────────── */}
      <section className="bg-paper py-20 sm:py-28">
        <Wrap>
          <div className="border-t border-ink py-4"><p className="tag tag-dot">01 / Who we are</p></div>
          <ScrubText
            className="t-lead mt-8 max-w-[30ch] font-display font-semibold sm:max-w-[36ch]"
            text="MJ Logistics Enterprise sources, imports and delivers the parts, supplies and materials that keep *businesses* *moving* — from a single brake pad to a full container."
          />
          <dl className="mt-14 grid gap-px bg-ink/20 sm:grid-cols-2">
            <div data-reveal className="bg-paper py-6 sm:pr-10">
              <dt className="font-display text-2xl font-bold tracking-tight">Buy with confidence.</dt>
              <dd className="mt-2 text-[17px] leading-7 text-ink/80">Every auto part is listed with its fitment, specifications and OEM references.</dd>
            </div>
            <div data-reveal data-delay="0.08" className="bg-paper py-6 sm:pl-10">
              <dt className="font-display text-2xl font-bold tracking-tight">One partner, many needs.</dt>
              <dd className="mt-2 text-[17px] leading-7 text-ink/80">Parts, office supplies, mining, solar, oil &amp; gas and services — handled by the same accountable team.</dd>
            </div>
          </dl>
        </Wrap>
      </section>

      {/* ── 02 DIVISIONS: an index list with a sticky picture ───────────── */}
      <section className="bg-white py-20 sm:py-28">
        <Wrap>
          <SectionHead no="02" label="Divisions" title={'Five divisions. *One partner.*'} href="/divisions" cta="About MJ" />
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <ul className="border-t border-ink lg:col-span-7">
              {DIVISIONS.map((d, i) => (
                <li key={d.no} className="border-b border-ink">
                  <Link
                    href={d.href}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="group grid grid-cols-[auto_1fr_auto] items-start gap-x-5 py-7 sm:gap-x-8"
                  >
                    <span className="tag pt-3 text-ink/55">{d.no}</span>
                    <span>
                      <span className={`block font-display text-[clamp(1.8rem,3.2vw,2.8rem)] font-bold leading-none tracking-tight transition-colors ${active === i ? 'text-azure' : 'text-ink'}`}>{d.name}</span>
                      <span className="mt-3 block max-w-lg text-[17px] leading-7 text-ink/80">{d.text}</span>
                      <img src={d.image} alt={d.alt} loading="lazy" className="mt-5 aspect-[16/9] w-full object-cover lg:hidden" />
                    </span>
                    <ArrowUpRight className={`mt-2 h-7 w-7 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 ${active === i ? 'text-azure' : 'text-ink'}`} />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="relative hidden lg:col-span-5 lg:block">
              <div className="sticky top-28 aspect-[4/5] overflow-hidden bg-mist">
                {DIVISIONS.map((d, i) => (
                  <img
                    key={d.no}
                    src={d.image}
                    alt={i === active ? d.alt : ''}
                    loading="lazy"
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${active === i ? 'opacity-100' : 'opacity-0'}`}
                  />
                ))}
                <span className="absolute bottom-0 left-0 bg-signal px-3 py-1.5 tag text-ink">{DIVISIONS[active].no} / {DIVISIONS[active].name}</span>
              </div>
            </div>
          </div>
        </Wrap>
      </section>

      {/* ── 03 SHOP BY SYSTEM: joined tiles ─────────────────────────────── */}
      <section className="bg-paper py-20 sm:py-28">
        <Wrap>
          <SectionHead no="03" label="Shop by system" title={'Find the part. We\'ll check the *fit.*'} href="/catalog" cta="All categories" />
          <ul className="grid border-l border-t border-ink sm:grid-cols-2 lg:grid-cols-3">
            {systems.map((s, i) => (
              <li key={s.id} className="border-b border-r border-ink">
                <Link href={`/catalog/${s.id}`} className="group flex h-full items-center gap-5 bg-paper p-5 transition-colors hover:bg-signal sm:p-7">
                  <span className="grid h-24 w-24 shrink-0 place-items-center bg-white">
                    <img src={s.art} alt="" loading="lazy" className="h-[4.5rem] w-[4.5rem] object-contain transition-transform duration-500 group-hover:scale-110" />
                  </span>
                  <span className="flex-1">
                    <span className="tag block text-ink/55 group-hover:text-ink">{String(i + 1).padStart(2, '0')}</span>
                    <span className="mt-1 block font-display text-[22px] font-bold leading-tight tracking-tight">{s.name}</span>
                    <span className="mt-1 block text-[16px] text-ink/75 group-hover:text-ink">{s.count.toLocaleString()} items</span>
                  </span>
                  <ArrowUpRight className="h-6 w-6 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </Wrap>
      </section>

      {/* ── 04 PROCESS: dark ruled columns + wide photo ─────────────────── */}
      <section className="bg-ink text-white">
        <Wrap className="py-20 sm:py-28">
          <SectionHead
            no="04" label="How it moves" dark
            title={'From source to *site.*'}
            intro="Sourcing, import, stock and delivery handled by one team — so you get one price, one timeline and one point of contact."
          />
          <ol className="grid border-t border-white/30 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.no} data-reveal data-delay={String(i * 0.06)} className="border-b border-white/30 py-8 sm:pr-8 lg:border-b-0 lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:pl-8">
                <p className="font-display text-[4.5rem] font-bold leading-none tracking-tighter text-signal">{s.no}</p>
                <h3 className="mt-6 text-[28px] text-white">{s.title}</h3>
                <p className="mt-3 text-[17px] leading-7 text-white/85">{s.text}</p>
              </li>
            ))}
          </ol>
        </Wrap>
        <div className="relative h-[56vh] min-h-[360px] overflow-hidden">
          <div className="absolute -inset-y-[8%] inset-x-0" data-parallax="0.05">
            <img src="/homepage/hero-bg.webp" alt="Container ship at sea seen from above" loading="lazy" className="h-full w-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-ink/35" />
          <Wrap className="relative flex h-full items-end pb-10 sm:pb-14">
            <div className="flex w-full flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <h2 data-reveal className="t-lg max-w-2xl">From the port to your workshop floor — one partner the whole way.</h2>
              <Link href="/contact" className="btn btn-signal shrink-0 self-start sm:self-auto">Plan a shipment <ArrowUpRight className="btn-arrow h-4 w-4" /></Link>
            </div>
          </Wrap>
        </div>
      </section>

      {/* ── 05 SERVICES: two big panels ────────────────────────────────── */}
      <section className="bg-white py-20 sm:py-28">
        <Wrap>
          <SectionHead no="05" label="Also from MJ" title={'More *services.*'} href="/services" cta="All services" />
          <div className="grid gap-6 md:grid-cols-2">
            {SERVICES.map((s, i) => {
              const Icon = SERVICE_ICONS[s.icon];
              const image = s.id === 'consultancy' ? '/images/site/consultancy.webp' : '/images/site/laboratory.webp';
              return (
                <Link key={s.id} href={`/services#${s.id}`} data-reveal data-delay={String(i * 0.08)} className="group block border border-ink bg-paper transition-colors hover:bg-mist">
                  <div className="relative aspect-[16/9] overflow-hidden border-b border-ink">
                    <img src={image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <span className="absolute left-0 top-0 grid h-12 w-12 place-items-center bg-signal text-ink"><Icon className="h-6 w-6" strokeWidth={1.8} /></span>
                  </div>
                  <div className="p-6 sm:p-8">
                    <p className="tag text-ink/55">Service 0{i + 1}</p>
                    <h3 className="mt-3 text-[clamp(1.5rem,2.2vw,2rem)]">{s.title}</h3>
                    <p className="mt-3 max-w-lg text-[17px] leading-7 text-ink/80">{s.short}</p>
                    <span className="link-arrow mt-6">Learn more <ArrowRight className="h-4 w-4" /></span>
                  </div>
                </Link>
              );
            })}
          </div>
        </Wrap>
      </section>

      {/* ── 06 WHY MJ: sticky title, ruled list ────────────────────────── */}
      <section className="bg-paper py-20 sm:py-28">
        <Wrap>
          <div className="border-t border-ink py-4"><p className="tag tag-dot">06 / Why MJ</p></div>
          <div className="mt-8 grid gap-12 lg:grid-cols-12">
            <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
              <SplitText className="t-xl" text={'Built for the *next move.*'} />
              <p data-reveal className="t-body mt-6 max-w-md text-ink/80">
                Good service isn’t a slogan. It’s the clarity, detail and follow-through that make a buying decision easier — every single time.
              </p>
            </div>
            <ul className="border-t border-ink lg:col-span-7">
              {PRINCIPLES.map((p, i) => {
                const Icon = PRINCIPLE_ICONS[i];
                return (
                  <li key={p.title} data-reveal className="grid grid-cols-[auto_1fr_auto] items-start gap-5 border-b border-ink py-8 sm:gap-8">
                    <span className="tag pt-2 text-ink/55">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <h3 className="text-[clamp(1.5rem,2.2vw,2rem)]">{p.title}</h3>
                      <p className="mt-3 max-w-lg text-[17px] leading-7 text-ink/80">{p.text}</p>
                    </div>
                    <span className="grid h-12 w-12 place-items-center bg-signal text-ink"><Icon className="h-6 w-6" strokeWidth={1.8} /></span>
                  </li>
                );
              })}
            </ul>
          </div>
        </Wrap>
      </section>

      {/* ── 07 IN STOCK: plain 4-column grid ───────────────────────────── */}
      <section className="bg-white py-20 sm:py-28">
        <Wrap>
          <SectionHead no="07" label="In stock now" title={'Ready to *ship.*'} href="/shop" cta="Shop all" />
          <ul className="grid border-l border-t border-ink sm:grid-cols-2 lg:grid-cols-4">
            {products.map(p => (
              <li key={p.id} className="group flex flex-col border-b border-r border-ink bg-white">
                <Link href={`/parts/${p.id}`} className="relative block aspect-square overflow-hidden bg-mist">
                  <img src={p.images[0]} alt={p.name} loading="lazy" className="absolute inset-0 h-full w-full object-contain p-8 mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
                  {p.originalPrice && p.originalPrice > p.price && (
                    <span className="absolute left-0 top-0 bg-signal px-3 py-1.5 tag text-ink">Save €{(p.originalPrice - p.price).toFixed(0)}</span>
                  )}
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  <p className="tag text-ink/60">{p.brand}</p>
                  <Link href={`/parts/${p.id}`} className="mt-2 line-clamp-2 text-[18px] font-semibold leading-snug hover:text-azure">{p.name}</Link>
                  <div className="mt-auto flex items-end justify-between pt-6">
                    <div>
                      <span className="font-display text-[26px] font-bold tracking-tight">€{p.price.toFixed(2)}</span>
                      {p.originalPrice && p.originalPrice > p.price && <span className="ml-2 text-[15px] text-ink/55 line-through">€{p.originalPrice.toFixed(2)}</span>}
                      <p className="tag mt-1 text-azure">In stock</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { addToCart(p); showToast(`${p.name} added to cart`, 'success'); }}
                      aria-label={`Add ${p.name} to cart`}
                      className="grid h-12 w-12 place-items-center bg-ink text-white transition-colors hover:bg-signal hover:text-ink"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Wrap>
      </section>

      {/* ── GARAGE CTA ──────────────────────────────────────────────────── */}
      <CtaBand
        title={'Save your vehicle. See only parts *that fit.*'}
        text="Add your car to My Garage once and the catalogue filters to compatible parts automatically."
        primary={{ label: 'Open My Garage', href: '/garage' }}
        secondary={{ label: 'Browse the catalogue', href: '/catalog' }}
      />
    </div>
  );
}
