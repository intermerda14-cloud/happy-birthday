// components/pages/CandleScene.tsx  (pengganti penuh; props tidak berubah)
"use client";
import { useEffect, useRef, useState } from "react";
import { haptic, sfx } from "@/lib/sfx";

interface Props {
  blown: boolean;
  onBlow: () => void;
}

const HOLD_MS = 1500;
// [kiri %, atas %, ukuran px, jeda animasi detik]
const BOKEH: [number, number, number, number][] = [
  [8, 14, 46, 0],
  [74, 22, 70, 1],
  [40, 8, 30, 2],
  [88, 52, 38, 0.6],
  [4, 60, 64, 1.6],
];

export function CandleScene({ blown, onBlow }: Props) {
  const [holding, setHolding] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const setLean = (deg: number) => root.current?.style.setProperty("--lean", `${deg}deg`);

  const start = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (blown || holding) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* abaikan */
    }
    setHolding(true);
    setLean(8);
    timer.current = setTimeout(() => {
      setHolding(false);
      setLean(26);
      sfx("playBlow");
      haptic([20, 30, 40]);
      onBlow();
    }, HOLD_MS);
  };

  // Api condong menjauhi jari: makin jauh jari dari tengah lilin, makin miring.
  const move = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!holding || blown || !btn.current) return;
    const r = btn.current.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    setLean(8 - Math.max(-1, Math.min(1, dx)) * 14);
  };

  const end = () => {
    if (blown) return;
    if (timer.current) clearTimeout(timer.current);
    setHolding(false);
    setLean(0);
  };

  return (
    <div ref={root} className={`lux-candle ${blown ? "out" : ""} ${holding ? "holding" : ""}`}>
      <div className="lux-sky lux-dawn" />
      <div className="lux-sky lux-night" />
      {BOKEH.map(([l, t, s, d], i) => (
        <i key={i} className="lux-bokeh" style={{ left: `${l}%`, top: `${t}%`, width: s, height: s, animationDelay: `${d}s` }} />
      ))}
      <div className="lux-mist" />
      <div className="lux-vig" />

      <div className="lux-candle-col">
        <div className="lux-stack">
          <div className="lux-m1">
            <h2 className="foil lux-h2">Lilin di malam hari</h2>
          </div>
          <div className="lux-m2">
            <h2 className="lux-h2">Permohonanmu sudah didengar.</h2>
          </div>
        </div>

        <button
          ref={btn}
          type="button"
          className="lux-candle-btn"
          data-noswipe
          aria-label="Tahan lilinnya untuk membuat permohonan"
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
          onContextMenu={(e) => e.preventDefault()}
        >
          <span className="lux-glow" />
          <svg viewBox="0 0 140 300" aria-hidden="true">
            <defs>
              <linearGradient id="lc-wx" x1="0" x2="1">
                <stop offset="0" stopColor="#A48B62" />
                <stop offset=".25" stopColor="#F3E3C0" />
                <stop offset=".55" stopColor="#FFF3DA" />
                <stop offset=".85" stopColor="#D6BF94" />
                <stop offset="1" stopColor="#8F7852" />
              </linearGradient>
              <radialGradient id="lc-wg" cx=".5" cy="0" r=".9">
                <stop offset="0" stopColor="#FFB45A" stopOpacity=".7" />
                <stop offset="1" stopColor="#FFB45A" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="lc-br" x1="0" x2="1">
                <stop offset="0" stopColor="#6b4a1c" />
                <stop offset=".4" stopColor="#E7C77A" />
                <stop offset="1" stopColor="#5a3d14" />
              </linearGradient>
              <radialGradient id="lc-fo" cx=".5" cy=".75" r=".6">
                <stop offset="0" stopColor="#FFC46B" />
                <stop offset=".6" stopColor="#FF8A2B" stopOpacity=".85" />
                <stop offset="1" stopColor="#FF6A1A" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="lc-fm" cx=".5" cy=".8" r=".55">
                <stop offset="0" stopColor="#FFF3B8" />
                <stop offset=".7" stopColor="#FFD25E" stopOpacity=".9" />
                <stop offset="1" stopColor="#FFC04A" stopOpacity="0" />
              </radialGradient>
            </defs>

            <circle className="lux-track" cx="70" cy="98" r="52" />
            <circle className="lux-ring" cx="70" cy="98" r="52" transform="rotate(-90 70 98)" />

            <ellipse cx="70" cy="290" rx="54" ry="9" fill="url(#lc-br)" />
            <rect x="60" y="270" width="20" height="18" fill="url(#lc-br)" />
            <ellipse cx="70" cy="270" rx="34" ry="6" fill="url(#lc-br)" />
            <rect x="52" y="130" width="36" height="140" fill="url(#lc-wx)" />
            <rect x="52" y="130" width="36" height="140" fill="url(#lc-wg)" />
            <path d="M84 132v30c0 5 5 5 5 0v-30zM56 132v18c0 4 4 4 4 0v-18z" fill="#FFF3DA" opacity=".9" />
            <ellipse cx="70" cy="130" rx="18" ry="5" fill="#FFEFC8" />
            <ellipse cx="70" cy="130" rx="12" ry="3" fill="#FFD48A" opacity=".95" />
            <line x1="70" y1="128" x2="70" y2="118" stroke="#2b1a12" strokeWidth="2" strokeLinecap="round" />

            <g className="lux-lean">
              <g className="lux-fl" filter="url(#lux-flame)">
                <path d="M70 62C82 86 88 108 70 128C52 108 58 86 70 62Z" fill="url(#lc-fo)" />
                <path d="M70 84C77 98 79 112 70 126C61 112 63 98 70 84Z" fill="url(#lc-fm)" />
                <path d="M70 106C74 113 74 120 70 126C66 120 66 113 70 106Z" fill="#fffbe6" />
                <ellipse cx="70" cy="121" rx="5" ry="7" fill="#6b95ff" opacity=".5" />
              </g>
            </g>
            <path className="lux-smoke" d="M70 66C60 52 80 42 68 26C60 14 74 8 70 0" />
          </svg>
          <span className="lux-sparks" aria-hidden="true">
            {[
              ["6%", "22%", ".1s", "16px"],
              ["88%", "30%", ".25s", "12px"],
              ["22%", "6%", ".4s", "11px"],
              ["74%", "4%", ".15s", "18px"],
              ["46%", "-6%", ".5s", "13px"],
            ].map(([x, y, d, s], i) => (
              <i key={i} className="lux-sp" style={{ left: x, top: y, animationDelay: d, fontSize: s }}>
                ✦
              </i>
            ))}
          </span>
        </button>

        <p className="lux-hint">{blown ? "Geser halaman ke kiri untuk melanjutkan." : "Tahan lilinnya, lalu buat permohonan."}</p>
      </div>
    </div>
  );
}
