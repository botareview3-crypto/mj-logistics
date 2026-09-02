import React, { useState } from 'react';
import { ShoppingCart, Star, Check } from 'lucide-react';
import { Part } from '../lib/types';
import { useApp } from '../lib/AppContext';
import { VehicleFitBadge } from './VehicleFitBadge';
import Image from 'next/image';

interface ProductCardProps {
  part: Part;
  viewMode?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ part, viewMode = 'grid' }) => {
  const { addToCart, navigate } = useApp();
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(part, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleCardClick = () => navigate(`/parts/${part.id}`);

  if (viewMode === 'list') {
    return (
      <div onClick={handleCardClick} className="bg-white rounded-xl border border-slate-200 hover:border-[#0077C7] hover:shadow-md transition-all p-4 flex flex-col sm:flex-row items-center gap-4 cursor-pointer group">
        <div className="w-full sm:w-40 h-36 bg-slate-50 rounded-lg overflow-hidden border border-slate-100 shrink-0 relative flex items-center justify-center p-2">
          <img src={part.images[0]} alt={part.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" loading="lazy" />
          {part.isBestSeller && <span className="absolute top-2 left-2 bg-amber-500 text-white font-bold text-[10px] uppercase px-1.5 py-0.5 rounded-xs tracking-wider">Top Seller</span>}
        </div>
        <div className="flex-1 space-y-2 w-full">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{part.brand}</span>
            <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /><span>{part.rating}</span><span className="text-slate-400">({part.reviewCount})</span>
            </div>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#0077C7] transition-colors leading-snug">{part.name}</h3>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-mono bg-slate-100 px-2 py-0.5 rounded-xs font-medium">SKU: {part.sku}</span>
            {part.position && <span className="bg-sky-50 text-sky-800 px-2 py-0.5 rounded-xs font-medium">Position: {part.position}</span>}
          </div>
          <div className="pt-1"><VehicleFitBadge part={part} size="sm" /></div>
        </div>
        <div className="w-full sm:w-48 sm:border-l sm:border-slate-100 sm:pl-4 flex flex-col justify-between items-start sm:items-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div className="text-left sm:text-right w-full">
            <div className="flex items-baseline gap-2 sm:justify-end">
              <span className="text-xl font-extrabold text-slate-900">${part.price.toFixed(2)}</span>
              {part.originalPrice && <span className="text-xs text-slate-400 line-through">${part.originalPrice.toFixed(2)}</span>}
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold flex items-center sm:justify-end gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /><span>In Stock ({part.stockCount} available)</span>
            </div>
          </div>
          <button onClick={handleAddToCart} className={`w-full py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${justAdded ? 'bg-emerald-600 text-white' : 'bg-[#0077C7] hover:bg-[#0060A1] text-white shadow-xs'}`}>
            {justAdded ? <><Check className="w-3.5 h-3.5" /><span>Added!</span></> : <><ShoppingCart className="w-3.5 h-3.5" /><span>Add to Cart</span></>}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div onClick={handleCardClick} className="bg-white rounded-xl border border-slate-200 hover:border-[#0077C7] hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group relative overflow-hidden">
      <div className="relative p-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-center h-44 overflow-hidden">
        <img src={part.images[0]} alt={part.name} className="max-h-36 max-w-full object-contain group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {part.isBestSeller && <span className="bg-amber-500 text-white font-black text-[9px] uppercase px-1.5 py-0.5 rounded-xs tracking-wider shadow-xs">Top Seller</span>}
          {part.originalPrice && <span className="bg-rose-500 text-white font-black text-[9px] uppercase px-1.5 py-0.5 rounded-xs tracking-wider shadow-xs">Save ${(part.originalPrice - part.price).toFixed(0)}</span>}
        </div>
        <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-slate-200/80 text-[11px] font-bold text-slate-800 shadow-xs">{part.brand}</div>
      </div>
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-mono text-slate-500 font-semibold truncate">SKU: {part.sku}</span>
            <div className="flex items-center gap-1 text-amber-600 font-semibold"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /><span>{part.rating}</span></div>
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#0077C7] transition-colors line-clamp-2 leading-snug">{part.name}</h3>
          <div className="flex flex-wrap gap-1 text-[10px] text-slate-600 pt-0.5">
            {part.position && <span className="bg-slate-100 px-1.5 py-0.5 rounded-xs font-medium">{part.position}</span>}
            {part.material && <span className="bg-slate-100 px-1.5 py-0.5 rounded-xs font-medium truncate max-w-[130px]">{part.material}</span>}
          </div>
        </div>
        <div className="pt-1"><VehicleFitBadge part={part} size="sm" /></div>
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base sm:text-lg font-black text-slate-900">${part.price.toFixed(2)}</span>
                {part.originalPrice && <span className="text-xs text-slate-400 line-through">${part.originalPrice.toFixed(2)}</span>}
              </div>
              <div className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /><span>In Stock ({part.stockCount} pcs)</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-500 text-right"><span>Delivery:</span><strong className="block text-slate-700 font-semibold">1-2 days</strong></div>
          </div>
          <button onClick={handleAddToCart} className={`w-full mt-2.5 py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${justAdded ? 'bg-emerald-600 text-white' : 'bg-[#0077C7] hover:bg-[#0060A1] text-white shadow-xs'}`}>
            {justAdded ? <><Check className="w-3.5 h-3.5" /><span>Added to Cart</span></> : <><ShoppingCart className="w-3.5 h-3.5" /><span>Add to Cart</span></>}
          </button>
        </div>
      </div>
    </div>
  );
};
