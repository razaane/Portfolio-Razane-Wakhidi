import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { Link } from "@/i18n/link";
import { featuredProjects, getProject } from "@/content/projects";
import { pick } from "@/lib/i18n";
import { pad } from "@/lib/sections";
import { SourcePanel } from "@/components/Section";
import { ProjectArt } from "@/components/ProjectArt";
import { Sticker } from "@/components/Sticker";
import { DropCap } from "@/components/DropCap";
import { RequestTour } from "@/interactions/RequestTour";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => featuredProjects.map((p) => ({ locale, slug: p.slug })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/[locale]/stories/[slug]">): Promise<Metadata> {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  const p = getProject(slug);
  if (!p) return {};
  const path = `${locale === "en" ? "" : `/${locale}`}/stories/${slug}`;
  return {
    title: p.title,
    description: pick(p.pitch, locale),
    alternates: { canonical: path, languages: { en: `/stories/${slug}`, fr: `/fr/stories/${slug}` } },
    openGraph: { title: `${p.title} — Razane Wakhidi`, description: pick(p.pitch, locale), type: "article" },
  };
}

function Part({ n, title, children, id }: { n: number; title: string; id: string; children: React.ReactNode }) {
  return (
    <section id={id} data-page={n} tabIndex={-1} aria-labelledby={`${id}-title`} className="wrap py-14 outline-none lg:py-20">
      <div className="rule-double flex items-baseline justify-between pt-3">
        <span className="kicker text-ink-2">{pad(n)}</span>
        <span className="page-counter text-[18px] text-ink-2" aria-hidden="true">
          p. {pad(n)}
        </span>
      </div>
      <h2 id={`${id}-title`} className="display mt-5 text-[clamp(40px,6vw,80px)]">
        {title}
      </h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}

export default async function StoryPage({ params }: PageProps<"/[locale]/stories/[slug]">) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  setRequestLocale(locale);
  const p = getProject(slug);
  if (!p) notFound();

  const t = await getTranslations("story");
  const ts = await getTranslations("stories");
  const idx = featuredProjects.findIndex((x) => x.slug === p.slug);
  const next = featuredProjects[(idx + 1) % featuredProjects.length];
  const team = p.team === 1 ? ts("solo") : ts("people", { count: p.team });

  const links = [
    { href: p.links.github, label: t("github") },
    p.links.live && { href: p.links.live, label: t("live") },
    p.links.docs && { href: p.links.docs, label: t("docs") },
    p.links.figma && { href: p.links.figma, label: t("figma") },
  ].filter(Boolean) as { href: string; label: string }[];

  const tours = p.tour?.map((tr) => ({
    method: tr.method,
    path: tr.path,
    status: tr.status,
    response: tr.response,
    steps: tr.steps.map((s) => ({ layer: s.layer, detail: pick(s.detail, locale) })),
  }));

  return (
    <article>
      <div className="mag-view">
        {/* 1. Story cover */}
        <header id="story-cover" data-page={1} tabIndex={-1} className="wrap pb-10 pt-20 outline-none">
          <Link href="/#feature-stories" className="link text-[16px] font-semibold">
            ← {t("back")}
          </Link>
          <p className="kicker mt-8 text-ink-2">
            {ts("readStory")} · No. {pad(p.order)} · {p.year}
          </p>
          <h1 className="display mt-3 break-words text-[clamp(56px,10vw,150px)] font-black leading-[0.9]">{p.title}</h1>

          <div className="mt-10 grid grid-cols-12 items-start gap-x-4 gap-y-10 lg:gap-x-10">
            <div className="relative col-span-12 lg:col-span-7">
              <div className="overflow-hidden rounded-[28px] border-[6px] border-white shadow-[var(--shadow)]">
                <ProjectArt slug={p.slug} className="aspect-[4/3] w-full" />
              </div>
              {p.marginNote && (
                <p aria-hidden="true" className="hand absolute -bottom-9 right-6 rotate-2 text-[28px] text-accent">
                  {pick(p.marginNote, locale)} ↗
                </p>
              )}
            </div>
            <div className="col-span-12 lg:col-span-5">
              <p className="text-[clamp(20px,2vw,26px)] leading-snug">{pick(p.pitch, locale)}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {links.map((l, i) => (
                  <a key={l.href} href={l.href} className={`btn ${i === 0 ? "btn-primary" : "btn-ghost"}`} target="_blank" rel="noreferrer">
                    {l.label} <span aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-rule-strong py-5">
                <div>
                  <dt className="kicker text-ink-2">{t("year")}</dt>
                  <dd className="mt-1 font-semibold">{pick(p.period, locale)}</dd>
                </div>
                <div>
                  <dt className="kicker text-ink-2">{t("team")}</dt>
                  <dd className="mt-1 font-semibold">{team}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="kicker text-ink-2">{t("role")}</dt>
                  <dd className="mt-1 font-semibold">{pick(p.role, locale)}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="kicker text-ink-2">{t("stack")}</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {p.stack.map((s) => (
                      <span key={s} className="tag">
                        {s}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </header>

        {/* 2. TL;DR */}
        <Part n={2} id="tldr" title={t("tldr")}>
          <div className="paper-card relative max-w-[900px] p-6 sm:p-8">
            <ul className="space-y-3 text-[20px] leading-snug">
              {p.tldr.map((x, i) => (
                <li key={i} className="flex gap-3">
                  <span aria-hidden="true" className="text-accent">
                    ✦
                  </span>
                  {pick(x, locale)}
                </li>
              ))}
            </ul>
            <Sticker name="sparkle" size={64} className="absolute -right-1 -top-6 rotate-12 sm:-right-4" />
          </div>
        </Part>

        {/* 3. Problem */}
        <Part n={3} id="problem" title={t("problem")}>
          <p className="max-w-[38em] text-[21px] leading-[1.7]">
            <DropCap text={pick(p.story.problem, locale)} />
          </p>
        </Part>

        {/* 4. What I built */}
        <Part n={4} id="built" title={t("built")}>
          <ol className="grid gap-5 sm:grid-cols-2">
            {p.story.built.map((b, i) => (
              <li key={i} className="paper-card p-6">
                <span className="page-counter text-[32px] text-accent">{pad(i + 1)}</span>
                <h3 className="display mt-2 text-[26px] leading-tight">{pick(b.title, locale)}</h3>
                <p className="mt-2 text-ink-2">{pick(b.body, locale)}</p>
              </li>
            ))}
          </ol>
        </Part>

        {/* 5. How it works */}
        <Part n={5} id="how" title={t("how")}>
          <p className="kicker mb-5 text-ink-2">{pick(p.architecture.title, locale)}</p>
          <RequestTour
            layers={p.architecture.layers}
            tours={tours}
            labels={{
              title: t("tour.title"),
              hint: t("tour.hint"),
              send: t("tour.send"),
              response: t("tour.response"),
              idle: t("tour.idle"),
            }}
          />
        </Part>

        {/* 6. Hardest part */}
        <Part n={6} id="hardest" title={t("hardest")}>
          <blockquote className="max-w-[40em] border-l-4 border-accent pl-6">
            <p className="display text-[clamp(24px,2.6vw,34px)] leading-[1.25]">{pick(p.story.hardest, locale)}</p>
          </blockquote>
        </Part>

        {/* 7. Results */}
        <Part n={7} id="results" title={t("results")}>
          <dl className="grid grid-cols-2 border-y border-rule-strong lg:grid-cols-4">
            {p.metrics.map((m, i) => (
              <div key={i} className="border-rule p-5 max-lg:odd:border-r lg:border-r lg:last:border-r-0">
                <dt className="kicker text-ink-2">{pick(m.label, locale)}</dt>
                <dd className="display mt-2 text-[clamp(28px,3.6vw,48px)] leading-none">{m.value}</dd>
              </div>
            ))}
          </dl>
        </Part>

        {/* 8. Learned + next */}
        <Part n={8} id="learned" title={t("learned")}>
          <p className="max-w-[38em] text-[21px] leading-[1.7]">{pick(p.story.learned, locale)}</p>
          <p className="hand mt-6 text-[40px] text-accent">— Razane</p>

          <Link
            href={`/stories/${next.slug}`}
            data-cursor="story"
            className="group mt-16 grid grid-cols-12 items-center gap-6 rounded-[28px] border-2 border-ink p-5 no-underline transition-colors hover:bg-bg-2 sm:p-8"
          >
            <div className="col-span-12 sm:col-span-7">
              <p className="kicker text-ink-2">
                {t("next")} · No. {pad(next.order)}
              </p>
              <p className="display mt-2 text-[clamp(44px,6vw,88px)]">
                {next.title} <span aria-hidden="true">→</span>
              </p>
              <p className="mt-2 text-[18px] text-ink-2">{pick(next.pitch, locale)}</p>
            </div>
            <div className="col-span-12 overflow-hidden rounded-[20px] border-4 border-white sm:col-span-5">
              <ProjectArt slug={next.slug} className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-105" />
            </div>
          </Link>
        </Part>
        <div className="h-24 lg:h-10" />
      </div>

      <SourcePanel heading={`stories/${p.slug}`} sourceKey={`story:${p.slug}`} />
    </article>
  );
}
