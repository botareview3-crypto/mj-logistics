import React, { useState } from 'react';
import {
  ShoppingCart, Trash2, ShieldCheck, Truck, RotateCcw,
  CreditCard, ArrowRight, Plus, Minus, CheckCircle2,
  Tag, Car, Lock, Package,
} from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { VehicleFitBadge } from '../components/VehicleFitBadge';

export default function CartPage() {
  const {
    cart, updateCartQuantity, removeFromCart, clearCart,
    cartCount, cartSubtotal, activeVehicle,
    navigate, showToast, currentUser, isAuthLoading,
  } = useApp();

  const [promoCode,       setPromoCode]       = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoApplied,    setPromoApplied]    = useState(false);
  const [isCheckingOut,   setIsCheckingOut]   = useState(false);
  const [orderComplete,   setOrderComplete]   = useState(false);

  const shippingCost    = cartSubtotal >= 75 || cartSubtotal === 0 ? 0 : 9.99;
  const discountAmount  = (cartSubtotal * discountPercent) / 100;
  const estimatedVat    = (cartSubtotal - discountAmount) * 0.08;
  const grandTotal      = cartSubtotal - discountAmount + shippingCost + (cartSubtotal > 0 ? estimatedVat : 0);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    const code = promoCode.toUpperCase();
    if (code === 'AUTOPRO10' || code === 'PROMO10') {
      setDiscountPercent(10); setPromoApplied(true);
      showToast('10% discount applied!', 'success');
    } else if (code === 'FREESHIP') {
      setDiscountPercent(5); setPromoApplied(true);
      showToast('Discount code applied!', 'success');
    } else {
      showToast('Invalid code. Try "AUTOPRO10"', 'error');
    }
  };

  const handleCheckout = () => {
    if (isAuthLoading) return;
    if (!currentUser) {
      showToast('Sign in to complete your order — your cart will be waiting.', 'info');
      navigate('/signin?redirect=/cart');
      return;
    }
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
      clearCart();
      showToast('Order #AP-88421 confirmed! Dispatching with Fitment Guarantee.', 'success');
    }, 1200);
  };

  /* ── Order success ────────────────────────────────────────────────── */
  if (orderComplete) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div>
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-3">
            Order Placed
          </span>
          <h1 className="font-display text-3xl font-bold text-[#0d1f3c]">Thank You!</h1>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            Order #AP-88421 is confirmed. Parts are verified for fitment and prepared for dispatch.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 text-sm text-left space-y-3">
          {[
            { label: 'Order Number',     value: 'AP-88421-2026' },
            { label: 'Est. Delivery',    value: 'Tomorrow (Tracked)' },
            { label: 'Warranty',         value: '2-Year OE Guarantee' },
          ].map(row => (
            <div key={row.label} className="flex justify-between">
              <span className="text-slate-500">{row.label}</span>
              <span className="font-semibold text-[#0d1f3c]">{row.value}</span>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => { setOrderComplete(false); navigate('/shop'); }}
          className="px-7 py-3 bg-[#0d1f3c] hover:bg-[#1a3560] text-white font-semibold rounded-xl cursor-pointer transition-colors inline-flex items-center gap-2"
        >
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      <Breadcrumbs items={[{ label: 'Shopping Cart' }]} />

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#0d1f3c]">
            Shopping Cart
            <span className="ml-2 text-[20px] font-normal text-slate-400">({cartCount})</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Review your parts, quantities, and fitment checks.</p>
        </div>
        {cart.length > 0 && (
          <button
            type="button"
            onClick={() => { if (window.confirm('Clear all items?')) clearCart(); }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-600 font-semibold transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear all
          </button>
        )}
      </div>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ── Cart items ─────────────────────────────────────────── */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free shipping progress */}
            <div className="flex items-center gap-3 px-4 py-3 bg-sky-50 border border-sky-200 rounded-xl text-xs">
              <Truck className="w-4 h-4 text-[#1e4d8c] shrink-0" />
              {cartSubtotal >= 75
                ? <span className="font-semibold text-[#0d1f3c]">✓ You've unlocked <strong className="text-emerald-700">Free Delivery!</strong></span>
                : <span className="text-slate-700">Add <strong className="text-[#1e4d8c]">€{(75 - cartSubtotal).toFixed(2)}</strong> more for free delivery</span>
              }
              <div className="ml-auto w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden hidden sm:block">
                <div
                  className="h-full bg-[#1e4d8c] rounded-full transition-all"
                  style={{ width: `${Math.min(100, (cartSubtotal / 75) * 100)}%` }}
                />
              </div>
            </div>

            {/* Items list */}
            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
              {cart.map(({ part, quantity }) => (
                <div key={part.id} className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4">
                  {/* Image */}
                  <button
                    type="button"
                    onClick={() => navigate(`/parts/${part.id}`)}
                    className="w-full sm:w-20 h-20 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center p-2 shrink-0 hover:border-[#1e4d8c] transition-colors cursor-pointer"
                  >
                    <img src={part.images[0]} alt={part.name} className="max-h-full max-w-full object-contain" loading="lazy" />
                  </button>

                  {/* Info */}
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="font-bold text-[#1e4d8c] uppercase">{part.brand}</span>
                      <span className="text-slate-300">·</span>
                      <span className="font-mono text-slate-400">SKU: {part.sku}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate(`/parts/${part.id}`)}
                      className="font-display text-[15px] font-semibold text-[#0d1f3c] hover:text-[#1e4d8c] transition-colors cursor-pointer text-left leading-snug"
                    >
                      {part.name}
                    </button>
                    <VehicleFitBadge part={part} size="sm" />
                  </div>

                  {/* Controls */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-between gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                    {/* Qty stepper */}
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(part.id, quantity - 1)}
                        className="p-2 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-[#0d1f3c] font-mono">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(part.id, quantity + 1)}
                        className="p-2 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Line price + remove */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-display font-bold text-[18px] text-[#0d1f3c]">€{(part.price * quantity).toFixed(2)}</p>
                        <p className="text-[11px] text-slate-400">€{part.price.toFixed(2)} each</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(part.id)}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                        aria-label={`Remove ${part.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => navigate('/catalog')}
              className="text-[13px] font-semibold text-[#1e4d8c] hover:text-[#0d1f3c] transition-colors cursor-pointer"
            >
              ← Continue browsing catalog
            </button>
          </div>

          {/* ── Order summary ──────────────────────────────────────── */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h2 className="font-display text-xl font-bold text-[#0d1f3c] pb-3 border-b border-slate-100">
                Order Summary
              </h2>

              {/* Line items */}
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="font-semibold text-[#0d1f3c]">€{cartSubtotal.toFixed(2)}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({discountPercent}%)</span>
                    <span>−€{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Delivery</span>
                  <span className={`font-semibold ${shippingCost === 0 ? 'text-emerald-700' : 'text-[#0d1f3c]'}`}>
                    {shippingCost === 0 ? 'FREE' : `€${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>VAT (8%)</span>
                  <span className="font-semibold text-[#0d1f3c]">€{estimatedVat.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="font-bold text-[#0d1f3c]">Total</span>
                  <span className="font-display text-2xl font-bold text-[#0d1f3c]">€{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo code */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value)}
                    placeholder="Promo code"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl uppercase font-mono focus:outline-none focus:ring-2 focus:ring-[#1e4d8c] focus:bg-white transition-all"
                  />
                </div>
                <button type="submit" className="px-4 py-2.5 bg-[#0d1f3c] hover:bg-[#1a3560] text-white text-xs font-bold rounded-xl cursor-pointer transition-colors">
                  Apply
                </button>
              </form>
              {promoApplied && (
                <p className="text-xs text-emerald-700 font-semibold -mt-2">✓ {discountPercent}% discount active</p>
              )}

              {/* Checkout button */}
              <button
                type="button"
                disabled={isCheckingOut || isAuthLoading}
                onClick={handleCheckout}
                className="w-full py-4 bg-[#0d1f3c] hover:bg-[#1a3560] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isCheckingOut ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Processing…</span></>
                ) : currentUser ? (
                  <><CreditCard className="w-4 h-4" /><span>Proceed to Checkout</span><ArrowRight className="w-4 h-4" /></>
                ) : (
                  <><Lock className="w-4 h-4" /><span>Sign In to Checkout</span></>
                )}
              </button>
              {!currentUser && !isAuthLoading && (
                <p className="text-[11px] text-slate-400 text-center -mt-1">You'll sign in, then come right back.</p>
              )}

              {/* Trust items */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-[12px] text-slate-500">
                {[
                  { icon: ShieldCheck, color: 'text-emerald-500', label: '256-Bit SSL Encrypted Checkout' },
                  { icon: RotateCcw,   color: 'text-amber-500',   label: '30-Day Hassle-Free Returns'     },
                  { icon: Car,         color: 'text-[#1e4d8c]',   label: 'Guaranteed Fitment Verification' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2">
                    <item.icon className={`w-3.5 h-3.5 shrink-0 ${item.color}`} />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── Empty state ────────────────────────────────────────────── */
        <div className="bg-white rounded-2xl border border-slate-200 p-14 text-center space-y-5 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center mx-auto">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-[#0d1f3c]">Your Cart is Empty</h2>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">Select your vehicle or browse categories to find guaranteed-fit parts.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/catalog')}
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#0d1f3c] hover:bg-[#1a3560] text-white font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <Package className="w-4 h-4" /> Browse Catalog
          </button>
        </div>
      )}
    </div>
  );
}
