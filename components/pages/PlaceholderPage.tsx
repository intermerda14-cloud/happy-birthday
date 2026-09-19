"use client";

interface Props {
  no: number;
  title: string;
}

export function PlaceholderPage({ no, title }: Props) {
  return (
    <div
      className="paper"
      style={{
        padding: "2rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: "2px",
      }}
    >
      <div>
        <span
          style={{
            color: "var(--bronze)",
            fontStyle: "italic",
            fontSize: "0.85rem",
            letterSpacing: "0.05em",
          }}
        >
          Bab {no}
        </span>
        <h2
          style={{
            fontFamily: "var(--serif)",
            color: "var(--ink)",
            fontSize: "1.6rem",
            margin: "0.5rem 0 1rem",
            fontWeight: 600,
          }}
        >
          {title}
        </h2>
        <p
          style={{
            color: "var(--ink)",
            lineHeight: 1.75,
            fontSize: "0.95rem",
            margin: 0,
            opacity: 0.9,
          }}
        >
          Isi bab ini sedang dirajut dengan kata-kata, foto, dan kenangan. Di
          Fase 1 nanti, halaman ini akan digantikan konten interaktif lengkap
          (lilin tiup, surat cinta, album polaroid, dan lagu Spotify).
        </p>
      </div>
      <div
        style={{
          textAlign: "center",
          color: "var(--bronze)",
          fontStyle: "italic",
          fontSize: "0.85rem",
          marginTop: "2rem",
        }}
      >
        ~ folio {no} ~
      </div>
    </div>
  );
}