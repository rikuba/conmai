import { Dispatch } from 'redux';

import { Thread, fetchThread } from '../../clients/shitaraba-client';
import { State } from '../reducers';

export type Action = ThreadOpen | ThreadFetchRequest | ThreadFetchSuccess | ThreadFetchFailure;

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
