import React, { useState } from 'react';
import { ShoppingCart, Trash2, ShieldCheck, Truck, RotateCcw, CreditCard, ArrowRight, Plus, Minus, CheckCircle2, Tag, Car } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { VehicleFitBadge } from '../components/VehicleFitBadge';

export default function CartPage() {
  const { cart, updateCartQuantity, removeFromCart, clearCart, cartCount, cartSubtotal, activeVehicle, navigate, showToast } = useApp();
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const shippingCost = cartSubtotal >= 75 || cartSubtotal === 0 ? 0 : 9.99;
  const discountAmount = (cartSubtotal * discountPercent) / 100;
  const estimatedTax = (cartSubtotal - discountAmount) * 0.08;
  const grandTotal = cartSubtotal - discountAmount + shippingCost + (cartSubtotal > 0 ? estimatedTax : 0);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    const code = promoCode.toUpperCase();
    if (code === 'AUTOPRO10' || code === 'PROMO10') { setDiscountPercent(10); setPromoApplied(true); showToast('10% Workshop discount applied!', 'success'); }
    else if (code === 'FREESHIP') { setDiscountPercent(5); setPromoApplied(true); showToast('Discount code applied!', 'success'); }
    else { showToast('Invalid promo code. Try "AUTOPRO10"', 'error'); }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => { setIsCheckingOut(false); setOrderComplete(true); clearCart(); showToast('Order #AP-88421 confirmed! Dispatching with Fitment Guarantee.', 'success'); }, 1200);
  };

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm"><CheckCircle2 className="w-10 h-10" /></div>
        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">Order Successfully Placed</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Thank You For Your Order!</h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">Order confirmation #AP-88421 has been recorded. All parts are verified for fitment and prepared for tracked dispatch.</p>
        </div>
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl max-w-md mx-auto text-xs text-left space-y-2">
          <div className="flex justify-between"><span className="text-slate-500">Order Number:</span><span className="font-mono font-bold text-slate-900">AP-88421-2026</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Estimated Delivery:</span><span className="font-bold text-emerald-700">Tomorrow (Tracked Courier)</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Warranty Coverage:</span><span className="font-bold text-slate-900">2-Year Full OE Guarantee</span></div>
        </div>
        <button type="button" onClick={() => { setOrderComplete(false); navigate('/'); }} className="px-6 py-2.5 bg-[#0077C7] hover:bg-[#0060A1] text-white font-bold text-sm rounded-lg shadow-sm cursor-pointer">Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      <Breadcrumbs items={[{ label: 'Shopping Cart' }]} />
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})</h1>
          <p className="text-xs text-slate-500 mt-0.5">Review your selected replacement parts, quantities, and fitment checks.</p>
        </div>
        {cart.length > 0 && <button type="button" onClick={() => { if (window.confirm('Clear all items from your cart?')) clearCart(); }} className="text-xs text-slate-400 hover:text-rose-600 font-semibold flex items-center gap-1 cursor-pointer transition-colors"><Trash2 className="w-3.5 h-3.5" /><span>Clear Cart</span></button>}
      </div>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart items */}
          <div className="lg:col-span-8 space-y-4">
            <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-xl text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#0077C7] shrink-0" />
                {cartSubtotal >= 75 ? <span className="text-sky-950 font-bold">✓ You&apos;ve unlocked <strong className="text-emerald-700 font-black">Free Next-Day Delivery</strong>!</span> : <span className="text-slate-700">Add <strong className="text-[#0077C7] font-bold">${(75 - cartSubtotal).toFixed(2)}</strong> more to get Free Delivery!</span>}
              </div>
              <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden hidden sm:block"><div className="bg-[#0077C7] h-full transition-all" style={{ width: `${Math.min(100, (cartSubtotal / 75) * 100)}%` }} /></div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
              {cart.map(({ part, quantity }) => (
                <div key={part.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
                  <div className="flex items-start gap-3.5 flex-1">
                    <div onClick={() => navigate(`/parts/${part.id}`)} className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 border border-slate-200 rounded-xl p-1.5 shrink-0 flex items-center justify-center cursor-pointer hover:border-[#0077C7] transition-colors">
                      <img src={part.images[0]} alt={part.name} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2"><span className="font-extrabold text-xs text-slate-800 uppercase">{part.brand}</span><span className="text-slate-300">•</span><span className="font-mono text-xs text-slate-500 font-medium">SKU: {part.sku}</span></div>
                      <h3 onClick={() => navigate(`/parts/${part.id}`)} className="text-xs sm:text-sm font-bold text-slate-900 hover:text-[#0077C7] transition-colors cursor-pointer line-clamp-1">{part.name}</h3>
                      <div className="pt-1"><VehicleFitBadge part={part} size="sm" /></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50 overflow-hidden">
                      <button type="button" onClick={() => updateCartQuantity(part.id, quantity - 1)} className="p-1.5 hover:bg-slate-200 text-slate-600 cursor-pointer"><Minus className="w-3.5 h-3.5" /></button>
                      <span className="w-8 text-center text-xs font-bold text-slate-900 font-mono">{quantity}</span>
                      <button type="button" onClick={() => updateCartQuantity(part.id, quantity + 1)} className="p-1.5 hover:bg-slate-200 text-slate-600 cursor-pointer"><Plus className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="text-right min-w-[90px]">
                      <div className="text-sm sm:text-base font-extrabold text-slate-900">${(part.price * quantity).toFixed(2)}</div>
                      <div className="text-[10px] text-slate-400">${part.price.toFixed(2)} each</div>
                    </div>
                    <button type="button" onClick={() => removeFromCart(part.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => navigate('/catalog')} className="text-xs font-bold text-[#0077C7] hover:underline inline-flex items-center gap-1 cursor-pointer">← Continue browsing catalog</button>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
              <h2 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100">Order Summary</h2>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600"><span>Subtotal ({cartCount} items):</span><span className="font-mono font-bold text-slate-900">${cartSubtotal.toFixed(2)}</span></div>
                {discountPercent > 0 && <div className="flex justify-between text-emerald-700 font-bold"><span>Discount ({discountPercent}%):</span><span className="font-mono">-${discountAmount.toFixed(2)}</span></div>}
                <div className="flex justify-between text-slate-600"><span>Delivery:</span><span className="font-mono font-bold">{shippingCost === 0 ? <span className="text-emerald-700">FREE</span> : `$${shippingCost.toFixed(2)}`}</span></div>
                <div className="flex justify-between text-slate-600"><span>Estimated Tax (8%):</span><span className="font-mono font-bold text-slate-900">${estimatedTax.toFixed(2)}</span></div>
                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline"><span className="text-sm font-bold text-slate-900">Total (VAT incl.):</span><span className="text-xl sm:text-2xl font-black text-[#0077C7]">${grandTotal.toFixed(2)}</span></div>
              </div>

              <form onSubmit={handleApplyPromo} className="pt-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input type="text" value={promoCode} onChange={e => setPromoCode(e.target.value)} placeholder="Promo code (e.g. AUTOPRO10)" className="w-full pl-8 pr-2 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg uppercase font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0077C7]" />
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                  <button type="submit" className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors">Apply</button>
                </div>
                {promoApplied && <span className="text-[11px] text-emerald-700 font-semibold block mt-1">✓ Promo code active: {discountPercent}% discount</span>}
              </form>

              <button type="button" disabled={isCheckingOut} onClick={handleCheckout} className="w-full py-3.5 px-4 bg-[#0077C7] hover:bg-[#0060A1] text-white font-extrabold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer">
                {isCheckingOut ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Processing Order...</span></> : <><CreditCard className="w-4 h-4" /><span>Proceed to Checkout</span><ArrowRight className="w-4 h-4 ml-1" /></>}
              </button>

              <div className="pt-3 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" /><span>256-Bit SSL Encrypted Checkout</span></div>
                <div className="flex items-center gap-2"><RotateCcw className="w-3.5 h-3.5 text-amber-600 shrink-0" /><span>30-Day Hassle-Free Parts Return</span></div>
                <div className="flex items-center gap-2"><Car className="w-3.5 h-3.5 text-[#0077C7] shrink-0" /><span>Guaranteed Fitment Pre-Shipment Audit</span></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-5 shadow-xs max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 text-[#0077C7] flex items-center justify-center mx-auto shadow-xs"><ShoppingCart className="w-8 h-8" /></div>
          <div className="space-y-1"><h2 className="text-xl font-bold text-slate-900">Your Cart is Currently Empty</h2><p className="text-xs sm:text-sm text-slate-500">Select your vehicle or browse our system categories to find guaranteed-fit parts.</p></div>
          <button type="button" onClick={() => navigate('/catalog')} className="px-6 py-3 bg-[#0077C7] hover:bg-[#0060A1] text-white font-bold text-sm rounded-lg shadow-sm cursor-pointer inline-flex items-center gap-2"><span>Explore Parts Catalog</span><ArrowRight className="w-4 h-4" /></button>
        </div>
      )}
    </div>
  );
}

