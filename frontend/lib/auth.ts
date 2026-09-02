// Social sign-in helpers.
//
// The frontend is a static export (no server of its own — see next.config.js),
// so the whole OAuth dance happens on the FastAPI backend. This file only:
//   1. sends the browser to the backend's /api/auth/{provider}/login, and
//   2. once the backend redirects back to /account?token=..., stores that
//      token and uses it to fetch the signed-in user.

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
const TOKEN_KEY = 'autoparts_auth_token';

export type AuthProvider = 'google' | 'apple';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
  provider: string;
}

export function startOAuth(provider: AuthProvider) {
  if (typeof window === 'undefined') return;
  window.location.href = `${BASE_URL}/api/auth/${provider}/login`;
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function storeToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* ignore */
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

export async function fetchCurrentUser(token: string): Promise<AuthUser | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return (await res.json()) as AuthUser;
  } catch {
    return null;
  }
}
