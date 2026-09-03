import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: 'What we collect',
    body: (
      <p>
        When you sign in with Google or Apple, we receive your name, email address,
        and profile photo (if provided by that account) so we can identify you across
        visits. We don&apos;t collect a password — sign-in is handled entirely by
        Google or Apple, and we never see or store your credentials for those
        accounts. If you browse without signing in, your saved vehicles and cart are
        stored only in your browser&apos;s local storage on your own device — we don&apos;t
        see that data at all.
      </p>
    ),
  },
  {
    title: 'How we use it',
    body: (
      <p>
        Your account information is used to keep you signed in, show your name/photo
        on the account page, and — once order history and saved addresses are
        available — to associate orders with your account. We do not sell your
        information to third parties or use it for advertising.
      </p>
    ),
  },
  {
    title: 'Third-party sign-in providers',
    body: (
      <p>
        Signing in with Google or Apple means those providers&apos; own privacy
        policies also apply to how they handle your account data on their end. We
        only receive the basic profile fields listed above — we never receive your
        Google or Apple password.
      </p>
    ),
  },
  {
    title: 'Data retention',
    body: (
      <p>
        Your account record is kept for as long as your account exists. You can
        request deletion of your account and associated data at any time by
        contacting us at the email below.
      </p>
    ),
  },
  {
    title: 'Cookies & local storage',
    body: (
      <p>
        We use your browser&apos;s local storage to remember your garage vehicles and
        cart contents on this device, and to keep you signed in between visits. We
        don&apos;t use third-party advertising or tracking cookies.
      </p>
    ),
  },
  {
    title: 'Contact us',
    body: (
      <p>
        Questions about this policy or your data? Email us at{' '}
        <a href="mailto:orders@autoparts-direct.com" className="text-[#0077C7] font-semibold hover:underline">
          orders@autoparts-direct.com
        </a>
        .
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-8 pb-16">
      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-1">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-sky-100 text-[#0077C7] text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" /><span>Legal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Privacy Policy</h1>
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
