import React from 'react';
import { FileText } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: 'Using this site',
    body: (
      <p>
        You can browse the catalogue, check fitment, and use your garage and cart
        without an account. Creating an account (via Google or Apple sign-in) is
        optional and used to save your preferences across visits.
      </p>
    ),
  },
  {
    title: 'Product listings & fitment',
    body: (
      <p>
        We make a reasonable effort to keep fitment data (make/model/year/engine
        matching) accurate, but you&apos;re responsible for confirming a part is
        correct for your vehicle before installation, especially for
        safety-critical components.
      </p>
    ),
  },
  {
    title: 'Orders & pricing',
    body: (
      <p>
        Prices and availability are subject to change without notice. We reserve
        the right to cancel or refuse any order, including in cases of pricing
        errors or stock issues, in which case you&apos;ll be notified and refunded in
        full.
      </p>
    ),
  },
  {
    title: 'Returns',
    body: <p>See our 30-day return policy for eligible items — unused parts in original packaging.</p>,
  },
  {
    title: 'Account responsibility',
    body: (
      <p>
        If you sign in with Google or Apple, you&apos;re responsible for keeping that
        external account secure. We don&apos;t store your Google or Apple password and
        can&apos;t recover access to those accounts on your behalf.
      </p>
    ),
  },
  {
    title: 'Contact us',
    body: (
      <p>
        Questions about these terms? Email{' '}
        <a href="mailto:orders@autoparts-direct.com" className="text-[#0077C7] font-semibold hover:underline">
          orders@autoparts-direct.com
        </a>
        .
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <div className="space-y-8 pb-16">
      <Breadcrumbs items={[{ label: 'Terms of Sale' }]} />

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-1">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-sky-100 text-[#0077C7] text-xs font-bold uppercase tracking-wider">
          <FileText className="w-3.5 h-3.5" /><span>Legal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Terms of Sale</h1>
        <p className="text-xs sm:text-sm text-slate-500">Last updated: September 2026</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6 max-w-3xl">
        {SECTIONS.map(section => (
          <div key={section.title} className="space-y-2">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">{section.title}</h2>
            <div className="text-sm text-slate-600 leading-relaxed">{section.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
