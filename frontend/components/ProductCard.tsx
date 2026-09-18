import React, { useState } from 'react';
import { ShoppingCart, Star, Check, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Part } from '../lib/types';
import { useApp } from '../lib/AppContext';
import { VehicleFitBadge } from './VehicleFitBadge';
import { SPRINGS } from '../lib/springs';

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

  /* ── List mode ──────────────────────────────────────────────────────── */
  if (viewMode === 'list') {
    return (
      <motion.div
        className="product-card bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center gap-4 group cursor-pointer"
        whileHover={{ borderColor: '#1e4d8c' }}
        transition={SPRINGS.snappy}
        onClick={goToDetail}
      >
        {/* Image */}
        <div className="relative w-full sm:w-[100px] h-[90px] bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden p-2">
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
          <p className="text-[11px] font-bold uppercase text-[#1e4d8c]" style={{ letterSpacing: '0.08em' }}>{part.brand}</p>
          <button
            type="button"
            onClick={e => { e.stopPropagation(); goToDetail(); }}
            className="font-display text-[15px] font-semibold text-[#0d1f3c] hover:text-[#1e4d8c] transition-colors leading-snug line-clamp-1 text-left cursor-pointer"
          >
            {part.name}
          </button>
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
            <span className="font-mono bg-slate-100 px-2 py-0.5 rounded-md">SKU: {part.sku}</span>
            {part.position && <span className="bg-sky-50 text-[#1e4d8c] px-2 py-0.5 rounded-md">{part.position}</span>}
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
              {part.originalPrice && <span className="text-xs text-slate-400 line-through">€{part.originalPrice.toFixed(2)}</span>}
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center sm:justify-end gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> In Stock
            </p>
          </div>
          <motion.button
            onClick={e => { e.stopPropagation(); handleAddToCart(e); }}
            className={`w-full py-2 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
              justAdded ? 'bg-emerald-600 text-white' : 'bg-[#0d1f3c] hover:bg-[#1a3560] text-white'
            }`}
            whileTap={{ scale: 0.97 }}
            transition={SPRINGS.micro}
          >
            <AnimatePresence mode="wait" initial={false}>
              {justAdded ? (
                <motion.span key="added" className="flex items-center gap-1.5"
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  transition={SPRINGS.momentum}>
                  <Check className="w-3.5 h-3.5" />Added!
                </motion.span>
              ) : (
                <motion.span key="add" className="flex items-center gap-1.5"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={SPRINGS.micro}>
                  <ShoppingCart className="w-3.5 h-3.5" />Add to Cart
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>
    );
  }

  /* ── Grid mode ──────────────────────────────────────────────────────── */
  return (
    <motion.div
      className="product-card bg-white rounded-2xl border border-slate-200 flex flex-col group overflow-hidden cursor-pointer"
      whileHover={{ y: -3, borderColor: '#1e4d8c', boxShadow: '0 16px 40px rgba(13,31,60,0.12)' }}
      whileTap={{ scale: 0.99 }}
      transition={SPRINGS.default}
      onClick={goToDetail}
    >
      {/* Image area */}
      <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center h-44 overflow-hidden">
        <img
          src={part.images[0]}
          alt={part.name}
          className="max-h-36 max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {part.isBestSeller && (
            <span className="bg-[#e8a020] text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded-full" style={{ letterSpacing: '0.06em' }}>
              Best Seller
            </span>
          )}
          {part.originalPrice && (
            <span className="bg-rose-500 text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded-full" style={{ letterSpacing: '0.06em' }}>
              Save €{(part.originalPrice - part.price).toFixed(0)}
            </span>
          )}
        </div>
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
          <button
            type="button"
            onClick={e => { e.stopPropagation(); goToDetail(); }}
            className="font-display text-[14px] font-semibold text-[#0d1f3c] group-hover:text-[#1e4d8c] transition-colors line-clamp-2 leading-snug text-left cursor-pointer"
          >
            {part.name}
          </button>
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
                {part.originalPrice && <span className="text-[11px] text-slate-400 line-through">€{part.originalPrice.toFixed(2)}</span>}
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

          <motion.button
            onClick={e => { e.stopPropagation(); handleAddToCart(e); }}
            className={`w-full py-2 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
              justAdded ? 'bg-emerald-600 text-white' : 'bg-[#0d1f3c] hover:bg-[#1a3560] text-white'
            }`}
            whileTap={{ scale: 0.97 }}
            transition={SPRINGS.micro}
          >
            <AnimatePresence mode="wait" initial={false}>
              {justAdded ? (
                <motion.span key="added" className="flex items-center gap-1.5"
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  transition={SPRINGS.momentum}>
                  <Check className="w-3.5 h-3.5" />Added to Cart
                </motion.span>
              ) : (
                <motion.span key="add" className="flex items-center gap-1.5"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={SPRINGS.micro}>
                  <ShoppingCart className="w-3.5 h-3.5" />Add to Cart
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
