import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { profile } from "@/content/profile";
import { featuredProjects } from "@/content/projects";
import { stickerSheet } from "@/content/skills";
import { pick } from "@/lib/i18n";
import { Section } from "./Section";
import { Sticker } from "./Sticker";
import { Masthead } from "@/interactions/Masthead";
import { StickerSheet } from "@/interactions/StickerSheet";
import { cvHref } from "@/lib/cv";

// "99 tests, zero drama" → big "99" + the rest, like a magazine cover line.
function CoverLine({ text }: { text: string }) {
  const m = text.match(/\d+/);
  if (!m || m.index === undefined) return <>{text}</>;
  return (
    <>
      {text.slice(0, m.index)}
      <span className="display mr-1 align-[-0.08em] text-[56px] leading-none text-accent">{m[0]}</span>
      {text.slice(m.index + m[0].length)}
    </>
  );
}

export async function Cover({ locale }: { locale: Locale }) {
  const t = await getTranslations("cover");
  const title = pick(profile.title, locale);
  const titleOf = (slug: string) => featuredProjects.find((p) => p.slug === slug)?.title ?? slug;
  const stickerItems = stickerSheet.map((s) => ({
    id: s.id,
    label: s.label,
    usedIn: s.projects.length ? `${t("stickers.usedIn")} ${s.projects.map(titleOf).join(", ")}` : t("stickers.notUsed"),
  }));

  return (
    <Section
      id="cover"
      sectionKey="cover"
    >
      <div className="wrap flex min-h-svh flex-col pb-10 pt-20">
        {/* Issue strip */}
        <div className="rule-double flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pt-2 text-[14px] font-semibold uppercase tracking-[0.12em]">
          <span>{pick(profile.issue, locale)}</span>
          <span className="max-sm:hidden">
            {profile.name} · {pick(profile.location, locale)}
          </span>
          <span className="text-ink-2 max-md:hidden">{locale === "fr" ? "Prix : un entretien" : "Price: one interview"}</span>
        </div>

        {/* Masthead */}
        <div className="relative mt-4 sm:mt-6">
          <h1>
            <span className="sr-only">
              {profile.name} — {title}
            </span>
            <Masthead text={profile.masthead} tiltLabel={t("tilt")} />
          </h1>
          {/* Status sticker */}
          <span className="holo-badge relative ml-auto mt-3 grid sm:absolute sm:mt-0 size-[88px] rotate-[14deg] place-items-center rounded-full text-center text-[14px] font-bold leading-tight sm:-bottom-10 sm:right-0 sm:size-[118px] sm:text-[16px] lg:-bottom-8 lg:right-[1%]">
            <span className="px-2">
              <span className="block text-[20px]" aria-hidden="true">
                ✦
              </span>
              {pick(profile.status, locale)}
            </span>
          </span>
        </div>

        {/* Cover story + cover lines */}
        <div className="mt-6 grid grid-cols-12 gap-x-4 lg:gap-x-8 gap-y-10 lg:mt-10">
          <div className="col-span-12 lg:col-span-7">
            <p className="kicker text-ink-2">{pick(profile.positioning, locale)}</p>
            <p className="display mt-3 text-[clamp(34px,4.6vw,64px)] leading-[1.02]">{title}</p>
            <p className="mt-5 max-w-[34em] text-[19px] text-ink-2">{pick(profile.subline, locale)}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#editors-letter" className="btn btn-primary">
                {t("readIssue")} <span aria-hidden="true">↓</span>
              </a>
              <a href={cvHref(locale)} className="btn btn-ghost" download={cvHref(locale).endsWith(".pdf") || undefined}>
                {t("downloadCv")}
              </a>
            </div>
            <p className="mt-6 flex flex-wrap gap-x-5 gap-y-1 text-[16px]">
              <a className="link" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
              <a className="link" href={profile.github} target="_blank" rel="noreferrer">
                GitHub {profile.githubHandle}
              </a>
              {profile.linkedin && (
                <a className="link" href={profile.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              )}
            </p>
          </div>

          <aside className="col-span-12 lg:col-span-5" aria-label={t("coverLines")}>
            <p className="kicker border-b border-rule pb-2">{t("coverLines")}</p>
            <ul>
              {profile.coverLines.map((line, i) => (
                <li key={i} className="flex items-center gap-3 border-b border-rule py-3 text-[20px] font-semibold leading-tight">
                  <span>
                    <CoverLine text={pick(line, locale)} />
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center gap-3">
              <Sticker name="sparkle" size={44} className="sticker-wobble" />
              <p className="hand text-[24px] text-ink-2">{pick(profile.brandLine, locale)}</p>
            </div>
          </aside>
        </div>

        <div className="mt-auto pt-10">
          <StickerSheet
            items={stickerItems}
            labels={{
              title: t("stickers.title"),
              hint: t("stickers.hint"),
              place: t("stickers.place"),
              tidy: t("stickers.tidy"),
              usedIn: t("stickers.usedIn"),
              placed: t.raw("stickers.placed") as string,
            }}
          />
        </div>
      </div>
    </Section>
  );
}
