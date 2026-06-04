"use client";

import { FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const reports = [
  { title: "Startup Validation Report", status: "Ready", score: 78 },
  { title: "Competitor Analysis", status: "Draft", score: 64 },
  { title: "Investor Readiness", status: "Needs review", score: 58 }
];

export function ReportList() {
  return (
    <div className="grid gap-4">
      {reports.map((report) => (
        <Card key={report.title}>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>{report.title}</CardTitle>
              <CardDescription>Score {report.score}/100</CardDescription>
            </div>
            <Badge variant={report.status === "Ready" ? "default" : "secondary"}>{report.status}</Badge>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4" />
              Open report
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

