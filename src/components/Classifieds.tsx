import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { profile } from "@/content/profile";
import { pick } from "@/lib/i18n";
import { cvHref } from "@/lib/cv";
import { Section, SectionHeading } from "./Section";
import { Sticker } from "./Sticker";
import { ScratchCard } from "@/interactions/ScratchCard";
import { ContactForm } from "@/interactions/ContactForm";
import { CopyEmail } from "@/interactions/CopyEmail";

export async function Classifieds({ locale }: { locale: Locale }) {
  const t = await getTranslations("classifieds");
  const tc = await getTranslations("cover");
  const cv = cvHref(locale);

  return (
    <Section
      id="classifieds"
      sectionKey="classifieds"
      className="section bg-bg-2"
    >
      <div className="wrap">
        <SectionHeading sectionKey="classifieds" titleId="classifieds-title" />

        <div className="mt-12 grid grid-cols-12 gap-x-4 lg:gap-x-10 gap-y-12">
          <div className="col-span-12 lg:col-span-7">
            {/* The ad */}
            <article className="relative border-4 border-double border-ink bg-surface p-6 sm:p-8">
              <p className="kicker text-ink-2">{t("kicker")} · Safi</p>
              <h3 className="display mt-3 text-[clamp(34px,4.4vw,58px)] uppercase leading-[0.98] tracking-[-0.01em]">
                {pick(profile.classifieds.headline, locale)}
              </h3>
              <p className="classified-columns mt-5 text-[18px] leading-[1.65] sm:columns-2">{pick(profile.classifieds.body, locale)}</p>
              <Sticker name="star" size={70} className="absolute -right-2 -top-6 rotate-12 sm:-right-5" />
            </article>

            <div className="mt-12">
              <ContactForm
                email={profile.email}
                locale={locale}
                labels={{
                  title: t("form.title"),
                  name: t("form.name"),
                  email: t("form.email"),
                  message: t("form.message"),
                  send: t("form.send"),
                  sending: t("form.sending"),
                  success: t("form.success"),
                  successBody: t("form.successBody"),
                  error: t("form.error"),
                  errorBody: t("form.errorBody"),
                  invalid: t("form.invalid"),
                }}
              />
            </div>
          </div>

          <aside className="col-span-12 space-y-10 lg:col-span-5">
            <ScratchCard title={t("scratchTitle")} label={t("scratchLabel")} reveal={t("reveal")}>
              <p className="kicker text-ink-2">{t("availability")}</p>
              <p className="display mt-2 text-[28px] leading-tight">{pick(profile.status, locale)}</p>
              <p className="mt-2 text-ink-2">{pick(profile.availability, locale)}</p>
              <a href="#contact-form" className="btn btn-primary mt-5">
                {t("letsTalk")} <span aria-hidden="true">→</span>
              </a>
            </ScratchCard>

            <div>
              <h3 className="kicker border-b border-rule-strong pb-2">{t("links")}</h3>
              <ul className="mt-2 divide-y divide-rule">
                <li className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <a className="link text-[18px] font-semibold" href={`mailto:${profile.email}`}>
                    {profile.email}
                  </a>
                  <CopyEmail email={profile.email} label={t("copyEmail")} copied={t("copied")} />
                </li>
                <li className="py-3">
                  <a className="link text-[18px] font-semibold" href={profile.github} target="_blank" rel="noreferrer">
                    GitHub · {profile.githubHandle}
                  </a>
                </li>
                {profile.linkedin && (
                  <li className="py-3">
                    <a className="link text-[18px] font-semibold" href={profile.linkedin} target="_blank" rel="noreferrer">
                      LinkedIn
                    </a>
                  </li>
                )}
                <li className="py-3">
                  <a className="link text-[18px] font-semibold" href={cv} download={cv.endsWith(".pdf") || undefined}>
                    {tc("downloadCv")}
                  </a>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </Section>
  );
}
