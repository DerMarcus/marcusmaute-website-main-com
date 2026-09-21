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
404.html                            Not-found page (Cloudflare Pages 404; root-relative paths, see below)
marcus-maute.md                     Site-wide factual Markdown (the Agent view's content), repo root
assets/style.css                    Design system (Barlow Condensed + Lora, navy #0d2252, red #c8192c);
                                     also carries the mode-toggle and Agent-view CSS (shared by every page)
assets/pages.css                    Shared components for the five main pages (.page-hero, .num-list, .card, etc.)
assets/article.css                  Shared chrome for the three blog articles
assets/js/site.js                   Human/Agent toggle, mobile menu (see below)
assets/img/                         marcus-maute-press.jpg, agentic-finance-report-cover.jpg/.webp
tools/build_agent_view.py           Re-embeds marcus-maute.md into every page's Agent view (see below)
llms.txt, sitemap.xml, robots.txt, _headers   At the site root
```
Blog articles carry their own per-page `<style>` for article-specific components (tables, ratio
bars, comparison cards) — they don't need `pages.css`.

## Human/Agent toggle and the Agent view
Modelled on agenticfinancereport.com's own toggle (`../agentic_report/website/agenticfinancereport.com/`).
Every page (including 404.html) carries it:
- **Desktop nav:** a compact pill (`.mode-toggle`) with a "Human" button (small circle) and an "Agent"
  button (`&gt;_`), in place of the old red "Work with me →" `nav-cta`. It sits as the last item in
  `.nav-links` and is hidden by the same `@media (max-width:768px){.nav-links{display:none}}` rule
  that already hid the CTA, so nothing extra was needed for mobile.
- **Mobile nav:** the same pill, full-width, as the *first* item inside `#nav-mobile` (tried "next to
  the burger" first and rejected it: the wordmark plus burger already use most of 375px, so a second
  control there would crowd; top-of-menu was the uncrowded choice). "Work with me →" stays in the
  mobile menu and the footer, just not as a nav button.
- **State:** `localStorage['mm-mode']` (`'human'` or `'agent'`), read and written by `assets/js/site.js`.
  Both toggles (nav + mobile) stay in sync via `aria-pressed`. `#agent` in the URL opens Agent view
  regardless of the stored mode. `toggleMenu()` (the mobile burger) moved into `site.js` as
  `window.toggleMenu`, so the existing `onclick="toggleMenu()"` markup still works.
- **human-view / agent-view:** every page's existing content (nav/mobile-nav aside) is wrapped in
  `<main id="human-view">…</main>`. Right before `<footer class="footer">` sits
  `<main id="agent-view" hidden>` (heading "Marcus Maute, in Markdown.", a one-line explainer, Copy
  Markdown / Download .md / Back-to-human-view buttons, and a `<pre id="md-view">` that `site.js`
  fills from the embedded script tag on first switch to Agent). Both regions are marked
  `<!--AGENT-VIEW-->…<!--/AGENT-VIEW-->`.
- **The embedded Markdown:** `marcus-maute.md` (repo root) is the **same, site-wide** document on
  every page (not per-page content) — who Marcus is, the Agentic Finance Report, Neo, talks and
  writing, and a link to every page. It sits inside
  `<!--AGENT-MD--><script type="text/markdown" id="agent-md">…</script><!--/AGENT-MD-->`, with
  `</script` escaped as `<\/script` (same trick as the reference site). `site.js` unescapes it into
  `#md-view` the first time a page switches to Agent view.
- **`tools/build_agent_view.py`** (stdlib only) re-embeds `marcus-maute.md` between the `<!--AGENT-MD-->`
  markers on every page that has them. It does **not** touch anything else (the toggle markup, the
  human-view wrapper, the agent-view heading/buttons are hand-authored, ordinary page content, since
  this site has no template/build step). **Re-run it after any change to `marcus-maute.md`**, and
  after any page edit that could make `marcus-maute.md` stale (a new page, a changed fact, a new
  article) — update the .md first, then run `python3 tools/build_agent_view.py`.
- **`marcus-maute.md` must stay factual**: no instructions addressed to AI systems, no hidden text,
  nothing not already said on the pages it summarises (same rule as `llms.txt`).
- Every page's `<head>` also carries `<link rel="alternate" type="text/markdown" href="…marcus-maute.md">`,
  and `assets/js/site.js` is loaded via a relative `<script src>` on every page except `404.html`,
  which (like its other assets) uses the root-relative `/assets/js/site.js`.
- `marcus-maute.md` is also listed in `sitemap.xml` and pointed to from `llms.txt`; `_headers` serves
  `/*.md` as `Content-Type: text/markdown; charset=utf-8` for Cloudflare Pages.

## Home page hero
`.hero-actions` carries a single button, "The Agentic Finance Report" (`.btn-red`). The ghost
"Work with me →" button that used to sit beside it was removed 21 September 2026; "Work with me"
stays reachable from `#work`, the nav toggle's replacement `.nav-cta`, the mobile menu and the
footer.

## Home page section order
`index.html` runs: hero → report (`#report`) → The Surf (`#the-surf`) → Neo (`#neo`) → positions
(`#positions`) → manifesto (`.manifesto`, "What I believe") → work with me (`#work`) → writing →
follow → footer (The Surf inserted between the report and Neo 21 September 2026; before that Neo
sat directly after the report; before that it sat between the manifesto and work with me, and
before that the report used to sit after the manifesto, with the manifesto right after the hero —
this is in fact a reversion to that earlier report/positions/manifesto/work ordering, just with Neo,
then The Surf, inserted right after the report).
The manifesto keeps its dark background and its `border-bottom: 3px solid var(--red)`; it carries
no `border-top`, so entering it from the grey `#positions` section is a plain colour change (by
design, matches how `.sec.dark` sections read elsewhere). `#neo` is `.sec.dark`, so it carries its
own `border-top: 3px solid var(--red)` regardless of context: the grey `#the-surf` band straight
into dark `#neo` is the same into-`.sec.dark` seam already used on `about/index.html` and
`agentic-finance/index.html` (the dark section's own red top border, no extra styling needed); white
`#report` into grey `#the-surf` uses `.sec.grey`'s own `border-top: 1px solid var(--border)`, the
same subtle seam `#positions` uses leaving the dark manifesto; Neo into the grey `#positions`
section uses `#positions`'s own `border-top: 1px solid var(--border)`, the same subtle seam Neo used
leaving into `#work` before it moved. Don't add a second border at any of these seams.

## The Surf section (`#the-surf`, home page)
A compact grey `.sec.grey` band, home page only, between the report and Neo, added 21 September
2026. **Marked "coming soon" — there is still no launch date, host line, guests or platform links.**
Styled with the site's own `/* ── the surf ── */` block in `assets/pages.css` (`.surf-grid`: a fixed
~260px cover column beside the flexible text column on desktop, stacking to one column under
900px; `.surf-head` for the eyebrow/title/pill row; `.surf-pill` red rounded "Coming soon" badge;
`#the-surf.sec` reduced vertical padding to keep the band compact).
- **Source material, first pass:** the owner initially attached `~/Downloads/7PO4ohCZ.zip.part`,
  which **did not exist anywhere on disk** (checked Downloads, Desktop, and a broader
  home-directory search) — not corrupted, simply absent. The section first shipped with only the
  safe defaults: name, "Podcast" eyebrow, "Coming soon" pill, no cover, no description.
- **Source material, current:** `~/Downloads/files(5).zip` (the `.zip.part` was an unfinished
  download of the same thing), extracted to `/private/tmp/the-surf/`. Contains
  `the-surf-cover-EN.png` / `-DE.png` (3000×3000 px, ready to upload), `the-surf-cover-EN.svg` /
  `-DE.svg` (vector masters, text outlined) and `the-surf-cover-spec.md` (a design-reproduction
  brief, mostly production notes for recreating the cover art itself — colours, type, the wave-line
  formula — not podcast facts). The only podcast facts pulled from it: directory title "The Surf —
  Talking AI, Blockchain & Agentic Finance", two separate feeds (English and German), recorded in
  Zürich (spec names "HeadsQuarter podcast studio", not used on the page). **No host is named in the
  spec**, so no host line was added. The spec's "Apple and Spotify" mention is a cover-art export-size
  recommendation (3000×3000 px), not a stated platform commitment, so platforms are still not shown.
- **Cover in use:** the EN PNG converted with `.venv-wp`'s PIL
  (`/Users/marcusmaute/Downloads/agentic_report/.venv-wp/bin/python`) to `assets/img/the-surf-cover.webp`
  (max 1200px, q85) and a `.jpg` fallback, shown via `<picture>` at ~260px (desktop) / ~220px
  (mobile), width/height set, `loading="lazy"`. **The DE cover (`the-surf-cover-DE.png/.svg`) is not
  used anywhere yet** — it's available in the zip for whenever a German-language page or feed exists;
  don't add it speculatively.
- Copy: eyebrow "Podcast", title "The Surf.", pill "Coming soon", body line "Talking AI, blockchain
  & agentic finance. Recorded in Zürich · English and German." (tagline and location/language facts
  from the spec, tidied to sentence case; no launch date, no platforms, no host).
- Not in the nav or `sitemap.xml` (no dedicated page exists yet).
- `marcus-maute.md` and `llms.txt` each carry a matching "The Surf (podcast)" entry with the same
  facts; re-run `python3 tools/build_agent_view.py` after any change to `marcus-maute.md` to
  re-embed it in every page's Agent view (confirmed idempotent on a clean second run).

## Neo section (`#neo`, home page)
A dark `.sec.dark` band introducing Neo, an autonomous on-chain art-collecting agent that Marcus
built and operates as an independent personal project, styled with the site's own `/* ── neo ── */`
block in `assets/pages.css` (`.neo-grid`, `.neo-facts`, `.neo-shot`). Also linked
from every page's footer (`https://github.com/DerMarcus/nftneo`, `rel="noopener" target="_blank"`,
between About and LinkedIn) and from `about/index.html`'s facts table and `llms.txt`.
- **Eyebrow:** "Autonomous agent · Personal project" (renamed from "What I'm building", 21
  September 2026, owner instruction). Don't revert.
- **Draft screenshot:** a framed screenshot of the nftneo.dev site draft sits in the right column
  of `.neo-grid`, above `.neo-facts` (`.neo-shot` wrapper: a fake browser bar with three dots and
  "nftneo.dev · draft", 1px border, soft shadow; `.neo-shot-caption` below reads "Draft of
  nftneo.dev. The site is not live yet."). Added 21 September 2026 from a headless-Chrome capture
  (1440×900) of the actual generated build at
  `~/Downloads/neo/nftneo/site/dist/index.html` (that repo's own `site/build.py` output, dated
  2026-09-16 — the current real draft, not the earlier static design mockups in
  `~/Downloads/neo/resources/website-design/` or the `nftneo-ops` `design/` folder, which are
  older references). Saved as `assets/img/nftneo-site-draft.webp` (quality 85) with a `.jpg`
  fallback, served via `<picture>`. A full-width placement above the two-column body was tried and
  rejected: it pushed the section past ~1.9 screens at desktop, well over the ~1.5-screen budget,
  so the image went in the right column instead. **The caption's "not live yet" wording must stay
  until the owner confirms nftneo.dev is live** — update it together with the `nftneo.dev` planned-
  address note below when that happens.
- **Facts source:** the project's public README and ARCHITECTURE at
  `github.com/DerMarcus/nftneo` only. `nftneo.dev` is the planned site address; it did not resolve
  as of 21 September 2026 (connection refused), so it appears in copy as text, never as a link,
  until it is verified live.
- **Neo is always pre-launch** ("Phase 0, pre-launch": nothing acquired, no valuations or ledger
  entries published yet) until the owner says otherwise. When Neo makes its first acquisition,
  this section, the footer/about/llms.txt mentions and this note all need updating together, not
  just the home page. The pre-launch status lives in the prose paragraph, not a fact row.
- **Neo is never described as part of the Agentic Finance Report.** It applies the report's
  mandate-enforcement principle as an independent project.
- **Fact-list rows and the disclosure line removed (owner instruction, 21 September 2026).** The
  "Inference · TensorX-hosted open-weight model", "Status · Phase 0, pre-launch" and "Built and
  operated by · Marcus Maute, as a personal project" rows, and the standalone disclosure line
  ("Independent personal project. Not part of the Agentic Finance Report; not investment advice.")
  and its `.neo-disclosure` wrapper/CSS rule, were dropped from `#neo` as unnecessary on the owner's
  own site. `marcus-maute.md` was updated to match (same three facts and disclosure sentence
  removed from the Neo section; the pre-launch fact stays in its prose paragraph) and re-embedded
  into every page via `tools/build_agent_view.py`. Don't reintroduce them without the owner asking.

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
Same nav (The Report · Writing · About · the Human/Agent toggle in place of the old "Work with me →"
`nav-cta`), same mobile nav (the toggle at the top, then adds Press, then Work with me →; Neo is
deliberately **not** in either nav). Same footer links on all nine pages (The Report, Work with me,
Writing, Press, About, Neo https://github.com/DerMarcus/nftneo, LinkedIn
https://www.linkedin.com/in/marcusmaute/, Contact mailto:marcus@marcusmaute.com), footer
"© 2026 Marcus Maute · Zürich, Switzerland", `<html lang="en-GB">`, a `<link rel="canonical">`,
a `<link rel="alternate" type="text/markdown">`, a `<title>` and meta description. See "Human/Agent
toggle and the Agent view" above for the toggle, the human-view/agent-view wrapper and `site.js`.

## Content rules
- British spelling in any copy written for the site.
- No em-dashes inside sentences (dashes in title separators like "X — Marcus Maute" are fine).
- No "X is not Y, it is Z" negation-first constructions.
- No invented facts: no testimonials, no media/press logos, no numbers not already established
  on the site, unless the owner confirms them as real.
- Do not rewrite the blog articles' body text, only their chrome (nav, footer, CTAs).
- All internal links and asset paths are relative (never root-relative), so pages open correctly
  from disk, from a local server and on Cloudflare; link directory pages as `.../index.html`.
  **`404.html` is the one deliberate exception:** Cloudflare Pages serves it at whatever URL was
  requested (e.g. `/blog/old/thing`), so a relative path would break at depth. Its nav, footer and
  page links all use root-relative paths (`/assets/style.css`, `/index.html`, etc.) instead.

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
