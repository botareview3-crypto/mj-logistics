/**
 * lib/fx.ts
 * ─────────────────────────────────────────────────────────────────────────
 * Light, declarative reveal animations for marketing pages. Mark elements up
 * with data attributes and call `useScrollFx(ref)` once per page:
 *
 *   data-split          <SplitText> heading — words rise out of a mask
 *   data-reveal         fade + rise ("fade" | "scale" variants)
 *   data-clip           image box wipes open from the bottom
 *   data-parallax="n"   element drifts gently while scrolling (transform only)
 *   data-scrub          <ScrubText> paragraph — words brighten as you scroll
 *   data-intro="0.2"    above-the-fold: animate on page load with that delay
 *   data-delay="0.1"    extra delay when revealed on scroll
 *
 * Built to fail open: hidden start states only exist under `html.fx` (set
 * before paint in _document), reveals use IntersectionObserver (independent
 * of ScrollTrigger layout maths), anything already scrolled past is shown
 * immediately, and a safety timer reveals everything if animation setup
 * fails for any reason. Content can never stay invisible.
 */

import { useEffect, useLayoutEffect, type RefObject } from 'react';
import { gsap } from './gsap';

export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const EASE = 'expo.out';
const REVEAL_SELECTOR = '[data-split], [data-reveal], [data-clip]';

/** Put an element in its final, visible state with no animation. */
function show(el: HTMLElement) {
  el.querySelectorAll<HTMLElement>('.split-inner').forEach(i => { i.style.transform = 'none'; });
  el.style.opacity = '1';
  el.style.transform = 'none';
  el.style.clipPath = 'none';
  el.setAttribute('data-shown', '');
}

/** True when an element (and its split words) are fully in their visible state. */
function isVisible(el: HTMLElement) {
  const cs = getComputedStyle(el);
  if (parseFloat(cs.opacity) < 0.99) return false;
  if (cs.clipPath && cs.clipPath !== 'none' && !/inset\(0(px|%)?\)|inset\(0% 0% 0% 0%\)/.test(cs.clipPath)) return false;
  for (const inner of Array.from(el.querySelectorAll<HTMLElement>('.split-inner'))) {
    const t = getComputedStyle(inner).transform;
    if (t && t !== 'none' && Math.abs(new DOMMatrixReadOnly(t).m42) > 1) return false;
  }
  return true;
}

function animateIn(el: HTMLElement, delay = 0) {
  if (el.hasAttribute('data-shown')) return;
  el.setAttribute('data-shown', '');
  if (el.hasAttribute('data-split')) {
    // `y: 0` matters: GSAP reads the CSS start state as a pixel `y`.
    gsap.fromTo(el.querySelectorAll('.split-inner'), { yPercent: 105, y: 0 }, {
      yPercent: 0, y: 0, duration: 1.1, ease: EASE, stagger: 0.04, delay, clearProps: 'transform',
    });
  } else if (el.hasAttribute('data-clip')) {
    gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.inOut', delay, clearProps: 'clipPath',
    });
  } else {
    const variant = el.dataset.reveal;
    const from = variant === 'scale' ? { opacity: 0, scale: 0.96 } : variant === 'fade' ? { opacity: 0 } : { opacity: 0, y: 28 };
    gsap.fromTo(el, from, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: EASE, delay, clearProps: 'transform,opacity' });
  }
}

/**
 * Wire up every animated element inside `scope`. Re-runs when `deps` change;
 * everything is reverted on unmount.
 */
export function useScrollFx(scope: RefObject<HTMLElement>, deps: unknown[] = []) {
  useIsoLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;
    (window as unknown as { __mjFxReady?: boolean }).__mjFxReady = true;

    const all = Array.from(root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      all.forEach(show);
      document.documentElement.classList.remove('fx');
      return;
    }

    let observer: IntersectionObserver | null = null;

    // Safety net: anything on or above the screen that still isn't visible —
    // never observed, or its tween stalled because the browser isn't painting
    // frames (background tab, throttled device) — is snapped to its final state.
    // Runs after load and whenever scrolling settles, so nothing can stay hidden.
    const settle = () => {
      all.forEach(el => {
        if (el.getBoundingClientRect().top >= window.innerHeight || isVisible(el)) return;
        gsap.killTweensOf(el);
        gsap.killTweensOf(el.querySelectorAll('.split-inner'));
        show(el);
      });
    };
    const safety = window.setTimeout(settle, 2500);
    let scrollTimer = 0;
    const onScroll = () => {
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(settle, 1200);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const ctx = gsap.context(() => {
      try {
        // Above-the-fold elements play on load.
        all.filter(el => el.hasAttribute('data-intro'))
          .forEach(el => animateIn(el, parseFloat(el.dataset.intro || '0') || 0));

        const rest = all.filter(el => !el.hasAttribute('data-intro'));
        // Anything already scrolled past (restored scroll, anchor links) is shown at once.
        rest.forEach(el => { if (el.getBoundingClientRect().bottom < 0) show(el); });

        observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            observer?.unobserve(el);
            ctx.add(() => animateIn(el, parseFloat(el.dataset.delay || '0') || 0));
          });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
        rest.forEach(el => { if (!el.hasAttribute('data-shown')) observer?.observe(el); });

        // Parallax drift (transform only — never affects visibility).
        gsap.utils.toArray<HTMLElement>('[data-parallax]', root).forEach(el => {
          const amount = parseFloat(el.dataset.parallax || '0.08') * 100;
          gsap.fromTo(el, { yPercent: -amount }, {
            yPercent: amount, ease: 'none',
            scrollTrigger: { trigger: el.parentElement || el, start: 'top bottom', end: 'bottom top', scrub: true },
          });
        });

        // Words brighten as the paragraph scrolls through view.
        gsap.utils.toArray<HTMLElement>('[data-scrub]', root).forEach(el => {
          gsap.fromTo(el.querySelectorAll('.scrub-word'), { opacity: 0.18 }, {
            opacity: 1, ease: 'none', stagger: 0.1,
            scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 55%', scrub: 0.5 },
          });
        });
      } catch {
        all.forEach(show);
        document.documentElement.classList.remove('fx');
      }
    }, root);

    return () => {
      window.clearTimeout(safety);
      window.clearTimeout(scrollTimer);
      window.removeEventListener('scroll', onScroll);
      observer?.disconnect();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
