export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function formatCompactNumber(value: number) {
  return Intl.NumberFormat("en", { notation: "compact" }).format(value);
}

