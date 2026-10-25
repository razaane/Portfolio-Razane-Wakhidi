import "server-only";
import fs from "node:fs";
import path from "node:path";
import { profile } from "@/content/profile";
import type { Locale } from "@/i18n/routing";

// Links the PDF when it exists in /public, otherwise the printable CV page.
export function cvHref(locale: Locale) {
  const pdf = profile.cv[locale];
  if (fs.existsSync(path.join(process.cwd(), "public", pdf))) return pdf;
  return locale === "en" ? "/cv" : `/${locale}/cv`;
}
