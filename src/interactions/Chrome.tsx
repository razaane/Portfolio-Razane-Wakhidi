"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname as useNextPathname } from "next/navigation";
import { localizeHref, stripLocale } from "@/i18n/href";
import { pad, sections, totalPages } from "@/lib/sections";
import { setEdition, toggleSourceMode, useHtmlAttr } from "@/lib/dom-state";
import { playSound, setSoundEnabled, soundEnabled } from "@/lib/sound";
import { Cursor } from "./Cursor";

type Story = { slug: string; title: string };
export type ChromeStrings = Record<string, string>;

// The chrome gets its few strings from the server as a flat dictionary, so next-intl's
// message formatter never ships to the browser.
const Strings = createContext<{ dict: ChromeStrings; locale: string }>({ dict: {}, locale: "en" });
const useTranslations = (ns?: string) => {
  const { dict } = useContext(Strings);
  return (key: string) => dict[ns ? `${ns}.${key}` : key] ?? key;
};
const useLocale = () => useContext(Strings).locale;
const usePathname = () => stripLocale(useNextPathname());
const useHref = () => {
  const locale = useLocale();
  return (href: string) => localizeHref(href, locale);
};

export function Chrome(props: { stories: Story[]; repo: string; email: string; strings: ChromeStrings; locale: string }) {
  return (
    <Strings.Provider value={{ dict: props.strings, locale: props.locale }}>
      <ChromeInner {...props} />
    </Strings.Provider>
  );
}

function ChromeInner({ stories, repo, email }: { stories: Story[]; repo: string; email: string }) {
  const t = useTranslations();
  const dialog = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const href = useHref();

  const openContents = () => {
    playSound("rustle");
    dialog.current?.showModal();
  };

  const sourceMessages = { on: t("source.on"), off: t("source.off") };

  // Keyboard: ← → move between pages, M opens the contents, S flips Source Mode.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
      const el = e.target as HTMLElement;
      if (el.closest("input, textarea, select, [contenteditable='true'], canvas, [role='radiogroup']")) return;
      const key = e.key.toLowerCase();
      if (key === "m") {
        e.preventDefault();
        if (dialog.current?.open) dialog.current.close();
        else openContents();
      } else if (key === "s") {
        e.preventDefault();
        toggleSourceMode(sourceMessages);
      } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const pages = [...document.querySelectorAll<HTMLElement>("[data-page]")];
        if (!pages.length) return;
        const mid = window.innerHeight * 0.35;
        let current = pages.findIndex((p) => p.getBoundingClientRect().bottom > mid);
        if (current < 0) current = pages.length - 1;
        const next = pages[Math.min(pages.length - 1, Math.max(0, current + (e.key === "ArrowRight" ? 1 : -1)))];
        e.preventDefault();
        next.scrollIntoView({ block: "start" });
        next.focus({ preventScroll: true });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A hello for developers who open DevTools.
  useEffect(() => {
    console.log(
      "%cRAZANE%c — The Purple Edition\n\nHello, fellow developer! This site is data-driven: press S to see the code behind each page.\nSource: %s\nSay hi: %s",
      "font: 900 28px Georgia, serif; color: #7C3AED",
      "font: 14px system-ui; color: #C084FC",
      repo,
      email,
    );
  }, [repo, email]);

  return (
    <>
      <div id="live-region" aria-live="polite" className="sr-only" />

      <header aria-label={t("nav.contents")}>
      {/* Ribbon bookmark (desktop) */}
      <button type="button" className="ribbon no-print max-lg:hidden" onClick={openContents} aria-label={t("nav.openContents")}>
        <span aria-hidden="true">{t("nav.contents")}</span>
      </button>

      {/* Top-right controls */}
      <div className="no-print fixed right-3 top-3 z-50 flex items-center gap-1.5 lg:right-[76px] lg:top-4">
        <LanguageSwitch />
        <SoundToggle />
        <EditionToggle />
      </div>

      {/* Page counter (desktop) */}
      <div className="no-print fixed bottom-5 right-6 z-40 max-lg:hidden">
        <PageCounter />
      </div>

      {/* Page corner: Source Mode */}
      <SourceCorner messages={sourceMessages} />
      </header>

      {/* Bottom bar (phones and tablets) */}
      <nav className="bottom-bar no-print lg:hidden" aria-label={t("nav.contents")}>
        <button type="button" className="btn btn-sm btn-primary" onClick={openContents}>
          {t("nav.contents")}
        </button>
        <PageCounter />
        <button
          type="button"
          className="btn btn-sm btn-ghost mono"
          onClick={() => toggleSourceMode(sourceMessages)}
          aria-label={t("nav.source")}
        >
          {"</>"}
        </button>
      </nav>

      <dialog
        ref={dialog}
        className="contents-dialog"
        aria-labelledby="contents-title"
        onClick={(e) => e.target === dialog.current && dialog.current.close()}
      >
        <div className="flex h-full flex-col overflow-y-auto px-7 pb-10 pt-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="kicker text-ink-2">RAZANE · No. 01</p>
              <h2 id="contents-title" className="display mt-1 text-[64px]">
                {t("nav.contents")}
              </h2>
            </div>
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => dialog.current?.close()}>
              {t("nav.close")}
            </button>
          </div>
          <ol className="mt-8 space-y-3">
            {sections.map((s, i) => (
              <li key={s.id}>
                <Link
                  href={isHome ? `#${s.id}` : href(`/#${s.id}`)}
                  className="toc-row group py-1"
                  onClick={() => dialog.current?.close()}
                >
                  <span className="display text-[28px] group-hover:text-accent">{t(`sections.${s.key}.name`)}</span>
                  <span className="leader" aria-hidden="true" />
                  <span className="page-counter text-[20px]">p. {pad(i + 1)}</span>
                  <span className="col-span-3 -mt-1 text-[15px] text-ink-2">{t(`sections.${s.key}.label`)}</span>
                </Link>
                {s.key === "stories" && (
                  <ol className="mb-2 ml-1 mt-2 grid grid-cols-2 gap-x-4 gap-y-1 border-l-2 border-accent pl-4">
                    {stories.map((story, n) => (
                      <li key={story.slug}>
                        <Link
                          href={href(`/stories/${story.slug}`)}
                          className="link text-[15px]"
                          onClick={() => dialog.current?.close()}
                        >
                          {pad(n + 1)} {story.title}
                        </Link>
                      </li>
                    ))}
                  </ol>
                )}
              </li>
            ))}
          </ol>
          <p className="mt-auto pt-10 text-[14px] text-ink-2">{t("nav.keyboard")}</p>
        </div>
      </dialog>

      <Cursor label={`${t("stories.readStory")} →`} />
    </>
  );
}

function PageCounter() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState<number>(totalPages);

  useEffect(() => {
    const pages = [...document.querySelectorAll<HTMLElement>("[data-page]")];
    setTotal(pages.length);
    setPage(1);
    const visible = new Map<Element, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target, e.intersectionRatio);
        let best = 0;
        let bestRatio = -1;
        pages.forEach((p, i) => {
          const r = visible.get(p) ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            best = i;
          }
        });
        if (bestRatio > 0) setPage(best + 1);
      },
      { threshold: [0, 0.15, 0.3, 0.5, 0.75, 1], rootMargin: "-30% 0px -30% 0px" },
    );
    pages.forEach((p) => io.observe(p));
    return () => io.disconnect();
  }, [pathname]);

  if (!total) return null;
  return (
    <p className="page-counter px-3 text-[18px]" aria-live="off">
      <span className="sr-only">Page </span>
      {t("page")} {pad(page)} <span className="text-ink-2">/ {pad(total)}</span>
    </p>
  );
}

function EditionToggle() {
  const t = useTranslations("nav.edition");
  const theme = useHtmlAttr("data-theme", "day");
  const night = theme === "night";

  return (
    <button
      type="button"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setEdition(night ? "day" : "night", { x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
      className="sticker-wobble grid size-11 place-items-center rounded-full border-2 border-white bg-surface shadow-[var(--shadow)]"
      aria-label={night ? t("switchToDay") : t("switchToNight")}
      title={night ? t("night") : t("day")}
    >
      <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true">
        {night ? (
          <path d="M21 4a12 12 0 1 0 7 19A10 10 0 0 1 21 4Z" fill="#F0ABFC" stroke="#1A0A2E" strokeWidth="2" strokeLinejoin="round" />
        ) : (
          <g stroke="#1A0A2E" strokeWidth="2" strokeLinecap="round">
            <circle cx="16" cy="16" r="6.5" fill="#FF6EB4" />
            <path d="M16 3v3M16 26v3M3 16h3M26 16h3M6.8 6.8l2.1 2.1M23.1 23.1l2.1 2.1M6.8 25.2l2.1-2.1M23.1 8.9l2.1-2.1" />
          </g>
        )}
      </svg>
    </button>
  );
}

function LanguageSwitch() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const other = locale === "en" ? "fr" : "en";
  return (
    <Link
      href={localizeHref(pathname, other)}
      onClick={() => playSound("rustle")}
      className="grid h-11 min-w-11 place-items-center rounded-full border-2 border-white bg-surface px-3 text-[14px] font-bold shadow-[var(--shadow)] no-underline"
      aria-label={`${t("languageShort")} · ${t("language")}`}
      hrefLang={other}
    >
      {t("languageShort")}
    </Link>
  );
}

function SoundToggle() {
  const t = useTranslations("nav.sound");
  const [on, setOn] = useState(false);
  useEffect(() => setOn(soundEnabled()), []);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? t("on") : t("off")}
      title={on ? t("on") : t("off")}
      onClick={() => {
        setSoundEnabled(!on);
        setOn(!on);
        if (!on) playSound("pop");
      }}
      className="grid size-11 place-items-center rounded-full border-2 border-white bg-surface shadow-[var(--shadow)]"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 9v6h4l5 4V5L8 9Z" fill="currentColor" />
        {on ? <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" /> : <path d="m17 9 5 6M22 9l-5 6" />}
      </svg>
    </button>
  );
}

function SourceCorner({ messages }: { messages: { on: string; off: string } }) {
  const t = useTranslations("nav");
  const source = useHtmlAttr("data-source");
  return (
    <button
      type="button"
      className="corner-fold no-print max-lg:hidden"
      aria-pressed={source === "on"}
      aria-label={`${t("source")} (S)`}
      title={t("sourceHint")}
      onClick={() => toggleSourceMode(messages)}
    >
      <span className="fold" aria-hidden="true" />
      <span className="fold-label" aria-hidden="true">
        {"</>"}
      </span>
    </button>
  );
}
