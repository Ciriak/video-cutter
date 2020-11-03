import React, { useState } from 'react';
import { exampleVideos, validateYouTubeUrl } from '../utils';
import { Link, useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { useRecoilState } from 'recoil';
import { jobState } from '../atoms/job';
import { defaultJobState } from '../interfaces/Job.interface';
import { useTranslation } from 'react-i18next';

function LinkForm() {
  const [validState, setValidState] = useState<boolean>(true);
  const history = useHistory();
  const [, setJob] = useRecoilState(jobState);
  const [t] = useTranslation();
  const exampleVideo = exampleVideos[Math.floor(Math.random() * exampleVideos.length)];
  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const url = e.target.value;
    const isValid = validateYouTubeUrl(url);
    setValidState(isValid);

    if (isValid) {
      // reset the previous work it there was one
      setJob({ ...defaultJobState });

      history.push('/link?url=' + url);
    }
  };

  return (
    <div className="video-link row align-items-center justify-content-center h-100">
      <div className="card">
        <h2 className="card-title">{t('commons.title')}</h2>
        <p>{t('commons.description')}</p>
        <input
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
        />
        <small className="float-right mt-5">
          {t('commons.example')}: <Link to={`/link?url=${exampleVideo.url}`}>{exampleVideo.url}</Link>
        </small>
      </div>
    </div>
  );
}

export default LinkForm;
