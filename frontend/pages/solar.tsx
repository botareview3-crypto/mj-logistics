import React, { useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight, PackageCheck, Sun } from 'lucide-react';
import { gsap } from '../lib/gsap';
import { useScrollFx, useIsoLayoutEffect, prefersReducedMotion, onIntro } from '../lib/fx';
import { scrollToTarget } from '../lib/useLenis';
import { SplitText, ScrubText } from '../components/fx/SplitText';
import { Marquee } from '../components/fx/Marquee';
import { Magnetic } from '../components/fx/Magnetic';

/* Wording agreed with management (2026-09-29): solar is a supply line, not a
   service. Keep copy neutral — no invented stats, locations or claims. The
   ids are the #anchors used by the header menu. */
const SUPPLY = [
  {
    id: 'systems', icon: Sun, title: 'Solar energy systems',
    text: 'We supply solar energy systems, sourced to suit the requirements of each client.',
  },
  {
    id: 'equipment', icon: PackageCheck, title: 'Solar equipment supply',
    text: 'We supply the equipment that goes with solar energy systems, sourced to order.',
  },
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
        <title>Solar Energy — MJ Logistics Enterprise</title>
        <meta name="description" content="Solar energy system and equipment supply from MJ Logistics Enterprise." />
      </Head>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section data-hero="dark" className="relative min-h-[100svh] overflow-hidden bg-ink text-paper">
        <div className="absolute inset-0 overflow-hidden">
          <img data-hero-art src="/images/site/solar-field.svg" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
        </div>
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
            <span className="h-px w-10 bg-signal" /> Solar energy
          </p>
          <SplitText as="h1" intro={0.1} className="t-hero max-w-[15ch] font-extrabold" text={'Solar energy,\n*supplied to order.*'} />
          <div className="mt-8 grid gap-6 border-t border-paper/15 pt-6 sm:mt-10 sm:gap-8 sm:pt-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <p data-reveal data-intro="0.55" className="max-w-xl text-[17px] leading-7 text-paper/75">
              MJ Logistics Enterprise supplies solar energy systems and equipment. Tell us what you need
              and we will source it for you.
            </p>
            <div data-reveal data-intro="0.7" className="flex flex-wrap gap-3">
              <Magnetic>
                <Link href="/contact" className="btn btn-signal">Request a quote <ArrowUpRight className="btn-arrow h-4 w-4" /></Link>
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
          <p className="eyebrow text-sage">Solar energy supply</p>
          <ScrubText
            className="t-lead max-w-[30ch] font-display font-semibold"
            text="Solar is one of our supply lines. Tell us what you need, and we *source* *it* *for* *you* — through the same network that moves every MJ Logistics order."
          />
        </div>
      </section>

      {/* ── SUPPLY ───────────────────────────────────────────────────────── */}
      <section id="supply" className="scroll-mt-24 bg-paper pb-24 sm:pb-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="mb-14">
            <p className="eyebrow mb-5 text-sage">What we supply</p>
            <SplitText className="t-xl font-extrabold" text={'Systems and\n*equipment.*'} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {SUPPLY.map(({ id, icon: Icon, title, text }, i) => (
              <article
                key={id}
                id={id}
                data-reveal
                data-delay={String(i * 0.08)}
                className="group relative flex min-h-[340px] scroll-mt-28 flex-col justify-between overflow-hidden rounded-[28px] bg-white p-8 sm:p-10"
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-forest transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-y-100" />
                <div className="relative flex items-start justify-between">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-signal/10 text-signal transition-colors duration-500 group-hover:bg-signal group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="font-display text-6xl font-extrabold text-ink/10 transition-colors duration-500 group-hover:text-signal">0{i + 1}</span>
                </div>
                <div className="relative transition-colors duration-500 group-hover:text-paper">
                  <h2 className="text-[clamp(1.8rem,3vw,2.8rem)]">{title}</h2>
                  <p className="mt-4 max-w-md text-[16px] leading-7 opacity-70">{text}</p>
                  <Link href="/contact" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-signal">
                    Request a quote <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────────────────────── */}
      <section className="bg-signal py-6 text-white">
        <Marquee speed={30} reverse>
          {['Solar energy systems', 'Solar equipment', 'Sourced to order', 'Delivered by MJ Logistics'].map(t => (
            <span key={t} className="font-display flex items-center gap-8 pr-8 text-2xl font-extrabold uppercase tracking-tight sm:text-4xl">
              {t}<Sun className="h-7 w-7 sm:h-9 sm:w-9" />
            </span>
          ))}
        </Marquee>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-paper px-3 py-3 sm:px-4 sm:py-4">
        <div className="grain relative overflow-hidden rounded-[32px] bg-forest px-6 py-16 text-paper sm:px-12 sm:py-24">
          <Sun className="animate-spin-slow pointer-events-none absolute -right-20 -top-20 h-96 w-96 text-signal/15" strokeWidth={0.6} />
          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
            <SplitText className="t-xl font-extrabold" text={'Tell us what\n*you need.*'} />
            <div data-reveal className="flex flex-col gap-5 lg:items-end">
              <p className="max-w-sm text-[16px] leading-7 text-paper/75 lg:text-right">
                Share your solar requirement and we will point your enquiry to the right people.
              </p>
              <Magnetic>
                <Link href="/contact" className="btn btn-signal">Request a quote <ArrowUpRight className="btn-arrow h-4 w-4" /></Link>
              </Magnetic>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
