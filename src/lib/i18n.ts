import type { Localized } from "@/content/types";
import type { Locale } from "@/i18n/routing";

export const pick = (value: Localized, locale: Locale) => value[locale] ?? value.en;

const isLocalized = (v: unknown): v is Localized =>
  !!v && typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 2 && "en" in v && "fr" in v;

// Deep-resolves every { en, fr } pair to the current locale. Used by Source Mode so the
// code shown matches the words on screen.
export function localize<T>(value: T, locale: Locale): unknown {
  if (isLocalized(value)) return value[locale];
  if (Array.isArray(value)) return value.map((v) => localize(v, locale));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, localize(v, locale)]));
  }
  return value;
}
