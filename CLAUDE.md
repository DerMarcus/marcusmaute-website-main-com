# CLAUDE.md — marcusmaute.com

Plain HTML/CSS site, no build step. Hosted on Cloudflare Pages from GitHub
(`DerMarcus/marcusmaute-website-main-com` → Cloudflare Pages; a push to `main` deploys).
**Never push from an agent session** — commit locally only, the owner pushes.

## What this is
Marcus Maute's personal site, repositioned around the **Agentic Finance Report** (2026).
Five pages plus a blog: home, the report, work with me, press, about.

## Page map
```
index.html                          Home
agentic-finance/index.html          The report
work-with-me/index.html             Speaking (advisory block hidden in an HTML comment, see below)
press/index.html                    Bios, headshot, report facts, quotes cleared for use
about/index.html                    Bio, background
blog/index.html                     Writing index ("The Blog")
blog/ai-transformation-stack.html   Article
blog/dt-vs-ai-transformation.html   Article
blog/head-of-ai-mistake.html        Article
assets/style.css                    Design system (Barlow Condensed + Lora, navy #0d2252, red #c8192c)
assets/pages.css                    Shared components for the five main pages (.page-hero, .num-list, .card, etc.)
assets/article.css                  Shared chrome for the three blog articles
assets/img/                         marcus-maute-press.jpg, agentic-finance-report-cover.jpg/.webp
llms.txt, sitemap.xml, robots.txt   At the site root
```
Blog articles carry their own per-page `<style>` for article-specific components (tables, ratio
bars, comparison cards) — they don't need `pages.css`.

## Home page section order
`index.html` runs: hero → report (`#report`) → positions (`#positions`) → manifesto (`.manifesto`,
"What I believe") → work with me (`#work`) → writing → follow → footer (moved 21 September 2026;
the report used to sit after the manifesto, and the manifesto used to sit right after the hero).
The manifesto keeps its dark background and its `border-bottom: 3px solid var(--red)`; it carries
no `border-top`, so entering it from the grey `#positions` section is a plain colour change (by
design, matches how `.sec.dark` sections read elsewhere) and leaving it into the white `#work`
section is the same dark-bottom-bar-into-light-top-border pairing that used to sit between the
manifesto and the report. Don't add a second border at either seam.

## work-with-me: advisory block hidden
The "Advisory — Two ways in." section (`The Mandate Workshop` and `Readiness assessment` cards) in
`work-with-me/index.html` is wrapped in an HTML comment (`<!-- HIDDEN 2026-09-21 (owner): advisory
block, restore when ready ... -->`) rather than deleted, so it can be restored later. Because of
that, the page hero now introduces talks and briefings directly (no more "That is where I work
with institutions, and it is what I talk about on stage."), the home page's `#work` section lists
only "Keynotes and board briefings" under `.speaking-topics`, and the report page's "Put it to
work" box points at "Talks and briefings" (`../work-with-me/index.html`) instead of "The Mandate
Workshop". If the owner asks to restore the advisory block, uncomment it and reverse those three
copy changes.

## Consistency (every page)
Same nav (The Report · Writing · About · Work with me → as `.nav-cta`), same mobile nav (adds
Press), same footer links (The Report, Work with me, Writing, Press, About, LinkedIn
https://www.linkedin.com/in/marcusmaute/, Contact mailto:marcus@marcusmaute.com), footer
"© 2026 Marcus Maute · Zürich, Switzerland", `<html lang="en-GB">`, a `<link rel="canonical">`,
a `<title>` and meta description.

## Content rules
- British spelling in any copy written for the site.
- No em-dashes inside sentences (dashes in title separators like "X — Marcus Maute" are fine).
- No "X is not Y, it is Z" negation-first constructions.
- No invented facts: no testimonials, no media/press logos, no numbers not already established
  on the site, unless the owner confirms them as real.
- Do not rewrite the blog articles' body text, only their chrome (nav, footer, CTAs).
- All internal links and asset paths are relative (never root-relative), so pages open correctly
  from disk, from a local server and on Cloudflare; link directory pages as `.../index.html`.

## Facts that must stay consistent everywhere
- Name: **Marcus Maute**. Role: **"TensorX Swiss Representative."** Location: **Zürich** (never Zug).
- **"Lead author, Agentic Finance Report (2026)."**
- Co-authors: **TensorX, AMINA Bank, Solana Foundation, APEX:E3, Cardano Foundation**.
- Guest contribution: **Blindsight**. Foreword: **Tim Grant**.
- Launch: **CV Summit 2026, Kongresshaus Zurich, 29–30 September 2026**.
- The **$4.8 trillion** addressable capital and **~200 bps** uplift figures are **modelled by
  APEX:E3, not measured** — always keep that label when citing them.
- Report site: **https://agenticfinancereport.com/**.
- **No newsletter** (removed 21 September 2026; the subscribe form was never connected to
  anything). Don't reintroduce one.
- No testimonials or media/press logos unless real and confirmed by the owner.
- Advisory and speaking are **priced on request** — no rates on the site.

## Local preview
```bash
rsync -a --delete --exclude .git . /tmp/mm-site
cd /tmp/mm-site && python3 -m http.server 8793
```
(macOS blocks a server reading directly from `~/Downloads`, so preview from `/tmp`.)
Check both desktop and the 375px mobile width; watch for `.site-frame`'s `overflow:hidden`
silently clipping anything wider than the viewport (wide tables need their own
`overflow-x:auto` wrapper, not the page-level scrollWidth check alone).
