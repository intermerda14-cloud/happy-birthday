"use client";
import { BookProvider, useBook } from "./BookProvider";
import { PageTurner } from "./PageTurner";
import { Cover } from "./Cover";
import { CandleScene } from "./pages/CandleScene";
import { LetterScene } from "./pages/LetterScene";
import { AlbumScene } from "./pages/AlbumScene";
import { TimelineScene } from "./pages/TimelineScene";
import { MusicScene } from "./pages/MusicScene";
import { CouponsScene } from "./pages/CouponsScene";
import { EpilogueScene } from "./pages/EpilogueScene";

function BookContent() {
  const { state, dispatch } = useBook();

  // Gate navigasi lilin: halaman selanjutnya baru boleh dibuka kalau lilin sudah ditiup
  const canAdvance = (pageIdx: number) => {
    if (pageIdx === 1) return state.candleBlown;
    return true;
  };

  return (
    <PageTurner
      index={state.index}
      onChange={(i) => dispatch({ type: "TURN", to: i })}
      canAdvance={canAdvance}
    >
      <Cover
        isUnlocked={state.isUnlocked}
        onOpen={() => dispatch({ type: "OPEN" })}
      />
      <CandleScene
        blown={state.candleBlown}
        onBlow={() => dispatch({ type: "BLOW_CANDLE" })}
      />
      <LetterScene />
      <AlbumScene />
      <TimelineScene />
      <MusicScene />
      <CouponsScene />
      <EpilogueScene />
    </PageTurner>
  );
}

export function Book() {
  return (
    <BookProvider>
      <BookContent />
    </BookProvider>
  );
}