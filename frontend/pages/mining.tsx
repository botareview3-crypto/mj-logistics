import React, { useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight, Compass, Mail, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { useScrollFx } from '../lib/fx';
import { scrollToTarget } from '../lib/useLenis';
import { SplitText, ScrubText } from '../components/fx/SplitText';
import { PageHero } from '../components/fx/PageHero';

const PRINCIPLES = [
  { no: '01', title: 'Start with understanding', text: 'We listen first — to the land, the evidence, and the people closest to it.' },
  { no: '02', title: 'Work with discipline', text: 'Clear decisions, responsible practice, and steady progress guide every step.' },
  { no: '03', title: 'Build lasting value', text: 'The goal is value that benefits partners, communities, and the future.' },
];

const FOCUS = [
  {
    label: '01 / Gold', title: 'Careful work. Real *value.*', image: '/images/mining/gold.webp', alt: 'Gold nuggets held in an open hand',
    text: 'We assess gold opportunities with attention to quality, traceability, and trust.',
  },
  {
    label: '02 / Diamonds', title: 'Patience brings *clarity.*', image: '/images/mining/diamonds.webp', alt: 'Rough diamonds being sorted with tweezers',
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

  return (
    <div ref={pageRef} className="overflow-x-clip bg-paper">
      <Head>
        <title>MJ Mining | Resource with responsibility</title>
        <meta name="description" content="MJ Mining explores responsible opportunities in gold and diamonds through patience, partnership, and disciplined execution." />
      </Head>

      <PageHero
        eyebrow="A division of MJ Logistics Enterprise"
        title={'Wealth in the *earth.*'}
        intro="MJ Mining is building a more deliberate path into gold and diamond opportunity — grounded in local knowledge, responsible practice, and relationships that outlast a single project."
        actions={<>
          <button type="button" onClick={() => scrollToTarget('#story', -80)} className="btn btn-signal">Our point of view <ArrowDownRight className="h-4 w-4" /></button>
          <button type="button" onClick={() => scrollToTarget('#contact', -80)} className="btn btn-ghost-dark">Start a conversation</button>
        </>}
        image="/images/mining/hero.webp"
        imageAlt="Aerial view of an excavator working an open mining site"
      />

      {/* ── STORY ────────────────────────────────────────────────────────── */}
      <section id="story" className="scroll-mt-24 bg-white py-24 sm:py-32">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 sm:px-8 lg:grid-cols-[220px_1fr]">
          <p className="eyebrow text-sage">Our point of view</p>
          <div>
            <ScrubText
              className="t-lead max-w-[32ch] font-display font-medium"
              text="Mining should *leave* *more* *behind.* We develop gold and diamond opportunities with care for the land, the people, and the future."
            />
            <div className="mt-14 grid gap-5 sm:grid-cols-3">
              {PRINCIPLES.map((p, i) => (
                <div key={p.no} data-reveal data-delay={String(i * 0.06)} className="rounded-3xl border border-ink/10 bg-paper p-7">
                  <span className="text-sm font-semibold text-signal">{p.no}</span>
                  <h3 className="mt-4 text-xl">{p.title}</h3>
                  <p className="mt-3 text-[15px] leading-7 text-ink/65">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOCUS ────────────────────────────────────────────────────────── */}
      <section id="focus" className="scroll-mt-24 bg-paper py-24 sm:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="mb-14 grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="eyebrow mb-4 text-sage">Our focus</p>
              <SplitText className="t-xl" text={'Gold and diamonds. *One clear standard.*'} />
            </div>
            <p data-reveal className="max-w-md text-[16px] leading-7 text-ink/65 lg:justify-self-end">
              We look for strong potential, responsible development, and relationships built to last.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {FOCUS.map((f, i) => (
              <article key={f.label} data-reveal data-delay={String(i * 0.08)} className="overflow-hidden rounded-3xl border border-ink/10 bg-white">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={f.image} alt={f.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                </div>
                <div className="p-6 sm:p-8">
                  <p className="eyebrow text-signal">{f.label}</p>
                  <SplitText as="h3" className="t-lg mt-4" text={f.title} />
                  <p className="mt-4 max-w-md text-[16px] leading-7 text-ink/65">{f.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPROACH ─────────────────────────────────────────────────────── */}
      <section id="approach" className="bg-white py-24 sm:py-32">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="eyebrow mb-4 text-sage">How we move</p>
            <SplitText className="t-xl" text={'A slower look. A *stronger result.*'} />
          </div>
          <div className="border-t border-ink/10">
            {APPROACH.map(({ no, title, text, icon: Icon }, i) => (
              <article key={no} data-reveal data-delay={String(i * 0.06)} className="grid gap-5 border-b border-ink/10 py-8 sm:grid-cols-[64px_1fr_auto] sm:items-start">
                <span className="text-sm font-semibold text-signal">{no}</span>
                <div>
                  <h3 className="text-2xl">{title}</h3>
                  <p className="mt-3 max-w-xl text-[15px] leading-7 text-ink/65">{text}</p>
                </div>
                <span className="hidden h-12 w-12 place-items-center rounded-full bg-paper text-forest sm:grid">
                  <Icon className="h-5 w-5" />
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────────── */}
      <section id="contact" className="scroll-mt-24 bg-paper py-24 sm:py-32">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 sm:px-8 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
          <div>
            <p className="eyebrow mb-4 text-sage">Start a conversation</p>
            <SplitText className="t-xl" text={'The next chapter starts with a *good question.*'} />
            <p data-reveal className="mt-6 max-w-xl text-[16px] leading-7 text-ink/65">
              Tell us what you are exploring. For partnerships, supply discussions, or investment
              enquiries, our team is ready to listen.
            </p>
          </div>
          <div data-reveal className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-8">
            <a href="mailto:mining@mjlogisticsenterprise.com" className="group flex items-center justify-between border-b border-ink/10 pb-5 text-[15px] font-semibold">
              <span className="flex items-center gap-3"><Mail className="h-5 w-5 text-signal" /> mining@mjlogisticsenterprise.com</span>
              <ArrowUpRight className="h-5 w-5 text-ink/40 group-hover:text-signal" />
            </a>
            <div className="flex items-center gap-3 py-5 text-[15px]">
              <MapPin className="h-5 w-5 text-signal" /> Monrovia, Liberia
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="mailto:mining@mjlogisticsenterprise.com" className="btn btn-signal">Email the mining team <ArrowUpRight className="btn-arrow h-4 w-4" /></a>
              <Link href="/" className="btn btn-ghost-dark">MJ Logistics home</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
