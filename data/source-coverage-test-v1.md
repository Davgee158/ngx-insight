# NGX Insight Source Coverage Test v1

**Status:** Preliminary official-report coverage assessment for GTCO and Zenith; market-provider coverage not validated  
**Review date:** 2026-10-29  
**Scope:** The 16 Phase 1 metrics, starting with GTCO and Zenith Bank  
**References:** [Data contract](../data-contract-v1.md), [Field-to-source matrix](field-to-source-matrix-v1.md), [Bank-universe crosswalk](../ngx-insight-day1-bank-universe-crosswalk.md)

## Test method and result

This assessment inspected the contract, matrix, source fixture, application integration/configuration evidence, and the official FY2024 reports linked in the fixture for GTCO and Zenith. It records Postman response results supplied by the user for NGN Market and Kobo Terminal; these requests were not rerun for this update. No TradingView page was accessed and no provider stock-list endpoint was rerun. Report observations are transcribed as printed; no ratios or growth values were calculated.

The permitted result labels are **verified available**, **partially available**, **unavailable**, and **not yet tested**. In this report, “unavailable in inspected report” means the accessed annual filing did not provide an eligible published observation; it does not establish that all providers lack the field. “Partially available” means the report contains eligible observations for only part of the FY2021–FY2025 target window. Provider access remains unverified where no endpoint response or manual capture exists.

## Access and endpoint evidence

| Source | Endpoint/access evidence in this repository | Test result |
|---|---|---|
| TradingView manual capture | No TradingView capture, screenshot, or observation file found. No application capture integration found. | Not yet tested; repository does not establish account/page access or a captured field. |
| NGN Market API | No API adapter or endpoint configuration found in application source. No local `.env*` configuration or provider-matching environment variable name found. User supplied a Postman result for GTCO financials. | Endpoint request tested in Postman; unavailable on current Free plan (Business required). Underlying endpoint data and metric-field availability remain unverified. |
| Kobo Terminal API | No API adapter or endpoint configuration found in application source. No local `.env*` configuration or provider-matching environment variable name found. User supplied Postman results for GTCO fundamentals, historical prices, and recent prices, and Zenith recent prices. | Fundamentals and requested FY2021–FY2025 history unavailable on current Free plan (Starter or above required). Recent-price endpoint access verified for GTCO and Zenith on Free; this does not establish historical coverage or metric availability. |
| Official issuer reports / NGX filings | Both report URLs from `data/fixtures/day1-banking-fy2024-pbt.csv` were opened: GTCO audited FY2024 statements and Zenith FY2024 annual report. They include FY2023 comparatives and, for some fields, five-year summaries. | Accessible source for some published annual observations. See per-metric status tables and locators below; reports do not establish market/API coverage. |

The existing crosswalk records NGN Market and Kobo symbols as matching for the included issuers, but the saved stock-list responses are not present in the repository. Treat those symbol matches as reported, not independently auditable. No stock-list endpoint was run during this coverage pass.

### User-supplied Postman plan-access tests (GTCO)

These results establish the access response for the tested requests on the current Free plans. They do not establish whether the providers hold the requested observations, and no metric is marked verified available from these responses. The evidence was supplied by the user from Postman; API keys and secrets are not recorded.

| Source and request | Observed response | Access interpretation | Coverage implication |
|---|---|---|---|
| NGN Market — `GET https://api.ngnmarket.com/v1/companies/GTCO/financials` | `success: false`; error code `PLAN_REQUIRED`; Business plan or higher required; tested account Free | Unavailable through this endpoint on the tested plan | Endpoint data and individual financial-field availability remain unverified. No metric coverage is established. |
| Kobo Terminal — `GET https://koboterminal.com/api/ngxdata/fundamentals/GTCO` | “Upgrade required”; Starter or above required; current plan Free | Unavailable on the current plan | Underlying fundamentals and individual field availability remain unverified. No metric coverage is established. |
| Kobo Terminal — `GET https://koboterminal.com/api/ngxdata/prices/GTCO?from=2021-01-01&to=2025-12-31` | Historical data requires Starter; response documents Free access to recent prices up to seven sessions | Requested five-year history is unavailable on the current plan. | No historical price observation or Phase 1 metric coverage is established. |
| Kobo Terminal — `GET https://koboterminal.com/api/ngxdata/prices/GTCO?days=7` | User reports `success: true`, `symbol: GTCO`, `count: 7`; seven records dated 2026-10-20 through 2026-10-28, each with `trade_date`, `open_price`, `high_price`, `low_price`, `close_price`, and `volume`. Retrieved in Postman on the current Free plan; exact retrieval time was not supplied. | **Verified available:** recent-price endpoint access for GTCO on Free, within the documented seven-session allowance. | Confirms endpoint response access only. It does not establish five-year history, cover other issuers, or verify a Phase 1 metric. |
| Kobo Terminal — `GET https://koboterminal.com/api/ngxdata/prices/ZENITHBANK?days=7` | User reports `success: true`, `symbol: ZENITHBANK`, `count: 7`; seven records dated 2026-10-20 through 2026-10-28, each with `trade_date`, `open_price`, `high_price`, `low_price`, `close_price`, and `volume`. Retrieved in Postman on the current Free plan; retrieval timestamp was not supplied. | **Verified available:** recent-price endpoint access for Zenith Bank on Free, within the documented seven-session allowance. | Confirms endpoint response access only. It does not establish historical-price access, financial fundamentals, coverage for other issuers, or any Phase 1 metric. Four supplied OHLC pairs fail basic consistency checks; see quality notes below. |

The API columns in the company metric tables remain **not yet tested** for metric coverage: plan-gated error responses contain no metric observations, and recent-price responses are endpoint-access evidence rather than documented Phase 1 metric observations. For both supplied recent-price summaries, the reported seven-record count and date range (2026-10-20 through 2026-10-28) are consistent with seven trading sessions. The GTCO raw response values supplied for two dates include OHLC consistency issues requiring source verification; preserve the values as reported:

| Trade date | Supplied values | Issue |
|---|---|---|
| 2026-10-26 | open 122; high 125.1; low 124.8; close 125.1 | Low is above open. |
| 2026-10-28 | open 123.2; high 122; low 120; close 121 | High is below open and close. |

No inference is made about which value is incorrect. The complete seven-record GTCO response and its retrieval timestamp are not transcribed in this artifact; no other record values are reconstructed.

**Zenith recent-price data-quality review:** Preserve the supplied values; do not correct or infer which field is wrong. Four records have OHLC consistency issues requiring source verification:

| Trade date | Supplied values | Issue |
|---|---|---|
| 2026-10-20 | open 124; high 123.9 | High is below open. |
| 2026-10-21 | open 123.5; high 123 | High is below open. |
| 2026-10-23 | open 121.5; high 121.2 | High is below open. |
| 2026-10-26 | open 119.4; low 119.8 | Low is above open. |

The remaining records passed only these basic checks; that does not establish overall data accuracy. The complete raw OHLC values and retrieval timestamp were not supplied in the evidence, so neither is recorded here.

## Cohort A — Core banks and banking groups

Test subjects: GTCO (`gtco`) and Zenith Bank (`zenith_bank`). Official FY2024 filings are accessible for both; they contain published observations for only some metrics/periods. Kobo recent-price endpoint responses are recorded above for both; no TradingView capture is available.

### GTCO (`gtco`)

#### First Phase 1 source test: `net_income`

- **Status:** Verified available from the official issuer report for GTCO FY2024 and FY2023 comparative. Under the adopted contract, `net_income` maps to profit attributable to equity holders of the parent. Total consolidated profit and non-controlling interests remain separate observations, not substitutes for `net_income`.
- **Source:** [Guaranty Trust Holding Company Plc, Audited Consolidated and Separate Financial Statements Together with Directors' and Auditor's Reports, December 2024](https://doclib.ngxgroup.com/Financial_NewsDocs/43470_GUARANTY_TRUST_HOLDING_COMPANY_PLC-_QUARTER_5_-_FINANCIAL_STATEMENT_FOR_2024_FINANCIAL_STATEMENTS_MARCH_2025.pdf), NGX issuer filing. Exact URL is also recorded in `data/fixtures/day1-banking-fy2024-pbt.csv`.
- **Reporting period:** Year ended 31 December 2024; the same statement presents the year ended 31 December 2023 as the comparative. These are annual financial reporting periods, not retrieval dates.
- **Statement/scope:** Printed page 69, “Consolidated and separate income statements,” with columns for Group Dec-2024, Group Dec-2023, Company Dec-2024 and Company Dec-2023. This test concerns the two Group columns (consolidated group), not the separate Company columns.
- **Reported units:** “In thousands of Nigerian Naira” (`N'000`). Values below are transcribed as printed; no normalization is applied in this evidence record.
- **Accounting basis:** Audited statements prepared in accordance with IFRS issued by the IASB and adopted by Nigeria's Financial Reporting Council, as described in the report introduction. The report states that the Group comprises the Parent and its subsidiaries.
- **Retrieval date:** 2026-10-28 (UTC date of retrieval through the browser tool).
- **FY2024 Group figures, exact labels and source values:** canonical `net_income`: `Profit attributable to: Equity holders of the parent entity` — `1,006,219,889` N'000. Separate supporting observations: `Profit for the year` — `1,017,802,849` N'000; `Non-controlling interests` — `11,582,960` N'000. Profit attributable to owners plus non-controlling interests reconciles to total profit for the year.
- **FY2023 Group comparative from the same statement:** canonical `net_income`: `Profit attributable to: Equity holders of the parent entity` — `534,425,317` N'000. Separate supporting observations: `Profit for the year` — `539,654,674` N'000; `Non-controlling interests` — `5,229,357` N'000.
- **Locator:** Printed page 69 / PDF page 72, consolidated and separate income statements, for year ended 31 December 2024; the executive summary also repeats the figures on printed page 43. The full statement is the primary locator.
- **Definition applied:** `net_income` is profit attributable to equity holders of the parent for consolidated company-level analysis. The exact total-profit and non-controlling-interest lines are retained separately and are not interchangeable.
- **EPS evidence, exact report label and values:** `Earnings per share attributable to the equity holders of the parent entity during 'the period (expressed in naira per share):` followed by `Basic` and `Diluted`. In the Group columns, FY2024 basic EPS is `35.44` NGN/share and diluted EPS is `35.44` NGN/share; FY2023 comparative basic EPS is `19.07` NGN/share and diluted EPS is `19.07` NGN/share. The adjacent Company columns are separate-company results and are not used for this consolidated company-level observation. The statement heading identifies the period as the year ended 31 December 2024, with columns Dec-2024 and Dec-2023. Locator: printed page 69 / PDF page 72, immediately below the consolidated and separate income statement.
- **EPS conclusion:** The report explicitly attributes EPS to parent equity holders and distinguishes basic from diluted. Both EPS values are attributable-profit aligned with the adopted `net_income` concept. This establishes official-report availability for these periods only; TradingView/API EPS coverage is not established.
- **P/E evidence and requirements:** The data contract defines P/E as a published multiple with a point-in-time observation date and published EPS basis (for example, TTM or FY); it instructs not to calculate a missing ratio. The contract specifies no P/E formula and no separate share-price metric. To validate a published P/E observation, retain the provider's exact P/E label/value, observation date, stated EPS basis and scope, and evidence tying that snapshot to a market price date and compatible EPS basis. An annual-report FY EPS and a later/current share price are not, by themselves, a verified P/E observation. The FY2024 filing contains no market-price observation for the required P/E date, and no P/E source value was captured in this test.
- **P/E conclusion:** Not yet tested. No price, P/E value, or date-aligned P/E input was supplied by the report; no P/E was calculated and no formula or API coverage is claimed.
- **Shareholder-metric consistency note:** The report's FY basic and diluted EPS are attributable to parent equity holders, consistent in concept with the adopted profit definition. P/E consistency cannot be assessed until a dated published P/E observation with its EPS basis is captured. No formulas were changed.

| Metric key | TradingView manual | NGN Market API | Kobo Terminal API | Official issuer reports / NGX filings |
|---|---|---|---|---|
| `net_income` | not yet tested | not yet tested | not yet tested | partially available: FY2024/FY2023 Group attributable-to-parent line; FY2021-FY2022 canonical line and FY2025 not evidenced |
| `roe` | not yet tested | not yet tested | not yet tested | unavailable in inspected filing as a published ratio value; report mentions ROE as a risk metric but supplies no eligible observation |
| `roa` | not yet tested | not yet tested | not yet tested | unavailable in inspected filing as a published ratio value |
| `net_interest_income` | not yet tested | not yet tested | not yet tested | partially available: Group FY2021-FY2024 five-year summary; FY2025 not evidenced |
| `non_interest_income` | not yet tested | not yet tested | not yet tested | unavailable as an exact published metric line; do not substitute `Total other income` or aggregate components |
| `revenue_growth` | not yet tested | not yet tested | not yet tested | unavailable as actual consolidated historical growth; report's `Revenue Growth Rate` lines are segment-level forecast assumptions, not eligible observations |
| `net_income_growth` | not yet tested | not yet tested | not yet tested | unavailable as a published growth value; report line items are not used to calculate a substitute |
| `pe_ratio` | not yet tested | not yet tested | not yet tested | unavailable in annual report; no dated market price or published P/E observation |
| `pb_ratio` | not yet tested | not yet tested | not yet tested | unavailable in annual report; no dated market price or published P/B observation |
| `eps` | not yet tested | not yet tested | not yet tested | partially available: Group basic/diluted FY2021-FY2024 in five-year summary; FY2025 not evidenced |
| `dividend_yield` | not yet tested | not yet tested | not yet tested | unavailable as a published yield; dividend disclosures do not establish a yield observation |
| `npl_ratio` | not yet tested | not yet tested | not yet tested | unavailable as a published NPL ratio; underlying loan/allowance detail is not used to calculate one |
| `loan_loss_coverage_ratio` | not yet tested | not yet tested | not yet tested | unavailable as a published eligible ratio in this filing; no comparable single coverage observation identified |
| `cost_to_income_ratio` | not yet tested | not yet tested | not yet tested | unavailable as a published ratio value; report mentions this risk metric without an eligible observation |
| `loans_to_deposits_ratio` | not yet tested | not yet tested | not yet tested | unavailable as a published ratio value; report mentions ratio analysis without an eligible observation |
| `capital_adequacy_ratio` | not yet tested | not yet tested | not yet tested | partially available: Group full-impact FY2023-FY2024; FY2021-FY2022 and FY2025 not evidenced |

#### Additional GTCO report observations

- **Report/access:** GTCO's *Audited Consolidated and Separate Financial Statements Together with Directors' and Auditor's Reports, December 2024*, at the NGX filing URL above. Retrieved 2026-10-28. The Group five-year summary labels periods Dec-2024, Dec-2023, Dec-2022, Dec-2021, and Dec-2020 (the latter is an additional comparative period); amounts are in thousands of Nigerian Naira.
- **`net_interest_income`:** exact label `Net interest income`, Group, FY2024 1,058,586,173; FY2023 436,696,585; FY2022 259,303,127; FY2021 220,612,622; additional FY2020 comparative 253,668,147, all N'000. Locator: printed page 328 / PDF page 331, Five Year Financial Summary Cont'd, Statements of comprehensive income. This is source-reported, not a derived value.
- **`eps`:** the Group five-year summary reports basic and diluted EPS for continuing operations attributable to equity holders of the parent: FY2024 35.44, FY2023 19.07, FY2022 5.95, FY2021 6.14, FY2020 7.11 NGN/share. Locator: printed page 328 / PDF page 331. FY2025 is not in this filing.
- **`capital_adequacy_ratio`:** exact report label `Capital adequacy ratio` / `Total Risk-Weighted Capital Ratio`, Group, full-impact basis: 39.31% at 31 December 2024 and 21.94% at 31 December 2023. Locator: printed pages 202-203 / PDF pages 205-206, Basel II capital adequacy disclosure. No FY2021, FY2022 or FY2025 value is established by this filing.
- The filing contains component financial statement lines and narrative references relevant to other ratios, but this pass did not identify eligible published FY observations for the unavailable rows in the table. No substitutes or ratios were calculated.

### Zenith Bank (`zenith_bank`)

| Metric key | TradingView manual | NGN Market API | Kobo Terminal API | Official issuer reports / NGX filings |
|---|---|---|---|---|
| `net_income` | not yet tested | not yet tested | not yet tested | partially available: FY2024/FY2023 Group profit attributable to parent; FY2021-FY2022 canonical line and FY2025 not evidenced |
| `roe` | not yet tested | not yet tested | not yet tested | unavailable in inspected report as a published ratio value |
| `roa` | not yet tested | not yet tested | not yet tested | unavailable in inspected report as a published ratio value |
| `net_interest_income` | not yet tested | not yet tested | not yet tested | partially available: Group FY2024/FY2023 statement; older summary does not give this Group line and FY2025 not evidenced |
| `non_interest_income` | not yet tested | not yet tested | not yet tested | unavailable as an exact published metric line; do not aggregate components or substitute other operating income |
| `revenue_growth` | not yet tested | not yet tested | not yet tested | unavailable as a published historical growth value; do not calculate from gross earnings |
| `net_income_growth` | not yet tested | not yet tested | not yet tested | unavailable as a published growth value; do not calculate from profit figures |
| `pe_ratio` | not yet tested | not yet tested | not yet tested | unavailable in annual report; no dated market price or published P/E observation |
| `pb_ratio` | not yet tested | not yet tested | not yet tested | unavailable in annual report; no dated market price or published P/B observation |
| `eps` | not yet tested | not yet tested | not yet tested | partially available: Group basic/diluted FY2021-FY2024 five-year summary; FY2025 not evidenced |
| `dividend_yield` | not yet tested | not yet tested | not yet tested | unavailable as a published yield; dividend-per-share disclosures do not establish a yield observation |
| `npl_ratio` | not yet tested | not yet tested | not yet tested | unavailable as a published NPL ratio in the inspected report |
| `loan_loss_coverage_ratio` | not yet tested | not yet tested | not yet tested | partially available related measure: Group class-specific `ECL Coverage Ratio` tables for FY2023/FY2024; mapping to the Phase 1 ratio basis is unresolved |
| `cost_to_income_ratio` | not yet tested | not yet tested | not yet tested | unavailable as a published ratio value in inspected report |
| `loans_to_deposits_ratio` | not yet tested | not yet tested | not yet tested | unavailable as a published ratio value; report discusses ratio analysis but gives no eligible observation |
| `capital_adequacy_ratio` | not yet tested | not yet tested | not yet tested | partially available: Group Basel II risk-weighted CAR FY2023/FY2024; FY2021-FY2022 and FY2025 not evidenced |

#### Zenith FY2024 report observations

- **Report/access:** Zenith Bank Plc, *Annual Report - 31 December 2024*, at the NGX filing URL recorded in `data/fixtures/day1-banking-fy2024-pbt.csv`. Retrieved 2026-10-28. The report includes FY2023 comparatives and Group five-year summaries for Dec-2024 through Dec-2020. Amounts in the cited financial statements are in millions of Naira unless the line explicitly states kobo or another unit.
- **`net_income`:** exact label `Profit attributable to: Equity holders of the parent`, consolidated Group: FY2024 1,032,711 N'million; FY2023 676,569 N'million. The same statement separately reports `Non-controlling interest` of 184 and 340 N'million, respectively, and `Profit for the year after tax` of 1,032,895 and 676,909 N'million. Locator: printed page 34 / PDF page 39, Consolidated and Separate Statements of Profit or Loss. FY2021-FY2022 canonical attributable-to-parent lines and FY2025 are not established by this filing.
- **`net_interest_income`:** exact label `Net interest income`, consolidated Group: FY2024 1,728,903 N'million; FY2023 736,182 N'million. Locator: printed page 34 / PDF page 39. The five-year Group summary does not provide this line for FY2021-FY2022; FY2025 is not in the filing.
- **`eps`:** the Group five-year summary reports `Earnings per share — Basic and diluted (kobo)`: FY2024 3,287; FY2023 2,155; FY2022 714; FY2021 778; FY2020 734 kobo/share. The main Group statement reports FY2024 and FY2023 basic and diluted EPS as 32.87 and 21.55 Naira/share. Note 14 says EPS uses profit attributable to shareholders and weighted-average shares; basic and diluted are the same because there are no potentially dilutive ordinary shares. Locators: printed pages 34 and 196 / PDF pages 39 and 201; EPS note printed page 150 / PDF page 156. FY2025 is not in this filing.
- **`capital_adequacy_ratio`:** exact report label `Risk-weighted Capital Adequacy Ratio (CAR)`, Group, Basel II: 26% at 31 December 2024 and 22% at 31 December 2023. Locator: printed page 135 / PDF page 141, capital adequacy computation. The table separately gives Bank ratios; only Group values are recorded here. FY2021-FY2022 and FY2025 are not established by this filing.
- **`loan_loss_coverage_ratio` related evidence:** the report publishes class-specific `ECL Coverage Ratio` tables for Group at 31 December 2024 and 31 December 2023 (printed pages 100-102 / PDF pages 105-108). These are reported coverage ratios by financial-statement class/stage, not a demonstrated match for the contract's single banking loan-loss coverage metric. Keep status partial pending an explicit basis mapping; do not substitute or aggregate these ratios.
- The report includes gross earnings and detailed impairment/loan disclosures, but no eligible published revenue-growth, net-income-growth, non-interest-income, NPL, cost-to-income, or loans-to-deposits observation was identified in this pass. No substitute figures or ratios were calculated.

## Cohort B — Mortgage banks

The crosswalk lists Abbey Bank (`abbey_bank`), Infinity Trust Mortgage Bank (`infinity_trust_mortgage_bank`), and LivingTrust Mortgage Bank (`livingtrust_mortgage_bank`) separately from Cohort A. No mortgage-bank metric source test was run or supported by a local metric observation. These results are not combined with Cohort A.

| Metric key | TradingView manual | NGN Market API | Kobo Terminal API | Official issuer reports / NGX filings |
|---|---|---|---|---|
| `net_income` | not yet tested | not yet tested | not yet tested | not yet tested |
| `roe` | not yet tested | not yet tested | not yet tested | not yet tested |
| `roa` | not yet tested | not yet tested | not yet tested | not yet tested |
| `net_interest_income` | not yet tested | not yet tested | not yet tested | not yet tested |
| `non_interest_income` | not yet tested | not yet tested | not yet tested | not yet tested |
| `revenue_growth` | not yet tested | not yet tested | not yet tested | not yet tested |
| `net_income_growth` | not yet tested | not yet tested | not yet tested | not yet tested |
| `pe_ratio` | not yet tested | not yet tested | not yet tested | not yet tested |
| `pb_ratio` | not yet tested | not yet tested | not yet tested | not yet tested |
| `eps` | not yet tested | not yet tested | not yet tested | not yet tested |
| `dividend_yield` | not yet tested | not yet tested | not yet tested | not yet tested |
| `npl_ratio` | not yet tested | not yet tested | not yet tested | not yet tested |
| `loan_loss_coverage_ratio` | not yet tested | not yet tested | not yet tested | not yet tested |
| `cost_to_income_ratio` | not yet tested | not yet tested | not yet tested | not yet tested |
| `loans_to_deposits_ratio` | not yet tested | not yet tested | not yet tested | not yet tested |
| `capital_adequacy_ratio` | not yet tested | not yet tested | not yet tested | not yet tested |

## Local evidence reviewed

- `data/samples/gtco-financial-observations.csv`: 78 observation rows: 20 populated and 58 retained with `missing` status. The populated sample represents GTCO and Zenith, across `net_income`, `net_interest_income`, `eps`, and `capital_adequacy_ratio` only. The populated observations are consistent with the report transcriptions recorded above, including their values and locators. The cited original issuer-report files or extracts are not stored locally, so these rows have not been independently checked against local primary-source documents. This sample does not establish source access, data quality, or readiness for production use; those are assessed separately in the endpoint and data-quality evidence above.
- `data/fixtures/day1-banking-fy2024-pbt.csv`: GTCO and Zenith consolidated-group PBT for FY2024 with FY2023 comparatives. PBT is not one of the 16 Phase 1 metric keys, so it does not establish coverage for any matrix row.
- `data/fixtures/README.md`: confirms that the PBT fixture is a historical validation example, not a full Company Analysis dataset.
- `lib/company/company-analysis.ts` and `lib/company/mock-data.ts`: Company Analysis is mock-backed; the displayed figures lack the provenance required by the data contract and are illustrative, not source-coverage evidence.
- The data directory contains no NGN Market/Kobo metric response captures, no TradingView manual captures, and no locally stored issuer-report PDFs. The two report URLs in the PBT fixture were accessible and opened for this review.

## Findings and blockers

- **GTCO:** official-report observations are partially available for `net_income` (FY2024/FY2023), `net_interest_income` (FY2021-FY2024), `eps` (FY2021-FY2024), and `capital_adequacy_ratio` (FY2023/FY2024). The other 12 report metrics are unavailable in the inspected FY2024 filing as eligible published observations. FY2025 is not covered by this filing.
- **Zenith:** official-report observations are partially available for `net_income` and `net_interest_income` (FY2024/FY2023), `eps` (FY2021-FY2024), and `capital_adequacy_ratio` (FY2024/FY2023). A related class-specific ECL coverage ratio is published for FY2024/FY2023, but mapping it to `loan_loss_coverage_ratio` is unresolved. Other report metrics are unavailable in the inspected filing as eligible published observations. FY2025 is not covered by this filing.
- **Mortgage-bank cohort:** 0 of 16 metrics tested; all sources remain not yet tested. This cohort is reported separately from Cohort A.
- **NGN Market and Kobo:** user-supplied Postman evidence shows the GTCO financials request is plan-gated on NGN Market Free (Business required), and the fundamentals request and requested five-year Kobo price history are plan-gated on Kobo Free (Starter or above required). Kobo recent-price requests returned seven records for GTCO and Zenith on Free, verifying endpoint access for those two issuers only. The GTCO response includes two and the Zenith response four OHLC consistency issues requiring source verification. Plan restrictions do not establish that underlying data is absent; recent-price responses do not verify any Phase 1 metric. All API metric cells remain not yet tested.
- **TradingView:** no manual observations or access evidence were supplied locally. All TradingView cells remain not yet tested.
- **Coverage limit:** this assessment covers only the two accessible FY2024 filings and their embedded comparatives/summaries, not all reports or the full FY2021-FY2025 target. No metric is verified across all target periods, no growth value was calculated, and no API coverage is claimed.

Next, obtain appropriately entitled access (NGN Market Business for the tested financials endpoint and Kobo Starter or above for fundamentals and historical prices), then repeat a narrow field-level test that records the returned label, value, period, scope, units, and basis. For Kobo recent prices, verify the flagged GTCO and Zenith OHLC records against source evidence and retain full raw values and retrieval timestamps if available. Do not generalize to other issuers or historical price coverage, and do not share credentials in chat. TradingView still needs a manual capture with symbol, exact label, value, period/date, scope/basis, and capture time. Continue recording provenance for every observation. This assessment does not validate the full MVP data contract or coverage across all 16 issuers.

