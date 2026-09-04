import type { AppProps } from 'next/app';
import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import { AppProvider, useApp } from '../lib/AppContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { VehicleSelectorModal } from '../components/VehicleSelectorModal';
import { CheckCircle2, AlertCircle, Info, X, Wrench, ChevronDown, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';

function ToastOverlay() {
  const { toasts, removeToast } = useApp();
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <div key={toast.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-xs sm:text-sm font-bold border animate-in slide-in-from-bottom-5 duration-200 ${toast.type === 'success' ? 'bg-emerald-900 text-white border-emerald-700' : toast.type === 'error' ? 'bg-rose-900 text-white border-rose-700' : 'bg-slate-900 text-white border-slate-700'}`}>
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
          {(toast.type === 'info' || toast.type === 'warning') && <Info className="w-4 h-4 text-sky-400 shrink-0" />}
          <span>{toast.message}</span>
          <button type="button" onClick={() => removeToast(toast.id)} className="ml-1 text-white/60 hover:text-white cursor-pointer"><X className="w-3.5 h-3.5" /></button>
        </div>
      ))}
    </div>
  );
}

// Static "About us" content shown on the maintenance screen while the
// catalogue is down. Deliberately hardcoded — no API/DB calls here, so it
// still renders correctly during maintenance or a backend outage.
function MaintenanceScreen({ announcement }: { announcement: string }) {
  const [showAbout, setShowAbout] = React.useState(false);

  return (
    <div className="min-h-screen bg-slate-100 px-5 flex items-center justify-center">
      <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <Wrench className="mx-auto h-8 w-8 text-[#0077c7]" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">We&apos;re updating the catalogue</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">{announcement || 'Please check back shortly.'}</p>

        <button
          type="button"
          onClick={() => setShowAbout(prev => !prev)}
          className="mt-5 mx-auto flex items-center gap-1.5 text-xs font-bold text-[#0077C7] hover:text-[#0060A1] cursor-pointer"
        >
          <span>{showAbout ? 'Hide' : 'Learn more about us'}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAbout ? 'rotate-180' : ''}`} />
        </button>

        {showAbout && (
          <div className="mt-4 pt-4 border-t border-slate-200 text-left space-y-3">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0077C7] shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600 leading-relaxed">Industrial-grade automotive spare parts &amp; accessories catalog. Built for DIY car enthusiasts and professional garage technicians demanding verified fitment, genuine OE brands, and rapid dispatch.</p>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" /><span>+1 (800) 555-AUTO • Toll Free</span></div>
              <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" /><span>Mon–Fri: 07:00 – 20:00 EST | Sat: 08:00 – 16:00</span></div>
              <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" /><span>orders@autoparts-direct.com</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AppLayout({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith('/admin');
  const [siteSettings, setSiteSettings] = React.useState({ maintenance_mode: false, announcement: '' });
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

  React.useEffect(() => {
    fetch(`${apiBase}/api/site/settings`).then(response => response.ok ? response.json() : null).then(settings => {
      if (settings) setSiteSettings(settings);
    }).catch(() => undefined);
  }, [apiBase]);

  // Hidden admin shortcut — Ctrl+Shift+A (or Cmd+Shift+A on Mac) jumps to
  // the admin console from anywhere on the storefront. No visible link is
  // shown to regular visitors.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'a') {
        event.preventDefault();
        router.push('/admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  if (siteSettings.maintenance_mode && typeof window !== 'undefined' && window.location.pathname !== '/admin') {
    return <MaintenanceScreen announcement={siteSettings.announcement} />;
  }

  if (isAdminRoute) {
    return (
      <div className="min-h-screen font-sans text-slate-800 antialiased selection:bg-[#0077C7] selection:text-white">
        <Component {...pageProps} />
        <ToastOverlay />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-[#0077C7] selection:text-white">
      {siteSettings.announcement && <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs font-medium text-amber-900">{siteSettings.announcement}</div>}
      <Header />
      <VehicleSelectorModal />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <Component {...pageProps} />
      </main>
      <Footer />
      <ToastOverlay />
    </div>
  );
}

export default function App(props: AppProps) {
  return (
    <>
      <Head>
        <title>MJ Logistics | Spare parts that fit</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Vehicle-first automotive parts catalog with straightforward fitment filtering." />
      </Head>
      <AppProvider>
        <AppLayout {...props} />
      </AppProvider>
    </>
  );
}
