import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

// 1200×630 magazine cover with the holographic masthead.
export function renderCover({ kicker, title, subtitle }: { kicker: string; title: string; subtitle: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "48px 64px",
          background: "#1A0A2E",
          color: "#F7F1FF",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, letterSpacing: 4, color: "#C084FC" }}>
          <span>{kicker}</span>
          <span>SAFI · MOROCCO</span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 250,
            fontWeight: 900,
            letterSpacing: -12,
            lineHeight: 1,
            marginTop: 20,
            backgroundImage: "linear-gradient(115deg, #7C3AED, #C084FC, #FF6EB4, #F0ABFC)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          RAZANE
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
          <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.05 }}>{title}</div>
          <div style={{ fontSize: 30, marginTop: 14, color: "#CDBFF2" }}>{subtitle}</div>
        </div>
        <div
          style={{
            position: "absolute",
            right: 70,
            top: 120,
            width: 200,
            height: 200,
            borderRadius: 999,
            border: "6px solid #fff",
            background: "linear-gradient(115deg, #C084FC, #F0ABFC, #FF9FCF)",
            color: "#1A0A2E",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            fontSize: 30,
            fontWeight: 800,
            transform: "rotate(14deg)",
            padding: 20,
          }}
        >
          Open to internships
        </div>
      </div>
    ),
    ogSize,
  );
}
