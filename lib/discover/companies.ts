import { COMPANY_ROUTE_CONFIGS } from "@/lib/company/company-config";
import { getCompanyIdentities } from "@/lib/data-import/observation-repository";

export type DiscoverCompany = {
  companyId: string;
  name: string;
  slug: string;
  ngxSymbol: string;
  appStateKey: string;
  category: "Banking" | "Mortgage Banking";
};

/**
 * Returns the approved issuer universe with canonical names from the database
 * and routing/provider metadata from the application's approved crosswalk.
 */
export async function getDiscoverCompanies(): Promise<DiscoverCompany[]> {
  const identities = await getCompanyIdentities(
    COMPANY_ROUTE_CONFIGS.map(({ companyId }) => companyId),
  );
  const identityById = new Map(
    identities.map((identity) => [identity.company_id, identity]),
  );

  return COMPANY_ROUTE_CONFIGS.map((config) => {
    const identity = identityById.get(config.companyId);
    if (!identity) {
      throw new Error(
        `Discover company identity is missing for ${config.companyId}.`,
      );
    }

    return {
      companyId: identity.company_id,
      name: identity.company_name,
      slug: config.slug,
      ngxSymbol: config.ngxSymbol,
      appStateKey: config.appStateKey.toLowerCase(),
      category: config.sector,
    };
  });
}
