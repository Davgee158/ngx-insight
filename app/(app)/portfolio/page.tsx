import { getCompanyCurrentPrices } from "@/lib/company/company-analysis";
import { PortfolioResolver } from "@/components/portfolio/portfolioResolver";

export default async function PortfolioPage() {
  const currentPrices = await getCompanyCurrentPrices();

  return (
    <div className="px-5 pt-10">
      <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-ink-mute">
        Portfolio
      </p>
      <PortfolioResolver
        currentPrices={currentPrices}
      />
    </div>
  );
}
