import moment from 'moment';

export function validateYouTubeUrl(url: string): boolean {
  if (url !== undefined || url !== '') {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\?v=)([^#&?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length === 11) {
      return true;
    } else {
      return false;
    }
  }
  return false;
}
const serverAddress = process.env.REACT_APP_SERVER_ADDRESS || 'http://localhost:8080';

export function getFileUrlForJob(jobId: string, type: 'video' | 'mp3') {
  let url = serverAddress + '/file/' + jobId;
  if (type === 'mp3') {
    return url + '?format=' + type;
  }
  return url;
}

export function secondsAsString(seconds?: number): string {
  if (!seconds) {
    seconds = 0;
  }

  return moment(seconds, 'ss.SS').format('HH:mm:ss.SS').toString();
}

/**
 * Return the type saved in the localstorage OR video by default
 */
export function getSavedConvertType(): 'video' | 'mp3' {
  let savedType: any = String(localStorage.getItem('vct_type')) || 'video';

  if (savedType === '') {
    savedType = 'video';
  }
  return savedType;
}

export function stringAsSeconds(value: string): number {
  // ensure that the milliseconds are provided
  if (value.indexOf('.') === -1) {
    value = value + '.000';
  }
  return moment.duration(value).asSeconds();
}

export const exampleVideos: {
  title: string;
  url: string;
  thumbnailUrl: string;
}[] = [
  {
    thumbnailUrl: '',
    title: 'Home',
    url: 'https://www.youtube.com/watch?v=lsoLYWTzqSY',
  },
  {
    thumbnailUrl: '',
    title: 'Dj groove',
    url: 'https://www.youtube.com/watch?v=glS_9h80ErE',
  },
  {
    thumbnailUrl: '',
    title: 'Rush hour',
    url: 'https://www.youtube.com/watch?v=JpZca8I2QEQ',
  },
  {
    thumbnailUrl: '',
    title: 'Nyakusa',
    url: 'https://www.youtube.com/watch?v=uOnwmNxjpDQ',
  },
  {
    thumbnailUrl: '',
    title: 'Factorio',
    url: 'https://www.youtube.com/watch?v=pWi2Oevq0LA',
  },
];

export function getLangFlag(lang: string) {
  lang = String(lang.split('-')[0]);
  return './flags/' + lang + '.png';
}
