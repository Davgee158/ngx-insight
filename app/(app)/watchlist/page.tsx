import { getWatchlistDirectory } from "@/lib/watchlist/watchlist";
import { WatchlistResolver } from "@/components/watchlist/watchlistResolver";

export default async function WatchlistPage() {
  const companies = await getWatchlistDirectory();

  return (
    <div className="px-5 pt-10">
      <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-ink-mute">
        Watchlist
      </p>
      <WatchlistResolver initialCompanies={companies} />
    </div>
  );
}
