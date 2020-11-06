import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/footer.scss';

function Footer() {
  const availableLangs = ['fr', 'en'];
  const [t, i18n] = useTranslation();
  function handleLangChange(lang: string) {
    if (i18n.language === lang) {
      return;
    }
    localStorage.setItem('ytct_lang', lang);
    i18n.changeLanguage(lang);
  }
  return (
    <footer>
      <span className="credits">
        {t('commons.madeBy')}{' '}
        <a href="https://cyriaque.net" rel="noopener noreferrer" target="_blank">
          Cyriaque Delaunay
        </a>
      </span>
      <span>{` | ${t('commons.changeLanguage')} :`}</span>
      {availableLangs.map((lang, index) => {
        return (
          <button
            type="button"
            key={`lang-${index}`}
            onClick={() => {
              handleLangChange(lang);
            }}
          >
            <span>{t('lang.' + lang)}</span>
          </button>
        );
      })}
    </footer>
  );
}

export default Footer;
