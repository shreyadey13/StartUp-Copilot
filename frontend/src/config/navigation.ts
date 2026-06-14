import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  FileText,
  Gauge,
  LineChart,
  Search,
  Settings,
  Sparkles
} from "lucide-react";

export const navigationItems = [
  { title: "Dashboard", href: "/dashboard", icon: Gauge },
  { title: "Projects", href: "/projects", icon: BriefcaseBusiness },
  { title: "Idea Analysis", href: "/idea-analysis", icon: Sparkles },
  { title: "Idea History", href: "/idea-history", icon: FileText },
  { title: "Competitors", href: "/competitor-analysis", icon: Building2 },
  { title: "Market Research", href: "/market-research", icon: Search },
  { title: "Reports", href: "/reports", icon: FileText },
  { title: "Settings", href: "/settings", icon: Settings }
] as const;

export const dashboardMetrics = [
  { label: "Validation Score", value: "78", delta: "+8 this week", icon: BarChart3 },
  { label: "Active Projects", value: "12", delta: "4 in research", icon: BriefcaseBusiness },
  { label: "Reports Ready", value: "31", delta: "9 exported", icon: FileText },
  { label: "Market Signals", value: "246", delta: "Reddit + web", icon: LineChart }
];
