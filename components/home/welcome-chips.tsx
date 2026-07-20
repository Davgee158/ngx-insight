import type { ComponentType } from "react";
import {
  IconAntenna,
  IconBolt,
  IconBuildingBank,
  IconShoppingBag,
} from "@tabler/icons-react";
import type { DISCOVERY_SECTORS } from "@/lib/home/mock-data";

const SECTOR_ICON: Record<string, ComponentType<{ size?: number; stroke?: number }>> = {
  "building-bank": IconBuildingBank,
  antenna: IconAntenna,
  "shopping-bag": IconShoppingBag,
  bolt: IconBolt,
};

interface WelcomeChipsProps {
  sectors: typeof DISCOVERY_SECTORS;
}

export function WelcomeChips({ sectors }: WelcomeChipsProps) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {sectors.map((sector) => {
        const Icon = SECTOR_ICON[sector.icon];
        return (
          <div
            key={sector.label}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-medium ${
              sector.active
                ? "border-transparent bg-indigo-tint text-indigo-deep"
                : "border-border bg-surface text-ink-soft"
            }`}
          >
            <Icon size={13} stroke={1.75} />
            {sector.label}
          </div>
        );
      })}
    </div>
  );
}
