// components/ui/Numeral.tsx
// Angka "2" dan "0" sebagai vektor foil emas (tidak bergantung pada font). Dipakai di kartu dan balon.
"use client";
import { useId } from "react";

interface Props {
  n: "2" | "0";
  className?: string;
  sw?: number;
  string?: boolean; // tambah tali balon
}

const TWO = "M20 38C20 12 70 8 70 40C70 62 28 82 16 112L74 112";

export function Numeral({ n, className, sw = 18, string = false }: Props) {
  const gid = "nm" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const shape = (extra: React.SVGProps<SVGPathElement & SVGEllipseElement>) =>
    n === "2" ? (
      <path d={TWO} fill="none" strokeLinecap="round" strokeLinejoin="round" {...(extra as React.SVGProps<SVGPathElement>)} />
    ) : (
      <ellipse cx="45" cy="65" rx="27" ry="47" fill="none" {...(extra as React.SVGProps<SVGEllipseElement>)} />
    );
  return (
    <svg className={className} viewBox={`0 0 90 ${string ? 160 : 130}`} aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF2CF" />
          <stop offset=".45" stopColor="#E6C27A" />
          <stop offset=".75" stopColor="#B98B4A" />
          <stop offset="1" stopColor="#F6DFB0" />
        </linearGradient>
      </defs>
      {string && <path d="M45 124C40 138 50 148 44 158" fill="none" stroke="#C9A25E" strokeWidth="1.4" />}
      <g transform="translate(2 3)" opacity=".35">{shape({ stroke: "#3a1d3f", strokeWidth: sw })}</g>
      {shape({ stroke: `url(#${gid})`, strokeWidth: sw })}
      <g transform="translate(-2 -2)" opacity=".7">{shape({ stroke: "#FFF8E0", strokeWidth: Math.max(2, sw / 4) })}</g>
    </svg>
  );
}
