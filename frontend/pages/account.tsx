import React, { useState, useEffect, useRef } from 'react';
import Router, { useRouter } from 'next/router';
import { UserCircle2, LogIn, UserPlus, Car, ShoppingCart, Package, MapPin, Bell, ShieldCheck, ArrowRight, Mail, Lock, LogOut } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { startOAuth } from '../lib/auth';
import { Breadcrumbs } from '../components/Breadcrumbs';

function GoogleIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4c-7.4 0-13.8 4.1-17.2 10.1z" />
      <path fill="#4CAF50" d="M24 44c5.4 0 10.3-2.1 14-5.5l-6.5-5.4C29.4 34.7 26.8 36 24 36c-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.9 39.6 16.4 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.5 5.4C41.5 35.9 44 30.4 44 24c0-1.3-.1-2.7-.4-3.5z" />
    </svg>
  );
}

function AppleIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.365 1.43c0 1.14-.417 2.06-1.25 2.77-.99.85-2.16 1.34-3.24 1.25-.11-1.11.42-2.1 1.24-2.79.83-.71 2.23-1.24 3.25-1.23zM20.53 17.06c-.53 1.22-.78 1.76-1.46 2.84-.95 1.51-2.29 3.39-3.95 3.4-1.47.02-1.85-.96-3.85-.95-2 .01-2.42.97-3.89.95-1.66-.02-2.93-1.72-3.88-3.22-2.66-4.2-2.94-9.13-1.3-11.75 1.17-1.87 3.01-2.96 4.74-2.96 1.76 0 2.87.97 4.32.97 1.4 0 2.27-.97 4.32-.97 1.55 0 3.19.85 4.35 2.31-3.83 2.1-3.21 7.56.6 9.38z" />
    </svg>
  );
}

export default function MyAccountPage() {
  const { savedVehicles, cartCount, navigate, showToast, currentUser, isAuthLoading, loginWithToken, logout } = useApp();
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'create'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handledCallback = useRef(false);

  // Pick up ?token=... (successful redirect back from the backend's OAuth
  // callback) or ?auth_error=... (something went wrong) once on mount.
  useEffect(() => {
    if (!router.isReady || handledCallback.current) return;
    handledCallback.current = true;
    const { token, auth_error } = router.query;
    if (typeof token === 'string' && token) {
      loginWithToken(token).then(() => showToast('Signed in!', 'success'));
      Router.replace('/account', undefined, { shallow: true });
    } else if (typeof auth_error === 'string' && auth_error) {
      showToast('Sign-in failed — please try again.', 'error');
      Router.replace('/account', undefined, { shallow: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Email sign-in is not available yet — try Google or Apple above.', 'info');
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
        <div className="lg:col-span-2 space-y-6">
          {currentUser ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
              <div className="flex items-center gap-4">
                {currentUser.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={currentUser.avatar_url} alt="" className="w-14 h-14 rounded-full border border-slate-200" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-sky-100 text-[#0077C7] flex items-center justify-center"><UserCircle2 className="w-7 h-7" /></div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-black text-slate-900 truncate">{currentUser.name || currentUser.email}</div>
                  <div className="text-xs text-slate-500 truncate">{currentUser.email}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 capitalize">Signed in with {currentUser.provider}</div>
                </div>
                <button type="button" onClick={() => { logout(); showToast('Signed out', 'info'); }} className="shrink-0 px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1.5">
                  <LogOut className="w-3.5 h-3.5" /><span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="flex border-b border-slate-200">
                <button type="button" onClick={() => setMode('signin')} className={`flex-1 px-4 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${mode === 'signin' ? 'text-[#0077C7] border-b-2 border-[#0077C7] bg-sky-50/50' : 'text-slate-500 hover:text-slate-700'}`}>
                  <LogIn className="w-4 h-4" /><span>Sign In</span>
                </button>
                <button type="button" onClick={() => setMode('create')} className={`flex-1 px-4 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${mode === 'create' ? 'text-[#0077C7] border-b-2 border-[#0077C7] bg-sky-50/50' : 'text-slate-500 hover:text-slate-700'}`}>
                  <UserPlus className="w-4 h-4" /><span>Create Account</span>
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-5 max-w-md">
                <div className="space-y-2.5">
                  <button type="button" onClick={() => startOAuth('google')} disabled={isAuthLoading} className="w-full h-10 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-sm font-bold text-slate-700 flex items-center justify-center gap-2.5 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                    <GoogleIcon /><span>Continue with Google</span>
                  </button>
                  <button type="button" onClick={() => startOAuth('apple')} disabled={isAuthLoading} className="w-full h-10 rounded-lg bg-black hover:bg-slate-800 text-sm font-bold text-white flex items-center justify-center gap-2.5 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                    <AppleIcon /><span>Continue with Apple</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">or use email</span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
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
            </div>
          )}

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
