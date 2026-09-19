export interface Track {
  spotifyUri: string; // mis. "spotify:track:08mG3Y1vljYA6bvDt4Wqkj"
  title: string;
  artist: string;
  note: string; // catatan pribadi: kenapa lagu ini
  date?: string; // "YYYY-MM-DD" opsional
}

export const tracks: Track[] = [
  {
    spotifyUri: "TODO: spotify:track:… (URI lagu 1)",
    title: "TODO: judul lagu 1",
    artist: "TODO: artis lagu 1",
    note: "TODO: kenapa lagu ini — sekalimat",
    date: "TODO: YYYY-MM-DD",
  },
  {
    spotifyUri: "TODO: spotify:track:… (URI lagu 2)",
    title: "TODO: judul lagu 2",
    artist: "TODO: artis lagu 2",
    note: "TODO: kenapa lagu ini — sekalimat",
  },
  {
    spotifyUri: "TODO: spotify:track:… (URI lagu 3)",
    title: "TODO: judul lagu 3",
    artist: "TODO: artis lagu 3",
    note: "TODO: kenapa lagu ini — sekalimat",
  },
];