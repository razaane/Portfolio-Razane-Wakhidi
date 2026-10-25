import { useTranslations } from "next-intl";
import { Link } from "@/i18n/link";
import { RedCard } from "@/interactions/RedCard";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <div className="wrap grid min-h-svh place-items-center py-24 text-center">
      <div className="flex flex-col items-center">
        <p className="kicker text-ink-2">404 · p. ??</p>
        <RedCard flipLabel={t("flip")} />
        <h1 className="display mt-10 text-[clamp(56px,9vw,120px)]">{t("title")}</h1>
        <p className="mt-2 text-[22px] text-ink-2">{t("body")}</p>
        <Link href="/" className="btn btn-primary mt-8">
          ← {t("back")}
        </Link>
      </div>
    </div>
  );
}
