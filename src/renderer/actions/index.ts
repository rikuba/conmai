import { Dispatch } from 'redux';

import { Thread, fetchThread } from '../../clients/shitaraba-client';
import { State } from '../reducers';

export type Action =
  ThreadOpen |
  ThreadFetchRequest |
  ThreadFetchSuccess |
  ThreadFetchFailure |
  ThreadUpdateRequest |
  ThreadUpdateSuccess |
  ThreadUpdateFailure;

export interface ThreadOpen {
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
  return (dispatch: Dispatch<State>) => {
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

export function updateThread(url: string) {
  return (dispatch: Dispatch<State>, getState: () => State) => {
    dispatch<ThreadUpdateRequest>({
      type: 'THREAD_UPDATE_REQUEST',
      url,
    });

    const thread = getState().threads.find((thread) => thread.url === url);
    if (!thread) {
      // TODO: throw Error
      return;
    }
    const lastPost = thread.posts[thread.posts.length - 1];

    fetchThread(url, { from: lastPost.number + 1 })
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
