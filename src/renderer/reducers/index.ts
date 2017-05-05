import { combineReducers } from 'redux';

import { Thread as ThreadResponse, Post } from '../../clients/shitaraba-client';
import { Action } from '../actions';

export interface State {
  threads: Thread[];
}

export interface Thread extends ThreadResponse {
  isFetching: boolean;
  error: Error | null;
  url: string;
}

export { Post };

function threads(state: Thread[] = [], action: Action) {
  switch (action.type) {
    case 'THREAD_OPEN':
      return [
        ...state,
        thread(void 0, action),
      ];

    case 'THREAD_FETCH_REQUEST':
    case 'THREAD_FETCH_SUCCESS':
    case 'THREAD_FETCH_FAILURE':
    case 'THREAD_UPDATE_REQUEST':
    case 'THREAD_UPDATE_SUCCESS':
    case 'THREAD_UPDATE_FAILURE':
      return state.map((t) => {
        if (t.url !== action.url) {
          return t;
        }
        return thread(t, action);
      });

    default:
      return state;
  }
}

function thread(state: Thread | undefined, action: Action): Thread {
  switch (action.type) {
    case 'THREAD_OPEN':
      return {
        isFetching: false,
        error: null,
        url: action.url,
        title: '',
        posts: [],
      };

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
        posts: state!.posts.concat(posts),
      };

    case 'THREAD_FETCH_FAILURE':
    case 'THREAD_UPDATE_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };

    default:
      return state!;
  }
}

export default combineReducers({
  threads,
});
