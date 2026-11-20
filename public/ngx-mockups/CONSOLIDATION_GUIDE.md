# NGX Insight — Consolidation Guide

This folder contains mockups built iteratively across many design review rounds.
Several pages are split across multiple files because each file was built to
demonstrate ONE specific fix or feature, not to be a complete final reference.
This document tells you which files belong together, and what each one
uniquely contributes, so nothing gets lost or duplicated during consolidation.

Give this file to Claude Code along with the mockups. Without it, there's no
way to tell from filenames alone that (for example) five different Company
Analysis files are fragments of one page rather than five separate pages.

---

## Company Analysis — 6 files are ONE page, not six

**IMPORTANT — read this first.** There is a 7th file, `ngx-insight-company-analysis.html`
(no suffix), not originally listed in this guide. It is the actual **master
consolidated reference** — it already assembles the Hub (all 3 concrete
relationship states), the Section Detail template, the Quick Check
full-breakdown screen, the Compare With peer-breakdown screen, and the
Buy/Sell/Pass sheets, all in one file, in the shape this guide's own "What
the ONE consolidated file should contain" section describes. **Build from
this file directly** rather than piecing the 6 fragments below back
together — it already did that work and is the most current source. The 6
fragments below remain useful for their frame-notes (the *why* behind each
decision), but the master file's actual markup/copy wins on any conflict.

The 6 fragments, for reference / rationale only:

None of these files alone is the final page. Each contributed something the
others don't have.

0. **ngx-insight-company-analysis-v3.html** — frame 1 ONLY
   Contributes: the concrete "No relationship — just exploring" Hub state
   (arrived from Discover/Sector View, no Watchlist/Portfolio entry yet).
   Compare With is hidden entirely in this state — too many exit doors
   before the user has even started. Action row is Add to Watchlist plus a
   text-link fallback ("Already own this? Add to Portfolio") — no Add to
   Portfolio button.
   Frames 2–4 in this same file (Watching/in-progress, Watching/thesis-ready,
   Held) are SUPERSEDED — they use an earlier locked-thesis + progress-dot
   pattern that got reworked later. Do not pull content from them; the
   correct versions of those states are what full-overview.html and
   quickcheck.html already capture.

1. **ngx-insight-company-analysis-quickcheck.html**
   Contributes: the Hub screen's overall structure (decision card → Quick
   Check card → action row → section list → Compare With). Quick Check's
   final condensed format (2 items: one strength, one thing to watch — not
   a full 12-item list, no numeric tally). The "How It Compares" section
   merged into Compare With (peer cards now carry head-to-head stats).

2. **ngx-insight-company-analysis-v9.html**
   Contributes: the segmented "Plan a purchase" / "Log what I bought" tabs.
   The sell flow (quick picks: 25% / 50% / 75% / All, realized gain/loss).
   The pass-reasoning sheet (quick-tap reasons + optional note + skip link).

3. **ngx-insight-company-analysis-compare-breakdown.html**
   Contributes: the dedicated peer-comparison breakdown screen — reached by
   tapping a Compare With card — a side-by-side metrics table with no
   declared "winner."

4. **ngx-insight-company-analysis-full-overview.html**
   Contributes: the complete Hub assembled top-to-bottom in BOTH relationship
   states that matter most — Watching (not yet invested) and Held (already
   own it) — including the Add More / Sell action pairing specific to Held.

5. **ngx-insight-company-analysis-mapping-manual.html**
   Contributes: fixes to which evidence backs each Quick Check criterion
   (Revenue Growth pair added to Financial Health; Dividend Consistency
   added to Valuation; the governance-flags criterion treated as an inline
   check, not a navigable link, since it's a screening check, not a
   comparative metric).

### What the ONE consolidated Company Analysis file should contain:
- Hub screen, covering all 4 relationship states (No relationship / Watching,
  partial / Watching, complete / Held). No relationship uses v3.html frame 1
  as its concrete reference (Compare With hidden, Add to Watchlist only).
  Watching/partial reuses that same layout with some sections checked off
  instead of none.
- Section Detail screen (one reusable template — same structure across
  The Business, Financial Health, Valuation, and Risks, just different
  content)
- Quick Check full-breakdown screen
- Compare With peer breakdown screen
- Buy sheet (Plan / Log tabs)
- Sell sheet (Plan / Log tabs)
- Pass-reasoning sheet

Note: the "no results found" search state referenced inside
mapping-manual.html is really search's job, not Company Analysis's — it
belongs with ngx-insight-search.html, not folded into this page.

---

## Decision Journal — 2 files are ONE page

1. **ngx-insight-decision-journal-v1.html**
   Contributes: the master mixed timeline — buy, sell, pass, and Watchlist
   "decided not to invest" entries together, reverse-chronological, grouped
   by month. This is the closest thing to "what the page normally looks
   like day to day."

2. **ngx-insight-decision-journal-v2.html**
   Contributes: the refined entry formats that should replace the simpler
   ones in v1 — buy entries show a frozen evidence snapshot (not a
   transaction record), sell entries capture a reason via their own sheet,
   sparse states (1-2 entries) are treated as complete rather than empty,
   entries carry a framework-version tag (e.g. "Quick Check v1"), backdated
   purchases show both the purchase date and the logged/"Added" date side
   by side rather than fabricating historical data, and adding to an
   existing position gets its own entry type ("Added to GTCO," not
   "Bought GTCO").

### What the ONE consolidated Decision Journal file should contain:
v1's timeline structure and layout, but with every entry using v2's
refined formats — i.e., the shape of v1, the substance of v2.

---

## Everything else in this folder is already a single, complete page

Home, Discover, Sector View, Compare Sectors, Search, Bottom Nav, Watchlist
(v4 + v2's removal flow), Portfolio (v1 + edge-cases), and Profile do not
need consolidation — each is already one coherent reference.

---

## Implementation status and MVP scope

This section is a concise status snapshot. Follow the root
`MVP_IMPLEMENTATION_PLAN.md` for the full scope, phases, decisions, and
acceptance criteria. The MVP target is NGX-listed banks only, with no
authentication. It is a private, personal learning project with no planned
public launch, and keeps personal research records in the current browser.

The source now contains routes and UI beyond the earlier status below. Current
coverage is still prototype-level and data is mock-backed. The current MVP
scope is banks only, with no authentication. NGN Market is intended for
company identifiers, index/market context, and official disclosures; Kobo
Terminal is intended for latest prices and market snapshots. The owner also
intends to use TradingView as a supplementary research source for metrics the
API providers do not supply, and will provide that collected data to the
project. Insight will import the supplied dataset into its own small database;
the scraping mechanism is outside the app. Agree on its format, provenance,
timestamps, and intended handling before implementation. See the root
`MVP_IMPLEMENTATION_PLAN.md` for provider checks and the implementation
sequence.

- Home contains `discovery`, `researching`, and `stewardship` modes, but the
  view-model content is still partly fixed mock data.
- Discover, banking Sector View, sector comparison, company analysis, section
  detail, Quick Check breakdown, peer comparison, Watchlist, Portfolio,
  Profile, saved lenses, and How Insight Works have routes or components.
- GTCO is the only company with a full Company Analysis record. Banking is
  the only detailed Sector View. Sector, company, and lens data coverage is
  partial.
- Search is not functional yet. Watchlist removal is component-local rather
  than persisted through shared app state. The Pass sheet does not save its
  reason or note. The Decision Journal has a consolidated design reference
  but no implemented route or event storage.
- App engagement state uses browser `localStorage`; no provider API, database,
  authentication, or server persistence is connected. Provider names and
  intended roles are now recorded, but access, coverage, plan limits, field
  ownership, and permitted display/storage terms still need confirmation.

The intended mockup map is recorded in `MVP_IMPLEMENTATION_PLAN.md`. There is
currently no `index.html` in this folder; add or update an index only if a
separate mockup navigation page is created.
