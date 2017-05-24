import URL from 'url';
import { ThunkAction } from 'redux-thunk';
import { ipcRenderer } from 'electron';

import * as shitaraba from '../../clients/shitaraba-client';
import { State } from '../reducers';
import * as selectors from '../selectors';

type Dispatcher = ThunkAction<Promise<void>, State, {}>;


export type Action =
  ThreadOpen |
  ThreadClose |
  ThreadSelect |

  BoardSettingsFetchRequest |
  BoardSettingsFetchSuccess |
  BoardSettingsFetchFailure |

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


export interface ThreadOpen {
  type: 'THREAD_OPEN';
  url: string;
  icon: string | null;
}

export function openThread(inputUrl: string): Dispatcher {
  return (dispatch, getState) => {
    const url = shitaraba.canonicalizeUrl(inputUrl);
    if (!url) {
      return Promise.reject(new Error(`Unknown URL: ${inputUrl}`));
    }

    const thread = selectors.getThread(getState(), url);
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

    return dispatch(fetchBoardSettings(url))
      .then(() => dispatch(fetchThread(url)));
  };
}


export interface ThreadClose {
  type: 'THREAD_CLOSE';
  url: string;
}

export function closeThread(url: string): Dispatcher {
  return (dispatch, getState) => {
    const thread = selectors.getThread(getState(), url);
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
    selectors.getAllThreads(getState())
      .filter((thread) => thread.url !== url)
      .forEach((thread) => dispatch(closeThread(thread.url)));

    return Promise.resolve();
  };
}


export interface ThreadSelect {
  type: 'THREAD_SELECT';
  url: string;
}

export function selectThread(url: string): Dispatcher {
  return (dispatch, getState) => {
    const selectedThread = selectors.getSelectedThread(getState());
    
    if (!selectedThread || selectedThread.url !== url) {
      dispatch<ThreadSelect>({
        type: 'THREAD_SELECT',
        url,
      });
    }

    return Promise.resolve();
  };
}


export interface BoardSettingsFetchRequest {
  type: 'BOARD_SETTINGS_FETCH_REQUEST';
  threadUrl: string;
}

export interface BoardSettingsFetchSuccess {
  type: 'BOARD_SETTINGS_FETCH_SUCCESS';
  threadUrl: string;
  settings: shitaraba.BoardSettings;
}

export interface BoardSettingsFetchFailure {
  type: 'BOARD_SETTINGS_FETCH_FAILURE';
  threadUrl: string;
  error: Error;
}

export function fetchBoardSettings(url: string): Dispatcher {
  return (dispatch) => {
    dispatch<BoardSettingsFetchRequest>({
      type: 'BOARD_SETTINGS_FETCH_REQUEST',
      threadUrl: url,
    });

    return shitaraba.fetchSettings(url).then(
      (settings) => {
        dispatch<BoardSettingsFetchSuccess>({
          type: 'BOARD_SETTINGS_FETCH_SUCCESS',
          threadUrl: url,
          settings,
        });
      },
      (error) => {
        dispatch<BoardSettingsFetchFailure>({
          type: 'BOARD_SETTINGS_FETCH_FAILURE',
          threadUrl: url,
          error,
        });
      }
    );
  };
}


export interface ThreadFetchRequest {
  type: 'THREAD_FETCH_REQUEST';
  url: string;
}

export interface ThreadFetchSuccess {
  type: 'THREAD_FETCH_SUCCESS';
  url: string;
  thread: shitaraba.Thread;
}

export interface ThreadFetchFailure {
  type: 'THREAD_FETCH_FAILURE';
  url: string;
  error: Error;
}

export function fetchThread(url: string): Dispatcher {
  return (dispatch) => {
    dispatch<ThreadFetchRequest>({
      type: 'THREAD_FETCH_REQUEST',
      url,
    });

    return shitaraba.fetchThread(url, { last: 1000 }).then(
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
  thread: shitaraba.Thread;
}

export interface ThreadUpdateFailure {
  type: 'THREAD_UPDATE_FAILURE';
  url: string;
  error: Error;
}

export function updateSelectedThread(): Dispatcher {
  return (dispatch, getState) => {
    const thread = selectors.getSelectedThread(getState());
    if (!thread) {
      return Promise.reject(new Error(`No thread selected`));
    }

    return dispatch(updateThread(thread.url));
  };
}

export function updateThread(url: string): Dispatcher {
  return (dispatch, getState) => {
    const thread = selectors.getThread(getState(), url);
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

    return shitaraba.fetchThread(url, { from }).then(
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


export interface ThreadUpdateWaitTick {
  type: 'THREAD_UPDATE_WAIT_TICK';
  url: string;
}

export function tickUpdateThreadWait(url: string): ThreadUpdateWaitTick {
  return {
    type: 'THREAD_UPDATE_WAIT_TICK',
    url,
  };
}


export interface ThreadUpdateSchedule {
  type: 'THREAD_UPDATE_SCHEDULE';
  url: string;
  timerId: any;
}

export function scheduleUpdateThread(url: string): Dispatcher {
  return (dispatch, getState) => {
    const state = getState();
    const thread = selectors.getThread(state, url);
    const lastPost = thread.posts[thread.posts.length - 1];
    if (lastPost.number >= thread.threadStop) {
      return Promise.resolve();
    }

    const interval = selectors.getUpdateIntervalPreference(state);
    let wait = 0;

    const timerId = setInterval(() => {
      dispatch(tickUpdateThreadWait(url));

      if (++wait >= interval) {
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


export interface ThreadUpdateScheduleCancel {
  type: 'THREAD_UPDATE_SCHEDULE_CANCEL';
  url: string;
}

export function cancelScheduledUpdateThread(url: string): Dispatcher {
  return (dispatch, getState) => {
    const thread = selectors.getThread(getState(), url);
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
  return (dispatch) => {
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
