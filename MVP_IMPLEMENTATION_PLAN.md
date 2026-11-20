# NGX Insight MVP Implementation Plan

## Day 10 locked MVP scope (2026-11-20)

This section records the agreed release scope and supersedes conflicting assumptions in the earlier planning notes below.

### In scope

- The approved 16 NGX banking and mortgage banking issuers.
- Discover search and company navigation.
- Company Analysis using stored, sourced observations, with missing coverage and insufficient evidence handled honestly.
- Quick Check and peer comparison only where eligible evidence supports them.
- TradingView manual captures as dated source observations, not live prices.
- Browser-local Watchlist and Portfolio, including recording, buying more, selling, and removing holdings. These are personal records; the app does not execute trades.
- Home content based on the user's actual Watchlist and Portfolio state.
- Profile information and saved-lens access without authentication or account synchronization.

### Intentional limitations

- Watchlist and Portfolio data stay in the current browser. There are no user accounts or cross-device synchronization.
- Prices are manually captured and may not represent a current market quote.
- Financial observations have incomplete issuer and year coverage. The latest Neon audit shared for Day 10 reported 623 available observations and 45 missing; verify counts again during final data-integrity checks.
- Some provider mappings and metric definitions remain unresolved. Unsupported mappings must remain marked unresolved and must not be used as verified data.
- Non-banking sector links remain visible and lead to unavailable/coming-soon destinations.
- Discover's existing mock ideas and recent-updates content remain intentionally in the interface.
- The MVP has no real alert system, dividend-event feature, corporate-disclosure feed, or company-logo feature.
- Historical daily prices, real-time prices, additional issuer coverage, authentication, and performance improvements are outside this MVP.

### Day 10 release condition

The MVP is release-ready when supported user journeys work, stored evidence and its limitations are presented accurately, data-integrity and configuration checks pass, and the production build succeeds. Deployment is a separate final action and proceeds only when the hosting target and production database configuration are ready.

## MVP decisions

- **Market scope:** Nigerian Exchange listed banks only.
- **Authentication:** out of scope for this MVP.
- **Personal research data:** stays in this browser using the existing local state for now. It will not sync across devices or browsers; reset browser storage may remove it.
- **Project use:** a private, personal learning project with no planned public launch. That context is recorded, while each provider's access and reuse terms still need to be checked for the intended integration.
- **Server-side responsibility:** fetch, normalize, and cache approved API data from NGN Market and Kobo Terminal. Provider credentials must stay on the server. The owner will collect supplementary TradingView research data and provide it to the project; Insight will import supplied data into its own small database. The scraping mechanism is outside the app implementation. Agree on the input format, provenance, timestamps, and permitted project use before building the importer. This is a data backend, not an account system.
- **NGN Market:** intended source for NGX-listed company identifiers, market/index context, official corporate disclosures and filing links; use forex only if a bank-analysis requirement needs it.
- **Kobo Terminal:** intended source for latest available prices and market snapshots, including GTCO. Historical prices and fundamentals are candidates only after confirming the selected API plan and endpoint coverage.
- **TradingView:** the owner will collect supplementary research data for metrics NGN Market and Kobo Terminal do not supply, then provide that data to the project. The app will not implement a TradingView scraper. Its importer should accept a documented supplied-data format and preserve source, symbol, observation time, and import time. Confirm the intended use and data handling before using imported values in Insight calculations. [Data FAQ](https://www.tradingview.com/widget-docs/faq/data/) Â· [Terms](https://www.tradingview.com/policies/)
- **Design:** preserve the current visual system, components, and approved HTML mockups. Extend existing patterns instead of rebuilding them.

### Scope clarification

The initial MVP cohort is the 16 issuers in `ngx-insight-day1-bank-universe-crosswalk.md`: 13 core banks/banking groups and 3 mortgage banks. This is an initial cohort, not a claim to exhaustively list every banking or financial institution on the NGX. Build the directory from the approved crosswalk and verified data, and never imply completeness beyond that cohort. Derive displayed counts and lists from the cohort dataset, not mockup copy. Compare Sectors, non-banking sectors (Telecom, Consumer, Energy, Industrial, Healthcare), and cross-industry comparisons remain visible where already designed, but use an explicit “Coming soon” state or hide their entry points so users cannot navigate into empty or misleading pages. Keep the relevant pages in place with the coming-soon state where the mockup expects a page.

### Data integrity safeguards

- **Quick Check:** preserve the existing two-item presentation where the design expects it, but never fabricate a strength or warning to fill a slot. Each item must be a discriminated result: evidence-backed `strength`, evidence-backed `watch`, or neutral `insufficient` with the missing evidence named. `insufficient` is not relabeled as strength/watch and is not a failed criterion. A section with insufficient evidence remains explorable.
- **Evidence and snapshots:** every claim links to the underlying metric(s), period, source, and relevant Section Detail. Decision Journal snapshots freeze the exact eligible Quick Check outcomes, evidence references, and engine version at the time of the action.
- **Time and provenance:** do not collapse these into one `asOf` value. Store price/disclosure `observedAt` or `publishedAt`; financial `periodStart`, `periodEnd`, period kind/duration, and publication date; server `retrievedAt`; manual-data `importedAt`; plus provider/source name, source record or URL, and units/currency. Preserve source timestamps and timezone before normalization.
- **Freshness:** define thresholds separately by data class and provider. Price freshness follows that providerâ€™s update cadence and the NGX trading calendar; closed-market last-close data is labeled as last close, not treated like an intraday quote. Financial freshness is based on the latest available comparable reporting period and publication date, not quote age. Disclosures use their publication time and retrieval time. Manual imports retain the observation/reporting date separately from import time. Never make a newly imported old observation appear current.
- **Period alignment:** peer and sector comparisons use the same metric definition, currency/unit, reporting frequency, period duration, and period end (or explicitly aligned comparable fiscal periods). Never compare annual to quarterly, interim YTD to a discrete quarter, or values from mismatched periods without a documented transformation. Do not silently convert cumulative interim statements; document and validate any subtraction-derived quarter.
- **Sector-stat eligibility (v1 proposal):** build the eligible universe from verified NGX-listed banking entities as of the statisticâ€™s effective date. Eligibility is metric-specific: require valid bank identity, a validated value, compatible units/definition, aligned reporting period, and any required price observation freshness. Exclude invalid denominators (for example, non-positive EPS for P/E), missing or incompatible values, and stale required observations; do not impute. For price-dependent metrics, exclude banks without an eligible price but retain them for financial metrics where valid. Compute a simple unweighted arithmetic mean of eligible bank-level values, excluding the company being analyzed. Show the statisticâ€™s period and eligible coverage. Suppress the sector comparison and return an insufficient-coverage state unless at least 80% of the canonical active-bank universe and at least five banks are eligible (or all banks if the universe contains fewer than five). Revisit this proposed threshold only if Day 1 source coverage demonstrates it makes the MVP unusable; any change must be documented.
- **Focused verification:** use TypeScript type checking and focused automated tests for financial formulas, engine rules, metric/period eligibility, peer comparisons, and frozen decision snapshots. The current package scripts expose ESLint and Next build; TypeScript is installed, but no test runner or test script is present. Select the smallest maintainable test setup before Day 3 and do not report tests as passed merely because code compiles.

### Day 1 source-coverage findings (2026-10-26)

- Repository inspection found one company-analysis mock record (`gtco`) in `lib/company/mock-data.ts`. Zenith and UBA values occur as illustrative peer strings, without source identifiers, observation dates, financial reporting periods, or validated underlying records. The mock sector directory hardcodes Banking as 14 companies; this is not verified coverage.
- Day 1 added a small sourced comparison fixture at `data/fixtures/day1-banking-fy2024-pbt.csv`: consolidated group profit before tax for GTCO and Zenith for FY2024, each with FY2023 comparative values from NGX-hosted issuer filings. Periods, scope, unit conversion, source URLs/locations, and retrieval time are recorded; publication timestamps remain explicitly unknown. Formula recomputation gives 107.8% GTCO PBT growth and 66.7% Zenith PBT growth. This verifies one matched metric pair for peer comparison, not a complete company analysis dataset.
- No provider adapter, database/persistence package, or test runner is present. Existing `lib/**` data access is mock-backed. The CSV fixture is historical and is not connected to runtime screens.
- NGN Marketâ€™s public API material documents an all-company listing and company charts, while its pricing describes financial ratios at lower paid tiers, three years of annual statements/growth at Pro, and quarterly/full financial statements at Business. This indicates possible source coverage, but actual API responses, bank coverage, and plan access have not been verified from this project. NGXâ€™s company profiles confirm Banking subsector metadata for examples such as GTCO, Zenith, and UBA; the complete current bank universe still needs retrieval and reconciliation. [API overview](https://ngnmarket.com/blog/ngn-market-api-is-live) Â· [API plans](https://ngnmarket.com/pricing/api) Â· [NGX company profiles](https://ngxgroup.com/exchange/data/company-profile/?directory=companydirectory&symbol=GTCO)
- Kobo Terminal documents 150+ listed equities, price history, and fundamentals for 145 symbols on Starter or above. Its fundamentals example includes `updated_at`, but the public field description does not establish a reporting period for every ratio; treat it as a point-in-time snapshot until an actual response clarifies otherwise. Its documented prices are at least 30 minutes delayed and refreshed every 20 minutes during market hours. [API reference](https://koboterminal.com/api)
- **Day 1 exit is partially met, not complete.** The fixture proves two-bank period alignment and PBT growth comparison from primary filings. It does not yet cover enough mapped metrics for individual analysis, establish the complete active-bank universe, or validate API plan coverage. The smallest deadline-preserving adjustment is to use the existing aligned FY2024 pair as the peer-comparison seed, then obtain the remaining representative metrics and a full bank-universe response through authorized API access or official filings before implementing data-driven sector statistics. Do not substitute mock values or fabricate missing evidence.

### Provider responsibility map (provisional)

| Source | Intended role | Integration status / checks still needed |
| --- | --- | --- |
| NGN Market | Company universe and identifiers; NGX indices/market context; official disclosures and filing links; optional FX if needed | No integration yet. Confirm the exact endpoints, plan, quotas, display/storage rights, and response timestamps. [API overview](https://ngnmarket.com/blog/ngn-market-api-is-live) Â· [API plans](https://ngnmarket.com/pricing/api) |
| Kobo Terminal | Latest available share prices and snapshots; candidate source for price history and fundamentals if the selected tier supports the needed endpoints | No integration yet. Confirm NGX bank symbol mapping, history/fundamental fields, delay, quotas, and commercial display rights for the intended MVP. [Developer API](https://koboterminal.com/api) |
| TradingView | Owner collects supplementary research data and supplies it for import into the project database | No scraper will be built into Insight. Define a file/schema import workflow, validate symbols and timestamps, retain provenance, and confirm intended handling before using imported values in calculations. [Data FAQ](https://www.tradingview.com/widget-docs/faq/data/) Â· [Terms](https://www.tradingview.com/policies/) |

**Important:** NGN Market and Kobo may overlap on prices, market snapshots, identifiers, or fundamentals. Reconcile representative GTCO/Zenith/UBA samples, then designate one source of record per field and document the other as fallback or validation. Do not silently average or combine conflicting vendor values. If additional financial metrics are unavailable from the two API sources, derive them from permitted underlying financial statements/disclosures where possible. For remaining gaps, the owner plans to supply a supplementary TradingView dataset for import. Keep those imported observations identifiable by source and timestamp, and settle the import format and intended handling before they enter app calculations.

## Current project state

- Next.js App Router, TypeScript, React, Tailwind CSS 4, and Tabler Icons are installed.
- Routes and reusable UI exist for Home, Discover, banking Sector View, Company Analysis, Quick Check, peer comparison, Watchlist, Portfolio, Profile, saved lenses, and How Insight Works.
- Home has `discovery`, `researching`, and `stewardship` states, but its view-model content still includes fixed mock data.
- `lib/**` contains useful types and mock-backed data access functions. No market API, database, or authentication service is connected.
- Company analysis data is complete only for GTCO. Banking is the only Sector View with detailed content; lens and sector coverage is also partial.
- The initial MVP cohort is the 16 issuers in `ngx-insight-day1-bank-universe-crosswalk.md`, not an exhaustive claim about every NGX banking or financial institution. The current mock-data coverage is not complete enough to represent even that cohort; GTCO, Zenith, and UBA in the mockups are examples, not a coverage definition.
- App engagement state uses `localStorage`. This is appropriate for a no-auth, single-browser MVP, with the limitations above.
- Discover search and issuer browsing now use the approved company directory. Watchlist add/remove uses shared browser-local app state; the Watchlist rows use saved issuer IDs and sourced market observations. The Pass sheet closes without saving a decision. The Decision Journal route and event model are not implemented.
- Several mockups include flows whose screens exist but whose records are not yet persisted, including Decision Journal events and evidence snapshots.
- The mockup folder has no `index.html`. Use the reference map below and this plan as the current implementation index.
- The README was the generic Next.js starter README; it is now project-specific and points here.

## Mockup source map

Where an earlier variant conflicts with a consolidated reference, the consolidated reference wins.

| Product area | Reference to follow |
| --- | --- |
| Home | `public/ngx-mockups/ngx-insight-home-v3.html` |
| Discover | `public/ngx-mockups/ngx-insight-discover-v6.html` |
| Sector comparison | `public/ngx-mockups/ngx-insight-compare-sectors.html` |
| Banking Sector View | `public/ngx-mockups/ngx-insight-sector-view-v4.html` |
| Company Analysis | `public/ngx-mockups/ngx-insight-company-analysis.html` (consolidated) |
| Company Analysis metric mapping | `public/ngx-mockups/ngx-insight-company-analysis-mapping-manual.html` (metric-to-section and evidence requirements) |
| Watchlist | `public/ngx-mockups/ngx-insight-watchlist-v4.html`, plus the removal flow in `ngx-insight-watchlist-v2.html` |
| Portfolio | `public/ngx-mockups/ngx-insight-portfolio-v1.html` plus `ngx-insight-portfolio-edge-cases.html` |
| Decision Journal | `public/ngx-mockups/ngx-insight-decision-journal.html` (consolidated; use v2 for refined entry details) |
| Profile | `public/ngx-mockups/ngx-insight-profile-v2.html` is the latest saved-lenses version; compare with v1 if a design conflict arises |
| Search and navigation | `ngx-insight-search.html` and `ngx-insight-bottom-nav.html` |

## Step-by-step implementation

### Step 0 â€” Preserve the current work and establish a baseline

1. Review the existing modified and untracked files before implementation. Keep a recoverable checkpoint in version control or another backup; do not reset or replace the current work.
2. The developer reports that lint and production build passed and the main routes were checked against the mockups. Treat that as the completed baseline; repeat those checks after implementation changes or when diagnosing an issue.

   ```bash
   npm run lint
   npm run build
   ```

3. Preserve the verified baseline and compare subsequent route changes against the approved references.

**Complete:** lint/build and main-route visual review have already been reported clean by the developer. Preserve the current worktree; establish a new baseline only if dependencies or environment change.

### Step 1 â€” Confirm provider access, coverage, and field ownership

For NGN Market and Kobo Terminal, record:

- Provider name, official documentation, credentials/configuration requirements, and cost/usage limits.
- NGX bank coverage, ticker/symbol conventions, supported history, update frequency, and known gaps.
- Which fields it supplies: company directory/listing status, prices/history, financial statements/ratios, dividends/corporate actions, or company events/news.
- Data rights for storing, deriving, and displaying data in this private learning project, as well as any relevant plan limits.
- Reliability expectations, timestamps/time zone, currency and units, and how provider revisions are handled.

Create a field-to-source map. For overlapping fields, decide which provider takes precedence and how disagreements are surfaced. Define how the owner-supplied supplementary dataset will be prepared and delivered, including the fields, symbols, timestamps, and provenance needed for import. Do not design a TradingView scraper or API adapter; use provider APIs, eligible disclosures, and the agreed supplied-data import for the MVP data contract. Never place API keys in client components or committed files.

**Complete when:** every MVP field has an expected source, fallback, and freshness rule, and the owner-supplied dataset has an agreed import format and provenance fields.

### Step 2 â€” Lock bank coverage and define normalized data contracts

1. Use the 16 issuers in the approved crosswalk as the initial NGX MVP cohort: 13 core banks/banking groups and 3 mortgage banks. Preserve its exclusions and pending-status decisions; do not describe the cohort as an exhaustive NGX bank universe. GTCO, Zenith Bank, and UBA remain sample records, not the coverage limit.
2. Define stable internal company IDs and map each provider's symbols to those IDs. Do not use display names or generated URL slugs as database/provider identifiers. Derive displayed company counts and â€œsee allâ€ lists from this canonical dataset, not mockup copy.
3. Add normalized contracts for:
   - Company identity, ticker, sector, listing/trading status.
   - Price observation: price, currency, timestamp, source, and whether delayed/frozen.
   - Historical price series and corporate actions needed for return calculations.
   - Financial statement values with fiscal period, publication date, units, currency, and source.
   - Dividends and company events with event date, publication date, source, summary, and related analysis section.
   - Peer mapping and sector membership, with the banking sector dataset as the source for all banking averages and comparison populations.
4. Keep provider response types separate from the presentation-focused types already in `lib/company/types.ts` and `lib/discover/types.ts`.

**Complete when:** approved fields from NGN Market and Kobo Terminal, plus any agreed owner-supplied dataset fields, map into one stable internal vocabulary without source-specific fields leaking into UI components.

### Step 3 â€” Implement a server-side market-data adapter

1. Add provider modules for NGN Market and Kobo Terminal, plus a small service layer that composes their allowed fields. Add a separate importer for the documented owner-supplied dataset; do not build a TradingView scraper into the app. Keep existing page and component APIs stable where possible.
2. Fetch and normalize data on the server. Store secrets in local environment configuration and production secret settings; `.env*` files are already ignored by Git.
3. Add sensible caching/rate-limit behavior based on each provider's terms and update frequency. The mockups show latest/as-of data and YTD context; they do not require streaming quotes.
4. Return explicit `asOf`, source, status, and missing-data information with the normalized values.
5. Keep mock fixtures for development and fallback/error-state work, but make it obvious in the UI or environment when mock data is being shown. Do not silently present a mock value as live market data.

**Complete when:** server code can retrieve and normalize the banking slice from the approved API sources, and provider failure produces a controlled stale/unavailable state rather than a broken page.

### Step 4 â€” Build the versioned intelligence engine

The intelligence engine sits between normalized data and screen wiring. It turns sourced and derived metrics into plain-English insights; it does not recommend whether to buy or sell.

1. Add discriminated-union result types for the four section evaluation states: `signal`, `no-signal`, `partial`, and `insufficient`. Make invalid combinations unrepresentable. Missing data must not count against the company or block the user from continuing.
2. Define a typed rule contract containing `id`, `industry`, `section`, `tone`, `priority`, `requires` (metric keys), a condition function, an insight function, and evidence references. Keep rules in pluggable `universal` and `banking` modules, selected through a registry; leave a clear extension point for `consumer-goods` and future industries without activating those sectors in this MVP.
3. Set the engine and Quick Check framework version from day one. Emit the version with every evaluation and freeze the exact Quick Check result/evidence snapshot and version into each Decision Journal entry (for example, `v1`). Later rule changes create a new version rather than silently changing old journal records.
4. Build evidence mappings before authoring rules. Use `ngx-insight-company-analysis-mapping-manual.html` to map each criterion to its required metric keys, metric pair, period, source, and Section Detail location. Example: revenue growth versus the banking-sector average requires a company revenue-growth value and a comparable sector revenue-growth value for the same period. A rule must not fire without its required evidence.
5. Keep each Company Analysis section to at most two insights, or three when multiple priority-8-or-higher rules fire. Choose the highest-priority supported insights deterministically and preserve the single most important watch-out. Quick Check may retain its two designed positions, but each position must be backed by an eligible strength/watch rule or display an explicit neutral insufficient-evidence outcome. Never invent either item to fill the layout; do not label insufficient evidence as a strength or a warning.
6. Use neutral, sector-relative wording. The engine never recommends. Red is reserved for the single most important watch-out, not every unmet criterion. Do not show an â€œX of 12â€ tally. Do not treat missing evidence as a failed criterion.
7. Write formula definitions for daily/YTD return, P/E, dividend yield, peer comparisons, sector averages, and portfolio value/return. Define handling of dividends, splits, suspended securities, missing periods, and delisted securities. Derived facts retain formula version, input period, and evidence provenance.
8. Validate each rule and calculation against source records across the full supported bank universe; manually verify edge cases and ensure the same evidence appears on the insight and Section Detail screens.

**Complete when:** every emitted insight is backed by mapped evidence, evaluation states are typed, prioritization and tone constraints hold, and Quick Check/Journal snapshots carry a stable engine version.

### Step 5 â€” Wire data into existing screens without redesigning them

Replace mock-backed reads incrementally, preserving current component boundaries and design tokens:

1. Company Analysis and comparison for banks across the full verified NGX banking universe; cross-industry Compare With paths show â€œComing soonâ€ or are hidden.
2. Search results for listed banks from the canonical dataset, with honest no-result and unsupported-data states.
3. Banking Sector View, banking peer comparisons, and averages computed from the project dataset. Generate counts and bank lists dynamically from data rather than mockup labels.
4. Discoverâ€™s bank directory, bank-focused lenses, and relevant company updates. Mark non-banking sector chips as â€œComing soonâ€ or hide them; do not route them into empty sector content.
5. Keep Compare Sectors available as a â€œComing soonâ€ page/state, consistent with the mockup, until non-banking datasets and rules are in scope.
6. Homeâ€™s three states, using current browser engagement state, real bank/company/event data, and engine insights rather than fixed `MOCK_*` content.
7. Watchlist and Portfolio values with clear as-of, suspended, missing-data, and delisted states.

Do not expose an analysis link for an unsupported company unless its destination explains its support level clearly.

**Complete when:** the supported journey from Discover/Search to bank analysis, sector-relative insights, banking comparison, watchlist, and portfolio uses consistent records and source timestamps; all out-of-scope paths have clear coming-soon states or are hidden.

### Step 6 â€” Complete no-auth user actions and the Decision Journal

1. Keep user-specific state local to this browser for this MVP. Do not add sign-in, account tables, or cross-device sync in this phase.
2. Version the `localStorage` schema and handle malformed/older stored data safely.
3. Route watchlist add/remove and undo through shared app state so list changes persist across route changes and reloads.
4. Persist section review progress and saved lenses consistently.
5. Add local journal entries for buy, sell, pass, and â€œdecided not to investâ€ actions. Store dates, shares/prices where relevant, reasons/notes, and evidence snapshots with a framework version.
6. Make transaction forms validate positive quantities/prices and prevent selling more shares than held. State clearly that these are personal records, not broker transactions.
7. Update Profile copy for the no-auth MVP so it does not imply a verified account or server-synced investment history.

**Complete when:** implemented personal research actions survive navigation and reload in the same browser. Cross-device sync and Decision Journal review remain out of scope until authentication and the Journal are implemented.

### Step 7 â€” Validate the MVP and prepare deployment

1. Run lint and production build in the intended environment.
2. Manually walk through: new user, researching user, existing investor; bank search/no results; all company sections; peer comparison; watchlist add/remove/undo; buy/sell/pass; journal snapshots; empty portfolio; suspended and delisted positions; provider outage/stale data.
3. Check responsive layout and compare each implemented screen to its mapped HTML reference. Keep design deviations explicit rather than accidentally changing the visual language.
4. Configure production API secrets, caching, error monitoring, provider usage alerts, and a way to refresh market data without exposing credentials.
5. Document the no-auth limitation: browser-local records do not transfer to another device and may be lost if browser storage is cleared.

**MVP acceptance:** a user can explore supported NGX banks, understand sourced and dated evidence, compare banks, record and revisit their own decisions locally, and see honest treatment of stale or unavailable data. No authentication, trade execution, or non-bank coverage is required.

## Intentionally outside this MVP

- Authentication, user accounts, and cloud synchronization of personal records.
- Company logos in issuer listings, Company Analysis, and other company cards. Add them in a future feature using a reliable, permitted source and suitable fallbacks for missing logos.
- Personalized Discover prompts and recommendations, including asking whether a user prefers dividend-paying businesses. Keep this out of the current UI until the personalization feature is in scope.
- Expand Company Analysis with source-backed business profiles covering services, customer groups, and how each issuer earns money. Review metric coverage and definitions across sections, including sparse or absent growth, income, asset-quality, and capital observations; align future section descriptions and comparisons with the evidence actually available.
- Improve application speed, especially database fetching and loading shared resources, after measuring the main bottlenecks and choosing fixes based on those measurements.
- Trade execution, brokerage integrations, and investment recommendations.
- Non-bank company analysis and complete coverage of every NGX listing.
- Real-time streaming prices unless a confirmed product requirement or provider contract makes them necessary.
