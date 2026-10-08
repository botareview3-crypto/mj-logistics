/**
 * lib/fx.ts
 * ─────────────────────────────────────────────────────────────────────────
 * Declarative scroll animation for marketing pages. Mark elements up with
 * data attributes and call `useScrollFx(ref)` once per page:
 *
 *   data-split          <SplitText> heading — words rise out of a mask
 *   data-reveal         fade + rise ("fade" | "scale" variants)
 *   data-clip           image box wipes open from the bottom, image settles
 *   data-parallax="n"   element drifts ±n×100% of its height while scrolling
 *   data-scrub          <ScrubText> paragraph — words light up as you scroll
 *   data-intro="0.2"    play on page intro (after preloader/curtain) with
 *                       that delay, instead of when scrolled into view
 *
 * Initial hidden states live in globals.css under `html.fx`, so there is no
 * flash of visible content and nothing is hidden when JS or motion is off.
 */

import { useEffect, useLayoutEffect, type RefObject } from 'react';
import { gsap, ScrollTrigger } from './gsap';

export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/* ── Intro gate ─────────────────────────────────────────────────────────── */
let introDone = false;
let introQueue: Array<() => void> = [];

/** Run `cb` once the intro has finished. Always async (next frame at the
 *  earliest), so it is safe to call while a gsap.context is still being built. */
export function onIntro(cb: () => void) {
  if (introDone) {
    const id = requestAnimationFrame(cb);
    return () => cancelAnimationFrame(id);
  }
  introQueue.push(cb);
  return () => { introQueue = introQueue.filter(fn => fn !== cb); };
}

export function markIntroDone() {
  introDone = true;
  const queue = introQueue;
  introQueue = [];
  queue.forEach(fn => fn());
}

/** Called by the page curtain before a route change so the next hero waits. */
export function resetIntro() {
  introDone = false;
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ── Element animations ─────────────────────────────────────────────────── */
const EASE = 'expo.out';

function splitTween(el: Element, delay = 0) {
  const inners = el.querySelectorAll('.split-inner');
  // `y: 0` matters: GSAP parses the CSS start state (translateY(110%)) into a
  // pixel `y`, which would otherwise stay applied on top of yPercent.
  return gsap.fromTo(inners, { yPercent: 110, y: 0 }, {
    yPercent: 0, y: 0, duration: 1.25, ease: EASE, stagger: 0.055, delay,
  });
}

function revealTween(el: HTMLElement, delay = 0) {
  const variant = el.dataset.reveal;
  const from = variant === 'scale' ? { opacity: 0, scale: 0.94 } : variant === 'fade' ? { opacity: 0 } : { opacity: 0, y: 36 };
  return gsap.fromTo(el, from, { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: EASE, delay, clearProps: 'transform' });
}

function clipTween(el: HTMLElement, delay = 0) {
  const img = el.querySelector('img, video');
  const tl = gsap.timeline({ delay });
  tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' });
  if (img) tl.fromTo(img, { scale: 1.35 }, { scale: 1, duration: 1.8, ease: EASE }, 0);
  return tl;
}

function animateIn(el: HTMLElement, delay = 0) {
  if (el.hasAttribute('data-split')) return splitTween(el, delay);
  if (el.hasAttribute('data-clip')) return clipTween(el, delay);
  return revealTween(el, delay);
}

/**
 * Wire up every data-fx element inside `scope`. Re-runs when `deps` change.
 * Everything is created inside a gsap.context and reverted on unmount, so
 * pinned sections and triggers never leak between routes.
 */
export function useScrollFx(scope: RefObject<HTMLElement>, deps: unknown[] = []) {
  useIsoLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;
    (window as unknown as { __mjFxReady?: boolean }).__mjFxReady = true;
    if (prefersReducedMotion()) {
      document.documentElement.classList.remove('fx');
      return;
    }

    let cancelIntro = () => {};
    // Callbacks may fire while the context is still being built (elements
    // already in view) — in that case we're inside it anyway, so run directly.
    let ctx: gsap.Context | null = null;
    const add = (fn: () => void) => (ctx ? ctx.add(fn) : fn());
    ctx = gsap.context(() => {
      const all = gsap.utils.toArray<HTMLElement>('[data-split], [data-reveal], [data-clip]', root);

      // Intro elements wait for the preloader / route curtain.
      const intro = all.filter(el => el.hasAttribute('data-intro'));
      const onScroll = all.filter(el => !el.hasAttribute('data-intro'));

      cancelIntro = onIntro(() => {
        add(() => intro.forEach(el => animateIn(el, parseFloat(el.dataset.intro || '0') || 0)));
      });

      onScroll.forEach(el => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          once: true,
          onEnter: () => add(() => animateIn(el, parseFloat(el.dataset.delay || '0') || 0)),
        });
      });

      // Parallax drift
      gsap.utils.toArray<HTMLElement>('[data-parallax]', root).forEach(el => {
        const amount = parseFloat(el.dataset.parallax || '0.15') * 100;
        gsap.fromTo(el, { yPercent: -amount }, {
          yPercent: amount, ease: 'none',
          scrollTrigger: { trigger: el.parentElement || el, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });

      // Scroll-scrubbed word highlighting
      gsap.utils.toArray<HTMLElement>('[data-scrub]', root).forEach(el => {
        const words = el.querySelectorAll('.scrub-word');
        gsap.fromTo(words, { opacity: 0.14 }, {
          opacity: 1, ease: 'none', stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 50%', scrub: 0.6 },
        });
      });
    }, root);

    return () => {
      cancelIntro();
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
