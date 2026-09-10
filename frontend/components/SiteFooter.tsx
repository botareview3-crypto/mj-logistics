import React, { useState } from 'react';
import { Wrench, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useApp } from '../lib/AppContext';

export const SiteFooter: React.FC = () => {
  const { navigate, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    showToast('Subscribed to MJ Logistics Enterprise updates!', 'success');
  };

  return (
    <footer className="bg-[#0B1220] text-slate-300 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center text-[#0077C7]"><Wrench className="w-4 h-4 transform -rotate-12" /></div>
              <span className="text-white font-bold text-lg tracking-tight">MJ Logistics <span className="text-white/50 font-medium">Enterprise</span></span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Two divisions, one standard of care: a verified auto and industrial
              parts marketplace, and MJ Mining, our diamond and gold operation.
            </p>
            <div className="space-y-2 pt-2 text-sm">
              <div className="flex items-center gap-2 text-slate-400"><Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" /><span>info@mjlogisticsenterprise.com</span></div>
              <div className="flex items-center gap-2 text-slate-400"><MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" /><span>+251 XX XXX XXXX</span></div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-3">Auto &amp; Industrial Parts</h4>
            <ul className="space-y-2 text-sm">
              <li><button type="button" onClick={() => navigate('/shop')} className="text-slate-400 hover:text-white transition-colors text-left cursor-pointer">Shop the marketplace</button></li>
              <li><button type="button" onClick={() => navigate('/catalog')} className="text-slate-400 hover:text-white transition-colors text-left cursor-pointer">Browse all categories</button></li>
              <li><button type="button" onClick={() => navigate('/garage')} className="text-slate-400 hover:text-white transition-colors text-left cursor-pointer">My garage</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-3">MJ Mining</h4>
            <ul className="space-y-2 text-sm">
              <li><button type="button" onClick={() => navigate('/mining')} className="text-slate-400 hover:text-white transition-colors text-left cursor-pointer">About the division</button></li>
              <li><button type="button" onClick={() => navigate('/mining')} className="text-slate-400 hover:text-white transition-colors text-left cursor-pointer">Business inquiries</button></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h4 className="text-sm font-bold text-white mb-1">Stay updated</h4>
            <p className="text-sm text-slate-400">Occasional news from across both divisions.</p>
          </div>
          {subscribed ? (
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold"><CheckCircle2 className="w-4 h-4" /><span>Subscribed</span></div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex w-full lg:w-auto gap-2">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" className="flex-1 lg:w-64 px-3.5 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0077C7]" required />
              <button type="submit" className="px-4 py-2.5 bg-white text-[#0B1220] text-sm font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shrink-0 hover:bg-slate-100 transition-colors"><Send className="w-3.5 h-3.5" /><span>Subscribe</span></button>
            </form>
          )}
        </div>

        <div className="border-t border-white/10 pt-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>© {new Date().getFullYear()} MJ Logistics Enterprise. All rights reserved.</div>
          <div className="flex items-center gap-5">
            <button type="button" onClick={() => navigate('/privacy')} className="hover:text-white transition-colors cursor-pointer">Privacy Policy</button>
            <button type="button" onClick={() => navigate('/terms')} className="hover:text-white transition-colors cursor-pointer">Terms of Sale</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
