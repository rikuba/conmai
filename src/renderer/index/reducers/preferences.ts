import { Action } from '../actions';
import { Reducer } from 'redux';

export type Preferences = {
  updateInterval: number;
  mainWindowBounds: Electron.Rectangle;
  subWindowBounds: Electron.Rectangle;
};

const preferences: Reducer<Preferences> = (
  state = {
    updateInterval: 10,
    mainWindowBounds: {
      x: -1,
      y: -1,
      width: 600,
      height: 720,
    },
    subWindowBounds: {
      x: -1,
      y: -1,
      width: 800,
      height: 400,
    },
  },
  action: Action,
) => {
  switch (action.type) {
    case 'MAIN_WINDOW_CLOSED':
      return {
        ...state,
        mainWindowBounds: action.windowBounds,
      };

    case 'SUB_WINDOW_CLOSED':
      return {
        ...state,
        subWindowBounds: action.windowBounds,
      };

    default:
      return state;
  }
};

export default preferences;
