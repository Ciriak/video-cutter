import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { useHistory, useLocation } from 'react-router';
import query from 'query-string';
import { validateYouTubeUrl } from '../utils';
import Axios from 'axios';
import { Slider } from '@material-ui/core';
import classNames from 'classnames';
import '../styles/video-studio.scss';
function VideoStudio() {
  const location = useLocation();
  const parse = query.parse(location.search);
  const history = useHistory();
  const url = String(parse.url);
  const [loading, setLoading] = useState(true);
  const [cutSettings, setCutSettings] = useState<ICutSettings>({
    start: 1,
    end: 4,
    duration: 3,
    min: 0,
    max: 10,
  });

  interface ICutSettings {
    min: number;
    max: number;
    start: number;
    end: number;
    duration: number;
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

  interface IWorkState {
    processing: boolean;
    progress: number;
    error: boolean;
  }

  //https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=KVvXv1Z6EY8&format=json
  const debugVid: IYTVideoInfo = {
    width: 480,
    thumbnail_height: 360,
    provider_url: 'https://www.youtube.com/',
    provider_name: 'YouTube',
    html:
      '<iframe width="480" height="270" src="https://www.youtube.com/embed/KVvXv1Z6EY8?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
    version: '1.0',
    type: 'video',
    thumbnail_width: 480,
    thumbnail_url: 'https://i.ytimg.com/vi/KVvXv1Z6EY8/hqdefault.jpg',
    title: 'Factorio - Gameplay Trailer 2016',
    height: 270,
    author_name: 'Factorio',
    author_url: 'https://www.youtube.com/user/factoriovideos',
  };

  const [videoInfo, setVideoInfo] = useState<IYTVideoInfo | null>(null);
  const [player, setPlayer] = useState<ReactPlayer>();
  const [workState, setWorkState] = useState<IWorkState>({
    error: false,
    processing: false,
    progress: 0,
  });

  //return to main page if url invalid
  if (!validateYouTubeUrl(url)) {
    handleError();
  }

  if (!videoInfo) {
    Axios.get('https://www.youtube.com/oembed?url=' + url + '&format=json')
      .then((res) => {
        setVideoInfo(res.data);
        setLoading(false);
      })
      .catch(() => {
        setVideoInfo(debugVid);
        setLoading(false);
        // handleError();
      });
  }

  /**
   * Set the cut time
   * also set the player to the updated time (for preview purpose)
   * @param start
   * @param end
   */
  function setTime(value: number, pos: 'start' | 'end') {
    const newSettings = { ...cutSettings };
    newSettings[pos] = value;

    newSettings.duration = newSettings.end - newSettings.start;
    player?.seekTo(value);
    console.log(player?.state);

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
    if (state.playedSeconds > cutSettings.end) {
      player?.seekTo(cutSettings.start);
    }
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

  if (loading) {
    return (
      <div className="video-studio flex container">
        <div className="align-items-center h-100">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  function startCut() {
    setWorkState({ ...workState, processing: true, progress: 1 });
  }

  if (videoInfo) {
    return (
      <div className="video-studio flex container">
        <div className="">
          <div className="row">
            <div className="col-7">
              <h2>{videoInfo.title}</h2>
              <ReactPlayer
                url={url}
                width={'100%'}
                ref={refPlayer}
                volume={0}
                controls
                playing={true}
                onReady={handlePlayerReady}
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
                <div className="row">
                  <div className="input-group col">
                    <div className="input-group-prepend">
                      <span className="input-group-text">Start</span>
                    </div>
                    <input
                      type="number"
                      value={cutSettings.start}
                      min={cutSettings.min}
                      max={cutSettings.end}
                      className="form-control"
                      onChange={(e) => {
                        setTime(parseInt(e.target.value), 'start');
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
                      className="form-control"
                      onChange={(e) => {
                        setTime(parseInt(e.target.value), 'end');
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
                      min="00:00"
                      className="form-control"
                      onChange={(e) => {
                        setDuration(parseInt(e.target.value));
                      }}
                    />
                  </div>
                </div>
                <hr></hr>

                <button
                  className={classNames('btn btn-primary btn-lg btn-block mb-5')}
                  disabled={workState?.processing}
                  type="button"
                  onClick={startCut}
                >
                  {workState?.processing && <span>Working...</span>}
                  {!workState?.processing && <span>Cut</span>}
                </button>

                <div className={classNames('progress work-progress', { active: workState.progress > 0 })}>
                  <div
                    className="progress-bar progress-bar-animated"
                    role="progressbar"
                    style={{
                      width: `${workState.progress}%`,
                    }}
                    aria-valuenow={workState.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <></>;
}

export default VideoStudio;
