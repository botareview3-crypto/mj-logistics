import React, { useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight, BatteryCharging, Building2, Home, Mountain, Sun, Wrench, Zap } from 'lucide-react';
import { gsap } from '../lib/gsap';
import { useScrollFx, useIsoLayoutEffect, prefersReducedMotion, onIntro } from '../lib/fx';
import { scrollToTarget } from '../lib/useLenis';
import { SplitText, ScrubText } from '../components/fx/SplitText';
import { Marquee } from '../components/fx/Marquee';
import { Magnetic } from '../components/fx/Magnetic';
import { LogoMark } from '../components/fx/Logo';

const SUPPLY = [
  { icon: Sun, title: 'Solar panels', text: 'Monocrystalline modules for rooftops, ground mounts and site installations.' },
  { icon: Zap, title: 'Inverters', text: 'Grid-tied, off-grid and hybrid inverters matched to the system you need.' },
  { icon: BatteryCharging, title: 'Battery storage', text: 'Storage that keeps lights, pumps and equipment running after sundown.' },
  { icon: Wrench, title: 'Mounting & cabling', text: 'Racking, protection and balance-of-system parts so the kit arrives complete.' },
];

const USES = [
  { icon: Home, title: 'Homes', text: 'Cut generator hours and keep essentials running through outages.' },
  { icon: Building2, title: 'Businesses', text: 'Steady power for offices, shops and workshops — and more predictable energy costs.' },
  { icon: Mountain, title: 'Remote sites', text: 'Off-grid power for mining camps, pumps and field operations, delivered to site.' },
];

const STEPS = [
  { no: '01', title: 'Tell us the load', text: 'Share what you need to power and when. A rough list of appliances or equipment is enough to start.' },
  { no: '02', title: 'We specify the kit', text: 'Panels, inverter, storage and mounting are matched into one system and one clear quote.' },
  { no: '03', title: 'We source & deliver', text: 'Equipment is bought from verified suppliers, imported and delivered through the MJ network.' },
];

export default function SolarPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  useScrollFx(pageRef);

  useIsoLayoutEffect(() => {
    const root = pageRef.current;
    if (!root || prefersReducedMotion()) return;
    let cancelIntro = () => {};
    const ctx = gsap.context(() => {
      gsap.set('[data-sun]', { yPercent: 60, scale: 0.7, opacity: 0 });
      cancelIntro = onIntro(() => ctx.add(() => {
        gsap.to('[data-sun]', { yPercent: 0, scale: 1, opacity: 1, duration: 2.2, ease: 'expo.out', delay: 0.2 });
        gsap.fromTo('[data-hero-art]', { scale: 1.2 }, { scale: 1, duration: 2.4, ease: 'expo.out' });
      }));
      gsap.timeline({ scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true } })
        .to('[data-sun]', { yPercent: -60, ease: 'none' }, 0)
        .to('[data-hero-art]', { yPercent: 15, ease: 'none' }, 0)
        .to('[data-hero-copy]', { yPercent: -25, opacity: 0, ease: 'none' }, 0);
      gsap.utils.toArray<HTMLElement>('[data-ray]').forEach((ray, i) => {
        gsap.to(ray, { rotate: i % 2 ? -360 : 360, duration: 60 + i * 20, ease: 'none', repeat: -1 });
      });
    }, root);
    return () => { cancelIntro(); ctx.revert(); };
  }, []);

  return (
    <div ref={pageRef} className="overflow-x-clip bg-paper">
      <Head>
        <title>MJ Solar | Energy systems by MJ Logistics Enterprise</title>
        <meta name="description" content="MJ Solar supplies solar energy systems — panels, inverters, battery storage and mounting — sourced and delivered through the MJ Logistics network." />
      </Head>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section data-hero="dark" className="relative min-h-[100svh] overflow-hidden bg-ink text-paper">
        <div className="absolute inset-0 overflow-hidden">
          <img data-hero-art src="/images/site/solar-field.svg" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
        </div>
        {/* Animated sun sitting over the illustration's sun */}
        <div className="pointer-events-none absolute left-[66%] top-[35%] -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
          <div data-sun className="relative h-[34vmin] w-[34vmin]">
            <div className="absolute inset-0 rounded-full bg-signal shadow-[0_0_120px_40px_rgba(255,106,43,.45)]" />
            <div data-ray className="absolute -inset-[40%] rounded-full border border-dashed border-signal/30" />
            <div data-ray className="absolute -inset-[80%] rounded-full border border-signal/15" />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
        <div className="grain absolute inset-0" />

        <div data-hero-copy className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1440px] flex-col justify-end px-5 pb-12 pt-28 sm:px-8 sm:pb-16">
          <p data-reveal data-intro="0.05" className="eyebrow mb-8 flex items-center gap-3 text-mint">
            <span className="h-px w-10 bg-signal" /> MJ Solar — Energy systems
          </p>
          <SplitText as="h1" intro={0.1} className="t-hero max-w-[14ch] font-extrabold" text={'Power that\n*keeps working.*'} />
          <div className="mt-10 grid gap-8 border-t border-paper/15 pt-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <p data-reveal data-intro="0.55" className="max-w-xl text-[17px] leading-7 text-paper/75">
              Solar panels, inverters and battery storage — sourced from verified suppliers and delivered
              through the same network that moves every MJ Logistics order.
            </p>
            <div data-reveal data-intro="0.7" className="flex flex-wrap gap-3">
              <Magnetic>
                <Link href="/contact" className="btn btn-signal">Request a solar quote <ArrowUpRight className="btn-arrow h-4 w-4" /></Link>
              </Magnetic>
              <button type="button" onClick={() => scrollToTarget('#supply', -80)} className="btn btn-ghost">
                What we supply <ArrowDownRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATEMENT ────────────────────────────────────────────────────── */}
      <section className="bg-paper py-24 sm:py-36">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 sm:px-8 lg:grid-cols-[220px_1fr]">
          <p className="eyebrow text-sage">Why solar, why MJ</p>
          <ScrubText
            className="t-lead max-w-[30ch] font-display font-semibold"
            text="Reliable power shouldn’t depend on the grid. We help homes, businesses and sites move to *clean,* *dependable* *energy* — with equipment sourced properly and delivered complete."
          />
        </div>
      </section>

      {/* ── SUPPLY ───────────────────────────────────────────────────────── */}
      <section id="supply" className="bg-paper pb-24 sm:pb-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow mb-5 text-sage">What we supply</p>
              <SplitText className="t-xl font-extrabold" text={'Everything in\n*the system.*'} />
            </div>
            <p data-reveal className="max-w-md text-[16px] leading-7 text-ink/65">
              One order for the complete kit — no chasing separate suppliers for panels, inverters and parts.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SUPPLY.map(({ icon: Icon, title, text }, i) => (
              <article
                key={title}
                data-reveal
                data-delay={String(i * 0.08)}
                className="group relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-[28px] bg-white p-7 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-30px_rgba(4,38,29,.35)]"
              >
                <span className="absolute inset-x-0 bottom-0 h-0 bg-forest transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:h-full" />
                <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-signal/10 text-signal transition-colors duration-500 group-hover:bg-signal group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <div className="relative transition-colors duration-500 group-hover:text-paper">
                  <span className="font-display text-xs font-semibold opacity-50">0{i + 1}</span>
                  <h3 className="mt-2 text-2xl">{title}</h3>
                  <p className="mt-3 text-[15px] leading-7 opacity-70">{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────────────────────── */}
      <section className="bg-signal py-6 text-white">
        <Marquee speed={30} reverse>
          {['Clean energy', 'Fewer generator hours', 'Delivered complete', 'Panels · Inverters · Storage'].map(t => (
            <span key={t} className="font-display flex items-center gap-8 pr-8 text-2xl font-extrabold uppercase tracking-tight sm:text-4xl">
              {t}<Sun className="h-7 w-7 sm:h-9 sm:w-9" />
            </span>
          ))}
        </Marquee>
      </section>

      {/* ── USE CASES ────────────────────────────────────────────────────── */}
      <section data-theme="dark" className="grain relative bg-ink py-24 text-paper sm:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <p className="eyebrow mb-5 text-mint/70">Who it’s for</p>
          <SplitText className="t-xl max-w-4xl font-extrabold" text={'From one rooftop\nto a *remote site.*'} />
          <div className="mt-16 grid gap-px overflow-hidden rounded-[28px] bg-paper/10 md:grid-cols-3">
            {USES.map(({ icon: Icon, title, text }, i) => (
              <div key={title} data-reveal data-delay={String(i * 0.08)} className="group bg-ink p-8 transition-colors duration-500 hover:bg-forest sm:p-10">
                <Icon className="h-8 w-8 text-signal" strokeWidth={1.5} />
                <h3 className="mt-14 text-3xl">{title}</h3>
                <p className="mt-4 max-w-xs text-[15px] leading-7 text-paper/65">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STEPS ────────────────────────────────────────────────────────── */}
      <section className="bg-paper py-24 sm:py-32">
        <div className="mx-auto grid max-w-[1440px] gap-14 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="eyebrow mb-5 text-sage">How it works</p>
            <SplitText className="t-xl font-extrabold" text={'Three steps\nto *solar.*'} />
            <div data-reveal className="mt-10 hidden lg:block"><LogoMark className="animate-spin-slow h-24 w-24" /></div>
          </div>
          <div className="border-t border-ink/15">
            {STEPS.map((s, i) => (
              <article key={s.no} data-reveal data-delay={String(i * 0.08)} className="group grid gap-4 border-b border-ink/15 py-10 sm:grid-cols-[80px_1fr]">
                <span className="font-display text-5xl font-extrabold text-ink/10 transition-colors duration-500 group-hover:text-signal">{s.no}</span>
                <div>
                  <h3 className="font-display text-[clamp(1.6rem,2.6vw,2.4rem)] font-extrabold leading-none tracking-[-.03em]">{s.title}</h3>
                  <p className="mt-4 max-w-xl text-[15px] leading-7 text-ink/65">{s.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-paper px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="grain relative overflow-hidden rounded-[32px] bg-forest px-6 py-16 text-paper sm:px-12 sm:py-24">
          <Sun className="animate-spin-slow pointer-events-none absolute -right-20 -top-20 h-96 w-96 text-signal/15" strokeWidth={0.6} />
          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
            <SplitText className="t-xl font-extrabold" text={'Ready to power\n*your next move?*'} />
            <div data-reveal className="flex flex-col gap-5 lg:items-end">
              <p className="max-w-sm text-[16px] leading-7 text-paper/75 lg:text-right">
                Tell us what you need to run. We’ll come back with a matched system and a clear quote.
              </p>
              <Magnetic>
                <Link href="/contact" className="btn btn-signal">Get a solar quote <ArrowUpRight className="btn-arrow h-4 w-4" /></Link>
              </Magnetic>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
