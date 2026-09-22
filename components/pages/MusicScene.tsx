"use client";
import { useEffect, useRef, useState } from "react";
import { tracks } from "@/content/tracks";
import { sounds } from "@/components/audio/SoundEngine";
import { VineCorners } from "@/components/ui/VineCorners";
import { usePageActive } from "@/hooks/usePageActive";

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (IFrameAPI: SpotifyIFrameAPI) => void;
  }
}

interface SpotifyEmbedController {
  loadUri: (uri: string) => void;
  play: () => void;
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
  addListener: (event: string, cb: (e: { data: { isPaused: boolean; isBuffering?: boolean } }) => void) => void;
  removeListener: (event: string) => void;
  destroy: () => void;
}

interface SpotifyIFrameAPI {
  createController: (
    element: HTMLElement,
    options: { uri: string; width?: string | number; height?: string | number },
    callback: (controller: SpotifyEmbedController) => void,
  ) => void;
}

const ICON_NOTE = "\u266A";

let spotifyApiPromise: Promise<SpotifyIFrameAPI> | null = null;

function loadSpotifyIframeApi(): Promise<SpotifyIFrameAPI> {
  if (spotifyApiPromise) return spotifyApiPromise;
  spotifyApiPromise = new Promise((resolve) => {
    if (typeof window === "undefined") return;
    const existingCallback = window.onSpotifyIframeApiReady;
    window.onSpotifyIframeApiReady = (IFrameAPI: SpotifyIFrameAPI) => {
      existingCallback?.(IFrameAPI);
      resolve(IFrameAPI);
    };
    if (document.getElementById("spotify-iframe-api-script")) return;
    const script = document.createElement("script");
    script.id = "spotify-iframe-api-script";
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;
    document.body.appendChild(script);
  });
  return spotifyApiPromise;
}

export function MusicScene() {
  const [wrapRef, active] = usePageActive<HTMLDivElement>();
  const mountRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<SpotifyEmbedController | null>(null);
  const initializedRef = useRef(false);

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [controllerReady, setControllerReady] = useState(false);

  const cleanTracks = tracks.map((t) => ({
    title: t.title.replace(/^TODO:\s*/, ""),
    artist: t.artist.replace(/^TODO:\s*/, ""),
    note: t.note.replace(/^TODO:\s*/, ""),
    uri: t.spotifyUri.replace(/^TODO:\s*/, ""),
  }));
  const current = cleanTracks[selectedIdx] || cleanTracks[0];

  useEffect(() => {
    if (!active || initializedRef.current) return;
    let cancelled = false;

    loadSpotifyIframeApi().then((IFrameAPI) => {
      if (cancelled || !mountRef.current) return;
      IFrameAPI.createController(
        mountRef.current,
        { uri: cleanTracks[0]?.uri || "", width: "100%", height: "80" },
        (controller) => {
          if (cancelled) return;
          // Baru ditandai "initialized" setelah controller BENAR-BENAR berhasil dibuat --
          // supaya kalau attempt pertama batal di tengah jalan (misal "active" sempat balik
          // false sesaat sebelum controller kelar dibuat, saat transisi halaman), effect
          // berikutnya masih bisa coba lagi, bukan macet permanen selamanya.
          initializedRef.current = true;
          controllerRef.current = controller;
          setControllerReady(true);

          // Catatan: event playback_update dari Spotify iFrame API terbukti tidak reliable
          // (browser dengan storage partitioning me-reload iframe internal, memutus koneksi
          // postMessage). Duck ambient sepenuhnya berbasis status halaman aktif (lihat effect
          // terpisah di bawah), bukan status play/pause Spotify.
        },
      );
    });

    // Catatan (patch): controller SENGAJA tidak di-destroy() saat "active" berubah jadi
    // false (pindah halaman). Destroy+recreate berulang saat toggle cepat terbukti memicu
    // race condition di script internal Spotify sendiri (insertBefore NotFoundError) karena
    // destroy() bisa kepanggil di tengah proses internal iframe yang belum selesai. Controller
    // cuma dibuat SEKALI (guard initializedRef) dan cuma di-destroy saat MusicScene benar-benar
    // unmount (lihat effect terpisah di bawah).
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Destroy controller hanya sekali, saat MusicScene benar-benar unmount dari DOM.
  useEffect(() => {
    return () => {
      controllerRef.current?.destroy();
      controllerRef.current = null;
    };
  }, []);

  // Duck ambient sepenuhnya berbasis halaman aktif: masuk Bab V -> ambient redup,
  // pindah halaman -> ambient balik normal. Reliable karena tidak bergantung pada
  // event Spotify yang terbukti bisa putus akibat storage access reload.
  useEffect(() => {
    sounds.duckAmbient(active);
    return () => {
      sounds.duckAmbient(false);
    };
  }, [active]);

  const pickTrack = (idx: number) => {
    setSelectedIdx(idx);
    const uri = cleanTracks[idx]?.uri;
    if (uri && controllerRef.current) {
      controllerRef.current.loadUri(uri);
    }
  };

  const statusText = "Putar lagu langsung dari widget Spotify di bawah (audio latar otomatis diredupkan)";

  return (
    <>
      <link rel="preconnect" href="https://open.spotify.com" />
      <link rel="preconnect" href="https://i.scdn.co" />
      <div
        ref={wrapRef as React.RefObject<HTMLDivElement>}
        className="paper"
        style={{
          padding: "2rem 1.4rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          overflowY: "auto",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div className="paper-frame" />
        <VineCorners />

        <div style={{ position: "relative", zIndex: 12 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              borderBottom: "1px solid rgba(185, 139, 74, 0.35)",
              paddingBottom: "0.4rem",
              marginBottom: "0.8rem",
            }}
          >
            <span style={{ color: "var(--bronze)", fontStyle: "italic", fontSize: "0.8rem", letterSpacing: "0.1em" }}>Bab V - Lagu Kita</span>
            <span style={{ color: "var(--bronze)", fontSize: "0.75rem", fontStyle: "italic" }}>Melodi & Makna</span>
          </div>

          <h2
            style={{
              fontFamily: "var(--serif)",
              color: "var(--ink)",
              fontSize: "1.45rem",
              margin: "0 0 0.8rem",
              fontWeight: 600,
            }}
          >
            Piringan Nada Favorit
          </h2>

          <div style={{ display: "flex", justifyContent: "center", margin: "0.6rem 0" }}>
            <div
              aria-hidden="true"
              style={{
                width: "135px",
                height: "135px",
                borderRadius: "50%",
                background: "radial-gradient(circle, #2c3e50 0%, #1a252f 40%, #000000 70%, #111 100%)",
                border: "3px solid var(--gold)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.45), inset 0 0 10px rgba(201,162,94,0.3)",
                display: "grid",
                placeItems: "center",
                animation: active ? "spin 5s linear infinite" : "none",
                position: "relative",
              }}
            >
              <span
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, var(--champagne), var(--gold))",
                  border: "2px solid #fff",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "0.9rem",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                }}
              >
                {ICON_NOTE}
              </span>
            </div>
          </div>

          <div style={{ margin: "0.6rem 0" }}>
            <h3 style={{ fontFamily: "var(--serif)", color: "var(--ink)", fontSize: "1.15rem", margin: "0 0 0.2rem", fontWeight: 600 }}>{current.title || "Lagu Kenangan"}</h3>
            <p style={{ color: "var(--bronze)", fontSize: "0.82rem", fontStyle: "italic", margin: "0 0 0.6rem" }}>{current.artist || "Penyanyi Favorit"}</p>
            <div
              style={{
                background: "rgba(217, 160, 176, 0.22)",
                padding: "0.75rem",
                borderRadius: "4px",
                borderLeft: "3px solid var(--rose)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <p style={{ color: "var(--ink)", fontSize: "0.85rem", fontStyle: "italic", margin: 0, lineHeight: 1.5 }}>
                &ldquo;{current.note || "Setiap kali mendengarkan melodi ini, selalu ada senyummu yang terlintas di ingatan."}&rdquo;
              </p>
            </div>
          </div>

          <div style={{ margin: "0.8rem 0", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 14px rgba(0,0,0,0.15)", minHeight: 80, position: "relative" }}>
            {!controllerReady && active && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "grid",
                  placeItems: "center",
                  background: "rgba(217, 160, 176, 0.15)",
                  color: "var(--bronze)",
                  fontSize: "0.78rem",
                  fontStyle: "italic",
                }}
              >
                Memuat Spotify...
              </div>
            )}
            <div ref={mountRef} style={{ minHeight: 80 }} />
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "0.4rem", marginTop: "0.4rem" }}>
            {cleanTracks.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => pickTrack(i)}
                style={{
                  padding: "0.3rem 0.75rem",
                  borderRadius: "14px",
                  border: "1px solid var(--gold)",
                  background: selectedIdx === i ? "var(--ink)" : "transparent",
                  color: selectedIdx === i ? "var(--champagne)" : "var(--ink)",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Lagu {i + 1}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "0.5rem", position: "relative", zIndex: 12 }}>
          <span style={{ color: "var(--bronze)", fontStyle: "italic", fontSize: "0.75rem" }}>{statusText}</span>
        </div>

        <style jsx>{`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </>
  );
}
