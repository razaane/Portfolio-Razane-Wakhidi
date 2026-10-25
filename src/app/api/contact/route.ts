import { z } from "zod";
import { Resend } from "resend";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().max(120),
  message: z.string().trim().min(10).max(4000),
  company: z.string().max(0).optional(), // honeypot
  locale: z.enum(["en", "fr"]).optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Bots fill the honeypot: pretend everything went fine.
  if (body && typeof body === "object" && "company" in body && (body as { company?: string }).company) {
    return Response.json({ ok: true });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, error: "invalid", issues: parsed.error.issues.map((i) => i.path.join(".")) }, { status: 422 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) return Response.json({ ok: false, error: "not_configured" }, { status: 503 });

  const { name, email, message, locale } = parsed.data;
  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
    to: process.env.CONTACT_TO_EMAIL ?? "wakhidirazane@gmail.com",
    replyTo: email,
    subject: `New reply to your ad from ${name}`,
    text: `${message}\n\n— ${name} <${email}> (${locale ?? "en"})`,
  });
  if (error) return Response.json({ ok: false, error: "send_failed" }, { status: 502 });
  return Response.json({ ok: true });
}
