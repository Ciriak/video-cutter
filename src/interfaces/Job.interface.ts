export interface IJobState {
  error: boolean;
  active: boolean;
  state: 'idle' | 'starting' | 'error' | 'working' | 'done';
  progress: number;
  options: IJobOptions;
  file?: File | null;
  fileDownloadUrl?: string;
  queuePosition?: number;
}

export interface IJobOptions {
  url: string;
  start: number;
  end: number;
  duration: number;
  max: number;
  min: number;
  type: 'video' | 'mp3';
}

export const defaultJobState: IJobState = {
  active: false,
  error: false,
  options: {
    max: 0,
    min: 0,
    duration: 0,
    end: 0,
    start: 0,
    url: '',
    type: 'video',
  },
  progress: 0,
  state: 'idle',
  file: null,
};
