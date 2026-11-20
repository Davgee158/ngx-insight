"use client";

import { useState } from "react";
import Link from "next/link";
import { IconSearch } from "@tabler/icons-react";
import type { DiscoverCompany } from "@/lib/discover/companies";

export default function SearchBar({
  companies,
}: {
  companies: DiscoverCompany[];
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
  const filteredCompanies = companies.filter((company) => {
    return (
      company.name.toLocaleLowerCase().includes(normalizedQuery) ||
      company.ngxSymbol.toLocaleLowerCase().includes(normalizedQuery)
    );
  });

  return (
    <div className="mt-3">
      <div className="flex items-center gap-2.5 rounded-[14px] border border-border bg-surface px-3 py-2.5 shadow-card">
        <IconSearch size={16} className="text-ink-mute" stroke={1.75} />
        <input
          type="search"
          aria-label="Search companies by name or NGX ticker"
          placeholder="Search companies — e.g. GTCO or Zenith"
          className="flex-1 bg-transparent text-[13.5px] text-ink placeholder:text-ink-mute outline-none"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </div>

      {normalizedQuery.length > 0 && (
        <div className="mt-2 overflow-hidden rounded-[14px] border border-border bg-surface shadow-card">
          {filteredCompanies.length > 0 ? (
            <ul className="max-h-72 divide-y divide-border overflow-y-auto">
              {filteredCompanies.map((company) => (
                <li key={company.companyId}>
                  <Link
                    href={`/company/${company.slug}`}
                    className="flex items-center justify-between gap-3 px-3.5 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo hover:bg-surface-tint"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-medium text-ink">
                        {company.name}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-ink-mute">
                        {company.ngxSymbol}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3.5 py-3 text-[12.5px] text-ink-mute">
              No companies found. Try another name or ticker.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
