import { MONTHS, useCalc, useModel, DAYS_IN_MONTH } from "@/store/model";
import { Section } from "@/components/Section";
import { NumberField } from "@/components/NumberField";
import { KpiCard } from "@/components/KpiCard";
import { fmtKg, fmtMln, fmtPerKg, fmtRub } from "@/lib/format";
import { Milk, Calendar, Coins, Users } from "lucide-react";

export function MilkTab() {
  const s = useModel();
  const c = useCalc();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Реализация молока" value={fmtKg(c.total_volume_kg) + " кг"} subtitle={`Товарность ${fmtPerKg(s.milk_marketability_pct)}%`} icon={<Calendar size={26}/>} accent="milk"/>
        <KpiCard title="Фактический надой" value={fmtKg(c.total_production_kg) + " кг"} subtitle={`${fmtKg(s.milk_herd_heads)} голов`} icon={<Users size={26}/>} accent="milk"/>
        <KpiCard title="Выручка молока" value={fmtMln(c.revenue_milk_total)} subtitle={`в т.ч. надбавка за жир: ${fmtMln(c.fat_premium_total)}`} icon={<Coins size={26}/>} accent="milk"/>
        <KpiCard title="СС 1 кг молока" value={`${fmtPerKg(c.cost_milk_2026)} ₽/кг`} subtitle={`Общие затраты: ${fmtMln(c.cost_milk_total)}`} icon={<Milk size={26}/>} accent="milk"/>
      </div>

      <Section title="Цена и реализация молока" accent="milk"
        description="Результат = выручка от реализованного молока − полная себестоимость молока. Фактический надой используется только для расчёта СС 1 кг.">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr className="border-b">
                <th className="py-2 text-left font-medium">Месяц</th>
                <th className="py-2 text-center font-medium w-28">База, ₽/кг</th>
                <th className="py-2 text-center font-medium w-24">Жир, %</th>
                <th className="py-2 text-right font-medium w-24">Надбавка</th>
                <th className="py-2 text-right font-medium w-24">Цена итог</th>
                <th className="py-2 text-center font-medium w-36">Реализация, кг/день</th>
                <th className="py-2 text-right font-medium">Дней</th>
                <th className="py-2 text-right font-medium">Реализация, кг</th>
                <th className="py-2 text-right font-medium">Выручка, ₽</th>
                <th className="py-2 text-right font-medium">СС молока, ₽</th>
                <th className="py-2 text-right font-medium">Результат, ₽</th>
              </tr>
            </thead>
            <tbody className="num">
              {MONTHS.map((m, i) => {
                const mc = c.monthly[i];
                const resultMilk = mc.revenue_milk - mc.milk_cost_total;
                return (
                  <tr key={m} className="border-b border-border/50">
                    <td className="py-1.5 font-medium">{m}</td>
                    <td className="py-1.5 px-2"><NumberField value={s.price_milk_m[i]} onChange={(x) => s.setPriceMilk(i, x)} step={0.5} suffix="₽"/></td>
                    <td className="py-1.5 px-2"><NumberField value={s.fat_m[i]} onChange={(x) => s.setFat(i, x)} step={0.1} suffix="%"/></td>
                    <td className="py-1.5 text-right text-emerald-600 font-medium">{mc.fat_premium > 0 ? `+${mc.fat_premium.toFixed(2)}` : "—"}</td>
                    <td className="py-1.5 text-right font-semibold">{mc.effective_price.toFixed(2)}</td>
                    <td className="py-1.5 px-2"><NumberField value={s.daily_volume_m[i]} onChange={(x) => s.setDailyVolume(i, x)} step={100} suffix="кг"/></td>
                    <td className="py-1.5 text-right text-muted-foreground">{DAYS_IN_MONTH[i]}</td>
                    <td className="py-1.5 text-right">{fmtKg(mc.volume)}</td>
                    <td className="py-1.5 text-right font-medium">{fmtRub(mc.revenue_milk)}</td>
                    <td className="py-1.5 text-right">{fmtRub(mc.milk_cost_total)}</td>
                    <td className={`py-1.5 text-right font-medium ${resultMilk >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{fmtRub(resultMilk)}</td>
                  </tr>
                );
              })}
              <tr className="border-t-2 border-foreground/30 font-bold bg-tab-milk-soft/40">
                <td className="py-3" colSpan={3}>ИТОГО за год</td>
                <td className="py-3 text-right text-emerald-600">+{fmtRub(c.fat_premium_total)}</td>
                <td className="py-3 text-right" colSpan={3}>—</td>
                <td className="py-3 text-right">{fmtKg(c.total_volume_kg)}</td>
                <td className="py-3 text-right">{fmtRub(c.revenue_milk_total)}</td>
                <td className="py-3 text-right">{fmtRub(c.cost_milk_total)}</td>
                <td className={`py-3 text-right ${c.revenue_milk_total - c.cost_milk_total >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{fmtRub(c.revenue_milk_total - c.cost_milk_total)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Параметры себестоимости молока" accent="milk"
        description="База — 2025 год: корма — переменная часть по поголовью; все остальные статьи — постоянная часть.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <NumberField label="Товарность, %" value={s.milk_marketability_pct} onChange={(v) => s.setField("milk_marketability_pct", v)} step={0.1} suffix="%"/>
          <NumberField label="Поголовье, голов" value={s.milk_herd_heads} onChange={(v) => s.setField("milk_herd_heads", v)} step={1} suffix="гол"/>
          <NumberField label="Коэф. инфляции" value={s.cost_milk_coeff} onChange={(v) => s.setField("cost_milk_coeff", v)} step={0.01}/>
          <NumberField label="Корма 2025, ₽/год" value={s.feed_cost_milk_2025_total} onChange={(v) => s.setField("feed_cost_milk_2025_total", v)} step={1_000_000} suffix="₽"/>
          <NumberField label="Постоянные расходы 2025, ₽/год" value={s.fixed_cost_milk_2025_total} onChange={(v) => s.setField("fixed_cost_milk_2025_total", v)} step={1_000_000} suffix="₽"/>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <CostCard label="Корма 2026" value={c.feed_cost_milk_2026_total} note={`${fmtRub(c.feed_cost_milk_2026_total / Math.max(s.milk_herd_heads, 1))} ₽/гол/год`}/>
          <CostCard label="Постоянные расходы 2026" value={c.fixed_cost_milk_2026_total} note="не зависят от надоя и поголовья"/>
          <CostCard label="СС молока 2026" value={c.cost_milk_total} note={`${fmtPerKg(c.cost_milk_2026)} ₽/кг фактического надоя`} strong/>
        </div>
      </Section>
    </div>
  );
}

function CostCard({ label, value, note, strong = false }: { label: string; value: number; note: string; strong?: boolean }) {
  return (
    <div className={`rounded-lg border p-4 ${strong ? "border-2 border-tab-milk bg-tab-milk-soft" : "bg-tab-milk-soft/50"}`}>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 text-xl font-bold num text-tab-milk">{fmtRub(value)} ₽</p>
      <p className="mt-1 text-xs text-muted-foreground">{note}</p>
    </div>
  );
}
