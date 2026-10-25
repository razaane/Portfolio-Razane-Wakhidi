import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/link";
import { featuredProjects, moreProjects } from "@/content/projects";
import { pick } from "@/lib/i18n";
import { pad } from "@/lib/sections";
import { Section, SectionHeading } from "./Section";
import { ProjectArt } from "./ProjectArt";
import { StoryFilter } from "@/interactions/StoryFilter";

export async function FeatureStories({ locale }: { locale: Locale }) {
  const t = await getTranslations("stories");
  const categories = ["fullstack", "api", "frontend", "data"] as const;

  return (
    <Section
      id="feature-stories"
      sectionKey="stories"
      className="section"
    >
      <div className="wrap">
        <SectionHeading sectionKey="stories" titleId="stories-title">
          <div className="mt-6 grid grid-cols-12 items-end gap-6">
            <p className="col-span-12 max-w-[36em] text-[19px] text-ink-2 lg:col-span-6">{t("intro")}</p>
            <div className="col-span-12 lg:col-span-6 lg:justify-self-end">
              <StoryFilter
                label={t("filter")}
                options={[
                  { id: "all", label: t("all") },
                  ...categories.map((c) => ({ id: c, label: t(c) })),
                ]}
                countTemplate={t.raw("count") as string}
              />
            </div>
          </div>
        </SectionHeading>

        <ol className="mt-12">
          {featuredProjects.map((p, i) => {
            const flip = i % 2 === 1;
            const team = p.team === 1 ? t("solo") : t("people", { count: p.team });
            return (
              <li key={p.slug} className="spread border-t border-rule-strong py-12 lg:py-16" data-category={p.category.join(" ")}>
                <article className="grid grid-cols-12 items-center gap-x-4 lg:gap-x-10 gap-y-8" aria-labelledby={`story-${p.slug}`}>
                  <div className={`relative col-span-12 lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
                    <Link
                      href={`/stories/${p.slug}`}
                      data-cursor="story"
                      tabIndex={-1}
                      aria-hidden="true"
                      className="group block overflow-hidden rounded-[24px] border-[6px] border-white shadow-[var(--shadow)]"
                    >
                      <ProjectArt
                        slug={p.slug}
                        className="aspect-[4/3] w-full transition-transform duration-500 ease-mag group-hover:scale-[1.035]"
                      />
                    </Link>
                    <span
                      aria-hidden="true"
                      className={`display pointer-events-none absolute -top-10 text-[clamp(88px,12vw,168px)] font-black text-bg [-webkit-text-stroke:2px_var(--ink)] ${flip ? "-right-2 lg:-right-6" : "-left-2 lg:-left-6"}`}
                    >
                      {pad(p.order)}
                    </span>
                    {p.marginNote && (
                      <p
                        aria-hidden="true"
                        className={`hand absolute -bottom-9 text-[26px] text-accent max-sm:hidden ${flip ? "left-4 -rotate-3" : "right-4 rotate-3"}`}
                      >
                        {flip ? "↖ " : ""}
                        {pick(p.marginNote, locale)}
                        {flip ? "" : " ↗"}
                      </p>
                    )}
                  </div>

                  <div className={`col-span-12 lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
                    <p className="kicker text-ink-2">
                      No. {pad(p.order)} · {p.category.map((c) => t(c)).join(" / ")} · {p.year}
                    </p>
                    <h3 id={`story-${p.slug}`} className="mt-3">
                      <Link href={`/stories/${p.slug}`} data-cursor="story" className="no-underline">
                        <span className="display block text-[clamp(48px,6vw,88px)]">{p.title}</span>
                      </Link>
                    </h3>
                    <p className="mt-4 text-[21px] leading-snug">{pick(p.pitch, locale)}</p>
                    <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-rule py-4">
                      <div>
                        <dt className="kicker text-ink-2">{t("role")}</dt>
                        <dd className="mt-1 font-semibold leading-snug">{pick(p.role, locale)}</dd>
                      </div>
                      <div>
                        <dt className="kicker text-ink-2">{t("team")}</dt>
                        <dd className="mt-1 font-semibold">{team}</dd>
                      </div>
                      {p.metrics.slice(0, 2).map((m) => (
                        <div key={m.label.en}>
                          <dt className="kicker text-ink-2">{pick(m.label, locale)}</dt>
                          <dd className="display mt-1 text-[28px] leading-tight">{m.value}</dd>
                        </div>
                      ))}
                    </dl>
                    <ul className="mt-5 flex flex-wrap gap-2" aria-label="Stack">
                      {p.stack.map((s) => (
                        <li key={s} className="tag">
                          {s}
                        </li>
                      ))}
                    </ul>
                    <Link href={`/stories/${p.slug}`} data-cursor="story" className="btn btn-primary mt-7">
                      {t("readStory")} <span aria-hidden="true">→</span>
                      <span className="sr-only">: {p.title}</span>
                    </Link>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>

        <div className="mt-10 border-t-[3px] border-double border-rule-strong pt-8">
          <h3 className="kicker">{t("more")}</h3>
          <ul className="mt-5 columns-1 gap-8 sm:columns-2 lg:columns-3 [column-rule:1px_solid_var(--rule)]">
            {moreProjects.map((m) => (
              <li key={m.title} className="mb-5 break-inside-avoid">
                <p className="display text-[24px]">
                  {m.github ? (
                    <a href={m.github} className="hover:text-accent" target="_blank" rel="noreferrer">
                      {m.title} <span aria-hidden="true" className="text-[16px]">↗</span>
                    </a>
                  ) : (
                    m.title
                  )}
                </p>
                <p className="text-[16px] text-ink-2">{pick(m.blurb, locale)}</p>
                <p className="mono mt-1 text-[14px] text-ink-2">{m.stack.join(" · ")}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
