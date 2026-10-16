// Signed-in account API: orders, saved addresses, cart/garage sync and stock
// alerts. Every call sends the stored bearer token (see lib/auth.ts).

import { getStoredToken } from './auth';
import { Vehicle } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function authed<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  if (!token) throw new ApiError(401, 'Please sign in first.');
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options.headers ?? {}),
      },
    });
  } catch {
    throw new ApiError(0, 'Could not reach the server. Please try again in a moment.');
  }
  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (typeof body?.detail === 'string') detail = body.detail;
      else if (Array.isArray(body?.detail) && body.detail[0]?.msg) detail = body.detail[0].msg;
    } catch { /* keep the generic message */ }
    throw new ApiError(res.status, detail);
  }
  if (res.status === 204) return null as T;
  return res.json() as Promise<T>;
}

// ── Types ────────────────────────────────────────────────────────────────
export interface SyncedCartLine {
  partId: string;
  quantity: number;
  addedForVehicle?: Vehicle | null;
}

export interface SavedAddress {
  id: string;
  label: string;
  full_name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  region: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}
export type AddressInput = Omit<SavedAddress, 'id'>;

export type OrderStatus = 'received' | 'confirmed' | 'packed' | 'dispatched' | 'delivered' | 'cancelled';

export interface OrderItem {
  part_id: string;
  sku: string;
  name: string;
  brand: string;
  image: string;
  unit_price: number;
  quantity: number;
}

export interface Order {
  id: string;
  number: string;
  status: OrderStatus;
  items: OrderItem[];
  address: SavedAddress;
  history: { status: OrderStatus; at: string }[];
  promo_code: string;
  subtotal: number;
  discount: number;
  shipping: number;
  vat: number;
  total: number;
  created_at: string;
  updated_at: string;
  can_cancel: boolean;
}

export interface PlaceOrderInput {
  client_ref: string;
  address_id: string;
  promo_code: string;
  items: OrderItem[];
}

export interface StockAlert {
  id: string;
  part_id: string;
  part_name: string;
  sku: string;
  created_at: string;
}

// ── Calls ────────────────────────────────────────────────────────────────
export const accountApi = {
  getCart: () => authed<{ items: SyncedCartLine[] }>('/api/account/cart'),
  putCart: (items: SyncedCartLine[]) =>
    authed<{ items: SyncedCartLine[] }>('/api/account/cart', { method: 'PUT', body: JSON.stringify({ items }) }),

  getGarage: () => authed<{ vehicles: Vehicle[]; activeVehicleId: string }>('/api/account/garage'),
  putGarage: (vehicles: Vehicle[], activeVehicleId: string) =>
    authed('/api/account/garage', { method: 'PUT', body: JSON.stringify({ vehicles, activeVehicleId }) }),

  listAddresses: () => authed<SavedAddress[]>('/api/account/addresses'),
  createAddress: (a: AddressInput) =>
    authed<SavedAddress>('/api/account/addresses', { method: 'POST', body: JSON.stringify(a) }),
  updateAddress: (id: string, a: AddressInput) =>
    authed<SavedAddress>(`/api/account/addresses/${id}`, { method: 'PUT', body: JSON.stringify(a) }),
  deleteAddress: (id: string) => authed<null>(`/api/account/addresses/${id}`, { method: 'DELETE' }),

  listOrders: () => authed<Order[]>('/api/account/orders'),
  placeOrder: (input: PlaceOrderInput) =>
    authed<Order>('/api/account/orders', { method: 'POST', body: JSON.stringify(input) }),
  cancelOrder: (id: string) => authed<Order>(`/api/account/orders/${id}/cancel`, { method: 'POST' }),

  listStockAlerts: () => authed<StockAlert[]>('/api/account/stock-alerts'),
  addStockAlert: (part_id: string, part_name: string, sku: string) =>
    authed<StockAlert>('/api/account/stock-alerts', { method: 'POST', body: JSON.stringify({ part_id, part_name, sku }) }),
  removeStockAlert: (partId: string) =>
    authed<null>(`/api/account/stock-alerts/${encodeURIComponent(partId)}`, { method: 'DELETE' }),
};

export function newClientRef(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `ref-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
