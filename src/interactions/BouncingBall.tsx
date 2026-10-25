"use client";

import { useEffect, useRef } from "react";
import { playSound } from "@/lib/sound";

type Ball = { x: number; y: number; vx: number; vy: number; r: number; c: string };
const COLORS = ["#7C3AED", "#C084FC", "#E879F9", "#FF6EB4", "#F0ABFC", "#A855F7"];

// A remake of my first canvas game: throw balls and let gravity do the rest.
export function BouncingBall({ label, hint }: { label: string; hint: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const balls = useRef<Ball[]>([]);
  const raf = useRef(0);
  const still = useRef(false);

  const draw = () => {
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    for (const b of balls.current) {
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = b.c;
      ctx.fill();
      ctx.lineWidth = 2 * devicePixelRatio;
      ctx.strokeStyle = "#1A0A2E";
      ctx.stroke();
    }
  };

  const loop = () => {
    const c = canvas.current;
    if (!c) return;
    let moving = false;
    for (const b of balls.current) {
      b.vy += 0.5 * devicePixelRatio;
      b.x += b.vx;
      b.y += b.vy;
      if (b.y + b.r > c.height) {
        b.y = c.height - b.r;
        b.vy *= -0.78;
        b.vx *= 0.985;
        if (Math.abs(b.vy) > 4) playSound("pop");
      }
      if (b.x - b.r < 0 || b.x + b.r > c.width) {
        b.vx *= -0.9;
        b.x = Math.min(c.width - b.r, Math.max(b.r, b.x));
      }
      if (Math.abs(b.vy) > 0.6 || Math.abs(b.vx) > 0.1 || c.height - b.y - b.r > 1) moving = true;
    }
    draw();
    raf.current = moving ? requestAnimationFrame(loop) : 0;
  };

  useEffect(() => {
    still.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const c = canvas.current;
    if (!c) return;
    const resize = () => {
      c.width = c.clientWidth * devicePixelRatio;
      c.height = c.clientHeight * devicePixelRatio;
      draw();
    };
    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const throwBall = (x?: number, y?: number) => {
    const c = canvas.current;
    if (!c) return;
    const d = devicePixelRatio;
    const ball: Ball = {
      x: x ?? c.width * (0.2 + Math.random() * 0.6),
      y: y ?? c.height * 0.25,
      vx: (Math.random() * 8 - 4) * d,
      vy: -Math.random() * 6 * d,
      r: (10 + Math.random() * 12) * d,
      c: COLORS[balls.current.length % COLORS.length],
    };
    if (still.current) ball.y = c.height - ball.r;
    balls.current = [...balls.current.slice(-11), ball];
    if (still.current) return draw();
    if (!raf.current) raf.current = requestAnimationFrame(loop);
  };

  return (
    <div>
      <canvas
        ref={canvas}
        tabIndex={0}
        role="button"
        aria-label={label}
        className="block h-[200px] w-full rounded-2xl border border-rule bg-bg"
        onPointerDown={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          throwBall((e.clientX - r.left) * devicePixelRatio, (e.clientY - r.top) * devicePixelRatio);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            throwBall();
          }
        }}
      />
      <p className="mt-2 text-[14px] text-ink-2">{hint}</p>
    </div>
  );
}
