import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/link";
import { site } from "@/content/profile";
import { Section } from "./Section";
import { Sticker } from "./Sticker";

export async function Colophon({ locale }: { locale: Locale }) {
  const t = await getTranslations("colophon");
  const ts = await getTranslations("sections");
  const updated = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(site.updated),
  );

  return (
    <Section id="colophon" sectionKey="colophon">
      <footer className="wrap pb-32 pt-16 lg:pb-16">
        <div className="rule-double grid grid-cols-12 gap-x-4 gap-y-8 lg:gap-x-8 pt-6">
          <div className="col-span-12 md:col-span-7">
            <h2 className="kicker">
              {ts("colophon.name")} <span className="sr-only">· {ts("colophon.label")}</span>
            </h2>
            <p className="display mt-3 text-[clamp(26px,3vw,36px)] leading-tight">{t("designed")}</p>
            <p className="mt-3 text-ink-2">{t("stack")}</p>
          </div>
          <div className="col-span-12 flex flex-col items-start gap-3 md:col-span-5 md:items-end">
            <Sticker name="moroccan-star" size={64} className="sticker-wobble" />
            <p className="text-[15px] text-ink-2">
              {t("updated")}: <time dateTime={site.updated}>{updated}</time>
            </p>
            <a className="link text-[15px]" href={site.repo} target="_blank" rel="noreferrer">
              {t("repo")}
            </a>
            <Link href="/#cover" className="btn btn-sm btn-ghost">
              ↑ {t("back")}
            </Link>
          </div>
        </div>
        <p aria-hidden="true" className="holo-text display mt-12 select-none text-center text-[clamp(64px,16vw,220px)] font-black leading-none opacity-50">
          RAZANE
        </p>
      </footer>
    </Section>
  );
}
