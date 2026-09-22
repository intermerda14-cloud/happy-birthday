export interface Site {
  recipientName: string;
  senderName: string;
  /** "YYYY-MM-DD" waktu WIB */
  birthdayISO: string;
  nextBirthdayISO?: string;
  anniversaryISO?: string;
  /** Rahasia untuk param ?preview= */
  previewKey: string;
  unlockHourWIB: 0;
}

export const site: Site = {
  recipientName: "TODO: nama panggilan Adelia",
  senderName: "TODO: nama pengirim",
  birthdayISO: "2026-09-23",
  nextBirthdayISO: "2027-09-23",
  anniversaryISO: "2025-05-18",
  previewKey: "TODO: kunci-untuk-preview",
  unlockHourWIB: 0,
};

export const siteBirthdayLabel = site.birthdayISO.startsWith("TODO")
  ? "hari ulang tahunmu"
  : site.birthdayISO;