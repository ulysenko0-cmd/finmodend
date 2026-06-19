// Утилиты форматирования чисел для финансовой модели
// Используем явное форматирование с разделителем разрядов (обычный пробел)
const formatNumber = (n: number, digits: number): string => {
  const fixed = Math.abs(n).toFixed(digits);
  const [intPart, decPart] = fixed.split(".");
  // Группируем целую часть по три цифры справа налево
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return decPart ? `${grouped},${decPart}` : grouped;
};

export const fmtRub = (n: number, digits = 2): string => {
  if (!isFinite(n)) return "—";
  const sign = n < 0 ? "−" : "";
  return sign + formatNumber(n, digits);
};

export const fmtMln = (n: number): string => {
  if (!isFinite(n)) return "—";
  const v = n / 1_000_000;
  const sign = v < 0 ? "−" : "";
  return sign + formatNumber(v, 2) + " млн";
};

export const fmtKg = (n: number): string => {
  if (!isFinite(n)) return "—";
  const sign = n < 0 ? "−" : "";
  return sign + formatNumber(n, 2);
};

export const fmtPerKg = (n: number): string => {
  if (!isFinite(n)) return "—";
  const sign = n < 0 ? "−" : "";
  return sign + formatNumber(n, 2);
};

export const fmtPct = (n: number): string => {
  if (!isFinite(n)) return "—";
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  return sign + formatNumber(n, 2) + "%";
};

export const signClass = (n: number): string => {
  if (n > 0) return "text-positive";
  if (n < 0) return "text-negative";
  return "text-foreground";
};
