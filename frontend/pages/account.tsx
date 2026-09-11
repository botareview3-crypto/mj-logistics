import React, { useEffect, useRef } from 'react';
import Router, { useRouter } from 'next/router';
import { UserCircle2, Car, ShoppingCart, Package, ShieldCheck, ArrowRight, LogOut } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { POST_LOGIN_REDIRECT_KEY } from '../lib/auth';
import { Breadcrumbs } from '../components/Breadcrumbs';

// This page is now a dashboard for people who are ALREADY signed in — the
// sign-in / create-account UI itself lives on its own page at /signin,
// which is a lighter, standalone experience with no site chrome. The only
// reason a signed-out visitor still lands here is that the backend's OAuth
// callback is hardcoded to redirect to /account?token=... (see lib/auth.ts),
// so this page still has to catch that token and finish the login — it just
// bounces everyone else straight to /signin.

export default function MyAccountPage() {
  const { savedVehicles, cartCount, navigate, showToast, currentUser, isAuthLoading, loginWithToken, logout } = useApp();
  const router = useRouter();
  const handledCallback = useRef(false);

  // Pick up ?token=... (successful redirect back from the backend's OAuth
  // callback) or ?auth_error=... (something went wrong) once on mount.
  useEffect(() => {
    if (!router.isReady || handledCallback.current) return;
    handledCallback.current = true;
    const { token, auth_error } = router.query;
    if (typeof token === 'string' && token) {
      loginWithToken(token).then(() => {
        showToast('Signed in!', 'success');
        let target: string | null = null;
        try {
          target = localStorage.getItem(POST_LOGIN_REDIRECT_KEY);
          if (target) localStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
        } catch { /* ignore */ }
        navigate(target || '/account');
      });
      Router.replace('/account', undefined, { shallow: true });
    } else if (typeof auth_error === 'string' && auth_error) {
      showToast('Sign-in failed — please try again.', 'error');
      Router.replace('/signin', undefined, { shallow: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  // A signed-out visit that ISN'T a pending OAuth callback (someone typed
  // /account directly, or an old bookmark) — send them to the real sign-in
  // page instead of duplicating that UI here.
  useEffect(() => {
    if (!router.isReady || isAuthLoading || currentUser) return;
    const { token, auth_error } = router.query;
    if (token || auth_error) return; // being handled by the effect above
    navigate('/signin');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, isAuthLoading, currentUser, router.query.token, router.query.auth_error]);

  if (!isAuthLoading && !currentUser) return null; // redirecting to /signin

  return (
    <div className="space-y-8 pb-16">
      <Breadcrumbs items={[{ label: 'My Account' }]} />

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-sky-100 text-[#0077C7] text-xs font-bold uppercase tracking-wider"><UserCircle2 className="w-3.5 h-3.5" /><span>Account & Preferences</span></div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">My Account</h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">Track orders, save delivery addresses and check out faster next time.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {currentUser && (
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
                <button type="button" onClick={() => { logout(); showToast('Signed out', 'info'); navigate('/'); }} className="shrink-0 px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1.5">
                  <LogOut className="w-3.5 h-3.5" /><span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
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
