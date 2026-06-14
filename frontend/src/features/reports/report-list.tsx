"use client";

import Link from "next/link";
import { FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { loadIdeaHistory } from "@/lib/idea-history";

export function ReportList() {
  const reports = loadIdeaHistory().map((entry) => ({
    id: entry.id,
    title: entry.reportTitle,
    status: "Ready",
    score: entry.score,
    summary: entry.reportSummary || entry.summary,
    createdAt: entry.createdAt
  }));

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
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{new Date(report.createdAt).toLocaleString()}</p>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/reports/${report.id}`}>
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
