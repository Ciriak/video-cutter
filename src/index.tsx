import React from 'react';
import ReactDOM from 'react-dom';
import './style.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import halfmoon from 'halfmoon';
import { BrowserRouter as Router } from 'react-router-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// locales
import frLocales from './locales/fr.json';
import enLocales from './locales/en.json';
import { RecoilRoot } from 'recoil';

const userLang = localStorage.getItem('vct_lang') || navigator.language;

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: enLocales,
      },
      fr: {
        translation: frLocales,
      },
    },
    lng: userLang,
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false,
    },
  });

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <Router>
        <App />
      </Router>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root')
);

halfmoon.onDOMContentLoaded();
halfmoon.toggleDarkMode();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
