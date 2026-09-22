// lib/store.ts
// localStorage yang aman: tidak pernah melempar error (mode privat, kuota, SSR).
const P = "kisah:v1:";

export function readStore<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(P + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStore(key: string, value: unknown) {
  try {
    window.localStorage.setItem(P + key, JSON.stringify(value));
  } catch {
    /* abaikan */
  }
}
