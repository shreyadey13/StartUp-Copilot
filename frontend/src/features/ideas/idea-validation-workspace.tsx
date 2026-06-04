"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

export function IdeaValidationWorkspace() {
  const [idea, setIdea] = useState("An AI copilot that helps first-time founders validate startup ideas using market data and Reddit sentiment.");

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <Card>
        <CardHeader>
          <CardTitle>Idea Brief</CardTitle>
          <CardDescription>Structure the core problem, audience, and assumptions before research starts.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="idea">Startup idea</Label>
            <Textarea id="idea" value={idea} onChange={(event) => setIdea(event.target.value)} className="min-h-40" />
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {["Target customer", "Primary pain", "Known alternatives"].map((label) => (
              <div key={label} className="rounded-md border p-4">
                <p className="text-sm font-medium">{label}</p>
                <p className="mt-2 text-sm text-muted-foreground">Pending AI extraction</p>
              </div>
            ))}
          </div>
          <Button className="w-fit">
            <Sparkles className="h-4 w-4" />
            Run validation
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Readiness</CardTitle>
          <CardDescription>Input quality before agent workflow.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-2">
            <div className="flex justify-between text-sm">
              <span>Brief completeness</span>
              <span>72%</span>
            </div>
            <Progress value={72} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge>Market</Badge>
            <Badge>Reddit</Badge>
            <Badge>Competitors</Badge>
            <Badge variant="outline">Financials</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
