import { combineReducers } from 'redux';

import { Thread as ThreadResponse, Post } from '../../clients/shitaraba-client';
import { Action } from '../actions';
import preference, { Preference } from './preference';
import threads, { Threads } from './threads';
import { Thread } from './thread';

export interface State {
  preference: Preference;
  threads: Threads;
}

export {
  Preference,
  Post,
  Thread,
};

export default combineReducers<State>({
  preference,
  threads,
});

export function getUpdateIntervalPreference(state: State): number {
  return state.preference.updateInterval;
}

export function getSelectedThread(state: State): Thread | undefined {
  const url = state.threads.selected;
  return state.threads.byUrl[url];
}

export function getThread(state: State, url: string): Thread {
  return state.threads.byUrl[url];
}
