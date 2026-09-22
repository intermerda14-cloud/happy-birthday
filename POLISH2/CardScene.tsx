// components/pages/CardScene.tsx  (pengganti PromiseScene, Bab IV): kartu ucapan ulang tahun ke-20
"use client";
import { useState } from "react";
import { card } from "@/content/card";
import { site } from "@/content/site";
import { Confetti } from "@/components/ui/Confetti";
import { Numeral } from "@/components/ui/Numeral";
import { haptic, sfx } from "@/lib/sfx";

const isReal = (v: unknown): v is string => typeof v === "string" && v.length > 0 && !v.startsWith("TODO");

export function CardScene() {
  const [open, setOpen] = useState(false);
  const [burst, setBurst] = useState(0);
  const name = isReal(site.recipientName) ? site.recipientName : "Adelia";
  const from = isReal(site.senderName) ? site.senderName : "Firas";

  const openCard = () => {
    if (open) return;
    setOpen(true);
    setBurst((b) => b + 1);
    sfx("playPageTurn");
    window.setTimeout(() => sfx("playChime"), 450);
    haptic([15, 30, 15]);
  };
  const closeCard = () => {
    setOpen(false);
    sfx("playPageTurn");
  };

  return (
    <div className="lux-paper cd">
      <Confetti burst={burst} />
      <div className={`cd-card ${open ? "open" : ""}`}>
        <div className="cd-inside">
          <div className="cd-pop" aria-hidden="true">
            <Numeral n="2" className="cd-num" sw={20} />
            <Numeral n="0" className="cd-num" sw={20} />
            <i className="cd-spark s1">✦</i>
            <i className="cd-spark s2">✦</i>
            <i className="cd-spark s3">✦</i>
          </div>
          <h2 className="cd-h">
            {card.greeting}, {name}
          </h2>
          <ul className="cd-wishes">
            {card.lines.map((t, i) => (
              <li key={i} style={{ animationDelay: `${1.1 + i * 0.9}s` }}>
                {t}
              </li>
            ))}
          </ul>
          <p className="cd-from">
            {card.closing}
            <span className="cd-sign">{from}</span>
          </p>
        </div>

        <button type="button" className="cd-front" aria-label="Buka kartu ucapan" aria-expanded={open} tabIndex={open ? -1 : 0} onClick={openCard}>
          <svg className="lux-leather" aria-hidden="true">
            <rect width="100%" height="100%" filter="url(#lux-leather)" />
          </svg>
          <span className="cd-frame" aria-hidden="true" />
          <span className="cd-front-in">
            <span className="cd-front-top">Selamat ulang tahun</span>
            <span className="cd-nums" aria-hidden="true">
              <Numeral n="2" className="cd-num-l" sw={18} />
              <Numeral n="0" className="cd-num-l" sw={18} />
            </span>
            <span className="cd-front-sub">Ketuk untuk membuka</span>
          </span>
          <span className="cd-ribbon" aria-hidden="true" />
        </button>
      </div>

      <div className="cd-foot">
        {open ? (
          <button type="button" className="pm-link" onClick={closeCard}>
            Tutup kartu
          </button>
        ) : (
          <p className="cd-hint">Ketuk kartunya untuk membukanya.</p>
        )}
      </div>
    </div>
  );
}
