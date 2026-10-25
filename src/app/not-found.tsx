import Link from "next/link";
import "@/styles/globals.css";

// Fallback for requests outside any locale (e.g. a missing file).
export default function GlobalNotFound() {
  return (
    <html lang="en" data-theme="day">
      <body style={{ display: "grid", placeItems: "center", minHeight: "100svh", textAlign: "center", fontFamily: "Georgia, serif" }}>
        <div>
          <p style={{ fontSize: 72, margin: 0 }}>🟥</p>
          <h1 style={{ fontSize: 48, margin: "8px 0" }}>Red card!</h1>
          <p>This page is off the pitch.</p>
          <Link className="link" href="/">
            Back to the cover
          </Link>
        </div>
      </body>
    </html>
  );
}
