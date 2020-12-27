import React from 'react';
import Slider from '@material-ui/core/Slider';
import useJob from '../hooks/useJob';

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

  return (
    <div className="timeline col">
      <Slider
        min={0}
        max={job.options.max}
        value={[job.options.start, job.options.end]}
        onChange={handleChange}
        valueLabelDisplay="auto"
        step={0.1}
        color={'primary'}
        aria-labelledby="range-slider"
      />
    </div>
  );
}

export default Timeline;
