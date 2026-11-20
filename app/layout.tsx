import type { Metadata } from "next";
import { AppStateProvider } from "@/lib/app-state/app-state-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "NGX Insight",
  description: "Understand a company before you invest in it.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full bg-page" suppressHydrationWarning>
        <AppStateProvider>{children}</AppStateProvider>
      </body>
    </html>
  );
}
