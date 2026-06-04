import * as React from "react";

import { cn } from "@/lib/cn";

export function Avatar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-semibold", className)} {...props} />;
}

