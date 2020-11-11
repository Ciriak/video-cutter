export interface IJobState {
  error: boolean;
  active: boolean;
  state: 'idle' | 'waiting' | 'starting' | 'downloading' | 'error' | 'converting' | 'cleaning' | 'done';
  progress: number;
  id: string;
  options: IJobOptions;
  /**
   * Final file name
   */
  fileName?: string;
  /**
   * Final file url
   */
  fileUrl?: string;
  queuePosition?: number;
}

export interface IJobOptions {
  url: string;
  start: number;
  end: number;
  type: 'video' | 'mp3';
}

export const defaultJobState: IJobState = {
  active: false,
  error: false,
  id: '',
  options: {
    end: 0,
    start: 0,
    url: '',
    type: 'video',
  },
  progress: 0,
  state: 'idle',
};
