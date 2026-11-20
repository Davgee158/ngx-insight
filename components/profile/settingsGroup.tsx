import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";

export interface SettingItem {
  icon: ComponentType<{ size?: number; stroke?: number; className?: string }>;
  label: string;
  value?: ReactNode;
  accent?: boolean;
  href?: string;
}

function SettingIcon({
  icon: Icon,
  accent,
}: {
  icon: SettingItem["icon"];
  accent?: boolean;
}) {
  return (
    <div
      className={`flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-[8px] ${
        accent ? "bg-indigo-tint text-indigo-deep" : "bg-surface-tint text-ink-soft"
      }`}
    >
      <Icon size={15} stroke={1.75} />
    </div>
  );
}

function SettingLabel({ item }: { item: SettingItem }) {
  return (
    <div className="min-w-0 flex-1">
      <p className="text-[13.5px] font-medium text-ink">{item.label}</p>
      {item.value && (
        <p className="mt-0.5 text-[11.5px] text-ink-mute">{item.value}</p>
      )}
    </div>
  );
}

export function SettingsGroup({
  title,
  items,
}: {
  title: string;
  items: SettingItem[];
}) {
  return (
    <div className="mb-5">
      <h2 className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-ink-mute">
        {title}
      </h2>
      <div className="divide-y divide-border overflow-hidden rounded-lg border border-border shadow-card">
        {items.map((item) =>
          item.href ? (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3.5 bg-surface p-[14px_16px] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo"
            >
              <SettingIcon icon={item.icon} accent={item.accent} />
              <SettingLabel item={item} />
              <IconChevronRight
                size={16}
                stroke={1.75}
                className="flex-shrink-0 text-ink-mute"
              />
            </Link>
          ) : (
            <div
              key={item.label}
              className="flex items-center gap-3.5 bg-surface p-[14px_16px]"
            >
              <SettingIcon icon={item.icon} accent={item.accent} />
              <SettingLabel item={item} />
            </div>
          ),
        )}
      </div>
    </div>
  );
}
