import { notFound } from "next/navigation";

// Any unknown path inside a locale renders the "Red card!" page.
export default function CatchAll() {
  notFound();
}
