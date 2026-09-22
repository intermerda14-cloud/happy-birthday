// components/pages/AlbumScene.tsx  (pengganti penuh)
// Menampilkan foto asli dari manifest (assets/manifest.ts). Tanpa file, muncul gradien pengganti.
"use client";
import "./album.css";
import { useState } from "react";
import { album, type Photo } from "@/content/album";
import { getAsset, type AssetId } from "@/assets/manifest";
import { VineCorners } from "@/components/ui/VineCorners";
import { haptic, sfx } from "@/lib/sfx";

interface Item {
  key: string;
  src: string | null;
  caption: string;
  alt: string;
  grad: string;
}

const GRADS = [
  "linear-gradient(160deg,#C58AA0,#E9CFA0)",
  "linear-gradient(160deg,#5A2C66,#D9A0B0)",
  "linear-gradient(160deg,#8A4F7A,#F3D9C4)",
  "linear-gradient(160deg,#3B1D45,#C9A25E)",
];

function srcOf(id: string): string | null {
  const f = getAsset(id as AssetId)?.file;
  if (!f) return null;
  return f.startsWith("/") || f.startsWith("http") ? f : `/media/${f}`;
}

const toItem = (p: Photo, i: number): Item => ({ key: p.assetId, src: srcOf(p.assetId), caption: p.caption, alt: p.alt, grad: GRADS[i % GRADS.length] });
const hideBroken = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.style.display = "none";
};

export function AlbumScene() {
  const [dev, setDev] = useState<Record<string, boolean>>({});
  const [box, setBox] = useState<Item | null>(null);

  const spreads = album.spreads ?? [];
  const scrap = (spreads.find((s) => s.layout === "scrapbook") ?? spreads[0])?.photos.map(toItem) ?? [];
  const full = spreads.find((s) => s.layout === "fullbleed")?.photos.map((p, i) => toItem(p, i + 3)) ?? [];
  const title = (spreads.find((s) => s.layout === "scrapbook") ?? spreads[0])?.title;

  // Ketuk pertama "mencetak" foto, ketuk kedua memperbesar.
  const tap = (it: Item) => {
    if (!dev[it.key]) {
      setDev((d) => ({ ...d, [it.key]: true }));
      sfx("playPageTurn");
      haptic(10);
    } else {
      setBox(it);
    }
  };

  return (
    <div className="paper" style={{ position: "relative", minHeight: "100%", padding: "2.6rem 1.4rem 2rem" }}>
      <div className="paper-frame" />
      <VineCorners />

      <div className="al-wrap">
        <h2 className="al-title">{title && !title.startsWith("TODO") ? title : "Kepingan momen kita"}</h2>
        <p className="al-sub">Ketuk foto untuk mencetaknya, ketuk lagi untuk memperbesar.</p>

        <div className="al-grid">
          {scrap.map((it) => (
            <button key={it.key} type="button" className="al-pol" onClick={() => tap(it)} aria-label={`Foto: ${it.caption}`}>
              <span className={`al-ph ${dev[it.key] ? "dev" : ""}`} style={{ background: it.grad }}>
                {it.src && <img src={it.src} alt={it.alt} loading="lazy" draggable={false} onError={hideBroken} />}
              </span>
              <span className="al-cap">{it.caption}</span>
            </button>
          ))}
        </div>

        {full.map((it) => (
          <button key={it.key} type="button" className="al-feature" onClick={() => setBox(it)} aria-label={`Perbesar foto: ${it.caption}`}>
            <span className="al-kb" style={{ background: it.grad }}>
              {it.src && <img src={it.src} alt={it.alt} loading="lazy" draggable={false} onError={hideBroken} />}
            </span>
            <span className="al-feature-cap">{it.caption}</span>
          </button>
        ))}
      </div>

      {box && (
        <div className="al-box" role="dialog" aria-modal="true" aria-label="Foto diperbesar" data-noswipe onClick={() => setBox(null)}>
          <div className="al-box-in" onClick={(e) => e.stopPropagation()}>
            <div className="al-box-img" style={{ background: box.grad }}>
              {box.src && <img src={box.src} alt={box.alt} onError={hideBroken} />}
            </div>
            <p>{box.caption}</p>
            <button type="button" className="btn" onClick={() => setBox(null)}>
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
