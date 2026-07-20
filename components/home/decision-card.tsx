import type { ReactNode } from "react";
import { IconArrowRight } from "@tabler/icons-react";
import type { Icon as TablerIcon } from "@tabler/icons-react";

interface DecisionCardProps {
  icon: TablerIcon;
  kicker: string;
  title: string;
  copy: ReactNode;
  timeTag: string;
  ctaLabel: string;
  children?: ReactNode;
}

export function DecisionCard({
  icon: KickerIcon,
  kicker,
  title,
  copy,
  timeTag,
  ctaLabel,
  children,
}: DecisionCardProps) {
  return (
    <div className="rounded-[24px] border border-border bg-surface p-5 shadow-hero">
      <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full bg-indigo-tint px-2.5 py-1.5 text-[11px] font-medium text-indigo-deep">
        <KickerIcon size={12} stroke={2} />
        {kicker}
      </div>
      <h1 className="mb-3.5 font-serif text-[21px] font-semibold leading-[1.26] tracking-tight text-ink">
        {title}
      </h1>
      <p className="text-[13px] leading-[1.55] text-ink-soft [&_b]:font-medium [&_b]:text-ink">
        {copy}
      </p>

      {children}

      <div className="mt-[18px] flex items-center justify-between border-t border-border pt-4">
        <span className="font-mono text-[11px] tracking-tight text-ink-mute">
          {timeTag}
        </span>
        <button className="flex items-center gap-1.5 rounded-xl bg-ink px-[18px] py-3 text-[13px] font-medium text-white transition-transform hover:-translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo">
          {ctaLabel}
          <IconArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
