export interface IJobState {
  error: boolean;
  active: boolean;
  state: 'idle' | 'waiting' | 'downloading' | 'error' | 'converting' | 'cleaning' | 'done';
  progress: number;
  id: string;
  options: IJobOptions;
  /**
   * Final file url
   */
  fileUrl?: string;
}

export interface IJobOptions {
  url: string;
  start: number;
  end: number;
}

export const defaultJobState: IJobState = {
  active: false,
  error: false,
  id: '',
  options: {
    end: 0,
    start: 0,
    url: '',
  },
  progress: 0,
  state: 'idle',
};
