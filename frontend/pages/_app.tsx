import type { AppProps } from 'next/app';
import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import { AppProvider, useApp } from '../lib/AppContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { VehicleSelectorModal } from '../components/VehicleSelectorModal';
import { CheckCircle2, AlertCircle, Info, X, Wrench } from 'lucide-react';
import { useSmoothScroll } from '../lib/useLenis';
import { killAllScrollTriggers } from '../lib/gsap';

/* ─── Toast overlay ────────────────────────────────────────────────────── */
function ToastOverlay() {
  const { toasts, removeToast } = useApp();
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`
            flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold border
            animate-fade-in
            ${toast.type === 'success' ? 'bg-emerald-900 text-white border-emerald-700'
            : toast.type === 'error'   ? 'bg-rose-900 text-white border-rose-700'
            : 'bg-[#0d1f3c] text-white border-white/10'}
          `}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toast.type === 'error'   && <AlertCircle  className="w-4 h-4 text-rose-400 shrink-0" />}
          {(toast.type === 'info' || toast.type === 'warning') && <Info className="w-4 h-4 text-sky-400 shrink-0" />}
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="ml-auto text-white/50 hover:text-white cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ─── Layout logic ─────────────────────────────────────────────────────── */
function AppLayout({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { pathname } = router;

  // ── Global smooth scroll (GSAP-powered) ──
  useSmoothScroll();

  // ── Kill ScrollTriggers on route change to prevent memory leaks ──
  React.useEffect(() => {
    const handleRouteChange = () => killAllScrollTriggers();
    router.events.on('routeChangeStart', handleRouteChange);
    return () => router.events.off('routeChangeStart', handleRouteChange);
  }, [router.events]);

  const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
  const [siteSettings, setSiteSettings] = React.useState({
    maintenance_mode: false,
    announcement: '',
  });

  React.useEffect(() => {
    fetch(`${apiBase}/api/site/settings`)
      .then(r => r.ok ? r.json() : null)
      .then(s => { if (s) setSiteSettings(s); })
      .catch(() => undefined);
  }, [apiBase]);

  // Maintenance mode guard
  if (
    siteSettings.maintenance_mode &&
    typeof window !== 'undefined' &&
    window.location.pathname !== '/admin'
  ) {
    return (
      <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center px-6">
        <div className="max-w-md bg-white rounded-2xl border border-slate-200 shadow-lg p-10 text-center">
          <Wrench className="mx-auto w-10 h-10 text-[#1e4d8c]" />
          <h1 className="font-display mt-5 text-2xl font-bold text-[#0d1f3c]">
            We&apos;re updating the catalogue
          </h1>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            {siteSettings.announcement || 'Please check back shortly.'}
          </p>
        </div>
      </div>
    );
  }

  // Pages that manage their own full-page chrome (header + footer inside component)
  const SELF_CONTAINED = ['/', '/mining'];
  if (SELF_CONTAINED.includes(pathname)) {
    return (
      <div className="min-h-screen bg-white font-sans antialiased">
        {siteSettings.announcement && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs font-medium text-amber-900">
            {siteSettings.announcement}
          </div>
        )}
        <Component {...pageProps} />
        <ToastOverlay />
      </div>
    );
  }

  // Admin / signin — bare chrome
  if (pathname === '/admin' || pathname === '/signin') {
    return (
      <div className="min-h-screen bg-[#f0f4f8] antialiased">
        <Component {...pageProps} />
        <ToastOverlay />
      </div>
    );
  }

  // Marketing pages — SiteHeader / SiteFooter
  const MARKETING = ['/divisions', '/advantages'];
  if (MARKETING.includes(pathname)) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans antialiased">
        {siteSettings.announcement && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs font-medium text-amber-900">
            {siteSettings.announcement}
          </div>
        )}
        <SiteHeader />
        <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-10">
          <Component {...pageProps} />
        </main>
        <SiteFooter />
        <ToastOverlay />
      </div>
    );
  }

  // Shop / catalog pages — shop Header / Footer + vehicle modal
  return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col font-sans antialiased">
      {siteSettings.announcement && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs font-medium text-amber-900">
          {siteSettings.announcement}
        </div>
      )}
      <Header />
      <VehicleSelectorModal />
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
        <Component {...pageProps} />
      </main>
      <Footer />
      <ToastOverlay />
    </div>
  );
}

/* ─── Root export ──────────────────────────────────────────────────────── */
export default function App(props: AppProps) {
  return (
    <>
      <Head>
        <title>MJ Logistics — Auto Parts, Stationery &amp; Business Equipment</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Your trusted source for genuine auto parts with fitment verification, office stationery, and business equipment."
        />
      </Head>
      <AppProvider>
        <AppLayout {...props} />
      </AppProvider>
    </>
  );
}
