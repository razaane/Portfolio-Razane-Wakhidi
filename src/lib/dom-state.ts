"use client";

import { useSyncExternalStore } from "react";
import { playSound } from "./sound";

// Edition and Source Mode live on <html> as data attributes, so CSS can react before React does.
function subscribe(attr: string) {
  return (cb: () => void) => {
    const mo = new MutationObserver(cb);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: [attr] });
    return () => mo.disconnect();
  };
}

const subscribers = new Map<string, (cb: () => void) => () => void>();

export function useHtmlAttr(attr: string, serverValue: string | null = null) {
  if (!subscribers.has(attr)) subscribers.set(attr, subscribe(attr));
  return useSyncExternalStore(
    subscribers.get(attr)!,
    () => document.documentElement.getAttribute(attr),
    () => serverValue,
  );
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function announce(message: string) {
  const el = document.getElementById("live-region");
  if (!el) return;
  el.textContent = "";
  requestAnimationFrame(() => (el.textContent = message));
}

let flipping = false;

// Source panels are fetched once, the first time Source Mode opens (static JSON built at deploy).
let sources: Promise<Record<string, string>> | undefined;
function mountSources() {
  sources ??= fetch(`/api/source/${document.documentElement.lang || "en"}`).then((r) => r.json());
  sources
    .then((html) => {
      document.querySelectorAll<HTMLElement>("[data-src-slot]").forEach((slot) => {
        const code = html[slot.dataset.srcSlot ?? ""];
        if (code && !slot.dataset.filled) {
          slot.innerHTML = code;
          slot.dataset.filled = "true";
        }
      });
    })
    .catch(() => (sources = undefined));
}

export function toggleSourceMode(messages?: { on: string; off: string }) {
  if (flipping) return;
  const html = document.documentElement;
  const main = document.getElementById("main");
  const turnOn = html.dataset.source !== "on";
  const apply = () => {
    if (turnOn) mountSources();
    if (turnOn) html.dataset.source = "on";
    else delete html.dataset.source;
    if (messages) announce(turnOn ? messages.on : messages.off);
  };
  playSound("rustle");
  if (!main || prefersReducedMotion()) return apply();

  flipping = true;
  main.dataset.flip = "out";
  window.setTimeout(() => {
    apply();
    main.dataset.flip = "in";
    window.setTimeout(() => {
      delete main.dataset.flip;
      flipping = false;
    }, 340);
  }, 260);
}

export function setEdition(next: "day" | "night", origin?: { x: number; y: number }) {
  const html = document.documentElement;
  const commit = () => {
    html.dataset.theme = next;
    try {
      localStorage.setItem("razane:edition", next);
    } catch {}
  };
  if (!document.startViewTransition || prefersReducedMotion()) return commit();

  // The new edition spreads from the toggle like ink.
  const x = origin?.x ?? window.innerWidth;
  const y = origin?.y ?? 0;
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  html.style.setProperty("--ink-x", `${x}px`);
  html.style.setProperty("--ink-y", `${y}px`);
  html.style.setProperty("--ink-r", `${r}px`);
  html.classList.add("ink-switch");
  const vt = document.startViewTransition(commit);
  vt.finished.finally(() => html.classList.remove("ink-switch"));
}
