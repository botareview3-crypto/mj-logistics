import React from 'react';
import Head from 'next/head';
import { useApp } from '../lib/AppContext';
import { Award, Truck, ShieldCheck, Clock, Globe, Users } from 'lucide-react';

export default function AdvantagesPage() {
  const { navigate } = useApp();

  const advantages = [
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'Every part is verified against real vehicle fitment data before shipping'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: '24-48 hour dispatch with tracked local courier service'
    },
    {
      icon: ShieldCheck,
      title: '2-Year Warranty',
      description: 'Comprehensive warranty coverage on all parts and equipment'
    },
    {
      icon: Clock,
      title: '30-Day Returns',
      description: 'Hassle-free return policy for customer satisfaction'
    },
    {
      icon: Globe,
      title: 'Global Sourcing',
      description: 'Access to parts and equipment from manufacturers worldwide'
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: 'Technical assistance and support for all your needs'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <Head>
        <title>Our Advantages | MJ Logistics Enterprise</title>
        <meta name="description" content="Discover the advantages of choosing MJ Logistics Enterprise for your parts and equipment needs" />
      </Head>

      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">Why Choose Us</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Discover the advantages that make MJ Logistics Enterprise your trusted partner for auto parts, industrial equipment, and mining materials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {advantages.map((advantage, index) => (
          <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#0056b3] rounded-lg flex items-center justify-center mb-4">
              <advantage.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{advantage.title}</h3>
            <p className="text-slate-600">{advantage.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-slate-600 mb-4">Ready to experience these advantages?</p>
        <button
          type="button"
          onClick={() => navigate('/contact')}
          className="inline-flex items-center gap-2 px-8 py-3 bg-[#0056b3] hover:bg-[#004494] text-white font-bold rounded-lg transition-colors cursor-pointer"
        >
          Get in Touch
        </button>
      </div>
    </div>
  );
}
