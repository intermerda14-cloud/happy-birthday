"use client";
import { useState } from "react";
import { tracks } from "@/content/tracks";
import { sounds } from "@/components/audio/SoundEngine";
import { VineCorners } from "@/components/ui/VineCorners";

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

  const trackIdMatch = current.uri.match(/track[:/]([a-zA-Z0-9]+)/);
  const spotifyTrackId = trackIdMatch ? trackIdMatch[1] : "08mG3Y1vljYA6bvDt4Wqkj";

  const togglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    sounds.duckAmbient(nextState);
  };

  return (
    <div
      className="paper"
      style={{
        padding: "2rem 1.4rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        overflowY: "auto",
        textAlign: "center",
        position: "relative",
      }}
    >
      <div className="paper-frame" />
      <VineCorners />

      <div style={{ position: "relative", zIndex: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid rgba(185, 139, 74, 0.35)", paddingBottom: "0.4rem", marginBottom: "0.8rem" }}>
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
            fontSize: "1.45rem",
            margin: "0 0 0.8rem",
            fontWeight: 600,
          }}
        >
          Piringan Nada Favorit
        </h2>

        {/* Meja Putar & Piringan Hitam dengan Efek Bayangan Mendalam */}
        <div style={{ display: "flex", justifyContent: "center", margin: "0.6rem 0" }}>
          <div
            onClick={togglePlay}
            style={{
              width: "135px",
              height: "135px",
              borderRadius: "50%",
              background: "radial-gradient(circle, #2c3e50 0%, #1a252f 40%, #000000 70%, #111 100%)",
              border: "3px solid var(--gold)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.45), inset 0 0 10px rgba(201,162,94,0.3)",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              animation: isPlaying ? "spin 5s linear infinite" : "none",
              position: "relative",
            }}
          >
            {/* Label Tengah Vinyl */}
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "50%",
                background: "radial-gradient(circle, var(--champagne), var(--gold))",
                border: "2px solid #fff",
                display: "grid",
                placeItems: "center",
                fontSize: "0.9rem",
                boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              }}
            >
              {isPlaying ? "❚❚" : "▶"}
            </div>
          </div>
        </div>

        {/* Informasi & Catatan Pribadi */}
        <div style={{ margin: "0.6rem 0" }}>
          <h3 style={{ fontFamily: "var(--serif)", color: "var(--ink)", fontSize: "1.15rem", margin: "0 0 0.2rem", fontWeight: 600 }}>
            {current.title || "Lagu Kenangan"}
          </h3>
          <p style={{ color: "var(--bronze)", fontSize: "0.82rem", fontStyle: "italic", margin: "0 0 0.6rem" }}>
            {current.artist || "Penyanyi Favorit"}
          </p>
          <div style={{ background: "rgba(217, 160, 176, 0.22)", padding: "0.75rem", borderRadius: "4px", borderLeft: "3px solid var(--rose)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <p style={{ color: "var(--ink)", fontSize: "0.85rem", fontStyle: "italic", margin: 0, lineHeight: 1.5 }}>
              &ldquo;{current.note || "Setiap kali mendengarkan melodi ini, selalu ada senyummu yang terlintas di ingatan."}&rdquo;
            </p>
          </div>
        </div>

        {/* Spotify Embed Player Kompak */}
        <div style={{ margin: "0.8rem 0", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 14px rgba(0,0,0,0.15)" }}>
          <iframe
            src={`https://open.spotify.com/embed/track/${spotifyTrackId}?utm_source=generator&theme=0`}
            width="100%"
            height="80"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Spotify Embed Player"
          />
        </div>

        {/* Pilihan Track Sleeve */}
        <div style={{ display: "flex", justifyContent: "center", gap: "0.4rem", marginTop: "0.4rem" }}>
          {cleanTracks.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setActiveIdx(i);
                setIsPlaying(true);
                sounds.duckAmbient(true);
              }}
              style={{
                padding: "0.3rem 0.75rem",
                borderRadius: "14px",
                border: "1px solid var(--gold)",
                background: activeIdx === i ? "var(--ink)" : "transparent",
                color: activeIdx === i ? "var(--champagne)" : "var(--ink)",
                fontSize: "0.72rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Lagu {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "0.5rem", position: "relative", zIndex: 12 }}>
        <span style={{ color: "var(--bronze)", fontStyle: "italic", fontSize: "0.75rem" }}>
          {isPlaying ? "♪ Melodi berputar... (Audio latar diredupkan)" : "Ketuk piringan hitam atau putar lagu di Spotify"}
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