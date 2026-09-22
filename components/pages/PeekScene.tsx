// components/pages/PeekScene.tsx
// Halaman klimaks setelah album: foto ditutup tirai kain, tersibak saat disentuh,
// disambut ledakan balon + confetti + badge "20" yang lalu mereda menyisakan foto & caption.
"use client";
import "./peek.css";
import { useEffect, useState } from "react";
import { album } from "@/content/album";
import { getAsset, type AssetId } from "@/assets/manifest";
import { VineCorners } from "@/components/ui/VineCorners";
import { haptic } from "@/lib/sfx";
import { sounds } from "@/components/audio/SoundEngine";

function srcOf(id: string): string | null {
  const f = getAsset(id as AssetId)?.file;
  if (!f) return null;
  return f.startsWith("/") || f.startsWith("http") ? f : `/media/${f}`;
}

const BALLOON_COLORS = ["#D9A0B0", "#C9A25E", "#8A4F7A", "#E9CFA0", "#5A2C66", "#F3D9C4"];
const BALLOONS = Array.from({ length: 10 }, (_, i) => i);
const CONFETTI = Array.from({ length: 16 }, (_, i) => i);

const DOR_SRC = "/media/audio/dor.mp3";

export function PeekScene() {
  const [revealed, setRevealed] = useState(false);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    sounds.preloadFile(DOR_SRC);
  }, []);

  const spread = album.spreads.find((s) => s.layout === "fullbleed");
  const photo = spread?.photos[0];
  const src = photo ? srcOf(photo.assetId) : null;
  const caption = photo?.caption ?? "";
  const alt = photo?.alt ?? "";

  const reveal = () => {
    if (revealed) return;
    setRevealed(true);
    sounds.playFile(DOR_SRC, 4);
    haptic(18);
    // Setelah pesta mereda, sembunyikan elemen dekoratif dari DOM sepenuhnya
    // (bukan cuma opacity 0) supaya tidak ada elemen tak terlihat yang tetap
    // memakan layout/animasi di background selamanya.
    window.setTimeout(() => setSettled(true), 3400);
  };

  return (
    <div className="paper" style={{ position: "relative", minHeight: "100%", padding: "2.6rem 1.4rem 2rem", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div className="paper-frame" />
      <VineCorners />

      {revealed && !settled && (
        <div className="pk-party" aria-hidden="true">
          {BALLOONS.map((i) => (
            <span
              key={`b${i}`}
              className="pk-balloon"
              style={{
                left: `${6 + i * 9.5}%`,
                background: BALLOON_COLORS[i % BALLOON_COLORS.length],
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
          {CONFETTI.map((i) => (
            <span
              key={`c${i}`}
              className="pk-confetti"
              style={{
                left: `${(i * 6.3) % 100}%`,
                background: BALLOON_COLORS[i % BALLOON_COLORS.length],
                animationDelay: `${i * 0.03}s`,
                transform: `rotate(${(i * 47) % 360}deg)`,
              }}
            />
          ))}
        </div>
      )}

      <div className="pk-wrap">
        <span className="pk-eyebrow" aria-hidden="true">
          &#x2727; &#x2727; &#x2727;
        </span>

        <div className={`pk-stage ${revealed ? "pk-open" : ""}`}>
          <span className="pk-tape pk-tape-l" aria-hidden="true" />
          <span className="pk-tape pk-tape-r" aria-hidden="true" />

          {revealed && !settled && (
            <span className="pk-badge" aria-hidden="true">
              20
            </span>
          )}

          <button
            type="button"
            className="pk-frame"
            onClick={reveal}
            aria-label={revealed ? alt || "Foto kenangan" : "Ketuk untuk membuka foto"}
          >
            <span className="pk-photo">{src && <img src={src} alt={alt} draggable={false} />}</span>

            <span className="pk-curtain pk-left" aria-hidden="true" />
            <span className="pk-curtain pk-right" aria-hidden="true" />

            {!revealed && (
              <span className="pk-hint" aria-hidden="true">
                &#x1F441;
              </span>
            )}
          </button>

          <span className="pk-corner pk-corner-tl" aria-hidden="true" />
          <span className="pk-corner pk-corner-tr" aria-hidden="true" />
          <span className="pk-corner pk-corner-bl" aria-hidden="true" />
          <span className="pk-corner pk-corner-br" aria-hidden="true" />
        </div>

        <p className={`pk-cap ${revealed ? "pk-cap-show" : ""}`}>{caption}</p>
      </div>
    </div>
  );
}
