import React, { useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight, PackageCheck, Sun } from 'lucide-react';
import { useScrollFx } from '../lib/fx';
import { scrollToTarget } from '../lib/useLenis';
import { ScrubText } from '../components/fx/SplitText';
import { Wrap, SectionHead, CtaBand } from '../components/ui';
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

      <section className="bg-white py-20 sm:py-28">
        <Wrap>
          <div className="border-t border-ink py-4"><p className="tag tag-dot">01 / Solar energy supply</p></div>
          <ScrubText
            className="t-lead mt-8 max-w-[34ch] font-display font-semibold"
            text="Solar is one of our supply lines. Tell us what you need, and we *source* *it* *for* *you* — through the same network that moves every MJ Logistics order."
          />
        </Wrap>
      </section>

      <section id="supply" className="scroll-mt-24 bg-paper py-20 sm:py-28">
        <Wrap>
          <SectionHead no="02" label="What we supply" title={'Systems and *equipment.*'} />
          <div className="grid border-l border-t border-ink md:grid-cols-2">
            {SUPPLY.map(({ id, icon: Icon, title, text, image, alt }, i) => (
              <article key={id} id={id} data-reveal data-delay={String(i * 0.08)} className="scroll-mt-28 border-b border-r border-ink bg-white">
                <div className="relative aspect-[16/10] overflow-hidden border-b border-ink">
                  <img src={image} alt={alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  <span className="absolute left-0 top-0 grid h-12 w-12 place-items-center bg-signal text-ink"><Icon className="h-6 w-6" /></span>
                </div>
                <div className="p-6 sm:p-8">
                  <p className="tag text-ink/55">Supply 0{i + 1}</p>
                  <h2 className="mt-3 text-[clamp(1.7rem,2.6vw,2.3rem)]">{title}</h2>
                  <p className="mt-3 max-w-md text-[18px] leading-7 text-ink/80">{text}</p>
                  <Link href="/contact" className="link-arrow mt-6">Request a quote <ArrowUpRight className="h-4 w-4" /></Link>
                </div>
              </article>
            ))}
          </div>
        </Wrap>
      </section>

      <CtaBand
        title={'Tell us what *you need.*'}
        text="Share your solar requirement and we will point your enquiry to the right people."
        primary={{ label: 'Request a quote', href: '/contact' }}
        image="/images/site/solar-install.webp"
      />
    </div>
  );
}
