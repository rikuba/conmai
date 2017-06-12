import { combineReducers } from 'redux';

import { Action } from '../actions';
import thread, { Thread } from './thread';

export interface Threads {
  byUrl: {
    [url: string]: Thread;
  };
  all: string[];
}

export default combineReducers<Threads>({
  byUrl,
  all,
});

function byUrl(state: Threads['byUrl'] = {}, action: Action): typeof state {
  switch (action.type) {
    case 'THREAD_OPEN':
    case 'THREAD_FETCH_REQUEST':
    case 'THREAD_FETCH_SUCCESS':
    case 'THREAD_FETCH_FAILURE':
    case 'THREAD_UPDATE_REQUEST':
    case 'THREAD_UPDATE_SUCCESS':
    case 'THREAD_UPDATE_FAILURE':
    case 'THREAD_UPDATE_SCHEDULE': {
      const prevThread = state[action.url];
      const nextThread = thread(prevThread, action);

      return nextThread === prevThread ? state : {
        ...state,
        [action.url]: thread(state[action.url], action),
      };
    }

    case 'BOARD_SETTINGS_FETCH_REQUEST':
    case 'BOARD_SETTINGS_FETCH_SUCCESS':
    case 'BOARD_SETTINGS_FETCH_FAILURE': {
      const prevThread = state[action.threadUrl];
      const nextThread = thread(prevThread, action);
      
      return nextThread === prevThread ? state : {
        ...state,
        [action.threadUrl]: thread(state[action.threadUrl], action),
      };
    }

    case 'THREAD_CLOSE': {
      const nextState = { ...state };
      delete nextState[action.url];
      return nextState;
    }

    default:
      return state;
  }
}

function all(state: Threads['all'] = [], action: Action): typeof state {
  switch (action.type) {
    case 'THREAD_OPEN':
      return [
        ...state,
        action.url,
      ];

    case 'THREAD_CLOSE':
      return state.filter((url) => url !== action.url);

    default:
      return state;
  }
}
