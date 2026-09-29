import React from 'react';
import Head from 'next/head';
import { ArrowRight, Sun } from 'lucide-react';
import { useApp } from '../lib/AppContext';

const SUPPLY = [
  {
    id: 'systems',
    title: 'Solar energy systems',
    text: 'We supply solar energy systems, sourced to suit the requirements of each client.',
  },
  {
    id: 'equipment',
    title: 'Solar equipment supply',
    text: 'We supply the equipment that goes with solar energy systems, sourced to order.',
  },
];

export default function SolarPage() {
  const { navigate } = useApp();

  return (
    <div className="min-h-screen bg-white text-[#0d1f3c]">
      <Head>
        <title>Solar Energy — MJ Logistics Enterprise</title>
        <meta
          name="description"
          content="Solar energy system and equipment supply from MJ Logistics Enterprise."
        />
      </Head>

      <main>
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-[1200px] px-6 pb-14 pt-28 sm:px-10 lg:px-10 lg:pb-20 lg:pt-36">
            <div className="max-w-2xl">
              <Sun className="mb-5 h-7 w-7 text-[#1e4d8c]" strokeWidth={1.8} />
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-[#1e4d8c]">
                Solar Energy
              </p>
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
                Solar energy system and equipment supply.
              </h1>
              <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">
                MJ Logistics Enterprise supplies solar energy systems and
                equipment. Tell us what you need and we will source it for you.
              </p>
              <button
                type="button"
                onClick={() => navigate('/contact')}
                className="group mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#1e4d8c] cursor-pointer"
              >
                Request a quote
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-[1200px] px-6 sm:px-10 lg:px-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#1e4d8c]">
              What we supply
            </p>
            <div className="mt-8 grid gap-10 border-t border-slate-200 pt-8 md:grid-cols-2 md:gap-8">
              {SUPPLY.map(({ id, title, text }, index) => (
                <div key={id} id={id} className="scroll-mt-24">
                  <span className="text-xs font-bold text-slate-400">0{index + 1}</span>
                  <h2 className="mt-3 text-2xl font-bold">{title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
