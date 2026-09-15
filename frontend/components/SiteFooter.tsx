import React, { useState } from 'react';
import { Mail, MapPin, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../lib/AppContext';

const FOOTER_LINKS = {
  'Auto Parts': [
    { label: 'Shop the Marketplace', href: '/shop' },
    { label: 'Browse Catalog',       href: '/catalog' },
    { label: 'Braking System',       href: '/catalog/braking-system' },
    { label: 'Engine & Transmission',href: '/catalog/engine-transmission' },
    { label: 'Tires & Wheels',       href: '/catalog/tires-wheels' },
    { label: 'My Garage',            href: '/garage' },
  ],
  'Business & Office': [
    { label: 'Stationery',          href: '/catalog/office-stationery' },
    { label: 'Business Equipment',  href: '/catalog/business-equipment' },
    { label: 'Printers & Scanners', href: '/catalog/business-equipment' },
    { label: 'Office Furniture',    href: '/catalog/business-equipment' },
  ],
  'Company': [
    { label: 'About Us',     href: '/divisions' },
    { label: 'MJ Mining',   href: '/mining' },
    { label: 'Contact',     href: '/contact' },
    { label: 'Privacy Policy',href: '/privacy' },
    { label: 'Terms of Sale', href: '/terms' },
  ],
};

export const SiteFooter: React.FC = () => {
  const { navigate, showToast } = useApp();
  const [email, setEmail]           = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    showToast('Subscribed! Thank you.', 'success');
  };

  return (
    <footer
      className="bg-[#0d1f3c] text-white"
      style={{ fontFamily: "'Chopin Trial', Georgia, serif" }}
    >
      {/* ── Main footer grid ──────────────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

        {/* Brand column */}
        <div className="lg:col-span-2 space-y-5">
          <div>
            <p
              className="text-[9px] font-bold uppercase text-white/40 mb-1"
              style={{ letterSpacing: '0.35em', fontFamily: "'Chopin Trial', serif" }}
            >
              Enterprise
            </p>
            <h2
              className="font-bold text-white leading-none"
              style={{
                fontFamily: "'Chopin Trial', serif",
                fontSize: '1.75rem',
                letterSpacing: '0.04em',
              }}
            >
              MJ Logistics
            </h2>
          </div>
          <p className="text-white/60 text-[13px] leading-relaxed max-w-xs">
            Your trusted partner for genuine auto parts, office stationery, business equipment, and natural resources.
          </p>

          {/* Contact info */}
          <ul className="space-y-2.5 text-[12px] text-white/60">
            <li className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-white/30 shrink-0" />
              [Office Address]
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-white/30 shrink-0" />
              +251 XX XXX XXXX
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-white/30 shrink-0" />
              info@mjlogisticsenterprise.com
            </li>
          </ul>

          {/* Newsletter */}
          <div className="pt-2">
            <p
              className="text-[10px] font-bold uppercase text-white/50 mb-3"
              style={{ letterSpacing: '0.2em' }}
            >
              Stay Updated
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-[12px] text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Subscribed! Thank you.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-3 py-2 text-[12px] bg-white/10 border border-white/15 rounded-lg text-white placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-white/25 focus:bg-white/15 transition-all"
                  style={{ fontFamily: "'Chopin Trial', serif" }}
                />
                <button
                  type="submit"
                  className="p-2.5 bg-white text-[#0d1f3c] rounded-lg hover:bg-white/90 transition-colors cursor-pointer"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
          <div key={heading} className="space-y-4">
            <h3
              className="text-[11px] font-bold uppercase text-white/50"
              style={{
                fontFamily: "'Chopin Trial', serif",
                letterSpacing: '0.2em',
              }}
            >
              {heading}
            </h3>
            <ul className="space-y-2.5">
              {links.map(link => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => navigate(link.href)}
                    className="text-[12px] text-white/60 hover:text-white transition-colors cursor-pointer text-left"
                    style={{ fontFamily: "'Chopin Trial', serif" }}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Bottom bar ────────────────────────────────────────────────── */}
      <div className="border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/35">
          <span style={{ fontFamily: "'Chopin Trial', serif" }}>
            © {new Date().getFullYear()} MJ Logistics Enterprise. All rights reserved.
          </span>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => navigate('/privacy')}
              className="hover:text-white transition-colors cursor-pointer"
              style={{ fontFamily: "'Chopin Trial', serif" }}
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => navigate('/terms')}
              className="hover:text-white transition-colors cursor-pointer"
              style={{ fontFamily: "'Chopin Trial', serif" }}
            >
              Terms of Sale
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
