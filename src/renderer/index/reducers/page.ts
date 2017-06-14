import { combineReducers } from 'redux';

import { Action } from '../actions';


export interface Page {
  id: string;
  url: string;
  pageType: 'cavetube' | 'shitaraba' | 'unknown';
  title: string;
  faviconUrl: string;
}

export default combineReducers<Page>({
  id,
  url,
  pageType,
  title,
  faviconUrl,
});


function id(state: Page['id'] = '', action: Action): typeof state {
  switch (action.type) {
    case 'PAGE_OPEN':
      return action.id;

    default:
      return state;
  }
}

function url(state: Page['url'] = '', action: Action): typeof state {
  switch (action.type) {
    case 'PAGE_OPEN':
      return action.url;

    default:
      return state;
  }
}

function pageType(state: Page['pageType'] = 'unknown', action: Action): typeof state {
  switch (action.type) {
    case 'PAGE_OPEN':
      return action.pageType;

    default:
      return state;
  }
}

function title(state: Page['title'] = '', action: Action): typeof state {
  switch (action.type) {
    case 'PAGE_OPEN':
      return action.url;

    case 'PAGE_TITLE_UPDATED':
      return action.title;

    default:
      return state;
  }
}

function faviconUrl(state: Page['faviconUrl'] = '', action: Action): typeof state {
  switch (action.type) {
    case 'PAGE_OPEN':
      return action.faviconUrl || state;

    case 'PAGE_FAVICON_UPDATED':
      return action.faviconUrl;

    default:
      return state;
  }
}
