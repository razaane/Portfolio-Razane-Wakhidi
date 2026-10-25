"use client";

import { useState } from "react";
import { Sticker } from "@/components/Sticker";
import { playSound } from "@/lib/sound";

type Labels = {
  title: string;
  name: string;
  email: string;
  message: string;
  send: string;
  sending: string;
  success: string;
  successBody: string;
  error: string;
  errorBody: string;
  invalid: string;
};

type Status = "idle" | "sending" | "success" | "error" | "invalid";

export function ContactForm({ labels, email, locale }: { labels: Labels; email: string; locale: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [invalid, setInvalid] = useState<string[]>([]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const bad = [...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input[required], textarea[required]")]
      .filter((f) => !f.checkValidity())
      .map((f) => f.name);
    setInvalid(bad);
    if (bad.length) {
      setStatus("invalid");
      form.querySelector<HTMLElement>(`[name="${bad[0]}"]`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(new FormData(form)), locale }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
      playSound("pop");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="paper-card flex items-center gap-5 p-6" role="status">
        <Sticker name="heart" size={88} className="shrink-0 -rotate-6" />
        <div>
          <p className="display text-[32px] leading-tight">{labels.success}</p>
          <p className="text-ink-2">{labels.successBody}</p>
        </div>
      </div>
    );
  }

  const field = "mt-1 w-full rounded-2xl border-2 border-rule-strong bg-surface px-4 py-3 text-[17px] text-ink outline-none aria-[invalid=true]:border-[#c0264b]";

  return (
    <form id="contact-form" noValidate onSubmit={onSubmit} className="space-y-4" aria-describedby="form-status">
      <h3 className="display text-[30px]">{labels.title}</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block font-semibold">
          {labels.name}
          <input name="name" required minLength={2} maxLength={80} autoComplete="name" className={field} aria-invalid={invalid.includes("name")} />
        </label>
        <label className="block font-semibold">
          {labels.email}
          <input name="email" type="email" required maxLength={120} autoComplete="email" className={field} aria-invalid={invalid.includes("email")} />
        </label>
      </div>
      <label className="block font-semibold">
        {labels.message}
        <textarea name="message" required minLength={10} maxLength={4000} rows={5} className={field} aria-invalid={invalid.includes("message")} />
      </label>
      {/* Honeypot: humans never see it */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
          {status === "sending" ? labels.sending : labels.send}
        </button>
        <p id="form-status" role="status" className="text-[16px]">
          {status === "invalid" && labels.invalid}
          {status === "error" && (
            <>
              <strong>{labels.error}</strong> {labels.errorBody}{" "}
              <a className="link" href={`mailto:${email}`}>
                {email}
              </a>
            </>
          )}
        </p>
      </div>
    </form>
  );
}
