// content/openwhen.ts
// Surat "Buka saat...". Isi bisa diganti kapan saja.
// lockNextBirthday: terkunci sampai ulang tahun berikutnya (dihitung dari site.birthdayISO + 1 tahun).
// lockUntilISO (YYYY-MM-DD, WIB): alternatif untuk mengunci sampai tanggal tertentu.
export interface OpenWhen {
  id: string;
  title: string;
  text: string;
  lockUntilISO?: string;
  lockNextBirthday?: boolean;
}

export const openWhen: OpenWhen[] = [
  {
    id: "rindu",
    title: "saat kamu rindu",
    text: "Kalau rindu datang, biarkan saja ia tinggal sebentar. Itu tandanya ada sesuatu yang berharga di antara kita. Kirim pesan kapan pun kamu mau, aku selalu senang membacanya. Dan ingat satu hal kecil yang bikin kamu tersenyum karena aku, lalu genggam erat-erat.",
  },
  {
    id: "sedih",
    title: "saat kamu sedih",
    text: "Kalau hari ini terasa berat, kamu tidak harus kuat sendirian. Duduklah sebentar, minum yang hangat, dan tarik napas pelan-pelan. Perasaan ini akan lewat. Kamu sudah melewati banyak hari sulit sebelumnya, dan kamu masih di sini. Aku bangga padamu, dan aku ada di sisimu.",
  },
  {
    id: "susah-tidur",
    title: "saat kamu tidak bisa tidur",
    text: "Belum bisa tidur? Lepaskan pikiranmu satu per satu, seperti melepas balon ke langit malam. Ingat tiga hal baik dari hari ini, sekecil apa pun. Semoga mimpimu hangat dan besok pagi terasa lebih ringan. Selamat malam, sayang.",
  },
  {
    id: "tahun-depan",
    title: "saat ulang tahun berikutnya",
    text: "Kalau kamu membaca ini, berarti satu tahun lagi sudah berlalu. Selamat ulang tahun yang ke-21! Terima kasih sudah tumbuh, bertahan, dan bahagia. Semoga tahun ini baik padamu, dan semoga kamu masih sempat tersenyum membaca surat ini.",
    lockNextBirthday: true,
  },
];
