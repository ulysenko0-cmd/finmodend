import { useCalc, useModel } from "@/store/model";
import { Section } from "@/components/Section";
import { fmtMln, fmtPct, fmtRub, signClass } from "@/lib/format";

export function CompareTab() {
  const c = useCalc();
  const s = useModel();
  const f = s.fact_2025;

  const rows = [
    { name: "Реализация молока, кг", a: f.volume_kg, b: c.total_volume_kg },
    { name: "Фактический надой, кг", a: f.production_volume_kg, b: c.total_production_kg },
    { name: "Выручка молока, ₽", a: 1_582_915_234, b: c.revenue_milk_total },
    { name: "Выручка мяса (всего), ₽", a: f.revenue_meat_total, b: c.revenue_meat_total },
    { name: "Субсидии, ₽", a: f.subsidies, b: s.subsidies_2026_total },
    { name: "Прочие доходы, ₽", a: f.other_revenue, b: c.other_revenue_total },
    { name: "СС молока (всего), ₽", a: f.cost_milk_total, b: c.cost_milk_total },
    { name: "СС мяса (всего), ₽", a: f.cost_meat_total, b: c.cost_meat_total },
    { name: "Прочие + общехозяйственные расходы, ₽", a: f.other_costs_total, b: c.total_other_costs_money },
    { name: "Результат производства, ₽", a: f.result_production, b: c.result_production, bold: true },
  ];

  // Мясо по 6 категориям — выручка 2025 факт (из листа «мясо 25-26»)
  const meat2025Map: Record<string, number> = {
    krs_slaughter: 9_852_315.66,
    rm_slaughter:  7_444_567.20,
    krs_live:      93_168_138.23,
    rm_live:       10_287_373.64,
    bulls:         17_532_940.91,
    heifers:       103_018_181.83, // Племенной скот: нетели 51 372 727 + КРС 51 645 454
  };

  const sumFactors = c.factors.reduce((a, x) => a + x.value, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <Section title="6.1 Сравнение 2025 факт vs 2026 план" accent="compare">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr className="border-b">
                <th className="py-2 text-left font-medium">Показатель</th>
                <th className="py-2 text-right font-medium">2025 факт</th>
                <th className="py-2 text-right font-medium">2026 план</th>
                <th className="py-2 text-right font-medium">Изменение</th>
                <th className="py-2 text-right font-medium">%</th>
              </tr>
            </thead>
            <tbody className="num">
              {rows.map((r) => {
                const d = r.b - r.a;
                const pct = r.a !== 0 ? (d / Math.abs(r.a)) * 100 : 0;
                return (
                  <tr key={r.name} className={"border-b border-border/50 " + (r.bold ? "font-bold bg-tab-compare-soft/40" : "")}>
                    <td className="py-2">{r.name}</td>
                    <td className="py-2 text-right">{fmtRub(r.a)}</td>
                    <td className="py-2 text-right">{fmtRub(r.b)}</td>
                    <td className={"py-2 text-right " + signClass(d)}>{fmtRub(d)}</td>
                    <td className={"py-2 text-right " + signClass(d)}>{fmtPct(pct)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Мясо по 6 категориям — выручка 2025 vs 2026" accent="compare">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground">
            <tr className="border-b">
              <th className="py-2 text-left font-medium">Категория</th>
              <th className="py-2 text-right font-medium">2025</th>
              <th className="py-2 text-right font-medium">2026</th>
              <th className="py-2 text-right font-medium">Δ</th>
            </tr>
          </thead>
          <tbody className="num">
            {c.meatRows.map((m) => {
              const a = meat2025Map[m.key] ?? 0;
              const d = m.revenue - a;
              return (
                <tr key={m.key} className="border-b border-border/50">
                  <td className="py-2">{m.name}</td>
                  <td className="py-2 text-right">{fmtRub(a)}</td>
                  <td className="py-2 text-right">{fmtRub(m.revenue)}</td>
                  <td className={"py-2 text-right " + signClass(d)}>{fmtRub(d)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Section>

      <Section title="6.2 Факторный анализ — мост от 2025 к 2026" accent="compare"
        description={`Сумма факторов = ${fmtMln(sumFactors)}. Должна сходиться с Результатом 2026 = ${fmtMln(c.result_production)}.`}>
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground">
            <tr className="border-b">
              <th className="py-2 text-left font-medium">Фактор</th>
              <th className="py-2 text-right font-medium">Влияние, ₽</th>
              <th className="py-2 text-right font-medium">млн ₽</th>
            </tr>
          </thead>
          <tbody className="num">
            {c.factors.map((f, i) => (
              <tr key={i} className="border-b border-border/50">
                <td className="py-2">{f.name}</td>
                <td className={"py-2 text-right " + signClass(f.value)}>{fmtRub(f.value)}</td>
                <td className={"py-2 text-right font-medium " + signClass(f.value)}>{fmtMln(f.value)}</td>
              </tr>
            ))}
            <tr className="border-t-2 border-foreground/30 font-bold bg-tab-compare-soft/40">
              <td className="py-3">Результат 2026 (Σ факторов)</td>
              <td className={"py-3 text-right " + signClass(sumFactors)}>{fmtRub(sumFactors)}</td>
              <td className={"py-3 text-right " + signClass(sumFactors)}>{fmtMln(sumFactors)}</td>
            </tr>
          </tbody>
        </table>
      </Section>
    </div>
  );
}
