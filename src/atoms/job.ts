import { atom } from 'recoil';
import { defaultJobState, IJobState } from '../interfaces/Job.interface';

export const jobState = atom<IJobState>({
  key: 'jobState', // unique ID (with respect to other atoms/selectors)
  default: defaultJobState,
});
