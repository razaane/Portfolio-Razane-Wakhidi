import type { Metadata, Viewport } from "next";
import { ViewTransition } from "react";
import { notFound } from "next/navigation";
import { Caveat, DM_Sans, Fraunces, JetBrains_Mono } from "next/font/google";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { routing } from "@/i18n/routing";
import { profile, site } from "@/content/profile";
import { pick } from "@/lib/i18n";
import { SiteChrome } from "@/components/SiteChrome";
import "@/styles/globals.css";

const fraunces = Fraunces({ subsets: ["latin"], axes: ["SOFT", "WONK", "opsz"], variable: "--font-fraunces" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const caveat = Caveat({ subsets: ["latin"], weight: ["600"], variable: "--font-caveat", preload: false });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", preload: false });

// Sets the edition before first paint: saved choice first, then the OS setting.
const themeScript = `(function(){var d=document.documentElement;try{var t=localStorage.getItem("razane:edition");if(t!=="day"&&t!=="night"){t=matchMedia("(prefers-color-scheme: dark)").matches?"night":"day"}d.dataset.theme=t}catch(e){d.dataset.theme="day"}})()`;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F1FF" },
    { media: "(prefers-color-scheme: dark)", color: "#1A0A2E" },
  ],
};

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(site.url),
    title: { default: t("title"), template: `%s · Razane Wakhidi` },
    description: t("description"),
    authors: [{ name: profile.name, url: site.url }],
    alternates: {
      canonical: locale === "en" ? "/" : "/fr",
      languages: { en: "/", fr: "/fr", "x-default": "/" },
    },
    openGraph: {
      type: "website",
      siteName: "RAZANE — The Purple Edition",
      title: t("title"),
      description: t("description"),
      locale: locale === "fr" ? "fr_MA" : "en_US",
    },
    twitter: { card: "summary_large_image", title: t("title"), description: t("description") },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("nav");

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: pick(profile.title, locale),
    email: `mailto:${profile.email}`,
    url: site.url,
    address: { "@type": "PostalAddress", addressLocality: "Safi", addressCountry: "MA" },
    alumniOf: [
      { "@type": "EducationalOrganization", name: "YouCode (UM6P)" },
      { "@type": "CollegeOrUniversity", name: "Polydisciplinary Faculty of Sciences, Safi" },
    ],
    knowsAbout: ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "MongoDB", "Docker", "Data science"],
    sameAs: [profile.github, profile.linkedin].filter(Boolean),
  };

  return (
    <html
      lang={locale}
      data-theme="day"
      suppressHydrationWarning
      className={`${fraunces.variable} ${dmSans.variable} ${caveat.variable} ${jetbrains.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          {t("skip")}
        </a>
          <SiteChrome />
          <ViewTransition default="page">
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
          </ViewTransition>
        {process.env.VERCEL && <Analytics />}
      </body>
    </html>
  );
}
