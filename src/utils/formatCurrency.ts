/**
 * 通貨に応じた数値フォーマット
 */
export function formatCurrency(
  amount: number,
  currency: string,
  language: string
): string {
  const locale = language === 'ja' ? 'ja-JP' : 'en-US';
  const currencyCode = currency === 'JPY' ? 'JPY' : 'USD';

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(amount);
}

/**
 * グラフ用の短縮フォーマット（万円/K$表示）
 */
export function formatCurrencyShort(
  amount: number,
  currency: string,
  currencySymbol: string,
  unitLarge: string
): string {
  const divisor = currency === 'JPY' ? 10000 : 1000;
  const shortened = (amount / divisor).toFixed(0);
  return `${currencySymbol}${shortened}${unitLarge}`;
}

/**
 * 数値のみのフォーマット（カンマ区切り）
 */
export function formatNumber(amount: number, language: string): string {
  const locale = language === 'ja' ? 'ja-JP' : 'en-US';
  return new Intl.NumberFormat(locale).format(amount);
}
