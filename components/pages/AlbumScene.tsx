"use client";
import { useState } from "react";
import { album } from "@/content/album";

export function AlbumScene() {
  const [developed, setDeveloped] = useState<Record<number, boolean>>({});

  const toggleDevelop = (idx: number) => {
    setDeveloped((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const spreads = album.spreads || [];
  const firstSpread = spreads[0] || { photos: [] };

  return (
    <div
      className="paper"
      style={{
        padding: "1.8rem 1.2rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        overflowY: "auto",
      }}
    >
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid rgba(185, 139, 74, 0.3)", paddingBottom: "0.4rem", marginBottom: "1rem" }}>
          <span style={{ color: "var(--bronze)", fontStyle: "italic", fontSize: "0.8rem", letterSpacing: "0.1em" }}>
            Bab III · Kenangan
          </span>
          <span style={{ color: "var(--bronze)", fontSize: "0.75rem", fontStyle: "italic" }}>
            Sentuh foto untuk mencetak
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
          Kepingan Momen Indah
        </h2>

        {/* Grid Polaroid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "0.5rem" }}>
          {firstSpread.photos.map((photo, i) => {
            const isDev = developed[i];
            const rot = i % 2 === 0 ? "-2deg" : "2.5deg";
            const caption = photo.caption.replace(/^TODO:\s*/, "");

            return (
              <div
                key={i}
                onClick={() => toggleDevelop(i)}
                style={{
                  background: "#ffffff",
                  padding: "8px 8px 12px",
                  boxShadow: "0 4px 14px rgba(58, 29, 63, 0.18)",
                  borderRadius: "2px",
                  transform: `rotate(${rot})`,
                  cursor: "pointer",
                  transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease",
                  position: "relative",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "rotate(0deg) scale(1.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = `rotate(${rot}) scale(1)`)}
              >
                {/* Washi tape dekoratif di atas */}
                <div
                  style={{
                    position: "absolute",
                    top: "-8px",
                    left: "30%",
                    width: "40px",
                    height: "14px",
                    background: "rgba(217, 160, 176, 0.75)",
                    transform: "rotate(-3deg)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                />

                {/* Frame Foto */}
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "4/5",
                    background: isDev
                      ? "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)"
                      : "linear-gradient(135deg, #593144 0%, #3a1d3f 100%)",
                    display: "grid",
                    placeItems: "center",
                    padding: "0.5rem",
                    textAlign: "center",
                    filter: isDev ? "none" : "blur(2px) sepia(0.8)",
                    transition: "filter 0.8s ease, background 0.8s ease",
                  }}
                >
                  <span style={{ color: isDev ? "#2c3e50" : "var(--champagne)", fontSize: "0.75rem", fontStyle: "italic" }}>
                    {isDev ? "📸 Kenangan Terabadikan" : "✦ Ketuk untuk melihat"}
                  </span>
                </div>

                {/* Caption Polaroid */}
                <p
                  style={{
                    fontFamily: "var(--serif)",
                    fontStyle: "italic",
                    fontSize: "0.75rem",
                    color: "var(--ink)",
                    margin: "6px 0 0",
                    lineHeight: 1.3,
                    textAlign: "center",
                  }}
                >
                  {caption || `Momen spesial #${i + 1}`}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <span style={{ color: "var(--bronze)", fontStyle: "italic", fontSize: "0.8rem" }}>
          ~ setiap detik bersamamu adalah cerita ~
        </span>
      </div>
    </div>
  );
}