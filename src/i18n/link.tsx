import NextLink from "next/link";
import type { ComponentProps } from "react";
import { getLocale } from "next-intl/server";
import { localizeHref } from "./href";

// Server-side localized link: no i18n runtime is shipped to the browser for it.
export async function Link({ href, ...props }: Omit<ComponentProps<typeof NextLink>, "href"> & { href: string }) {
  return <NextLink href={localizeHref(href, await getLocale())} {...props} />;
}
