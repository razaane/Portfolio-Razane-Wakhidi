import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { timeline } from "@/content/timeline";
import { pick } from "@/lib/i18n";
import { Section, SectionHeading } from "./Section";

const covers = [
  "bg-[linear-gradient(160deg,#ffffff,#ede3ff)]",
  "bg-[linear-gradient(160deg,#fbe3ff,#f0abfc)]",
  "bg-[linear-gradient(160deg,#e9d5ff,#c084fc)]",
  "bg-[linear-gradient(160deg,#7c3aed,#2d1b69)]",
  "bg-[linear-gradient(160deg,#2d1b69,#1a0a2e)]",
];

export async function BackIssues({ locale }: { locale: Locale }) {
  const t = await getTranslations("issues");
  const issues = [...timeline].reverse(); // oldest first, like a shelf

  return (
    <Section
      id="back-issues"
      sectionKey="issues"
      className="section"
    >
      <div className="wrap">
        <SectionHeading sectionKey="issues" titleId="issues-title">
          <p className="mt-6 max-w-[38em] text-[19px] text-ink-2">{t("intro")}</p>
        </SectionHeading>

        <ol className="-mx-4 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-8 pt-4 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0">
          {issues.map((p, i) => {
            const dark = i >= 3;
            const latest = i === issues.length - 1;
            return (
              <li key={p.issue} className="flex w-[260px] flex-none snap-start lg:w-auto">
                <article
                  className={`mini-cover @container relative flex min-h-[360px] w-full flex-col rounded-[14px] border-4 border-white p-4 shadow-[var(--shadow)] ${covers[i]} ${dark ? "text-paper-50" : "text-plum-950"}`}
                  aria-label={`${t("issue")} ${p.issue} · ${pick(p.period, locale)}`}
                >
                  <div className="flex flex-col text-[14px] font-bold uppercase leading-snug tracking-[0.1em]">
                    <span>No. {p.issue}</span>
                    <span>{pick(p.period, locale)}</span>
                  </div>
                  <p aria-hidden="true" className="display mt-2 text-[21cqw] font-black leading-none tracking-[-0.04em]">
                    RAZANE
                  </p>
                  <h3 className="display mt-auto text-[22px] leading-[1.12]">{pick(p.focus, locale)}</h3>
                  <ul className="mt-3 border-t border-current/40 pt-2 text-[14px] font-semibold" aria-label={t("repos")}>
                    {p.repos.map((r) => (
                      <li key={r}>▸ {r}</li>
                    ))}
                  </ul>
                  {latest && (
                    <span className="holo-badge absolute -right-3 -top-3 rotate-12 rounded-full px-3 py-1 text-[14px] font-bold">
                      {locale === "fr" ? "Nouveau" : "Latest"}
                    </span>
                  )}
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
