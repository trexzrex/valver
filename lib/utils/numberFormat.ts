function formatValue(value: number, decimals: number): string {
  if (!Number.isFinite(value)) return '-';

  const absolute = Math.abs(value);
  if (absolute > 0 && absolute < 1) {
    const exponent = Math.floor(Math.log10(absolute));
    const leadingZeros = Math.max(0, -exponent - 1);
    if (leadingZeros > 5) {
      const coefficient = absolute / 10 ** exponent;
      const sign = value < 0 ? '-' : '';
      return `${sign}${coefficient.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: decimals })} × 10^${exponent}`;
    }
  }

  return value.toLocaleString('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatNumber(value: number, decimals: number = 6): string {
  return formatValue(value, decimals);
}

export function formatNumberFixed(value: number, decimals: number = 2): string {
  return formatValue(value, decimals);
}

export function formatPercent(value: number, decimals: number = 2): string {
  const formatted = formatValue(value, decimals);
  return formatted === '-' ? formatted : `${formatted}%`;
}

export function formatNumberOrDash(value: number | null | undefined, decimals: number = 6): string {
  return formatValue(value ?? NaN, decimals);
}