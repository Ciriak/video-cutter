import { atom } from 'recoil';
import { defaultJobState } from '../interfaces/Job.interface';
import { getSavedConvertType } from '../utils';

defaultJobState.options.type = getSavedConvertType();

const jobState = atom({
  key: 'jobState', // unique ID (with respect to other atoms/selectors)
  default: defaultJobState, // default value (aka initial value)
});

export default jobState;
