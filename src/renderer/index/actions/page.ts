import { ThunkAction } from 'redux-thunk';
import uuid from 'uuid/v4';

import * as shitaraba from '../../../clients/shitaraba-client';
import * as cavetube from '../../../clients/cavetube';
import * as twitch from '../../../clients/twitch';
import { State, Page } from '../reducers';
import * as selectors from '../selectors';
import { closeThread } from './thread';

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
    return dispatch(openShitarabaPage(shitarabaUrl));
  }

  const cavetubeUrl = cavetube.determineUrl(url);
  if (cavetubeUrl) {
    return dispatch(openCavetubePage(cavetubeUrl));
  }

  const twitchUrl = twitch.canonicalizeUrl(url);
  if (twitchUrl) {
    return dispatch(openTwitchPage(twitchUrl));
  }

  dispatch<PageOpen>({
    type: 'PAGE_OPEN',
    url,
    pageType,
    faviconUrl,
    id: uuid(),
  });
};

const openShitarabaPage = (url: string): Dispatcher => async (dispatch) => {
  dispatch<PageOpen>({
    type: 'PAGE_OPEN',
    url,
    pageType: 'shitaraba',
    faviconUrl: shitaraba.faviconUrl,
    id: uuid(),
  });
};

const openCavetubePage = (cavetubeUrl: cavetube.CavetubeUrl): Dispatcher => async (dispatch) => {
  let { url } = cavetubeUrl;

  if (cavetubeUrl.type === 'live') {
    const chatUrl = await cavetube.fetchChatUrl(url);
    return dispatch(openPage(chatUrl));
  }

  if (cavetubeUrl.type === 'view') {
    url = cavetubeUrl.url.replace('view', 'popup');
  }

  dispatch<PageOpen>({
    type: 'PAGE_OPEN',
    url,
    pageType: 'cavetube',
    faviconUrl: cavetube.faviconUrl,
    id: uuid(),
  });
};

const openTwitchPage = (url: string): Dispatcher => async (dispatch) => {
  const chatUrl = `${url}/chat`;
  
  dispatch<PageOpen>({
    type: 'PAGE_OPEN',
    url: chatUrl,
    pageType: 'twitch',
    faviconUrl: twitch.faviconUrl,
    id: uuid(),
  });
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

export const closeAllOtherPages = (id: string): Dispatcher => async (dispatch, getState) => {
  getState().pages.all
    .filter((pageId) => pageId !== id)
    .forEach((pageId) => {
      dispatch(closePage(pageId));
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
