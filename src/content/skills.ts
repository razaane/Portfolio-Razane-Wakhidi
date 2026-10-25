import type { Localized } from "./types";

// The Index: each skill links to the project slugs that use it. No percentages, ever.
export type Skill = { name: string; projects: string[] };
export type SkillGroup = { id: string; title: Localized; skills: Skill[] };

export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    title: { en: "Front-end", fr: "Front-end" },
    skills: [
      { name: "HTML & CSS", projects: ["hosbank", "quickref", "wijha"] },
      { name: "JavaScript", projects: ["factoryflow", "hosbank", "sell4all"] },
      { name: "TypeScript", projects: ["wijha"] },
      { name: "React", projects: ["wijha"] },
      { name: "Next.js", projects: ["wijha"] },
      { name: "Vue.js", projects: [] },
      { name: "Tailwind CSS", projects: ["hosbank", "quickref", "wijha"] },
      { name: "Bootstrap", projects: [] },
      { name: "React Query", projects: ["wijha"] },
      { name: "EJS", projects: ["hosbank"] },
    ],
  },
  {
    id: "backend",
    title: { en: "Back-end", fr: "Back-end" },
    skills: [
      { name: "Node.js · Express", projects: ["factoryflow", "hosbank", "sell4all"] },
      { name: "NestJS", projects: [] },
      { name: "PHP · Laravel", projects: ["quickref", "wijha", "cinehall"] },
      { name: "MongoDB", projects: ["factoryflow"] },
      { name: "PostgreSQL", projects: [] },
      { name: "MySQL", projects: ["hosbank", "quickref", "cinehall"] },
      { name: "REST · JWT", projects: ["factoryflow", "wijha"] },
      { name: "Swagger / OpenAPI", projects: ["factoryflow", "cinehall"] },
      { name: "Python · C", projects: [] },
    ],
  },
  {
    id: "data",
    title: { en: "Data", fr: "Data" },
    skills: [
      { name: "Data cleaning", projects: ["sell4all"] },
      { name: "Statistics", projects: ["sell4all"] },
      { name: "Chart.js", projects: ["sell4all"] },
      { name: "Python (studying)", projects: [] },
    ],
  },
  {
    id: "devops",
    title: { en: "DevOps & quality", fr: "DevOps & qualité" },
    skills: [
      { name: "Docker · Compose", projects: ["factoryflow"] },
      { name: "Jest", projects: ["factoryflow"] },
      { name: "GitHub Actions", projects: [] },
      { name: "Vercel", projects: [] },
      { name: "Linux", projects: [] },
    ],
  },
  {
    id: "design",
    title: { en: "Design & architecture", fr: "Design & architecture" },
    skills: [
      { name: "Figma · design-to-code", projects: ["quickref", "wijha"] },
      { name: "MVC", projects: ["quickref", "cinehall"] },
      { name: "Layered / N-tier", projects: ["factoryflow", "hosbank"] },
      { name: "UML", projects: ["quickref", "wijha"] },
      { name: "Clean code", projects: ["factoryflow", "hosbank"] },
    ],
  },
  {
    id: "workflow",
    title: { en: "Workflow", fr: "Workflow" },
    skills: [
      { name: "Git · GitHub", projects: ["cinehall", "hosbank"] },
      { name: "Git-flow · code review", projects: ["cinehall"] },
      { name: "Jira", projects: ["factoryflow"] },
      { name: "Scrum · Trello", projects: [] },
    ],
  },
];

// The cover's sticker sheet. Hovering a sticker shows the stories that use the tool.
export const stickerSheet: { id: AnyStickerId; label: string; projects: string[] }[] = [
  { id: "js", label: "JavaScript", projects: ["factoryflow", "hosbank", "wijha", "sell4all"] },
  { id: "node", label: "Node.js", projects: ["factoryflow", "hosbank", "sell4all"] },
  { id: "react", label: "React", projects: ["wijha"] },
  { id: "mongodb", label: "MongoDB", projects: ["factoryflow"] },
  { id: "docker", label: "Docker", projects: ["factoryflow"] },
  { id: "figma", label: "Figma", projects: ["quickref", "wijha"] },
  { id: "heart", label: "♥", projects: [] },
  { id: "coffee", label: "Coffee", projects: [] },
  { id: "whistle", label: "Whistle", projects: ["quickref"] },
];

type AnyStickerId = "js" | "node" | "react" | "mongodb" | "docker" | "figma" | "heart" | "coffee" | "whistle";
