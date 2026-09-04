/**
 * Admin API client — wraps all /api/admin/* endpoints.
 *
 * Every request includes the X-Admin-Token header.  The token is kept only in
 * component state (never persisted to localStorage) so it disappears on page
 * refresh — intentional for a staff-only console.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

// ── Response types ────────────────────────────────────────────────────────────

export interface AdminOverview {
  parts: number;
  categories: number;
  brands: number;
  low_stock: number;
  settings: {
    maintenance_mode: boolean;
    announcement: string;
  };
}

export interface AdminPart {
  id: string;
  sku: string;
  name: string;
  part_type: string;
  brand: string;
  category_slug: string;
  price: number;
  stock_qty: number;
  attributes: Record<string, unknown>;
  images: string[];
  oem_numbers: string[];
  universal: boolean;
}

export interface AdminPartPayload {
  sku: string;
  name: string;
  part_type: string;
  brand: string;
  category_slug: string;
  price: number;
  stock_qty?: number;
  oem_numbers?: string[];
  universal?: boolean;
  description?: string;
  position?: string;
  vin_reference?: string;
  fitment_make?: string;
  fitment_model?: string;
  fitment_generation?: string;
  fitment_year_from?: number;
  fitment_year_to?: number;
  fitment_engine_code?: string;
  [key: string]: unknown;
}

// ── Internal helpers ──────────────────────────────────────────────────────────

async function adminFetch<T>(
  token: string,
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Token': token,
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      detail = body?.detail ?? detail;
    } catch {
      // ignore parse errors
    }
    throw new Error(detail);
  }

  // 204 No Content — return null cast to T
  if (res.status === 204) return null as T;
  return res.json() as Promise<T>;
}

// Separate from adminFetch because multipart/form-data requests must NOT set
// a Content-Type header manually — the browser sets it (with the correct
// boundary) only when we let fetch infer it from a FormData body.
async function adminUpload<T>(token: string, path: string, formData: FormData): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'X-Admin-Token': token },
    body: formData,
  });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      detail = body?.detail ?? detail;
    } catch {
      // ignore parse errors
    }
    throw new Error(detail);
  }

  return res.json() as Promise<T>;
}

// ── Public API ────────────────────────────────────────────────────────────────

export const adminApi = {
  /** Catalog overview counts + site settings */
  overview: (token: string) =>
    adminFetch<AdminOverview>(token, '/api/admin/overview'),

  /** Update site-wide settings (maintenance mode, announcement banner) */
  updateSettings: (token: string, settings: AdminOverview['settings']) =>
    adminFetch<AdminOverview['settings']>(token, '/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),

  /** List all parts, optionally filtered by a search query */
  listParts: (token: string, q = '') => {
    const qs = q ? `?q=${encodeURIComponent(q)}` : '';
    return adminFetch<AdminPart[]>(token, `/api/admin/parts${qs}`);
  },

  /** Create a new part (and optional fitment) */
  createPart: (token: string, payload: AdminPartPayload | Record<string, unknown>) =>
    adminFetch<AdminPart>(token, '/api/admin/parts', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  /** Partially update a part */
  updatePart: (
    token: string,
    partId: string,
    patch: Partial<Omit<AdminPart, 'id' | 'sku' | 'category_slug'>>,
  ) =>
    adminFetch<AdminPart>(token, `/api/admin/parts/${partId}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    }),

  /** Delete a part and its fitment records */
  deletePart: (token: string, partId: string) =>
    adminFetch<null>(token, `/api/admin/parts/${partId}`, { method: 'DELETE' }),

  /** Upload an image for a part — returns the updated part (with the new URL in `images`) */
  uploadPartImage: (token: string, partId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return adminUpload<AdminPart>(token, `/api/admin/parts/${partId}/images`, formData);
  },

  /** Remove one image URL from a part */
  deletePartImage: (token: string, partId: string, imageUrl: string) =>
    adminFetch<AdminPart>(
      token,
      `/api/admin/parts/${partId}/images?image_url=${encodeURIComponent(imageUrl)}`,
      { method: 'DELETE' },
    ),
};
