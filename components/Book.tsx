"use client";
import { BookProvider, useBook } from "./BookProvider";
import { PageTurner } from "./PageTurner";
import { Cover } from "./Cover";
import { PlaceholderPage } from "./pages/PlaceholderPage";

function BookContent() {
  const { state, dispatch } = useBook();

  return (
    <PageTurner
      index={state.index}
      onChange={(i) => dispatch({ type: "TURN", to: i })}
    >
      <Cover onOpen={() => dispatch({ type: "OPEN" })} />
      <PlaceholderPage no={1} title="Lilin di Malam Hari" />
      <PlaceholderPage no={2} title="Sebuah Surat" />
      <PlaceholderPage no={3} title="Kenangan Kita" />
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