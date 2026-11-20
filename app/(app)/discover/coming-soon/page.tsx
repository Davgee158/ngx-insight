import { AppBackButton } from "@/components/app-shell/app-back-button";

export default async function DiscoverComingSoonPage({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string | string[]; from?: string | string[] }>;
}) {
  const query = await searchParams;
  const rawSector = query.sector;
  const sectorName = Array.isArray(rawSector) ? rawSector[0] : rawSector;
  const rawFrom = Array.isArray(query.from) ? query.from[0] : query.from;
  const returnHref = rawFrom === "/" ? "/" : "/discover";
  const returnLabel = returnHref === "/" ? "Back to Home" : "Back to Discover";
  const unavailableSector = ["Telecom", "Consumer", "Energy"].includes(
    sectorName ?? "",
  )
    ? sectorName
    : null;

  return (
    <div className="px-5 pt-10 pb-10">
      <div className="mb-6 flex items-center gap-3">
        <AppBackButton fallbackHref={returnHref} label={returnLabel} />
        <h1 className="font-serif text-2xl font-medium tracking-tight text-ink">
          {unavailableSector ? "Unavailable" : "Coming soon"}
        </h1>
      </div>
      <p className="max-w-[420px] text-[13px] leading-[1.55] text-ink-soft">
        {unavailableSector
          ? `${unavailableSector} is not available in the company directory yet. You can explore Banking and the listed companies in the meantime.`
          : "This Discover feature is not available yet. You can continue exploring the company directory and company analysis pages in the meantime."}
      </p>
    </div>
  );
}
