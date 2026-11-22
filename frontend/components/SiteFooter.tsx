import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { scrollToTarget } from '../lib/useLenis';
import { LogoLockup } from './fx/Logo';

const FOOTER_LINKS: Record<string, { label: string; href: string }[]> = {
  Divisions: [
    { label: 'Auto Parts',          href: '/shop' },
    { label: 'Stationery & Office', href: '/stationery' },
    { label: 'MJ Mining',           href: '/mining' },
    { label: 'Solar Energy',        href: '/solar' },
    { label: 'Oil & Gas',           href: '/oil-gas' },
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
    <footer className="bg-ink text-paper">
      {/* Closing band: flat sky block */}
      <div className="bg-signal text-ink">
        <div className="mx-auto grid max-w-[1360px] gap-8 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-12 lg:items-end">
          <h2 className="t-xl lg:col-span-8">Tell us what you need. We&apos;ll handle the rest.</h2>
          <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
            <Link href="/contact" className="btn bg-ink text-white hover:bg-white hover:text-ink">Request a quote <ArrowUpRight className="btn-arrow h-4 w-4" /></Link>
            <Link href="/shop" className="btn btn-ghost-dark">Shop auto parts</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-4">
            <LogoLockup variant="reversed" className="h-9 w-auto" />
            <p className="max-w-sm text-[16px] leading-7 text-paper/80">
              One partner for genuine auto parts, workplace supplies, mining, solar energy, oil &amp; gas and more.
            </p>
            <div>
              <p className="tag mb-3 text-mint">Stay updated</p>
              {subscribed ? (
                <p className="flex items-center gap-2 text-[16px] text-mint"><CheckCircle2 className="h-4 w-4" /> Subscribed! Thank you.</p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex">
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    placeholder="your@email.com" aria-label="Email address"
                    className="h-12 min-w-0 flex-1 border border-paper/30 bg-transparent px-4 text-[16px] text-paper outline-none placeholder:text-paper/50 focus:border-signal"
                  />
                  <button type="submit" aria-label="Subscribe" className="grid h-12 w-12 place-items-center bg-signal text-ink hover:bg-white">
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading} className="lg:col-span-2">
              <h3 className="tag mb-5 border-b border-paper/25 pb-3 text-mint">{heading}</h3>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[16px] text-paper/85 transition-colors hover:text-signal">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-2">
            <h3 className="tag mb-5 border-b border-paper/25 pb-3 text-mint">Reach us</h3>
            <p className="text-[16px] leading-7 text-paper/85">Monrovia, Liberia</p>
            <a href="mailto:info@mjlogisticsenterprise.com" className="link-draw mt-2 block break-words text-[16px] text-paper/85">info@mjlogisticsenterprise.com</a>
          </div>
        </div>
      </div>

      <div className="border-t border-paper/20">
        <div className="mx-auto flex max-w-[1360px] flex-col gap-3 px-5 py-6 text-[14px] text-paper/70 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© {new Date().getFullYear()} MJ Logistics Enterprise. All rights reserved.</span>
          <button type="button" onClick={() => scrollToTarget(0)} className="tag inline-flex items-center gap-2 self-start hover:text-signal sm:self-auto">
            Back to top <ArrowUpRight className="h-4 w-4 -rotate-45" />
          </button>
        </div>
      </div>
    </footer>
  );
};
