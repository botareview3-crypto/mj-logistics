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

import React, { useRef, useEffect, useState } from 'react';
import { Volume2, VolumeX, ArrowRight } from 'lucide-react';
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

  const [muted, setMuted] = useState(true);

  /* ── Play mobile video when it enters viewport ─────────────────────── */
  useEffect(() => {
    const vid = videoMobile.current;
    if (!vid) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) vid.play().catch(() => {});
        else vid.pause();
      },
      { threshold: 0.2 }
    );
    obs.observe(vid);
    return () => obs.disconnect();
  }, []);

  /* ── GSAP desktop animation ───────────────────────────────────────── */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!sectionRef.current || !stickyRef.current || !pillRef.current) return;

    // Autoplay desktop video on intersection
    const vid = videoDesktop.current;
    let videoObserver: IntersectionObserver | null = null;
    if (vid) {
      videoObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && vid.paused) vid.play().catch(() => {});
        },
        { threshold: 0.1 }
      );
      videoObserver.observe(vid);
    }

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
          onUpdate: (self) => {
            if (vid && self.progress > 0.08 && vid.paused) {
              vid.play().catch(() => {});
            }
          },
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
      videoObserver?.disconnect();
    };
  }, []);

  const toggleMute = () => {
    setMuted(m => {
      const next = !m;
      if (videoDesktop.current) videoDesktop.current.muted = next;
      if (videoMobile.current)  videoMobile.current.muted  = next;
      return next;
    });
  };

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
        {/* Full-bleed background video */}
        <video
          ref={videoMobile}
          src="/logistics-video.mp4"
          poster="/aerial-view-container-cargo-ship-sea.webp"
          loop
          muted
          playsInline
          preload="metadata"
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
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={muted ? 'Unmute video' : 'Mute video'}
                  className="video-ctrl-btn"
                >
                  {muted
                    ? <VolumeX className="w-4 h-4 text-white" />
                    : <Volume2 className="w-4 h-4 text-white" />}
                </button>
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
              className="absolute right-0 top-0 h-full flex items-center px-10 pointer-events-none z-10"
              style={{ width: '48vw' }}
            >
              <div className="w-full max-w-sm pointer-events-auto">
                <div className="bg-white rounded-2xl p-8 shadow-2xl border border-slate-100">
                  <p
                    className="text-[9px] font-bold uppercase text-[#1e4d8c] mb-3"
                    style={{ letterSpacing: '0.4em' }}
                  >
                    Our Operations
                  </p>
                  <h2
                    className="font-bold text-[#0d1f3c] leading-[1.1] mb-4"
                    style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)' }}
                  >
                    Logistics at<br />
                    <span className="italic font-normal" style={{ color: '#1e4d8c' }}>
                      Every Scale
                    </span>
                  </h2>
                  <p className="text-slate-500 text-[13px] leading-relaxed mb-6">
                    From port to doorstep — MJ Logistics handles freight,
                    customs clearance, warehousing, and last-mile delivery.
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6 py-5 border-y border-slate-100">
                    {[
                      { value: '15+',  label: 'Years experience' },
                      { value: '10k+', label: 'Parts delivered'  },
                      { value: '98%',  label: 'On-time rate'     },
                      { value: '24/7', label: 'Support'          },
                    ].map(s => (
                      <div key={s.label}>
                        <p className="font-bold text-[#0d1f3c]" style={{ fontSize: '1.4rem' }}>{s.value}</p>
                        <p className="text-slate-400 mt-0.5" style={{ fontSize: '9px', letterSpacing: '0.1em' }}>{s.label}</p>
                      </div>
                    ))}
                  </div>

                  <a
                    href="/divisions"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0d1f3c] text-white font-bold text-[12px] rounded-xl hover:bg-[#1a3560] transition-colors"
                  >
                    Our Divisions <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
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
                src="/logistics-video.mp4"
                poster="/aerial-view-container-cargo-ship-sea.webp"
                loop
                muted={muted}
                playsInline
                preload="metadata"
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

            {/* Scroll cue */}
            <div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none select-none"
              style={{ opacity: 0.5 }}
            >
              <span className="text-slate-400" style={{ fontSize: '8px', letterSpacing: '0.3em' }}>Scroll</span>
              <div className="w-5 h-8 rounded-full border border-slate-300/60 flex items-start justify-center pt-1.5">
                <div className="w-1 h-2.5 rounded-full bg-slate-400/70 animate-bounce" />
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
