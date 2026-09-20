# PROGRESS.md

Dokumentasi kemajuan proyek "Kisah Adelia" untuk kontinuitas kerja antar-sesi / antar-agent.

## Posisi Terkini: Selesai 100% Seluruh Bab (Fase 0, 1, 2, 3)

### Fitur & Bab Lengkap Buku Dongeng (Live di `http://localhost:3000`)
1. **Sampul Terkunci & Segel Lilin (`Cover.tsx`)**:
   - Hitung mundur jam:menit:detik menuju 00.00 WIB hari-H (`birthdayISO`).
   - Bypass URL `?preview=...`.
   - Pecah segel lilin burgundy dengan inisial emas dan buka buku.
2. **Bab I: Lilin di Malam Hari (`CandleScene.tsx`)**:
   - Tahan lilin 1.5 detik (`pointerDown`) dengan cincin progress animasi.
   - Efek tiup lilin (padam, asap halus, SFX suara tiupan angin).
   - Krosfade 2.4s dari langit malam gelap ke fajar hangat.
   - Gating navigasi: halaman berikutnya terkunci sampai lilin ditiup.
3. **Bab II: Surat Cinta (`LetterScene.tsx`)**:
   - Efek reveal blur-ke-fokus bertahap per paragraf.
   - Drop cap huruf awal warna bronze.
   - Tanda tangan pengirim Firas.
4. **Bab III: Kenangan / Album Foto (`AlbumScene.tsx`)**:
   - Layout polaroid washi tape.
   - Interaksi **Tap to Develop** (buram sepia jadi jernih) + **Fullscreen Lightbox Modal** saat diklik lagi.
5. **Bab IV: Jejak Langkah / Timeline (`TimelineScene.tsx`)**:
   - Jalur vertikal tanaman/pita emas yang memuat momen-momen indah perjalanan berdua.
6. **Bab V: Lagu Kita (`MusicScene.tsx`)**:
   - Meja putar piringan hitam yang berputar saat musik dinyalakan.
   - Catatan pribadi *"kenapa lagu ini"* untuk tiap lagu.
   - Player Spotify Embed terintegrasi (otomatis menduck/meredupkan ambient sound).
7. **Bab VI: Hadiah Kecil / Kupon (`CouponsScene.tsx`)**:
   - Tiket bertakik dengan efek sobekan.
   - Tombol "Tukar Kupon" dengan SFX sobek kertas & status tersimpan di `localStorage`.
8. **Bab VII: Langit Malam Itu / Peta Bintang (`StarsScene.tsx`)**:
   - Peta konstelasi bintang interaktif pada tanggal spesial / jadian.
   - Sentuh titik-titik bintang untuk membaca pesan konstelasi.
9. **Bab VIII: Toples Alasan (`JarScene.tsx`)**:
   - Toples kaca berisi gulungan kertas alasan cinta.
   - Tap toples untuk mengambil gulungan acak (tanpa pengulangan) dengan SFX chime magis & animasi gulungan membuka.
10. **Bab IX: Penutup & Epilog (`EpilogueScene.tsx`)**:
    - Pesan *"Bersambung ke tahun berikutnya"*.
    - Counter hitung hari bersama sejak tanggal jadian (`anniversaryISO`).
    - Surat ekstra bersegel lilin untuk tahun depan.
    - Tombol *"↺ Baca Dari Awal"* & tombol *"Reset status kupon"*.
11. **Web Audio SFX Engine & Sound Toggle (`SoundEngine.ts` & `SoundToggle.tsx`)**:
    - Suara organik sintetis (tiup lilin, balik kertas, sobek kupon, pecah lilin, chime toples, dan ambient pad musik hangat).
    - Tombol floating Mute/Unmute 🔊 di pojok kanan atas.
    - Auto-ducking saat Spotify berputar.

---

### Verifikasi Teknis
- Typecheck `npx tsc --noEmit`: **100% Bersih (0 error)**.
- Dev Server: **Berjalan lancar di port 3000** (LAN/WiFi accessible via `0.0.0.0`).