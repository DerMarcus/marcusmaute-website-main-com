# CLAUDE.md — marcusmaute.com

Plain HTML/CSS site, no build step. Hosted on Cloudflare Pages from GitHub
(`DerMarcus/marcusmaute-website-main-com` → Cloudflare Pages; a push to `main` deploys).
**Never push from an agent session** — commit locally only, the owner pushes.

## What this is
Marcus Maute's personal site, repositioned around the **Agentic Finance Report** (2026).
Four pages plus a blog: home, work with me, press, about. **Work with me and press are currently
hidden site-wide (owner, 22 September 2026)** — see "work-with-me and press: hidden site-wide"
below.

**The report no longer has a page on this site.** `agentic-finance/index.html` was deleted on the
owner's instruction (21 September 2026): the report now lives only at agenticfinancereport.com, and
every link that used to point at the internal page (hero button, `#report` section, nav, mobile nav,
footer, and the about/press/work-with-me/blog mentions) now points to
**https://www.agenticfinancereport.com/** with `rel="noopener" target="_blank"`. The home page's
`#report` section and the Ventures card both describe the report but neither hosts it.

## Page map
```
index.html                          Home (hero + #report section link out to agenticfinancereport.com)
work-with-me/index.html             Speaking (advisory block hidden in an HTML comment, see below;
                                     the whole page is also hidden site-wide, see below)
press/index.html                    Bios, headshot, report facts, quotes cleared for use (the whole
                                     page is hidden site-wide, see below)
about/index.html                    Bio, background
blog/index.html                     Writing index ("The Blog")
blog/brian-armstrong-bezos-letter-ai-age.html  Article (see "Blog" below)
blog/energy-currency.html           Article (see "Blog" below)
404.html                            Not-found page (Cloudflare Pages 404; root-relative paths, see below)
marcus-maute.md                     Site-wide factual Markdown (the Agent view's content), repo root
assets/style.css                    Design system (Barlow Condensed + Lora, navy #0d2252, red #c8192c);
                                     also carries the mode-toggle and Agent-view CSS (shared by every page)
assets/pages.css                    Shared components for the five main pages (.page-hero, .num-list, .card, etc.)
assets/article.css                  Shared chrome for blog articles
assets/img/blog/                    Tribune scan images for the energy-currency article (see "Blog" below)
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
`.hero-actions` carries a single button, "The Agentic Finance Report" (`.btn-red`), linking
externally to `https://www.agenticfinancereport.com/` (`rel="noopener" target="_blank"`) since the
internal report page was deleted 21 September 2026. The ghost "Work with me →" button that used to
sit beside it was removed the same day; "Work with me" used to stay reachable from the nav toggle's
replacement `.nav-cta`, the mobile menu and the footer — **all three of those links were removed
22 September 2026 when the work-with-me page was hidden site-wide**, see "work-with-me and press:
hidden site-wide" below (never `#work`, see below).

**`.hero-lead` rewritten (owner instruction, 22 September 2026):** the paragraph used to read "I work
on how regulated institutions let AI agents act on capital: **the mandate first, then the stack
around it.** Lead author of the *Agentic Finance Report*, co-published in 2026 with a FINMA-regulated
bank, two blockchain foundations, an enterprise AI company and a sovereign-AI provider." It now reads
"In retrospect it was obvious I was never going to be happy until I also became part of a movement
for computers to flip the world order on its head." — plain text, no `<strong>`/`<em>`. The `<meta
name="description">` on `index.html` was deliberately left as it was (owner instruction); it
paraphrases the old hero-lead paragraph but is not a verbatim copy of it, and doesn't quote the
headline (below), so it is unaffected by the headline change.

**`<h1>` rewritten (owner instruction, 22 September 2026):** the headline used to read "When software
**acts** on capital, *someone has to write the mandate.*" (white first line, "acts" in the red
`.accent` span; grey italic second line via `.italic`). It now reads "Money is **energy**." / "*Now
energy can also think.*" — same two-line markup pattern, `.accent` moved onto "energy" (still the
last word of line one), `.italic` unchanged on line two. `og:description` had echoed the old headline
almost verbatim ("When the software that decides is also the software that acts, someone has to
write the mandate.") and was updated to match: "Lead author of the Agentic Finance Report (2026).
Money is energy. Now energy can also think." This supersedes the "left as they were" note above,
which was about the earlier hero-lead rewrite, not this headline change — `og:description` is now
tied to the headline, not the hero-lead paragraph. `<title>`, `<meta name="description">`, the
twitter tags and the JSON-LD don't quote the headline and were left untouched.

**`.italic` span now carries a hard `<br>` too (owner instruction, 22 September 2026):** the h1
renders as three lines instead of two — "Money is **energy**." / "*Now energy can*" / "*also
think.*" — via `<span class="italic">Now energy can<br>also think.</span>`. Confirmed at 1440px
and 768px (tablet) that this breaks exactly after "can", giving three lines; at 375px the first
line also wraps naturally ("Money is" / "energy."), so the hero reads as four lines there, which
still looks intentional (two lines of white/accent, two lines of grey italic). `og:description`
above is plain text and unaffected by the added `<br>`. Elsewhere on the site,
"write the mandate" (the report's first recommendation, "write the mandate and set the tiers", inside
the embedded `marcus-maute.md` Agent view on every page) and "act on capital" (the report thesis,
also inside that embedded text) are separate, report-thesis wording that happens to share words with
the old headline — they are unrelated to it and were not touched.

## Home page section order
**`#work` ("Work with me / The mandate, then the stack.") is hidden (owner, 21 September 2026,
"for now"),** wrapped in an HTML comment right after `#neo` and before `#writing`, the same pattern
as the advisory block on `work-with-me/index.html` (see below) — `<!-- HIDDEN 2026-09-21 (owner):
Work with me section on home page, restore when ready ... -->`. The section's own preceding
`<!-- WORK WITH ME -->` marker comment was dropped rather than nested inside the wrapper (its
close sequence would have ended the wrapper early); nothing else in the block needed changing to
wrap it safely. No page linked to `index.html#work` or `#work` before this change (every "Work with
me" link already pointed straight at `work-with-me/index.html`), so nothing needed repointing.
`llms.txt`'s Home entry, which read "...ventures, how to work with him", was reworded to
"...ventures, Neo" (`marcus-maute.md` did not mention `#work` and needed no change, so
`tools/build_agent_view.py` was not re-run). To restore, uncomment the block in place; no other
copy changes are needed since (unlike the work-with-me page's own advisory-block hide) nothing else
on the site pointed at `#work` to begin with.

With `#work` hidden, `index.html` renders: hero → report (`#report`) → The Surf (`#the-surf`) →
ventures (`#ventures`) → Neo (`#neo`) → writing → follow → footer. The positions section
(`#positions`, "Four positions.") was **deleted entirely on the owner's instruction, 21 September
2026** — it no longer exists anywhere in the file, and its `.pov-*` CSS was removed with it (nothing
else used those rules). Ventures moved from right after the hero to directly after Neo, then, later
the same day, Neo was moved to directly after Ventures instead (a straight block swap, no copy
changed), so the seam sequence is: hero straight into white `#report` again (as it was before
Ventures first existed); white `#report` into dark `#the-surf` needs no extra styling since
`#the-surf` is `.sec.dark` and carries its own `border-top: 3px solid var(--red)` regardless of
context (matched to Neo's treatment 21 September 2026, see "The Surf section" below); dark
`#the-surf` into white `#ventures` needs nothing extra either, `.sec.white`'s own border doing the
job; white `#ventures` into dark `#neo` needs no extra styling since `#neo` carries its own
`border-top: 3px solid var(--red)` regardless of context; dark `#neo` into grey `#writing` needs
nothing extra either (verified in-browser 21 September 2026), `#neo`'s own red top border doing the
job as it always did, and grey is a different background from dark so no clash was introduced by
hiding `#work`. No two adjacent sections share a background class in the current order.
**The manifesto (`.manifesto`, "What I believe") moved off the
home page entirely on 21 September 2026** — it now sits on `about/index.html`, in the slot the
"How I work" section used to occupy (see "About page" below). (Earlier history: Neo sat directly
after Ventures right after this move; before that, Ventures sat directly after Neo, right after The
Surf was inserted between the report and Neo the same day; before that Neo sat directly after the
report; before that it sat between the manifesto and work with me, and before that the report used
to sit after the manifesto, with the manifesto right after the hero; the manifesto itself sat on the
home page, between ventures and work with me, until it moved to the About page.)

## Ventures section (`#ventures`, home page)
A white `.sec white` band, home page only, directly after The Surf (`#the-surf`) and before Neo
(`#neo`). Added 21 September 2026 right after the hero, then moved the same day to directly after
Neo (in the slot the deleted positions section used to occupy), and later the same day Neo was moved
to directly after Ventures instead, leaving Ventures in its current slot right after The Surf,
modelled on the "One thesis. Four ventures."
pattern from raoulpal.com but built in the site's own design language (not Pal's styling or headline
wording): a heading ("One thesis. Four
houses.") with a short standfirst on the right, then a 2×2 `.venture-grid` of `.venture-card`s
(logo top-left ~36px tall, a small pill label, the venture name, one or two sentences, an arrow link
at the foot — a normal link, not a whole-card anchor, to keep the markup accessible). New CSS is
under `/* ── ventures ── */` in `assets/pages.css` (`.ventures-head`, `.venture-grid`,
`.venture-card`, `.venture-logo` incl. an `.is-wordmark` variant for the two ventures with no logo
file, `.venture-pill`, `.venture-link`); responsive to one column under 900px in the shared
`@media (max-width:900px)` block. Standfirst: "Built so one thesis, agentic finance, can show up
from more than one side: as research, as infrastructure, as capital, and as practice." — each
venture is assigned one of those four words (research / infrastructure / capital / practice); this
is editorial framing, not a claim that all four ventures are substantively about agentic finance
(Neuer Lab in particular is not). **Heading changed to "One thesis. Four houses." (owner
instruction, 21 September 2026; was "One thesis. Four ventures.")** — markup, section id
(`#ventures`), eyebrow ("Ventures") and CSS classes (`.venture-grid`, `.venture-card`, etc.) are
unchanged, only the second line of the heading's wording.

The four cards, in order, and the source for each card's copy:
1. **Agentic Finance Report** — "Research · 2026" pill. Facts from this repo's own `CLAUDE.md`
   (release date, chapters, co-authors) and the report repo (`../agentic_report/`). No logo file
   exists; the card uses a typographic wordmark ("Agentic Finance **Report.**", the accent on
   "Report." matching the cover treatment), not the cover thumbnail. **Links externally to
   https://www.agenticfinancereport.com/** (`rel="noopener" target="_blank"`, like the TensorX,
   Solstice Staking and Neuer Lab cards) — changed on the owner's instruction, 21 September 2026, so
   the card's link text reads "Visit agenticfinancereport.com →" rather than "Read the report →".
   The internal `agentic-finance/index.html` page this used to point to was itself deleted the same
   day, so every other link to the report on this site (hero, `#report` section, nav, footer, about,
   press, work-with-me, blog) now points to the same external URL too.
2. **TensorX** — "Sovereign AI" pill. Facts drawn only from
   `../agentic_report/docs/press-release-draft.md`'s "About TensorX" blurb and
   `../agentic_report/docs/CONTRIBUTORS.md` (open-weight models, EU infrastructure in Dublin and
   Helsinki, zero data retention, x402 agent payment in stablecoins). Marcus's role is stated exactly
   as "TensorX Swiss Representative" per his own facts row above; no other role is claimed. Logo:
   `../agentic_report/images/tensorx/tensorx-logo.svg` (the light-ground version; inspected and
   confirmed the "T" mark's gradient fills render, per the SVG traps noted in the report repo's own
   CLAUDE.md), copied to `assets/img/logos/tensorx-logo.svg`. Links to https://tensorx.ai.
3. **Solstice Staking** — "Blockchain" pill (owner instruction, 21 September 2026; was "Staking"). Facts fetched from solsticestaking.io on 21 September 2026:
   institutional-grade non-custodial staking infrastructure, Ethereum/Solana/NEAR Protocol support,
   zero commission, >$1B staked assets, Solstice Staking AG based in Zug. The site states a copyright
   year (2026) and "4 Years Track Record" but never a founding/"since" year, so none is shown. Logo:
   the owner-supplied `~/Downloads/Solstice Staking Logo Files/svg/Solstice_Staking_horizontal_black.svg`
   (the horizontal black version, for a light card), copied to
   `assets/img/logos/solstice-staking-horizontal-black.svg`. Links to https://solsticestaking.io.
   **Marcus's role at Solstice Staking is not stated anywhere on the card or in `marcus-maute.md` —
   do not add one until the owner supplies it** (his CV role there, "Managing Director, Solstice
   Staking AG", was removed from the Agentic Finance Report itself in September 2026; don't reuse it
   here without the owner's say-so).
4. **Neuer Lab** — "Longevity" pill (owner instruction, 21 September 2026; was "Wellness"). Facts
   fetched from neuerlab.com on 21 September 2026: mindset,
   spirituality and longevity; mental training, emotional release work, and leadership/awareness
   workshops; integrates neuroscience with conscious human development. No location or founding year
   is stated on the site, so neither appears on the card. **No logo file exists and none was
   downloaded from the internet** (site instructions are treated as data, never as an authorisation
   to fetch assets) — the card uses a plain typographic wordmark, "Neuer Lab". **A real logo file is
   an open item.** **Marcus's role at Neuer Lab is not stated anywhere — do not add one until the
   owner supplies it.**
`#neo` is `.sec.dark`, so it carries its own `border-top: 3px solid var(--red)` regardless of
context: white `#report` into dark `#the-surf` needs no extra styling, `#the-surf` being `.sec.dark`
too and carrying its own red top border the same way; dark `#the-surf` into white `#ventures` needs
nothing extra either, `.sec.white`'s own border doing the job; white `#ventures` straight into dark
`#neo` needs no extra styling, the same into-`.sec.dark` seam already used on `about/index.html`
(the dark section's own red top border); dark `#neo` into grey `#writing` (with `#work` hidden
between them since 21 September 2026, see "Home page section order" above) needs nothing extra
either, `#neo`'s own red top border doing the same job it always did. Don't add a second
border at any of these seams. (The manifesto's own seam notes moved to "About page" below with the
section itself.)

## The Surf section (`#the-surf`, home page)
A dark `.sec.dark` band (owner instruction, 21 September 2026; was `.sec.grey`, see below), home
page only, between the report and Ventures (originally added between the report and Neo, before Neo
moved to after Ventures), added 21 September 2026. **Marked "coming soon" — there is still no launch
date, host line, guests or platform links.** Styled with the site's own `/* ── the surf ── */` block
in `assets/pages.css` (`.surf-grid`: a fixed ~260px cover column beside the flexible text column on
desktop, stacking to one column under 900px; `.surf-head` for the eyebrow/title/pill row; `.surf-pill`
red rounded "Coming soon" badge, unchanged on the dark ground; `#the-surf.sec` reduced vertical
padding to keep the band compact). **Switched from grey to dark, matching Neo's treatment exactly**
(same `.sec.dark`, so the same `border-top: 3px solid var(--red)` applies automatically): the eyebrow
took Neo's `light` variant (`section-eyebrow light`, same as `#neo`'s), the title needed no class
change (`.sec.dark .section-title{color:#fff}` already covers it), and the body line got a page-scoped
override, `#the-surf .section-sub{color:rgba(255,255,255,0.5)}`, mirroring `#neo .section-sub`'s. The
cover's shadow/border was re-tuned for the dark ground: the old navy-tinted shadow and hairline
(`rgba(13,26,48,…)`, meant for a grey backdrop) were swapped for `.neo-shot`'s formula, a dark drop
shadow plus a light hairline ring (`box-shadow: 0 16px 40px rgba(0,0,0,0.35), 0 0 0 1px
rgba(255,255,255,0.14)`), so the cover edge still reads against the dark band.
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

## About page: manifesto moved here, restyled, then merged into one section (21–22 September 2026)
`about/index.html` now runs: page hero → one `.sec white` section, eyebrow **"What I believe"**
(photo left, text + facts table right) → footer. There is only one content section on this page —
what used to be a separate "What I believe" and a separate "Who I am" section were merged into one
(owner instruction, 22 September 2026, same day as the two steps below) because the owner didn't want
two sections at all.

**History, in order (22 September 2026 except where noted):**
1. The manifesto (eyebrow, four-paragraph text, signature block) moved here from the home page on
   21 September 2026, replacing the "How I work" / "The mandate first." dark section it used to
   occupy (that section, and its "Work with me" / "Press page" CTA buttons, is gone; nothing else
   linked to it, so no anchors needed fixing). It first landed directly after "Who I am", styled as a
   dark `.manifesto` block, then moved to directly after the page hero as the page's first section.
2. **Restyled from a dark manifesto to the page's normal light style:** the owner didn't want it
   reading as a separate dark block — he wanted white background, the plain (non-`.light`)
   `.section-eyebrow` (red text + red rule) and `.prose` (Lora body text, `var(--muted)` slate,
   1.8 line height, `<strong>` in `var(--text)` dark-navy 600-weight), i.e. identical styling to
   "Who I am". The `.manifesto-sig` name/title block was dropped as no longer meaningful outside the
   manifesto styling. **All `.manifesto*` CSS was removed from `assets/pages.css`** (the rule block
   under `/* ── manifesto ── */` and its mobile padding override in the shared
   `@media (max-width: 900px)` block) after grepping to confirm nothing else referenced it.
3. **Merged into "Who I am" entirely** (same day, follow-up instruction): the owner didn't want two
   back-to-back sections even without a visible seam between them. The four "What I believe"
   paragraphs now sit inside the "Who I am" section's `.sec-inner.person` grid (photo left, text
   column right), at the top of the `.prose` block, followed by the pre-existing report paragraph
   ("In 2026 I was lead author…") and then the facts table, all under one eyebrow. **The "Who I am"
   eyebrow/section was removed — the surviving eyebrow reads "What I believe".** The separate
   `.sec-inner.narrow` section (step 2's version) no longer exists. All four paragraphs stayed
   verbatim throughout every step, including the closing "That is what I believe." line.

**"Who I am" text changes (22 September 2026, predate the merge, still true):** the `.prose` block
opens with the What I believe paragraphs, then the report paragraph ("In 2026 I was lead author…").
The paragraph that used to precede the report paragraph ("I represent TensorX in Switzerland and work
at the intersection of sovereign AI, digital-asset infrastructure and regulated finance…") was removed
as redundant now that What I believe covers similar ground immediately above it. The Zürich paragraph
("I am based in Zürich, which has become the densest concentration…") was also removed from the prose
and folded into the facts table's **Based in** row instead: the cell now reads "Zürich, Switzerland.
The densest concentration of applied AI research in Europe, with Google's largest engineering centre
outside the United States, research or engineering operations for OpenAI, Anthropic, Microsoft,
NVIDIA, Meta and Apple, and ETH Zürich and the University of Zürich supplying much of the talent
behind them." (verbatim past "Zürich, Switzerland.", `.facts-table td`'s existing normal-weight/
1.6-line-height styling handles the longer text without any inline style needed). `marcus-maute.md`'s
own "Who I am" text was left as it was (it is a separate, site-wide document, not a per-page mirror of
`about/index.html`) — don't assume the two stay in sync.

**Facts table trimmed (owner instruction, 22 September 2026, `about/index.html` only):** the **Role**
row ("TensorX Swiss Representative") and the **Contact** row (`mailto:marcus@marcusmaute.com`) were
both removed entirely from this page's facts table. Neither change touched anything else: the JSON-LD
`jobTitle` on this page still says "TensorX Swiss Representative", and the email is unchanged
everywhere else it appears (elsewhere on this page's own markup there is none left, but see the press
page, `llms.txt`, `marcus-maute.md`, and every page's `mailto:` CTAs). The **Signature work** row was
renamed to **Latest signature work** (value unchanged: "Lead author, Agentic Finance Report (2026)");
checked it fits the `.facts-table th` column without awkward wrapping at both breakpoints — it sits on
one line at the 180px desktop column width and wraps cleanly word-by-word ("Latest / Signature /
Work") at the 120px mobile column width, the same way longer labels like "Based in" already wrap.
`marcus-maute.md`'s own "Role"/"Signature work" bullets were left as they were (table-only change).

## work-with-me and press: hidden site-wide (22 September 2026, owner)
Both pages stay on disk (`work-with-me/index.html`, `press/index.html`, unchanged content) but are
hidden from discovery, "for now": every link to either page was removed from every other page
(mobile nav's Press / "Work with me →" entries, the shared footer's Work with me / Press links,
and the `press/`/`work-with-me/` mentions inside 404.html's "Find your way" list), both got
`<meta name="robots" content="noindex">` in `<head>`, both `<url>` entries were dropped from
`sitemap.xml`, and both were removed from `llms.txt`'s Pages list and from `marcus-maute.md`'s
"Every page on this site" list (re-embedded into every page's Agent view via
`tools/build_agent_view.py`). The pages' own `<link rel="canonical">`/`og:url` (their real URLs)
were left as they were — the pages themselves are untouched, only inbound links and discoverability.
Each page's own mobile nav and footer (which link to the *other* pages) were pruned the same way, so
neither page links to the other or to itself any more either. The one remaining reference is a dead
one: the commented-out `#work` section on `index.html` (see "Home page section order" below) still
contains a "Formats and topics" link to `work-with-me/index.html` inside its HTML comment — it was
left as is since it renders nothing and the whole block is itself already hidden.

**To restore either page:** re-add its mobile-nav entry (`<a href="…/press/index.html">Press</a>` /
`<a href="…/work-with-me/index.html">Work with me →</a>`, right after About, in that order) and its
footer entry (`Work with me` right after The Report, `Press` right after Writing, matching the
original position) on all nine pages, remove the `noindex` meta from the page's own `<head>`, add its
`<url>` back to `sitemap.xml`, and add its line back to `llms.txt`'s Pages list and
`marcus-maute.md`'s "Every page on this site" list (then re-run `tools/build_agent_view.py`). Restore
the 404.html "Find your way" `<li>`s too. This is independent of the separate advisory-block hide
inside `work-with-me/index.html` itself (below) and of `#work`'s hide on the home page (see "Home
page section order" above) — restoring one does not restore the others.

## work-with-me: advisory block hidden
The "Advisory — Two ways in." section (`The Mandate Workshop` and `Readiness assessment` cards) in
`work-with-me/index.html` is wrapped in an HTML comment (`<!-- HIDDEN 2026-09-21 (owner): advisory
block, restore when ready ... -->`) rather than deleted, so it can be restored later. Because of
that, the page hero now introduces talks and briefings directly (no more "That is where I work
with institutions, and it is what I talk about on stage."), the home page's `#work` section (itself
now also hidden, see "Home page section order" above) listed only "Keynotes and board briefings"
under `.speaking-topics` while it was visible, and the report page's "Put it to work" box points at
"Talks and briefings" (`../work-with-me/index.html`) instead of "The Mandate Workshop". If the owner
asks to restore the advisory block, uncomment it and reverse those three copy changes (separately
from whether `#work` itself is restored on the home page).

## Consistency (every page)
Same nav (**Home** · The Report · Writing · About · the Human/Agent toggle in place of the old "Work
with me →" `nav-cta`), same mobile nav (the toggle at the top, then Home, The Report, Writing, About;
Neo is deliberately **not** in either nav). **Home was added as the first nav item on all nine pages
22 September 2026** (owner instruction): `index.html` (home page → `index.html`/`./`), `about/`,
`blog/` (index + all three articles), `work-with-me/` and `press/` (one level deep →
`../index.html`), and `404.html` (root-relative → `/index.html`, matching that page's other nav
links). It carries the same `active` class as the other current-page nav links, but **only on the
home page's desktop `.nav-links`** — matching the existing site-wide convention that `.active` is
never applied in `#nav-mobile` (About and Writing aren't marked active there either). **Mobile nav no longer adds Press then Work with me → below
About** — both entries were removed 22 September 2026 when those two pages were hidden site-wide
(see "work-with-me and press: hidden site-wide" above); restore them there, in that order, if the
pages are unhidden. Same footer links on all nine pages (The Report, Writing, About, Neo
https://github.com/DerMarcus/nftneo, LinkedIn https://www.linkedin.com/in/marcusmaute/), footer
"© 2026 Marcus Maute · Zürich, Switzerland", `<html lang="en-GB">`, a `<link rel="canonical">`,
a `<link rel="alternate" type="text/markdown">`, a `<title>` and meta description. **The footer's
Work with me and Press links were removed 22 September 2026** (same page-hide, see above) **and its
Contact `mailto:` link was removed separately the same day (owner instruction)** — the email itself
stays everywhere else it already appeared (the About facts table, the press page, `mailto:` CTAs on
work-with-me, etc.), only the footer link is gone; restore with
`<a href="mailto:marcus@marcusmaute.com">Contact</a>` as the footer-links block's last entry if the
owner asks. See "Human/Agent toggle and the Agent view" above for the toggle, the human-view/agent-view
wrapper and `site.js`.

## Blog
The blog carries three articles, newest first on `blog/index.html` (featured card) and on the home
page's writing section (now a three-card `.posts-grid`, `repeat(3, minmax(0,1fr))` on desktop,
single column under 900px).

**`blog/brian-armstrong-bezos-letter-ai-age.html`, "Did Brian Armstrong Just Write the Bezos
Letter for the AI Age?"**, dated **5 May 2026**. **This is the owner's own text, reproduced
verbatim** (added 2026, source: `docs/`-adjacent scratch note, not tracked in this repo) — it is
**exempt from the site's content rules**: it keeps his em-dashes, American spellings
("organizational", "optimized") and "X is not Y" / negation-first constructions. Do not edit its
body copy for style. Category/eyebrow: "AI & organisations". Its three `>` blockquotes from
Armstrong's memo are styled with the shared `.pull-quote` (from `assets/article.css`); the closing
bold paragraph reuses the `.closing-line` component (page-scoped `<style>`, same rule as
`energy-currency.html`'s); the final "→ Full letter:" line links out to Armstrong's X post
(`target="_blank" rel="noopener"`). No CTA block. Read time (4 min) computed at ~200 wpm from the
751-word body (773 minus the removed USX paragraph, see below), the same rate
`energy-currency.html`'s "11 min" implies for its ~2,210 words; still rounds to 4 min after the cut,
so the displayed read time is unchanged.

**Owner removed one paragraph, 2026-09-22:** "Stablecoins like USX, Solstice's Solana-native
synthetic dollar, are purpose-built for exactly this: optimized speed, cryptographic security, and
on-chain transparency for agentic transactions." was cut from the body (it sat between the
"payment rails" paragraph and the "two tsunamis" paragraph). Nothing else in the article changed.
**USX must not be reintroduced** — the sentence was the only USX/Solstice-product mention on this
site (Solstice Staking's own venture card, which names the company but not USX, is unaffected and
stays).

**`blog/satoshi-is-working-on-kaspa.html`, "Satoshi is working on Kaspa now."**, dated
**8 November 2024**. Category/eyebrow: "Bitcoin & proof of work". The copy is the owner's, supplied
verbatim as a source Markdown file and converted to HTML syntax only, no wording changes: it argues
Bitcoin's caution (no major upgrade since Taproot activated in November 2021, the covenants dilemma
still undecided) is exactly its strength as digital gold, and reads Kaspa, a proof-of-work currency
with no corporate sponsor and no ICO, as the place the work of a fast, high-throughput cryptographic
machine is now happening, via its blockDAG and the GHOSTDAG protocol (Sompolinsky, Wyborski and
Zohar) that orders parallel blocks instead of orphaning them. Cross-links inline to `energy-currency.html`
("Energy currency"). Structural choices that are ours, not his: a lead photograph, the owner's own
2024 photo of the steel Satoshi statue in Parco Ciani, Lugano
(`assets/img/blog/lugano-satoshi.webp`, with an og-image JPEG at
`assets/img/blog/lugano-satoshi-og.jpg`), and an inline SVG blockDAG diagram (14 numbered blocks,
several merge and fork points, three tip blocks highlighted, now in the Kaspa palette, see "Per-article
colour themes" below) placed at the
`[DIAGRAM: ...]` marker in the source file. Two inline footnote markers were added (a judgement
call, since the source has no inline citations) attaching the two Sources entries, Kaspa.org and
the GHOSTDAG paper, to the sentences that state those facts. Read time: 2 min, from a 487-word body
(excluding the Sources list and image/diagram captions) at ~200 wpm, the same rate the other two
articles use. **The lead photo is floated (owner instruction, 22 September 2026):** it used to run
full-width above the body; it now sits inside the body, floated right of the opening two paragraphs
at 260px wide with its caption underneath (`.lead-figure` in the page's own `<style>`), so the text
wraps around it instead of pushing everything below it down the page. `.article-body h2` carries
`clear: both` on this page so "Bitcoin chose to stand still" clears the float instead of running
alongside it. Below 600px it stops floating and sits centred above the text at 60% width (capped at
260px).

**`blog/energy-currency.html`, "Energy currency."**, dated
**13 June 2024** (the owner's original publication date; the site itself was rebuilt around the
Agentic Finance Report in September 2026, but this article predates that and keeps its own date).
The three earlier articles (`ai-transformation-stack.html`, `dt-vs-ai-transformation.html`,
`head-of-ai-mistake.html`) were deleted 21 September 2026 and 301-redirect to it from the repo-root
`_redirects` file (Cloudflare Pages format).

The article argues money has always had to be hard to earn, limited in supply and easy to verify,
traces Henry Ford's December 1921 proposal to back a currency with energy instead of gold, and reads
bitcoin's proof of work as the version of that idea that got built. It reproduces the full text of
the 4 December 1921 New York Tribune article ("Ford Would Replace Gold With Energy Currency and Stop
Wars") **verbatim, as a public-domain historical document** (`.tribune-doc` block), alongside four
scans of the original pages (`assets/img/blog/tribune-p1.webp`, `tribune-p6a.webp`, `tribune-p6b.webp`,
`tribune-p6c.webp`; click-through to full size). **The editor's note on Ford's antisemitism must stay
immediately above the document block** — it explains that Ford's "international bankers" language
came from the same period as his newspaper's antisemitic conspiracy theorising, and that the
transcription is reproduced for its idea about money, not as an endorsement. Don't remove or move
that note away from the transcription, and don't edit the transcription itself (it keeps its own
1921 spelling, em-dashes and "to-day", exempt from the site's no-em-dash rule, which applies to copy
written for the site, not to a verbatim historical source).

## Per-article colour themes
Added 22 September 2026, reworked the same day (owner instruction: the header band must be **the
article's colour itself, not a dark tint of it** — "not dark, in the colour scheme of the article").
Modelled on the home page hero: a colour field (the `.article-header` band) sitting inside
`.site-frame`'s big white/rounded border, so each article reads as "the hero, in its own colour"
rather than always dark. Each article now looks visually distinct while the layout (site nav/footer,
`.article-header`/`.article-body-wrap` structure) is unchanged — **never** invent a new layout for a
theme, only new colours.

**How it works:**
- `assets/article.css` defines a default set of CSS custom properties on `body` (the original dark
  look, so an article with no theme class renders exactly as before), then one class per theme that
  overrides them. Because a theme's band can be a bright/saturated colour rather than a dark tint,
  several tokens exist in pairs so each one only ever has to contrast the surface it actually sits
  on, never double as both a background and a foreground colour:
  - `--article-bg` — the `.article-header` band background. Can be the raw brand colour (Kaspa teal,
    Coinbase blue) — it doesn't need to pass any contrast ratio itself, only `--article-ink`/
    `--article-soft` against it do.
  - `--article-ink` — primary text on `--article-bg` (the H1, `.article-meta-item strong`,
    breadcrumb hover). White on a dark band, dark on a light band — **check which your band needs**,
    don't assume white.
  - `--article-soft` — secondary text on `--article-bg` (the lead paragraph, breadcrumb links, meta
    items). Kept at ≥4.5:1 against `--article-bg` (WCAG AA, normal text) by picking `--article-ink`
    at enough opacity — solve for the opacity, don't guess it (see the contrast note below).
  - `--article-divider` / `--article-meta-line` — low-emphasis decorative marks on the band (the
    breadcrumb's `/` separator, the meta row's top border). No AA requirement (decorative, not text
    or a UI control), just visible against `--article-bg`.
  - `--article-rule` — the 3px rule under the header band. **Its own token, not reused from
    `--article-accent`**: on a bright-band theme `--article-accent` can equal `--article-bg` (Kaspa's
    accent literally is the band colour), which would make the rule invisible. Pick something that
    visibly contrasts `--article-bg` — often the same dark tone as `--article-ink`.
  - `--article-tag-bg` / `--article-tag-text` — the `.article-tag` pill. Same reasoning as the rule:
    the pill sits **on the band**, so its fill must contrast `--article-bg`, not just carry legible
    text on itself. A light band gets a dark pill (light or white text on it); a dark/saturated band
    gets a light or white pill (coloured text on it).
  - `--article-page-bg` — a light tint applied to `main#human-view`, i.e. the whole area behind
    `.article-body-wrap`, inside the frame. Unaffected by the header-band rework; still a light tint
    regardless of how bright the header band is.
  - `--article-accent` — the strong/bright brand colour, used only on the white/tinted **body**
    area: the `pull-quote`/`closing-line` left border. Decorative only, doesn't need to pass contrast
    on its own.
  - `--article-accent-text` — a darker, AA-safe variant of the same brand colour, used on the body:
    `.article-body a` links, `.article-tag` fill *when it happens to also work as the tag's background
    against the band* (true for Kaspa/energy, not Armstrong — see the table), pull-quote/closing-line
    text.
- Each article opts in with a class on `<body>` (`<body class="theme-kaspa">`, set alongside
  `<body class="site-frame">`'s sibling markup, i.e. directly on the `<body>` tag). `blog/index.html`'s
  "All articles" list rows and the home page's article cards carry the **same class names** on the
  linking `<a>` for their own (unrelated, still-dark-tint) list accents — see "Article-card accents in
  lists" below, this is a separate, smaller design and intentionally didn't change in the header-band
  rework.
- Three bright brand tokens (`--kaspa-accent`, `--energy-accent`, `--armstrong-accent`) are hoisted up
  into `assets/style.css`'s `:root` rather than only living in `article.css`, because `index.html` and
  `blog/index.html` need them for list accents but don't load `article.css`. `article.css`'s theme
  classes reference these same tokens rather than redefining the hex, so the brand colour only lives
  in one place.

**Current themes:**
| Theme class | Article | `--article-bg` (the band itself) | `--article-ink` | `--article-rule` | `--article-tag-bg` / `-text` | `--article-page-bg` |
|---|---|---|---|---|---|---|
| `.theme-kaspa` | Satoshi is working on Kaspa now. | `#70c7ba` (Kaspa brand teal, full strength) | `#0f2e2a` (dark teal ink) | `#176055` | `#0f2e2a` / `#70c7ba` | `#f5faf9` |
| `.theme-energy` | Energy currency. | `#eadfc8` (aged paper, not solid amber — see below) | `#1b130a` (near-black ink) | `#7a4e0a` (dark amber) | `#1b130a` / `#e8a317` | `#f3ebdd` |
| `.theme-armstrong` | Did Brian Armstrong... | `#0052ff` (Coinbase blue, full strength) | `#ffffff` | `#ffffff` | `#ffffff` / `#0052ff` | `#eaf1ff` |

`--article-accent`/`--article-accent-text` (the body-area tokens, unchanged by the header rework):
Kaspa `#70c7ba`/`#176055`, energy `#e8a317`/`#7a4e0a`, Armstrong `#0052ff`/`#0052ff`.

**Energy: paper, not a solid amber band.** Both were built and screenshotted before deciding
(22 September 2026): a full `#e8a317` band read as a loud, modern warning-orange banner, not a 1920s
newsprint masthead. Aged paper (`#eadfc8`) with a dark-amber rule and a dark-ink/amber tag pill reads
closer to the Tribune reproduction later in the article, so that's what shipped. If this is ever
revisited, the amber-band values are: `--article-ink:#1b130a`, `--article-soft:rgba(27,19,10,0.75)`
(4.80:1), `--article-rule:#1b130a` (8.46:1 on the band), `--article-tag-bg:#1b130a` /
`--article-tag-text:#e8a317`.

Every text pairing above was solved for ≥4.5:1 (WCAG AA, normal text), not just checked after the
fact — `--article-soft`'s opacity in particular is a solved value, not a round number: Kaspa's ink at
78% (not the more-obvious 72%) is what actually clears 4.5:1 on `#70c7ba`; Armstrong's white at 85%
(not 78%) is what clears it on `#0052ff`. Decorative-only marks (`--article-divider`,
`--article-meta-line`, `--article-rule`) were checked for visibility (they comfortably clear the
3:1 non-text/UI-component threshold) but don't need full text-level AA.

**To add a theme for a new article:**
1. Pick the article's brand colour as the band itself (`--article-bg`), not a darkened version of
   it — the owner's explicit preference is the real colour, full strength.
2. Work out whether `--article-ink` needs to be white or dark for that band, then **solve for
   `--article-soft`'s opacity** against a ≥4.5:1 target (don't reuse another theme's opacity number —
   Kaspa's 78% and Armstrong's 85% are specific to those two colours). A quick way: flatten
   `ink-at-alpha` over the band and check contrast against the band at a few alpha values until one
   clears 4.5.
3. Pick `--article-rule` and `--article-tag-bg`/`--article-tag-text` so they contrast **the band**,
   not each other — on a light band this is usually the same dark ink; on a dark/saturated band it's
   usually white or the band's own light tint.
4. Pick `--article-divider`/`--article-meta-line` as low-alpha versions of the ink colour (light
   band) or white (dark band); no AA requirement, just keep them visible.
5. Add the bright brand token to `assets/style.css`'s `:root` (`--<name>-accent`) and set
   `--article-accent`/`--article-accent-text` in the theme block as before (these two are unaffected
   by the header-band rework and still describe the body-area colour, not the band).
6. Add `class="theme-<name>"` to the article's `<body>` tag.
7. Add the same `theme-<name>` class to that article's row in `blog/index.html`'s "All articles" list
   and the home page's `.post-card` in `index.html`'s Writing section for their (separate, dark-tint)
   list accents — see "Article-card accents in lists" below.
8. If the article has its own diagram/figure colours hardcoded (like Kaspa's inline blockDAG SVG),
   recolour those by hand in that page's markup — they're raw SVG presentation attributes, not CSS
   variables, so `var()` doesn't reliably apply to them; pick literal hex values consistent with the
   theme instead.
9. Rasterise/screenshot the article at desktop and 375px with a cache-busted load (see "Local
   preview") and re-check every text element on the band (breadcrumb, tag, H1, standfirst, meta) at
   actual rendered contrast, not just the numbers on paper. `.pull-quote`, `.closing-line`,
   `.fn a`/`.source-line a` (each article's own page-scoped `<style>` block) and
   `.tribune-doc-label`/`.tribune-page-label` (energy-currency only) read `--article-accent`/
   `--article-accent-text` and need no further edits, but verify visually anyway.

**What stays untouched:** the site nav and footer are the same on every page regardless of article
theme. Theming only ever changes colour (chrome), never wording, so it doesn't conflict with
`blog/brian-armstrong-bezos-letter-ai-age.html`'s "don't rewrite the blog articles' body text" rule
below.

**Article-card accents in lists.** Separate from the header-band rework above: `index.html`'s Writing
cards (`.post-card`) carry a thin top-border accent, and `blog/index.html`'s "All articles" rows
(`.post-row`) carry a thin left-border accent, each in the article's `--<name>-accent` brand colour,
so the uniqueness shows in the lists too. This uses the bright brand token directly
(`var(--kaspa-accent)` etc.) rather than the header-band tokens, and was intentionally left as-is in
the header-band rework — it's a small, subtle mark, not a colour field, so it doesn't have the same
"is it dark enough for white text" problem the header band did. **`blog/index.html`'s featured card
(`.featured-card`) does not carry this accent** (owner, 22 September 2026: the coloured top border
there clashed) — it kept its plain `1px solid var(--border)` outline from before theming existed, and
its `theme-<name>` class was removed from the markup since nothing on that element reads it any more.
Don't reintroduce a coloured border on `.featured-card`; the "All articles" rows below it are where
the per-article colour shows in that list.

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
- X: **https://x.com/marcusmaute** — added 21 September 2026 next to LinkedIn on the home page's
  Follow section, the About facts table and the JSON-LD `sameAs` on index/about/press. Not (yet) in
  the shared footer link row or `work-with-me/index.html`'s `sameAs`.
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
