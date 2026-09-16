import React, { useState } from 'react';
import { Phone, Mail, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { CATEGORY_ROOTS } from '../lib/data/categories';

export const Footer: React.FC = () => {
  const { navigate, showToast } = useApp();
  const [email, setEmail]           = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    showToast('Subscribed to MJ Logistics updates!', 'success');
  };

  return (
    <footer className="bg-[#0d1f3c] text-white">

      {/* ── Main grid ────────────────────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

        {/* Brand col */}
        <div className="lg:col-span-2 space-y-5">
          <div>
            <p className="font-display text-[10px] uppercase tracking-[0.3em] text-white/40 mb-1">Auto Parts Shop</p>
            <h2 className="font-display text-3xl font-bold text-white leading-none">MJ Logistics</h2>
          </div>
          <p className="text-white/60 text-[13px] leading-relaxed max-w-xs">
            Genuine auto parts with fitment verification, accessories, tools, and office equipment — all under one roof.
          </p>

          <div className="space-y-2.5 text-[13px] text-white/60">
            <div className="flex items-center gap-2.5"><Phone className="w-3.5 h-3.5 text-white/30 shrink-0" /> +251 XX XXX XXXX</div>
            <div className="flex items-center gap-2.5"><Clock className="w-3.5 h-3.5 text-white/30 shrink-0" /> Mon–Fri 07:00–20:00 · Sat 08:00–16:00</div>
            <div className="flex items-center gap-2.5"><Mail className="w-3.5 h-3.5 text-white/30 shrink-0" /> orders@mjlogisticsenterprise.com</div>
          </div>

          {/* Newsletter */}
          <div className="pt-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40 mb-2.5">Get deals & bulletins</p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-sm text-emerald-400">
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
                  className="flex-1 px-3 py-2 text-sm bg-white/10 border border-white/15 rounded-xl text-white placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-white/25 transition-all"
                />
                <button type="submit" className="p-2.5 bg-white text-[#0d1f3c] rounded-xl hover:bg-white/90 transition-colors cursor-pointer" aria-label="Subscribe">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Car Parts */}
        <div>
          <h3 className="font-display text-[12px] font-bold uppercase tracking-[0.18em] text-white/50 mb-4">Car Parts</h3>
          <ul className="space-y-2.5">
            {CATEGORY_ROOTS[0].systems.slice(0, 7).map(system => (
              <li key={system.id}>
                <button
                  type="button"
                  onClick={() => navigate(`/catalog/${system.id}`)}
                  className="text-[13px] text-white/60 hover:text-white transition-colors cursor-pointer text-left"
                >
                  {system.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Accessories & Equipment */}
        <div>
          <h3 className="font-display text-[12px] font-bold uppercase tracking-[0.18em] text-white/50 mb-4">Accessories</h3>
          <ul className="space-y-2.5">
            {CATEGORY_ROOTS.slice(1).flatMap(r => r.systems).map(system => (
              <li key={system.id}>
                <button
                  type="button"
                  onClick={() => navigate(`/catalog/${system.id}`)}
                  className="text-[13px] text-white/60 hover:text-white transition-colors cursor-pointer text-left"
                >
                  {system.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Account & Help */}
        <div>
          <h3 className="font-display text-[12px] font-bold uppercase tracking-[0.18em] text-white/50 mb-4">My Account</h3>
          <ul className="space-y-2.5">
            {[
              { label: 'My Garage',      href: '/garage' },
              { label: 'My Orders',      href: '/account' },
              { label: 'Shopping Cart',  href: '/cart' },
              { label: 'Search Parts',   href: '/search' },
              { label: 'All Categories', href: '/catalog' },
              { label: 'About MJ',       href: '/divisions' },
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Sale',  href: '/terms' },
            ].map(link => (
              <li key={link.href}>
                <button
                  type="button"
                  onClick={() => navigate(link.href)}
                  className="text-[13px] text-white/60 hover:text-white transition-colors cursor-pointer text-left"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Bottom bar ───────────────────────────────────────────────── */}
      <div className="border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/30">
          <span>© {new Date().getFullYear()} MJ Logistics Enterprise. OEM references for identification only.</span>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => navigate('/privacy')} className="hover:text-white transition-colors cursor-pointer">Privacy</button>
            <button type="button" onClick={() => navigate('/terms')}   className="hover:text-white transition-colors cursor-pointer">Terms</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
