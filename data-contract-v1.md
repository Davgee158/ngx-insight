# NGX Insight Data Contract v1

**Status:** Approved working contract for the Day 3 pilot

## 1. Scope and purpose

This contract covers NGX-listed banks, beginning with GTCO and Zenith Bank, and targets FY2021-FY2025 where published and accessible. Capture FY2020 or another immediately preceding comparison period when needed to represent a published FY2021 growth observation correctly. Record missing periods rather than inventing values. Mortgage banks are included in data-availability testing and reported separately from core banks/banking groups; do not combine the cohorts in peer statistics until comparability and metric eligibility are explicitly established. It defines published metric observations and their provenance before database or UI integration. It describes source data, not screen presentation.

Do not invent values or replace missing data with zero or estimates. Apart from the two explicitly approved conditional income-share displays defined below, do not calculate substitute metrics or ratios.

## 2. Phase 1 metric vocabulary and MVP priorities

Store finite numeric values without display symbols. Preserve each source's exact label, definition, period, and basis.

| Key | Display name | Canonical unit | Period and basis | MVP role |
|---|---|---|---|---|
| `net_income` | Net income attributable to owners | `NGN` | Annual consolidated-group fiscal period; canonical definition is profit attributable to equity holders of the parent. Preserve exact source label, scope, period, units, and locator. | MVP core — Financial Health |
| `roe` | Return on equity | `percent` | Published value and stated period/basis. | MVP core — Financial Health |
| `roa` | Return on assets | `percent` | Published value and stated period/basis. | Later addition |
| `net_interest_income` | Net interest income | `NGN` | Annual fiscal period; preserve statement scope and source line. | MVP core — The Business |
| `non_interest_income` | Non-interest income | `NGN` | Annual fiscal period; preserve source line; do not substitute total operating income. | MVP core — The Business |
| `revenue_growth` | Revenue growth | `percent` | Published FY-over-FY value, comparison period, and provider's exact revenue definition. Do not normalize unlike definitions or calculate a substitute. | Later addition |
| `net_income_growth` | Net income growth | `percent` | Published value, current/comparison periods, and net-income definition; do not calculate a substitute. | Later addition; do not use to replace the observed net-income trend |
| `pe_ratio` | Price-to-earnings | `multiple` | Point-in-time observation date and published EPS basis (for example, TTM or FY). | MVP core — Valuation |
| `pb_ratio` | Price-to-book | `multiple` | Point-in-time observation date and published book-value basis. | MVP core — Valuation |
| `share_price` | Share price | `NGN_per_share` | Dated market quote; retain source label, currency, quote date/time, and instrument reference. Supporting market input, not an additional Phase 1 analysis metric. | Valuation context |
| `eps` | Earnings per share | `NGN_per_share` | Fiscal year or stated TTM basis; preserve basic/diluted designation. | Supporting information — EPS and P/E basis |
| `dividend_yield` | Dividend yield | `percent` | Point-in-time observation date and stated yield basis (for example, trailing or forward); do not calculate a substitute. | Later addition |
| `npl_ratio` | Non-performing loan ratio | `percent` | Reporting date and stated NPL definition/gross-net basis. | MVP core — Risks |
| `loan_loss_coverage_ratio` | Loan-loss coverage ratio | `percent` | Reporting date and published basis/definition when stated. | Later addition |
| `cost_to_income_ratio` | Cost-to-income ratio | `percent` | Published period and stated cost/income definitions when available. | MVP core — Financial Health |
| `loans_to_deposits_ratio` | Loans-to-deposits ratio | `percent` | Reporting date and stated gross/net loans and deposit basis when available. The brief's `loan_to_deposit_ratio` wording refers to this existing stable key. | Later addition — Risks |
| `capital_adequacy_ratio` | Capital adequacy ratio | `percent` | Reporting date and reported CAR type/basis; do not compare unlike CAR definitions. | MVP core — Risks |
| `total_assets` | Total assets | `NGN` | Annual balance-sheet observation; preserve the source definition, reporting date, statement scope, and original/canonical units. | MVP core — The Business; new source-reported key |
| `customer_deposits` | Customer deposits | `NGN` | Annual balance-sheet observation; distinguish customer deposits from deposits from banks and retain source label, reporting date, scope, and units. | MVP core — The Business; new source-reported key |
| `gross_loans` | Gross loans | `NGN` | Annual balance-sheet observation before impairment allowances; preserve source definition, reporting date, scope, and units. Do not use net loans as a substitute. | MVP core — The Business; new source-reported key |
| `operating_income` | Operating income (reported denominator) | `NGN` | Annual source-reported denominator; preserve exact label/definition, period, scope, and units. Use only where its accounting presentation reconciles to the income components being compared. | MVP core — The Business; new source-reported input key |

The original 16 keys remain the Phase 1 financial metric vocabulary. `share_price` is a supporting dated market observation, not an additional Phase 1 analysis metric. The four added source-reported keys above and the two conditional derived display measures below are explicit MVP-scope additions, not claims of current data availability. **MVP core** defines intended analytical scope; it does not guarantee a value for every bank. `eps` is supporting information; ROA, the two growth keys, dividend yield, loan-loss coverage, and `loans_to_deposits_ratio` are later additions. Segment/geographic breakdowns and qualitative business descriptions are conditional supporting context only and are not new required metrics.

### Conditional derived income-share displays

These are the only calculations newly approved by this contract. They are derived display measures, not source-reported observations and not replacements for the source lines:

| Derived display identifier | Inputs | Formula | Eligibility |
|---|---|---|---|
| `net_interest_income_share_of_operating_income` | Source-reported `net_interest_income` and `operating_income` | `net_interest_income / operating_income * 100` | Calculate only when source definitions/components reconcile for the same company, reporting period, consolidated/company scope, and compatible units/currency, and the denominator is positive. |
| `non_interest_income_share_of_operating_income` | Source-reported `non_interest_income` and `operating_income` | `non_interest_income / operating_income * 100` | Same alignment and reconciliation requirements; do not infer `non_interest_income` by subtraction unless that report's presentation explicitly supports the calculation. |

Keep each input observation unchanged and separately traceable. Store the formula identifier/version and references to all input observations with each derived result. If an input is absent, definitions differ, components do not reconcile, scope/period/units do not align, or the denominator is zero/negative, leave the derived display unavailable or incomparable with an explicit reason. Do not generalize this approval to other ratios or growth calculations.

Show `net_income` as a multi-year sequence of eligible annual observations to explain its trend; this is a presentation of the observations, not a calculated `net_income_growth` value. Keep missing periods visible as gaps.

For consolidated company-level analysis, `net_income` means profit attributable to equity holders of the parent, not total consolidated profit for the year. Preserve total consolidated profit for the year (for example, `profit_for_the_year`) and profit attributable to non-controlling interests (for example, `profit_attributable_to_non_controlling_interests`) as separate, non-interchangeable source observations when reported. These supporting observations do not expand the 16 Phase 1 metric keys. Record each exact source label, reporting scope, period, unit, and source locator.

Keep shareholder-focused values on a consistent attributable-profit basis. Retain the published EPS and P/E definitions/bases; flag any mismatch or undisclosed basis against profit attributable to owners for review. Do not recalculate published EPS or P/E under this contract.

## 3. Numeric units and conventions

- `percent` uses percentage points: `18.4` means 18.4%, not 0.184.
- `multiple` is a plain multiplier: `6.2` means 6.2x.
- `NGN` is normalized to naira. Preserve the source value and source unit so scale conversion can be audited.
- `NGN_per_share` means naira per share.
- For source figures already published in naira, scale `NGN_thousands` by 1,000 and `NGN_millions` by 1,000,000 to obtain canonical `NGN`; preserve the original value and unit. Convert a published `kobo_per_share` EPS to `NGN_per_share` by dividing by 100, preserving its original value and unit. Do not convert foreign currency using an external exchange rate for this MVP; use the issuer's NGN-presented figure when available, otherwise leave the canonical monetary value unavailable.
- A zero or negative value is valid only when explicitly present in the source.

## 4. Observation fields and provenance

Each accepted observation records:

- Stable `company_id` and one `metric_key` from the vocabulary.
- Numeric `value` and canonical `unit`; preserve `source_value` and `source_unit` when transcribed or normalized.
- `period_kind` (such as `FY`, `TTM`, or `POINT_IN_TIME`), actual `period_start`/`period_end` for annual observations, and `observation_date` for market observations. Growth observations also retain comparison-period dates.
- If a provider's historical market table shows only a month/year label (for example, `Dec 2021`) and no exact day, preserve that exact label in `target_period` and leave `observation_date` NULL. Do not infer a specific calendar day.
- `statement_scope`, such as `consolidated_group` or `company_only`.
- Exact `source_label`, `basis`, and `source_name`. When methodology is undisclosed, flag it as undisclosed; do not invent a definition.
- `source_locator` (API endpoint, report URL and page/table/line, or manual capture reference), `published_at` when available, `retrieved_at`, and `capture_method`.
- `status`: `available`, `missing`, `unavailable`, `not_applicable`, `conflicting`, or `stale`.
- `verification_status`: `not_assessed`, `primary_source_checked`, or `independently_reconciled`. `primary_source_checked` means the transcriber or tool checked the observation against the identified original source and recorded its exact label, value, period, scope, unit, report URL, and locator. A second reviewer is not required. `independently_reconciled` is optional and means the observation was also compared with a separate independent source or record.

For manual TradingView captures, retain the displayed symbol and label, value, visible date/basis, capture timestamp, and a local screenshot/reference identifier when available. A screenshot is provenance, not a substitute for the numeric observation.

## 5. Reporting periods and freshness

- Use the issuer's actual fiscal dates. A fiscal-year label alone does not establish period alignment.
- Compare only the same metric with compatible source definition/basis, statement scope, and aligned reporting period. Market ratios require aligned observation dates and compatible bases.
- Keep financial reporting period, market observation date, publication date, and retrieval/import timestamp distinct. Retrieval time does not make old data current.
- Judge freshness by data type: market snapshots by observation time and stated provider cadence; annual metrics by reporting period and whether a newer annual report is available. Exact stale thresholds remain open until source cadence is known.

## 6. Source priority and conflict handling

| Data category | Initial capture/source | Verification and conflict handling |
|---|---|---|
| Annual financial statement line items and any exact published annual growth value | Prefer the exact observation in an official issuer report/NGX filing when documented. Use TradingView manual capture or an existing API as fallback/validation only when it supplies the same published field and required context. | Preserve exact line/revenue definitions, periods, scope, and source. Do not calculate a substitute growth value. |
| Published annual ratios (ROE, ROA, NPL, loan-loss coverage, cost-to-income, loans-to-deposits, CAR) | Prefer the exact reported ratio in an official issuer report/NGX filing when documented; otherwise use TradingView or an existing API only when provider, label, period/date, scope, and stated basis are recorded. | Accept provisionally when those details are present; flag undisclosed methodology and do not infer it or calculate a substitute. |
| P/E, P/B, and dividend yield | Manually capture the dated published TradingView value initially; use an existing API only when it provides the same published field. | Retain the observation date and stated basis. Do not calculate a missing ratio or yield. |
| EPS | Prefer the exact annual issuer-report EPS and its basic/diluted basis when documented. Use TradingView or an existing API as fallback/validation only when the same period/basis is explicit. | Retain period, scope, currency per share, and basic/diluted designation. Keep its attributable-profit basis consistent with `net_income`; flag mismatches rather than recalculating. |
| Current price and market snapshot | Use an existing market-data API when it provides the field and update metadata. | Retain a manual TradingView reference separately for consistency checks; do not average conflicting values. |
| Bank identity and listing status | Use official NGX/company listing information. | Reconcile API directory identifiers to the stable internal `company_id`; retain provider tickers as aliases. |

For a difference between an annual report and a later report's comparative column, use the audited report issued for the observation's own fiscal year unless the issuer explicitly identifies a restatement or correction. Preserve the chosen report's value and locator, and record the later comparative difference in `basis` or the source note. Do not create a duplicate observation solely for that later comparative. If the issuer explicitly restates or corrects the figure, use the corrected figure and note the change. Use `conflicting` only when the source hierarchy does not resolve the difference or the observations have incompatible definitions, scopes, or bases. Never average values or silently overwrite an existing observation.

## 7. Missing-data behavior

- `missing`: no eligible value has been captured; leave the numeric value empty.
- `unavailable`: the source was checked but could not provide the value or access failed.
- `not_applicable`: the metric genuinely does not apply, with a recorded reason.
- `conflicting`: a material source disagreement remains after applying the annual-report precedence above, or definitions/scopes/bases cannot be reconciled.
- `stale`: the observation fails the applicable freshness policy.
- Insufficient evidence is neutral. Missing data must not become zero, a strength, warning, or failed criterion. Quick Check must not invent an item to fill a UI position.

## 8. Sector statistics and peer eligibility

Defer sector averages until comparable source observations exist. Report core banks/banking groups and mortgage banks separately; do not combine them in peer statistics until comparability and metric eligibility are explicitly established. For later peer statistics, require the same metric, compatible definition/basis and statement scope, and aligned reporting period (or aligned market-observation date). Exclude missing, unavailable, stale, conflicting, or incompatible observations. Report eligible count and coverage; an empty cohort is not zero.

## 9. Day 3 implementation findings (historical baseline)

These findings describe the pre-Day-4 implementation and are retained as historical context:

- `lib/company/company-analysis.ts` returns records from `MOCK_COMPANY_ANALYSES`; the Company Analysis service has no API/database path.
- `lib/company/mock-data.ts` contains one analysis record (GTCO) and hard-coded company/peer display values without metric keys, sources, periods, bases, or timestamps. Treat all mock financial values as illustrative, not verified.
- Mock sector averages lack an eligible peer population, period alignment, and coverage metadata.
- The Quick Check mock has fixed met/unmet booleans and no source evidence or insufficient-evidence result.
- `lib/company/types.ts` uses display strings for section metrics and has no observation provenance fields.
- `data/fixtures/day1-banking-fy2024-pbt.csv` contains FY2024/FY2023 GTCO and Zenith PBT, outside the Phase 1 metric list; it demonstrates provenance/period structure only.
- `public/ngx-mockups/ngx-insight-company-analysis-mapping-manual.html` maps illustrative evidence to screen sections but does not source the mock values.

## 10. Remaining decisions

- Confirm source cadence before setting metric-specific stale thresholds.
- Set sector-statistic period alignment, minimum eligible-bank count, and coverage requirements when comparable observations exist.
- TradingView P/E, P/B, share price, and dividend-yield observations were captured for Day 3. Preserve their exact labels and period/date; where the provider basis is undisclosed, show the value as published but do not calculate or compare it as if the basis were known.
- Corporate disclosures have no table or defined repository source yet; they remain outside the Company Analysis database read path.

## 11. Day 4 Company Analysis integration status — 2026-11-18

- Company routes resolve through a server-side slug-to-`company_id` configuration. Company names are read from `companies`; provider symbols and display metadata are not used as database keys.
- Financial, market, and dividend-yield observations are read from `market_observations`. No separate dividend or corporate-disclosure table was introduced.
- The screen adapter only maps available, valued, sourced, assessed observations and retains their canonical value/unit plus exact source label, original source value/unit, period/date, source name/locator, basis, and verification status.
- Missing or ineligible evidence produces neutral section copy. Mock peer comparisons, fixed Quick Check judgments, and illustrative thesis summaries are not returned as database-backed analysis.
- Share-price reads retain the full observation, including its date and source. The existing portfolio price merge uses its value while the Company Analysis view can expose its provenance.

