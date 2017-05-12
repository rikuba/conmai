import { Dispatch } from 'redux';

import { Thread, canonicalizeUrl, fetchThread } from '../../clients/shitaraba-client';
import { State, getUpdateIntervalPreference, getSelectedThread, getThread } from '../reducers';

export type Action =
  ThreadSelect |
  ThreadOpen |
  ThreadClose |

  ThreadFetchRequest |
  ThreadFetchSuccess |
  ThreadFetchFailure |

  ThreadUpdateRequest |
  ThreadUpdateSuccess |
  ThreadUpdateFailure |
  
  ThreadUpdateSchedule |
  ThreadUpdateWaitTick |
  ThreadUpdateScheduleCancel;

export interface ThreadSelect {
  type: 'THREAD_SELECT';
  url: string;
}

export function selectThread(url: string): ThreadSelect {
  return {
    type: 'THREAD_SELECT',
    url,
  };
}

export interface ThreadOpen {
  type: 'THREAD_OPEN';
  url: string;
}

export interface ThreadFetchRequest {
  type: 'THREAD_FETCH_REQUEST';
  url: string;
}

export interface ThreadFetchSuccess {
  type: 'THREAD_FETCH_SUCCESS';
  url: string;
  thread: Thread;
}

export interface ThreadFetchFailure {
  type: 'THREAD_FETCH_FAILURE';
  url: string;
  error: Error;
}

export function openThread(inputUrl: string) {
  return (dispatch: Dispatch<State>, getState: () => State) => {
    const url = canonicalizeUrl(inputUrl);
    if (!url) {
      throw new Error(`Unknown URL: ${inputUrl}`);
    }

    const thread = getThread(getState(), url);

    if (thread) {
      dispatch(selectThread(url));
      return Promise.resolve();
    }

    dispatch<ThreadOpen>({
      type: 'THREAD_OPEN',
      url,
    });
    
    dispatch<ThreadFetchRequest>({
      type: 'THREAD_FETCH_REQUEST',
      url,
    });
    
    return fetchThread(url)
      .then((thread) => {
        dispatch<ThreadFetchSuccess>({
          type: 'THREAD_FETCH_SUCCESS',
          url,
          thread,
        });
      })
      .catch((error) => {
        dispatch<ThreadFetchFailure>({
          type: 'THREAD_FETCH_FAILURE',
          url,
          error,
        });
      })
      .then(() => {
        dispatch(scheduleUpdateThread(url));
      });
  };
}

export interface ThreadUpdateRequest {
  type: 'THREAD_UPDATE_REQUEST';
  url: string;
}

export interface ThreadUpdateSuccess {
  type: 'THREAD_UPDATE_SUCCESS';
  url: string;
  thread: Thread;
}

export interface ThreadUpdateFailure {
  type: 'THREAD_UPDATE_FAILURE';
  url: string;
  error: Error;
}

export function updateSelectedThread() {
  return (dispatch: Dispatch<State>, getState: () => State) => {
    const thread = getSelectedThread(getState());
    if (!thread) {
      return Promise.reject(new Error(`No thread selected`));
    }
    return dispatch(updateThread(thread.url));
  };
}

export function updateThread(url: string) {
  return (dispatch: Dispatch<State>, getState: () => State) => {
    const thread = getThread(getState(), url);
    if (!thread) {
      return Promise.reject(new Error(`Thread to update not found: ${url}`));
    }
    if (thread.isFetching) {
      console.info(`Fetch action cancelled because the thread is fetching now`);
      return Promise.resolve();
    }

    const lastPost = thread.posts[thread.posts.length - 1];
    const from = lastPost ? lastPost.number + 1 : 1;

    dispatch<ThreadUpdateRequest>({
      type: 'THREAD_UPDATE_REQUEST',
      url,
    });

    return fetchThread(url, { from })
      .then((thread) => {
        dispatch<ThreadUpdateSuccess>({
          type: 'THREAD_UPDATE_SUCCESS',
          url,
          thread,
        });
      })
      .catch((error) => {
        dispatch<ThreadUpdateFailure>({
          type: 'THREAD_UPDATE_FAILURE',
          url,
          error,
        });
      });
  };
}

export interface ThreadUpdateSchedule {
  type: 'THREAD_UPDATE_SCHEDULE';
  url: string;
  timerId: any;
}

export interface ThreadUpdateWaitTick {
  type: 'THREAD_UPDATE_WAIT_TICK';
  url: string;
}

export interface ThreadUpdateScheduleCancel {
  type: 'THREAD_UPDATE_SCHEDULE_CANCEL';
  url: string;
}

export function tickUpdateThreadWait(url: string): ThreadUpdateWaitTick {
  return {
    type: 'THREAD_UPDATE_WAIT_TICK',
    url,
  };
}

export function scheduleUpdateThread(url: string) {
  return (dispatch: Dispatch<State>, getState: () => State) => {
    const timerId = setInterval(() => {
      dispatch(tickUpdateThreadWait(url));

      const interval = getUpdateIntervalPreference(getState());
      const wait = getThread(getState(), url).updateWait;
      if (wait >= interval) {
        clearInterval(timerId);
        dispatch(updateThread(url)).then(() => {
          dispatch(scheduleUpdateThread(url));
        });
      }
    }, 1000);

    dispatch<ThreadUpdateSchedule>({
      type: 'THREAD_UPDATE_SCHEDULE',
      url,
      timerId,
    });
  };
}

export function cancelScheduledUpdateThread(url: string) {
  return (dispatch: Dispatch<State>, getState: () => State) => {
    const thread = getThread(getState(), url);
    clearInterval(thread.updateTimerId);
    
    dispatch<ThreadUpdateScheduleCancel>({
      type: 'THREAD_UPDATE_SCHEDULE_CANCEL',
      url,
    });
  };
}

interface ThreadClose {
  type: 'THREAD_CLOSE';
  url: string;
}

export function closeThread(url: string) {
  return (dispatch: Dispatch<State>, getState: () => State) => {
    const thread = getThread(getState(), url);
    clearInterval(thread.updateTimerId);

    dispatch<ThreadClose>({
      type: 'THREAD_CLOSE',
      url,
    });
  };
}
