import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useModel, useCalc } from "@/store/model";
import { fmtMln, fmtKg } from "@/lib/format";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { DashboardTab } from "@/tabs/DashboardTab";
import { MilkTab } from "@/tabs/MilkTab";
import { MeatTab } from "@/tabs/MeatTab";
import { OtherTab } from "@/tabs/OtherTab";
import { MonthlyTab } from "@/tabs/MonthlyTab";
import { CompareTab } from "@/tabs/CompareTab";
import { LogicTab } from "@/tabs/LogicTab";
import { InvestTab } from "@/tabs/InvestTab";
import { BreakevenTab } from "@/tabs/BreakevenTab";
import { LayoutDashboard, Milk, Beef, HandCoins, CalendarDays, GitCompareArrows, BookOpen, RotateCcw, Calculator, Target, FileDown } from "lucide-react";

type TabKey = "dashboard" | "milk" | "meat" | "other" | "invest" | "breakeven" | "monthly" | "compare" | "logic";

const TABS: { key: TabKey; label: string; icon: typeof Milk; accent: string; soft: string; text: string }[] = [
  { key: "dashboard", label: "Итог",   icon: LayoutDashboard,    accent: "border-tab-dashboard", soft: "bg-tab-dashboard-soft", text: "text-tab-dashboard" },
  { key: "milk",      label: "Молоко",    icon: Milk,                accent: "border-tab-milk",      soft: "bg-tab-milk-soft",      text: "text-tab-milk" },
  { key: "meat",      label: "Мясо",      icon: Beef,                accent: "border-tab-meat",      soft: "bg-tab-meat-soft",      text: "text-tab-meat" },
  { key: "other",     label: "Прочее",    icon: HandCoins,           accent: "border-tab-other",     soft: "bg-tab-other-soft",     text: "text-tab-other" },
  { key: "invest",    label: "Расчёт инвест", icon: Calculator,      accent: "border-tab-other",     soft: "bg-tab-other-soft",     text: "text-tab-other" },
  { key: "breakeven", label: "Безубыточность", icon: Target,         accent: "border-tab-milk",      soft: "bg-tab-milk-soft",      text: "text-tab-milk" },
  { key: "monthly",   label: "Помесячно", icon: CalendarDays,        accent: "border-tab-monthly",   soft: "bg-tab-monthly-soft",   text: "text-tab-monthly" },
  { key: "compare",   label: "Сравнение", icon: GitCompareArrows,    accent: "border-tab-compare",   soft: "bg-tab-compare-soft",   text: "text-tab-compare" },
  { key: "logic",     label: "Логика",    icon: BookOpen,            accent: "border-tab-logic",     soft: "bg-tab-logic-soft",     text: "text-tab-logic" },
];

export default function Index() {
  const [tab, setTab] = useState<TabKey>("dashboard");
  const reset = useModel((s) => s.reset);
  const c = useCalc();
  const exportRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const EXPORT_TABS: TabKey[] = ["dashboard", "milk", "meat", "other", "invest", "breakeven", "monthly", "compare"];

  const handleExportPdf = async () => {
    setExporting(true);
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r(null))));
    await new Promise((r) => setTimeout(r, 100));
    const root = exportRef.current;
    if (!root) {
      setExporting(false);
      return;
    }

    // Replace <input> fields with plain text spans so html2canvas captures values
    type Restore = { input: HTMLInputElement; span: HTMLSpanElement };
    const restores: Restore[] = [];
    root.querySelectorAll<HTMLInputElement>("input").forEach((input) => {
      const span = document.createElement("span");
      const cs = window.getComputedStyle(input);
      span.textContent = input.value;
      span.style.display = "inline-flex";
      span.style.alignItems = "center";
      span.style.justifyContent = cs.textAlign === "right" ? "flex-end" : "flex-start";
      span.style.width = cs.width;
      span.style.height = cs.height;
      span.style.padding = cs.padding;
      span.style.fontSize = cs.fontSize;
      span.style.fontWeight = cs.fontWeight;
      span.style.fontFamily = cs.fontFamily;
      span.style.color = cs.color;
      span.style.boxSizing = "border-box";
      span.style.border = cs.border;
      span.style.borderRadius = cs.borderRadius;
      span.style.background = cs.backgroundColor;
      input.parentNode?.insertBefore(span, input);
      input.style.display = "none";
      restores.push({ input, span });
    });

    try {
      const sections = Array.from(
        root.querySelectorAll<HTMLElement>("[data-pdf-section]"),
      );
      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "landscape" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 6;
      const availW = pageW - margin * 2;
      const availH = pageH - margin * 2;

      for (let i = 0; i < sections.length; i++) {
        const el = sections[i];
        const canvas = await html2canvas(el, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          windowWidth: 1240,
        });
        const ratio = canvas.width / canvas.height;
        let imgW = availW;
        let imgH = imgW / ratio;
        if (imgH > availH) {
          imgH = availH;
          imgW = imgH * ratio;
        }
        const offsetX = margin + (availW - imgW) / 2;
        const offsetY = margin + (availH - imgH) / 2;

        if (i > 0) pdf.addPage();
        pdf.addImage(
          canvas.toDataURL("image/jpeg", 0.95),
          "JPEG",
          offsetX,
          offsetY,
          imgW,
          imgH,
        );
      }

      pdf.save("Финмодель-2026.pdf");
    } finally {
      // Restore inputs
      restores.forEach(({ input, span }) => {
        span.remove();
        input.style.display = "";
      });
      setExporting(false);
    }
  };

  const renderTab = (k: TabKey) => {
    switch (k) {
      case "dashboard": return <DashboardTab />;
      case "milk": return <MilkTab />;
      case "meat": return <MeatTab />;
      case "other": return <OtherTab />;
      case "invest": return <InvestTab />;
      case "breakeven": return <BreakevenTab />;
      case "monthly": return <MonthlyTab />;
      case "compare": return <CompareTab />;
      case "logic": return <LogicTab />;
    }
  };

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/60 glass-strong">
        <div className="container flex flex-wrap items-center justify-between gap-4 py-4">
          <div>
            <h1 className="text-2xl font-normal tracking-tight md:text-3xl">
              <span className="text-aurora">Финмодель 2026</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-4 text-right">
              <Stat
                label="Молоко, кг"
                value={fmtKg(c.total_volume_kg).split(",")[0]}
                positive={true}
              />
            </div>
            <Button variant="outline" size="sm" onClick={handleExportPdf} disabled={exporting} className="gap-2">
              <FileDown size={14}/> {exporting ? "Сохраняем…" : "Сохранить PDF"}
            </Button>
            <Button variant="outline" size="sm" onClick={reset} className="gap-2">
              <RotateCcw size={14}/> Сброс
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <nav className="container flex gap-1.5 overflow-x-auto pb-3 -mx-2 px-2 md:gap-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35",
                  active
                    ? cn(
                        t.text,
                        "border-current bg-card",
                        `shadow-[0_6px_20px_-6px_hsl(var(--tab-${t.key})/0.55)]`,
                      )
                    : "border-border/60 bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground",
                )}
              >
                <Icon size={16}/>
                {t.label}
              </button>
            );
          })}
        </nav>
      </header>

      <div className="container py-6">
        {renderTab(tab)}
      </div>

      {/* Hidden block for full PDF export */}
      {exporting && (
        <div style={{ position: "fixed", left: -10000, top: 0, width: 1240, background: "#fff" }}>
          <div ref={exportRef} className="container py-6 space-y-10">
            <h1 className="text-3xl font-semibold mb-4">Финмодель 2026</h1>
            {EXPORT_TABS.map((k) => (
              <section key={k} data-pdf-section className="bg-background p-4 rounded-lg">
                <h2 className="text-2xl font-semibold mb-3">
                  {TABS.find((t) => t.key === k)?.label}
                </h2>
                {renderTab(k)}
              </section>
            ))}
          </div>
        </div>
      )}

      <footer className="border-t border-border/60 mt-8 py-6">
        <div className="container text-center text-xs text-muted-foreground">
          Финмодель «Русь 2026» v2 · Все цифры по умолчанию — из технической спецификации
        </div>
      </footer>
    </main>
  );
}

function Stat({ label, value, positive }: { label: string; value: string; positive: boolean }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn("text-sm font-bold num", positive ? "text-positive" : "text-negative")}>{value}</p>
    </div>
  );
}
