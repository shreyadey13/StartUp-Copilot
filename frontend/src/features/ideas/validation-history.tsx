"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Clock3, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { IdeaValidationHistoryEntry } from "@/lib/api/types";

const HISTORY_KEY = "ai-startup-copilot-idea-validation-history";

export function ValidationHistory() {
  const history = useMemo(loadHistory, []);

  return (
    <div className="grid gap-6">
      <Card className="surface-panel rounded-[1.75rem] animate-rise-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock3 className="h-5 w-5 text-primary" />
            Validation History
          </CardTitle>
          <CardDescription>Review the ideas you have tested and the artifacts created from each run.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {history.length > 0 ? (
            history.map((entry) => (
              <div
                key={entry.id}
                className="grid gap-4 rounded-2xl border bg-background/70 p-4 md:grid-cols-[minmax(0,1fr)_auto]"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{entry.projectName}</p>
                    <Badge variant="outline">{entry.score}/100</Badge>
                    <Badge variant="outline">{entry.confidence}% confidence</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{entry.idea}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{entry.summary}</p>
                </div>
                <div className="flex flex-col items-start justify-between gap-3 md:items-end">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {new Date(entry.createdAt).toLocaleString()}
                  </p>
                  <Button asChild variant="outline" size="sm" className="rounded-full">
                    <Link href="/idea-analysis">
                      Run again
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border bg-background/70 p-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <Search className="h-4 w-4 text-primary" />
                No saved validations yet
              </div>
              <p className="mt-2">
                Submit an idea from the analysis page and your recent runs will appear here automatically.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function loadHistory(): IdeaValidationHistoryEntry[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(HISTORY_KEY);
    return stored ? (JSON.parse(stored) as IdeaValidationHistoryEntry[]) : [];
  } catch {
    return [];
  }
}
