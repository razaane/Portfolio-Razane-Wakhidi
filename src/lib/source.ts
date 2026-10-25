import "server-only";
import { createHighlighter, type Highlighter } from "shiki";

let highlighter: Promise<Highlighter> | undefined;

const getHighlighter = () =>
  (highlighter ??= createHighlighter({ themes: ["catppuccin-mocha"], langs: ["typescript"] }));

const IDENT = /^[A-Za-z_$][\w$]*$/;

// Prints a value as a JavaScript literal (unquoted keys, short arrays inline).
function print(value: unknown, indent = ""): string {
  const next = indent + "  ";
  if (value === null || value === undefined) return String(value);
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value !== "object") return String(value);

  if (Array.isArray(value)) {
    if (!value.length) return "[]";
    const items = value.map((v) => print(v, next));
    const inline = `[${items.join(", ")}]`;
    if (inline.length <= 72 && !inline.includes("\n")) return inline;
    return `[\n${items.map((i) => next + i).join(",\n")},\n${indent}]`;
  }

  const entries = Object.entries(value).filter(([, v]) => v !== undefined);
  if (!entries.length) return "{}";
  const items = entries.map(([k, v]) => `${IDENT.test(k) ? k : JSON.stringify(k)}: ${print(v, next)}`);
  const inline = `{ ${items.join(", ")} }`;
  if (inline.length <= 72 && !inline.includes("\n")) return inline;
  return `{\n${items.map((i) => next + i).join(",\n")},\n${indent}}`;
}

export async function highlightSource(name: string, value: unknown, comment?: string) {
  const code = `${comment ? `// ${comment}\n` : ""}export const ${name} = ${print(value)};\n`;
  const hl = await getHighlighter();
  return hl.codeToHtml(code, { lang: "typescript", theme: "catppuccin-mocha" });
}
