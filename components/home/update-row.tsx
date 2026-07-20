import type { ReactNode } from "react";
import { IconCheck } from "@tabler/icons-react";

interface UpdateRowProps {
  text: ReactNode;
}

export function UpdateRow({ text }: UpdateRowProps) {
  return (
    <div className="mt-4 flex items-center gap-2.5 border-t border-border pt-4">
      <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-green-tint text-green-deep">
        <IconCheck size={12} stroke={2.5} />
      </div>
      <div className="text-[13px] leading-snug text-ink-soft [&_b]:font-medium [&_b]:text-ink">
        {text}
      </div>
    </div>
  );
}
