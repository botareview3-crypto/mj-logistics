import type { AppProps } from 'next/app';
import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import { AppProvider, useApp } from '../lib/AppContext';
import { Header } from '../components/Header';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { VehicleSelectorModal } from '../components/VehicleSelectorModal';
import { CheckCircle2, AlertCircle, Info, X, Wrench } from 'lucide-react';
import { useSmoothScroll } from '../lib/useLenis';
import { Preloader } from '../components/fx/Preloader';
import { PageTransition } from '../components/fx/PageTransition';
import { Cursor } from '../components/fx/Cursor';

/* Corporate pages: full-bleed, SiteHeader/SiteFooter, preloader + curtain.
   Legal pages share the chrome but keep a readable contained column. */
const MARKETING_PATHS = ['/', '/mining', '/solar', '/divisions', '/advantages', '/contact', '/stationery'];
const LEGAL_PATHS = ['/privacy', '/terms'];

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
            : 'bg-ink text-white border-white/10'}
          `}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toast.type === 'error'   && <AlertCircle  className="w-4 h-4 text-rose-400 shrink-0" />}
          {(toast.type === 'info' || toast.type === 'warning') && <Info className="w-4 h-4 text-signal shrink-0" />}
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

  // ── Global smooth scroll (Lenis + GSAP ticker) ──
  // Pages clean up their own ScrollTriggers via gsap.context (lib/fx.ts), so
  // persistent chrome like the footer keeps its triggers across routes.
  useSmoothScroll();

  const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
  const [siteSettings, setSiteSettings] = React.useState({
    maintenance_mode: false,
    announcement: '',
  });

  React.useEffect(() => {
    // Fetch site settings non-blocking with a short timeout.
    // If the API is slow or unreachable the page renders immediately
    // with defaults (no maintenance mode, no announcement).
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 s max

    fetch(`${apiBase}/api/site/settings`, { signal: controller.signal })
      .then(r => r.ok ? r.json() : null)
      .then(s => { if (s) setSiteSettings(s); })
      .catch(() => undefined) // silently ignore network errors / aborts
      .finally(() => clearTimeout(timeoutId));

    return () => { controller.abort(); clearTimeout(timeoutId); };
  }, [apiBase]);

  // Maintenance mode guard
  if (
    siteSettings.maintenance_mode &&
    typeof window !== 'undefined' &&
    window.location.pathname !== '/admin'
  ) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center px-6">
        <div className="max-w-md bg-white rounded-3xl border border-bone shadow-lg p-10 text-center">
          <Wrench className="mx-auto w-10 h-10 text-signal" />
          <h1 className="font-display mt-5 text-2xl font-bold text-ink">
            We&apos;re updating the catalogue
          </h1>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            {siteSettings.announcement || 'Please check back shortly.'}
          </p>
        </div>
      </div>
    );
  }

  const announcementBar = siteSettings.announcement ? (
    <div className="relative z-[130] bg-signal px-4 py-2 text-center text-xs font-semibold text-white">
      {siteSettings.announcement}
    </div>
  ) : null;

  // Corporate / marketing pages — full-bleed, animated chrome
  if (MARKETING_PATHS.includes(pathname) || LEGAL_PATHS.includes(pathname)) {
    const legal = LEGAL_PATHS.includes(pathname);
    return (
      <div className="min-h-screen bg-paper font-sans text-ink antialiased">
        {announcementBar}
        <Preloader />
        <PageTransition paths={MARKETING_PATHS} />
        <Cursor />
        <SiteHeader />
        {legal ? (
          <main className="mx-auto w-full max-w-[1200px] px-5 pb-20 pt-32 sm:px-8">
            <Component {...pageProps} />
          </main>
        ) : (
          <Component {...pageProps} />
        )}
        <SiteFooter />
        <ToastOverlay />
      </div>
    );
  }

  // Admin / signin — bare chrome
  if (pathname === '/admin' || pathname === '/signin') {
    return (
      <div className="min-h-screen bg-paper antialiased">
        <Component {...pageProps} />
        <ToastOverlay />
      </div>
    );
  }

  // Shop / catalog pages — shop Header / Footer + vehicle modal
  return (
    <div className="min-h-screen bg-paper flex flex-col font-sans antialiased">
      {announcementBar}
      <Header />
      <VehicleSelectorModal />
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
        <Component {...pageProps} />
      </main>
      <SiteFooter />
      <ToastOverlay />
    </div>
  );
}

/* ─── Root export ──────────────────────────────────────────────────────── */
export default function App(props: AppProps) {
  return (
    <>
      <Head>
        <title>MJ Logistics Enterprise — Parts that fit. Delivered fast.</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="MJ Logistics Enterprise — genuine auto parts with verified fitment, workplace supplies, mining and solar energy, sourced and delivered by one partner."
        />
      </Head>
      <AppProvider>
        <AppLayout {...props} />
      </AppProvider>
    </>
  );
}
