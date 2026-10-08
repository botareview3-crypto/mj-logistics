/**
 * lib/useLenis.ts
 * ─────────────────────────────────────────────────────────────────────────
 * Site-wide smooth scrolling with Lenis, driven by GSAP's ticker so Lenis
 * and ScrollTrigger always agree on the scroll position. Touch devices keep
 * native scrolling (Lenis' default), and reduced-motion visitors skip it.
 *
 * `getLenis()` exposes the instance so the menu overlay can stop/start
 * scrolling and anchor links can glide to their targets.
 */

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

let lenis: Lenis | null = null;

export function getLenis() {
  return lenis;
}

/** Smoothly scroll to an element/selector/offset, falling back to native. */
export function scrollToTarget(target: string | HTMLElement | number, offset = 0) {
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.4 });
    return;
  }
  if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' });
  else {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: 'smooth' });
  }
}

export function useSmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Re-measure trigger positions whenever the page height changes
    // (images loading, accordions, route changes) — debounced.
    let refreshTimer = 0;
    let lastHeight = document.body.scrollHeight;
    const ro = new ResizeObserver(() => {
      const h = document.body.scrollHeight;
      if (Math.abs(h - lastHeight) < 2) return;
      lastHeight = h;
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    });
    ro.observe(document.body);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return () => { ro.disconnect(); window.clearTimeout(refreshTimer); };
    }

    lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
    });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      ro.disconnect();
      window.clearTimeout(refreshTimer);
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);
}
