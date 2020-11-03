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
  let url = serverAddress + '/file/' + jobId + '_cut';
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

export function stringAsSeconds(value: string): number {
  // ensure that the milliseconds are provided
  if (value.indexOf('.') === -1) {
    value = value + '.000';
  }
  return moment.duration(value).asSeconds();
}
