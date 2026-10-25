import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { profile } from "@/content/profile";
import { pick } from "@/lib/i18n";
import { Section, SectionHeading } from "./Section";
import { Sticker } from "./Sticker";
import { DropCap } from "./DropCap";

function Portrait({ alt, soon }: { alt: string; soon: string }) {
  return (
    <figure className="relative mx-auto w-full max-w-[420px]">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border-[6px] border-white bg-plum-800 shadow-[var(--shadow)]">
        {profile.portrait ? (
          <>
            <Image src={profile.portrait} alt={alt} fill sizes="(min-width: 1024px) 420px, 90vw" className="object-cover grayscale contrast-125" />
            {/* purple duotone */}
            <div className="absolute inset-0 bg-[linear-gradient(160deg,#7c3aed,#ff6eb4)] mix-blend-screen opacity-70" />
            <div className="absolute inset-0 bg-plum-950 mix-blend-multiply opacity-40" />
          </>
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(120%_90%_at_30%_10%,#c084fc_0%,#7c3aed_40%,#2d1b69_75%,#1a0a2e_100%)]">
            <span aria-hidden="true" className="display select-none text-[min(64vw,300px)] font-black leading-none text-[#f0abfc]/90 [font-variation-settings:'SOFT'_100,'WONK'_1]">
              R
            </span>
            <span className="absolute bottom-4 left-4 rounded-full bg-plum-950/70 px-3 py-1 text-[14px] text-paper-50">{soon}</span>
          </div>
        )}
      </div>
      <Sticker name="heart" size={84} className="absolute -right-2 -top-6 rotate-12 sm:-right-5" />
      <Sticker name="moroccan-star" size={70} className="absolute -bottom-6 -left-4 -rotate-6" />
    </figure>
  );
}

export async function EditorsLetter({ locale }: { locale: Locale }) {
  const t = await getTranslations("letter");
  return (
    <Section
      id="editors-letter"
      sectionKey="letter"
      className="section bg-bg-2"
    >
      <div className="wrap">
        <SectionHeading sectionKey="letter" titleId="letter-title" />
        <div className="mt-12 grid grid-cols-12 gap-x-4 lg:gap-x-8 gap-y-14">
          <div className="col-span-12 md:col-span-5 lg:col-span-4">
            <Portrait alt={t("portraitAlt")} soon={t("portraitSoon")} />
          </div>

          <article className="col-span-12 md:col-span-7 lg:col-span-7 lg:col-start-6">
            <p className="kicker text-accent">{t("kicker")}</p>
            <div className="mt-4 space-y-5 text-[19px] leading-[1.7] lg:text-[20px]">
              {profile.letter.map((p, i) => (
                <p key={i}>{i === 0 ? <DropCap text={pick(p, locale)} /> : pick(p, locale)}</p>
              ))}
            </div>
            <div className="mt-6 flex items-end gap-4">
              <p className="hand text-[52px] leading-none text-accent">{t("signed")}</p>
              <svg width="120" height="24" viewBox="0 0 120 24" aria-hidden="true" className="mb-2 text-accent">
                <path d="M2 16c20-12 30 6 48-2s22-10 34-4 18 8 34-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>

            <blockquote className="mt-10 border-l-4 border-accent pl-6">
              <p className="display text-[clamp(28px,3.2vw,40px)] italic leading-[1.1]">“{pick(profile.pullQuote, locale)}”</p>
            </blockquote>
          </article>
        </div>

        {/* Quick facts */}
        <dl className="mt-16 grid grid-cols-2 border-y border-rule-strong lg:grid-cols-4" aria-label={t("facts")}>
          {profile.quickFacts.map((f, i) => (
            <div key={i} className="border-rule p-5 max-lg:odd:border-r lg:border-r lg:last:border-r-0 max-lg:[&:nth-child(-n+2)]:border-b">
              <dt className="kicker text-ink-2">{pick(f.label, locale)}</dt>
              <dd className="display mt-2 text-[clamp(22px,2.4vw,30px)] leading-tight">{pick(f.value, locale)}</dd>
            </div>
          ))}
        </dl>

        {/* Staff box: education + languages */}
        <div className="mt-12 grid grid-cols-12 gap-x-4 gap-y-8 lg:gap-x-8">
          <div className="col-span-12 lg:col-span-8">
            <h3 className="kicker">{t("education")}</h3>
            <ul className="mt-3 divide-y divide-rule border-y border-rule">
              {profile.education.map((e, i) => (
                <li key={i} className="grid gap-1 py-3 sm:grid-cols-[150px_1fr_auto] sm:gap-4">
                  <span className="text-[15px] font-semibold text-ink-2">{pick(e.period, locale)}</span>
                  <span className="font-semibold">{pick(e.programme, locale)}</span>
                  <span className="text-[15px] text-ink-2">{e.school}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <h3 className="kicker">{t("languages")}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {profile.languages.map((l, i) => (
                <li key={i} className="tag">
                  {pick(l, locale)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
