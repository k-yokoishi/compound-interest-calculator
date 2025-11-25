import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactGA from 'react-ga4';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculateCompoundInterest, CalculationParams } from './utils/calculation';
import { saveParams, loadParams, SavedParams } from './utils/storage';
import { formatCurrency, formatCurrencyShort } from './utils/formatCurrency';
import { detectCurrency } from './i18n/config';
import LanguageSwitcher from './components/LanguageSwitcher';
import './App.css';

function App() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Google Analyticsでページビューを送信
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname + window.location.search });
  }, []);

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

  // 通貨は言語から自動算出
  const currency = useMemo(() => {
    return detectCurrency(i18n.language);
  }, [i18n.language]);

  // パラメータが変更されたらクエリパラメータとlocalStorageを更新
  useEffect(() => {
    const params: SavedParams = {
      initialAmount,
      monthlyAmount,
      annualRate,
      years,
      language: i18n.language,
      currency,
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
  }, [initialAmount, monthlyAmount, annualRate, years, currency, i18n.language, setSearchParams]);

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

  // 通貨記号と単位を取得
  const currencySymbol = t('currency.symbol');
  const unitLarge = t('currency.unitLarge');

  return (
    <div className="app">
      <a
        href="https://github.com/k-yokoishi/compound-interest-calculator"
        target="_blank"
        rel="noopener noreferrer"
        className="github-corner"
        aria-label="View source on GitHub"
      >
        <img src="./github-mark/github-mark.svg" alt="GitHub" />
      </a>

      <h1>{t('app.title')}</h1>

      <LanguageSwitcher />

      <div className="input-section">
        <div className="input-group">
          <label htmlFor="initialAmount">{t('input.initialAmount')} ({t('currency.name')})</label>
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
          <label htmlFor="monthlyAmount">{t('input.monthlyAmount')} ({t('currency.name')})</label>
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
          <label htmlFor="annualRate">{t('input.annualRate')} (%)</label>
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
          <label htmlFor="years">{t('input.years')}</label>
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
          <h2>{t('result.finalResult')}</h2>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="label">{t('result.principal')}</span>
              <span className="value">{formatCurrency(finalResult.principal, currency, i18n.language)}</span>
            </div>
            <div className="summary-item">
              <span className="label">{t('result.interest')}</span>
              <span className="value">{formatCurrency(finalResult.interest, currency, i18n.language)}</span>
            </div>
            <div className="summary-item">
              <span className="label">{t('result.total')}</span>
              <span className="value total">{formatCurrency(finalResult.total, currency, i18n.language)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="chart-section">
        <h2>{t('chart.title')}</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 60, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                label={{ value: t('chart.year'), position: 'insideBottom', offset: -10 }}
              />
              <YAxis
                tickFormatter={(value) => formatCurrencyShort(value, currency, currencySymbol, unitLarge)}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value, currency, i18n.language)}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="principal" stackId="a" fill="#4A90E2" name={t('chart.principalBar')} />
              <Bar dataKey="interest" stackId="a" fill="#F5A623" name={t('chart.interestBar')} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="no-data">{t('chart.noData')}</p>
        )}
      </div>
    </div>
  );
}

export default App;
