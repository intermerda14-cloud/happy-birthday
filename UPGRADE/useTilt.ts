// hooks/useTilt.ts
// Mengisi variabel CSS --tx dan --ty (-1..1) dari kemiringan HP (atau gerak pointer di desktop).
// Dipakai agar emas foil "menangkap cahaya" saat HP dimiringkan.
"use client";
import { useEffect, type RefObject } from "react";

export function useTilt(target: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = target.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    const flush = () => {
      raf = 0;
      el.style.setProperty("--tx", tx.toFixed(3));
      el.style.setProperty("--ty", ty.toFixed(3));
    };
    const set = (x: number, y: number) => {
      tx = Math.max(-1, Math.min(1, x));
      ty = Math.max(-1, Math.min(1, y));
      if (!raf) raf = requestAnimationFrame(flush);
    };
    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      set(e.gamma / 30, (e.beta - 45) / 30);
    };
    const onPointer = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      set(((e.clientX - r.left) / r.width - 0.5) * 2, ((e.clientY - r.top) / r.height - 0.5) * 2);
    };

    window.addEventListener("deviceorientation", onOrientation);
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (fine) window.addEventListener("pointermove", onPointer);
    return () => {
      window.removeEventListener("deviceorientation", onOrientation);
      if (fine) window.removeEventListener("pointermove", onPointer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [target]);
}
