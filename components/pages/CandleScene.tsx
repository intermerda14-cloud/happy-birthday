"use client";
import { useState, useRef, useEffect } from "react";

interface Props {
  blown: boolean;
  onBlow: () => void;
}

export function CandleScene({ blown, onBlow }: Props) {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startHold = () => {
    if (blown) return;
    setHolding(true);
    const start = Date.now();
    const duration = 1500; // 1.5 detik tahan

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, (elapsed / duration) * 100);
      setProgress(p);

      if (elapsed >= duration) {
        if (timerRef.current) clearInterval(timerRef.current);
        setHolding(false);
        setProgress(100);
        onBlow();
      }
    }, 30);
  };

  const endHold = () => {
    if (blown) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setHolding(false);
    setProgress(0);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "2rem 1.5rem",
        textAlign: "center",
        transition: "background 2.4s cubic-bezier(0.22, 0.61, 0.36, 1)",
        background: blown
          ? "radial-gradient(circle at 50% 40%, #f7dfcb 0%, #f1cbba 50%, #e2b1a0 100%)"
          : "radial-gradient(circle at 50% 35%, #3b1d45 0%, #1e0b26 65%, #120617 100%)",
        borderRadius: "2px",
        overflow: "hidden",
      }}
    >
      {/* Header Bab 1 */}
      <div>
        <span
          style={{
            color: blown ? "var(--bronze)" : "var(--gold)",
            letterSpacing: "0.15em",
            fontSize: "0.8rem",
            textTransform: "uppercase",
            fontStyle: "italic",
          }}
        >
          Bab I
        </span>
        <h2
          className={blown ? "" : "foil"}
          style={{
            fontFamily: "var(--serif)",
            color: blown ? "var(--ink)" : "var(--champagne)",
            fontSize: "1.7rem",
            margin: "0.4rem 0 0.5rem",
            fontWeight: 600,
          }}
        >
          {blown ? "Permohonanmu Didengar" : "Lilin di Malam Hari"}
        </h2>
        <p
          style={{
            color: blown ? "var(--ink)" : "var(--champagne)",
            fontSize: "0.9rem",
            fontStyle: "italic",
            margin: 0,
            opacity: 0.85,
            maxWidth: "280px",
          }}
        >
          {blown
            ? "Malam berganti fajar hangat. Semoga semua harapan baikmu bersemi."
            : "Tahan lilinnya selama 1.5 detik, lalu buat permohonan dalam hati."}
        </p>
      </div>

      {/* Objek Lilin Interaktif */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          margin: "1.5rem 0",
        }}
      >
        {/* Lingkaran Progress Hold */}
        {holding && (
          <div
            style={{
              position: "absolute",
              top: "-25px",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              border: "2px solid rgba(233, 207, 160, 0.3)",
              borderTopColor: "var(--gold)",
              transform: `rotate(${progress * 3.6}deg)`,
              pointerEvents: "none",
            }}
          />
        )}

        {/* Tombol Lilin */}
        <button
          type="button"
          onPointerDown={startHold}
          onPointerUp={endHold}
          onPointerLeave={endHold}
          aria-label="Tahan lilin untuk meniup"
          style={{
            background: "none",
            border: "none",
            padding: "1rem",
            cursor: blown ? "default" : "pointer",
            outline: "none",
            touchAction: "none",
            userSelect: "none",
            WebkitUserSelect: "none",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* Api Lilin */}
            {!blown ? (
              <div
                style={{
                  width: "24px",
                  height: "44px",
                  background: "radial-gradient(ellipse at 50% 80%, #ffffff 0%, #ffeaa7 30%, #f39c12 70%, #d35400 100%)",
                  borderRadius: "50% 50% 35% 35% / 60% 60% 40% 40%",
                  boxShadow: "0 0 28px rgba(243, 156, 18, 0.8), 0 0 50px rgba(241, 196, 15, 0.5)",
                  transform: holding ? "rotate(25deg) scale(0.85)" : "rotate(0deg) scale(1)",
                  transformOrigin: "bottom center",
                  transition: "transform 0.3s ease",
                  animation: holding ? "none" : "flicker 1.8s infinite alternate",
                }}
              />
            ) : (
              <div
                style={{
                  width: "4px",
                  height: "28px",
                  background: "linear-gradient(to top, rgba(100,100,100,0.8), transparent)",
                  borderRadius: "2px",
                  animation: "smoke 2s ease-out forwards",
                }}
              />
            )}

            {/* Sumbu */}
            <div style={{ width: "2.5px", height: "10px", background: "#333", margin: "-2px 0 0" }} />

            {/* Batang Lilin */}
            <div
              style={{
                width: "46px",
                height: "110px",
                background: "linear-gradient(135deg, #f6e7c6 0%, #e9cfa0 50%, #c9a25e 100%)",
                borderRadius: "4px 4px 6px 6px",
                border: "1px solid rgba(201, 162, 94, 0.5)",
                boxShadow: blown ? "0 4px 12px rgba(0,0,0,0.15)" : "0 8px 24px rgba(0,0,0,0.5)",
              }}
            />
          </div>
        </button>

        {/* Petunjuk / status */}
        {!blown && (
          <span style={{ color: "var(--champagne)", fontSize: "0.8rem", fontStyle: "italic", marginTop: "0.5rem" }}>
            {holding ? `Meniup... ${Math.round(progress)}%` : "Tekan & tahan apinya..."}
          </span>
        )}
      </div>

      {/* Footer Bab 1 */}
      <div>
        <p style={{ color: blown ? "var(--bronze)" : "var(--gold)", fontSize: "0.85rem", fontStyle: "italic", margin: 0 }}>
          {blown ? "Geser ke kanan untuk membaca surat →" : "Lilin harus ditiup sebelum lanjut membaca"}
        </p>
      </div>

      <style jsx>{`
        @keyframes flicker {
          0% { transform: scale(1) rotate(-1deg); }
          50% { transform: scale(1.05, 0.95) rotate(1.5deg); }
          100% { transform: scale(0.96, 1.04) rotate(-2deg); }
        }
        @keyframes smoke {
          0% { opacity: 0.8; transform: translateY(0) scaleX(1); }
          100% { opacity: 0; transform: translateY(-30px) scaleX(3); }
        }
      `}</style>
    </div>
  );
}