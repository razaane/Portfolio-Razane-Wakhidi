"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type OrientationCtor = { requestPermission?: () => Promise<"granted" | "denied"> };

// Holographic masthead: the cursor (or phone tilt) moves the foil, and the
// letters near it soften and curl through Fraunces' SOFT and WONK axes.
export function Masthead({ text, tiltLabel }: { text: string; tiltLabel: string }) {
  const root = useRef<HTMLSpanElement>(null);
  const [needsPermission, setNeedsPermission] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const letters = [...el.querySelectorAll<HTMLElement>("[data-letter]")];
    let raf = 0;
    let target = { x: 0.3, y: 0.5, px: -1, py: -1 };

    const render = () => {
      raf = 0;
      el.style.setProperty("--hx", `${target.x * 100}%`);
      el.style.setProperty("--hy", `${target.y * 100}%`);
      for (const l of letters) {
        const r = l.getBoundingClientRect();
        let pull = 0;
        if (target.px >= 0) {
          const d = Math.hypot(target.px - (r.left + r.width / 2), target.py - (r.top + r.height / 2));
          pull = Math.max(0, 1 - d / Math.max(220, r.width * 1.6));
        }
        l.style.fontVariationSettings = `"SOFT" ${Math.round(pull * 100)}, "WONK" ${pull > 0.45 ? 1 : 0}, "opsz" 144`;
        l.style.transform = `translateY(${(-pull * 6).toFixed(1)}px) rotate(${(pull * -3).toFixed(2)}deg)`;
      }
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };

    const onPointer = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (e.clientY > r.bottom + 400) return;
      target = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight, px: e.clientX, py: e.clientY };
      queue();
    };
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      const x = Math.min(1, Math.max(0, (e.gamma + 45) / 90));
      const y = Math.min(1, Math.max(0, (e.beta - 10) / 70));
      const r = el.getBoundingClientRect();
      target = { x, y, px: r.left + x * r.width, py: r.top + r.height / 2 };
      queue();
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    const Ctor = (window.DeviceOrientationEvent as unknown as OrientationCtor | undefined) ?? undefined;
    const coarse = matchMedia("(pointer: coarse)").matches;
    if (coarse && Ctor) {
      if (typeof Ctor.requestPermission === "function") setNeedsPermission(true);
      else window.addEventListener("deviceorientation", onTilt);
    }
    const onGranted = () => window.addEventListener("deviceorientation", onTilt);
    el.addEventListener("tilt-granted", onGranted);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("deviceorientation", onTilt);
      el.removeEventListener("tilt-granted", onGranted);
    };
  }, []);

  const askTilt = async () => {
    const Ctor = window.DeviceOrientationEvent as unknown as OrientationCtor;
    try {
      if ((await Ctor.requestPermission?.()) === "granted") {
        root.current?.dispatchEvent(new Event("tilt-granted"));
        setNeedsPermission(false);
      }
    } catch {
      setNeedsPermission(false);
    }
  };

  return (
    <>
      <span
        ref={root}
        aria-hidden="true"
        className="display block select-none whitespace-nowrap text-center font-black leading-[0.8] tracking-[-0.045em] text-[min(22vw,300px)]"
      >
        {[...text].map((ch, i) => (
          <span
            key={i}
            data-letter
            className="m-letter holo-text inline-block"
            style={{ "--i": i } as CSSProperties}
          >
            {ch}
          </span>
        ))}
      </span>
      {needsPermission && (
        <button type="button" onClick={askTilt} className="btn btn-sm btn-ghost mx-auto mt-3 flex">
          {tiltLabel}
        </button>
      )}
    </>
  );
}
