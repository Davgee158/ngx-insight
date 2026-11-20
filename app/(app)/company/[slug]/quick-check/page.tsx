import {
  IconAlertTriangle,
  IconCheck,
  IconMinus,
} from "@tabler/icons-react";
import { getCompanyAnalysis } from "@/lib/company/company-analysis";
import { AppBackButton } from "@/components/app-shell/app-back-button";

export default async function QuickCheckBreakdownPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = await getCompanyAnalysis(slug);
  const breakdown = company?.quickCheckBreakdown;

  return (
    <div className="px-5 pt-10 pb-10">
      <div className="mb-6 flex items-center gap-3">
        <AppBackButton fallbackHref={`/company/${slug}`} />
        {company && (
          <div className="min-w-0 flex-1">
            <p className="font-serif text-[16px] font-medium tracking-[-0.01em] text-ink">
              Quick Check
            </p>
            <p className="text-[11.5px] text-ink-mute">{company.name}</p>
          </div>
        )}
      </div>

      {!company ? (
        <div>
          <h1 className="mb-2 font-serif text-2xl font-medium tracking-tight">
            Not built yet.
          </h1>
          <p className="text-[13px] leading-[1.55] text-ink-soft">
            This breakdown doesn&apos;t exist yet — check back once it&apos;s
            ready.
          </p>
        </div>
      ) : !breakdown ? (
        <div>
          <h1 className="mb-2 font-serif text-2xl font-medium tracking-tight">
            Not enough evidence yet.
          </h1>
          <p className="text-[13px] leading-[1.55] text-ink-soft">
            A Quick Check will appear when the published observations support a source-based assessment.
          </p>
        </div>
      ) : (
        <div>
          <h1 className="mb-1.5 font-serif text-[22px] font-medium leading-[1.25] tracking-[-0.015em] text-ink">
            A fast look at the fundamentals.
          </h1>
          <p className="mb-5 text-[12.5px] leading-[1.5] text-ink-soft">
            This is a summary of evidence, not a recommendation.
          </p>

          <div>
            {breakdown.groups.map((group) => (
              <div key={group.title} className="mb-4">
                <p className="mb-2 text-[12.5px] font-semibold text-ink">
                  {group.title}
                </p>
                <div>
                  {group.criteria.map((criterion) => {
                    const status = criterion.status ?? (criterion.met ? "met" : "watch");
                    const icon = status === "met" ? (
                      <IconCheck size={11} stroke={2.25} />
                    ) : status === "watch" ? (
                      <IconAlertTriangle size={11} stroke={2.25} />
                    ) : (
                      <IconMinus size={11} stroke={2.25} />
                    );
                    const iconClasses = status === "met"
                      ? "bg-green-tint text-green-deep"
                      : status === "watch"
                        ? "bg-amber-tint text-amber-deep"
                        : "bg-surface-tint text-ink-mute";

                    return (
                      <div key={criterion.text}>
                        <div className="-mx-1.5 flex items-center gap-2.5 rounded-sm px-1.5 py-2.5">
                          <div
                            className={`flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-[5px] ${iconClasses}`}
                          >
                            {icon}
                          </div>
                          <span className="flex-1 text-[13px] text-ink-soft">
                            {criterion.text}
                          </span>
                          <span className="flex-shrink-0 text-[9px] font-semibold uppercase tracking-wide text-ink-mute">
                            {status === "met" ? "Evidence supports" : status === "watch" ? "Watch" : "Insufficient"}
                          </span>
                          {criterion.checkDetail && (
                            <span className="flex-shrink-0 text-[9px] font-semibold uppercase tracking-wide text-ink-mute">
                              Check
                            </span>
                          )}
                        </div>
                        {criterion.checkDetail && (
                          <p className="mx-1.5 mb-2 rounded-sm bg-surface-tint p-3 text-[12px] leading-[1.5] text-ink-soft">
                            <span className="font-semibold text-ink">
                              What we checked:
                            </span>{" "}
                            {criterion.checkDetail}
                          </p>
                        )}
                        {criterion.evidence && (
                          <details className="mx-1.5 mb-2 rounded-sm border border-border p-3 text-[11px] leading-[1.5] text-ink-mute">
                            <summary className="cursor-pointer font-medium text-indigo-deep">
                              Source evidence
                            </summary>
                            <div className="mt-2 space-y-1">
                              <p>Period: {criterion.evidence.period}</p>
                              <p>Reported as: {criterion.evidence.sourceLabel}</p>
                              <p>Value: {criterion.evidence.value}</p>
                              {criterion.evidence.sourceValue !== null && (
                                <p>
                                  Published as: {criterion.evidence.sourceValue}{" "}
                                  {criterion.evidence.sourceUnit}
                                </p>
                              )}
                              <p>Source: {criterion.evidence.sourceName}</p>
                              <p>Verification: {criterion.evidence.verificationStatus}</p>
                              {criterion.evidence.basis && <p>Basis: {criterion.evidence.basis}</p>}
                              <a
                                href={criterion.evidence.sourceLocator.match(/^https?:\/\/[^\s|]+/)?.[0]?.replace(/[;,)]$/, "")}
                                target="_blank"
                                rel="noreferrer"
                                className="font-medium text-indigo-deep underline"
                              >
                                Open source
                              </a>
                            </div>
                          </details>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-2 border-t border-border pt-4 text-[11.5px] leading-[1.55] text-ink-mute">
            {breakdown.disclaimer}
          </p>
        </div>
      )}
    </div>
  );
}
