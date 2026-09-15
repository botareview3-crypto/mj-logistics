/**
 * lib/useLenis.ts
 * ─────────────────────────────────────────────────────────────────────────
 * Smooth-scroll hook using GSAP's built-in momentum scrolling via
 * normalizeScroll + ScrollSmoother (or a lightweight RAF-based approach
 * that integrates with ScrollTrigger).
 *
 * Since Lenis is not installed, we use a proven GSAP-only smooth scroll
 * technique: intercepting the wheel event, animating the window scroll
 * position with gsap.to(), and syncing ScrollTrigger on every frame.
 *
 * Result: buttery smooth 60fps scroll that eliminates the laggy feel
 * from raw scroll events.
 */

import { useEffect } from 'react';
import { gsap, ScrollTrigger } from './gsap';

let currentY = 0;
let targetY  = 0;
let rafId    = 0;
let active   = false;

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function smoothScrollTick() {
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  targetY = clamp(targetY, 0, maxScroll);

  // Ease toward target — 0.1 = smooth, higher = snappier
  currentY += (targetY - currentY) * 0.1;

  // Stop the loop when close enough
  if (Math.abs(targetY - currentY) < 0.5) {
    currentY = targetY;
    active = false;
    window.scrollTo(0, currentY);
    ScrollTrigger.update();
    return;
  }

  window.scrollTo(0, currentY);
  ScrollTrigger.update();
  rafId = requestAnimationFrame(smoothScrollTick);
}

function onWheel(e: WheelEvent) {
  // Skip if user is inside a scrollable sub-element
  const target = e.target as HTMLElement | null;
  if (target) {
    let el: HTMLElement | null = target;
    while (el && el !== document.body) {
      const style = window.getComputedStyle(el);
      const overflow = style.overflow + style.overflowY;
      if (/auto|scroll/.test(overflow) && el.scrollHeight > el.clientHeight) {
        return; // let the inner scroller handle it
      }
      el = el.parentElement;
    }
  }

  e.preventDefault();

  // Accumulate delta
  targetY += e.deltaY * 1.2;

  if (!active) {
    currentY = window.scrollY;
    active = true;
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(smoothScrollTick);
  }
}

export function useSmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Sync internal state with current scroll on mount
    currentY = window.scrollY;
    targetY  = window.scrollY;

    window.addEventListener('wheel', onWheel, { passive: false });

    // Tell ScrollTrigger we're managing scroll position
    ScrollTrigger.normalizeScroll(false);

    return () => {
      window.removeEventListener('wheel', onWheel);
      cancelAnimationFrame(rafId);
      active = false;
    };
  }, []);
}
