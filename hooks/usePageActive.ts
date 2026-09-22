// hooks/usePageActive.ts
// True selama halaman buku (leluhur terdekat berkelas bk-page) ini sedang ditampilkan.
// PageTurner menandai halaman aktif dengan kelas CSS "current"; hook ini memantau kelas itu
// (bukan atribut `inert`, yang tidak konsisten direfleksikan sebagai atribut HTML di semua mesin browser).
"use client";
import { useEffect, useRef, useState } from "react";

export function usePageActive<T extends HTMLElement>(): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const page = ref.current?.closest(".bk-page");
    if (!page) return;
    const read = () => setActive(page.classList.contains("current"));
    read();
    const mo = new MutationObserver(read);
    mo.observe(page, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  return [ref, active];
}
