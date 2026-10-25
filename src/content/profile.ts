import type { Localized, StickerName } from "./types";

export const site = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://razane.dev",
  repo: "https://github.com/razaane/portfolio",
  updated: "2026-10-23",
};

export const profile = {
  name: "Razane Wakhidi",
  masthead: "RAZANE",
  issue: { en: "No. 01 · The Purple Edition · 2026", fr: "N° 01 · L'Édition Violette · 2026" },
  title: {
    en: "Full-Stack JavaScript Developer & Data Science student",
    fr: "Développeuse Full-Stack JavaScript & étudiante en Data Science",
  },
  positioning: {
    en: "JavaScript full-stack developer with a designer's eye and a data-science brain.",
    fr: "Développeuse full-stack JavaScript avec un œil de designer et un cerveau de data scientist.",
  },
  subline: {
    en: "I design, build and test web apps, from the Figma frame to the Docker container.",
    fr: "Je conçois, développe et teste des applications web, de la maquette Figma au conteneur Docker.",
  },
  coverLines: [
    { en: "99 tests, zero drama", fr: "99 tests, zéro drame" },
    { en: "6 apps she shipped", fr: "6 applis livrées" },
    { en: "From HTML to Docker in 12 months", fr: "Du HTML à Docker en 12 mois" },
  ],
  status: { en: "Open to internships", fr: "Ouverte aux stages" },
  brandLine: { en: "Code like a girl. Ship like a boss.", fr: "Code like a girl. Ship like a boss." },
  location: { en: "Safi, Morocco", fr: "Safi, Maroc" },
  email: "wakhidirazane@gmail.com",
  github: "https://github.com/razaane",
  githubHandle: "@razaane",
  // TODO(Razane): add your LinkedIn URL. Empty hides every LinkedIn link.
  linkedin: "",
  // TODO(Razane): drop the PDFs in /public/cv with these names.
  cv: { en: "/cv/Razane-Wakhidi-CV-EN.pdf", fr: "/cv/Razane-Wakhidi-CV-FR.pdf" },
  // TODO(Razane): add a portrait (e.g. /portrait.jpg). Empty shows the monogram cover.
  portrait: "",
  // TODO(Razane): confirm the exact date before publishing.
  availability: {
    en: "Available for an internship or first role. Start date: let's agree on one.",
    fr: "Disponible pour un stage ou un premier poste. Date de début : on en discute.",
  },
  languages: [
    { en: "Arabic (native)", fr: "Arabe (langue maternelle)" },
    { en: "French (intermediate)", fr: "Français (intermédiaire)" },
    { en: "English (intermediate)", fr: "Anglais (intermédiaire)" },
  ],
  letter: [
    {
      en: "I'm Razane, a full-stack developer from Safi. I wrote my first HTML page in October 2025; a year later I ship tested, dockerised Node.js APIs and React/Next.js interfaces.",
      fr: "Je suis Razane, développeuse full-stack à Safi. J'ai écrit ma première page HTML en octobre 2025 ; un an plus tard, je livre des API Node.js testées et dockerisées et des interfaces React/Next.js.",
    },
    {
      en: "At YouCode (UM6P) I specialise in JavaScript. At the faculty I study data science, so I care about what the numbers say as much as how the screen looks.",
      fr: "À YouCode (UM6P), je me spécialise en JavaScript. À la faculté, j'étudie la data science : ce que disent les chiffres compte autant pour moi que ce que montre l'écran.",
    },
    {
      en: "I love clean architecture, pretty interfaces and projects that solve a real problem, like QuickRef, which I built for football referees.",
      fr: "J'aime l'architecture propre, les jolies interfaces et les projets qui règlent un vrai problème, comme QuickRef, que j'ai construit pour les arbitres de football.",
    },
  ] satisfies Localized[],
  pullQuote: {
    en: "Girly on the surface, engineer underneath.",
    fr: "Girly en surface, ingénieure en dessous.",
  },
  quickFacts: [
    { label: { en: "Based in", fr: "Basée à" }, value: { en: "Safi, Morocco", fr: "Safi, Maroc" } },
    { label: { en: "Track", fr: "Parcours" }, value: { en: "YouCode (UM6P), JavaScript", fr: "YouCode (UM6P), JavaScript" } },
    { label: { en: "Also studying", fr: "Étudie aussi" }, value: { en: "Data Science, Faculty of Sciences", fr: "Data Science, Faculté des Sciences" } },
    { label: { en: "Projects built", fr: "Projets réalisés" }, value: { en: "23+", fr: "23+" } },
  ],
  education: [
    {
      period: { en: "2025 – present", fr: "2025 – aujourd'hui" },
      programme: { en: "Full-Stack Web Development, JavaScript specialisation", fr: "Développement Web Full-Stack, spécialité JavaScript" },
      school: "YouCode (UM6P), Safi",
    },
    {
      period: { en: "2025 – 2026", fr: "2025 – 2026" },
      programme: { en: "Front-End Bootcamp Certificate", fr: "Certificat Bootcamp Front-End" },
      school: "YouCode (UM6P), Safi",
    },
    {
      period: { en: "2024 – present", fr: "2024 – aujourd'hui" },
      programme: { en: "Data Science studies", fr: "Études en Data Science" },
      school: "Polydisciplinary Faculty of Sciences, Safi",
    },
    {
      period: { en: "2022 – 2023", fr: "2022 – 2023" },
      programme: { en: "Baccalaureate in Mathematical Sciences", fr: "Baccalauréat Sciences Mathématiques" },
      school: "Lycée Hassan II, Safi",
    },
  ],
  offTheClock: [
    {
      sticker: "whistle",
      title: { en: "Referee", fr: "Arbitre" },
      line: {
        en: "I referee football matches: rules, fairness and quick decisions under pressure. Code reviews feel familiar.",
        fr: "J'arbitre des matchs de football : des règles, de l'équité et des décisions rapides sous pression. Les code reviews me paraissent familières.",
      },
    },
    {
      sticker: "book",
      title: { en: "Reader", fr: "Lectrice" },
      line: {
        en: "Always one book in the bag. Good documentation counts as reading too.",
        fr: "Toujours un livre dans le sac. Une bonne documentation, ça compte aussi comme lecture.",
      },
    },
    {
      sticker: "sparkle",
      title: { en: "AI & blockchain", fr: "IA & blockchain" },
      line: {
        en: "Curious about how models learn and how trust works without a middleman.",
        fr: "Curieuse de savoir comment les modèles apprennent et comment la confiance fonctionne sans intermédiaire.",
      },
    },
    {
      sticker: "coffee",
      title: { en: "Coffee, pink straw", fr: "Café, paille rose" },
      line: {
        en: "Iced, with a pink straw. Non-negotiable, like passing tests before a merge.",
        fr: "Glacé, avec une paille rose. Non négociable, comme des tests verts avant un merge.",
      },
    },
  ] satisfies { sticker: StickerName; title: Localized; line: Localized }[],
  classifieds: {
    headline: {
      en: "WANTED: a team that ships beautiful, well-tested products.",
      fr: "RECHERCHE : une équipe qui livre de beaux produits, bien testés.",
    },
    body: {
      en: "Junior full-stack JavaScript developer seeks internship or first role. Brings React, Node.js, MongoDB, Docker, Figma and a lot of curiosity. Based in Safi, open to remote and relocation.",
      fr: "Développeuse full-stack JavaScript junior cherche stage ou premier poste. Apporte React, Node.js, MongoDB, Docker, Figma et beaucoup de curiosité. Basée à Safi, ouverte au télétravail et à la mobilité.",
    },
  },
};

export type Profile = typeof profile;
