import React, { useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight, PackageCheck, Sun } from 'lucide-react';
import { useScrollFx } from '../lib/fx';
import { scrollToTarget } from '../lib/useLenis';
import { SplitText, ScrubText } from '../components/fx/SplitText';
import { PageHero } from '../components/fx/PageHero';

/* Wording agreed with management (2026-09-29): solar is a supply line, not a
   service. Keep copy neutral — no invented stats, locations or claims. The
   ids are the #anchors used by the header menu. */
const SUPPLY = [
  {
    id: 'systems', icon: Sun, title: 'Solar energy systems', image: '/images/site/solar-systems.webp',
    alt: 'Aerial view of a solar farm in green fields',
    text: 'We supply solar energy systems, sourced to suit the requirements of each client.',
  },
  {
    id: 'equipment', icon: PackageCheck, title: 'Solar equipment supply', image: '/images/site/solar-equipment.webp',
    alt: 'Wall-mounted solar inverter and energy storage system',
    text: 'We supply the equipment that goes with solar energy systems, sourced to order.',
  },
];

export default function SolarPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  useScrollFx(pageRef);

  return (
    <div ref={pageRef} className="overflow-x-clip bg-paper">
      <Head>
        <title>Solar Energy — MJ Logistics Enterprise</title>
        <meta name="description" content="Solar energy system and equipment supply from MJ Logistics Enterprise." />
      </Head>

      <PageHero
        eyebrow="Solar energy"
        title={'Solar energy, *supplied to order.*'}
        intro="MJ Logistics Enterprise supplies solar energy systems and equipment. Tell us what you need and we will source it for you."
        actions={<>
          <Link href="/contact" className="btn btn-signal">Request a quote <ArrowUpRight className="btn-arrow h-4 w-4" /></Link>
          <button type="button" onClick={() => scrollToTarget('#supply', -80)} className="btn btn-ghost-dark">What we supply <ArrowDownRight className="h-4 w-4" /></button>
        </>}
        image="/images/site/solar-hero.webp"
        imageAlt="Rows of solar panels in a field under a cloudy sky"
      />

      {/* ── STATEMENT ────────────────────────────────────────────────────── */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 sm:px-8 lg:grid-cols-[220px_1fr]">
          <p className="eyebrow text-sage">Solar energy supply</p>
          <ScrubText
            className="t-lead max-w-[34ch] font-display font-medium"
            text="Solar is one of our supply lines. Tell us what you need, and we *source* *it* *for* *you* — through the same network that moves every MJ Logistics order."
          />
        </div>
      </section>

      {/* ── SUPPLY ───────────────────────────────────────────────────────── */}
      <section id="supply" className="scroll-mt-24 bg-white pb-24 sm:pb-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="mb-12">
            <p className="eyebrow mb-4 text-sage">What we supply</p>
            <SplitText className="t-xl" text={'Systems and *equipment.*'} />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {SUPPLY.map(({ id, icon: Icon, title, text, image, alt }, i) => (
              <article key={id} id={id} data-reveal data-delay={String(i * 0.08)} className="scroll-mt-28 overflow-hidden rounded-3xl border border-ink/10 bg-paper">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={image} alt={alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                </div>
                <div className="p-6 sm:p-8">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-signal/10 text-signal"><Icon className="h-6 w-6" /></span>
                  <h2 className="mt-6 text-[clamp(1.5rem,2.4vw,2.1rem)]">{title}</h2>
                  <p className="mt-3 max-w-md text-[16px] leading-7 text-ink/65">{text}</p>
                  <Link href="/contact" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-forest hover:text-signal">
                    Request a quote <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-white px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="relative overflow-hidden rounded-3xl">
          <img src="/images/site/solar-install.webp" alt="Technician installing solar panels" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-forest/90 via-forest/70 to-forest/20" />
          <div className="relative grid gap-8 px-6 py-16 text-white sm:px-12 sm:py-24 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
            <SplitText className="t-xl" text={'Tell us what *you need.*'} />
            <div data-reveal className="flex flex-col gap-5 lg:items-end">
              <p className="max-w-sm text-[16px] leading-7 text-white/85 lg:text-right">
                Share your solar requirement and we will point your enquiry to the right people.
              </p>
              <Link href="/contact" className="btn btn-signal">Request a quote <ArrowUpRight className="btn-arrow h-4 w-4" /></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
