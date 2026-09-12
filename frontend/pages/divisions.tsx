import React from 'react';
import Head from 'next/head';
import { useApp } from '../lib/AppContext';

export default function DivisionsPage() {
  const { navigate } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <Head>
        <title>Our Divisions | MJ Logistics Enterprise</title>
        <meta name="description" content="Learn about the different divisions of MJ Logistics Enterprise" />
      </Head>

      <h1 className="text-4xl font-bold text-slate-900 mb-8">Our Divisions</h1>
      
      <div className="space-y-8">
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Auto & Industrial Parts</h2>
          <p className="text-slate-600 mb-4">Our vehicle-first parts marketplace spanning car parts, workshop accessories, and business equipment.</p>
          <button type="button" onClick={() => navigate('/shop')} className="text-[#0056b3] font-semibold hover:underline cursor-pointer">Explore Parts Marketplace →</button>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">MJ Mining</h2>
          <p className="text-slate-600 mb-4">Diamond and gold mining operations built on responsible extraction and transparent sourcing.</p>
          <button type="button" onClick={() => navigate('/mining')} className="text-[#0056b3] font-semibold hover:underline cursor-pointer">Explore MJ Mining →</button>
        </div>
      </div>
    </div>
  );
}
