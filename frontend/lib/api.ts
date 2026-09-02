// Frontend API client — communicates with the FastAPI backend at /api/*
// The frontend uses local data files (lib/data/*) as the primary data source.
// This client is available for server-side data fetching or future backend integration.

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${path}`);
  }
  return res.json() as Promise<T>;
}

// --- Categories ---
export const api = {
  // Get the full category tree
  categoryTree: () => apiFetch('/api/categories'),

  // List parts with optional filters
  listParts: (params: {
    category_slug?: string;
    part_type?: string;
    brand?: string;
    vehicle_id?: string;
    page?: number;
    page_size?: number;
  } = {}) => {
    const qs = new URLSearchParams();
    if (params.category_slug) qs.set('category_slug', params.category_slug);
    if (params.part_type) qs.set('part_type', params.part_type);
    if (params.brand) qs.set('brand', params.brand);
    if (params.vehicle_id) qs.set('vehicle_id', params.vehicle_id);
    if (params.page) qs.set('page', String(params.page));
    if (params.page_size) qs.set('page_size', String(params.page_size));
    return apiFetch(`/api/parts?${qs.toString()}`);
  },

  // Get a single part by ID
  getPart: (partId: string) => apiFetch(`/api/parts/${partId}`),

  // Get fitments for a part
  getPartFitments: (partId: string) => apiFetch(`/api/parts/${partId}/fitments`),

  // Search parts
  searchParts: (q: string, vehicleId?: string) => {
    const qs = new URLSearchParams({ q });
    if (vehicleId) qs.set('vehicle_id', vehicleId);
    return apiFetch(`/api/parts/search?${qs.toString()}`);
  },

  // List vehicles
  listMakes: () => apiFetch('/api/vehicles/makes'),
  listModels: (make: string) => apiFetch(`/api/vehicles/models?make=${encodeURIComponent(make)}`),

  // Decode a VIN or registration number
  decodeVin: (vin: string) => apiFetch(`/api/vehicles/decode-vin?vin=${encodeURIComponent(vin)}`),
  lookupRegistration: (reg: string) => apiFetch(`/api/vehicles/lookup-reg?reg=${encodeURIComponent(reg)}`),

  // Get garage vehicles (returns in-memory list)
  getGarage: () => apiFetch('/api/vehicles/garage/vehicles'),

  // Add vehicle to garage
  addToGarage: (vehicleId: string) =>
    fetch(`${BASE_URL}/api/vehicles/garage/vehicles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vehicle_id: vehicleId }),
    }).then(r => r.json()),

  // Remove vehicle from garage
  removeFromGarage: (vehicleId: string) =>
    fetch(`${BASE_URL}/api/vehicles/garage/vehicles/${vehicleId}`, { method: 'DELETE' }).then(r => r.json()),

  // Health check
  health: () => apiFetch('/api/health'),
};
