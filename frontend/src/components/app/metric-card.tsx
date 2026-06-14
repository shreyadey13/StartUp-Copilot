import { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MetricCard({
  label,
  value,
  delta,
  icon: Icon
}: {
  label: string;
  value: string;
  delta: string;
  icon: LucideIcon;
}) {
  return (
    <Card className="surface-panel overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_hsl(222_47%_10%/0.12)]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-primary/15 to-accent/20 text-primary">
          <Icon className="h-4 w-4" />
        </span>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">{value}</div>
        <p className="mt-2 text-xs font-medium text-primary">{delta}</p>
      </CardContent>
    </Card>
  );
}
