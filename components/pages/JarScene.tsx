"use client";
import { useState, useMemo } from "react";
import { reasons } from "@/content/reasons";
import { sounds } from "@/components/audio/SoundEngine";

export function JarScene() {
  const [openedReasons, setOpenedReasons] = useState<number[]>([]);
  const [currentReason, setCurrentReason] = useState<string | null>(null);

  const cleanReasons = useMemo(() => {
    return reasons.map((r) => r.replace(/^TODO:\s*/, ""));
  }, []);

  const pickRandom = () => {
    sounds.playChime();
    const unpicked = cleanReasons
      .map((_, i) => i)
      .filter((i) => !openedReasons.includes(i));

    if (unpicked.length === 0) {
      // Semua sudah terambil, reset
      const nextIdx = Math.floor(Math.random() * cleanReasons.length);
      setOpenedReasons([nextIdx]);
      setCurrentReason(cleanReasons[nextIdx]);
      return;
    }

    const randomIdx = unpicked[Math.floor(Math.random() * unpicked.length)];
    setOpenedReasons((prev) => [...prev, randomIdx]);
    setCurrentReason(cleanReasons[randomIdx]);
  };

  const total = cleanReasons.length;
  const count = openedReasons.length;

  return (
    <div
      className="paper"
      style={{
        padding: "1.8rem 1.3rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        overflowY: "auto",
        textAlign: "center",
      }}
    >
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid rgba(185, 139, 74, 0.3)", paddingBottom: "0.4rem", marginBottom: "0.8rem" }}>
          <span style={{ color: "var(--bronze)", fontStyle: "italic", fontSize: "0.8rem", letterSpacing: "0.1em" }}>
            Bab VIII · Toples Alasan
          </span>
          <span style={{ color: "var(--bronze)", fontSize: "0.75rem", fontStyle: "italic" }}>
            {count} / {total} terambil
          </span>
        </div>

        <h2
          style={{
            fontFamily: "var(--serif)",
            color: "var(--ink)",
            fontSize: "1.4rem",
            margin: "0 0 0.4rem",
            fontWeight: 600,
          }}
        >
          Toples Berisi Alasan
        </h2>
        <p style={{ color: "var(--ink)", fontSize: "0.82rem", fontStyle: "italic", margin: "0 0 1rem", opacity: 0.85 }}>
          Ketuk toples untuk mengambil satu gulungan kertas yang menjelaskan kenapa aku begitu bersyukur memilikimu.
        </p>

        {/* Toples Kaca Ilustrasi Interaktif */}
        <div style={{ display: "flex", justifyContent: "center", margin: "0.6rem 0" }}>
          <button
            type="button"
            onClick={pickRandom}
            aria-label="Ambil gulungan alasan"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem",
              outline: "none",
              transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.92)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div
              style={{
                width: "120px",
                height: "160px",
                borderRadius: "14px 14px 24px 24px",
                background: "linear-gradient(135deg, rgba(201, 230, 216, 0.4) 0%, rgba(255, 255, 255, 0.6) 40%, rgba(201, 230, 216, 0.25) 100%)",
                border: "2px solid rgba(185, 139, 74, 0.6)",
                boxShadow: "0 10px 24px rgba(58, 29, 63, 0.2), inset 0 2px 10px rgba(255,255,255,0.7)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 10px 14px",
                position: "relative",
              }}
            >
              {/* Tutup Toples Gabus */}
              <div
                style={{
                  width: "74px",
                  height: "16px",
                  background: "linear-gradient(to right, #8a5a2b, #c9a25e, #8a5a2b)",
                  borderRadius: "4px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  marginTop: "-14px",
                }}
              />

              {/* Gulungan-gulungan kertas di dalam toples */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", justifyContent: "center", padding: "10px 0" }}>
                {Array.from({ length: 9 }).map((_, i) => (
                  <span
                    key={i}
                    style={{
                      display: "inline-block",
                      width: "24px",
                      height: "8px",
                      borderRadius: "3px",
                      background: i % 2 === 0 ? "var(--champagne)" : "var(--rose)",
                      transform: `rotate(${(i * 35) % 90 - 45}deg)`,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                    }}
                  />
                ))}
              </div>

              {/* Label Toples */}
              <div
                style={{
                  background: "var(--paper)",
                  border: "1px dashed var(--bronze)",
                  padding: "2px 8px",
                  borderRadius: "2px",
                  fontSize: "0.7rem",
                  color: "var(--ink)",
                  fontFamily: "var(--serif)",
                  fontStyle: "italic",
                }}
              >
                ✦ Ambil Satu ✦
              </div>
            </div>
          </button>
        </div>

        {/* Gulungan Kertas yang Terbuka */}
        {currentReason && (
          <div
            style={{
              background: "linear-gradient(135deg, #fffdfa 0%, #f7ead9 100%)",
              border: "1px solid var(--gold)",
              borderRadius: "6px",
              padding: "1rem 1.2rem",
              marginTop: "0.8rem",
              boxShadow: "0 6px 18px rgba(58, 29, 63, 0.15)",
              animation: "unroll 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
            }}
          >
            <span style={{ color: "var(--bronze)", fontSize: "0.75rem", fontStyle: "italic", display: "block", marginBottom: "0.3rem" }}>
              Gulungan #{count}:
            </span>
            <p style={{ color: "var(--ink)", fontFamily: "var(--serif)", fontSize: "0.95rem", fontStyle: "italic", margin: 0, lineHeight: 1.5 }}>
              &ldquo;{currentReason}&rdquo;
            </p>
          </div>
        )}
      </div>

      <div style={{ marginTop: "1rem" }}>
        <span style={{ color: "var(--bronze)", fontStyle: "italic", fontSize: "0.8rem" }}>
          ~ seribu alasan pun takkan cukup untuk merangkummu ~
        </span>
      </div>

      <style jsx>{`
        @keyframes unroll {
          0% {
            opacity: 0;
            transform: scaleY(0.4) scaleX(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}