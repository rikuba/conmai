import { combineReducers } from 'redux';

import { Action } from '../actions';
import page, { Page } from './page';


export interface Pages {
  byId: {
    [id: string]: Page;
  };
  all: string[];
  selectOrder: string[];
}

export default combineReducers<Pages>({
  byId,
  all,
  selectOrder,
});


function byId(state: Pages['byId'] = {}, action: Action): typeof state {
  switch (action.type) {
    case 'PAGE_OPEN':
    case 'PAGE_TITLE_UPDATED':
    case 'PAGE_FAVICON_UPDATED':
      return {
        ...state,
        [action.id]: page(state[action.id], action),
      };

    case 'PAGE_CLOSE': {
      const nextState = { ...state };
      delete nextState[action.id];
      return nextState;
    }

    default:
      return state;
  }
}

function all(state: Pages['all'] = [], action: Action): typeof state {
  switch (action.type) {
    case 'PAGE_OPEN':
      return state.concat(action.id);

    case 'PAGE_CLOSE':
      return state.filter((id) => id !== action.id);

    default:
      return state;
  }
}

function selectOrder(state: Pages['selectOrder'] = [], action: Action): typeof state {
  switch (action.type) {
    case 'PAGE_OPEN':
      return [action.id].concat(state);

    case 'PAGE_SELECT':
      return [action.id].concat(state.filter((id) => id !== action.id));

    case 'PAGE_CLOSE':
      return state.filter((id) => id !== action.id);

    default:
      return state;
  }
}
