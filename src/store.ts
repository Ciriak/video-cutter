import { defaultJobState, IJobState } from './interfaces/Job.interface';

const global: {
  connector: {
    socket?: SocketIOClient.Socket;
    emit?: any;
  };
  job: IJobState;
} = {
  connector: {},
  job: defaultJobState,
};
export default global;
