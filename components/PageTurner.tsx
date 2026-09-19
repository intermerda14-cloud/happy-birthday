"use client";
import { useCallback, useRef, type ReactNode } from "react";

interface Props {
  children: ReactNode[];
  index: number;
  onChange: (i: number) => void;
}

export function PageTurner({ children, index, onChange }: Props) {
  const startX = useRef<number | null>(null);
  const total = children.length;

  const next = useCallback(() => {
    if (index < total - 1) onChange(index + 1);
  }, [index, total, onChange]);

  const prev = useCallback(() => {
    if (index > 0) onChange(index - 1);
  }, [index, onChange]);

  return (
    <div
      className="book"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") next();
        else if (e.key === "ArrowLeft") prev();
      }}
      onPointerDown={(e) => { startX.current = e.clientX; }}
      onPointerUp={(e) => {
        if (startX.current === null) return;
        const dx = e.clientX - startX.current;
        startX.current = null;
        if (dx < -40) next();
        else if (dx > 40) prev();
      }}
    >
      {children.map((child, i) => {
        const turned = i < index;
        const active = i === index;
        return (
          <section
            key={i}
            className={`page${turned ? " turned" : ""}${active ? " cur" : ""}`}
            style={{ zIndex: total - i, pointerEvents: active ? "auto" : "none" }}
            aria-hidden={!active}
          >
            <div className="inner">{child}</div>
          </section>
        );
      })}

      <div className="navbar">
        <button className="nav-btn" onClick={prev} disabled={index === 0}>
          Kembali
        </button>
        <span className="folio">{index + 1} / {total}</span>
        <button className="nav-btn" onClick={next} disabled={index >= total - 1}>
          Balik halaman
        </button>
      </div>
    </div>
  );
}