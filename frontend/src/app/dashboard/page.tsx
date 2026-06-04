import { MetricCard } from "@/components/app/metric-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardMetrics } from "@/config/navigation";
import { AnalyticsPanel } from "@/features/analytics/analytics-panel";

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Card>
          <CardHeader>
            <CardTitle>Research Queue</CardTitle>
            <CardDescription>Active agent workflows across your startup portfolio.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {["Reddit sentiment extraction", "Competitor enrichment", "Investor readiness scoring"].map((job, index) => (
              <div key={job} className="flex items-center justify-between rounded-md border p-4">
                <div>
                  <p className="font-medium">{job}</p>
                  <p className="text-sm text-muted-foreground">Project #{index + 1}</p>
                </div>
                <span className="text-sm text-muted-foreground">{index === 0 ? "Running" : "Queued"}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <AnalyticsPanel />
      </section>
    </div>
  );
}

