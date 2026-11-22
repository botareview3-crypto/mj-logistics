import React, { useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowUpRight, FlaskConical, Workflow } from 'lucide-react';
import { useScrollFx } from '../lib/fx';
import { SERVICES } from '../lib/data/services';
import { SplitText } from '../components/fx/SplitText';
import { PageHero } from '../components/fx/PageHero';
import { Wrap, CtaBand } from '../components/ui';

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
          <a key={s.id} href={`#${s.id}`} className="btn btn-ghost-dark !h-11 !text-[15px]">
            0{i + 1} — {s.id === 'consultancy' ? 'Consultancy' : 'Space & laboratory'}
          </a>
        ))}
      />

      {SERVICES.map((service, index) => {
        const Icon = ICONS[service.icon];
        const img = IMAGES[service.id];
        const flip = index % 2 === 1;
        return (
          <section key={service.id} id={service.id} className={`scroll-mt-24 border-b border-ink py-20 sm:py-28 ${flip ? 'bg-paper' : 'bg-white'}`}>
            <Wrap className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
              <div className={`lg:col-span-6 ${flip ? 'lg:order-2' : ''}`}>
                <div data-clip className="relative aspect-[4/3] overflow-hidden bg-mist">
                  {img && <img src={img.src} alt={img.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}
                  <span className="absolute left-0 top-0 grid h-14 w-14 place-items-center bg-signal text-ink"><Icon className="h-7 w-7" strokeWidth={1.8} /></span>
                </div>
              </div>
              <div className="lg:col-span-6">
                <p data-reveal className="tag tag-dot">Service 0{index + 1}</p>
                <SplitText className="t-lg mt-5" text={service.title} />
                <p data-reveal className="mt-5 max-w-xl text-[18px] leading-8 text-ink/80">{service.summary}</p>
                <ul className="mt-8 border-t border-ink">
                  {service.items.map((item, n) => (
                    <li key={item} data-reveal className="flex items-baseline gap-4 border-b border-ink/25 py-4 text-[17px] font-semibold">
                      <span className="tag text-azure">{String(n + 1).padStart(2, '0')}</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div data-reveal className="mt-8">
                  <Link href="/contact" className="btn btn-ink">Enquire about this service <ArrowUpRight className="btn-arrow h-4 w-4" /></Link>
                </div>
              </div>
            </Wrap>
          </section>
        );
      })}

      <CtaBand title={'Not sure which *team you need?*'} primary={{ label: 'Contact us', href: '/contact' }} />
    </div>
  );
}
