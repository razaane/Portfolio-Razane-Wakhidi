import type { ReactNode } from "react";

// Generated cover art for each story, used until real screenshots are added (project.cover).
const mono = { fontFamily: "var(--font-jetbrains), ui-monospace, monospace" };
const sans = { fontFamily: "var(--font-dm-sans), system-ui, sans-serif", fontWeight: 700 };
const INK = "#1A0A2E";

const factoryflow = (
  <>
    <rect width="480" height="360" fill="#2D1B69" />
    <circle cx="460" cy="380" r="260" fill="#7C3AED" />
    {["route", "auth", "validator", "controller", "service", "repository", "mongodb"].map((l, i) => (
      <g key={l} transform={`translate(${60 + i * 6} ${62 + i * 36})`}>
        <rect width="250" height="28" rx="8" fill={i === 6 ? "#F0ABFC" : "#F7F1FF"} opacity={1 - i * 0.06} stroke={INK} strokeWidth="2" />
        <text x="14" y="19" fontSize="14" fill={INK} style={mono}>
          {`${String(i + 1).padStart(2, "0")} ${l}`}
        </text>
      </g>
    ))}
    <g transform="translate(372 120)">
      <circle r="70" fill="#FF6EB4" stroke="#fff" strokeWidth="8" />
      <circle r="70" fill="none" stroke={INK} strokeWidth="2" />
      <text y="10" textAnchor="middle" fontSize="54" fill={INK} style={{ ...sans, fontWeight: 900 }}>
        99
      </text>
      <text y="38" textAnchor="middle" fontSize="15" fill={INK} style={sans}>
        tests ✓
      </text>
    </g>
  </>
);

const hosbank = (
  <>
    <rect width="480" height="360" fill="#C084FC" />
    <circle cx="420" cy="40" r="140" fill="#F0ABFC" />
    <g transform="translate(70 70) rotate(-8)">
      <rect width="290" height="180" rx="20" fill="#1A0A2E" stroke="#fff" strokeWidth="6" />
      <rect x="28" y="40" width="46" height="34" rx="6" fill="#F0ABFC" />
      <path d="M28 57h46M51 40v34" stroke={INK} strokeWidth="2" />
      <text x="28" y="122" fontSize="22" fill="#F7F1FF" style={mono}>
        HB •••• 0042
      </text>
      <text x="28" y="155" fontSize="14" fill="#C084FC" style={sans}>
        HOSBANK · CLIENT
      </text>
    </g>
    <g transform="translate(250 250)">
      <rect width="190" height="64" rx="14" fill="#F7F1FF" stroke={INK} strokeWidth="2" />
      <text x="18" y="27" fontSize="13" fill={INK} style={mono}>
        BEGIN; debit; credit;
      </text>
      <text x="18" y="48" fontSize="16" fill="#7C3AED" style={{ ...mono, fontWeight: 700 }}>
        COMMIT ✓
      </text>
    </g>
  </>
);

const quickref = (
  <>
    <rect width="480" height="360" fill="#2D1B69" />
    <g stroke="#C084FC" strokeWidth="3" fill="none" opacity="0.7">
      <rect x="30" y="30" width="420" height="300" rx="4" />
      <path d="M240 30v300" />
      <circle cx="240" cy="180" r="52" />
      <rect x="30" y="110" width="70" height="140" />
      <rect x="380" y="110" width="70" height="140" />
    </g>
    <g transform="translate(150 96) rotate(-14)">
      <rect width="96" height="140" rx="10" fill="#FACC15" stroke="#fff" strokeWidth="6" />
      <rect width="96" height="140" rx="10" fill="none" stroke={INK} strokeWidth="2" />
    </g>
    <g transform="translate(244 92) rotate(10)">
      <rect width="96" height="140" rx="10" fill="#EF4444" stroke="#fff" strokeWidth="6" />
      <rect width="96" height="140" rx="10" fill="none" stroke={INK} strokeWidth="2" />
    </g>
    <text x="240" y="300" textAnchor="middle" fontSize="16" fill="#F7F1FF" style={sans}>
      LIGUE MARRAKECH-SAFI
    </text>
  </>
);

const wijha = (
  <>
    <rect width="480" height="360" fill="#EDE3FF" />
    <path d="M40 70c60-30 90 10 140-10s70-40 120-20 60 70 110 80 40 60 30 110-60 70-130 70-140-20-180-60S-10 100 40 70Z" fill="#F7F1FF" stroke={INK} strokeWidth="2" />
    <path d="M110 150c40 20 80-30 130 0s70 60 120 40" fill="none" stroke="#7C3AED" strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" />
    {[
      [110, 150],
      [240, 150],
      [360, 190],
    ].map(([x, y], i) => (
      <g key={i} transform={`translate(${x} ${y})`}>
        <path d="M0 0c-14-18-22-28-22-40a22 22 0 0 1 44 0c0 12-8 22-22 40Z" fill={i === 1 ? "#7C3AED" : "#FF6EB4"} stroke={INK} strokeWidth="2" />
        <circle cy="-40" r="8" fill="#fff" stroke={INK} strokeWidth="2" />
      </g>
    ))}
    <g transform="translate(330 70)">
      <rect x="-26" y="-26" width="52" height="52" fill="#C084FC" stroke={INK} strokeWidth="2" />
      <rect x="-26" y="-26" width="52" height="52" fill="#C084FC" stroke={INK} strokeWidth="2" transform="rotate(45)" />
      <circle r="10" fill="#F0ABFC" stroke={INK} strokeWidth="2" />
    </g>
    <g transform="translate(60 268)">
      <rect width="170" height="54" rx="12" fill="#1A0A2E" />
      <text x="16" y="22" fontSize="12" fill="#C084FC" style={sans}>
        HOST · KYC
      </text>
      <text x="16" y="42" fontSize="15" fill="#F7F1FF" style={sans}>
        Verified ✓
      </text>
    </g>
  </>
);

const cinehall = (
  <>
    <rect width="480" height="360" fill="#1A0A2E" />
    <path d="M70 70q170-50 340 0" fill="none" stroke="#F0ABFC" strokeWidth="6" strokeLinecap="round" />
    <path d="M70 70q170-50 340 0" fill="none" stroke="#C084FC" strokeWidth="22" strokeLinecap="round" opacity="0.15" />
    {Array.from({ length: 5 }, (_, r) =>
      Array.from({ length: 9 }, (_, c) => {
        const picked = (r === 2 && (c === 4 || c === 5)) || (r === 3 && c === 2);
        const taken = (r * 7 + c * 3) % 5 === 0;
        return (
          <rect
            key={`${r}-${c}`}
            x={92 + c * 34}
            y={118 + r * 34}
            width="24"
            height="22"
            rx="6"
            fill={picked ? "#FF6EB4" : taken ? "#2D1B69" : "#C084FC"}
            stroke={picked ? "#fff" : "none"}
            strokeWidth="2"
          />
        );
      }),
    )}
    <g transform="translate(300 290) rotate(-4)">
      <rect width="150" height="50" rx="10" fill="#F7F1FF" />
      <text x="14" y="21" fontSize="12" fill="#7C3AED" style={sans}>
        STRIPE · PAID
      </text>
      <text x="14" y="40" fontSize="15" fill={INK} style={mono}>
        C5 · C6
      </text>
    </g>
  </>
);

const sell4all = (
  <>
    <rect width="480" height="360" fill="#F7F1FF" />
    <path d="M60 300h380M60 60v240" stroke={INK} strokeWidth="2" />
    {[190, 150, 112, 96, 80, 60].map((h, i) => (
      <rect
        key={i}
        x={80 + i * 60}
        y={300 - h}
        width="40"
        height={h}
        rx="6"
        fill={["#7C3AED", "#A855F7", "#C084FC", "#E879F9", "#F0ABFC", "#FF6EB4"][i]}
        stroke={INK}
        strokeWidth="2"
      />
    ))}
    <path d="M60 172h380" stroke="#FF6EB4" strokeWidth="3" strokeDasharray="8 8" />
    <text x="436" y="164" textAnchor="end" fontSize="14" fill={INK} style={mono}>
      median
    </text>
    <g transform="translate(300 74)">
      <rect width="140" height="44" rx="10" fill="#1A0A2E" />
      <text x="14" y="28" fontSize="14" fill="#F0ABFC" style={mono}>
        clean.csv ✓
      </text>
    </g>
  </>
);

const covers: Record<string, ReactNode> = { factoryflow, hosbank, quickref, wijha, cinehall, sell4all };

export function ProjectArt({ slug, className = "" }: { slug: string; className?: string }) {
  return (
    <svg viewBox="0 0 480 360" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      {covers[slug] ?? <rect width="480" height="360" fill="#C084FC" />}
    </svg>
  );
}
