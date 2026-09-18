import React from 'react';
import Head from 'next/head';
import { ArrowRight, Clock3, Mail, MapPin } from 'lucide-react';

const ENQUIRY_TYPES = [
  ['Auto parts', 'Vehicle details, part numbers, fitment, or availability.'],
  ['Office supplies', 'Stationery, printing supplies, furniture, and equipment.'],
  ['Business enquiries', 'Recurring supply, sourcing, or operational requirements.'],
  ['Partnerships', 'A conversation about working together with MJ Logistics.'],
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f0f4f8] text-[#0d1f3c]">
      <Head>
        <title>Contact MJ Logistics Enterprise</title>
        <meta
          name="description"
          content="Contact MJ Logistics Enterprise for auto parts, office supplies, business enquiries, and partnerships."
        />
      </Head>

      <main>
        <section className="bg-[#0d1f3c] text-white">
          <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-6 pb-16 pt-28 sm:px-10 lg:grid-cols-[1fr_.9fr] lg:gap-16 lg:px-10 lg:pb-24 lg:pt-36">
            <div>
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-white/60">
                Contact MJ Logistics
              </p>
              <h1 className="max-w-xl text-4xl font-bold leading-tight sm:text-5xl">
                Let&apos;s find the right way forward.
              </h1>
              <p className="mt-6 max-w-lg text-[15px] leading-7 text-white/75">
                Tell us what you need and our team will help direct your enquiry
                to the right part of MJ Logistics Enterprise.
              </p>
              <a
                href="mailto:info@mjlogisticsenterprise.com"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#0d1f3c] transition hover:bg-slate-100"
              >
                Email our team <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="overflow-hidden rounded-2xl bg-white/10">
              <img
                src="/homepage/office.webp"
                alt="MJ Logistics workplace supplies"
                className="h-[280px] w-full object-cover sm:h-[340px]"
              />
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto grid max-w-[1200px] gap-10 px-6 sm:px-10 lg:grid-cols-[.8fr_1.2fr] lg:px-10">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#1e4d8c]">
                How can we help?
              </p>
              <h2 className="mt-3 max-w-md text-3xl font-bold leading-tight sm:text-4xl">
                Start with what you know.
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
                You do not need every detail ready. A short description and your timeline are a good place to begin.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {ENQUIRY_TYPES.map(([title, text]) => (
                <div key={title} className="rounded-xl bg-[#f0f4f8] p-5">
                  <h3 className="font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-[1200px] px-6 sm:px-10 lg:px-10">
            <div className="rounded-2xl bg-[#e8a020] p-7 sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-12">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#6d4b0b]">
                  Direct contact
                </p>
                <h2 className="mt-3 text-3xl font-bold leading-tight text-[#0d1f3c] sm:text-4xl">
                  One clear place to start.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-6 text-[#6d4b0b]">
                  Send your requirement by email and include product names, vehicle details, quantities, or any relevant timeline.
                </p>
              </div>
              <div className="mt-8 min-w-[280px] border-t border-[#b77b14] pt-2 lg:mt-0">
                <a
                  href="mailto:info@mjlogisticsenterprise.com"
                  className="flex items-center justify-between gap-4 border-b border-[#b77b14] py-4 text-sm font-bold text-[#0d1f3c]"
                >
                  <span className="flex items-center gap-3"><Mail className="h-5 w-5" /> info@mjlogisticsenterprise.com</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
                <div className="flex items-center gap-3 border-b border-[#b77b14] py-4 text-sm text-[#0d1f3c]">
                  <MapPin className="h-5 w-5" /> Addis Ababa, Ethiopia
                </div>
                <div className="flex items-center gap-3 py-4 text-sm text-[#0d1f3c]">
                  <Clock3 className="h-5 w-5" /> Monday–Friday · 07:00–20:00
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-14">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-6 sm:px-10 lg:px-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400">Before you send</p>
            <p className="text-lg leading-8 text-slate-600">
              Include the product or service you need, relevant quantities, vehicle make and model where applicable, and when you need a response.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
