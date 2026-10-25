import "server-only";
import type { Locale } from "@/i18n/routing";
import { profile, site } from "@/content/profile";
import { featuredProjects } from "@/content/projects";
import { skillGroups, stickerSheet } from "@/content/skills";
import { timeline } from "@/content/timeline";
import { lab, sales } from "@/content/lab";
import { localize, pick } from "./i18n";
import { cvHref } from "./cv";

export type SourceEntry = { name: string; file: string; component: string; value: unknown };

// What Source Mode shows for each page: the same content objects the components render from.
export function sourcesFor(locale: Locale): Record<string, SourceEntry> {
  const cv = cvHref(locale);
  const entries: Record<string, SourceEntry> = {
    cover: {
      name: "cover",
      file: "src/content/profile.ts",
      component: "Cover",
      value: {
        masthead: profile.masthead,
        issue: pick(profile.issue, locale),
        title: pick(profile.title, locale),
        subline: pick(profile.subline, locale),
        coverLines: localize(profile.coverLines, locale),
        status: pick(profile.status, locale),
        cv,
        stickerSheet,
      },
    },
    letter: {
      name: "editorsLetter",
      file: "src/content/profile.ts",
      component: "EditorsLetter",
      value: localize(
        {
          letter: profile.letter,
          pullQuote: profile.pullQuote,
          quickFacts: profile.quickFacts,
          education: profile.education,
          languages: profile.languages,
          portrait: profile.portrait,
        },
        locale,
      ),
    },
    stories: {
      name: "featureStories",
      file: "src/content/projects.ts",
      component: "FeatureStories",
      value: localize(
        featuredProjects.map(({ slug, title, pitch, year, role, team, category, stack, links, marginNote, metrics, order }) => ({
          slug,
          title,
          pitch,
          year,
          role,
          team,
          category,
          stack,
          links,
          marginNote,
          metrics: metrics.slice(0, 2),
          order,
        })),
        locale,
      ),
    },
    index: { name: "skillGroups", file: "src/content/skills.ts", component: "TheIndex", value: localize(skillGroups, locale) },
    issues: { name: "timeline", file: "src/content/timeline.ts", component: "BackIssues", value: localize(timeline, locale) },
    lab: {
      name: "lab",
      file: "src/content/lab.ts",
      component: "Lab",
      value: { ...(localize({ intro: lab.intro, minSpend: lab.minSpend, experiments: lab.experiments }, locale) as object), sales },
    },
    offclock: { name: "offTheClock", file: "src/content/profile.ts", component: "OffTheClock", value: localize(profile.offTheClock, locale) },
    classifieds: {
      name: "classifieds",
      file: "src/content/profile.ts",
      component: "Classifieds",
      value: localize(
        { ...profile.classifieds, availability: profile.availability, email: profile.email, github: profile.github, linkedin: profile.linkedin, cv },
        locale,
      ),
    },
    colophon: { name: "site", file: "src/content/profile.ts", component: "Colophon", value: site },
  };
  for (const p of featuredProjects) {
    entries[`story:${p.slug}`] = { name: p.slug, file: "src/content/projects.ts", component: "StoryPage", value: localize(p, locale) };
  }
  return entries;
}
