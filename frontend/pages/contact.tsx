import React from 'react';
import Head from 'next/head';
import { ArrowDownRight, ArrowUpRight, Clock3, Mail, MapPin, MessageCircle } from 'lucide-react';

const ENQUIRY_TYPES = [
  ['01', 'Auto parts & fitment', 'Help identifying the right part for a vehicle, system, or OEM number.'],
  ['02', 'Office supplies', 'Stationery, printing supplies, and equipment for a working team.'],
  ['03', 'Business enquiries', 'A larger requirement, recurring supply need, or operational question.'],
  ['04', 'Partnerships', 'A conversation about working together across one of our divisions.'],
];

export default function ContactPage() {
  return (
    <div className="overflow-hidden bg-[#f5f4ef] text-[#10221d]">
      <Head>
        <title>Contact MJ Logistics | Start a conversation</title>
        <meta name="description" content="Contact MJ Logistics Enterprise for parts, workplace supplies, business enquiries, and partnerships." />
      </Head>

      <main>
        <section className="relative min-h-[650px] bg-[#10221d] text-[#f5f4ef]">
          <div className="absolute inset-0">
            <img src="/homepage/office.webp" alt="MJ Logistics workplace operations" className="h-full w-full object-cover opacity-35" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,34,29,.98)_0%,rgba(16,34,29,.78)_45%,rgba(16,34,29,.22)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(16,34,29,.9)_0%,transparent_60%)]" />
          </div>
          <div className="relative mx-auto flex min-h-[650px] max-w-[1320px] flex-col justify-between px-6 pb-12 pt-20 sm:px-10 lg:px-16">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.38em] text-[#d8b46a]">Contact MJ Logistics</p>
              <span className="text-xs uppercase tracking-[0.2em] text-white/50">We are listening</span>
            </div>
            <div className="max-w-4xl">
              <p className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-[#d8b46a]">
                <span className="h-px w-10 bg-[#d8b46a]" /> The next step starts here
              </p>
              <h1 className="max-w-4xl text-6xl font-semibold leading-[.9] tracking-[-.065em] sm:text-8xl lg:text-[8.5rem]">
                Bring us<br />the question.
              </h1>
              <p className="mt-8 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
                Tell us what you need, what you are sourcing, or where you want to go.
                We will help make the next move clear.
              </p>
              <a href="#enquiry" className="mt-10 inline-flex items-center gap-3 border-b border-[#d8b46a] pb-3 text-sm font-semibold">
                Find the right channel <ArrowDownRight className="h-4 w-4 text-[#d8b46a]" />
              </a>
            </div>
          </div>
        </section>

        <section id="enquiry" className="mx-auto max-w-[1320px] px-6 py-24 sm:px-10 lg:px-16 lg:py-36">
          <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#9b7430]">Choose your route</p>
              <h2 className="mt-6 max-w-md text-5xl font-semibold leading-[.92] tracking-[-.06em] sm:text-7xl">A good enquiry has a clear beginning.</h2>
              <p className="mt-7 max-w-sm text-sm leading-7 text-[#63716b]">
                You do not need to have every detail ready. Start with what you know
                and include your timeline if you have one.
              </p>
            </div>
            <div className="divide-y divide-[#d9d8d0] border-y border-[#d9d8d0]">
              {ENQUIRY_TYPES.map(([number, title, text]) => (
                <div key={number} className="grid gap-5 py-7 sm:grid-cols-[55px_1fr]">
                  <span className="text-sm font-semibold text-[#9b7430]">{number}</span>
                  <div>
                    <h3 className="text-2xl font-semibold tracking-[-.04em]">{title}</h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-[#63716b]">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#d8b46a] px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
          <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[1fr_.8fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#5d451d]">Direct contact</p>
              <h2 className="mt-6 max-w-3xl text-5xl font-semibold leading-[.9] tracking-[-.065em] text-[#10221d] sm:text-8xl">
                No complicated form. Just a clear starting point.
              </h2>
              <p className="mt-7 max-w-xl text-base leading-7 text-[#5d451d]">
                Send a short email with your requirement and our team can direct it
                to the right part of MJ Logistics Enterprise.
              </p>
            </div>
            <div className="border-t border-[#9b7430] pt-6 text-[#10221d]">
              <a href="mailto:info@mjlogisticsenterprise.com" className="group flex items-center justify-between border-b border-[#9b7430] py-5 text-sm font-semibold">
                <span className="flex items-center gap-3"><Mail className="h-5 w-5" /> info@mjlogisticsenterprise.com</span>
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
              <div className="flex items-center gap-3 border-b border-[#9b7430] py-5 text-sm">
                <MapPin className="h-5 w-5" /> Addis Ababa, Ethiopia
              </div>
              <div className="flex items-center gap-3 border-b border-[#9b7430] py-5 text-sm">
                <Clock3 className="h-5 w-5" /> Monday–Friday · 07:00–20:00
              </div>
              <a href="mailto:info@mjlogisticsenterprise.com" className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#10221d] px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-1">
                Send an enquiry <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto flex max-w-[1320px] items-center justify-between gap-8 px-6 py-20 sm:px-10 lg:px-16">
          <div>
            <MessageCircle className="h-7 w-7 text-[#9b7430]" />
            <h2 className="mt-5 text-3xl font-semibold tracking-[-.05em] sm:text-5xl">The more context, the better.</h2>
          </div>
          <p className="hidden max-w-sm text-sm leading-6 text-[#63716b] sm:block">
            Include product names, vehicle details, quantities, or the kind of partnership you are considering.
          </p>
        </section>
      </main>
    </div>
  );
}
