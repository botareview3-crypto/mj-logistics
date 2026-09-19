import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { ChevronRight, Wrench, Package, Gem, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../lib/AppContext';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { VideoScrollSection } from '../components/VideoScrollSection';
import { gsap, ScrollTrigger, animateDataGsap } from '../lib/gsap';
import { SPRINGS } from '../lib/springs';

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
    image: '/categories/tires-wheels-custom.png',
  },
];

/* ─── Additional categories for dropdown ─────────────────────────────────── */
const ADDITIONAL_CATEGORIES = [
  { label: 'Exhaust System',         href: '/catalog/exhaust-system' },
  { label: 'Car Care & Detailing',  href: '/catalog/car-care-detailing' },
  { label: 'Tools & Workshop',      href: '/catalog/tools-workshop' },
  { label: 'Cooling & Heating',     href: '/catalog/cooling-heating' },
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
        <title>MJ Logistics — Genuine Auto Parts</title>
        <meta name="description" content="Find genuine auto parts with fitment verification, workshop essentials, and trusted support for your vehicle. Fast delivery guaranteed." />
      </Head>

      {/* Fixed glassmorphic header */}
      <SiteHeader />

      <main ref={mainRef}>
        {/* ── HERO ───────────────────────────────────────────────────────── */}
        <section
          className="relative w-full overflow-hidden"
          style={{ minHeight: '100svh', height: '100svh' }}
        >
          {/* Background image — covers the full section on every device */}
          <img
            src="/homepage/hero-bg.webp"
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            loading="eager"
            decoding="sync"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center' }}
          />
          {/* Overlay gradient */}
          <div className="hero-overlay absolute inset-0" aria-hidden="true" />

          {/* Hero content — sits above the image, text anchored to the bottom */}
          <div
            className="relative z-10 flex flex-col justify-end px-6 max-w-[1200px] mx-auto pb-16 sm:pb-20 pt-28"
            style={{ height: '100%', minHeight: '100svh' }}
          >
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
                className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6"
                style={{ opacity: 0 }}
              >
                Parts That Fit.<br />
                <span className="italic font-normal" style={{ fontFamily: "'Chopin Trial', serif" }}>Delivered Fast.</span>
              </h1>

              <p
                ref={heroDescRef}
                className="text-[15px] text-white/80 leading-relaxed max-w-xl mb-8 sm:mb-10"
                style={{ opacity: 0 }}
              >
                Your trusted source for genuine auto parts and workshop essentials — with verified fitment and expert support.
              </p>

              <div ref={heroBtnsRef} className="flex flex-wrap gap-3" style={{ opacity: 0 }}>
                <motion.button
                  type="button"
                  onClick={() => navigate('/shop')}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white text-[#0d1f3c] font-bold text-[14px] rounded-xl hover:bg-white/90 transition-colors cursor-pointer shadow-lg"
                  whileTap={{ scale: 0.97 }}
                  transition={SPRINGS.micro}
                >
                  Shop Parts
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
                <div ref={dropdownRef} className="relative">
                  <motion.button
                    type="button"
                    onClick={() => setCatalogDropdownOpen(!catalogDropdownOpen)}
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 glass text-white font-bold text-[14px] rounded-xl hover:bg-white/20 transition-colors cursor-pointer"
                    whileTap={{ scale: 0.97 }}
                    transition={SPRINGS.micro}
                  >
                    Browse Catalog
                    <motion.span
                      animate={{ rotate: catalogDropdownOpen ? 90 : 0 }}
                      transition={SPRINGS.micro}
                      style={{ display: 'flex' }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.span>
                  </motion.button>

                  <AnimatePresence>
                    {catalogDropdownOpen && (
                      <motion.div
                        key="catalog-dd"
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={SPRINGS.sheet}
                        className="absolute bottom-full mb-2 left-0 w-64 bg-white rounded-xl border border-slate-200 shadow-xl py-2 z-50"
                      >
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="text-[10px] text-slate-400 uppercase font-bold" style={{ letterSpacing: '0.1em' }}>More Categories</p>
                        </div>
                        {ADDITIONAL_CATEGORIES.map(cat => (
                          <motion.button
                            key={cat.href}
                            type="button"
                            onClick={() => { navigate(cat.href); setCatalogDropdownOpen(false); }}
                            className="w-full text-left px-4 py-2 text-[12px] text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                            whileTap={{ scale: 0.98 }}
                            transition={SPRINGS.micro}
                          >
                            {cat.label}
                          </motion.button>
                        ))}
                        <div className="border-t border-slate-100 mt-2 pt-2">
                          <motion.button
                            type="button"
                            onClick={() => { navigate('/catalog'); setCatalogDropdownOpen(false); }}
                            className="w-full text-left px-4 py-2 text-[12px] font-bold text-[#0d1f3c] hover:bg-slate-50 transition-colors cursor-pointer"
                            whileTap={{ scale: 0.98 }}
                            transition={SPRINGS.micro}
                          >
                            View All Categories →
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CATEGORIES GRID ────────────────────────────────────────────── */}
        <section className="below-fold py-20 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <div data-gsap="fade-up" className="flex items-end justify-between mb-10">
              <div>
                <p className="font-display text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-2">Browse by category</p>
                <h2 className="font-display text-4xl font-bold text-[#0d1f3c]">Shop by System</h2>
              </div>
              <motion.button
                type="button"
                onClick={() => navigate('/catalog')}
                className="hidden sm:flex items-center gap-1.5 text-[13px] font-bold text-[#1e4d8c] hover:text-[#0d1f3c] transition-colors cursor-pointer"
                whileTap={{ scale: 0.97 }}
                transition={SPRINGS.micro}
              >
                All categories <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {CATEGORIES.map((cat) => (
                <motion.button
                  key={cat.title}
                  type="button"
                  onClick={() => navigate(cat.href)}
                  className="cat-card relative w-full cursor-pointer bg-transparent border-none outline-none flex flex-col items-center justify-center gap-3 p-4 group"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.96 }}
                  transition={SPRINGS.default}
                >
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-24 h-24 object-contain drop-shadow-xl"
                    loading="eager"
                    decoding="async"
                    width={96}
                    height={96}
                  />
                  <span className="font-display text-[11px] font-bold text-center leading-tight text-[#0d1f3c]">{cat.title}</span>
                  <span className="text-[9px] font-bold uppercase text-slate-500" style={{ letterSpacing: '0.08em' }}>{cat.count} items</span>
                </motion.button>
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
                From genuine auto parts to natural resource solutions — MJ Logistics covers it all.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  icon: Wrench,
                  title: 'Auto Parts',
                  desc: 'Thousands of genuine parts with vehicle fitment verification built in.',
                  href: '/shop',
                  cta: 'Shop parts',
                  bg: 'bg-gradient-to-br from-[#0d1f3c] to-[#1a3560]',
                  image: '/homepage/auto-parts-istock.jpg',
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
                  {/* Bare icon — no wrapper box */}
                  <div className="relative mb-5">
                    <div.icon className="w-7 h-7 text-white/80" strokeWidth={1.6} />
                  </div>
                  <h3 className="relative font-display text-xl font-bold text-white mb-3">{div.title}</h3>
                  <p className="relative text-white/70 text-[13px] leading-relaxed flex-1">{div.desc}</p>
                  <motion.button
                    type="button"
                    onClick={() => navigate(div.href)}
                    className="relative mt-6 inline-flex items-center gap-2 text-white text-[12px] font-bold cursor-pointer"
                    whileTap={{ scale: 0.97 }}
                    transition={SPRINGS.micro}
                  >
                    {div.cta} <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT STRIP ─────────────────────────────────────────────── */}
        <section className="bg-[#f5f4ef] py-20">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="rounded-3xl bg-[#d8b46a] p-8 sm:p-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <div className="max-w-2xl">
                <p className="font-display text-[11px] font-bold uppercase tracking-[0.3em] text-[#5d451d] mb-3">Questions, sourcing, or support?</p>
                <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#10221d] leading-[.95]">
                  Let&apos;s make your next move easier.
                </h2>
                <p className="mt-5 max-w-xl text-[14px] leading-7 text-[#5d451d]">
                  Talk to MJ Logistics about auto parts, business equipment,
                  or a wider enterprise requirement. We&apos;ll help direct your enquiry.
                </p>
              </div>
              <motion.button
                type="button"
                onClick={() => navigate('/contact')}
                className="inline-flex w-fit items-center gap-2.5 rounded-xl bg-[#10221d] px-7 py-3.5 text-[14px] font-bold text-white cursor-pointer"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={SPRINGS.default}
              >
                Contact our team <ArrowRight className="w-4 h-4" />
              </motion.button>
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
                <motion.button
                  type="button"
                  onClick={() => navigate('/garage')}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0d1f3c] font-bold text-[14px] rounded-xl hover:bg-white/90 transition-colors cursor-pointer"
                  whileTap={{ scale: 0.97 }}
                  transition={SPRINGS.micro}
                >
                  Select My Vehicle
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => navigate('/catalog')}
                  className="inline-flex items-center gap-2 px-8 py-4 glass text-white font-bold text-[14px] rounded-xl cursor-pointer hover:bg-white/20 transition-colors"
                  whileTap={{ scale: 0.97 }}
                  transition={SPRINGS.micro}
                >
                  Browse Catalog
                </motion.button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
