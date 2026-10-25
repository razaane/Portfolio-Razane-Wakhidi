// The issue's running order. Page numbers drive the ribbon contents and the page counter.
export const sections = [
  { id: "cover", key: "cover" },
  { id: "editors-letter", key: "letter" },
  { id: "feature-stories", key: "stories" },
  { id: "the-index", key: "index" },
  { id: "back-issues", key: "issues" },
  { id: "the-lab", key: "lab" },
  { id: "off-the-clock", key: "offclock" },
  { id: "classifieds", key: "classifieds" },
  { id: "colophon", key: "colophon" },
] as const;

export type SectionKey = (typeof sections)[number]["key"];

export const pageOf = (key: SectionKey) => sections.findIndex((s) => s.key === key) + 1;
export const pad = (n: number) => String(n).padStart(2, "0");
export const totalPages = sections.length;
