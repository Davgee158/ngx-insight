import {
  IconChevronDown,
  IconRoute,
  IconShieldCheck,
  IconSparkles,
} from "@tabler/icons-react";
import { getHomeViewModel, type HomeState } from "@/lib/home/view-model";
import { SECTION_LABEL } from "@/lib/home/types";
import { GreetingHeader } from "@/components/home/greeting-header";
import { DecisionCard } from "@/components/home/decision-card";
import { WelcomeChips } from "@/components/home/welcome-chips";
import { LearnInline } from "@/components/home/learn-inline";
import { UpdateRow } from "@/components/home/update-row";
import { PortfolioContextRow } from "@/components/home/portfolio-context-row";
import { Timeline } from "@/components/home/timeline";
import { TimelineRow } from "@/components/home/timeline-row";
import { VisitCard } from "@/components/home/visit-card";
import { OpportunityRail } from "@/components/home/opportunity-rail";

const VALID_STATES: HomeState[] = ["discovery", "researching", "stewardship"];

function parseState(raw: string | string[] | undefined): HomeState | undefined {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return VALID_STATES.includes(value as HomeState) ? (value as HomeState) : undefined;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string | string[] }>;
}) {
  const { state: rawState } = await searchParams;
  const viewModel = getHomeViewModel(parseState(rawState));

  const glowClass =
    viewModel.kind === "stewardship"
      ? "bg-[radial-gradient(circle_at_50%_0%,var(--color-green-glow),transparent_55%)]"
      : "bg-[radial-gradient(circle_at_50%_0%,var(--color-indigo-glow),transparent_55%)]";

  return (
    <div className={`px-5 pt-16 ${glowClass}`}>
      {viewModel.kind === "discovery" && (
        <>
          <GreetingHeader
            greeting={`Welcome, ${viewModel.user.name}`}
            subline="Let's find a company worth understanding."
            initials={viewModel.user.initials}
          />
          <DecisionCard
            icon={IconSparkles}
            kicker="Where curiosity begins"
            title="Let's find your first company."
            copy="Pick a sector you're curious about, and we'll walk you through understanding the business before you invest."
            timeTag="~8 min"
            ctaLabel="Start exploring"
          >
            <WelcomeChips sectors={viewModel.sectors} />
          </DecisionCard>

          <div className="my-5 flex justify-center text-ink-mute">
            <IconChevronDown size={16} />
          </div>

          <LearnInline
            kicker="3-min read"
            title="How to read a company's fair value"
          />
        </>
      )}

      {viewModel.kind === "researching" && (
        <>
          <GreetingHeader
            greeting={`Good morning, ${viewModel.user.name}`}
            subline="Every confident investment begins with understanding the business."
            initials={viewModel.user.initials}
            hasNotification
          />
          <Timeline>
            <TimelineRow dotState="active">
              <DecisionCard
                icon={IconRoute}
                kicker="Picking up where you left off"
                title={`Should ${viewModel.entry.ticker} be in your portfolio?`}
                copy={
                  <>
                    You&apos;ve reviewed {viewModel.reviewedLabel} —{" "}
                    <b>{SECTION_LABEL[viewModel.nextSection]}</b> is the last core
                    section.
                  </>
                }
                timeTag="6 min left"
                ctaLabel="Continue"
              >
                <UpdateRow
                  text={
                    <>
                      New earnings released Tuesday —{" "}
                      <b>worth weighing before you decide.</b>
                    </>
                  }
                />
              </DecisionCard>
            </TimelineRow>
            <TimelineRow dotState="pending" line="none" isLast>
              <OpportunityRail
                heading="Looking for another opportunity?"
                subheading={viewModel.opportunitiesSubheading}
                opportunities={viewModel.opportunities}
              />
            </TimelineRow>
          </Timeline>
        </>
      )}

      {viewModel.kind === "stewardship" && (
        <>
          <GreetingHeader
            greeting={`Good morning, ${viewModel.user.name}`}
            subline="Here's what's worth a look today."
            initials={viewModel.user.initials}
            hasNotification
          />
          <Timeline>
            <TimelineRow dotState="active">
              <DecisionCard
                icon={IconShieldCheck}
                kicker="Checking in"
                title={`Time to check in on ${viewModel.primaryEvent.ticker}.`}
                copy={viewModel.primaryEvent.headline}
                timeTag="3 min"
                ctaLabel="Check in"
              >
                <PortfolioContextRow
                  trendLabel={viewModel.portfolioSummary.trendLabel}
                  sparkline={viewModel.portfolioSummary.sparkline}
                />
              </DecisionCard>
            </TimelineRow>
            <TimelineRow dotState="active">
              <p className="mb-2.5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-ink-mute after:h-px after:flex-1 after:bg-gradient-to-r after:from-border after:to-transparent">
                Also happening today
              </p>
              <VisitCard events={viewModel.secondaryEvents} />
            </TimelineRow>
            <TimelineRow dotState="pending" line="fade" isLast>
              <OpportunityRail
                heading={viewModel.opportunitiesHeading}
                subheading={viewModel.opportunitiesSubheading}
                opportunities={viewModel.opportunities}
              />
            </TimelineRow>
          </Timeline>
        </>
      )}
    </div>
  );
}
