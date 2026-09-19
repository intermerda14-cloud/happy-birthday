"use client";
import { useBook } from "@/components/BookProvider";
import { site } from "@/content/site";

export function EpilogueScene() {
  const { dispatch } = useBook();

  const recipient = site.recipientName.startsWith("TODO") ? "Adelia" : site.recipientName;
  const sender = site.senderName.startsWith("TODO") ? "Firas" : site.senderName;

  return (
    <div
      className="paper"
      style={{
        padding: "2.5rem 1.5rem 2rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100%",
        textAlign: "center",
        overflowY: "auto",
      }}
    >
      <div>
        <div style={{ fontSize: "2rem", color: "var(--gold)", marginBottom: "0.5rem" }}>✦</div>
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
            fontSize: "1.8rem",
            margin: "0.5rem 0 1.2rem",
            fontWeight: 600,
          }}
        >
          Bersambung ke Tahun Berikutnya
        </h2>

        <p style={{ color: "var(--ink)", lineHeight: 1.8, fontSize: "0.95rem", maxWidth: "300px", margin: "0 auto 1.5rem" }}>
          Selamat bertambah usia, <strong>{recipient}</strong>. Terima kasih telah hadir dan memberi warna di setiap detik perjalanan ini.
        </p>

        <div style={{ background: "rgba(217, 160, 176, 0.2)", padding: "1rem", borderRadius: "6px", border: "1px solid rgba(185, 139, 74, 0.3)", maxWidth: "280px", margin: "0 auto" }}>
          <p style={{ color: "var(--bronze)", fontStyle: "italic", fontSize: "0.85rem", margin: 0, lineHeight: 1.5 }}>
            &ldquo;Semoga langkahmu selalu dipeluk bahagia, dan impianmu menemukan jalan terindahnya.&rdquo;
          </p>
          <span style={{ display: "block", marginTop: "0.5rem", color: "var(--ink)", fontWeight: "bold", fontSize: "0.9rem" }}>
            — {sender}
          </span>
        </div>
      </div>

      {/* Aksi Baca Ulang & Reset */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.6rem", alignItems: "center", marginTop: "1.5rem" }}>
        <button
          type="button"
          className="btn"
          onClick={() => dispatch({ type: "RESTART" })}
          style={{ width: "100%", maxWidth: "220px", fontSize: "0.9rem" }}
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
            padding: "0.3rem",
          }}
        >
          Reset semua kupon
        </button>
      </div>
    </div>
  );
}