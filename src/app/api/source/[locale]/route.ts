import { routing, type Locale } from "@/i18n/routing";
import { sourcesFor } from "@/lib/source-registry";
import { highlightSource } from "@/lib/source";

// Source Mode's highlighted code, built once at build time and fetched only when a visitor presses S.
export const dynamic = "force-static";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const entries = Object.entries(sourcesFor(locale as Locale));
  const html = await Promise.all(entries.map(([, e]) => highlightSource(e.name, e.value, `rendered by <${e.component} />`)));
  return Response.json(Object.fromEntries(entries.map(([key], i) => [key, html[i]])));
}
