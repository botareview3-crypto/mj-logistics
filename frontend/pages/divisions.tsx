import React from 'react';
import Head from 'next/head';
import { ArrowDownRight, ArrowUpRight, Factory, Gem, ShieldCheck, Wrench } from 'lucide-react';
import { useApp } from '../lib/AppContext';

const DIVISIONS = [
  {
    title: 'Auto Parts',
    label: 'Mobility',
    text: 'Vehicle-first parts sourcing with fitment information that helps people buy with confidence.',
    image: '/homepage/auto-parts-istock.jpg',
    icon: Wrench,
    href: '/shop',
    action: 'Enter marketplace',
  },
  {
    title: 'Office & Stationery',
    label: 'Business',
    text: 'Practical supplies and equipment that keep workplaces moving, from everyday essentials to larger requirements.',
    image: '/homepage/office.webp',
    icon: Factory,
    href: '/catalog/office-stationery',
    action: 'Browse supplies',
  },
  {
    title: 'MJ Mining',
    label: 'Opportunity',
    text: 'A considered approach to gold and diamond opportunity, built around responsibility and long-term partnership.',
    image: '/homepage/diamond.webp',
    icon: Gem,
    href: '/mining',
    action: 'Explore mining',
  },
];

export default function DivisionsPage() {
  const { navigate } = useApp();

  return (
    <div className="overflow-hidden bg-[#f5f4ef] text-[#10221d]">
      <Head>
        <title>About MJ Logistics Enterprise</title>
        <meta name="description" content="Discover the connected divisions and operating principles of MJ Logistics Enterprise." />
      </Head>

      <main>
        <section className="relative min-h-[650px] bg-[#10221d] text-[#f5f4ef]">
          <div className="absolute inset-0">
            <img src="/homepage/hero-bg.webp" alt="MJ Logistics Enterprise operations" className="h-full w-full object-cover opacity-45" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,34,29,.98)_0%,rgba(16,34,29,.75)_48%,rgba(16,34,29,.18)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(16,34,29,.88)_0%,transparent_55%)]" />
          </div>
          <div className="relative mx-auto flex min-h-[650px] max-w-[1320px] flex-col justify-between px-6 pb-12 pt-20 sm:px-10 lg:px-16">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.38em] text-[#d8b46a]">About the enterprise</p>
              <span className="text-xs uppercase tracking-[0.2em] text-white/50">Addis Ababa · Ethiopia</span>
            </div>
            <div className="max-w-4xl">
              <p className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-[#d8b46a]">
                <span className="h-px w-10 bg-[#d8b46a]" /> One direction, many ways forward
              </p>
              <h1 className="max-w-4xl text-6xl font-semibold leading-[.9] tracking-[-.065em] sm:text-8xl lg:text-[8.5rem]">
                Practical work.<br />Bigger horizons.
              </h1>
              <p className="mt-8 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
                MJ Logistics Enterprise connects useful products, business support,
                and natural-resource opportunity under one dependable standard.
              </p>
              <a href="#businesses" className="mt-10 inline-flex items-center gap-3 border-b border-[#d8b46a] pb-3 text-sm font-semibold">
                See what we build <ArrowDownRight className="h-4 w-4 text-[#d8b46a]" />
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1320px] gap-12 px-6 py-24 sm:px-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-24 lg:py-36">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#9b7430]">The MJ standard</p>
            <h2 className="mt-6 max-w-lg text-4xl font-semibold leading-[.98] tracking-[-.05em] sm:text-6xl">
              Make the next move easier.
            </h2>
          </div>
          <div className="max-w-2xl">
            <p className="text-xl leading-8 text-[#284038] sm:text-2xl sm:leading-9">
              We believe good business begins with clarity: knowing what is needed,
              understanding the options, and having a reliable path to the next step.
            </p>
            <p className="mt-8 text-sm leading-7 text-[#63716b]">
              That principle shapes every part of MJ Logistics. It guides the way we
              present vehicle parts, support workplaces, and evaluate opportunities
              in resources. Different divisions, one clear expectation: useful work
              delivered with care.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ['01', 'Clarity', 'Make the requirement easier to understand.'],
                ['02', 'Reliability', 'Follow through with useful detail.'],
                ['03', 'Momentum', 'Help people move from need to action.'],
              ].map(([number, title, text]) => (
                <div key={number} className="border-t border-[#c9c8bf] pt-4">
                  <span className="text-xs font-semibold text-[#9b7430]">{number}</span>
                  <h3 className="mt-3 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-xs leading-5 text-[#63716b]">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="businesses" className="bg-[#10221d] px-6 py-24 text-[#f5f4ef] sm:px-10 lg:px-16 lg:py-36">
          <div className="mx-auto max-w-[1320px]">
            <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#d8b46a]">Our businesses</p>
                <h2 className="mt-6 text-5xl font-semibold leading-[.92] tracking-[-.06em] sm:text-7xl">Three routes.<br />One standard.</h2>
              </div>
              <p className="max-w-xl text-base leading-7 text-white/55">
                We work across practical commerce and long-term opportunity, staying
                close to the real needs of customers, teams, and partners.
              </p>
            </div>
            <div className="mt-16 grid gap-5 lg:grid-cols-3">
              {DIVISIONS.map(({ title, label, text, image, icon: Icon, href, action }) => (
                <article key={title} className="group relative min-h-[470px] overflow-hidden bg-[#284038]">
                  <img src={image} alt={`${title} division`} className="absolute inset-0 h-full w-full object-cover opacity-65 transition duration-700 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#10221d] via-[#10221d]/35 to-transparent" />
                  <div className="relative flex min-h-[470px] flex-col justify-end p-7 sm:p-8">
                    <div className="mb-auto flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d8b46a] text-[#10221d]"><Icon className="h-5 w-5" /></span>
                      <span className="text-xs uppercase tracking-[0.25em] text-white/65">{label}</span>
                    </div>
                    <h3 className="text-4xl font-semibold tracking-[-.06em]">{title}</h3>
                    <p className="mt-4 text-sm leading-6 text-white/70">{text}</p>
                    <button type="button" onClick={() => navigate(href)} className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#d8b46a]">
                      {action} <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1320px] px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <ShieldCheck className="h-8 w-8 text-[#9b7430]" />
              <h2 className="mt-6 max-w-md text-5xl font-semibold leading-[.92] tracking-[-.06em] sm:text-7xl">Built for the long view.</h2>
            </div>
            <div className="max-w-2xl">
              <p className="text-lg leading-8 text-[#284038]">
                We are building an enterprise that can be useful today and still
                make sense tomorrow — grounded in service, responsible decisions,
                and relationships that compound over time.
              </p>
              <button type="button" onClick={() => navigate('/contact')} className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#10221d] px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-1">
                Start a conversation <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
