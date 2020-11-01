import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import query from 'query-string';
import { getFileUrlForJob, validateYouTubeUrl } from '../utils';
import { Slider } from '@material-ui/core';
import classNames from 'classnames';
import '../styles/video-studio.scss';
import { useRecoilState, useRecoilValue } from 'recoil';
import { connectorState } from '../atoms/connector';
import { jobState } from '../atoms/job';
import { IJobState } from '../interfaces/Job.interface';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Plyr from 'plyr';

const maxDuration = 180; // 3min
const siteKey = process.env.REACT_APP_HCAPTCHA_SITE_KEY || '10000000-ffff-ffff-ffff-000000000001';

interface ICutSettings {
  min: number;
  max: number;
  start: number;
  end: number;
  duration: number;
  videoUrl: string;
  verificationToken?: string;
}

interface ICanRunJobResult {
  canRun: boolean;
  reason?: string;
}

function VideoStudio() {
  const location = useLocation();
  const parse = query.parse(location.search);
  const history = useHistory();
  const [t] = useTranslation();
  const url = String(parse.url);
  const connector = useRecoilValue(connectorState);
  // const [loading, setLoading] = useState(true);
  const [playerTime, setPlayerTime] = useState<number>(0);
  const [previewMode, setPreviewMode] = useState<boolean>(true);
  const [cutSettings, setCutSettings] = useState<ICutSettings>({
    start: 0,
    end: 60,
    duration: 60,
    min: 0,
    max: 10,
    videoUrl: '',
  });

  const [player, setPlayer] = useState<Plyr>();
  const [job, setJob] = useRecoilState<IJobState>(jobState);
  console.log(cutSettings, '1');
  useEffect(() => {
    const plyr = new Plyr('#player');
    setPlayer(plyr);
    plyr.on('ready', () => {
      handlePlayerReady(plyr);
    });

    plyr.on('timeupdate', (e) => {
      handlePlayerProgress(e.detail.plyr.currentTime || 0);
    });
    function handleError() {
      history.push('/');
    }
    //return to main page if url invalid
    if (!validateYouTubeUrl(url)) {
      handleError();
    } else {
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Set the cut time
   * also set the player to the updated time (for preview purpose)
   * @param start
   * @param end
   */
  function setTime(value: number, pos: 'start' | 'end') {
    if (!player) {
      return;
    }
    value = parseFloat(value.toFixed(2));
    const newSettings = { ...cutSettings };
    newSettings[pos] = value;

    if (newSettings.start > newSettings.end || newSettings.end < newSettings.start) {
      newSettings.end = newSettings.start + 1;
    }

    newSettings.duration = parseFloat((newSettings.end - newSettings.start).toFixed(2));
    // player.currentTime = value;

    // ensure we cannot go more than the max duration setting
    // if (newSettings.duration > maxDuration) {
    //   // move the select area depending of the dot moving
    //   if (pos === 'end') {
    //     newSettings.start = newSettings.end - maxDuration;
    //   }
    //   if (pos === 'start') {
    //     newSettings.end = newSettings.start + maxDuration;
    //   }

    //   newSettings.duration = maxDuration;
    // }

    setCutSettings(newSettings);
  }

  /**
   * Called when the slider range is modified
   * @param e
   * @param value
   */
  // function handleSliderChange(e: React.ChangeEvent<{}>, value: number | number[]) {
  //   e.preventDefault();
  //   //force an array
  //   if (!Array.isArray(value)) {
  //     value = [value];
  //   }

  //   //detect wich value has moved, the start of the end
  //   let val: 'start' | 'end' = 'end';
  //   if (value[0] !== cutSettings.start) {
  //     val = 'start';
  //     setTime(value[0], val);
  //   } else {
  //     setTime(value[1], val);
  //   }
  // }

  /**
   * Set the duration and apply the correct time
   * @param duration
   */
  function setDuration(duration: number) {
    duration = parseFloat(duration.toFixed(2));
    if (duration > cutSettings.duration && cutSettings.end < cutSettings.max) {
      // if increment AND can increment
      setTime(cutSettings.end + 1, 'end');
    }
    if (duration < cutSettings.duration && cutSettings.end > cutSettings.min + 1) {
      // if increment AND can increment
      setTime(cutSettings.end - 1, 'end');
    }
  }

  /**
   * Called when the captcha is completed
   * @param token
   */
  function handleVerificationSuccess(token: string) {
    setCutSettings({ ...cutSettings, verificationToken: token });
  }

  function handlePlayerProgress(progress: number) {
    console.log(cutSettings, '2');
    setPlayerTime(parseFloat(progress.toFixed(2)));

    console.log(progress, cutSettings);
    //handle preview mode
    if (previewMode) {
      // force the time to be at least at the start
      if (progress < cutSettings.start) {
        setPlayerTime(cutSettings.start);
      }
      // ..and not after the end
      if (progress > cutSettings.end) {
        setPlayerTime(cutSettings.start);
      }
      // return to start
      if (progress > cutSettings.end) {
        setPlayerTime(cutSettings.start);
      }
    }
  }

  function handlePlayerReady(player: Plyr) {
    let defaultCut = player.duration;
    if (player.duration > maxDuration) {
      defaultCut = maxDuration;
    }

    setCutSettings({ ...cutSettings, max: player.duration || maxDuration, start: 0, end: defaultCut, duration: defaultCut });
  }

  // if (loading) {
  //   return (
  //     <div className="video-studio flex container">
  //       <div className="align-items-center h-100">
  //         <p>Loading...</p>
  //       </div>
  //     </div>
  //   );
  // }

  function startCut() {
    setJob({ ...job, state: 'waiting', active: true, progress: 0 });
    connector.ws?.send(
      JSON.stringify({
        type: 'requestJob',
        data: {
          url: url,
          start: cutSettings.start,
          end: cutSettings.end,
          verificationToken: cutSettings.verificationToken,
        },
      })
    );
  }

  /**
   * Generate the tooltip props if we to display a hint to the user
   * @param canRun
   */
  function getTooltipProps(canRun: ICanRunJobResult) {
    if (canRun.reason) {
      return {
        'data-toggle': 'tooltip',
        'data-placement': 'left',
        'data-title': canRun.reason,
      };
    }
    return null;
  }

  /**
   * Tell wether or not the user can launch the job
   */
  function canRunJob(): ICanRunJobResult {
    if (cutSettings.duration > maxDuration) {
      return {
        canRun: false,
        reason: t('studio.tooLongCut').replace('%maxDuration%', String(maxDuration)),
      };
    }

    if (!cutSettings.verificationToken) {
      return {
        canRun: false,
        reason: t('studio.needToResolveCaptcha'),
      };
    }

    if (job.state === 'idle') {
      return {
        canRun: true,
      };
    }

    return {
      canRun: false,
    };
  }

  return (
    <div className="video-studio flex container">
      <div className="row">
        <div className="col-lg-6">
          <h2>{t('studio.cutTitle')}</h2>
          <div className="plyr__video-embed" id="player">
            <iframe
              title="plyr"
              src={`${url}?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1`}
              allowFullScreen
              allowTransparency
              allow="autoplay"
            ></iframe>
          </div>

          {/* <div className="row">
            <Slider
              value={[cutSettings.start, cutSettings.end]}
              min={cutSettings.min}
              max={cutSettings.max}
              onChange={(e, value) => {
                handleSliderChange(e, value);
              }}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"

              // marks={marks}
            />
          </div> */}
        </div>
        <div className="col-lg-6">
          <div className="card">
            <h2 className="card-title">{t('studio.cutSettings')}</h2>
            <div className="row">
              <div className="form-group">
                <label>{t('studio.currentTime')}</label>
                <input type="number" step="0.1" value={playerTime} max={maxDuration} min={0} className="form-control" disabled />
              </div>
              <div className="col-6 d-flex align-items-center justify-content-center">
                <label htmlFor="preview-check">{t('studio.previewMode')}</label>
                <input className="m-5" type="checkbox" id="preview-check" checked={previewMode} onChange={() => setPreviewMode(!previewMode)} />
              </div>
            </div>

            <div className="row">
              <div className="input-group col">
                <div className="input-group-prepend">
                  <button
                    className="btn"
                    onClick={() => {
                      setTime(playerTime, 'start');
                    }}
                  >
                    {t('studio.start')}
                  </button>
                </div>
                <input
                  type="number"
                  value={cutSettings.start}
                  min={cutSettings.min}
                  step="0.1"
                  max={cutSettings.end}
                  className="form-control"
                  onChange={(e) => {
                    setTime(parseFloat(e.target.value), 'start');
                  }}
                />
              </div>
              <div className="input-group col">
                <div className="input-group-prepend">
                  <button
                    className="btn"
                    onClick={() => {
                      setTime(playerTime, 'end');
                    }}
                  >
                    {t('studio.end')}
                  </button>
                </div>
                <input
                  type="number"
                  value={cutSettings.end}
                  min={cutSettings.start}
                  max={cutSettings.max}
                  step="0.1"
                  className="form-control"
                  onChange={(e) => {
                    console.log(e.target.value);
                    setTime(parseFloat(e.target.value), 'end');
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="input-group col-6">
                <div className="input-group-prepend">
                  <span className="input-group-text">{t('studio.duration')}</span>
                </div>
                <input
                  type="number"
                  value={cutSettings.duration}
                  min="0"
                  step="0.1"
                  className="form-control"
                  onChange={(e) => {
                    setDuration(parseFloat(e.target.value));
                  }}
                />
              </div>
            </div>
            <hr></hr>
            {!job.fileUrl && (
              <>
                {job.state !== 'done' && (
                  <>
                    <HCaptcha theme={'dark'} sitekey={siteKey} onVerify={(token: string) => handleVerificationSuccess(token)} />
                    {/* // BASE BTN */}
                    <button
                      {...getTooltipProps(canRunJob())}
                      className={classNames('btn btn-primary btn-lg btn-block mb-5')}
                      disabled={!canRunJob().canRun}
                      type="button"
                      onClick={startCut}
                    >
                      {job.state !== 'idle' && <span>{t('state.' + job.state)}</span>}
                      {job.state === 'idle' && <span>{t('commons.cut')}</span>}
                    </button>
                  </>
                )}
                {job.state === 'done' && (
                  //DONE BTN
                  <>
                    <a href={getFileUrlForJob(job.id)} rel="noopener noreferrer" target="_blank">
                      <button className={classNames('btn btn-success btn-lg btn-block mb-5')} type="button">
                        <span>
                          {t('studio.download')} <i className="fa fa-cloud-download-alt "></i>
                        </span>
                      </button>
                    </a>
                  </>
                )}

                <div className={classNames('progress-group work-progress', { active: job.state !== 'idle' })}>
                  <div className="progress">
                    <div
                      className={classNames('progress-bar progress-bar-animated', {
                        'bg-success': job.state === 'done',
                        'bg-danger': job.state === 'error',
                      })}
                      role="progressbar"
                      style={{
                        width: `${job.progress}%`,
                      }}
                      aria-valuenow={job.progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                  </div>
                  <span className="progress-group-label">
                    {job.state === 'done' && <i className="fa fa-check-circle text-success font-size-16"></i>}
                    {(job.state === 'waiting' || job.state === 'downloading' || job.state === 'converting') && (
                      <i className="fa fa-circle-notch text-primary font-size-16 rotating"></i>
                    )}

                    {job.state === 'error' && (
                      <span data-toggle="tooltip" data-title="An error hapenned">
                        <i className="fa fa-exclamation-circle text-danger font-size-16"></i>
                      </span>
                    )}
                  </span>
                </div>

                {job.state === 'done' && (
                  <div className="text-right">
                    <Link to="/">{t('studio.anotherVideo')}</Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoStudio;
