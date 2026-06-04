"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

import { AppHeader } from "@/components/app/app-header";
import { Sidebar } from "@/components/app/sidebar";
import { useAuthStore } from "@/store/auth-store";

const publicRoutes = new Set(["/login"]);

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isPublic = publicRoutes.has(pathname);

  useEffect(() => {
    if (hasHydrated && !accessToken && !isPublic) {
      router.replace("/login");
    }
  }, [accessToken, hasHydrated, isPublic, router]);

  if (isPublic) {
    return <>{children}</>;
  }

  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="surface-panel rounded-lg px-5 py-4 text-sm text-muted-foreground">
          Preparing workspace...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <AppHeader />
          <main className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
