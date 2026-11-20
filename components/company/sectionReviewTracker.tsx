"use client";

import { useEffect } from "react";
import { useAppState } from "@/lib/app-state/app-state-context";
import type { Section } from "@/lib/home/types";

export function SectionReviewTracker({
  companyId,
  ticker,
  name,
  sector,
  section,
}: {
  companyId?: string;
  ticker: string;
  name: string;
  sector: string;
  section: Section;
}) {
  const { markSectionReviewed } = useAppState();

  useEffect(() => {
    markSectionReviewed(
      { companyId, ticker: ticker.toLowerCase(), name, sector },
      section,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticker, section]);

  return null;
}
