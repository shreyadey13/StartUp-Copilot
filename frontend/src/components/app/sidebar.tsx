"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { navigationItems } from "@/config/navigation";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { useUiStore } from "@/store/ui-store";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const collapsed = useUiStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);

  return (
    <aside
      className={cn(
        "hidden min-h-screen border-r bg-background transition-[width] duration-200 lg:block",
        collapsed ? "w-[76px]" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/dashboard" className={cn("font-semibold", collapsed && "sr-only")}>
          {APP_NAME}
        </Link>
        <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Toggle sidebar">
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </Button>
      </div>
      <Separator />
      <nav className="flex flex-col gap-1 p-3">
        {navigationItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                active && "bg-secondary text-foreground",
                collapsed && "justify-center px-0"
              )}
              title={item.title}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className={cn(collapsed && "sr-only")}>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

