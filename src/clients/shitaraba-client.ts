import * as http from 'http';
import * as encoding from 'encoding-japanese';

export interface Thread {
  title: string;
  posts: Post[];
}

export interface Post {
  number: number;
  name: string;
  mail: string;
  date: string;
  message: string;
  id: string;
}

interface PostsRange {
  from?: number;
  to?: number;
  last?: number;
}

const threadUrlRegex = /^http:\/\/jbbs\.shitaraba\.net\/bbs\/(?:read|rawmode)\.cgi\/([0-9A-Za-z]+)\/([0-9]+)\/([0-9]+)\/?/;

export function canonicalizeUrl(url: string): string | null {
  const match = threadUrlRegex.exec(url);
  if (!match) {
    return null;
  }

  const [, category, board, thread] = match;
  return `http://jbbs.shitaraba.net/bbs/read.cgi/${category}/${board}/${thread}/`;
}

export function fetchThread(url: string, range?: PostsRange) {
  let finalUrl = url.replace(/\/read\.cgi\//, '/rawmode.cgi/');
  
  if (range) {
    if (range.last != null) {
      finalUrl += `l${range.last}`;
    } else {
      if (range.from != null) {
        finalUrl += range.from;
      }
      if (range.to != null) {
        finalUrl += `-${range.to}`;
      }
    }
  }

  return fetchThreadRaw(finalUrl).then(
    (text) => parseThreadRaw(text),
  );
}

function fetchThreadRaw(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = http.request(url, (res) => {
      const chunks: Buffer[] = [];

      res.on('data', (chunk) => {
        chunks.push(chunk as Buffer);
      });

      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const text = encoding.convert(buffer, {
          to: 'UNICODE',
          from: 'EUCJP',
          type: 'string'
        });
        resolve(text);
      });

      res.on('error', (error) => {
        reject(error);
      });
    });

    req.end();
  });
}

function parseThreadRaw(text: string): Thread {
  let title = '';
  const lines = text.split('\n').slice(0, -1);
  const posts =  lines.map((line) => {
    const t = line.split('<>');
    const number = parseInt(t[0], 10);
    if (number === 1) {
      title = t[5];
    }
    return {
      number,
      name: t[1],
      mail: t[2],
      date: t[3],
      message: t[4],
      id: t[6],
    };
  });
  return {
    title,
    posts,
  };
}
