import { Dispatch } from 'redux';

import { Thread, fetchThread } from '../../clients/shitaraba-client';
import { State, getSelectedThread, getThread } from '../reducers';

export type Action =
  ThreadSelect |
  ThreadOpen |
  ThreadFetchRequest |
  ThreadFetchSuccess |
  ThreadFetchFailure |
  ThreadUpdateRequest |
  ThreadUpdateSuccess |
  ThreadUpdateFailure;

interface ThreadSelect {
  type: 'THREAD_SELECT';
  url: string;
}

export function selectThread(url: string): ThreadSelect {
  return {
    type: 'THREAD_SELECT',
    url,
  };
}

interface ThreadOpen {
  type: 'THREAD_OPEN';
  url: string;
}

interface ThreadFetchRequest {
  type: 'THREAD_FETCH_REQUEST';
  url: string;
}

interface ThreadFetchSuccess {
  type: 'THREAD_FETCH_SUCCESS';
  url: string;
  thread: Thread;
}

interface ThreadFetchFailure {
  type: 'THREAD_FETCH_FAILURE';
  url: string;
  error: Error;
}

export function openThread(url: string) {
  return (dispatch: Dispatch<State>, getState: () => State) => {
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
      });
  };
}

interface ThreadUpdateRequest {
  type: 'THREAD_UPDATE_REQUEST';
  url: string;
}

interface ThreadUpdateSuccess {
  type: 'THREAD_UPDATE_SUCCESS';
  url: string;
  thread: Thread;
}

interface ThreadUpdateFailure {
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
    return updateThread(thread.url)(dispatch, getState);
  };
}

export function updateThread(url: string) {
  return (dispatch: Dispatch<State>, getState: () => State) => {
    const state = getState();

    const thread = state.threads.find((thread) => thread.url === url);
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
