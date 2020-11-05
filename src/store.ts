import { defaultJobState, IJobState } from './interfaces/Job.interface';

const global: {
  connector: {
    socket?: SocketIOClient.Socket;
    emit?: any;
    error: boolean;
  };
  job: IJobState;
} = {
  connector: {
    error: false
  },
  job: defaultJobState,
};
export default global;
