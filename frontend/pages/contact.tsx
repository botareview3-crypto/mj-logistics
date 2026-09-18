import React, { useState } from 'react';
import Head from 'next/head';
import { ArrowRight } from 'lucide-react';

const ENQUIRY_OPTIONS = [
  'Request a quote',
  'Bulk or contract supply',
  'Mining division',
  'Existing order',
  'Other',
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white text-[#0d1f3c]">
      <Head>
        <title>Contact MJ Logistics Enterprise</title>
        <meta
          name="description"
          content="Contact MJ Logistics Enterprise for quotes, orders, and supply enquiries."
        />
      </Head>

      <main>
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-[1200px] px-6 pb-14 pt-28 sm:px-10 lg:px-10 lg:pb-20 lg:pt-36">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-[#1e4d8c]">
              MJ Logistics Enterprise
            </p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">Contact us</h1>
            <p className="mt-4 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Send us your question or enquiry.
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto grid max-w-[1200px] gap-14 px-6 sm:px-10 lg:grid-cols-[.7fr_1.3fr] lg:px-10">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#1e4d8c]">
                Get in touch
              </p>
              <div className="mt-8 border-t border-slate-200 pt-7">
                <p className="max-w-sm text-sm leading-7 text-slate-600">
                  Contact details and response information will be added when the official details are available.
                </p>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#1e4d8c]">
                Send an enquiry
              </p>
              <form onSubmit={handleSubmit} className="mt-8 border-t border-slate-200 pt-7">
                <div className="grid gap-5 sm:grid-cols-2">
                  {[
                    ['name', 'Name', 'text'],
                    ['company', 'Company', 'text'],
                    ['email', 'Email', 'email'],
                    ['phone', 'Phone', 'tel'],
                  ].map(([name, label, type]) => (
                    <label key={name} className="block">
                      <span className="text-sm font-bold">{label}</span>
                      <input
                        name={name}
                        type={type}
                        required={name === 'name' || name === 'email'}
                        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-[#0d1f3c] outline-none transition focus:border-[#1e4d8c] focus:ring-2 focus:ring-[#1e4d8c]/15"
                      />
                    </label>
                  ))}
                  <label className="block sm:col-span-2">
                    <span className="text-sm font-bold">Enquiry type</span>
                    <select
                      name="enquiryType"
                      required
                      className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-[#0d1f3c] outline-none transition focus:border-[#1e4d8c] focus:ring-2 focus:ring-[#1e4d8c]/15"
                      defaultValue=""
                    >
                      <option value="" disabled>Select an enquiry type</option>
                      {ENQUIRY_OPTIONS.map(option => <option key={option}>{option}</option>)}
                    </select>
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-sm font-bold">Message</span>
                    <textarea
                      name="message"
                      required
                      rows={6}
                      className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-[#0d1f3c] outline-none transition focus:border-[#1e4d8c] focus:ring-2 focus:ring-[#1e4d8c]/15"
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0d1f3c] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1a3560]"
                >
                  Send enquiry <ArrowRight className="h-4 w-4" />
                </button>
                <p className="mt-3 text-xs text-slate-500">
                  {submitted ? 'This form is ready for connection to the official contact channel.' : 'The submission connection will be added when the official contact details are available.'}
                </p>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
