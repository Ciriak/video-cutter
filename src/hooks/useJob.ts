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

  return { job, setFile, setProgress, setJob };
};

export default useJob;
