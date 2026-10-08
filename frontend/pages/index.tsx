import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { Marquee } from '../components/fx/Marquee';
import { Magnetic } from '../components/fx/Magnetic';
import { LogoMark } from '../components/fx/Logo';

/* ─── Content ───────────────────────────────────────────────────────────── */
const DIVISIONS = [
  {
    no: '01', name: 'Auto Parts', href: '/shop', cta: 'Shop parts',
    image: '/images/homepage/detail.webp',
    text: 'Genuine brakes, engine, suspension, electrical and tyre parts — matched to your vehicle before you buy.',
    tags: ['Verified fitment', 'OEM references', 'Workshop tools'],
  },
  {
    no: '02', name: 'Stationery & Office', href: '/stationery', cta: 'Equip your office',
    image: '/homepage/office.webp',
    text: 'Paper, writing, filing, printing and desk essentials for offices, schools and workshops.',
    tags: ['Bulk supply', 'Printing & ink', 'Filing'],
  },
  {
    no: '03', name: 'MJ Mining', href: '/mining', cta: 'Discover mining',
    image: '/images/mining/gold.webp',
    text: 'A patient, responsible approach to gold and diamond opportunity, built on local knowledge and lasting partnerships.',
    tags: ['Gold', 'Diamonds', 'Partnerships'],
  },
  {
    no: '04', name: 'Solar Energy', href: '/solar', cta: 'View solar supply',
    image: '/images/site/solar-art.svg',
    text: 'Solar energy systems and equipment, supplied to order through the same trusted network.',
    tags: ['Systems', 'Equipment', 'Sourced to order'],
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
  { no: '01', title: 'Source', image: '/images/homepage/industrial.webp', bg: 'bg-white text-ink',
    text: 'We buy direct from manufacturers and verified suppliers, so pricing and part authenticity are traceable.' },
  { no: '02', title: 'Import & clear', image: '/images/site/containers.webp', bg: 'bg-forest text-paper',
    text: 'Freight booking, documentation and customs are handled in-house. You never have to chase a broker.' },
  { no: '03', title: 'Stock & stage', image: '/images/site/warehouse-racks.webp', bg: 'bg-mint text-ink',
    text: 'Goods are received, checked and staged so every order leaves complete and correctly labelled.' },
  { no: '04', title: 'Deliver', image: '/images/site/forklift.webp', bg: 'bg-signal text-white',
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

  /* Hero video: choose a source per viewport after mount (poster shows first). */
  useEffect(() => {
    const v = videoRef.current;
    if (!v || prefersReducedMotion()) return;
    v.src = window.matchMedia('(max-width: 767px)').matches ? '/logistics-mobile.mp4' : '/hero-video.mp4';
    v.play().catch(() => {});
  }, []);

  /* Page-specific scroll choreography */
  useIsoLayoutEffect(() => {
    const root = pageRef.current;
    if (!root || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      // Hero: media zooms and rounds off, copy drifts up as you leave.
      gsap.timeline({
        scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true },
      })
        .to('[data-hero-media]', { scale: 1.12, ease: 'none' }, 0)
        .to('[data-hero-frame]', { clipPath: 'inset(0% 2.5% 6% 2.5% round 32px)', ease: 'none' }, 0)
        .to('[data-hero-content]', { yPercent: -18, opacity: 0, ease: 'none' }, 0);

      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px)', () => {
        // Divisions: pinned horizontal rail
        const track = root.querySelector<HTMLElement>('[data-hz-track]');
        const pin = root.querySelector<HTMLElement>('[data-hz-pin]');
        if (track && pin) {
          const distance = () => track.scrollWidth - window.innerWidth + 64;
          const tween = gsap.to(track, {
            x: () => -distance(), ease: 'none',
            scrollTrigger: { trigger: pin, pin: true, scrub: 1, start: 'top top', end: () => `+=${distance()}`, invalidateOnRefresh: true },
          });
          gsap.utils.toArray<HTMLElement>('[data-hz-img]').forEach(img => {
            gsap.fromTo(img, { xPercent: -8 }, {
              xPercent: 8, ease: 'none',
              scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
            });
          });
          gsap.to('[data-hz-progress]', {
            scaleX: 1, ease: 'none',
            scrollTrigger: { trigger: pin, start: 'top top', end: () => `+=${distance()}`, scrub: true },
          });
        }

        // Expanding image: grows from a card to full screen while the words part.
        const ex = root.querySelector<HTMLElement>('[data-expand]');
        if (ex) {
          gsap.timeline({ scrollTrigger: { trigger: ex, pin: true, start: 'top top', end: '+=130%', scrub: 1 } })
            .fromTo('[data-expand-box]', { width: '34vw', height: '48vh', borderRadius: 32 }, { width: '100vw', height: '100vh', borderRadius: 0, ease: 'power2.inOut' }, 0)
            .fromTo('[data-expand-img]', { scale: 1.3 }, { scale: 1, ease: 'power2.inOut' }, 0)
            .to('[data-expand-left]', { xPercent: -120, opacity: 0, ease: 'power2.in' }, 0)
            .to('[data-expand-right]', { xPercent: 120, opacity: 0, ease: 'power2.in' }, 0)
            .fromTo('[data-expand-caption]', { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: 'power2.out' }, 0.6);
        }
      });

      // Process cards: each card recedes as the next one stacks over it.
      const cards = gsap.utils.toArray<HTMLElement>('[data-stack-card]');
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        gsap.to(card, {
          scale: 0.93, ease: 'none',
          scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 25%', scrub: true },
        });
      });

      // Statement mark spins with scroll
      gsap.to('[data-spin-mark]', {
        rotate: 360, ease: 'none',
        scrollTrigger: { trigger: '[data-spin-mark]', start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  /* Shop-by-system: floating cut-out follows the pointer over the list */
  const [hoverSys, setHoverSys] = useState<number | null>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const list = listRef.current;
    const float = floatRef.current;
    if (!list || !float || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const xTo = gsap.quickTo(float, 'x', { duration: 0.7, ease: 'power3.out' });
    const yTo = gsap.quickTo(float, 'y', { duration: 0.7, ease: 'power3.out' });
    const move = (e: MouseEvent) => {
      const r = list.getBoundingClientRect();
      xTo(e.clientX - r.left);
      yTo(e.clientY - r.top);
    };
    list.addEventListener('mousemove', move);
    return () => list.removeEventListener('mousemove', move);
  }, []);

  const scrollRail = (dir: number) => {
    const rail = railRef.current;
    if (rail) rail.scrollBy({ left: dir * rail.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <div ref={pageRef} className="overflow-x-clip">
      <Head>
        <title>MJ Logistics Enterprise — Parts that fit. Delivered fast.</title>
        <meta name="description" content="Genuine auto parts with verified fitment, workplace supplies, mining and solar energy — sourced, cleared and delivered by MJ Logistics Enterprise." />
      </Head>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section data-hero="dark" className="relative min-h-[100svh] bg-paper">
        <div data-hero-frame className="absolute inset-0 overflow-hidden bg-ink" style={{ clipPath: 'inset(0% 0% 0% 0% round 0px)' }}>
          <div data-hero-media className="absolute inset-0">
            <video
              ref={videoRef}
              poster="/images/site/hero-poster.webp"
              muted loop playsInline autoPlay preload="none"
              className="h-full w-full object-cover"
              aria-hidden="true"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent" />
          <div className="grain absolute inset-0" />
        </div>

        <div data-hero-content className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1440px] flex-col justify-end px-5 pb-8 pt-28 text-paper sm:px-8 sm:pb-12">
          <p data-reveal data-intro="0.05" className="eyebrow mb-8 flex items-center gap-3 text-mint">
            <span className="h-px w-10 bg-signal" /> MJ Logistics Enterprise
          </p>
          <SplitText as="h1" intro={0.1} className="t-hero max-w-[15ch] font-extrabold" text={'Parts that fit.\n*Delivered fast.*'} />

          <div className="mt-8 grid gap-6 border-t border-paper/15 pt-6 sm:mt-10 sm:gap-8 sm:pt-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <p data-reveal data-intro="0.55" className="max-w-xl text-[17px] leading-7 text-paper/75">
              Genuine auto parts with verified fitment, workplace supplies, mining and solar energy —
              sourced, cleared and delivered by one partner.
            </p>
            <div data-reveal data-intro="0.7" className="flex flex-wrap items-center gap-3">
              <Magnetic>
                <Link href="/shop" className="btn btn-signal" data-cursor="Shop">
                  Shop auto parts <ArrowUpRight className="btn-arrow h-4 w-4" />
                </Link>
              </Magnetic>
              <Link href="/contact" className="btn btn-ghost">Request a quote</Link>
            </div>
          </div>

          <div data-reveal="fade" data-intro="1" className="mt-8 hidden items-center justify-between text-xs text-paper/55 sm:flex">
            <span className="flex items-center gap-6">
              {['Auto Parts', 'Stationery', 'Mining', 'Solar'].map(d => (
                <span key={d} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-signal" />{d}</span>
              ))}
            </span>
            <span className="flex items-center gap-3">
              Scroll to explore
              <span className="relative block h-10 w-px overflow-hidden bg-paper/20"><span className="animate-scroll-cue absolute inset-0 bg-paper" /></span>
            </span>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────────────────────── */}
      <section className="relative z-10 -mt-px bg-paper py-6">
        <div className="-rotate-[1.5deg] bg-signal py-5 text-white shadow-[0_20px_50px_-20px_rgba(255,106,43,.6)]">
          <Marquee speed={32}>
            {['Genuine parts', 'Verified fitment', 'Fast delivery', 'Stationery & office', 'Mining', 'Solar energy'].map(t => (
              <span key={t} className="font-display flex items-center gap-8 pr-8 text-2xl font-extrabold uppercase tracking-tight sm:text-4xl">
                {t}<LogoMark tone="ink" className="h-7 w-7 sm:h-9 sm:w-9" />
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      {/* ── STATEMENT ────────────────────────────────────────────────────── */}
      <section className="relative bg-paper py-24 sm:py-36">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 sm:px-8 lg:grid-cols-[220px_1fr]">
          <div className="flex items-start gap-4 lg:flex-col">
            <p className="eyebrow text-sage">Who we are</p>
            <div data-spin-mark className="hidden lg:block"><LogoMark className="mt-6 h-20 w-20" /></div>
          </div>
          <div>
            <ScrubText
              className="t-lead max-w-[30ch] font-display font-semibold text-ink"
              text="MJ Logistics Enterprise sources, imports and delivers the parts, supplies and materials that keep *businesses* *moving* — from a single brake pad to a full container."
            />
            <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:max-w-4xl">
              <div data-reveal className="flex gap-4">
                <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-forest text-paper"><Check className="h-4 w-4" /></span>
                <p className="text-[15px] leading-7 text-ink/70"><strong className="text-ink">Buy with confidence.</strong> Every auto part is listed with its fitment, specifications and OEM references.</p>
              </div>
              <div data-reveal data-delay="0.1" className="flex gap-4">
                <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-signal text-white"><Check className="h-4 w-4" /></span>
                <p className="text-[15px] leading-7 text-ink/70"><strong className="text-ink">One partner, four divisions.</strong> Parts, office supplies, mining and solar — handled by the same accountable team.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DIVISIONS (horizontal on desktop) ───────────────────────────── */}
      <section className="relative bg-ink text-paper">
        <div data-hz-pin className="grain relative flex flex-col justify-center overflow-hidden py-24 lg:h-screen lg:py-0">
          <div className="mx-auto mb-10 flex w-full max-w-[1440px] flex-col gap-6 px-5 sm:px-8 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow mb-5 text-mint/70">Our divisions</p>
              <SplitText className="t-xl font-extrabold" text={'Four divisions.\n*One partner.*'} />
            </div>
            <div className="hidden w-64 lg:block">
              <div className="h-px w-full bg-paper/15"><div data-hz-progress className="h-px w-full origin-left scale-x-0 bg-signal" /></div>
              <p className="mt-3 text-xs text-paper/50">Keep scrolling →</p>
            </div>
          </div>

          <div data-hz-track className="flex flex-col gap-5 px-5 sm:px-8 lg:w-max lg:flex-row lg:gap-6">
            {DIVISIONS.map(d => (
              <Link
                key={d.no}
                href={d.href}
                data-cursor="Explore"
                className="group relative flex h-[68vh] min-h-[440px] w-full flex-col justify-between overflow-hidden rounded-[28px] p-6 sm:p-9 lg:h-[64vh] lg:w-[min(64vw,880px)]"
              >
                <div className="absolute inset-0 overflow-hidden">
                  <img data-hz-img src={d.image} alt="" loading="lazy" className="absolute inset-0 h-full w-[116%] max-w-none -translate-x-[8%] object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
                <div className="relative flex items-start justify-between">
                  <span className="font-display text-sm font-semibold text-mint">{d.no} / 04</span>
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-paper text-ink transition-all duration-500 group-hover:rotate-45 group-hover:bg-signal group-hover:text-white">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </div>
                <div className="relative max-w-xl">
                  <h3 className="font-display text-[clamp(2.2rem,4.6vw,4.4rem)] font-extrabold leading-[.95] tracking-[-.035em]">{d.name}</h3>
                  <p className="mt-4 max-w-md text-[15px] leading-7 text-paper/75">{d.text}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {d.tags.map(t => <span key={t} className="rounded-full border border-paper/25 px-3.5 py-1.5 text-xs text-paper/80 backdrop-blur-sm">{t}</span>)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHOP BY SYSTEM ───────────────────────────────────────────────── */}
      <section className="relative bg-paper py-24 sm:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow mb-5 text-sage">Shop by system</p>
              <SplitText className="t-xl font-extrabold" text={'Find the part.\nWe\'ll check the *fit.*'} />
            </div>
            <Link href="/catalog" className="btn btn-ghost-dark self-start lg:self-auto">All categories <ArrowRight className="btn-arrow h-4 w-4" /></Link>
          </div>

          <div ref={listRef} className="relative" onMouseLeave={() => setHoverSys(null)}>
            <div
              ref={floatRef}
              className="pointer-events-none absolute left-0 top-0 z-20 hidden lg:block"
              aria-hidden="true"
            >
              <div className={`-ml-36 -mt-36 h-72 w-72 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${hoverSys === null ? 'scale-50 opacity-0' : 'scale-100 opacity-100'}`}>
                {systems.map((s, i) => (
                  <img key={s.id} src={s.art} alt="" className={`absolute inset-0 h-full w-full object-contain drop-shadow-[0_30px_40px_rgba(4,38,29,.35)] transition-opacity duration-300 ${hoverSys === i ? 'opacity-100' : 'opacity-0'}`} />
                ))}
              </div>
            </div>

            <ul className="border-t border-ink/15">
              {systems.map((s, i) => (
                <li key={s.id} data-reveal data-delay={String(i * 0.05)}>
                  <Link
                    href={`/catalog/${s.id}`}
                    onMouseEnter={() => setHoverSys(i)}
                    className="group relative flex items-center gap-5 overflow-hidden border-b border-ink/15 py-6 sm:gap-8 sm:py-8"
                  >
                    <span className="absolute inset-0 origin-bottom scale-y-0 bg-forest transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-y-100" />
                    <span className="relative w-8 text-xs font-semibold text-sage transition-colors group-hover:text-mint">0{i + 1}</span>
                    <img src={s.art} alt="" className="relative h-14 w-14 object-contain lg:hidden" loading="lazy" />
                    <span className="font-display relative flex-1 text-[clamp(1.4rem,3.4vw,3rem)] font-extrabold leading-none tracking-[-.03em] transition-all duration-500 group-hover:translate-x-3 group-hover:text-paper">
                      {s.name}
                    </span>
                    <span className="relative hidden text-sm text-ink/55 transition-colors group-hover:text-paper/70 sm:block">
                      {s.count.toLocaleString()} items
                    </span>
                    <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ink/20 transition-all duration-500 group-hover:rotate-45 group-hover:border-signal group-hover:bg-signal group-hover:text-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── PROCESS (stacking cards) ────────────────────────────────────── */}
      <section className="relative bg-bone/60 py-24 sm:py-32">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="eyebrow mb-5 text-sage">How it moves</p>
            <SplitText className="t-xl font-extrabold" text={'From source\nto *site.*'} />
            <p data-reveal className="mt-8 max-w-md text-[16px] leading-7 text-ink/70">
              Sourcing, import, stock and delivery handled by one team — so you get one price,
              one timeline and one point of contact.
            </p>
            <div data-reveal className="mt-8">
              <Link href="/divisions" className="btn btn-ink">How we work <ArrowRight className="btn-arrow h-4 w-4" /></Link>
            </div>
          </div>

          <div className="space-y-6">
            {STEPS.map((s, i) => (
              <article
                key={s.no}
                data-stack-card
                className={`sticky origin-top overflow-hidden rounded-[28px] shadow-[0_30px_60px_-30px_rgba(4,38,29,.35)] ${s.bg}`}
                style={{ top: `calc(7rem + ${i * 1.25}rem)` }}
              >
                <div className="grid sm:grid-cols-[1.1fr_.9fr]">
                  <div className="flex flex-col justify-between gap-12 p-7 sm:p-10">
                    <span className="font-display text-sm font-semibold opacity-60">Step {s.no}</span>
                    <div>
                      <h3 className="font-display text-[clamp(2rem,3.6vw,3.4rem)] font-extrabold leading-none tracking-[-.035em]">{s.title}</h3>
                      <p className="mt-5 max-w-sm text-[15px] leading-7 opacity-75">{s.text}</p>
                    </div>
                  </div>
                  <div className="relative h-56 sm:h-auto sm:min-h-[340px]">
                    <img src={s.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPANDING IMAGE ──────────────────────────────────────────────── */}
      <section data-expand className="relative bg-paper lg:h-screen lg:overflow-hidden">
        <div className="mx-auto px-5 py-20 sm:px-8 lg:hidden">
          <SplitText className="t-xl mb-8 font-extrabold" text={'Moving what\n*matters.*'} />
          <div data-clip className="relative aspect-[4/5] overflow-hidden rounded-[28px] sm:aspect-video">
            <img src="/homepage/hero-bg.webp" alt="Container ship at sea seen from above" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          </div>
        </div>
        <div className="absolute inset-0 hidden items-center justify-center lg:flex">
          <h2 className="t-hero pointer-events-none absolute inset-0 z-10 font-extrabold text-ink">
            <span data-expand-left className="absolute left-8 top-[9vh] block">Moving what</span>
            <span data-expand-right className="absolute bottom-[9vh] right-8 block text-signal">matters.</span>
          </h2>
          <div data-expand-box className="relative overflow-hidden" style={{ width: '34vw', height: '48vh', borderRadius: 32 }}>
            <img data-expand-img src="/homepage/hero-bg.webp" alt="Container ship at sea seen from above" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            <div data-expand-caption className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[1440px] items-end justify-between gap-8 px-8 pb-12 text-paper opacity-0">
              <p className="font-display max-w-2xl text-[clamp(1.6rem,2.6vw,2.6rem)] font-semibold leading-[1.1] tracking-[-.02em]">
                From the port to your workshop floor — one partner the whole way.
              </p>
              <Link href="/contact" className="btn btn-signal shrink-0">Plan a shipment <ArrowUpRight className="btn-arrow h-4 w-4" /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY MJ ───────────────────────────────────────────────────────── */}
      <section className="grain relative bg-forest py-24 text-paper sm:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="eyebrow mb-5 text-mint/70">Why MJ</p>
              <SplitText className="t-xl font-extrabold" text={'Built for the\n*next move.*'} />
            </div>
            <p data-reveal className="max-w-lg text-[17px] leading-8 text-paper/70 lg:justify-self-end">
              Good service isn’t a slogan. It’s the clarity, detail and follow-through that make
              a buying decision easier — every single time.
            </p>
          </div>
          <div className="mt-16 grid border-t border-paper/15 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((p, i) => (
              <div
                key={p.title}
                data-reveal
                data-delay={String(i * 0.08)}
                className="group relative border-b border-paper/15 py-10 sm:pr-8 lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0"
              >
                <span className="font-display text-6xl font-extrabold text-paper/10 transition-colors duration-500 group-hover:text-signal">0{i + 1}</span>
                <h3 className="mt-8 text-xl font-semibold">{p.title}</h3>
                <p className="mt-3 text-[15px] leading-7 text-paper/65">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section className="relative bg-paper pt-24 sm:pt-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow mb-5 text-sage">Also from MJ Logistics</p>
              <SplitText className="t-xl font-extrabold" text={'More *services.*'} />
            </div>
            <Link href="/services" className="btn btn-ghost-dark self-start lg:self-auto">All services <ArrowRight className="btn-arrow h-4 w-4" /></Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {SERVICES.map((s, i) => {
              const Icon = SERVICE_ICONS[s.icon];
              return (
                <Link
                  key={s.id}
                  href={`/services#${s.id}`}
                  data-reveal
                  data-delay={String(i * 0.08)}
                  className="group relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-[28px] bg-white p-8 sm:p-10"
                >
                  <span className="absolute inset-0 origin-bottom scale-y-0 bg-forest transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-y-100" />
                  <div className="relative flex items-start justify-between">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-signal/10 text-signal transition-colors duration-500 group-hover:bg-signal group-hover:text-white">
                      <Icon className="h-6 w-6" strokeWidth={1.8} />
                    </span>
                    <span className="grid h-12 w-12 place-items-center rounded-full border border-ink/15 transition-all duration-500 group-hover:rotate-45 group-hover:border-signal group-hover:bg-signal group-hover:text-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="relative transition-colors duration-500 group-hover:text-paper">
                    <h3 className="text-[clamp(1.4rem,2.2vw,2rem)]">{s.title}</h3>
                    <p className="mt-3 max-w-md text-[15px] leading-7 opacity-70">{s.short}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BEST SELLERS ─────────────────────────────────────────────────── */}
      <section className="relative bg-paper py-24 sm:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow mb-5 text-sage">In stock now</p>
              <SplitText className="t-xl font-extrabold" text={'Ready to *ship.*'} />
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
          {products.map((p, i) => (
            <article
              key={p.id}
              data-reveal
              data-delay={String(Math.min(i, 4) * 0.07)}
              className="group relative flex w-[78vw] max-w-[340px] shrink-0 snap-start flex-col overflow-hidden rounded-[24px] bg-white sm:w-[320px]"
            >
              <Link href={`/parts/${p.id}`} className="relative block aspect-square overflow-hidden bg-bone/50" data-cursor="View">
                <img src={p.images[0]} alt={p.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover mix-blend-multiply transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105" />
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
                    <span className="font-display text-2xl font-extrabold text-ink">€{p.price.toFixed(2)}</span>
                    {p.originalPrice && p.originalPrice > p.price && <span className="ml-2 text-xs text-ink/40 line-through">€{p.originalPrice.toFixed(2)}</span>}
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-forest"><span className="h-1.5 w-1.5 rounded-full bg-forest" /> In stock</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { addToCart(p); showToast(`${p.name} added to cart`, 'success'); }}
                    aria-label={`Add ${p.name} to cart`}
                    className="grid h-12 w-12 place-items-center rounded-full bg-ink text-paper transition-all duration-500 hover:rotate-90 hover:bg-signal"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
          <Link href="/shop" className="group flex w-[60vw] max-w-[260px] shrink-0 snap-start flex-col items-center justify-center gap-4 rounded-[24px] border border-dashed border-ink/25 text-center transition hover:border-signal">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-signal text-white transition-transform duration-500 group-hover:rotate-45"><ArrowUpRight className="h-6 w-6" /></span>
            <span className="font-display text-lg font-semibold">View the full<br />catalogue</span>
          </Link>
        </div>
      </section>

      {/* ── GARAGE CTA ───────────────────────────────────────────────────── */}
      <section className="bg-paper px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="relative overflow-hidden rounded-[32px] bg-signal px-6 py-16 text-white sm:px-12 sm:py-24">
          <LogoMark tone="ink" className="animate-spin-slow pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] opacity-[.12]" />
          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
            <div>
              <p className="eyebrow mb-5 text-white/80">Not sure what fits?</p>
              <SplitText className="t-xl font-extrabold" accentClass="text-ink" text={'Save your vehicle.\nSee only parts *that fit.*'} />
            </div>
            <div data-reveal className="flex flex-col gap-5 lg:items-end">
              <p className="max-w-sm text-[16px] leading-7 text-white/85 lg:text-right">
                Add your car to My Garage once and the catalogue filters to compatible parts automatically.
              </p>
              <Magnetic>
                <Link href="/garage" className="btn btn-ink" data-cursor="Go">
                  Open My Garage <ArrowUpRight className="btn-arrow h-4 w-4" />
                </Link>
              </Magnetic>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
