import { profile } from "@/content/profile";
import { pick } from "@/lib/i18n";
import { ogSize, renderCover } from "@/lib/og";
import { routing, type Locale } from "@/i18n/routing";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "RAZANE — The Purple Edition";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return renderCover({
    kicker: pick(profile.issue, locale).toUpperCase(),
    title: pick(profile.title, locale),
    subtitle: pick(profile.positioning, locale),
  });
}
