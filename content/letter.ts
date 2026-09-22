export interface Letter {
  paragraphs: string[];
  signature?: string;
  voiceNoteLabel?: string;
}

export const letter: Letter = {
  paragraphs: [
    "Selamat ulang tahun yang ke-20, sayang. Hari ini aku ingin bercerita sedikit tentang betapa berartinya kamu, meski kata-kata rasanya tidak pernah cukup.",
    "Sudah lebih dari satu tahun sejak kita memulai cerita ini, dan sejak itu ada banyak momen kecil yang cuma kita berdua yang mengerti: tawa tanpa alasan, diam yang terasa nyaman, dan tatapan yang tidak perlu dijelaskan. Aku menyimpan semuanya baik-baik, karena bagiku itulah bagian terbaik dari hari-hariku.",
    "Aku bersyukur atas kebiasaan-kebiasaan kecilmu: caramu peduli tanpa banyak bicara, caramu memperhatikan hal yang orang lain lewatkan, dan caramu membuat hari yang berat terasa lebih ringan hanya dengan hadir.",
    "Di usia dua puluh ini, doaku sederhana. Semoga kamu selalu sehat, tenang, dan berani mengejar semua yang kamu impikan. Semoga setiap langkahmu dikelilingi orang-orang baik, dan semoga kamu tidak pernah lupa betapa berharganya dirimu.",
    "Terima kasih sudah menjadi kamu. Apa pun yang terjadi tahun ini, semoga kamu tahu bahwa ada seseorang yang selalu bangga dan bahagia karena mengenalmu.",
  ],
  signature: "Firas",
  voiceNoteLabel: undefined,
};
