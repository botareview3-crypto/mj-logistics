import React, { useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useScrollFx } from '../lib/fx';
import { scrollToTarget } from '../lib/useLenis';
import { SplitText, ScrubText } from '../components/fx/SplitText';
import { PageHero } from '../components/fx/PageHero';

/* Oil & gas division added per management feedback (2026-10-15). Scope
   confirmed by the boss (2026-10-16): "Oil and gas is exploration of oil and
   gas." Keep copy neutral — no invented stats, licences, blocks, locations,
   partners or claims — until management supplies more detail. The photo
   reuses an existing site image until dedicated oil & gas photography is
   supplied (swap the `image` paths). */

export default function OilGasPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  useScrollFx(pageRef);

  return (
    <div ref={pageRef} className="overflow-x-clip bg-paper">
      <Head>
        <title>Oil &amp; Gas — MJ Logistics Enterprise</title>
        <meta name="description" content="Oil and gas exploration from MJ Logistics Enterprise." />
      </Head>

      <PageHero
        eyebrow="Oil & gas"
        title={'Exploring for *oil and gas.*'}
        intro="MJ Logistics Enterprise is expanding into the exploration of oil and gas. Get in touch to talk to us about it."
        actions={<>
          <Link href="/contact" className="btn btn-signal">Get in touch <ArrowUpRight className="btn-arrow h-4 w-4" /></Link>
          <button type="button" onClick={() => scrollToTarget('#focus', -80)} className="btn btn-ghost-dark">Our focus <ArrowDownRight className="h-4 w-4" /></button>
        </>}
        image="/images/homepage/industrial.webp"
        imageAlt="Industrial plant and storage tanks"
      />

      {/* ── STATEMENT ────────────────────────────────────────────────────── */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 sm:px-8 lg:grid-cols-[220px_1fr]">
          <p className="eyebrow text-sage">Oil &amp; gas</p>
          <ScrubText
            className="t-lead max-w-[34ch] font-display font-medium"
            text="Oil and gas is our newest division. Its focus is the *exploration* *of* *oil* *and* *gas.*"
          />
        </div>
      </section>

      {/* ── FOCUS ────────────────────────────────────────────────────────── */}
      <section id="focus" className="scroll-mt-24 bg-white pb-24 sm:pb-32">
        <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
          <div data-reveal className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-ink/10">
            <img src="/images/homepage/industrial.webp" alt="Industrial plant and storage tanks" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          </div>
          <div>
            <p className="eyebrow mb-4 text-sage">Our focus</p>
            <SplitText className="t-xl" text={'Oil and gas *exploration.*'} />
            <p className="mt-6 max-w-lg text-[16px] leading-7 text-ink/65">
              Exploration of oil and gas is the focus of this division. It is new, and we are still building out the detail. If you would like to talk to us about oil and gas, get in touch and your enquiry will be passed to the right people.
            </p>
            <Link href="/contact" className="btn btn-signal mt-8">Get in touch <ArrowUpRight className="btn-arrow h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-white px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="relative overflow-hidden rounded-3xl bg-forest">
          <div className="relative grid gap-8 px-6 py-16 text-white sm:px-12 sm:py-24 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
            <SplitText className="t-xl" text={'Talk to us about *oil and gas.*'} />
            <div data-reveal className="flex flex-col gap-5 lg:items-end">
              <p className="max-w-sm text-[16px] leading-7 text-white/85 lg:text-right">
                Send us your enquiry and we will point it to the right people.
              </p>
              <Link href="/contact" className="btn btn-signal">Get in touch <ArrowUpRight className="btn-arrow h-4 w-4" /></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
