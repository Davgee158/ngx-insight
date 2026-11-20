import { Section } from "@/lib/home/types";

export interface PortfolioSummary {
  currentValue: number | null;
  invested: number | null;
  totalReturnAmount: number | null;
  totalReturnPct: number | null;
}

export interface ConcentrationSlice {
  name: string;
  pct: number;
  meta?: string;
}

export interface Position {
  ticker: string;
  name: string;
  sector: string;
  currentPrice: number | null;
  currentValue: number | null;
  shares: number;
  costBasis: number;
  returnPct: number | null;
  sharePriceDate: string | null;
  tradingStatus?: "suspended" | "delisted";
  statusNote?: string;
  attentionTrigger?: {
    section: Section;
    headline: string;
    reviewed: boolean;
  };
}
