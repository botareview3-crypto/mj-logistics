import React from 'react';
import { Sparkles, Award, MapPin, ShieldCheck, Phone, Mail, Send, ArrowRight, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { useScrollAnimation } from '../lib/useScrollAnimation';

// Placeholder corporate content — replace every figure, claim, and contact
// detail below with real information before this page goes live publicly.
// Structured as a single info/corporate page per the initial scope; a full
// product catalog for MJ Mining can be added later if the business decides
// to sell online.

export default function MiningPage() {
  const { navigate } = useApp();

  const heroRef = useScrollAnimation(0.1);
  const aboutRef = useScrollAnimation(0.1);
  const statsRef = useScrollAnimation(0.1);
  const focusRef = useScrollAnimation(0.1);
  const processRef = useScrollAnimation(0.1);
  const valuesRef = useScrollAnimation(0.1);
  const contactRef = useScrollAnimation(0.1);

  return (
    <div className="pb-16">
      {/* Hero */}
      <section className="rounded-2xl text-white relative overflow-hidden min-h-[420px]">
        {/* Real mining hero image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/mining/hero.webp')" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a2540]/90 via-[#0a2540]/70 to-transparent" />
        <div className="relative px-6 py-10 sm:px-10 sm:py-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0ea5e9]/10 border border-[#0ea5e9]/30 text-[#0ea5e9] text-xs font-bold uppercase tracking-wider mb-5">
            <Sparkles className="w-3.5 h-3.5" /><span>A Division of MJ Logistics Enterprise</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight max-w-2xl">MJ Mining</h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mt-4 leading-relaxed">
            Diamond and gold mining operations built on responsible extraction,
            transparent sourcing, and long-term partnership with the
            communities we operate in.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <a href="#contact" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0ea5e9] hover:bg-[#0284c7] text-slate-950 text-sm font-bold rounded-md transition-colors">
              <span>Get in Touch</span><ArrowRight className="w-4 h-4" />
            </a>
            <button type="button" onClick={() => navigate('/')} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-md transition-colors border border-white/20">
              Back to MJ Logistics
            </button>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="pt-14 sm:pt-16">
        <div ref={aboutRef.ref} className={`animate-on-scroll ${aboutRef.isVisible ? 'visible' : ''} grid grid-cols-1 lg:grid-cols-2 gap-10 items-center`}>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#0ea5e9]">About Us</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">Mining, done the right way</h2>
            <p className="text-sm text-slate-600 mt-4 leading-relaxed">
              MJ Mining focuses on diamond and gold extraction with an emphasis
              on responsible operating standards, fair labor practices, and
              minimal environmental impact.
            </p>
            <p className="text-sm text-slate-600 mt-4 leading-relaxed">
              Operating across multiple regions, we maintain full licensing compliance
              and work directly with local communities to ensure sustainable,
              long-term benefit for all stakeholders.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200">
            <img
              src="/images/mining/hero.webp"
              alt="Mining operations"
              className="w-full h-72 sm:h-96 object-cover" loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="pt-10">
        <div ref={statsRef.ref} className={`animate-on-scroll ${statsRef.isVisible ? 'visible' : ''} grid grid-cols-2 sm:grid-cols-4 gap-4`}>
          {[
            { label: 'Years Active',      value: '10+' },
            { label: 'Active Sites',      value: '3' },
            { label: 'Team Members',      value: '50+' },
            { label: 'Regions Covered',   value: '4' },
          ].map(stat => (
            <div key={stat.label} className="rounded-xl bg-slate-50 border border-slate-200 p-5 text-center">
              <p className="text-2xl font-black text-[#0ea5e9]">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What we mine */}
      <section className="pt-14 sm:pt-16">
        <div ref={focusRef.ref} className={`animate-on-scroll ${focusRef.isVisible ? 'visible' : ''}`}>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#0ea5e9]">Our Focus</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">What We Mine</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-200 shadow-sm overflow-hidden group">
              <img src="/images/mining/diamonds.webp" alt="Diamonds" className="w-full h-52 object-cover" loading="lazy" />
              <div className="p-6">
                <div className="w-10 h-10 rounded-lg bg-[#0ea5e9]/10 text-[#0ea5e9] flex items-center justify-center mb-3"><Sparkles className="w-5 h-5" /></div>
                <h3 className="text-lg font-bold text-slate-900">Diamonds</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">Ethically sourced rough and polished diamonds, graded to international standards with full chain-of-custody documentation.</p>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 shadow-sm overflow-hidden group">
              <img src="/images/mining/gold.webp" alt="Gold" className="w-full h-52 object-cover" loading="lazy" />
              <div className="p-6">
                <div className="w-10 h-10 rounded-lg bg-[#0ea5e9]/10 text-[#0ea5e9] flex items-center justify-center mb-3"><Award className="w-5 h-5" /></div>
                <h3 className="text-lg font-bold text-slate-900">Gold</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">High-purity gold extraction using responsible methods, with assay-certified output ready for direct trade and long-term supply agreements.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="pt-14 sm:pt-16">
        <div ref={processRef.ref} className={`animate-on-scroll ${processRef.isVisible ? 'visible' : ''}`}>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#0ea5e9]">How We Operate</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">Our Process</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Exploration', desc: 'Geophysical surveys and geological assessments identify viable sites before any ground work begins.' },
              { step: '02', title: 'Extraction', desc: 'Modern, low-impact extraction methods with on-site safety officers and environmental monitoring.' },
              { step: '03', title: 'Export & Sale', desc: 'All output is independently graded, certified, and distributed through licensed trade channels.' },
            ].map(item => (
              <div key={item.step} className="rounded-xl border border-slate-200 p-6">
                <span className="text-3xl font-black text-[#0ea5e9]/30">{item.step}</span>
                <h3 className="text-base font-bold text-slate-900 mt-2">{item.title}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values strip */}
      <section className="pt-14 sm:pt-16">
        <div ref={valuesRef.ref} className={`animate-on-scroll ${valuesRef.isVisible ? 'visible' : ''} rounded-2xl bg-slate-50 border border-slate-200 p-8 sm:p-10`}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-white shadow-sm text-[#0ea5e9] flex items-center justify-center shrink-0"><ShieldCheck className="w-4.5 h-4.5" /></div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Responsible Sourcing</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">All operations comply with international conflict-free sourcing standards and regional regulatory requirements.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-white shadow-sm text-[#0ea5e9] flex items-center justify-center shrink-0"><MapPin className="w-4.5 h-4.5" /></div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Local Operations</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">We operate in-region with local teams, reinvesting in the communities and infrastructure that support our sites.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-white shadow-sm text-[#0ea5e9] flex items-center justify-center shrink-0"><TrendingUp className="w-4.5 h-4.5" /></div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Growing Steadily</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Year-on-year output growth backed by continuous site development and long-term supply commitments.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="pt-14 sm:pt-16">
        <div ref={contactRef.ref} className={`animate-on-scroll ${contactRef.isVisible ? 'visible' : ''} rounded-2xl bg-[#0a2540] text-white p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center`}>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#0ea5e9]">Business Inquiries</span>
            <h2 className="text-2xl sm:text-3xl font-black mt-2">Get in Touch</h2>
            <p className="text-sm text-slate-300 mt-3 leading-relaxed max-w-md">
              For partnership, sourcing, or investment inquiries, reach out
              directly. Our team responds to all serious inquiries within 2 business days.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center gap-2.5 text-slate-200"><Phone className="w-4 h-4 text-[#0ea5e9] shrink-0" /><span>+251 XX XXX XXXX</span></div>
              <div className="flex items-center gap-2.5 text-slate-200"><Mail className="w-4 h-4 text-[#0ea5e9] shrink-0" /><span>mining@mjlogisticsenterprise.com</span></div>
              <div className="flex items-center gap-2.5 text-slate-200"><MapPin className="w-4 h-4 text-[#0ea5e9] shrink-0" /><span>Addis Ababa, Ethiopia</span></div>
            </div>
          </div>
          <form
            onSubmit={e => e.preventDefault()}
            className="bg-white rounded-xl p-6 space-y-3 text-slate-900"
          >
            <div>
              <label className="text-xs font-bold text-slate-600">Name</label>
              <input type="text" className="w-full mt-1 border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]" placeholder="Your name" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600">Email</label>
              <input type="email" className="w-full mt-1 border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]" placeholder="you@company.com" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600">Message</label>
              <textarea rows={3} className="w-full mt-1 border border-slate-200 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]" placeholder="Tell us about your inquiry" />
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-[#0056b3] hover:bg-[#004494] text-white text-sm font-bold py-2.5 rounded-md transition-colors">
              <Send className="w-4 h-4" /><span>Send Inquiry</span>
            </button>
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 shrink-0" />We'll respond within 2 business days.</p>
          </form>
        </div>
      </section>
    </div>
  );
}
