import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/footer.scss';
import store from '../store';

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
      <div className="credits footer-sec">
        {t('commons.madeBy')}{' '}
        <a href="https://cyriaque.net" rel="noopener noreferrer" target="_blank">
          Cyriaque Delaunay
        </a>
      </div>
      <span className="footer-separator"></span>
      <div className="server-state  footer-sec">
        <span>{`${t('commons.serverStatus')}`} : </span>
        {store.connector.socket?.connected && <span>{t('commons.connected')}</span>}
        {!store.connector.socket?.connected && !store.connector.error && <span className="flashing">{t('commons.connection')}</span>}
        {store.connector.error && <span className="text-danger">{t('commons.offline')}</span>}
      </div>
      <span className="footer-separator"></span>
      <div className="lang-manager footer-sec">
        <span>{`${t('commons.changeLanguage')} :`}</span>
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
      </div>
    </footer>
  );
}

export default Footer;
