"use client";
import { useState } from "react";
import { album } from "@/content/album";
import { sounds } from "@/components/audio/SoundEngine";
import { VineCorners } from "@/components/ui/VineCorners";

export function AlbumScene() {
  const [developed, setDeveloped] = useState<Record<number, boolean>>({});
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const toggleDevelop = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playPageTurn();
    setDeveloped((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const spreads = album.spreads || [];
  const firstSpread = spreads[0] || { photos: [] };

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
        position: "relative",
      }}
    >
      <div className="paper-frame" />
      <VineCorners />

      <div style={{ position: "relative", zIndex: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid rgba(185, 139, 74, 0.35)", paddingBottom: "0.4rem", marginBottom: "1rem" }}>
          <span style={{ color: "var(--bronze)", fontStyle: "italic", fontSize: "0.8rem", letterSpacing: "0.1em" }}>
            Bab III · Kenangan
          </span>
          <span style={{ color: "var(--bronze)", fontSize: "0.75rem", fontStyle: "italic" }}>
            Sentuh foto untuk mencetak / perbesar
          </span>
        </div>

        <h2
          style={{
            fontFamily: "var(--serif)",
            color: "var(--ink)",
            fontSize: "1.45rem",
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
            const rot = i % 2 === 0 ? "-2.5deg" : "2.5deg";
            const caption = photo.caption.replace(/^TODO:\s*/, "");

            return (
              <div
                key={i}
                onClick={(e) => {
                  if (!isDev) {
                    toggleDevelop(i, e);
                  } else {
                    openLightbox(i);
                  }
                }}
                style={{
                  background: "#ffffff",
                  padding: "8px 8px 12px",
                  boxShadow: "0 6px 18px rgba(58, 29, 63, 0.22)",
                  borderRadius: "2px",
                  transform: `rotate(${rot})`,
                  cursor: "pointer",
                  transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease",
                  position: "relative",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "rotate(0deg) scale(1.04)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = `rotate(${rot}) scale(1)`)}
              >
                {/* Washi tape dekoratif di atas */}
                <div
                  style={{
                    position: "absolute",
                    top: "-8px",
                    left: "30%",
                    width: "42px",
                    height: "14px",
                    background: "rgba(217, 160, 176, 0.8)",
                    transform: "rotate(-3deg)",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
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
                    filter: isDev ? "none" : "blur(2.5px) sepia(0.85)",
                    transition: "filter 0.8s ease, background 0.8s ease",
                  }}
                >
                  <span style={{ color: isDev ? "#2c3e50" : "var(--champagne)", fontSize: "0.75rem", fontStyle: "italic" }}>
                    {isDev ? "🔍 Ketuk perbesar" : "✦ Sentuh untuk cetak"}
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

      <div style={{ textAlign: "center", marginTop: "1rem", position: "relative", zIndex: 12 }}>
        <span style={{ color: "var(--bronze)", fontStyle: "italic", fontSize: "0.8rem" }}>
          ~ setiap detik bersamamu adalah cerita ~
        </span>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          onClick={closeLightbox}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            background: "rgba(18, 6, 23, 0.94)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem 1.5rem",
            backdropFilter: "blur(8px)",
            animation: "fade 0.3s ease",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              padding: "1rem 1rem 1.5rem",
              borderRadius: "4px",
              maxWidth: "320px",
              width: "100%",
              boxShadow: "0 12px 45px rgba(0,0,0,0.85)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                aspectRatio: "4/5",
                background: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
                borderRadius: "2px",
                display: "grid",
                placeItems: "center",
                color: "#2c3e50",
                fontStyle: "italic",
              }}
            >
              📸 Kenangan Abadi #{lightboxIndex + 1}
            </div>
            <p style={{ fontFamily: "var(--serif)", color: "var(--ink)", fontStyle: "italic", margin: "1rem 0 0.5rem", fontSize: "0.95rem" }}>
              {firstSpread.photos[lightboxIndex]?.caption.replace(/^TODO:\s*/, "") || "Momen indah yang takkan terlupakan"}
            </p>
            <button
              type="button"
              onClick={closeLightbox}
              className="btn"
              style={{ padding: "0.4rem 1.2rem", fontSize: "0.85rem", marginTop: "0.5rem" }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}