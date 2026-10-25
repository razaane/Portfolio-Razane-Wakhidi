"use client";

/* eslint-disable react-hooks/purity, react-hooks/immutability --
   The drag handlers only run from pointer events, never during render; the compiler can't
   see that because they are reached through the stable window listeners below. */

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Sticker, type AnySticker } from "@/components/Sticker";
import { announce, prefersReducedMotion } from "@/lib/dom-state";
import { playSound } from "@/lib/sound";

type Item = { id: AnySticker; label: string; usedIn: string };
// x is a fraction of the page width so stickers survive resizes; y is px from the top of the document.
type Placed = { id: AnySticker; x: number; y: number; r: number };

const KEY = "razane:stickers";
const SIZE = 76;

const load = (): Placed[] => {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
};
const save = (placed: Placed[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(placed));
  } catch {}
};
const pageWidth = () => document.documentElement.clientWidth;
const transform = (x: number, y: number, r: number, s = 1) =>
  `translate3d(${x - SIZE / 2}px, ${y - SIZE / 2}px, 0) rotate(${r}deg) scale(${s})`;

/**
 * Light physics for a sticker that was just let go: it glides with the throw's momentum,
 * drops from "lifted" height with a small bounce, and its rotation springs to rest.
 */
function drop(
  el: HTMLElement,
  start: { x: number; y: number; vx: number; vy: number; r: number },
  onLand: (x: number, y: number, r: number) => void,
) {
  let { x, y, vx, vy, r } = start;
  let z = 1; // lifted height, 0 = on the page
  let vz = 0;
  let vr = 0;
  const targetR = Math.max(-14, Math.min(14, r + vx * 6));
  let last = performance.now();
  let bounced = false;

  const step = (now: number) => {
    const dt = Math.min(32, now - last) / 16.67;
    last = now;
    const f = Math.pow(0.88, dt);
    vx *= f;
    vy *= f;
    x += vx * 16.67 * dt;
    y += vy * 16.67 * dt;
    // Bounce softly off the page edges so a hard throw never loses a sticker.
    const maxX = pageWidth() - SIZE / 2;
    if (x < SIZE / 2 || x > maxX) {
      x = Math.min(maxX, Math.max(SIZE / 2, x));
      vx = -vx * 0.4;
    }
    if (y < SIZE / 2) {
      y = SIZE / 2;
      vy = -vy * 0.4;
    }
    vz -= 0.06 * dt;
    z += vz * dt;
    if (z <= 0) {
      z = 0;
      if (!bounced && vz < -0.08) {
        vz = -vz * 0.35;
        bounced = true;
        playSound("pop");
      } else vz = 0;
    }
    vr += (targetR - r) * 0.12 * dt;
    vr *= Math.pow(0.78, dt);
    r += vr * dt;
    el.style.transform = transform(x, y, r, 1 + z * 0.16);
    const settled = z === 0 && vz === 0 && Math.abs(vr) < 0.05 && Math.hypot(vx, vy) < 0.01;
    if (settled) onLand(x, y, r);
    else requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function StickerSheet({
  items,
  labels,
}: {
  items: Item[];
  labels: { title: string; hint: string; place: string; tidy: string; usedIn: string; placed: string };
}) {
  const [placed, setPlaced] = useState<Placed[]>([]);
  const [layer, setLayer] = useState<HTMLElement | null>(null);
  const [width, setWidth] = useState(1);
  const drag = useRef<{
    id: AnySticker;
    el: HTMLElement | null;
    dx: number;
    dy: number;
    x: number;
    y: number;
    r: number;
    samples: { x: number; y: number; t: number }[];
    fromSheet: boolean;
    moved: boolean;
    startX: number;
    startY: number;
    pointerType: string;
  } | null>(null);
  const [dragging, setDragging] = useState<Placed | null>(null);
  // Window listeners must stay the same functions between renders so they can be removed.
  const live = useRef<{ move: (e: PointerEvent) => void; up: () => void }>({ move: () => {}, up: () => {} });
  const listeners = useRef({
    move: (e: PointerEvent) => live.current.move(e),
    up: () => live.current.up(),
  }).current;

  useEffect(() => {
    const el = document.createElement("div");
    el.className = "sticker-layer";
    el.setAttribute("aria-hidden", "true");
    document.body.appendChild(el);
    setLayer(el);
    setPlaced(load());
    setWidth(pageWidth());
    const onResize = () => setWidth(pageWidth());
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      el.remove();
    };
  }, []);

  const commit = useCallback((next: Placed[]) => {
    setPlaced(next);
    save(next);
  }, []);

  const placeAt = useCallback(
    (id: AnySticker, x: number, y: number, r: number) => {
      const w = pageWidth();
      const cx = Math.min(w - SIZE / 2, Math.max(SIZE / 2, x));
      const next = [...load().filter((p) => p.id !== id), { id, x: cx / w, y: Math.max(SIZE / 2, y), r }];
      commit(next);
    },
    [commit],
  );

  // Non-pointer alternative: drop the sticker somewhere in view.
  const placeRandom = (id: AnySticker) => {
    const w = pageWidth();
    const x = w * (0.12 + Math.random() * 0.72);
    const y = window.scrollY + window.innerHeight * (0.18 + Math.random() * 0.55);
    const r = Math.random() * 24 - 12;
    const label = items.find((i) => i.id === id)?.label ?? id;
    announce(labels.placed.replace("{name}", label));
    if (prefersReducedMotion()) {
      playSound("pop");
      return placeAt(id, x, y, r);
    }
    setDragging({ id, x: x / w, y, r });
    requestAnimationFrame(() => {
      const el = layer?.querySelector<HTMLElement>("[data-dragging]");
      if (!el) return placeAt(id, x, y, r);
      drop(el, { x, y, vx: 0, vy: 0, r }, (fx, fy, fr) => {
        setDragging(null);
        placeAt(id, fx, fy, fr);
      });
    });
  };

  const placeNext = () => {
    const free = items.find((i) => !placed.some((p) => p.id === i.id));
    if (free) placeRandom(free.id);
  };

  const onPointerDown = (e: React.PointerEvent, id: AnySticker, fromSheet: boolean) => {
    if (e.button !== 0) return;
    const pageX = e.clientX + window.scrollX;
    const pageY = e.clientY + window.scrollY;
    const existing = placed.find((p) => p.id === id);
    const cx = existing && !fromSheet ? existing.x * pageWidth() : pageX;
    const cy = existing && !fromSheet ? existing.y : pageY;
    drag.current = {
      id,
      el: null,
      dx: pageX - cx,
      dy: pageY - cy,
      x: cx,
      y: cy,
      r: existing?.r ?? 0,
      samples: [{ x: pageX, y: pageY, t: performance.now() }],
      fromSheet,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      pointerType: e.pointerType,
    };
    // Touch on the sheet is a tap-to-place, so the page can still scroll.
    if (fromSheet && e.pointerType === "touch") return;
    e.preventDefault();
    window.addEventListener("pointermove", listeners.move);
    window.addEventListener("pointerup", listeners.up);
    window.addEventListener("pointercancel", listeners.up);
  };

  const onMove = (e: PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    if (!d.moved) {
      if (Math.hypot(e.clientX - d.startX, e.clientY - d.startY) < 4) return;
      d.moved = true;
      document.body.style.userSelect = "none";
      setPlaced((prev) => prev.filter((p) => p.id !== d.id));
      setDragging({ id: d.id, x: d.x / pageWidth(), y: d.y, r: d.r });
    }
    const pageX = e.clientX + window.scrollX;
    const pageY = e.clientY + window.scrollY;
    d.samples.push({ x: pageX, y: pageY, t: performance.now() });
    if (d.samples.length > 5) d.samples.shift();
    const prevX = d.x;
    d.x = pageX - d.dx;
    d.y = pageY - d.dy;
    d.r += ((d.x - prevX) * 0.6 - d.r) * 0.15;
    d.el ??= layer?.querySelector<HTMLElement>("[data-dragging]") ?? null;
    if (d.el) d.el.style.transform = transform(d.x, d.y, d.r, 1.16);
  };

  const onUp = () => {
    window.removeEventListener("pointermove", listeners.move);
    window.removeEventListener("pointerup", listeners.up);
    window.removeEventListener("pointercancel", listeners.up);
    const d = drag.current;
    drag.current = null;
    document.body.style.userSelect = "";
    if (!d) return;
    if (!d.moved) {
      if (d.fromSheet) placeRandom(d.id);
      return;
    }
    const s = d.samples;
    const a = s[0];
    const b = s[s.length - 1];
    const dt = Math.max(16, b.t - a.t);
    const el = d.el ?? layer?.querySelector<HTMLElement>("[data-dragging]");
    if (!el || prefersReducedMotion()) {
      setDragging(null);
      return placeAt(d.id, d.x, d.y, d.r);
    }
    drop(el, { x: d.x, y: d.y, vx: (b.x - a.x) / dt, vy: (b.y - a.y) / dt, r: d.r }, (x, y, r) => {
      setDragging(null);
      placeAt(d.id, x, y, r);
    });
  };

  useEffect(() => {
    live.current = { move: onMove, up: onUp };
  });

  const onSheetTap = (e: React.PointerEvent, id: AnySticker) => {
    const d = drag.current;
    if (d && d.pointerType === "touch" && d.fromSheet && Math.hypot(e.clientX - d.startX, e.clientY - d.startY) < 8) {
      drag.current = null;
      placeRandom(id);
    }
  };

  const tidy = () => {
    commit([]);
    playSound("rustle");
  };

  const isOut = (id: AnySticker) => placed.some((p) => p.id === id) || dragging?.id === id;

  return (
    <div className="paper-card relative p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="kicker">{labels.title}</h2>
        <p className="hand text-[20px] text-ink-2">{labels.hint}</p>
      </div>
      <ul className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-9">
        {items.map((item) => {
          const out = isOut(item.id);
          return (
            <li key={item.id} className="sheet-slot group" data-empty={out}>
              {!out && (
                <button
                  type="button"
                  className="sheet-sticker"
                  onPointerDown={(e) => onPointerDown(e, item.id, true)}
                  onPointerUp={(e) => onSheetTap(e, item.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      placeRandom(item.id);
                    }
                  }}
                >
                  <span className="sr-only">{`${item.label}: ${labels.place}. ${item.usedIn}`}</span>
                  <Sticker name={item.id} size={SIZE} className="pointer-events-none size-full" />
                </button>
              )}
              <span
                role="tooltip"
                className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-10 hidden w-max max-w-[200px] -translate-x-1/2 rounded-xl bg-ink px-3 py-2 text-[14px] leading-snug text-bg group-hover:block group-focus-within:block"
              >
                <strong className="block">{item.label}</strong>
                {item.usedIn}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="btn btn-sm btn-ghost" onClick={placeNext} disabled={placed.length >= items.length}>
          ✦ {labels.place}
        </button>
        <button type="button" className="btn btn-sm btn-ghost" onClick={tidy} disabled={!placed.length}>
          {labels.tidy}
        </button>
      </div>

      {layer &&
        createPortal(
          <>
            {placed.map((p) => {
              const item = items.find((i) => i.id === p.id);
              return (
                <div
                  key={p.id}
                  className="placed-sticker"
                  style={{ transform: transform(p.x * width, p.y, p.r) }}
                  title={item ? `${item.label} · ${item.usedIn}` : undefined}
                  onPointerDown={(e) => onPointerDown(e, p.id, false)}
                >
                  <Sticker name={p.id} size={SIZE} />
                </div>
              );
            })}
            {dragging && (
              <div
                data-dragging
                className="placed-sticker"
                style={{ transform: transform(dragging.x * width, dragging.y, dragging.r, 1.16), zIndex: 1 }}
              >
                <Sticker name={dragging.id} size={SIZE} />
              </div>
            )}
          </>,
          layer,
        )}
    </div>
  );
}
