import React from 'react';
import { useTranslation } from 'react-i18next';
import useJob from '../hooks/useJob';

function LinkForm() {
  const { setFile } = useJob();
  const [t] = useTranslation();

  async function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (files && files[0]) {
      setFile(files[0]);
    }
  }

  function selectFile() {
    const inp = document.getElementById('link-dummy');
    inp?.click();
  }

  return (
    <div className="video-link row align-items-center justify-content-center">
      <div className="card">
        <h2 className="card-title">{t('commons.title')}</h2>
        <p>{t('commons.description')}</p>
        <div className="row">
          <button className="btn btn-block btn-primary btn-lg" onClick={selectFile}>
            {t('commons.selectFile')}
          </button>
        </div>
        <input
          type="file"
          id="link-dummy"
          accept="video/mp4,video/x-m4v,video/*"
          className="link-dummy"
          onChange={(e) => {
            handleFileSelected(e);
          }}
        />
      </div>
    </div>
  );
}

export default LinkForm;
