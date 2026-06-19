import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NumberFieldProps {
  label?: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
  step?: number;
  className?: string;
  inputClassName?: string;
  hint?: string;
  decimals?: number;
}

/** Форматирование числа с разделителями разрядов (пробел) и запятой как десятичный разделитель. */
const formatDisplay = (n: number, decimals?: number): string => {
  if (!Number.isFinite(n)) return "";
  const abs = Math.abs(n);
  const fixed = decimals !== undefined ? abs.toFixed(decimals) : abs.toString();
  const [intPart, decPart] = fixed.split(".");
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const sign = n < 0 ? "−" : "";
  return decPart ? `${sign}${grouped},${decPart}` : `${sign}${grouped}`;
};

/** Парсинг строки с пробелами/запятой обратно в число. */
const parseInput = (s: string): number => {
  if (s.trim() === "" || s === "-" || s === "−") return 0;
  // Убираем пробелы (обычные, неразрывные, узкие), заменяем запятую на точку, минус на ASCII
  const cleaned = s
    .replace(/[\s\u00A0\u202F]/g, "")
    .replace(",", ".")
    .replace("−", "-");
  const v = Number(cleaned);
  return isNaN(v) ? 0 : v;
};

/** Числовое поле ввода с локализацией. Хранит число; отображает с разделителями разрядов. */
export function NumberField({
  label, value, onChange, suffix, step: _step, className, inputClassName, hint, decimals,
}: NumberFieldProps) {
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState<string>(formatDisplay(value, decimals));

  // Синхронизация при внешнем изменении value (когда поле не в фокусе)
  useEffect(() => {
    if (!focused) setDraft(formatDisplay(value, decimals));
  }, [value, focused, decimals]);

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <Label className="text-xs font-medium text-muted-foreground">{label}</Label>}
      <div className="relative">
        <Input
          type="text"
          inputMode="decimal"
          value={draft}
          onFocus={() => setFocused(true)}
          onChange={(e) => {
            const raw = e.target.value;
            setDraft(raw);
            onChange(parseInput(raw));
          }}
          onBlur={() => {
            setFocused(false);
            setDraft(formatDisplay(value, decimals));
          }}
          className={cn("num text-right pr-12 h-9", inputClassName)}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}
