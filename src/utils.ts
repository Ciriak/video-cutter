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
