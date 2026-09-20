"use client";
import { letter } from "@/content/letter";
import { site } from "@/content/site";
import { VineCorners } from "@/components/ui/VineCorners";

export function LetterScene() {
  const paragraphs = letter.paragraphs.map((p) =>
    p.startsWith("TODO:")
      ? p.replace(/^TODO:\s*/, "")
      : p
  );

  const sender = site.senderName.startsWith("TODO") ? "Firas" : site.senderName;

  return (
    <div
      className="paper"
      style={{
        padding: "2.2rem 1.6rem 2rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        minHeight: "100%",
        overflowY: "auto",
        position: "relative",
      }}
    >
      <div className="paper-frame" />
      <VineCorners />

      <div style={{ position: "relative", zIndex: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid rgba(185, 139, 74, 0.35)", paddingBottom: "0.4rem", marginBottom: "1.2rem" }}>
          <span style={{ color: "var(--bronze)", fontStyle: "italic", fontSize: "0.8rem", letterSpacing: "0.1em" }}>
            Bab II · Surat Cinta
          </span>
          <span style={{ color: "var(--bronze)", fontSize: "0.75rem", fontStyle: "italic" }}>
            Malam Ulang Tahunmu
          </span>
        </div>

        <h2
          style={{
            fontFamily: "var(--serif)",
            color: "var(--ink)",
            fontSize: "1.55rem",
            margin: "0 0 1.2rem",
            fontWeight: 600,
          }}
        >
          Sebuah Surat Untukmu
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
          {paragraphs.map((para, i) => (
            <p
              key={i}
              className="letter-para"
              style={{
                color: "var(--ink)",
                lineHeight: 1.85,
                fontSize: "0.96rem",
                margin: 0,
                textAlign: "justify",
                animation: `blurIn 1.2s ease forwards ${i * 0.3}s`,
                opacity: 0,
              }}
            >
              {i === 0 && (
                <span
                  style={{
                    float: "left",
                    fontSize: "2.9rem",
                    lineHeight: "0.8",
                    padding: "0.3rem 0.5rem 0 0",
                    color: "var(--bronze)",
                    fontFamily: "var(--serif)",
                    fontWeight: "bold",
                  }}
                >
                  {para.charAt(0) || "A"}
                </span>
              )}
              {i === 0 ? para.slice(1) : para}
            </p>
          ))}
        </div>
      </div>

      {/* Tanda Tangan */}
      <div style={{ marginTop: "2rem", textAlign: "right", borderTop: "1px dashed rgba(185, 139, 74, 0.35)", paddingTop: "0.8rem", position: "relative", zIndex: 12 }}>
        <p style={{ color: "var(--ink)", fontStyle: "italic", fontSize: "0.85rem", margin: "0 0 0.2rem" }}>
          Dengan segenap sayang & doa,
        </p>
        <span
          style={{
            fontFamily: "var(--serif)",
            color: "var(--bronze)",
            fontSize: "1.35rem",
            fontStyle: "italic",
            fontWeight: "bold",
          }}
        >
          {sender}
        </span>
      </div>

      <style jsx>{`
        @keyframes blurIn {
          0% {
            opacity: 0;
            filter: blur(8px);
            transform: translateY(6px);
          }
          100% {
            opacity: 1;
            filter: blur(0px);
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}