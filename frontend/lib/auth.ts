const ACCESS_TOKEN_KEY = 'cc_access_token';
const REFRESH_TOKEN_KEY = 'cc_refresh_token';

export function saveTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  const token = getAccessToken();
  if (!token) return false;
  try {
    const payload = getUserFromToken(token);
    if (!payload) return false;
    const expiry = payload.exp * 1000;
    return Date.now() < expiry;
  } catch {
    return false;
  }
}

export interface JWTPayload {
  id: string;
  email: string;
  role: string;
  name: string;
  exp: number;
  iat: number;
}

export function getUserFromToken(token?: string): JWTPayload | null {
  const t = token || getAccessToken();
  if (!t) return null;
  try {
    const base64Url = t.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload) as JWTPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = getUserFromToken(token);
  if (!payload) return true;
  return Date.now() >= payload.exp * 1000;
}

export function getUserRole(): string | null {
  const payload = getUserFromToken();
  return payload?.role || null;
}

export function isAdmin(): boolean {
  return getUserRole() === 'admin';
}
