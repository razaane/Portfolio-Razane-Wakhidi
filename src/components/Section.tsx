import type { ReactNode } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { sourcesFor } from "@/lib/source-registry";
import { pad, pageOf, type SectionKey } from "@/lib/sections";
import { site } from "@/content/profile";
import { FlipBack } from "@/interactions/FlipBack";

// One page of the issue: the magazine view plus its Source Mode twin (the data that renders it).
export async function Section({
  id,
  sectionKey,
  children,
  className = "",
}: {
  id: string;
  sectionKey: SectionKey;
  children: ReactNode;
  className?: string;
}) {
  const page = pageOf(sectionKey);
  const t = await getTranslations();
  return (
    <section
      id={id}
      data-page={page}
      tabIndex={-1}
      aria-label={`${t(`sections.${sectionKey}.name`)} · ${t(`sections.${sectionKey}.label`)}`}
      className={`relative outline-none ${className}`}
    >
      <div className="mag-view">{children}</div>
      <SourcePanel
        sourceKey={sectionKey}
        heading={`p. ${pad(page)} · ${t(`sections.${sectionKey}.name`)}`}
      />
    </section>
  );
}

export async function SourcePanel({ sourceKey, heading }: { sourceKey: string; heading: string }) {
  const t = await getTranslations("source");
  const source = sourcesFor((await getLocale()) as Locale)[sourceKey];
  return (
    <div className="src-view wrap pb-6 pt-20">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3 font-mono text-[13px] text-[#cdbff2]">
        <span>{heading}</span>
        <FlipBack label={t("back")} messages={{ on: t("on"), off: t("off") }} />
      </div>
      <div className="src-panel">
        <div className="flex items-center gap-3 border-b border-[rgb(240_171_252/0.2)] px-4 py-2.5 font-mono text-[13px]">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="size-3 rounded-full bg-[#ff6eb4]" />
            <span className="size-3 rounded-full bg-[#c084fc]" />
            <span className="size-3 rounded-full bg-[#f0abfc]" />
          </span>
          <span className="text-[#cdbff2]">{t("file")}</span>
          <a
            href={`${site.repo}/blob/main/${source.file}`}
            className="truncate text-[#f0abfc] underline underline-offset-2"
            target="_blank"
            rel="noreferrer"
          >
            {source.file}
          </a>
        </div>
        {/* Filled from /api/source/<locale> the first time Source Mode opens. */}
        <div className="src-scroll" data-src-slot={sourceKey}>
          <p className="px-6 py-5 font-mono text-[13px] text-[#cdbff2]">…</p>
        </div>
      </div>
    </div>
  );
}

export async function SectionHeading({
  sectionKey,
  titleId,
  align = "left",
  children,
}: {
  sectionKey: SectionKey;
  titleId: string;
  align?: "left" | "center";
  children?: ReactNode;
}) {
  const t = await getTranslations("sections");
  const page = pad(pageOf(sectionKey));
  return (
    <header className={align === "center" ? "text-center" : ""}>
      <div className="rule-double flex items-baseline justify-between gap-4 pt-3">
        <span className="kicker">
          No. {page} · {t(`${sectionKey}.label`)}
        </span>
        <span className="page-counter text-[18px] text-ink-2" aria-hidden="true">
          p. {page}
        </span>
      </div>
      <h2 id={titleId} className="display mt-6 text-[clamp(48px,9vw,120px)]">
        {t(`${sectionKey}.name`)}
        <span className="sr-only"> · {t(`${sectionKey}.label`)}</span>
      </h2>
      {children}
    </header>
  );
}
