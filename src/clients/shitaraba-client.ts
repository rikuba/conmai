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

export const faviconUrl = 'http://jbbs.shitaraba.net/favicon.ico';

const threadUrlRegex = /^http:\/\/jbbs\.(?:shitaraba\.net|livedoor\.jp)\/bbs\/(?:read|rawmode)\.cgi\/([0-9A-Za-z]+)\/([0-9]+)\/([0-9]+)\/?/;

export function canonicalizeUrl(url: string): string | null {
  const urlData = parseThreadUrl(url);
  if (!urlData) {
    return null;
  }

  return `http://jbbs.shitaraba.net/bbs/read.cgi/${urlData.dir}/${urlData.board}/${
    urlData.thread
  }/`;
}

export function parseThreadUrl(url: string) {
  const match = threadUrlRegex.exec(url);
  if (!match) {
    return null;
  }

  return {
    dir: match[1],
    board: match[2],
    thread: match[3],
  };
}

function toSettingUrl({ dir, board }: { dir: string; board: string }) {
  return `http://jbbs.shitaraba.net/bbs/api/setting.cgi/${dir}/${board}/`;
}

export function fetchThread(url: string, range?: PostsRange) {
  let finalUrl = url.replace(/\/read\.cgi\//, '/rawmode.cgi/');

  if (range) {
    if (range.last != null) {
      finalUrl += `l${range.last}`;
    } else if (range.from != null || range.to != null) {
      const from = range.from || '';
      const to = range.to || '';
      finalUrl += `${from}-${to}`;
    }
  }

  return fetchAsText(finalUrl).then(parseThreadRaw);
}

export interface BoardSettings {
  TOP: string;
  DIR: string;
  BBS: string;
  CATEGORY: string;
  BBS_ADULT: string;
  BBS_THREAD_STOP: string;
  BBS_NONAME_NAME: string;
  BBS_DELETE_NAME: string;
  BBS_TITLE: string;
  BBS_COMMENT: string;
}

export function fetchSettings(url: string) {
  const urlData = parseThreadUrl(url);
  if (!urlData) {
    throw new Error(`Unknown URL: ${url}`);
  }

  const reqUrl = toSettingUrl(urlData);
  return fetchAsText(reqUrl).then(parseSettingTxt);
}

function parseThreadRaw(text: string): Thread {
  let title = '';
  const lines = text.split('\n').slice(0, -1);
  const posts = lines.map((line) => {
    const t = line.split('<>');
    const number = parseInt(t[0], 10);
    if (number === 1) {
      title = t[5];
    }
    return {
      number,
      name: sanitizeName(t[1]),
      mail: t[2],
      date: t[3],
      message: sanitizeMessage(t[4]),
      id: t[6],
    };
  });
  return {
    title,
    posts,
  };
}

function sanitizeName(name: string): string {
  const tagsRegex = /<font color=""><\/font>|(<[^<]*>)/g;
  return name.replace(tagsRegex, (whole, unknown) => (unknown ? '' : whole));
}

function sanitizeMessage(message: string): string {
  const tagsRegex = /<a href="[^"]*" target="_blank">[^<]*<\/a>|<br>|(<[^<]*>)/g;
  return message.replace(tagsRegex, (whole, unknown) => (unknown ? '' : whole));
}

function parseSettingTxt(text: string): BoardSettings {
  return text.match(/.+/g)!.reduce(
    (map, line) => {
      const match = /([^=]+)=(.*)/.exec(line);
      if (match) {
        map[match[1]] = match[2];
      }
      return map;
    },
    {} as any,
  );
}

function fetchAsText(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = http.request(url, (res) => {
      const chunks: Buffer[] = [];

      res.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const text = encoding.convert(buffer, {
          to: 'UNICODE',
          from: 'EUCJP',
          type: 'string',
        }) as string;
        resolve(text);
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}
