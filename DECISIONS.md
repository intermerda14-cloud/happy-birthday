# DECISIONS.md

Catatan arsitektur & keputusan teknis proyek "Kisah Adelia".

## 1. Pilihan Dependensi Tambahan
- `motion` (v13): Animasi esensial buku & lilin (PRD §9.1).
- `@playwright/test`: E2E testing mobile viewport 360x740 & 390x844 (PRD §12).
- `cross-env`: Kompatibilitas cross-platform Windows/Linux untuk perintah build & export.
- `prettier`: Menjaga kerapian formatting kode.

## 2. Skrip Cek Mandiri (Zero Heavy Deps)
- `scripts/check-content.mjs` dan `scripts/check-budget.mjs` ditulis menggunakan plain Node.js ESM murni tanpa compiler tambahan (`tsx`) agar ringan dan langsung bisa dieksekusi di pipeline CI/Vercel.

## 3. Font & Tipografi
- Memakai `next/font/google` untuk self-hosting Fraunces & Nunito otomatis saat build (PRD §7.2).

## 4. Struktur Komponen
- Komponen ditaruh flat di `components/` sesuai PRD §9.2 (`Book.tsx`, `PageTurner.tsx`, `Cover.tsx`, dll) dengan subfolder `components/pages/` khusus untuk halaman bab.