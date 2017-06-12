import { ThunkAction } from 'redux-thunk';
import uuid from 'uuid/v4';

import * as shitaraba from '../../../clients/shitaraba-client';
import { State, Page } from '../reducers';
import * as selectors from '../selectors';
import { openThread, closeThread } from './thread';

type Dispatcher = ThunkAction<Promise<void>, State, {}>;


export type Action =
  PageOpen |
  PageClose |
  PageSelect |

  PageTitleUpdated |
  PageFaviconUpdated;


export interface PageOpen {
  type: 'PAGE_OPEN';
  url: string;
  pageType: Page['pageType'];
  faviconUrl?: string;
  id: string;
}

export const openPage = (url: string): Dispatcher => async (dispatch) => {
  let pageType: Page['pageType'] = 'unknown';
  let faviconUrl: PageOpen['faviconUrl'] = void 0;

  const shitarabaUrl = shitaraba.canonicalizeUrl(url);
  if (shitarabaUrl) {
    url = shitarabaUrl;
    pageType = 'shitaraba';
    faviconUrl = 'http://jbbs.shitaraba.net/favicon.ico';
  }

  dispatch<PageOpen>({
    type: 'PAGE_OPEN',
    url,
    pageType,
    faviconUrl,
    id: uuid(),
  });

  if (pageType === 'shitaraba') {
    dispatch(openThread(url));
  }
};


export interface PageClose {
  type: 'PAGE_CLOSE';
  id: string;
}

export const closePage = (id: string): Dispatcher => async (dispatch, getState) => {
  selectors.clearPageCache(id);

  const page: Page = selectors.getPage(getState(), id);
  if (page.pageType === 'shitaraba') {
    dispatch(closeThread(page.url));
  }

  dispatch<PageClose>({
    type: 'PAGE_CLOSE',
    id,
  });
};


export interface PageSelect {
  type: 'PAGE_SELECT';
  id: string;
}

export const selectPage = (id: string): PageSelect => ({
  type: 'PAGE_SELECT',
  id,
});


export interface PageTitleUpdated {
  type: 'PAGE_TITLE_UPDATED';
  id: string,
  title: string,
}

export const pageTitleUpdated = (id: string, title: string): PageTitleUpdated => ({
  type: 'PAGE_TITLE_UPDATED',
  id,
  title,
});


export interface PageFaviconUpdated {
  type: 'PAGE_FAVICON_UPDATED';
  id: string;
  faviconUrl: string;
}

export const pageFaviconUpdated = (id: string, faviconUrl: string): PageFaviconUpdated => ({
  type: 'PAGE_FAVICON_UPDATED',
  id,
  faviconUrl,
});
