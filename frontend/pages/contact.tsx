import React, { useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { useScrollFx } from '../lib/fx';
import { SplitText } from '../components/fx/SplitText';
import { PageHero } from '../components/fx/PageHero';

const ENQUIRY_OPTIONS = [
  'Request a quote',
  'Bulk or contract supply',
  'Mining division',
  'Laboratory equipment or space logistics',
  'Solar energy systems',
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
  { title: 'Services', text: 'Space logistics, laboratory equipment, and supply chain or project management consultancy.', href: '/services', cta: 'Our services' },
];

const inputClass = 'mt-2 h-12 w-full rounded-xl border border-ink/15 bg-white px-4 text-[16px] text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15';

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

      {/* ── FORM ─────────────────────────────────────────────────────────── */}
      <section className="bg-paper pb-24">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 sm:px-8 lg:grid-cols-[.7fr_1.3fr]">
          <div data-reveal className="rounded-3xl border border-ink/10 bg-white p-7 text-[15px] leading-7 text-ink/65 lg:self-start">
            <p className="eyebrow mb-3 text-sage">Get in touch</p>
            Contact details and response information will be added when the official details are available.
          </div>

          <form data-reveal onSubmit={handleSubmit} className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-10">
            <fieldset>
              <legend className="eyebrow mb-4 text-sage">What can we help with?</legend>
              <div className="flex flex-wrap gap-2">
                {ENQUIRY_OPTIONS.map(option => (
                  <label
                    key={option}
                    className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      topic === option ? 'border-forest bg-forest text-white' : 'border-ink/15 hover:border-forest'
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
                  <span className="text-sm font-semibold">{label}{required ? ' *' : ''}</span>
                  <input name={name} type={type} required={required} className={inputClass} />
                </label>
              ))}
              <label className="block sm:col-span-2">
                <span className="text-sm font-semibold">Message *</span>
                <textarea name="message" required rows={5} className={`${inputClass} h-auto resize-y py-3`} />
              </label>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button type="submit" className="btn btn-signal">
                {submitted ? <>Received <Check className="h-4 w-4" /></> : <>Send enquiry <ArrowUpRight className="btn-arrow h-4 w-4" /></>}
              </button>
              <p className="max-w-xs text-xs leading-5 text-ink/50">
                {submitted ? 'This form is ready for connection to the official contact channel.' : 'The submission connection will be added when the official contact details are available.'}
              </p>
            </div>
          </form>
        </div>
      </section>

      {/* ── ROUTES ───────────────────────────────────────────────────────── */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <p className="eyebrow mb-4 text-sage">Or go straight there</p>
          <SplitText className="t-xl mb-12" text={'Know what you *need already?*'} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ROUTES.map((r, i) => (
              <Link
                key={r.href}
                href={r.href}
                data-reveal
                data-delay={String(i * 0.06)}
                className="group flex min-h-[220px] flex-col justify-between rounded-3xl border border-ink/10 bg-paper p-7 transition-colors hover:border-forest"
              >
                <div>
                  <h3 className="text-2xl">{r.title}</h3>
                  <p className="mt-3 text-[15px] leading-7 text-ink/65">{r.text}</p>
                </div>
                <span className="mt-6 flex items-center justify-between font-semibold text-forest group-hover:text-signal">
                  {r.cta} <ArrowUpRight className="h-5 w-5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
