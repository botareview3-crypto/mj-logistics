import { useCallback, useEffect, useState } from 'react';
import { useApp } from './AppContext';
import { accountApi } from './accountApi';

// "Notify me when back in stock" for one part. Signed-out visitors are sent
// to /signin and come back to the part page afterwards.
export function useStockAlert(partId: string, partName: string, sku: string) {
  const { currentUser, isAuthLoading, navigate, showToast } = useApp();
  const [watching, setWatching] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isAuthLoading || !currentUser) { setWatching(false); return; }
    let cancelled = false;
    accountApi.listStockAlerts()
      .then(list => { if (!cancelled) setWatching(list.some(a => a.part_id === partId)); })
      .catch(() => { /* leave as not watching */ });
    return () => { cancelled = true; };
  }, [currentUser, isAuthLoading, partId]);

  const toggle = useCallback(async () => {
    if (!currentUser) {
      showToast('Sign in to get a stock alert for this part.', 'info');
      navigate(`/signin?redirect=${encodeURIComponent(`/parts/${partId}`)}`);
      return;
    }
    setBusy(true);
    try {
      if (watching) {
        await accountApi.removeStockAlert(partId);
        setWatching(false);
        showToast('Stock alert removed', 'info');
      } else {
        await accountApi.addStockAlert(partId, partName, sku);
        setWatching(true);
        showToast('Alert saved — we\'ll flag this part in My Account when it\'s back.', 'success');
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Something went wrong.', 'error');
    } finally {
      setBusy(false);
    }
  }, [currentUser, watching, partId, partName, sku, navigate, showToast]);

  return { watching, busy, toggle };
}
