"use client";

interface Props {
  no: number;
  title: string;
}

export function PlaceholderPage({ no, title }: Props) {
  return (
    <div className="paper" style={{ padding: "2rem 1rem", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <span style={{ color: "var(--bronze)", fontStyle: "italic", fontSize: "0.85rem" }}>
          Bab {no}
        </span>
        <h2 style={{ fontFamily: "var(--serif)", color: "var(--ink)", marginTop: "0.4rem" }}>
          {title}
        </h2>
        <p style={{ color: "var(--ink)", lineHeight: 1.7, opacity: 0.85, marginTop: "1rem" }}>
          Isi bab ini sedang dirajut dengan kata-kata, foto, dan kenangan. Halaman ini sudah bisa kamu balik di HP.
        </p>
      </div>
      <div style={{ textAlign: "center", color: "var(--bronze)", fontStyle: "italic", fontSize: "0.85rem" }}>
        ~ folio {no} ~
      </div>
    </div>
  );
}