import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { LogIn, UserPlus, Package, MapPin, Bell } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { startOAuth, POST_LOGIN_REDIRECT_KEY } from '../lib/auth';

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
  const { navigate, currentUser, isAuthLoading } = useApp();
  const router = useRouter();
  const [mode,     setMode]     = useState<'signin' | 'create'>('signin');

  useEffect(() => {
    if (!router.isReady) return;
    const { redirect } = router.query;
    if (typeof redirect === 'string' && redirect.startsWith('/')) {
      try { localStorage.setItem(POST_LOGIN_REDIRECT_KEY, redirect); } catch { /* ignore */ }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query.redirect]);

  useEffect(() => {
    if (isAuthLoading || !currentUser) return;
    const redirect = typeof router.query.redirect === 'string' ? router.query.redirect : '/account';
    navigate(redirect);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthLoading, currentUser]);

  if (currentUser) return null;

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col">
      <Head>
        <title>Sign In — MJ Logistics</title>
        <meta name="description" content="Sign in or create an account with MJ Logistics." />
      </Head>

      {/* Top bar */}
      <div className="p-5 sm:p-6">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex flex-col leading-none cursor-pointer"
          aria-label="Back to home"
        >
          <span className="font-display text-[10px] uppercase tracking-[0.25em] text-slate-400">Back to</span>
          <span className="font-display text-[20px] font-bold text-[#0d1f3c]">MJ Logistics</span>
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-[420px] space-y-6">

          {/* Heading */}
          <div className="text-center">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#0d1f3c]">
              {mode === 'signin' ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-slate-500 text-sm mt-2">
              {mode === 'signin'
                ? 'Sign in to pick up right where you left off.'
                : 'Takes a few seconds with Google or Apple.'}
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Tab bar */}
            <div className="flex border-b border-slate-100">
              {(['signin', 'create'] as const).map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`flex-1 py-3.5 text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    mode === m
                      ? 'text-[#0d1f3c] border-b-2 border-[#0d1f3c] font-bold'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {m === 'signin' ? <><LogIn className="w-4 h-4" /> Sign In</> : <><UserPlus className="w-4 h-4" /> Create Account</>}
                </button>
              ))}
            </div>

            <div className="p-7 space-y-5">
              {/* OAuth buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => startOAuth('google')}
                  className="w-full h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold text-[#0d1f3c] flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
                >
                  <GoogleIcon /> Continue with Google
                </button>
                <button
                  type="button"
                  onClick={() => startOAuth('apple')}
                  className="w-full h-11 rounded-xl bg-[#0d1f3c] hover:bg-[#1a3560] text-sm font-semibold text-white flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
                >
                  <AppleIcon /> Continue with Apple
                </button>
              </div>

              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-center">
                <p className="text-sm font-semibold text-[#0d1f3c]">Email access is coming soon.</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Use Google or Apple above to {mode === 'signin' ? 'sign in' : 'create your account'} today.
                </p>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 leading-relaxed">
            Browsing never requires an account — we only ask when you&apos;re ready to buy.
          </p>

          {/* Feature pills */}
          <div className="flex items-center justify-center gap-6">
            {[
              { icon: Package, label: 'Track orders' },
              { icon: MapPin,  label: 'Saved addresses' },
              { icon: Bell,    label: 'Stock alerts' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-[#1e4d8c] flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] text-slate-400 leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
