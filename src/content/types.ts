// Shared content types. Every string a visitor reads is localized: { en, fr }.

export type Localized = { en: string; fr: string };

export type Category = "fullstack" | "api" | "frontend" | "data";

export type StickerName =
  | "heart"
  | "sparkle"
  | "star"
  | "coffee"
  | "whistle"
  | "cards"
  | "book"
  | "chart"
  | "laptop"
  | "moroccan-star";

export type TourStep = {
  layer: string; // must match one of project.architecture.layers
  detail: Localized;
};

export type TourRequest = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  steps: TourStep[];
  status: number;
  response: unknown; // mocked JSON shown in the console
};

export type Project = {
  slug: string; // "factoryflow"
  title: string; // "FactoryFlow"
  pitch: Localized; // one line
  year: number;
  period: Localized; // "Sep – Oct 2026"
  role: Localized; // "Solo" | "Lead developer" ...
  team: number;
  category: Category[];
  stack: string[];
  links: { github: string; live?: string; docs?: string; figma?: string };
  cover?: string; // image path in /public; generated cover art is used when missing
  marginNote?: Localized; // handwritten Caveat note next to the spread
  metrics: { label: Localized; value: string }[]; // "Tests" / "99 passing"
  tldr: Localized[];
  architecture: { title: Localized; layers: string[] };
  tour?: TourRequest[]; // "Request tour" console on the case study
  story: {
    problem: Localized;
    built: { title: Localized; body: Localized }[];
    hardest: Localized;
    learned: Localized;
  };
  featured: boolean;
  order: number;
};

export type MiniProject = {
  title: string;
  blurb: Localized;
  stack: string[];
  github?: string;
};
