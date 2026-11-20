import Link from "next/link";
import { connection } from "next/server";
import { IconChevronRight } from "@tabler/icons-react";
import { TickerBadge } from "@/components/company/ticker-badge";
import { AppBackButton } from "@/components/app-shell/app-back-button";
import { getDiscoverCompanies } from "@/lib/discover/companies";
import { getLatestSharePriceObservations } from "@/lib/data-import/observation-repository";

export default async function DiscoverCompaniesPage() {
  await connection();

  const [companies, priceObservations] = await Promise.all([
    getDiscoverCompanies(),
    getLatestSharePriceObservations(),
  ]);
  const pricesByCompanyId = new Map(
    priceObservations.map((observation) => [observation.company_id, observation]),
  );

  return (
    <div className="px-5 pt-10 pb-10">
      <div className="mb-5 flex items-center gap-3">
        <AppBackButton fallbackHref="/discover" label="Back to Discover" />
        <div>
          <h1 className="font-serif text-2xl font-medium tracking-tight text-ink">
            All companies
          </h1>
        </div>
      </div>

      <div className="divide-y divide-border overflow-hidden rounded-[18px] border border-border bg-surface shadow-card">
        {companies.map((company) => {
          const observation = pricesByCompanyId.get(company.companyId);
          const price =
            observation?.value !== null && observation?.value !== undefined
              ? Number(observation.value)
              : null;

          return (
            <Link
              key={company.companyId}
              href={`/company/${company.slug}`}
              className="flex items-center gap-3 px-3.5 py-3.5 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo hover:bg-surface-tint"
            >
              <TickerBadge ticker={company.ngxSymbol} />
              <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-ink">
                {company.name}
              </span>
              <span className="flex-shrink-0 text-right">
                <span className="block text-[13px] font-semibold text-ink">
                  {price !== null && Number.isFinite(price)
                    ? `₦${price.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : "—"}
                </span>
              </span>
              <IconChevronRight
                size={16}
                stroke={1.75}
                className="flex-shrink-0 text-ink-mute"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
