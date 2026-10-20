import React, { useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight, Globe2, Target, Users } from 'lucide-react';
import { useScrollFx } from '../lib/fx';
import { scrollToTarget } from '../lib/useLenis';
import { SplitText, ScrubText } from '../components/fx/SplitText';
import { PageHero } from '../components/fx/PageHero';

/* Oil & gas division added per management feedback (2026-10-15).
   Confirmed by the boss (2026-10-16): the division is oil and gas
   EXPLORATION, the focus region is LIBERIA, and it is LOOKING FOR INVESTORS.
   Keep copy neutral — no invented stats, returns, licences, blocks, partners
   or claims — until management supplies more detail. The "how exploration
   works" section is a general industry overview and says so on the page.
   Photos: two free Unsplash photos (Unsplash License), hotlinked like the
   catalog images — images.unsplash.com is allowed in next.config.js. Swap for
   real photography when the company has some. */
const HERO_PHOTO = 'https://images.unsplash.com/photo-1786374228080-72d31024e7b5?auto=format&fit=crop&w=2000&q=70';
const HERO_ALT = 'An oil rig in silhouette against a warm orange sky over the ocean';
const BAND_PHOTO = 'https://images.unsplash.com/photo-1648555394313-494797ad48fc?auto=format&fit=crop&w=2000&q=70';
const BAND_ALT = 'A group of oil rigs in the ocean';

const FACTS = [
  { icon: Target, label: 'Focus',       value: 'Oil and gas exploration' },
  { icon: Globe2, label: 'Region',      value: 'Liberia' },
  { icon: Users,  label: 'Looking for', value: 'Investors' },
];

/* General overview of how exploration is carried out — NOT a description of
   MJ's own programme. */
const STAGES = [
  { title: 'Desk study',        text: 'Existing geological and geophysical data is reviewed to decide where to look.' },
  { title: 'Seismic survey',    text: 'Sound pulses are sent into the seabed or ground and the echoes are recorded.' },
  { title: 'Interpretation',    text: 'Specialists turn the echoes into a picture of the rock layers and possible traps.' },
  { title: 'Exploration well',  text: 'A well is drilled to test whether a promising structure actually holds oil or gas.' },
  { title: 'Appraisal',         text: 'If a discovery is made, further work gauges how big it is and whether it can be developed.' },
];

const WAVE_PATH = 'M-80 128 ' + Array.from({ length: 18 }, (_, i) => (i === 0 ? 'q20 -9 40 0' : 't40 0')).join(' ') + ' V175 H-80 Z';

function SurveyDiagram() {
  return (
    <div data-reveal className="overflow-hidden rounded-3xl border border-ink/10 bg-white">
      <style>{`
        .og-wave{animation:og-wave 6s linear infinite}
        .og-bob{animation:og-bob 3.2s ease-in-out infinite}
        .og-pulse{transform-box:fill-box;transform-origin:center;animation:og-pulse 3.6s ease-out infinite}
        .og-glow{animation:og-glow 2.4s ease-in-out infinite}
        @keyframes og-wave{from{transform:translateX(0)}to{transform:translateX(-80px)}}
        @keyframes og-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
        @keyframes og-pulse{0%{transform:scale(.15);opacity:.85}100%{transform:scale(3.4);opacity:0}}
        @keyframes og-glow{0%,100%{opacity:.5}50%{opacity:1}}
        @media (prefers-reduced-motion: reduce){.og-wave,.og-bob,.og-pulse,.og-glow{animation:none}.og-pulse{opacity:.35;transform:scale(1.6)}}
      `}</style>
      <svg viewBox="0 0 600 420" role="img" aria-label="Animated diagram of a seismic survey: a ship sends sound pulses into the seabed to map the rock layers below" className="block h-auto w-full">
        <defs>
          <clipPath id="og-below"><rect x="0" y="150" width="600" height="270" /></clipPath>
        </defs>
        <rect width="600" height="420" fill="#f4f1ea" />
        <rect y="128" width="600" height="292" fill="#cfe3ea" />
        {/* seabed layers */}
        <path d="M0 215 Q150 200 300 218 T600 208 V420 H0Z" fill="#d9e4dc" />
        <path d="M0 270 Q160 252 320 276 T600 262 V420 H0Z" fill="#bfd0c4" />
        <path d="M0 330 Q140 316 300 336 T600 322 V420 H0Z" fill="#9fb8a8" />
        <path d="M0 380 Q180 368 330 386 T600 374 V420 H0Z" fill="#6f9482" />
        {/* possible reservoir */}
        <ellipse className="og-glow" cx="360" cy="300" rx="46" ry="15" fill="#ff6a2e" />
        {/* sound pulses */}
        <g clipPath="url(#og-below)" fill="none" stroke="#04261D" strokeWidth="2">
          {[0, 1.2, 2.4].map(d => (
            <circle key={d} className="og-pulse" cx="300" cy="150" r="60" style={{ animationDelay: `${d}s` }} />
          ))}
        </g>
        {/* waves */}
        <g className="og-wave"><path d={WAVE_PATH} fill="#a9cbd6" opacity=".75" /></g>
        {/* ship */}
        <g className="og-bob">
          <path d="M262 124 H338 L326 146 H274 Z" fill="#04261D" />
          <rect x="296" y="104" width="22" height="20" fill="#0A4A3A" />
          <rect x="302" y="94" width="8" height="10" fill="#0A4A3A" />
          <line x1="280" y1="124" x2="280" y2="106" stroke="#04261D" strokeWidth="3" />
        </g>
        {/* labels */}
        <g fontFamily="inherit" fontSize="13" fill="#04261D">
          <text x="24" y="42" fontWeight="600">Survey vessel</text>
          <line x1="110" y1="38" x2="262" y2="100" stroke="#04261D" strokeOpacity=".35" />
          <text x="24" y="190" fontWeight="600">Sound pulses</text>
          <text x="410" y="304" fontWeight="600">Possible reservoir</text>
          <text x="24" y="406" fill="#fff" fontWeight="600">Rock layers, mapped from the echoes</text>
        </g>
      </svg>
      <p className="border-t border-ink/10 px-5 py-3 text-[12px] leading-5 text-ink/55">
        Simplified illustration of a seismic survey. A general industry overview, not a description of any specific project.
      </p>
    </div>
  );
}

export default function OilGasPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  useScrollFx(pageRef);

  return (
    <div ref={pageRef} className="overflow-x-clip bg-paper">
      <Head>
        <title>Oil &amp; Gas — MJ Logistics Enterprise</title>
        <meta name="description" content="MJ Logistics Enterprise is looking for investors in oil and gas exploration in Liberia." />
      </Head>

      <PageHero
        eyebrow="Oil & gas"
        title={'Invest in *oil and gas exploration.*'}
        intro="MJ Logistics Enterprise is expanding into oil and gas exploration, with a focus on Liberia, and is looking for investors. Get in touch to start the conversation."
        actions={<>
          <Link href="/contact" className="btn btn-signal">Investor enquiries <ArrowUpRight className="btn-arrow h-4 w-4" /></Link>
          <button type="button" onClick={() => scrollToTarget('#focus', -80)} className="btn btn-ghost-dark">Our focus <ArrowDownRight className="h-4 w-4" /></button>
        </>}
        image={HERO_PHOTO}
        imageAlt={HERO_ALT}
      />

      {/* ── STATEMENT ────────────────────────────────────────────────────── */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 sm:px-8 lg:grid-cols-[220px_1fr]">
          <p className="eyebrow text-sage">Oil &amp; gas</p>
          <ScrubText
            className="t-lead max-w-[34ch] font-display font-medium"
            text="Oil and gas is our newest division. We are looking for *investors* *in* *oil* *and* *gas* *exploration* *in* *Liberia.*"
          />
        </div>
      </section>

      {/* ── FOCUS ────────────────────────────────────────────────────────── */}
      <section id="focus" className="scroll-mt-24 bg-white pb-24 sm:pb-32">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <p className="eyebrow mb-4 text-sage">Our focus</p>
            <SplitText className="t-xl" text={'Exploration, *in Liberia.*'} />
            <p className="mt-6 max-w-lg text-[16px] leading-7 text-ink/65">
              Exploration of oil and gas is the focus of this division, and Liberia is the region we are focused on. We are looking for investors to join us. The division is new and we are still building out the detail, so the best next step is a conversation.
            </p>
            <Link href="/contact" className="btn btn-signal mt-8">Investor enquiries <ArrowUpRight className="btn-arrow h-4 w-4" /></Link>
          </div>
          <div className="grid gap-4 self-center">
            {FACTS.map(({ icon: Icon, label, value }, i) => (
              <article key={label} data-reveal data-delay={String(i * 0.1)} className="flex items-center gap-5 rounded-3xl border border-ink/10 bg-paper p-5 sm:p-6">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-signal/10 text-signal"><Icon className="h-6 w-6" /></span>
                <div>
                  <div className="eyebrow text-sage">{label}</div>
                  <div className="font-display text-[clamp(1.3rem,2vw,1.7rem)] font-medium text-ink">{value}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHOTO BAND ───────────────────────────────────────────────────── */}
      <section className="bg-white px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="relative h-[52vh] min-h-[320px] overflow-hidden rounded-3xl">
          <div className="absolute -inset-y-[10%] inset-x-0" data-parallax="0.08">
            <img src={BAND_PHOTO} alt={BAND_ALT} loading="lazy" className="h-full w-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/20 to-transparent" />
          <div className="relative flex h-full items-end p-6 sm:p-12">
            <SplitText className="t-xl max-w-[18ch] text-white" text={'Every discovery starts *with exploration.*'} />
          </div>
        </div>
        <p className="px-2 pt-2 text-right text-[11px] text-ink/45">Photos: Leo_Visions and Ben Wicks on Unsplash</p>
      </section>

      {/* ── HOW EXPLORATION WORKS ────────────────────────────────────────── */}
      <section id="how" className="scroll-mt-24 bg-paper py-24 sm:py-32">
        <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
          <SurveyDiagram />
          <div>
            <p className="eyebrow mb-4 text-sage">How exploration works</p>
            <SplitText className="t-xl" text={'From data *to discovery.*'} />
            <p className="mt-4 max-w-lg text-[14px] leading-6 text-ink/55">A general overview of how oil and gas exploration is carried out in the industry.</p>
            <ol className="mt-8 space-y-5">
              {STAGES.map((s, i) => (
                <li key={s.title} data-reveal data-delay={String(i * 0.08)} className="flex gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-forest font-display text-sm font-semibold text-white">{i + 1}</span>
                  <div>
                    <h3 className="text-[clamp(1.1rem,1.5vw,1.3rem)]">{s.title}</h3>
                    <p className="mt-1 max-w-md text-[15px] leading-6 text-ink/65">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}
