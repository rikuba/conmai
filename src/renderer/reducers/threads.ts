import { combineReducers } from 'redux';

import { Action } from '../actions';
import thread, { Thread } from './thread';

export interface Threads {
  byUrl: {
    [url: string]: Thread;
  };
  all: string[];
  selectOrder: string[];
}

export default combineReducers<Threads>({
  byUrl,
  all,
  selectOrder,
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
    case 'THREAD_UPDATE_SCHEDULE':
    case 'THREAD_UPDATE_WAIT_TICK':
      return {
        ...state,
        [action.url]: thread(state[action.url], action),
      };

    case 'BOARD_SETTINGS_FETCH_REQUEST':
    case 'BOARD_SETTINGS_FETCH_SUCCESS':
    case 'BOARD_SETTINGS_FETCH_FAILURE':
      return {
        ...state,
        [action.threadUrl]: thread(state[action.threadUrl], action),
      };

    case 'THREAD_CLOSE':
      const nextState = { ...state };
      delete nextState[action.url];
      return nextState;

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

function selectOrder(state: Threads['selectOrder'] = [], action: Action): typeof state {
  switch (action.type) {
    case 'THREAD_OPEN':
      return [action.url].concat(state);

    case 'THREAD_SELECT':
      return state[0] === action.url ? state :
        [action.url].concat(state.filter((url) => url !== action.url));

    case 'THREAD_CLOSE':
      return state.filter((url) => url !== action.url);

    default:
      return state;
  }
}
