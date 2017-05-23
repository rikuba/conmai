import { State, Thread } from '../reducers';

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
