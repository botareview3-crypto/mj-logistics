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
      <section className="rounded-2xl bg-[#0a2540] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,#0ea5e9,transparent_45%),radial-gradient(circle_at_80%_60%,#0ea5e9,transparent_40%)]" />
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
              minimal environmental impact. [Placeholder — replace with the
              company's real history, founding story, and mission statement.]
            </p>
            <p className="text-sm text-slate-600 mt-4 leading-relaxed">
              [Placeholder — add real details on operating regions, years
              active, licensing bodies, and scale of operations here.]
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200">
            <img
              src="https://images.unsplash.com/photo-1578316985166-23f2aa3175c1?auto=format&fit=crop&w=900&q=80"
              alt="Mining operations"
              className="w-full h-72 sm:h-96 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="pt-10">
        <div ref={statsRef.ref} className={`animate-on-scroll ${statsRef.isVisible ? 'visible' : ''} grid grid-cols-2 sm:grid-cols-4 gap-4`}>
          {[
            { label: 'Years Active', value: '[X]' },
            { label: 'Active Sites', value: '[X]' },
            { label: 'Team Members', value: '[X]' },
            { label: 'Regions Covered', value: '[X]' },
          ].map(stat => (
            <div key={stat.label} className="rounded-xl bg-slate-50 border border-slate-200 p-5 text-center">
              <p className="text-2xl font-black text-[#0ea5e9]">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-slate-400 mt-2 text-center">[Placeholder figures — replace all four with real numbers before publishing.]</p>
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
              <img src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=700&q=80" alt="Diamonds" className="w-full h-52 object-cover" />
              <div className="p-6">
                <div className="w-10 h-10 rounded-lg bg-[#0ea5e9]/10 text-[#0ea5e9] flex items-center justify-center mb-3"><Sparkles className="w-5 h-5" /></div>
                <h3 className="text-lg font-bold text-slate-900">Diamonds</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">[Placeholder — describe diamond extraction methods, quality grading, and volumes here.]</p>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 shadow-sm overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1610375461246-83df859d9062?auto=format&fit=crop&w=700&q=80" alt="Gold" className="w-full h-52 object-cover" />
              <div className="p-6">
                <div className="w-10 h-10 rounded-lg bg-[#0ea5e9]/10 text-[#0ea5e9] flex items-center justify-center mb-3"><Award className="w-5 h-5" /></div>
                <h3 className="text-lg font-bold text-slate-900">Gold</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">[Placeholder — describe gold extraction methods, purity standards, and volumes here.]</p>
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
              { step: '01', title: 'Exploration', desc: '[Placeholder — describe site survey and licensing process here.]' },
              { step: '02', title: 'Extraction', desc: '[Placeholder — describe extraction methods and safety standards here.]' },
              { step: '03', title: 'Export & Sale', desc: '[Placeholder — describe grading, certification, and distribution here.]' },
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
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">[Placeholder — real compliance/ethics claims go here.]</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-white shadow-sm text-[#0ea5e9] flex items-center justify-center shrink-0"><MapPin className="w-4.5 h-4.5" /></div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Local Operations</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">[Placeholder — real operating locations go here.]</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-white shadow-sm text-[#0ea5e9] flex items-center justify-center shrink-0"><TrendingUp className="w-4.5 h-4.5" /></div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Growing Steadily</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">[Placeholder — real growth/output figures go here.]</p>
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
              directly. [Placeholder contact details below — replace with
              real ones before publishing.]
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
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 shrink-0" />This form is a visual placeholder — it doesn't send anywhere yet.</p>
          </form>
        </div>
      </section>
    </div>
  );
}
