import { useCalc, useModel } from "@/store/model";
import { Section } from "@/components/Section";
import { KpiCard } from "@/components/KpiCard";
import { fmtRub, fmtMln, fmtKg, fmtPerKg } from "@/lib/format";
import { Target, TrendingUp, Coins } from "lucide-react";

export function BreakevenTab() {
  const s = useModel();
  const c = useCalc();

  // Все доходы кроме молока (на 1 кг молока)
  const extras_revenue_per_kg =
    c.revenue_meat_per_kg + c.subsidies_per_kg + c.other_revenue_per_kg;

  // Все затраты на 1 кг молока
  const total_cost_per_kg =
    c.cost_milk_2026 + c.cost_meat_per_kg + c.other_costs_2026 + c.oxr_per_kg;

  // Точка безубыточности по результату производства (result = 0)
  const breakeven_price = total_cost_per_kg - extras_revenue_per_kg;

  // Точка безубыточности с учётом инвестиций (result − инвестиции = 0)
  const invest_per_kg = c.total_volume_kg > 0 ? c.total_investments / c.total_volume_kg : 0;
  const breakeven_price_with_invest = breakeven_price + invest_per_kg;

  // Текущая средняя цена молока
  const current_avg_price =
    c.total_volume_kg > 0 ? c.revenue_milk_total / c.total_volume_kg : 0;

  const margin_to_breakeven = current_avg_price - breakeven_price;
  const margin_to_breakeven_with_invest = current_avg_price - breakeven_price_with_invest;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiCard
          title="Текущая средняя цена молока"
          value={fmtPerKg(current_avg_price) + " ₽/кг"}
          subtitle={`Выручка ${fmtMln(c.revenue_milk_total)} / объём ${fmtKg(c.total_volume_kg)} кг`}
          icon={<Coins size={26} />}
          accent="milk"
        />
        <KpiCard
          title="Цена безубыточности"
          value={fmtPerKg(breakeven_price) + " ₽/кг"}
          subtitle="Результат производства = 0"
          icon={<Target size={26} />}
          accent="milk"
        />
        <KpiCard
          title="Цена с учётом инвестиций"
          value={fmtPerKg(breakeven_price_with_invest) + " ₽/кг"}
          subtitle="Покрывает инвестиции"
          icon={<TrendingUp size={26} />}
          accent="milk"
        />
      </div>

      <Section
        title="Расчёт цены молока для точки безубыточности"
        accent="milk"
        description="Цена безубыточности = Все затраты на 1 кг − Все доходы кроме молока на 1 кг"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr className="border-b">
                <th className="py-2 text-left font-medium">Статья</th>
                <th className="py-2 text-right font-medium">Сумма, ₽</th>
                <th className="py-2 text-right font-medium">₽/кг молока</th>
              </tr>
            </thead>
            <tbody className="num">
              <tr className="border-b border-border/50">
                <td className="py-2 font-medium">СС реализованного молока</td>
                <td className="py-2 text-right">{fmtRub(c.cost_milk_total)}</td>
                <td className="py-2 text-right">{fmtPerKg(c.cost_milk_2026)}</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 font-medium">СС мяса</td>
                <td className="py-2 text-right">{fmtRub(c.cost_meat_total)}</td>
                <td className="py-2 text-right">{fmtPerKg(c.cost_meat_per_kg)}</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 font-medium">Прочие расходы</td>
                <td className="py-2 text-right">{fmtRub(c.other_costs_2026 * c.total_volume_kg)}</td>
                <td className="py-2 text-right">{fmtPerKg(c.other_costs_2026)}</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 font-medium">ОХР</td>
                <td className="py-2 text-right">{fmtRub(c.oxr_2026)}</td>
                <td className="py-2 text-right">{fmtPerKg(c.oxr_per_kg)}</td>
              </tr>
              <tr className="border-b-2 border-foreground/30 font-bold bg-tab-milk-soft/40">
                <td className="py-2.5">Итого затраты</td>
                <td className="py-2.5 text-right">
                  {fmtRub(c.cost_milk_total + c.cost_meat_total + c.other_costs_2026 * c.total_volume_kg + c.oxr_2026)}
                </td>
                <td className="py-2.5 text-right">{fmtPerKg(total_cost_per_kg)}</td>
              </tr>

              <tr className="border-b border-border/50">
                <td className="py-2 font-medium">− Выручка мяса</td>
                <td className="py-2 text-right">{fmtRub(c.revenue_meat_total)}</td>
                <td className="py-2 text-right">{fmtPerKg(c.revenue_meat_per_kg)}</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 font-medium">− Субсидии</td>
                <td className="py-2 text-right">{fmtRub(s.subsidies_2026_total)}</td>
                <td className="py-2 text-right">{fmtPerKg(c.subsidies_per_kg)}</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 font-medium">− Прочие доходы</td>
                <td className="py-2 text-right">{fmtRub(c.other_revenue_total)}</td>
                <td className="py-2 text-right">{fmtPerKg(c.other_revenue_per_kg)}</td>
              </tr>
              <tr className="border-b-2 border-foreground/30 font-bold bg-tab-milk-soft/40">
                <td className="py-2.5">Итого прочие доходы (вычитаются)</td>
                <td className="py-2.5 text-right">
                  {fmtRub(c.revenue_meat_total + s.subsidies_2026_total + c.other_revenue_total)}
                </td>
                <td className="py-2.5 text-right">{fmtPerKg(extras_revenue_per_kg)}</td>
              </tr>

              <tr className="border-t-2 border-tab-milk font-bold bg-tab-milk-soft/60">
                <td className="py-3 text-tab-milk">Цена молока для безубыточности</td>
                <td className="py-3 text-right text-muted-foreground text-xs">
                  результат производства = 0
                </td>
                <td className="py-3 text-right text-tab-milk text-lg">
                  {fmtPerKg(breakeven_price)} ₽/кг
                </td>
              </tr>

              <tr className="border-b border-border/50">
                <td className="py-2 font-medium">+ Инвестиции (нагрузка на 1 кг)</td>
                <td className="py-2 text-right">{fmtRub(c.total_investments)}</td>
                <td className="py-2 text-right">{fmtPerKg(invest_per_kg)}</td>
              </tr>
              <tr className="border-t-2 border-tab-milk font-bold bg-tab-milk-soft/60">
                <td className="py-3 text-tab-milk">Цена молока с учётом инвестиций</td>
                <td className="py-3 text-right text-muted-foreground text-xs">
                  результат − инвестиции = 0
                </td>
                <td className="py-3 text-right text-tab-milk text-lg">
                  {fmtPerKg(breakeven_price_with_invest)} ₽/кг
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Запас прочности по цене" accent="milk">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-tab-milk-soft p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Запас до безубыточности
            </p>
            <p className={`mt-2 text-2xl font-bold num ${margin_to_breakeven >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {fmtPerKg(margin_to_breakeven)} ₽/кг
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Текущая цена − цена безубыточности
            </p>
          </div>
          <div className="rounded-lg border bg-tab-milk-soft p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Запас с учётом инвестиций
            </p>
            <p className={`mt-2 text-2xl font-bold num ${margin_to_breakeven_with_invest >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {fmtPerKg(margin_to_breakeven_with_invest)} ₽/кг
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Текущая цена − цена с учётом инвестиций
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
