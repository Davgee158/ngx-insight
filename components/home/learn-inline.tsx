import { IconBulb } from "@tabler/icons-react";

interface LearnInlineProps {
  kicker: string;
  title: string;
}

export function LearnInline({ kicker, title }: LearnInlineProps) {
  return (
    <div>
      <p className="mb-2.5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-ink-mute after:h-px after:flex-1 after:bg-gradient-to-r after:from-border after:to-transparent">
        While you decide
      </p>
      <div className="flex items-center gap-3.5 rounded-xl bg-indigo-tint p-3.5 transition-transform hover:-translate-y-0.5">
        <div className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-[10px] bg-surface text-indigo-deep">
          <IconBulb size={16} stroke={1.75} />
        </div>
        <div>
          <div className="mb-0.5 font-mono text-[11px] font-medium text-indigo-deep">
            {kicker}
          </div>
          <div className="text-[13px] font-medium leading-snug text-ink">
            {title}
          </div>
        </div>
      </div>
    </div>
  );
}
