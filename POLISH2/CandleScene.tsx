// components/pages/CandleScene.tsx  (pengganti; props tidak berubah)
// Kue ulang tahun ke-20 dengan lilin angka "2" dan "0". Api dibuat tanpa filter SVG supaya tampil di semua HP.
"use client";
import { useEffect, useRef, useState } from "react";
import { Confetti } from "@/components/ui/Confetti";
import { Numeral } from "@/components/ui/Numeral";
import { haptic, sfx } from "@/lib/sfx";

interface Props {
  blown: boolean;
  onBlow: () => void;
}

const HOLD_MS = 1500;
const BOKEH: [number, number, number, number][] = [
  [8, 24, 46, 0],
  [78, 30, 70, 1],
  [40, 20, 30, 2],
  [90, 58, 38, 0.6],
  [4, 66, 64, 1.6],
];
const MOTES: [number, number, number, number, number][] = [
  [8, 4, 11, 0, 20],
  [20, 3, 14, 3, -16],
  [33, 5, 12, 6, 24],
  [47, 3, 15, 1, -20],
  [58, 4, 10, 4, 18],
  [69, 5, 13, 8, -24],
  [80, 3, 12, 2, 14],
  [91, 4, 14, 7, -14],
];

// Titik pada tepi depan elips: y = cy + ry * sqrt(1 - ((x - cx) / rx)^2)
const ell = (x: number, cx: number, rx: number, cy: number, ry: number) => cy + ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2));

const DRIPS1 = [62, 86, 112, 140, 170, 198, 224, 250].map((x, i) => ({ x, len: [12, 20, 10, 24, 14, 22, 11, 18][i] }));
const DRIPS2 = [96, 120, 146, 176, 202, 226].map((x, i) => ({ x, len: [10, 18, 12, 20, 9, 16][i] }));
const PEARLS = Array.from({ length: 13 }, (_, i) => 52 + i * 18);

function Bunting() {
  const yAt = (x: number) => {
    const t = (x + 10) / 420;
    return 8 + 108 * t * (1 - t);
  };
  const colors = ["#3a1d3f", "#c9a25e", "#d9a0b0", "#f3e6d0", "#6b3574", "#e9cfa0"];
  return (
    <svg className="lux-bunting" viewBox="0 0 400 76" preserveAspectRatio="none" aria-hidden="true">
      <path d="M-10 8Q200 62 410 8" fill="none" stroke="#c9a25e" strokeWidth="1.6" />
      {Array.from({ length: 9 }, (_, i) => 32 + i * 42).map((x, i) => (
        <path
          key={x}
          d={`M${x - 15} ${yAt(x - 15)}L${x + 15} ${yAt(x + 15)}L${x} ${yAt(x) + 34}Z`}
          fill={colors[i % colors.length]}
          stroke="rgba(201,162,94,.65)"
          strokeWidth=".8"
        />
      ))}
    </svg>
  );
}

function Flame({ id }: { id: string }) {
  return (
    <svg className="lux-flame" viewBox="0 0 26 56" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}o`} cx=".5" cy=".75" r=".65">
          <stop offset="0" stopColor="#FFC46B" />
          <stop offset=".6" stopColor="#FF8A2B" stopOpacity=".9" />
          <stop offset="1" stopColor="#FF6A1A" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}m`} cx=".5" cy=".8" r=".6">
          <stop offset="0" stopColor="#FFF3B8" />
          <stop offset=".7" stopColor="#FFD25E" stopOpacity=".9" />
          <stop offset="1" stopColor="#FFC04A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M13 2C20 18 25 36 13 54C1 36 6 18 13 2Z" fill={`url(#${id}o)`} />
      <path d="M13 22C17 32 18 42 13 52C8 42 9 32 13 22Z" fill={`url(#${id}m)`} />
      <path d="M13 38C15 44 15 49 13 52C11 49 11 44 13 38Z" fill="#fffbe6" />
      <ellipse cx="13" cy="50" rx="3" ry="4" fill="#6b95ff" opacity=".5" />
    </svg>
  );
}

export function CandleScene({ blown, onBlow }: Props) {
  const [holding, setHolding] = useState(false);
  const [burst, setBurst] = useState(0);
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
      setBurst((b) => b + 1);
      sfx("playBlow");
      haptic([20, 30, 40]);
      window.setTimeout(() => sfx("playChime"), 500);
      onBlow();
    }, HOLD_MS);
  };

  // Api condong menjauhi jari.
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
      <div className="lux-sun" aria-hidden="true" />
      <div className="lux-rays" aria-hidden="true" />
      <div className="lux-sky lux-night" />
      <i className="lux-moon" aria-hidden="true" />
      {BOKEH.map(([l, t, s, d], i) => (
        <i key={i} className="lux-bokeh" style={{ left: `${l}%`, top: `${t}%`, width: s, height: s, animationDelay: `${d}s` }} />
      ))}
      {MOTES.map(([l, s, d, dl, sw], i) => (
        <i key={i} className="lux-mote" style={{ left: `${l}%`, "--s": `${s}px`, "--d": `${d}s`, "--dl": `${dl}s`, "--sw": `${sw}px` } as React.CSSProperties} />
      ))}
      <Numeral n="2" string className="lux-balloon b1" sw={24} />
      <Numeral n="0" string className="lux-balloon b2" sw={24} />
      <div className="lux-mist" />
      <div className="lux-vig" />
      <Bunting />
      <Confetti burst={burst} />

      <div className="lux-candle-col">
        <div className="lux-stack">
          <div className="lux-m1">
            <h2 className="foil lux-h2">Tiup lilin ke-20</h2>
          </div>
          <div className="lux-m2">
            <h2 className="lux-h2">Selamat ulang tahun ke-20.</h2>
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
          <span className="ck">
            <span className="ck-glow g1" />
            <span className="ck-glow g2" />
            <svg className="ck-svg" viewBox="0 0 320 330" aria-hidden="true">
              <defs>
                <linearGradient id="ck-plate" x1="0" x2="1">
                  <stop offset="0" stopColor="#8a6a3b" />
                  <stop offset=".5" stopColor="#f1dfae" />
                  <stop offset="1" stopColor="#7a5a2b" />
                </linearGradient>
                <linearGradient id="ck-t1" x1="0" x2="1">
                  <stop offset="0" stopColor="#cdb18d" />
                  <stop offset=".4" stopColor="#fff4e6" />
                  <stop offset=".75" stopColor="#f0dcc2" />
                  <stop offset="1" stopColor="#c4a681" />
                </linearGradient>
                <linearGradient id="ck-t2" x1="0" x2="1">
                  <stop offset="0" stopColor="#2f1338" />
                  <stop offset=".4" stopColor="#7a3f83" />
                  <stop offset=".8" stopColor="#4a2352" />
                  <stop offset="1" stopColor="#2a1030" />
                </linearGradient>
                <linearGradient id="ck-gold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#f6dfb0" />
                  <stop offset="1" stopColor="#c9a25e" />
                </linearGradient>
                <linearGradient id="ck-num" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#FFF2CF" />
                  <stop offset=".45" stopColor="#E6C27A" />
                  <stop offset=".75" stopColor="#B98B4A" />
                  <stop offset="1" stopColor="#F6DFB0" />
                </linearGradient>
                <radialGradient id="ck-berry" cx=".35" cy=".3" r=".8">
                  <stop offset="0" stopColor="#ff7f9a" />
                  <stop offset=".6" stopColor="#c21a48" />
                  <stop offset="1" stopColor="#7d0c2a" />
                </radialGradient>
              </defs>

              <ellipse className="lux-track ck-track" cx="160" cy="112" rx="104" ry="70" />
              <ellipse className="ck-ring" cx="160" cy="112" rx="104" ry="70" pathLength={100} />

              <ellipse cx="160" cy="318" rx="150" ry="12" fill="rgba(20,6,26,.35)" />
              <ellipse cx="160" cy="308" rx="150" ry="15" fill="url(#ck-plate)" />
              <ellipse cx="160" cy="306" rx="136" ry="11" fill="#f7eedd" />

              {/* tingkat bawah */}
              <path d="M36 250V300A124 15 0 0 0 284 300V250Z" fill="url(#ck-t1)" />
              <ellipse cx="160" cy="250" rx="124" ry="16" fill="#fff8ee" />
              <ellipse cx="160" cy="250" rx="124" ry="16" fill="none" stroke="rgba(185,139,74,.35)" strokeWidth="1" />
              {DRIPS1.map(({ x, len }) => {
                const y0 = ell(x, 160, 124, 250, 16);
                return <path key={x} d={`M${x - 6} ${y0 - 2}v${len}a6 6 0 0 0 12 0v${-len}Z`} fill="#fff8ee" stroke="rgba(185,139,74,.3)" strokeWidth=".6" />;
              })}
              {PEARLS.map((x) => (
                <circle key={x} cx={x} cy={ell(x, 160, 124, 300, 15) - 4} r="3.2" fill="url(#ck-gold)" stroke="rgba(90,60,20,.4)" strokeWidth=".5" />
              ))}

              {/* tingkat atas */}
              <path d="M76 200V246A84 11 0 0 0 244 246V200Z" fill="url(#ck-t2)" />
              <path d="M76 236A84 11 0 0 0 244 236" fill="none" stroke="#c9a25e" strokeWidth="2" />
              <ellipse cx="160" cy="200" rx="84" ry="11" fill="#8c4a96" />
              <ellipse cx="160" cy="199" rx="70" ry="8" fill="#a15fab" opacity=".55" />
              {DRIPS2.map(({ x, len }) => {
                const y0 = ell(x, 160, 84, 200, 11);
                return <path key={x} d={`M${x - 5} ${y0 - 2}v${len}a5 5 0 0 0 10 0v${-len}Z`} fill="url(#ck-gold)" />;
              })}
              {[
                [104, 204, 20],
                [128, 208, -30],
                [190, 207, 40],
                [214, 203, -15],
                [150, 205, 10],
              ].map(([x, y, r], i) => (
                <rect key={i} x={x} y={y} width="5" height="3" fill="#f6dfb0" opacity=".85" transform={`rotate(${r} ${x} ${y})`} />
              ))}
              {[
                [92, 197],
                [104, 201],
                [216, 201],
                [228, 197],
              ].map(([x, y]) => (
                <g key={x}>
                  <circle cx={x} cy={y} r="8" fill="url(#ck-berry)" />
                  <ellipse cx={x - 2.5} cy={y - 3} rx="2.4" ry="1.5" fill="#fff" opacity=".7" />
                </g>
              ))}

              {/* lilin angka 2 dan 0 */}
              <ellipse cx="120" cy="208" rx="34" ry="5" fill="rgba(20,6,26,.45)" />
              <ellipse cx="206" cy="208" rx="34" ry="5" fill="rgba(20,6,26,.45)" />
              <g transform="translate(3 4)" opacity=".4">
                <path d="M94 140C94 118 146 114 146 143C146 164 108 180 92 204L148 204" fill="none" stroke="#2a1030" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
                <ellipse cx="206" cy="160" rx="27" ry="40" fill="none" stroke="#2a1030" strokeWidth="22" />
              </g>
              <path d="M94 140C94 118 146 114 146 143C146 164 108 180 92 204L148 204" fill="none" stroke="url(#ck-num)" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
              <ellipse cx="206" cy="160" rx="27" ry="40" fill="none" stroke="url(#ck-num)" strokeWidth="22" />
              <g transform="translate(-3 -3)" opacity=".7">
                <path d="M94 140C94 118 146 114 146 143C146 164 108 180 92 204L148 204" fill="none" stroke="#FFF8E0" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                <ellipse cx="206" cy="160" rx="27" ry="40" fill="none" stroke="#FFF8E0" strokeWidth="5" />
              </g>
              <line x1="120" y1="113" x2="120" y2="103" stroke="#2b1a12" strokeWidth="2" strokeLinecap="round" />
              <line x1="206" y1="110" x2="206" y2="100" stroke="#2b1a12" strokeWidth="2" strokeLinecap="round" />

              <path className="lux-smoke" d="M120 100C112 86 128 76 118 60C112 48 124 42 120 32" />
              <path className="lux-smoke" style={{ animationDelay: ".25s" }} d="M206 97C198 83 214 73 204 57C198 45 210 39 206 29" />
            </svg>

            <span className="lux-fw f1" style={{ left: "33.4%", top: "14.2%" }}>
              <Flame id="fa" />
            </span>
            <span className="lux-fw f2" style={{ left: "60.3%", top: "13.3%" }}>
              <Flame id="fb" />
            </span>

            <span className="lux-sparks" aria-hidden="true">
              {[
                ["6%", "22%", ".1s", "16px"],
                ["92%", "26%", ".25s", "12px"],
                ["22%", "4%", ".4s", "11px"],
                ["78%", "2%", ".15s", "18px"],
                ["50%", "-6%", ".5s", "13px"],
              ].map(([x, y, d, s], i) => (
                <i key={i} className="lux-sp" style={{ left: x, top: y, animationDelay: d, fontSize: s }}>
                  ✦
                </i>
              ))}
            </span>
          </span>
        </button>

        <p className="lux-hint">{blown ? "Permohonanmu sudah didengar. Geser halaman ke kiri untuk melanjutkan." : "Tahan lilinnya, lalu buat permohonan."}</p>
      </div>
    </div>
  );
}
