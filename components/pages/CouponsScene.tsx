"use client";
import { coupons } from "@/content/coupons";
import { useBook } from "@/components/BookProvider";

export function CouponsScene() {
  const { state, dispatch } = useBook();

  const cleanCoupons = coupons.map((c) => ({
    id: c.id.replace(/^TODO:\s*/, ""),
    title: c.title.replace(/^TODO:\s*/, ""),
    text: c.text.replace(/^TODO:\s*/, ""),
  }));

  const handleTear = (id: string) => {
    dispatch({ type: "TEAR_COUPON", id });
  };

  return (
    <div
      className="paper"
      style={{
        padding: "1.8rem 1.2rem",
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
            Bab VI · Hadiah Kecil
          </span>
          <span style={{ color: "var(--bronze)", fontSize: "0.75rem", fontStyle: "italic" }}>
            Kupon Spesial
          </span>
        </div>

        <h2
          style={{
            fontFamily: "var(--serif)",
            color: "var(--ink)",
            fontSize: "1.4rem",
            margin: "0 0 0.8rem",
            fontWeight: 600,
          }}
        >
          Kupon Kasih Sayang
        </h2>
        <p style={{ color: "var(--ink)", fontSize: "0.85rem", fontStyle: "italic", margin: "0 0 1.2rem", opacity: 0.85 }}>
          Kupon ini berlaku kapan pun kamu ingin menggunakannya. Tekan &ldquo;Tukar&rdquo; untuk menyobek tiket.
        </p>

        {/* List Tiket Kupon */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {cleanCoupons.map((coupon, i) => {
            const isTorn = state.couponsTorn[coupon.id || `coupon-${i}`];

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  background: "linear-gradient(135deg, #f7e8cc 0%, #ecd0a2 100%)",
                  border: "1px solid var(--gold)",
                  borderRadius: "6px",
                  boxShadow: "0 4px 12px rgba(58, 29, 63, 0.15)",
                  position: "relative",
                  overflow: "hidden",
                  opacity: isTorn ? 0.75 : 1,
                  transition: "all 0.3s ease",
                }}
              >
                {/* Bagian Sobekan Tiket Kiri */}
                <div
                  style={{
                    width: "50px",
                    display: "grid",
                    placeItems: "center",
                    borderRight: "2px dashed rgba(58, 29, 63, 0.35)",
                    background: isTorn ? "rgba(0,0,0,0.06)" : "transparent",
                    color: "var(--bronze)",
                    fontSize: "1.2rem",
                    transform: isTorn ? "translate(-8px, 6px) rotate(-8deg)" : "none",
                    transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                >
                  {isTorn ? "✂" : "✦"}
                </div>

                {/* Konten Tiket */}
                <div style={{ padding: "0.8rem 1rem", flex: 1, textAlign: "left" }}>
                  <h3 style={{ fontFamily: "var(--serif)", color: "var(--ink)", fontSize: "1rem", margin: "0 0 0.2rem", fontWeight: 600 }}>
                    {coupon.title || `Kupon Istimewa #${i + 1}`}
                  </h3>
                  <p style={{ color: "var(--ink)", fontSize: "0.82rem", margin: "0 0 0.6rem", lineHeight: 1.4, opacity: 0.85 }}>
                    {coupon.text || "Bebas digunakan untuk satu permintaan apa saja."}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleTear(coupon.id || `coupon-${i}`)}
                    disabled={isTorn}
                    style={{
                      background: isTorn ? "var(--mint)" : "var(--ink)",
                      color: isTorn ? "var(--ink)" : "#fff",
                      border: "none",
                      borderRadius: "3px",
                      padding: "0.35rem 0.8rem",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      cursor: isTorn ? "default" : "pointer",
                      transition: "background 0.2s",
                    }}
                  >
                    {isTorn ? "✓ Kupon Ditukar" : "Tukar Kupon"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <span style={{ color: "var(--bronze)", fontStyle: "italic", fontSize: "0.8rem" }}>
          ~ status kupon tersimpan otomatis di perangkatmu ~
        </span>
      </div>
    </div>
  );
}