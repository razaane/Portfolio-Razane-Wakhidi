import type { Locale } from "@/i18n/routing";
import { profile } from "@/content/profile";
import { pick } from "@/lib/i18n";
import { Section, SectionHeading } from "./Section";
import { Sticker } from "./Sticker";

const tilt = ["-rotate-6", "rotate-3", "-rotate-2", "rotate-6"];

export async function OffTheClock({ locale }: { locale: Locale }) {
  return (
    <Section
      id="off-the-clock"
      sectionKey="offclock"
      className="section"
    >
      <div className="wrap">
        <SectionHeading sectionKey="offclock" titleId="offclock-title" />
        <ul className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {profile.offTheClock.map((item, i) => (
            <li key={item.sticker} className="group">
              <div className={`sticker-wobble inline-block ${tilt[i % tilt.length]}`}>
                <Sticker name={item.sticker} size={132} />
              </div>
              <h3 className="display mt-4 text-[32px]">{pick(item.title, locale)}</h3>
              <p className="mt-2 text-[17px] text-ink-2">{pick(item.line, locale)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-14 flex items-center justify-center gap-4">
          <Sticker name="cards" size={72} className="sticker-wobble" />
          <p className="hand text-center text-[30px] text-accent">{pick(profile.brandLine, locale)}</p>
        </div>
      </div>
    </Section>
  );
}
