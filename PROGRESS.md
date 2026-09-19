# PROGRESS.md

Dokumentasi kemajuan proyek "Kisah Adelia" untuk kontinuitas kerja antar-sesi / antar-agent.

## Posisi Terkini: Selesai Fase 1 (MVP Interaktif Lengkap)

### Status Fitur & Bab Buku (Live di `http://localhost:3000`)
- [x] **Sampul Terkunci & Segel Lilin (`Cover.tsx`)**:
  - Segel lilin burgundy dengan inisial emas.
  - Hitung mundur hari:jam:menit:detik menuju 00.00 WIB hari-H (`birthdayISO`).
  - Bypass preview URL `?preview=...`.
  - Tombol **"Buka Buku"** memecahkan segel dan membuka lembaran pertama.
- [x] **Bab 1: Lilin di Malam Hari (`CandleScene.tsx`)**:
  - Interaksi tahan api lilin 1.5 detik (`pointerDown` + progress ring).
  - Efek tiupan lilin (animasi padam & asap).
  - Transisi gradien malam gelap (`bg-night`) ke fajar hangat (`bg-dawn`).
  - Gating navigasi: Bab 2 baru bisa dibuka setelah lilin ditiup.
- [x] **Bab 2: Surat Cinta (`LetterScene.tsx`)**:
  - Teks surat dengan efek reveal bertahap (blur-to-focus per paragraf).
  - Drop cap huruf awal warna bronze.
  - Tanda tangan pengirim di bagian penutup.
- [x] **Bab 3: Kenangan / Album Foto (`AlbumScene.tsx`)**:
  - Layout polaroid washi tape dengan rotasi acak.
  - Fitur tap-to-develop (dari buram sepia menjadi jernih) dengan transisi pegas.
- [x] **Bab 4: Jejak Langkah / Timeline (`TimelineScene.tsx`)**:
  - Jalur vertikal dengan titik-titik emas perjalanan waktu.
- [x] **Bab 5: Lagu Kita (`MusicScene.tsx`)**:
  - Piringan hitam interaktif yang berputar saat musik dinyalakan.
  - Catatan pribadi ("kenapa lagu ini") dan selector track lagu.
- [x] **Bab 6: Hadiah Kecil / Kupon (`CouponsScene.tsx`)**:
  - Tiket bertakik dengan efek sobekan.
  - Status kupon tersimpan otomatis di `localStorage`.
- [x] **Bab 9: Penutup & Epilog (`EpilogueScene.tsx`)**:
  - Pesan "Bersambung ke tahun berikutnya".
  - Tombol "Baca Dari Awal" dan opsi reset kupon.
- [x] **Mobile Touch & Gesture Fix (`PageTurner.tsx`)**:
  - Swipe touch horizontal presisi di Android & iOS Safari.
  - Tombol navigasi "Kembali" / "Lanjut →" dengan z-index fixed anti-tenggelam.
  - Tombol keyboard `←` dan `→` untuk navigasi desktop.

---

### Panduan Verifikasi
- Jalankan typecheck:
  ```powershell
  npm run typecheck
  ```
- Jalankan dev server untuk mobile testing (LAN):
  ```powershell
  npm run dev -- --hostname 0.0.0.0
  ```