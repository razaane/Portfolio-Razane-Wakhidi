"use client";

import { useState } from "react";
import { playSound } from "@/lib/sound";

export function CopyEmail({ email, label, copied }: { email: string; label: string; copied: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="btn btn-sm btn-ghost"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setDone(true);
          playSound("pop");
          setTimeout(() => setDone(false), 2000);
        } catch {
          window.location.href = `mailto:${email}`;
        }
      }}
    >
      <span aria-live="polite">{done ? copied : label}</span>
    </button>
  );
}
