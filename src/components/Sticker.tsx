import type { ReactNode } from "react";
import type { StickerName } from "@/content/types";

export type TechSticker = "js" | "node" | "react" | "mongodb" | "docker" | "figma";
export type AnySticker = StickerName | TechSticker;

const INK = "#1A0A2E";
const s = { stroke: INK, strokeWidth: 2, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
const font = { fontFamily: "var(--font-dm-sans), system-ui, sans-serif", fontWeight: 800 };

// Every sticker is drawn on a 64×64 grid with the same 2px plum outline.
const art: Record<AnySticker, ReactNode> = {
  heart: <path {...s} fill="#FF6EB4" d="M32 54C10 40 6 28 10 20c4-9 16-10 22 0 6-10 18-9 22 0 4 8 0 20-22 34Z" />,
  sparkle: (
    <>
      <path {...s} fill="#F0ABFC" d="M30 6c2 18 8 24 26 26-18 2-24 8-26 26-2-18-8-24-26-26 18-2 24-8 26-26Z" />
      <path {...s} fill="#C084FC" d="M52 6c.8 5 2.2 6.4 7 7-4.8.6-6.2 2-7 7-.8-5-2.2-6.4-7-7 4.8-.6 6.2-2 7-7Z" />
    </>
  ),
  star: <path {...s} fill="#C084FC" d="m32 6 7.6 16.4L57 24.6 44.2 37l3.2 17.8L32 46.2l-15.4 8.6L19.8 37 7 24.6l17.4-2.2Z" />,
  coffee: (
    <>
      <path {...s} fill="#FF6EB4" d="m36 4 5 1.4-6 22-5-1.4Z" />
      <path {...s} fill="#FFFFFF" d="M16 20h32l-4 36H20Z" />
      <path {...s} fill="#C084FC" d="M18.2 30h27.6L43 52H21Z" />
      <rect {...s} x="13" y="16" width="38" height="6" rx="3" fill="#F7F1FF" />
      <path {...s} fill="none" d="M26 38v6M32 36v8M38 38v6" />
    </>
  ),
  whistle: (
    <>
      <path {...s} fill="none" d="M14 22c-6-8 2-16 10-10" />
      <rect {...s} x="30" y="20" width="26" height="12" rx="3" fill="#A855F7" />
      <circle {...s} cx="26" cy="36" r="16" fill="#7C3AED" />
      <circle {...s} cx="26" cy="36" r="6" fill="#F0ABFC" />
      <path {...s} fill="none" d="M40 26h8" />
    </>
  ),
  cards: (
    <>
      <rect {...s} x="10" y="12" width="24" height="36" rx="3" fill="#FACC15" transform="rotate(-12 22 30)" />
      <rect {...s} x="30" y="14" width="24" height="36" rx="3" fill="#EF4444" transform="rotate(10 42 32)" />
    </>
  ),
  book: (
    <>
      <path {...s} fill="#FFFFFF" d="M32 18c-6-5-15-6-24-4v34c9-2 18-1 24 4 6-5 15-6 24-4V14c-9-2-18-1-24 4Z" />
      <path {...s} fill="#C084FC" d="M32 18v34" />
      <path {...s} fill="none" d="M14 22c5-1 10 0 13 2M14 30c5-1 10 0 13 2M37 24c3-2 8-3 13-2M37 32c3-2 8-3 13-2" />
    </>
  ),
  chart: (
    <>
      <rect {...s} x="8" y="8" width="48" height="48" rx="8" fill="#FFFFFF" />
      <rect {...s} x="16" y="32" width="8" height="16" rx="1.5" fill="#C084FC" />
      <rect {...s} x="28" y="22" width="8" height="26" rx="1.5" fill="#7C3AED" />
      <rect {...s} x="40" y="14" width="8" height="34" rx="1.5" fill="#FF6EB4" />
    </>
  ),
  laptop: (
    <>
      <rect {...s} x="12" y="12" width="40" height="28" rx="3" fill="#2D1B69" />
      <path {...s} fill="#FF6EB4" d="M32 33c-6-4-8-7-6.6-9.6 1.4-2.4 4.8-2.4 6.6.4 1.8-2.8 5.2-2.8 6.6-.4C40 26 38 29 32 33Z" />
      <path {...s} fill="#EDE3FF" d="M6 44h52l-4 8H10Z" />
    </>
  ),
  "moroccan-star": (
    <>
      <rect {...s} x="14" y="14" width="36" height="36" rx="2" fill="#7C3AED" />
      <rect {...s} x="14" y="14" width="36" height="36" rx="2" fill="#7C3AED" transform="rotate(45 32 32)" />
      <circle {...s} cx="32" cy="32" r="8" fill="#F0ABFC" />
    </>
  ),
  js: (
    <>
      <rect {...s} x="8" y="8" width="48" height="48" rx="10" fill="#C084FC" />
      <text x="50" y="49" textAnchor="end" fontSize="22" fill={INK} style={font}>
        JS
      </text>
    </>
  ),
  node: (
    <>
      <path {...s} fill="#7C3AED" d="m32 5 23 13.5v27L32 59 9 45.5v-27Z" />
      <text x="32" y="38" textAnchor="middle" fontSize="14" fill="#FFFFFF" style={font}>
        node
      </text>
    </>
  ),
  react: (
    <>
      <circle {...s} cx="32" cy="32" r="26" fill="#2D1B69" />
      <g fill="none" stroke="#F0ABFC" strokeWidth="2.4">
        <ellipse cx="32" cy="32" rx="19" ry="7.5" />
        <ellipse cx="32" cy="32" rx="19" ry="7.5" transform="rotate(60 32 32)" />
        <ellipse cx="32" cy="32" rx="19" ry="7.5" transform="rotate(120 32 32)" />
      </g>
      <circle cx="32" cy="32" r="3.6" fill="#FF6EB4" />
    </>
  ),
  mongodb: (
    <>
      <path {...s} fill="#C084FC" d="M32 4c10 12 16 22 14 34-1.6 9-8 13-14 16-6-3-12.4-7-14-16C16 26 22 16 32 4Z" />
      <path {...s} fill="none" d="M32 14v46" />
    </>
  ),
  docker: (
    <>
      <path {...s} fill="#7C3AED" d="M6 34h50c2 0 3-3 2-5 4-1 5 1 5 1-1 4-4 5-7 5-4 12-15 19-30 19C14 54 7 46 6 34Z" />
      <g {...s} fill="#F0ABFC">
        <rect x="14" y="24" width="8" height="8" />
        <rect x="23" y="24" width="8" height="8" />
        <rect x="32" y="24" width="8" height="8" />
        <rect x="23" y="15" width="8" height="8" />
        <rect x="32" y="15" width="8" height="8" />
        <rect x="41" y="24" width="8" height="8" />
      </g>
    </>
  ),
  figma: (
    <>
      <path {...s} fill="#FF6EB4" d="M22 6h10v16H22a8 8 0 0 1 0-16Z" />
      <path {...s} fill="#E879F9" d="M32 6h10a8 8 0 0 1 0 16H32Z" />
      <path {...s} fill="#A855F7" d="M22 22h10v16H22a8 8 0 0 1 0-16Z" />
      <circle {...s} cx="42" cy="30" r="8" fill="#C084FC" />
      <path {...s} fill="#7C3AED" d="M22 38h10v8a8 8 0 1 1-10-8Z" />
    </>
  ),
};

export function Sticker({
  name,
  size = 72,
  className = "",
  title,
}: {
  name: AnySticker;
  size?: number;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="-4 -4 72 72"
      width={size}
      height={size}
      className={`sticker ${className}`}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {/* white die-cut border: the same art, stroked thick in white underneath */}
      <g className="diecut">{art[name]}</g>
      {art[name]}
    </svg>
  );
}
