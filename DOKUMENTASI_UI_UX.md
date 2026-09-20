# DOKUMENTASI LENGKAP KODE UI, UX, TEMA & ASET: "KISAH ADELIA"

Dokumen ini memuat arsitektur lengkap, potongan kode inti dari seluruh bab, styling tema perkamen & buku dongeng antik, audio engine, serta manifest aset untuk mempermudah audit, koreksi, dan kustomisasi.

---

## DAFTAR ISI
1. [Arsitektur Tema & Styling Global (`app/globals.css`)](#1-arsitektur-tema--styling-global)
2. [Layout & Konfigurasi Tipografi Google Fonts (`app/layout.tsx`)](#2-layout--konfigurasi-tipografi)
3. [Mekanik Pembalik Halaman 3D & Mobile Touch (`components/PageTurner.tsx`)](#3-mekanik-pembalik-halaman-3d)
4. [State Machine Buku & LocalStorage (`components/BookProvider.tsx`)](#4-state-machine-buku)
5. [Ornamen Sudut Tanaman Rambat Emas (`components/ui/VineCorners.tsx`)](#5-ornamen-sudut-tanaman-rambat)
6. [Sampul Terkunci, Segel Lilin & Countdown (`components/Cover.tsx`)](#6-sampul-terkunci--segel-lilin)
7. [Bab I: Lilin Interaktif Tahan-Tiup (`components/pages/CandleScene.tsx`)](#7-bab-i-lilin-interaktif)
8. [Bab II: Surat Cinta Blur-to-Focus (`components/pages/LetterScene.tsx`)](#8-bab-ii-surat-cinta)
9. [Bab III: Album Polaroid & Lightbox (`components/pages/AlbumScene.tsx`)](#9-bab-iii-album-polaroid)
10. [Bab IV: Jejak Langkah / Timeline (`components/pages/TimelineScene.tsx`)](#10-bab-iv-jejak-langkah)
11. [Bab V: Piringan Hitam & Spotify Embed (`components/pages/MusicScene.tsx`)](#11-bab-v-piringan-hitam--spotify)
12. [Bab VI: Kupon Hadiah Tiket Sobek (`components/pages/CouponsScene.tsx`)](#12-bab-vi-kupon-hadiah)
13. [Bab VII: Peta Bintang & Konstelasi (`components/pages/StarsScene.tsx`)](#13-bab-vii-peta-bintang)
14. [Bab VIII: Toples Alasan Cinta (`components/pages/JarScene.tsx`)](#14-bab-viii-toples-alasan)
15. [Bab IX: Epilog, Counter Hari & Surat Tahun Depan (`components/pages/EpilogueScene.tsx`)](#15-bab-ix-epilog)
16. [Web Audio SFX Engine Sintetis (`components/audio/SoundEngine.ts`)](#16-web-audio-sfx-engine)
17. [Manifest Slot Aset & Fallback (`assets/manifest.ts`)](#17-manifest-slot-aset)
18. [Skema Konten Pribadi (`content/*.ts`)](#18-skema-konten-pribadi)

---

## 1. Arsitektur Tema & Styling Global
**File:** `app/globals.css`

```css
@import "tailwindcss";

:root {
  --night: #2a1230;       /* Aubergine/Plum gelap: sampul & malam */
  --champagne: #e9cfa0;   /* Emas muda: teks di atas gelap, aksen */
  --gold: #c9a25e;        /* Emas foil: garis bingkai, tombol, ornamen */
  --bronze: #8a5a2b;      /* Perunggu: nomor folio, drop cap */
  --paper: #f7ead9;       /* Kertas perkamen dasar */
  --ink: #3a1d3f;         /* Tinta tulisan di atas kertas */
  --rose: #d9a0b0;        /* Aksen washi tape & noda cat air */
  --mint: #c9e6d8;        /* Status sukses / kupon tertukar */

  --ease-page: cubic-bezier(0.25, 1, 0.5, 1);
  --serif: var(--font-fraunces), Georgia, "Times New Roman", serif;
  --sans: var(--font-nunito), system-ui, -apple-system, "Segoe UI", sans-serif;
}

/* Latar Luar: Meja Kayu Dongeng Malam Hari dengan Partikel Bintang Emas */
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  height: 100dvh;
  background:
    radial-gradient(circle at 50% 30%, rgba(75, 38, 87, 0.7) 0%, rgba(22, 10, 28, 0.95) 70%, #0c0410 100%),
    radial-gradient(1px 1px at 20px 30px, rgba(233, 207, 160, 0.4), transparent),
    radial-gradient(1.5px 1.5px at 150px 80px, rgba(201, 162, 94, 0.5), transparent),
    radial-gradient(1px 1px at 300px 180px, rgba(233, 207, 160, 0.35), transparent),
    radial-gradient(2px 2px at 220px 320px, rgba(201, 162, 94, 0.4), transparent),
    #120617;
  background-size: 100% 100%, 350px 350px, 400px 400px, 300px 300px, 500px 500px;
  font-family: var(--sans);
  color: var(--ink);
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
}

/* Wadah Buku Dongeng Antik dengan Perspektif 3D */
.book-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 460px;
  margin: 0 auto;
  perspective: 2200px;
  perspective-origin: 50% 50%;
  overflow: hidden;
  background: var(--night);
  box-shadow:
    0 25px 70px rgba(0, 0, 0, 0.85),
    0 0 100px rgba(75, 38, 87, 0.4),
    inset 0 0 40px rgba(0, 0, 0, 0.8);
  border-radius: 6px;
}

/* Kertas Perkamen Vintage dengan Noda Cat Air Lembut */
.paper {
  width: 100%;
  height: 100%;
  background:
    radial-gradient(42% 30% at 10% 8%, rgba(217, 160, 176, 0.35), transparent 70%),
    radial-gradient(40% 30% at 94% 94%, rgba(201, 230, 216, 0.55), transparent 70%),
    radial-gradient(32% 22% at 90% 12%, rgba(233, 207, 160, 0.5), transparent 70%),
    radial-gradient(50% 40% at 50% 90%, rgba(217, 160, 176, 0.2), transparent 75%),
    radial-gradient(120% 90% at 50% 35%, #fffbf5 0%, var(--paper) 60%, #e5cdb0 100%);
  border: 1px solid rgba(185, 139, 74, 0.55);
  box-shadow:
    inset 0 0 45px rgba(90, 50, 30, 0.2),
    inset 0 0 10px rgba(185, 139, 74, 0.15),
    -10px 0 25px rgba(0, 0, 0, 0.25);
  position: relative;
}

/* Teks Efek Kilau Emas Foil */
.foil {
  background: linear-gradient(
    100deg,
    #b98b4a 0%,
    #f8e5be 30%,
    #c9a25e 50%,
    #f6dfb0 70%,
    #b98b4a 100%
  );
  background-size: 250% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: sweep 3.5s var(--ease-page) 0.3s infinite alternate;
  text-shadow: 0 0 20px rgba(201, 162, 94, 0.3);
}

@keyframes sweep {
  0% { background-position: 100% 0; }
  100% { background-position: 0% 0; }
}
```

---

## 2. Layout & Konfigurasi Tipografi
**File:** `app/layout.tsx`

```tsx
import type { Metadata } from "next";
import { Fraunces, Nunito } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "opsz"],
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kisah Adelia — sebuah dongeng untuk hari ulang tahunmu",
  description: "Sebuah dongeng ulang tahun yang hanya untukmu.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className={`${fraunces.variable} ${nunito.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

---

## 3. Mekanik Pembalik Halaman 3D
**File:** `components/PageTurner.tsx`

```tsx
"use client";
import { useCallback, useRef, useState, useEffect, type ReactNode } from "react";

interface Props {
  children: ReactNode[];
  index: number;
  onChange: (i: number) => void;
  canAdvance?: (i: number) => boolean;
}

export function PageTurner({ children, index, onChange, canAdvance }: Props) {
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const total = children.length;

  const [turningIndex, setTurningIndex] = useState<number | null>(null);
  const [turnDirection, setTurnDirection] = useState<"forward" | "backward" | null>(null);

  const next = useCallback(() => {
    if (index >= total - 1) return;
    if (canAdvance && !canAdvance(index)) return;
    setTurningIndex(index);
    setTurnDirection("forward");
    onChange(index + 1);
  }, [index, total, onChange, canAdvance]);

  const prev = useCallback(() => {
    if (index <= 0) return;
    setTurningIndex(index - 1);
    setTurnDirection("backward");
    onChange(index - 1);
  }, [index, onChange]);

  useEffect(() => {
    const t = setTimeout(() => {
      setTurningIndex(null);
      setTurnDirection(null);
    }, 1100);
    return () => clearTimeout(t);
  }, [index]);

  const handlePointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
    startY.current = e.clientY;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (startX.current === null || startY.current === null) return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;
    startX.current = null;
    startY.current = null;

    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      if (dx < 0) next();
      else prev();
    }
  };

  const isNextDisabled = index >= total - 1 || (canAdvance ? !canAdvance(index) : false);

  return (
    <div
      className="book-wrapper"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") next();
        else if (e.key === "ArrowLeft") prev();
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      style={{ touchAction: "pan-y" }}
    >
      <div className="book-spine" />

      <div className="book-deck">
        {children.map((child, i) => {
          const isTurned = i < index;
          const isCurrent = i === index;

          let zIndex = 1;
          if (isCurrent) zIndex = 40;
          else if (isTurned) zIndex = 10 + i;
          else zIndex = 30 - i;

          if (turningIndex === i) zIndex = 55;

          let pageClass = "book-page";
          if (isTurned) pageClass += " page-turned";
          else if (isCurrent) pageClass += " page-current";
          else pageClass += " page-stacked";

          if (turningIndex === i) {
            pageClass += turnDirection === "forward" ? " flipping-forward" : " flipping-backward";
          }

          return (
            <div
              key={i}
              className={pageClass}
              style={{
                zIndex,
                pointerEvents: isCurrent ? "auto" : "none",
                visibility: Math.abs(i - index) > 2 ? "hidden" : "visible",
              }}
              aria-hidden={!isCurrent}
            >
              <div className="page-face page-front">
                <div className="inner">{child}</div>
                <div className="page-crease" />
                <div className="page-shadow-overlay" />
              </div>
              <div className="page-face page-back">
                <div className="back-paper-texture" />
                <div className="back-crease" />
              </div>
            </div>
          );
        })}
      </div>

      {index > 0 && (
        <div className="navbar">
          <button type="button" className="nav-btn" onClick={(e) => { e.stopPropagation(); prev(); }} disabled={index === 0}>
            ← Kembali
          </button>
          <span className="folio-counter" aria-live="polite">
            {index} / {total - 1}
          </span>
          <button type="button" className="nav-btn" onClick={(e) => { e.stopPropagation(); next(); }} disabled={isNextDisabled}>
            Lanjut →
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## 4. State Machine Buku
**File:** `components/BookProvider.tsx`

```tsx
"use client";
import { createContext, useContext, useReducer, useEffect, useRef, type ReactNode } from "react";
import { site } from "@/content/site";

export interface BookState {
  index: number;
  opened: boolean;
  candleBlown: boolean;
  audioEnabled: boolean;
  isUnlocked: boolean;
  couponsTorn: Record<string, boolean>;
}

type Action =
  | { type: "OPEN" }
  | { type: "TURN"; to: number }
  | { type: "BLOW_CANDLE" }
  | { type: "TOGGLE_AUDIO" }
  | { type: "SET_UNLOCKED"; unlocked: boolean }
  | { type: "TEAR_COUPON"; id: string }
  | { type: "RESET_COUPONS" }
  | { type: "RESTART" };

const init: BookState = {
  index: 0,
  opened: false,
  candleBlown: false,
  audioEnabled: false,
  isUnlocked: false,
  couponsTorn: {},
};

function reducer(s: BookState, a: Action): BookState {
  switch (a.type) {
    case "OPEN":
      return { ...s, opened: true, index: 1, audioEnabled: true };
    case "TURN":
      return { ...s, index: Math.max(0, a.to) };
    case "BLOW_CANDLE":
      return { ...s, candleBlown: true };
    case "TOGGLE_AUDIO":
      return { ...s, audioEnabled: !s.audioEnabled };
    case "SET_UNLOCKED":
      return { ...s, isUnlocked: a.unlocked };
    case "TEAR_COUPON":
      return { ...s, couponsTorn: { ...s.couponsTorn, [a.id]: true } };
    case "RESET_COUPONS":
      return { ...s, couponsTorn: {} };
    case "RESTART":
      return { ...s, index: 1 };
    default:
      return s;
  }
}
```

---

## 5. Ornamen Sudut Tanaman Rambat
**File:** `components/ui/VineCorners.tsx`

```tsx
export function VineCorners() {
  return (
    <>
      <svg className="corner-ornament corner-tl" viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">
        <path d="M4 96C4 50 30 20 96 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M22 62c-10-2-14-10-12-18 9 1 14 8 12 18zM40 40c-8-5-9-14-4-20 8 4 10 12 4 20zM62 24c-3-9 2-16 10-18 2 8-2 15-10 18z" opacity="0.8" />
        <circle cx="14" cy="80" r="3" />
        <circle cx="30" cy="92" r="2" />
      </svg>
      {/* tr, bl, br mirrors */}
    </>
  );
}
```

---

## 6. Sampul Terkunci & Segel Lilin
**File:** `components/Cover.tsx`

```tsx
"use client";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { VineCorners } from "@/components/ui/VineCorners";

interface Props {
  isUnlocked: boolean;
  onOpen: () => void;
}

export function Cover({ isUnlocked, onOpen }: Props) {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
  const [sealBroken, setSealBroken] = useState(false);

  useEffect(() => {
    const targetStr = site.birthdayISO && !site.birthdayISO.startsWith("TODO") ? site.birthdayISO : null;
    if (!targetStr) {
      setTimeLeft(null);
      return;
    }
    const targetTime = new Date(`${targetStr}T00:00:00+07:00`).getTime();
    const updateTimer = () => {
      const now = Date.now();
      const diff = targetTime - now;
      if (diff <= 0) setTimeLeft(null);
      else {
        setTimeLeft({
          d: Math.floor(diff / (1000 * 60 * 60 * 24)),
          h: Math.floor((diff / (1000 * 60 * 60)) % 24),
          m: Math.floor((diff / 1000 / 60) % 60),
          s: Math.floor((diff / 1000) % 60),
        });
      }
    };
    updateTimer();
    const iv = setInterval(updateTimer, 1000);
    return () => clearInterval(iv);
  }, []);

  const recipientName = site.recipientName && !site.recipientName.startsWith("TODO") ? site.recipientName : "Adelia";

  return (
    <div className="cover" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", textAlign: "center", padding: "2.5rem 1.4rem 2rem", height: "100%", position: "relative" }}>
      <VineCorners />
      <div style={{ width: "100%", position: "relative", zIndex: 12 }}>
        <p style={{ color: "var(--gold)", letterSpacing: "0.25em", fontSize: "0.75rem", textTransform: "uppercase", margin: "0 0 1.2rem" }}>✦ sebuah dongeng antik ✦</p>
        <h1 className="foil" style={{ fontSize: "clamp(2.3rem, 9.5vw, 3rem)", margin: "0 0 0.6rem", fontFamily: "var(--serif)", fontWeight: 600 }}>Kisah {recipientName}</h1>
        <p style={{ color: "var(--champagne)", fontStyle: "italic", maxWidth: "280px", margin: "0 auto", fontSize: "0.95rem" }}>Sebuah dongeng yang dirajut khusus untuk hari ulang tahunmu.</p>
      </div>

      {/* Segel Lilin */}
      <button type="button" onClick={() => setSealBroken(true)} aria-label="Segel lilin" style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
        <div style={{ width: "92px", height: "92px", borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #b32a48, #591024 80%, #2e0510)", border: "2px solid rgba(201, 162, 94, 0.7)", boxShadow: "0 10px 30px rgba(0,0,0,0.7)", display: "grid", placeItems: "center" }}>
          <div style={{ width: "70px", height: "70px", borderRadius: "50%", border: "1px dashed rgba(233, 207, 160, 0.5)", display: "grid", placeItems: "center", color: "var(--gold)", fontFamily: "var(--serif)", fontSize: "1.85rem", fontWeight: "bold" }}>
            {sealBroken ? "✓" : recipientName.charAt(0) || "A"}
          </div>
        </div>
      </button>

      {/* Tombol Buka Buku */}
      <button type="button" className="btn" onClick={onOpen} style={{ width: "100%", maxWidth: "260px", fontSize: "1.05rem", padding: "0.95rem 1.6rem" }}>
        Buka Buku ✦
      </button>
    </div>
  );
}
```

---

## 7. Bab I: Lilin Interaktif
**File:** `components/pages/CandleScene.tsx`

```tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { VineCorners } from "@/components/ui/VineCorners";

interface Props {
  blown: boolean;
  onBlow: () => void;
}

export function CandleScene({ blown, onBlow }: Props) {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startHold = () => {
    if (blown) return;
    setHolding(true);
    const start = Date.now();
    const duration = 1500;

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, (elapsed / duration) * 100);
      setProgress(p);
      if (elapsed >= duration) {
        if (timerRef.current) clearInterval(timerRef.current);
        setHolding(false);
        setProgress(100);
        onBlow();
      }
    }, 30);
  };

  const endHold = () => {
    if (blown) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setHolding(false);
    setProgress(0);
  };

  return (
    <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", padding: "2.5rem 1.6rem 2rem", textAlign: "center", transition: "background 2.4s ease", background: blown ? "radial-gradient(circle at 50% 35%, #fff3e6 0%, #f7dfcb 40%, #edd0be 70%, #d8ae9b 100%)" : "radial-gradient(circle at 50% 35%, #3b1d45 0%, #1e0b26 65%, #120617 100%)" }}>
      <VineCorners />
      <div>
        <span style={{ color: blown ? "var(--bronze)" : "var(--gold)", letterSpacing: "0.15em", fontSize: "0.8rem", textTransform: "uppercase", fontStyle: "italic" }}>Bab I</span>
        <h2 className={blown ? "" : "foil"} style={{ fontFamily: "var(--serif)", color: blown ? "var(--ink)" : "var(--champagne)", fontSize: "1.75rem", margin: "0.4rem 0 0.5rem", fontWeight: 600 }}>
          {blown ? "Permohonanmu Didengar" : "Lilin di Malam Hari"}
        </h2>
        <p style={{ color: blown ? "var(--ink)" : "var(--champagne)", fontSize: "0.9rem", fontStyle: "italic" }}>
          {blown ? "Malam berganti fajar hangat. Semoga semua harapan baikmu bersemi." : "Tahan lilinnya selama 1.5 detik, lalu buat permohonan dalam hati."}
        </p>
      </div>

      {/* Button Lilin Interaktif */}
      <button type="button" onPointerDown={startHold} onPointerUp={endHold} onPointerLeave={endHold} aria-label="Tahan lilin" style={{ background: "none", border: "none", padding: "1rem", cursor: blown ? "default" : "pointer" }}>
        {/* Api Lilin / Asap */}
        {!blown ? (
          <div style={{ width: "26px", height: "46px", background: "radial-gradient(ellipse at 50% 80%, #ffffff 0%, #ffeaa7 30%, #f39c12 70%, #d35400 100%)", borderRadius: "50% 50% 35% 35% / 60% 60% 40% 40%", boxShadow: "0 0 32px rgba(243, 156, 18, 0.9)", transform: holding ? "rotate(25deg) scale(0.85)" : "rotate(0deg)" }} />
        ) : (
          <div style={{ width: "4px", height: "30px", background: "linear-gradient(to top, rgba(120,80,90,0.8), transparent)", animation: "smoke 2.2s ease-out forwards" }} />
        )}
        <div style={{ width: "48px", height: "115px", background: "linear-gradient(135deg, #f6e7c6 0%, #e9cfa0 50%, #c9a25e 100%)", borderRadius: "4px 4px 6px 6px", border: "1px solid rgba(201, 162, 94, 0.6)" }} />
      </button>
      <p style={{ color: blown ? "var(--bronze)" : "var(--gold)", fontSize: "0.85rem", fontStyle: "italic" }}>
        {blown ? "Geser ke kanan untuk membaca surat →" : "Lilin harus ditiup sebelum lanjut membaca"}
      </p>
    </div>
  );
}
```

---

## 8. Bab II: Surat Cinta
**File:** `components/pages/LetterScene.tsx`
- Memuat efek blur-to-focus bertahap per paragraf dengan CSS keyframe `blurIn`.
- Drop cap karakter pertama di paragraf 1.

---

## 9. Bab III: Album Polaroid
**File:** `components/pages/AlbumScene.tsx`
- Kartu polaroid berputar miring (-2.5deg / +2.5deg).
- Tap foto → mengaktifkan filter dari `blur(2.5px) sepia(0.85)` menjadi `none`.
- Tap lagi → membuka Fullscreen Lightbox Modal.

---

## 10. Bab IV: Jejak Langkah
**File:** `components/pages/TimelineScene.tsx`
- Timeline vertikal dengan garis emas `rgba(201, 162, 94, 0.5)` dan titik bercahaya `boxShadow: 0 0 8px rgba(201, 162, 94, 0.7)`.

---

## 11. Bab V: Piringan Hitam & Spotify
**File:** `components/pages/MusicScene.tsx`
- Piringan hitam (*vinyl*) berputar dengan CSS animasi `@keyframes spin`.
- Iframe Spotify Embed Player `https://open.spotify.com/embed/track/{id}`.
- Auto-ducking pada ambient audio saat lagu diputar.

---

## 12. Bab VI: Kupon Hadiah
**File:** `components/pages/CouponsScene.tsx`
- Tiket bergaya vintage dengan takik radial kiri `transform: translate(-8px, 6px) rotate(-8deg)`.
- Disimpan di `localStorage` melalui `useBook().couponsTorn`.

---

## 13. Bab VII: Peta Bintang
**File:** `components/pages/StarsScene.tsx`
- Peta langit malam bulat dengan garis rasi bintang SVG dan 7 bintang yang bisa disentuh (Sirius, Vega, Altair, Polaris, Capella, Spica, Rigel) menampilkan pesan cinta tersembunyi.

---

## 14. Bab VIII: Toples Alasan
**File:** `components/pages/JarScene.tsx`
- Toples kaca bergradien lembut berisi 9 gulungan kertas.
- Fungsi `pickRandom()` mengambil alasan cinta tanpa pengulangan disertai efek suara denting *chime* magis.

---

## 15. Bab IX: Epilog
**File:** `components/pages/EpilogueScene.tsx`
- Perhitungan otomatis hari bersama sejak `anniversaryISO` (`Math.floor((now - start) / 86400000)`).
- Surat ekstra terkunci *"Surat Bersegel Tahun Depan"*.
- Tombol reset kupon dan baca ulang dari awal.

---

## 16. Web Audio SFX Engine
**File:** `components/audio/SoundEngine.ts`

Memakai Web Audio API murni untuk menghasilkan audio organik tanpa ketergantungan file eksternal:
- `playPageTurn()`: Bandpass filtered white noise untuk simulasi gesekan kertas.
- `playBlow()`: Lowpass filtered soft noise untuk tiupan lilin.
- `playWaxCrack()`: Triangle oscillator frequency drop untuk suara pecah segel.
- `playTear()`: Highpass noise burst untuk sobekan tiket kupon.
- `playChime()`: Akor harmonik C5-E5-G5-C6 untuk pembukaan gulungan toples.
- `startAmbient()`: Akor pad A-Major 7th hangat dengan LFO modulator untuk relaksasi.

---

## 17. Manifest Slot Aset
**File:** `assets/manifest.ts`

Daftar slot aset sesuai PRD §8.2:
- `cover.leather`: Tekstur kulit buku.
- `cover.seal`: Foto segel lilin inisial.
- `scene.night` & `scene.dawn`: Latar malam dan fajar lukisan sinematik.
- `candle.body`, `candle.flameIdle`, `candle.flameOut`: Aset lilin nyata.
- `album.photo1` s/d `album.photo4`: Foto polaroid kenangan.
- `music.turntable`, `music.vinyl`, `music.tonearm`: Objek meja putar musik.
- `jar.image`: Toples kaca.

---

## 18. Skema Konten Pribadi
**Folder:** `content/`
- `site.ts`: `recipientName`, `senderName`, `birthdayISO`, `anniversaryISO`, `previewKey`.
- `letter.ts`: Array paragraf surat cinta.
- `album.ts`: Array spreads foto, washi tape, dan caption.
- `timeline.ts`: Array tanggal, judul, dan cerita perjalanan.
- `tracks.ts`: Array lagu Spotify, artis, dan catatan pribadi.
- `coupons.ts`: Array tiket kupon hadiah.
- `reasons.ts`: Array 20 alasan di dalam toples.

---

Dokumentasi ini siap dijadikan referensi koreksi mendalam. Silakan kirimkan bagian mana saja yang ingin kamu ubah, dan saya akan perbarui kodenya secara presisi!