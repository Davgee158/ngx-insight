import type { CompanySnippet } from "@/lib/discover/types";
import { ChosenForYouCard } from "./chosenForYou";

interface ChosenForYouRailProps {
  anchorReason: string;
  companies: CompanySnippet[];
}

export function ChosenForYouRail({ anchorReason, companies }: ChosenForYouRailProps) {
  return (
    <div>
      <h2 className="mb-1 font-serif text-lg font-medium tracking-tight text-ink">
        Chosen for you
      </h2>
      <p className="mb-3.5 text-[12.5px] leading-[1.4] text-ink-mute">
        {anchorReason}
      </p>
      <div className="scrollbar-hide -mx-5 flex gap-3.5 overflow-x-auto px-5 pb-1">
        {companies.map((company) => (
          <ChosenForYouCard key={company.ticker} companySnippet={company} />
        ))}
      </div>
    </div>
  );
}
