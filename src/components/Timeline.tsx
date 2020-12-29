import React from 'react';
import Slider from '@material-ui/core/Slider';
import useJob from '../hooks/useJob';
import moment from 'moment';
import '../styles/timeline.scss';

function Timeline() {
  const { job, setTime } = useJob();

  function handleChange(event: React.ChangeEvent<{}>, value: number | number[]) {
    const options = { ...job.options };
    if (!Array.isArray(value)) {
      return;
    }

    options.end = value[1];
    options.start = value[0];

    setTime(options.start, options.end);
  }

  const endLabel = moment().startOf('day').seconds(job.options.max).format('mm:ss');

  return (
    <div className="timeline col">
      <div className="row">
        <Slider
          min={0}
          max={job.options.max}
          value={[job.options.start, job.options.end]}
          onChange={handleChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(val) => {
            return moment().startOf('day').seconds(val).format('mm:ss');
          }}
          step={0.1}
          color={'primary'}
          aria-labelledby="range-slider"
        />
      </div>
      <div className="row">
        <div className="time-label col text-left text-muted">
          <span>00:00</span>
        </div>
        <div className="time-label col text-right text-muted">
          <span>{endLabel}</span>
        </div>
      </div>
    </div>
  );
}

export default Timeline;
