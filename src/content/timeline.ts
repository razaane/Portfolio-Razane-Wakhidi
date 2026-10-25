import type { Localized } from "./types";

// Back Issues: the growth path, newest first.
export type Period = { issue: string; period: Localized; focus: Localized; repos: string[] };

export const timeline: Period[] = [
  {
    issue: "05",
    period: { en: "Aug – Oct 2026", fr: "Août – oct. 2026" },
    focus: {
      en: "JavaScript specialisation: Node APIs, MongoDB, Docker, Jest, Jira workflow, data with JS",
      fr: "Spécialisation JavaScript : API Node, MongoDB, Docker, Jest, workflow Jira, data en JS",
    },
    repos: ["FactoryFlow", "HosBank", "Sell4All"],
  },
  {
    issue: "04",
    period: { en: "May – Jun 2026", fr: "Mai – juin 2026" },
    focus: { en: "Modern front-end: Next.js, TypeScript, Framer Motion", fr: "Front-end moderne : Next.js, TypeScript, Framer Motion" },
    repos: ["Wijha"],
  },
  {
    issue: "03",
    period: { en: "Mar – May 2026", fr: "Mars – mai 2026" },
    focus: {
      en: "Laravel APIs, Swagger, Stripe, team Git-flow, first full product",
      fr: "API Laravel, Swagger, Stripe, Git-flow en équipe, premier produit complet",
    },
    repos: ["CinéHall", "QuickRef", "MarocExplore"],
  },
  {
    issue: "02",
    period: { en: "Dec 2025 – Feb 2026", fr: "Déc. 2025 – févr. 2026" },
    focus: { en: "PHP OOP, MVC, PDO, UML", fr: "PHP POO, MVC, PDO, UML" },
    repos: ["Smart Wallet", "Kari", "LinkUp"],
  },
  {
    issue: "01",
    period: { en: "Oct – Nov 2025", fr: "Oct. – nov. 2025" },
    focus: { en: "HTML, CSS, JavaScript DOM, Figma to code", fr: "HTML, CSS, JavaScript DOM, de Figma au code" },
    repos: ["Travigo", "Digital Cards", "Croisé"],
  },
];
