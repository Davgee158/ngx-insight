"use client";

import { useAppState } from "@/lib/app-state/app-state-context";

export function SavedLensesCountLabel() {
  const { state } = useAppState();
  const count = Object.keys(state.savedLenses).length;

  return <>{count === 0 ? "None saved yet" : `${count} saved`}</>;
}
