"use client";

import { useEffect, useRef } from "react";

const TRAIL = 6;

// A small sparkle with a short trail. Over a story it becomes a "Read story →" pill.
// Only for fine pointers with motion allowed; everyone else keeps the native cursor.
export function Cursor({ label }: { label: string }) {
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = matchMedia("(pointer: fine)").matches;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = layer.current;
    if (!fine || still || !root) return;

    const html = document.documentElement;
    const star = root.querySelector<HTMLElement>("[data-star]")!;
    const pill = root.querySelector<HTMLElement>("[data-pill]")!;
    const dots = [...root.querySelectorAll<HTMLElement>("[data-dot]")];
    const pts = Array.from({ length: TRAIL }, () => ({ x: -100, y: -100 }));
    let x = -100;
    let y = -100;
    let raf = 0;
    let visible = false;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        root.style.opacity = "1";
        html.classList.add("has-cursor");
      }
      const story = (e.target as Element | null)?.closest?.("[data-cursor='story']");
      pill.dataset.on = story ? "true" : "false";
      star.style.opacity = story ? "0" : "1";
    };
    const onLeave = () => {
      visible = false;
      root.style.opacity = "0";
    };

    const tick = () => {
      pts[0].x = x;
      pts[0].y = y;
      for (let i = 1; i < TRAIL; i++) {
        pts[i].x += (pts[i - 1].x - pts[i].x) * 0.45;
        pts[i].y += (pts[i - 1].y - pts[i].y) * 0.45;
      }
      star.style.transform = `translate3d(${x - 11}px, ${y - 11}px, 0)`;
      pill.style.transform = `translate3d(${x + 14}px, ${y + 10}px, 0)`;
      dots.forEach((d, i) => {
        const p = pts[i + 1];
        d.style.transform = `translate3d(${p.x - 3}px, ${p.y - 3}px, 0) scale(${1 - i / TRAIL})`;
      });
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      html.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div ref={layer} className="cursor-layer no-print" style={{ opacity: 0 }} aria-hidden="true">
      {Array.from({ length: TRAIL - 1 }, (_, i) => (
        <span key={i} data-dot className="cursor-dot size-1.5 rounded-full bg-orchid-400" />
      ))}
      <svg data-star className="cursor-dot" width="22" height="22" viewBox="0 0 22 22">
        <path
          d="M11 1c.8 6 3 8.2 9 9-6 .8-8.2 3-9 9-.8-6-3-8.2-9-9 6-.8 8.2-3 9-9Z"
          fill="#E879F9"
          stroke="#1A0A2E"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      <span data-pill className="cursor-pill">
        {label}
      </span>
    </div>
  );
}
