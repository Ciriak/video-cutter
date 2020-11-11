import { defaultJobState, IJobState } from './interfaces/Job.interface';
import React from 'react';
const global: {
  connector: {
    socket?: SocketIOClient.Socket;
    emit?: any;
    error: boolean;
  };
  job: IJobState;
  setJob?: React.Dispatch<React.SetStateAction<IJobState>>;
} = {
  connector: {
    error: false,
  },
  job: defaultJobState,
};
export default global;
