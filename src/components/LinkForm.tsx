import React from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import '../styles/link-form.scss';

function LinkForm() {
  const [t] = useTranslation();
  function selectFile() {
    const inp = document.getElementById('link-dummy');
    inp?.click();
  }

  return (
    <div className={classnames('video-link row align-items-center justify-content-center link-form')}>
      <div className="card">
        <h2 className="card-title">{t('commons.title')}</h2>
        <p>{t('commons.description')}</p>
        <div className="row">
          <button className="btn btn-block btn-primary btn-lg" onClick={selectFile}>
            {t('commons.selectFile')}
          </button>
        </div>
        <div className="row p-5">
          <span className="text-muted">{t('commons.orDropFile')}</span>
        </div>
      </div>
    </div>
  );
}

export default LinkForm;
