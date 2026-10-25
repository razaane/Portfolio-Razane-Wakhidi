"use client";

import { useEffect } from "react";

// Hovering or focusing a skill in The Index lights up the stories that use it.
export function IndexHighlighter() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".the-index");
    if (!root) return;
    const light = (e: Event) => {
      const entry = (e.target as HTMLElement).closest<HTMLElement>(".index-entry");
      const slugs = e.type === "pointerover" || e.type === "focusin" ? (entry?.dataset.projects ?? "").split(" ") : [];
      root.querySelectorAll<HTMLElement>(".legend-item").forEach((el) => {
        el.dataset.lit = String(slugs.includes(el.dataset.slug ?? ""));
      });
    };
    const events = ["pointerover", "pointerout", "focusin", "focusout"];
    events.forEach((t) => root.addEventListener(t, light));
    return () => events.forEach((t) => root.removeEventListener(t, light));
  }, []);
  return null;
}
