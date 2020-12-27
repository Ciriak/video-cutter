import React, { useEffect, useState } from 'react';
import { exampleVideos } from '../utils';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useJob from '../hooks/useJob';

function LinkForm() {
  const [exampleVideo, setExampleVideo] = useState<any>();
  const { setFile } = useJob();

  const [t] = useTranslation();
  useEffect(() => {
    const ex = exampleVideos[Math.floor(Math.random() * exampleVideos.length)];
    setExampleVideo(ex);
  }, []);

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
        {/* <input
          id="link-input"
          type="text"
          className={classNames('form-control form-control-lg', {
            'is-invalid': !validState,
          })}
          placeholder={t('commons.pasteUrlHere')}
          onChange={(e) => {
            handleLinkChange(e);
          }}
          autoFocus
        /> */}
        <div className="row">
          <button className="btn btn-block btn-primary btn-lg" onClick={selectFile}>
            {t('commons.selectFile')}
          </button>
        </div>
        <input
          type="file"
          id="link-dummy"
          className="link-dummy"
          onChange={(e) => {
            handleFileSelected(e);
          }}
        />
        {exampleVideo && (
          <small className="float-right mt-5">
            {t('commons.example')}: <Link to={`/link?url=${exampleVideo.url}`}>{exampleVideo.url}</Link>
          </small>
        )}
      </div>
    </div>
  );
}

export default LinkForm;
