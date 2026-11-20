/**
 * Route and display metadata. `companyId` is the stable database identifier;
 * `ngxSymbol` is a provider alias and is never used to query Neon.
 * `appStateKey` preserves the app-state key for existing GTCO and Zenith
 * positions; it is separate from the official NGX symbol shown in the UI.
 */
export type CompanyRouteConfig = {
  companyId: string;
  slug: string;
  appStateKey: string;
  ngxSymbol: string;
  sector: "Banking" | "Mortgage Banking";
};

export const COMPANY_ROUTE_CONFIGS: CompanyRouteConfig[] = [
  { companyId: "access_holdings", slug: "access-holdings", appStateKey: "ACCESSCORP", ngxSymbol: "ACCESSCORP", sector: "Banking" },
  { companyId: "ecobank_transnational", slug: "ecobank-transnational", appStateKey: "ETI", ngxSymbol: "ETI", sector: "Banking" },
  { companyId: "fcmb_group", slug: "fcmb-group", appStateKey: "FCMB", ngxSymbol: "FCMB", sector: "Banking" },
  { companyId: "fidelity_bank", slug: "fidelity-bank", appStateKey: "FIDELITYBK", ngxSymbol: "FIDELITYBK", sector: "Banking" },
  { companyId: "first_holdco", slug: "first-holdco", appStateKey: "FIRSTHOLDCO", ngxSymbol: "FIRSTHOLDCO", sector: "Banking" },
  { companyId: "gtco", slug: "gtco", appStateKey: "GT", ngxSymbol: "GTCO", sector: "Banking" },
  { companyId: "jaiz_bank", slug: "jaiz-bank", appStateKey: "JAIZBANK", ngxSymbol: "JAIZBANK", sector: "Banking" },
  { companyId: "stanbic_ibtc_holdings", slug: "stanbic-ibtc-holdings", appStateKey: "STANBIC", ngxSymbol: "STANBIC", sector: "Banking" },
  { companyId: "sterling_financial_holdings", slug: "sterling-financial-holdings", appStateKey: "STERLINGNG", ngxSymbol: "STERLINGNG", sector: "Banking" },
  { companyId: "uba", slug: "uba", appStateKey: "UBA", ngxSymbol: "UBA", sector: "Banking" },
  { companyId: "unity_bank", slug: "unity-bank", appStateKey: "UNITYBNK", ngxSymbol: "UNITYBNK", sector: "Banking" },
  { companyId: "wema_bank", slug: "wema-bank", appStateKey: "WEMABANK", ngxSymbol: "WEMABANK", sector: "Banking" },
  { companyId: "zenith_bank", slug: "zenith-bank", appStateKey: "ZB", ngxSymbol: "ZENITHBANK", sector: "Banking" },
  { companyId: "abbey_bank", slug: "abbey-bank", appStateKey: "ABBEYBANK", ngxSymbol: "ABBEYBANK", sector: "Mortgage Banking" },
  { companyId: "infinity_trust_mortgage_bank", slug: "infinity-trust-mortgage-bank", appStateKey: "INFINITY", ngxSymbol: "INFINITY", sector: "Mortgage Banking" },
  { companyId: "livingtrust_mortgage_bank", slug: "livingtrust-mortgage-bank", appStateKey: "LIVINGTRUST", ngxSymbol: "LIVINGTRUST", sector: "Mortgage Banking" },
];

export const COMPANY_CONFIG_BY_SLUG = Object.fromEntries(
  COMPANY_ROUTE_CONFIGS.map((company) => [company.slug, company]),
) as Record<string, CompanyRouteConfig>;

export const COMPANY_CONFIG_BY_ID = Object.fromEntries(
  COMPANY_ROUTE_CONFIGS.map((company) => [company.companyId, company]),
) as Record<string, CompanyRouteConfig>;
