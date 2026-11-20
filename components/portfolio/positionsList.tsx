import type { Position } from "@/lib/portfolio/types";
import { groupPositions } from "@/lib/portfolio/grouping";
import { PositionCard } from "@/components/portfolio/positionCard";

export function PositionsList({
  positions,
  onBuyConfirm,
  onSellConfirm,
  onDelete,
}: {
  positions: Position[];
  onBuyConfirm: (position: Position, shares: number, avgPrice: number) => void;
  onSellConfirm: (position: Position, sharesSold: number) => void;
  onDelete: (position: Position) => void;
}) {
  const { needsAttention, active, delisted } = groupPositions(positions);

  return (
    <>
      {needsAttention.length > 0 && (
        <div className="mb-5">
          <h2 className="font-serif text-[16px] tracking-[-0.01em] mb-3">
            Needs attention
          </h2>
          <div className="flex flex-col gap-2">
            {needsAttention.map((position) => (
              <PositionCard
                key={position.ticker}
                position={position}
                onBuyConfirm={(shares, avgPrice) =>
                  onBuyConfirm(position, shares, avgPrice)
                }
                onSellConfirm={(sharesSold) =>
                  onSellConfirm(position, sharesSold)
                }
                onDelete={() => onDelete(position)}
              />
            ))}
          </div>
        </div>
      )}

      {active.length > 0 && (
        <div className="mb-5">
          <h2 className="font-serif text-[16px] tracking-[-0.01em] mb-3">
            Your positions
          </h2>
          <div className="flex flex-col gap-2">
            {active.map((position) => (
              <PositionCard
                key={position.ticker}
                position={position}
                onBuyConfirm={(shares, avgPrice) =>
                  onBuyConfirm(position, shares, avgPrice)
                }
                onSellConfirm={(sharesSold) =>
                  onSellConfirm(position, sharesSold)
                }
                onDelete={() => onDelete(position)}
              />
            ))}
          </div>
        </div>
      )}

      {delisted.length > 0 && (
        <div className="mb-5">
          <h2 className="font-serif text-[16px] tracking-[-0.01em] mb-3">
            No longer listed
          </h2>
          <div className="flex flex-col gap-2">
            {delisted.map((position) => (
              <PositionCard
                key={position.ticker}
                position={position}
                onBuyConfirm={(shares, avgPrice) =>
                  onBuyConfirm(position, shares, avgPrice)
                }
                onSellConfirm={(sharesSold) =>
                  onSellConfirm(position, sharesSold)
                }
                onDelete={() => onDelete(position)}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
