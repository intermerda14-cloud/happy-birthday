// components/PageTurner.tsx  (pengganti penuh; props tidak berubah)
"use client";
import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { LuxDefs } from "@/components/ui/LuxDefs";
import { MagicDust } from "@/components/ui/MagicDust";
import { useTilt } from "@/hooks/useTilt";
import { haptic, sfx } from "@/lib/sfx";

interface Props {
  children: ReactNode[];
  index: number;
  onChange: (i: number) => void;
  canAdvance?: (i: number) => boolean;
}

const MAX_ANGLE = 160;
const SLOP = 10; // px sebelum gerakan dianggap geseran, bukan tap
const NO_SWIPE = "[data-noswipe], iframe, input, textarea, select, [role='slider']";

interface Drag {
  id: number;
  x: number;
  y: number;
  dir: 1 | -1 | 0;
  p: number; // 0..1
  v: number; // px/ms
  lastX: number;
  lastT: number;
  active: boolean;
}

export function PageTurner({ children, index, onChange, canAdvance }: Props) {
  const total = children.length;
  const root = useRef<HTMLDivElement>(null);
  const pages = useRef<(HTMLDivElement | null)[]>([]);
  const drag = useRef<Drag | null>(null);
  const suppressClick = useRef(false);
  useTilt(root);

  const canNext = useCallback(
    (i: number) => i < total - 1 && (canAdvance ? canAdvance(i) : true),
    [total, canAdvance],
  );

  const go = useCallback(
    (to: number) => {
      if (to < 0 || to > total - 1 || to === index) return;
      sfx("playPageTurn");
      haptic(12);
      onChange(to);
    },
    [index, total, onChange],
  );

  const next = useCallback(() => {
    if (canNext(index)) go(index + 1);
    else if (index < total - 1) haptic(8);
  }, [canNext, go, index, total]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  // Halaman non-aktif tidak boleh fokus atau menerima sentuhan.
  useEffect(() => {
    pages.current.forEach((el, i) => {
      if (el) (el as unknown as { inert: boolean }).inert = i !== index;
    });
  }, [index]);

  const paint = (el: HTMLDivElement, angle: number) => {
    el.style.transition = "none";
    el.style.transform = `rotateY(${-angle}deg)`;
    el.style.opacity = String(angle > 100 ? Math.max(0, 1 - (angle - 100) / 50) : 1);
    el.style.setProperty("--shade", String(Math.min(1, angle / 90)));
  };
  const release = (el: HTMLDivElement | null | undefined) => {
    if (!el) return;
    el.style.transition = "";
    el.style.transform = "";
    el.style.opacity = "";
    el.style.removeProperty("--shade");
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if ((e.target as HTMLElement).closest(NO_SWIPE)) return;
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, dir: 0, p: 0, v: 0, lastX: e.clientX, lastT: performance.now(), active: false };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || e.pointerId !== d.id) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;

    if (!d.active) {
      if (Math.abs(dy) > 24 && Math.abs(dy) > Math.abs(dx)) {
        drag.current = null; // gulir vertikal: biarkan browser
        return;
      }
      if (Math.abs(dx) < SLOP || Math.abs(dx) < Math.abs(dy) * 1.2) return;
      d.dir = dx < 0 ? 1 : -1;
      if ((d.dir === 1 && index >= total - 1) || (d.dir === -1 && index <= 0)) {
        drag.current = null;
        return;
      }
      d.active = true;
      // Capture BARU dipasang setelah melewati ambang, sehingga tap biasa tidak terganggu.
      try {
        root.current?.setPointerCapture(e.pointerId);
      } catch {
        /* abaikan */
      }
    }

    const w = root.current?.clientWidth ?? 400;
    const raw = Math.min(1, Math.abs(dx) / (w * 0.85));
    const gated = d.dir === 1 && !canNext(index);
    d.p = gated ? Math.min(raw, 0.06) : raw;

    const now = performance.now();
    d.v = (e.clientX - d.lastX) / Math.max(1, now - d.lastT);
    d.lastX = e.clientX;
    d.lastT = now;

    if (d.dir === 1) {
      const el = pages.current[index];
      if (el) paint(el, d.p * MAX_ANGLE);
    } else {
      const el = pages.current[index - 1];
      if (el) paint(el, (1 - d.p) * MAX_ANGLE);
    }
  };

  const finish = (e: React.PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const d = drag.current;
    if (!d || e.pointerId !== d.id) return;
    drag.current = null;
    if (!d.active) return;

    suppressClick.current = true;
    window.setTimeout(() => {
      suppressClick.current = false;
    }, 60);

    const el = d.dir === 1 ? pages.current[index] : pages.current[index - 1];
    const flick = Math.abs(d.v) > 0.5 && ((d.dir === 1 && d.v < 0) || (d.dir === -1 && d.v > 0));
    const commit = !cancelled && (d.p > 0.3 || flick);
    const blocked = d.dir === 1 && !canNext(index);

    release(el);
    if (blocked) haptic(8);
    else if (commit) go(index + d.dir);
  };

  return (
    <div
      ref={root}
      className="book-wrapper bk-root"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") next();
        else if (e.key === "ArrowLeft") prev();
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={(e) => finish(e, false)}
      onPointerCancel={(e) => finish(e, true)}
      onClickCapture={(e) => {
        if (suppressClick.current) {
          e.stopPropagation();
          e.preventDefault();
        }
      }}
    >
      <LuxDefs />
      <div className="bk-spine" aria-hidden="true" />

      <div className="bk-deck">
        {children.map((child, i) => {
          const state = i < index ? "turned" : i === index ? "current" : "stacked";
          return (
            <div
              key={i}
              ref={(el) => {
                pages.current[i] = el;
              }}
              className={`bk-page ${state}`}
              style={{ zIndex: total - i, visibility: Math.abs(i - index) > 2 ? "hidden" : "visible" }}
              aria-hidden={i !== index}
            >
              <div className="bk-inner">{child}</div>
              <div className="bk-crease" aria-hidden="true" />
              <div className="bk-shade" aria-hidden="true" />
            </div>
          );
        })}
      </div>

      {index > 0 && (
        <div className="bk-nav">
          <button type="button" className="bk-nav-btn" onClick={prev} disabled={index === 0} aria-label="Halaman sebelumnya">
            ‹
          </button>
          <span className="bk-folio" aria-live="polite">
            {index} / {total - 1}
          </span>
          <button type="button" className="bk-nav-btn" onClick={next} disabled={index >= total - 1 || !canNext(index)} aria-label="Halaman berikutnya">
            ›
          </button>
        </div>
      )}

      <MagicDust />
    </div>
  );
}
