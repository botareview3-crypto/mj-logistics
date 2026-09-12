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
    <footer className="bg-[#0a2540] text-slate-300 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center text-[#0056b3]"><Wrench className="w-4 h-4 transform -rotate-12" /></div>
              <span className="text-white font-bold text-lg tracking-tight">MJ Logistics <span className="text-white/50 font-medium">Enterprise</span></span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Delivering reliable parts and mining materials since establishment.
            </p>
            <div className="space-y-2 pt-2 text-sm">
              <div className="flex items-center gap-2 text-slate-400"><MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" /><span>Addis Ababa, Ethiopia</span></div>
              <div className="flex items-center gap-2 text-slate-400"><Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" /><span>info@mjlogisticsenterprise.com</span></div>
              <div className="flex items-center gap-2 text-slate-400"><span className="text-slate-500">Tel:</span><span>+251 XX XXX XXXX</span></div>
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

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>© {new Date().getFullYear()} MJ Logistics Enterprise. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => navigate('/privacy')} className="hover:text-white transition-colors cursor-pointer">Privacy Policy</button>
            <span className="text-slate-600">|</span>
            <button type="button" onClick={() => navigate('/terms')} className="hover:text-white transition-colors cursor-pointer">Terms of Sale</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
