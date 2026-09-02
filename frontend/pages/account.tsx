import React, { useState } from 'react';
import { UserCircle2, LogIn, UserPlus, Car, ShoppingCart, Package, MapPin, Bell, ShieldCheck, ArrowRight, Mail, Lock } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { Breadcrumbs } from '../components/Breadcrumbs';

export default function MyAccountPage() {
  const { savedVehicles, cartCount, navigate, showToast } = useApp();
  const [mode, setMode] = useState<'signin' | 'create'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Account sign-in is not available yet — check back soon!', 'info');
  };

  return (
    <div className="space-y-8 pb-16">
      <Breadcrumbs items={[{ label: 'My Account' }]} />

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-sky-100 text-[#0077C7] text-xs font-bold uppercase tracking-wider"><UserCircle2 className="w-3.5 h-3.5" /><span>Account & Preferences</span></div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">My Account</h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">Sign in to track orders, save delivery addresses and check out faster next time.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sign in / create account panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="flex border-b border-slate-200">
              <button type="button" onClick={() => setMode('signin')} className={`flex-1 px-4 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${mode === 'signin' ? 'text-[#0077C7] border-b-2 border-[#0077C7] bg-sky-50/50' : 'text-slate-500 hover:text-slate-700'}`}>
                <LogIn className="w-4 h-4" /><span>Sign In</span>
              </button>
              <button type="button" onClick={() => setMode('create')} className={`flex-1 px-4 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${mode === 'create' ? 'text-[#0077C7] border-b-2 border-[#0077C7] bg-sky-50/50' : 'text-slate-500 hover:text-slate-700'}`}>
                <UserPlus className="w-4 h-4" /><span>Create Account</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 max-w-md">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0077C7]" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0077C7]" />
                </div>
              </div>
              <button type="submit" className="w-full py-2.5 bg-[#0077C7] hover:bg-[#0060A1] text-white font-bold text-sm rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2">
                {mode === 'signin' ? <><LogIn className="w-4 h-4" /><span>Sign In</span></> : <><UserPlus className="w-4 h-4" /><span>Create Account</span></>}
              </button>
              <p className="text-[11px] text-slate-400 text-center">Accounts aren&apos;t required to browse the catalogue, check fitment, or use your garage and cart — those already work without signing in.</p>
            </form>
          </div>

          {/* Why create an account */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-4">Why create an account?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Package, color: 'text-[#0077C7]', bg: 'bg-sky-50', border: 'border-sky-200', title: 'Track Orders', sub: 'Follow every delivery from dispatch to your door.' },
                { icon: MapPin, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', title: 'Saved Addresses', sub: 'Store delivery details for faster checkout.' },
                { icon: Bell, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', title: 'Stock & Price Alerts', sub: 'Get notified when parts you need are back in stock.' },
              ].map(({ icon: Icon, color, bg, border, title, sub }) => (
                <div key={title} className={`p-4 rounded-xl border ${bg} ${border} space-y-2`}>
                  <div className={`w-9 h-9 rounded-lg bg-white flex items-center justify-center border ${border} ${color}`}><Icon className="w-4 h-4" /></div>
                  <div className="text-xs font-bold text-slate-900">{title}</div>
                  <div className="text-[11px] text-slate-500 leading-relaxed">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick access sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block px-1 pb-2">Quick Access</span>
            <button type="button" onClick={() => navigate('/garage')} className="w-full p-3 rounded-xl hover:bg-slate-50 flex items-center justify-between gap-3 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-200 text-[#0077C7] flex items-center justify-center shrink-0"><Car className="w-5 h-5" /></div>
                <div className="text-left"><div className="text-sm font-bold text-slate-900">My Garage</div><div className="text-[11px] text-slate-500">{savedVehicles.length} saved vehicle{savedVehicles.length === 1 ? '' : 's'}</div></div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#0077C7] transition-colors shrink-0" />
            </button>
            <button type="button" onClick={() => navigate('/cart')} className="w-full p-3 rounded-xl hover:bg-slate-50 flex items-center justify-between gap-3 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0"><ShoppingCart className="w-5 h-5" /></div>
                <div className="text-left"><div className="text-sm font-bold text-slate-900">My Cart</div><div className="text-[11px] text-slate-500">{cartCount} item{cartCount === 1 ? '' : 's'} in cart</div></div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#0077C7] transition-colors shrink-0" />
            </button>
            <div className="w-full p-3 rounded-xl flex items-center justify-between gap-3 opacity-60 cursor-not-allowed">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center shrink-0"><Package className="w-5 h-5" /></div>
                <div className="text-left"><div className="text-sm font-bold text-slate-900">Order History</div><div className="text-[11px] text-slate-500">Available after sign in</div></div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-sky-300"><ShieldCheck className="w-4 h-4 shrink-0" /><span className="text-xs font-bold uppercase tracking-wider">Your Data, Your Device</span></div>
            <p className="text-[11px] text-slate-400 leading-relaxed">Your garage and cart are currently stored on this device only, so they won&apos;t follow you to another browser until account sign-in is available.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
