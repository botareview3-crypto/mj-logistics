import React from 'react';
import { ShieldCheck, RotateCcw, Truck, Award } from 'lucide-react';

export const TrustStrip: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-5 ${className}`}>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
      {[
        { Icon: Award, bg: 'bg-green-50', color: 'text-[#22C55E]', title: '2-Year Warranty', sub: 'On all OE & aftermarket parts' },
        { Icon: RotateCcw, bg: 'bg-blue-50', color: 'text-[#0077C7]', title: '30-Day Returns', sub: 'Hassle-free parts return & refund' },
        { Icon: ShieldCheck, bg: 'bg-amber-50', color: 'text-amber-500', title: 'Secure Checkout', sub: '100% Fitment guarantee & SSL' },
        { Icon: Truck, bg: 'bg-purple-50', color: 'text-purple-500', title: 'Fast Delivery', sub: 'Dispatched same day locally' },
      ].map(({ Icon, bg, color, title, sub }) => (
        <div key={title} className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${bg} ${color} flex items-center justify-center shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">{title}</h4>
            <p className="text-[10px] sm:text-xs text-gray-500 font-medium">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
