export interface Photo {
  assetId: string;
  caption: string;
  date?: string;
  alt: string;
}

export type SpreadLayout =
  | "scrapbook"
  | "fullbleed"
  | "stringlights"
  | "thennow"
  | "clip";

export interface Spread {
  layout: SpreadLayout;
  photos: Photo[];
  title?: string;
}

export const album: { spreads: Spread[] } = {
  spreads: [
    {
      layout: "scrapbook",
      title: "TODO: judul spread pertama",
      photos: [
        {
          assetId: "album.photo1",
          caption: "Ini Foto pertama kali kita ketemu dan nonton bioskop",
          alt: "TODO: deskripsi isi foto",
        },
        {
          assetId: "album.photo2",
          caption: "kalau ini foto pertama kali kita menikmati dunia ini yang cuma ada kita berdua hihihi",
          alt: "TODO: deskripsi isi foto",
        },
        {
          assetId: "album.photo3",
          caption: "ini aku lagi bobo, paginya kita mamm bubur barengggg",
          alt: "TODO: deskripsi isi foto",
        },
      ],
    },
    {
      layout: "fullbleed",
      photos: [
        {
          assetId: "album.photo4",
          caption: "HAHAHAHAHA FOTO INI LUCUUUUU. HAPPY 20th Birthday Ayaaanggggg.....",
          alt: "TODO: deskripsi isi foto",
        },
      ],
    },
  ],
};