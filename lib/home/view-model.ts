import {
  DISCOVERY_SECTORS,
  MOCK_HOLDINGS,
  MOCK_OPPORTUNITIES,
  MOCK_PORTFOLIO_SUMMARY,
  MOCK_PRIMARY_EVENT,
  MOCK_SECONDARY_EVENTS,
  MOCK_USER,
  MOCK_WATCHLIST,
} from "./mock-data";
import { SECTION_LABEL, SECTION_ORDER } from "./types";
import type {
  Holding,
  HomeUser,
  MarketEvent,
  Opportunity,
  PortfolioSummary,
  Section,
  WatchlistEntry,
} from "./types";

export type HomeState = "discovery" | "researching" | "stewardship";

interface DiscoveryViewModel {
  kind: "discovery";
  user: HomeUser;
  sectors: typeof DISCOVERY_SECTORS;
}

interface ResearchingViewModel {
  kind: "researching";
  user: HomeUser;
  entry: WatchlistEntry;
  reviewedLabel: string;
  nextSection: Section;
  opportunities: Opportunity[];
  opportunitiesHeading: string;
  opportunitiesSubheading: string;
}

interface StewardshipViewModel {
  kind: "stewardship";
  user: HomeUser;
  holdings: Holding[];
  primaryEvent: MarketEvent;
  secondaryEvents: MarketEvent[];
  portfolioSummary: PortfolioSummary;
  opportunities: Opportunity[];
  opportunitiesHeading: string;
  opportunitiesSubheading: string;
}

export type HomeViewModel =
  | DiscoveryViewModel
  | ResearchingViewModel
  | StewardshipViewModel;

function joinWithAnd(items: string[]): string {
  if (items.length <= 1) return items.join("");
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function mostAdvancedEntry(entries: WatchlistEntry[]): WatchlistEntry {
  return entries.reduce((best, entry) =>
    entry.reviewedSections.length > best.reviewedSections.length ? entry : best
  );
}

export function getHomeViewModel(state?: HomeState): HomeViewModel {
  const resolvedState = state ?? deriveState();

  if (resolvedState === "stewardship") {
    return {
      kind: "stewardship",
      user: MOCK_USER,
      holdings: MOCK_HOLDINGS,
      primaryEvent: MOCK_PRIMARY_EVENT,
      secondaryEvents: MOCK_SECONDARY_EVENTS,
      portfolioSummary: MOCK_PORTFOLIO_SUMMARY,
      opportunities: MOCK_OPPORTUNITIES.slice(0, 1),
      opportunitiesHeading: "Worth exploring today",
      opportunitiesSubheading: "Outside your current holdings.",
    };
  }

  if (resolvedState === "researching") {
    const entry = mostAdvancedEntry(MOCK_WATCHLIST);
    const nextSection = SECTION_ORDER.find(
      (section) => !entry.reviewedSections.includes(section)
    );
    if (!nextSection) {
      throw new Error(
        `Watchlist entry ${entry.ticker} has no remaining sections to review`
      );
    }
    const reviewedLabel = joinWithAnd(
      entry.reviewedSections.map((section) => SECTION_LABEL[section])
    );

    return {
      kind: "researching",
      user: MOCK_USER,
      entry,
      reviewedLabel,
      nextSection,
      opportunities: MOCK_OPPORTUNITIES,
      opportunitiesHeading: "Looking for another opportunity?",
      opportunitiesSubheading:
        "A couple of companies worth a look once you're done here.",
    };
  }

  return {
    kind: "discovery",
    user: MOCK_USER,
    sectors: DISCOVERY_SECTORS,
  };
}

function deriveState(): HomeState {
  if (MOCK_HOLDINGS.length > 0) return "stewardship";
  if (MOCK_WATCHLIST.length > 0) return "researching";
  return "discovery";
}
