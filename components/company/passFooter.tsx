import { PassSheet } from "@/components/company/passSheet";

export function PassFooter({
  companyName,
  showPassAction,
  showPassStatus,
  passedAt,
}: {
  companyName: string;
  showPassAction: boolean;
  showPassStatus: boolean;
  passedAt?: string;
}) {
  if (showPassAction) {
    return (
      <div className="mt-7 border-t border-border pt-6">
        <PassSheet companyName={companyName} />
      </div>
    );
  }

  if (showPassStatus) {
    return (
      <div className="mt-7 border-t border-border pt-6 text-center">
        <p className="text-[13px] text-ink-soft">
          Passed {passedAt} —{" "}
          <span className="font-medium text-indigo-deep">
            update reasoning
          </span>
        </p>
      </div>
    );
  }

  return null;
}
