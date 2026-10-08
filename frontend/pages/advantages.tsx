import React, { useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowUpRight, Compass, ShieldCheck, Truck, Users } from 'lucide-react';
import { useScrollFx } from '../lib/fx';
import { SplitText, ScrubText } from '../components/fx/SplitText';
import { Magnetic } from '../components/fx/Magnetic';

const PRINCIPLES = [
  { no: '01', icon: Compass,     title: 'Clear direction',     text: 'Start with a vehicle, a category, or a business requirement and see the next step.' },
  { no: '02', icon: ShieldCheck, title: 'Better information',  text: 'Fitment, specifications, and product details are presented before you decide.' },
  { no: '03', icon: Truck,       title: 'Practical movement',  text: 'From one replacement part to a larger requirement, the journey stays straightforward.' },
  { no: '04', icon: Users,       title: 'Human support',       text: 'When the catalogue is not enough, our team helps you navigate the requirement.' },
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

      <section data-hero="dark" className="grain relative overflow-hidden bg-ink pb-24 pt-40 text-paper sm:pb-32 sm:pt-48">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <p data-reveal data-intro="0.05" className="eyebrow mb-8 flex items-center gap-3 text-mint">
            <span className="h-px w-10 bg-signal" /> The MJ approach
          </p>
          <SplitText as="h1" intro={0.1} className="t-hero max-w-[16ch] font-extrabold" text={'A better way to make\nthe *next move.*'} />
          <p data-reveal data-intro="0.5" className="mt-10 max-w-2xl text-[17px] leading-8 text-paper/70">
            Good service is not a slogan. It is the clarity, detail, and follow-through that make a decision easier.
          </p>
        </div>
      </section>

      <section className="bg-paper py-24 sm:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {PRINCIPLES.map(({ no, icon: Icon, title, text }, i) => (
              <article
                key={no}
                data-reveal
                data-delay={String((i % 2) * 0.1)}
                className="group relative min-h-[300px] overflow-hidden rounded-[28px] bg-white p-8 sm:p-10"
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-forest transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-y-100" />
                <div className="relative flex h-full flex-col justify-between gap-16 transition-colors duration-500 group-hover:text-paper">
                  <div className="flex items-start justify-between">
                    <span className="font-display text-6xl font-extrabold text-ink/10 transition-colors duration-500 group-hover:text-signal">{no}</span>
                    <Icon className="h-7 w-7 text-signal" />
                  </div>
                  <div>
                    <h2 className="text-[clamp(1.6rem,2.6vw,2.4rem)]">{title}</h2>
                    <p className="mt-3 max-w-md text-[15px] leading-7 opacity-70">{text}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mx-auto mt-28 max-w-5xl text-center">
            <ScrubText
              className="t-lead font-display font-semibold"
              text="Every decision we make is about one thing: getting you the *right* *thing,* at the right time, *without* *the* *run-around.*"
            />
          </div>
        </div>
      </section>

      <section className="bg-paper px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="relative overflow-hidden rounded-[32px] bg-signal px-6 py-16 text-white sm:px-12 sm:py-24">
          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
            <SplitText className="t-xl font-extrabold" accentClass="text-ink" text={'Ready to find\n*your route?*'} />
            <div data-reveal className="flex flex-wrap gap-3 lg:justify-end">
              <Magnetic>
                <Link href="/shop" className="btn btn-ink">Explore the marketplace <ArrowUpRight className="btn-arrow h-4 w-4" /></Link>
              </Magnetic>
              <Link href="/contact" className="btn btn-ghost">Contact us</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
