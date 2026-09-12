import React from 'react';
import Head from 'next/head';
import { ArrowUpRight, CheckCircle2, Compass, ShieldCheck, Truck, Users } from 'lucide-react';
import { useApp } from '../lib/AppContext';

const PRINCIPLES = [
  ['01', Compass, 'Clear direction', 'Start with a vehicle, a category, or a business requirement and see the next step.'],
  ['02', ShieldCheck, 'Better information', 'Fitment, specifications, and product details are presented before you decide.'],
  ['03', Truck, 'Practical movement', 'From one replacement part to a larger requirement, the journey stays straightforward.'],
  ['04', Users, 'Human support', 'When the catalogue is not enough, our team helps you navigate the requirement.'],
];

export default function AdvantagesPage() {
  const { navigate } = useApp();

  return (
    <div className="pb-20">
      <Head>
        <title>How MJ Logistics Works</title>
        <meta name="description" content="Discover the principles behind the MJ Logistics customer experience." />
      </Head>
      <section className="rounded-3xl bg-[#071a33] px-6 py-16 text-white shadow-xl sm:px-12 sm:py-24">
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-[#55b8ff]">The MJ approach</p>
        <h1 className="max-w-4xl text-5xl font-black leading-[.95] tracking-[-.06em] sm:text-7xl">A better way to make the next move.</h1>
        <p className="mt-7 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">Good service is not a slogan. It is the clarity, detail, and follow-through that make a decision easier.</p>
      </section>
      <section className="grid gap-5 py-20 sm:grid-cols-2 lg:py-28">
        {PRINCIPLES.map(([number, Icon, title, description]) => (
          <article key={title as string} className="rounded-3xl border border-slate-200 bg-white p-7 transition-all hover:-translate-y-1 hover:border-sky-300 hover:shadow-xl sm:p-9">
            <div className="flex items-start justify-between">
              <span className="text-sm font-black text-[#55aeea]">{number as string}</span>
              {React.createElement(Icon as React.ElementType, { className: 'h-6 w-6 text-[#0077C7]' })}
            </div>
            <h2 className="mt-12 text-2xl font-black tracking-[-.04em] text-[#071a33]">{title as string}</h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-slate-600">{description as string}</p>
          </article>
        ))}
      </section>
      <section className="flex flex-col justify-between gap-8 rounded-3xl bg-[#55b8ff] p-8 sm:p-12 lg:flex-row lg:items-end">
        <div>
          <CheckCircle2 className="h-8 w-8 text-[#071a33]" />
          <h2 className="mt-5 max-w-xl text-4xl font-black leading-none tracking-[-.05em] text-[#071a33] sm:text-5xl">Ready to find your route?</h2>
        </div>
        <button type="button" onClick={() => navigate('/shop')} className="inline-flex w-fit items-center gap-2 rounded-full bg-[#071a33] px-6 py-3.5 text-sm font-bold text-white transition-transform hover:-translate-y-1">Explore marketplace <ArrowUpRight className="h-4 w-4" /></button>
      </section>
    </div>
  );
}
