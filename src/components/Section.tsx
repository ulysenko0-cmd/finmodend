import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionProps {
  title: string;
  description?: string;
  accent?: "dashboard" | "milk" | "meat" | "other" | "monthly" | "compare" | "logic";
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

const accentText = {
  dashboard: "text-tab-dashboard",
  milk: "text-tab-milk",
  meat: "text-tab-meat",
  other: "text-tab-other",
  monthly: "text-tab-monthly",
  compare: "text-tab-compare",
  logic: "text-tab-logic",
};

export function Section({ title, description, accent = "dashboard", actions, children, className }: SectionProps) {
  return (
    <section className={cn("glass rounded-2xl p-6 animate-fade-in", className)}>
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className={cn("text-lg font-bold tracking-tight", accentText[accent])}>{title}</h2>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions}
      </header>
      {children}
    </section>
  );
}
