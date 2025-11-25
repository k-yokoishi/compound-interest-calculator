import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-switcher">
      <div className="switcher-group">
        <label className="switcher-label">🌐</label>
        <select
          value={i18n.language}
          onChange={(e) => changeLanguage(e.target.value)}
          className="switcher-select"
        >
          <option value="ja">{t('language.ja')}</option>
          <option value="en">{t('language.en')}</option>
        </select>
      </div>
    </div>
  );
}

export default LanguageSwitcher;
