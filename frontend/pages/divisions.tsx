import React from 'react';
import Head from 'next/head';
import { ArrowUpRight, Factory, Gem, Wrench } from 'lucide-react';
import { useApp } from '../lib/AppContext';

const DIVISIONS = [
  {
    title: 'Auto Parts',
    label: 'Mobility',
    text: 'A vehicle-first marketplace that makes it easier to identify and purchase the parts that belong on the road.',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1200&q=85',
    icon: Wrench,
    href: '/shop',
    action: 'Enter marketplace',
  },
  {
    title: 'Industrial Supply',
    label: 'Capability',
    text: 'Equipment and sourcing support for workshops, construction teams, manufacturers, and business operations.',
    image: 'https://images.unsplash.com/photo-1565610222536-ef125c59da2e?auto=format&fit=crop&w=1200&q=85',
    icon: Factory,
    href: '/catalog',
    action: 'Browse catalog',
  },
  {
    title: 'MJ Mining',
    label: 'Opportunity',
    text: 'A natural-resources division focused on diamond and gold opportunities and long-term partnerships.',
    image: 'https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&w=1200&q=85',
    icon: Gem,
    href: '/mining',
    action: 'Explore mining',
  },
];

export default function DivisionsPage() {
  const { navigate } = useApp();

  return (
    <div className="pb-20">
      <Head>
        <title>About MJ Logistics Enterprise</title>
        <meta name="description" content="Explore the businesses and services that make up MJ Logistics Enterprise." />
      </Head>

      <section className="relative overflow-hidden rounded-3xl bg-[#071a33] px-6 py-16 text-white shadow-xl sm:px-12 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(85,184,255,.35),transparent_36%)]" />
        <div className="relative max-w-3xl">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-[#55b8ff]">About MJ Logistics</p>
          <h1 className="text-5xl font-black leading-[.95] tracking-[-.06em] sm:text-7xl">A connected enterprise for the next generation of business.</h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">We bring practical products, industry support, and natural-resource opportunity together under one clear direction.</p>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="mb-12 max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#1769aa]">Our businesses</p>
          <h2 className="text-4xl font-black leading-none tracking-[-.05em] sm:text-6xl">Different needs. One dependable standard.</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {DIVISIONS.map((division) => (
            <article key={division.title} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl">
              <div className="relative h-64 overflow-hidden">
                <img src={division.image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071a33]/80 to-transparent" />
                <div className="absolute bottom-5 left-5 flex items-center gap-3 text-white">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#55b8ff] text-[#071a33]"><division.icon className="h-5 w-5" /></span>
                  <span className="text-xs font-bold uppercase tracking-[0.2em]">{division.label}</span>
                </div>
              </div>
              <div className="p-7">
                <h3 className="text-2xl font-black tracking-[-.04em] text-[#071a33]">{division.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{division.text}</p>
                <button type="button" onClick={() => navigate(division.href)} className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#0077C7]">{division.action}<ArrowUpRight className="h-4 w-4" /></button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
