import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Package, ChevronDown, ChevronUp, Check, XCircle } from 'lucide-react';
import { useApp } from '../../lib/AppContext';
import { accountApi, Order, OrderStatus } from '../../lib/accountApi';
import { formatAddressLines } from './AddressForm';

// The steps a normal order moves through (cancelled orders show their own state).
export const ORDER_STEPS: { status: OrderStatus; label: string; hint: string }[] = [
  { status: 'received',   label: 'Received',   hint: 'We have your order and are reviewing it.' },
  { status: 'confirmed',  label: 'Confirmed',  hint: 'Your order is confirmed.' },
  { status: 'packed',     label: 'Packed',     hint: 'Your parts are packed.' },
  { status: 'dispatched', label: 'Dispatched', hint: 'On its way to you.' },
  { status: 'delivered',  label: 'Delivered',  hint: 'Delivered.' },
];

const STATUS_STYLE: Record<OrderStatus, string> = {
  received: 'bg-slate-100 text-slate-700 border-slate-200',
  confirmed: 'bg-sky-50 text-sky-700 border-sky-200',
  packed: 'bg-amber-50 text-amber-700 border-amber-200',
  dispatched: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
};

export const statusLabel = (s: OrderStatus) =>
  s === 'cancelled' ? 'Cancelled' : ORDER_STEPS.find(x => x.status === s)?.label ?? s;

const money = (n: number) => `€${n.toFixed(2)}`;
const when = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export function OrdersPanel() {
  const { showToast, navigate } = useApp();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loadError, setLoadError] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const load = useCallback(() => {
    accountApi.listOrders()
      .then(list => { setOrders(list); setLoadError(''); })
      .catch(err => setLoadError(err instanceof Error ? err.message : 'Could not load orders.'));
  }, []);
  useEffect(load, [load]);

  // /account?order=MJ-... (from the order confirmation) opens that order.
  useEffect(() => {
    if (!orders || !router.isReady) return;
    const wanted = router.query.order;
    if (typeof wanted === 'string') {
      const match = orders.find(o => o.number === wanted);
      if (match) setOpenId(match.id);
    }
  }, [orders, router.isReady, router.query.order]);

  const cancel = async (o: Order) => {
    if (!window.confirm(`Cancel order ${o.number}?`)) return;
    setCancelling(o.id);
    try {
      const updated = await accountApi.cancelOrder(o.id);
      setOrders(prev => prev?.map(x => (x.id === updated.id ? updated : x)) ?? prev);
      showToast('Order cancelled', 'info');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not cancel the order.', 'error');
    } finally {
      setCancelling(null);
    }
  };

  return (
    <div id="orders" className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-5 scroll-mt-28">
      <h2 className="font-display text-lg font-bold text-[#04261D] flex items-center gap-2"><Package className="w-5 h-5 text-[#0A4A3A]" /> Orders</h2>

      {loadError && <p className="text-sm text-rose-600">{loadError}</p>}
      {!orders && !loadError && <p className="text-sm text-slate-400">Loading…</p>}
      {orders && orders.length === 0 && (
        <div className="text-sm text-slate-500">
          You haven&apos;t placed an order yet.{' '}
          <button type="button" onClick={() => navigate('/catalog')} className="font-semibold text-[#0A4A3A] hover:underline cursor-pointer">Browse the catalog</button>
        </div>
      )}

      <div className="space-y-3">
        {orders?.map(o => {
          const open = openId === o.id;
          const reached = new Set(o.history.map(h => h.status));
          return (
            <div key={o.id} className="rounded-xl border border-slate-200 overflow-hidden">
              <button type="button" onClick={() => setOpenId(open ? null : o.id)} className="w-full p-4 flex items-center justify-between gap-4 text-left hover:bg-slate-50 cursor-pointer">
                <div className="min-w-0">
                  <div className="font-mono text-sm font-bold text-[#04261D]">{o.number}</div>
                  <div className="text-[11px] text-slate-500">{when(o.created_at)} · {o.items.reduce((n, i) => n + i.quantity, 0)} item{o.items.reduce((n, i) => n + i.quantity, 0) === 1 ? '' : 's'}</div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${STATUS_STYLE[o.status]}`}>{statusLabel(o.status)}</span>
                  <span className="text-sm font-bold text-[#04261D] hidden sm:block">{money(o.total)}</span>
                  {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </button>

              {open && (
                <div className="border-t border-slate-100 p-4 sm:p-5 space-y-5 bg-slate-50/40">
                  {/* Tracking */}
                  {o.status === 'cancelled' ? (
                    <div className="flex items-center gap-2 text-sm text-rose-700"><XCircle className="w-4 h-4" /> This order was cancelled on {when(o.history[o.history.length - 1]?.at ?? o.updated_at)}.</div>
                  ) : (
                    <ol className="space-y-3">
                      {ORDER_STEPS.map(step => {
                        const entry = o.history.find(h => h.status === step.status);
                        const done = reached.has(step.status);
                        const current = o.status === step.status;
                        return (
                          <li key={step.status} className="flex items-start gap-3">
                            <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${done ? 'bg-[#0A4A3A] border-[#0A4A3A] text-white' : 'bg-white border-slate-300 text-transparent'}`}><Check className="w-3 h-3" /></span>
                            <div>
                              <div className={`text-sm ${current ? 'font-bold text-[#04261D]' : done ? 'font-semibold text-slate-700' : 'text-slate-400'}`}>{step.label}</div>
                              <div className="text-[11px] text-slate-400">{entry ? when(entry.at) : step.hint}</div>
                            </div>
                          </li>
                        );
                      })}
                    </ol>
                  )}

                  {/* Items */}
                  <div className="divide-y divide-slate-100 bg-white rounded-xl border border-slate-200">
                    {o.items.map(i => (
                      <div key={i.part_id} className="p-3 flex items-center gap-3">
                        {i.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={i.image} alt="" className="w-12 h-12 object-contain bg-slate-50 rounded-lg border border-slate-100 shrink-0" loading="lazy" />
                        )}
                        <div className="min-w-0 flex-1">
                          <button type="button" onClick={() => navigate(`/parts/${i.part_id}`)} className="text-sm font-semibold text-[#04261D] hover:text-[#0A4A3A] text-left cursor-pointer leading-snug">{i.name}</button>
                          <div className="text-[11px] text-slate-400">{[i.brand, i.sku && `SKU ${i.sku}`].filter(Boolean).join(' · ')}</div>
                        </div>
                        <div className="text-right text-xs text-slate-500 shrink-0">{i.quantity} × {money(i.unit_price)}</div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                    <div>
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Delivering to</div>
                      <div className="text-slate-600 leading-relaxed">{formatAddressLines(o.address).map((l, i) => <div key={i}>{l}</div>)}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>{money(o.subtotal)}</span></div>
                      {o.discount > 0 && <div className="flex justify-between text-emerald-700"><span>Discount{o.promo_code ? ` (${o.promo_code})` : ''}</span><span>−{money(o.discount)}</span></div>}
                      <div className="flex justify-between text-slate-600"><span>Delivery</span><span>{o.shipping === 0 ? 'FREE' : money(o.shipping)}</span></div>
                      <div className="flex justify-between text-slate-600"><span>VAT (8%)</span><span>{money(o.vat)}</span></div>
                      <div className="flex justify-between font-bold text-[#04261D] pt-1 border-t border-slate-200"><span>Total</span><span>{money(o.total)}</span></div>
                    </div>
                  </div>

                  {o.can_cancel && (
                    <button type="button" disabled={cancelling === o.id} onClick={() => cancel(o)} className="text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer disabled:opacity-60">
                      {cancelling === o.id ? 'Cancelling…' : 'Cancel this order'}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
