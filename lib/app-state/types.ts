import type { Section } from "@/lib/home/types";
import type { CompanyRelationship, Position } from "@/lib/company/types";

export interface EngagementEntryBase {
  /** Stable issuer ID used to join personal state to shared company data. */
  companyId?: string;
  ticker: string;
  name: string;
  sector: string;
}

export interface EngagementEntry extends EngagementEntryBase {
  relationship: CompanyRelationship;
  reviewedSections: Section[];
  position?: Position;
}

export interface SavedLens {
  id: string;
  title: string;
}

export interface AppState {
  entries: Record<string, EngagementEntry>;
  savedLenses: Record<string, SavedLens>;
}

export const EMPTY_APP_STATE: AppState = { entries: {}, savedLenses: {} };
