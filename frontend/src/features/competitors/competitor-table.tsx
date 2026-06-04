import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const competitors = [
  { name: "ValidatorAI", type: "Direct", similarity: "82", pricing: "Free / paid advisory", gap: "Limited source transparency" },
  { name: "ChatGPT", type: "Indirect", similarity: "67", pricing: "Subscription", gap: "Generic workflow" },
  { name: "PitchBob", type: "Adjacent", similarity: "59", pricing: "Subscription", gap: "Pitch-first positioning" }
];

export function CompetitorTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Competitive Landscape</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b text-muted-foreground">
            <tr>
              <th className="py-3 pr-4 font-medium">Company</th>
              <th className="py-3 pr-4 font-medium">Type</th>
              <th className="py-3 pr-4 font-medium">Similarity</th>
              <th className="py-3 pr-4 font-medium">Pricing</th>
              <th className="py-3 pr-4 font-medium">Differentiation gap</th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((competitor) => (
              <tr key={competitor.name} className="border-b last:border-0">
                <td className="py-4 pr-4 font-medium">{competitor.name}</td>
                <td className="py-4 pr-4"><Badge variant="outline">{competitor.type}</Badge></td>
                <td className="py-4 pr-4">{competitor.similarity}%</td>
                <td className="py-4 pr-4 text-muted-foreground">{competitor.pricing}</td>
                <td className="py-4 pr-4 text-muted-foreground">{competitor.gap}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

