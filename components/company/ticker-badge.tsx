type TickerBadgeProps = {
  ticker: string;
  tone?: "ink" | "indigo";
  size?: "small" | "medium" | "large";
  className?: string;
};

const SIZE_CLASSES = {
  small: "h-7 rounded-lg px-2 text-[10px]",
  medium: "h-8 rounded-[9px] px-2 text-[10px]",
  large: "h-9 rounded-[10px] px-2.5 text-[11px]",
};

const TONE_CLASSES = {
  ink: "bg-ink",
  indigo: "bg-indigo",
};

export function TickerBadge({
  ticker,
  tone = "ink",
  size = "medium",
  className = "",
}: TickerBadgeProps) {
  return (
    <span
      className={`inline-flex min-w-8 flex-shrink-0 items-center justify-center whitespace-nowrap text-center font-semibold leading-none text-white ${SIZE_CLASSES[size]} ${TONE_CLASSES[tone]} ${className}`}
    >
      {ticker.toUpperCase()}
    </span>
  );
}
