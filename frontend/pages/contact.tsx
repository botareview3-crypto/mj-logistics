import React, { useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { useScrollFx } from '../lib/fx';
import { SplitText } from '../components/fx/SplitText';
import { PageHero } from '../components/fx/PageHero';
import { Wrap } from '../components/ui';

const ENQUIRY_OPTIONS = [
  'Request a quote',
  'Bulk or contract supply',
  'Mining division',
  'Laboratory equipment or space logistics',
  'Solar energy systems',
  'Oil & gas',
  'Consultancy',
  'Existing order',
  'Other',
];

const FIELDS: [name: string, label: string, type: string, required: boolean][] = [
  ['name', 'Your name', 'text', true],
  ['company', 'Company', 'text', false],
  ['email', 'Email', 'email', true],
  ['phone', 'Phone', 'tel', false],
];

const ROUTES = [
  { title: 'Auto parts', text: 'Prefer to browse? Every part lists its fitment and OEM references.', href: '/shop', cta: 'Shop parts' },
  { title: 'Mining', text: 'Partnership, supply or investment enquiries for MJ Mining.', href: '/mining', cta: 'MJ Mining' },
  { title: 'Solar', text: 'Solar energy systems and equipment, supplied to order.', href: '/solar', cta: 'Solar energy' },
  { title: 'Oil & gas', text: 'Investor enquiries for oil and gas exploration in Liberia.', href: '/oil-gas', cta: 'Oil & gas' },
  { title: 'Services', text: 'Space logistics, laboratory equipment, and supply chain or project management consultancy.', href: '/services', cta: 'Our services' },
];

const inputClass = 'mt-2 h-12 w-full border border-ink/40 bg-white px-4 text-[17px] text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-signal';

export default function ContactPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [topic, setTopic] = useState(ENQUIRY_OPTIONS[0]);
  useScrollFx(pageRef);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div ref={pageRef} className="overflow-x-clip bg-paper">
      <Head>
        <title>Contact MJ Logistics Enterprise</title>
        <meta name="description" content="Contact MJ Logistics Enterprise for quotes, orders, and supply enquiries." />
      </Head>

      <PageHero
        eyebrow="Contact"
        title={'Let’s *talk.*'}
        intro="Send us your question or enquiry — a part you can’t find, a bulk order, or a wider supply requirement. Tell us what you need and we’ll point it to the right team."
      />

      <section className="bg-white py-16 sm:py-24">
        <Wrap className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <aside data-reveal className="border border-ink bg-paper p-6 lg:col-span-4 lg:self-start">
            <p className="tag tag-dot mb-4">Get in touch</p>
            <p className="text-[17px] leading-7 text-ink/80">Contact details and response information will be added when the official details are available.</p>
          </aside>

          <form data-reveal onSubmit={handleSubmit} className="border border-ink bg-white p-6 sm:p-10 lg:col-span-8">
            <fieldset>
              <legend className="tag tag-dot mb-4">What can we help with?</legend>
              <div className="flex flex-wrap gap-2">
                {ENQUIRY_OPTIONS.map(option => (
                  <label
                    key={option}
                    className={`cursor-pointer border px-4 py-2.5 text-[15px] font-semibold transition-colors ${
                      topic === option ? 'border-ink bg-ink text-white' : 'border-ink/40 hover:border-ink hover:bg-signal'
                    }`}
                  >
                    <input type="radio" name="enquiryType" value={option} checked={topic === option} onChange={() => setTopic(option)} className="sr-only" />
                    {option}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {FIELDS.map(([name, label, type, required]) => (
                <label key={name} className="block">
                  <span className="text-[16px] font-bold">{label}{required ? ' *' : ''}</span>
                  <input name={name} type={type} required={required} className={inputClass} />
                </label>
              ))}
              <label className="block sm:col-span-2">
                <span className="text-[16px] font-bold">Message *</span>
                <textarea name="message" required rows={5} className={`${inputClass} h-auto resize-y py-3`} />
              </label>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button type="submit" className="btn btn-signal">
                {submitted ? <>Received <Check className="h-4 w-4" /></> : <>Send enquiry <ArrowUpRight className="btn-arrow h-4 w-4" /></>}
              </button>
              <p className="max-w-xs text-[14px] leading-5 text-ink/65">
                {submitted ? 'This form is ready for connection to the official contact channel.' : 'The submission connection will be added when the official contact details are available.'}
              </p>
            </div>
          </form>
        </Wrap>
      </section>

      <section className="bg-paper py-20 sm:py-28">
        <Wrap>
          <div className="border-t border-ink py-4"><p className="tag tag-dot">Or go straight there</p></div>
          <SplitText className="t-xl mb-12 mt-6" text={'Know what you *need already?*'} />
          <div className="grid border-l border-t border-ink sm:grid-cols-2 lg:grid-cols-5">
            {ROUTES.map((r, i) => (
              <Link
                key={r.href}
                href={r.href}
                data-reveal
                data-delay={String(i * 0.06)}
                className="group flex min-h-[240px] flex-col justify-between border-b border-r border-ink bg-paper p-6 transition-colors hover:bg-signal"
              >
                <div>
                  <p className="tag text-ink/55 group-hover:text-ink">{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="mt-4 text-[26px]">{r.title}</h3>
                  <p className="mt-3 text-[16px] leading-7 text-ink/80">{r.text}</p>
                </div>
                <span className="mt-6 flex items-center justify-between font-bold">{r.cta} <ArrowUpRight className="h-5 w-5" /></span>
              </Link>
            ))}
          </div>
        </Wrap>
      </section>
    </div>
  );
}
