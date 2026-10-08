import React, { useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight, Compass, Mail, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { gsap } from '../lib/gsap';
import { useScrollFx, useIsoLayoutEffect, prefersReducedMotion, onIntro } from '../lib/fx';
import { scrollToTarget } from '../lib/useLenis';
import { SplitText, ScrubText } from '../components/fx/SplitText';
import { Marquee } from '../components/fx/Marquee';
import { Magnetic } from '../components/fx/Magnetic';
import { LogoMark } from '../components/fx/Logo';

const PRINCIPLES = [
  { no: '01', title: 'Start with understanding', text: 'We listen first — to the land, the evidence, and the people closest to it.' },
  { no: '02', title: 'Work with discipline', text: 'Clear decisions, responsible practice, and steady progress guide every step.' },
  { no: '03', title: 'Build lasting value', text: 'The goal is value that benefits partners, communities, and the future.' },
];

const FOCUS = [
  {
    label: '01 / Gold', title: 'Careful work.\nReal *value.*', image: '/images/mining/gold.webp', alt: 'Gold nuggets held in an open hand',
    text: 'We assess gold opportunities with attention to quality, traceability, and trust.',
  },
  {
    label: '02 / Diamonds', title: 'Patience brings\n*clarity.*', image: '/images/mining/diamonds.webp', alt: 'Rough diamonds being sorted with tweezers',
    text: 'We pursue diamond opportunities through patience, precision, and long-term thinking.',
  },
];

const APPROACH = [
  { no: '01', title: 'Read the ground', icon: Compass,
    text: 'Every opportunity begins with patience: understanding the land, the geology, and the people who know it best.' },
  { no: '02', title: 'Work with care', icon: ShieldCheck,
    text: 'We favour disciplined operations, transparent decisions, and a lighter footprint wherever the work takes us.' },
  { no: '03', title: 'Build what lasts', icon: Sparkles,
    text: 'Our ambition is long-term value — for partners, communities, and the resource economies of tomorrow.' },
];

export default function MiningPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  useScrollFx(pageRef);

  useIsoLayoutEffect(() => {
    const root = pageRef.current;
    if (!root || prefersReducedMotion()) return;
    let cancelIntro = () => {};
    const ctx = gsap.context(() => {
      gsap.set('[data-hero-img]', { scale: 1.25 });
      cancelIntro = onIntro(() => ctx.add(() => gsap.to('[data-hero-img]', { scale: 1, duration: 2.4, ease: 'expo.out' })));
      gsap.to('[data-hero-img]', {
        yPercent: 18, ease: 'none',
        scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('[data-hero-copy]', {
        yPercent: -25, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true },
      });
    }, root);
    return () => { cancelIntro(); ctx.revert(); };
  }, []);

  return (
    <div ref={pageRef} className="overflow-x-clip bg-paper">
      <Head>
        <title>MJ Mining | Resource with responsibility</title>
        <meta name="description" content="MJ Mining explores responsible opportunities in gold and diamonds through patience, partnership, and disciplined execution." />
      </Head>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section data-hero="dark" className="relative min-h-[100svh] overflow-hidden bg-ink text-paper">
        <div className="absolute inset-0 overflow-hidden">
          <img data-hero-img src="/images/mining/hero.webp" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
        <div className="grain absolute inset-0" />

        <div data-hero-copy className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1440px] flex-col justify-end px-5 pb-12 pt-28 sm:px-8 sm:pb-16">
          <p data-reveal data-intro="0.05" className="eyebrow mb-8 flex items-center gap-3 text-mint">
            <span className="h-px w-10 bg-signal" /> A division of MJ Logistics Enterprise
          </p>
          <SplitText as="h1" intro={0.1} className="t-hero max-w-[12ch] font-extrabold" text={'Wealth in\nthe *earth.*'} />
          <div className="mt-10 grid gap-8 border-t border-paper/15 pt-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <p data-reveal data-intro="0.55" className="max-w-xl text-[17px] leading-7 text-paper/75">
              MJ Mining is building a more deliberate path into gold and diamond opportunity — grounded in
              local knowledge, responsible practice, and relationships that outlast a single project.
            </p>
            <div data-reveal data-intro="0.7" className="flex flex-wrap gap-3">
              <button type="button" onClick={() => scrollToTarget('#story', -80)} className="btn btn-signal">
                Our point of view <ArrowDownRight className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => scrollToTarget('#contact')} className="btn btn-ghost">Start a conversation</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── STORY ────────────────────────────────────────────────────────── */}
      <section id="story" className="bg-paper py-24 sm:py-36">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
            <p className="eyebrow text-sage">Our point of view</p>
            <div>
              <ScrubText
                className="t-lead max-w-[28ch] font-display font-semibold"
                text="Mining should *leave* *more* *behind.* We develop gold and diamond opportunities with care for the land, the people, and the future."
              />
              <div className="mt-16 grid gap-10 border-t border-ink/15 pt-10 sm:grid-cols-3">
                {PRINCIPLES.map((p, i) => (
                  <div key={p.no} data-reveal data-delay={String(i * 0.08)}>
                    <span className="font-display text-sm font-semibold text-signal">{p.no}</span>
                    <h3 className="mt-4 text-xl">{p.title}</h3>
                    <p className="mt-3 text-[15px] leading-7 text-ink/65">{p.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────────────────────── */}
      <section className="overflow-hidden border-y border-ink/10 bg-paper py-8">
        <Marquee speed={36}>
          {['Gold', 'Diamonds', 'Responsible practice', 'Local knowledge', 'Long-term partnership'].map(t => (
            <span key={t} className="font-display flex items-center gap-10 pr-10 text-[clamp(2.4rem,6vw,5.5rem)] font-extrabold uppercase leading-none tracking-tight text-ink">
              <span className="text-outline">{t}</span>
              <LogoMark className="h-10 w-10 sm:h-14 sm:w-14" />
            </span>
          ))}
        </Marquee>
      </section>

      {/* ── FOCUS ────────────────────────────────────────────────────────── */}
      <section id="focus" data-theme="dark" className="grain relative bg-ink py-24 text-paper sm:py-36">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="mb-16 grid gap-8 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="eyebrow mb-5 text-mint/70">Our focus</p>
              <SplitText className="t-xl font-extrabold" text={'Gold and diamonds.\n*One clear standard.*'} />
            </div>
            <p data-reveal className="max-w-md text-[17px] leading-8 text-paper/70 lg:justify-self-end">
              We look for strong potential, responsible development, and relationships built to last.
            </p>
          </div>

          <div className="space-y-24 sm:space-y-32">
            {FOCUS.map((f, i) => (
              <article key={f.label} className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-20 ${i % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                <div data-clip className="relative aspect-[4/5] overflow-hidden rounded-[28px] sm:aspect-[5/4]">
                  <div className="absolute -inset-y-[12%] inset-x-0" data-parallax="0.08">
                    <img src={f.image} alt={f.alt} loading="lazy" className="h-full w-full object-cover" />
                  </div>
                </div>
                <div>
                  <p data-reveal className="eyebrow text-signal">{f.label}</p>
                  <SplitText className="t-lg mt-6 font-extrabold" text={f.title} />
                  <p data-reveal className="mt-6 max-w-md text-[17px] leading-8 text-paper/70">{f.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPROACH ─────────────────────────────────────────────────────── */}
      <section id="approach" className="bg-paper py-24 sm:py-36">
        <div className="mx-auto grid max-w-[1440px] gap-14 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="eyebrow mb-5 text-sage">How we move</p>
            <SplitText className="t-xl font-extrabold" text={'A slower look.\nA *stronger* *result.*'} />
          </div>
          <div className="border-t border-ink/15">
            {APPROACH.map(({ no, title, text, icon: Icon }, i) => (
              <article key={no} data-reveal data-delay={String(i * 0.08)} className="group grid gap-5 border-b border-ink/15 py-10 sm:grid-cols-[80px_1fr_auto] sm:items-start">
                <span className="font-display text-sm font-semibold text-signal">{no}</span>
                <div>
                  <h3 className="font-display text-[clamp(1.6rem,2.6vw,2.4rem)] font-extrabold leading-none tracking-[-.03em] transition-transform duration-500 group-hover:translate-x-2">{title}</h3>
                  <p className="mt-4 max-w-xl text-[15px] leading-7 text-ink/65">{text}</p>
                </div>
                <span className="hidden h-14 w-14 place-items-center rounded-full bg-forest text-paper transition-all duration-500 group-hover:rotate-12 group-hover:bg-signal sm:grid">
                  <Icon className="h-5 w-5" />
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMAGE BAND ───────────────────────────────────────────────────── */}
      <section className="px-3 sm:px-4">
        <div className="relative h-[80vh] min-h-[480px] overflow-hidden rounded-[32px]">
          <div className="absolute -inset-y-[15%] inset-x-0" data-parallax="0.1">
            <img src="/images/homepage/mining.webp" alt="Excavator working an open mining site" loading="lazy" className="h-full w-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-paper sm:p-12">
            <SplitText className="t-lg max-w-4xl font-extrabold" text={'Built for responsible\n*opportunity.*'} />
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────────── */}
      <section id="contact" className="bg-paper py-24 sm:py-32">
        <div className="mx-auto grid max-w-[1440px] gap-14 px-5 sm:px-8 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
          <div>
            <p className="eyebrow mb-5 text-sage">Start a conversation</p>
            <SplitText className="t-xl font-extrabold" text={'The next chapter starts\nwith a *good question.*'} />
            <p data-reveal className="mt-8 max-w-xl text-[17px] leading-8 text-ink/70">
              Tell us what you are exploring. For partnerships, supply discussions, or investment
              enquiries, our team is ready to listen.
            </p>
          </div>
          <div data-reveal className="border-t border-ink/20">
            <a href="mailto:mining@mjlogisticsenterprise.com" className="group flex items-center justify-between border-b border-ink/20 py-6 text-[15px] font-semibold">
              <span className="flex items-center gap-3"><Mail className="h-5 w-5 text-signal" /> mining@mjlogisticsenterprise.com</span>
              <ArrowUpRight className="h-5 w-5 transition-transform duration-500 group-hover:rotate-45" />
            </a>
            <div className="flex items-center gap-3 border-b border-ink/20 py-6 text-[15px]">
              <MapPin className="h-5 w-5 text-signal" /> Monrovia, Liberia
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Magnetic>
                <a href="mailto:mining@mjlogisticsenterprise.com" className="btn btn-signal">Email the mining team <ArrowUpRight className="btn-arrow h-4 w-4" /></a>
              </Magnetic>
              <Link href="/" className="btn btn-ghost-dark">MJ Logistics home</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
