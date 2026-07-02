const AUTH_KEY = 'jwt_token';
const USER_KEY = 'auth_user';

export interface AuthUser {
  userId: number;
  name: string;
  email: string;
}

export function getToken(): string | null {
  return localStorage.getItem(AUTH_KEY);
}

export function setToken(token: string, user: AuthUser): void {
  localStorage.setItem(AUTH_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearToken(): void {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}

/** Devuelve el ID del usuario actual: 2 (guest) o el del JWT si está autenticado. */
export function getCurrentUserId(): number {
  const user = getUser();
  return user?.userId ?? 2;
}
