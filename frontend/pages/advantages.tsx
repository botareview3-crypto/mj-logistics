import React, { useRef } from 'react';
import Head from 'next/head';
import { Compass, ShieldCheck, Truck, Users } from 'lucide-react';
import { useScrollFx } from '../lib/fx';
import { ScrubText } from '../components/fx/SplitText';
import { PageHero } from '../components/fx/PageHero';
import { Wrap, CtaBand } from '../components/ui';

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

      <section className="bg-white py-20 sm:py-28">
        <Wrap>
          <div className="border-t border-ink py-4"><p className="tag tag-dot">01 / Four principles</p></div>
          <ol className="mt-4">
            {PRINCIPLES.map(({ no, icon: Icon, title, text }) => (
              <li key={no} data-reveal className="grid items-center gap-4 border-b border-ink py-8 sm:grid-cols-12 sm:gap-8 sm:py-10">
                <span className="font-display text-[4rem] font-bold leading-none tracking-tighter text-signal sm:col-span-2">{no}</span>
                <h2 className="text-[clamp(1.8rem,3vw,2.6rem)] sm:col-span-4">{title}</h2>
                <p className="text-[18px] leading-8 text-ink/80 sm:col-span-5">{text}</p>
                <Icon className="hidden h-8 w-8 text-forest sm:col-span-1 sm:block sm:justify-self-end" />
              </li>
            ))}
          </ol>
          <div className="mt-20 max-w-4xl">
            <ScrubText
              className="t-lead font-display font-semibold"
              text="Every decision we make is about one thing: getting you the *right* *thing,* at the right time, *without* *the* *run-around.*"
            />
          </div>
        </Wrap>
      </section>

      <CtaBand
        title={'Ready to find *your route?*'}
        primary={{ label: 'Explore the marketplace', href: '/shop' }}
        secondary={{ label: 'Contact us', href: '/contact' }}
      />
    </div>
  );
}
