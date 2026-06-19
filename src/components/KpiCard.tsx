import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
  tone?: "default" | "positive" | "negative" | "warning";
  accent?: "dashboard" | "milk" | "meat" | "other" | "monthly" | "compare" | "logic";
  className?: string;
}

const toneClass = {
  default: "text-foreground",
  positive: "text-positive",
  negative: "text-negative",
  warning: "text-warning",
};

const accentBar = {
  dashboard: "bg-tab-dashboard shadow-[0_0_20px_hsl(var(--tab-dashboard)/0.6)]",
  milk: "bg-tab-milk shadow-[0_0_20px_hsl(var(--tab-milk)/0.6)]",
  meat: "bg-tab-meat shadow-[0_0_20px_hsl(var(--tab-meat)/0.6)]",
  other: "bg-tab-other shadow-[0_0_20px_hsl(var(--tab-other)/0.6)]",
  monthly: "bg-tab-monthly shadow-[0_0_20px_hsl(var(--tab-monthly)/0.6)]",
  compare: "bg-tab-compare shadow-[0_0_20px_hsl(var(--tab-compare)/0.6)]",
  logic: "bg-tab-logic shadow-[0_0_20px_hsl(var(--tab-logic)/0.6)]",
};

const accentGlow = {
  dashboard: "before:bg-tab-dashboard/20",
  milk: "before:bg-tab-milk/20",
  meat: "before:bg-tab-meat/20",
  other: "before:bg-tab-other/20",
  monthly: "before:bg-tab-monthly/20",
  compare: "before:bg-tab-compare/20",
  logic: "before:bg-tab-logic/20",
};

export function KpiCard({ title, value, subtitle, icon, tone = "default", accent = "dashboard", className }: KpiCardProps) {
  return (
    <div className={cn(
      "glass relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01]",
      "before:absolute before:-top-12 before:-right-12 before:h-32 before:w-32 before:rounded-full before:blur-3xl before:opacity-60",
      accentGlow[accent],
      "p-5 animate-fade-in",
      className,
    )}>
      <div className={cn("absolute left-0 top-0 h-full w-1", accentBar[accent])} />
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{title}</p>
          <p className={cn("mt-2 text-2xl font-extrabold num tracking-tight", toneClass[tone])}>{value}</p>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {icon && <div className={cn("opacity-80", `text-tab-${accent}`)}>{icon}</div>}
      </div>
    </div>
  );
}
