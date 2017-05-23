import URL from 'url';
import { ThunkAction } from 'redux-thunk';
import { ipcRenderer } from 'electron';

import { Thread, canonicalizeUrl, fetchThread } from '../../clients/shitaraba-client';
import { State, getUpdateIntervalPreference, getSelectedThread, getThread, getAllThreads } from '../reducers';

type Dispatcher = ThunkAction<Promise<void>, State, {}>;

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
  ThreadUpdateScheduleCancel |
  
  SubWindowOpen |
  SubWindowClose;

export interface ThreadSelect {
  type: 'THREAD_SELECT';
  url: string;
}

export function selectThread(url: string): Dispatcher {
  return (dispatch, getState) => {
    const selectedThread = getSelectedThread(getState());
    
    if (!selectedThread || selectedThread.url !== url) {
      dispatch<ThreadSelect>({
        type: 'THREAD_SELECT',
        url,
      });
    }

    return Promise.resolve();
  };
}

export interface ThreadOpen {
  type: 'THREAD_OPEN';
  url: string;
  icon: string | null;
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

export function openThread(inputUrl: string): Dispatcher {
  return (dispatch, getState) => {
    const url = canonicalizeUrl(inputUrl);
    if (!url) {
      return Promise.reject(new Error(`Unknown URL: ${inputUrl}`));
    }

    const thread = getThread(getState(), url);
    if (thread) {
      return dispatch(selectThread(url));
    }

    const urlData = URL.parse(url);
    const icon = `${urlData.protocol}//${urlData.hostname}/favicon.ico`;

    dispatch<ThreadOpen>({
      type: 'THREAD_OPEN',
      url,
      icon,
    });
    
    dispatch<ThreadFetchRequest>({
      type: 'THREAD_FETCH_REQUEST',
      url,
    });
    
    return fetchThread(url, { last: 1000 }).then(
      (thread) => {
        dispatch<ThreadFetchSuccess>({
          type: 'THREAD_FETCH_SUCCESS',
          url,
          thread,
        });
      },
      (error) => {
        dispatch<ThreadFetchFailure>({
          type: 'THREAD_FETCH_FAILURE',
          url,
          error,
        });
      }
    ).then(
      () => {
        dispatch(scheduleUpdateThread(url));
      }
    );
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

export function updateSelectedThread(): Dispatcher {
  return (dispatch, getState) => {
    const thread = getSelectedThread(getState());
    if (!thread) {
      return Promise.reject(new Error(`No thread selected`));
    }

    return dispatch(updateThread(thread.url));
  };
}

export function updateThread(url: string): Dispatcher {
  return (dispatch, getState) => {
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

    return fetchThread(url, { from }).then(
      (thread) => {
        dispatch<ThreadUpdateSuccess>({
          type: 'THREAD_UPDATE_SUCCESS',
          url,
          thread,
        });
      },
      (error) => {
        dispatch<ThreadUpdateFailure>({
          type: 'THREAD_UPDATE_FAILURE',
          url,
          error,
        });
      }
    );
  };
}

interface ThreadClose {
  type: 'THREAD_CLOSE';
  url: string;
}

export function closeThread(url: string): Dispatcher {
  return (dispatch, getState) => {
    const thread = getThread(getState(), url);
    clearInterval(thread.updateTimerId);

    dispatch<ThreadClose>({
      type: 'THREAD_CLOSE',
      url,
    });

    return Promise.resolve();
  };
}

export function closeAllOtherThreads(url: string): Dispatcher {
  return (dispatch, getState) => {
    getAllThreads(getState())
      .filter((thread) => thread.url !== url)
      .forEach((thread) => dispatch(closeThread(thread.url)));

    return Promise.resolve();
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

export function scheduleUpdateThread(url: string): Dispatcher {
  return (dispatch, getState) => {
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

    return Promise.resolve();
  };
}

export function cancelScheduledUpdateThread(url: string): Dispatcher {
  return (dispatch, getState) => {
    const thread = getThread(getState(), url);
    clearInterval(thread.updateTimerId);
    
    dispatch<ThreadUpdateScheduleCancel>({
      type: 'THREAD_UPDATE_SCHEDULE_CANCEL',
      url,
    });

    return Promise.resolve();
  };
}

export interface SubWindowOpen {
  type: 'SUB_WINDOW_OPEN';
}

export function openSubWindow(): Dispatcher {
  return (dispatch, getState) => {
    ipcRenderer.send('open-sub-window');

    dispatch<SubWindowOpen>({
      type: 'SUB_WINDOW_OPEN',
    });

    return Promise.resolve();
  };
}

export interface SubWindowClose {
  type: 'SUB_WINDOW_CLOSE';
}

export function subWindowClosed(): SubWindowClose {
  return {
    type: 'SUB_WINDOW_CLOSE',
  };
}
