import React, { useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, FlaskConical, Plus, Workflow } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { gsap } from '../lib/gsap';
import { useScrollFx, useIsoLayoutEffect, prefersReducedMotion } from '../lib/fx';
import { CATEGORY_ROOTS } from '../lib/data/categories';
import { PARTS_DATABASE } from '../lib/data/parts';
import { SERVICES } from '../lib/data/services';
import { SplitText, ScrubText } from '../components/fx/SplitText';

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
];

const SYSTEM_ART: Record<string, string> = {
  'braking-system': '/categories/brake-disc.webp',
  'engine-transmission': '/categories/engine.webp',
  'suspension-steering': '/categories/shock-absorber.webp',
  'electrical-lighting': '/categories/headlight.webp',
  'tires-wheels': '/categories/tire.webp',
  'exhaust-system': '/images/categories/exhaust.webp',
};

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
  const railRef = useRef<HTMLDivElement>(null);

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
    () => PARTS_DATABASE.filter(p => p.images?.[0]?.startsWith('/images/parts') && p.inStock).slice(0, 10),
    [],
  );

  /* Hero video: pick a source per viewport after mount (the poster shows first). */
  useEffect(() => {
    const v = videoRef.current;
    if (!v || prefersReducedMotion()) return;
    v.src = window.matchMedia('(max-width: 767px)').matches ? '/logistics-mobile.mp4' : '/hero-video.mp4';
    v.play().catch(() => {});
  }, []);

  /* Hero scroll effect: as you scroll down, the footage drifts down and zooms
     (parallax), the frame eases into a rounded card and the copy rises away.
     Purely scroll-linked (scrubbed) — scrolling back up fully restores it, and
     nothing here can hide content: the copy never fades below 25%. */
  useIsoLayoutEffect(() => {
    const root = pageRef.current;
    if (!root || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const scrub = { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: 0.4 };
      gsap.timeline({ scrollTrigger: scrub })
        .fromTo('[data-hero-media]', { yPercent: 0, scale: 1 }, { yPercent: 22, scale: 1.1, ease: 'none' }, 0)
        .fromTo('[data-hero-frame]',
          { clipPath: 'inset(0% 0% 0% 0% round 0px)' },
          { clipPath: 'inset(3% 2.5% 0% 2.5% round 28px)', ease: 'none' }, 0)
        .fromTo('[data-hero-copy]', { yPercent: 0, opacity: 1 }, { yPercent: -16, opacity: 0.25, ease: 'none' }, 0);
    }, root);
    return () => ctx.revert();
  }, []);

  const scrollRail = (dir: number) => {
    const rail = railRef.current;
    if (rail) rail.scrollBy({ left: dir * rail.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <div ref={pageRef} className="overflow-x-clip bg-paper">
      <Head>
        <title>MJ Logistics Enterprise — Parts that fit. Delivered fast.</title>
        <meta name="description" content="Genuine auto parts with verified fitment, workplace supplies, mining, solar energy and more — sourced, cleared and delivered by MJ Logistics Enterprise." />
      </Head>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section data-hero="dark" className="relative min-h-[100svh] overflow-hidden bg-paper">
        <div data-hero-frame className="absolute inset-0 overflow-hidden bg-forest will-change-[clip-path]">
          <div data-hero-media className="absolute inset-0 will-change-transform">
            <video
              ref={videoRef}
              poster="/images/site/hero-poster.webp"
              muted loop playsInline autoPlay preload="none"
              className="h-full w-full object-cover"
              aria-hidden="true"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-ink/10" />
        </div>

        <div data-hero-copy className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1440px] flex-col justify-end px-5 pb-10 pt-28 text-white sm:px-8 sm:pb-14">
          <p data-reveal data-intro="0" className="eyebrow mb-6 flex items-center gap-3 text-white/85">
            <span className="h-px w-10 bg-signal" /> MJ Logistics Enterprise
          </p>
          <SplitText as="h1" intro={0.05} className="t-hero max-w-[14ch]" text={'Parts that fit.\n*Delivered fast.*'} />
          <div className="mt-8 grid gap-6 border-t border-white/20 pt-6 sm:gap-8 sm:pt-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <p data-reveal data-intro="0.3" className="max-w-xl text-[17px] leading-7 text-white/85">
              Genuine auto parts with verified fitment, workplace supplies, mining, solar energy and more —
              sourced, cleared and delivered by one partner.
            </p>
            <div data-reveal data-intro="0.4" className="flex flex-wrap items-center gap-3">
              <Link href="/shop" className="btn btn-signal">Shop auto parts <ArrowUpRight className="btn-arrow h-4 w-4" /></Link>
              <Link href="/contact" className="btn btn-ghost">Request a quote</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATEMENT ────────────────────────────────────────────────────── */}
      <section className="bg-paper py-24 sm:py-32">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 sm:px-8 lg:grid-cols-[220px_1fr]">
          <p className="eyebrow text-sage">Who we are</p>
          <div>
            <ScrubText
              className="t-lead max-w-[34ch] font-display font-medium text-ink"
              text="MJ Logistics Enterprise sources, imports and delivers the parts, supplies and materials that keep *businesses* *moving* — from a single brake pad to a full container."
            />
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:max-w-4xl">
              <div data-reveal className="flex gap-4">
                <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-forest text-white"><Check className="h-4 w-4" /></span>
                <p className="text-[15px] leading-7 text-ink/70"><strong className="text-ink">Buy with confidence.</strong> Every auto part is listed with its fitment, specifications and OEM references.</p>
              </div>
              <div data-reveal data-delay="0.08" className="flex gap-4">
                <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-signal text-white"><Check className="h-4 w-4" /></span>
                <p className="text-[15px] leading-7 text-ink/70"><strong className="text-ink">One partner, many needs.</strong> Parts, office supplies, mining, solar and services — handled by the same accountable team.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DIVISIONS ────────────────────────────────────────────────────── */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow mb-4 text-sage">Our divisions</p>
              <SplitText className="t-xl" text={'Four divisions. *One partner.*'} />
            </div>
            <Link href="/divisions" className="btn btn-ghost-dark self-start lg:self-auto">About MJ <ArrowRight className="btn-arrow h-4 w-4" /></Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {DIVISIONS.map((d, i) => (
              <Link
                key={d.no}
                href={d.href}
                data-reveal
                data-delay={String((i % 2) * 0.08)}
                className="group overflow-hidden rounded-3xl border border-ink/10 bg-paper transition-shadow duration-500 hover:shadow-[0_24px_60px_-30px_rgba(4,38,29,.35)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={d.image} alt={d.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105" />
                  <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink">{d.no}</span>
                </div>
                <div className="flex items-end justify-between gap-6 p-6 sm:p-8">
                  <div>
                    <h3 className="text-[clamp(1.5rem,2.4vw,2.1rem)]">{d.name}</h3>
                    <p className="mt-3 max-w-md text-[15px] leading-7 text-ink/65">{d.text}</p>
                  </div>
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-ink/15 transition-colors duration-300 group-hover:border-signal group-hover:bg-signal group-hover:text-white">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHOP BY SYSTEM ───────────────────────────────────────────────── */}
      <section className="bg-paper py-24 sm:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow mb-4 text-sage">Shop by system</p>
              <SplitText className="t-xl" text={'Find the part. We\'ll check the *fit.*'} />
            </div>
            <Link href="/catalog" className="btn btn-ghost-dark self-start lg:self-auto">All categories <ArrowRight className="btn-arrow h-4 w-4" /></Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {systems.map((s, i) => (
              <li key={s.id} data-reveal data-delay={String((i % 3) * 0.06)}>
                <Link
                  href={`/catalog/${s.id}`}
                  className="group flex items-center gap-5 rounded-2xl border border-ink/10 bg-white p-4 pr-5 transition-colors duration-300 hover:border-forest"
                >
                  <span className="grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-paper">
                    <img src={s.art} alt="" loading="lazy" className="h-16 w-16 object-contain transition-transform duration-500 group-hover:scale-110" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-lg font-semibold leading-tight text-ink">{s.name}</span>
                    <span className="mt-1 block text-sm text-ink/55">{s.count.toLocaleString()} items</span>
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-ink/40 transition-colors group-hover:text-signal" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── PROCESS ──────────────────────────────────────────────────────── */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="mb-12 grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="eyebrow mb-4 text-sage">How it moves</p>
              <SplitText className="t-xl" text={'From source to *site.*'} />
            </div>
            <p data-reveal className="max-w-md text-[16px] leading-7 text-ink/65 lg:justify-self-end">
              Sourcing, import, stock and delivery handled by one team — so you get one price,
              one timeline and one point of contact.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <article key={s.no} data-reveal data-delay={String(i * 0.06)} className="overflow-hidden rounded-3xl border border-ink/10 bg-paper">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={s.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                </div>
                <div className="p-6">
                  <span className="text-sm font-semibold text-signal">Step {s.no}</span>
                  <h3 className="mt-2 text-2xl">{s.title}</h3>
                  <p className="mt-3 text-[15px] leading-7 text-ink/65">{s.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMAGE BAND ───────────────────────────────────────────────────── */}
      <section className="bg-white px-3 sm:px-4">
        <div className="relative h-[70vh] min-h-[420px] overflow-hidden rounded-3xl">
          <div className="absolute -inset-y-[8%] inset-x-0" data-parallax="0.05">
            <img src="/homepage/hero-bg.webp" alt="Container ship at sea seen from above" loading="lazy" className="h-full w-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-6 p-6 text-white sm:flex-row sm:items-end sm:justify-between sm:p-12">
            <h2 data-reveal className="t-lg max-w-2xl">From the port to your workshop floor — one partner the whole way.</h2>
            <Link href="/contact" className="btn btn-signal shrink-0 self-start sm:self-auto">Plan a shipment <ArrowUpRight className="btn-arrow h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow mb-4 text-sage">Also from MJ Logistics</p>
              <SplitText className="t-xl" text={'More *services.*'} />
            </div>
            <Link href="/services" className="btn btn-ghost-dark self-start lg:self-auto">All services <ArrowRight className="btn-arrow h-4 w-4" /></Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {SERVICES.map((s, i) => {
              const Icon = SERVICE_ICONS[s.icon];
              const image = s.id === 'consultancy' ? '/images/site/consultancy.webp' : '/images/site/laboratory.webp';
              return (
                <Link
                  key={s.id}
                  href={`/services#${s.id}`}
                  data-reveal
                  data-delay={String(i * 0.08)}
                  className="group grid overflow-hidden rounded-3xl border border-ink/10 bg-paper sm:grid-cols-[.9fr_1.1fr]"
                >
                  <div className="relative min-h-[200px] overflow-hidden">
                    <img src={image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105" />
                  </div>
                  <div className="flex flex-col justify-between gap-6 p-6 sm:p-8">
                    <Icon className="h-7 w-7 text-signal" strokeWidth={1.8} />
                    <div>
                      <h3 className="text-xl leading-snug">{s.title}</h3>
                      <p className="mt-3 text-[15px] leading-7 text-ink/65">{s.short}</p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-forest group-hover:text-signal">
                        Learn more <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WHY MJ ───────────────────────────────────────────────────────── */}
      <section className="bg-paper py-24 sm:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="eyebrow mb-4 text-sage">Why MJ</p>
              <SplitText className="t-xl" text={'Built for the *next move.*'} />
            </div>
            <p data-reveal className="max-w-lg text-[16px] leading-7 text-ink/65 lg:justify-self-end">
              Good service isn’t a slogan. It’s the clarity, detail and follow-through that make a
              buying decision easier — every single time.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((p, i) => (
              <div key={p.title} data-reveal data-delay={String(i * 0.06)} className="rounded-3xl border border-ink/10 bg-white p-7">
                <span className="text-sm font-semibold text-signal">0{i + 1}</span>
                <h3 className="mt-6 text-xl">{p.title}</h3>
                <p className="mt-3 text-[15px] leading-7 text-ink/65">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BEST SELLERS ─────────────────────────────────────────────────── */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow mb-4 text-sage">In stock now</p>
              <SplitText className="t-xl" text={'Ready to *ship.*'} />
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => scrollRail(-1)} aria-label="Previous products" className="grid h-12 w-12 place-items-center rounded-full border border-ink/20 transition hover:bg-ink hover:text-paper"><ArrowLeft className="h-4 w-4" /></button>
              <button type="button" onClick={() => scrollRail(1)} aria-label="Next products" className="grid h-12 w-12 place-items-center rounded-full border border-ink/20 transition hover:bg-ink hover:text-paper"><ArrowRight className="h-4 w-4" /></button>
              <Link href="/shop" className="btn btn-ink ml-2 hidden sm:inline-flex">Shop all <ArrowUpRight className="btn-arrow h-4 w-4" /></Link>
            </div>
          </div>
        </div>
        <div
          ref={railRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 [scrollbar-width:none] sm:px-8 lg:px-[max(2rem,calc((100vw-1440px)/2+2rem))] [&::-webkit-scrollbar]:hidden"
        >
          {products.map(p => (
            <article key={p.id} className="group relative flex w-[78vw] max-w-[320px] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-ink/10 bg-white sm:w-[300px]">
              <Link href={`/parts/${p.id}`} className="relative block aspect-square overflow-hidden bg-paper">
                <img src={p.images[0]} alt={p.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105" />
                {p.originalPrice && p.originalPrice > p.price && (
                  <span className="absolute left-4 top-4 rounded-full bg-signal px-3 py-1 text-xs font-semibold text-white">
                    Save €{(p.originalPrice - p.price).toFixed(0)}
                  </span>
                )}
              </Link>
              <div className="flex flex-1 flex-col p-5">
                <p className="eyebrow !text-[11px] text-sage">{p.brand}</p>
                <Link href={`/parts/${p.id}`} className="mt-2 line-clamp-2 text-[15px] font-semibold leading-snug text-ink hover:text-forest">{p.name}</Link>
                <div className="mt-auto flex items-end justify-between pt-5">
                  <div>
                    <span className="text-2xl font-semibold text-ink">€{p.price.toFixed(2)}</span>
                    {p.originalPrice && p.originalPrice > p.price && <span className="ml-2 text-xs text-ink/40 line-through">€{p.originalPrice.toFixed(2)}</span>}
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-forest"><span className="h-1.5 w-1.5 rounded-full bg-forest" /> In stock</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { addToCart(p); showToast(`${p.name} added to cart`, 'success'); }}
                    aria-label={`Add ${p.name} to cart`}
                    className="grid h-11 w-11 place-items-center rounded-full bg-forest text-white transition-colors hover:bg-signal"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
          <Link href="/shop" className="group flex w-[60vw] max-w-[240px] shrink-0 snap-start flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-ink/25 text-center transition hover:border-signal">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-signal text-white"><ArrowUpRight className="h-6 w-6" /></span>
            <span className="text-lg font-semibold">View the full<br />catalogue</span>
          </Link>
        </div>
      </section>

      {/* ── GARAGE CTA ───────────────────────────────────────────────────── */}
      <section className="bg-white px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="relative overflow-hidden rounded-3xl bg-signal px-6 py-14 text-white sm:px-12 sm:py-20">
          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
            <div>
              <p className="eyebrow mb-4 text-white/85">Not sure what fits?</p>
              <SplitText className="t-xl" accentClass="text-ink" text={'Save your vehicle. See only parts *that fit.*'} />
            </div>
            <div data-reveal className="flex flex-col gap-5 lg:items-end">
              <p className="max-w-sm text-[16px] leading-7 text-white/90 lg:text-right">
                Add your car to My Garage once and the catalogue filters to compatible parts automatically.
              </p>
              <Link href="/garage" className="btn btn-ink">Open My Garage <ArrowUpRight className="btn-arrow h-4 w-4" /></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
