import React, { useState } from 'react';
import { validateYouTubeUrl } from '../utils';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { useRecoilState } from 'recoil';
import { jobState } from '../atoms/job';
import { defaultJobState } from '../interfaces/Job.interface';
function LinkForm() {
  const [validState, setValidState] = useState<boolean>(true);
  const history = useHistory();
  const [, setJob] = useRecoilState(jobState);
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
    <div className="video-link flex container">
      <div className="row align-items-center justify-content-center h-100 ">
        <div className="card col-lg-6 col-12">
          <h2 className="card-title">Cut and download any Youtube video</h2>
          <p>Youtube Cutter provide you a simple and fast way to cut a Youtube video and download it</p>
          <input
            type="text"
            className={classNames('form-control form-control-lg', {
              'is-invalid': !validState,
            })}
            placeholder="Paste a youtube url here"
            onChange={(e) => {
              handleLinkChange(e);
            }}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}

export default LinkForm;
