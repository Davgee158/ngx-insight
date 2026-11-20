import { getCompanyAnalysis } from "@/lib/company/company-analysis";
import { getSectors } from "@/lib/discover/sectors";
import { getDiscoverCompanies } from "@/lib/discover/companies";
import { CompanyHeader } from "@/components/company/companyHeader";
import { CompanyHubResolver } from "@/components/company/companyHubResolver";

export default async function CompanyAnalysisPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [company, sectors, discoverCompanies] = await Promise.all([
    getCompanyAnalysis(slug),
    getSectors(),
    getDiscoverCompanies(),
  ]);

  if (!company) {
    return (
      <div className="px-5 pt-10 pb-10">
        <CompanyHeader company={null} />
        <div>
          <h1 className="mb-2 font-serif text-2xl font-medium tracking-tight">
            Not built yet.
          </h1>
          <p className="text-[13px] leading-[1.55] text-ink-soft">
            This company&apos;s analysis page doesn&apos;t exist yet — check
            back once it&apos;s ready.
          </p>
        </div>
      </div>
    );
  }

  const sectorsWithDatabaseCounts = sectors.map((sector) => ({
    ...sector,
    count: discoverCompanies.filter(
      (discoverCompany) => discoverCompany.category === sector.name,
    ).length,
  }));

  return (
    <CompanyHubResolver
      slug={slug}
      staticCompany={company}
      sectors={sectorsWithDatabaseCounts}
    />
  );
}
