import { Thread as ThreadResponse } from '../../clients/shitaraba-client';
import { Action } from '../actions';

export interface Thread extends ThreadResponse {
  isFetching: boolean;
  error: Error | null;
  url: string;
  newPostNumber: number;
  updateWait: number;
  updateTimerId: number;
}

export function thread(state: Thread, action: Action): Thread {
  switch (action.type) {
    case 'THREAD_OPEN':
      return {
        isFetching: false,
        error: null,
        url: action.url,
        title: '',
        posts: [],
        newPostNumber: NaN,
        updateWait: NaN,
        updateTimerId: 0,
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
        newPostNumber: 1,
      };

    case 'THREAD_UPDATE_SUCCESS':
      var { posts } = action.thread;
      return {
        ...state,
        isFetching: false,
        posts: state.posts.concat(posts),
        newPostNumber: posts[0] ? posts[0].number : NaN,
      };

    case 'THREAD_FETCH_FAILURE':
    case 'THREAD_UPDATE_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };

    case 'THREAD_UPDATE_SCHEDULE':
      return {
        ...state,
        updateTimerId: action.timerId,
        updateWait: 0,
      };

    case 'THREAD_UPDATE_WAIT_TICK':
      return {
        ...state,
        updateWait: state.updateWait + 1,
      };

    case 'THREAD_UPDATE_SCHEDULE_CANCEL':
      return {
        ...state,
        updateTimerId: 0,
        updateWait: 0,
      };

    default:
      return state;
  }
}
