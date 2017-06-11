import { combineReducers } from 'redux';

import { Action } from '../actions';


export interface Page {
  id: string;
  url: string;
  title: string;
  faviconUrl: string;
}

export default combineReducers<Page>({
  id,
  url,
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

function title(state: Page['title'] = '', action: Action): typeof state {
  switch (action.type) {
    case 'PAGE_TITLE_UPDATED':
      return action.title;

    default:
      return state;
  }
}

function faviconUrl(state: Page['faviconUrl'] = '', action: Action): typeof state {
  switch (action.type) {
    case 'PAGE_FAVICON_UPDATED':
      return action.faviconUrl;

    default:
      return state;
  }
}
