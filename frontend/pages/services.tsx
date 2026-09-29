import React from 'react';
import Head from 'next/head';
import { ArrowRight, FlaskConical, Workflow } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { SERVICES } from '../lib/data/services';

const ICONS = {
  FlaskConical,
  Workflow,
} as const;

export default function ServicesPage() {
  const { navigate } = useApp();

  return (
    <div className="min-h-screen bg-white text-[#0d1f3c]">
      <Head>
        <title>Services — MJ Logistics Enterprise</title>
        <meta
          name="description"
          content="Space logistics, laboratory equipment supply and services, and supply chain and project management consultancy from MJ Logistics Enterprise."
        />
      </Head>

      <main>
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-[1200px] px-6 pb-14 pt-28 sm:px-10 lg:px-10 lg:pb-20 lg:pt-36">
            <div className="max-w-2xl">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-[#1e4d8c]">
                Services
              </p>
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
                More ways we can supply and support your business.
              </h1>
              <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">
                Alongside our supply divisions, MJ Logistics Enterprise also
                provides the services below. Tell us what you
                need and we will point your enquiry to the right people.
              </p>
            </div>
          </div>
        </section>

        {SERVICES.map((service, index) => {
          const Icon = ICONS[service.icon];
          return (
            <section
              key={service.id}
              id={service.id}
              className={`scroll-mt-24 py-16 sm:py-20 ${
                index % 2 === 1 ? 'border-y border-slate-200 bg-[#f0f4f8]' : 'bg-white'
              }`}
            >
              <div className="mx-auto grid max-w-[1200px] gap-10 px-6 sm:px-10 lg:grid-cols-[.75fr_1.25fr] lg:px-10">
                <div>
                  <div className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-[#1e4d8c]" strokeWidth={1.8} />
                    <span className="text-xs font-bold text-slate-400">0{index + 1}</span>
                  </div>
                  <h2 className="mt-4 text-3xl font-bold sm:text-4xl">{service.title}</h2>
                </div>
                <div>
                  <p className="text-base leading-8 text-slate-600">{service.summary}</p>
                  <ul className="mt-6 divide-y divide-slate-300 border-y border-slate-300">
                    {service.items.map((item) => (
                      <li key={item} className="py-3 text-[15px] font-semibold">
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => navigate('/contact')}
                    className="group mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#1e4d8c] cursor-pointer"
                  >
                    Enquire about this service
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
