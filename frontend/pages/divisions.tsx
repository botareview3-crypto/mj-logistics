import React from 'react';
import Head from 'next/head';
import { ArrowRight, Gem, Package, ShieldCheck, Wrench } from 'lucide-react';
import { useApp } from '../lib/AppContext';

const DIVISIONS = [
  {
    title: 'Auto Parts',
    description: 'Genuine parts with vehicle fitment support so you can buy with confidence.',
    image: '/homepage/auto-parts-istock.jpg',
    icon: Wrench,
    href: '/shop',
    action: 'Shop parts',
  },
  {
    title: 'Office & Stationery',
    description: 'Reliable supplies and equipment for productive workplaces and growing teams.',
    image: '/homepage/office.webp',
    icon: Package,
    href: '/catalog/office-stationery',
    action: 'Browse supplies',
  },
  {
    title: 'MJ Mining',
    description: 'Responsible gold and diamond opportunities built around trust and long-term value.',
    image: '/homepage/diamond.webp',
    icon: Gem,
    href: '/mining',
    action: 'Discover mining',
  },
];

export default function DivisionsPage() {
  const { navigate } = useApp();

  return (
    <div className="min-h-screen bg-[#f0f4f8] text-[#0d1f3c]">
      <Head>
        <title>About MJ Logistics Enterprise</title>
        <meta
          name="description"
          content="Learn about MJ Logistics Enterprise and the divisions we are building for customers and businesses."
        />
      </Head>

      <main>
        <section className="bg-[#0d1f3c] text-white">
          <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-6 pb-16 pt-28 sm:px-10 lg:grid-cols-[1fr_.9fr] lg:gap-16 lg:px-10 lg:pb-24 lg:pt-36">
            <div>
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-white/60">
                About MJ Logistics
              </p>
              <h1 className="max-w-xl text-4xl font-bold leading-tight sm:text-5xl">
                Practical solutions for everyday business.
              </h1>
              <p className="mt-6 max-w-lg text-[15px] leading-7 text-white/75">
                MJ Logistics Enterprise brings together auto parts, workplace
                supplies, business equipment, and natural-resource opportunity
                under one dependable standard.
              </p>
              <button
                type="button"
                onClick={() => navigate('/contact')}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#0d1f3c] transition hover:bg-slate-100"
              >
                Talk to our team <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="overflow-hidden rounded-2xl bg-white/10">
              <img
                src="/homepage/hero-bg.webp"
                alt="MJ Logistics Enterprise operations"
                className="h-[280px] w-full object-cover sm:h-[340px]"
              />
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto grid max-w-[1200px] gap-10 px-6 sm:px-10 lg:grid-cols-[.8fr_1.2fr] lg:px-10">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#1e4d8c]">
                What guides us
              </p>
              <h2 className="mt-3 max-w-md text-3xl font-bold leading-tight sm:text-4xl">
                Make the next move easier.
              </h2>
            </div>
            <div>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Good business starts with clear information, useful products,
                and people who follow through. We keep our divisions focused
                on those simple principles.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  ['Clarity', 'Straightforward information and practical choices.'],
                  ['Reliability', 'Careful service from the first question to delivery.'],
                  ['Progress', 'Helping customers and partners move forward.'],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-xl bg-[#f0f4f8] p-5">
                    <h3 className="font-bold">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-[1200px] px-6 sm:px-10 lg:px-10">
            <div className="mb-10 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400">
                  Our divisions
                </p>
                <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Everything you need</h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-slate-500">
                Different services, one consistent focus on quality, support, and value.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {DIVISIONS.map(({ title, description, image, icon: Icon, href, action }) => (
                <article key={title} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/80 transition hover:-translate-y-1 hover:shadow-lg">
                  <img src={image} alt={title} className="h-48 w-full object-cover" loading="lazy" />
                  <div className="p-6">
                    <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8a020]/15 text-[#c47c0a]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-xl font-bold">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
                    <button
                      type="button"
                      onClick={() => navigate(href)}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#1e4d8c] hover:text-[#0d1f3c]"
                    >
                      {action} <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-14">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-5 px-6 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-10">
            <div className="flex items-start gap-4">
              <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-[#1e4d8c]" />
              <div>
                <h2 className="text-2xl font-bold">Built for the long term.</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  We are building useful, responsible services for customers, teams, and partners in Ethiopia and beyond.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/contact')}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#0d1f3c] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1a3560]"
            >
              Contact us <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
