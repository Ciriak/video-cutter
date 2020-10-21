import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
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
import { Link } from 'react-router-dom';
function VideoStudio() {
  const location = useLocation();
  const parse = query.parse(location.search);
  const history = useHistory();
  const url = String(parse.url);
  const connector = useRecoilValue(connectorState);
  // const [loading, setLoading] = useState(true);
  const [playerTime, setPlayerTime] = useState<number>(0);
  const [cutSettings, setCutSettings] = useState<ICutSettings>({
    start: 1,
    end: 4,
    duration: 3,
    min: 0,
    max: 10,
    videoUrl: '',
  });

  interface ICutSettings {
    min: number;
    max: number;
    start: number;
    end: number;
    duration: number;
    videoUrl: string;
  }

  interface IJobRequest {
    url: string;
    start: number;
    end: number;
  }

  interface IYTVideoInfo {
    provider_url: string;
    author_name: string;
    provider_name: string;
    height: number;
    thumbnail_width: number;
    author_url: string;
    thumbnail_height: number;
    version: string;
    width: number;
    title: string;
    html: string;
    thumbnail_url: string;
    type: string;
  }

  interface Ijob {
    processing: boolean;
    progress: number;
    error: boolean;
  }

  const [player, setPlayer] = useState<ReactPlayer>();
  const [job, setJob] = useRecoilState<IJobState>(jobState);

  useEffect(() => {
    //return to main page if url invalid
    if (!validateYouTubeUrl(url)) {
      handleError();
    }

    setCutSettings({ ...cutSettings, videoUrl: url });
  }, []);

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

    newSettings.duration = parseFloat((newSettings.end - newSettings.start).toFixed(2));
    player?.seekTo(value);

    setCutSettings(newSettings);
  }

  /**
   * Called when the slider range is modified
   * @param e
   * @param value
   */
  function handleSliderChange(e: React.ChangeEvent<{}>, value: number | number[]) {
    e.preventDefault();
    //force an array
    if (!Array.isArray(value)) {
      value = [value];
    }

    //detect wich value has moved, the start of the end
    let val: 'start' | 'end' = 'end';
    if (value[0] !== cutSettings.start) {
      val = 'start';
      setTime(value[0], val);
    } else {
      setTime(value[1], val);
    }
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

  function handlePlayerProgress(state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) {
    const rawTime = player?.getCurrentTime() || 0;

    setPlayerTime(parseFloat(rawTime.toFixed(2)));

    // if (state.playedSeconds > cutSettings.end) {
    //   player?.seekTo(cutSettings.start);
    // }
  }

  function handleError() {
    history.push('/');
  }

  function refPlayer(player: ReactPlayer) {
    setPlayer(player);
  }

  function handlePlayerReady() {
    setCutSettings({ ...cutSettings, max: player?.getDuration() || 0 });
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
          url: job.fileUrl,
          start: cutSettings.start,
          end: cutSettings.end,
        },
      })
    );
  }

  return (
    <div className="video-studio flex container">
      <div className="row">
        <div className="col-7">
          {/* <h2>{videoInfo.title}</h2> */}
          <ReactPlayer
            url={url}
            width={'100%'}
            ref={refPlayer}
            volume={0}
            controls
            playing={true}
            onReady={handlePlayerReady}
            progressInterval={100}
            onProgress={(state) => {
              handlePlayerProgress(state);
            }}
          />

          <div className="row">
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
          </div>
        </div>
        <div className="col-5">
          <div className="card">
            <h2 className="card-title">Cut settings</h2>
            <div className="form-group">
              <label>Current time</label>
              <input type="number" step="0.01" value={playerTime} className="form-control" disabled />
            </div>
            <div className="row mb-5">
              <div
                className="btn btn-default mr-5"
                onClick={() => {
                  setTime(playerTime, 'start');
                }}
              >
                <i className="fa fa-cut"></i> Set Cut Start{' '}
              </div>
              <div
                className="btn btn-default"
                onClick={() => {
                  setTime(playerTime, 'end');
                }}
              >
                <i className="fa fa-cut"></i> Set Cut End{' '}
              </div>
            </div>
            <div className="row">
              <div className="input-group col">
                <div className="input-group-prepend">
                  <span className="input-group-text">Start</span>
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
                  <span className="input-group-text">End</span>
                </div>
                <input
                  type="number"
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
                <div className="input-group-prepend">
                  <span className="input-group-text">Duration</span>
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
                  // BASE BTN
                  <button className={classNames('btn btn-primary btn-lg btn-block mb-5')} disabled={job?.active} type="button" onClick={startCut}>
                    {job?.active && <span>{job.state}</span>}
                    {!job?.active && <span>Cut</span>}
                  </button>
                )}
                {job.state === 'done' && (
                  //DONE BTN
                  <>
                    <a href={getFileUrlForJob(job.id)} rel="noopener noreferrer" target="_blank">
                      <button className={classNames('btn btn-success btn-lg btn-block mb-5')} disabled={job?.active} type="button">
                        <span>
                          Download <i className="fa fa-cloud-download-alt "></i>
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
                        'bg-error': job.state === 'error',
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

                    {job.state === 'error' && <i className="fa fa-exclamation-circle text-error font-size-16"></i>}
                  </span>
                </div>

                {job.state === 'done' && (
                  <div className="text-right">
                    <Link to="/">Try another video</Link>
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
