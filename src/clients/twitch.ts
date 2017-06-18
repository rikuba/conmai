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
  const messageElm = elm.querySelector('.message')!;

  const message = [...messageElm.childNodes].map((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = (node as Text).data;
      return new Option(text).innerHTML;
    }

    if (node.nodeType === Node.ELEMENT_NODE &&
        (node as HTMLElement).matches('span.balloon-wrapper')) {
      const img = (node as HTMLElement).firstElementChild as HTMLImageElement;
      return ` ${img.outerHTML.replace(/\/\//, 'https://')} `;
    }

    return '';
  }).join('');

  return {
    author,
    timeStamp,
    message,
  };
};
