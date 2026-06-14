import Link from "next/link";
import { ArrowRight, Sparkles, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";

const floatingGlyphs = [
  { glyph: "A", className: "top-16 left-[8%] animate-float-slow text-5xl text-primary/25" },
  { glyph: "I", className: "top-24 right-[10%] animate-float-medium text-7xl text-accent/30" },
  { glyph: "∿", className: "top-[46%] left-[14%] animate-float-slow text-4xl text-foreground/15" },
  { glyph: "◎", className: "top-[58%] right-[18%] animate-float-medium text-5xl text-primary/20" },
  { glyph: "↗", className: "bottom-24 left-[22%] animate-float-fast text-4xl text-accent/35" },
  { glyph: "✦", className: "bottom-32 right-[28%] animate-float-slow text-3xl text-foreground/20" }
];

const featureCards = [
  {
    title: "Signal synthesis",
    text: "Blend market research, competitor movement, and founder notes into one crisp decision surface."
  },
  {
    title: "Investor readiness",
    text: "Shape narratives, score traction, and surface the weak spots before a real pitch deck does."
  },
  {
    title: "Agentic workflows",
    text: "Let coordinated research agents keep moving while you focus on the part only founders can do."
  }
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 subtle-grid opacity-45" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.18),transparent_32%),radial-gradient(circle_at_top_right,hsl(var(--accent)/0.18),transparent_28%),linear-gradient(180deg,transparent,transparent_55%,hsl(var(--background))_100%)]" />

      {floatingGlyphs.map((item, index) => (
        <div
          key={item.glyph}
          className={`pointer-events-none absolute select-none font-black tracking-tighter ${item.className}`}
          style={{ animationDelay: `${index * 0.6}s` }}
          aria-hidden="true"
        >
          {item.glyph}
        </div>
      ))}

      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-4 py-16 lg:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)]">
          <div className="max-w-3xl">
            <Badge className="mb-5 gap-2 bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              {APP_NAME} is live
            </Badge>
            <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-foreground sm:text-6xl xl:text-7xl">
              Build startup decisions with a cockpit that feels alive.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Explore market signals, keep research agents in motion, and turn raw startup chaos into something
              readable, visual, and decisively useful.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="rounded-full px-6 py-6 text-base">
                <Link href="/dashboard">
                  Enter workspace
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full px-6 py-6 text-base">
                <Link href="https://shreyadey13.github.io/StartUp-Copilot/" target="_blank" rel="noreferrer">
                  Open live site
                  <Zap className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="rounded-full border bg-card/80 px-4 py-2 shadow-sm">Animated public landing</span>
              <span className="rounded-full border bg-card/80 px-4 py-2 shadow-sm">Clickable live badge</span>
              <span className="rounded-full border bg-card/80 px-4 py-2 shadow-sm">Agentic startup research</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.18),transparent_54%)] blur-3xl" />
            <Card className="surface-panel overflow-hidden rounded-[2rem] border-white/30 bg-card/90">
              <CardContent className="relative space-y-6 p-6">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--primary)/0.05),transparent_40%,hsl(var(--accent)/0.08))]" />
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Startup radar</p>
                    <p className="text-2xl font-semibold tracking-tight">Everything in motion</p>
                  </div>
                  <div className="rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-primary">
                    Live
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[1.5rem] border bg-background/70 p-5">
                  <div className="absolute inset-0 subtle-grid opacity-40" />
                  <div className="relative grid gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Signal velocity</span>
                      <span className="text-sm font-semibold text-primary">+32%</span>
                    </div>
                    <div className="h-3 rounded-full bg-secondary">
                      <div className="h-3 w-[78%] animate-pulse rounded-full bg-gradient-to-r from-primary via-accent to-primary" />
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      {["Market", "Founder", "Competitor"].map((label, index) => (
                        <div
                          key={label}
                          className="rounded-2xl border bg-card/80 p-3 shadow-sm"
                          style={{ animationDelay: `${index * 0.25}s` }}
                        >
                          <div className="text-muted-foreground">{label}</div>
                          <div className="mt-2 text-lg font-semibold">Active</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {featureCards.map((card, index) => (
            <Card
              key={card.title}
              className="surface-panel rounded-2xl border-white/20 bg-card/80 transition-transform duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-5">
                <p className="text-lg font-semibold">{card.title}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{card.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
