import React, { useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowUpRight, Compass, ShieldCheck, Truck, Users } from 'lucide-react';
import { useScrollFx } from '../lib/fx';
import { SplitText, ScrubText } from '../components/fx/SplitText';
import { PageHero } from '../components/fx/PageHero';

const PRINCIPLES = [
  { no: '01', icon: Compass,     title: 'Clear direction',    text: 'Start with a vehicle, a category, or a business requirement and see the next step.' },
  { no: '02', icon: ShieldCheck, title: 'Better information', text: 'Fitment, specifications, and product details are presented before you decide.' },
  { no: '03', icon: Truck,       title: 'Practical movement', text: 'From one replacement part to a larger requirement, the journey stays straightforward.' },
  { no: '04', icon: Users,       title: 'Human support',      text: 'When the catalogue is not enough, our team helps you navigate the requirement.' },
];

export default function AdvantagesPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  useScrollFx(pageRef);

  return (
    <div ref={pageRef} className="overflow-x-clip bg-paper">
      <Head>
        <title>Why MJ Logistics</title>
        <meta name="description" content="Discover the principles behind the MJ Logistics customer experience." />
      </Head>

      <PageHero
        eyebrow="The MJ approach"
        title={'A better way to make the *next move.*'}
        intro="Good service is not a slogan. It is the clarity, detail, and follow-through that make a decision easier."
        image="/images/homepage/industrial.webp"
        imageAlt="Warehouse worker checking stocked parts bins"
      />

      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="grid gap-5 sm:grid-cols-2">
            {PRINCIPLES.map(({ no, icon: Icon, title, text }, i) => (
              <article key={no} data-reveal data-delay={String((i % 2) * 0.08)} className="rounded-3xl border border-ink/10 bg-paper p-8 sm:p-10">
                <div className="flex items-start justify-between">
                  <span className="text-sm font-semibold text-signal">{no}</span>
                  <Icon className="h-7 w-7 text-forest" />
                </div>
                <h2 className="mt-12 text-[clamp(1.5rem,2.4vw,2.1rem)]">{title}</h2>
                <p className="mt-3 max-w-md text-[15px] leading-7 text-ink/65">{text}</p>
              </article>
            ))}
          </div>
          <div className="mx-auto mt-24 max-w-4xl text-center">
            <ScrubText
              className="t-lead font-display font-medium"
              text="Every decision we make is about one thing: getting you the *right* *thing,* at the right time, *without* *the* *run-around.*"
            />
          </div>
        </div>
      </section>

      <section className="bg-white px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="rounded-3xl bg-signal px-6 py-14 text-white sm:px-12 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
            <SplitText className="t-xl" accentClass="text-ink" text={'Ready to find *your route?*'} />
            <div data-reveal className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/shop" className="btn btn-ink">Explore the marketplace <ArrowUpRight className="btn-arrow h-4 w-4" /></Link>
              <Link href="/contact" className="btn btn-ghost">Contact us</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
