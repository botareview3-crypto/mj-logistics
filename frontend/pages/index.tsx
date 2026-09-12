import React, { useEffect } from 'react';
import Head from 'next/head';
import { ArrowUpRight, ChevronRight, Zap, ShieldCheck, Globe, Package, CheckCircle2, ArrowUp } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { useScrollAnimation } from '../lib/useScrollAnimation';

// Completely redesigned landing page inspired by Onstream Media
// Replicating their layout, animations, imagery style, and structure
// Adapted for MJ Logistics Enterprise content

const FEATURES = [
  { 
    icon: Zap, 
    title: 'Fast Delivery', 
    subtitle: 'Parts delivered within 24-48 hours',
    description: 'Tracked local courier service'
  },
  { 
    icon: ShieldCheck, 
    title: 'Verified Quality', 
    subtitle: '2-Year Warranty on all parts',
    description: 'OEM cross-reference system'
  },
  { 
    icon: Globe, 
    title: 'Global Sourcing', 
    subtitle: '13 Vehicle Makes Supported',
    description: 'International manufacturers'
  }
];

const SERVICES = [
  {
    title: 'Auto Parts',
    subtitle: 'Vehicle-first parts catalog',
    description: 'Vehicle-first parts catalogue spanning car parts, workshop accessories, and business equipment — filtered to what actually fits before you order.',
    features: ['Verified OEM Parts', 'Fitment Guarantee', '30-Day Returns']
  },
  {
    title: 'Industrial Equipment',
    subtitle: 'Business-grade solutions',
    description: 'Comprehensive industrial equipment and supplies for manufacturing, construction, and business operations.',
    features: ['Bulk Ordering', 'Corporate Accounts', 'Technical Support']
  },
  {
    title: 'Mining Operations',
    subtitle: 'Diamond and Gold extraction',
    description: 'Diamond and gold mining operations built on responsible extraction, transparent sourcing, and long-term partnership with the communities we operate in.',
    features: ['Responsible Sourcing', 'Quality Grading', 'Ethical Operations']
  }
];

const CAPABILITIES = [
  { title: 'Verified Parts', subtitle: 'OEM Cross-Reference', description: 'Every part checked against real vehicle fitment data before it ships.' },
  { title: 'Fast Delivery', subtitle: '24-48 Hour Dispatch', description: 'Reliable delivery updates with tracked local courier service.' },
  { title: 'Expert Support', subtitle: 'Technical Assistance', description: 'Expert analysis and support for all your parts and equipment needs.' },
  { title: 'Secure Checkout', subtitle: '256-Bit SSL Encrypted', description: 'Industry-standard security measures for all transactions.' },
  { title: 'Bulk Ordering', subtitle: 'Corporate Solutions', description: 'Special pricing and support for business accounts and bulk orders.' },
  { title: 'Global Network', subtitle: 'International Sourcing', description: 'Access to parts and equipment from manufacturers worldwide.' }
];

export default function LandingPage() {
  const { navigate } = useApp();

  const heroRef = useScrollAnimation(0.1);
  const featuresRef = useScrollAnimation(0.1);
  const expertsRef = useScrollAnimation(0.1);
  const realtimeRef = useScrollAnimation(0.1);
  const servicesRef = useScrollAnimation(0.1);
  const ctaRef = useScrollAnimation(0.1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div>
      <Head>
        <title>MJ Logistics Enterprise | Parts marketplace &amp; MJ Mining</title>
        <meta name="description" content="MJ Logistics Enterprise runs a verified auto and industrial parts marketplace and MJ Mining, a diamond and gold operation. Browse freely — sign in only when you're ready to buy." />
      </Head>

      {/* Hero Section - Onstream Media Style */}
      <section className="relative bg-[#0a2540] overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '56px 56px' }} />
        
        {/* Animated cut-out elements */}
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute w-32 h-32 bg-[#0056b3]/10 rounded-full blur-2xl pointer-events-none floating-element"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 20}%`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div ref={heroRef.ref} className={`animate-on-scroll ${heroRef.isVisible ? 'visible' : ''}`}>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#0ea5e9] mb-4">
              Simple & Reliable Parts Solutions
            </p>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.1] mb-6">
              Parts simplified
            </h1>
            
            {/* Animated word */}
            <div className="flex flex-wrap gap-2 mb-8">
              {['Fast', 'Verified', 'Reliable'].map((word, i) => (
                <span key={word} className="text-2xl sm:text-4xl font-bold text-white/80 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
                  {word}
                </span>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              <button type="button" onClick={() => navigate('/shop')} className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0a2540] font-bold text-lg hover:bg-slate-100 transition-all transform hover:scale-105 cursor-pointer">
                <span>Explore Marketplace</span>
                <ArrowUpRight className="w-5 h-5" />
              </button>
              <button type="button" onClick={() => navigate('/mining')} className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-bold text-lg hover:bg-white/10 transition-all cursor-pointer">
                <span>MJ Mining</span>
              </button>
            </div>
          </div>
        </div>

        {/* Floating cut-out shapes */}
        <div className="absolute bottom-10 right-10 hidden lg:block">
          <div className="relative w-48 h-48">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0056b3]/20 to-[#0ea5e9]/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm" />
            <div className="absolute bottom-8 left-8 w-12 h-12 bg-[#0ea5e9]/20 rounded-full backdrop-blur-sm" />
          </div>
        </div>
      </section>

      {/* Feature Highlights - Onstream Media Style */}
      <section className="bg-white py-16">
        <div ref={featuresRef.ref} className={`animate-on-scroll ${featuresRef.isVisible ? 'visible' : ''} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => (
              <div key={feature.title} className="text-center group">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-[#0a2540] rounded-2xl mb-4 group-hover:bg-[#0056b3] transition-colors">
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">{feature.title}</h3>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <ArrowUp className="w-4 h-4 text-[#0056b3]" />
                  <p className="text-3xl font-black text-slate-900">{feature.subtitle}</p>
                </div>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experts Section - Onstream Media Style */}
      <section className="bg-[#0a2540] py-20">
        <div ref={expertsRef.ref} className={`animate-on-scroll ${expertsRef.isVisible ? 'visible' : ''} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`}>
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#0ea5e9] mb-4">Experts</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white">
              Parts & Mining <span className="text-[#0ea5e9]">Excellence</span>
            </h2>
            <p className="text-xl text-white/70 mt-4">Since establishment</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-slate-300 leading-relaxed text-center">
              MJ Logistics Enterprise has spent years building reliable, user-friendly solutions that industry leaders trust. Our parts marketplace and mining operations aren't just services—they're your ticket to partnering with experts who deliver verified quality and responsible sourcing. With MJ Logistics, you're not just buying parts or materials; you're tapping into a legacy of innovation and excellence.
            </p>
            
            <div className="mt-8 flex justify-center">
              <button type="button" onClick={() => navigate('/shop')} className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0a2540] font-bold text-lg hover:bg-slate-100 transition-all cursor-pointer">
                <span>Explore</span>
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Real-Time Section - Onstream Media Style */}
      <section className="bg-white py-20">
        <div ref={realtimeRef.ref} className={`animate-on-scroll ${realtimeRef.isVisible ? 'visible' : ''} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`}>
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#0056b3] mb-4">Reliable</p>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900">
              Scalable, Verified, <span className="text-[#0056b3]">Measurable.</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-slate-600 leading-relaxed text-center">
              Our cutting-edge parts and mining solutions are designed to meet the evolving demands of modern industry. Scalable to accommodate orders of any size, our platform effortlessly adapts to fluctuating demand, ensuring smooth performance during peak times. With verification at its core, our service delivers high-quality parts and materials across all categories. Perhaps most importantly, our solutions are inherently <span className="font-bold text-[#0056b3]">Measurable</span>, providing comprehensive tracking and insights. This data-driven approach allows you to monitor orders, analyze fitment accuracy, and make informed decisions to optimize your procurement strategies for maximum impact and efficiency.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section - Onstream Media Style */}
      <section className="bg-slate-50 py-20">
        <div ref={servicesRef.ref} className={`animate-on-scroll ${servicesRef.isVisible ? 'visible' : ''} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`}>
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#0056b3] mb-4">Services</p>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900">
              Your Simple, Reliable, and <span className="text-[#0056b3]">Verified</span> Solution
            </h2>
            <p className="text-lg text-slate-600 mt-4 max-w-2xl mx-auto">
              For Auto Parts, Industrial Equipment, and Mining Operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SERVICES.map((service, index) => (
              <div key={service.title} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-12 h-12 bg-[#0a2540] rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{service.title}</h3>
                    <p className="text-sm text-slate-500">{service.subtitle}</p>
                  </div>
                </div>
                
                <p className="text-slate-600 mb-6 leading-relaxed">{service.description}</p>
                
                <div className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-[#0056b3]" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button 
                  type="button" 
                  onClick={() => index === 2 ? navigate('/mining') : navigate('/shop')}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0a2540] text-white font-bold rounded-lg hover:bg-[#0056b3] transition-colors cursor-pointer"
                >
                  <span>Learn More</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section - Onstream Media Style */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAPABILITIES.map((capability, index) => (
              <div key={capability.title} className="border border-slate-200 rounded-xl p-6 hover:border-[#0056b3] transition-colors">
                <h3 className="text-lg font-bold text-slate-900 mb-1">{capability.title}</h3>
                <p className="text-sm font-semibold text-[#0056b3] mb-2">{capability.subtitle}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{capability.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Onstream Media Style */}
      <section className="bg-[#0056b3] py-20">
        <div ref={ctaRef.ref} className={`animate-on-scroll ${ctaRef.isVisible ? 'visible' : ''} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center`}>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
            Ready to Elevate Your <span className="text-[#0ea5e9]">Procurement</span> Experience?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            Join businesses and industry leaders who trust MJ Logistics Enterprise for their reliable, verified, and high-quality auto parts, industrial equipment, and mining materials.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button type="button" onClick={() => navigate('/shop')} className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0056b3] font-bold text-lg hover:bg-slate-100 transition-all cursor-pointer">
              <span>Shop Parts</span>
              <ArrowUpRight className="w-5 h-5" />
            </button>
            <button type="button" onClick={() => navigate('/mining')} className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-bold text-lg hover:bg-white/10 transition-all cursor-pointer">
              <span>MJ Mining</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
