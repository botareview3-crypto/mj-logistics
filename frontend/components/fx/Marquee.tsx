import React, { useRef } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { useIsoLayoutEffect, prefersReducedMotion } from '../../lib/fx';

/**
 * Infinite marquee that speeds up with scroll velocity and flips direction
 * when the visitor scrolls back up.
 */
export function Marquee({
  children,
  speed = 40,
  reverse = false,
  className = '',
}: {
  children: React.ReactNode;
  /** seconds for one full loop */
  speed?: number;
  reverse?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const tracks = el.querySelectorAll('.marquee-track');
      const loop = gsap.fromTo(tracks, { xPercent: reverse ? -100 : 0 }, {
        xPercent: reverse ? 0 : -100, duration: speed, ease: 'none', repeat: -1,
      });
      let settle: gsap.core.Tween | null = null;
      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: self => {
          const boost = gsap.utils.clamp(1, 6, Math.abs(self.getVelocity()) / 250);
          settle?.kill();
          loop.timeScale(boost * self.direction);
          settle = gsap.to(loop, { timeScale: self.direction, duration: 1.2, ease: 'power2.out' });
        },
      });
    }, el);
    return () => ctx.revert();
  }, [speed, reverse]);

  return (
    <div ref={ref} className={`marquee ${className}`} aria-hidden="true">
      <div className="marquee-track">{children}</div>
      <div className="marquee-track">{children}</div>
    </div>
  );
}
