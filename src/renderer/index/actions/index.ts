import URL from 'url';
import { ThunkAction } from 'redux-thunk';
import { ipcRenderer } from 'electron';

import * as shitaraba from '../../../clients/shitaraba-client';
import { State } from '../reducers';
import * as selectors from '../selectors';
import * as ThreadAction from './thread';
import { Action as PageAction } from './page';

type Dispatcher = ThunkAction<Promise<void>, State, {}>;


export * from './page';

export type Action =
  ThreadAction.Action |
  PageAction |

  ThreadOpen |
  ThreadClose |
  ThreadSelect |
  
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

    return Promise.resolve();
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
    selectors.clearThreadRelatedCache(url);

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
