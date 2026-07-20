import { IconBell } from "@tabler/icons-react";

interface GreetingHeaderProps {
  greeting: string;
  subline: string;
  initials: string;
  hasNotification?: boolean;
}

export function GreetingHeader({
  greeting,
  subline,
  initials,
  hasNotification = false,
}: GreetingHeaderProps) {
  return (
    <div className="mb-6 flex items-start justify-between">
      <div className="max-w-[250px]">
        <p className="mb-1 font-serif text-[23px] font-medium tracking-tight text-ink">
          {greeting}
        </p>
        <p className="text-[13px] leading-snug text-ink-mute">{subline}</p>
      </div>
      <div className="mt-0.5 flex flex-shrink-0 items-center gap-2.5">
        <div className="relative flex h-[38px] w-[38px] items-center justify-center rounded-xl border border-border bg-surface text-ink-soft">
          <IconBell size={17} stroke={1.75} />
          {hasNotification && (
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full border-[1.5px] border-surface bg-indigo" />
          )}
        </div>
        <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-gradient-to-br from-indigo-light to-indigo-deep text-xs font-semibold text-white shadow-avatar">
          {initials}
        </div>
      </div>
    </div>
  );
}
