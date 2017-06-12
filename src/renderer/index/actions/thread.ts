import { ThunkAction } from 'redux-thunk';

import * as shitaraba from '../../../clients/shitaraba-client';
import { State } from '../reducers';
import * as selectors from '../selectors';
import * as pageActions from './page';

type Dispatcher = ThunkAction<Promise<void>, State, {}>;


export type Action =
  ThreadOpen |
  ThreadClose |

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
  ThreadUpdateScheduleCancel;


export interface ThreadOpen {
  type: 'THREAD_OPEN';
  url: string;
}

export const openThread = (url: string): ThreadOpen => ({
  type: 'THREAD_OPEN',
  url,
});


export interface ThreadClose {
  type: 'THREAD_CLOSE';
  url: string;
}

export function closeThread(url: string): Dispatcher {
  return (dispatch, getState) => {
    const thread = selectors.getThread(getState(), url);
    clearInterval(thread.updateTimerId);
    selectors.clearThreadRelatedCache(url);

    dispatch<ThreadClose>({
      type: 'THREAD_CLOSE',
      url,
    });

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
  return (dispatch, getState) => {
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

        selectors.getPagesByUrl(getState(), url).forEach((page) => {
          dispatch(pageActions.pageTitleUpdated(page.id, thread.title));
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

export function updateThread(url: string): Dispatcher {
  return (dispatch, getState) => {
    const state = getState();
    const thread = selectors.getThread(state, url);
    if (!thread) {
      return Promise.reject(new Error(`Thread to update not found: ${url}`));
    }
    if (thread.isFetching) {
      console.info(`Fetch action cancelled because the thread is fetching now`);
      return Promise.resolve();
    }

    const lastPost = selectors.getLastPost(state, url);
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


export interface ThreadUpdateSchedule {
  type: 'THREAD_UPDATE_SCHEDULE';
  url: string;
  timerId: any;
}

export function scheduleUpdateThread(url: string): Dispatcher {
  return (dispatch, getState) => {
    const state = getState();
    const thread = selectors.getThread(state, url);
    const lastPost = selectors.getLastPost(state, url);
    if (lastPost && lastPost.number >= thread.threadStop) {
      return Promise.resolve();
    }

    const time = selectors.getUpdateIntervalPreference(state) * 1000;
    const timerId = setTimeout(() => {
      dispatch(updateThread(url)).then(() => {
        dispatch(scheduleUpdateThread(url));
      });
    }, time);

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
