import React from 'react';
import Head from 'next/head';
import { motion, useReducedMotion, type Transition } from 'motion/react';
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronRight,
  CircleArrowOutUpRight,
  Factory,
  Gem,
  Menu,
  ShieldCheck,
  Truck,
  Wrench,
} from 'lucide-react';
import { useApp } from '../lib/AppContext';

const IMAGE_URLS = {
  hero: 'https://images.unsplash.com/photo-1487754180451-c456f71a1f72?auto=format&fit=crop&w=2200&q=85',
  parts: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1400&q=85',
  industry: 'https://images.unsplash.com/photo-1565610222536-ef125c59da2e?auto=format&fit=crop&w=1400&q=85',
  mining: 'https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&w=1400&q=85',
  detail: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1800&q=85',
};

const SOLUTIONS = [
  {
    title: 'Auto Parts',
    eyebrow: 'Parts marketplace',
    description: 'Find dependable parts with vehicle fitment at the centre of every search.',
    image: IMAGE_URLS.parts,
    icon: Wrench,
    href: '/shop',
    action: 'Shop parts',
  },
  {
    title: 'Industrial Supply',
    eyebrow: 'Business equipment',
    description: 'Practical equipment and sourcing support for workshops and growing operations.',
    image: IMAGE_URLS.industry,
    icon: Factory,
    href: '/catalog',
    action: 'Explore equipment',
  },
  {
    title: 'MJ Mining',
    eyebrow: 'Natural resources',
    description: 'A focused mining operation built around long-term partnerships and opportunity.',
    image: IMAGE_URLS.mining,
    icon: Gem,
    href: '/mining',
    action: 'Discover mining',
  },
];

const REVEAL = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0 },
};
const REVEAL_TRANSITION: Transition = {
  duration: 0.7,
  ease: [0.22, 1, 0.36, 1],
};

export default function LandingPage() {
  const { navigate } = useApp();
  const reduceMotion = useReducedMotion();

  const revealProps = (delay = 0) => ({
    variants: REVEAL,
    initial: reduceMotion ? 'visible' : 'hidden',
    whileInView: 'visible',
    viewport: { once: true, amount: 0.2 },
    transition: { ...REVEAL_TRANSITION, delay },
  });

  return (
    <div className="overflow-hidden bg-[#f4f6f3] text-[#10211b]">
      <Head>
        <title>MJ Logistics Enterprise | Built for the road ahead</title>
        <meta
          name="description"
          content="MJ Logistics Enterprise connects automotive, industrial, and mining opportunities through dependable service."
        />
      </Head>

      <section className="relative min-h-[720px] bg-[#10211b] text-white lg:min-h-[810px]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url(${IMAGE_URLS.hero})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#10211b] via-[#10211b]/80 to-[#10211b]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#10211b] via-transparent to-[#10211b]/20" />

        <div className="relative mx-auto flex min-h-[720px] max-w-7xl flex-col justify-between px-5 py-10 sm:px-8 lg:min-h-[810px] lg:px-12">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="group flex items-center gap-3 text-left"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d6f36a] text-[#10211b] transition-transform duration-300 group-hover:rotate-12">
                <Wrench className="h-5 w-5 -rotate-12" />
              </span>
              <span className="text-sm font-bold uppercase tracking-[0.18em]">
                MJ Logistics
                <span className="block text-[10px] font-medium tracking-[0.3em] text-white/60">Enterprise</span>
              </span>
            </button>
            <div className="hidden items-center gap-8 text-sm font-medium text-white/75 lg:flex">
              <button type="button" onClick={() => navigate('/shop')} className="transition-colors hover:text-[#d6f36a]">Marketplace</button>
              <button type="button" onClick={() => navigate('/mining')} className="transition-colors hover:text-[#d6f36a]">MJ Mining</button>
              <button type="button" onClick={() => navigate('/divisions')} className="transition-colors hover:text-[#d6f36a]">About</button>
              <button type="button" onClick={() => navigate('/contact')} className="transition-colors hover:text-[#d6f36a]">Contact</button>
            </div>
            <button type="button" onClick={() => navigate('/shop')} className="hidden items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-bold transition-colors hover:border-[#d6f36a] hover:bg-[#d6f36a] hover:text-[#10211b] lg:flex">
              Enter marketplace <ArrowUpRight className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => navigate('/shop')} aria-label="Open marketplace" className="rounded-full border border-white/30 p-3 lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
          </div>

          <motion.div {...revealProps()} className="max-w-4xl pb-8 pt-24 lg:pb-16">
            <p className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-[#d6f36a]">
              <span className="h-px w-10 bg-[#d6f36a]" />
              Moving business forward
            </p>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.06em] sm:text-7xl lg:text-[clamp(5rem,9vw,9rem)]">
              Built for the
              <span className="block text-[#d6f36a]">road ahead.</span>
            </h1>
            <p className="mt-8 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
              Parts, equipment, and opportunities for the people and businesses that keep progress moving.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button type="button" onClick={() => navigate('/shop')} className="group inline-flex items-center gap-3 rounded-full bg-[#d6f36a] px-6 py-3.5 text-sm font-black text-[#10211b] transition-transform hover:-translate-y-1">
                Explore the marketplace
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
              <button type="button" onClick={() => navigate('/mining')} className="inline-flex items-center gap-3 rounded-full border border-white/35 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:border-white hover:bg-white/10">
                Explore MJ Mining
              </button>
            </div>
          </motion.div>

          <div className="flex items-end justify-between border-t border-white/20 pt-5 text-xs uppercase tracking-[0.18em] text-white/55">
            <span>Ethiopia / East Africa</span>
            <span className="hidden sm:block">01 — 05</span>
            <span className="flex items-center gap-2"><ArrowDownRight className="h-4 w-4 text-[#d6f36a]" /> Scroll to explore</span>
          </div>
        </div>
      </section>

      <section className="bg-[#d6f36a] px-5 py-5 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-4 text-sm font-bold sm:grid-cols-3 sm:gap-8">
          {['Parts that fit', 'Business-ready supply', 'Long-term partnerships'].map((item, index) => (
            <motion.div key={item} {...revealProps(index * 0.08)} className="flex items-center gap-3">
              <span className="text-xs opacity-50">0{index + 1}</span>
              <span>{item}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <motion.div {...revealProps()} className="mb-14 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#58705f]">What we do</p>
            <h2 className="max-w-3xl text-4xl font-black leading-none tracking-[-0.05em] sm:text-6xl">
              Three ways to
              <span className="text-[#58705f]"> move forward.</span>
            </h2>
          </div>
          <p className="max-w-sm text-base leading-7 text-[#58705f]">
            A focused enterprise connecting everyday mobility, industrial capability, and natural-resource opportunity.
          </p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-3">
          {SOLUTIONS.map((solution, index) => (
            <motion.article
              key={solution.title}
              {...revealProps(index * 0.1)}
              whileHover={reduceMotion ? undefined : { y: -8 }}
              className="group relative min-h-[490px] overflow-hidden rounded-[2rem] bg-[#10211b] text-white"
            >
              <img src={solution.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-105 group-hover:opacity-85" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10211b] via-[#10211b]/50 to-transparent" />
              <div className="relative flex h-full flex-col justify-between p-7 sm:p-8">
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-white/25 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">{solution.eyebrow}</span>
                  <solution.icon className="h-6 w-6 text-[#d6f36a]" />
                </div>
                <div>
                  <h3 className="text-3xl font-black tracking-[-0.04em]">{solution.title}</h3>
                  <p className="mt-3 max-w-xs text-sm leading-6 text-white/70">{solution.description}</p>
                  <button type="button" onClick={() => navigate(solution.href)} className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#d6f36a]">
                    {solution.action} <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="bg-[#10211b] text-white">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[480px] overflow-hidden lg:min-h-[680px]">
            <img src={IMAGE_URLS.detail} alt="Industrial equipment in a workshop" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#10211b] via-transparent to-transparent" />
            <div className="absolute bottom-8 left-5 right-5 flex items-end justify-between sm:left-8 sm:right-8">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#d6f36a]">The MJ standard</span>
              <span className="text-6xl font-black tracking-[-0.08em] text-white/25">02</span>
            </div>
          </div>
          <div className="flex items-center px-5 py-20 sm:px-10 lg:px-20">
            <motion.div {...revealProps()}>
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-[#d6f36a]">Simple by design</p>
              <h2 className="max-w-xl text-4xl font-black leading-[0.98] tracking-[-0.05em] sm:text-6xl">
                Less searching.
                <span className="block text-[#d6f36a]">More certainty.</span>
              </h2>
              <p className="mt-7 max-w-lg text-base leading-7 text-white/65">
                Whether you are keeping a vehicle on the road or equipping a growing operation, we make the next step easier to see.
              </p>
              <div className="mt-10 grid gap-5 sm:grid-cols-2">
                {[
                  ['01', 'Choose what you need', 'Start with a vehicle, category, or business requirement.'],
                  ['02', 'Move with confidence', 'Use clear product information and direct support.'],
                ].map(([number, title, description]) => (
                  <div key={number} className="border-t border-white/20 pt-4">
                    <span className="text-xs font-bold text-[#d6f36a]">{number}</span>
                    <h3 className="mt-3 font-bold">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/55">{description}</p>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => navigate('/shop')} className="mt-10 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-black text-[#10211b] transition-transform hover:-translate-y-1">
                Find your next part <ArrowUpRight className="h-4 w-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <motion.div {...revealProps()} className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-end">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#58705f]">Why MJ Logistics</p>
            <h2 className="max-w-lg text-4xl font-black leading-none tracking-[-0.05em] sm:text-6xl">
              Built around
              <span className="text-[#58705f]"> your next move.</span>
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              [Truck, 'Dependable movement', 'Clear steps from selection to delivery.'],
              [ShieldCheck, 'Better information', 'Fitment, product, and support details in one place.'],
              [Factory, 'Built for business', 'Solutions that scale from one part to larger requirements.'],
              [CircleArrowOutUpRight, 'A direct relationship', 'A team that helps you make practical decisions.'],
            ].map(([Icon, title, text]) => (
              <div key={title as string} className="border-t border-[#cbd5cb] pt-5">
                <Icon className="h-6 w-6 text-[#58705f]" />
                <h3 className="mt-5 font-bold">{title as string}</h3>
                <p className="mt-2 text-sm leading-6 text-[#58705f]">{text as string}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="bg-[#d6f36a] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <motion.div {...revealProps()} className="mx-auto flex max-w-7xl flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-[#58705f]">Start here</p>
            <h2 className="max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.06em] sm:text-7xl">
              Ready for the next move?
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => navigate('/shop')} className="inline-flex items-center gap-3 rounded-full bg-[#10211b] px-6 py-3.5 text-sm font-black text-white transition-transform hover:-translate-y-1">
              Visit marketplace <ArrowUpRight className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => navigate('/contact')} className="inline-flex items-center gap-3 rounded-full border border-[#10211b]/30 px-6 py-3.5 text-sm font-bold text-[#10211b] transition-colors hover:bg-white/40">
              Talk to us <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
