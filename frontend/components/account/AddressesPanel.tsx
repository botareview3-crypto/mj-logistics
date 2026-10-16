import React, { useCallback, useEffect, useState } from 'react';
import { MapPin, Plus, Pencil, Trash2, Star } from 'lucide-react';
import { useApp } from '../../lib/AppContext';
import { accountApi, SavedAddress, AddressInput } from '../../lib/accountApi';
import { AddressForm, formatAddressLines } from './AddressForm';

export function AddressesPanel() {
  const { showToast } = useApp();
  const [addresses, setAddresses] = useState<SavedAddress[] | null>(null);
  const [loadError, setLoadError] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = useCallback(() => {
    accountApi.listAddresses()
      .then(list => { setAddresses(list); setLoadError(''); })
      .catch(err => setLoadError(err instanceof Error ? err.message : 'Could not load addresses.'));
  }, []);
  useEffect(load, [load]);

  const create = async (a: AddressInput) => {
    await accountApi.createAddress(a);
    setAdding(false);
    showToast('Address saved', 'success');
    load();
  };
  const update = async (id: string, a: AddressInput) => {
    await accountApi.updateAddress(id, a);
    setEditingId(null);
    showToast('Address updated', 'success');
    load();
  };
  const remove = async (id: string) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await accountApi.deleteAddress(id);
      showToast('Address deleted', 'info');
      load();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not delete the address.', 'error');
    }
  };
  const makeDefault = async (a: SavedAddress) => {
    try {
      const { id, ...rest } = a;
      await accountApi.updateAddress(id, { ...rest, is_default: true });
      load();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not update the address.', 'error');
    }
  };

  return (
    <div id="addresses" className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-5 scroll-mt-28">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-lg font-bold text-[#04261D] flex items-center gap-2"><MapPin className="w-5 h-5 text-[#0A4A3A]" /> Saved Addresses</h2>
        {!adding && addresses && (
          <button type="button" onClick={() => { setAdding(true); setEditingId(null); }} className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Add address
          </button>
        )}
      </div>

      {loadError && <p className="text-sm text-rose-600">{loadError}</p>}
      {!addresses && !loadError && <p className="text-sm text-slate-400">Loading…</p>}

      {adding && (
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
          <AddressForm submitLabel="Save address" onSubmit={create} onCancel={() => setAdding(false)} />
        </div>
      )}

      {addresses && addresses.length === 0 && !adding && (
        <p className="text-sm text-slate-500">No saved addresses yet. Add one and checkout takes a single click.</p>
      )}

      <div className="space-y-3">
        {addresses?.map(a => (
          <div key={a.id} className="rounded-xl border border-slate-200 p-4">
            {editingId === a.id ? (
              <AddressForm
                initial={{ label: a.label, full_name: a.full_name, phone: a.phone, line1: a.line1, line2: a.line2, city: a.city, region: a.region, postal_code: a.postal_code, country: a.country, is_default: a.is_default }}
                submitLabel="Save changes"
                onSubmit={v => update(a.id, v)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 text-sm text-slate-600 leading-relaxed">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900">{a.label || 'Address'}</span>
                    {a.is_default && <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A4A3A] bg-mint/30 border border-mint px-2 py-0.5 rounded-full">Default</span>}
                  </div>
                  {formatAddressLines(a).map((line, i) => <div key={i}>{line}</div>)}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!a.is_default && (
                    <button type="button" onClick={() => makeDefault(a)} title="Make default" aria-label="Make default" className="p-2 rounded-lg text-slate-400 hover:text-[#0A4A3A] hover:bg-slate-50 cursor-pointer"><Star className="w-4 h-4" /></button>
                  )}
                  <button type="button" onClick={() => { setEditingId(a.id); setAdding(false); }} title="Edit" aria-label="Edit address" className="p-2 rounded-lg text-slate-400 hover:text-[#0A4A3A] hover:bg-slate-50 cursor-pointer"><Pencil className="w-4 h-4" /></button>
                  <button type="button" onClick={() => remove(a.id)} title="Delete" aria-label="Delete address" className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
