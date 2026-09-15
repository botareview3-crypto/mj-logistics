/**
 * lib/gsap.ts
 * ─────────────────────────────────────────────────────────────────────────
 * Central GSAP helper.
 * • Registers ScrollTrigger once (safe to call multiple times).
 * • Exposes a typed gsap instance so all pages/components share one bundle.
 * • All imports are from "gsap/dist/gsap" / "gsap/dist/ScrollTrigger"
 *   which are the CJS builds that work with Next.js pages router.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// Register plugin once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  // Smoother default ScrollTrigger refresh
  ScrollTrigger.config({
    limitCallbacks: true,
    ignoreMobileResize: true,
  });
}

export { gsap, ScrollTrigger };

/* ── Convenience: batch-animate [data-gsap] elements in a container ─────── */
export function animateDataGsap(
  container: HTMLElement | Document = document,
) {
  if (typeof window === 'undefined') return;

  const fadeUp = container.querySelectorAll<HTMLElement>('[data-gsap="fade-up"]');
  const fadeLeft = container.querySelectorAll<HTMLElement>('[data-gsap="fade-left"]');
  const fadeRight = container.querySelectorAll<HTMLElement>('[data-gsap="fade-right"]');
  const scaleIn = container.querySelectorAll<HTMLElement>('[data-gsap="scale-in"]');
  const staggerGroups = container.querySelectorAll<HTMLElement>('[data-gsap="stagger-parent"]');

  const defaults = {
    ease: 'power3.out',
    duration: 0.75,
    clearProps: 'will-change',
  };

  fadeUp.forEach((el) => {
    gsap.to(el, {
      ...defaults,
      opacity: 1,
      y: 0,
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onComplete: () => el.setAttribute('data-gsap-done', ''),
    });
  });

  fadeLeft.forEach((el) => {
    gsap.to(el, {
      ...defaults,
      opacity: 1,
      x: 0,
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onComplete: () => el.setAttribute('data-gsap-done', ''),
    });
  });

  fadeRight.forEach((el) => {
    gsap.to(el, {
      ...defaults,
      opacity: 1,
      x: 0,
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onComplete: () => el.setAttribute('data-gsap-done', ''),
    });
  });

  scaleIn.forEach((el) => {
    gsap.to(el, {
      ...defaults,
      opacity: 1,
      scale: 1,
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onComplete: () => el.setAttribute('data-gsap-done', ''),
    });
  });

  staggerGroups.forEach((parent) => {
    const children = parent.querySelectorAll<HTMLElement>('[data-gsap="stagger-up"]');
    if (!children.length) return;
    gsap.to(children, {
      ...defaults,
      opacity: 1,
      y: 0,
      stagger: 0.08,
      scrollTrigger: { trigger: parent, start: 'top 85%', once: true },
      onComplete: () => children.forEach(c => c.setAttribute('data-gsap-done', '')),
    });
  });
}

/* ── Refresh ScrollTrigger (call after dynamic content loads) ────────────── */
export function refreshScrollTrigger() {
  if (typeof window !== 'undefined') {
    ScrollTrigger.refresh();
  }
}

/* ── Kill all ScrollTriggers (call on page unmount / route change) ───────── */
export function killAllScrollTriggers() {
  if (typeof window !== 'undefined') {
    ScrollTrigger.getAll().forEach((t) => t.kill());
  }
}
