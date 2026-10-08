import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, CheckCircle2, Mail, MapPin } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { scrollToTarget } from '../lib/useLenis';
import { LogoLockup } from './fx/Logo';

const FOOTER_LINKS: Record<string, { label: string; href: string }[]> = {
  Divisions: [
    { label: 'Auto Parts',          href: '/shop' },
    { label: 'Stationery & Office', href: '/stationery' },
    { label: 'MJ Mining',           href: '/mining' },
    { label: 'Solar Energy',        href: '/solar' },
    { label: 'Services',            href: '/services' },
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

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    showToast('Subscribed! Thank you.', 'success');
  };

  return (
    <footer className="bg-forest text-paper">
      {/* ── Closing CTA ─────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1440px] px-5 pt-20 sm:px-8">
        <div className="flex flex-col gap-8 border-b border-paper/15 pb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow mb-4 text-mint">Have something to move?</p>
            <h2 className="t-xl">
              Tell us what you need. <span className="text-signal">We&apos;ll handle the rest.</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="btn btn-signal">
              Request a quote <ArrowUpRight className="btn-arrow h-4 w-4" />
            </Link>
            <Link href="/shop" className="btn btn-ghost">Shop auto parts</Link>
          </div>
        </div>

        {/* ── Links grid ────────────────────────────────────────────────── */}
        <div className="grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm space-y-6">
            <LogoLockup variant="reversed" className="h-9 w-auto" />
            <p className="text-[15px] leading-7 text-paper/75">
              One partner for genuine auto parts, workplace supplies, mining, solar energy and more —
              sourced, cleared and delivered by MJ Logistics Enterprise.
            </p>
            <ul className="space-y-2.5 text-sm text-paper/75">
              <li className="flex items-center gap-2.5"><MapPin className="h-4 w-4 text-signal" /> Monrovia, Liberia</li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-signal" />
                <a href="mailto:info@mjlogisticsenterprise.com" className="link-draw">info@mjlogisticsenterprise.com</a>
              </li>
            </ul>
            <div>
              <p className="eyebrow mb-3 text-mint">Stay updated</p>
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
                    className="h-12 w-full rounded-full border border-paper/20 bg-white/10 pl-5 pr-14 text-sm text-paper placeholder:text-paper/50 outline-none transition focus:border-signal"
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
              <h3 className="eyebrow mb-5 text-mint">{heading}</h3>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[15px] text-paper/80 transition-colors hover:text-signal">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────────────────── */}
      <div className="border-t border-paper/15">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-5 py-6 text-xs text-paper/60 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© {new Date().getFullYear()} MJ Logistics Enterprise. All rights reserved.</span>
          <button type="button" onClick={() => scrollToTarget(0)} className="inline-flex items-center gap-2 self-start hover:text-paper sm:self-auto">
            Back to top <ArrowUpRight className="h-3.5 w-3.5 -rotate-45" />
          </button>
        </div>
      </div>
    </footer>
  );
};
