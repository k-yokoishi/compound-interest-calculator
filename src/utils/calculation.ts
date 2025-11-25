export interface CalculationResult {
  month: number;
  principal: number;
  interest: number;
  total: number;
}

export interface CalculationParams {
  monthlyAmount: number;
  annualRate: number;
  years: number;
  months: number;
}

/**
 * 複利計算で積立投資の結果を計算
 */
export function calculateCompoundInterest(
  params: CalculationParams
): CalculationResult[] {
  const { monthlyAmount, annualRate, years, months } = params;
  const totalMonths = years * 12 + months;
  const monthlyRate = annualRate / 100 / 12;

  const results: CalculationResult[] = [];
  let currentTotal = 0;

  for (let month = 1; month <= totalMonths; month++) {
    // 前月の元利合計に今月の積立額を追加
    currentTotal += monthlyAmount;

    // 複利計算（現在の元利合計に対して利息を計算）
    const interestThisMonth = currentTotal * monthlyRate;
    currentTotal += interestThisMonth;

    // 元金と利益を分離して記録（小数点以下を四捨五入）
    const currentPrincipal = Math.round(monthlyAmount * month);
    const totalInterest = Math.round(currentTotal - currentPrincipal);

    results.push({
      month,
      principal: currentPrincipal,
      interest: totalInterest,
      total: Math.round(currentTotal),
    });
  }

  return results;
}
