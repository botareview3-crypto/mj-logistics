import React, { useCallback, useEffect, useState } from 'react';
import { Bell, Trash2 } from 'lucide-react';
import { useApp } from '../../lib/AppContext';
import { accountApi, StockAlert } from '../../lib/accountApi';
import { PARTS_DATABASE } from '../../lib/data/parts';

// Alerts live in this panel (no emails are sent): a watched part is flagged
// "Back in stock" here as soon as the catalog shows it available again.
export function StockAlertsPanel() {
  const { showToast, navigate } = useApp();
  const [alerts, setAlerts] = useState<StockAlert[] | null>(null);
  const [loadError, setLoadError] = useState('');

  const load = useCallback(() => {
    accountApi.listStockAlerts()
      .then(list => { setAlerts(list); setLoadError(''); })
      .catch(err => setLoadError(err instanceof Error ? err.message : 'Could not load stock alerts.'));
  }, []);
  useEffect(load, [load]);

  const remove = async (partId: string) => {
    try {
      await accountApi.removeStockAlert(partId);
      setAlerts(prev => prev?.filter(a => a.part_id !== partId) ?? prev);
      showToast('Stock alert removed', 'info');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not remove the alert.', 'error');
    }
  };

  return (
    <div id="stock-alerts" className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-5 scroll-mt-28">
      <h2 className="font-display text-lg font-bold text-[#04261D] flex items-center gap-2"><Bell className="w-5 h-5 text-[#0A4A3A]" /> Stock Alerts</h2>

      {loadError && <p className="text-sm text-rose-600">{loadError}</p>}
      {!alerts && !loadError && <p className="text-sm text-slate-400">Loading…</p>}
      {alerts && alerts.length === 0 && (
        <p className="text-sm text-slate-500">You&apos;re not watching any parts. When a part is out of stock, tap &ldquo;Notify me&rdquo; on its page and it will show up here, flagged the moment it&apos;s available again.</p>
      )}

      <div className="space-y-2">
        {alerts?.map(a => {
          const part = PARTS_DATABASE.find(p => p.id === a.part_id);
          const back = !!part?.inStock;
          return (
            <div key={a.id} className="rounded-xl border border-slate-200 p-3 flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <button type="button" onClick={() => navigate(`/parts/${a.part_id}`)} className="text-sm font-semibold text-[#04261D] hover:text-[#0A4A3A] text-left cursor-pointer leading-snug">{a.part_name || part?.name || a.part_id}</button>
                {a.sku && <div className="text-[11px] font-mono text-slate-400">SKU {a.sku}</div>}
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${back ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                {back ? 'Back in stock' : 'Waiting'}
              </span>
              <button type="button" onClick={() => remove(a.part_id)} aria-label="Remove alert" className="p-2 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
