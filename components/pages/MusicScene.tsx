"use client";
import { useEffect, useRef, useState } from "react";
import { tracks } from "@/content/tracks";
import { sounds } from "@/components/audio/SoundEngine";
import { VineCorners } from "@/components/ui/VineCorners";
import { usePageActive } from "@/hooks/usePageActive";

const FADE_MS = 150;
const ICON_PLAY = "\u25B6";
const ICON_PAUSE = "\u23F8\u23F8";
const ICON_NOTE = "\u266A";

export function MusicScene() {
  const [wrapRef, active] = usePageActive<HTMLDivElement>();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [pending, setPending] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playingRef = useRef(false);
  playingRef.current = playing;

  const cleanTracks = tracks.map((t) => ({
    title: t.title.replace(/^TODO:\s*/, ""),
    artist: t.artist.replace(/^TODO:\s*/, ""),
    note: t.note.replace(/^TODO:\s*/, ""),
    uri: t.spotifyUri.replace(/^TODO:\s*/, ""),
  }));
  const current = cleanTracks[selectedIdx] || cleanTracks[0];
  const trackIdMatch = current.uri.match(/track[:/]([a-zA-Z0-9]+)/);
  const spotifyTrackId = trackIdMatch ? trackIdMatch[1] : "08mG3Y1vljYA6bvDt4Wqkj";

  const embedBase = `https://open.spotify.com/embed/track/${spotifyTrackId}?utm_source=generator&theme=0`;
  const embedSrc = playing ? `${embedBase}&autoplay=1` : embedBase;

  useEffect(() => {
    setIframeReady(false);
  }, [embedSrc]);

  const clearTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const stop = () => {
    clearTimer();
    setPending(false);
    if (playingRef.current) {
      setPlaying(false);
      sounds.duckAmbient(false);
    }
  };

  const requestPlay = (idx?: number) => {
    if (typeof idx === "number" && idx === selectedIdx && playing) return;
    clearTimer();
    setPending(true);
    sounds.duckAmbient(true);
    timer.current = setTimeout(() => {
      if (typeof idx === "number") setSelectedIdx(idx);
      setPlaying(true);
      setPending(false);
      timer.current = null;
    }, FADE_MS);
  };

  const toggleDisc = () => {
    if (pending) return;
    if (playing) stop();
    else requestPlay();
  };

  const pickTrack = (idx: number) => {
    if (pending) return;
    if (idx === selectedIdx && playing) {
      stop();
      return;
    }
    requestPlay(idx);
  };

  useEffect(() => {
    if (!active) stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(
    () => () => {
      clearTimer();
      if (playingRef.current) sounds.duckAmbient(false);
    },
    [],
  );

  const showPlayer = playing && iframeReady;
  const showLoading = playing && !iframeReady;
  const statusText = pending ? "Menyiapkan..." : playing ? ICON_NOTE + " Melodi berputar... (Audio latar diredupkan)" : "Ketuk piringan hitam atau putar lagu di Spotify";

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
            <button
              type="button"
              onClick={toggleDisc}
              aria-label={playing ? "Jeda lagu" : "Putar lagu"}
              aria-disabled={pending}
              style={{
                width: "135px",
                height: "135px",
                borderRadius: "50%",
                background: "radial-gradient(circle, #2c3e50 0%, #1a252f 40%, #000000 70%, #111 100%)",
                border: "3px solid var(--gold)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.45), inset 0 0 10px rgba(201,162,94,0.3)",
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
                animation: playing ? "spin 5s linear infinite" : "none",
                position: "relative",
                padding: 0,
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
                {playing ? ICON_PAUSE : ICON_PLAY}
              </span>
            </button>
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
            {showLoading && (
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
            {active && (
              <iframe
                key="spotify-embed"
                src={embedSrc}
                width="100%"
                height="80"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                onLoad={() => setIframeReady(true)}
                title="Spotify Embed Player"
                style={{ display: showPlayer ? "block" : "none" }}
              />
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "0.4rem", marginTop: "0.4rem" }}>
            {cleanTracks.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => pickTrack(i)}
                aria-disabled={pending}
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
