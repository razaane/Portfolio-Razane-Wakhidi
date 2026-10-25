import { getLocale, getTranslations } from "next-intl/server";
import { featuredProjects } from "@/content/projects";
import { profile, site } from "@/content/profile";
import { sections } from "@/lib/sections";
import { Chrome, type ChromeStrings } from "@/interactions/Chrome";

// Server wrapper: hands the client chrome only the few strings it needs.
export async function SiteChrome() {
  const t = await getTranslations();
  const locale = await getLocale();
  const keys = [
    "nav.contents", "nav.openContents", "nav.close", "nav.page", "nav.keyboard", "nav.language", "nav.languageShort",
    "nav.sound.on", "nav.sound.off", "nav.source", "nav.sourceHint", "nav.edition.day", "nav.edition.night",
    "source.on", "source.off", "stories.readStory",
    ...sections.flatMap((s) => [`sections.${s.key}.name`, `sections.${s.key}.label`]),
  ];
  const strings: ChromeStrings = Object.fromEntries(keys.map((k) => [k, t(k)]));
  strings["nav.edition.switchToDay"] = t("nav.edition.switchTo", { edition: t("nav.edition.day") });
  strings["nav.edition.switchToNight"] = t("nav.edition.switchTo", { edition: t("nav.edition.night") });
  const stories = featuredProjects.map((p) => ({ slug: p.slug, title: p.title }));
  return <Chrome stories={stories} repo={site.repo} email={profile.email} strings={strings} locale={locale} />;
}
