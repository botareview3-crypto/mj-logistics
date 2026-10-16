import { useCallback, useEffect, useState } from 'react';
import { adminApi, AdminOrder, StockDemand, ORDER_STATUS_OPTIONS } from '../../lib/adminApi';

// Staff view of customer orders. Changing the status here is what customers
// see on their tracking timeline in My Account.
export function AdminOrders({ token }: { token: string }) {
  const [orders, setOrders] = useState<AdminOrder[] | null>(null);
  const [demand, setDemand] = useState<StockDemand[]>([]);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(() => {
    Promise.all([adminApi.listOrders(token, filter), adminApi.stockDemand(token)])
      .then(([o, d]) => { setOrders(o); setDemand(d); setError(''); })
      .catch(err => setError(err instanceof Error ? err.message : 'Could not load orders.'));
  }, [token, filter]);
  useEffect(load, [load]);

  const changeStatus = async (order: AdminOrder, status: string) => {
    setSavingId(order.id);
    try {
      const updated = await adminApi.setOrderStatus(token, order.id, status);
      setOrders(prev => prev?.map(o => (o.id === order.id ? { ...o, status: updated.status } : o)) ?? prev);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update the order.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-lg font-bold text-gray-800">Orders</h2>
          <div className="flex items-center gap-2 text-sm">
            <select value={filter} onChange={e => setFilter(e.target.value)} className="input !w-auto">
              <option value="">All statuses</option>
              {ORDER_STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button type="button" onClick={load} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold">Refresh</button>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {!orders && !error && <p className="text-sm text-gray-400">Loading…</p>}
        {orders && orders.length === 0 && <p className="text-sm text-gray-500">No orders yet.</p>}

        <div className="divide-y">
          {orders?.map(o => (
            <div key={o.id} className="py-3 space-y-2">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <button type="button" onClick={() => setOpenId(openId === o.id ? null : o.id)} className="text-left">
                  <div className="font-mono text-sm font-bold text-gray-900">{o.number}</div>
                  <div className="text-xs text-gray-500">{o.customer.name || o.customer.email} · {new Date(o.created_at).toLocaleString()} · €{o.total.toFixed(2)}</div>
                </button>
                <select
                  value={o.status}
                  disabled={savingId === o.id}
                  onChange={e => changeStatus(o, e.target.value)}
                  className="input !w-auto capitalize"
                >
                  {ORDER_STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              {openId === o.id && (
                <div className="text-xs text-gray-600 space-y-2 bg-gray-50 rounded-lg p-3">
                  <div>
                    {o.items.map(i => <div key={i.part_id}>{i.quantity} × {i.name} <span className="font-mono text-gray-400">({i.sku})</span> @ €{i.unit_price.toFixed(2)}</div>)}
                  </div>
                  <div>
                    {o.address.full_name}, {o.address.line1}{o.address.line2 ? `, ${o.address.line2}` : ''}, {o.address.postal_code} {o.address.city}, {o.address.country}{o.address.phone ? ` · ${o.address.phone}` : ''}
                  </div>
                  <div>{o.customer.email}{o.promo_code ? ` · promo ${o.promo_code}` : ''}</div>
                  <div className="text-gray-400">Prices come from the customer&apos;s browser at checkout — check them against the catalog before confirming.</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-3">
        <h2 className="text-lg font-bold text-gray-800">Stock alert demand</h2>
        {demand.length === 0 ? (
          <p className="text-sm text-gray-500">No customers are waiting on a part.</p>
        ) : (
          <div className="divide-y text-sm">
            {demand.map(d => (
              <div key={d.part_id} className="py-2 flex items-center justify-between gap-3">
                <span>{d.part_name || d.part_id} <span className="font-mono text-xs text-gray-400">{d.sku}</span></span>
                <span className="font-semibold text-gray-700">{d.watchers} waiting</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
