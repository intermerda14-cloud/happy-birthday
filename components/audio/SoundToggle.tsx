"use client";
import { useState, useEffect } from "react";
import { sounds } from "./SoundEngine";

export function SoundToggle() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setEnabled(sounds.getEnabled());
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    sounds.setEnabled(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={enabled ? "Matikan Suara" : "Nyalakan Suara"}
      style={{
        position: "absolute",
        top: "14px",
        right: "14px",
        zIndex: 100,
        background: "rgba(42, 18, 48, 0.75)",
        border: "1px solid var(--gold)",
        borderRadius: "50%",
        width: "36px",
        height: "36px",
        display: "grid",
        placeItems: "center",
        color: enabled ? "var(--champagne)" : "rgba(233, 207, 160, 0.4)",
        cursor: "pointer",
        backdropFilter: "blur(6px)",
        fontSize: "0.9rem",
        transition: "all 0.2s ease",
      }}
    >
      {enabled ? "🔊" : "🔇"}
    </button>
  );
}