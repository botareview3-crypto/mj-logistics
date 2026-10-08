import React, { useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { markIntroDone, useIsoLayoutEffect } from '../../lib/fx';
import { getLenis } from '../../lib/useLenis';
import { LogoMark } from './Logo';

/**
 * First-visit intro: the five logo shards fly together, a counter runs to
 * 100, then the panel lifts away and the page's hero plays (via the intro
 * gate in lib/fx). Shown once per browser session; the overlay is rendered
 * on the server but only visible while <html> has `intro-pending`, which the
 * boot script in _document sets — so there is no flash either way.
 */
export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const root = ref.current;
    const html = document.documentElement;
    if (!root || !html.classList.contains('intro-pending')) {
      markIntroDone();
      return;
    }

    try { sessionStorage.setItem('mj-intro', '1'); } catch { /* storage blocked — intro just replays */ }
    getLenis()?.stop();

    const counter = { v: 0 };
    const num = root.querySelector<HTMLElement>('[data-count]');
    const shards = root.querySelectorAll('.mj-shard');

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          html.classList.remove('intro-pending');
          getLenis()?.start();
        },
      });
      tl.from(shards, {
        x: () => gsap.utils.random(-220, 220),
        y: () => gsap.utils.random(-160, 160),
        rotate: () => gsap.utils.random(-140, 140),
        opacity: 0,
        transformOrigin: '50% 50%',
        duration: 1.3,
        ease: 'expo.out',
        stagger: 0.06,
      })
        .to(counter, {
          v: 100, duration: 1.5, ease: 'power2.inOut',
          onUpdate: () => { if (num) num.textContent = String(Math.round(counter.v)).padStart(3, '0'); },
        }, 0)
        .from('[data-pre-line]', { scaleX: 0, transformOrigin: 'left', duration: 1.5, ease: 'power2.inOut' }, 0)
        .from('[data-pre-text] > span', { yPercent: 110, duration: 0.9, ease: 'expo.out', stagger: 0.08 }, 0.25)
        .to('[data-pre-mark]', { scale: 0.82, rotate: 72, duration: 0.7, ease: 'expo.inOut' }, 1.55)
        .to('[data-pre-text] > span, [data-count]', { yPercent: -110, duration: 0.6, ease: 'expo.in', stagger: 0.04 }, 1.55)
        .add(() => markIntroDone(), 2.05)
        .to(root, { yPercent: -100, duration: 1.05, ease: 'expo.inOut' }, 1.95);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="mj-preloader fixed inset-0 z-[400] hidden flex-col justify-between overflow-hidden bg-ink p-6 text-paper sm:p-10 grain"
      aria-hidden="true"
    >
      <div className="eyebrow flex justify-between text-mint/70">
        <span>MJ Logistics Enterprise</span>
        <span>Auto · Mining · Solar</span>
      </div>
      <div className="flex justify-center">
        <div data-pre-mark>
          <LogoMark tone="light" className="h-28 w-28 sm:h-36 sm:w-36" />
        </div>
      </div>
      <div>
        <div className="mb-5 h-px w-full bg-paper/15">
          <div data-pre-line className="h-px w-full bg-signal" />
        </div>
        <div className="flex items-end justify-between gap-6">
          <p data-pre-text className="font-display overflow-hidden text-lg font-semibold sm:text-2xl">
            <span className="inline-block">Parts that fit.</span>{' '}
            <span className="inline-block text-signal">Delivered fast.</span>
          </p>
          <span className="overflow-hidden">
            <span data-count className="font-display inline-block text-5xl font-extrabold tabular-nums sm:text-7xl">000</span>
          </span>
        </div>
      </div>
      <style>{`html.intro-pending .mj-preloader{display:flex}`}</style>
    </div>
  );
}
