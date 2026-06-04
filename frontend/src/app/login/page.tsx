import { BarChart3, CheckCircle2, LineChart, Radar } from "lucide-react";

import { LoginForm } from "@/components/auth/login-form";
import { Badge } from "@/components/ui/badge";
import { APP_NAME } from "@/lib/constants";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
        <section className="grid gap-6">
          <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">{APP_NAME}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal">Validate startup ideas with structured AI research.</h1>
          <p className="mt-4 text-base text-muted-foreground">
            Turn raw ideas into investor-ready analysis across market demand, competitors, sentiment, financials, and execution risk.
          </p>
          </div>
          <div className="surface-panel subtle-grid max-w-2xl overflow-hidden rounded-lg">
            <div className="bg-card/75 p-4">
              <div className="mb-4 flex items-center justify-between">
                <Badge className="bg-primary text-primary-foreground">Market pulse</Badge>
                <span className="text-xs font-medium text-muted-foreground">June cohort</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Demand", value: "84", icon: Radar },
                  { label: "Moat", value: "67", icon: BarChart3 },
                  { label: "Momentum", value: "91", icon: LineChart }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-md border bg-background/80 p-3">
                      <Icon className="mb-4 h-4 w-4 text-primary" />
                      <p className="text-2xl font-semibold">{item.value}</p>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 grid gap-2 rounded-md border bg-background/80 p-3 text-sm">
                {["Customer pain verified", "Three direct competitors mapped", "Seed report draft ready"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <LoginForm />
      </div>
    </main>
  );
}
