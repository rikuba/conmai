import { combineReducers } from 'redux';

import { Thread as ThreadResponse, Post } from '../../clients/shitaraba-client';
import { Action } from '../actions';
import preferences, { Preferences } from './preferences';
import threads, { Threads } from './threads';
import { Thread } from './thread';

export interface State {
  preferences: Preferences;
  threads: Threads;
}

export {
  Preferences,
  Post,
  Thread,
};

export default combineReducers<State>({
  preferences,
  threads,
});

export function getUpdateIntervalPreference(state: State): number {
  return state.preferences.updateInterval;
}

export function getSelectedThread(state: State): Thread | undefined {
  const url = state.threads.selected;
  return state.threads.byUrl[url];
}

export function getThread(state: State, url: string): Thread {
  return state.threads.byUrl[url];
}
