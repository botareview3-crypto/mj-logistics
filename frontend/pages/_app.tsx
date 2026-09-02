import type { AppProps } from 'next/app';
import React from 'react';
import Head from 'next/head';
import '../styles/globals.css';
import { AppProvider, useApp } from '../lib/AppContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { VehicleSelectorModal } from '../components/VehicleSelectorModal';
import { CheckCircle2, AlertCircle, Info, X, Wrench } from 'lucide-react';

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

function AppLayout({ Component, pageProps }: AppProps) {
  const [siteSettings, setSiteSettings] = React.useState({ maintenance_mode: false, announcement: '' });
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

  React.useEffect(() => {
    fetch(`${apiBase}/api/site/settings`).then(response => response.ok ? response.json() : null).then(settings => {
      if (settings) setSiteSettings(settings);
    }).catch(() => undefined);
  }, [apiBase]);

  if (siteSettings.maintenance_mode && typeof window !== 'undefined' && window.location.pathname !== '/admin') {
    return <div className="min-h-screen bg-slate-100 px-5 flex items-center justify-center"><div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"><Wrench className="mx-auto h-8 w-8 text-[#0077c7]" /><h1 className="mt-4 text-2xl font-bold text-slate-900">We&apos;re updating the catalogue</h1><p className="mt-2 text-sm leading-6 text-slate-600">{siteSettings.announcement || 'Please check back shortly.'}</p></div></div>;
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
