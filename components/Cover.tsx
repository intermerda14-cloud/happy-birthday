"use client";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { VineCorners } from "@/components/ui/VineCorners";

interface Props {
  isUnlocked: boolean;
  onOpen: () => void;
}

export function Cover({ isUnlocked, onOpen }: Props) {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
  const [sealBroken, setSealBroken] = useState(false);

  useEffect(() => {
    // Cek target tanggal ulang tahun
    const targetStr = site.birthdayISO && !site.birthdayISO.startsWith("TODO") ? site.birthdayISO : null;

    if (!targetStr) {
      // Jika belum diisi, jangan kunci buku agar bisa ditest/dilihat
      setTimeLeft(null);
      return;
    }

    const targetTime = new Date(`${targetStr}T00:00:00+07:00`).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = targetTime - now;
      if (diff <= 0) {
        setTimeLeft(null);
      } else {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);
        setTimeLeft({ d, h, m, s });
      }
    };

    updateTimer();
    const iv = setInterval(updateTimer, 1000);
    return () => clearInterval(iv);
  }, []);

  const handleSealClick = () => {
    setSealBroken(true);
  };

  const handleOpenClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onOpen();
  };

  const recipientName = site.recipientName && !site.recipientName.startsWith("TODO") ? site.recipientName : "Adelia";

  return (
    <div
      className="cover"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        textAlign: "center",
        padding: "2.5rem 1.4rem 2rem",
        height: "100%",
        position: "relative",
      }}
    >
      <VineCorners />

      <div style={{ width: "100%", position: "relative", zIndex: 12 }}>
        <p
          style={{
            color: "var(--gold)",
            letterSpacing: "0.25em",
            fontSize: "0.75rem",
            textTransform: "uppercase",
            margin: "0 0 1.2rem",
            opacity: 0.95,
          }}
        >
          ✦ sebuah dongeng antik ✦
        </p>
        <h1
          className="foil"
          style={{
            fontSize: "clamp(2.3rem, 9.5vw, 3rem)",
            margin: "0 0 0.6rem",
            fontFamily: "var(--serif)",
            fontWeight: 600,
            lineHeight: 1.15,
          }}
        >
          Kisah {recipientName}
        </h1>
        <p
          style={{
            color: "var(--champagne)",
            fontStyle: "italic",
            maxWidth: "280px",
            margin: "0 auto",
            fontSize: "0.95rem",
            lineHeight: 1.55,
            opacity: 0.9,
          }}
        >
          Sebuah dongeng yang dirajut khusus untuk hari ulang tahunmu.
        </p>
      </div>

      {/* Segel Lilin di Tengah */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", position: "relative", zIndex: 12 }}>
        <button
          type="button"
          onClick={handleSealClick}
          aria-label="Segel lilin buku"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            outline: "none",
            position: "relative",
            transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            touchAction: "manipulation",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.93)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <div
            style={{
              width: "92px",
              height: "92px",
              borderRadius: "50%",
              background: "radial-gradient(circle at 35% 35%, #b32a48, #591024 80%, #2e0510)",
              border: "2px solid rgba(201, 162, 94, 0.7)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.7), inset 0 2px 6px rgba(255,255,255,0.3)",
              display: "grid",
              placeItems: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                border: "1px dashed rgba(233, 207, 160, 0.5)",
                display: "grid",
                placeItems: "center",
                color: "var(--gold)",
                fontFamily: "var(--serif)",
                fontSize: "1.85rem",
                fontStyle: "italic",
                fontWeight: "bold",
                textShadow: "0 2px 5px rgba(0,0,0,0.7)",
              }}
            >
              {sealBroken ? "✓" : recipientName.charAt(0) || "A"}
            </div>
          </div>
        </button>

        {/* Status Kunci jika target tanggal ulang tahun diaktifkan */}
        {!isUnlocked && timeLeft !== null ? (
          <div style={{ background: "rgba(20, 6, 26, 0.75)", padding: "0.7rem 1.3rem", borderRadius: "8px", border: "1px solid rgba(201, 162, 94, 0.35)", backdropFilter: "blur(6px)" }}>
            <p style={{ color: "var(--champagne)", fontSize: "0.8rem", margin: "0 0 0.3rem", fontStyle: "italic" }}>
              Buku ini terkunci hingga 00.00 WIB:
            </p>
            <div style={{ color: "var(--gold)", fontFamily: "monospace", fontSize: "1.15rem", fontWeight: "bold", letterSpacing: "0.1em" }}>
              {timeLeft.d > 0 && `${timeLeft.d}h `}
              {String(timeLeft.h).padStart(2, "0")}:{String(timeLeft.m).padStart(2, "0")}:{String(timeLeft.s).padStart(2, "0")}
            </div>
          </div>
        ) : (
          <p style={{ color: "var(--champagne)", fontSize: "0.85rem", fontStyle: "italic", margin: 0, opacity: 0.9 }}>
            {sealBroken ? "Segel lilin telah pecah ✦" : "Ketuk segel atau tombol di bawah"}
          </p>
        )}
      </div>

      {/* Tombol Buka Buku - Click & Touch Friendly di Android/iOS */}
      <div style={{ width: "100%", position: "relative", zIndex: 100 }}>
        <button
          type="button"
          className="btn"
          onClick={handleOpenClick}
          onTouchEnd={handleOpenClick}
          style={{
            width: "100%",
            maxWidth: "260px",
            fontSize: "1.05rem",
            padding: "0.95rem 1.6rem",
            cursor: "pointer",
            touchAction: "manipulation",
            pointerEvents: "auto",
          }}
        >
          Buka Buku ✦
        </button>
      </div>
    </div>
  );
}