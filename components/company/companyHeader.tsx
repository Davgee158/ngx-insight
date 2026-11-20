import type { CompanyAnalysis } from "@/lib/company/types";
import { TickerBadge } from "@/components/company/ticker-badge";
import { CompanyBackButton } from "@/components/company/companyBackButton";

export function CompanyHeader({
  company,
}: {
  company: CompanyAnalysis | null;
}) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <CompanyBackButton />
      {company && (
        <>
          <TickerBadge
            ticker={company.displaySymbol ?? company.ticker}
            size="large"
          />
          <div className="min-w-0 flex-1">
            <p className="font-serif text-[16px] font-medium tracking-[-0.01em] text-ink">
              {company.name}
            </p>
            <p className="text-[11.5px] text-ink-mute">{company.sector}</p>
          </div>
        </>
      )}
    </div>
  );
}
