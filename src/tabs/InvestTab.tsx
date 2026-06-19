import { useModel } from "@/store/model";
import { Section } from "@/components/Section";
import { NumberField } from "@/components/NumberField";
import { fmtRub } from "@/lib/format";

export function InvestTab() {
  const s = useModel();

  const purchase_no_vat =
    s.invest1_vat_coeff > 0 ? s.invest1_planned_purchase_with_vat / s.invest1_vat_coeff : 0;
  const invest1 = s.invest1_leasing_no_vat + purchase_no_vat - s.invest1_amortization_os;
  const total_invest_os = s.invest1_leasing_no_vat + purchase_no_vat;

  return (
    <div className="space-y-6 animate-fade-in">
      <Section
        title="Расчёт инвестирование ОС"
        accent="other"
        description="Инвестирование ОС = Лизинг без НДС + Плановая закупка без НДС − Амортизация ОС"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <NumberField
            label="Лизинг без НДС, ₽"
            value={s.invest1_leasing_no_vat}
            onChange={(v) => s.setField("invest1_leasing_no_vat", v)}
            step={1_000_000}
            suffix="₽"
          />
          <NumberField
            label="Плановая закупка ОС и кап.вложения в объекты с НДС, руб."
            value={s.invest1_planned_purchase_with_vat}
            onChange={(v) => s.setField("invest1_planned_purchase_with_vat", v)}
            step={1_000_000}
            suffix="₽"
          />
          <div className="rounded-lg border bg-tab-other-soft p-3">
            <p className="text-[11px] uppercase text-muted-foreground">
              Плановая закупка ОС и кап.вложения в объекты без НДС, руб.
            </p>
            <p className="text-lg font-bold num text-tab-other">
              {fmtRub(purchase_no_vat)} ₽
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              = Плановая закупка с НДС / {s.invest1_vat_coeff}
            </p>
          </div>
          <NumberField
            label="Амортизация ОС, ₽"
            value={s.invest1_amortization_os}
            onChange={(v) => s.setField("invest1_amortization_os", v)}
            step={1_000_000}
            suffix="₽"
          />
          <div className="rounded-lg border-2 border-tab-other bg-tab-other-soft p-4 md:col-span-2">
            <p className="text-xs uppercase text-muted-foreground">Общая сумма инвестиций</p>
            <p className="text-2xl font-bold num text-tab-other">
              {fmtRub(total_invest_os)} ₽
            </p>
          </div>
          <div className="rounded-lg border-2 border-tab-other bg-tab-other-soft p-4">
            <p className="text-xs uppercase text-muted-foreground">Инвестиции, входящие в СС (через амортизацию ОС)</p>
            <p className="text-2xl font-bold num text-tab-other">
              {fmtRub(s.invest1_amortization_os)} ₽
            </p>
          </div>
          <div className="rounded-lg border-2 border-tab-other bg-tab-other-soft p-4">
            <p className="text-xs uppercase text-muted-foreground">Инвестиции сверх амортизации ОС (за счет чистой прибыли)</p>
            <p className="text-2xl font-bold num text-tab-other">
              {fmtRub(invest1)} ₽
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">
              = Лизинг без НДС + Плановая закупка без НДС − Амортизация ОС
            </p>
          </div>
        </div>
      </Section>

      <Section
        title="Расчёт Молодняк"
        accent="other"
        description="Молодняк = Затраты на содержание молодняка − Списание затрат в текущем периоде"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <NumberField
            label="Затраты на содержание молодняка, ₽"
            value={s.invest2_young_costs}
            onChange={(v) => s.setField("invest2_young_costs", v)}
            step={1_000_000}
            suffix="₽"
          />
          <NumberField
            label="Списание затрат в текущем периоде, ₽"
            value={s.invest2_writeoff_current}
            onChange={(v) => s.setField("invest2_writeoff_current", v)}
            step={1_000_000}
            suffix="₽"
          />
          <div className="rounded-lg border-2 border-tab-other bg-tab-other-soft p-4 md:col-span-2">
            <p className="text-xs uppercase text-muted-foreground">Молодняк</p>
            <p className="text-2xl font-bold num text-tab-other">
              {fmtRub(s.invest2_young_costs - s.invest2_writeoff_current)} ₽
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">
              = Затраты на содержание молодняка − Списание затрат в текущем периоде
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
