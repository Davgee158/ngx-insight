import {
  IconInfoCircle,
  IconBookmark,
} from "@tabler/icons-react";
import { PROFILE_DISPLAY_NAME } from "@/lib/profile/account";
import { AccountCard } from "@/components/profile/accountCard";
import { PromiseCard } from "@/components/profile/promiseCard";
import { SettingsGroup } from "@/components/profile/settingsGroup";
import { SavedLensesCountLabel } from "@/components/profile/savedLensesCountLabel";

export default function ProfilePage() {
  return (
    <div className="px-5 pt-10 pb-8">
      <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-ink-mute">
        Profile
      </p>
      <h1 className="mb-5 font-serif text-2xl font-medium tracking-tight">
        Your research.
      </h1>

      <AccountCard name={PROFILE_DISPLAY_NAME} />

      <PromiseCard />

      <SettingsGroup
        title="About"
        items={[
          {
            icon: IconInfoCircle,
            label: "How Insight works",
            accent: true,
            href: "/profile/how-insight-works",
          },
          {
            icon: IconBookmark,
            label: "Saved lenses",
            value: <SavedLensesCountLabel />,
            accent: true,
            href: "/profile/saved-lenses",
          },
        ]}
      />

      <p className="mt-4 text-center text-[11px] text-ink-mute">
        Insight v1.0.0
      </p>
    </div>
  );
}
