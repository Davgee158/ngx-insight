"use client";

import { useAppState } from "@/lib/app-state/app-state-context";
import {
  adaptHomeData,
  type HomeDirectoryCompany,
} from "@/lib/home/home-data-adapter";
import { HomeView } from "@/components/home/home-view";

export function HomeStateResolver({
  directory,
}: {
  directory: HomeDirectoryCompany[];
}) {
  const { state } = useAppState();
  const homeData = adaptHomeData(state.entries, directory);

  return <HomeView homeData={homeData} />;
}
