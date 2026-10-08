import React, { useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { useScrollFx } from '../lib/fx';
import { SplitText } from '../components/fx/SplitText';

const ENQUIRY_OPTIONS = [
  'Request a quote',
  'Bulk or contract supply',
  'Mining division',
  'Solar energy',
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
  { title: 'Solar', text: 'Panels, inverters and storage matched into one system.', href: '/solar', cta: 'MJ Solar' },
];

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

      {/* ── HERO + FORM ──────────────────────────────────────────────────── */}
      <section data-hero="dark" className="grain relative bg-ink pb-24 pt-40 text-paper sm:pt-48">
        <div className="mx-auto grid max-w-[1440px] gap-16 px-5 sm:px-8 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <p data-reveal data-intro="0.05" className="eyebrow mb-8 flex items-center gap-3 text-mint">
              <span className="h-px w-10 bg-signal" /> Contact
            </p>
            <SplitText as="h1" intro={0.1} className="t-hero font-extrabold" text={'Let’s\n*talk.*'} />
            <p data-reveal data-intro="0.5" className="mt-8 max-w-md text-[17px] leading-8 text-paper/70">
              Send us your question or enquiry — a part you can’t find, a bulk order, or a wider supply
              requirement. Tell us what you need and we’ll point it to the right team.
            </p>
            <div data-reveal data-intro="0.65" className="mt-10 hidden max-w-md border-t border-paper/15 pt-6 text-sm leading-7 text-paper/50 lg:block">
              Contact details and response information will be added when the official details are available.
            </div>
          </div>

          <form data-reveal data-intro="0.35" onSubmit={handleSubmit} className="rounded-[28px] bg-paper p-6 text-ink sm:p-10">
            <fieldset>
              <legend className="eyebrow mb-4 text-sage">What can we help with?</legend>
              <div className="flex flex-wrap gap-2">
                {ENQUIRY_OPTIONS.map(option => (
                  <label
                    key={option}
                    className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      topic === option ? 'border-ink bg-ink text-paper' : 'border-ink/20 hover:border-ink'
                    }`}
                  >
                    <input type="radio" name="enquiryType" value={option} checked={topic === option} onChange={() => setTopic(option)} className="sr-only" />
                    {option}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-8 grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {FIELDS.map(([name, label, type, required]) => (
                <label key={name} className="group relative block pt-6">
                  <input
                    name={name}
                    type={type}
                    required={required}
                    placeholder=" "
                    className="peer h-12 w-full border-b border-ink/20 bg-transparent text-[16px] outline-none transition-colors focus:border-transparent"
                  />
                  <span className="pointer-events-none absolute left-0 top-9 text-[15px] text-ink/50 transition-all duration-300 peer-focus:top-1 peer-focus:text-xs peer-focus:text-signal peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs">
                    {label}{required ? ' *' : ''}
                  </span>
                  <span className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-signal transition-transform duration-500 peer-focus:scale-x-100" />
                </label>
              ))}
              <label className="relative block pt-6 sm:col-span-2">
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder=" "
                  className="peer w-full resize-y border-b border-ink/20 bg-transparent pt-3 text-[16px] outline-none transition-colors focus:border-transparent"
                />
                <span className="pointer-events-none absolute left-0 top-9 text-[15px] text-ink/50 transition-all duration-300 peer-focus:top-1 peer-focus:text-xs peer-focus:text-signal peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs">
                  Message *
                </span>
                <span className="absolute bottom-1.5 left-0 h-[2px] w-full origin-left scale-x-0 bg-signal transition-transform duration-500 peer-focus:scale-x-100" />
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
      <section className="bg-paper py-24 sm:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <p className="eyebrow mb-5 text-sage">Or go straight there</p>
          <SplitText className="t-xl mb-14 font-extrabold" text={'Know what you\n*need already?*'} />
          <div className="grid gap-4 md:grid-cols-3">
            {ROUTES.map((r, i) => (
              <Link
                key={r.href}
                href={r.href}
                data-reveal
                data-delay={String(i * 0.08)}
                className="group relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-[28px] border border-ink/10 bg-white p-7 transition-colors duration-500 hover:border-forest"
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-forest transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-y-100" />
                <div className="relative transition-colors duration-500 group-hover:text-paper">
                  <h3 className="text-3xl">{r.title}</h3>
                  <p className="mt-3 max-w-xs text-[15px] leading-7 opacity-70">{r.text}</p>
                </div>
                <span className="relative flex items-center justify-between font-semibold transition-colors duration-500 group-hover:text-paper">
                  {r.cta}
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-signal text-white transition-transform duration-500 group-hover:rotate-45"><ArrowUpRight className="h-4 w-4" /></span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
