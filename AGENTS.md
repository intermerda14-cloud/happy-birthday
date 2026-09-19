# AGENTS.md

Proyek: "Kisah Adelia", website ulang tahun bertema buku dongeng (Next.js + TypeScript + Tailwind, deploy ke Vercel Hobby).
Sumber kebenaran: `PRD.md`. Referensi visual dan interaksi: `reference/mockup-buku-dongeng.html`.

## Aturan utama
1. Baca `PRD.md` penuh sebelum menulis kode. Kerjakan berurutan per fase (PRD Bagian 11).
2. Jangan mengarang isi personal. Pakai placeholder `TODO:` di `content/`. `npm run check:content` harus gagal di build produksi bila masih ada.
3. Jangan mengunduh atau scrape aset dari internet. Pakai hanya file dari `assets-raw/` (mentah, tidak di-commit) dan `public/media/` (olahan). Slot aset yang kosong memakai fallback.
4. Semua aset dirujuk lewat ID di `assets/manifest.ts`, bukan path langsung.
5. Tanpa ilustrasi vektor untuk objek (lilin, buku, bunga, segel). SVG hanya untuk ikon UI, bingkai foil, dan fallback.
6. Animasi hanya `transform`, `opacity`, dan maksimal satu `filter` sekaligus. Hormati `prefers-reduced-motion`.
7. Dependensi baru hanya bila dicatat alasannya di `DECISIONS.md`.
8. Mobile-first. Uji di viewport 360×740 dan 390×844.
9. Tanpa file audio berhak cipta di repo. Musik lewat embed Spotify.
10. Tanya manusia hanya soal PRD Bagian 4.2. Selain itu pilih opsi paling sederhana dan catat di `DECISIONS.md`.

## Perintah
```
npm run dev
npm run lint && npm run typecheck
npm run check:content     # gagal bila masih ada TODO: (produksi)
npm run check:budget      # gagal bila aset melebihi batas
npm run test:e2e          # Playwright
npm run export:backup     # build statis untuk host cadangan
```

## Definisi selesai per fase
Lint, typecheck, `check:budget`, dan `test:e2e` lulus, lalu commit dengan pesan yang menyebut fase dan cakupannya.
