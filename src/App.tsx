import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculateCompoundInterest, CalculationParams } from './utils/calculation';
import { saveParams, loadParams, SavedParams } from './utils/storage';
import './App.css';

function App() {
  const [searchParams, setSearchParams] = useSearchParams();

  // クエリパラメータまたはlocalStorageから初期値を取得
  const getInitialValue = (key: string, defaultValue: string): string => {
    const queryValue = searchParams.get(key);
    if (queryValue !== null) return queryValue;

    const saved = loadParams();
    if (saved && saved[key as keyof SavedParams]) {
      return saved[key as keyof SavedParams] || defaultValue;
    }

    return defaultValue;
  };

  const [initialAmount, setInitialAmount] = useState<string>(
    getInitialValue('initialAmount', '0')
  );
  const [monthlyAmount, setMonthlyAmount] = useState<string>(
    getInitialValue('monthlyAmount', '10000')
  );
  const [annualRate, setAnnualRate] = useState<string>(
    getInitialValue('annualRate', '3')
  );
  const [years, setYears] = useState<string>(
    getInitialValue('years', '10')
  );

  // パラメータが変更されたらクエリパラメータとlocalStorageを更新
  useEffect(() => {
    const params: SavedParams = {
      initialAmount,
      monthlyAmount,
      annualRate,
      years,
    };

    // クエリパラメータを更新
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('initialAmount', initialAmount);
    newSearchParams.set('monthlyAmount', monthlyAmount);
    newSearchParams.set('annualRate', annualRate);
    newSearchParams.set('years', years);
    setSearchParams(newSearchParams, { replace: true });

    // localStorageに保存
    saveParams(params);
  }, [initialAmount, monthlyAmount, annualRate, years, setSearchParams]);

  // 計算結果を取得
  const calculationResults = useMemo(() => {
    const initialAmountNum = parseFloat(initialAmount) || 0;
    const monthlyAmountNum = parseFloat(monthlyAmount) || 0;
    const annualRateNum = parseFloat(annualRate) || 0;
    const yearsNum = parseInt(years) || 0;

    if ((initialAmountNum === 0 && monthlyAmountNum <= 0) || annualRateNum < 0 || yearsNum === 0) {
      return [];
    }

    const params: CalculationParams = {
      initialAmount: initialAmountNum,
      monthlyAmount: monthlyAmountNum,
      annualRate: annualRateNum,
      years: yearsNum,
      months: 0,
    };

    return calculateCompoundInterest(params);
  }, [initialAmount, monthlyAmount, annualRate, years]);

  // グラフ用データを準備（年単位で集約）
  const chartData = useMemo(() => {
    if (calculationResults.length === 0) return [];

    const yearlyData: { [key: number]: { principal: number; interest: number; year: number } } = {};

    calculationResults.forEach((result) => {
      const year = Math.floor((result.month - 1) / 12) + 1;
      if (!yearlyData[year]) {
        yearlyData[year] = { principal: 0, interest: 0, year };
      }
      yearlyData[year].principal = result.principal;
      yearlyData[year].interest = result.interest;
    });

    return Object.values(yearlyData);
  }, [calculationResults]);

  const finalResult = calculationResults[calculationResults.length - 1];

  return (
    <div className="app">
      <h1>積立投資シミュレーター</h1>

      <div className="input-section">
        <div className="input-group">
          <label htmlFor="initialAmount">初期投資額（円）</label>
          <input
            id="initialAmount"
            type="number"
            min="0"
            step="10000"
            value={initialAmount}
            onChange={(e) => setInitialAmount(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="monthlyAmount">毎月の積立額（円）</label>
          <input
            id="monthlyAmount"
            type="number"
            min="0"
            step="1000"
            value={monthlyAmount}
            onChange={(e) => setMonthlyAmount(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="annualRate">想定年利（%）</label>
          <input
            id="annualRate"
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={annualRate}
            onChange={(e) => setAnnualRate(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="years">積立期間（年）</label>
          <input
            id="years"
            type="number"
            min="0"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </div>
      </div>

      {finalResult && (
        <div className="result-summary">
          <h2>最終結果</h2>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="label">元金合計</span>
              <span className="value">¥{finalResult.principal.toLocaleString()}</span>
            </div>
            <div className="summary-item">
              <span className="label">利益合計</span>
              <span className="value">¥{finalResult.interest.toLocaleString()}</span>
            </div>
            <div className="summary-item">
              <span className="label">総額</span>
              <span className="value total">¥{finalResult.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      <div className="chart-section">
        <h2>積立推移グラフ</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                label={{ value: '年', position: 'insideBottom', offset: -5 }}
              />
              <YAxis
                label={{ value: '金額（円）', angle: -90, position: 'insideLeft' }}
                tickFormatter={(value) => `¥${(value / 10000).toFixed(0)}万`}
              />
              <Tooltip
                formatter={(value: number) => `¥${value.toLocaleString()}`}
              />
              <Legend />
              <Bar dataKey="principal" stackId="a" fill="#4A90E2" name="元金" />
              <Bar dataKey="interest" stackId="a" fill="#F5A623" name="利益" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="no-data">パラメータを入力してください</p>
        )}
      </div>
    </div>
  );
}

export default App;
