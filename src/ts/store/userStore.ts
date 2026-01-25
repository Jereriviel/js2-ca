import type { LoginResponseData } from "../types/auth";

const TOKEN_KEY = "token";
const USER_KEY = "user";

export type User = Omit<LoginResponseData, "accessToken">;

export function setUser(token: string, user: User): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): User | null {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? (JSON.parse(userData) as User) : null;
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export function clearUser(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
