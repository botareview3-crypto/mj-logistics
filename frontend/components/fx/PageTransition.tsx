import React, { useEffect, useRef } from 'react';
import Router from 'next/router';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { markIntroDone, resetIntro, prefersReducedMotion } from '../../lib/fx';
import { getLenis } from '../../lib/useLenis';
import { LogoMark } from './Logo';

/**
 * Emerald curtain that sweeps over the screen between marketing pages, then
 * lifts to reveal the next page as its hero intro plays. Query/hash-only
 * changes and moves into the shop are left alone so browsing stays instant.
 */
export function PageTransition({ paths }: { paths: string[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const clean = (url: string) => {
      const p = url.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
      return p;
    };
    let covering: Promise<void> | null = null;
    let active = false;

    const onStart = (url: string) => {
      const from = clean(Router.asPath);
      const to = clean(url);
      if (from === to || !paths.includes(from) || !paths.includes(to) || prefersReducedMotion()) return;
      active = true;
      resetIntro();
      getLenis()?.stop();
      gsap.killTweensOf(el);
      covering = new Promise(resolve => {
        gsap.fromTo(el, { yPercent: 100 }, {
          yPercent: 0, duration: 0.7, ease: 'expo.inOut', onComplete: () => resolve(),
        });
        gsap.fromTo(el.querySelector('svg'), { rotate: -90, scale: 0.6, opacity: 0 }, {
          rotate: 0, scale: 1, opacity: 1, duration: 0.8, ease: 'expo.out', delay: 0.2,
        });
      });
    };

    const onDone = async () => {
      if (!active) return;
      active = false;
      await covering;
      window.scrollTo(0, 0);
      getLenis()?.scrollTo(0, { immediate: true, force: true });
      getLenis()?.start();
      ScrollTrigger.refresh();
      markIntroDone();
      gsap.to(el, { yPercent: -100, duration: 0.9, ease: 'expo.inOut', delay: 0.05 });
    };

    const onError = () => {
      if (!active) return;
      active = false;
      getLenis()?.start();
      markIntroDone();
      gsap.to(el, { yPercent: 100, duration: 0.5, ease: 'expo.in' });
    };

    Router.events.on('routeChangeStart', onStart);
    Router.events.on('routeChangeComplete', onDone);
    Router.events.on('routeChangeError', onError);
    return () => {
      Router.events.off('routeChangeStart', onStart);
      Router.events.off('routeChangeComplete', onDone);
      Router.events.off('routeChangeError', onError);
    };
  }, [paths]);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[350] flex items-center justify-center bg-forest"
      style={{ transform: 'translateY(100%)' }}
      aria-hidden="true"
    >
      <LogoMark tone="light" className="h-20 w-20" />
    </div>
  );
}
