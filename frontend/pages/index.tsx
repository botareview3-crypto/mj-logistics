import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { ChevronRight, Wrench, Package, Gem, ArrowRight } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { VideoScrollSection } from '../components/VideoScrollSection';
import { gsap, ScrollTrigger, animateDataGsap } from '../lib/gsap';

/* ─── Category cards data ────────────────────────────────────────────────── */
interface Category {
  title: string;
  href: string;
  count: number;
  color: string | null;
  image: string;
}

const CATEGORIES: Category[] = [
  {
    title: 'Braking System',
    href: '/catalog/braking-system',
    count: 47,
    color: null,
    image: '/categories/brake-disc.webp',
  },
  {
    title: 'Engine & Transmission',
    href: '/catalog/engine-transmission',
    count: 63,
    color: null,
    image: '/categories/engine.webp',
  },
  {
    title: 'Suspension & Steering',
    href: '/catalog/suspension-steering',
    count: 38,
    color: null,
    image: '/categories/shock-absorber.webp',
  },
  {
    title: 'Electrical & Lighting',
    href: '/catalog/electrical-lighting',
    count: 55,
    color: null,
    image: '/categories/headlight.webp',
  },
  {
    title: 'Tires & Wheels',
    href: '/catalog/tires-wheels',
    count: 29,
    color: null,
    image: '/categories/tire.webp',
  },
  {
    title: 'Office & Stationery',
    href: '/catalog/office-stationery',
    count: 34,
    color: null,
    image: '/categories/pen-paper.webp',
  },
];

/* ─── Additional categories for dropdown ─────────────────────────────────── */
const ADDITIONAL_CATEGORIES = [
  { label: 'Exhaust System',         href: '/catalog/exhaust-system' },
  { label: 'Car Care & Detailing',  href: '/catalog/car-care-detailing' },
  { label: 'Tools & Workshop',      href: '/catalog/tools-workshop' },
  { label: 'Cooling & Heating',     href: '/catalog/cooling-heating' },
  { label: 'Business Equipment',   href: '/catalog/business-equipment' },
  { label: 'Filtration',            href: '/catalog/filtration' },
  { label: 'Fuel System',           href: '/catalog/fuel-system' },
  { label: 'Ignition System',       href: '/catalog/ignition-system' },
];

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function HomePage() {
  const { navigate } = useApp();
  const [catalogDropdownOpen, setCatalogDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Refs for GSAP targets
  const heroTaglineRef  = useRef<HTMLParagraphElement>(null);
  const heroH1Ref       = useRef<HTMLHeadingElement>(null);
  const heroDescRef     = useRef<HTMLParagraphElement>(null);
  const heroBtnsRef     = useRef<HTMLDivElement>(null);
  const mainRef         = useRef<HTMLElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCatalogDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── GSAP animations ──────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Hero entrance timeline
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (heroTaglineRef.current) {
        gsap.set(heroTaglineRef.current, { opacity: 0, y: 20 });
        heroTl.to(heroTaglineRef.current, { opacity: 1, y: 0, duration: 0.7 }, 0.3);
      }
      if (heroH1Ref.current) {
        gsap.set(heroH1Ref.current, { opacity: 0, y: 40 });
        heroTl.to(heroH1Ref.current, { opacity: 1, y: 0, duration: 0.9 }, 0.5);
      }
      if (heroDescRef.current) {
        gsap.set(heroDescRef.current, { opacity: 0, y: 24 });
        heroTl.to(heroDescRef.current, { opacity: 1, y: 0, duration: 0.75 }, 0.75);
      }
      if (heroBtnsRef.current) {
        gsap.set(heroBtnsRef.current, { opacity: 0, y: 20 });
        heroTl.to(heroBtnsRef.current, { opacity: 1, y: 0, duration: 0.65 }, 0.95);
      }

      // ScrollTrigger batch animations for all [data-gsap] elements
      if (mainRef.current) {
        animateDataGsap(mainRef.current);
      }

      // Category cards stagger
      const catCards = document.querySelectorAll<HTMLElement>('.cat-card');
      if (catCards.length) {
        gsap.set(catCards, { opacity: 0, y: 36, scale: 0.96 });
        ScrollTrigger.batch(catCards, {
          start: 'top 90%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              stagger: 0.07,
              ease: 'power3.out',
            }),
        });
      }

      // Division cards
      const divCards = document.querySelectorAll<HTMLElement>('.div-card');
      if (divCards.length) {
        gsap.set(divCards, { opacity: 0, y: 40 });
        ScrollTrigger.batch(divCards, {
          start: 'top 88%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.1,
              ease: 'power3.out',
            }),
        });
      }
    }, mainRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <>
      <Head>
        <title>MJ Logistics — Auto Parts, Stationery &amp; Business Equipment</title>
        <meta name="description" content="Find genuine auto parts with fitment verification, office stationery, and business equipment. Fast delivery guaranteed." />
      </Head>

      {/* Fixed glassmorphic header */}
      <SiteHeader />

      <main ref={mainRef}>
        {/* ── HERO ───────────────────────────────────────────────────────── */}
        <section className="relative min-h-screen w-full overflow-hidden">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/homepage/hero-bg.webp')" }}
            aria-hidden="true"
          />
          {/* Overlay gradient */}
          <div className="hero-overlay absolute inset-0" aria-hidden="true" />

          {/* Hero content */}
          <div className="relative z-10 flex flex-col justify-end min-h-screen pb-20 pt-32 px-6 max-w-[1200px] mx-auto">
            <div className="max-w-2xl">
              <p
                ref={heroTaglineRef}
                className="font-display text-[12px] font-bold uppercase tracking-[0.35em] text-white/70 mb-4"
                style={{ opacity: 0 }}
              >
                MJ Logistics Enterprise
              </p>

              <h1
                ref={heroH1Ref}
                className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6"
                style={{ opacity: 0 }}
              >
                Parts That Fit.<br />
                <span className="italic font-normal" style={{ fontFamily: "'Chopin Trial', serif" }}>Delivered Fast.</span>
              </h1>

              <p
                ref={heroDescRef}
                className="text-[16px] text-white/80 leading-relaxed max-w-xl mb-10"
                style={{ opacity: 0 }}
              >
                Your trusted source for genuine auto parts, office stationery, and business equipment — with verified fitment and expert support.
              </p>

              <div ref={heroBtnsRef} className="flex flex-wrap gap-3" style={{ opacity: 0 }}>
                <button
                  type="button"
                  onClick={() => navigate('/shop')}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white text-[#0d1f3c] font-bold text-[14px] rounded-xl hover:bg-white/90 transition-all cursor-pointer shadow-lg"
                >
                  Shop Parts
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div ref={dropdownRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setCatalogDropdownOpen(!catalogDropdownOpen)}
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 glass text-white font-bold text-[14px] rounded-xl hover:bg-white/20 transition-all cursor-pointer"
                  >
                    Browse Catalog
                    <ChevronRight className={`w-4 h-4 transition-transform ${catalogDropdownOpen ? 'rotate-90' : ''}`} />
                  </button>

                  {catalogDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl border border-slate-200 shadow-xl py-2 z-50 animate-fade-in-down">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">More Categories</p>
                      </div>
                      {ADDITIONAL_CATEGORIES.map(cat => (
                        <button
                          key={cat.href}
                          type="button"
                          onClick={() => { navigate(cat.href); setCatalogDropdownOpen(false); }}
                          className="w-full text-left px-4 py-2 text-[12px] text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          {cat.label}
                        </button>
                      ))}
                      <div className="border-t border-slate-100 mt-2 pt-2">
                        <button
                          type="button"
                          onClick={() => { navigate('/catalog'); setCatalogDropdownOpen(false); }}
                          className="w-full text-left px-4 py-2 text-[12px] font-bold text-[#0d1f3c] hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          View All Categories →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CATEGORIES GRID ────────────────────────────────────────────── */}
        <section className="py-20 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <div data-gsap="fade-up" className="flex items-end justify-between mb-10">
              <div>
                <p className="font-display text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-2">Browse by category</p>
                <h2 className="font-display text-4xl font-bold text-[#0d1f3c]">Shop by System</h2>
              </div>
              <button
                type="button"
                onClick={() => navigate('/catalog')}
                className="hidden sm:flex items-center gap-1.5 text-[13px] font-bold text-[#1e4d8c] hover:text-[#0d1f3c] transition-colors cursor-pointer"
              >
                All categories <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.title}
                  type="button"
                  onClick={() => navigate(cat.href)}
                  className="cat-card relative w-full aspect-square rounded-2xl overflow-hidden cursor-pointer bg-transparent flex flex-col items-center justify-center gap-2 p-4 transition-all duration-200 hover:scale-[1.04] hover:shadow-xl group"
                >
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-20 h-20 object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-200"
                    loading="lazy"
                  />
                  <span className="font-display text-[11px] font-bold text-center leading-tight text-[#0d1f3c]">{cat.title}</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">{cat.count} items</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── VIDEO SCROLL SECTION ───────────────────────────────────────── */}
        <VideoScrollSection />

        {/* ── DIVISIONS STRIP ────────────────────────────────────────────── */}
        <section className="py-20 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <div data-gsap="fade-up" className="text-center mb-12">
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-3">Our Divisions</p>
              <h2 className="font-display text-4xl font-bold text-[#0d1f3c]">Everything You Need</h2>
              <p className="mt-3 text-slate-500 max-w-lg mx-auto text-[14px] leading-relaxed">
                From auto parts to office supplies and natural resources — MJ Logistics covers it all.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  icon: Wrench,
                  title: 'Auto Parts',
                  desc: 'Thousands of genuine parts with vehicle fitment verification built in.',
                  href: '/shop',
                  cta: 'Shop parts',
                  bg: 'bg-gradient-to-br from-[#0d1f3c] to-[#1a3560]',
                  image: '/homepage/auto-parts.webp',
                },
                {
                  icon: Package,
                  title: 'Office & Stationery',
                  desc: 'Complete office supplies from pens and paper to printers and furniture.',
                  href: '/catalog/office-stationery',
                  cta: 'Browse stationery',
                  bg: 'bg-gradient-to-br from-slate-700 to-slate-900',
                  image: '/homepage/office.webp',
                },
                {
                  icon: Gem,
                  title: 'MJ Mining',
                  desc: 'Responsible diamond and gold sourcing with long-term partnerships.',
                  href: '/mining',
                  cta: 'Discover mining',
                  bg: 'bg-gradient-to-br from-amber-900 to-yellow-900',
                  image: '/homepage/diamond.webp',
                },
              ].map((div: { icon: any; title: string; desc: string; href: string; cta: string; bg: string; image: string }) => (
                <div
                  key={div.title}
                  className={`div-card relative ${div.bg} rounded-2xl p-8 flex flex-col h-full overflow-hidden group`}
                >
                  {/* Background image with overlay */}
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                    style={{ backgroundImage: `url('${div.image}')` }}
                    aria-hidden="true"
                  />
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-white/5" />
                  <div className="relative w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-5">
                    <div.icon className="w-6 h-6 text-white" strokeWidth={1.8} />
                  </div>
                  <h3 className="relative font-display text-xl font-bold text-white mb-3">{div.title}</h3>
                  <p className="relative text-white/70 text-[13px] leading-relaxed flex-1">{div.desc}</p>
                  <button
                    type="button"
                    onClick={() => navigate(div.href)}
                    className="relative mt-6 inline-flex items-center gap-2 text-white text-[12px] font-bold cursor-pointer hover:gap-3 transition-all"
                  >
                    {div.cta} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ─────────────────────────────────────────────────── */}
        <section className="relative py-24 overflow-hidden bg-[#0d1f3c]">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: "url('/homepage/cta-bg.webp')" }}
            aria-hidden="true"
          />
          <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
            <div data-gsap="fade-up">
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-5">
                Ready to Find Your Part?
              </h2>
              <p className="text-white/70 text-[15px] max-w-xl mx-auto mb-10 leading-relaxed">
                Browse thousands of genuine parts, filter by your vehicle, and get delivered to your door.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => navigate('/garage')}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0d1f3c] font-bold text-[14px] rounded-xl hover:bg-white/90 transition-all cursor-pointer"
                >
                  Select My Vehicle
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/catalog')}
                  className="inline-flex items-center gap-2 px-8 py-4 glass text-white font-bold text-[14px] rounded-xl cursor-pointer hover:bg-white/20 transition-all"
                >
                  Browse Catalog
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
