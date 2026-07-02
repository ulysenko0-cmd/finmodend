import { MONTHS, useCalc, useModel, DAYS_IN_MONTH } from "@/store/model";
import { Section } from "@/components/Section";
import { NumberField } from "@/components/NumberField";
import { KpiCard } from "@/components/KpiCard";
import { fmtKg, fmtMln, fmtPerKg, fmtRub } from "@/lib/format";
import { Milk, Calendar, Coins } from "lucide-react";

export function MilkTab() {
  const s = useModel();
  const c = useCalc();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiCard title="Годовой объём молока" value={fmtKg(c.total_volume_kg) + " кг"} icon={<Calendar size={26}/>} accent="milk"/>
        <KpiCard title="Выручка молока" value={fmtMln(c.revenue_milk_total)} subtitle={`в т.ч. надбавка за жир: ${fmtMln(c.fat_premium_total)}`} icon={<Coins size={26}/>} accent="milk"/>
        <KpiCard title="СС молока 2026 (всего)" value={fmtMln(c.cost_milk_total)} subtitle={`${fmtPerKg(c.cost_milk_2026)} ₽/кг × ${fmtKg(c.total_volume_kg)} кг`} icon={<Milk size={26}/>} accent="milk"/>
      </div>

      {/* Помесячная таблица ввода */}
      <Section title="Цена и среднедневная реализация" accent="milk">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr className="border-b">
                <th className="py-2 text-left font-medium">Месяц</th>
                <th className="py-2 text-center font-medium w-28">База, ₽/кг</th>
                <th className="py-2 text-center font-medium w-24">Жир, %</th>
                <th className="py-2 text-right font-medium w-24">Надбавка</th>
                <th className="py-2 text-right font-medium w-24">Цена итог</th>
                <th className="py-2 text-center font-medium w-36">Среднедн., кг/день</th>
                <th className="py-2 text-right font-medium">Дней</th>
                <th className="py-2 text-right font-medium">Объём, кг</th>
                <th className="py-2 text-right font-medium">Выручка, ₽</th>
                <th className="py-2 text-right font-medium">СС молока, ₽</th>
                <th className="py-2 text-right font-medium">Результат, ₽</th>
              </tr>
            </thead>
            <tbody className="num">
              {MONTHS.map((m, i) => {
                const mc = c.monthly[i];
                const costMilk = c.cost_milk_2026 * mc.volume;
                const resultMilk = mc.revenue_milk - costMilk;
                return (
                  <tr key={m} className="border-b border-border/50">
                    <td className="py-1.5 font-medium">{m}</td>
                    <td className="py-1.5 px-2">
                      <NumberField value={s.price_milk_m[i]} onChange={(x) => s.setPriceMilk(i, x)} step={0.5} suffix="₽"/>
                    </td>
                    <td className="py-1.5 px-2">
                      <NumberField value={s.fat_m[i]} onChange={(x) => s.setFat(i, x)} step={0.1} suffix="%"/>
                    </td>
                    <td className="py-1.5 text-right text-emerald-600 font-medium">
                      {mc.fat_premium > 0 ? `+${mc.fat_premium.toFixed(2)}` : "—"}
                    </td>
                    <td className="py-1.5 text-right font-semibold">{mc.effective_price.toFixed(2)}</td>
                    <td className="py-1.5 px-2">
                      <NumberField value={s.daily_volume_m[i]} onChange={(x) => s.setDailyVolume(i, x)} step={100} suffix="кг"/>
                    </td>
                    <td className="py-1.5 text-right text-muted-foreground">{DAYS_IN_MONTH[i]}</td>
                    <td className="py-1.5 text-right">{fmtKg(mc.volume)}</td>
                    <td className="py-1.5 text-right font-medium">{fmtRub(mc.revenue_milk)}</td>
                    <td className="py-1.5 text-right">{fmtRub(costMilk)}</td>
                    <td className={`py-1.5 text-right font-medium ${resultMilk >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{fmtRub(resultMilk)}</td>
                  </tr>
                );
              })}
              <tr className="border-t-2 border-foreground/30 font-bold bg-tab-milk-soft/40">
                <td className="py-3" colSpan={3}>ИТОГО за год</td>
                <td className="py-3 text-right text-emerald-600">+{fmtRub(c.fat_premium_total)}</td>
                <td className="py-3 text-right" colSpan={4}>{fmtKg(c.total_volume_kg)} кг</td>
                <td className="py-3 text-right">{fmtRub(c.revenue_milk_total)}</td>
                <td className="py-3 text-right">{fmtRub(c.cost_milk_total)}</td>
                <td className={`py-3 text-right ${c.revenue_milk_total - c.cost_milk_total >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{fmtRub(c.revenue_milk_total - c.cost_milk_total)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Параметры СС молока */}
      <Section title="Параметры себестоимости молока" accent="milk">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <NumberField label="СС 2025, ₽/кг" value={s.cost_milk_2025} onChange={(v) => s.setField("cost_milk_2025", v)} step={0.1} suffix="₽"/>
          <NumberField label="Коэф. инфляции" value={s.cost_milk_coeff} onChange={(v) => s.setField("cost_milk_coeff", v)} step={0.01}/>
          <div className="rounded-lg border bg-tab-milk-soft p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">СС 2026 (расчёт)</p>
            <p className="mt-2 text-2xl font-bold num text-tab-milk">{fmtPerKg(c.cost_milk_2026)} ₽/кг</p>
            <p className="mt-1 text-xs text-muted-foreground">Итого: {fmtRub(c.cost_milk_total)} ₽</p>
          </div>
        </div>
      </Section>
    </div>
  );
}
