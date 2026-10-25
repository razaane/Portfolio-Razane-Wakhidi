"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { playSound } from "@/lib/sound";

// Holographic scratch-off card. Keyboard and screen-reader users get the Reveal button.
export function ScratchCard({ title, label, reveal, children }: { title: string; label: string; reveal: string; children: ReactNode }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const scratching = useRef(false);
  const strokes = useRef(0);

  useEffect(() => {
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const paint = () => {
      const { width, height } = c.getBoundingClientRect();
      const d = devicePixelRatio;
      c.width = width * d;
      c.height = height * d;
      ctx.scale(d, d);
      const g = ctx.createLinearGradient(0, 0, width, height);
      ["#c084fc", "#f0abfc", "#ff9fcf", "#e9d5ff", "#c084fc"].forEach((col, i, a) => g.addColorStop(i / (a.length - 1), col));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);
      // glitter
      for (let i = 0; i < 140; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.7})`;
        ctx.fillRect(Math.random() * width, Math.random() * height, 1.6, 1.6);
      }
      ctx.fillStyle = "#1A0A2E";
      ctx.textAlign = "center";
      ctx.font = `700 ${Math.max(18, Math.min(26, width / 16))}px ${getComputedStyle(document.body).fontFamily}`;
      ctx.fillText(title, width / 2, height / 2 - 4);
      ctx.font = `600 28px ${getComputedStyle(document.body).getPropertyValue("--font-caveat") || "cursive"}`;
      ctx.fillText("✦ ✦ ✦", width / 2, height / 2 + 34);
    };
    paint();
  }, [title]);

  const scratch = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx || !scratching.current) return;
    const r = c.getBoundingClientRect();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(e.clientX - r.left, e.clientY - r.top, 24, 0, Math.PI * 2);
    ctx.fill();
    if (++strokes.current % 12 === 0) checkCleared();
  };

  const checkCleared = () => {
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const { data } = ctx.getImageData(0, 0, c.width, c.height);
    let clear = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 4 * 64) {
      total++;
      if (data[i] === 0) clear++;
    }
    if (clear / total > 0.45) doReveal();
  };

  const doReveal = () => {
    if (revealed) return;
    setRevealed(true);
    playSound("pop");
  };

  return (
    <div>
      <div className="relative overflow-hidden rounded-[22px] border-[6px] border-white shadow-[var(--shadow)]">
        <div className="bg-surface p-6" inert={!revealed}>
          {children}
        </div>
        <canvas
          ref={canvas}
          aria-label={label}
          role="img"
          className={`absolute inset-0 size-full touch-none transition-opacity duration-500 ${revealed ? "pointer-events-none opacity-0" : "cursor-crosshair"}`}
          onPointerDown={(e) => {
            scratching.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            scratch(e);
          }}
          onPointerMove={scratch}
          onPointerUp={() => {
            scratching.current = false;
            checkCleared();
          }}
        />
      </div>
      {!revealed && (
        <button type="button" className="btn btn-sm btn-ghost mt-3" onClick={doReveal}>
          {reveal}
        </button>
      )}
    </div>
  );
}
