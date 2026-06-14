"use client";

import { FormEvent, useMemo, useState } from "react";
import { BrainCircuit, CheckCircle2, Loader2, Sparkles, Target, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useValidateIdeaMutation } from "@/lib/api/hooks";
import type { IdeaValidationAnalysis } from "@/lib/api/types";

const defaultIdea =
  "An AI copilot that helps first-time founders validate startup ideas using market data and Reddit sentiment.";

const fallbackAnalysis = analyzeIdea(defaultIdea);

export function IdeaValidationWorkspace() {
  const [idea, setIdea] = useState(defaultIdea);
  const [analysis, setAnalysis] = useState<IdeaValidationAnalysis>(fallbackAnalysis);
  const [submittedAt, setSubmittedAt] = useState<string>("Ready for your idea");
  const [artifact, setArtifact] = useState<{ projectName: string; reportTitle: string } | null>(null);
  const validateIdea = useValidateIdeaMutation();

  const completion = useMemo(() => Math.min(100, Math.max(45, analysis.score + 8)), [analysis.score]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedIdea = idea.trim();
    if (!trimmedIdea) {
      return;
    }

    try {
      const result = await validateIdea.mutateAsync({ idea: trimmedIdea });
      setAnalysis(result.analysis);
      setArtifact({ projectName: result.project.name, reportTitle: result.report.title });
      setSubmittedAt(new Date(result.report.created_at).toLocaleString());
    } catch {
      const nextAnalysis = analyzeIdea(trimmedIdea);
      setAnalysis(nextAnalysis);
      setArtifact({ projectName: deriveProjectName(trimmedIdea), reportTitle: "Idea validation report" });
      setSubmittedAt(new Date().toLocaleString());
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <Card className="surface-panel rounded-[1.75rem] animate-rise-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-primary" />
            Idea Brief
          </CardTitle>
          <CardDescription>Tell us what you are building. We will turn it into a structured startup assessment.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="idea">Startup idea</Label>
              <Textarea
                id="idea"
                value={idea}
                onChange={(event) => setIdea(event.target.value)}
                className="min-h-40 rounded-2xl"
                placeholder="Describe the product, the user, the problem, and why now."
              />
            </div>
            <Button type="submit" className="w-fit rounded-full px-6" disabled={!idea.trim() || validateIdea.isPending}>
              {validateIdea.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {validateIdea.isPending ? "Analyzing..." : "Run validation"}
            </Button>
          </form>

          {artifact ? (
            <div className="grid gap-3 rounded-2xl border bg-background/70 p-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Saved project</p>
                <p className="mt-1 text-sm font-medium">{artifact.projectName}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Created report</p>
                <p className="mt-1 text-sm font-medium">{artifact.reportTitle}</p>
              </div>
            </div>
          ) : null}

          <div className="grid gap-3 md:grid-cols-3">
            <InsightCard label="Target customer" value={analysis.customer} />
            <InsightCard label="Primary pain" value={analysis.pain} />
            <InsightCard label="Known alternatives" value={analysis.alternatives} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="rounded-2xl border bg-background/70">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">What we heard</CardTitle>
                <CardDescription>Interpretation of the idea you entered.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                <p className="text-sm leading-6 text-muted-foreground">{analysis.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.strengths.map((item) => (
                    <Badge key={item} className="gap-1 bg-primary text-primary-foreground">
                      <CheckCircle2 className="h-3 w-3" />
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border bg-background/70">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Risks to test</CardTitle>
                <CardDescription>Signals that need validation before you ship.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                {analysis.risks.map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Target className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-2xl border bg-background/70">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Suggested next steps</CardTitle>
              <CardDescription>Use these to turn the idea into a real validation workflow.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3">
              {analysis.next_steps.map((step, index) => (
                <div key={step} className="rounded-2xl border bg-card/80 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    <TrendingUp className="h-3.5 w-3.5 text-primary" />
                    Step {index + 1}
                  </div>
                  <p className="mt-2 text-sm leading-6">{step}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <Card className="surface-panel rounded-[1.75rem] animate-rise-in" style={{ animationDelay: "140ms" }}>
        <CardHeader>
          <CardTitle>Readiness</CardTitle>
          <CardDescription>Input quality before the workflow expands.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-2">
            <div className="flex justify-between text-sm">
              <span>Brief completeness</span>
              <span>{completion}%</span>
            </div>
            <Progress value={completion} />
          </div>
          <div className="grid gap-3">
            <Badge className="w-fit">Market</Badge>
            <Badge className="w-fit">Reddit</Badge>
            <Badge className="w-fit">Competitors</Badge>
            <Badge variant="outline" className="w-fit">
              Financials
            </Badge>
          </div>
          <div className="rounded-2xl border bg-background/70 p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Last validation</p>
            <p className="mt-1">{submittedAt}</p>
          </div>
          <div className="rounded-2xl border bg-gradient-to-br from-primary/10 to-accent/10 p-4">
            <p className="text-sm font-medium">What to add next</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Describe the buyer, the current workaround, and how you plan to reach them. Specificity makes the analysis sharper.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InsightCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-background/70 p-4">
      <p className="text-sm font-medium">{label}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{value}</p>
    </div>
  );
}

function analyzeIdea(input: string): IdeaValidationAnalysis {
  const normalized = input.trim().toLowerCase();
  const hasB2B = /\bbusiness|team|enterprise|company|workflow|ops\b/.test(normalized);
  const hasConsumer = /\bcreator|consumer|student|parent|freelancer|founder\b/.test(normalized);
  const hasAi = /\bai|agent|copilot|assistant|automation\b/.test(normalized);
  const hasData = /\bmarket|data|analytics|sentiment|reddit|search\b/.test(normalized);
  const hasRevenue = /\bsubscription|pricing|revenue|sell|pay|mrr|saas\b/.test(normalized);

  const score = Math.min(
    96,
    38 +
      (hasAi ? 14 : 0) +
      (hasData ? 12 : 0) +
      (hasRevenue ? 10 : 0) +
      (hasB2B || hasConsumer ? 8 : 0) +
      Math.min(12, Math.floor(input.length / 25))
  );
  const confidence = Math.min(94, Math.max(52, 48 + Math.floor(input.length / 24) + (hasData ? 8 : 0) + (hasAi ? 6 : 0)));

  const customer =
    hasB2B && hasConsumer
      ? "Mixed audience, likely needs sharper segmentation"
      : hasB2B
        ? "B2B operators, founders, or teams"
        : hasConsumer
          ? "Consumers, creators, or early adopters"
          : "Needs a clearer customer segment";

  const pain =
    hasData || hasAi
      ? "They need faster decisions and better signal extraction from noisy inputs."
      : "They need a clearer, repeated pain point with an existing workaround.";

  const alternatives =
    hasAi || hasData
      ? "Spreadsheets, manual research, ChatGPT prompts, and generic dashboards"
      : "Manual workflows, search engines, and existing point solutions";

  const strengths = [
    hasAi ? "AI-native" : "Clear workflow",
    hasData ? "Signal driven" : "Easy to explain",
    hasRevenue ? "Commercial path" : "Early discovery"
  ];

  const risks = [
    "Validate whether users will adopt this over a manual workflow.",
    "Check whether the problem appears weekly, not just once.",
    "Test whether the idea is narrow enough to build a first version quickly."
  ];

  const next_steps = [
    "Interview 5 target users and capture the exact language they use to describe the pain.",
    "List the current workaround and quantify the time or money it burns today.",
    "Define one measurable outcome for a first prototype and test it with a landing page or demo."
  ];

  return {
    score,
    confidence,
    summary: `This idea looks ${score >= 70 ? "promising" : score >= 55 ? "early-stage" : "too broad"} for a first pass. It will need sharper customer definition and a very specific problem statement.`,
    customer,
    pain,
    alternatives,
    strengths,
    risks,
    next_steps
  };
}

function deriveProjectName(idea: string) {
  const words = idea.trim().match(/[A-Za-z0-9]+/g) ?? [];
  if (words.length === 0) {
    return "Idea Validation";
  }
  return words.slice(0, 4).join(" ").replace(/\b\w/g, (char) => char.toUpperCase());
}
