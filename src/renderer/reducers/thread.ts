import { combineReducers } from 'redux';

import { Thread as ThreadResponse, Post } from '../../clients/shitaraba-client';
import { Action } from '../actions';

export interface Thread extends ThreadResponse {
  isFetching: boolean;
  error: Error | null;
  url: string;
  icon: string | null;
  threadStop: number;
  newPostNumber: number | null;
  updateWait: number;
  updateTimerId: number;
}

export default combineReducers<Thread>({
  isFetching,
  error,
  url,
  icon,
  threadStop,
  title,
  posts,
  newPostNumber,
  updateWait,
  updateTimerId,
});

function isFetching(state: boolean = false, action: Action): typeof state {
  switch (action.type) {
    case 'THREAD_OPEN':
    case 'THREAD_FETCH_SUCCESS':
    case 'THREAD_UPDATE_SUCCESS':
    case 'THREAD_FETCH_FAILURE':
    case 'THREAD_UPDATE_FAILURE':
      return false;

    case 'THREAD_FETCH_REQUEST':
    case 'THREAD_UPDATE_REQUEST':
      return true;

    default:
      return state;
  }
}

function error(state: Error | null = null, action: Action): typeof state {
  switch (action.type) {
    case 'THREAD_OPEN':
    case 'THREAD_FETCH_REQUEST':
    case 'THREAD_UPDATE_REQUEST':
      return null;

    case 'THREAD_FETCH_FAILURE':
    case 'THREAD_UPDATE_FAILURE':
      return action.error;

    default:
      return state;
  }
}

function url(state: string = '', action: Action): typeof state {
  switch (action.type) {
    case 'THREAD_OPEN':
      return action.url;

    default:
      return state;
  }
}

function icon(state: string | null = null, action: Action): typeof state {
  switch (action.type) {
    case 'THREAD_OPEN':
      return action.icon;

    default:
      return state;
  }
}

function threadStop(state: number = 1000, action: Action): typeof state {
  switch (action.type) {
    case 'THREAD_OPEN':
      return 1000;

    case 'BOARD_SETTINGS_FETCH_SUCCESS':
      console.log(action.settings.BBS_THREAD_STOP);
      return parseInt(action.settings.BBS_THREAD_STOP, 10) || 1000;

    default:
      return state;
  }
}

function title(state: string = '', action: Action): typeof state {
  switch (action.type) {
    case 'THREAD_OPEN':
      return '';

    case 'THREAD_FETCH_SUCCESS':
      // BBS_THREAD_STOP > 1000 の場合 action.thread.title が空になる
      return action.thread.title || state;

    case 'BOARD_SETTINGS_FETCH_SUCCESS':
      return action.settings.BBS_TITLE;

    default:
      return state;
  }
}

function posts(state: Post[] = [], action: Action): typeof state {
  switch (action.type) {
    case 'THREAD_OPEN':
      return [];

    case 'THREAD_FETCH_SUCCESS':
      return action.thread.posts;

    case 'THREAD_UPDATE_SUCCESS': {
      const { posts } = action.thread;
      return posts.length > 0 ? state.concat(posts) : state;
    }

    default:
      return state;
  }
}

function newPostNumber(state: number | null = null, action: Action): typeof state {
  switch (action.type) {
    case 'THREAD_OPEN':
      return null;

    case 'THREAD_FETCH_SUCCESS':
      return 1;

    case 'THREAD_UPDATE_SUCCESS': {
      const { posts } = action.thread;
      return posts[0] ? posts[0].number : null;
    }

    default:
      return state;
  }
}

function updateWait(state: number = 0, action: Action): typeof state {
  switch (action.type) {
    case 'THREAD_OPEN':
    case 'THREAD_UPDATE_SCHEDULE':
    case 'THREAD_UPDATE_SCHEDULE_CANCEL':
      return 0;
      
    case 'THREAD_UPDATE_WAIT_TICK':
      return state + 1;

    default:
      return state;
  }
}

function updateTimerId(state: number = 0, action: Action): typeof state {
  switch (action.type) {
    case 'THREAD_OPEN':
    case 'THREAD_UPDATE_SCHEDULE_CANCEL':
      return 0;

    case 'THREAD_UPDATE_SCHEDULE':
      return action.timerId;

    default:
      return state;
  }
}
