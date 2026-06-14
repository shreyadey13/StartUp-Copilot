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
      <section className="surface-panel subtle-grid overflow-hidden rounded-[1.75rem] animate-rise-in">
        <div className="grid gap-6 bg-card/72 p-5 md:grid-cols-[minmax(0,1fr)_320px] md:p-6">
          <div className="max-w-3xl">
            <Badge className="mb-4 gap-2 bg-primary text-primary-foreground shadow-sm">
              <span className="h-2 w-2 rounded-full bg-white/90" />
              Founder command center
            </Badge>
            <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl">
              Validate ideas, surface signals, and ship better startup decisions.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              Your agents are coordinating market research, competitor scans, report generation, and investor-readiness checks across the active portfolio.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild className="rounded-full">
                <Link href="/idea-analysis">
                  <Rocket className="h-4 w-4" />
                  Start analysis
                </Link>
              </Button>
              <Button variant="outline" asChild className="rounded-full">
                <Link href="/reports">
                  <ArrowUpRight className="h-4 w-4" />
                  View reports
                </Link>
              </Button>
            </div>
          </div>
          <div className="grid content-between rounded-[1.5rem] border bg-background/80 p-4 shadow-sm">
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
        {dashboardMetrics.map((metric, index) => (
          <div key={metric.label} className="animate-rise-in" style={{ animationDelay: `${index * 90}ms` }}>
            <MetricCard {...metric} />
          </div>
        ))}
      </section>
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Card className="surface-panel rounded-[1.75rem] animate-rise-in">
          <CardHeader>
            <CardTitle>Research Queue</CardTitle>
            <CardDescription>Active agent workflows across your startup portfolio.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {queue.map((job, index) => {
              const Icon = job.icon;
              return (
                <div
                  key={job.title}
                  className="flex items-center justify-between rounded-2xl border bg-background/70 p-4 transition-transform duration-300 hover:-translate-y-0.5"
                  style={{ animationDelay: `${index * 110}ms` }}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-primary/10 text-primary">
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
        <div className="animate-rise-in" style={{ animationDelay: "180ms" }}>
          <AnalyticsPanel />
        </div>
      </section>
    </div>
  );
}
