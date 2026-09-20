"use client";
import { useCallback, useRef, useState, useEffect, type ReactNode } from "react";

interface Props {
  children: ReactNode[];
  index: number;
  onChange: (i: number) => void;
  canAdvance?: (i: number) => boolean;
}

export function PageTurner({ children, index, onChange, canAdvance }: Props) {
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const total = children.length;

  // Track arah animasi untuk styling transisi natural
  const [turningIndex, setTurningIndex] = useState<number | null>(null);
  const [turnDirection, setTurnDirection] = useState<"forward" | "backward" | null>(null);

  const next = useCallback(() => {
    if (index >= total - 1) return;
    if (canAdvance && !canAdvance(index)) return;
    setTurningIndex(index);
    setTurnDirection("forward");
    onChange(index + 1);
  }, [index, total, onChange, canAdvance]);

  const prev = useCallback(() => {
    if (index <= 0) return;
    setTurningIndex(index - 1);
    setTurnDirection("backward");
    onChange(index - 1);
  }, [index, onChange]);

  useEffect(() => {
    const t = setTimeout(() => {
      setTurningIndex(null);
      setTurnDirection(null);
    }, 1100);
    return () => clearTimeout(t);
  }, [index]);

  const handlePointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
    startY.current = e.clientY;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (startX.current === null || startY.current === null) return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;
    startX.current = null;
    startY.current = null;

    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      if (dx < 0) next();
      else prev();
    }
  };

  const isNextDisabled = index >= total - 1 || (canAdvance ? !canAdvance(index) : false);

  return (
    <div
      className="book-wrapper"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") next();
        else if (e.key === "ArrowLeft") prev();
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      style={{ touchAction: "pan-y" }}
    >
      <div className="book-spine" />

      <div className="book-deck">
        {children.map((child, i) => {
          const isTurned = i < index;
          const isCurrent = i === index;
          const isNextPage = i === index + 1;
          const isPrevPage = i === index - 1;

          // Hitung z-index bertingkat layaknya tumpukan kertas fisik
          let zIndex = 1;
          if (isCurrent) zIndex = 40;
          else if (isTurned) zIndex = 10 + i;
          else zIndex = 30 - i;

          // Lembaran yang sedang aktif membalik mendapat z-index tertinggi
          if (turningIndex === i) {
            zIndex = 55;
          }

          let pageClass = "book-page";
          if (isTurned) pageClass += " page-turned";
          else if (isCurrent) pageClass += " page-current";
          else pageClass += " page-stacked";

          if (turningIndex === i) {
            pageClass += turnDirection === "forward" ? " flipping-forward" : " flipping-backward";
          }

          return (
            <div
              key={i}
              className={pageClass}
              style={{
                zIndex,
                pointerEvents: isCurrent ? "auto" : "none",
                visibility: Math.abs(i - index) > 2 ? "hidden" : "visible",
              }}
              aria-hidden={!isCurrent}
            >
              {/* Bagian Depan Halaman */}
              <div className="page-face page-front">
                <div className="inner">{child}</div>
                <div className="page-crease" />
                <div className="page-shadow-overlay" />
              </div>

              {/* Punggung Belakang Lembaran (Backface Kertas Antik) */}
              <div className="page-face page-back">
                <div className="back-paper-texture" />
                <div className="back-crease" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigasi Footer Folio Bar */}
      {index > 0 && (
        <div className="navbar">
          <button
            type="button"
            className="nav-btn"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            disabled={index === 0}
            aria-label="Halaman sebelumnya"
          >
            ← Kembali
          </button>
          <span className="folio-counter" aria-live="polite">
            {index} / {total - 1}
          </span>
          <button
            type="button"
            className="nav-btn"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            disabled={isNextDisabled}
            aria-label="Halaman berikutnya"
            style={isNextDisabled ? { opacity: 0.35, cursor: "not-allowed" } : {}}
          >
            Lanjut →
          </button>
        </div>
      )}
    </div>
  );
}