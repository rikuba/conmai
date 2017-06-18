import { combineReducers } from 'redux';

import { Action } from '../actions';

export interface Preferences {
  updateInterval: number;
  mainWindowBounds: Electron.Rectangle;
  subWindowBounds: Electron.Rectangle;
}

export default combineReducers<Preferences>({
  updateInterval,
  mainWindowBounds,
  subWindowBounds,
});

function updateInterval(state: number = 10, action: Action) {
  switch (action.type) {
    default:
      return state;
  }
}

function mainWindowBounds(state: Electron.Rectangle = {
  x: -1,
  y: -1,
  width: 600,
  height: 720,
}, action: Action): typeof state {
  switch (action.type) {
    case 'MAIN_WINDOW_CLOSED':
      return action.windowBounds;

    default:
      return state;
  }
}

function subWindowBounds(state: Electron.Rectangle = {
  x: -1,
  y: -1,
  width: 800,
  height: 400,
}, action: Action): typeof state {
  switch (action.type) {
    case 'SUB_WINDOW_CLOSED':
      return action.windowBounds;

    default:
      return state;
  }
}
