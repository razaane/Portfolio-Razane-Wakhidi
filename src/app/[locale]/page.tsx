import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Cover } from "@/components/Cover";
import { EditorsLetter } from "@/components/EditorsLetter";
import { FeatureStories } from "@/components/FeatureStories";
import { TheIndex } from "@/components/TheIndex";
import { BackIssues } from "@/components/BackIssues";
import { Lab } from "@/components/Lab";
import { OffTheClock } from "@/components/OffTheClock";
import { Classifieds } from "@/components/Classifieds";
import { Colophon } from "@/components/Colophon";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  return (
    <>
      <Cover locale={locale} />
      <EditorsLetter locale={locale} />
      <FeatureStories locale={locale} />
      <TheIndex locale={locale} />
      <BackIssues locale={locale} />
      <Lab locale={locale} />
      <OffTheClock locale={locale} />
      <Classifieds locale={locale} />
      <Colophon locale={locale} />
    </>
  );
}
