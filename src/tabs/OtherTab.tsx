import { useCalc, useModel } from "@/store/model";
import { Section } from "@/components/Section";
import { NumberField } from "@/components/NumberField";
import { KpiCard } from "@/components/KpiCard";
import { fmtMln, fmtPerKg, fmtRub } from "@/lib/format";
import { Wallet, Building2, HandCoins } from "lucide-react";

export function OtherTab() {
  const s = useModel();
  const c = useCalc();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiCard title="Субсидии 2026" value={fmtMln(s.subsidies_2026_total)} subtitle={`${fmtPerKg(c.subsidies_per_kg)} ₽/кг молока`} icon={<HandCoins size={26}/>} accent="other"/>
        <KpiCard title="Общехозяйственные расходы 2026" value={fmtMln(c.oxr_2026)} subtitle={`${fmtPerKg(c.oxr_per_kg)} ₽/кг молока`} icon={<Building2 size={26}/>} accent="other"/>
        <KpiCard title="Инвестиции (всего)" value={fmtMln(c.total_investments)} subtitle="ОС + молодняк + кредит" icon={<Wallet size={26}/>} accent="other"/>
      </div>

      <Section title="Субсидии и прочие доходы" accent="other">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <NumberField label="Субсидии 2026, ₽/год" value={s.subsidies_2026_total} onChange={(v) => s.setField("subsidies_2026_total", v)} step={1_000_000} suffix="₽"/>
          <div className="rounded-lg border bg-tab-other-soft p-4">
            <p className="text-xs uppercase text-muted-foreground">Субсидии на 1 кг</p>
            <p className="text-xl font-bold num text-tab-other">{fmtPerKg(c.subsidies_per_kg)} ₽/кг</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border-2 border-tab-other bg-tab-other-soft p-4">
            <p className="text-xs uppercase text-muted-foreground">Прочие доходы 2026, ₽/год</p>
            <p className="text-base font-bold num text-tab-other">{fmtRub(c.other_revenue_total)} ₽</p>
          </div>
          <div className="rounded-lg border bg-tab-other-soft p-4">
            <p className="text-xs uppercase text-muted-foreground">Прочие доходы на 1 кг</p>
            <p className="text-xl font-bold num text-tab-other">{fmtPerKg(c.other_revenue_per_kg)} ₽/кг</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <NumberField label="Продажа ОС, ₽/год" value={s.other_revenue_items.sale_os} onChange={(v) => s.setField("other_revenue_items", { ...s.other_revenue_items, sale_os: v })} step={100_000} suffix="₽"/>
          <NumberField label="Страховое возмещение, ₽/год" value={s.other_revenue_items.insurance} onChange={(v) => s.setField("other_revenue_items", { ...s.other_revenue_items, insurance: v })} step={100_000} suffix="₽"/>
          <NumberField label="Прочие, ₽/год" value={s.other_revenue_items.other} onChange={(v) => s.setField("other_revenue_items", { ...s.other_revenue_items, other: v })} step={100_000} suffix="₽"/>
        </div>
      </Section>

      <Section title="Прочие расходы" accent="other"
        description="Сумма статей 2025 ÷ объём молока 2025 = ₽/кг. Прочие 2026 = ₽/кг × коэф. инфляции">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <NumberField label="Списание маст. молока, ₽/год" value={s.other_costs_items.mastit_milk} onChange={(v) => s.setField("other_costs_items", { ...s.other_costs_items, mastit_milk: v })} step={100_000} suffix="₽"/>
          <NumberField label="Продажа ОС, ₽/год" value={s.other_costs_items.sale_os} onChange={(v) => s.setField("other_costs_items", { ...s.other_costs_items, sale_os: v })} step={100_000} suffix="₽"/>
          <NumberField label="% кредит, ₽/год" value={s.other_costs_items.credit_percent} onChange={(v) => s.setField("other_costs_items", { ...s.other_costs_items, credit_percent: v })} step={100_000} suffix="₽"/>
          <NumberField label="Потери корма, ₽/год" value={s.other_costs_items.feed_loss} onChange={(v) => s.setField("other_costs_items", { ...s.other_costs_items, feed_loss: v })} step={100_000} suffix="₽"/>
          <NumberField label="Потери (гибель посевов), ₽/год" value={s.other_costs_items.crops_loss} onChange={(v) => s.setField("other_costs_items", { ...s.other_costs_items, crops_loss: v })} step={100_000} suffix="₽"/>
          <NumberField label="Прочие, ₽/год" value={s.other_costs_items.other} onChange={(v) => s.setField("other_costs_items", { ...s.other_costs_items, other: v })} step={100_000} suffix="₽"/>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border-2 border-tab-other bg-tab-other-soft p-4">
            <p className="text-xs uppercase text-muted-foreground">Прочие расходы 2025</p>
            <p className="text-base font-bold num text-tab-other">{fmtRub(c.other_costs_2025_total)} ₽</p>
            <p className="text-xs text-muted-foreground">{fmtPerKg(c.other_costs_2025_per_kg)} ₽/кг молока</p>
          </div>
          <NumberField label="К инфляции прочих и общехозяйственных расходов" value={s.inflation_other_coeff} onChange={(v) => s.setField("inflation_other_coeff", v)} step={0.01}/>
          <div className="rounded-lg border bg-tab-other-soft p-4">
            <p className="text-xs uppercase text-muted-foreground">Прочие расходы 2026</p>
            <p className="text-xl font-bold num text-tab-other">{fmtPerKg(c.other_costs_2026)} ₽/кг</p>
          </div>
        </div>
      </Section>

      <Section title="Общехозяйственные расходы" accent="other">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <NumberField label="Общехозяйственные расходы 2025, ₽/год" value={s.oxr_2025} onChange={(v) => s.setField("oxr_2025", v)} step={100_000} suffix="₽"/>
          <div className="rounded-lg border bg-tab-other-soft p-4">
            <p className="text-xs uppercase text-muted-foreground">Общехозяйственные расходы 2026</p>
            <p className="text-xl font-bold num text-tab-other">{fmtRub(c.oxr_2026)} ₽</p>
            <p className="text-xs text-muted-foreground">{fmtPerKg(c.oxr_per_kg)} ₽/кг молока</p>
          </div>
        </div>
      </Section>

      <Section title="Инвестиционная составляющая" accent="other"
        description="Инвестиции вычитаются из результата производства для получения итога после инвестиций">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <div className="inline-flex rounded-md border bg-background p-0.5 text-xs">
              <button
                type="button"
                onClick={() => s.setField("invest_1_source", "calc")}
                className={`px-2 py-1 rounded ${s.invest_1_source === "calc" ? "bg-tab-other text-white" : "text-muted-foreground"}`}
              >
                Из расчёта
              </button>
              <button
                type="button"
                onClick={() => s.setField("invest_1_source", "manual")}
                className={`px-2 py-1 rounded ${s.invest_1_source === "manual" ? "bg-tab-other text-white" : "text-muted-foreground"}`}
              >
                Вручную
              </button>
            </div>
            {s.invest_1_source === "calc" ? (
              <div className="rounded-lg border bg-tab-other-soft p-4">
                <p className="text-xs uppercase text-muted-foreground">Основные средства</p>
                <p className="text-xl font-bold num text-tab-other">{fmtRub(c.invest_1_fixed_assets_calc)} ₽</p>
                <p className="text-[11px] text-muted-foreground mt-1">из вкладки «Расчёт инвест»</p>
              </div>
            ) : (
              <NumberField label="Основные средства, ₽" value={s.invest_1_fixed_assets} onChange={(v) => s.setField("invest_1_fixed_assets", v)} step={1_000_000} suffix="₽"/>
            )}
          </div>
          <div className="space-y-2">
            <div className="inline-flex rounded-md border bg-background p-0.5 text-xs">
              <button
                type="button"
                onClick={() => s.setField("invest_2_source", "calc")}
                className={`px-2 py-1 rounded ${s.invest_2_source === "calc" ? "bg-tab-other text-white" : "text-muted-foreground"}`}
              >
                Из расчёта
              </button>
              <button
                type="button"
                onClick={() => s.setField("invest_2_source", "manual")}
                className={`px-2 py-1 rounded ${s.invest_2_source === "manual" ? "bg-tab-other text-white" : "text-muted-foreground"}`}
              >
                Вручную
              </button>
            </div>
            {s.invest_2_source === "calc" ? (
              <div className="rounded-lg border bg-tab-other-soft p-4">
                <p className="text-xs uppercase text-muted-foreground">Молодняк</p>
                <p className="text-xl font-bold num text-tab-other">{fmtRub(c.invest_2_young_cattle_calc)} ₽</p>
                <p className="text-[11px] text-muted-foreground mt-1">из вкладки «Расчёт инвест»</p>
              </div>
            ) : (
              <NumberField label="Молодняк, ₽" value={s.invest_2_young_cattle} onChange={(v) => s.setField("invest_2_young_cattle", v)} step={1_000_000} suffix="₽"/>
            )}
          </div>
          <NumberField label="Кредит (основной долг)" value={s.invest_3_credit} onChange={(v) => s.setField("invest_3_credit", v)} step={1_000_000} suffix="₽"/>
        </div>
        <div className="mt-4 rounded-lg border-2 border-tab-other bg-tab-other-soft p-4">
          <p className="text-xs uppercase text-muted-foreground">Всего инвестиций</p>
          <p className="text-2xl font-bold num text-tab-other">{fmtRub(c.total_investments)} ₽</p>
        </div>
      </Section>
    </div>
  );
}
