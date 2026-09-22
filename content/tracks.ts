export interface Track {
  spotifyUri: string;
  title: string;
  artist: string;
  note: string;
  date?: string;
}

export const tracks: Track[] = [
  {
    spotifyUri: "spotify:track:4ecdsGz3Hg6TKPwQ0ZOdJz",
    title: "Fashion",
    artist: "Martin Cortis",
    note: "Lagu ini selalu mengingatkanku padamu, aku sering denger lagu ini ketika lagi bareng hehehe.",
  },
  {
    spotifyUri: "spotify:track:0NGFAcYQVHCIdQea2qSs1I",
    title: "Lemon Tang",
    artist: "H2H",
    note: "Kalau lagu ini bikin aku inget pas kamu main ke bogor dan liat ekspresi seneng kamu :)))",
  },
  {
    spotifyUri: "spotify:track:7gs9RkSDLE4pnqzc3H1hjc",
    title: "Separuhku",
    artist: "Nano",
    note: "lagu ini random ke-setel pas aku pulang dari tangerang pertama kali dan sampe sekarang aku masih suka denger lagu ini karna berkesan mwehehe",
  },
];
