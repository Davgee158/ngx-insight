import Link from "next/link";
import {
  IconAlertTriangle,
  IconArrowRight,
  IconCheck,
  IconMinus,
} from "@tabler/icons-react";
import type { CompanyAnalysis, QuickCheckItem } from "@/lib/company/types";

export function QuickCheckCard({
  slug,
  company,
  quickCheck,
}: {
  slug: string;
  company: CompanyAnalysis;
  quickCheck: QuickCheckItem[];
}) {
  return (
    <div className="mb-7 rounded-[24px] border border-border bg-surface p-5 shadow-card">
      <p className="text-[10.5px] font-medium uppercase tracking-wide text-ink-mute">
        Quick Check
      </p>
      <h2 className="mb-1 font-serif text-[16px] font-medium tracking-[-0.01em] text-ink">
        A fast look at the fundamentals.
      </h2>
      {quickCheck.map((item) => {
        const isStrength = item.kind === "strength";
        const isWatch = item.kind === "watch";
        return (
          <div key={item.text} className="flex items-start gap-2.5 py-2.5">
            <div
              className={`mt-0.5 flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-[8px] ${
                isStrength
                  ? "bg-green-tint text-green-deep"
                  : isWatch
                    ? "bg-amber-tint text-amber-deep"
                    : "bg-surface-tint text-ink-mute"
              }`}
            >
              {isStrength ? (
                <IconCheck size={14} stroke={1.75} />
              ) : isWatch ? (
                <IconAlertTriangle size={14} stroke={1.75} />
              ) : (
                <IconMinus size={14} stroke={1.75} />
              )}
            </div>
            <div>
              <p
                className={`text-[10px] font-semibold uppercase tracking-wide ${
                  isStrength
                    ? "text-green-deep"
                    : isWatch
                      ? "text-amber-deep"
                      : "text-ink-mute"
                }`}
              >
                {isStrength
                  ? "Evidence supports"
                  : isWatch
                    ? "Worth watching"
                    : "Insufficient evidence"}
              </p>
              <p className="text-[10px] text-ink-mute">{item.category}</p>
              <p className="text-[13px] font-medium text-ink">{item.text}</p>
            </div>
          </div>
        );
      })}
      {company.quickCheckBreakdown ? (
        <Link
          href={`/company/${slug}/quick-check`}
          className="mt-3 flex items-center justify-center gap-1.5 rounded-[10px] border-t border-border pt-3 text-[12.5px] font-medium text-indigo-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
        >
          See full breakdown
          <IconArrowRight size={14} stroke={1.75} />
        </Link>
      ) : (
        <div className="mt-3 flex items-center justify-center gap-1.5 border-t border-border pt-3 text-[12.5px] font-medium text-ink-mute">
          See full breakdown — coming soon
        </div>
      )}
    </div>
  );
}
