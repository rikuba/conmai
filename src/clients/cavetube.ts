import * as https from 'https';

export interface Post {
  number: number;
  author: {
    name: string;
    url: string | null;
    iconUrl: string | null;
  };
  postedAt: number;
  message: string;
}

export const faviconUrl = 'https://www.cavelis.net/favicon.ico';


const chatUrlRegex = /^https:\/\/www\.cavelis\.net\/popup\/[0-9A-Z]+/;
const viewUrlRegex = /^https:\/\/www\.cavelis\.net\/view\/[0-9A-Z]+/;
const liveUrlRegex = /^https:\/\/www\.cavelis\.net\/live\/[^/?#]+/;

export type CavetubeUrl = {
  type: 'chat' | 'live' | 'view';
  url: string;
};

export function determineUrl(url: string): CavetubeUrl | null {
  let match;

  if ((match = chatUrlRegex.exec(url))) {
    return {
      type: 'chat',
      url: match[0],
    };
  }

  if ((match = viewUrlRegex.exec(url))) {
    return {
      type: 'view',
      url: match[0],
    };
  }

  if ((match = liveUrlRegex.exec(url))) {
    return {
      type: 'live',
      url: match[0],
    };
  }

  return null;
}

export function fetchChatUrl(livePageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.request(livePageUrl, (res) => {
      let text = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        text += chunk;
      });
      res.on('end', () => {
        const stream = detectStreamName(text);
        resolve(`https://www.cavelis.net/popup/${stream}`);
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.end();
  });
}

function detectStreamName(html: string): string {
  const match = /<input type="hidden" name="stream_name" value="([0-9A-Z]+)">/.exec(html);
  if (!match) {
    throw new Error('CaveTube: Stream name not found');
  }
  return match[1];
}
