/**
 * Admin console — staff-only page for managing the parts catalog.
 *
 * Access is protected by a token that must be set in ADMIN_TOKEN env var on
 * the backend. During local development the default token is "change-me-before-production".
 *
 * Fields in the Add Product form:
 *  — Core identification : SKU, Part Name, Model Number (OEM), Part Type, Brand
 *  — Classification      : Category (subsystem slug), Position, Universal flag
 *  — Pricing & stock     : Price, Stock Quantity
 *  — OEM / cross-refs    : multiple OEM numbers
 *  — Fitment             : Make, Model, Generation, Year From/To, Engine Code
 *  — VIN reference       : optional VIN of the specific vehicle this was taken from
 *  — Description         : free-text description
 */

import { useEffect, useReducer, useRef, useState } from 'react';
import Head from 'next/head';
import { adminApi, AdminOverview, AdminPart } from '../lib/adminApi';

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormState {
  // Identification
  sku: string;
  name: string;
  model_number: string;       // stored as first OEM number when present
  part_type: string;
  brand: string;
  // Classification
  category_slug: string;
  position: string;
  universal: boolean;
  // Pricing & stock
  price: string;
  stock_qty: string;
  // OEM numbers (pipe-separated in the textarea)
  oem_raw: string;
  // Fitment
  fitment_make: string;
  fitment_model: string;
  fitment_generation: string;
  fitment_year_from: string;
  fitment_year_to: string;
  fitment_engine_code: string;
  // VIN reference
  vin_reference: string;
  // Description
  description: string;
}

const EMPTY_FORM: FormState = {
  sku: '', name: '', model_number: '', part_type: '', brand: '',
  category_slug: '', position: '', universal: false,
  price: '', stock_qty: '0',
  oem_raw: '',
  fitment_make: '', fitment_model: '', fitment_generation: '',
  fitment_year_from: '', fitment_year_to: '', fitment_engine_code: '',
  vin_reference: '',
  description: '',
};

type FormAction =
  | { type: 'SET'; field: keyof FormState; value: string | boolean }
  | { type: 'RESET' };

function formReducer(state: FormState, action: FormAction): FormState {
  if (action.type === 'RESET') return EMPTY_FORM;
  return { ...state, [action.field]: action.value };
}

// ─── Subsystem categories seeded in data.py ──────────────────────────────────
const KNOWN_CATEGORIES = [
  { slug: 'brake-pads',               label: 'Brake Pads' },
  { slug: 'brake-discs',              label: 'Brake Discs' },
  { slug: 'brake-calipers',           label: 'Brake Calipers' },
  { slug: 'timing-system',            label: 'Timing System' },
  { slug: 'engine-mounts',            label: 'Engine Mounts' },
  { slug: 'shock-absorbers-struts',   label: 'Shock Absorbers / Struts' },
  { slug: 'control-arms',             label: 'Control Arms' },
  { slug: 'individual-assembly-parts',label: 'Exhaust — Individual Parts' },
  { slug: 'catalytic-converters',     label: 'Catalytic Converters' },
  { slug: 'oil-filters',              label: 'Oil Filters' },
  { slug: 'air-filters',              label: 'Air Filters' },
  { slug: 'cabin-filters',            label: 'Cabin Filters' },
  { slug: 'engine-oil',               label: 'Engine Oil' },
  { slug: 'wiper-blades-front',       label: 'Wiper Blades — Front' },
];

const POSITIONS = ['', 'front', 'rear', 'left', 'right', 'front-left', 'front-right', 'rear-left', 'rear-right'];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1979 }, (_, i) => String(CURRENT_YEAR - i));

// ─── Helper: parse OEM textarea ───────────────────────────────────────────────
function parseOemNumbers(raw: string, modelNumber: string): string[] {
  const fromTextarea = raw
    .split(/[\n,|]+/)
    .map(s => s.trim())
    .filter(Boolean);
  const combined = modelNumber.trim()
    ? [modelNumber.trim(), ...fromTextarea.filter(o => o !== modelNumber.trim())]
    : fromTextarea;
  return [...new Set(combined)];
}

// ─── Subcomponent: labelled field wrapper ────────────────────────────────────
function Field({
  label, required, hint, children,
}: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

// ─── Subcomponent: section heading ───────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 border-b pb-1">
        {title}
      </h3>
      {children}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [token, setToken] = useState('change-me-before-production');
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState('');

  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [parts, setParts] = useState<AdminPart[]>([]);
  const [searchQ, setSearchQ] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, dispatch] = useReducer(formReducer, EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [tab, setTab] = useState<'overview' | 'parts' | 'add'>('overview');
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Image management ────────────────────────────────────────────────────────
  const [imagesPartId, setImagesPartId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ── Edit part ────────────────────────────────────────────────────────────────
  const [editPartId, setEditPartId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '', part_type: '', brand: '', price: '', stock_qty: '', oem_raw: '', universal: false,
  });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState('');

  function openEdit(p: AdminPart) {
    setEditPartId(p.id);
    setEditError('');
    setEditForm({
      name: p.name,
      part_type: p.part_type,
      brand: p.brand,
      price: String(p.price),
      stock_qty: String(p.stock_qty),
      oem_raw: p.oem_numbers.join(', '),
      universal: p.universal,
    });
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editPartId) return;
    setEditError('');

    if (!editForm.name.trim() || !editForm.part_type.trim() || !editForm.brand.trim()) {
      setEditError('Name, Part Type, and Brand are required.');
      return;
    }
    const price = parseFloat(editForm.price);
    if (!editForm.price || Number.isNaN(price) || price <= 0) {
      setEditError('Price must be a positive number.');
      return;
    }

    setEditSubmitting(true);
    try {
      const updated = await adminApi.updatePart(token, editPartId, {
        name: editForm.name.trim(),
        part_type: editForm.part_type.trim(),
        brand: editForm.brand.trim(),
        price,
        stock_qty: parseInt(editForm.stock_qty || '0', 10),
        oem_numbers: editForm.oem_raw.split(/[\n,|]+/).map(s => s.trim()).filter(Boolean),
        universal: editForm.universal,
      });
      setParts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
      setEditPartId(null);
    } catch (err: unknown) {
      setEditError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setEditSubmitting(false);
    }
  }

  const editingPart = parts.find(p => p.id === editPartId) || null;

  // ── Site settings (Overview tab) ────────────────────────────────────────────
  const [settingsForm, setSettingsForm] = useState({ maintenance_mode: false, announcement: '' });
  const [settingsDirty, setSettingsDirty] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    if (overview) {
      setSettingsForm(overview.settings);
      setSettingsDirty(false);
    }
  }, [overview]);

  async function saveSettings() {
    setSettingsSaving(true);
    setSettingsSaved(false);
    try {
      const updated = await adminApi.updateSettings(token, settingsForm);
      setOverview(prev => (prev ? { ...prev, settings: updated } : prev));
      setSettingsDirty(false);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSettingsSaving(false);
    }
  }

  const lowStockParts = parts.filter(p => p.stock_qty <= 5).sort((a, b) => a.stock_qty - b.stock_qty);

  // ── Auth ────────────────────────────────────────────────────────────────────
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError('');
    try {
      const data = await adminApi.overview(token);
      setOverview(data);
      setAuthed(true);
    } catch {
      setAuthError('Invalid admin token — check ADMIN_TOKEN on the backend.');
    }
  }

  // ── Load data ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    Promise.all([adminApi.overview(token), adminApi.listParts(token, searchQ)])
      .then(([ov, pts]) => { setOverview(ov); setParts(pts); })
      .finally(() => setLoading(false));
  }, [authed, searchQ, token]);

  // ── Submit new part ─────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    // Validate required fields
    const missing: string[] = [];
    if (!form.sku.trim()) missing.push('SKU');
    if (!form.name.trim()) missing.push('Part Name');
    if (!form.part_type.trim()) missing.push('Part Type');
    if (!form.brand.trim()) missing.push('Brand');
    if (!form.category_slug) missing.push('Category');
    if (!form.price || Number(form.price) <= 0) missing.push('Price');
    if (missing.length) {
      setFormError(`Required: ${missing.join(', ')}`);
      return;
    }

    const oem_numbers = parseOemNumbers(form.oem_raw, form.model_number);

    const payload: Record<string, unknown> = {
      sku: form.sku.trim(),
      name: form.name.trim(),
      part_type: form.part_type.trim(),
      brand: form.brand.trim(),
      category_slug: form.category_slug,
      price: parseFloat(form.price),
      stock_qty: parseInt(form.stock_qty || '0', 10),
      oem_numbers,
      universal: form.universal,
      description: form.description.trim(),
      position: form.position || undefined,
      vin_reference: form.vin_reference.trim() || undefined,
    };

    if (form.fitment_make && form.fitment_model && form.fitment_year_from) {
      payload.fitment_make = form.fitment_make.trim();
      payload.fitment_model = form.fitment_model.trim();
      payload.fitment_generation = form.fitment_generation.trim() || undefined;
      payload.fitment_year_from = parseInt(form.fitment_year_from, 10);
      payload.fitment_year_to = form.fitment_year_to ? parseInt(form.fitment_year_to, 10) : undefined;
      payload.fitment_engine_code = form.fitment_engine_code.trim() || undefined;
    }

    setSubmitting(true);
    try {
      await adminApi.createPart(token, payload);
      setFormSuccess(`Part "${form.name.trim()}" (${form.sku.trim()}) added successfully.`);
      dispatch({ type: 'RESET' });
      // Refresh the parts list & overview
      const [ov, pts] = await Promise.all([adminApi.overview(token), adminApi.listParts(token, '')]);
      setOverview(ov);
      setParts(pts);
      setSearchQ('');
      if (successTimer.current) clearTimeout(successTimer.current);
      successTimer.current = setTimeout(() => setFormSuccess(''), 6000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  // ── Delete part ─────────────────────────────────────────────────────────────
  async function confirmDelete() {
    if (!deleteId) return;
    try {
      await adminApi.deletePart(token, deleteId);
      setParts(prev => prev.filter(p => p.id !== deleteId));
      const ov = await adminApi.overview(token);
      setOverview(ov);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleteId(null);
    }
  }

  // ── Image upload / delete ───────────────────────────────────────────────────
  async function handleImageSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file || !imagesPartId) return;
    setImageError('');
    setUploadingImage(true);
    try {
      const updated = await adminApi.uploadPartImage(token, imagesPartId, file);
      setParts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    } catch (err: unknown) {
      setImageError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleImageDelete(imageUrl: string) {
    if (!imagesPartId) return;
    setImageError('');
    try {
      const updated = await adminApi.deletePartImage(token, imagesPartId, imageUrl);
      setParts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    } catch (err: unknown) {
      setImageError(err instanceof Error ? err.message : 'Remove failed');
    }
  }

  const imagesPart = parts.find(p => p.id === imagesPartId) || null;

  // ── Convenience alias ───────────────────────────────────────────────────────
  function set(field: keyof FormState, value: string | boolean) {
    dispatch({ type: 'SET', field, value });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Login gate
  // ─────────────────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <>
        <Head><title>Admin Login — AutoParts</title></Head>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <form
            onSubmit={handleLogin}
            className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm space-y-4"
          >
            <h1 className="text-xl font-bold text-gray-800">Staff Admin</h1>
            <Field label="Admin Token" required>
              <input
                type="password"
                value={token}
                onChange={e => setToken(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </Field>
            {authError && <p className="text-sm text-red-600">{authError}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
            >
              Sign in
            </button>
          </form>
        </div>
      </>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Main admin UI
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <>
      <Head><title>Admin Console — AutoParts</title></Head>
      <div className="min-h-screen bg-gray-50">

        {/* Header */}
        <header className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
          <span className="font-bold text-lg tracking-tight">AutoParts Admin</span>
          <button
            onClick={() => { setAuthed(false); setToken(''); }}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            Sign out
          </button>
        </header>

        {/* Tab bar */}
        <nav className="bg-white border-b px-6 flex gap-1 text-sm">
          {(['overview', 'parts', 'add'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 font-medium capitalize transition border-b-2 ${
                tab === t
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {t === 'add' ? 'Add Product' : t === 'parts' ? 'Parts List' : 'Overview'}
            </button>
          ))}
        </nav>

        <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">

          {/* ── Overview ───────────────────────────────────────────────────── */}
          {tab === 'overview' && overview && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Total Parts',  value: overview.parts },
                  { label: 'Categories',   value: overview.categories },
                  { label: 'Brands',       value: overview.brands },
                  { label: 'Low Stock (≤5)', value: overview.low_stock },
                ].map(stat => (
                  <div key={stat.label} className="bg-white rounded-xl shadow-sm p-5 text-center">
                    <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Quick actions */}
              <div className="bg-white rounded-xl shadow-sm p-5">
                <h3 className="font-semibold text-gray-800 mb-3">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setTab('add')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                  >
                    + Add Product
                  </button>
                  <button
                    onClick={() => setTab('parts')}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold px-4 py-2 rounded-lg transition"
                  >
                    View Parts List
                  </button>
                </div>
              </div>

              {/* Low stock */}
              <div className="bg-white rounded-xl shadow-sm p-5">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Low Stock ({lowStockParts.length})
                </h3>
                {lowStockParts.length === 0 ? (
                  <p className="text-sm text-gray-400">Nothing is low on stock right now.</p>
                ) : (
                  <div className="divide-y">
                    {lowStockParts.map(p => (
                      <div key={p.id} className="flex items-center justify-between py-2 text-sm">
                        <div>
                          <span className="text-gray-800">{p.name}</span>
                          <span className="text-gray-400 ml-2 font-mono text-xs">{p.sku}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={p.stock_qty === 0 ? 'text-red-600 font-semibold' : 'text-amber-600 font-semibold'}>
                            {p.stock_qty} left
                          </span>
                          <button
                            onClick={() => openEdit(p)}
                            className="text-xs text-blue-500 hover:text-blue-700"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Site settings */}
              <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
                <h3 className="font-semibold text-gray-800">Site Settings</h3>

                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={settingsForm.maintenance_mode}
                    onChange={e => {
                      setSettingsForm(f => ({ ...f, maintenance_mode: e.target.checked }));
                      setSettingsDirty(true);
                    }}
                  />
                  Maintenance mode (shoppers see a maintenance page instead of the storefront)
                </label>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Announcement banner
                  </label>
                  <input
                    type="text"
                    value={settingsForm.announcement}
                    onChange={e => {
                      setSettingsForm(f => ({ ...f, announcement: e.target.value }));
                      setSettingsDirty(true);
                    }}
                    placeholder="e.g. Free shipping this week!"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={saveSettings}
                    disabled={!settingsDirty || settingsSaving}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                  >
                    {settingsSaving ? 'Saving…' : 'Save Settings'}
                  </button>
                  {settingsSaved && (
                    <span className="text-xs text-green-600">Saved.</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Parts list ─────────────────────────────────────────────────── */}
          {tab === 'parts' && (
            <div className="space-y-4">
              <input
                type="search"
                placeholder="Search by name or SKU…"
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {loading && <p className="text-sm text-gray-400">Loading…</p>}
              <div className="overflow-x-auto rounded-xl shadow-sm">
                <table className="w-full text-sm bg-white">
                  <thead className="bg-gray-100 text-gray-600 text-left">
                    <tr>
                      <th className="px-4 py-3 font-medium">SKU</th>
                      <th className="px-4 py-3 font-medium">Photo</th>
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Brand</th>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium text-right">Price</th>
                      <th className="px-4 py-3 font-medium text-right">Stock</th>
                      <th className="px-4 py-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {parts.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-mono text-xs text-gray-500">{p.sku}</td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => { setImagesPartId(p.id); setImageError(''); }}
                            className="block w-10 h-10 rounded-md overflow-hidden border border-gray-200 bg-gray-50 hover:ring-2 hover:ring-blue-400 transition"
                            title="Manage photos"
                          >
                            {p.images?.[0] ? (
                              <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                                +
                              </span>
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-2">{p.name}</td>
                        <td className="px-4 py-2 text-gray-500">{p.brand}</td>
                        <td className="px-4 py-2 text-gray-500 text-xs">{p.part_type}</td>
                        <td className="px-4 py-2 text-right">€{p.price.toFixed(2)}</td>
                        <td className={`px-4 py-2 text-right font-medium ${p.stock_qty <= 5 ? 'text-red-600' : 'text-gray-700'}`}>
                          {p.stock_qty}
                        </td>
                        <td className="px-4 py-2 text-right whitespace-nowrap">
                          <button
                            onClick={() => openEdit(p)}
                            className="text-xs text-blue-500 hover:text-blue-700 transition mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteId(p.id)}
                            className="text-xs text-red-500 hover:text-red-700 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {!loading && parts.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                          No parts found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Add Product form ───────────────────────────────────────────── */}
          {tab === 'add' && (
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-8">
              <h2 className="text-lg font-bold text-gray-800">Add New Product</h2>

              {/* ── 1. Core identification ───────────────────────────────── */}
              <Section title="Core Identification">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="SKU" required hint="Unique internal stock-keeping unit code">
                    <input
                      value={form.sku}
                      onChange={e => set('sku', e.target.value.toUpperCase())}
                      placeholder="e.g. BRK-0042"
                      className="input"
                    />
                  </Field>

                  <Field label="Part Name" required hint="Full descriptive name shown to customers">
                    <input
                      value={form.name}
                      onChange={e => set('name', e.target.value)}
                      placeholder="e.g. Front Brake Pad Set, Ceramic"
                      className="input"
                    />
                  </Field>

                  <Field
                    label="Model Number (Primary OEM)"
                    hint="Manufacturer's own part number — will appear first in OEM list"
                  >
                    <input
                      value={form.model_number}
                      onChange={e => set('model_number', e.target.value)}
                      placeholder="e.g. 1K0698151"
                      className="input"
                    />
                  </Field>

                  <Field label="Part Type" required hint="Facet label shown in the sidebar filter">
                    <input
                      value={form.part_type}
                      onChange={e => set('part_type', e.target.value)}
                      placeholder="e.g. Brake Pads - Front"
                      className="input"
                    />
                  </Field>

                  <Field label="Brand" required>
                    <input
                      value={form.brand}
                      onChange={e => set('brand', e.target.value)}
                      placeholder="e.g. Brembo"
                      className="input"
                    />
                  </Field>
                </div>
              </Section>

              {/* ── 2. Classification ────────────────────────────────────── */}
              <Section title="Classification">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="Category" required hint="Must be a subsystem (level-3) category">
                    <select
                      value={form.category_slug}
                      onChange={e => set('category_slug', e.target.value)}
                      className="input"
                    >
                      <option value="">— Select category —</option>
                      {KNOWN_CATEGORIES.map(c => (
                        <option key={c.slug} value={c.slug}>{c.label}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Position" hint="Mounting location on the vehicle">
                    <select
                      value={form.position}
                      onChange={e => set('position', e.target.value)}
                      className="input"
                    >
                      {POSITIONS.map(p => (
                        <option key={p} value={p}>{p || '— Not applicable —'}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Universal fit" hint="Fits all vehicles regardless of make/model">
                    <label className="flex items-center gap-2 mt-1 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={form.universal}
                        onChange={e => set('universal', e.target.checked)}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span className="text-sm text-gray-700">Universal part</span>
                    </label>
                  </Field>
                </div>
              </Section>

              {/* ── 3. Pricing & Stock ───────────────────────────────────── */}
              <Section title="Pricing &amp; Stock">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Price (€)" required>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={e => set('price', e.target.value)}
                      placeholder="0.00"
                      className="input"
                    />
                  </Field>

                  <Field label="Stock Quantity">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={form.stock_qty}
                      onChange={e => set('stock_qty', e.target.value)}
                      className="input"
                    />
                  </Field>
                </div>
              </Section>

              {/* ── 4. OEM / Cross-reference numbers ─────────────────────── */}
              <Section title="OEM &amp; Cross-Reference Numbers">
                <Field
                  label="Additional OEM Numbers"
                  hint="One per line, or comma / pipe separated. The Model Number above is included automatically."
                >
                  <textarea
                    rows={3}
                    value={form.oem_raw}
                    onChange={e => set('oem_raw', e.target.value)}
                    placeholder={"04465-02350\n1K0698151B\nGDB1234"}
                    className="input font-mono text-xs resize-y"
                  />
                </Field>
                {/* Live preview */}
                {(form.model_number || form.oem_raw) && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {parseOemNumbers(form.oem_raw, form.model_number).map(n => (
                      <span key={n} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded font-mono">
                        {n}
                      </span>
                    ))}
                  </div>
                )}
              </Section>

              {/* ── 5. Fitment data ───────────────────────────────────────── */}
              <Section title="Vehicle Fitment">
                <p className="text-xs text-gray-400 -mt-2">
                  Fill at least Make, Model and Year From to create a fitment record.
                  Leave blank for universal parts.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="Make">
                    <input
                      value={form.fitment_make}
                      onChange={e => set('fitment_make', e.target.value)}
                      placeholder="e.g. Volkswagen"
                      className="input"
                      list="makes-list"
                    />
                    <datalist id="makes-list">
                      {['Volkswagen', 'Toyota', 'Ford', 'BMW', 'Mercedes-Benz', 'Audi',
                        'Opel', 'Peugeot', 'Renault', 'Skoda', 'Seat', 'Hyundai', 'Kia'].map(m => (
                        <option key={m} value={m} />
                      ))}
                    </datalist>
                  </Field>

                  <Field label="Model">
                    <input
                      value={form.fitment_model}
                      onChange={e => set('fitment_model', e.target.value)}
                      placeholder="e.g. Golf"
                      className="input"
                    />
                  </Field>

                  <Field label="Generation" hint="e.g. Mk7, E210, Mk4">
                    <input
                      value={form.fitment_generation}
                      onChange={e => set('fitment_generation', e.target.value)}
                      placeholder="e.g. Mk7"
                      className="input"
                    />
                  </Field>

                  <Field label="Year From">
                    <select
                      value={form.fitment_year_from}
                      onChange={e => set('fitment_year_from', e.target.value)}
                      className="input"
                    >
                      <option value="">— Year —</option>
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </Field>

                  <Field label="Year To" hint="Leave blank if still in production">
                    <select
                      value={form.fitment_year_to}
                      onChange={e => set('fitment_year_to', e.target.value)}
                      className="input"
                    >
                      <option value="">— Year (optional) —</option>
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </Field>

                  <Field label="Engine Code" hint="e.g. CRBC, 2ZR-FXE, M9DA">
                    <input
                      value={form.fitment_engine_code}
                      onChange={e => set('fitment_engine_code', e.target.value.toUpperCase())}
                      placeholder="e.g. CRBC"
                      className="input"
                    />
                  </Field>
                </div>
              </Section>

              {/* ── 6. VIN Reference ──────────────────────────────────────── */}
              <Section title="VIN Reference">
                <Field
                  label="Vehicle Identification Number (VIN)"
                  hint="17-character VIN of the specific vehicle this part was sourced from or verified on. Optional — does not replace Make/Model fitment."
                >
                  <input
                    value={form.vin_reference}
                    onChange={e => set('vin_reference', e.target.value.toUpperCase())}
                    placeholder="e.g. WVWZZZ1KZAM000001"
                    maxLength={17}
                    className="input font-mono tracking-widest"
                  />
                  {form.vin_reference && form.vin_reference.length !== 17 && (
                    <p className="text-xs text-amber-500 mt-1">
                      VIN should be exactly 17 characters ({form.vin_reference.length}/17)
                    </p>
                  )}
                </Field>
              </Section>

              {/* ── 7. Description ────────────────────────────────────────── */}
              <Section title="Description">
                <Field label="Product Description" hint="Shown on the product detail page">
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                    placeholder="Describe the part, fitment notes, material, warranty…"
                    className="input resize-y"
                  />
                </Field>
              </Section>

              {/* Feedback */}
              {formError && (
                <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
                  {formError}
                </div>
              )}
              {formSuccess && (
                <div className="rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3">
                  {formSuccess}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-lg transition"
                >
                  {submitting ? 'Saving…' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'RESET' })}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-2.5 rounded-lg transition"
                >
                  Clear
                </button>
              </div>
            </form>
          )}
        </main>
      </div>

      {/* ── Delete confirmation modal ────────────────────────────────────── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full space-y-4">
            <h3 className="font-bold text-gray-800">Delete this part?</h3>
            <p className="text-sm text-gray-600">
              This will permanently remove the part and all its fitment records from the catalog.
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit part modal ──────────────────────────────────────────────── */}
      {editingPart && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleEditSubmit}
            className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-800">
                Edit — {editingPart.sku}
              </h3>
              <button
                type="button"
                onClick={() => setEditPartId(null)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ×
              </button>
            </div>

            <p className="text-xs text-gray-400 -mt-2">
              Category, description, and fitment aren&apos;t editable here yet —
              only these fields. Delete and re-add the part if those need to
              change.
            </p>

            <Field label="Part Name" required>
              <input
                value={editForm.name}
                onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                className="input"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Part Type" required>
                <input
                  value={editForm.part_type}
                  onChange={e => setEditForm(f => ({ ...f, part_type: e.target.value }))}
                  className="input"
                />
              </Field>
              <Field label="Brand" required>
                <input
                  value={editForm.brand}
                  onChange={e => setEditForm(f => ({ ...f, brand: e.target.value }))}
                  className="input"
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Price" required>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editForm.price}
                  onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))}
                  className="input"
                />
              </Field>
              <Field label="Stock Qty">
                <input
                  type="number"
                  min="0"
                  value={editForm.stock_qty}
                  onChange={e => setEditForm(f => ({ ...f, stock_qty: e.target.value }))}
                  className="input"
                />
              </Field>
            </div>

            <Field label="OEM Numbers" hint="Comma or newline separated">
              <textarea
                rows={2}
                value={editForm.oem_raw}
                onChange={e => setEditForm(f => ({ ...f, oem_raw: e.target.value }))}
                className="input resize-y"
              />
            </Field>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={editForm.universal}
                onChange={e => setEditForm(f => ({ ...f, universal: e.target.checked }))}
              />
              Universal part (fits any vehicle)
            </label>

            {editError && (
              <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
                {editError}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={editSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition"
              >
                {editSubmitting ? 'Saving…' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setEditPartId(null)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Manage photos modal ──────────────────────────────────────────── */}
      {imagesPart && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-800">
                Photos — {imagesPart.name}
              </h3>
              <button
                onClick={() => setImagesPartId(null)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ×
              </button>
            </div>

            {imageError && (
              <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
                {imageError}
              </div>
            )}

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {imagesPart.images?.map(url => (
                <div key={url} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleImageDelete(url)}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center transition"
                    title="Remove photo"
                  >
                    ×
                  </button>
                </div>
              ))}

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 text-gray-400 hover:text-blue-500 flex flex-col items-center justify-center text-xs gap-1 transition disabled:opacity-50"
              >
                <span className="text-lg leading-none">+</span>
                {uploadingImage ? 'Uploading…' : 'Add photo'}
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelected}
              className="hidden"
            />

            {(!imagesPart.images || imagesPart.images.length === 0) && (
              <p className="text-xs text-gray-400">No photos yet — click "Add photo" to upload one.</p>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setImagesPartId(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-5 py-2 rounded-lg transition text-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tailwind utilities used via class strings need to be in source — keep this comment */}
      <style jsx global>{`
        .input {
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          width: 100%;
          outline: none;
          transition: box-shadow 0.15s;
          background: white;
        }
        .input:focus {
          box-shadow: 0 0 0 2px #3b82f6;
          border-color: #3b82f6;
        }
      `}</style>
    </>
  );
}
