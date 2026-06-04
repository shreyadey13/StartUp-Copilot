import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Clock3, DatabaseZap, Rocket, ShieldCheck } from "lucide-react";

import { MetricCard } from "@/components/app/metric-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardMetrics } from "@/config/navigation";
import { AnalyticsPanel } from "@/features/analytics/analytics-panel";

const queue = [
  { title: "Reddit sentiment extraction", project: "Founder signal map", status: "Running", icon: DatabaseZap },
  { title: "Competitor enrichment", project: "Hiring analyst", status: "Queued", icon: ShieldCheck },
  { title: "Investor readiness scoring", project: "Seed memo builder", status: "Queued", icon: Clock3 }
];

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <section className="surface-panel subtle-grid overflow-hidden rounded-lg">
        <div className="grid gap-6 bg-card/72 p-5 md:grid-cols-[minmax(0,1fr)_320px] md:p-6">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-primary text-primary-foreground">Founder command center</Badge>
            <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
              Validate ideas, surface signals, and ship better startup decisions.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Your agents are coordinating market research, competitor scans, report generation, and investor-readiness checks across the active portfolio.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/idea-analysis">
                  <Rocket className="h-4 w-4" />
                  Start analysis
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/reports">
                  <ArrowUpRight className="h-4 w-4" />
                  View reports
                </Link>
              </Button>
            </div>
          </div>
          <div className="grid content-between rounded-lg border bg-background/80 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Workflow health</p>
              <Badge variant="outline">98.4%</Badge>
            </div>
            <div className="mt-8">
              <p className="text-5xl font-semibold">17</p>
              <p className="mt-2 text-sm text-muted-foreground">research tasks completed this week</p>
            </div>
            <div className="mt-5 grid gap-2 text-sm">
              {["Market data synced", "Competitor graph refreshed", "Report templates ready"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Card className="surface-panel">
          <CardHeader>
            <CardTitle>Research Queue</CardTitle>
            <CardDescription>Active agent workflows across your startup portfolio.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {queue.map((job) => {
              const Icon = job.icon;
              return (
                <div key={job.title} className="flex items-center justify-between rounded-md border bg-background/70 p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{job.title}</p>
                      <p className="text-sm text-muted-foreground">{job.project}</p>
                    </div>
                  </div>
                  <Badge variant={job.status === "Running" ? "warning" : "outline"}>{job.status}</Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
        <AnalyticsPanel />
      </section>
    </div>
  );
}
