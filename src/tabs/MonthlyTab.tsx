import { useCalc } from "@/store/model";
import { Section } from "@/components/Section";
import { fmtKg, fmtMln, fmtPerKg, fmtRub, signClass } from "@/lib/format";

export function MonthlyTab() {
  const c = useCalc();
  return (
    <div className="space-y-6 animate-fade-in">
      <Section title="Помесячный расчёт — выручка, СС, маржа, результат" accent="monthly"
        description="Реализация задана по месяцам; фактический надой = реализация ÷ 97,5%. Кормовые и постоянные затраты распределяются по календарным дням.">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr className="border-b">
                <th className="py-2 text-left font-medium">Месяц</th>
                <th className="py-2 text-right font-medium">Цена молока</th>
                <th className="py-2 text-right font-medium">Среднедн.</th>
                <th className="py-2 text-right font-medium">Объём, кг</th>
                <th className="py-2 text-right font-medium">Надой, кг</th>
                <th className="py-2 text-right font-medium">Выр./кг</th>
                <th className="py-2 text-right font-medium">СС/кг</th>
                <th className="py-2 text-right font-medium">Маржа/кг</th>
                <th className="py-2 text-right font-medium">Результат</th>
              </tr>
            </thead>
            <tbody className="num">
              {c.monthly.map((m) => (
                <tr key={m.month} className="border-b border-border/50 hover:bg-tab-monthly-soft/40">
                  <td className="py-2 font-medium">{m.month}</td>
                  <td className="py-2 text-right">{fmtPerKg(m.price)}</td>
                  <td className="py-2 text-right">{fmtKg(m.daily)}</td>
                  <td className="py-2 text-right">{fmtKg(m.volume)}</td>
                  <td className="py-2 text-right">{fmtKg(m.production_volume)}</td>
                  <td className="py-2 text-right text-tab-milk">{fmtPerKg(m.revenue_per_kg)}</td>
                  <td className="py-2 text-right text-tab-meat">{fmtPerKg(m.cost_per_kg)}</td>
                  <td className={"py-2 text-right font-medium " + signClass(m.margin_per_kg)}>{fmtPerKg(m.margin_per_kg)}</td>
                  <td className={"py-2 text-right font-bold " + signClass(m.result)}>{fmtMln(m.result)}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-foreground/30 font-bold bg-tab-monthly-soft/60">
                <td className="py-3">ГОД</td>
                <td className="py-3 text-right">—</td>
                <td className="py-3 text-right">—</td>
                <td className="py-3 text-right">{fmtKg(c.total_volume_kg)}</td>
                <td className="py-3 text-right">{fmtKg(c.total_production_kg)}</td>
                <td className="py-3 text-right text-tab-milk">{fmtPerKg(c.avg_revenue_per_kg)}</td>
                <td className="py-3 text-right text-tab-meat">{fmtPerKg(c.avg_cost_per_kg)}</td>
                <td className={"py-3 text-right " + signClass(c.avg_revenue_per_kg - c.avg_cost_per_kg)}>{fmtPerKg(c.avg_revenue_per_kg - c.avg_cost_per_kg)}</td>
                <td className={"py-3 text-right " + signClass(c.result_milk)}>{fmtMln(c.result_milk)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Свод за год" accent="monthly">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <SumCard label="Результат молока" value={fmtMln(c.revenue_milk_total - c.cost_milk_total)} tone={c.revenue_milk_total - c.cost_milk_total}/>
          <SumCard label="Результат мяса" value={fmtMln(c.result_meat_total)} tone={c.result_meat_total}/>
          <SumCard label="Результат производства" value={fmtMln(c.result_production)} tone={c.result_production}/>
          <SumCard label="Итог после инвестиций" value={fmtMln(c.result_after_invest)} tone={c.result_after_invest}/>
        </div>
      </Section>
    </div>
  );
}

function SumCard({ label, value, tone }: { label: string; value: string; tone: number }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={"mt-1 text-xl font-bold num " + signClass(tone)}>{value}</p>
    </div>
  );
}
