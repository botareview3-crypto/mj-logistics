import React from 'react';
import Head from 'next/head';
import { ArrowUpRight, Mail, MapPin, MessageCircle } from 'lucide-react';

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
    </div>
  );
}
