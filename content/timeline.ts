import type { Photo } from "./album";

export interface Milestone {
  date: string; // "YYYY-MM-DD"
  title: string;
  text: string;
  photoId?: string;
}

export interface Timeline {
  title: string;
  intro?: string;
  milestones: Milestone[];
}

export const timeline: Timeline = {
  title: "TODO: judul bab jejak langkah",
  intro: "TODO: satu kalimat pembuka perjalanan",
  milestones: [
    {
      date: "TODO: YYYY-MM-DD",
      title: "TODO: judul momen 1",
      text: "TODO: satu kalimat momen pertama",
      photoId: "album.photo1",
    },
    {
      date: "TODO: YYYY-MM-DD",
      title: "TODO: judul momen 2",
      text: "TODO: satu kalimat momen kedua",
    },
    {
      date: "TODO: YYYY-MM-DD",
      title: "TODO: judul momen 3",
      text: "TODO: satu kalimat momen ketiga",
    },
    {
      date: "TODO: YYYY-MM-DD",
      title: "TODO: judul momen 4",
      text: "TODO: satu kalimat momen keempat",
    },
    {
      date: "TODO: YYYY-MM-DD",
      title: "TODO: judul momen 5",
      text: "TODO: satu kalimat momen kelima",
    },
  ],
};