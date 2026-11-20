import { getSectorComparison } from "@/lib/discover/sector-comparison";
import { SectorComparisonCard } from "@/components/discover/sectorComparisonCard";
import { AppBackButton } from "@/components/app-shell/app-back-button";

export default async function SectorComparisonPage({
  params,
}: {
  params: Promise<{ pair: string }>;
}) {
  const { pair } = await params;
  const comparison = await getSectorComparison(pair);

  return (
    <div className="px-5 pt-10 pb-10">
      <div className="mb-5 flex items-center gap-3">
        <AppBackButton fallbackHref="/discover/compare-sectors" />
      </div>

      {!comparison ? (
        <div>
          <h1 className="mb-2 font-serif text-2xl font-medium tracking-tight">
            Not built yet.
          </h1>
          <p className="text-[13px] leading-[1.55] text-ink-soft">
            This comparison doesn&apos;t exist yet — check back once it&apos;s
            ready.
          </p>
        </div>
      ) : (
        <SectorComparisonCard comparison={comparison} />
      )}
    </div>
  );
}
