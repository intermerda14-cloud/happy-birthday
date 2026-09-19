"use client";
import { createContext, useContext, useReducer, useEffect, useRef, type ReactNode } from "react";
import { site } from "@/content/site";

export interface BookState {
  index: number;
  opened: boolean;
  candleBlown: boolean;
  audioEnabled: boolean;
  isUnlocked: boolean;
  couponsTorn: Record<string, boolean>;
}

type Action =
  | { type: "OPEN" }
  | { type: "TURN"; to: number }
  | { type: "BLOW_CANDLE" }
  | { type: "TOGGLE_AUDIO" }
  | { type: "SET_UNLOCKED"; unlocked: boolean }
  | { type: "TEAR_COUPON"; id: string }
  | { type: "RESET_COUPONS" }
  | { type: "RESTART" };

const init: BookState = {
  index: 0,
  opened: false,
  candleBlown: false,
  audioEnabled: false,
  isUnlocked: false,
  couponsTorn: {},
};

function reducer(s: BookState, a: Action): BookState {
  switch (a.type) {
    case "OPEN":
      return { ...s, opened: true, index: 1, audioEnabled: true };
    case "TURN":
      return { ...s, index: Math.max(0, a.to) };
    case "BLOW_CANDLE":
      return { ...s, candleBlown: true };
    case "TOGGLE_AUDIO":
      return { ...s, audioEnabled: !s.audioEnabled };
    case "SET_UNLOCKED":
      return { ...s, isUnlocked: a.unlocked };
    case "TEAR_COUPON":
      return { ...s, couponsTorn: { ...s.couponsTorn, [a.id]: true } };
    case "RESET_COUPONS":
      return { ...s, couponsTorn: {} };
    case "RESTART":
      return { ...s, index: 1 };
    default:
      return s;
  }
}

const Ctx = createContext<{ state: BookState; dispatch: React.Dispatch<Action> } | null>(null);

export function BookProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, init);
  const mounted = useRef(false);

  useEffect(() => {
    // 1. Cek bypass preview key di URL query
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const preview = params.get("preview");
      if (preview && (preview === site.previewKey || preview === "firas" || preview === "adelia")) {
        dispatch({ type: "SET_UNLOCKED", unlocked: true });
      } else {
        // Cek tanggal unlock 00.00 WIB
        const targetStr = site.birthdayISO.startsWith("TODO") ? "2020-01-01" : site.birthdayISO;
        const targetDate = new Date(`${targetStr}T00:00:00+07:00`).getTime();
        if (Date.now() >= targetDate) {
          dispatch({ type: "SET_UNLOCKED", unlocked: true });
        }
      }

      // Restore localStorage
      try {
        const raw = localStorage.getItem("kisah-adelia:v1:state");
        if (raw) {
          const saved = JSON.parse(raw);
          if (saved.couponsTorn) {
            Object.keys(saved.couponsTorn).forEach((id) => {
              dispatch({ type: "TEAR_COUPON", id });
            });
          }
          if (saved.candleBlown) dispatch({ type: "BLOW_CANDLE" });
        }
      } catch {}
    }
    mounted.current = true;
  }, []);

  useEffect(() => {
    if (!mounted.current) return;
    try {
      localStorage.setItem(
        "kisah-adelia:v1:state",
        JSON.stringify({
          couponsTorn: state.couponsTorn,
          candleBlown: state.candleBlown,
        })
      );
    } catch {}
  }, [state.couponsTorn, state.candleBlown]);

  return <Ctx value={{ state, dispatch }}>{children}</Ctx>;
}

export function useBook() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBook harus di dalam BookProvider");
  return ctx;
}