"use client";
import { useCallback, useRef, type ReactNode } from "react";

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

  const next = useCallback(() => {
    if (index >= total - 1) return;
    if (canAdvance && !canAdvance(index)) return;
    onChange(index + 1);
  }, [index, total, onChange, canAdvance]);

  const prev = useCallback(() => {
    if (index > 0) onChange(index - 1);
  }, [index, onChange]);

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

    // Pastikan gestur horizontal lebih dominan daripada scroll vertikal
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      if (dx < 0) next();
      else prev();
    }
  };

  const isNextDisabled = index >= total - 1 || (canAdvance ? !canAdvance(index) : false);

  return (
    <div
      className="book"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") next();
        else if (e.key === "ArrowLeft") prev();
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      style={{ touchAction: "pan-y" }}
    >
      {children.map((child, i) => {
        const turned = i < index;
        const active = i === index;
        // z-index kalkulasi presisi: halaman terdepan selalu punya z-index tertinggi
        const z = active ? 50 : turned ? i : total - i;

        return (
          <section
            key={i}
            className={`page${turned ? " turned" : ""}${active ? " cur" : ""}`}
            style={{
              zIndex: z,
              pointerEvents: active ? "auto" : "none",
              visibility: Math.abs(i - index) > 2 ? "hidden" : "visible",
            }}
            aria-hidden={!active}
          >
            <div className="inner">{child}</div>
          </section>
        );
      })}

      {/* Navigasi Footer tetap di atas halaman kapanpun */}
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
          <span className="folio" aria-live="polite">
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