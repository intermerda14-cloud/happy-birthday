"use client";

interface Props {
  onOpen: () => void;
}

export function Cover({ onOpen }: Props) {
  return (
    <div className="cover inner" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", gap: "1rem" }}>
      <p style={{ color: "var(--gold)", letterSpacing: "0.2em", fontSize: "0.85rem", textTransform: "uppercase" }}>
        sebuah dongeng ulang tahun
      </p>
      <h1 className="foil" style={{ fontSize: "2.4rem", margin: 0, fontFamily: "var(--serif)" }}>
        Kisah Adelia
      </h1>
      <p style={{ color: "var(--champagne)", fontStyle: "italic", maxWidth: "260px" }}>
        sebuah buku kecil untuk hari spesialmu
      </p>
      <button className="btn" onClick={onOpen} style={{ marginTop: "1rem" }}>
        Buka buku
      </button>
    </div>
  );
}