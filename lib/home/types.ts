export type Section = "business" | "financial-health" | "valuation" | "risks";

export const SECTION_ORDER: Section[] = [
  "business",
  "financial-health",
  "valuation",
  "risks",
];

export const SECTION_LABEL: Record<Section, string> = {
  business: "The Business",
  "financial-health": "Financial Health",
  valuation: "Valuation",
  risks: "Risks",
};
