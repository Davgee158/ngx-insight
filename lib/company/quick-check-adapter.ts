import type { StoredMarketObservation } from "@/lib/data-import/observation-repository";
import type {
  QuickCheckBreakdown,
  QuickCheckCriterion,
  QuickCheckEvidence,
  QuickCheckItem,
} from "./types";
import { formatCompanyValue } from "./format-value";

type QuickCheckResult = {
  items: QuickCheckItem[];
  breakdown: QuickCheckBreakdown;
};

function latestEligibleAnnualObservation(
  observations: StoredMarketObservation[],
  metricKey: string,
): StoredMarketObservation | undefined {
  return observations
    .filter(
      (observation) =>
        observation.metric_key === metricKey &&
        observation.period_kind === "FY" &&
        observation.status === "available" &&
        observation.value !== null &&
        observation.source_name !== null &&
        observation.source_label !== null &&
        observation.source_locator !== null &&
        observation.verification_status !== "not_assessed",
    )
    .sort((left, right) => {
      const leftPeriod = left.period_end ?? left.target_period ?? "";
      const rightPeriod = right.period_end ?? right.target_period ?? "";
      if (leftPeriod !== rightPeriod) return rightPeriod.localeCompare(leftPeriod);
      return (right.retrieved_at ?? "").localeCompare(left.retrieved_at ?? "");
    })[0];
}

function toEvidence(
  observation: StoredMarketObservation,
): QuickCheckEvidence {
  return {
    period:
      observation.target_period ??
      (observation.period_end
        ? `FY${observation.period_end.slice(0, 4)}`
        : "Fiscal year not stated"),
    value:
      observation.value === null
        ? ""
        : formatCompanyValue(observation.value, observation.unit),
    unit: observation.unit,
    sourceValue: observation.source_value,
    sourceUnit: observation.source_unit,
    sourceLabel: observation.source_label ?? "",
    sourceName: observation.source_name ?? "",
    sourceLocator: observation.source_locator ?? "",
    basis: observation.basis,
    verificationStatus: observation.verification_status,
  };
}

function netIncomeCriterion(
  observation: StoredMarketObservation | undefined,
): QuickCheckCriterion {
  if (!observation || observation.value === null) {
    return {
      text: "Insufficient published information to assess annual net income.",
      met: false,
      status: "insufficient",
    };
  }

  const value = Number(observation.value);
  const period =
    observation.target_period ??
    (observation.period_end
      ? `FY${observation.period_end.slice(0, 4)}`
      : "the latest reported year");
  if (!Number.isFinite(value) || value === 0) {
    return {
      text: value === 0
        ? `Net income was zero in ${period}; this check does not classify zero as positive or negative.`
        : `Net income for ${period} could not be evaluated as a numeric value.`,
      met: false,
      status: "insufficient",
      evidence: toEvidence(observation),
    };
  }

  const positive = value > 0;
  return {
    text: positive
      ? `Reported net income was positive in ${period}.`
      : `Reported net income was negative in ${period}.`,
    met: positive,
    status: positive ? "met" : "watch",
    evidence: toEvidence(observation),
  };
}

function statedMinimum(basis: string | null): number | undefined {
  if (!basis) return undefined;
  const match = basis.match(/minimum[^\d]{0,40}(\d+(?:\.\d+)?)\s*%/i);
  if (!match) return undefined;
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : undefined;
}

function capitalAdequacyCriterion(
  observation: StoredMarketObservation | undefined,
): QuickCheckCriterion {
  if (!observation || observation.value === null) {
    return {
      text: "Insufficient published information to assess capital adequacy against a stated minimum.",
      met: false,
      status: "insufficient",
    };
  }

  const minimum = statedMinimum(observation.basis);
  const period =
    observation.target_period ??
    (observation.period_end
      ? `FY${observation.period_end.slice(0, 4)}`
      : "the latest reported year");
  const value = Number(observation.value);
  const evidence = toEvidence(observation);

  if (minimum === undefined || !Number.isFinite(value)) {
    return {
      text: `Capital adequacy was reported for ${period}, but the source basis does not state a usable minimum for comparison.`,
      met: false,
      status: "insufficient",
      evidence,
    };
  }

  const meetsMinimum = value >= minimum;
  return {
    text: meetsMinimum
      ? `The reported capital-adequacy ratio for ${period} meets the ${minimum}% minimum stated in the source. This is not a broader safety assessment.`
      : `The reported capital-adequacy ratio for ${period} is below the ${minimum}% minimum stated in the source.`,
    met: meetsMinimum,
    status: meetsMinimum ? "met" : "watch",
    evidence,
  };
}

function resultKind(status: NonNullable<QuickCheckCriterion["status"]>) {
  if (status === "met") return "strength" as const;
  if (status === "watch") return "watch" as const;
  return "insufficient" as const;
}

export function buildQuickCheck(
  observations: StoredMarketObservation[],
): QuickCheckResult {
  const netIncome = netIncomeCriterion(
    latestEligibleAnnualObservation(observations, "net_income"),
  );
  const capitalAdequacy = capitalAdequacyCriterion(
    latestEligibleAnnualObservation(observations, "capital_adequacy_ratio"),
  );
  const criteria = [netIncome, capitalAdequacy];

  return {
    items: criteria.map((criterion, index) => ({
      kind: resultKind(criterion.status ?? "insufficient"),
      category: index === 0 ? "Profitability" : "Capital strength",
      text: criterion.text,
    })),
    breakdown: {
      groups: [
        { title: "Profitability", criteria: [netIncome] },
        { title: "Capital strength", criteria: [capitalAdequacy] },
      ],
      disclaimer:
        "Quick Check reports only these source-backed checks. It is not a full assessment, rating, or investment recommendation. A missing result means the available evidence was not enough to evaluate that check.",
    },
  };
}
