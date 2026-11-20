import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { SECTION_LIST_META, type CompanySectionStatus } from "@/lib/company/types";

export function SectionList({
  slug,
  sectionStatus,
}: {
  slug: string;
  sectionStatus: CompanySectionStatus[];
}) {
  return (
    <div>
      <p className="mb-1 font-serif text-[16px] font-medium tracking-[-0.01em] text-ink">
        Understanding this business
      </p>
      <p className="mb-3.5 text-[12px] text-ink-mute">
        Explore the company&apos;s reported financial position, performance,
        valuation, and risks.
      </p>

      <div className="mb-7 flex flex-col gap-2.5">
        {sectionStatus.map(({ key }) => {
          const meta = SECTION_LIST_META[key];
          return (
            <Link
              key={key}
              href={`/company/${slug}/${key}`}
              className="flex items-center gap-3.5 rounded-[18px] border border-border bg-surface p-[15px_16px] shadow-card transition-colors hover:bg-surface-tint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
            >
              <div className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-[9px] bg-surface-tint text-ink-mute">
                <IconArrowRight size={15} stroke={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13.5px] font-semibold text-ink">
                    {meta.name}
                  </span>
                  <span
                    className={`rounded-[5px] px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wide ${
                      meta.tag === "optional"
                        ? "bg-surface-tint text-ink-mute"
                        : "bg-indigo-tint text-indigo-deep"
                    }`}
                  >
                    {meta.tag}
                  </span>
                </div>
                <p className="mt-0.5 text-[12px] leading-[1.4] text-ink-mute">
                  {meta.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
