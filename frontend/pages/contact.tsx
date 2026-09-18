import React from 'react';
import Head from 'next/head';
import { ArrowUpRight, Clock3, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="pb-20">
      <Head>
        <title>Contact MJ Logistics Enterprise</title>
        <meta name="description" content="Contact MJ Logistics Enterprise for product, partnership, and business enquiries." />
      </Head>

      <section className="rounded-3xl bg-[#071a33] px-6 py-16 text-white shadow-xl sm:px-12 sm:py-24">
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-[#55b8ff]">Contact MJ Logistics</p>
        <h1 className="max-w-4xl text-5xl font-black leading-[.95] tracking-[-.06em] sm:text-7xl">
          Let&apos;s make the next move clear.
        </h1>
        <p className="mt-7 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
          Tell us what you need, what you are sourcing, or where you are
          headed. We will direct your enquiry to the right part of the enterprise.
        </p>
      </section>

      <section className="grid gap-5 py-16 sm:grid-cols-3 sm:py-24">
        <a
          href="mailto:info@mjlogisticsenterprise.com"
          className="group rounded-3xl border border-slate-200 bg-white p-7 transition-all hover:-translate-y-1 hover:border-sky-300 hover:shadow-xl"
        >
          <Mail className="h-6 w-6 text-[#0077C7]" />
          <h2 className="mt-10 text-2xl font-black tracking-[-.04em] text-[#071a33]">Email us</h2>
          <p className="mt-3 break-words text-sm leading-7 text-slate-600">info@mjlogisticsenterprise.com</p>
          <ArrowUpRight className="mt-7 h-5 w-5 text-[#0077C7] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </a>

        <div className="rounded-3xl border border-slate-200 bg-white p-7">
          <MapPin className="h-6 w-6 text-[#0077C7]" />
          <h2 className="mt-10 text-2xl font-black tracking-[-.04em] text-[#071a33]">Find us</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">Addis Ababa, Ethiopia</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-7">
          <MessageCircle className="h-6 w-6 text-[#0077C7]" />
          <h2 className="mt-10 text-2xl font-black tracking-[-.04em] text-[#071a33]">What to include</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">Your requirement, timeline, and the best way to reach you.</p>
        </div>
      </section>

      <section className="grid gap-8 rounded-3xl bg-[#f0f4f8] p-7 sm:p-10 lg:grid-cols-[1fr_.8fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#1769aa]">How we can help</p>
          <h2 className="mt-4 text-4xl font-black leading-none tracking-[-.05em] text-[#071a33] sm:text-5xl">
            One message is enough to get started.
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">
            Whether you are looking for a specific vehicle part, setting up an office,
            exploring a business supply request, or discussing a partnership, send us
            the details you already have. We can help clarify the next step.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {['Auto parts & fitment', 'Stationery & equipment', 'Business enquiries', 'Partnership discussions'].map(item => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#071a33]">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-[#071a33] p-7 text-white sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#55b8ff]">Contact details</p>
          <div className="mt-7 space-y-5 text-sm">
            <a href="mailto:info@mjlogisticsenterprise.com" className="flex items-start gap-3 text-white/80 hover:text-white">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#55b8ff]" />
              <span><strong className="block text-white">Email</strong>info@mjlogisticsenterprise.com</span>
            </a>
            <div className="flex items-start gap-3 text-white/80">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#55b8ff]" />
              <span><strong className="block text-white">Location</strong>Addis Ababa, Ethiopia</span>
            </div>
            <div className="flex items-start gap-3 text-white/80">
              <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-[#55b8ff]" />
              <span><strong className="block text-white">Business hours</strong>Monday–Friday · 07:00–20:00</span>
            </div>
            <div className="flex items-start gap-3 text-white/80">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#55b8ff]" />
              <span><strong className="block text-white">Response</strong>We aim to review every serious enquiry promptly.</span>
            </div>
          </div>
          <a
            href="mailto:info@mjlogisticsenterprise.com"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#55b8ff] px-5 py-3 text-sm font-bold text-[#071a33] transition-transform hover:-translate-y-1"
          >
            Send an enquiry <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
