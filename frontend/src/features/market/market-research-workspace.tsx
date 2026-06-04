import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const trends = [
  { title: "Founder tooling consolidation", impact: 78 },
  { title: "AI-native research workflows", impact: 86 },
  { title: "Early-stage capital discipline", impact: 69 }
];

export function MarketResearchWorkspace() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Market Map</CardTitle>
          <CardDescription>AI-assisted synthesis of audience, trends, and market constraints.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {trends.map((trend) => (
            <div key={trend.title} className="grid gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{trend.title}</span>
                <span className="text-muted-foreground">{trend.impact}% impact</span>
              </div>
              <Progress value={trend.impact} />
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>TAM/SAM/SOM</CardTitle>
          <CardDescription>Draft methodology</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm">
          <div className="flex justify-between"><span>TAM</span><strong>$8.4B</strong></div>
          <div className="flex justify-between"><span>SAM</span><strong>$1.1B</strong></div>
          <div className="flex justify-between"><span>SOM</span><strong>$42M</strong></div>
          <p className="text-muted-foreground">Values are placeholders until source-backed market sizing is connected.</p>
        </CardContent>
      </Card>
    </div>
  );
}

