import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";
import { getLensDetail } from "@/lib/discover/lens-detail";
import { TickerBadge } from "@/components/company/ticker-badge";
import { companySlug } from "@/lib/company/slug";
import { AppBackButton } from "@/components/app-shell/app-back-button";

export default async function LensDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lens = await getLensDetail(slug);

  return (
    <div className="px-5 pt-10 pb-10">
      <div className="mb-5 flex items-center gap-3">
        <AppBackButton fallbackHref="/discover" />
      </div>

      {!lens ? (
        <div>
          <h1 className="mb-2 font-serif text-2xl font-medium tracking-tight">
            Not built yet.
          </h1>
          <p className="text-[13px] leading-[1.55] text-ink-soft">
            This lens doesn&apos;t have a dedicated page yet — check back once
            it&apos;s ready.
          </p>
        </div>
      ) : (
        <div>
          <h1 className="mb-2.5 font-serif text-[24px] font-medium leading-[1.2] tracking-[-0.015em] text-ink">
            {lens.title}
          </h1>
          <p className="mb-6 text-[13.5px] leading-[1.6] text-ink-soft">
            {lens.description}
          </p>

          <div className="mb-3">
            <h2 className="font-serif text-[18px] font-medium tracking-[-0.01em]">
              Companies in this lens
            </h2>
          </div>
          <div className="divide-y divide-border overflow-hidden rounded-[18px] border border-border bg-surface shadow-card">
            {lens.companies.map((company) => (
              <Link
                key={company.ticker}
                href={`/company/${companySlug(company.name)}`}
                className="flex items-center gap-3 p-[13px_15px] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo"
              >
                <TickerBadge ticker={company.ticker} />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-ink">
                    {company.name}
                  </p>
                  <p className="mt-0.5 text-[11.5px] leading-[1.4] text-ink-mute">
                    {company.note}
                  </p>
                </div>
                <IconChevronRight
                  size={16}
                  stroke={1.75}
                  className="flex-shrink-0 text-ink-mute"
                />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
