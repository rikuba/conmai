import { combineReducers } from 'redux';

import { Action } from '../actions';
import { Thread, thread } from './thread';

export interface Threads {
  byUrl: {
    [url: string]: Thread;
  };
  all: string[];
  selected: string;
}

export default combineReducers({
  byUrl,
  all,
  selected,
});

function byUrl(state: Threads['byUrl'] = {}, action: Action) {
  switch (action.type) {
    case 'THREAD_OPEN':
    case 'THREAD_FETCH_REQUEST':
    case 'THREAD_FETCH_SUCCESS':
    case 'THREAD_FETCH_FAILURE':
    case 'THREAD_UPDATE_REQUEST':
    case 'THREAD_UPDATE_SUCCESS':
    case 'THREAD_UPDATE_FAILURE':
      return {
        ...state,
        [action.url]: thread(state[action.url], action),
      };

    default:
      return state;
  }
}

function all(state: string[] = [], action: Action) {
  switch (action.type) {
    case 'THREAD_OPEN':
      return [
        ...state,
        action.url,
      ];

    default:
      return state;
  }
}

function selected(state: string = '', action: Action) {
  switch (action.type) {
    case 'THREAD_OPEN':
    case 'THREAD_SELECT':
      return action.url;

    default:
      return state;
  }
}
