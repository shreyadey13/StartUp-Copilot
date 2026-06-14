"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Clock3, FileText, Target, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { loadIdeaHistory } from "@/lib/idea-history";

export default function ReportsPage() {
  const searchParams = useSearchParams();
  const reports = useMemo(
    () =>
      loadIdeaHistory().map((entry) => ({
        id: entry.id,
        title: entry.reportTitle,
        status: "Ready",
        score: entry.score,
        summary: entry.reportSummary || entry.summary,
        createdAt: entry.createdAt
      })),
    []
  );
  const reportId = searchParams.get("reportId");
  const selected = loadIdeaHistory().find((entry) => entry.id === reportId);

  if (selected) {
    return (
      <div className="grid gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">Report</p>
            <h1 className="text-3xl font-semibold tracking-tight">{selected.reportTitle}</h1>
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
              {selected.projectName}
            </CardTitle>
            <CardDescription>{selected.idea}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <Metric label="Score" value={`${selected.score}/100`} />
            <Metric label="Confidence" value={`${selected.confidence}%`} />
            <Metric label="Created" value={new Date(selected.createdAt).toLocaleDateString()} />
          </CardContent>
        </Card>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <Card className="surface-panel rounded-[1.75rem]">
            <CardHeader>
              <CardTitle>Assessment</CardTitle>
              <CardDescription>How the workflow interpreted your idea.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <p className="text-sm leading-7 text-muted-foreground">{selected.summary}</p>
              <div className="grid gap-3 md:grid-cols-2">
                <InfoPanel label="Target customer" value={selected.customer} />
                <InfoPanel label="Report type" value={selected.reportType} />
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
            {Object.entries(selected.breakdown).map(([key, value]) => (
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
            <Badge variant="outline">{new Date(selected.createdAt).toLocaleString()}</Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {reports.length > 0 ? (
        reports.map((report) => (
          <Card key={report.id} className="surface-panel rounded-2xl">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle>{report.title}</CardTitle>
                <CardDescription>Score {report.score}/100</CardDescription>
                <p className="mt-2 text-sm text-muted-foreground">{report.summary}</p>
              </div>
              <Badge variant="default">{report.status}</Badge>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {new Date(report.createdAt).toLocaleString()}
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/reports?reportId=${report.id}`}>
                  <FileText className="h-4 w-4" />
                  Open report
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="surface-panel rounded-2xl">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>No saved reports yet</CardTitle>
              <CardDescription>Run an idea validation to generate your first report.</CardDescription>
            </div>
          </CardHeader>
        </Card>
      )}
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
