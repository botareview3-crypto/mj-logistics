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

/* ── Refresh ScrollTrigger (call after dynamic content loads) ────────────── */
export function refreshScrollTrigger() {
  if (typeof window !== 'undefined') {
    ScrollTrigger.refresh();
  }
}
