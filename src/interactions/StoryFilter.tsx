"use client";

import { useState } from "react";
import { announce } from "@/lib/dom-state";
import { playSound } from "@/lib/sound";

// Filter chips: All / Full-stack / API / Front-end / Data. Spreads stay server-rendered;
// this only toggles their visibility.
export function StoryFilter({
  label,
  options,
  countTemplate,
}: {
  label: string;
  options: { id: string; label: string }[];
  countTemplate: string;
}) {
  const [active, setActive] = useState("all");

  const choose = (id: string) => {
    setActive(id);
    playSound("pop");
    let shown = 0;
    document.querySelectorAll<HTMLElement>(".spread").forEach((el) => {
      const match = id === "all" || (el.dataset.category ?? "").split(" ").includes(id);
      el.dataset.hidden = String(!match);
      if (match) shown++;
    });
    // "{count, plural, one {# story} other {# stories}}" → "4 stories"
    const m = countTemplate.match(/one \{(.+?)\} other \{(.+?)\}/);
    const text = m ? (shown === 1 ? m[1] : m[2]).replace("#", String(shown)) : String(shown);
    announce(text);
  };

  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={active === o.id}
          onClick={() => choose(o.id)}
          className={`btn btn-sm ${active === o.id ? "btn-primary" : "btn-ghost"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
