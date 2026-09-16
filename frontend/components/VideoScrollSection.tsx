/**
 * VideoScrollSection.tsx
 * ─────────────────────────────────────────────────────────────────────────
 * Two modes, selected purely by CSS media queries (no conditional rendering
 * that breaks GSAP):
 *
 * DESKTOP (≥1024px):
 *   GSAP ScrollTrigger scrub — pill expands to full-screen video.
 *   The section is always in the DOM so refs are available on first mount.
 *
 * MOBILE/TABLET (<1024px):
 *   A real autoplay muted video fills the card background.
 *   The desktop section is hidden via CSS (display:none) — not unmounted —
 *   so GSAP never crashes on missing refs.
 */

import React, { useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { gsap, ScrollTrigger } from '../lib/gsap';

export function VideoScrollSection() {
  /* ── Refs for GSAP (desktop) ──────────────────────────────────────── */
  const sectionRef    = useRef<HTMLDivElement>(null);
  const stickyRef     = useRef<HTMLDivElement>(null);
  const pillRef       = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const overlayRef    = useRef<HTMLDivElement>(null);
  const gradientRef   = useRef<HTMLDivElement>(null);
  const videoDesktop  = useRef<HTMLVideoElement>(null);
  const bgRef         = useRef<HTMLDivElement>(null);

  /* ── Ref for mobile video ─────────────────────────────────────────── */
  const videoMobile   = useRef<HTMLVideoElement>(null);

  /* ── Play mobile video when it enters viewport (fallback for autoPlay) ── */
  useEffect(() => {
    const vid = videoMobile.current;
    if (!vid) return;
    const tryPlay = () => vid.play().catch(() => {});
    if (vid.readyState >= 3) {
      tryPlay();
    } else {
      vid.addEventListener('canplay', tryPlay, { once: true });
    }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && vid.paused) tryPlay(); },
      { threshold: 0.1 }
    );
    obs.observe(vid);
    return () => { obs.disconnect(); vid.removeEventListener('canplay', tryPlay); };
  }, []);

  /* ── Desktop video: play as soon as enough data is loaded ─────────── */
  useEffect(() => {
    const vid = videoDesktop.current;
    if (!vid) return;
    const tryPlay = () => vid.play().catch(() => {});
    // Play immediately if already ready
    if (vid.readyState >= 3) {
      tryPlay();
    } else {
      vid.addEventListener('canplay', tryPlay, { once: true });
    }
    // Also retry on intersection in case browser paused it
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && vid.paused) tryPlay(); },
      { threshold: 0.05 }
    );
    obs.observe(vid);
    return () => { obs.disconnect(); vid.removeEventListener('canplay', tryPlay); };
  }, []);

  /* ── GSAP desktop animation ───────────────────────────────────────── */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!sectionRef.current || !stickyRef.current || !pillRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
          pin: stickyRef.current,
          pinSpacing: false,
          anticipatePin: 1,
        },
      });

      tl.to({}, { duration: 0.15 });

      tl.to(pillRef.current, {
        width: '100vw',
        height: '100vh',
        borderRadius: '0px',
        left: '0px',
        duration: 0.7,
        ease: 'none',
      }, '<');

      tl.to(rightPanelRef.current, { opacity: 0, duration: 0.25, ease: 'none' }, '<');

      tl.to(bgRef.current, {
        backgroundColor: 'rgb(8,20,45)',
        duration: 0.5,
        ease: 'none',
      }, '<0.2');

      tl.to(gradientRef.current, { opacity: 1, duration: 0.4, ease: 'none' }, '<');

      tl.to(overlayRef.current, { opacity: 1, duration: 0.15, ease: 'none' }, '>-0.1');
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          MOBILE / TABLET  (<1024px)  — real autoplay video card
          Hidden on lg+ via Tailwind (lg:hidden keeps it out of layout)
          ═══════════════════════════════════════════════════════════════ */}
      <section
        className="lg:hidden relative overflow-hidden text-white"
        style={{ minHeight: '420px' }}
        aria-label="MJ Logistics operations"
      >
        {/* Full-bleed background video — 2MB mobile-optimised 720p */}
        <video
          ref={videoMobile}
          src="/logistics-mobile.mp4"
          poster="/aerial-view-container-cargo-ship-sea.webp"
          loop
          muted
          playsInline
          autoPlay
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark overlay so text is readable */}
        <div className="absolute inset-0 bg-[#071a33]/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_0%,rgba(30,77,140,.4),transparent_65%)]" aria-hidden="true" />

        {/* Content */}
        <div className="relative z-10 max-w-[900px] mx-auto px-6 py-16">
          <div className="flex flex-col sm:flex-row gap-10 items-center">
            {/* Text */}
            <div className="flex-1 text-center sm:text-left">
              <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#55b8ff] mb-3">Our Operations</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                Logistics at{' '}
                <span className="italic font-normal text-[#e8c87a]">Every Scale</span>
              </h2>
              <p className="text-white/80 text-sm leading-relaxed mb-6">
                From port to doorstep — MJ Logistics handles freight, customs clearance,
                warehousing, and last-mile delivery.
              </p>
              <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                <a
                  href="/divisions"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0d1f3c] font-bold text-sm rounded-xl hover:bg-white/90 transition-colors"
                >
                  Our Divisions <ArrowRight className="w-4 h-4" />
                </a>

              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 shrink-0">
              {[
                { value: '15+',  label: 'Years experience' },
                { value: '10k+', label: 'Parts delivered'  },
                { value: '98%',  label: 'On-time rate'     },
                { value: '24/7', label: 'Support'          },
              ].map(s => (
                <div key={s.label} className="text-center sm:text-left">
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-white/50 text-[10px] uppercase tracking-wider mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          DESKTOP  (≥1024px)  — GSAP scroll-pinned expanding pill
          Hidden on <lg via Tailwind. Always in DOM so refs work.
          ═══════════════════════════════════════════════════════════════ */}
      <section
        ref={sectionRef}
        className="hidden lg:block video-scroll-section relative"
        style={{ height: '280vh' }}
        aria-label="MJ Logistics operations video"
      >
        <div
          ref={stickyRef}
          className="w-full overflow-hidden flex items-center"
          style={{ height: '100vh' }}
        >
          {/* Colour-transitioning background */}
          <div
            ref={bgRef}
            className="absolute inset-0"
            style={{ backgroundColor: 'rgb(255,255,255)' }}
            aria-hidden="true"
          />

          <div className="relative w-full h-full flex items-center justify-center">

            {/* RIGHT TEXT PANEL */}
            <div
              ref={rightPanelRef}
              className="absolute right-0 top-0 h-full flex items-center px-12 pointer-events-none z-10"
              style={{ width: '50vw' }}
            >
              <div className="w-full max-w-md pointer-events-auto">

                {/* Eyebrow */}
                <p
                  className="text-[9px] font-black uppercase text-[#1e4d8c] mb-5 tracking-[0.5em]"
                >
                  Our Operations
                </p>

                {/* Headline */}
                <h2
                  className="font-bold text-[#0d1f3c] leading-[1.05] mb-5"
                  style={{ fontSize: 'clamp(2rem, 3.2vw, 3rem)' }}
                >
                  Logistics at<br />
                  <span
                    className="italic font-normal"
                    style={{ fontFamily: "'Chopin Trial', serif", color: '#1e4d8c', fontSize: 'clamp(2.2rem, 3.6vw, 3.4rem)' }}
                  >
                    Every Scale
                  </span>
                </h2>

                {/* Body */}
                <p className="text-slate-500 text-[13.5px] leading-relaxed mb-10 max-w-[340px]">
                  From port to doorstep — freight, customs clearance,
                  warehousing, and last-mile delivery.
                </p>

                {/* Stats — horizontal rule above, numbers flush left */}
                <div className="border-t border-slate-200 pt-7 mb-9">
                  <div className="grid grid-cols-4 gap-0">
                    {[
                      { value: '15+',  label: 'Years' },
                      { value: '10k+', label: 'Deliveries' },
                      { value: '98%',  label: 'On-time' },
                      { value: '24/7', label: 'Support' },
                    ].map((s, i) => (
                      <div
                        key={s.label}
                        className={`${i > 0 ? 'border-l border-slate-200 pl-4' : ''}`}
                      >
                        <p
                          className="font-black text-[#0d1f3c] leading-none"
                          style={{ fontSize: 'clamp(1.4rem, 2vw, 1.9rem)', fontVariantNumeric: 'tabular-nums' }}
                        >
                          {s.value}
                        </p>
                        <p className="text-slate-400 mt-1.5 text-[10px] uppercase tracking-widest font-semibold">
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <a
                  href="/divisions"
                  className="inline-flex items-center gap-3 group cursor-pointer"
                >
                  <span className="text-[13px] font-bold text-[#0d1f3c] group-hover:text-[#1e4d8c] transition-colors">
                    Our Divisions
                  </span>
                  <span className="w-8 h-8 rounded-full bg-[#0d1f3c] group-hover:bg-[#1e4d8c] flex items-center justify-center transition-all group-hover:translate-x-1">
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </span>
                </a>

              </div>
            </div>

            {/* VIDEO PILL */}
            <div
              ref={pillRef}
              className="absolute top-1/2 overflow-hidden shadow-2xl video-pill"
              style={{
                width: '48vw',
                height: '60vh',
                borderRadius: '20px',
                left: '2vw',
                transform: 'translateY(-50%)',
                willChange: 'width, height, border-radius, left',
              }}
            >
              <video
                ref={videoDesktop}
                src="/logistics-video-web.mp4"
                poster="/aerial-view-container-cargo-ship-sea.webp"
                loop
                muted
                playsInline
                autoPlay
                preload="auto"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Gradient scrim */}
              <div
                ref={gradientRef}
                className="absolute inset-0 pointer-events-none"
                style={{
                  opacity: 0,
                  background:
                    'linear-gradient(to bottom, rgba(8,20,45,0) 0%, rgba(8,20,45,0) 35%, rgba(8,20,45,0.6) 68%, rgba(8,20,45,0.88) 100%)',
                }}
              />



              {/* Overlay text — fades in when pill is fully expanded */}
              <div
                ref={overlayRef}
                className="absolute inset-0 flex flex-col items-center justify-end pb-14 px-6 z-10 pointer-events-none"
                style={{ opacity: 0 }}
              >
                <div
                  className="max-w-2xl w-full text-center pointer-events-auto"
                  style={{
                    background: 'radial-gradient(ellipse at center bottom, rgba(8,20,45,0.72) 0%, transparent 75%)',
                    paddingTop: '3rem',
                  }}
                >
                  <p className="font-bold text-white/70 mb-3" style={{ fontSize: '10px', letterSpacing: '0.45em' }}>
                    MJ Logistics Enterprise
                  </p>
                  <h2
                    className="font-bold text-white leading-[1.1] mb-4"
                    style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', textShadow: '0 2px 24px rgba(0,0,0,0.6)' }}
                  >
                    Precision Logistics.<br />
                    <span className="italic font-normal" style={{ color: '#e8c87a' }}>
                      Delivered Every Time.
                    </span>
                  </h2>
                  <p
                    className="text-white/85 leading-relaxed max-w-lg mx-auto mb-7"
                    style={{ fontSize: '14px', textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}
                  >
                    Freight forwarding, warehousing, and last-mile delivery —
                    trusted by businesses across the region.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <a
                      href="/divisions"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0d1f3c] font-bold text-[13px] rounded-xl hover:bg-white/90 transition-all shadow-lg"
                    >
                      Our Divisions
                    </a>
                    <a
                      href="/shop"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 backdrop-blur border border-white/35 text-white font-bold text-[13px] rounded-xl hover:bg-white/25 transition-all"
                    >
                      Shop Parts
                    </a>
                  </div>
                </div>
              </div>
            </div>



          </div>
        </div>
      </section>
    </>
  );
}
