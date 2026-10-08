import React, { useEffect, useRef, useState } from 'react';
import { gsap } from '../../lib/gsap';

/**
 * Signal-orange cursor follower. Grows into a labelled disc over any element
 * with `data-cursor="Label"`. The native cursor stays visible; this is a
 * decorative layer for fine pointers only (hidden by CSS on touch).
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.style.display = 'none'; return; }

    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' });
    el.classList.add('is-hidden');

    const move = (e: MouseEvent) => {
      el.classList.remove('is-hidden');
      xTo(e.clientX);
      yTo(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-cursor]');
      const text = target?.dataset.cursor || '';
      setLabel(text);
      el.classList.toggle('is-label', !!text);
    };
    const leave = () => el.classList.add('is-hidden');

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseover', over);
    document.documentElement.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', over);
      document.documentElement.removeEventListener('mouseleave', leave);
    };
  }, []);

  return (
    <div ref={ref} className="cursor-dot" aria-hidden="true">
      <span className="cursor-label">{label}</span>
    </div>
  );
}
