import * as React from "react";

import { cn } from "@/lib/cn";

export function Progress({
  value,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { value: number }) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-secondary", className)} {...props}>
      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

