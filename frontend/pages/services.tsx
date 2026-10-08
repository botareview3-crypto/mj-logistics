import React, { useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowUpRight, FlaskConical, Workflow } from 'lucide-react';
import { useScrollFx } from '../lib/fx';
import { SERVICES } from '../lib/data/services';
import { SplitText } from '../components/fx/SplitText';
import { PageHero } from '../components/fx/PageHero';

const ICONS = { FlaskConical, Workflow } as const;
const IMAGES: Record<string, { src: string; alt: string }> = {
  'space-logistics-laboratory': { src: '/images/site/laboratory.webp', alt: 'Laboratory workbench with a microscope and analytical equipment' },
  consultancy: { src: '/images/site/consultancy.webp', alt: 'Business team in a planning meeting' },
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

      <PageHero
        eyebrow="Services"
        title={'More ways we supply and *support you.*'}
        intro="Alongside our supply divisions, MJ Logistics Enterprise also provides the services below. Tell us what you need and we will point your enquiry to the right people."
        actions={SERVICES.map((s, i) => (
          <a key={s.id} href={`#${s.id}`} className="btn btn-ghost-dark !h-11 !text-[14px]">
            0{i + 1} — {s.id === 'consultancy' ? 'Consultancy' : 'Space & laboratory'}
          </a>
        ))}
      />

      {SERVICES.map((service, index) => {
        const Icon = ICONS[service.icon];
        const img = IMAGES[service.id];
        const flip = index % 2 === 1;
        return (
          <section key={service.id} id={service.id} className={`scroll-mt-24 py-20 sm:py-28 ${flip ? 'bg-paper' : 'bg-white'}`}>
            <div className={`mx-auto grid max-w-[1440px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20 ${flip ? 'lg:[&>*:first-child]:order-2' : ''}`}>
              <div data-clip className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                {img && <img src={img.src} alt={img.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}
              </div>
              <div>
                <p data-reveal className="eyebrow flex items-center gap-3 text-signal">
                  <Icon className="h-5 w-5" strokeWidth={1.8} /> Service 0{index + 1}
                </p>
                <SplitText className="t-lg mt-5" text={service.title} />
                <p data-reveal className="mt-5 max-w-xl text-[17px] leading-8 text-ink/70">{service.summary}</p>
                <ul className="mt-8 border-t border-ink/10">
                  {service.items.map(item => (
                    <li key={item} data-reveal className="flex items-center gap-4 border-b border-ink/10 py-4 text-[16px] font-medium">
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

      <section className="bg-paper px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="relative overflow-hidden rounded-3xl bg-signal px-6 py-14 text-white sm:px-12 sm:py-20">
          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
            <SplitText className="t-xl" accentClass="text-ink" text={'Not sure which *team you need?*'} />
            <div data-reveal className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/contact" className="btn btn-ink">Contact us <ArrowUpRight className="btn-arrow h-4 w-4" /></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
