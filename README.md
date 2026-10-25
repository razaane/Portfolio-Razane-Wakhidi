# RAZANE — The Purple Edition

Portfolio of **Razane Wakhidi**, full-stack JavaScript developer and data science student from Safi, Morocco.
The site is an interactive fashion-magazine issue about a developer, with a hidden **Source Mode** (press `S`) that flips every page into the data that renders it.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · next-intl (EN / FR) · Chart.js (lazy) · Shiki (build time) · Resend · Vercel Analytics

## Run it

```bash
npm install
cp .env.example .env.local   # optional: Resend key for the contact form
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
npm run lint && npm run typecheck
```

## Update the content

Everything a visitor reads lives in `src/content/`:

| File | What it holds |
| --- | --- |
| `projects.ts` | The 6 feature stories (case studies) + the archive list. **Adding a project = adding one entry here.** |
| `profile.ts` | Cover, editor's letter, quick facts, education, Off the Clock, classifieds, links |
| `skills.ts` | The Index (skills → stories) and the cover sticker sheet |
| `timeline.ts` | Back Issues (growth timeline) |
| `lab.ts` | Clean-the-data lab rows and playground experiments |

UI strings are in `src/messages/en.json` and `fr.json`.

## Quality

Lighthouse, mobile, real (DevTools) throttling, 3 runs each:

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | 92–93 | 100 | 100 | 100 | 2.0 s | 0.04 |
| `/fr` | 88–92 | 100 | 100 | 100 | 2.1 s | 0.04 |
| `/stories/factoryflow` | 94–96 | 100 | 100 | 100 | 2.0 s | 0.00 |

Initial JavaScript on the home page: 196 KiB gzipped. CI (`.github/workflows/ci.yml`) runs lint, type-check, build and Lighthouse CI (`lighthouserc.json`) on every pull request.

## Keyboard

`←` `→` move between pages · `M` opens the contents · `S` toggles Source Mode

## Before going live

- [ ] Add `public/cv/Razane-Wakhidi-CV-EN.pdf` and `-FR.pdf` (until then, "Download CV" opens the printable `/cv` page)
- [ ] Add a portrait (`profile.portrait`) and the LinkedIn URL (`profile.linkedin`)
- [ ] Confirm the availability date (`profile.availability`)
- [ ] Check every GitHub URL in `projects.ts`, add live / Swagger links once deployed
- [ ] Replace the sample rows in `lab.ts` with the real Sell4All export
- [ ] Set `RESEND_API_KEY` and `NEXT_PUBLIC_SITE_URL` on Vercel
