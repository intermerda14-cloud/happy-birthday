// Sumber tunggal semua slot aset (PRD §8.2).

export type AssetKind = "image" | "video" | "audio";

export type FallbackSpec =
  | { kind: "gradient"; from: string; to: string; label?: string }
  | { kind: "candle"; label?: string }
  | { kind: "turntable"; label?: string }
  | { kind: "vinyl"; label?: string }
  | { kind: "none" };

export interface AssetSlot {
  id: string;
  kind: AssetKind;
  file?: string;
  alt: string;
  fallback: FallbackSpec;
}

export type AssetId =
  | "cover.leather"
  | "cover.seal"
  | "scene.night"
  | "scene.dawn"
  | "candle.body"
  | "candle.flameIdle"
  | "candle.flameLean"
  | "candle.flameOut"
  | "candle.poster"
  | "paper.parchment"
  | "paper.tape1"
  | "paper.tape2"
  | "paper.tape3"
  | "paper.flowers1"
  | "paper.flowers2"
  | "paper.flowers3"
  | "paper.flowers4"
  | "letter.signature"
  | "album.photo1"
  | "album.photo2"
  | "album.photo3"
  | "album.photo4"
  | "album.clip1"
  | "album.clip2"
  | "music.turntable"
  | "music.vinyl"
  | "music.tonearm"
  | "jar.image"
  | "jar.sign"
  | "sfx.pageTurn"
  | "sfx.blow"
  | "audio.ambient"
  | "audio.voice";

export const assetsManifest: Record<AssetId, AssetSlot> = {
  "cover.leather": {
    id: "cover.leather",
    kind: "image",
    alt: "TODO: tekstur kulit sampul buku",
    fallback: { kind: "gradient", from: "#2A1230", to: "#3B1D45", label: "Kulit buku" },
  },
  "cover.seal": {
    id: "cover.seal",
    kind: "image",
    alt: "TODO: segel lilin dengan inisial",
    fallback: { kind: "gradient", from: "#8A2B2B", to: "#C92626", label: "Segel lilin" },
  },
  "scene.night": {
    id: "scene.night",
    kind: "image",
    alt: "TODO: lukisan malam berbintang",
    fallback: { kind: "gradient", from: "#1B0F2A", to: "#4B2657", label: "Malam" },
  },
  "scene.dawn": {
    id: "scene.dawn",
    kind: "image",
    alt: "TODO: lukisan fajar hangat",
    fallback: { kind: "gradient", from: "#F39C76", to: "#E9CFA0", label: "Pagi" },
  },
  "candle.body": {
    id: "candle.body",
    kind: "image",
    alt: "TODO: foto badan lilin",
    fallback: { kind: "candle", label: "Lilin" },
  },
  "candle.flameIdle": { id: "candle.flameIdle", kind: "video", alt: "TODO: video api lilin menyala", fallback: { kind: "none" } },
  "candle.flameLean": { id: "candle.flameLean", kind: "video", alt: "TODO: video api miring ditiup", fallback: { kind: "none" } },
  "candle.flameOut": { id: "candle.flameOut", kind: "video", alt: "TODO: video api padam dengan asap", fallback: { kind: "none" } },
  "candle.poster": {
    id: "candle.poster",
    kind: "image",
    alt: "TODO: frame api lilin",
    fallback: { kind: "gradient", from: "#F8D98A", to: "#F0A45E", label: "Api" },
  },
  "paper.parchment": {
    id: "paper.parchment",
    kind: "image",
    alt: "TODO: tekstur kertas perkamen",
    fallback: { kind: "gradient", from: "#F7EAD9", to: "#E6CFB2", label: "Perkamen" },
  },
  "paper.tape1": { id: "paper.tape1", kind: "image", alt: "TODO: isolasi kertas 1", fallback: { kind: "none" } },
  "paper.tape2": { id: "paper.tape2", kind: "image", alt: "TODO: isolasi kertas 2", fallback: { kind: "none" } },
  "paper.tape3": { id: "paper.tape3", kind: "image", alt: "TODO: isolasi kertas 3", fallback: { kind: "none" } },
  "paper.flowers1": { id: "paper.flowers1", kind: "image", alt: "TODO: bunga kering 1", fallback: { kind: "none" } },
  "paper.flowers2": { id: "paper.flowers2", kind: "image", alt: "TODO: bunga kering 2", fallback: { kind: "none" } },
  "paper.flowers3": { id: "paper.flowers3", kind: "image", alt: "TODO: bunga kering 3", fallback: { kind: "none" } },
  "paper.flowers4": { id: "paper.flowers4", kind: "image", alt: "TODO: bunga kering 4", fallback: { kind: "none" } },
  "letter.signature": {
    id: "letter.signature",
    kind: "image",
    alt: "TODO: tanda tangan tulisan tangan",
    fallback: { kind: "gradient", from: "#8A2B2B", to: "#6B2B2B", label: "TTD" },
  },
  "album.photo1": { id: "album.photo1", kind: "image", alt: "TODO: deskripsi foto 1", fallback: { kind: "none" } },
  "album.photo2": { id: "album.photo2", kind: "image", alt: "TODO: deskripsi foto 2", fallback: { kind: "none" } },
  "album.photo3": { id: "album.photo3", kind: "image", alt: "TODO: deskripsi foto 3", fallback: { kind: "none" } },
  "album.photo4": { id: "album.photo4", kind: "image", alt: "TODO: deskripsi foto 4", fallback: { kind: "none" } },
  "album.clip1": { id: "album.clip1", kind: "video", alt: "TODO: deskripsi klip 1", fallback: { kind: "none" } },
  "album.clip2": { id: "album.clip2", kind: "video", alt: "TODO: deskripsi klip 2", fallback: { kind: "none" } },
  "music.turntable": {
    id: "music.turntable",
    kind: "image",
    alt: "TODO: foto meja putar kayu",
    fallback: { kind: "turntable", label: "Meja putar" },
  },
  "music.vinyl": {
    id: "music.vinyl",
    kind: "image",
    alt: "TODO: foto piringan hitam",
    fallback: { kind: "vinyl", label: "Piringan" },
  },
  "music.tonearm": {
    id: "music.tonearm",
    kind: "image",
    alt: "TODO: foto tonearm",
    fallback: { kind: "gradient", from: "#C9A25E", to: "#E9CFA0", label: "Tonearm" },
  },
  "jar.image": {
    id: "jar.image",
    kind: "image",
    alt: "TODO: foto toples kaca",
    fallback: { kind: "gradient", from: "#C9E6D8", to: "#E9CFA0", label: "Toples" },
  },
  "jar.sign": {
    id: "jar.sign",
    kind: "image",
    alt: "TODO: stiker label toples",
    fallback: { kind: "gradient", from: "#E9CFA0", to: "#C9A25E", label: "Label" },
  },
  "sfx.pageTurn": { id: "sfx.pageTurn", kind: "audio", alt: "SUARA: balik halaman", fallback: { kind: "none" } },
  "sfx.blow": { id: "sfx.blow", kind: "audio", alt: "SUARA: tiupan lilin", fallback: { kind: "none" } },
  "audio.ambient": { id: "audio.ambient", kind: "audio", alt: "MUSIK: latar ambient", fallback: { kind: "none" } },
  "audio.voice": { id: "audio.voice", kind: "audio", alt: "MUSIK: voice note", fallback: { kind: "none" } },
};

export function getAsset(id: AssetId): AssetSlot {
  return assetsManifest[id];
}

export function assetExists(id: AssetId): boolean {
  const slot = assetsManifest[id];
  return Boolean(slot && slot.file);
}

export const AUDIO_SLOTS: AssetId[] = ["sfx.pageTurn", "sfx.blow", "audio.ambient", "audio.voice"];