import { combineReducers } from 'redux';

import { Thread as ThreadResponse, Post } from '../../clients/shitaraba-client';
import { Action } from '../actions';
import threads, { Threads } from './threads';
import { Thread } from './thread';

export interface State {
  threads: Threads;
}

export {
  Post,
  Thread,
};

export default combineReducers<State>({
  threads,
});

export function getSelectedThread(state: State): Thread | undefined {
  const url = state.threads.selected;
  return state.threads.byUrl[url];
}

export function getThread(state: State, url: string): Thread {
  return state.threads.byUrl[url];
}
