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
          caption: "TODO: caption satu kalimat",
          alt: "TODO: deskripsi isi foto",
        },
        {
          assetId: "album.photo2",
          caption: "TODO: caption satu kalimat",
          alt: "TODO: deskripsi isi foto",
        },
        {
          assetId: "album.photo3",
          caption: "TODO: caption satu kalimat",
          alt: "TODO: deskripsi isi foto",
        },
      ],
    },
    {
      layout: "fullbleed",
      photos: [
        {
          assetId: "album.photo4",
          caption: "TODO: caption satu kalimat",
          alt: "TODO: deskripsi isi foto",
        },
      ],
    },
  ],
};