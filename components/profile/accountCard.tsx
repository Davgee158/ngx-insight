export function AccountCard({ name }: { name: string }) {
  return (
    <div className="mb-6 flex w-full items-center gap-3.5 rounded-lg bg-indigo-tint p-[18px_20px]">
      <div className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-full bg-indigo font-serif text-[19px] font-medium text-white">
        {name.charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold text-ink">{name}</p>
        <p className="mt-1 text-[11.5px] leading-[1.5] text-ink-mute">
          Your Watchlist, Portfolio, and saved lenses are stored in this
          browser.
        </p>
      </div>
    </div>
  );
}
