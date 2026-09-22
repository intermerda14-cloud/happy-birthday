// components/pages/PromiseScene.tsx  (pengganti TimelineScene, Bab IV)
"use client";
import { useEffect, useRef, useState } from "react";
import { promises } from "@/content/promises";
import { haptic, sfx } from "@/lib/sfx";
import { readStore, writeStore } from "@/lib/store";

const INK = "#2f1a3a";

export function PromiseScene() {
  const pad = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const hasInk = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [inked, setInked] = useState(false);
  const [sealed, setSealed] = useState<string | null>(null); // dataURL tanda tangan

  useEffect(() => {
    setSealed(readStore<string | null>("promise", null));
  }, []);

  // Ukuran kanvas mengikuti lebar layar dan DPR.
  useEffect(() => {
    const c = pad.current;
    if (!c || sealed) return;
    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = c.getBoundingClientRect();
      c.width = Math.max(1, Math.round(r.width * dpr));
      c.height = Math.max(1, Math.round(r.height * dpr));
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.4;
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [sealed]);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const down = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* abaikan */
    }
    drawing.current = true;
    last.current = pos(e);
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || !last.current) return;
    const ctx = e.currentTarget.getContext("2d");
    if (!ctx) return;
    const p = pos(e);
    const l = last.current;
    ctx.beginPath();
    ctx.moveTo(l.x, l.y);
    ctx.quadraticCurveTo(l.x, l.y, (l.x + p.x) / 2, (l.y + p.y) / 2);
    ctx.stroke();
    last.current = p;
    if (!hasInk.current) {
      hasInk.current = true;
      setInked(true);
    }
  };

  const up = () => {
    drawing.current = false;
    last.current = null;
  };

  const clear = () => {
    const c = pad.current;
    const ctx = c?.getContext("2d");
    if (c && ctx) ctx.clearRect(0, 0, c.width, c.height);
    hasInk.current = false;
    setInked(false);
  };

  const seal = () => {
    const c = pad.current;
    if (!c || !hasInk.current) return;
    const url = c.toDataURL("image/png");
    writeStore("promise", url);
    setSealed(url);
    sfx("playWaxCrack");
    haptic([30, 40, 20]);
    window.setTimeout(() => sfx("playChime"), 500);
  };

  const resign = () => {
    writeStore("promise", null);
    hasInk.current = false;
    setInked(false);
    setSealed(null);
  };

  const signDelay = `${0.6 + promises.length * 1.1}s`;

  return (
    <div className="lux-paper pm">
      <h2 className="lux-h2 pm-title">Janji</h2>
      <p className="pm-sub">Untuk setahun ke depan.</p>

      <ul className="pm-list">
        {promises.map((t, i) => (
          <li key={i} style={{ animationDelay: `${0.6 + i * 1.1}s` }}>
            {t}
          </li>
        ))}
      </ul>

      <div className="pm-sign" style={{ animationDelay: signDelay }}>
        {sealed ? (
          <div className="pm-done">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="pm-sigimg" src={sealed} alt="Tanda tangan" />
            <svg className="pm-stamp" viewBox="0 0 120 120" aria-hidden="true">
              <use href="#lux-seal" />
            </svg>
            <p className="pm-note">Janjinya tersimpan.</p>
            <button type="button" className="pm-link" onClick={resign}>
              Tanda tangan ulang
            </button>
          </div>
        ) : (
          <>
            <p className="pm-hint">Tanda tangani dengan jarimu.</p>
            <div className="pm-line" data-noswipe>
              <canvas
                ref={pad}
                className="pm-pad"
                aria-label="Area tanda tangan"
                onPointerDown={down}
                onPointerMove={move}
                onPointerUp={up}
                onPointerCancel={up}
              />
            </div>
            <div className="pm-actions">
              <button type="button" className="btn" onClick={seal} disabled={!inked}>
                Segel janji ini
              </button>
              <button type="button" className="pm-link" onClick={clear}>
                Ulangi
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
