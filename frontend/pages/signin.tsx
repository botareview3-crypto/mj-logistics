import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { LogIn, UserPlus, Mail, Lock, Wrench, Package, MapPin, Bell } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { startOAuth, POST_LOGIN_REDIRECT_KEY } from '../lib/auth';

// A standalone, no-chrome sign-in / create-account page — reached from the
// "Sign In" link on the landing page and MJ Mining, and from Checkout when
// you're signed out. Deliberately NOT wrapped in the site header/footer: the
// whole point is that signing in should be a quick, focused stop, not a trip
// into the rest of the site. The OAuth callback itself still lands on
// /account (see lib/auth.ts for why) — this page just kicks that off and,
// for anyone who's already signed in, bounces straight there.

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

export default function SignInPage() {
  const { navigate, showToast, currentUser, isAuthLoading } = useApp();
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'create'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Remember where to send the shopper back to (e.g. "/cart") once they're
  // signed in — has to survive the OAuth round trip, so it's stashed in
  // localStorage rather than kept only in the URL. See lib/auth.ts.
  useEffect(() => {
    if (!router.isReady) return;
    const { redirect } = router.query;
    if (typeof redirect === 'string' && redirect.startsWith('/')) {
      try { localStorage.setItem(POST_LOGIN_REDIRECT_KEY, redirect); } catch { /* ignore */ }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query.redirect]);

  // Already signed in — nothing to do here.
  useEffect(() => {
    if (isAuthLoading || !currentUser) return;
    const redirect = typeof router.query.redirect === 'string' ? router.query.redirect : '/account';
    navigate(redirect);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthLoading, currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Email sign-in is not available yet — try Google or Apple above.', 'info');
  };

  if (currentUser) return null; // redirecting away, see effect above

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Head>
        <title>Sign In | MJ Logistics Enterprise</title>
        <meta name="description" content="Sign in or create an account with MJ Logistics Enterprise." />
      </Head>

      <div className="p-5 sm:p-6">
        <button type="button" onClick={() => navigate('/')} className="inline-flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-md bg-[#0077C7] flex items-center justify-center text-white"><Wrench className="w-4 h-4 transform -rotate-12" /></div>
          <span className="font-bold text-slate-900 tracking-tight">MJ Logistics <span className="text-slate-400 font-medium hidden sm:inline">Enterprise</span></span>
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">{mode === 'signin' ? 'Welcome back' : 'Create your account'}</h1>
            <p className="text-sm text-slate-500">{mode === 'signin' ? 'Sign in to pick up right where you left off.' : 'Takes a few seconds with Google or Apple.'}</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex border-b border-slate-200">
              <button type="button" onClick={() => setMode('signin')} className={`flex-1 px-4 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${mode === 'signin' ? 'text-[#0077C7] border-b-2 border-[#0077C7] bg-sky-50/50' : 'text-slate-500 hover:text-slate-700'}`}>
                <LogIn className="w-4 h-4" /><span>Sign In</span>
              </button>
              <button type="button" onClick={() => setMode('create')} className={`flex-1 px-4 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${mode === 'create' ? 'text-[#0077C7] border-b-2 border-[#0077C7] bg-sky-50/50' : 'text-slate-500 hover:text-slate-700'}`}>
                <UserPlus className="w-4 h-4" /><span>Create Account</span>
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-5">
              <div className="space-y-2.5">
                <button type="button" onClick={() => startOAuth('google')} className="w-full h-10 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-sm font-bold text-slate-700 flex items-center justify-center gap-2.5 transition-colors cursor-pointer">
                  <GoogleIcon /><span>Continue with Google</span>
                </button>
                <button type="button" onClick={() => startOAuth('apple')} className="w-full h-10 rounded-lg bg-black hover:bg-slate-800 text-sm font-bold text-white flex items-center justify-center gap-2.5 transition-colors cursor-pointer">
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
              </form>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400">Browsing never requires an account — we only ask you to sign in when you're ready to buy.</p>

          <div className="flex items-center justify-center gap-5 sm:gap-6 pt-2">
            {[
              { Icon: Package, label: 'Track orders' },
              { Icon: MapPin, label: 'Saved addresses' },
              { Icon: Bell, label: 'Stock alerts' },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-[#0077C7] flex items-center justify-center"><Icon className="w-4 h-4" /></div>
                <span className="text-[11px] text-slate-500 max-w-[6.5rem] leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
