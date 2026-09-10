import React, { useState, useEffect, useRef } from 'react';
import Router, { useRouter } from 'next/router';
import { LogIn, UserPlus, Wrench, Mail, Lock } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { startOAuth } from '../lib/auth';

function GoogleIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4c-7.4 0-13.8 4.1-17.2 10.1z" />
      <path fill="#4CAF50" d="M24 44c5.4 0 10.3-2.1 14-5.5l-6.5-5.4C29.4 34.7 26.8 36 24 36c-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.9 39.6 16.4 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.5 5.4C41.5 35.9 44 30.4 44 24c0-1.3-.1-2.7-.4-3.5z" />
    </svg>
  );
}

function AppleIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.365 1.43c0 1.14-.417 2.06-1.25 2.77-.99.85-2.16 1.34-3.24 1.25-.11-1.11.42-2.1 1.24-2.79.83-.71 2.23-1.24 3.25-1.23zM20.53 17.06c-.53 1.22-.78 1.76-1.46 2.84-.95 1.51-2.29 3.39-3.95 3.4-1.47.02-1.85-.96-3.85-.95-2 .01-2.42.97-3.89.95-1.66-.02-2.93-1.72-3.88-3.22-2.66-4.2-2.94-9.13-1.3-11.75 1.17-1.87 3.01-2.96 4.74-2.96 1.76 0 2.87.97 4.32.97 1.4 0 2.27-.97 4.32-.97 1.55 0 3.19.85 4.35 2.31-3.83 2.1-3.21 7.56.6 9.38z" />
    </svg>
  );
}

const REDIRECT_KEY = 'mj_post_login_redirect';

export default function LoginPage() {
  const { navigate, showToast, currentUser, isAuthLoading, loginWithToken } = useApp();
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'create'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handledCallback = useRef(false);

  // If already signed in, skip straight to the destination
  useEffect(() => {
    if (!router.isReady || isAuthLoading) return;
    if (currentUser) {
      let target = '/shop';
      try {
        const stored = localStorage.getItem(REDIRECT_KEY);
        if (stored) { target = stored; localStorage.removeItem(REDIRECT_KEY); }
      } catch { /* ignore */ }
      const { redirect } = router.query;
      if (typeof redirect === 'string' && redirect.startsWith('/')) target = redirect;
      navigate(target);
    }
  }, [router.isReady, currentUser, isAuthLoading, navigate, router.query]);

  // Save ?redirect=... so it survives the OAuth round trip
  useEffect(() => {
    if (!router.isReady) return;
    const { redirect } = router.query;
    if (typeof redirect === 'string' && redirect.startsWith('/')) {
      try { localStorage.setItem(REDIRECT_KEY, redirect); } catch { /* ignore */ }
    }
  }, [router.isReady, router.query]);

  // Handle ?token=... or ?auth_error=... coming back from OAuth
  useEffect(() => {
    if (!router.isReady || handledCallback.current) return;
    handledCallback.current = true;
    const { token, auth_error } = router.query;
    if (typeof token === 'string' && token) {
      loginWithToken(token).then(() => {
        showToast('Signed in!', 'success');
        let target = '/shop';
        try {
          const stored = localStorage.getItem(REDIRECT_KEY);
          if (stored) { target = stored; localStorage.removeItem(REDIRECT_KEY); }
        } catch { /* ignore */ }
        navigate(target);
      });
      Router.replace('/login', undefined, { shallow: true });
    } else if (typeof auth_error === 'string' && auth_error) {
      showToast('Sign-in failed — please try again.', 'error');
      Router.replace('/login', undefined, { shallow: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Email sign-in is not available yet — try Google or Apple above.', 'info');
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4 py-12 bg-[#0B1220]">
      <div className="w-full max-w-md">
        {/* Logo mark */}
        <div className="flex justify-center mb-8">
          <button type="button" onClick={() => navigate('/')} className="flex items-center gap-2.5 cursor-pointer group">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#0077C7] shadow-md">
              <Wrench className="w-5 h-5 transform -rotate-12" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              MJ Logistics <span className="text-white/40 font-medium">Enterprise</span>
            </span>
          </button>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Tab switcher */}
          <div className="flex border-b border-slate-200">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`flex-1 px-4 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                mode === 'signin'
                  ? 'text-[#0077C7] border-b-2 border-[#0077C7] bg-sky-50/50'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('create')}
              className={`flex-1 px-4 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                mode === 'create'
                  ? 'text-[#0077C7] border-b-2 border-[#0077C7] bg-sky-50/50'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Create Account
            </button>
          </div>

          <div className="p-8 space-y-5">
            <div className="text-center space-y-1">
              <h1 className="text-xl font-black text-slate-900">
                {mode === 'signin' ? 'Welcome back' : 'Create your account'}
              </h1>
              <p className="text-sm text-slate-500">
                {mode === 'signin'
                  ? 'Sign in to track orders and check out faster.'
                  : 'Join MJ Logistics to save vehicles, track orders and get alerts.'}
              </p>
            </div>

            {/* OAuth buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => startOAuth('google')}
                disabled={isAuthLoading}
                className="w-full h-12 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-sm font-bold text-slate-700 flex items-center justify-center gap-3 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
              >
                <GoogleIcon />
                Continue with Google
              </button>
              <button
                type="button"
                onClick={() => startOAuth('apple')}
                disabled={isAuthLoading}
                className="w-full h-12 rounded-xl bg-black hover:bg-slate-800 text-sm font-bold text-white flex items-center justify-center gap-3 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
              >
                <AppleIcon />
                Continue with Apple
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">or use email</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Email form */}
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0077C7] focus:border-transparent"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0077C7] focus:border-transparent"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full h-11 bg-[#0077C7] hover:bg-[#0060A1] text-white font-bold text-sm rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {mode === 'signin'
                  ? <><LogIn className="w-4 h-4" /> Sign In</>
                  : <><UserPlus className="w-4 h-4" /> Create Account</>}
              </button>
            </form>

            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              You don&apos;t need an account to browse the catalogue or use your garage and cart — those work without signing in.
            </p>
          </div>
        </div>

        {/* Back link */}
        <p className="text-center mt-6 text-sm text-white/50">
          <button type="button" onClick={() => navigate('/')} className="hover:text-white transition-colors cursor-pointer underline underline-offset-2">
            Back to home
          </button>
        </p>
      </div>
    </div>
  );
}
