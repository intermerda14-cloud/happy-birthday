"use client";
import { useState } from "react";
import { tracks } from "@/content/tracks";

export function MusicScene() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const cleanTracks = tracks.map((t) => ({
    title: t.title.replace(/^TODO:\s*/, ""),
    artist: t.artist.replace(/^TODO:\s*/, ""),
    note: t.note.replace(/^TODO:\s*/, ""),
    uri: t.spotifyUri.replace(/^TODO:\s*/, ""),
  }));

  const current = cleanTracks[activeIdx] || cleanTracks[0];

  return (
    <div
      className="paper"
      style={{
        padding: "1.8rem 1.4rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        overflowY: "auto",
        textAlign: "center",
      }}
    >
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid rgba(185, 139, 74, 0.3)", paddingBottom: "0.4rem", marginBottom: "1rem" }}>
          <span style={{ color: "var(--bronze)", fontStyle: "italic", fontSize: "0.8rem", letterSpacing: "0.1em" }}>
            Bab V · Lagu Kita
          </span>
          <span style={{ color: "var(--bronze)", fontSize: "0.75rem", fontStyle: "italic" }}>
            Melodi & Makna
          </span>
        </div>

        <h2
          style={{
            fontFamily: "var(--serif)",
            color: "var(--ink)",
            fontSize: "1.4rem",
            margin: "0 0 1rem",
            fontWeight: 600,
          }}
        >
          Piringan Nada Favorit
        </h2>

        {/* Vinyl Player Animasi */}
        <div style={{ display: "flex", justifyContent: "center", margin: "1rem 0" }}>
          <div
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              width: "140px",
              height: "140px",
              borderRadius: "50%",
              background: "radial-gradient(circle, #2c3e50 0%, #1a252f 40%, #000000 70%, #111 100%)",
              border: "3px solid var(--gold)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              animation: isPlaying ? "spin 6s linear infinite" : "none",
              position: "relative",
            }}
          >
            {/* Label Piringan Hitam */}
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "radial-gradient(circle, var(--champagne), var(--gold))",
                border: "2px solid #fff",
                display: "grid",
                placeItems: "center",
                fontSize: "0.9rem",
              }}
            >
              {isPlaying ? "❚❚" : "▶"}
            </div>
          </div>
        </div>

        {/* Informasi Lagu Aktif */}
        <div style={{ margin: "0.8rem 0" }}>
          <h3 style={{ fontFamily: "var(--serif)", color: "var(--ink)", fontSize: "1.15rem", margin: "0 0 0.2rem", fontWeight: 600 }}>
            {current.title || "Lagu Kenangan"}
          </h3>
          <p style={{ color: "var(--bronze)", fontSize: "0.85rem", fontStyle: "italic", margin: "0 0 0.8rem" }}>
            {current.artist || "Penyanyi Favoritmu"}
          </p>
          <div style={{ background: "rgba(217, 160, 176, 0.2)", padding: "0.8rem", borderRadius: "4px", borderLeft: "3px solid var(--rose)" }}>
            <p style={{ color: "var(--ink)", fontSize: "0.88rem", fontStyle: "italic", margin: 0, lineHeight: 1.5 }}>
              &ldquo;{current.note || "Setiap kali mendengarkan melodi ini, selalu ada senyummu yang terlintas."}&rdquo;
            </p>
          </div>
        </div>

        {/* Pilihan Sleeve Lagu Lain */}
        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1rem" }}>
          {cleanTracks.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setActiveIdx(i);
                setIsPlaying(true);
              }}
              style={{
                padding: "0.3rem 0.8rem",
                borderRadius: "14px",
                border: "1px solid var(--gold)",
                background: activeIdx === i ? "var(--ink)" : "transparent",
                color: activeIdx === i ? "var(--champagne)" : "var(--ink)",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Track {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <span style={{ color: "var(--bronze)", fontStyle: "italic", fontSize: "0.8rem" }}>
          {isPlaying ? "♪ Musik sedang berputar..." : "Ketuk piringan hitam untuk memutar"}
        </span>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}