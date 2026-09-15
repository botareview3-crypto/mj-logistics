import React, { useState } from 'react';
import { ShoppingCart, Star, Check, Zap } from 'lucide-react';
import { Part } from '../lib/types';
import { useApp } from '../lib/AppContext';
import { VehicleFitBadge } from './VehicleFitBadge';

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
    setTimeout(() => setJustAdded(false), 1600);
  };

  const goToDetail = () => navigate(`/parts/${part.id}`);

  /* ── List mode ─────────────────────────────────────────────────────── */
  if (viewMode === 'list') {
    return (
      <div
        onClick={goToDetail}
        className="product-card bg-white rounded-2xl border border-slate-200 hover:border-[#1e4d8c] p-4 flex flex-col sm:flex-row items-center gap-4 cursor-pointer group"
      >
        {/* Image */}
        <div className="w-full sm:w-[100px] h-[90px] bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden p-2">
          <img
            src={part.images[0]}
            alt={part.name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />
          {part.isBestSeller && (
            <span className="absolute top-2 left-2 bg-[#e8a020] text-white font-bold text-[9px] uppercase px-1.5 py-0.5 rounded-full">
              Top Seller
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 space-y-1.5 min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#1e4d8c]">{part.brand}</p>
          <h3 className="font-display text-[15px] font-semibold text-[#0d1f3c] group-hover:text-[#1e4d8c] transition-colors leading-snug line-clamp-1">
            {part.name}
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
            <span className="font-mono bg-slate-100 px-2 py-0.5 rounded-md">SKU: {part.sku}</span>
            {part.position && (
              <span className="bg-sky-50 text-[#1e4d8c] px-2 py-0.5 rounded-md">{part.position}</span>
            )}
            <div className="flex items-center gap-1 text-[#e8a020]">
              <Star className="w-3 h-3 fill-[#e8a020]" />
              <span className="font-semibold text-slate-700">{part.rating}</span>
              <span className="text-slate-400">({part.reviewCount})</span>
            </div>
          </div>
          <VehicleFitBadge part={part} size="sm" />
        </div>

        {/* Price + CTA */}
        <div className="w-full sm:w-44 flex flex-col items-start sm:items-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 sm:border-l sm:pl-4 shrink-0">
          <div className="text-right w-full">
            <div className="flex items-baseline gap-1.5 sm:justify-end">
              <span className="font-display text-xl font-bold text-[#0d1f3c]">€{part.price.toFixed(2)}</span>
              {part.originalPrice && (
                <span className="text-xs text-slate-400 line-through">€{part.originalPrice.toFixed(2)}</span>
              )}
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center sm:justify-end gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              In Stock
            </p>
          </div>
          <button
            onClick={handleAddToCart}
            className={`w-full py-2 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#0d1f3c] hover:bg-[#1a3560] text-white'
            }`}
          >
            {justAdded
              ? <><Check className="w-3.5 h-3.5" /><span>Added!</span></>
              : <><ShoppingCart className="w-3.5 h-3.5" /><span>Add to Cart</span></>
            }
          </button>
        </div>
      </div>
    );
  }

  /* ── Grid mode ─────────────────────────────────────────────────────── */
  return (
    <div
      onClick={goToDetail}
      className="product-card bg-white rounded-2xl border border-slate-200 hover:border-[#1e4d8c] flex flex-col cursor-pointer group overflow-hidden"
    >
      {/* Image area */}
      <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center h-44 overflow-hidden">
        <img
          src={part.images[0]}
          alt={part.name}
          className="max-h-36 max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
        {/* Badges top-left */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {part.isBestSeller && (
            <span className="bg-[#e8a020] text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded-full tracking-wider">
              Best Seller
            </span>
          )}
          {part.originalPrice && (
            <span className="bg-rose-500 text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded-full tracking-wider">
              Save €{(part.originalPrice - part.price).toFixed(0)}
            </span>
          )}
        </div>
        {/* Brand badge top-right */}
        <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-lg border border-slate-200 text-[11px] font-bold text-[#0d1f3c]">
          {part.brand}
        </span>
      </div>

      {/* Info */}
      <div className="p-3.5 flex flex-col flex-1 gap-2.5">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="font-mono">SKU: {part.sku}</span>
            <div className="flex items-center gap-0.5 text-[#e8a020]">
              <Star className="w-3 h-3 fill-[#e8a020]" />
              <span className="font-semibold text-slate-600">{part.rating}</span>
            </div>
          </div>
          <h3 className="font-display text-[14px] font-semibold text-[#0d1f3c] group-hover:text-[#1e4d8c] transition-colors line-clamp-2 leading-snug">
            {part.name}
          </h3>
          {part.position && (
            <span className="inline-block mt-1 text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-medium">
              {part.position}
            </span>
          )}
        </div>

        <VehicleFitBadge part={part} size="sm" />

        {/* Price + CTA */}
        <div className="mt-auto pt-2.5 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-[18px] font-bold text-[#0d1f3c]">€{part.price.toFixed(2)}</span>
                {part.originalPrice && (
                  <span className="text-[11px] text-slate-400 line-through">€{part.originalPrice.toFixed(2)}</span>
                )}
              </div>
              <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                In Stock · {part.deliveryDays}–{part.deliveryDays + 1} days
              </p>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-500">
              <Zap className="w-3 h-3 text-[#e8a020]" />
              <span>{part.warrantyYears}yr warranty</span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className={`w-full py-2 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#0d1f3c] hover:bg-[#1a3560] text-white'
            }`}
          >
            {justAdded
              ? <><Check className="w-3.5 h-3.5" /><span>Added to Cart</span></>
              : <><ShoppingCart className="w-3.5 h-3.5" /><span>Add to Cart</span></>
            }
          </button>
        </div>
      </div>
    </div>
  );
};
