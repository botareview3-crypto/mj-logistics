import React from 'react';
import Head from 'next/head';
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Compass,
  Gem,
  Mail,
  MapPin,
  Menu,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';

const APPROACH = [
  {
    number: '01',
    title: 'Read the ground',
    text: 'Every opportunity begins with patience: understanding the land, the geology, and the people who know it best.',
    icon: Compass,
  },
  {
    number: '02',
    title: 'Work with care',
    text: 'We favour disciplined operations, transparent decisions, and a lighter footprint wherever the work takes us.',
    icon: ShieldCheck,
  },
  {
    number: '03',
    title: 'Build what lasts',
    text: 'Our ambition is long-term value — for partners, communities, and the resource economies of tomorrow.',
    icon: Sparkles,
  },
];

export default function MiningPage() {
  const { navigate } = useApp();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div className="overflow-hidden bg-[#f5f4ef] text-[#10221d]">
      <Head>
        <title>MJ Mining | Resource with responsibility</title>
        <meta
          name="description"
          content="MJ Mining explores responsible opportunities in gold and diamonds through patience, partnership, and disciplined execution."
        />
      </Head>

      <div className="relative z-50">
        <SiteHeader />
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-[100] bg-[#10221d] px-6 py-6 text-[#f5f4ef] lg:hidden">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold uppercase tracking-[0.28em]">MJ Mining</span>
            <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="mt-20 space-y-7 text-4xl font-semibold">
            <a href="#story" onClick={() => setMenuOpen(false)}>Our story</a>
            <a href="#focus" onClick={() => setMenuOpen(false)}>Our focus</a>
            <a href="#approach" onClick={() => setMenuOpen(false)}>Our approach</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          </nav>
        </div>
      )}

      <main>
        <section className="relative min-h-[720px] bg-[#10221d] text-[#f5f4ef]">
          <div className="absolute inset-0">
            <img
              src="/images/mining/hero.avif"
              alt="Aerial view of a mineral-rich landscape"
              className="h-full w-full object-cover object-center opacity-65"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,34,29,.98)_0%,rgba(16,34,29,.82)_35%,rgba(16,34,29,.18)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(16,34,29,.9)_0%,transparent_45%)]" />
          </div>

          <div className="relative mx-auto flex min-h-[720px] max-w-[1320px] flex-col justify-between px-6 pb-10 pt-24 sm:px-10 lg:px-16">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.38em] text-[#d8b46a]">
                A division of MJ Logistics Enterprise
              </p>
              <button
                type="button"
                className="hidden items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white lg:flex"
                onClick={() => navigate('/')}
              >
                Return to enterprise <ArrowUpRight className="h-4 w-4" />
              </button>
              <button type="button" className="lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </button>
            </div>

            <div className="max-w-3xl pb-8">
              <p className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-[#d8b46a]">
                <span className="h-px w-10 bg-[#d8b46a]" /> Mineral opportunity, considered
              </p>
              <h1 className="max-w-3xl text-6xl font-semibold leading-[.9] tracking-[-.065em] sm:text-8xl lg:text-[9.5rem]">
                Wealth in the earth.
              </h1>
              <p className="mt-8 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
                MJ Mining is building a more deliberate path into gold and diamond opportunity —
                grounded in local knowledge, responsible practice, and relationships that outlast a single project.
              </p>
              <a
                href="#story"
                className="mt-10 inline-flex items-center gap-3 border-b border-[#d8b46a] pb-3 text-sm font-semibold text-[#f5f4ef] transition-colors hover:text-[#d8b46a]"
              >
                Discover the MJ Mining point of view <ArrowDownRight className="h-4 w-4 text-[#d8b46a]" />
              </a>
            </div>
          </div>
        </section>

        <section id="story" className="mx-auto grid max-w-[1320px] gap-12 px-6 py-24 sm:px-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-24 lg:px-16 lg:py-36">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#9b7430]">The point of view</p>
            <h2 className="mt-6 max-w-lg text-4xl font-semibold leading-[.98] tracking-[-.05em] text-[#10221d] sm:text-6xl">
              Serious about the ground beneath us.
            </h2>
          </div>
          <div className="max-w-2xl">
            <p className="text-xl leading-8 text-[#10221d] sm:text-2xl sm:leading-9">
              Mining is more than what comes out of the ground. It is what gets built around it:
              confidence, capability, and a future people can participate in.
            </p>
            <p className="mt-8 max-w-xl text-sm leading-7 text-[#3a4a42]">
              MJ Mining brings an enterprise mindset to natural-resource work. We look for
              opportunities where careful exploration, clear governance, and strong local
              relationships can create lasting value — from first assessment to final partnership.
            </p>
            <div className="mt-10 flex items-center gap-4 text-sm font-semibold text-[#10221d]">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#b9aa87] text-[#9b7430]">
                <Gem className="h-5 w-5" />
              </span>
              Gold and diamond opportunities, approached with intent.
            </div>
          </div>
        </section>

        <section id="focus" className="bg-[#10221d] px-6 py-24 text-[#f5f4ef] sm:px-10 lg:px-16 lg:py-36">
          <div className="mx-auto max-w-[1320px]">
            <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#d8b46a]">Our focus</p>
                <h2 className="mt-6 text-5xl font-semibold leading-[.92] tracking-[-.06em] sm:text-7xl">
                  Two resources.<br />One standard.
                </h2>
              </div>
              <p className="max-w-xl text-base leading-7 text-white/55">
                We keep our focus clear so our standards stay high. Every project is evaluated
                through the same lens: potential, responsibility, and the quality of the relationship around it.
              </p>
            </div>

            <div className="mt-16 grid gap-5 lg:grid-cols-2">
              <article className="group relative min-h-[500px] overflow-hidden bg-[#c7a45b]">
                <img src="/images/mining/gold.webp" alt="Gold ore and mineral texture" className="absolute inset-0 h-full w-full object-cover mix-blend-multiply opacity-75 transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2c2110]/90 via-[#5d451d]/25 to-transparent" />
                <div className="relative flex min-h-[500px] flex-col justify-end p-7 sm:p-10">
                  <span className="text-xs uppercase tracking-[0.28em] text-white/70">01 / Gold</span>
                  <h3 className="mt-4 text-5xl font-semibold tracking-[-.06em] text-white sm:text-6xl">A measured<br />store of value.</h3>
                  <p className="mt-5 max-w-sm text-sm leading-6 text-white/75">Exploring opportunities with an eye for quality, traceability, and a supply chain built on trust.</p>
                </div>
              </article>
              <article className="group relative min-h-[500px] overflow-hidden bg-[#cbd4d2]">
                <img src="/images/mining/diamonds.webp" alt="Diamond texture and light" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#132722]/90 via-[#132722]/10 to-transparent" />
                <div className="relative flex min-h-[500px] flex-col justify-end p-7 sm:p-10">
                  <span className="text-xs uppercase tracking-[0.28em] text-white/70">02 / Diamonds</span>
                  <h3 className="mt-4 text-5xl font-semibold tracking-[-.06em] text-white sm:text-6xl">Clarity<br />from the rough.</h3>
                  <p className="mt-5 max-w-sm text-sm leading-6 text-white/75">Creating a more considered route from discovery to opportunity through patience and precision.</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="approach" className="mx-auto max-w-[1320px] px-6 py-24 sm:px-10 lg:px-16 lg:py-36">
          <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#9b7430]">How we move</p>
              <h2 className="mt-6 max-w-sm text-5xl font-semibold leading-[.92] tracking-[-.06em] text-[#10221d] sm:text-7xl">A slower look. A stronger result.</h2>
            </div>
            <div className="divide-y divide-[#d9d8d0] border-y border-[#d9d8d0]">
              {APPROACH.map(({ number, title, text, icon: Icon }) => (
                <article key={number} className="grid gap-5 py-8 sm:grid-cols-[70px_1fr_40px] sm:items-start">
                  <span className="text-sm font-semibold text-[#9b7430]">{number}</span>
                  <div>
                    <h3 className="text-2xl font-semibold tracking-[-.04em] text-[#10221d]">{title}</h3>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-[#3a4a42]">{text}</p>
                  </div>
                  <Icon className="hidden h-6 w-6 text-[#9b7430] sm:block" />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="bg-[#d8b46a] px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
          <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[1fr_.7fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#5d451d]">Start a conversation</p>
              <h2 className="mt-6 max-w-3xl text-5xl font-semibold leading-[.9] tracking-[-.065em] text-[#10221d] sm:text-8xl">
                The next chapter starts with a good question.
              </h2>
              <p className="mt-7 max-w-xl text-base leading-7 text-[#5d451d]">
                Tell us what you are exploring. For partnerships, supply discussions, or
                investment enquiries, our team is ready to listen.
              </p>
            </div>
            <div className="border-t border-[#9b7430] pt-6 text-[#10221d]">
              <a href="mailto:mining@mjlogisticsenterprise.com" className="group flex items-center justify-between border-b border-[#9b7430] py-5 text-sm font-semibold">
                <span className="flex items-center gap-3"><Mail className="h-5 w-5" /> mining@mjlogisticsenterprise.com</span>
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
              <div className="flex items-center gap-3 border-b border-[#9b7430] py-5 text-sm">
                <MapPin className="h-5 w-5" /> Monrovia, Liberia
              </div>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#10221d] px-6 py-3.5 text-sm font-semibold text-[#f5f4ef] transition-transform hover:-translate-y-1"
              >
                Visit MJ Logistics <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        <div className="bg-[#10221d] px-6 py-5 text-center text-xs text-white/45">
          <span className="inline-flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#d8b46a]" /> Built for responsible opportunity.</span>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
