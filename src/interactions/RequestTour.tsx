"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/dom-state";
import { playSound } from "@/lib/sound";

type Tour = {
  method: string;
  path: string;
  status: number;
  steps: { layer: string; detail: string }[];
  response: unknown;
};

const STEP_MS = 520;

// The architecture diagram. With tours, a mini console sends a request and each layer
// lights up in order (route → auth → validator → controller → service → repository → DB).
export function RequestTour({
  layers,
  tours = [],
  labels,
}: {
  layers: string[];
  tours?: Tour[];
  labels: { title: string; hint: string; send: string; response: string; idle: string };
}) {
  const [tour, setTour] = useState<number | null>(null);
  const [step, setStep] = useState(-1);
  const timer = useRef<number | undefined>(undefined);
  const current = tour === null ? null : tours[tour];
  const done = current !== null && step >= current.steps.length;

  useEffect(() => () => window.clearInterval(timer.current), []);

  const run = (i: number) => {
    window.clearInterval(timer.current);
    setTour(i);
    playSound("pop");
    if (prefersReducedMotion()) {
      setStep(tours[i].steps.length);
      return;
    }
    setStep(0);
    let s = 0;
    timer.current = window.setInterval(() => {
      s++;
      setStep(s);
      if (s >= tours[i].steps.length) window.clearInterval(timer.current);
    }, STEP_MS);
  };

  const stateOf = (layer: string) => {
    if (!current) return "idle";
    const idx = current.steps.findIndex((st) => st.layer === layer);
    if (idx < 0) return "idle";
    if (done || idx < step) return "done";
    return idx === step ? "active" : "idle";
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <ol className={`col-span-12 flex flex-col gap-2 ${tours.length ? "lg:col-span-5" : "lg:flex-row lg:flex-wrap lg:items-center"}`}>
        {layers.map((layer, i) => (
          <li key={layer} className={`flex items-center gap-2 ${tours.length ? "" : "lg:flex-row"}`}>
            <span
              className="layer-node flex flex-1 items-center gap-3 rounded-2xl border-2 border-rule-strong bg-surface px-4 py-3 font-mono text-[15px] font-semibold"
              data-state={stateOf(layer)}
            >
              <span className="text-[13px] opacity-70">{String(i + 1).padStart(2, "0")}</span>
              {layer}
            </span>
            {i < layers.length - 1 && (
              <span aria-hidden="true" className={`text-accent ${tours.length ? "hidden" : "max-lg:hidden"}`}>
                →
              </span>
            )}
          </li>
        ))}
      </ol>

      {tours.length > 0 && (
        <div className="col-span-12 overflow-hidden rounded-2xl border border-[rgb(240_171_252/0.25)] bg-[#170b2b] text-[#efe6ff] lg:col-span-7">
          <div className="border-b border-[rgb(240_171_252/0.2)] px-4 py-3">
            <p className="font-mono text-[14px] font-bold text-[#f0abfc]">{labels.title}</p>
            <p className="text-[14px] text-[#cdbff2]">{labels.hint}</p>
          </div>
          <div className="flex flex-wrap gap-2 px-4 py-3">
            {tours.map((t, i) => (
              <button
                key={t.path + t.method}
                type="button"
                onClick={() => run(i)}
                aria-pressed={tour === i}
                className="rounded-full border border-[#f0abfc] px-3 py-1.5 font-mono text-[14px] hover:bg-[#f0abfc] hover:text-[#1a0a2e] aria-pressed:bg-[#f0abfc] aria-pressed:text-[#1a0a2e]"
              >
                <strong>{t.method}</strong> {t.path}
              </button>
            ))}
          </div>
          <div className="min-h-[260px] border-t border-[rgb(240_171_252/0.2)] px-4 py-3 font-mono text-[13.5px] leading-relaxed" aria-live="polite">
            {!current && <p className="text-[#cdbff2]">{labels.idle}</p>}
            {current && (
              <>
                <ol className="space-y-0.5">
                  {current.steps.slice(0, Math.min(step + 1, current.steps.length)).map((st) => (
                    <li key={st.layer}>
                      <span className="whitespace-pre text-[#c084fc]">→ {st.layer.padEnd(18, " ")}</span>
                      <span className="text-[#efe6ff]">{st.detail}</span>
                    </li>
                  ))}
                </ol>
                {done && (
                  <div className="mt-3">
                    <p className="text-[#f0abfc]">
                      ← {labels.response} {current.status} {current.status < 300 ? "OK" : ""}
                    </p>
                    <pre className="mt-1 overflow-x-auto whitespace-pre text-[#efe6ff]">{JSON.stringify(current.response, null, 2)}</pre>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
