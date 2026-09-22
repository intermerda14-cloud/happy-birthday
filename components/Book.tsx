"use client";
import { BookProvider, useBook } from "./BookProvider";
import { PageTurner } from "./PageTurner";
import { Cover } from "./Cover";
import { CandleScene } from "./pages/CandleScene";
import { LetterScene } from "./pages/LetterScene";
import { AlbumScene } from "./pages/AlbumScene";
import { CardScene } from "./pages/CardScene";
import { MusicScene } from "./pages/MusicScene";
import { OpenWhenScene } from "./pages/OpenWhenScene";
import { StarsScene } from "./pages/StarsScene";
import { JarScene } from "./pages/JarScene";
import { EpilogueScene } from "./pages/EpilogueScene";
import { SoundToggle } from "./audio/SoundToggle";
import { sfx } from "@/lib/sfx";

function BookContent() {
  const { state, dispatch } = useBook();

  // Gate navigasi lilin: Bab 2 ke atas hanya bisa dibuka jika lilin sudah ditiup
  const canAdvance = (pageIdx: number) => {
    if (pageIdx === 0) {
      const forced = process.env.NEXT_PUBLIC_PREVIEW === "1";
      return state.isUnlocked || forced;
    }
    if (pageIdx === 1) return state.candleBlown;
    return true;
  };

  const handleOpen = () => {
    sfx("startAmbient");
    dispatch({ type: "OPEN" });
  };

  const handleChange = (i: number) => {
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
            dispatch({ type: "BLOW_CANDLE" });
          }}
        />
        <LetterScene />
        <AlbumScene />
        <CardScene />
        <MusicScene />
        <OpenWhenScene />
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