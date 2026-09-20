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
import { StarsScene } from "./pages/StarsScene";
import { JarScene } from "./pages/JarScene";
import { EpilogueScene } from "./pages/EpilogueScene";
import { SoundToggle } from "./audio/SoundToggle";
import { sounds } from "./audio/SoundEngine";

function BookContent() {
  const { state, dispatch } = useBook();

  // Gate navigasi lilin: Bab 2 ke atas hanya bisa dibuka jika lilin sudah ditiup
  const canAdvance = (pageIdx: number) => {
    if (pageIdx === 1) return state.candleBlown;
    return true;
  };

  const handleOpen = () => {
    sounds.playWaxCrack();
    sounds.startAmbient();
    dispatch({ type: "OPEN" });
  };

  const handleChange = (i: number) => {
    sounds.playPageTurn();
    dispatch({ type: "TURN", to: i });
  };

  return (
    <>
      <SoundToggle />
      <PageTurner
        index={state.index}
        onChange={handleChange}
        canAdvance={canAdvance}
      >
        <Cover
          isUnlocked={state.isUnlocked}
          onOpen={handleOpen}
        />
        <CandleScene
          blown={state.candleBlown}
          onBlow={() => {
            sounds.playBlow();
            dispatch({ type: "BLOW_CANDLE" });
          }}
        />
        <LetterScene />
        <AlbumScene />
        <TimelineScene />
        <MusicScene />
        <CouponsScene />
        <StarsScene />
        <JarScene />
        <EpilogueScene />
      </PageTurner>
    </>
  );
}

export function Book() {
  return (
    <BookProvider>
      <BookContent />
    </BookProvider>
  );
}