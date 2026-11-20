import { BottomNav } from "@/components/app-shell/bottom-nav";
import { StorageWarning } from "@/components/app-shell/storage-warning";
import { NavigationLoadingOverlay } from "@/components/app-shell/navigation-loading-overlay";
import { AppRouteHistory } from "@/components/app-shell/app-route-history";

export default function AppShellLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 pb-24">
        <AppRouteHistory />
        <StorageWarning />
        <NavigationLoadingOverlay />
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
