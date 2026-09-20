// lib/sfx.ts
// Pembungkus aman untuk SoundEngine: error audio tidak boleh menghentikan UI
// (penyebab paling mungkin "Buka buku" tidak bereaksi di Android).
type AnyFn = (...args: unknown[]) => unknown;
type Holder = Record<string, unknown>;

let loading: Promise<Holder | null> | null = null;
let engine: Holder | null = null;

function load(): Promise<Holder | null> {
  if (!loading) {
    loading = import("@/components/audio/SoundEngine")
      .then((m) => {
        const mod = m as unknown as Holder;
        let h = (mod.SoundEngine ?? mod.default ?? mod) as Holder;
        // Bila fungsi diekspor di level modul, pakai modul itu sendiri.
        if (typeof h["playPageTurn"] !== "function" && typeof mod["playPageTurn"] === "function") h = mod;
        engine = h;
        return h;
      })
      .catch(() => null);
  }
  return loading;
}

/** Panggil saat pointerdown pertama supaya modul audio sudah termuat sebelum dipakai. */
export function primeSfx() {
  if (typeof window !== "undefined") void load();
}

export function sfx(name: string, ...args: unknown[]) {
  if (typeof window === "undefined") return;
  const run = (h: Holder | null) => {
    try {
      const fn = h?.[name];
      if (typeof fn === "function") (fn as AnyFn).apply(h, args);
    } catch {
      /* audio gagal: abaikan, UI tetap jalan */
    }
  };
  if (engine) run(engine);
  else void load().then(run);
}

export function haptic(pattern: number | number[] = 15) {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(pattern);
  } catch {
    /* abaikan */
  }
}
