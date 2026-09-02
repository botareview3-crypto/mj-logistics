import React, { useState } from 'react';
import { Wrench, ShieldCheck, RotateCcw, Truck, CreditCard, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { CATEGORY_ROOTS } from '../lib/data/categories';

export const Footer: React.FC = () => {
  const { navigate, showToast } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setIsSubscribed(true);
    showToast('Subscribed to AutoParts technical updates and discount codes!', 'success');
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-16">
      {/* Trust strip */}
      <div className="border-b border-slate-800 bg-slate-950/40 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            {[
              { Icon: ShieldCheck, bg: 'bg-sky-950', color: 'text-sky-400', border: 'border-sky-800/60', title: '100% Fit Guarantee', sub: 'VIN & OEM matched' },
              { Icon: RotateCcw, bg: 'bg-emerald-950', color: 'text-emerald-400', border: 'border-emerald-800/60', title: '30-Day Free Returns', sub: 'Full parts refund' },
              { Icon: Truck, bg: 'bg-purple-950', color: 'text-purple-400', border: 'border-purple-800/60', title: 'Next-Day Delivery', sub: 'Tracked local courier' },
              { Icon: CreditCard, bg: 'bg-amber-950', color: 'text-amber-400', border: 'border-amber-800/60', title: 'Secure Checkout', sub: '256-Bit SSL Encrypted' },
            ].map(({ Icon, bg, color, border, title, sub }) => (
              <div key={title} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${bg} ${color} flex items-center justify-center shrink-0 border ${border}`}><Icon className="w-4 h-4" /></div>
                <div><strong className="text-white block font-bold">{title}</strong><span className="text-slate-400">{sub}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0077C7] flex items-center justify-center text-white"><Wrench className="w-4 h-4 transform -rotate-12" /></div>
              <span className="text-xl font-black text-white tracking-tight">AUTO<span className="text-[#0077C7]">PARTS</span></span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">Industrial-grade automotive spare parts & accessories catalog. Built for DIY car enthusiasts and professional garage technicians demanding verified fitment, genuine OE brands, and rapid dispatch.</p>
            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300"><Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" /><span className="font-semibold text-white">+1 (800) 555-AUTO</span><span className="text-slate-500">• Toll Free</span></div>
              <div className="flex items-center gap-2 text-slate-400"><Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" /><span>Mon–Fri: 07:00 – 20:00 EST | Sat: 08:00 – 16:00</span></div>
              <div className="flex items-center gap-2 text-slate-400"><Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" /><span>orders@autoparts-direct.com</span></div>
            </div>
          </div>

          {/* Car Parts */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white mb-3">Car Parts Systems</h4>
            <ul className="space-y-2 text-xs">
              {CATEGORY_ROOTS[0].systems.slice(0, 6).map(system => (
                <li key={system.id}><button type="button" onClick={() => navigate(`/catalog/${system.id}`)} className="text-slate-400 hover:text-white hover:underline transition-colors text-left cursor-pointer">{system.name}</button></li>
              ))}
            </ul>
          </div>

          {/* Accessories */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white mb-3">Garage & Accessories</h4>
            <ul className="space-y-2 text-xs">
              {CATEGORY_ROOTS[1].systems.map(system => (
                <li key={system.id}><button type="button" onClick={() => navigate(`/catalog/${system.id}`)} className="text-slate-400 hover:text-white hover:underline transition-colors text-left cursor-pointer">{system.name}</button></li>
              ))}
              <li><button type="button" onClick={() => navigate('/garage')} className="text-sky-400 hover:underline font-semibold cursor-pointer">My Garage Vehicles</button></li>
              <li><button type="button" onClick={() => navigate('/catalog')} className="text-slate-400 hover:text-white hover:underline cursor-pointer">All Categories Index</button></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">Technical Bulletins & Deals</h4>
            <p className="text-xs text-slate-400">Receive parts recall notices, DIY maintenance guides, and 10% off your first order.</p>
            {isSubscribed ? (
              <div className="p-2.5 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-lg text-xs flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /><span>You are subscribed!</span></div>
            ) : (
              <form onSubmit={handleNewsletter} className="space-y-2">
                <input type="email" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)} placeholder="Enter workshop or personal email" className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0077C7]" required />
                <button type="submit" className="w-full py-2 px-3 bg-[#0077C7] hover:bg-[#0060A1] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"><Send className="w-3 h-3" /><span>Subscribe</span></button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>© {new Date().getFullYear()} AutoParts Inc. All OEM part numbers and brand logos used for reference purposes only.</div>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]"><span>Privacy Policy</span><span>Terms of Sale</span><span>OEM Cross-Reference Terms</span><span>Security Compliance</span></div>
        </div>
      </div>
    </footer>
  );
};
