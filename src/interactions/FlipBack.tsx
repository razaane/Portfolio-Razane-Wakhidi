"use client";

import { toggleSourceMode } from "@/lib/dom-state";

export function FlipBack({ label, messages }: { label: string; messages: { on: string; off: string } }) {
  return (
    <button
      type="button"
      onClick={() => toggleSourceMode(messages)}
      className="rounded-full border border-[#f0abfc] px-3 py-1 text-[#f0abfc] hover:bg-[#f0abfc] hover:text-[#1a0a2e]"
    >
      ↩ {label}
    </button>
  );
}
