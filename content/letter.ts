export interface Letter {
  paragraphs: string[];
  signature?: string;
  voiceNoteLabel?: string;
}

export const letter: Letter = {
  paragraphs: [
    "TODO: Paragraf 1 — satu momen yang cuma kalian berdua yang mengerti. Tulis apa adanya, yang paling jujur.",
    "TODO: Paragraf 2 — satu kebiasaan kecil darinya yang bikin kamu bersyukur.",
    "TODO: Paragraf 3 — satu doa untuk setahun ke depan.",
  ],
  signature: "TODO: nama pengirim",
  voiceNoteLabel: undefined,
};