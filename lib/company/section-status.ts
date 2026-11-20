import { SECTION_ORDER, type Section } from "@/lib/home/types";
import type { CompanySectionStatus } from "./types";

export function deriveSectionStatus(
  reviewedSections: Section[],
): CompanySectionStatus[] {
  let nextAssigned = false;
  return SECTION_ORDER.map((section) => {
    if (reviewedSections.includes(section)) {
      return { key: section, status: "done" as const };
    }
    if (!nextAssigned) {
      nextAssigned = true;
      return { key: section, status: "next" as const };
    }
    return { key: section, status: "todo" as const };
  });
}
