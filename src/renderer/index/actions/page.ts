import { ThunkAction } from 'redux-thunk';
import uuid from 'uuid/v4';

import { State } from '../reducers';
import { clearPageCache } from '../selectors';

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
  id: string;
}

export const openPage = (url: string): PageOpen => ({
  type: 'PAGE_OPEN',
  url,
  id: uuid(),
});


export interface PageClose {
  type: 'PAGE_CLOSE';
  id: string;
}

export const closePage = (id: string): Dispatcher => async (dispatch) => {
  clearPageCache(id);

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
