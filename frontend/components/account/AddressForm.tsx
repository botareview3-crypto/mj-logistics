import React, { useState } from 'react';
import { AddressInput } from '../../lib/accountApi';

export const EMPTY_ADDRESS: AddressInput = {
  label: '', full_name: '', phone: '', line1: '', line2: '',
  city: '', region: '', postal_code: '', country: '', is_default: false,
};

const inputCls =
  'w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A4A3A] focus:bg-white transition-all';

interface Props {
  initial?: AddressInput;
  submitLabel: string;
  onSubmit: (address: AddressInput) => Promise<void>;
  onCancel?: () => void;
}

// Used both on the account page (saved addresses) and at checkout.
export function AddressForm({ initial = EMPTY_ADDRESS, submitLabel, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<AddressInput>(initial);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (key: keyof AddressInput) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const missing = (['full_name', 'line1', 'city', 'country'] as const).filter(k => !form[k].trim());
    if (missing.length) {
      setError('Please fill in your name, street address, city and country.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await onSubmit({ ...form, full_name: form.full_name.trim(), line1: form.line1.trim(), city: form.city.trim(), country: form.country.trim() });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the address.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input className={inputCls} placeholder="Full name *" value={form.full_name} onChange={set('full_name')} autoComplete="name" maxLength={200} />
        <input className={inputCls} placeholder="Phone (for the courier)" value={form.phone} onChange={set('phone')} autoComplete="tel" maxLength={40} />
      </div>
      <input className={inputCls} placeholder="Street address *" value={form.line1} onChange={set('line1')} autoComplete="address-line1" maxLength={200} />
      <input className={inputCls} placeholder="Apartment, suite, landmark (optional)" value={form.line2} onChange={set('line2')} autoComplete="address-line2" maxLength={200} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input className={inputCls} placeholder="City *" value={form.city} onChange={set('city')} autoComplete="address-level2" maxLength={120} />
        <input className={inputCls} placeholder="Region / state" value={form.region} onChange={set('region')} autoComplete="address-level1" maxLength={120} />
        <input className={inputCls} placeholder="Postal code" value={form.postal_code} onChange={set('postal_code')} autoComplete="postal-code" maxLength={30} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input className={inputCls} placeholder="Country *" value={form.country} onChange={set('country')} autoComplete="country-name" maxLength={120} />
        <input className={inputCls} placeholder="Label, e.g. Home or Workshop" value={form.label} onChange={set('label')} maxLength={60} />
      </div>
      <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
        <input type="checkbox" checked={form.is_default} onChange={e => setForm(prev => ({ ...prev, is_default: e.target.checked }))} className="accent-[#0A4A3A]" />
        Use as my default address
      </label>
      {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}
      <div className="flex items-center gap-3 pt-1">
        <button type="submit" disabled={saving} className="px-5 py-2.5 bg-[#04261D] hover:bg-[#0A4A3A] text-white text-xs font-bold rounded-xl cursor-pointer transition-colors disabled:opacity-60">
          {saving ? 'Saving…' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer">Cancel</button>
        )}
      </div>
    </form>
  );
}

export function formatAddressLines(a: { full_name: string; line1: string; line2: string; city: string; region: string; postal_code: string; country: string; phone: string }): string[] {
  return [
    a.full_name,
    a.line1,
    a.line2,
    [a.postal_code, a.city].filter(Boolean).join(' '),
    [a.region, a.country].filter(Boolean).join(', '),
    a.phone,
  ].filter(Boolean);
}
