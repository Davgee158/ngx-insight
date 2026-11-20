# NGX Insight â€” Day 1 Bank Universe & Provider Symbol Crosswalk

**Status:** Issuer identities and NGX references checked against official NGX company profiles. NGN Market aliases and most Kobo aliases are reported from previously saved stock lists and are not independently auditable from repository evidence. Kobo recent-price responses echo `GTCO` and `ZENITHBANK` for those two requests only; this is limited endpoint evidence, not full crosswalk verification.
**Verification date:** 2026-10-27  
**Scope:** The initial MVP cohort is the 16 issuers listed here: 13 core banks/banking groups and 3 mortgage banks. This is not an assertion that the cohort exhaustively lists every banking or financial institution on the NGX.

## Mapping rules

- `company_id` is a stable internal identifier; it is not a provider ticker.
- NGX, NGN Market and Kobo symbols are separate aliases, even when their values match.
- Provider aliases below are generally reported from previously saved stock lists, whose responses are not present in the repository. The source-coverage record documents successful Kobo recent-price responses echoing `GTCO` and `ZENITHBANK`; this supports those two price requests only and does not independently verify the full provider crosswalk. Do not rerun stock-list endpoints solely to resolve the remaining documentation gap.
- Financial Services sector membership alone does not make an issuer a bank.

## Approved initial MVP cohort

- The initial MVP cohort is the 16 existing issuers in Cohorts A and B: 13 core banks/banking groups and 3 mortgage banks.
- Microfinance banks are outside this cohort. NPF Microfinance Bank remains excluded as a candidate for a possible future, separately defined cohort.
- UBN is not included in or substituted for any of these 16 issuers. Its active-equity/listing status remains pending verification.
- The approved scope does not itself verify issuer status or provider-symbol mappings. NGN Market aliases and most Kobo aliases remain reported from saved lists without source-response evidence. Kobo recent-price responses echo `GTCO` and `ZENITHBANK` for those two requests only; the remaining issuer aliases and other Kobo data routes are not verified by those responses.

## Cohort A â€” Core banks and banking groups

| company_id | Official NGX issuer name | NGX symbol | NGN Market symbol | Kobo symbol | Official NGX profile |
|---|---|---|---|---|---|
| `access_holdings` | Access Holdings Plc | `ACCESSCORP` | `ACCESSCORP` | `ACCESSCORP` | [NGX](https://ngxgroup.com/exchange/data/company-profile/?directory=companydirectory&symbol=ACCESSCORP) |
| `ecobank_transnational` | Ecobank Transnational Incorporated | `ETI` | `ETI` | `ETI` | [NGX](https://ngxgroup.com/exchange/data/company-profile/?directory=companydirectory&symbol=ETI) |
| `fcmb_group` | FCMB Group Plc | `FCMB` | `FCMB` | `FCMB` | [NGX](https://ngxgroup.com/exchange/data/company-profile/?directory=companydirectory&symbol=FCMB) |
| `fidelity_bank` | Fidelity Bank Plc | `FIDELITYBK` | `FIDELITYBK` | `FIDELITYBK` | [NGX](https://ngxgroup.com/exchange/data/company-profile/?directory=companydirectory&symbol=FIDELITYBK) |
| `first_holdco` | First HoldCo Plc | `FIRSTHOLDCO` | `FIRSTHOLDCO` | `FIRSTHOLDCO` | [NGX](https://ngxgroup.com/exchange/data/company-profile/?directory=companydirectory&symbol=FIRSTHOLDCO) |
| `gtco` | Guaranty Trust Holding Company Plc | `GTCO` | `GTCO` | `GTCO` | [NGX](https://ngxgroup.com/exchange/data/company-profile/?directory=companydirectory&symbol=GTCO) |
| `jaiz_bank` | Jaiz Bank Plc | `JAIZBANK` | `JAIZBANK` | `JAIZBANK` | [NGX](https://ngxgroup.com/exchange/data/company-profile/?directory=companydirectory&symbol=JAIZBANK) |
| `stanbic_ibtc_holdings` | Stanbic IBTC Holdings Plc | `STANBIC` | `STANBIC` | `STANBIC` | [NGX](https://ngxgroup.com/exchange/data/company-profile/?directory=companydirectory&symbol=STANBIC) |
| `sterling_financial_holdings` | Sterling Financial Holdings Company Plc | `STERLINGNG` | `STERLINGNG` | `STERLINGNG` | [NGX](https://ngxgroup.com/exchange/data/company-profile/?directory=companydirectory&symbol=STERLINGNG) |
| `uba` | United Bank for Africa Plc | `UBA` | `UBA` | `UBA` | [NGX](https://ngxgroup.com/exchange/data/company-profile/?directory=companydirectory&symbol=UBA) |
| `unity_bank` | Unity Bank Plc | `UNITYBNK` | `UNITYBNK` | `UNITYBNK` | [NGX](https://ngxgroup.com/exchange/data/company-profile/?directory=companydirectory&symbol=UNITYBNK) |
| `wema_bank` | Wema Bank Plc | `WEMABANK` | `WEMABANK` | `WEMABANK` | [NGX](https://ngxgroup.com/exchange/data/company-profile/?directory=companydirectory&symbol=WEMABANK) |
| `zenith_bank` | Zenith Bank Plc | `ZENITHBANK` | `ZENITHBANK` | `ZENITHBANK` | [NGX](https://ngxgroup.com/exchange/data/company-profile/?directory=companydirectory&symbol=ZENITHBANK) |

## Cohort B â€” Mortgage banks

| company_id | Official NGX issuer name | NGX symbol | NGN Market symbol | Kobo symbol | Official NGX profile |
|---|---|---|---|---|---|
| `abbey_bank` | Abbey Bank Plc | `ABBEYBANK` | `ABBEYBANK` | `ABBEYBANK` | [NGX](https://ngxgroup.com/exchange/data/company-profile/?directory=companydirectory&symbol=ABBEYBANK) |
| `infinity_trust_mortgage_bank` | Infinity Trust Mortgage Bank Plc | `INFINITY` | `INFINITY` | `INFINITY` | [NGX](https://ngxgroup.com/exchange/data/company-profile/?directory=companydirectory&symbol=INFINITY) |
| `livingtrust_mortgage_bank` | LivingTrust Mortgage Bank Plc | `LIVINGTRUST` | `LIVINGTRUST` | `LIVINGTRUST` | [NGX](https://ngxgroup.com/exchange/data/company-profile/?directory=companydirectory&symbol=LIVINGTRUST) |

## Additional provider-list review and exclusions

| Candidate | Finding | Decision |
|---|---|---|
| `NPFMCRFBK` — NPF Microfinance Bank Plc | Official NGX profile confirms it is listed and classifies it as a Micro-Finance Bank. [NGX](https://ngxgroup.com/exchange/data/company-profile/?directory=companydirectory&symbol=NPFMCRFBK) | Excluded from the initial 16-issuer cohort; retain only as a candidate for a possible future, separately defined microfinance-bank cohort. |
| `UBN` | The saved NGX ticker strip showed `UBN [BMF]`; active-equity/listing status remains pending verification. | Not part of the initial 16 issuers. Do not add or substitute it unless its status is verified and scope is separately approved. |
| Other `FINANCIAL SERVICES` issuers | Insurers, investment/asset managers and the exchange group are not banks merely because of their sector label. | Exclude unless issuer identity and nature of business match an approved cohort. |

## Verification notes
- Official NGX profiles verify issuer identity, ticker and current profile/trading presence for the included rows. Specific checks confirmed `ETI`, `UNITYBNK`, `WEMABANK`, `ABBEYBANK`, `INFINITY`, `LIVINGTRUST`, and `NPFMCRFBK`.
- Previously saved NGN Market and Kobo lists were reported to contain matching aliases for all 16 included rows, but the saved list responses are not available in the repository for independent audit. The source-coverage record documents successful Kobo recent-price responses with `symbol: GTCO` and `symbol: ZENITHBANK`; these establish endpoint-response evidence for those two recent-price requests only. They do not verify the other 14 Kobo aliases, Kobo fundamentals or historical-price routes, or any NGN Market alias. Stock-list endpoints were not re-run solely to resolve this documentation gap.
- Abbey and Infinity appear on the Main Board; LivingTrust appears on the Growth Board. Board does not determine cohort membership.
- Some NGX profile pages display legacy/inconsistent â€œDate Listedâ€ metadata. Do not treat a displayed 1970 date as a reliable original listing date; rely on the official profile, ticker, market classification and trading/profile presence.
- This is a point-in-time crosswalk. If a ticker changes, update its provider alias and retain the stable `company_id`.

## Final count
- Core banking issuers: **13**
- Mortgage banks: **3**
- Included total: **16**
- Additional listed microfinance bank candidate excluded from the initial cohort: **1** (`NPFMCRFBK`), for possible future review.
