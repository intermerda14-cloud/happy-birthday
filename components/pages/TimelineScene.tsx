"use client";
import { timeline } from "@/content/timeline";

export function TimelineScene() {
  const milestones = timeline.milestones.map((m) => ({
    date: m.date.replace(/^TODO:\s*/, ""),
    title: m.title.replace(/^TODO:\s*/, ""),
    text: m.text.replace(/^TODO:\s*/, ""),
  }));

  return (
    <div
      className="paper"
      style={{
        padding: "1.8rem 1.4rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        overflowY: "auto",
      }}
    >
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid rgba(185, 139, 74, 0.3)", paddingBottom: "0.4rem", marginBottom: "1rem" }}>
          <span style={{ color: "var(--bronze)", fontStyle: "italic", fontSize: "0.8rem", letterSpacing: "0.1em" }}>
            Bab IV · Jejak Langkah
          </span>
          <span style={{ color: "var(--bronze)", fontSize: "0.75rem", fontStyle: "italic" }}>
            Perjalanan Kita
          </span>
        </div>

        <h2
          style={{
            fontFamily: "var(--serif)",
            color: "var(--ink)",
            fontSize: "1.4rem",
            margin: "0 0 1.2rem",
            fontWeight: 600,
          }}
        >
          Langkah Demi Langkah
        </h2>

        {/* Jalur Vertikal Timeline */}
        <div style={{ position: "relative", paddingLeft: "1.2rem", borderLeft: "2px solid rgba(201, 162, 94, 0.4)", display: "flex", flexDirection: "column", gap: "1.2rem", marginLeft: "0.4rem" }}>
          {milestones.map((item, idx) => (
            <div key={idx} style={{ position: "relative" }}>
              {/* Titik Emas */}
              <div
                style={{
                  position: "absolute",
                  left: "-1.55rem",
                  top: "0.2rem",
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "var(--gold)",
                  border: "2px solid var(--paper)",
                  boxShadow: "0 0 6px rgba(201, 162, 94, 0.6)",
                }}
              />
              <span style={{ color: "var(--bronze)", fontSize: "0.75rem", fontStyle: "italic", display: "block" }}>
                {item.date || "Suatu Hari"}
              </span>
              <h3 style={{ fontFamily: "var(--serif)", color: "var(--ink)", fontSize: "1rem", margin: "0.1rem 0 0.3rem", fontWeight: 600 }}>
                {item.title || `Momen #${idx + 1}`}
              </h3>
              <p style={{ color: "var(--ink)", fontSize: "0.88rem", lineHeight: 1.5, margin: 0, opacity: 0.85 }}>
                {item.text || "Cerita indah yang takkan pernah pudar di ingatan."}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "1.2rem" }}>
        <span style={{ color: "var(--bronze)", fontStyle: "italic", fontSize: "0.8rem" }}>
          ~ dan masih banyak bab yang akan kita tulis ~
        </span>
      </div>
    </div>
  );
}