// components/ui/Confetti.tsx
// Ledakan konfeti kecil. Naikkan nilai `burst` untuk memicu (0 = tidak ada).
"use client";
import { useEffect, useState } from "react";

const COLORS = ["#e9cfa0", "#c9a25e", "#d9a0b0", "#f6dfb0", "#7d3a82", "#fff2cf"];

interface Piece {
  c: string;
  w: number;
  h: number;
  dx: number;
  up: number;
  r: number;
  dl: number;
  t: number;
  x0: number;
}

export function Confetti({ burst, count = 34 }: { burst: number; count?: number }) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (burst <= 0 || window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    setPieces(
      Array.from({ length: count }, () => ({
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
        w: rnd(5, 10),
        h: rnd(8, 16),
        dx: rnd(-170, 170),
        up: rnd(-260, -110),
        r: rnd(-540, 540),
        dl: rnd(0, 0.35),
        t: rnd(2.6, 3.8),
        x0: rnd(40, 60),
      })),
    );
    const id = window.setTimeout(() => setPieces([]), 4400);
    return () => window.clearTimeout(id);
  }, [burst, count]);

  return (
    <div className="cf-layer" aria-hidden="true">
      {pieces.map((p, i) => (
        <i
          key={i}
          className="cf"
          style={{ "--c": p.c, "--w": `${p.w}px`, "--h": `${p.h}px`, "--dx": `${p.dx}px`, "--up": `${p.up}px`, "--r": `${p.r}deg`, "--dl": `${p.dl}s`, "--t": `${p.t}s`, "--x0": `${p.x0}%` } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
