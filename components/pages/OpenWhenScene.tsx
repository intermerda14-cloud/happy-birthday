// components/pages/OpenWhenScene.tsx  (pengganti CouponsScene, Bab VI)
"use client";
import { useEffect, useState } from "react";
import { openWhen, type OpenWhen } from "@/content/openwhen";
import { site } from "@/content/site";
import { haptic, sfx } from "@/lib/sfx";
import { readStore, writeStore } from "@/lib/store";

const isReal = (v: unknown): v is string => typeof v === "string" && v.length > 0 && !v.startsWith("TODO");

function unlockAt(l: OpenWhen): number | null {
  if (l.lockNextBirthday && isReal(site.birthdayISO)) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(site.birthdayISO.trim());
    if (m) {
      const t = new Date(`${Number(m[1]) + 1}-${m[2]}-${m[3]}T00:00:00+07:00`).getTime();
      if (Number.isFinite(t)) return t;
    }
  }
  if (!isReal(l.lockUntilISO)) return null;
  const t = new Date(`${l.lockUntilISO}T00:00:00+07:00`).getTime();
  return Number.isFinite(t) ? t : null;
}

export function OpenWhenScene() {
  const [active, setActive] = useState<OpenWhen | null>(null);
  const [opened, setOpened] = useState<Record<string, boolean>>({});
  const [shake, setShake] = useState<string | null>(null);

  useEffect(() => {
    setOpened(readStore<Record<string, boolean>>("openwhen", {}));
  }, []);

  const lockedUntil = (l: OpenWhen): number | null => {
    if (process.env.NEXT_PUBLIC_PREVIEW === "1") return null; // mode preview: semua amplop bisa dibuka
    const t = unlockAt(l);
    return t !== null && Date.now() < t ? t : null;
  };

  const tap = (l: OpenWhen) => {
    if (lockedUntil(l) !== null) {
      setShake(l.id);
      haptic(10);
      window.setTimeout(() => setShake(null), 500);
      return;
    }
    sfx("playWaxCrack");
    haptic([20, 30]);
    const next = { ...opened, [l.id]: true };
    setOpened(next);
    writeStore("openwhen", next);
    window.setTimeout(() => sfx("playPageTurn"), 350);
    setActive(l);
  };

  const dateLabel = (t: number) =>
    new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" }).format(t);

  return (
    <div className="lux-paper ow">
      <h2 className="lux-h2 pm-title">Buka saat...</h2>
      <p className="pm-sub">Surat-surat kecil untuk hari yang berbeda.</p>

      <div className="ow-grid">
        {openWhen.map((l) => {
          const until = lockedUntil(l);
          const isOpen = !!opened[l.id];
          return (
            <div key={l.id} className="ow-cell">
              <button
                type="button"
                className={`ow-env ${isOpen ? "is-open" : ""} ${shake === l.id ? "shake" : ""}`}
                aria-label={until !== null ? `Amplop ${l.title}, terkunci` : `Buka amplop ${l.title}`}
                onClick={() => tap(l)}
              >
                <span className="ow-back" />
                <span className="ow-flap" />
                <span className="ow-front" />
                <svg className="ow-seal" viewBox="0 0 120 120" aria-hidden="true">
                  <use href="#lux-seal" />
                </svg>
              </button>
              <p className="ow-label">{l.title}</p>
              {until !== null && <p className="ow-lock">Terbuka {dateLabel(until)}</p>}
              {until === null && isOpen && <p className="ow-lock">Sudah dibuka</p>}
            </div>
          );
        })}
      </div>

      {active && (
        <div className="ow-sheet" role="dialog" aria-modal="true" aria-label={`Surat ${active.title}`} data-noswipe>
          <div className="ow-card">
            <h3 className="ow-h3">Buka {active.title}</h3>
            <p className="ow-text">{active.text}</p>
            <button type="button" className="btn" onClick={() => setActive(null)}>
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
