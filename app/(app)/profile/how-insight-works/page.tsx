import {
  IconBuilding,
  IconArrowsRightLeft,
  IconNotebook,
} from "@tabler/icons-react";
import { SavedLensesPreview } from "@/components/profile/savedLensesPreview";
import { AppBackButton } from "@/components/app-shell/app-back-button";

export default function HowInsightWorksPage() {
  return (
    <div className="px-5 pt-5 pb-10">
      <AppBackButton fallbackHref="/profile" className="mb-5 flex h-9 w-9 items-center justify-center rounded-[11px] border border-border bg-surface text-ink-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo" />

      <h1 className="mb-5 font-serif text-2xl font-medium tracking-tight">
        How Insight works.
      </h1>

      <div className="mb-6">
        <h2 className="mb-1.5 flex items-center gap-2 font-serif text-[19px] font-medium tracking-[-0.01em] text-ink">
          <IconBuilding size={19} stroke={1.75} className="text-indigo-deep" />
          Understand businesses
        </h2>
        <p className="text-[13.5px] leading-[1.6] text-ink-soft">
          We break financial reports into plain language so you can understand
          how a company makes money and whether the business is improving.
        </p>
      </div>

      <div className="mb-6">
        <div className="mb-1.5 flex items-center gap-2.5">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[9px] bg-indigo-tint text-indigo-deep">
            <IconArrowsRightLeft size={16} stroke={1.75} />
          </div>
          <h2 className="text-[14.5px] font-semibold text-ink">
            Compare evidence
          </h2>
        </div>
        <p className="pl-[42px] text-[13px] leading-[1.55] text-ink-soft">
          Instead of showing a number in isolation, we help you compare it with
          competitors and understand what it may indicate.
        </p>
      </div>

      <div className="mb-6 rounded-lg border border-border bg-surface p-[18px] shadow-card">
        <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-[10px] bg-indigo-tint text-indigo-deep">
          <IconNotebook size={17} stroke={1.75} />
        </div>
        <h2 className="mb-1 text-[14.5px] font-semibold text-ink">
          Record your thinking
        </h2>
        <p className="text-[13px] leading-[1.55] text-ink-soft">
          Watchlists, portfolios, and your Decision Journal remember your own
          investment journey.
        </p>

        <SavedLensesPreview />
      </div>

      <div className="mb-6">
        <h2 className="mb-2 font-serif text-[20px] font-medium leading-[1.3] tracking-[-0.01em] text-ink">
          Your decisions stay yours.
        </h2>
        <p className="text-[13.5px] leading-[1.6] text-ink-soft">
          No recommendations, no ratings, and no &quot;Strong Buy&quot; badges.
          We show the evidence so you can reach your own conclusion.
        </p>
      </div>

      <div className="mb-[18px] mt-6 border-t border-border pt-5">
        <h2 className="mb-2 font-serif text-[15px] font-medium tracking-[-0.01em] text-ink">
          Why we built this
        </h2>
        <p className="text-[12.5px] leading-[1.6] text-ink-soft">
          Many investing apps assume you already know how to evaluate a
          business, or rely heavily on analyst opinions. Insight was built to
          help people develop the confidence to make informed investment
          decisions using evidence they can understand.
        </p>
      </div>

      <div className="rounded-[12px] bg-surface-tint p-[14px_16px]">
        <p className="text-[12px] leading-[1.5] text-ink-soft">
          Insight doesn&apos;t execute trades. Anything you buy or sell happens
          through your own broker — we help you decide, not transact.
        </p>
      </div>
    </div>
  );
}
