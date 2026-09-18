import React from 'react';
import Head from 'next/head';
import { ArrowRight, Box, ClipboardList, Truck } from 'lucide-react';
import { useApp } from '../lib/AppContext';

const HOW_WE_WORK = [
  {
    title: 'Sourcing',
    text: 'We buy direct from manufacturers and verified suppliers, so pricing and part authenticity are traceable.',
    icon: ClipboardList,
  },
  {
    title: 'Import & clearance',
    text: 'Freight booking, documentation, and customs are handled in-house. Clients do not chase brokers.',
    icon: Box,
  },
  {
    title: 'Delivery',
    text: '    Delivery and fulfilment help connect suppliers with the places where materials are needed.',
    icon: Truck,
  },
];

const DIVISIONS = [
  ['Automotive and heavy-equipment parts', '/shop'],
  ['Industrial supplies and office equipment', '/catalog/office-stationery'],
  ['Mining inputs and support services', '/mining'],
];

export default function DivisionsPage() {
  const { navigate } = useApp();

  return (
    <div className="min-h-screen bg-white text-[#0d1f3c]">
      <Head>
        <title>About MJ Logistics Enterprise</title>
        <meta
          name="description"
          content="Learn what MJ Logistics Enterprise does and how we source, import, warehouse, and deliver for businesses."
        />
      </Head>

      <main>
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-[1200px] px-6 pb-14 pt-28 sm:px-10 lg:px-10 lg:pb-20 lg:pt-36">
            <div className="max-w-2xl">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-[#1e4d8c]">
                About MJ Logistics
              </p>
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl">What we do</h1>
              <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">
                MJ Logistics Enterprise helps businesses source, move, and
                manage the parts, equipment, and materials they need. We bring
                practical services together so clients have one clear place to
                start.
              </p>
            </div>
            <div className="mt-12 overflow-hidden rounded-xl">
              <img
                src="/images.jpg"
                alt="Warehouse truck and forklift loading a delivery"
                className="h-[240px] w-full object-cover sm:h-[390px]"
              />
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-[1200px] px-6 sm:px-10 lg:px-10">
            <div className="max-w-xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#1e4d8c]">
                How we work
              </p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">One operation, three steps.</h2>
            </div>
            <div className="mt-10 grid gap-10 border-t border-slate-200 pt-8 md:grid-cols-3 md:gap-8">
              {HOW_WE_WORK.map(({ title, text, icon: Icon }, index) => (
                <div key={title} className="relative">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-[#1e4d8c]" strokeWidth={1.8} />
                    <span className="text-xs font-bold text-slate-400">0{index + 1}</span>
                  </div>
                  <h3 className="mt-5 text-xl font-bold">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-[#f0f4f8] py-16 sm:py-20">
          <div className="mx-auto grid max-w-[1200px] gap-10 px-6 sm:px-10 lg:grid-cols-[.75fr_1.25fr] lg:px-10">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#1e4d8c]">
                What we handle
              </p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Supply that keeps business moving.</h2>
            </div>
            <div>
              <div className="divide-y divide-slate-300 border-y border-slate-300">
                {DIVISIONS.map(([title, href]) => (
                  <button
                    key={title}
                    type="button"
                    onClick={() => navigate(href)}
                    className="group flex w-full items-center justify-between gap-5 py-5 text-left"
                  >
                    <span className="text-lg font-bold">{title}</span>
                    <ArrowRight className="h-5 w-5 shrink-0 text-[#1e4d8c] transition-transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
              We support everyday operating needs and specialist requirements
              across the divisions shown above.
              </p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
