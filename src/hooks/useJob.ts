import { useRecoilState } from 'recoil';
import jobState from '../store/job.atom';

const useJob = () => {
  const [job, setJob] = useRecoilState(jobState);

  function setFile(file: any) {
    setJob({ ...job, file });
  }

  function setProgress(ratio: number) {
    setJob({ ...job, progress: ratio * 100, active: true, state: 'working' });
  }

  /**
   * Set the cut time
   * also set the player to the updated time (for preview purpose)
   * @param start
   * @param end
   */
  function setTime(start: number, end?: number) {
    const newOptions = { ...job.options };

    start = parseFloat(start.toFixed(2));
    newOptions.start = start;

    if (end) {
      end = parseFloat(end.toFixed(2));
      newOptions.end = end;
    }

    if (newOptions.start > newOptions.end) {
      newOptions.end = newOptions.start + 1;
    }
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

    newOptions.duration = parseFloat((newOptions.end - newOptions.start).toFixed(2));

    const updatedOptions = { ...job.options, ...newOptions };

    setJob({ ...job, options: updatedOptions });
  }

  return { job, setFile, setProgress, setJob, setTime };
};

export default useJob;
