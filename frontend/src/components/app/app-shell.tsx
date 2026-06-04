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
  const isPublic = publicRoutes.has(pathname);

  useEffect(() => {
    if (!accessToken && !isPublic) {
      router.replace("/login");
    }
  }, [accessToken, isPublic, router]);

  if (isPublic) {
    return <>{children}</>;
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

