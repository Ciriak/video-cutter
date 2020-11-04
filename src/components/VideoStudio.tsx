import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import query from 'query-string';
import { getFileUrlForJob, validateYouTubeUrl } from '../utils';
import classNames from 'classnames';
import '../styles/video-studio.scss';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactPlayer from 'react-player';

import store from '../store';

const maxCutDuration = 600; // 10min
const siteKey = process.env.REACT_APP_HCAPTCHA_SITE_KEY || '10000000-ffff-ffff-ffff-000000000001';
const savedPreviewMode = localStorage.getItem('ytct_preview') === 'true' || false;
const savedType: any = String(localStorage.getItem('ytct_type')) || 'video';

interface ICutSettings {
  min: number;
  max: number;
  start: number;
  end: number;
  duration: number;
  videoUrl: string;
  verificationToken?: string;
  type: 'video' | 'mp3';
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
  // const [loading, setLoading] = useState(true);
  const [playerTime, setPlayerTime] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(true);
  const [previewMode, setPreviewMode] = useState<boolean>(savedPreviewMode);
  const [player, setPlayer] = useState<ReactPlayer>();

  const job = store.job;
  const [cutSettings, setCutSettings] = useState<ICutSettings>({
    start: 0,
    end: 60,
    duration: 60,
    min: 0,
    max: 10,
    videoUrl: '',
    type: savedType,
  });

  useEffect(() => {
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
   * Called when the user click on "restart"
   */
  function handleRestart() {
    document.location.reload();
  }

  function changePreviewMode(active: boolean) {
    localStorage.setItem('ytct_preview', String(active));
    setPreviewMode(active);
  }

  /**
   * Set the cut time
   * also set the player to the updated time (for preview purpose)
   * @param start
   * @param end
   */
  function setTime(value: number, pos: 'start' | 'end') {
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
   * Can edit job settings
   */
  function canEdit() {
    if (job.state === 'idle') {
      return true;
    }
    return false;
  }

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
    setPlayerTime(parseFloat(progress.toFixed(2)));

    //handle preview mode
    if (previewMode) {
      // force the time to be at least at the start
      if (progress < cutSettings.start) {
        player?.seekTo(cutSettings.start);
      }
      // ..and not after the end
      if (progress > cutSettings.end) {
        player?.seekTo(cutSettings.start);
      }
      // return to start
      if (progress > cutSettings.end) {
        player?.seekTo(cutSettings.start);
      }
      setPlaying(true);
    }
  }

  function handlePlayerReady(player: ReactPlayer) {
    const duration = player.getDuration();
    let defaultCut = duration;
    if (duration > maxCutDuration) {
      defaultCut = maxCutDuration;
    }

    setCutSettings({ ...cutSettings, max: duration || maxCutDuration, start: 0, end: defaultCut, duration: defaultCut });
  }

  function startCut() {
    store.job = { ...job, state: 'waiting', active: true, progress: 0 };

    store.connector.emit('requestJob', {
      url: url,
      start: cutSettings.start,
      end: cutSettings.end,
      type: cutSettings.type,
      verificationToken: cutSettings.verificationToken,
    });
  }

  /**
   * Called when the user toggle the current mode
   */
  function handleModeChange() {
    const newSettings = { ...cutSettings };
    if (cutSettings.type === 'mp3') {
      newSettings.type = 'video';
    } else {
      newSettings.type = 'mp3';
    }

    if (newSettings.type === 'mp3') {
      changePreviewMode(false);
    }

    localStorage.setItem('ytct_type', newSettings.type);

    setCutSettings(newSettings);
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
    if (cutSettings.duration > maxCutDuration) {
      return {
        canRun: false,
        reason: t('studio.tooLongCut').replace('%maxDuration%', String(maxCutDuration)),
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

    // can retry after an error
    if (job.state === 'error') {
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
          <ReactPlayer
            url={url}
            playing={playing}
            ref={(player) => setPlayer(player!)}
            volume={0.5}
            controls={true}
            width={'100%'}
            progressInterval={100}
            onReady={handlePlayerReady}
            onProgress={(state) => {
              handlePlayerProgress(state.playedSeconds);
            }}
          />
        </div>
        <div className="col-lg-6">
          <div className="card">
            <h2 className="card-title">{t('studio.cutSettings')}</h2>
            <div className="row">
              <div className="form-group">
                <label>{t('studio.currentTime')}</label>
                <input type="number" step="0.1" value={playerTime} max={maxCutDuration} min={0} className="form-control" disabled />
              </div>
              <div className="col-4 d-flex align-items-center justify-content-center">
                <div className="custom-switch">
                  <input
                    type="checkbox"
                    id="switch-preview"
                    checked={previewMode}
                    disabled={!canEdit()}
                    onChange={() => changePreviewMode(!previewMode)}
                  />
                  <label htmlFor="switch-preview">{t('studio.previewMode')}</label>
                </div>
              </div>

              <div className="col-4 d-flex align-items-center justify-content-center">
                <div className="custom-switch" data-toggle="tooltip" data-placement="right" data-title={t('studio.downloadMp3')}>
                  <input
                    type="checkbox"
                    id="switch-mode"
                    disabled={!canEdit()}
                    checked={cutSettings.type === 'mp3'}
                    onChange={() => {
                      handleModeChange();
                    }}
                  />
                  <label htmlFor="switch-mode">
                    <i className="fas fa-music"></i>
                  </label>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="input-group col">
                <div className="input-group-prepend">
                  <button
                    className="btn tool-btn"
                    disabled={!canEdit()}
                    onClick={() => {
                      setTime(playerTime, 'start');
                    }}
                  >
                    {t('studio.start')}
                  </button>
                </div>
                <input
                  type="number"
                  disabled={!canEdit()}
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
                    disabled={!canEdit()}
                    className="btn tool-btn"
                    onClick={() => {
                      setTime(playerTime, 'end');
                    }}
                  >
                    {t('studio.end')}
                  </button>
                </div>
                <input
                  type="number"
                  disabled={!canEdit()}
                  value={cutSettings.end}
                  min={cutSettings.start}
                  max={cutSettings.max}
                  step="0.1"
                  className="form-control"
                  onChange={(e) => {
                    setTime(parseFloat(e.target.value), 'end');
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="input-group col-6">
                <div className="input-group-prepend text-center">
                  <button disabled={!canEdit()} className="btn tool-btn">
                    {t('studio.duration')}
                  </button>
                </div>
                <input
                  type="number"
                  disabled={!canEdit()}
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
            {!job.fileUrl && store.connector.socket?.connected && (
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
                      {job.state === 'idle' && <span>{t('studio.download')}</span>}
                      {job.state === 'error' && <span>{t('commons.retry')}</span>}
                    </button>
                  </>
                )}
                {job.state === 'done' && (
                  //DONE BTN
                  <>
                    <a href={getFileUrlForJob(job.id, cutSettings.type)} rel="noopener noreferrer" target="_blank" download>
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
                    {'   '}
                    {t('commons.or')}
                    <button className="btn btn-link" onClick={() => handleRestart()}>
                      {t('commons.restart')}
                    </button>
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
