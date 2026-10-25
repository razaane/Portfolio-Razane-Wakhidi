import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  // English stays the default unless the visitor picks French with the toggle.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
