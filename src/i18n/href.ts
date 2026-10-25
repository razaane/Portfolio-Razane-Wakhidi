import { routing } from "./routing";

// "/stories/x" → "/fr/stories/x", "/#cover" → "/fr#cover"; English stays unprefixed.
export function localizeHref(href: string, locale: string) {
  if (locale === routing.defaultLocale || !href.startsWith("/")) return href;
  if (href === "/") return `/${locale}`;
  if (href.startsWith("/#")) return `/${locale}${href.slice(1)}`;
  return `/${locale}${href}`;
}

// "/fr/stories/x" → "/stories/x"
export function stripLocale(pathname: string) {
  const bare = pathname.replace(new RegExp(`^/(${routing.locales.join("|")})(?=/|$)`), "");
  return bare || "/";
}
