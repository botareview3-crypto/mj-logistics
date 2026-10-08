import React, { useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowUpRight, FlaskConical, Workflow } from 'lucide-react';
import { useScrollFx } from '../lib/fx';
import { SERVICES } from '../lib/data/services';
import { SplitText } from '../components/fx/SplitText';
import { Magnetic } from '../components/fx/Magnetic';

const ICONS = { FlaskConical, Workflow } as const;
const IMAGES: Record<string, string> = {
  'space-logistics-laboratory': '/images/site/warehouse-racks.webp',
  consultancy: '/images/homepage/industrial.webp',
};

export default function ServicesPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  useScrollFx(pageRef);

  return (
    <div ref={pageRef} className="overflow-x-clip bg-paper">
      <Head>
        <title>Services — MJ Logistics Enterprise</title>
        <meta
          name="description"
          content="Space logistics, laboratory equipment supply and services, and supply chain and project management consultancy from MJ Logistics Enterprise."
        />
      </Head>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section data-hero="dark" className="grain relative overflow-hidden bg-ink pb-20 pt-40 text-paper sm:pb-28 sm:pt-48">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <p data-reveal data-intro="0.05" className="eyebrow mb-8 flex items-center gap-3 text-mint">
            <span className="h-px w-10 bg-signal" /> Services
          </p>
          <SplitText as="h1" intro={0.1} className="t-hero max-w-[18ch] font-extrabold" text={'More ways we supply\nand *support you.*'} />
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <p data-reveal data-intro="0.5" className="max-w-xl text-[17px] leading-8 text-paper/70">
              Alongside our supply divisions, MJ Logistics Enterprise also provides the services below.
              Tell us what you need and we will point your enquiry to the right people.
            </p>
            <div data-reveal data-intro="0.65" className="flex flex-wrap gap-3">
              {SERVICES.map((s, i) => (
                <a key={s.id} href={`#${s.id}`} className="btn btn-ghost !h-11 !text-[14px]">0{i + 1} — {s.id === 'consultancy' ? 'Consultancy' : 'Space & laboratory'}</a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICE LINES ────────────────────────────────────────────────── */}
      {SERVICES.map((service, index) => {
        const Icon = ICONS[service.icon];
        const flip = index % 2 === 1;
        return (
          <section key={service.id} id={service.id} className={`scroll-mt-24 py-24 sm:py-32 ${flip ? 'bg-bone/60' : 'bg-paper'}`}>
            <div className={`mx-auto grid max-w-[1440px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20 ${flip ? 'lg:[&>*:first-child]:order-2' : ''}`}>
              <div data-clip className="relative aspect-[4/3] overflow-hidden rounded-[28px]">
                <div className="absolute -inset-y-[12%] inset-x-0" data-parallax="0.08">
                  <img src={IMAGES[service.id]} alt="" loading="lazy" className="h-full w-full object-cover" />
                </div>
                <span className="absolute left-6 top-6 grid h-14 w-14 place-items-center rounded-2xl bg-paper text-signal">
                  <Icon className="h-6 w-6" strokeWidth={1.8} />
                </span>
              </div>
              <div>
                <p data-reveal className="eyebrow text-signal">Service 0{index + 1}</p>
                <SplitText className="t-lg mt-6 font-extrabold" text={service.title} />
                <p data-reveal className="mt-6 max-w-xl text-[17px] leading-8 text-ink/70">{service.summary}</p>
                <ul className="mt-8 border-t border-ink/15">
                  {service.items.map((item, i) => (
                    <li key={item} data-reveal data-delay={String(i * 0.06)} className="flex items-center gap-4 border-b border-ink/15 py-4 text-[16px] font-semibold">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-signal" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div data-reveal className="mt-8">
                  <Link href="/contact" className="btn btn-ink">Enquire about this service <ArrowUpRight className="btn-arrow h-4 w-4" /></Link>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-paper px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="relative overflow-hidden rounded-[32px] bg-signal px-6 py-16 text-white sm:px-12 sm:py-24">
          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
            <SplitText className="t-xl font-extrabold" accentClass="text-ink" text={'Not sure which\n*team you need?*'} />
            <div data-reveal className="flex flex-wrap gap-3 lg:justify-end">
              <Magnetic>
                <Link href="/contact" className="btn btn-ink">Contact us <ArrowUpRight className="btn-arrow h-4 w-4" /></Link>
              </Magnetic>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
