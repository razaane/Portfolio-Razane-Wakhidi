"use client";

import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/dom-state";

// The referee shows the card: it flips in on arrival, and again on click.
export function RedCard({ flipLabel }: { flipLabel: string }) {
  const [flipped, setFlipped] = useState(false);
  useEffect(() => {
    if (prefersReducedMotion()) return setFlipped(true);
    const id = window.setTimeout(() => setFlipped(true), 350);
    return () => window.clearTimeout(id);
  }, []);
  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-label={flipLabel}
      className="red-card mt-8 h-[260px] w-[180px] -rotate-6"
      data-flipped={flipped}
    >
      <span className="red-card-inner block">
        <span className="red-card-face grid place-items-center border-[6px] border-white bg-[#facc15] shadow-[var(--shadow)]">
          <span className="display text-[64px] text-plum-950">?</span>
        </span>
        <span className="red-card-face red-card-back grid place-items-center border-[6px] border-white bg-[#ef4444] shadow-[var(--shadow)]">
          <span className="display text-[72px] font-black text-white">404</span>
        </span>
      </span>
    </button>
  );
}
