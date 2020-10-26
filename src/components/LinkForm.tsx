import React, { useState } from 'react';
import { validateYouTubeUrl } from '../utils';
import { Link, useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { useRecoilState } from 'recoil';
import { jobState } from '../atoms/job';
import { defaultJobState } from '../interfaces/Job.interface';
import { useTranslation } from 'react-i18next';

const exampleLinks = [
  'https://youtu.be/aeM0EVs1ON8',
  'https://youtu.be/pWi2Oevq0LA',
  'https://www.youtube.com/watch?v=YHf7e67T54Y',
  'https://www.youtube.com/watch?v=YKSU82afy1w',
  'https://www.youtube.com/watch?v=X2DUpDxFJyg',
  'https://www.youtube.com/watch?v=P99qJGrPNLs',
];

function LinkForm() {
  const [validState, setValidState] = useState<boolean>(true);
  const history = useHistory();
  const [, setJob] = useRecoilState(jobState);
  const [t] = useTranslation();
  const exampleLink = exampleLinks[Math.floor(Math.random() * exampleLinks.length)];
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
    <div className="video-link flex container p-20">
      <div className="row align-items-center justify-content-center h-100 ">
        <div className="card col-lg-6 col-12">
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
            {t('commons.example')}: <Link to={`/link?url=${exampleLink}`}>{exampleLink}</Link>
          </small>
        </div>
      </div>
    </div>
  );
}

export default LinkForm;
