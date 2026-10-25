import { featuredProjects, getProject } from "@/content/projects";
import { pick } from "@/lib/i18n";
import { ogSize, renderCover } from "@/lib/og";
import { routing, type Locale } from "@/i18n/routing";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "A feature story from RAZANE — The Purple Edition";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => featuredProjects.map((p) => ({ locale, slug: p.slug })));
}

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const p = getProject(slug)!;
  return renderCover({
    kicker: `FEATURE STORY No. ${String(p.order).padStart(2, "0")}`,
    title: p.title,
    subtitle: pick(p.pitch, locale as Locale),
  });
}
