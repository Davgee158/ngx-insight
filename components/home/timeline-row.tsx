import type { ReactNode } from "react";

interface TimelineRowProps {
  dotState: "active" | "pending";
  line?: "solid" | "fade" | "none";
  isLast?: boolean;
  children: ReactNode;
}

export function TimelineRow({
  dotState,
  line = "solid",
  isLast = false,
  children,
}: TimelineRowProps) {
  return (
    <div className="flex gap-3.5">
      <div className="flex w-4 flex-shrink-0 flex-col items-center">
        <span
          className={`mt-1.5 h-[9px] w-[9px] flex-shrink-0 rounded-full ${
            dotState === "active"
              ? "bg-indigo"
              : "border-[1.5px] border-border bg-surface"
          }`}
        />
        {line !== "none" && (
          <span
            className={`mt-1 w-px flex-1 ${
              line === "fade"
                ? "bg-gradient-to-b from-border to-transparent"
                : "bg-border"
            }`}
          />
        )}
      </div>
      <div className={`min-w-0 flex-1 ${isLast ? "" : "pb-6"}`}>{children}</div>
    </div>
  );
}
