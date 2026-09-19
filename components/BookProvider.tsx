"use client";
import { createContext, useContext, useReducer, useEffect, useRef, type ReactNode } from "react";

interface BookState {
  index: number;
  opened: boolean;
}

type Action = { type: "OPEN" } | { type: "TURN"; to: number };

const init: BookState = { index: 0, opened: false };

function reducer(s: BookState, a: Action): BookState {
  switch (a.type) {
    case "OPEN":
      return { ...s, opened: true, index: 1 };
    case "TURN":
      return { ...s, index: Math.max(0, a.to) };
    default:
      return s;
  }
}

const Ctx = createContext<{ state: BookState; dispatch: React.Dispatch<Action> } | null>(null);

export function BookProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, init);
  const mounted = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("kisah:v1:book");
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.index) dispatch({ type: "TURN", to: saved.index });
        if (saved.opened) dispatch({ type: "OPEN" });
      }
    } catch {}
    mounted.current = true;
  }, []);

  useEffect(() => {
    if (!mounted.current) return;
    try { localStorage.setItem("kisah:v1:book", JSON.stringify(state)); } catch {}
  }, [state]);

  return <Ctx value={{ state, dispatch }}>{children}</Ctx>;
}

export function useBook() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBook harus di dalam BookProvider");
  return ctx;
}