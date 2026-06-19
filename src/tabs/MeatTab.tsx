import { MEAT_CATEGORIES, useCalc, useModel } from "@/store/model";
import { Section } from "@/components/Section";
import { NumberField } from "@/components/NumberField";
import { KpiCard } from "@/components/KpiCard";
import { fmtKg, fmtMln, fmtPerKg, fmtRub, signClass } from "@/lib/format";
import { Beef, TrendingUp, Coins } from "lucide-react";

export function MeatTab() {
  const s = useModel();
  const c = useCalc();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <KpiCard title="Выручка мяса" value={fmtMln(c.revenue_meat_total)} icon={<Coins size={26}/>} accent="meat"/>
        <KpiCard title="СС мяса" value={fmtMln(c.cost_meat_total)} icon={<Beef size={26}/>} accent="meat"/>
        <KpiCard title="Результат мяса" value={fmtMln(c.result_meat_total)} tone={c.result_meat_total >= 0 ? "positive" : "negative"} icon={<TrendingUp size={26}/>} accent="meat"/>
        <KpiCard title="На 1 кг молока" value={`${fmtPerKg(c.revenue_meat_per_kg - c.cost_meat_per_kg)} ₽/кг`} subtitle={`выр ${fmtPerKg(c.revenue_meat_per_kg)} − СС ${fmtPerKg(c.cost_meat_per_kg)}`} accent="meat"/>
      </div>

      {/* Коэффициенты */}
      <Section title="К мяса" accent="meat">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <NumberField label="К изменения выручки мяса" value={s.revenue_meat_coeff} onChange={(v) => s.setField("revenue_meat_coeff", v)} step={0.01}/>
          <NumberField label="К изменения себестоимости мяса" value={s.cost_meat_coeff} onChange={(v) => s.setField("cost_meat_coeff", v)} step={0.01}/>
        </div>
      </Section>

      {/* Таблица 6 категорий */}
      <Section title="Мясо и мясопродукция" accent="meat">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr className="border-b">
                <th className="py-2 px-2 text-left font-medium min-w-[200px]">Категория</th>
                <th className="py-2 px-2 text-center font-medium">Голов</th>
                <th className="py-2 px-2 text-center font-medium">Вес/гол, кг</th>
                <th className="py-2 px-2 text-right font-medium">Кг всего</th>
                <th className="py-2 px-2 text-center font-medium">Цена 2025, /кг</th>
                <th className="py-2 px-2 text-right font-medium">Цена 2026</th>
                <th className="py-2 px-2 text-right font-medium">/гол 2026</th>
                <th className="py-2 px-2 text-right font-medium">Выручка</th>
                <th className="py-2 px-2 text-center font-medium">СС 2025, /кг</th>
                <th className="py-2 px-2 text-right font-medium">СС 2026</th>
                <th className="py-2 px-2 text-right font-medium">СС всего</th>
                <th className="py-2 px-2 text-right font-medium">Результат</th>
              </tr>
            </thead>
            <tbody className="num">
              {c.meatRows.map((m) => {
                const cat = MEAT_CATEGORIES.find(k => k.key === m.key)!;
                return (
                  <tr key={m.key} className="border-b border-border/50 hover:bg-tab-meat-soft/30">
                    <td className="py-1.5 px-2">
                      <div className="font-medium text-foreground">{m.name}</div>
                      <div className="text-[10px] text-muted-foreground">{cat.note}</div>
                    </td>
                    <td className="py-1.5 px-1 w-28"><NumberField value={s.meat[m.key].heads} onChange={(v) => s.setMeatField(m.key, "heads", v)} step={1} inputClassName="pr-2"/></td>
                    <td className="py-1.5 px-1 w-28"><NumberField value={s.meat[m.key].weight_per_head} onChange={(v) => s.setMeatField(m.key, "weight_per_head", v)} step={1} decimals={2} inputClassName="pr-2"/></td>
                    <td className="py-1.5 px-2 text-right text-muted-foreground">{fmtKg(m.volume_kg)}</td>
                    <td className="py-1.5 px-1 w-28"><NumberField value={s.meat[m.key].price_2025} onChange={(v) => s.setMeatField(m.key, "price_2025", v)} step={1} decimals={2} inputClassName="pr-2"/></td>
                    <td className="py-1.5 px-2 text-right">{fmtPerKg(m.price_2026)}</td>
                    <td className="py-1.5 px-2 text-right text-muted-foreground">{fmtRub(m.price_per_head)}</td>
                    <td className="py-1.5 px-2 text-right font-medium">{fmtRub(m.revenue)}</td>
                    <td className="py-1.5 px-1 w-28"><NumberField value={s.meat[m.key].cost_2025} onChange={(v) => s.setMeatField(m.key, "cost_2025", v)} step={1} decimals={2} inputClassName="pr-2"/></td>
                    <td className="py-1.5 px-2 text-right">{fmtPerKg(m.cost_2026)}</td>
                    <td className="py-1.5 px-2 text-right font-medium">{fmtRub(m.cost_total)}</td>
                    <td className={"py-1.5 px-2 text-right font-semibold " + signClass(m.result)}>{fmtRub(m.result)}</td>
                  </tr>
                );
              })}
              <tr className="border-t-2 border-foreground/30 font-bold bg-tab-meat-soft/40">
                <td className="py-3 px-2" colSpan={7}>ИТОГО</td>
                <td className="py-3 px-2 text-right">{fmtRub(c.revenue_meat_total)}</td>
                <td className="py-3 px-2"></td>
                <td className="py-3 px-2"></td>
                <td className="py-3 px-2 text-right">{fmtRub(c.cost_meat_total)}</td>
                <td className={"py-3 px-2 text-right " + signClass(c.result_meat_total)}>{fmtRub(c.result_meat_total)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-lg border bg-tab-meat-soft p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Выручка</p>
            <p className="text-2xl font-bold num text-tab-meat">{fmtPerKg(c.revenue_meat_per_kg)} ₽/кг молока</p>
            <p className="text-xs text-muted-foreground">→ Дашборд, Помесячно</p>
          </div>
          <div className="rounded-lg border bg-tab-meat-soft p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Себестоимость</p>
            <p className="text-2xl font-bold num text-tab-meat">{fmtPerKg(c.cost_meat_per_kg)} ₽/кг молока</p>
            <p className="text-xs text-muted-foreground">→ Дашборд, Помесячно</p>
          </div>
        </div>
      </Section>
    </div>
  );
}
