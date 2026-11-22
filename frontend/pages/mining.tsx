import React, { useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight, Compass, Mail, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { useScrollFx } from '../lib/fx';
import { scrollToTarget } from '../lib/useLenis';
import { SplitText, ScrubText } from '../components/fx/SplitText';
import { Wrap, SectionHead } from '../components/ui';
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
        eyebrow="MJ Mining"
        title={'Wealth in the *earth.*'}
        intro="MJ Mining is building a more deliberate path into gold and diamond opportunity — grounded in local knowledge, responsible practice, and relationships that outlast a single project."
        actions={<>
          <button type="button" onClick={() => scrollToTarget('#story', -80)} className="btn btn-signal">Our point of view <ArrowDownRight className="h-4 w-4" /></button>
          <button type="button" onClick={() => scrollToTarget('#contact', -80)} className="btn btn-ghost-dark">Start a conversation</button>
        </>}
        image="/images/mining/hero.webp"
        imageAlt="Aerial view of an excavator working an open mining site"
      />

      <section id="story" className="scroll-mt-24 bg-white py-20 sm:py-28">
        <Wrap>
          <div className="border-t border-ink py-4"><p className="tag tag-dot">01 / Our point of view</p></div>
          <ScrubText
            className="t-lead mt-8 max-w-[34ch] font-display font-semibold"
            text="Mining should *leave* *more* *behind.* We develop gold and diamond opportunities with care for the land, the people, and the future."
          />
          <ol className="mt-14 grid border-t border-ink md:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <li key={p.no} data-reveal data-delay={String(i * 0.06)} className="border-b border-ink py-8 md:border-b-0 md:pr-8 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:pl-8">
                <p className="tag text-azure">{p.no}</p>
                <h3 className="mt-4 text-[26px]">{p.title}</h3>
                <p className="mt-3 text-[17px] leading-7 text-ink/80">{p.text}</p>
              </li>
            ))}
          </ol>
        </Wrap>
      </section>

      <section id="focus" className="scroll-mt-24 bg-paper py-20 sm:py-28">
        <Wrap>
          <SectionHead no="02" label="Our focus" title={'Gold and diamonds. *One clear standard.*'} intro="We look for strong potential, responsible development, and relationships built to last." />
          <div className="grid gap-6 md:grid-cols-2">
            {FOCUS.map((f, i) => (
              <article key={f.label} data-reveal data-delay={String(i * 0.08)} className="border border-ink bg-white">
                <div className="relative aspect-[16/10] overflow-hidden border-b border-ink">
                  <img src={f.image} alt={f.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  <span className="absolute bottom-0 left-0 bg-signal px-3 py-1.5 tag text-ink">{f.label}</span>
                </div>
                <div className="p-6 sm:p-8">
                  <SplitText as="h3" className="t-lg" text={f.title} />
                  <p className="mt-4 max-w-md text-[18px] leading-7 text-ink/80">{f.text}</p>
                </div>
              </article>
            ))}
          </div>
        </Wrap>
      </section>

      <section id="approach" className="bg-white py-20 sm:py-28">
        <Wrap>
          <div className="border-t border-ink py-4"><p className="tag tag-dot">03 / How we move</p></div>
          <div className="mt-8 grid gap-12 lg:grid-cols-12">
            <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
              <SplitText className="t-xl" text={'A slower look. A *stronger result.*'} />
            </div>
            <ul className="border-t border-ink lg:col-span-7">
              {APPROACH.map(({ no, title, text, icon: Icon }, i) => (
                <li key={no} data-reveal data-delay={String(i * 0.06)} className="grid grid-cols-[auto_1fr_auto] items-start gap-5 border-b border-ink py-8 sm:gap-8">
                  <span className="tag pt-2 text-azure">{no}</span>
                  <div>
                    <h3 className="text-[28px]">{title}</h3>
                    <p className="mt-3 max-w-xl text-[17px] leading-7 text-ink/80">{text}</p>
                  </div>
                  <span className="grid h-12 w-12 place-items-center bg-signal text-ink"><Icon className="h-5 w-5" /></span>
                </li>
              ))}
            </ul>
          </div>
        </Wrap>
      </section>

      <section id="contact" className="scroll-mt-24 bg-forest text-white">
        <div className="h-2 bg-signal" />
        <Wrap className="grid gap-12 py-20 sm:py-28 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="tag tag-dot mb-6 text-mint">Start a conversation</p>
            <SplitText className="t-xl" accentClass="text-signal" text={'The next chapter starts with a *good question.*'} />
            <p data-reveal className="t-body mt-6 max-w-xl text-white/90">
              Tell us what you are exploring. For partnerships, supply discussions, or investment enquiries, our team is ready to listen.
            </p>
          </div>
          <div data-reveal className="border border-white/40 lg:col-span-5">
            <a href="mailto:mining@mjlogisticsenterprise.com" className="group flex items-center justify-between gap-4 border-b border-white/40 p-5 text-[17px] font-semibold hover:bg-signal hover:text-ink">
              <span className="flex items-center gap-3 break-all"><Mail className="h-5 w-5 shrink-0" /> mining@mjlogisticsenterprise.com</span>
              <ArrowUpRight className="h-5 w-5 shrink-0" />
            </a>
            <p className="flex items-center gap-3 border-b border-white/40 p-5 text-[17px]"><MapPin className="h-5 w-5" /> Monrovia, Liberia</p>
            <div className="flex flex-wrap gap-3 p-5">
              <a href="mailto:mining@mjlogisticsenterprise.com" className="btn btn-signal">Email the mining team <ArrowUpRight className="btn-arrow h-4 w-4" /></a>
              <Link href="/" className="btn btn-ghost">MJ Logistics home</Link>
            </div>
          </div>
        </Wrap>
      </section>
    </div>
  );
}
