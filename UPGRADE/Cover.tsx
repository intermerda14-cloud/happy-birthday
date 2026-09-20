// components/Cover.tsx  (pengganti penuh; props tidak berubah)
"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { site } from "@/content/site";
import { haptic, sfx } from "@/lib/sfx";

interface Props {
  isUnlocked: boolean;
  onOpen: () => void;
}

const isReal = (v: unknown): v is string => typeof v === "string" && v.length > 0 && !v.startsWith("TODO");
const pad = (n: number) => String(n).padStart(2, "0");

export function Cover({ isUnlocked, onOpen }: Props) {
  // Kunci hanya aktif bila tanggalnya valid. Jika masih TODO, buku bisa dibuka bebas.
  const target = useMemo(() => {
    if (!isReal(site.birthdayISO)) return null;
    const t = new Date(`${site.birthdayISO}T00:00:00+07:00`).getTime();
    return Number.isFinite(t) ? t : null;
  }, []);

  const [remaining, setRemaining] = useState<number | null>(null); // ms; null = belum dihitung
  const [preview, setPreview] = useState(false);
  const [phase, setPhase] = useState<"idle" | "holding" | "broken">("idle");
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const taps = useRef(0);
  const opening = useRef(false);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("preview");
    setPreview(isReal(site.previewKey) && q === site.previewKey);
    if (target === null) {
      setRemaining(0);
      return;
    }
    const tick = () => setRemaining(Math.max(0, target - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  useEffect(() => () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
  }, []);

  const ready = remaining !== null;
  const locked = ready && !isUnlocked && !preview && (remaining ?? 0) > 0;

  const crack = useCallback(() => {
    setPhase("broken");
    sfx("playWaxCrack");
    haptic([30, 40, 20]);
  }, []);

  const startHold = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (locked || !ready || phase === "broken") return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* abaikan */
    }
    setPhase("holding");
    holdTimer.current = setTimeout(crack, 900);
  };
  const endHold = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    setPhase((p) => (p === "holding" ? "idle" : p));
  };
  // Cadangan aksesibilitas: keyboard (detail = 0) atau 3 kali tap cepat juga memecahkan segel.
  const onSealClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (locked || !ready || phase === "broken") return;
    if (e.detail === 0) return crack();
    taps.current += 1;
    if (taps.current >= 3) crack();
  };

  const open = () => {
    if (opening.current) return;
    opening.current = true;
    window.setTimeout(() => {
      opening.current = false;
    }, 800);
    sfx("playPageTurn");
    haptic(15);
    onOpen();
  };

  const name = isReal(site.recipientName) ? site.recipientName : "Adelia";
  const t = remaining ?? 0;
  const dateLabel =
    target !== null
      ? new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", timeZone: "Asia/Jakarta" }).format(target)
      : "";

  return (
    <div className={`lux-cover ${phase}`}>
      <svg className="lux-leather" aria-hidden="true">
        <rect width="100%" height="100%" filter="url(#lux-leather)" />
      </svg>
      <div className="lux-cover-shade" aria-hidden="true" />
      <div className="lux-frame" aria-hidden="true">
        <i />
      </div>

      <div className="lux-cover-body">
        <h1 className="foil lux-title">Kisah {name}</h1>
        <p className="lux-sub">Sebuah dongeng untuk hari ulang tahunmu</p>

        <button
          type="button"
          className={`lux-seal ${phase}`}
          disabled={locked || !ready}
          aria-label={locked ? "Segel masih terkunci" : "Tahan untuk memecahkan segel"}
          onPointerDown={startHold}
          onPointerUp={endHold}
          onPointerCancel={endHold}
          onClick={onSealClick}
          onContextMenu={(e) => e.preventDefault()}
        >
          <svg className="seal-half seal-l" viewBox="0 0 120 120" aria-hidden="true">
            <use href="#lux-seal" />
          </svg>
          <svg className="seal-half seal-r" viewBox="0 0 120 120" aria-hidden="true">
            <use href="#lux-seal" />
          </svg>
          <svg className="seal-crack" viewBox="0 0 120 120" aria-hidden="true">
            <path d="M60 16 L53 42 L67 58 L55 78 L62 104" pathLength={100} />
            <path d="M53 42 L38 50 M67 58 L84 62 M55 78 L42 90" pathLength={100} />
          </svg>
        </button>

        {locked && (
          <>
            <p className="lux-count" aria-label="Hitung mundur">
              {pad(Math.floor(t / 864e5))} hari &nbsp;{pad(Math.floor(t / 36e5) % 24)} jam &nbsp;{pad(Math.floor(t / 6e4) % 60)} menit &nbsp;{pad(Math.floor(t / 1e3) % 60)} detik
            </p>
            <p className="lux-msg">Kisah ini baru bisa dibuka tanggal {dateLabel}, jam 00.00 WIB.</p>
          </>
        )}
        {ready && !locked && phase !== "broken" && <p className="lux-msg">Tahan segelnya untuk membukanya.</p>}
        {ready && !locked && phase === "broken" && (
          <button type="button" className="btn lux-open" onClick={open}>
            Buka buku
          </button>
        )}
      </div>
    </div>
  );
}
