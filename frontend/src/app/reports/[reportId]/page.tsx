"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Clock3, FileText, Target, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { loadIdeaHistory } from "@/lib/idea-history";

export default function ReportDetailPage() {
  const params = useParams<{ reportId: string }>();
  const entry = loadIdeaHistory().find((item) => item.id === params.reportId);

  if (!entry) {
    return (
      <Card className="surface-panel rounded-[1.75rem]">
        <CardHeader>
          <CardTitle>Report not found</CardTitle>
          <CardDescription>This report may have been cleared from local history.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" asChild className="rounded-full">
            <Link href="/reports">
              <ArrowLeft className="h-4 w-4" />
              Back to reports
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Report</p>
          <h1 className="text-3xl font-semibold tracking-tight">{entry.reportTitle}</h1>
        </div>
        <Button variant="outline" asChild className="rounded-full">
          <Link href="/reports">
            <ArrowLeft className="h-4 w-4" />
            Back to reports
          </Link>
        </Button>
      </div>

      <Card className="surface-panel rounded-[1.75rem]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {entry.projectName}
          </CardTitle>
          <CardDescription>{entry.idea}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Metric label="Score" value={`${entry.score}/100`} />
          <Metric label="Confidence" value={`${entry.confidence}%`} />
          <Metric label="Created" value={new Date(entry.createdAt).toLocaleDateString()} />
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="surface-panel rounded-[1.75rem]">
          <CardHeader>
            <CardTitle>Assessment</CardTitle>
            <CardDescription>How the workflow interpreted your idea.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <p className="text-sm leading-7 text-muted-foreground">{entry.summary}</p>
            <div className="grid gap-3 md:grid-cols-2">
              <InfoPanel label="Target customer" value={entry.customer} />
              <InfoPanel label="Report type" value={entry.reportType} />
            </div>
          </CardContent>
        </Card>

        <Card className="surface-panel rounded-[1.75rem]">
          <CardHeader>
            <CardTitle>Suggested next move</CardTitle>
            <CardDescription>Use this as the next step in the validation loop.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {[
              "Interview the closest-fit users.",
              "Map the current workaround.",
              "Run a landing page or MVP test."
            ].map((step) => (
              <div key={step} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Target className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{step}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="surface-panel rounded-[1.75rem]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Score breakdown
          </CardTitle>
          <CardDescription>Reasoning factors from the analysis engine.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3 xl:grid-cols-4">
          {Object.entries(entry.breakdown).map(([key, value]) => (
            <div key={key} className="rounded-2xl border bg-background/70 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{key}</p>
              <p className="mt-2 text-2xl font-semibold">{value}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="surface-panel rounded-[1.75rem]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock3 className="h-5 w-5 text-primary" />
            Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant="outline">{new Date(entry.createdAt).toLocaleString()}</Badge>
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-background/70 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function InfoPanel({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-background/70 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm leading-6">{value}</p>
    </div>
  );
}
