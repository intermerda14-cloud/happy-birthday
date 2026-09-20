// components/ui/MagicDust.tsx
// Percikan emas kecil di titik sentuh. Juga memuat modul audio lebih awal, dan
// menyediakan mode diagnosis: buka situs dengan ?debug lalu tap sebuah tombol;
// label di layar menampilkan elemen yang SEBENARNYA menerima tap.
"use client";
import { useEffect, useRef } from "react";
import { primeSfx } from "@/lib/sfx";

export function MagicDust() {
  const layer = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = layer.current?.parentElement;
    if (!host) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const debug = new URLSearchParams(window.location.search).has("debug");

    const onDown = (e: PointerEvent) => {
      primeSfx();
      if (debug && label.current) {
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const cls = (el?.getAttribute("class") ?? "").split(" ")[0];
        label.current.textContent = el ? `${el.tagName.toLowerCase()}${cls ? "." + cls : ""}` : "null";
      }
      const box = layer.current;
      if (reduce || !box) return;
      const r = host.getBoundingClientRect();
      for (let i = 0; i < 6; i++) {
        const s = document.createElement("i");
        const a = Math.random() * Math.PI * 2;
        const d = 18 + Math.random() * 26;
        s.className = "dust";
        s.textContent = "✦";
        s.style.left = `${e.clientX - r.left}px`;
        s.style.top = `${e.clientY - r.top}px`;
        s.style.setProperty("--dx", `${Math.cos(a) * d}px`);
        s.style.setProperty("--dy", `${Math.sin(a) * d - 14}px`);
        s.style.setProperty("--s", `${8 + Math.random() * 9}px`);
        box.appendChild(s);
        window.setTimeout(() => s.remove(), 900);
      }
    };

    host.addEventListener("pointerdown", onDown, { passive: true });
    return () => host.removeEventListener("pointerdown", onDown);
  }, []);

  return (
    <>
      <div ref={layer} className="dust-layer" aria-hidden="true" />
      <div ref={label} className="dust-debug" aria-hidden="true" />
    </>
  );
}
