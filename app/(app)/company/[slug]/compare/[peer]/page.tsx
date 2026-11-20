import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { getCompanyAnalysis } from "@/lib/company/company-analysis";
import type { PeerEvidenceReference } from "@/lib/company/types";
import { AppBackButton } from "@/components/app-shell/app-back-button";

function sourceUrl(locator: string): string {
  return locator.split(" | ")[0].trim();
}

function EvidenceNote({ evidence }: { evidence: PeerEvidenceReference }) {
  return (
    <div className="mt-1.5 text-left text-[10px] leading-[1.45] text-ink-mute">
      <a
        href={sourceUrl(evidence.sourceLocator)}
        target="_blank"
        rel="noreferrer"
        className="underline decoration-border underline-offset-2"
      >
        {evidence.sourceName}
      </a>
      <div>{evidence.sourceLabel}</div>
      {(evidence.statementScope || evidence.basis) && (
        <div>{[evidence.statementScope, evidence.basis].filter(Boolean).join(" · ")}</div>
      )}
      <div>
        {evidence.verificationStatus === "primary_source_checked"
          ? "Primary source checked"
          : evidence.verificationStatus === "independently_reconciled"
            ? "Independently reconciled"
            : "Verification not assessed"}
      </div>
    </div>
  );
}

export default async function PeerComparisonPage({
  params,
}: {
  params: Promise<{ slug: string; peer: string }>;
}) {
  const { slug, peer } = await params;
  const company = await getCompanyAnalysis(slug);
  const peerData = company?.comparePeers?.find(
    (candidate) => candidate.slug === peer.toLowerCase(),
  );

  return (
    <div className="px-5 pt-10 pb-10">
      <div className="mb-6">
        <AppBackButton
          fallbackHref={`/company/${slug}`}
          label="Back to company analysis"
        />
      </div>

      {!company || !peerData ? (
        <div>
          <h1 className="mb-2 font-serif text-2xl font-medium tracking-tight">
            Not enough comparable evidence yet.
          </h1>
          <p className="text-[13px] leading-[1.55] text-ink-soft">
            A comparison appears when both issuers have sourced observations with matching periods, units, reporting scopes, labels, and bases.
          </p>
        </div>
      ) : (
        <div>
          <div className="mb-5">
            <div className="mb-1 flex flex-wrap items-center gap-3">
              <span className="font-serif text-[17px] font-medium text-ink">
                {company.name}
              </span>
              <span className="text-[12px] font-medium text-ink-mute">vs</span>
              <span className="font-serif text-[17px] font-medium text-ink">
                {peerData.name}
              </span>
            </div>
            <p className="mt-2 text-[13px] leading-[1.5] text-ink-soft">
              These published values share a compatible metric label, period, unit, scope, and basis. The comparison does not rank either issuer.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-border py-2 pr-2 text-left text-[10.5px] font-medium text-ink-mute">Metric</th>
                  <th className="border-b border-border px-2 py-2 text-left text-[10.5px] font-medium text-ink-mute">Period</th>
                  <th className="border-b border-border px-2 py-2 text-left text-[10.5px] font-medium text-ink-mute">{company.displaySymbol ?? company.ticker}</th>
                  <th className="border-b border-border px-2 py-2 text-left text-[10.5px] font-medium text-ink-mute">{peerData.ticker}</th>
                </tr>
              </thead>
              <tbody>
                {peerData.comparisonBreakdown.map((row) => (
                  <tr key={`${row.metric}-${row.period}`}>
                    <td className="border-b border-surface-tint py-2.5 pr-2 align-top text-[12px] text-ink-soft">{row.metric}</td>
                    <td className="border-b border-surface-tint px-2 py-2.5 align-top text-[11px] text-ink-mute">{row.period}</td>
                    <td className="border-b border-surface-tint px-2 py-2.5 align-top font-mono text-[13px] text-ink">
                      {row.companyValue}
                      <EvidenceNote evidence={row.companyEvidence} />
                    </td>
                    <td className="border-b border-surface-tint px-2 py-2.5 align-top font-mono text-[13px] text-ink">
                      {row.peerValue}
                      <EvidenceNote evidence={row.peerEvidence} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Link
            href={`/company/${peerData.slug}`}
            className="mt-5 flex items-center justify-center gap-1.5 rounded-sm border border-border p-[13px] text-[13px] font-medium text-indigo-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
          >
            See {peerData.name}&apos;s full analysis
            <IconArrowRight size={14} stroke={1.75} />
          </Link>
        </div>
      )}
    </div>
  );
}
