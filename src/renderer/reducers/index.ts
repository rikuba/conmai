import { combineReducers } from 'redux';

import { Thread as ThreadResponse, Post } from '../../clients/shitaraba-client';
import { Action } from '../actions';

export interface State {
  threads: Threads;
}

export interface Threads {
  byUrl: {
    [url: string]: Thread;
  };
  all: string[];
  selected: string;
}

export interface Thread extends ThreadResponse {
  isFetching: boolean;
  error: Error | null;
  url: string;
}

export { Post };

function byUrl(state: Threads['byUrl'] = {}, action: Action) {
  switch (action.type) {
    case 'THREAD_OPEN':
      return {
        ...state,
        [action.url]: createThread(action),
      };

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

function createThread({ url }: { url: string }): Thread {
  return {
    isFetching: false,
    error: null,
    url,
    title: '',
    posts: [],
  };
}

function thread(state: Thread, action: Action): Thread {
  switch (action.type) {
    case 'THREAD_FETCH_REQUEST':
    case 'THREAD_UPDATE_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null,
      };

    case 'THREAD_FETCH_SUCCESS':
      var { title, posts } = action.thread;
      return {
        ...state,
        isFetching: false,
        title,
        posts,
      };

    case 'THREAD_UPDATE_SUCCESS':
      var { posts } = action.thread;
      return {
        ...state,
        isFetching: false,
        posts: state.posts.concat(posts),
      };

    case 'THREAD_FETCH_FAILURE':
    case 'THREAD_UPDATE_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };

    default:
      return state;
  }
}

const threads = combineReducers({
  byUrl,
  selected,
});

export default combineReducers({
  threads,
});

export function getSelectedThread(state: State): Thread | undefined {
  const url = state.threads.selected;
  return state.threads.byUrl[url];
}

export function getThread(state: State, url: string) {
  return state.threads.byUrl[url];
}
