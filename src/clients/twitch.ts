export interface Post {
  // badges: string[];
  author: string;
  timeStamp: string;
  message: string; // HTML?
}

export const faviconUrl = 'https://www.twitch.tv/favicon.ico';


export const canonicalizeUrl = (url: string): string | null => {
  const match = /^https:\/\/www\.twitch\.tv\/[^/?#]+/.exec(url);
  if (!match) {
    return null;
  }

  return match[0];
}


export const collectPostData = (elm: HTMLElement): Post => {
  const timeStamp = elm.querySelector('.timestamp')!.textContent!;
  const author = elm.querySelector('.from')!.textContent!;
  const message = elm.querySelector('.message')!.textContent!;

  return {
    author,
    timeStamp,
    message,
  };
};
