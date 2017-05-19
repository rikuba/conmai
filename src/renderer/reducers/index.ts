import { combineReducers } from 'redux';

import { Post } from '../../clients/shitaraba-client';
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

export function getThread(state: State, url: string): Thread {
  return state.threads.byUrl[url];
}

export function getSelectedThread(state: State): Thread | undefined {
  const order = state.threads.selectOrder;
  return getThread(state, order[0]);
}

export function getAllThreads(state: State): Thread[] {
  return state.threads.all.map((url) => getThread(state, url));
}
