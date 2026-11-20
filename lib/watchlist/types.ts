export interface WatchlistCompany {
  companyId: string;
  slug: string;
  ticker: string;
  /** The key used by the browser-local app state. */
  stateKey: string;
  name: string;
  sector: string;
  sharePrice: number | null;
  sharePriceDate: string | null;
  sharePriceSourceName: string | null;
  sharePriceSourceLocator: string | null;
  lastFinancialPeriod: string | null;
}
