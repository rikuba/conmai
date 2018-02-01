import { ThunkAction } from 'redux-thunk';
import { ipcRenderer } from 'electron';

import { State } from '../reducers';
import { Action as PageAction } from './page';
import { Action as ThreadAction } from './thread';

type Dispatcher = ThunkAction<Promise<void>, State, {}>;

export * from './page';

export type Action = PageAction | ThreadAction | MainWindowClosed | SubWindowOpen | SubWindowClosed;

export interface MainWindowClosed {
  type: 'MAIN_WINDOW_CLOSED';
  windowBounds: Electron.Rectangle;
}

export function mainWindowClosed(windowBounds: Electron.Rectangle): MainWindowClosed {
  return {
    type: 'MAIN_WINDOW_CLOSED',
    windowBounds,
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

export interface SubWindowClosed {
  type: 'SUB_WINDOW_CLOSED';
  windowBounds: Electron.Rectangle;
}

export function subWindowClosed(windowBounds: Electron.Rectangle): SubWindowClosed {
  return {
    type: 'SUB_WINDOW_CLOSED',
    windowBounds,
  };
}
