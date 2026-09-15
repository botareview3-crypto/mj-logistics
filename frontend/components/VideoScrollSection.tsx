/**
 * VideoScrollSection.tsx
 * ─────────────────────────────────────────────────────────────────────────
 * GSAP-powered scroll-pinned video expand animation.
 *
 * Architecture:
 * • The outer section is 280vh tall (scroll container).
 * • The inner sticky div is pinned via GSAP ScrollTrigger `pin: true`.
 * • All visual values (width, height, borderRadius, bg colour, opacity)
 *   are driven by a single scrub timeline — no rAF loops, no setState
 *   per scroll tick, no React re-renders during scroll.
 * • GSAP handles the interpolation natively on the GPU-composited layer.
 *   This eliminates the React setState → reconcile → paint lag chain.
 */

import React, { useRef, useEffect, useState } from 'react';
import { Volume2, VolumeX, ArrowRight } from 'lucide-react';
import { gsap, ScrollTrigger } from '../lib/gsap';

export function VideoScrollSection() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const stickyRef   = useRef<HTMLDivElement>(null);
  const pillRef     = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const overlayRef  = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const videoRef    = useRef<HTMLVideoElement>(null);
  const bgRef       = useRef<HTMLDivElement>(null);

  const [muted, setMuted] = useState(true);
  // On mobile we skip the entire heavy scroll animation and video load
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const toggleMute = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    setMuted(vid.muted);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Skip all GSAP + video work on mobile — the static fallback renders instead
    if (window.matchMedia('(max-width: 767px)').matches) return;
    if (!sectionRef.current || !stickyRef.current || !pillRef.current) return;

    // Start video when it enters the viewport
    const videoObserver = new IntersectionObserver(
      ([entry]) => {
        const vid = videoRef.current;
        if (!vid) return;
        if (entry.isIntersecting && vid.paused) vid.play().catch(() => {});
      },
      { threshold: 0.1 }
    );
    if (videoRef.current) videoObserver.observe(videoRef.current);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,           // smooth scrub (higher = more lag-behind)
          pin: stickyRef.current,
          pinSpacing: false,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Autoplay video once scroll begins
            const vid = videoRef.current;
            if (vid && self.progress > 0.08 && vid.paused) {
              vid.play().catch(() => {});
            }
          },
        },
      });

      // ── Phase 1 (0–15%): hold initial state ──────────────────────────
      tl.to({}, { duration: 0.15 });

      // ── Phase 2 (15–85%): expand pill to full screen ─────────────────
      tl.to(
        pillRef.current,
        {
          width: '100vw',
          height: '100vh',
          borderRadius: '0px',
          left: '0px',
          duration: 0.7,
          ease: 'none',
        },
        '<',
      );

      // Fade right panel out while pill expands
      tl.to(
        rightPanelRef.current,
        { opacity: 0, duration: 0.25, ease: 'none' },
        '<',
      );

      // Background: white → deep navy
      tl.to(
        bgRef.current,
        {
          backgroundColor: 'rgb(8,20,45)',
          duration: 0.5,
          ease: 'none',
        },
        '<0.2',
      );

      // Gradient scrim inside video
      tl.to(
        gradientRef.current,
        { opacity: 1, duration: 0.4, ease: 'none' },
        '<',
      );

      // ── Phase 3 (85–100%): overlay text fades in ─────────────────────
      tl.to(
        overlayRef.current,
        { opacity: 1, duration: 0.15, ease: 'none' },
        '>-0.1',
      );
    }, sectionRef);

    return () => {
      ctx.revert();
      videoObserver.disconnect();
    };
  }, []);

  return (
    <>
    {/* ── MOBILE: lightweight static card, no video loaded ───────────── */}
    {isMobile && (
      <section className="relative overflow-hidden rounded-3xl bg-[#071a33] px-6 py-14 text-white my-8"
        aria-label="MJ Logistics operations">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_0%,rgba(30,77,140,.5),transparent_60%)]" aria-hidden="true" />
        <div className="relative max-w-sm mx-auto text-center">
          <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#55b8ff] mb-3">Our Operations</p>
          <h2 className="text-3xl font-bold text-white leading-tight mb-3">
            Logistics at <span className="italic font-normal text-[#e8c87a]">Every Scale</span>
          </h2>
          <p className="text-white/70 text-sm leading-relaxed mb-6">
            From port to doorstep — MJ Logistics handles freight, customs clearance,
            warehousing, and last-mile delivery.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-6 py-5 border-y border-white/10">
            {[
              { value: '15+', label: 'Years experience' },
              { value: '10k+', label: 'Parts delivered'  },
              { value: '98%', label: 'On-time rate'      },
              { value: '24/7', label: 'Support'           },
            ].map(s => (
              <div key={s.label}>
                <p className="text-xl font-bold text-white">{s.value}</p>
                <p className="text-white/45 text-[10px] uppercase tracking-wider mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
          <a href="/divisions"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0d1f3c] font-bold text-sm rounded-xl">
            Our Divisions <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    )}

    {/* ── DESKTOP: full GSAP scroll-pinned video ──────────────────────── */}
    {!isMobile && (
    <section
      ref={sectionRef}
      className="video-scroll-section relative"
      style={{ height: '280vh' }}
      aria-label="MJ Logistics operations video"
    >
      {/* ── Sticky viewport ─────────────────────────────────────────────── */}
      <div
        ref={stickyRef}
        className="w-full overflow-hidden flex items-center"
        style={{ height: '100vh' }}
      >
        {/* Background div that transitions colour */}
        <div
          ref={bgRef}
          className="absolute inset-0"
          style={{ backgroundColor: 'rgb(255,255,255)' }}
          aria-hidden="true"
        />

        <div className="relative w-full h-full flex items-center justify-center">

          {/* ── RIGHT TEXT PANEL ──────────────────────────────────────────── */}
          <div
            ref={rightPanelRef}
            className="absolute right-0 top-0 h-full flex items-center px-10 pointer-events-none z-10"
            style={{ width: '46vw' }}
          >
            <div className="w-full max-w-sm pointer-events-auto">
              <div className="bg-white rounded-2xl p-8 shadow-2xl border border-slate-100">
                <p
                  className="text-[9px] font-bold uppercase text-[#1e4d8c] mb-3"
                  style={{ letterSpacing: '0.4em', fontFamily: "'Chopin Trial', serif" }}
                >
                  Our Operations
                </p>
                <h2
                  className="font-bold text-[#0d1f3c] leading-[1.1] mb-4"
                  style={{
                    fontFamily: "'Chopin Trial', serif",
                    fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)',
                  }}
                >
                  Logistics at<br />
                  <span
                    className="italic font-normal"
                    style={{ color: '#1e4d8c', fontFamily: "'Chopin Trial', serif" }}
                  >
                    Every Scale
                  </span>
                </h2>
                <p className="text-slate-500 text-[13px] leading-relaxed mb-6">
                  From port to doorstep — MJ Logistics handles freight,
                  customs clearance, warehousing, and last-mile delivery.
                  Genuine parts and supplies, on time, every time.
                </p>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-4 mb-6 py-5 border-y border-slate-100">
                  {[
                    { value: '15+',  label: 'Years experience' },
                    { value: '10k+', label: 'Parts delivered'  },
                    { value: '98%',  label: 'On-time rate'     },
                    { value: '24/7', label: 'Support'          },
                  ].map(s => (
                    <div key={s.label}>
                      <p
                        className="font-bold text-[#0d1f3c]"
                        style={{ fontFamily: "'Chopin Trial', serif", fontSize: '1.4rem' }}
                      >
                        {s.value}
                      </p>
                      <p
                        className="text-slate-400 mt-0.5"
                        style={{ fontSize: '9px', letterSpacing: '0.1em', fontFamily: "'Chopin Trial', serif" }}
                      >
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>

                <a
                  href="/divisions"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0d1f3c] text-white font-bold text-[12px] rounded-xl hover:bg-[#1a3560] transition-colors"
                  style={{ fontFamily: "'Chopin Trial', serif" }}
                >
                  Our Divisions <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* ── VIDEO PILL ────────────────────────────────────────────────── */}
          <div
            ref={pillRef}
            className="absolute top-1/2 overflow-hidden shadow-2xl video-pill"
            style={{
              width: '50vw',
              height: '55vh',
              borderRadius: '20px',
              left: '0px',
              transform: 'translateY(-50%)',
              willChange: 'width, height, border-radius, left',
            }}
          >
            <video
              ref={videoRef}
              src="/hero-video.mp4"
              poster="/images/homepage/aerial-view-container-cargo-ship-sea.webp"
              loop
              muted={muted}
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Bottom gradient scrim */}
            <div
              ref={gradientRef}
              className="absolute inset-0 pointer-events-none"
              style={{
                opacity: 0,
                background: [
                  'linear-gradient(to bottom,',
                  '  rgba(8,20,45,0.0)  0%,',
                  '  rgba(8,20,45,0.0)  35%,',
                  '  rgba(8,20,45,0.60) 68%,',
                  '  rgba(8,20,45,0.88) 100%)',
                ].join(''),
              }}
            />

            {/* Mute toggle */}
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? 'Unmute' : 'Mute'}
              className="video-ctrl-btn absolute top-4 right-4 z-20"
            >
              {muted
                ? <VolumeX className="w-4 h-4 text-white" />
                : <Volume2 className="w-4 h-4 text-white" />}
            </button>

            {/* ── OVERLAY TEXT — fades in when fully expanded ──────────── */}
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
                <p
                  className="font-bold text-white/70 mb-3"
                  style={{
                    fontFamily: "'Chopin Trial', serif",
                    fontSize: '10px',
                    letterSpacing: '0.45em',
                  }}
                >
                  MJ Logistics Enterprise
                </p>
                <h2
                  className="font-bold text-white leading-[1.1] mb-4"
                  style={{
                    fontFamily: "'Chopin Trial', serif",
                    fontSize: 'clamp(1.8rem, 4vw, 3.2rem)',
                    textShadow: '0 2px 24px rgba(0,0,0,0.6)',
                  }}
                >
                  Precision Logistics.<br />
                  <span
                    className="italic font-normal"
                    style={{ color: '#e8c87a', fontFamily: "'Chopin Trial', serif" }}
                  >
                    Delivered Every Time.
                  </span>
                </h2>
                <p
                  className="text-white/85 leading-relaxed max-w-lg mx-auto mb-7"
                  style={{
                    fontSize: '14px',
                    textShadow: '0 1px 8px rgba(0,0,0,0.5)',
                    fontFamily: "'Chopin Trial', serif",
                  }}
                >
                  Freight forwarding, warehousing, and last-mile delivery —
                  trusted by businesses across the region.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <a
                    href="/divisions"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0d1f3c] font-bold text-[13px] rounded-xl hover:bg-white/90 transition-all shadow-lg"
                    style={{ fontFamily: "'Chopin Trial', serif" }}
                  >
                    Our Divisions
                  </a>
                  <a
                    href="/shop"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 backdrop-blur border border-white/35 text-white font-bold text-[13px] rounded-xl hover:bg-white/25 transition-all"
                    style={{ fontFamily: "'Chopin Trial', serif" }}
                  >
                    Shop Parts
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ── Scroll cue ────────────────────────────────────────────────── */}
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none select-none"
            style={{ opacity: 0.5 }}
          >
            <span
              className="text-slate-400"
              style={{ fontSize: '8px', letterSpacing: '0.3em', fontFamily: "'Chopin Trial', serif" }}
            >
              Scroll
            </span>
            <div className="w-5 h-8 rounded-full border border-slate-300/60 flex items-start justify-center pt-1.5">
              <div className="w-1 h-2.5 rounded-full bg-slate-400/70 animate-bounce" />
            </div>
          </div>

        </div>
      </div>
    </section>
    )}
    </>
  );
}
