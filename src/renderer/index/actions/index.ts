import { ThunkAction } from 'redux-thunk';
import { ipcRenderer } from 'electron';

import { State } from '../reducers';
import * as ThreadAction from './thread';
import { Action as PageAction } from './page';

type Dispatcher = ThunkAction<Promise<void>, State, {}>;


export * from './page';

export type Action =
  ThreadAction.Action |
  PageAction |
  
  SubWindowOpen |
  SubWindowClose;


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
