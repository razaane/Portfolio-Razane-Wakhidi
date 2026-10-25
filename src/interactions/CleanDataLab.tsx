"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Chart as ChartType } from "chart.js";
import type { SaleRow } from "@/content/lab";
import { clean, mean, median, spendByCountry } from "@/lib/stats";
import { useHtmlAttr } from "@/lib/dom-state";

type Labels = {
  raw: string;
  removeSmall: string;
  removeDupes: string;
  rows: string;
  mean: string;
  median: string;
  total: string;
  chartTitle: string;
  chartLoading: string;
  tableCaption: string;
  country: string;
  dataNote: string;
};

const fmt = (n: number, locale: string) =>
  new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(n);

// Numbers glide to their new value (instant with reduced motion).
function useTween(value: number) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      from.current = value;
      setShown(value);
      return;
    }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 500);
      const e = 1 - Math.pow(1 - t, 3);
      const v = a + (value - a) * e;
      from.current = v;
      setShown(v);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return shown;
}

export function CleanDataLab({ rows, minSpend, labels, locale }: { rows: SaleRow[]; minSpend: number; labels: Labels; locale: string }) {
  const [removeSmall, setRemoveSmall] = useState(false);
  const [removeDupes, setRemoveDupes] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const chart = useRef<ChartType<"bar"> | null>(null);
  const [ready, setReady] = useState(false);
  const theme = useHtmlAttr("data-theme", "day");

  const data = useMemo(() => clean(rows, { removeSmall, removeDupes, minSpend }), [rows, removeSmall, removeDupes, minSpend]);
  const spends = data.map((r) => r[3]);
  const byCountry = useMemo(() => spendByCountry(data), [data]);
  // Keep the country order of the raw data so bars move instead of jumping around.
  const order = useMemo(() => spendByCountry(rows).map(([c]) => c), [rows]);

  const count = useTween(data.length);
  const avg = useTween(mean(spends));
  const med = useTween(median(spends));

  // Chart.js loads only when the lab scrolls into view.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let cancelled = false;
    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip } = await import("chart.js");
        if (cancelled || !canvas.current) return;
        Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);
        chart.current = new Chart(canvas.current, {
          type: "bar",
          data: { labels: order, datasets: [{ data: order.map(() => 0), borderRadius: 8, borderSkipped: false, maxBarThickness: 64 }] },
          options: {
            maintainAspectRatio: false,
            animation: { duration: matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 600, easing: "easeOutQuart" },
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => `${fmt(c.parsed.y ?? 0, locale)} €` } } },
            scales: {
              x: { grid: { display: false }, border: { display: false } },
              y: { beginAtZero: true, border: { display: false } },
            },
          },
        });
        setReady(true);
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
      chart.current?.destroy();
      chart.current = null;
    };
  }, [order, locale]);

  // Feed data + theme colors into the chart.
  useEffect(() => {
    const c = chart.current;
    if (!c) return;
    const css = getComputedStyle(document.documentElement);
    const ink = css.getPropertyValue("--ink").trim() || "#1A0A2E";
    const ink2 = css.getPropertyValue("--ink-2").trim();
    const rule = css.getPropertyValue("--rule").trim();
    const night = theme === "night";
    const palette = night
      ? ["#C084FC", "#E879F9", "#F0ABFC", "#A855F7", "#FF6EB4", "#EDE3FF"]
      : ["#7C3AED", "#A855F7", "#C084FC", "#E879F9", "#FF6EB4", "#2D1B69"];
    const totals = new Map(byCountry);
    const ds = c.data.datasets[0];
    ds.data = order.map((country) => Math.round((totals.get(country) ?? 0) * 100) / 100);
    ds.backgroundColor = order.map((_, i) => palette[i % palette.length]);
    ds.borderColor = ink;
    ds.borderWidth = 2;
    const font = { family: getComputedStyle(document.body).fontFamily, size: 14 };
    c.options.scales!.x!.ticks = { color: ink, font };
    c.options.scales!.y!.ticks = { color: ink2, font };
    c.options.scales!.y!.grid = { color: rule };
    c.update();
  }, [byCountry, order, theme, ready]);

  const toggles = [
    { id: "small", label: labels.removeSmall, on: removeSmall, set: setRemoveSmall },
    { id: "dupes", label: labels.removeDupes, on: removeDupes, set: setRemoveDupes },
  ];

  return (
    <div ref={box} className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-4">
        <fieldset className="space-y-3">
          <legend className="sr-only">{labels.raw}</legend>
          <button
            type="button"
            onClick={() => {
              setRemoveSmall(false);
              setRemoveDupes(false);
            }}
            aria-pressed={!removeSmall && !removeDupes}
            className={`btn btn-sm w-full justify-center ${!removeSmall && !removeDupes ? "btn-primary" : "btn-ghost"}`}
          >
            {labels.raw}
          </button>
          {toggles.map((tg) => (
            <label key={tg.id} className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-rule bg-surface px-4 py-3">
              <span className="font-semibold leading-snug">{tg.label}</span>
              <input type="checkbox" className="peer sr-only" checked={tg.on} onChange={(e) => tg.set(e.target.checked)} />
              <span className="switch" aria-hidden="true" />
            </label>
          ))}
        </fieldset>

        <dl className="mt-6 grid grid-cols-3 gap-3 lg:grid-cols-1" aria-live="polite">
          {[
            { k: labels.rows, v: Math.round(count).toString() },
            { k: labels.mean, v: `${fmt(avg, locale)} €` },
            { k: labels.median, v: `${fmt(med, locale)} €` },
          ].map((s) => (
            <div key={s.k} className="rounded-2xl border border-rule bg-surface p-4">
              <dt className="kicker text-[13px] text-ink-2">{s.k}</dt>
              <dd className="display mt-1 text-[clamp(22px,3vw,34px)] tabular-nums leading-none">{s.v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-[14px] text-ink-2">{labels.dataNote}</p>
      </div>

      <figure className="paper-card col-span-12 p-5 lg:col-span-8">
        <figcaption className="kicker">{labels.chartTitle}</figcaption>
        <div className="relative mt-4 h-[320px] sm:h-[380px]">
          <canvas ref={canvas} role="img" aria-label={labels.chartTitle} />
          {!ready && <p className="absolute inset-0 grid place-items-center text-ink-2">{labels.chartLoading}</p>}
        </div>
        <details className="mt-3 text-[15px]">
          <summary className="cursor-pointer font-semibold">{labels.tableCaption}</summary>
          <table className="mt-2 w-full text-left">
            <caption className="sr-only">{labels.tableCaption}</caption>
            <thead>
              <tr className="border-b border-rule">
                <th className="py-1">{labels.country}</th>
                <th className="py-1 text-right">{labels.total}</th>
              </tr>
            </thead>
            <tbody>
              {byCountry.map(([c, v]) => (
                <tr key={c} className="border-b border-rule">
                  <td className="py-1">{c}</td>
                  <td className="py-1 text-right tabular-nums">{fmt(v, locale)} €</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </figure>
    </div>
  );
}
