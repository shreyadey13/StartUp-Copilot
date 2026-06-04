import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const signals = [
  { label: "Problem urgency", value: 84 },
  { label: "Market pull", value: 71 },
  { label: "Differentiation", value: 64 },
  { label: "Investor readiness", value: 58 }
];

export function AnalyticsPanel() {
  return (
    <Card className="surface-panel">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Validation Signals</CardTitle>
        <Badge variant="warning">Live model</Badge>
      </CardHeader>
      <CardContent className="grid gap-5">
        {signals.map((signal) => (
          <div key={signal.label} className="grid gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{signal.label}</span>
              <span className="text-muted-foreground">{signal.value}%</span>
            </div>
            <Progress value={signal.value} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
