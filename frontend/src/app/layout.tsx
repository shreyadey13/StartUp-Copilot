import type { Metadata } from "next";
import { ReactNode } from "react";

import { AppShell } from "@/components/app/app-shell";
import { AppProviders } from "@/components/providers/app-providers";
import { APP_NAME } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  title: APP_NAME,
  description: "AI-powered startup idea validation platform"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
