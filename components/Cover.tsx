"use client";

interface Props {
  onOpen: () => void;
}

export function Cover({ onOpen }: Props) {
  return (
    <div
      className="cover"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem 1.5rem",
        gap: "1.2rem",
      }}
    >
      <div style={{ fontSize: "2rem", color: "var(--gold)" }}>✦</div>
      <p
        style={{
          color: "var(--gold)",
          letterSpacing: "0.2em",
          fontSize: "0.8rem",
          textTransform: "uppercase",
          margin: 0,
        }}
      >
        sebuah dongeng ulang tahun
      </p>
      <h1
        className="foil"
        style={{
          fontSize: "clamp(2rem, 8vw, 2.6rem)",
          margin: 0,
          fontFamily: "var(--serif)",
          fontWeight: 600,
          lineHeight: 1.15,
        }}
      >
        Kisah Adelia
      </h1>
      <p
        style={{
          color: "var(--champagne)",
          fontStyle: "italic",
          maxWidth: "260px",
          margin: 0,
          fontSize: "0.95rem",
          opacity: 0.9,
        }}
      >
        sebuah buku kecil yang dirajut khusus untuk hari ulang tahunmu
      </p>
      <button
        type="button"
        className="btn"
        onClick={onOpen}
        style={{ marginTop: "1.5rem" }}
      >
        Buka buku
      </button>
    </div>
  );
}