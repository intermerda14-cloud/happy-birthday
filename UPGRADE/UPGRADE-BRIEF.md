# Upgrade dan Polish: Kisah Adelia

Sumber: `DOKUMENTASI_UI_UX.md`. Patch di folder ini menggantikan `PageTurner`, `Cover`, dan `CandleScene` dengan props yang sama, ditambah stylesheet dan helper baru.

## 1. "Buka buku" tidak jalan di Android: hipotesis

Dokumen hanya memuat potongan kode, jadi penyebab pastinya belum bisa dipastikan dari sini. Urutan kemungkinan, dan apa yang ditutup patch:

1. **Error sebelum aksi buka dijalankan.** Reducer `OPEN` menyalakan audio (`audioEnabled: true`). Kalau pemanggil `onOpen` memulai `SoundEngine` (AudioContext) dan melempar error di Android, `dispatch` tidak pernah tercapai. Patch: semua suara lewat `sfx()` yang tidak pernah melempar error.
2. **Lapisan dekoratif menangkap sentuhan.** `.page-crease`, `.page-shadow-overlay`, `.book-spine`, `.back-*`, `.corner-ornament`. Patch: semuanya `pointer-events: none`, dan dua sisi halaman 3D (rawan salah hit-test di Android) diganti satu sisi.
3. **Kunci waktu tidak jelas.** `Cover` menerima `isUnlocked` tapi tidak memakainya, dan `timeLeft` dihitung tapi tidak pernah ditampilkan. Kalau parent mengabaikan `onOpen` saat `isUnlocked` false (dan `birthdayISO` masih `TODO`), tombolnya tampak mati. Patch: `Cover` menghitung kunci sendiri; tanggal `TODO` berarti tidak terkunci; `?preview=<previewKey>` melewati kunci.
4. **Tinggi layar Android.** `100dvh` + `overflow:hidden` dapat menyembunyikan tombol bawah di balik bilah navigasi. Patch: padding safe-area.

**Cek cepat (1 menit):** buka `https://situs-lu/?debug`, tap "Buka buku". Label hijau di pojok kiri atas menampilkan elemen yang benar-benar menerima tap. Bila bukan `button.btn`, ada lapisan yang menutupi. Kalau tetap gagal, kirim tangkapan layar label itu plus console error (Chrome desktop: `chrome://inspect#devices`).

## 2. Kenapa kesannya belum mewah

| Di kode sekarang | Kesan | Di patch |
|---|---|---|
| Lilin: `div` 26×46 px, api ber-`box-shadow` | kartun | SVG lilin dengan api ber-blur dan bergoyang (filter turbulence), cahaya hangat, asap |
| Segel: gradien + garis putus-putus | datar | kilau lilin (filter specular), retakan, pecah dua |
| Sampul tanpa tekstur | plastik | tekstur kulit (filter lighting), bingkai emas ganda |
| Label kapital ber-letterspacing, "Bab I" di atas judul, Title Case, ✦ di dalam teks, "→" di tombol | template | huruf kecil biasa, tanpa label di atas judul. Contoh: "Lilin di malam hari", "Buka buku" |
| Foil berkilau terus (`infinite alternate`) | murahan | satu sapuan masuk, lalu kilau bergeser saat HP dimiringkan |
| Salah arah: "Geser ke kanan untuk membaca" (padahal geser kiri = maju) | membingungkan | "Geser halaman ke kiri untuk melanjutkan." |
| Gaya inline di tiap komponen | sulit dipoles | class di `upgrade.css` |

## 3. Interaksi baru yang sudah ada di patch

- **Halaman mengikuti jari** saat digeser, lalu menyelesaikan diri atau kembali (ada flick). Bila belum boleh lanjut, halaman tertahan dan bergetar kecil.
- **Segel:** tahan 0,9 detik, retakan menggambar dirinya, lalu pecah dengan getaran. Cadangan: 3 tap cepat atau keyboard.
- **Lilin:** api condong menjauhi jari, cincin progres, padam, malam berganti fajar.
- **Percikan emas** di setiap sentuhan, **kilau foil** mengikuti kemiringan HP, **tombol** berkilau saat ditekan, **getar** halus di Android.
- `prefers-reduced-motion` dihormati.

## 4. Cara memasang

1. Salin file sesuai path (`components/`, `lib/`, `hooks/`, `app/upgrade.css`).
2. Di `app/layout.tsx`: `import "./upgrade.css";` setelah `globals.css`, dan tambahkan `export const viewport = { viewportFit: "cover" };`.
3. Hapus aturan CSS lama yang tercantum di komentar atas `upgrade.css`.
4. Pastikan pemakaian tetap: `<PageTurner index onChange canAdvance>`, `<Cover isUnlocked onOpen>`, `<CandleScene blown onBlow>`. **Periksa juga** kode yang memanggil `onOpen` (bagian `BookProvider` yang tidak ada di dokumen): jangan ada `return` awal atau kode yang bisa melempar error sebelum `dispatch({ type: "OPEN" })`.
5. `lib/sfx.ts` mengimpor `@/components/audio/SoundEngine` dan memanggil `playPageTurn`, `playWaxCrack`, `playBlow` (bisa sebagai ekspor modul, `default`, atau `SoundEngine`). Cocokkan bila namanya berbeda.
6. Jalankan lint dan typecheck, lalu tes di Android asli.

## 5. Backlog polish untuk scene lain (belum dikerjakan)

| Scene | Sekarang | Target |
|---|---|---|
| Surat | blur ke fokus per paragraf | amplop dan segel yang dibuka dulu, lalu teks muncul mengikuti scroll |
| Album | tap = cetak, tap lagi = lightbox | polaroid bisa digeser dan dilempar dengan pegas, lightbox membesar dari posisi foto |
| Timeline | garis statis | garis emas tergambar mengikuti scroll, titik menyala saat dicapai |
| Musik | piringan berputar, iframe track | tonearm bisa digeser, piringan "digesek" saat diseret; pakai Spotify iFrame API agar putaran mengikuti status putar |
| Kupon | tap = sobek | sobek dengan menyeret jari sepanjang garis perforasi |
| Peta bintang | 7 bintang bisa disentuh | garis rasi tergambar saat bintang disentuh, kelap-kelip halus |
| Toples | tap = ambil alasan | goyangkan HP (`devicemotion`) untuk mengambil alasan, kertas terbuka dengan pegas |
| Penutup | angka hari statis | angka berputar (odometer) lalu percikan emas |

## 6. Uji di Android (centang semua)

- [ ] Segel bisa dipecahkan dengan tahan, dan tombol "Buka buku" membuka buku
- [ ] Geser halaman mengikuti jari; geser vertikal di surat tetap menggulir
- [ ] Lilin tidak padam bila dilepas sebelum 1,5 detik; padam bila ditahan penuh
- [ ] Tidak ada tombol tertutup bilah navigasi
- [ ] Suara tidak muncul sebelum sentuhan pertama, dan error audio tidak menghentikan apa pun
- [ ] Layar tidak patah-patah (60 fps) di HP kelas menengah

## 7. Batasan

- Gue hanya melihat potongan kode di dokumen, bukan repo utuh (tidak ada `BookProvider` lengkap, `SoundEngine`, `globals.css` penuh, dan scene lain).
- Patch sudah lulus typecheck dan 6 tes perilaku (segel, lilin, page turner) di lingkungan jsdom. **Belum diuji di perangkat Android atau browser sungguhan**, jadi tampilan efek (kulit, kilau segel, api) perlu lu lihat langsung.
