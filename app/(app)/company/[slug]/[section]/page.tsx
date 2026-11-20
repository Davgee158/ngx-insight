import { AppBackButton } from "@/components/app-shell/app-back-button";
import { getCompanyAnalysis } from "@/lib/company/company-analysis";
import { SECTION_LIST_META } from "@/lib/company/types";
import { SECTION_ORDER, type Section } from "@/lib/home/types";
import { SectionReviewTracker } from "@/components/company/sectionReviewTracker";

export default async function SectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string; section: string }>;
}) {
  const { slug, section } = await params;
  const company = await getCompanyAnalysis(slug);

  const isCoreSection = (SECTION_ORDER as string[]).includes(section);
  const sectionKey = isCoreSection ? (section as Section) : null;
  const meta = sectionKey ? SECTION_LIST_META[sectionKey] : null;
  const detail = sectionKey ? company?.sectionDetails?.[sectionKey] : null;

  return (
    <div className="px-5 pt-10 pb-10">
      <div className="mb-6 flex items-center gap-3">
        <AppBackButton fallbackHref={`/company/${slug}`} />
        {company && meta && (
          <div className="min-w-0 flex-1">
            <p className="font-serif text-[16px] font-medium tracking-[-0.01em] text-ink">
              {meta.name}
            </p>
            <p className="text-[11.5px] text-ink-mute">{company.name}</p>
          </div>
        )}
      </div>

      {!company || !meta || !detail || !sectionKey ? (
        <div>
          <h1 className="mb-2 font-serif text-2xl font-medium tracking-tight">
            Not built yet.
          </h1>
          <p className="text-[13px] leading-[1.55] text-ink-soft">
            This section&apos;s detail view doesn&apos;t exist yet — check
            back once it&apos;s ready.
          </p>
        </div>
      ) : (
        <div>
          <SectionReviewTracker
            companyId={company.companyId}
            ticker={company.ticker}
            name={company.name}
            sector={company.sector}
            section={sectionKey}
          />
          <p className="mb-5 font-serif text-[18px] font-medium leading-[1.35] tracking-[-0.01em] text-ink">
            {detail.question}
          </p>

          {Object.entries(
            detail.metrics.reduce<Record<string, typeof detail.metrics>>(
              (groups, metric) => {
                const category = metric.category ?? "Reported metrics";
                (groups[category] ??= []).push(metric);
                return groups;
              },
              {},
            ),
          ).map(([category, metrics]) => (
            <section key={category} className="mb-5">
              <h2 className="mb-2 font-serif text-[15px] font-medium text-ink">
                {category}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="flex flex-col gap-1 rounded-[16px] border border-border bg-surface p-4"
                  >
                    <p className="text-[10px] font-medium uppercase tracking-wide text-ink-mute">
                      {metric.label}
                    </p>
                    {metric.history?.length ? (
                      <div className="mt-1 divide-y divide-border">
                        {metric.history.map((point, index) => {
                          return (
                            <div
                              key={`${point.period}-${index}`}
                              className="flex flex-col gap-1 py-2 first:pt-1"
                            >
                              <div className="flex items-baseline justify-between gap-2">
                                <span className="text-[11px] text-ink-mute">
                                  {point.period}
                                </span>
                                <span className="text-right font-mono text-[12px] font-medium text-ink">
                                  {point.value ?? "—"}
                                </span>
                              </div>
                              {point.evidence && (
                                <details className="pt-1 text-[10.5px] leading-[1.45] text-ink-mute">
                                  <summary className="cursor-pointer font-medium text-indigo-deep">
                                    Source and basis
                                  </summary>
                                  <div className="mt-2 space-y-1.5">
                                    <p>
                                      Period: {point.evidence.period} · Unit: {point.evidence.unit}
                                      {point.evidence.observationDate
                                        ? ` · Observed ${point.evidence.observationDate}`
                                        : ""}
                                    </p>
                                    <p>
                                      Reported as: {point.evidence.sourceLabel}
                                      {point.evidence.sourceValue !== null &&
                                      point.evidence.sourceUnit
                                        ? ` (${point.evidence.sourceValue} ${point.evidence.sourceUnit})`
                                        : ""}
                                    </p>
                                    <p>
                                      Source: {point.evidence.sourceName} · Verification: {point.evidence.verificationStatus}
                                    </p>
                                    {point.evidence.basis && <p>Basis: {point.evidence.basis}</p>}
                                    {point.evidence.sourceLocator && (
                                      <p className="break-all">
                                        Locator: {point.evidence.sourceLocator}
                                        {/^https?:\/\//.test(point.evidence.sourceLocator) && (
                                          <a
                                            href={point.evidence.sourceLocator.match(/^https?:\/\/[^\s|]+/)?.[0]?.replace(/[;,)]$/, "")}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="ml-1 font-medium text-indigo-deep underline"
                                          >
                                            Open source
                                          </a>
                                        )}
                                      </p>
                                    )}
                                  </div>
                                </details>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="font-serif text-[20px] font-medium tracking-[-0.01em] text-ink">
                        {metric.value}
                      </p>
                    )}
                    {metric.comparisonLabel && (
                      <span
                        className={`mt-0.5 inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          metric.qualifier === "unfavorable"
                            ? "bg-red-tint text-red"
                            : "bg-green-tint text-green-deep"
                        }`}
                      >
                        {metric.comparisonLabel}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}

          <div className="mb-4 rounded-[16px] bg-surface-tint p-4">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-ink-mute">
              What this means
            </p>
            <p className="text-[13px] leading-[1.55] text-ink-soft">
              {detail.insight}
            </p>
          </div>

          {detail.note && (
            <div className="border-t border-dashed border-border pt-3">
              <p className="text-[12.5px] leading-[1.5] text-ink-soft">
                <span className="font-semibold text-ink">
                  {detail.note.label}:
                </span>{" "}
                {detail.note.text}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
