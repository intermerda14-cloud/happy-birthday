# PROGRESS.md

Dokumentasi kemajuan proyek "Kisah Adelia" untuk kontinuitas kerja antar-sesi / antar-agent.

## Posisi Terkini: Selesai Fase 0 (Fondasi) & Siap Masuk Fase 1 (MVP)

### Status Komponen & Fitur
- [x] **Scaffold Next.js 16 (App Router) + TS + Tailwind v4** di root `D:\raipi\PJ-HBD`.
- [x] **Dev Server aktif & verified**: Berjalan di `http://localhost:3000` (juga bind ke `0.0.0.0` untuk akses HP lewat WiFi).
- [x] **Typecheck (`tsc --noEmit`)**: Bersih 100% (0 error).
- [x] **Tokens & Styling (`app/globals.css`)**: Palet plum/aubergine (`--night`), champagne, gold, bronze, paper, ink, rose, mint, plus efek foil text sweep, CSS 3D page rotation, dan overscroll protection.
- [x] **Struktur Konten (`content/`)**: 7 file skema (`site`, `letter`, `album`, `timeline`, `tracks`, `coupons`, `reasons`) dengan placeholder `TODO:`.
- [x] **Manifest Aset (`assets/manifest.ts`)**: Daftar lengkap slot aset sesuai PRD §8.2 beserta fallback CSS/gradient.
- [x] **Komponen Inti**:
  - `components/BookProvider.tsx` (state context + localStorage persistence).
  - `components/PageTurner.tsx` (CSS 3D book flipping, swipe touch gesture, keyboard arrows, folio bar).
  - `components/Cover.tsx` (sampul kulit dongeng dengan tombol "Buka buku").
  - `components/pages/PlaceholderPage.tsx` (lembar bab placeholder).
  - `components/Book.tsx` (perakit buku utama).
- [x] **Skrip Pemeriksaan**: `scripts/check-content.mjs` dan `scripts/check-budget.mjs`.
- [x] **API Route**: `app/api/now/route.ts` (waktu server WIB).
- [x] **Noindex Metadata & Robots**: `app/robots.ts` disallow all.

---

### Langkah Berikutnya: **Fase 1 (MVP Lengkap dengan Placeholder)**
1. **Bab 0 / Sampul Terkunci**:
   - Segel lilin dengan hitung mundur jam:menit:detik menuju 00.00 WIB hari-H (`birthdayISO`).
   - Logika buka otomatis saat waktu server tiba / bypass lewat `?preview=<previewKey>`.
   - Interaksi pecah segel saat diklik.
2. **Bab 1 (Lilin di Malam Hari)**:
   - State machine lilin: `idle` → `holding` (1.5s press-and-hold) → `out` (tiup & transisi malam ke pagi hangat) → `done`.
   - Visual api lilin (fallback CSS flicker) dan transisi latar `bg-night` ke `bg-dawn`.
3. **Bab 2 (Surat Cinta)**:
   - Efek reveal blur-ke-fokus bertahap per paragraf. Drop cap warna bronze.
4. **Bab 3 (Kenangan / Album)**:
   - Layout scrapbook polaroid washi tape + fullbleed (Ken Burns). Tap to develop.
5. **Bab 5 (Lagu Kita)**:
   - Meja putar piringan hitam + Spotify embed player.
6. **Bab 6 (Kupon Hadiah)**:
   - Tiket bertakik dengan animasi sobek dan persistensi localStorage.
7. **Bab 9 (Penutup)**:
   - "Bersambung ke tahun berikutnya" + tombol "Baca dari awal".
8. **Audio Controller**:
   - Background ambient ducking saat Spotify nyala, sound toggle button.

---

### Panduan untuk Agent Penerus
- Jika dev server mati, jalankan:
  ```powershell
  npm run dev -- --hostname 0.0.0.0
  ```
- Selalu verifikasi typecheck sebelum menyelesaikan fase:
  ```powershell
  npm run typecheck
  ```