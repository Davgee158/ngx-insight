import type { Position } from "./types";

export function groupPositions(positions: Position[]): {
  needsAttention: Position[];
  active: Position[];
  delisted: Position[];
} {
  const needsAttention: Position[] = [];
  const active: Position[] = [];
  const delisted: Position[] = [];

  for (const position of positions) {
    if (position.tradingStatus === "delisted") {
      delisted.push(position);
    } else if (position.attentionTrigger || position.tradingStatus === "suspended") {
      needsAttention.push(position);
    } else {
      active.push(position);
    }
  }

  return { needsAttention, active, delisted };
}
