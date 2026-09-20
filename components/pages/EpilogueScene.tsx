"use client";
import { useState, useMemo } from "react";
import { useBook } from "@/components/BookProvider";
import { site } from "@/content/site";
import { sounds } from "@/components/audio/SoundEngine";
import { VineCorners } from "@/components/ui/VineCorners";

export function EpilogueScene() {
  const { dispatch } = useBook();
  const [sealedLetterOpen, setSealedLetterOpen] = useState(false);

  const recipient = site.recipientName.startsWith("TODO") ? "Adelia" : site.recipientName;
  const sender = site.senderName.startsWith("TODO") ? "Firas" : site.senderName;

  const daysTogether = useMemo(() => {
    const annivStr = site.anniversaryISO && !site.anniversaryISO.startsWith("TODO")
      ? site.anniversaryISO
      : "2023-10-14";
    const start = new Date(annivStr).getTime();
    const now = Date.now();
    const diffDays = Math.max(1, Math.floor((now - start) / (1000 * 60 * 60 * 24)));
    return diffDays;
  }, []);

  const handleOpenSealedLetter = () => {
    sounds.playWaxCrack();
    setSealedLetterOpen(true);
  };

  return (
    <div
      className="paper"
      style={{
        padding: "2.2rem 1.5rem 2rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100%",
        textAlign: "center",
        overflowY: "auto",
        position: "relative",
      }}
    >
      <div className="paper-frame" />
      <VineCorners />

      <div style={{ position: "relative", zIndex: 12 }}>
        <div style={{ fontSize: "1.8rem", color: "var(--gold)", marginBottom: "0.2rem" }}>✦</div>
        <span
          style={{
            color: "var(--bronze)",
            letterSpacing: "0.2em",
            fontSize: "0.75rem",
            textTransform: "uppercase",
            fontStyle: "italic",
          }}
        >
          Penutup Dongeng
        </span>
        <h2
          className="foil"
          style={{
            fontFamily: "var(--serif)",
            fontSize: "1.65rem",
            margin: "0.4rem 0 1rem",
            fontWeight: 600,
          }}
        >
          Bersambung ke Tahun Berikutnya
        </h2>

        {/* Counter Hari Bersama */}
        <div style={{ background: "rgba(201, 162, 94, 0.18)", padding: "0.7rem 1.1rem", borderRadius: "6px", border: "1px solid rgba(201, 162, 94, 0.45)", margin: "0 auto 1.2rem", maxWidth: "280px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <span style={{ color: "var(--bronze)", fontSize: "0.75rem", fontStyle: "italic" }}>
            Perjalanan Kita:
          </span>
          <div style={{ color: "var(--ink)", fontFamily: "var(--serif)", fontSize: "1.25rem", fontWeight: "bold" }}>
            {daysTogether} Hari Bersama
          </div>
          <span style={{ color: "var(--bronze)", fontSize: "0.72rem", fontStyle: "italic" }}>
            ...dan masih terus bertambah selamanya.
          </span>
        </div>

        <p style={{ color: "var(--ink)", lineHeight: 1.75, fontSize: "0.92rem", maxWidth: "300px", margin: "0 auto 1.2rem" }}>
          Selamat bertambah usia, <strong>{recipient}</strong>. Terima kasih telah hadir dan memberi warna di setiap detik perjalanan ini.
        </p>

        {/* Surat Bersegel Tahun Depan */}
        <div style={{ margin: "1rem auto", maxWidth: "290px" }}>
          {!sealedLetterOpen ? (
            <button
              type="button"
              onClick={handleOpenSealedLetter}
              style={{
                background: "linear-gradient(135deg, #f7dfcb 0%, #ecd0a2 100%)",
                border: "1px solid var(--gold)",
                borderRadius: "6px",
                padding: "0.85rem 1rem",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(58, 29, 63, 0.18)",
                transition: "transform 0.2s",
              }}
            >
              <div style={{ textAlign: "left" }}>
                <span style={{ color: "var(--ink)", fontFamily: "var(--serif)", fontWeight: "bold", fontSize: "0.88rem", display: "block" }}>
                  ✉ Surat Bersegel Tahun Depan
                </span>
                <span style={{ color: "var(--bronze)", fontSize: "0.72rem", fontStyle: "italic" }}>
                  Ketuk segel untuk membuka intipan doa
                </span>
              </div>
              <span style={{ color: "var(--rose)", fontSize: "1.3rem" }}>🔒</span>
            </button>
          ) : (
            <div
              style={{
                background: "linear-gradient(135deg, #fffdfa 0%, #f7ead9 100%)",
                border: "1px dashed var(--gold)",
                borderRadius: "6px",
                padding: "1rem",
                textAlign: "left",
                animation: "unseal 0.5s ease forwards",
                boxShadow: "0 4px 14px rgba(58,29,63,0.12)",
              }}
            >
              <span style={{ color: "var(--bronze)", fontSize: "0.75rem", fontWeight: "bold", display: "block", marginBottom: "0.3rem" }}>
                💌 Catatan Masa Depan:
              </span>
              <p style={{ color: "var(--ink)", fontSize: "0.85rem", fontStyle: "italic", margin: 0, lineHeight: 1.55 }}>
                &ldquo;Tahun depan, di tanggal yang sama, aku berjanji akan tetap mencintaimu dengan cara yang lebih dalam lagi dari hari ini.&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Aksi Baca Ulang & Reset */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "center", marginTop: "1rem", position: "relative", zIndex: 12 }}>
        <button
          type="button"
          className="btn"
          onClick={() => {
            sounds.playPageTurn();
            dispatch({ type: "RESTART" });
          }}
          style={{ width: "100%", maxWidth: "220px", fontSize: "0.9rem", padding: "0.75rem" }}
        >
          ↺ Baca Dari Awal
        </button>
        <button
          type="button"
          onClick={() => {
            if (confirm("Reset status kupon yang sudah ditukar?")) {
              dispatch({ type: "RESET_COUPONS" });
            }
          }}
          style={{
            background: "none",
            border: "none",
            color: "var(--bronze)",
            fontSize: "0.75rem",
            fontStyle: "italic",
            cursor: "pointer",
            textDecoration: "underline",
            padding: "0.2rem",
          }}
        >
          Reset status kupon
        </button>
      </div>

      <style jsx>{`
        @keyframes unseal {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}