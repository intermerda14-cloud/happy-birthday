"use client";
import { useState, useMemo } from "react";
import { site } from "@/content/site";

export function StarsScene() {
  const [activeStar, setActiveStar] = useState<number | null>(null);

  const anniversaryStr = site.anniversaryISO && !site.anniversaryISO.startsWith("TODO")
    ? site.anniversaryISO
    : "2023-10-14";

  const stars = useMemo(() => [
    { x: 20, y: 30, name: "Sirius", desc: "Bintang paling terang, seperti tatapan pertamamu" },
    { x: 45, y: 22, name: "Vega", desc: "Melodi malam yang selalu menenangkan" },
    { x: 75, y: 35, name: "Altair", desc: "Langkah tegar yang selalu menemaniku" },
    { x: 30, y: 65, name: "Polaris", desc: "Bintang utara penuntun arah pulangku" },
    { x: 60, y: 55, name: "Capella", desc: "Tawa hangatmu yang menerangi hariku" },
    { x: 80, y: 75, name: "Spica", desc: "Doa tulus yang selalu kupanjatkan untukmu" },
    { x: 50, y: 80, name: "Rigel", desc: "Kekuatan cinta yang tak pernah padam" },
  ], []);

  return (
    <div
      style={{
        padding: "1.8rem 1.4rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        overflowY: "auto",
        background: "radial-gradient(circle at 50% 30%, #200b2b 0%, #110517 70%, #08020a 100%)",
        color: "var(--champagne)",
        position: "relative",
        borderRadius: "2px",
      }}
    >
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid rgba(201, 162, 94, 0.3)", paddingBottom: "0.4rem", marginBottom: "0.8rem" }}>
          <span style={{ color: "var(--gold)", fontStyle: "italic", fontSize: "0.8rem", letterSpacing: "0.1em" }}>
            Bab VII · Langit Malam Itu
          </span>
          <span style={{ color: "var(--champagne)", fontSize: "0.75rem", fontStyle: "italic", opacity: 0.8 }}>
            {anniversaryStr}
          </span>
        </div>

        <h2
          className="foil"
          style={{
            fontFamily: "var(--serif)",
            fontSize: "1.45rem",
            margin: "0 0 0.4rem",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          Konstelasi Langit Kita
        </h2>
        <p style={{ color: "var(--champagne)", fontSize: "0.82rem", fontStyle: "italic", margin: "0 0 1rem", textAlign: "center", opacity: 0.85 }}>
          Peta bintang tepat di atas koordinat bumi saat takdir mempertemukan kita. Sentuh bintang untuk membaca pesannya.
        </p>

        {/* Peta Bintang Interaktif SVG */}
        <div
          style={{
            width: "100%",
            aspectRatio: "1/1",
            maxHeight: "260px",
            margin: "0 auto",
            position: "relative",
            border: "1px solid rgba(201, 162, 94, 0.4)",
            borderRadius: "50%",
            background: "radial-gradient(circle at 50% 50%, rgba(59, 29, 69, 0.4) 0%, rgba(10, 3, 14, 0.8) 100%)",
            boxShadow: "0 0 30px rgba(201, 162, 94, 0.15), inset 0 0 20px rgba(0,0,0,0.8)",
          }}
        >
          {/* Garis Konstelasi */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            <line x1="20%" y1="30%" x2="45%" y2="22%" stroke="rgba(233, 207, 160, 0.25)" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="45%" y1="22%" x2="75%" y2="35%" stroke="rgba(233, 207, 160, 0.25)" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="45%" y1="22%" x2="60%" y2="55%" stroke="rgba(233, 207, 160, 0.25)" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="30%" y1="65%" x2="60%" y2="55%" stroke="rgba(233, 207, 160, 0.25)" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="60%" y1="55%" x2="50%" y2="80%" stroke="rgba(233, 207, 160, 0.25)" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="60%" y1="55%" x2="80%" y2="75%" stroke="rgba(233, 207, 160, 0.25)" strokeWidth="1" strokeDasharray="3 3" />
          </svg>

          {/* Titik Bintang yang bisa disentuh */}
          {stars.map((star, idx) => {
            const isActive = activeStar === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveStar(idx)}
                aria-label={`Bintang ${star.name}`}
                style={{
                  position: "absolute",
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  transform: "translate(-50%, -50%)",
                  background: "none",
                  border: "none",
                  padding: "6px",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <div
                  style={{
                    width: isActive ? "14px" : "8px",
                    height: isActive ? "14px" : "8px",
                    borderRadius: "50%",
                    background: isActive ? "#ffffff" : "var(--gold)",
                    boxShadow: isActive
                      ? "0 0 16px #fff, 0 0 24px var(--gold)"
                      : "0 0 8px var(--gold)",
                    transition: "all 0.3s ease",
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* Modal Info Bintang Terpilih */}
        <div style={{ marginTop: "0.8rem", minHeight: "65px", textAlign: "center" }}>
          {activeStar !== null ? (
            <div style={{ background: "rgba(42, 18, 48, 0.7)", padding: "0.6rem 0.9rem", borderRadius: "6px", border: "1px solid rgba(201, 162, 94, 0.3)" }}>
              <span style={{ color: "var(--gold)", fontWeight: "bold", fontSize: "0.9rem", display: "block" }}>
                ★ {stars[activeStar].name}
              </span>
              <p style={{ color: "var(--champagne)", fontSize: "0.8rem", fontStyle: "italic", margin: "0.2rem 0 0", lineHeight: 1.4 }}>
                &ldquo;{stars[activeStar].desc}&rdquo;
              </p>
            </div>
          ) : (
            <span style={{ color: "rgba(233, 207, 160, 0.5)", fontSize: "0.75rem", fontStyle: "italic" }}>
              (sentuh titik bintang di atas langit malam)
            </span>
          )}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
        <span style={{ color: "var(--gold)", fontStyle: "italic", fontSize: "0.75rem", opacity: 0.8 }}>
          ~ sejauh apa pun semesta membentang, hatiku selalu padamu ~
        </span>
      </div>
    </div>
  );
}