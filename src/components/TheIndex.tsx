import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/link";
import { featuredProjects } from "@/content/projects";
import { skillGroups } from "@/content/skills";
import { pick } from "@/lib/i18n";
import { pad } from "@/lib/sections";
import { Section, SectionHeading } from "./Section";
import { Sticker } from "./Sticker";
import { IndexHighlighter } from "@/interactions/IndexHighlighter";

export async function TheIndex({ locale }: { locale: Locale }) {
  const t = await getTranslations("index");
  const ts = await getTranslations("stories");
  const byslug = new Map(featuredProjects.map((p) => [p.slug, p]));

  return (
    <Section
      id="the-index"
      sectionKey="index"
      className="section bg-bg-2"
    >
      <div className="wrap the-index">
        <IndexHighlighter />
        <SectionHeading sectionKey="index" titleId="index-title">
          <p className="mt-6 max-w-[38em] text-[19px] text-ink-2">{t("intro")}</p>
        </SectionHeading>

        <div className="mt-12 grid grid-cols-12 gap-x-4 lg:gap-x-10 gap-y-10">
          <div className="col-span-12 columns-1 gap-10 md:columns-2 lg:col-span-8 [column-rule:1px_solid_var(--rule)]">
            {skillGroups.map((g) => (
              <section key={g.id} className="mb-8 break-inside-avoid" aria-labelledby={`idx-${g.id}`}>
                <h3 id={`idx-${g.id}`} className="display border-b-2 border-ink pb-1 text-[30px]">
                  {pick(g.title, locale)}
                </h3>
                <ul className="mt-1">
                  {g.skills.map((s) => (
                    <li
                      key={s.name}
                      className="index-entry flex items-baseline gap-2 rounded-md px-1.5 py-1 text-[17px]"
                      data-projects={s.projects.join(" ")}
                    >
                      <span className="font-semibold">{s.name}</span>
                      <span className="flex-1 translate-y-[-4px] border-b-2 border-dotted border-rule-strong" aria-hidden="true" />
                      {s.projects.length ? (
                        <span className="flex gap-1.5 text-[15px]">
                          <span className="sr-only">{t("seeAlso")}:</span>
                          {[...s.projects].sort((a, b) => (byslug.get(a)?.order ?? 0) - (byslug.get(b)?.order ?? 0)).map((slug) => {
                            const p = byslug.get(slug);
                            return p ? (
                              <Link key={slug} href={`/stories/${slug}`} className="link page-counter inline-block min-w-6 text-center" title={p.title}>
                                <span aria-hidden="true">{pad(p.order)}</span>
                                <span className="sr-only">{p.title}</span>
                              </Link>
                            ) : null;
                          })}
                        </span>
                      ) : (
                        <span className="hand text-[19px] text-ink-2">{t("coursework")}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <aside className="col-span-12 lg:col-span-4" aria-label={ts("readStory")}>
            <div className="paper-card sticky top-8 p-6">
              <div className="flex items-center justify-between">
                <p className="kicker">{(await getTranslations("sections"))("stories.name")}</p>
                <Sticker name="star" size={44} className="sticker-wobble" />
              </div>
              <ol className="mt-3 space-y-1">
                {featuredProjects.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/stories/${p.slug}`} className="legend-item flex items-baseline gap-3 rounded-lg px-2 py-1.5 no-underline" data-slug={p.slug}>
                      <span className="page-counter text-[18px]">{pad(p.order)}</span>
                      <span className="display text-[24px]">{p.title}</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </Section>
  );
}
