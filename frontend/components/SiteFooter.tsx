import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, CheckCircle2, Mail, MapPin } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { gsap } from '../lib/gsap';
import { useIsoLayoutEffect, prefersReducedMotion } from '../lib/fx';
import { scrollToTarget } from '../lib/useLenis';
import { LogoMark } from './fx/Logo';
import { Magnetic } from './fx/Magnetic';

const FOOTER_LINKS: Record<string, { label: string; href: string }[]> = {
  Divisions: [
    { label: 'Auto Parts',          href: '/shop' },
    { label: 'Stationery & Office', href: '/stationery' },
    { label: 'MJ Mining',           href: '/mining' },
    { label: 'MJ Solar',            href: '/solar' },
  ],
  Shop: [
    { label: 'Browse catalogue',      href: '/catalog' },
    { label: 'Braking system',        href: '/catalog/braking-system' },
    { label: 'Engine & transmission', href: '/catalog/engine-transmission' },
    { label: 'Tyres & wheels',        href: '/catalog/tires-wheels' },
    { label: 'My garage',             href: '/garage' },
  ],
  Company: [
    { label: 'About us',       href: '/divisions' },
    { label: 'Why MJ',         href: '/advantages' },
    { label: 'Contact',        href: '/contact' },
    { label: 'Privacy policy', href: '/privacy' },
    { label: 'Terms of sale',  href: '/terms' },
  ],
};

export const SiteFooter: React.FC = () => {
  const { showToast } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const ref = useRef<HTMLElement>(null);

  // Giant wordmark rises letter by letter as the footer scrolls in.
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-foot-letter]', { yPercent: 100 }, {
        yPercent: 0, ease: 'expo.out', duration: 1.4, stagger: 0.04,
        scrollTrigger: { trigger: '[data-foot-word]', start: 'top 98%' },
      });
      gsap.fromTo('[data-foot-mark]', { rotate: -120, scale: 0.4, opacity: 0 }, {
        rotate: 0, scale: 1, opacity: 1, ease: 'expo.out', duration: 1.6,
        scrollTrigger: { trigger: '[data-foot-cta]', start: 'top 80%' },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    showToast('Subscribed! Thank you.', 'success');
  };

  return (
    <footer ref={ref} className="grain relative overflow-hidden bg-ink text-paper" data-theme="dark">
      {/* ── Closing CTA ─────────────────────────────────────────────────── */}
      <div data-foot-cta className="mx-auto max-w-[1440px] px-5 pt-24 sm:px-8 lg:pt-32">
        <div className="flex flex-col gap-10 border-b border-paper/10 pb-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow mb-6 flex items-center gap-3 text-mint/70">
              <span data-foot-mark className="inline-block"><LogoMark tone="light" className="h-6 w-6" /></span>
              Have something to move?
            </p>
            <h2 className="t-xl font-extrabold">
              Tell us what you need.<br />
              <span className="text-signal">We&apos;ll handle the rest.</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Magnetic>
              <Link href="/contact" className="btn btn-signal">
                Request a quote <ArrowUpRight className="btn-arrow h-4 w-4" />
              </Link>
            </Magnetic>
            <Link href="/shop" className="btn btn-ghost">Shop auto parts</Link>
          </div>
        </div>

        {/* ── Links grid ────────────────────────────────────────────────── */}
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm space-y-6">
            <p className="text-[15px] leading-7 text-paper/65">
              One partner for genuine auto parts, workplace supplies, mining and solar energy —
              sourced, cleared and delivered by MJ Logistics Enterprise.
            </p>
            <ul className="space-y-2.5 text-sm text-paper/65">
              <li className="flex items-center gap-2.5"><MapPin className="h-4 w-4 text-signal" /> Monrovia, Liberia</li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-signal" />
                <a href="mailto:info@mjlogisticsenterprise.com" className="link-draw">info@mjlogisticsenterprise.com</a>
              </li>
            </ul>
            <div>
              <p className="eyebrow mb-3 text-mint/60">Stay updated</p>
              {subscribed ? (
                <p className="flex items-center gap-2 text-sm text-mint"><CheckCircle2 className="h-4 w-4" /> Subscribed! Thank you.</p>
              ) : (
                <form onSubmit={handleSubscribe} className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    aria-label="Email address"
                    className="h-12 w-full rounded-full border border-paper/15 bg-white/5 pl-5 pr-14 text-sm text-paper placeholder:text-paper/35 outline-none transition focus:border-signal"
                  />
                  <button type="submit" aria-label="Subscribe" className="absolute right-1 top-1 grid h-10 w-10 place-items-center rounded-full bg-paper text-ink transition hover:bg-signal hover:text-white">
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="eyebrow mb-5 font-sans text-mint/60" style={{ fontStretch: '100%' }}>{heading}</h3>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="group inline-flex items-center gap-2 text-[15px] text-paper/75 transition-colors hover:text-paper">
                      <span className="h-px w-0 bg-signal transition-all duration-500 group-hover:w-4" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Giant wordmark ─────────────────────────────────────────────── */}
      <div data-foot-word className="relative select-none px-3 sm:px-6" aria-hidden="true">
        <p className="font-display flex justify-between overflow-hidden text-[10.6vw] font-extrabold leading-[.82] tracking-[-.05em] text-paper/[.07]">
          {'MJLOGISTICS'.split('').map((ch, i) => (
            <span key={i} data-foot-letter className={`inline-block ${i < 2 ? 'text-signal/80' : ''}`}>{ch}</span>
          ))}
        </p>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────────────────── */}
      <div className="relative border-t border-paper/10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-5 py-6 text-xs text-paper/45 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© {new Date().getFullYear()} MJ Logistics Enterprise. All rights reserved.</span>
          <button type="button" onClick={() => scrollToTarget(0)} className="inline-flex items-center gap-2 self-start hover:text-paper sm:self-auto">
            Back to top <ArrowUpRight className="h-3.5 w-3.5 -rotate-45" />
          </button>
        </div>
      </div>
    </footer>
  );
};
