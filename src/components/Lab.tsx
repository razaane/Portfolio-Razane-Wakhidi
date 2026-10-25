import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { lab, sales } from "@/content/lab";
import { pick } from "@/lib/i18n";
import { Section, SectionHeading } from "./Section";
import { Sticker } from "./Sticker";
import { CleanDataLab } from "@/interactions/CleanDataLab";
import { BouncingBall } from "@/interactions/BouncingBall";

export async function Lab({ locale }: { locale: Locale }) {
  const t = await getTranslations("lab");
  const [bounce, skycast, notebooks] = lab.experiments;

  return (
    <Section
      id="the-lab"
      sectionKey="lab"
      className="section bg-bg-2"
    >
      <div className="wrap">
        <SectionHeading sectionKey="lab" titleId="lab-title">
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <p className="max-w-[38em] text-[19px] text-ink-2">{pick(lab.intro, locale)}</p>
            <Sticker name="chart" size={64} className="sticker-wobble" />
          </div>
        </SectionHeading>

        <div className="mt-12">
          <h3 className="display mb-6 text-[clamp(30px,3.4vw,44px)]">
            {t("cleanTitle")} <span className="hand text-[26px] text-accent">· Sell4All</span>
          </h3>
          <CleanDataLab
            rows={sales}
            minSpend={lab.minSpend}
            locale={locale}
            labels={{
              raw: t("raw"),
              removeSmall: t("removeSmall", { min: lab.minSpend }),
              removeDupes: t("removeDupes"),
              rows: t("rows"),
              mean: t("mean"),
              median: t("median"),
              total: t("total"),
              chartTitle: t("chartTitle"),
              chartLoading: t("chartLoading"),
              tableCaption: t("tableCaption"),
              country: t("country"),
              dataNote: pick(lab.dataNote, locale),
            }}
          />
        </div>

        <div className="mt-16">
          <h3 className="kicker border-b border-rule-strong pb-2">{t("playground")}</h3>
          <div className="mt-6 grid grid-cols-12 gap-6">
            <div className="paper-card col-span-12 p-5 lg:col-span-6">
              <p className="display text-[28px]">{pick(bounce.title, locale)}</p>
              <p className="mb-4 text-[16px] text-ink-2">{pick(bounce.blurb, locale)}</p>
              <BouncingBall label={t("bounceLabel")} hint={t("bounceHint")} />
            </div>
            <div className="paper-card col-span-12 flex flex-col p-5 sm:col-span-6 lg:col-span-3">
              <p className="display text-[28px]">{pick(skycast.title, locale)}</p>
              <p className="text-[16px] text-ink-2">{pick(skycast.blurb, locale)}</p>
              <div className="mt-auto rounded-2xl bg-[linear-gradient(160deg,#7c3aed,#2d1b69)] p-4 text-paper-50">
                <p className="text-[14px] font-semibold uppercase tracking-[0.12em]">Safi · demo</p>
                <p className="display text-[44px] leading-none">24°</p>
                <p className="text-[14px]">{locale === "fr" ? "Ensoleillé · brise atlantique" : "Sunny · Atlantic breeze"}</p>
              </div>
            </div>
            <div className="paper-card col-span-12 flex flex-col p-5 sm:col-span-6 lg:col-span-3">
              <p className="display text-[28px]">{pick(notebooks.title, locale)}</p>
              <p className="text-[16px] text-ink-2">{pick(notebooks.blurb, locale)}</p>
              <div className="mt-auto flex items-center gap-3 pt-4">
                <Sticker name="laptop" size={60} />
                <span className="holo-badge rounded-full px-3 py-1 text-[14px] font-bold">{t("soon")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
