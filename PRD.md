# PRD: "Kisah Adelia", Website Ulang Tahun Bertema Buku Dongeng

Versi 2.0 · Status: siap dibangun · Pembaca: AI coding agent (CLI) dan Firas
Hosting: Vercel Hobby (free) · Bahasa situs: Indonesia · Target utama: HP (portrait)

---

## 0. Cara memakai dokumen ini (untuk agent)

1. Baca seluruh dokumen sebelum menulis kode. Kerjakan berurutan sesuai **Bagian 11 (Rencana Implementasi)**.
2. Referensi visual dan interaksi ada di `reference/mockup-buku-dongeng.html`. Ambil mekanik dan nuansanya (tahan-lilin, transisi malam ke pagi, page turn, tiket bertakik, reveal blur ke fokus). **Ganti** semua ilustrasi vektor (bukit, kastil, lilin, ornamen) dengan aset realistis lewat sistem slot aset (Bagian 8).
3. Jangan mengarang isi personal (nama panggilan, tanggal, cerita, caption, lagu). Pakai placeholder bertanda `TODO:` di `content/`. Skrip `check:content` harus gagal saat build produksi jika masih ada `TODO:`.
4. Jangan mengunduh atau meng-scrape aset dari internet. Aset disediakan manusia di `assets-raw/`. Kalau slot aset belum terisi, pakai fallback (Bagian 8.3) supaya situs selalu bisa berjalan.
5. Tanya manusia hanya untuk hal di **Bagian 4.2 (Keputusan terbuka)**. Selain itu, pilih opsi paling sederhana dan catat di `DECISIONS.md`.
6. Sebelum menandai sebuah fase selesai: `npm run lint && npm run typecheck && npm run check:budget && npm run test:e2e` harus lulus, lalu commit.

---

## 1. Ringkasan

Sebuah situs sekali-jadi, dibuka di HP Adelia tepat saat ulang tahunnya. Situs berbentuk buku dongeng antik: sampul kulit dengan segel lilin, bab-bab yang dibuka dengan membalik halaman, dan momen utama berupa lilin sungguhan yang ditiup untuk membuat permohonan. Isinya surat, album foto, halaman musik favorit, perjalanan mereka berdua, dan kupon kado.

**Keberhasilan:** dia membukanya sendiri di HP tanpa bantuan, tidak ada bug atau loading yang mengganggu, terasa mewah, romantis, dan personal, dan dia menyimpan linknya.

## 2. Prinsip produk

1. **Personal mengalahkan dekoratif.** Kata-kata, foto, dan lagu yang bermakna lebih penting dari efek.
2. **Satu bahasa visual.** Objek nyata (buku, kulit, kertas, lilin, bunga) dari foto atau video, latar berupa lukisan sinematik, semuanya diberi color grade plum-emas yang sama plus grain tipis. Tidak boleh ada campuran foto dan gambar kartun.
3. **Mewah lewat kesabaran.** Gerakan pelan dan berbobot, banyak ruang kosong, material terasa mahal. Lucu hanya muncul lewat momen kecil yang dipicu sentuhan.
4. **Selalu bisa dikirim.** Setiap aset punya fallback, jadi situs layak rilis kapan saja walau aset belum lengkap.
5. **Ringan di tangan.** Aset berat dimuat per bab dan tidak memblokir bab yang sedang dibaca.

## 3. Pengguna dan konteks

- **Penerima:** Adelia, membuka lewat link di WhatsApp, di HP (iOS Safari atau Chrome Android), kemungkinan dengan data seluler.
- **Pembuat:** Firas, menyunting isi lewat file `content/` tanpa menyentuh komponen.
- **Sekali pakai:** tidak ada akun, admin, atau backend data. Hanya satu endpoint kecil untuk waktu server (Bagian 9.5).

## 4. Keputusan

### 4.1 Sudah dikunci

| Topik | Keputusan |
|---|---|
| Jenis | Berdiri sendiri, tanpa integrasi dengan proyek lain |
| Tema | Buku dongeng antik |
| Palet | Arah A: plum dan champagne (Bagian 7.1) |
| Tampilan | Realistis (foto, video, lukisan sinematik), bukan kartun dan bukan vektor |
| Momen utama | Lilin sungguhan, tahan untuk meniup |
| Halaman wajib | Surat, album foto (lebih dari satu halaman), musik favorit, perjalanan, kupon, penutup |
| Sumber aset | Internet (bebas lisensi diutamakan), AI generate, dan rekaman sendiri. Penggunaan pribadi |
| Musik | Embed Spotify, tanpa hosting file lagu, tanpa menampilkan lirik |
| Hosting | Vercel Hobby, dengan host cadangan siap pakai |
| Cara build | AI agent lewat CLI |

### 4.2 Terbuka (agent boleh bertanya hanya soal ini)

1. Tanggal ulang tahun (`birthdayISO`).
2. Nama panggilan Adelia.
3. Tanggal jadian dan tanggal spesial lain (untuk hitung hari dan peta bintang).
4. Daftar lagu (URI Spotify) beserta catatan pribadi tiap lagu.
5. Foto, caption, momen timeline, teks surat, ide kupon.
6. Ambient audio menyala otomatis setelah "Buka buku", atau default mati.

---

## 5. Struktur buku

| # | Bab | Isi | Fase |
|---|---|---|---|
| 0 | Sampul terkunci | Kulit, segel lilin, hitung mundur, bisa dibuka setelah 00.00 WIB hari H | 1 |
| 0b | Sampul terbuka | Segel pecah, "Buka buku" | 1 |
| 1 | Lilin di malam hari | Momen utama, malam berubah pagi | 1 |
| 2 | Sebuah surat | Surat utama, tanda tangan tulisan tangan asli | 1 |
| 3 | Kenangan (album) | 2 spread di Fase 1, sampai 6 spread di Fase 2 | 1 dan 2 |
| 4 | Jejak langkah | Timeline 5 sampai 7 momen | 2 |
| 5 | Lagu kita | Piringan hitam, 3 sampai 5 lagu, catatan pribadi | 1 |
| 6 | Hadiah kecil | Kupon tiket yang bisa disobek | 1 |
| 7 | Langit malam itu | Peta bintang pada tanggal spesial | 3 |
| 8 | Toples alasan | Tap untuk mengambil satu alasan | 3 |
| 9 | Penutup | "Bersambung ke tahun berikutnya", hitung hari, surat bersegel, "Baca dari awal" | 1 (dasar), 3 (lengkap) |

Urutan bab mengikuti tabel. Bab yang belum dikerjakan tidak boleh tampil di build.

---

## 6. Spesifikasi per halaman

Semua teks Indonesia, kata kerja konsisten: **Buka**, **Balik**, **Tukar**, **Putar**, **Jeda**, **Baca**.

### 6.1 Sampul (bab 0 dan 0b)
- **Tampilan:** tekstur kulit foto tileable, bingkai ganda foil emas, judul "Kisah {recipientName}" berefek foil emas, subjudul "Sebuah dongeng untuk hari ulang tahunmu". Segel lilin (foto alpha) di tengah bawah.
- **Terkunci** (sebelum `unlockAt`): segel utuh, hitung mundur hari:jam:menit:detik, teks "Kisah ini baru bisa dibuka tanggal {tanggal}, jam 00.00 WIB." Tidak ada tombol buka.
- **Terbuka:** teks "Sudah waktunya." Tap segel untuk memecahkannya (dua belahan bergeser, getaran ringan). Lalu tombol "Buka buku". Tap ini juga menjadi gestur pengguna pertama yang mengaktifkan audio (Bagian 9.7).
- **Kriteria:** hitung mundur akurat terhadap waktu server (fallback jam perangkat); saat waktu lewat, halaman berubah tanpa reload; `?preview=<previewKey>` melewati kunci.

### 6.2 Bab 1: Lilin di malam hari
- **Latar:** lukisan sinematik malam (bulan, langit berbintang, siluet kastil dan hutan), `bg-night`. Saat lilin padam, dikrosfade 2,4 detik ke `bg-dawn` (fajar hangat), disertai penyesuaian brightness pada lilin.
- **Objek:** foto lilin (badan lilin, alpha) di tengah, video api dilapis di ujung sumbu dengan `mix-blend-mode: screen`. Cahaya hangat (radial gradient) bernapas pelan di sekitar api dan menerangi wax.
- **Interaksi (state machine):**
  - `idle`: api menyala, loop `flame-idle`. Teks "Tahan lilinnya, lalu buat permohonan."
  - `holding`: dimulai saat pointerdown atau Space/Enter. Cincin progres mengisi 1,5 detik, api miring (transform pada video) dan klip `flame-lean` menggantikan idle. Lepas sebelum 1,5 detik kembali ke `idle`.
  - `out`: setelah 1,5 detik, putar `flame-out` sekali (padam dan asap), suara tiup (`sfx-blow`), getaran 30 ms bila tersedia, latar berganti fajar, percikan kecil, teks berganti "Permohonanmu sudah didengar.", tombol "Balik halaman" muncul setelah 1,3 detik.
  - `done`: lilin tanpa api, halaman bisa dibalik.
- **Reduced motion / video gagal:** tap tunggal "Tiup lilin", api diganti gambar diam dengan flicker CSS, crossfade latar instan.
- **Kriteria:** tidak ada layout shift saat video dimuat (poster memakai ukuran tetap); halaman berikutnya tidak bisa dibalik sebelum state `out`; 60 fps di HP kelas menengah.

### 6.3 Bab 2: Sebuah surat
- **Tampilan:** kertas perkamen (tekstur foto tileable) dengan vignette, bingkai emas tipis, ornamen tanaman merambat di empat sudut (aset foto atau ilustrasi realistis, bukan vektor kartun), bayangan punggung buku di kiri.
- **Tipografi:** Fraunces mode soft, 19 px, line-height 1,7, lebar baris maksimal 60 karakter, huruf awal paragraf pertama sebagai initial (drop cap) warna bronze.
- **Isi:** dari `content.letter` (paragraf-paragraf), lalu tanda tangan berupa gambar tulisan tangan asli Firas (alpha).
- **Motion:** tiap paragraf muncul dari blur ke fokus (1,4 detik, jeda 0,25 detik antar paragraf) saat halaman aktif. Hanya di halaman surat.
- **Opsional (Fase 2):** pemutar voice note "Dengarkan aku" (m4a).
- **Kriteria:** teks bisa di-scroll di dalam halaman bila panjang; kontras teks minimal AA.

### 6.4 Bab 3: Kenangan (album, beberapa spread)
Setiap spread punya layout berbeda supaya album terasa hidup. Data dari `content.album.spreads`.

| Layout | Deskripsi | Fase |
|---|---|---|
| `scrapbook` | 3 sampai 5 foto polaroid dengan isolasi kertas (washi tape), rotasi kecil, bunga kering. Tap foto untuk "mencetak" (dari buram sepia ke jernih, pegas kecil) lalu tap lagi untuk memperbesar | 1 |
| `fullbleed` | Satu foto penuh layar dengan zoom pelan (Ken Burns, 12 sampai 18 detik), caption tulisan halus di bawah | 1 |
| `stringlights` | Tali lampu berbokeh, polaroid tergantung dengan jepit kayu, ayunan halus saat disentuh | 2 |
| `thennow` | Dua foto (dulu dan sekarang) dengan penggeser pembanding | 2 |
| `clip` | Klip video pendek (maks 6 detik, tanpa suara) dalam bingkai foto | 2 |

- **Lightbox:** tap foto memperbesar dari posisinya (shared element), geser kiri kanan berpindah foto, tap latar menutup.
- **Kriteria:** foto memakai placeholder blur (blurhash atau base64 kecil) sebelum termuat; foto spread berikutnya di-preload saat spread saat ini terlihat; jumlah foto total 18 sampai 30.

### 6.5 Bab 4: Jejak langkah
- Timeline vertikal berupa jalur (tanaman rambat atau pita) di kiri, 5 sampai 7 momen di kanan, masing-masing: tanggal, judul singkat, satu kalimat, satu foto kecil opsional.
- Momen muncul bergantian saat di-scroll dengan fade halus (bukan slide berlebihan).

### 6.6 Bab 5: Lagu kita
- **Tampilan:** meja putar kayu (foto), piringan hitam (alpha) yang berputar saat lagu diputar, tonearm turun ke piringan. Di bawahnya tumpukan sampul lagu (sleeve) yang bisa digeser.
- **Data:** 3 sampai 5 lagu: `spotifyUri`, `title`, `artist`, `note` (catatan pribadi "kenapa lagu ini"), `date` opsional. **Catatan pribadi adalah inti halaman ini.** Tidak menampilkan lirik.
- **Pemutar:** Spotify iFrame API (`https://open.spotify.com/embed/iframe-api/v1`), mode compact (tinggi 80 px) terlihat di bawah meja putar. Pilih sleeve memanggil `loadUri`. Event `playback_update` menentukan putaran piringan dan turunnya tonearm.
- **Batasan yang harus ditangani:** bila pengguna belum login Spotify, hanya cuplikan yang diputar, tampilkan catatan halus "Cuplikan 30 detik. Masuk Spotify untuk lagu penuh." Bila skrip gagal dimuat, tampilkan tombol "Buka di Spotify" per lagu.
- **Audio:** saat lagu Spotify diputar, ambient bed dijeda atau di-duck; kembali saat berhenti.
- **Kriteria:** tidak ada file audio berhak cipta di repo; embed tidak autoplay; piringan berhenti saat jeda.

### 6.7 Bab 6: Hadiah kecil (kupon)
- 3 sampai 5 kupon berbentuk tiket emas bertakik (mask CSS), garis perforasi. Tombol "Tukar" menyobek bagian kiri (rotasi, translasi, pegas), tombol berubah menjadi "Kupon ditukar."
- Status tersimpan di localStorage (try/catch, fallback memori). Tombol reset ada di Bab 9.
- **Kriteria:** status bertahan saat reload; tiket tetap terbaca di 360 px.

### 6.8 Bab 7: Langit malam itu (Fase 3)
- Peta bintang langit pada tanggal dan lokasi spesial, dirender statis saat build (`scripts/starmap.ts`, memakai `astronomy-engine` dan katalog bintang terbuka, cek lisensi katalog), ditampilkan sebagai poster berbingkai emas dengan caption tanggal dan tempat.

### 6.9 Bab 8: Toples alasan (Fase 3)
- Foto toples kaca berisi gulungan kertas. Tap mengambil satu alasan (acak tanpa pengulangan sampai habis), kertas terbuka dengan animasi pegas kecil. 12 sampai 20 alasan di `content.reasons`.

### 6.10 Bab 9: Penutup
- Teks "Bersambung ke tahun berikutnya."
- Hitung hari bersama ("Sudah N hari, dan terus bertambah") berdasarkan `anniversaryISO` (Fase 3).
- Surat bersegel yang terbuka pada `nextBirthdayISO` (kunci sisi klien, Fase 3).
- Tombol "Baca dari awal": mengembalikan buku ke bab 1 (tidak menghapus status kupon kecuali pengguna memilih "Reset kupon" di menu kecil).

### 6.11 Navigasi global
- Tombol "Balik halaman" di tiap halaman, geser kiri untuk maju, geser kanan untuk mundur (kecuali saat menahan lilin), tap tepi halaman, panah keyboard.
- Nomor halaman (folio) kecil di bawah, tombol suara (nyala/mati) di sudut.
- Bab dapat menyatakan `canAdvance` (contoh: bab 1 hanya bisa lanjut setelah `out`).
- `inert` pada halaman yang tidak aktif.

---

## 7. Sistem desain

### 7.1 Token warna (arah A)
```css
:root{
  --night:#2A1230;      /* Aubergine: latar malam, sampul */
  --champagne:#E9CFA0;  /* teks di atas gelap, aksen lembut */
  --gold:#C9A25E;       /* foil, garis bingkai (dekoratif) */
  --bronze:#8A5A2B;     /* drop cap, folio di atas kertas */
  --paper:#F7EAD9;      /* perkamen dasar */
  --ink:#3A1D3F;        /* teks di atas kertas */
  --rose:#D9A0B0;       /* aksen: isolasi, bloom cat air */
  --mint:#C9E6D8;       /* status berhasil */
}
```
Emas hanya untuk elemen dekoratif atau teks besar di atas latar gelap. Teks di atas kertas selalu `--ink`.

### 7.2 Tipografi
- **Fraunces** (variable, sumbu SOFT dan opsz) untuk judul dan isi surat. **Nunito** untuk UI kecil dan caption. Keduanya lewat `next/font` (self-host), dengan fallback Georgia dan system-ui.
- Kalimat huruf kecil biasa, tanpa huruf kapital semua, tanpa label kecil di atas judul.

### 7.3 Material dan color grade
- Semua aset diberi grade yang sama (bayangan condong plum, sorotan condong champagne, kontras lembut) lewat LUT atau skrip ImageMagick `scripts/grade.sh`, ditambah grain tipis (opacity 6 sampai 9 persen) dan vignette lewat CSS.
- Bayangan selalu bertinta plum, bukan abu-abu netral.
- Bentuk berbeda per objek: kertas bertepi tajam, foto berbingkai putih dengan rotasi kecil, tiket bertakik.

### 7.4 Motion
| Momen | Durasi | Easing |
|---|---|---|
| Page turn | 1,3 s | `cubic-bezier(.22,.61,.36,1)` |
| Malam ke pagi | 2,4 s | sama |
| Reveal teks surat | 1,4 s | sama |
| Pegas kecil (cetak foto, sobek kupon) | 0,7 sampai 0,8 s | `cubic-bezier(.34,1.56,.64,1)` |
Aturan: hanya `transform`, `opacity`, dan satu `filter` yang dianimasikan pada satu waktu. Tanpa `backdrop-filter` besar. Tanpa fade-up di tiap bagian. Tanpa hati melayang.

### 7.5 Suara (sound design)
- `sfx-page-turn` (lirih), `sfx-blow`, `ambient-bed` (loop ≤ 1,5 MB, sangat pelan). Semua hanya mulai setelah gestur pengguna. Tombol suara selalu terlihat, pilihan disimpan. Musik Spotify menjeda ambient.

### 7.6 Reduced motion
`prefers-reduced-motion`: page turn menjadi crossfade, tanpa Ken Burns, tanpa autoplay video, api gambar diam dengan flicker CSS, lilin ditiup dengan satu tap.

---

## 8. Realisme dan pipeline aset

### 8.1 Aturan
- Objek (lilin, buku, kulit, kertas, segel, bunga, meja putar, toples) dari foto atau video. Latar dari lukisan sinematik (AI atau foto). **Tidak ada ilustrasi vektor untuk objek.** SVG hanya untuk ikon UI, bingkai foil, dan fallback.
- Aset mentah di `assets-raw/` (masuk `.gitignore`). Hanya hasil olahan yang masuk `public/media/`.
- Sumber diutamakan bebas lisensi: Pexels, Pixabay, Unsplash, Poly Haven, ambientCG. Aset di luar itu dicatat di `assets/SOURCES.md` (URL, judul, lisensi atau catatan).

### 8.2 Manifest slot
Semua aset dirujuk lewat ID di `assets/manifest.ts`. Komponen tidak boleh menulis path file langsung.

| Slot ID | File | Spesifikasi | Fallback |
|---|---|---|---|
| `cover.leather` | `cover-leather.avif` | tileable, 2000 px, ≤ 350 KB | gradien aubergine + pola titik |
| `cover.seal` | `wax-seal.webp` | alpha, 512 px | lingkaran gradien merah anggur |
| `scene.night` | `bg-night.avif` | portrait, ≥ 1080×1920, ≤ 600 KB | gradien malam |
| `scene.dawn` | `bg-dawn.avif` | portrait, ≥ 1080×1920, ≤ 600 KB | gradien fajar |
| `candle.body` | `candle-body.webp` | alpha, ~600 px lebar, ≤ 200 KB | rect gradien champagne |
| `candle.flameIdle` | `flame-idle.mp4` | loop mulus 8 sampai 10 s, hitam pekat, ≤ 2,5 MB | poster + flicker CSS |
| `candle.flameLean` | `flame-lean.mp4` | 2 sampai 3 s, ≤ 1,5 MB | idle dengan transform miring |
| `candle.flameOut` | `flame-out.mp4` | 3 sampai 4 s (padam, asap), ≤ 2 MB | fade cepat |
| `candle.poster` | `flame-poster.webp` | frame api, alpha bila bisa | titik cahaya CSS |
| `paper.parchment` | `paper.avif` | tileable, 2000 px, ≤ 350 KB | gradien perkamen |
| `paper.tape[1..3]` | `washi-*.webp` | alpha | persegi rose transparan |
| `paper.flowers[1..4]` | `flowers-*.webp` | alpha, dekor | tidak ada |
| `letter.signature` | `signature.webp` | alpha, tulisan tangan asli | teks italic Fraunces |
| `album.photo[n]` | `photos/*.avif` | 1600 px sisi panjang, ≤ 300 KB, plus thumb 600 px dan placeholder blur | kotak gradien |
| `album.clip[n]` | `clips/*.mp4` | ≤ 6 s, ≤ 2 MB, tanpa suara | poster |
| `music.turntable` | `turntable.avif` | ≤ 400 KB | kotak kayu gradien |
| `music.vinyl` | `vinyl.webp` | alpha, 800 px | lingkaran hitam beralur (CSS) |
| `music.tonearm` | `tonearm.webp` | alpha | garis emas |
| `jar.image` | `jar.webp` | alpha (Fase 3) | tidak ada |
| `sfx.pageTurn`, `sfx.blow` | `*.mp3` | ≤ 60 KB, CC0 | senyap |
| `audio.ambient` | `ambient.mp3` | loop, ≤ 1,5 MB | senyap |
| `audio.voice` | `voice-note.m4a` | opsional, ≤ 1 MB | bagian disembunyikan |

Setiap slot punya `fallback` yang di-render bila file tidak ada atau gagal dimuat, dan `alt` yang bermakna.

### 8.3 Pemrosesan (skrip di `scripts/`)
- `process-images`: `sharp` menghasilkan AVIF dan WebP, thumb, dan placeholder blur; kompres sesuai batas manifest.
- `process-video`: `ffmpeg`, H.264 High, `yuv420p`, `+faststart`, CRF sekitar 26, tanpa audio, crop ke area api (mis. 512×768); MP4 wajib, WebM opsional.
- `cutout`: `rembg` untuk alpha (dijalankan manusia, hasil ke `assets-raw/cutouts/`).
- `upscale`: Real-ESRGAN bila resolusi kurang (dijalankan manusia).
- `grade.sh`: color grade seragam ke seluruh aset visual.
- `check:budget` gagal jika ada aset melebihi batas atau total > 80 MB.

### 8.4 Panduan rekam lilin (untuk Firas)
Ruangan gelap total, kain hitam sebagai latar, HP di tripod, kunci fokus dan eksposur, resolusi 1080p60 atau 4K30, tanpa angin untuk klip idle. Tiga klip: (1) api diam 10 detik, (2) api miring saat ditiup pelan 3 detik, (3) api padam dan asap naik 4 detik. Foto badan lilin terpisah dengan api padam, dengan cahaya hangat dari samping. Latar hitam harus benar-benar hitam agar blend `screen` bersih.

### 8.5 Sumber pencarian yang disarankan
`candle flame black background`, `antique leather book cover texture`, `aged parchment paper texture`, `gold foil texture`, `wax seal png transparent`, `dried pressed flowers`, `fairy lights bokeh`, `vinyl record player`, `glass jar`, `fantasy castle night matte painting`, `enchanted forest night`.

---

## 9. Arsitektur teknis

### 9.1 Stack
Next.js (App Router) + TypeScript (strict) + Tailwind CSS + `motion` untuk animasi. Tanpa state library eksternal (React context + reducer). Dev: ESLint, Prettier, Playwright, `sharp`. Dependensi lain hanya bila dicatat di `DECISIONS.md`. Library page-flip hanya dievaluasi di Fase 3.

### 9.2 Struktur folder
```
app/               layout, page, api/now/route.ts, opengraph-image
components/        Book, PageTurner, Cover, Candle, Letter, Album, Timeline,
                   Music, Coupons, Stars, Jar, Epilogue, AssetImg, AssetVideo, SoundToggle
content/           site.ts, letter.ts, album.ts, timeline.ts, tracks.ts, coupons.ts, reasons.ts
assets/            manifest.ts, SOURCES.md
public/media/      hasil olahan (bukan mentah)
scripts/           process-*.ts, grade.sh, check-content.ts, check-budget.ts, starmap.ts
reference/         mockup-buku-dongeng.html
tests/e2e/         Playwright
DECISIONS.md
```

### 9.3 Skema konten (`content/`)
```ts
export interface Site { recipientName: string; senderName: string; birthdayISO: string; // "YYYY-MM-DD"
  nextBirthdayISO?: string; anniversaryISO?: string; previewKey: string; unlockHourWIB: 0 }
export interface Photo { assetId: string; caption: string; date?: string; alt: string }
export interface Spread { layout: 'scrapbook'|'fullbleed'|'stringlights'|'thennow'|'clip'; photos: Photo[]; title?: string }
export interface Milestone { date: string; title: string; text: string; photoId?: string }
export interface Track { spotifyUri: string; title: string; artist: string; note: string; date?: string }
export interface Coupon { id: string; title: string; text: string }
```
Nilai awal berisi `TODO:`; `check:content` menggagalkan build produksi bila masih ada.

### 9.4 State buku
- `BookState`: `locked | cover | reading`, `index`, `visited`, `audioOn`.
- `CandleState`: `idle | holding | out | done`.
- Persistensi lewat localStorage dengan prefiks `kisah:v1:` (status kupon, pilihan audio, halaman terakhir). Semua akses dibungkus try/catch dengan fallback memori.

### 9.5 Kunci waktu
- `unlockAt = Date.parse(`${birthdayISO}T00:00:00+07:00`)` (WIB tanpa DST).
- Ambil waktu server dari `/api/now` (`dynamic = 'force-dynamic'`), hitung offset terhadap jam perangkat, fallback offset 0 bila gagal. Hitung mundur diperbarui tiap detik dan saat `visibilitychange`.
- **Ini kunci UX, bukan keamanan:** aset tetap URL publik. Jangan menaruh informasi sensitif di situs.
- Mode `EXPORT=1` (build statis untuk host cadangan) memakai jam perangkat saja dan menonaktifkan route API.

### 9.6 PageTurner
```ts
interface PageTurnerProps { pages: ReactNode[]; index: number; onIndexChange(i: number): void; canAdvance(i: number): boolean; reducedMotion: boolean }
```
Implementasi A (Fase 0): CSS 3D, rotateY di sisi kiri, bayangan dinamis, `inert` pada halaman non-aktif. Implementasi B (Fase 3, opsional): library page-flip di balik interface yang sama, hanya bila mampu menampung komponen React interaktif dan tetap 60 fps.

### 9.7 Audio
Satu `AudioProvider`. Tidak ada suara sebelum gestur pengguna; gestur pertama ("Buka buku") membuka `AudioContext`. Ducking saat Spotify diputar. Status tersimpan.

### 9.8 Video
`<video muted playsinline preload>` dengan `poster`; `mix-blend-mode: screen` pada api dengan `isolation: isolate` di induknya. Bila `play()` ditolak (mis. Low Power Mode iOS), pakai poster dengan flicker CSS. Hanya bab aktif yang memutar video, sisanya `pause()`.

### 9.9 Hosting dan deploy
- Repo GitHub, import ke Vercel. Branch `main` produksi, branch lain menjadi preview untuk diuji di HP.
- `images.unoptimized: true` (aset sudah dioptimasi manual, hindari kuota image optimization).
- Header cache panjang `public, max-age=31536000, immutable` untuk `/media/*` (nama file ber-hash).
- Variabel `NEXT_PUBLIC_MEDIA_BASE` (opsional) untuk memindahkan media ke storage terpisah bila repo menjadi berat.
- Host cadangan: `npm run export:backup` menghasilkan build statis siap unggah ke Cloudflare Pages atau Netlify.

---

## 10. Non-functional

### 10.1 Performa
| Metrik | Target |
|---|---|
| LCP (4G) sampul | ≤ 2,5 s |
| CLS | < 0,05 |
| INP | < 200 ms |
| JS awal (gzip) | ≤ 200 KB |
| Aset yang dimuat di sampul | ≤ 700 KB |
| Aset per bab | ≤ 8 MB |
| Total aset | ≤ 80 MB |
| Gambar | ≤ 350 KB, latar ≤ 600 KB |
| Video | ≤ 2,5 MB per klip |

Bab berikutnya di-preload saat bab saat ini interaktif. Frame rate 60 fps di HP kelas menengah.

### 10.2 Aksesibilitas
Kontras AA untuk semua teks, fokus terlihat, semua interaksi bisa lewat keyboard, `alt` bermakna pada semua gambar, label ARIA pada tombol ikon, `inert` untuk halaman non-aktif, dukungan reduced motion.

### 10.3 Browser
iOS Safari 16 ke atas, Chrome Android dua versi terakhir, Samsung Internet, Chrome dan Safari desktop. Di desktop, buku ditampilkan di tengah (lebar maksimal 460 px) dengan latar gelap bermotif.

### 10.4 Privasi
`noindex` di meta, `robots.txt`, dan header `X-Robots-Tag`. Tanpa analytics. Satu-satunya pihak ketiga adalah embed Spotify. Gerbang kata sandi opsional hanya kosmetik.

---

## 11. Rencana implementasi

### Fase 0: Fondasi
- Scaffold Next.js + TS + Tailwind, font, token desain, `content/` beserta skema dan `check:content`, `assets/manifest.ts`, komponen `AssetImg` dan `AssetVideo` dengan fallback, `PageTurner` (A), state buku, header `noindex`, `check:budget`, deploy preview ke Vercel.
- **Selesai bila:** buku kosong dengan 3 halaman placeholder bisa dibalik di HP, ter-deploy, dan semua skrip cek berjalan.

### Fase 1: MVP lengkap dengan placeholder
- Sampul terkunci dan terbuka (segel, hitung mundur, waktu server), bab lilin (fallback CSS dari mockup), surat, album (scrapbook dan fullbleed), lagu kita (Spotify), kupon, penutup dasar, tombol suara, "Baca dari awal".
- **Selesai bila:** seluruh alur berjalan dengan fallback, tes Playwright (Bagian 12) lulus, ter-deploy.

### Fase 2: Realisme
- Integrasikan aset nyata lewat manifest (kulit, kertas, lilin video, latar malam dan fajar, segel, meja putar), color grade seragam, ambient dan sfx, spread album tambahan, timeline, voice note.
- **Selesai bila:** tidak ada slot yang memakai fallback kecuali yang sengaja, anggaran performa terpenuhi, diuji di iPhone dan Android nyata.

### Fase 3: Ekstra
- Peta bintang, toples alasan, surat bersegel, hitung hari, evaluasi page-flip library, tata letak desktop opsional.

### Fase 4: Pengerasan
- Uji perangkat menyeluruh, perbaikan performa, cek konten (`check:content` bersih), uji kunci waktu dengan tanggal palsu (termasuk pergantian tengah malam WIB), verifikasi host cadangan, pembekuan fitur H-1, cadangan rekaman layar.

---

## 12. QA dan kriteria penerimaan

**Tes Playwright (viewport 360×740 dan 390×844):**
1. Sebelum `unlockAt` (jam dimock): sampul terkunci, hitung mundur tampil, tombol buka tidak ada.
2. Setelah `unlockAt`: segel bisa dipecah, "Buka buku" berfungsi.
3. Lilin: tahan kurang dari 1,5 detik tidak memadamkan; tahan penuh memadamkan dan membuka "Balik halaman".
4. Navigasi maju dan mundur lewat tombol, geser, dan keyboard; halaman non-aktif `inert`.
5. Album: cetak foto, buka lightbox, geser antar foto.
6. Musik: tanpa skrip Spotify, tombol "Buka di Spotify" muncul; dengan skrip, memilih sleeve memuat URI.
7. Kupon: tukar, reload, status bertahan.
8. `prefers-reduced-motion`: tanpa page curl, lilin bisa ditiup satu tap.
9. Tanpa satu pun aset media: seluruh alur tetap berjalan dengan fallback.

**Manual (HP nyata):** iOS Safari dan Chrome Android, mode hemat daya, jaringan 4G, rotasi layar, audio setelah gestur, embed Spotify (login dan tidak login), preview link WhatsApp tanpa spoiler.

---

## 13. Risiko dan mitigasi

| Risiko | Mitigasi |
|---|---|
| Produksi aset memakan waktu | Fallback di setiap slot; situs layak rilis tanpa aset; fase 2 bisa dikirim bertahap |
| Laporan hak cipta pada aset | Utamakan sumber bebas lisensi, catat `SOURCES.md`, siapkan host cadangan, repo dan link tidak dipublikasikan |
| Video api tidak mulus di iOS | Fallback poster + flicker CSS, `muted playsinline`, uji Low Power Mode |
| Animasi berat di HP lama | Batas satu filter beranimasi, uji di HP kelas menengah, mode reduced motion |
| Kunci waktu bisa diakali | Diterima sebagai kunci UX; waktu server mengurangi salah jam perangkat |
| Spotify hanya cuplikan | Catatan halus di UI, catatan pribadi sebagai inti halaman |
| Total aset terlalu berat | `check:budget`, muat per bab, `NEXT_PUBLIC_MEDIA_BASE` untuk storage terpisah |
| Layout page turn rusak dengan konten interaktif | Interface `PageTurner`, mulai dari CSS 3D sederhana |

---

## 14. Lampiran

### 14.1 Microcopy
- Terkunci: "Kisah ini baru bisa dibuka tanggal {tanggal}, jam 00.00 WIB."
- Terbuka: "Sudah waktunya." · Tombol: "Buka buku"
- Lilin: "Tahan lilinnya, lalu buat permohonan." → "Permohonanmu sudah didengar."
- Navigasi: "Balik halaman"
- Album: "Tap foto untuk mencetaknya."
- Musik: "Putar lagu" / "Jeda" · Cuplikan: "Cuplikan 30 detik. Masuk Spotify untuk lagu penuh."
- Kupon: "Tukar" → "Kupon ditukar."
- Penutup: "Bersambung ke tahun berikutnya." · "Baca dari awal"

### 14.2 Checklist konten dari Firas
- [ ] Tanggal ulang tahun, nama panggilan, tanggal jadian, tanggal dan tempat spesial
- [ ] Teks surat (satu momen bersama, satu kebiasaan kecil, satu doa) dan tanda tangan tulisan tangan
- [ ] 18 sampai 30 foto terbaik dengan caption satu kalimat
- [ ] 5 sampai 7 momen timeline
- [ ] 3 sampai 5 lagu (URI Spotify) dengan catatan "kenapa lagu ini"
- [ ] 3 sampai 5 ide kupon, 12 sampai 20 alasan (Fase 3)
- [ ] Klip lilin (3 klip), foto badan lilin, aset yang dicari atau di-generate, semuanya dicatat sumbernya
- [ ] Voice note (opsional)
