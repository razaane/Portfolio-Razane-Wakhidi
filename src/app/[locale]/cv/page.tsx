import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { profile } from "@/content/profile";
import { featuredProjects } from "@/content/projects";
import { skillGroups } from "@/content/skills";
import { pick } from "@/lib/i18n";
import { PrintButton } from "@/interactions/PrintButton";

export const metadata: Metadata = { title: "CV" };

// Printable one-page CV, generated from the same content files. Used until the PDFs are added to /public/cv.
export default async function CvPage({ params }: PageProps<"/[locale]/cv">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const t = await getTranslations("letter");
  const fr = locale === "fr";

  return (
    <div className="wrap max-w-[920px] py-20 print:max-w-none print:p-0 print:text-[12px]">
      <div className="no-print mb-8 flex justify-end">
        <PrintButton label={fr ? "Enregistrer en PDF" : "Save as PDF"} />
      </div>
      <header className="border-b-4 border-double border-ink pb-5">
        <h1 className="display text-[56px] font-black leading-none print:text-[40px]">{profile.name}</h1>
        <p className="mt-2 text-[20px] font-semibold">{pick(profile.title, locale)}</p>
        <p className="mt-2 text-[15px] text-ink-2">
          {pick(profile.location, locale)} · {profile.email} · github.com/razaane
          {profile.linkedin ? ` · ${profile.linkedin.replace(/^https?:\/\//, "")}` : ""}
        </p>
      </header>

      <section className="mt-6">
        <p className="text-[17px]">{pick(profile.positioning, locale)} {pick(profile.subline, locale)}</p>
      </section>

      <section className="mt-6">
        <h2 className="kicker border-b border-rule-strong pb-1">{fr ? "Projets" : "Projects"}</h2>
        <ul className="mt-3 space-y-3">
          {featuredProjects.map((p) => (
            <li key={p.slug} className="break-inside-avoid">
              <p className="font-bold">
                {p.title} <span className="font-normal text-ink-2">· {pick(p.role, locale)} · {pick(p.period, locale)}</span>
              </p>
              <p className="text-[15px]">{pick(p.pitch, locale)}</p>
              <p className="mono text-[13px] text-ink-2">{p.stack.join(" · ")}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="kicker border-b border-rule-strong pb-1">{fr ? "Compétences" : "Skills"}</h2>
        <dl className="mt-3 grid gap-x-6 gap-y-1 text-[15px] sm:grid-cols-[180px_1fr]">
          {skillGroups.map((g) => (
            <div key={g.id} className="contents">
              <dt className="font-semibold">{pick(g.title, locale)}</dt>
              <dd>{g.skills.map((s) => s.name).join(", ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-6">
        <h2 className="kicker border-b border-rule-strong pb-1">{t("education")}</h2>
        <ul className="mt-3 space-y-1 text-[15px]">
          {profile.education.map((e, i) => (
            <li key={i}>
              <strong>{pick(e.programme, locale)}</strong> — {e.school} <span className="text-ink-2">({pick(e.period, locale)})</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="kicker border-b border-rule-strong pb-1">{t("languages")}</h2>
          <p className="mt-2 text-[15px]">{profile.languages.map((l) => pick(l, locale)).join(" · ")}</p>
        </div>
        <div>
          <h2 className="kicker border-b border-rule-strong pb-1">{fr ? "Centres d'intérêt" : "Interests"}</h2>
          <p className="mt-2 text-[15px]">{profile.offTheClock.map((o) => pick(o.title, locale)).join(" · ")}</p>
        </div>
      </section>
    </div>
  );
}
