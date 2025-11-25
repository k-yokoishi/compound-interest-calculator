import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

interface LanguageSwitcherProps {
  currency: string;
  onCurrencyChange: (currency: string) => void;
}

function LanguageSwitcher({ currency, onCurrencyChange }: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // 言語変更時に対応する通貨も自動変更
    const newCurrency = lng === 'ja' ? 'JPY' : 'USD';
    onCurrencyChange(newCurrency);
  };

  const toggleCurrency = () => {
    const newCurrency = currency === 'JPY' ? 'USD' : 'JPY';
    onCurrencyChange(newCurrency);
  };

  return (
    <div className="language-switcher">
      <div className="switcher-group">
        <label className="switcher-label">🌐 Language:</label>
        <select
          value={i18n.language}
          onChange={(e) => changeLanguage(e.target.value)}
          className="switcher-select"
        >
          <option value="ja">{t('language.ja')}</option>
          <option value="en">{t('language.en')}</option>
        </select>
      </div>

      <div className="switcher-group">
        <label className="switcher-label">💱 Currency:</label>
        <button onClick={toggleCurrency} className="currency-button">
          {currency}
        </button>
      </div>
    </div>
  );
}

export default LanguageSwitcher;
