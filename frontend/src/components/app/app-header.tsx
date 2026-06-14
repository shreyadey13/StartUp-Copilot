"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, ExternalLink, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { navigationItems } from "@/config/navigation";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { useAuthStore } from "@/store/auth-store";
import { useUiStore } from "@/store/ui-store";

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const logout = useAuthStore((state) => state.logout);
  const mobileNavOpen = useUiStore((state) => state.mobileNavOpen);
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen);
  const activeItem = navigationItems.find((item) => item.href === pathname);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/85 px-4 backdrop-blur lg:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <p className="text-sm text-muted-foreground">{APP_NAME}</p>
          <h1 className="text-lg font-semibold">{activeItem?.title ?? "Workspace"}</h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="https://shreyadey13.github.io/StartUp-Copilot/"
          target="_blank"
          rel="noreferrer"
          className="hidden items-center gap-2 rounded-md border bg-card px-3 py-2 text-xs font-medium text-primary transition-transform duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm sm:flex"
          aria-label="Open live deployment in a new tab"
        >
          <Activity className="h-3.5 w-3.5" />
          Live
          <ExternalLink className="h-3 w-3 opacity-70" />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
        <Avatar className="bg-primary text-primary-foreground">SC</Avatar>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Sign out
        </Button>
      </div>
      {mobileNavOpen ? (
        <div className="absolute left-0 right-0 top-16 border-b bg-background p-3 shadow-sm lg:hidden">
          <nav className="grid gap-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={cn(
                    "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground",
                    pathname === item.href && "bg-secondary text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
